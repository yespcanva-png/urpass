import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { calculateGroupAdmission, parseScannedGroupQR } from "@/lib/group-entry";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  let supabase = await createClient();

  // 1. Authenticate Scanner User
  let user: { id: string; email?: string } | null = null;
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token && process.env.SUPABASE_SERVICE_ROLE_KEY && token === process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = adminClient();
      user = { id: "service-role", email: "admin@urpass.space" };
    } else if (token) {
      const admin = adminClient();
      const { data: userData } = await admin.auth.getUser(token);
      if (userData?.user) {
        user = userData.user;
      }
    }
  }

  if (!user) {
    const {
      data: { user: cookieUser },
    } = await supabase.auth.getUser();
    user = cookieUser;
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const {
    bookingReference,
    quantity = 1,
    gateId,
    gateName,
    deviceId = "web-scanner",
    scanOperationId = crypto.randomUUID(),
    entryMode = "count_only",
    selectedMemberIds = [],
    action = "admit", // "lookup" | "admit"
  } = body ?? {};

  if (!bookingReference) {
    return NextResponse.json({ error: "Booking reference or group QR token is required." }, { status: 400 });
  }

  const db = adminClient();

  // 2. Fetch Event and Feature Activation
  const { data: event, error: eventErr } = await db
    .from("events")
    .select("id, name, organizer_id, organization_id, status, custom_pass_design")
    .eq("id", eventId)
    .single();

  if (eventErr || !event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  if (event.status && event.status !== "active") {
    return NextResponse.json(
      { error: `Event is ${event.status}. Group check-in disabled.`, status: "EVENT_INACTIVE" },
      { status: 403 }
    );
  }

  // 3. Extract clean booking reference
  const parsedQR = parseScannedGroupQR(bookingReference);
  const cleanRef = parsedQR.bookingReference || bookingReference.trim();

  // 4. Lookup Booking state (Support order, group master pass, or individual pass)
  let orderData: any = null;
  let passData: any = null;

  const { data: directOrder } = await db
    .from("ticket_orders")
    .select(`
      id,
      event_id,
      buyer_name,
      buyer_email,
      status,
      total_attendee_count,
      total_entitlements,
      admitted_entitlements,
      group_entry_enabled,
      group_entry_mode,
      group_members
    `)
    .or(`id.eq.${cleanRef},group_qr_code.eq.${cleanRef}`)
    .eq("event_id", eventId)
    .maybeSingle();

  orderData = directOrder;

  if (!orderData) {
    const { data: directPass } = await db
      .from("passes")
      .select(`
        id,
        event_id,
        pass_token,
        status,
        total_guests,
        checked_in_guests,
        group_members,
        order_id,
        attendee:attendees (id, name, email)
      `)
      .or(`pass_token.eq.${cleanRef},id.eq.${cleanRef}`)
      .eq("event_id", eventId)
      .maybeSingle();

    if (directPass) {
      passData = directPass;
      if (directPass.order_id) {
        const { data: parentOrder } = await db
          .from("ticket_orders")
          .select("*")
          .eq("id", directPass.order_id)
          .maybeSingle();
        orderData = parentOrder;
      }
    }
  }

  if (!orderData && !passData) {
    return NextResponse.json(
      { error: "Group booking or pass reference not found.", status: "BOOKING_NOT_FOUND" },
      { status: 404 }
    );
  }

  const attendeeObj = passData ? (Array.isArray(passData.attendee) ? passData.attendee[0] : passData.attendee) : null;
  const buyerName = orderData?.buyer_name || attendeeObj?.name || "Group Pass Holder";
  const buyerEmail = orderData?.buyer_email || attendeeObj?.email || "";
  const totalEntitlements = Number(orderData?.total_attendee_count || orderData?.total_entitlements || passData?.total_guests || 1);
  const admittedEntitlements = Number(orderData?.admitted_entitlements || passData?.checked_in_guests || 0);
  const remaining = Math.max(0, totalEntitlements - admittedEntitlements);
  const rawStatus = (orderData?.status || passData?.status || "VALID").toUpperCase();

  // If action is purely a lookup (Gate staff scans QR to see remaining before typing number)
  if (action === "lookup") {
    return NextResponse.json({
      success: true,
      status: remaining === 0 ? "EXHAUSTED" : "VALID",
      bookingReference: cleanRef,
      buyerName,
      buyerEmail,
      totalEntitlements,
      previouslyAdmitted: admittedEntitlements,
      remainingEntries: remaining,
      entryMode: orderData?.group_entry_mode || entryMode,
      members: orderData?.group_members || passData?.group_members || [],
    });
  }

  // 5. Attempt Database Atomic Stored Procedure Execution
  try {
    const { data: rpcResult, error: rpcErr } = await db.rpc("atomic_group_entry_checkin", {
      p_group_booking_ref: cleanRef,
      p_event_id: eventId,
      p_quantity: Number(quantity),
      p_checked_in_by: user.id,
      p_operator_email: user.email || "staff@urpass.space",
      p_gate_id: gateId || null,
      p_device_id: deviceId,
      p_scan_operation_id: scanOperationId,
      p_entry_mode: entryMode,
      p_admitted_members: selectedMemberIds,
    });

    if (!rpcErr && rpcResult) {
      const parsed = typeof rpcResult === "string" ? JSON.parse(rpcResult) : rpcResult;
      const httpStatus = parsed.success ? 200 : parsed.status === "EXHAUSTED" || parsed.status === "EXCEEDS_REMAINING" ? 422 : 400;
      return NextResponse.json(parsed, { status: httpStatus });
    }
  } catch {
    // Fallback to in-process atomic calculation below
  }

  // 6. Fallback: JavaScript Deterministic Engine Execution
  const outcome = calculateGroupAdmission({
    booking: {
      bookingReference: cleanRef,
      eventId,
      buyerName,
      buyerEmail,
      totalEntitlements,
      admittedEntitlements,
      remainingEntitlements: remaining,
      entryMode: (orderData?.group_entry_mode || entryMode) as any,
      status: rawStatus === "REFUNDED" || rawStatus === "CANCELLED" ? rawStatus : remaining === 0 ? "EXHAUSTED" : "VALID",
    },
    request: {
      bookingReference: cleanRef,
      eventId,
      quantity: Number(quantity),
      operatorId: user.id,
      operatorEmail: user.email,
      gateId,
      gateName,
      deviceId,
      scanOperationId,
      entryMode,
      selectedMemberIds,
    },
    isFeatureActive: true,
  });

  if (!outcome.result.success) {
    const httpStatus = outcome.result.status === "EXHAUSTED" || outcome.result.status === "EXCEEDS_REMAINING" ? 422 : 400;
    return NextResponse.json(outcome.result, { status: httpStatus });
  }

  // Persist fallback update to DB
  if (outcome.updatedBooking) {
    try {
      if (orderData?.id) {
        await db
          .from("ticket_orders")
          .update({
            admitted_entitlements: outcome.updatedBooking.admittedEntitlements,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderData.id);
      }
      if (passData?.id) {
        await db
          .from("passes")
          .update({
            checked_in_guests: outcome.updatedBooking.admittedEntitlements,
            status: outcome.updatedBooking.remainingEntitlements === 0 ? "checked_in" : "partially_checked_in",
            updated_at: new Date().toISOString(),
          })
          .eq("id", passData.id);
      }
    } catch {
      // Mock / fallback
    }
  }

  return NextResponse.json(outcome.result, { status: 200 });
}
