"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { revalidatePath } from "next/cache";
import {
  checkTicketCancellationEligibility,
  processTicketCancellationRequest,
  approveCancellationRequest,
  rejectCancellationRequest,
  type EligibilityResult,
} from "@/lib/cancellation/service";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

/**
 * Validates cancellation eligibility for a specific public pass.
 */
export async function getTicketCancellationEligibilityAction(
  passToken: string
): Promise<{
  eligibility?: EligibilityResult;
  error?: string;
}> {
  if (!passToken || typeof passToken !== "string") {
    return { error: "Pass token is required." };
  }

  const cleanToken = passToken.trim().replace(/^https?:\/\/[^\/]+\/pass\//, "");
  const admin = adminClient();

  const { data: pass, error: passErr } = await admin
    .from("passes")
    .select("id, pass_token, status, attendee_id, event_id")
    .eq("pass_token", cleanToken)
    .maybeSingle();

  if (passErr || !pass) {
    return { error: "Pass not found." };
  }

  const [{ data: event }, { data: attendee }, { data: paidOrder }] = await Promise.all([
    admin
      .from("events")
      .select("id, name, event_date, start_time, custom_pass_design")
      .eq("id", pass.event_id)
      .single(),
    admin
      .from("attendees")
      .select("id, name, email, application_status, pass_status")
      .eq("id", pass.attendee_id)
      .single(),
    admin
      .from("ticket_orders")
      .select("id, status, amount, currency")
      .eq("event_id", pass.event_id)
      .eq("attendee_id", pass.attendee_id)
      .eq("status", "paid")
      .maybeSingle(),
  ]);

  if (!event || !attendee) {
    return { error: "Event or attendee record not found." };
  }

  const eligibility = checkTicketCancellationEligibility({
    event,
    attendee,
    paidOrder,
  });

  return { eligibility };
}

/**
 * Submits an attendee ticket cancellation request.
 */
export async function requestTicketCancellationAction(params: {
  passToken: string;
  reason?: string;
  cancellationToken?: string;
}): Promise<{
  success: boolean;
  status?: "cancellation_requested" | "cancelled";
  message: string;
  error?: string;
}> {
  const { passToken, reason, cancellationToken } = params;
  if (!passToken || typeof passToken !== "string") {
    return { success: false, message: "Pass token is required." };
  }

  const cleanToken = passToken.trim().replace(/^https?:\/\/[^\/]+\/pass\//, "");
  const admin = adminClient();

  const { data: pass } = await admin
    .from("passes")
    .select("id, pass_token, attendee_id, event_id")
    .eq("pass_token", cleanToken)
    .maybeSingle();

  if (!pass) return { success: false, message: "Pass not found." };

  const { data: attendee } = await admin
    .from("attendees")
    .select("id, event_id, email, cancellation_token")
    .eq("id", pass.attendee_id)
    .single();

  if (!attendee) return { success: false, message: "Registration not found." };

  // Authorization check:
  // 1. Bearer of valid unguessable pass_token or cancellation_token
  // 2. Or logged-in attendee/organizer
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let authorized = false;
  if (user) {
    if (user.email && user.email.toLowerCase() === attendee.email.toLowerCase()) {
      authorized = true;
    } else {
      const { data: ev } = await admin
        .from("events")
        .select("organizer_id, organization_id")
        .eq("id", pass.event_id)
        .single();
      if (ev?.organizer_id === user.id) authorized = true;
    }
  }

  // Token-based authorization
  if (!authorized) {
    if (cancellationToken && attendee.cancellation_token === cancellationToken) {
      authorized = true;
    } else if (cleanToken === pass.pass_token) {
      authorized = true;
    }
  }

  if (!authorized) {
    return { success: false, message: "Unauthorized cancellation request." };
  }

  const result = await processTicketCancellationRequest({
    eventId: pass.event_id,
    attendeeId: pass.attendee_id,
    reason,
    requestedBy: "ATTENDEE",
    actorUserId: user?.id || null,
  });

  revalidatePath(`/pass/${cleanToken}`);
  revalidatePath(`/event/${pass.event_id}/attendees`);
  revalidatePath(`/event/${pass.event_id}`);

  return result;
}

/**
 * Organizer approves a pending cancellation request.
 */
export async function approveTicketCancellationAction(
  cancellationId: string
): Promise<{ success: boolean; message: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Authentication required." };

  const admin = adminClient();
  const { data: cancellation } = await admin
    .from("ticket_cancellations")
    .select("id, event_id")
    .eq("id", cancellationId)
    .single();

  if (!cancellation) return { success: false, message: "Cancellation record not found." };

  // Check organizer permissions
  const { data: event } = await admin
    .from("events")
    .select("organizer_id, organization_id")
    .eq("id", cancellation.event_id)
    .single();

  if (!event) return { success: false, message: "Event not found." };

  let authorized = event.organizer_id === user.id;
  if (!authorized && event.organization_id) {
    const { data: member } = await admin
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();
    authorized = Boolean(member);
  }

  if (!authorized) return { success: false, message: "Unauthorized." };

  const result = await approveCancellationRequest({
    cancellationId,
    organizerUserId: user.id,
  });

  revalidatePath(`/event/${cancellation.event_id}/attendees`);
  revalidatePath(`/event/${cancellation.event_id}`);

  return result;
}

/**
 * Organizer rejects a pending cancellation request.
 */
export async function rejectTicketCancellationAction(
  cancellationId: string,
  rejectionReason?: string
): Promise<{ success: boolean; message: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Authentication required." };

  const admin = adminClient();
  const { data: cancellation } = await admin
    .from("ticket_cancellations")
    .select("id, event_id")
    .eq("id", cancellationId)
    .single();

  if (!cancellation) return { success: false, message: "Cancellation record not found." };

  // Check organizer permissions
  const { data: event } = await admin
    .from("events")
    .select("organizer_id, organization_id")
    .eq("id", cancellation.event_id)
    .single();

  if (!event) return { success: false, message: "Event not found." };

  let authorized = event.organizer_id === user.id;
  if (!authorized && event.organization_id) {
    const { data: member } = await admin
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();
    authorized = Boolean(member);
  }

  if (!authorized) return { success: false, message: "Unauthorized." };

  const result = await rejectCancellationRequest({
    cancellationId,
    organizerUserId: user.id,
    rejectionReason,
  });

  revalidatePath(`/event/${cancellation.event_id}/attendees`);
  revalidatePath(`/event/${cancellation.event_id}`);

  return result;
}
