"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { eventSchema, type EventInput } from "@/lib/validations/event";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateApplySlug } from "@/lib/utils";
import { getUserPlan } from "@/lib/plan";
import { recordApiUsage } from "@/lib/api-usage";
import { getSupabaseUrl } from "@/lib/supabase/config";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type ActionResult = { error?: string; eventId?: string } | undefined;

export async function createEvent(data: EventInput, organizationId?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // If creating under an organization, ensure user is owner, admin, or event_manager
  const targetOrgId: string | undefined = organizationId;
  if (targetOrgId) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", targetOrgId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();

    if (!member) {
      // Check via admin client to avoid client RLS false-positives
      let isAuthorized = false;
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const admin = adminClient();
        const { data: adminMember } = await admin
          .from("organization_members")
          .select("role")
          .eq("organization_id", targetOrgId)
          .eq("user_id", user.id)
          .eq("status", "active")
          .in("role", ["owner", "admin", "event_manager"])
          .maybeSingle();
        isAuthorized = !!adminMember;
      }
      if (!isAuthorized) {
        return { error: "You are not authorized to create events for this organization." };
      }
    }
  }

  // Generate a unique slug — retry once on collision (vanishingly rare)
  let apply_slug = generateApplySlug();
  const { count: slugExists } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("apply_slug", apply_slug);
  if ((slugExists ?? 0) > 0) apply_slug = generateApplySlug();

  // If not a paid event, ensure ticket_price is 0
  const { workspace_id, location_id, ...baseFields } = parsed.data;

  const eventData: Record<string, unknown> = {
    name: baseFields.name.trim(),
    description: baseFields.description || null,
    event_date: baseFields.event_date,
    start_time: baseFields.start_time,
    end_time: baseFields.end_time,
    venue: baseFields.venue?.trim() || (baseFields.event_type === "online" ? "Online" : "Main Venue"),
    event_type: baseFields.event_type || "physical",
    attendee_limit: baseFields.attendee_limit,
    status: baseFields.status || "draft",
    application_enabled: baseFields.application_enabled !== false,
    auto_approve: !!baseFields.auto_approve,
    is_paid_event: !!baseFields.is_paid_event,
    ticket_price: baseFields.is_paid_event ? baseFields.ticket_price : 0,
    organizer_id: user.id,
    apply_slug,
  };

  if (baseFields.meeting_url) eventData.meeting_url = baseFields.meeting_url;
  if (baseFields.meeting_platform) eventData.meeting_platform = baseFields.meeting_platform;
  if (targetOrgId) eventData.organization_id = targetOrgId;
  if (workspace_id) eventData.workspace_id = workspace_id;
  if (location_id) eventData.location_id = location_id;

  let event: { id: string; attendee_limit: number } | null = null;
  const { data: insertedEvent, error } = await supabase
    .from("events")
    .insert(eventData)
    .select("id, attendee_limit")
    .single();

  if (error) {
    // If client RLS failed or schema cache missing optional columns, retry with admin client
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = adminClient();
      if (error.message?.includes("workspace_id") || error.message?.includes("location_id")) {
        delete eventData.workspace_id;
        delete eventData.location_id;
      }
      const { data: adminEvent, error: adminErr } = await admin
        .from("events")
        .insert(eventData)
        .select("id, attendee_limit")
        .single();
      if (adminErr) {
        if (adminErr.message?.includes("workspace_id") || adminErr.message?.includes("location_id")) {
          delete eventData.workspace_id;
          delete eventData.location_id;
          const { data: fallbackEvent, error: fallbackErr } = await admin
            .from("events")
            .insert(eventData)
            .select("id, attendee_limit")
            .single();
          if (fallbackErr) return { error: fallbackErr.message };
          event = fallbackEvent;
        } else {
          return { error: adminErr.message };
        }
      } else {
        event = adminEvent;
      }
    } else {
      return { error: error.message };
    }
  } else {
    event = insertedEvent;
  }

  if (!event) {
    return { error: "Failed to create event." };
  }

  const { error: ttError } = await supabase.from("ticket_types").insert({
    event_id: event.id,
    name: "General Admission",
    description: parsed.data.is_paid_event ? "Standard event ticket" : "Standard registration",
    category: "general",
    price: parsed.data.is_paid_event ? Math.round(parsed.data.ticket_price * 100) : 0,
    capacity: event.attendee_limit,
    max_per_person: 1,
    status: "on_sale",
    position: 0,
  });

  if (ttError && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = adminClient();
    await admin.from("ticket_types").insert({
      event_id: event.id,
      name: "General Admission",
      description: parsed.data.is_paid_event ? "Standard event ticket" : "Standard registration",
      category: "general",
      price: parsed.data.is_paid_event ? Math.round(parsed.data.ticket_price * 100) : 0,
      capacity: event.attendee_limit,
      max_per_person: 1,
      status: "on_sale",
      position: 0,
    });
  }

  void recordApiUsage(user.id, "events", 1);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
  return { eventId: event.id };
}

export async function updateEvent(
  eventId: string,
  data: EventInput
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Verify access: user is creator or an owner/admin/event_manager in the org
  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) return { error: "Event not found." };

  let isAuthorized = event.organizer_id === user.id;
  if (!isAuthorized && event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .single();
    isAuthorized = !!member;
  }

  if (!isAuthorized) {
    return { error: "You are not authorized to update this event." };
  }

  const { workspace_id, location_id, ...baseUpdateFields } = parsed.data;
  const updatePayload: Record<string, unknown> = {
    name: baseUpdateFields.name,
    description: baseUpdateFields.description || null,
    event_date: baseUpdateFields.event_date,
    start_time: baseUpdateFields.start_time,
    end_time: baseUpdateFields.end_time,
    venue: baseUpdateFields.venue,
    event_type: baseUpdateFields.event_type,
    attendee_limit: baseUpdateFields.attendee_limit,
    status: baseUpdateFields.status,
    application_enabled: baseUpdateFields.application_enabled,
    auto_approve: baseUpdateFields.auto_approve,
    is_paid_event: baseUpdateFields.is_paid_event,
    ticket_price: baseUpdateFields.is_paid_event ? baseUpdateFields.ticket_price : 0,
  };
  if (baseUpdateFields.meeting_url !== undefined) updatePayload.meeting_url = baseUpdateFields.meeting_url;
  if (baseUpdateFields.meeting_platform !== undefined) updatePayload.meeting_platform = baseUpdateFields.meeting_platform;
  if (workspace_id) updatePayload.workspace_id = workspace_id;
  if (location_id) updatePayload.location_id = location_id;

  const { error } = await supabase
    .from("events")
    .update(updatePayload)
    .eq("id", eventId);

  if (error) {
    if (error.message?.includes("workspace_id") || error.message?.includes("location_id")) {
      delete updatePayload.workspace_id;
      delete updatePayload.location_id;
      const { error: retryError } = await supabase
        .from("events")
        .update(updatePayload)
        .eq("id", eventId);
      if (retryError) return { error: retryError.message };
    } else {
      return { error: error.message };
    }
  }

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath("/dashboard/events");
}

export async function updateEventStatus(
  eventId: string,
  status: "draft" | "active" | "completed" | "cancelled"
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) return { error: "Event not found." };

  let isAuthorized = event.organizer_id === user.id;
  if (!isAuthorized && event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .single();
    isAuthorized = !!member;
  }

  if (!isAuthorized) {
    return { error: "You are not authorized to update this event." };
  }

  // Enforce events-per-month limit at publish time, not at draft creation.
  if (status === "active") {
    const ownerId = event.organizer_id || user.id;
    const [plan, { data: sub }] = await Promise.all([
      getUserPlan(supabase, ownerId),
      supabase
        .from("subscriptions")
        .select("current_period_start")
        .eq("user_id", ownerId)
        .single(),
    ]);

    const eventsLimit = plan.getLimit("events_per_month");

    if (eventsLimit < 999_999) {
      const periodStart = sub?.current_period_start
        ? new Date(sub.current_period_start)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

      const { count: publishedThisPeriod } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("organizer_id", ownerId)
        .eq("status", "active")
        .neq("id", eventId)
        .gte("created_at", periodStart.toISOString());

      if ((publishedThisPeriod ?? 0) >= eventsLimit) {
        // Check if the user has an available one-event pass to use instead
        const { data: availablePass } = await supabase
          .from("event_passes")
          .select("id, pass_type, registration_limit")
          .eq("user_id", ownerId)
          .eq("status", "available")
          .order("purchased_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (availablePass) {
          // Auto-attach the oldest available pass to this event
          const admin = adminClient();
          await Promise.all([
            admin
              .from("event_passes")
              .update({ status: "attached", event_id: eventId, attached_at: new Date().toISOString() })
              .eq("id", availablePass.id),
            admin
              .from("events")
              .update({ event_pass_id: availablePass.id })
              .eq("id", eventId),
          ]);
          // Fall through — allow the event to be published using the pass
        } else {
          return {
            error: `You've published ${eventsLimit} event${eventsLimit === 1 ? "" : "s"} this month — the limit on your ${plan.slug} plan. Upgrade your plan or buy a one-event pass to continue.`,
          };
        }
      }
    }
  }

  const { error } = await supabase
    .from("events")
    .update({ status })
    .eq("id", eventId);

  if (error) return { error: error.message };

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard");
}

export async function deleteEvent(eventId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) return { error: "Event not found." };

  let isAuthorized = event.organizer_id === user.id;
  if (!isAuthorized && event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin"])
      .single();
    isAuthorized = !!member;
  }

  if (!isAuthorized) {
    return { error: "You are not authorized to delete this event." };
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
  redirect("/dashboard/events");
}
