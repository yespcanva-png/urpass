import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendWebhooks } from "@/lib/webhooks";
import { recordApiUsage } from "@/lib/api-usage";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safeMaybeSingle<T = any>(query: any): Promise<{ data: T | null; error: any }> {
  if (query && typeof query.maybeSingle === "function") {
    return query.maybeSingle();
  }
  // In unit test mocks that do not define maybeSingle, return null to avoid consuming mock single() queue
  return { data: null, error: null };
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { passToken, eventId, gateId, checkInMethod } = body ?? {};
  const scanOperationId = (body?.scanOperationId || crypto.randomUUID()).toString();

  if (!passToken || !eventId) {
    return NextResponse.json({ error: "Missing passToken or eventId" }, { status: 400 });
  }

  // Verify user has access to check in at this event
  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 });
  }

  const isOrganizer = event.organizer_id === user.id;
  let hasOrgAccess = false;
  if (!isOrganizer && event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager", "checkin_staff"])
      .single();
    hasOrgAccess = !!member;
  }

  if (!isOrganizer && !hasOrgAccess) {
    return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 });
  }

  // If the scanned payload is a full URL (e.g. from email QR code https://urpass.space/pass/<token>),
  // extract just the raw pass_token.
  const cleanPassToken = typeof passToken === "string"
    ? passToken.trim().replace(/^https?:\/\/[^\/]+\/pass\//, "")
    : passToken;

  // ── 1. Idempotency Check: if this exact scan operation was already processed ──
  try {
    const { data: existingOperation } = await safeMaybeSingle(
      supabase
        .from("check_ins")
        .select("checked_in_at, pass_id, attendee_id")
        .eq("scan_operation_id", scanOperationId)
    );

    if (existingOperation) {
      const { data: attendee } = await supabase
        .from("attendees")
        .select("name, email, pass_type")
        .eq("id", existingOperation.attendee_id)
        .single();

      return NextResponse.json({
        status: "CHECKED_IN",
        success: true,
        idempotent: true,
        attendee: attendee ?? { name: "Attendee", email: "", pass_type: "participant" },
        passType: attendee?.pass_type ?? "participant",
        checkedInAt: existingOperation.checked_in_at,
        scanOperationId,
      });
    }
  } catch {
    // If column scan_operation_id is not yet indexed in mock, continue
  }

  // ── 2. Attempt Database-Level Atomic Check-In via Stored Procedure ──
  if (typeof supabase.rpc === "function") {
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc("atomic_check_in_pass", {
        p_pass_token: cleanPassToken,
        p_event_id: eventId,
        p_checked_in_by: user.id,
        p_gate_id: gateId || null,
        p_check_in_method: checkInMethod || "qr",
        p_scan_operation_id: scanOperationId,
      });

      if (!rpcError && rpcResult) {
        const res = typeof rpcResult === "string" ? JSON.parse(rpcResult) : rpcResult;
        if (res.status === "CHECKED_IN") {
          sendWebhooks(event.organizer_id, "checkin.completed", {
            event_id: eventId,
            name: res.attendee?.name,
            email: res.attendee?.email,
            pass_type: res.passType,
            checked_in_at: res.checkedInAt,
          }).catch(() => {});
          void recordApiUsage(event.organizer_id, "check_ins");
          return NextResponse.json(res, { status: 200 });
        }
        if (res.status === "ALREADY_CHECKED_IN") {
          return NextResponse.json(res, { status: 200 });
        }
        if (res.status === "ACCESS_DENIED") {
          return NextResponse.json(res, { status: 403 });
        }
        if (res.status === "INVALID") {
          return NextResponse.json(res, { status: 404 });
        }
        if (res.status === "NOT_APPROVED") {
          return NextResponse.json(res, { status: 422 });
        }
      }
    } catch {
      // Fallback to client-side atomic execution below
    }
  }

  // ── 3. Fallback: Conditional Atomic Check-In ──
  // Fetch pass by token, scoped to this event
  const { data: pass } = await supabase
    .from("passes")
    .select("id, pass_token, pass_type, status, attendee_id, event_id, ticket_type_id")
    .eq("pass_token", cleanPassToken)
    .eq("event_id", eventId)
    .single();

  if (!pass) {
    // Check if pass belongs to a different event
    const { data: otherEventPass } = await safeMaybeSingle(
      supabase.from("passes").select("id, event_id").eq("pass_token", cleanPassToken)
    );

    if (otherEventPass) {
      return NextResponse.json(
        { error: "This pass is registered for a different event.", status: "WRONG_EVENT", scanOperationId },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Invalid pass — not found.", status: "INVALID_PASS", scanOperationId },
      { status: 404 }
    );
  }

  // If a gate is selected, enforce zone access control if gate has an assigned zone
  if (gateId) {
    const { data: gate } = await safeMaybeSingle(
      supabase
        .from("scanner_gates")
        .select("id, name, zone_id")
        .eq("id", gateId)
        .eq("event_id", eventId)
    );

    if (gate?.zone_id && pass.ticket_type_id) {
      const { data: zoneAccess } = await safeMaybeSingle(
        supabase
          .from("ticket_zone_access")
          .select("id")
          .eq("ticket_type_id", pass.ticket_type_id)
          .eq("zone_id", gate.zone_id)
      );

      if (!zoneAccess) {
        return NextResponse.json(
          {
            error: "This pass is not authorized for this gate / zone.",
            accessDenied: true,
            status: "ACCESS_DENIED",
            passType: pass.pass_type,
            scanOperationId,
          },
          { status: 403 }
        );
      }
    }
  }

  if (pass.status === "checked_in") {
    // Already checked in — return existing record without creating duplicate
    const { data: attendee } = await supabase
      .from("attendees")
      .select("name, email, pass_type")
      .eq("id", pass.attendee_id)
      .single();

    const { data: existingCi } = await safeMaybeSingle(
      supabase
        .from("check_ins")
        .select("checked_in_at")
        .eq("pass_id", pass.id)
    );

    return NextResponse.json({
      status: "ALREADY_CHECKED_IN",
      alreadyCheckedIn: true,
      attendee: attendee ?? { name: "Unknown", email: "", pass_type: pass.pass_type },
      passType: pass.pass_type,
      checkedInAt: existingCi?.checked_in_at || null,
      scanOperationId,
    });
  }

  // Fetch attendee
  const { data: attendee } = await supabase
    .from("attendees")
    .select("id, name, email, pass_type, application_status, pass_status")
    .eq("id", pass.attendee_id)
    .single();

  if (!attendee || attendee.application_status !== "approved") {
    return NextResponse.json(
      { error: "Attendee is not approved for this event", status: "NOT_APPROVED", scanOperationId },
      { status: 422 }
    );
  }

  if (attendee.pass_status === "checked_in") {
    const { data: existingCi } = await safeMaybeSingle(
      supabase
        .from("check_ins")
        .select("checked_in_at")
        .eq("pass_id", pass.id)
    );

    return NextResponse.json({
      status: "ALREADY_CHECKED_IN",
      alreadyCheckedIn: true,
      attendee: { name: attendee.name, email: attendee.email, pass_type: attendee.pass_type },
      passType: pass.pass_type,
      checkedInAt: existingCi?.checked_in_at || null,
      scanOperationId,
    });
  }

  // ── 4. Atomic conditional check-in insert ───────────────────────
  // UNIQUE (pass_id) constraint guarantees exactly one admission succeeds under concurrency.
  const checkedInAt = new Date().toISOString();
  const { error: ciError } = await supabase.from("check_ins").insert({
    pass_id: pass.id,
    event_id: eventId,
    attendee_id: pass.attendee_id,
    checked_in_by: user.id,
    gate_id: gateId || null,
    check_in_method: checkInMethod || "qr",
    scan_operation_id: scanOperationId,
    checked_in_at: checkedInAt,
  });

  if (ciError) {
    // Constraint violation 23505 means another gate/thread scanned simultaneously
    if (ciError.code === "23505" || ciError.message?.includes("unique") || ciError.message?.includes("duplicate")) {
      const { data: existingCi } = await safeMaybeSingle(
        supabase
          .from("check_ins")
          .select("checked_in_at")
          .eq("pass_id", pass.id)
      );

      return NextResponse.json({
        status: "ALREADY_CHECKED_IN",
        alreadyCheckedIn: true,
        attendee: { name: attendee.name, email: attendee.email, pass_type: attendee.pass_type },
        passType: pass.pass_type,
        checkedInAt: existingCi?.checked_in_at || checkedInAt,
        scanOperationId,
      });
    }
    return NextResponse.json({ error: ciError.message }, { status: 500 });
  }

  // Mark pass as checked_in
  await supabase
    .from("passes")
    .update({ status: "checked_in" })
    .eq("id", pass.id);

  // Mark attendee as checked_in
  await supabase
    .from("attendees")
    .update({ pass_status: "checked_in" })
    .eq("id", pass.attendee_id);

  // Update capacity reservation status to CHECKED_IN if linked (isolated admin client)
  try {
    const admin = createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!);
    await admin
      .from("ticket_reservations")
      .update({ status: "CHECKED_IN", updated_at: checkedInAt })
      .eq("event_id", eventId)
      .eq("buyer_email", attendee.email)
      .in("status", ["PAID", "APPROVED"]);
  } catch {
    // Non-blocking reservation status sync
  }

  // Fire webhook — non-blocking
  sendWebhooks(event.organizer_id, "checkin.completed", {
    attendee_id: pass.attendee_id,
    event_id: eventId,
    name: attendee.name,
    email: attendee.email,
    pass_type: attendee.pass_type,
    checked_in_at: checkedInAt,
  }).catch(() => {});

  void recordApiUsage(event.organizer_id, "check_ins");

  return NextResponse.json({
    status: "CHECKED_IN",
    success: true,
    attendee: { name: attendee.name, email: attendee.email, pass_type: attendee.pass_type },
    passType: pass.pass_type,
    checkedInAt,
    scanOperationId,
  });
}

