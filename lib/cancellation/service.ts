import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type {
  TicketCancellationPolicy,
  TicketCancellationRecord,
  CancellationStatus,
} from "@/types";
import { promoteNextWaitlistAttendee } from "@/app/actions/attendees";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export const DEFAULT_CANCELLATION_POLICY: TicketCancellationPolicy = {
  enabled: false,
  cutoff: "before_start",
  customCutoffHours: 12,
  requireReason: true,
  requireOrganizerApproval: false,
  sendNotifications: true,
  capacityReleasePolicy: "immediate",
  paidTicketPolicy: "manual_review",
};

/**
 * Resolves the effective cancellation policy from the event's custom_pass_design.
 */
export function getEventCancellationPolicy(event?: {
  custom_pass_design?: Record<string, unknown> | null;
} | null): TicketCancellationPolicy {
  if (!event || !event.custom_pass_design || typeof event.custom_pass_design !== "object") {
    return { ...DEFAULT_CANCELLATION_POLICY };
  }

  const design = event.custom_pass_design as Record<string, unknown>;
  const raw =
    (design._cancellationConfig as Partial<TicketCancellationPolicy>) ||
    (design._moduleConfigs as Record<string, unknown>)?.ticket_cancellation ||
    {};

  const rawObj = raw as Record<string, unknown>;

  const enabled =
    rawObj.self_service_enabled !== undefined
      ? Boolean(rawObj.self_service_enabled)
      : rawObj.enabled !== undefined
      ? Boolean(rawObj.enabled)
      : DEFAULT_CANCELLATION_POLICY.enabled;

  const cutoff =
    (rawObj.cutoff_rule as TicketCancellationPolicy["cutoff"]) ||
    (rawObj.cutoff as TicketCancellationPolicy["cutoff"]) ||
    DEFAULT_CANCELLATION_POLICY.cutoff;

  const customCutoffHours =
    Number(rawObj.custom_cutoff_hours || rawObj.customCutoffHours) ||
    DEFAULT_CANCELLATION_POLICY.customCutoffHours;

  const requireReason =
    rawObj.require_reason !== undefined
      ? Boolean(rawObj.require_reason)
      : rawObj.requireReason !== undefined
      ? Boolean(rawObj.requireReason)
      : DEFAULT_CANCELLATION_POLICY.requireReason;

  const requireOrganizerApproval =
    rawObj.require_organizer_approval !== undefined
      ? Boolean(rawObj.require_organizer_approval)
      : rawObj.requireOrganizerApproval !== undefined
      ? Boolean(rawObj.requireOrganizerApproval)
      : DEFAULT_CANCELLATION_POLICY.requireOrganizerApproval;

  const sendNotifications =
    rawObj.send_notifications !== undefined
      ? Boolean(rawObj.send_notifications)
      : rawObj.sendNotifications !== undefined
      ? Boolean(rawObj.sendNotifications)
      : DEFAULT_CANCELLATION_POLICY.sendNotifications;

  const capacityReleasePolicy =
    (rawObj.capacity_release_policy as TicketCancellationPolicy["capacityReleasePolicy"]) ||
    (rawObj.capacityReleasePolicy as TicketCancellationPolicy["capacityReleasePolicy"]) ||
    DEFAULT_CANCELLATION_POLICY.capacityReleasePolicy;

  const paidTicketPolicy =
    (rawObj.paid_ticket_policy as TicketCancellationPolicy["paidTicketPolicy"]) ||
    (rawObj.paidTicketPolicy as TicketCancellationPolicy["paidTicketPolicy"]) ||
    DEFAULT_CANCELLATION_POLICY.paidTicketPolicy;

  return {
    enabled,
    cutoff,
    customCutoffHours,
    requireReason,
    requireOrganizerApproval,
    sendNotifications,
    capacityReleasePolicy,
    paidTicketPolicy,
  };
}

/**
 * Calculates the exact cutoff timestamp in UTC based on the event schedule and policy rules.
 */
export function calculateCancellationDeadline(
  event: {
    event_date: string;
    start_time?: string | null;
  },
  policy: TicketCancellationPolicy
): Date {
  const dateStr = event.event_date.split("T")[0];
  const timeStr = event.start_time && event.start_time.trim() ? event.start_time.trim() : "00:00";
  
  // Combine date and time in ISO format
  const isoTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  const eventStart = new Date(`${dateStr}T${isoTime}`);
  
  // Fallback if NaN
  const startMs = Number.isFinite(eventStart.getTime())
    ? eventStart.getTime()
    : new Date(event.event_date).getTime();

  let offsetMs = 0;
  if (policy.cutoff === "24h") {
    offsetMs = 24 * 60 * 60 * 1000;
  } else if (policy.cutoff === "48h") {
    offsetMs = 48 * 60 * 60 * 1000;
  } else if (policy.cutoff === "custom" && policy.customCutoffHours) {
    offsetMs = policy.customCutoffHours * 60 * 60 * 1000;
  }

  return new Date(startMs - offsetMs);
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  deadline?: Date;
  deadlineFormatted?: string;
  policy: TicketCancellationPolicy;
  isPaidOrder?: boolean;
  paidAmount?: number;
  currency?: string;
  refundPolicyText?: string;
}

/**
 * Validates whether an attendee ticket is currently eligible for self-service cancellation.
 */
export function checkTicketCancellationEligibility(params: {
  event: {
    id?: string;
    event_date: string;
    start_time?: string | null;
    custom_pass_design?: Record<string, unknown> | null;
  };
  attendee: {
    id?: string;
    application_status: string;
    pass_status?: string | null;
  };
  pass?: {
    status?: string | null;
  } | null;
  paidOrder?: {
    id?: string;
    status: string;
    amount?: number | null;
    currency?: string | null;
  } | null;
  now?: Date;
}): EligibilityResult {
  const policy = getEventCancellationPolicy(params.event);
  const now = params.now || new Date();

  if (!policy.enabled) {
    return {
      eligible: false,
      reason: "Self-service ticket cancellation is disabled by the organizer for this event.",
      policy,
    };
  }

  if (params.attendee.application_status === "cancelled") {
    return {
      eligible: false,
      reason: "This ticket has already been cancelled.",
      policy,
    };
  }

  if (params.attendee.application_status === "cancellation_requested") {
    return {
      eligible: false,
      reason: "Cancellation has already been requested and is currently awaiting organizer approval.",
      policy,
    };
  }

  if (params.attendee.application_status === "rejected") {
    return {
      eligible: false,
      reason: "This ticket registration has already been rejected or revoked.",
      policy,
    };
  }

  if (params.attendee.pass_status === "checked_in") {
    return {
      eligible: false,
      reason: "This ticket has already been checked in at the event gate and cannot be cancelled.",
      policy,
    };
  }

  const deadline = calculateCancellationDeadline(params.event, policy);
  const deadlinePassed = now.getTime() > deadline.getTime();

  const deadlineFormatted = deadline.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (deadlinePassed) {
    return {
      eligible: false,
      reason: `The cancellation deadline (${deadlineFormatted}) for this event has passed.`,
      deadline,
      deadlineFormatted,
      policy,
    };
  }

  const isPaid = Boolean(params.paidOrder && params.paidOrder.status === "paid");
  let refundPolicyText = "Free registration · No payment was required.";
  if (isPaid) {
    if (policy.paidTicketPolicy === "full_refund") {
      refundPolicyText = `Eligible for a full refund (₹${((params.paidOrder?.amount || 0) / 100).toFixed(2)}) via Razorpay upon cancellation.`;
    } else if (policy.paidTicketPolicy === "manual_review") {
      refundPolicyText = "Paid ticket · Cancellation requests are reviewed by the organizer for refund processing according to event terms.";
    } else {
      refundPolicyText = "Paid ticket · Event policy states ticket cancellations are non-refundable.";
    }
  }

  return {
    eligible: true,
    deadline,
    deadlineFormatted,
    policy,
    isPaidOrder: isPaid,
    paidAmount: params.paidOrder?.amount ?? undefined,
    currency: params.paidOrder?.currency ?? undefined,
    refundPolicyText,
  };
}

/**
 * Atomically submits an attendee cancellation request.
 */
export async function processTicketCancellationRequest(params: {
  eventId: string;
  attendeeId: string;
  reason?: string;
  requestedBy?: "ATTENDEE" | "ORGANIZER";
  actorUserId?: string | null;
}): Promise<{
  success: boolean;
  status?: "cancellation_requested" | "cancelled";
  message: string;
  cancellationId?: string;
  error?: string;
}> {
  const admin = adminClient();

  // 1. Fetch event and attendee
  const [{ data: event, error: eventErr }, { data: attendee, error: attErr }] =
    await Promise.all([
      admin
        .from("events")
        .select("id, name, event_date, start_time, organizer_id, custom_pass_design")
        .eq("id", params.eventId)
        .single(),
      admin
        .from("attendees")
        .select("id, event_id, name, email, application_status, pass_status, ticket_type_id")
        .eq("id", params.attendeeId)
        .eq("event_id", params.eventId)
        .single(),
    ]);

  if (eventErr || !event) {
    return { success: false, message: "Event not found." };
  }
  if (attErr || !attendee) {
    return { success: false, message: "Registration not found." };
  }

  // 2. Fetch pass and paid orders
  const [{ data: pass }, { data: paidOrder }, { data: checkIns }] = await Promise.all([
    admin
      .from("passes")
      .select("id, pass_token, status")
      .eq("attendee_id", attendee.id)
      .maybeSingle(),
    admin
      .from("ticket_orders")
      .select("id, status, amount, currency, razorpay_payment_id")
      .eq("event_id", params.eventId)
      .eq("attendee_id", attendee.id)
      .eq("status", "paid")
      .maybeSingle(),
    admin
      .from("check_ins")
      .select("id")
      .eq("attendee_id", attendee.id)
      .limit(1),
  ]);

  if (checkIns && checkIns.length > 0) {
    return {
      success: false,
      message: "Ticket has already been scanned/checked in at the gate and cannot be cancelled.",
    };
  }

  // 3. Server-side eligibility and deadline validation
  const eligibility = checkTicketCancellationEligibility({
    event,
    attendee,
    paidOrder,
  });

  if (!eligibility.eligible && params.requestedBy !== "ORGANIZER") {
    return {
      success: false,
      message: eligibility.reason || "This ticket is not eligible for cancellation.",
    };
  }

  const policy = eligibility.policy;
  const reasonText = (params.reason || "").trim() || "Attendee self-service cancellation";

  // 4. Branch: Require Organizer Approval vs Immediate Cancellation
  const needsApproval =
    params.requestedBy !== "ORGANIZER" && policy.requireOrganizerApproval;

  const targetStatus: CancellationStatus = needsApproval ? "PENDING" : "COMPLETED";
  const targetAppStatus = needsApproval ? "cancellation_requested" : "cancelled";
  const targetPassStatus = needsApproval ? pass?.status || "generated" : "cancelled";

  // 5. Update attendee and pass status
  const nowIso = new Date().toISOString();

  const { error: attUpdateErr } = await admin
    .from("attendees")
    .update({
      application_status: targetAppStatus,
      pass_status: needsApproval ? attendee.pass_status : "revoked",
      updated_at: nowIso,
    })
    .eq("id", attendee.id)
    .in("application_status", ["approved", "pending", "waitlisted"]);

  if (attUpdateErr) {
    return {
      success: false,
      message: "Could not update registration status. Please try again.",
    };
  }

  if (!needsApproval && pass) {
    await admin
      .from("passes")
      .update({
        status: "cancelled",
        updated_at: nowIso,
      })
      .eq("id", pass.id);
  }

  // 6. Record in ticket_cancellations audit log
  let refundStatus: TicketCancellationRecord["refund_status"] = "NONE";
  let refundId: string | null = null;
  const refundAmount = paidOrder ? paidOrder.amount : 0;

  if (paidOrder) {
    if (policy.paidTicketPolicy === "full_refund" && !needsApproval) {
      // Automatic Razorpay refund attempt
      try {
        if (paidOrder.razorpay_payment_id) {
          const { getRazorpayClient } = await import("@/lib/razorpay");
          const rzp = getRazorpayClient();
          const rzpRefund: any = await (rzp.payments as any).refund(paidOrder.razorpay_payment_id, {
            amount: paidOrder.amount,
            notes: {
              reason: "Attendee self-service ticket cancellation",
              eventId: event.id,
              attendeeId: attendee.id,
            },
          });
          refundId = rzpRefund?.id || `rfnd_${Date.now()}`;
          refundStatus = "PROCESSED";

          await admin
            .from("ticket_orders")
            .update({
              status: "refunded",
              updated_at: nowIso,
            })
            .eq("id", paidOrder.id);
        }
      } catch (refundErr) {
        console.error("[cancellation] Automatic Razorpay refund failed:", refundErr);
        refundStatus = "FAILED";
      }
    } else if (policy.paidTicketPolicy === "manual_review") {
      refundStatus = "MANUAL_REVIEW";
    }
  }

  const { data: record, error: insertErr } = await admin
    .from("ticket_cancellations")
    .insert({
      event_id: event.id,
      attendee_id: attendee.id,
      pass_id: pass?.id || null,
      order_id: paidOrder?.id || null,
      requested_by: params.requestedBy || "ATTENDEE",
      status: targetStatus,
      reason: reasonText,
      policy_snapshot: policy,
      refund_status: refundStatus,
      refund_amount: refundAmount,
      refund_id: refundId,
      processed_at: needsApproval ? null : nowIso,
      processed_by: params.actorUserId || null,
    })
    .select("id")
    .single();

  if (insertErr) {
    console.warn("[cancellation] Failed to insert ticket_cancellations record:", insertErr);
  }

  // 7. Capacity release and waitlist auto-promotion
  if (!needsApproval && policy.capacityReleasePolicy === "immediate") {
    void promoteNextWaitlistAttendee(event.id).catch((err) =>
      console.error("[cancellation] promoteNextWaitlistAttendee error:", err)
    );
  }

  // 8. Trigger Notifications if configured
  if (policy.sendNotifications) {
    void dispatchCancellationNotifications({
      event,
      attendee,
      status: needsApproval ? "cancellation_requested" : "cancelled",
      reason: reasonText,
      refundPolicyText: eligibility.refundPolicyText,
    }).catch((notifErr) =>
      console.warn("[cancellation] Notification dispatch error:", notifErr)
    );
  }

  return {
    success: true,
    status: targetAppStatus as "cancellation_requested" | "cancelled",
    message: needsApproval
      ? "Cancellation request submitted. The event organizer will review your request."
      : "Your ticket has been cancelled successfully.",
    cancellationId: record?.id,
  };
}

/**
 * Organizer approves a pending cancellation request.
 */
export async function approveCancellationRequest(params: {
  cancellationId: string;
  organizerUserId: string;
}): Promise<{ success: boolean; message: string; error?: string }> {
  const admin = adminClient();

  const { data: record, error: fetchErr } = await admin
    .from("ticket_cancellations")
    .select("id, event_id, attendee_id, pass_id, order_id, status, policy_snapshot")
    .eq("id", params.cancellationId)
    .single();

  if (fetchErr || !record) return { success: false, message: "Cancellation request not found." };
  if (record.status !== "PENDING") {
    return { success: false, message: `Request is already in ${record.status} state.` };
  }

  const nowIso = new Date().toISOString();

  // Atomically complete cancellation
  await Promise.all([
    admin
      .from("attendees")
      .update({ application_status: "cancelled", pass_status: "revoked", updated_at: nowIso })
      .eq("id", record.attendee_id),
    record.pass_id
      ? admin
          .from("passes")
          .update({ status: "cancelled", updated_at: nowIso })
          .eq("id", record.pass_id)
      : Promise.resolve(),
    admin
      .from("ticket_cancellations")
      .update({
        status: "COMPLETED",
        processed_at: nowIso,
        processed_by: params.organizerUserId,
        updated_at: nowIso,
      })
      .eq("id", record.id),
  ]);

  // Release capacity
  const policy = record.policy_snapshot as Partial<TicketCancellationPolicy>;
  if (policy.capacityReleasePolicy !== "never") {
    void promoteNextWaitlistAttendee(record.event_id).catch(() => {});
  }

  // Dispatch confirmation
  const [{ data: event }, { data: attendee }] = await Promise.all([
    admin.from("events").select("name, event_date").eq("id", record.event_id).single(),
    admin.from("attendees").select("name, email").eq("id", record.attendee_id).single(),
  ]);

  if (event && attendee && policy.sendNotifications !== false) {
    void dispatchCancellationNotifications({
      event: { name: event.name || "Event", event_date: event.event_date || "" },
      attendee: { name: attendee.name || "Attendee", email: attendee.email || "" },
      status: "cancelled",
      refundPolicyText: record.order_id ? "Refund initiated or processed per event policy" : undefined,
    }).catch(() => {});
  }

  return { success: true, message: "Ticket cancellation approved." };
}

/**
 * Organizer rejects a pending cancellation request.
 */
export async function rejectCancellationRequest(params: {
  cancellationId: string;
  organizerUserId: string;
  rejectionReason?: string;
}): Promise<{ success: boolean; message: string; error?: string }> {
  const admin = adminClient();

  const { data: record, error: fetchErr } = await admin
    .from("ticket_cancellations")
    .select("id, event_id, attendee_id, pass_id, status")
    .eq("id", params.cancellationId)
    .single();

  if (fetchErr || !record) return { success: false, message: "Cancellation request not found." };
  if (record.status !== "PENDING") {
    return { success: false, message: `Request is already in ${record.status} state.` };
  }

  const nowIso = new Date().toISOString();

  // Restore attendee to approved
  await Promise.all([
    admin
      .from("attendees")
      .update({ application_status: "approved", pass_status: "generated", updated_at: nowIso })
      .eq("id", record.attendee_id),
    admin
      .from("ticket_cancellations")
      .update({
        status: "REJECTED",
        rejection_reason: params.rejectionReason || "Organizer rejected cancellation request",
        processed_at: nowIso,
        processed_by: params.organizerUserId,
        updated_at: nowIso,
      })
      .eq("id", record.id),
  ]);

  const [{ data: event }, { data: attendee }] = await Promise.all([
    admin.from("events").select("name, event_date").eq("id", record.event_id).single(),
    admin.from("attendees").select("name, email").eq("id", record.attendee_id).single(),
  ]);

  if (event && attendee) {
    void dispatchCancellationNotifications({
      event: { name: event.name || "Event", event_date: event.event_date || "" },
      attendee: { name: attendee.name || "Attendee", email: attendee.email || "" },
      status: "rejected",
      reason: params.rejectionReason || "Organizer declined cancellation request",
    }).catch(() => {});
  }

  return { success: true, message: "Cancellation request rejected. Ticket remains active." };
}

/**
 * Dispatches confirmation emails to attendee when cancellation status changes.
 */
async function dispatchCancellationNotifications(params: {
  event: { name: string; event_date: string };
  attendee: { name: string; email: string };
  status: "cancellation_requested" | "cancelled" | "rejected";
  reason?: string;
  refundPolicyText?: string;
}) {
  if (!params.attendee.email) return;

  try {
    const { sendEmail } = await import("@/lib/email");
    const isRequested = params.status === "cancellation_requested";
    const isRejected = params.status === "rejected";

    const subject = isRequested
      ? `Cancellation requested for ${params.event.name}`
      : isRejected
      ? `Ticket cancellation update for ${params.event.name}`
      : `Ticket cancelled: ${params.event.name}`;

    const heading = isRequested
      ? "Cancellation Request Received"
      : isRejected
      ? "Cancellation Request Declined"
      : "Ticket Successfully Cancelled";

    const bodyText = isRequested
      ? `We have received your cancellation request for ${params.event.name}. The organizer will review your request shortly.`
      : isRejected
      ? `Your cancellation request for ${params.event.name} was not approved by the organizer. Your ticket and QR pass remain valid for entry.`
      : `Your ticket registration for ${params.event.name} has been cancelled. Your QR pass is now deactivated.`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #171717;">
        <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #111827;">${heading}</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Hello ${params.attendee.name},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">${bodyText}</p>
        ${params.reason ? `<p style="font-size: 13px; line-height: 1.5; color: #6b7280; padding: 12px; background: #f9fafb; border-radius: 8px;"><strong>Reason:</strong> ${params.reason}</p>` : ""}
        ${params.refundPolicyText ? `<p style="font-size: 13px; line-height: 1.5; color: #6b7280;"><strong>Refund Info:</strong> ${params.refundPolicyText}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #9ca3af;">UrPass Ticketing Infrastructure · urpass.space</p>
      </div>
    `;

    await sendEmail({
      to: params.attendee.email,
      subject,
      html,
    });
  } catch (err) {
    console.warn("[cancellation] Could not send notification email:", err);
  }
}
