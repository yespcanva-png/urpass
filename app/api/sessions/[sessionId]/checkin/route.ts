import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { formatSessionTimeRange } from "@/lib/conference/conflict-detection";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  let supabase = await createClient();

  // Support auth via cookie or Bearer token
  let user: { id: string; email?: string } | null = null;
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token && process.env.SUPABASE_SERVICE_ROLE_KEY && token === process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY);
      user = { id: "service-role", email: "admin@urpass.space" };
    }
  }

  if (!user) {
    const {
      data: { user: cookieUser },
    } = await supabase.auth.getUser();
    user = cookieUser;
  }

  const body = await req.json().catch(() => null);
  const {
    passToken,
    passId,
    scannerUserId = user?.id || null,
    deviceId = "web-scanner",
    override = false,
    action = "auto", // "auto" | "checkin" | "checkout"
  } = body ?? {};

  const tokenInput = (passToken || passId || "").toString().trim();
  if (!tokenInput) {
    return NextResponse.json({ error: "Pass token or ID is required" }, { status: 400 });
  }

  // Extract clean pass token if URL was scanned
  let cleanPassToken = tokenInput;
  if (cleanPassToken.includes("/pass/")) {
    cleanPassToken = cleanPassToken.split("/pass/")[1].split("?")[0];
  }

  // 1. Fetch Session and Room
  const { data: session, error: sessionErr } = await supabase
    .from("event_sessions")
    .select(`
      id,
      event_id,
      title,
      room_id,
      capacity,
      registration_required,
      checkin_enabled,
      require_checkout,
      status,
      start_time,
      end_time,
      room:event_rooms (id, name, capacity)
    `)
    .eq("id", sessionId)
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: "Session not found", status: "SESSION_NOT_FOUND" }, { status: 404 });
  }

  const roomData = Array.isArray(session.room) ? session.room[0] : (session.room as any);
  const roomName: string = roomData?.name || "Main Venue";
  const roomCapacity: number | null = roomData?.capacity || null;

  if (!session.checkin_enabled) {
    return NextResponse.json(
      { error: "Check-in is disabled for this session.", status: "CHECKIN_DISABLED" },
      { status: 400 }
    );
  }

  // 2. Lookup Pass & Attendee
  let passQuery = supabase
    .from("passes")
    .select(`
      id,
      pass_token,
      pass_type,
      status,
      event_id,
      attendee_id,
      attendee:attendees (
        id,
        name,
        email,
        phone,
        pass_type,
        application_status
      )
    `);

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanPassToken);
  const { data: pass } = await (isUuid
    ? passQuery.or(`id.eq.${cleanPassToken},pass_token.eq.${cleanPassToken}`)
    : passQuery.eq("pass_token", cleanPassToken)
  ).maybeSingle();

  if (!pass) {
    return NextResponse.json(
      { error: "Invalid QR Pass — pass not found.", status: "INVALID_PASS" },
      { status: 404 }
    );
  }

  // Check event match
  if (pass.event_id !== session.event_id) {
    return NextResponse.json(
      { error: "Pass registered for a different event.", status: "WRONG_EVENT" },
      { status: 403 }
    );
  }

  // Check attendee approval
  const attendee = (pass as any).attendee;
  if (!attendee || attendee.application_status === "rejected") {
    return NextResponse.json(
      { error: "Attendee application rejected or invalid.", status: "NOT_APPROVED" },
      { status: 422 }
    );
  }

  // 3. Existing Check-In record lookup
  const { data: existingCheckIn } = await supabase
    .from("session_checkins")
    .select("*")
    .eq("session_id", sessionId)
    .eq("attendee_id", attendee.id)
    .maybeSingle();

  // If already checked in and require_checkout is true
  if (existingCheckIn && !existingCheckIn.checkout_time && (session.require_checkout || action === "checkout")) {
    const checkoutTime = new Date().toISOString();
    await supabase
      .from("session_checkins")
      .update({ checkout_time: checkoutTime })
      .eq("id", existingCheckIn.id);

    return NextResponse.json({
      status: "CHECKED_OUT",
      success: true,
      attendee: {
        name: attendee.name,
        email: attendee.email,
        pass_type: attendee.pass_type,
      },
      session: {
        title: session.title,
        room: roomName,
        time: formatSessionTimeRange(session.start_time, session.end_time),
      },
      checkinTime: existingCheckIn.checkin_time,
      checkoutTime,
      message: `Checked out: ${attendee.name}`,
    });
  }

  // If already checked in (Duplicate Scan)
  if (existingCheckIn) {
    return NextResponse.json({
      status: "ALREADY_CHECKED_IN",
      success: false,
      attendee: {
        name: attendee.name,
        email: attendee.email,
        pass_type: attendee.pass_type,
      },
      session: {
        title: session.title,
        room: roomName,
        time: formatSessionTimeRange(session.start_time, session.end_time),
      },
      checkedInAt: existingCheckIn.checkin_time,
      scannerUserId: existingCheckIn.scanner_user_id,
      deviceId: existingCheckIn.device_id,
      message: `ALREADY CHECKED IN: ${attendee.name} was checked in at ${new Date(existingCheckIn.checkin_time).toLocaleTimeString("en-IN")}`,
    });
  }

  // 4. Session Reservation Requirement Verification
  const { data: reservation } = await supabase
    .from("session_reservations")
    .select("id, status")
    .eq("session_id", sessionId)
    .eq("attendee_id", attendee.id)
    .maybeSingle();

  const isReserved = reservation && reservation.status === "reserved";

  if (session.registration_required && !isReserved && !override) {
    return NextResponse.json(
      {
        status: "ACCESS_NOT_ALLOWED",
        error: "ACCESS NOT ALLOWED: This attendee has not reserved this session.",
        attendee: {
          name: attendee.name,
          email: attendee.email,
        },
      },
      { status: 403 }
    );
  }

  // 5. Session Capacity Verification
  const effectiveCapacity =
    session.capacity !== null && session.capacity !== undefined
      ? session.capacity
      : roomCapacity;

  const { count: checkedInCountRaw } = await supabase
    .from("session_checkins")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);

  const currentCheckedIn = checkedInCountRaw || 0;

  if (effectiveCapacity !== null && effectiveCapacity > 0 && currentCheckedIn >= effectiveCapacity && !isReserved && !override) {
    return NextResponse.json(
      {
        status: "SESSION_FULL",
        error: `SESSION FULL: Capacity (${effectiveCapacity}) reached.`,
        capacity: effectiveCapacity,
        checkedIn: currentCheckedIn,
        attendee: {
          name: attendee.name,
          email: attendee.email,
        },
      },
      { status: 422 }
    );
  }

  // 6. Record Check-In
  const checkinTime = new Date().toISOString();
  const { error: insertErr } = await supabase
    .from("session_checkins")
    .insert({
      event_id: session.event_id,
      session_id: sessionId,
      attendee_id: attendee.id,
      pass_id: pass.id,
      registration_id: reservation?.id || pass.id,
      scanner_user_id: scannerUserId,
      device_id: deviceId,
      checkin_time: checkinTime,
      checkin_source: "qr",
      sync_status: "synced",
    });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  // Update reservation status to attended if reserved
  if (reservation) {
    await supabase
      .from("session_reservations")
      .update({ status: "attended" })
      .eq("id", reservation.id);
  }

  const newCheckedInCount = currentCheckedIn + 1;
  const remainingSeats = effectiveCapacity ? Math.max(0, effectiveCapacity - newCheckedInCount) : null;

  return NextResponse.json({
    status: "CHECKED_IN",
    success: true,
    attendee: {
      name: attendee.name,
      email: attendee.email,
      pass_type: attendee.pass_type,
    },
    session: {
      title: session.title,
      room: roomName,
      time: formatSessionTimeRange(session.start_time, session.end_time),
    },
    checkinTime,
    capacity: effectiveCapacity,
    checkedInCount: newCheckedInCount,
    remainingSeats,
    message: `✓ CHECKED IN: ${attendee.name}`,
  });
}
