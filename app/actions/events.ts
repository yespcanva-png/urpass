"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { eventSchema, type EventInput } from "@/lib/validations/event";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateApplySlug, slugify } from "@/lib/utils";
import { getUserPlan } from "@/lib/plan";
import { recordApiUsage } from "@/lib/api-usage";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordLiveOpsEvent } from "@/lib/ops/events";
import { validateEventPreflightReadiness } from "@/lib/events/preflight";
import type { CustomFieldDefinition } from "@/types";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function findAvailableEventSlug(
  supabaseClient: ReturnType<typeof adminClient> | Awaited<ReturnType<typeof createClient>>,
  desiredSlugOrName: string,
  excludeEventId?: string
): Promise<string> {
  const cleanBase = slugify(desiredSlugOrName) || "event";
  let candidate = cleanBase;
  let counter = 1;

  while (true) {
    let query = supabaseClient
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("apply_slug", candidate);

    if (excludeEventId) {
      query = query.neq("id", excludeEventId);
    }

    const { count } = await query;
    if (!count || count === 0) {
      return candidate;
    }

    counter++;
    if (counter <= 5) {
      candidate = `${cleanBase}-${counter}`;
    } else {
      const randomCode = Math.random().toString(36).slice(2, 6);
      candidate = `${cleanBase}-${randomCode}`;
    }
  }
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

  const { workspace_id, location_id, ...baseFields } = parsed.data;

  // Auto-generate clean, SEO-friendly event URL slug (or use custom requested slug)
  const desiredSlug = baseFields.custom_slug?.trim() || baseFields.name;
  const apply_slug = await findAvailableEventSlug(supabase, desiredSlug);

  // If not a paid event, ensure ticket_price is 0

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
    currency: baseFields.currency || "INR",
    timezone: baseFields.timezone || "Asia/Kolkata",
    organizer_id: user.id,
    apply_slug,
  };

  if (baseFields.meeting_url) eventData.meeting_url = baseFields.meeting_url;
  if (baseFields.meeting_platform) eventData.meeting_platform = baseFields.meeting_platform;
  if (targetOrgId) eventData.organization_id = targetOrgId;
  if (workspace_id) eventData.workspace_id = workspace_id;
  if (location_id) eventData.location_id = location_id;

  const cleanImages = (baseFields.event_images || [])
    .filter((img) => typeof img === "string" && img.trim().length > 0)
    .slice(0, 4);
  if (cleanImages.length > 0) {
    eventData.custom_pass_design = { event_images: cleanImages };
  }

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
      if (error.message?.includes("currency") || error.message?.includes("timezone")) {
        delete eventData.currency;
        delete eventData.timezone;
      }
      const { data: adminEvent, error: adminErr } = await admin
        .from("events")
        .insert(eventData)
        .select("id, attendee_limit")
        .single();
      if (adminErr) {
        if (adminErr.message?.includes("workspace_id") || adminErr.message?.includes("location_id") || adminErr.message?.includes("currency") || adminErr.message?.includes("timezone")) {
          delete eventData.workspace_id;
          delete eventData.location_id;
          delete eventData.currency;
          delete eventData.timezone;
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
  try {
    recordLiveOpsEvent({
      level: "SUCCESS",
      category: "EVENT",
      message: `New event created: "${baseFields.name}" (${baseFields.venue || "Venue"}) by organiser [${user.id.slice(0, 8)}]`,
      details: { eventId: event.id, name: baseFields.name, venue: baseFields.venue, organizerId: user.id },
    });
  } catch {
    // Ops log non-blocking
  }
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

  // Cross-field validation: capacity cannot be lowered below already confirmed/sold attendees
  if (parsed.data.attendee_limit !== undefined) {
    const { count: confirmedCount } = await supabase
      .from("attendees")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .in("application_status", ["approved"]);

    if (confirmedCount && parsed.data.attendee_limit < confirmedCount) {
      return {
        error: `Capacity cannot be set below ${confirmedCount} (number of confirmed attendees/tickets already sold).`,
      };
    }
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

  try {
    recordLiveOpsEvent({
      level: "INFO",
      category: "EVENT",
      message: `Event updated: "${baseUpdateFields.name || eventId}" [Status: ${baseUpdateFields.status || "active"}]`,
      details: { eventId, name: baseUpdateFields.name, status: baseUpdateFields.status },
    });
  } catch {
    // Ops log non-blocking
  }

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath("/dashboard/events");
}

export async function updateEventImagesAction(
  eventId: string,
  images: string[]
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id, custom_pass_design, apply_slug")
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
      .maybeSingle();
    isAuthorized = !!member;
  }

  if (!isAuthorized) {
    return { error: "You are not authorized to update this event." };
  }

  const cleanImages = (images || [])
    .filter((img) => typeof img === "string" && img.trim().length > 0)
    .slice(0, 4);

  const currentDesign = (event.custom_pass_design as Record<string, unknown>) || {};
  const updatedDesign = {
    ...currentDesign,
    event_images: cleanImages,
  };

  const { error } = await supabase
    .from("events")
    .update({ custom_pass_design: updatedDesign })
    .eq("id", eventId);

  if (error) {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = adminClient();
      const { error: adminErr } = await admin
        .from("events")
        .update({ custom_pass_design: updatedDesign })
        .eq("id", eventId);
      if (adminErr) return { error: adminErr.message };
    } else {
      return { error: error.message };
    }
  }

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath(`/apply/${eventId}`);
  if (event.apply_slug) {
    revalidatePath(`/apply/${event.apply_slug}`);
  }
  return { eventId };
}

export async function updateEventSlugAction(
  eventId: string,
  newSlug: string
): Promise<{ error?: string; slug?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, apply_slug")
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
      .maybeSingle();
    isAuthorized = !!member;
  }

  if (!isAuthorized) {
    return { error: "You are not authorized to update this event URL." };
  }

  const cleanSlug = slugify(newSlug);
  if (!cleanSlug || cleanSlug.length < 2) {
    return { error: "Event URL slug must be at least 2 characters long." };
  }
  if (cleanSlug.length > 80) {
    return { error: "Event URL slug cannot exceed 80 characters." };
  }

  // Check format: letters, numbers, and hyphens only
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
    return { error: "Event URL slug can only contain lowercase letters, numbers, and hyphens." };
  }

  // Check if taken by another event
  const { data: existing } = await supabase
    .from("events")
    .select("id")
    .eq("apply_slug", cleanSlug)
    .neq("id", eventId)
    .maybeSingle();

  if (existing) {
    return { error: `The URL "/events/${cleanSlug}" is already taken by another event. Please choose a different URL.` };
  }

  const oldSlug = event.apply_slug;
  const { error } = await supabase
    .from("events")
    .update({ apply_slug: cleanSlug, updated_at: new Date().toISOString() })
    .eq("id", eventId);

  if (error) {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = adminClient();
      const { error: adminErr } = await admin
        .from("events")
        .update({ apply_slug: cleanSlug, updated_at: new Date().toISOString() })
        .eq("id", eventId);
      if (adminErr) return { error: adminErr.message };
    } else {
      return { error: error.message };
    }
  }

  try {
    recordLiveOpsEvent({
      level: "INFO",
      category: "EVENT",
      message: `Event URL updated: "${event.name}" -> /events/${cleanSlug}`,
      details: { eventId, oldSlug, newSlug: cleanSlug },
    });
  } catch {
    // Ops log non-blocking
  }

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath(`/apply/${cleanSlug}`);
  revalidatePath(`/events/${cleanSlug}`);
  revalidatePath(`/e/${cleanSlug}`);
  if (oldSlug) {
    revalidatePath(`/apply/${oldSlug}`);
    revalidatePath(`/events/${oldSlug}`);
    revalidatePath(`/e/${oldSlug}`);
  }
  revalidatePath("/dashboard/events");

  return { success: true, slug: cleanSlug };
}

export async function updateEventCustomFields(
  eventId: string,
  customFields: CustomFieldDefinition[]
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
      .maybeSingle();
    isAuthorized = !!member;
  }

  if (!isAuthorized) {
    return { error: "You are not authorized to update this event." };
  }

  // Check plan limits
  const plan = await getUserPlan(supabase, user.id);
  const maxCustomFields = plan.getLimit("custom_fields");
  if (customFields.length > maxCustomFields) {
    return {
      error: `Your current plan allows up to ${maxCustomFields} custom field${maxCustomFields === 1 ? "" : "s"}. Upgrade to add more.`,
    };
  }

  // Validate fields
  for (const f of customFields) {
    if (!f.label || f.label.trim().length === 0) {
      return { error: "Field label cannot be empty." };
    }
    if (f.type === "select" && (!f.options || f.options.filter((o) => o.trim().length > 0).length === 0)) {
      return { error: `Dropdown field "${f.label}" must have at least one option.` };
    }
  }

  const sanitized = customFields.map((f, idx) => ({
    id: f.id?.trim() || `field_${Date.now()}_${idx}`,
    label: f.label.trim(),
    type: f.type,
    placeholder: f.placeholder?.trim() || undefined,
    required: !!f.required,
    options: f.type === "select" ? (f.options ?? []).map((o) => o.trim()).filter(Boolean) : undefined,
  }));

  const { error } = await supabase
    .from("events")
    .update({ custom_fields: sanitized })
    .eq("id", eventId);

  if (error) return { error: error.message };

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath(`/apply/${eventId}`);
  return { eventId };
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
    .select("id, organizer_id, organization_id, status")
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

  // Enforce events-per-month limit and pre-flight readiness at publish time
  if (status === "active") {
    // 1. Pre-flight readiness check before publishing event to public
    const preflight = await validateEventPreflightReadiness(eventId, supabase);
    if (!preflight.ready && preflight.errors.length > 0) {
      return {
        error: `Pre-flight readiness check failed before publishing:\n• ${preflight.errors.map((e) => e.message).join("\n• ")}`,
      };
    }

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

  if (event.organization_id) {
    const { recordEnterpriseAudit } = await import("@/lib/audit/enterprise-audit");
    void recordEnterpriseAudit({
      organizationId: event.organization_id,
      eventId: event.id,
      userId: user.id,
      actorEmail: user.email,
      action: `EVENT_STATUS_${status.toUpperCase()}`,
      resourceType: "event",
      resourceId: event.id,
      oldValues: { status: event.status },
      newValues: { status },
      details: {
        previousStatus: event.status,
        newStatus: status,
      },
    });
  }

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

export async function duplicateEvent(
  eventId: string
): Promise<{ newEventId?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: source } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (!source) return { error: "Source event not found." };

  let isAuthorized = source.organizer_id === user.id;
  if (!isAuthorized && source.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", source.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .single();
    isAuthorized = !!member;
  }

  if (!isAuthorized) {
    return { error: "You are not authorized to duplicate this event." };
  }

  const newName = `${source.name} (Copy)`;
  const apply_slug = await findAvailableEventSlug(supabase, newName);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const insertPayload: Record<string, unknown> = {
    organizer_id: user.id,
    organization_id: source.organization_id ?? null,
    name: newName,
    description: source.description ?? null,
    venue: source.venue ?? "Main Venue",
    event_date: tomorrow,
    start_time: source.start_time ?? "10:00",
    end_time: source.end_time ?? "12:00",
    attendee_limit: source.attendee_limit ?? 100,
    status: "draft",
    application_enabled: source.application_enabled !== false,
    auto_approve: !!source.auto_approve,
    waitlist_enabled: source.waitlist_enabled ?? true,
    is_paid_event: !!source.is_paid_event,
    ticket_price: source.ticket_price ?? 0,
    currency: source.currency || "INR",
    timezone: source.timezone || "Asia/Kolkata",
    event_type: source.event_type || "physical",
    meeting_url: source.meeting_url ?? null,
    meeting_platform: source.meeting_platform ?? null,
    custom_fields: source.custom_fields ?? [],
    apply_slug,
  };

  const { data: newEvent, error } = await supabase
    .from("events")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error || !newEvent) {
    return { error: error?.message || "Failed to create duplicated event." };
  }

  // Clone ticket types if any exist
  const { data: sourceTicketTypes } = await supabase
    .from("ticket_types")
    .select("name, description, category, price, capacity, max_per_person, position, status")
    .eq("event_id", eventId);

  if (sourceTicketTypes && sourceTicketTypes.length > 0) {
    const ticketTypeInserts = sourceTicketTypes.map((tt) => ({
      ...tt,
      event_id: newEvent.id,
    }));
    await supabase.from("ticket_types").insert(ticketTypeInserts);
  }

  void recordApiUsage(user.id, "events", 1);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
  return { newEventId: newEvent.id };
}

export async function updateEventPhoto(
  eventId: string,
  photoUrl: string,
  type: "banner" | "logo" = "banner"
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const column = type === "logo" ? "logo_url" : "banner_url";

  const { error } = await supabase
    .from("events")
    .update({
      [column]: photoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/events");
  revalidatePath(`/event/${eventId}`);
  return { success: true };
}

export async function updateDashboardBanner(
  bannerUrl: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const { getSupabaseUrl } = await import("@/lib/supabase/config");
  const admin = createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const existingMeta = user.user_metadata || {};
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...existingMeta,
      events_dashboard_banner: bannerUrl,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/events");
  return { success: true };
}

