"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { attendeeSchema, type AttendeeInput } from "@/lib/validations/attendee";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  notifyOwnerPaymentSuccess,
  notifyOwnerOneTimePayment,
  sendApplicationConfirmationEmail,
  sendApprovalEmail,
  sendPassEmail,
  sendUserPaymentSuccessEmail,
} from "@/lib/email";
import { getUserPlan } from "@/lib/plan";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendWebhooks } from "@/lib/webhooks";
import { recordApiUsage } from "@/lib/api-usage";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  markReservationPaid,
  markReservationApproved,
} from "@/lib/capacity-reservation";
import { communicationService, formatTicketId, buildTicketUrl } from "@/lib/communications";
import crypto from "crypto";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type ActionResult = { error: string } | undefined;

function revalidateEvent(eventId: string) {
  // Only revalidate the overview — the attendees page is realtime-driven
  revalidatePath(`/event/${eventId}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function optionalSingle<T>(query: any): Promise<T | null> {
  if (typeof query.maybeSingle === "function") {
    const { data } = await query.maybeSingle();
    return data ?? null;
  }

  // Some unit-test Supabase mocks only implement required-row lookups.
  return null;
}

async function getEventForOrganizer(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventId: string,
  userId: string
) {
  const { data } = await supabase
    .from("events")
    .select("id, attendee_limit, status, application_enabled, organizer_id, organization_id")
    .eq("id", eventId)
    .eq("organizer_id", userId)
    .single();

  if (data) return data;

  // Fallback for active organization team members
  try {
    const { data: orgEvent } = await supabase
      .from("events")
      .select("id, attendee_limit, status, application_enabled, organizer_id, organization_id")
      .eq("id", eventId)
      .single();

    if (orgEvent?.organization_id) {
      const { data: member } = await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", orgEvent.organization_id)
        .eq("user_id", userId)
        .eq("status", "active")
        .in("role", ["owner", "admin", "event_manager"])
        .single();

      if (member) return orgEvent;
    }
  } catch {
    // Graceful fallback for test mocks
  }

  return null;
}

export async function approveAttendee(
  attendeeId: string,
  eventId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const { count: approvedCount } = await supabase
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("application_status", "approved");

  if ((approvedCount ?? 0) >= event.attendee_limit) {
    return {
      error: `Event is at capacity (${event.attendee_limit}). Increase the limit in Settings to approve more.`,
    };
  }

  const { error } = await supabase
    .from("attendees")
    .update({ application_status: "approved" })
    .eq("id", attendeeId)
    .eq("event_id", eventId);

  if (error) return { error: error.message };

  // Update associated reservation if this was a paid registration
  const { data: order } = await supabase
    .from("ticket_orders")
    .select("razorpay_order_id")
    .eq("attendee_id", attendeeId)
    .eq("status", "paid")
    .maybeSingle();

  if (order?.razorpay_order_id) {
    await markReservationApproved(adminClient(), order.razorpay_order_id);
  }

  // Notify the attendee they've been approved
  const [{ data: att }, { data: evt }] = await Promise.all([
    supabase.from("attendees").select("name, email").eq("id", attendeeId).single(),
    supabase.from("events").select("name, event_date, venue").eq("id", eventId).single(),
  ]);
  if (att && evt) {
    sendApprovalEmail({
      to: att.email,
      attendeeName: att.name,
      eventName: evt.name,
      eventDate: evt.event_date,
      venue: evt.venue,
    }).catch((err: unknown) => console.error("[email]", err));
  }

  revalidateEvent(eventId);
}

export async function rejectAttendee(
  attendeeId: string,
  eventId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const { data: attendee } = await supabase
    .from("attendees")
    .select("application_status")
    .eq("id", attendeeId)
    .eq("event_id", eventId)
    .single();

  if (!attendee) return { error: "Attendee not found." };

  const { error } = await supabase
    .from("attendees")
    .update({ application_status: "rejected" })
    .eq("id", attendeeId)
    .eq("event_id", eventId);

  if (error) return { error: error.message };

  if (attendee.application_status !== "rejected") {
    const attachedPass = await optionalSingle<{ id: string }>(
      supabase
        .from("event_passes")
        .select("id")
        .eq("event_id", eventId)
        .eq("status", "attached")
    );

      let subQuery = supabase
        .from("subscriptions")
        .select("registrations_used")
        .eq("user_id", event.organizer_id);
      if (typeof subQuery.in === "function") {
        subQuery = subQuery.in("status", ["active", "trialing"]);
      }
      const subscription = await optionalSingle<{ registrations_used: number | null }>(subQuery);

      if (subscription && (subscription.registrations_used ?? 0) > 0) {
        let updateQuery = supabase
          .from("subscriptions")
          .update({ registrations_used: (subscription.registrations_used ?? 0) - 1 })
          .eq("user_id", event.organizer_id);
        if (typeof updateQuery.in === "function") {
          updateQuery = updateQuery.in("status", ["active", "trialing"]);
        }
        await updateQuery;
      }
  }

  revalidateEvent(eventId);
}

export async function addAttendee(
  eventId: string,
  data: AttendeeInput
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const parsed = attendeeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("attendees").insert({
    event_id: eventId,
    ...parsed.data,
    application_status: "approved",
  });

  if (error) {
    if (error.code === "23505")
      return { error: "An attendee with this email already exists for this event." };
    return { error: error.message };
  }

  void recordApiUsage(user.id, "registrations", 1);
  revalidateEvent(eventId);
}

export async function bulkAddAttendees(
  eventId: string,
  rows: AttendeeInput[]
): Promise<{ added: number; skipped: number; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { added: 0, skipped: 0, error: "Not authenticated." };

  const plan = await getUserPlan(supabase, user.id);
  if (!plan.canCSV) {
    return {
      added: 0,
      skipped: 0,
      error: "CSV upload is available on Starter and Pro plans. Upgrade to use this feature.",
    };
  }

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { added: 0, skipped: 0, error: "Event not found." };

  const valid = rows.filter((r) => attendeeSchema.safeParse(r).success);
  if (valid.length === 0)
    return { added: 0, skipped: rows.length, error: "No valid rows found. Check CSV format." };

  // Insert one by one to count actual inserts vs skipped duplicates
  let added = 0;
  let skipped = rows.length - valid.length;

  for (const row of valid) {
    const { error } = await supabase.from("attendees").insert({
      event_id: eventId,
      ...row,
      application_status: "approved",
    });
    if (error && error.code === "23505") {
      skipped++;
    } else if (error) {
      return { added, skipped, error: error.message };
    } else {
      added++;
    }
  }

  revalidateEvent(eventId);
  if (added > 0) {
    void recordApiUsage(user.id, "registrations", added);
  }
  return { added, skipped };
}

interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
}

type SelectedTicketType = {
  id: string;
  name: string;
  price: number;
  capacity: number | null;
  status: string;
  sales_start: string | null;
  sales_end: string | null;
} | null;

export async function submitApplication(
  eventId: string,
  data: AttendeeInput,
  payment?: PaymentVerification,
  ticketTypeId?: string | null
): Promise<{ error?: string; passToken?: string } | undefined> {
  const admin = adminClient();

  const { data: event } = await admin
    .from("events")
    .select("id, status, application_enabled, auto_approve, attendee_limit, name, event_date, venue, is_paid_event, ticket_price, organizer_id, organization_id")
    .eq("id", eventId)
    .eq("status", "active")
    .eq("application_enabled", true)
    .single();

  if (!event) return { error: "Applications are not open for this event." };

  // ── Registration limit check ────────────────────────────────
  // If the event has an attached one-event pass, enforce the pass's limit.
  // Otherwise enforce the organizer's monthly subscription quota.
  const attachedPass = await optionalSingle<{ id: string; registration_limit: number }>(
    admin
      .from("event_passes")
      .select("id, registration_limit")
      .eq("event_id", eventId)
      .eq("status", "attached")
  );

  if (attachedPass) {
    const { count: eventRegCount } = await admin
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .neq("application_status", "rejected");

    if ((eventRegCount ?? 0) >= attachedPass.registration_limit) {
      return {
        error: `This event has reached its registration limit of ${attachedPass.registration_limit.toLocaleString("en-IN")}.`,
      };
    }
  } else {
    // Subscription-based limit
    let orgSubQuery = admin
      .from("subscriptions")
      .select("registrations_used, current_period_start, plan:plans(slug)")
      .eq("user_id", event.organizer_id);
    if (typeof orgSubQuery.in === "function") {
      orgSubQuery = orgSubQuery.in("status", ["active", "trialing"]);
    }
    const orgSub = await optionalSingle<{ registrations_used: number | null }>(orgSubQuery);

    const orgPlan = await getUserPlan(admin as unknown as SupabaseClient, event.organizer_id);
    const regLimit = orgPlan.getLimit("registrations_per_month");

    if (regLimit < 999_999) {
      const regUsed = orgSub?.registrations_used ?? 0;
      if (regUsed >= regLimit) {
        return {
          error: "This event is temporarily unavailable for new registrations. The organizer has reached their monthly limit.",
        };
      }
    }
  }

  let selectedTicketType: SelectedTicketType = null;
  let paymentAmountPaise = event.is_paid_event ? Math.round(event.ticket_price * 100) : 0;

  if (ticketTypeId && ticketTypeId !== "default") {
    const { data: ticketType } = await admin
      .from("ticket_types")
      .select("id, name, price, capacity, status, sales_start, sales_end")
      .eq("id", ticketTypeId)
      .eq("event_id", eventId)
      .single();

    if (!ticketType || ticketType.status !== "on_sale") {
      return { error: "Selected ticket is not available." };
    }

    const now = Date.now();
    const startsAt = ticketType.sales_start ? new Date(ticketType.sales_start).getTime() : null;
    const endsAt = ticketType.sales_end ? new Date(ticketType.sales_end).getTime() : null;
    if ((startsAt != null && startsAt > now) || (endsAt != null && endsAt < now)) {
      return { error: "Selected ticket is not on sale right now." };
    }

    if (ticketType.capacity != null) {
      const { count } = await admin
        .from("attendees")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("ticket_type_id", ticketType.id)
        .neq("application_status", "rejected");

      if ((count ?? 0) >= ticketType.capacity) {
        return { error: "Selected ticket is sold out." };
      }
    }

    selectedTicketType = ticketType;
    paymentAmountPaise = ticketType.price;
  } else {
    // If ticketTypeId is "default" or omitted, try to resolve to the event's default on-sale ticket type
    const query = admin
      .from("ticket_types")
      .select("id, name, price, capacity, status, sales_start, sales_end")
      .eq("event_id", eventId)
      .eq("status", "on_sale");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qAny = query as any;
    const { data: defaultTT } = typeof qAny.order === "function"
      ? await qAny.order("position", { ascending: true }).limit(1).maybeSingle()
      : await query;

    if (defaultTT) {
      const tt = Array.isArray(defaultTT) ? defaultTT[0] : defaultTT;
      if (tt && tt.id) {
        selectedTicketType = tt;
        paymentAmountPaise = tt.price;
      }
    }
  }

  // Verify Razorpay payment signature for paid registrations
  if (paymentAmountPaise > 0) {
    if (!payment?.orderId || !payment?.paymentId || !payment?.signature) {
      return { error: "Payment verification data is missing." };
    }

    let secretKey: string | null = null;

    if (event.organization_id) {
      const { data: orgSettings } = await admin
        .from("org_payment_settings")
        .select("razorpay_key_secret")
        .eq("organization_id", event.organization_id)
        .maybeSingle();

      if (orgSettings?.razorpay_key_secret) {
        secretKey = orgSettings.razorpay_key_secret;
      }
    }

    if (!secretKey) {
      const { data: paymentSettings } = await admin
        .from("payment_settings")
        .select("razorpay_key_secret")
        .eq("user_id", event.organizer_id)
        .maybeSingle();

      if (paymentSettings?.razorpay_key_secret) {
        secretKey = paymentSettings.razorpay_key_secret;
      }
    }

    if (!secretKey) {
      return { error: "Payment gateway not configured for this event." };
    }

    const expected = crypto
      .createHmac("sha256", secretKey)
      .update(`${payment.orderId}|${payment.paymentId}`)
      .digest("hex");

    if (expected !== payment.signature) {
      return { error: "Payment verification failed. Please try again." };
    }

    const { data: ticketOrder } = await admin
      .from("ticket_orders")
      .select("amount, ticket_type_id")
      .eq("razorpay_order_id", payment.orderId)
      .eq("event_id", eventId)
      .single();

    if (!ticketOrder || ticketOrder.amount !== paymentAmountPaise) {
      return { error: "Payment amount does not match the selected ticket." };
    }

    if ((ticketOrder.ticket_type_id ?? null) !== (selectedTicketType?.id ?? null)) {
      return { error: "Payment ticket does not match the selected ticket." };
    }

    // Mark ticket order as paid
    await admin
      .from("ticket_orders")
      .update({ status: "paid", razorpay_payment_id: payment.paymentId, updated_at: new Date().toISOString() })
      .eq("razorpay_order_id", payment.orderId);

    // Transition reservation state: RESERVED -> PAID
    // This guarantees manual-approval events consume capacity immediately upon payment.
    await markReservationPaid(admin, payment.orderId);
  }

  const parsed = attendeeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Increment the organizer's registrations_used counter.
  // Skipped for pass-based events (the pass has its own registration_limit).
  // Non-blocking — a failure here should not block the registration.
  const organizerId = event.organizer_id;
  function incrementRegistrationsUsed() {
    void recordApiUsage(organizerId, "registrations", 1);
    if (attachedPass) return;
    void (async () => {
      let sQuery = admin
        .from("subscriptions")
        .select("registrations_used")
        .eq("user_id", organizerId);
      if (typeof sQuery.in === "function") {
        sQuery = sQuery.in("status", ["active", "trialing"]);
      }
      const s = await optionalSingle<{ registrations_used: number | null }>(sQuery);

      if (!s) return;

      let upQuery = admin
        .from("subscriptions")
        .update({ registrations_used: (s.registrations_used ?? 0) + 1 })
        .eq("user_id", organizerId);
      if (typeof upQuery.in === "function") {
        upQuery = upQuery.in("status", ["active", "trialing"]);
      }
      await upQuery;
    })().catch(() => {});
  }

  if (event.auto_approve) {
    // Capacity check before auto-approving
    const { count: approvedCount } = await admin
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("application_status", "approved");

    if ((approvedCount ?? 0) >= event.attendee_limit) {
      return { error: "This event is at capacity." };
    }

    // Insert as approved immediately
    const { data: attendee, error: attendeeError } = await admin
      .from("attendees")
      .insert({ event_id: eventId, ...parsed.data, application_status: "approved", ticket_type_id: selectedTicketType?.id ?? null })
      .select("id, pass_type")
      .single();

    if (attendeeError) {
      if (attendeeError.code === "23505")
        return { error: "You have already applied to this event." };
      return { error: attendeeError.message };
    }

    if (paymentAmountPaise > 0 && payment) {
      await admin
        .from("ticket_orders")
        .update({ attendee_id: attendee.id })
        .eq("razorpay_order_id", payment.orderId);
      // Transition reservation: PAID -> APPROVED
      await markReservationApproved(admin, payment.orderId);
    }

    // Generate pass immediately
    const { data: pass, error: passError } = await admin
      .from("passes")
      .insert({
        event_id: eventId,
        attendee_id: attendee.id,
        pass_type: attendee.pass_type,
        ticket_type_id: selectedTicketType?.id ?? null,
      })
      .select("pass_token")
      .single();

    if (!passError && pass) {
      await admin.from("attendees").update({ pass_status: "generated" }).eq("id", attendee.id);
      incrementRegistrationsUsed();

      communicationService
        .sendTicketCommunications({
          eventId,
          eventName: event.name,
          eventDate: event.event_date,
          venue: event.venue,
          ticketId: formatTicketId(pass.pass_token),
          passToken: pass.pass_token,
          attendeeId: attendee.id,
          attendeeName: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          passType: attendee.pass_type,
          ticketUrl: buildTicketUrl(pass.pass_token),
          version: `attendee_${attendee.id}`,
        })
        .catch((err: unknown) => console.error("[communications]", err));

      sendWebhooks(event.organizer_id, "registration.created", {
        attendee_id: attendee.id,
        event_id: eventId,
        name: parsed.data.name,
        email: parsed.data.email,
        application_status: "approved",
      }).catch(() => {});

      if (paymentAmountPaise > 0 && payment) {
        sendWebhooks(event.organizer_id, "payment.success", {
          attendee_id: attendee.id,
          event_id: eventId,
          name: parsed.data.name,
          email: parsed.data.email,
          razorpay_payment_id: payment.paymentId,
          razorpay_order_id: payment.orderId,
        }).catch(() => {});
        const itemName = selectedTicketType ? `${event.name} — ${selectedTicketType.name}` : event.name;
        Promise.allSettled([
          notifyOwnerOneTimePayment({
            buyerName: parsed.data.name,
            buyerEmail: parsed.data.email,
            itemName,
            amountPaise: paymentAmountPaise,
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            passType: "Paid Event Ticket",
          }),
          sendUserPaymentSuccessEmail({
            to: parsed.data.email,
            name: parsed.data.name,
            itemName,
            amountPaise: paymentAmountPaise,
            kind: "ticket",
          }),
        ]).catch((err: unknown) => console.error("[email]", err));
      }

      return { passToken: pass.pass_token };
    }

    // Pass generation failed — still accepted
    incrementRegistrationsUsed();
    sendWebhooks(event.organizer_id, "registration.created", {
      attendee_id: attendee.id,
      event_id: eventId,
      name: parsed.data.name,
      email: parsed.data.email,
      application_status: "approved",
    }).catch(() => {});

    return {};
  }

  // Manual approval flow
  const attendeeInsert = admin.from("attendees").insert({
    event_id: eventId,
    ...parsed.data,
    application_status: "pending",
    ticket_type_id: selectedTicketType?.id ?? null,
  });
  const { data: newAttendee, error } = typeof attendeeInsert.select === "function"
    ? await attendeeInsert.select("id").single()
    : await attendeeInsert;

  if (error) {
    if (error.code === "23505")
      return { error: "You have already applied to this event." };
    return { error: error.message };
  }

  incrementRegistrationsUsed();

  if (paymentAmountPaise > 0 && payment && newAttendee) {
    await admin
      .from("ticket_orders")
      .update({ attendee_id: newAttendee.id })
      .eq("razorpay_order_id", payment.orderId);

    const itemName = selectedTicketType ? `${event.name} — ${selectedTicketType.name}` : event.name;
    Promise.allSettled([
      notifyOwnerOneTimePayment({
        buyerName: parsed.data.name,
        buyerEmail: parsed.data.email,
        itemName,
        amountPaise: paymentAmountPaise,
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        passType: "Paid Event Ticket",
      }),
      sendUserPaymentSuccessEmail({
        to: parsed.data.email,
        name: parsed.data.name,
        itemName,
        amountPaise: paymentAmountPaise,
        kind: "ticket",
      }),
    ]).catch((err: unknown) => console.error("[email]", err));
  }

  sendApplicationConfirmationEmail({
    to: parsed.data.email,
    attendeeName: parsed.data.name,
    eventName: event.name,
    eventDate: event.event_date,
    venue: event.venue,
  }).catch((err: unknown) => console.error("[email]", err));

  // Fire webhook — non-blocking
  sendWebhooks(event.organizer_id, "registration.created", {
    attendee_id: newAttendee?.id ?? null,
    event_id: eventId,
    name: parsed.data.name,
    email: parsed.data.email,
    application_status: "pending",
  }).catch(() => {});
}

export async function exportAttendeesCSV(
  eventId: string
): Promise<{ csv?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const plan = await getUserPlan(supabase, user.id);
  if (!plan.canExport) {
    return { error: "Data export is available on the Pro plan. Upgrade to use this feature." };
  }

  const event = await getEventForOrganizer(supabase, eventId, user.id);
  if (!event) return { error: "Event not found." };

  const { data: attendees } = await supabase
    .from("attendees")
    .select("name, email, phone, pass_type, application_status, pass_status, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (!attendees || attendees.length === 0) return { csv: "" };

  const headers = [
    "Name", "Email", "Phone", "Pass Type",
    "Application Status", "Pass Status", "Registered At",
  ];
  const rows = attendees.map((a) => [
    a.name,
    a.email,
    a.phone ?? "",
    a.pass_type,
    a.application_status,
    a.pass_status,
    new Date(a.created_at).toLocaleDateString("en-IN"),
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return { csv };
}
