"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  type ReassignmentRequest,
  type ReassignmentResult,
  type CredentialVerificationResult,
  extractOpaquePassToken,
} from "@/lib/ticket-credentials";
import {
  assertFeatureEnabled,
  mergePersistedFeatureRows,
  type EventFeatureSettingRow,
  type PlatformFeatureFlagRow,
} from "@/lib/feature-flags";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type EventRow = {
  id: string;
  organizer_id: string;
  organization_id?: string | null;
  custom_pass_design?: Record<string, unknown> | null;
};

type RpcReassignmentResult = {
  success: boolean;
  booking_id?: string;
  ticket_id?: string;
  previous_attendee_id?: string;
  new_attendee_id?: string;
  revoked_credential_id?: string;
  new_credential_id?: string;
  new_pass_token?: string;
  error?: string;
  message?: string;
};

async function getMemberRole(
  db: ReturnType<typeof adminClient>,
  organizationId: string | null | undefined,
  userId: string | undefined
) {
  if (!organizationId || !userId) return null;

  const { data: member } = await db
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  return typeof member?.role === "string" ? member.role : null;
}

function canManageEvent(event: EventRow, userId: string | undefined, memberRole: string | null) {
  return (
    Boolean(userId) &&
    (event.organizer_id === userId ||
      memberRole === "owner" ||
      memberRole === "admin" ||
      memberRole === "event_manager")
  );
}

async function assertTicketReassignmentEnabled(
  db: ReturnType<typeof adminClient>,
  event: EventRow
) {
  let settings: EventFeatureSettingRow[] = [];
  let platformFlags: PlatformFeatureFlagRow[] = [];

  try {
    const [{ data: settingsRows }, { data: platformRows }] = await Promise.all([
      db
        .from("event_feature_settings")
        .select("feature_key, enabled, required_config_valid, validation_errors, version, updated_at, updated_by")
        .eq("event_id", event.id),
      db.from("platform_feature_flags").select("feature_key, platform_available"),
    ]);

    settings = (settingsRows ?? []) as EventFeatureSettingRow[];
    platformFlags = (platformRows ?? []) as PlatformFeatureFlagRow[];
  } catch {
    // Legacy/fresh local databases may not have M00 tables yet; JSON fallback still applies.
  }

  const config = mergePersistedFeatureRows({ event, settings, platformFlags });
  return assertFeatureEnabled({ ...event, custom_pass_design: { _featureFlags: config } }, "ticket_reassignment");
}

/**
 * Verifies a scanned digital QR credential server-side.
 */
export async function verifyCredentialAction({
  credentialToken,
  eventId,
  gateId,
  sessionId,
}: {
  credentialToken: string;
  eventId?: string;
  gateId?: string;
  sessionId?: string;
}): Promise<CredentialVerificationResult> {
  void gateId;
  void sessionId;

  const cleanToken = extractOpaquePassToken(credentialToken);
  const db = adminClient();

  const { data: credential } = await db
    .from("digital_qr_credentials")
    .select("event_id, pass_id, booking_id, attendee_id, credential_token, status, revoked_at, revocation_reason")
    .eq("credential_token", cleanToken)
    .maybeSingle();

  if (credential && eventId && credential.event_id !== eventId) {
    return {
      valid: false,
      status: "INVALID",
      credential_id: cleanToken,
      error: "EVENT_MISMATCH",
      message: "This QR credential does not belong to the requested event.",
    };
  }

  if (credential && ["revoked", "superseded"].includes(String(credential.status))) {
    return {
      valid: false,
      status: "REVOKED",
      credential_id: cleanToken,
      ticket_id: credential.pass_id,
      booking_id: credential.booking_id ?? undefined,
      event_id: credential.event_id,
      error: "CREDENTIAL_REVOKED",
      message: "This digital QR pass has been revoked.",
    };
  }

  if (credential && credential.status === "expired") {
    return {
      valid: false,
      status: "EXPIRED",
      credential_id: cleanToken,
      ticket_id: credential.pass_id,
      booking_id: credential.booking_id ?? undefined,
      event_id: credential.event_id,
      error: "CREDENTIAL_EXPIRED",
      message: "This digital credential has expired.",
    };
  }

  const passQuery = db
    .from("passes")
    .select("id, pass_token, status, attendee_id, event_id, pass_type, created_at, expires_at")
    .eq(credential ? "id" : "pass_token", credential ? credential.pass_id : cleanToken)
    .limit(1);

  const { data: passRows, error: passErr } = await passQuery;
  const pass = passRows?.[0];

  if (passErr || !pass) {
    return {
      valid: false,
      status: "INVALID",
      error: "INVALID_CREDENTIAL",
      message: "Invalid or nonexistent QR credential.",
    };
  }

  if (eventId && pass.event_id !== eventId) {
    return {
      valid: false,
      status: "INVALID",
      credential_id: cleanToken,
      ticket_id: pass.id,
      error: "EVENT_MISMATCH",
      message: "This QR credential does not belong to the requested event.",
    };
  }

  const isExpiredByTime = pass.expires_at && new Date(pass.expires_at).getTime() < Date.now();
  if (isExpiredByTime || pass.status === "expired") {
    return {
      valid: false,
      status: "EXPIRED",
      credential_id: cleanToken,
      ticket_id: pass.id,
      event_id: pass.event_id,
      error: "CREDENTIAL_EXPIRED",
      message: "This digital credential has expired.",
    };
  }

  const { data: attendee } = await db
    .from("attendees")
    .select("id, name, email, phone, event_id, pass_status")
    .eq("id", pass.attendee_id)
    .maybeSingle();

  const isRevoked =
    pass.status === "revoked" ||
    pass.status === "cancelled" ||
    attendee?.pass_status === "revoked" ||
    attendee?.pass_status === "cancelled";
  if (isRevoked) {
    return {
      valid: false,
      status: "REVOKED",
      credential_id: cleanToken,
      ticket_id: pass.id,
      event_id: pass.event_id,
      attendee: attendee ? { id: attendee.id, name: attendee.name, email: attendee.email } : undefined,
      error: "CREDENTIAL_REVOKED",
      message: "This digital QR pass has been revoked.",
    };
  }

  const { data: existingCheckIn } = await db
    .from("check_ins")
    .select("checked_in_at")
    .eq("pass_id", pass.id)
    .order("checked_in_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const isAlreadyCheckedIn = pass.status === "checked_in" || Boolean(existingCheckIn);

  return {
    valid: true,
    status: isAlreadyCheckedIn ? "ALREADY_CHECKED_IN" : "VALID",
    credential_id: cleanToken,
    ticket_id: pass.id,
    event_id: pass.event_id,
    attendee: attendee
      ? {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          phone: attendee.phone,
        }
      : undefined,
    checked_in_at: existingCheckIn?.checked_in_at ?? null,
    message: isAlreadyCheckedIn ? "Attendee already checked in." : "Valid credential.",
  };
}

/**
 * Reassigns a ticket entitlement to a new holder, revoking the previous credential atomically.
 */
export async function reassignTicketAction(
  request: ReassignmentRequest
): Promise<ReassignmentResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const db = adminClient();

  const { data: order, error: orderErr } = await db
    .from("ticket_orders")
    .select("id, event_id, buyer_email")
    .eq("id", request.booking_id)
    .maybeSingle();

  if (orderErr || !order) {
    return {
      success: false,
      error: "ORDER_NOT_FOUND",
      message: "Booking order not found.",
    };
  }

  const { data: event } = await db
    .from("events")
    .select("id, organizer_id, organization_id, custom_pass_design")
    .eq("id", order.event_id)
    .maybeSingle();

  if (!event) {
    return {
      success: false,
      error: "EVENT_NOT_FOUND",
      message: "Event not found.",
    };
  }

  const actorEmail = user?.email || request.actor_email;
  const memberRole = await getMemberRole(db, event.organization_id, user?.id);
  const isOrganizer = canManageEvent(event as EventRow, user?.id, memberRole);
  const isBuyer = String(order.buyer_email || "").toLowerCase().trim() === actorEmail.toLowerCase().trim();

  if (!isOrganizer && !isBuyer) {
    return {
      success: false,
      error: "UNAUTHORIZED",
      message: "Only the original ticket purchaser or event organizer can reassign this ticket.",
    };
  }

  const feature = await assertTicketReassignmentEnabled(db, event as EventRow);
  if (!feature.enabled) {
    return {
      success: false,
      error: "FEATURE_DISABLED",
      message: feature.error,
    };
  }

  const { data, error } = await db.rpc("reassign_ticket_credential_atomic", {
    p_booking_id: request.booking_id,
    p_pass_id: request.ticket_id,
    p_current_attendee_id: request.current_attendee_id,
    p_new_name: request.new_attendee.name,
    p_new_email: request.new_attendee.email,
    p_new_phone: request.new_attendee.phone ?? null,
    p_custom_responses: request.new_attendee.customResponses ?? {},
    p_actor_email: actorEmail,
    p_actor_user_id: user?.id ?? null,
    p_organizer_override: Boolean(request.organizer_override),
    p_reason: request.reason ?? null,
    p_expected_version: request.expectedVersion ?? null,
  });

  if (error) {
    return {
      success: false,
      error: "REASSIGNMENT_FAILED",
      message: error.message,
    };
  }

  const result = data as RpcReassignmentResult;
  if (!result?.success) return result;

  revalidatePath(`/event/${order.event_id}/attendees`);
  return result;
}
