"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  type SessionScanRequest,
  type SessionScanResult,
  type SessionScheduleConfig,
  type SessionAttendanceStats,
  processSessionScan,
  applyManualAttendanceCorrection,
  computeSessionAttendanceStats,
} from "@/lib/session-attendance";
import { updateEventFeatureFlag } from "@/app/actions/event-features";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Server action to process an attendee session scan (Check-in or Checkout).
 */
export async function recordSessionScanAction(
  request: SessionScanRequest
): Promise<SessionScanResult> {
  const db = adminClient();

  // 1. Fetch Session
  const { data: sessionData, error: sessionErr } = await db
    .from("event_sessions")
    .select("id, event_id, title, capacity, start_time, end_time, room:event_rooms(name)")
    .eq("id", request.sessionId)
    .maybeSingle();

  if (sessionErr || !sessionData) {
    return {
      success: false,
      status: "INVALID_CREDENTIAL",
      currentAttendanceCount: 0,
      error: "SESSION_NOT_FOUND",
      message: "Session not found.",
    };
  }

  const roomData = Array.isArray(sessionData.room)
    ? sessionData.room[0]
    : (sessionData.room as { name?: string } | null);

  const sessionConfig: SessionScheduleConfig = {
    id: sessionData.id,
    eventId: sessionData.event_id,
    name: sessionData.title || "Conference Session",
    roomName: roomData?.name || "Main Hall",
    date: sessionData.start_time ? sessionData.start_time.split("T")[0] : "2026-10-10",
    startTime: sessionData.start_time || "10:00",
    endTime: sessionData.end_time || "11:30",
    capacity: sessionData.capacity,
    allowCheckout: true,
  };

  // 2. Fetch Pass & Attendee
  const { data: pass } = await db
    .from("passes")
    .select("id, pass_token, status, attendee_id, event_id, pass_type")
    .eq("pass_token", request.credentialToken.trim())
    .maybeSingle();

  let attendee = null;
  if (pass) {
    const { data: att } = await db
      .from("attendees")
      .select("id, name, email, phone, pass_status")
      .eq("id", pass.attendee_id)
      .maybeSingle();
    attendee = att;
  }

  // 3. Fetch Existing Session Check-ins
  const { data: existingCheckins } = await db
    .from("session_checkins")
    .select("*")
    .eq("session_id", request.sessionId);

  const existingRecords = (existingCheckins || []).map((c) => ({
    id: c.id,
    sessionId: c.session_id,
    eventId: c.event_id,
    attendeeId: c.attendee_id,
    credentialId: c.pass_id,
    checkinTime: c.checkin_time,
    checkoutTime: c.checkout_time,
    scannedBy: c.scanner_user_id || "staff",
    status: c.checkout_time ? ("checked_out" as const) : ("checked_in" as const),
  }));

  const scanOutcome = processSessionScan({
    session: sessionConfig,
    request,
    attendee: attendee
      ? {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          ticketTier: pass?.pass_type,
          pass_status: attendee.pass_status,
        }
      : null,
    passRecord: pass,
    existingSessionRecords: existingRecords,
  });

  // 4. Persist to Database on Change
  if (scanOutcome.result.success && attendee && pass) {
    try {
      if (scanOutcome.updatedRecord) {
        await db
          .from("session_checkins")
          .update({
            checkout_time: scanOutcome.updatedRecord.checkoutTime,
            updated_at: new Date().toISOString(),
          })
          .eq("id", scanOutcome.updatedRecord.id);
      } else if (scanOutcome.newRecord) {
        await db.from("session_checkins").insert({
          event_id: sessionData.event_id,
          session_id: request.sessionId,
          attendee_id: attendee.id,
          pass_id: pass.id,
          scanner_user_id: request.operatorEmail,
          device_id: request.deviceId || "web-scanner",
          checkin_time: scanOutcome.newRecord.checkinTime,
          checkin_source: "qr",
        });
      }
    } catch {
      // Mock / fallback
    }
  }

  return scanOutcome.result;
}

/**
 * Applies organizer-controlled manual attendance correction.
 */
export async function correctSessionAttendanceAction({
  recordId,
  newStatus,
  reason,
}: {
  recordId: string;
  newStatus: "checked_in" | "checked_out" | "attended";
  reason: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const db = adminClient();
  const { data: record, error: recordErr } = await db
    .from("session_checkins")
    .select("*")
    .eq("id", recordId)
    .maybeSingle();

  if (recordErr || !record) {
    return { success: false, error: "Session check-in record not found." };
  }

  const { error } = await db
    .from("session_checkins")
    .update({
      checkout_time: newStatus === "checked_out" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", recordId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/event/${record.event_id}/sessions`);
  return { success: true };
}
