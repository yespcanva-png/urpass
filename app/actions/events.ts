"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { eventSchema, type EventInput } from "@/lib/validations/event";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateApplySlug } from "@/lib/utils";
import { getUserPlan } from "@/lib/plan";
import { recordApiUsage } from "@/lib/api-usage";

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type ActionResult = { error: string } | undefined;

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

  // Generate a unique slug — retry once on collision (vanishingly rare)
  let apply_slug = generateApplySlug();
  const { count: slugExists } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("apply_slug", apply_slug);
  if ((slugExists ?? 0) > 0) apply_slug = generateApplySlug();

  // If not a paid event, ensure ticket_price is 0
  const eventData = {
    ...parsed.data,
    ticket_price: parsed.data.is_paid_event ? parsed.data.ticket_price : 0,
    organizer_id: user.id,
    apply_slug,
    ...(organizationId ? { organization_id: organizationId } : {}),
  };

  const { data: event, error } = await supabase
    .from("events")
    .insert(eventData)
    .select("id, attendee_limit")
    .single();

  if (error) return { error: error.message };

  await supabase.from("ticket_types").insert({
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

  void recordApiUsage(user.id, "events", 1);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
  redirect(`/event/${event.id}`);
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

  const { error } = await supabase
    .from("events")
    .update(parsed.data)
    .eq("id", eventId)
    .eq("organizer_id", user.id);

  if (error) return { error: error.message };

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

  // Enforce events-per-month limit at publish time, not at draft creation.
  if (status === "active") {
    const [plan, { data: sub }] = await Promise.all([
      getUserPlan(supabase, user.id),
      supabase
        .from("subscriptions")
        .select("current_period_start")
        .eq("user_id", user.id)
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
        .eq("organizer_id", user.id)
        .eq("status", "active")
        .neq("id", eventId)
        .gte("created_at", periodStart.toISOString());

      if ((publishedThisPeriod ?? 0) >= eventsLimit) {
        // Check if the user has an available one-event pass to use instead
        const { data: availablePass } = await supabase
          .from("event_passes")
          .select("id, pass_type, registration_limit")
          .eq("user_id", user.id)
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
    .eq("id", eventId)
    .eq("organizer_id", user.id);

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

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("organizer_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
  redirect("/dashboard/events");
}
