import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { parseScannedGroupQR, normalizeScannedToken } from "@/lib/group-entry";
import { hasOrgPermission, type OrgPermission } from "@/lib/authorization";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function authorizeEventAccess({
  db,
  event,
  userId,
  permission,
}: {
  db: ReturnType<typeof adminClient>;
  event: { organizer_id: string; organization_id?: string | null };
  userId: string;
  permission: OrgPermission;
}) {
  if (userId === "service-role" || event.organizer_id === userId) {
    return { allowed: true, role: "owner" };
  }

  if (!event.organization_id) {
    return { allowed: false, role: null };
  }

  const { data: member } = await db
    .from("organization_members")
    .select("role")
    .eq("organization_id", event.organization_id)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  const role = member?.role ?? null;
  return { allowed: hasOrgPermission(role, permission), role };
}

async function assertGateBelongsToEvent({
  db,
  eventId,
  gateId,
}: {
  db: ReturnType<typeof adminClient>;
  eventId: string;
  gateId?: string | null;
}) {
  if (!gateId) return { allowed: true };
  const { data: gate } = await db
    .from("scanner_gates")
    .select("id")
    .eq("id", gateId)
    .eq("event_id", eventId)
    .maybeSingle();
  return gate ? { allowed: true } : { allowed: false, error: "Gate is not assigned to this event." };
}

/**
 * GET /api/events/[eventId]/group-entry
 * Returns:
 * - Group entry KPI totals (total bookings, total entitlements, admitted first entries, remaining first entries, inside venue)
 * - Booking-wise list with filter support (all, fully_used, partially_used, unused)
 * - Admission history log with gate and staff details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const supabase = await createClient();
  const db = adminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
  let eventQuery = db
    .from("events")
    .select("id, name, organizer_id, organization_id, status, custom_pass_design");
  eventQuery = isUuid ? eventQuery.eq("id", eventId) : eventQuery.eq("apply_slug", eventId);
  const { data: event } = await eventQuery.maybeSingle();

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const canonicalEventId = event.id;

  const access = await authorizeEventAccess({
    db,
    event,
    userId: user.id,
    permission: "viewCheckIn",
  });
  if (!access.allowed) {
    return NextResponse.json({ error: "Event not found or unauthorized." }, { status: 403 });
  }

  // 1. Fetch group orders from ticket_orders
  const { data: orders } = await db
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
      group_qr_code,
      group_entry_enabled,
      group_entry_mode,
      created_at,
      updated_at
    `)
    .eq("event_id", canonicalEventId)
    .order("created_at", { ascending: false });

  // 2. Fetch explicitly marked group passes from passes table
  const { data: passes } = await db
    .from("passes")
    .select(`
      id,
      event_id,
      pass_token,
      status,
      total_guests,
      checked_in_guests,
      is_group_master,
      is_group_pass,
      created_at,
      attendee:attendees(id, name, email, venue_presence_state, pass_status)
    `)
    .eq("event_id", canonicalEventId)
    .or("is_group_master.eq.true,is_group_pass.eq.true")
    .order("created_at", { ascending: false });

  // 3. Fetch admission logs
  const { data: admissionLogs } = await db
    .from("group_entry_admissions")
    .select(`
      id,
      group_booking_reference,
      admitted_count,
      total_entitlements,
      previously_admitted,
      remaining_after,
      entry_mode,
      gate_id,
      operator_email,
      device_id,
      admitted_at,
      gate:scanner_gates(name)
    `)
    .eq("event_id", canonicalEventId)
    .order("admitted_at", { ascending: false })
    .limit(100);

  // Combine and deduplicate bookings
  type FormattedBooking = {
    id: string;
    bookingReference: string;
    buyerName: string;
    buyerEmail: string;
    ticketType: string;
    totalEntitlements: number;
    admittedEntitlements: number;
    remainingEntitlements: number;
    currentlyInside: number;
    status: "UNUSED" | "PARTIALLY_USED" | "FULLY_USED" | "REFUNDED" | "CANCELLED";
    rawStatus: string;
    lastAdmittedAt?: string;
  };

  const bookingMap = new Map<string, FormattedBooking>();

  // Process ticket orders with multiple entitlements
  for (const o of orders || []) {
    const total = Number(o.total_attendee_count || o.total_entitlements || 1);
    if (!o.group_entry_enabled && !o.group_qr_code) continue;
    if (total <= 1 && !o.group_qr_code) continue;

    const admitted = Number(o.admitted_entitlements || 0);
    const remaining = Math.max(0, total - admitted);
    const ref = o.group_qr_code || o.id;

    let status: FormattedBooking["status"] = "UNUSED";
    if (o.status === "refunded") status = "REFUNDED";
    else if (o.status === "cancelled") status = "CANCELLED";
    else if (remaining === 0) status = "FULLY_USED";
    else if (admitted > 0) status = "PARTIALLY_USED";
    else status = "UNUSED";

    bookingMap.set(ref, {
      id: o.id,
      bookingReference: ref,
      buyerName: o.buyer_name || "Group Booker",
      buyerEmail: o.buyer_email || "",
      ticketType: "Group Booking",
      totalEntitlements: total,
      admittedEntitlements: admitted,
      remainingEntitlements: remaining,
      currentlyInside: admitted, // will correlate if presence tracking available
      status,
      rawStatus: o.status,
    });
  }

  // Process passes explicitly marked as group credentials
  for (const p of passes || []) {
    const ref = p.pass_token || p.id;
    if (bookingMap.has(ref)) continue;

    const total = Number(p.total_guests || 1);
    const admitted = Number(p.checked_in_guests || 0);
    const remaining = Math.max(0, total - admitted);
    const attendeeObj = Array.isArray(p.attendee) ? p.attendee[0] : p.attendee;

    let status: FormattedBooking["status"] = "UNUSED";
    if (p.status === "refunded") status = "REFUNDED";
    else if (p.status === "cancelled" || p.status === "revoked") status = "CANCELLED";
    else if (remaining === 0) status = "FULLY_USED";
    else if (admitted > 0) status = "PARTIALLY_USED";
    else status = "UNUSED";

    const isInside = attendeeObj?.venue_presence_state === "inside" || attendeeObj?.pass_status === "checked_in";

    bookingMap.set(ref, {
      id: p.id,
      bookingReference: ref,
      buyerName: attendeeObj?.name || "Group Pass Holder",
      buyerEmail: attendeeObj?.email || "",
      ticketType: "General Admission · Group Pass",
      totalEntitlements: total,
      admittedEntitlements: admitted,
      remainingEntitlements: remaining,
      currentlyInside: isInside ? admitted : 0,
      status,
      rawStatus: p.status,
    });
  }

  const bookingsList = Array.from(bookingMap.values());

  // Aggregate high-level KPIs
  const totalBookings = bookingsList.length;
  const totalEntitlements = bookingsList.reduce((acc, b) => acc + b.totalEntitlements, 0);
  const totalAdmitted = bookingsList.reduce((acc, b) => acc + b.admittedEntitlements, 0);
  const totalRemaining = bookingsList.reduce((acc, b) => acc + b.remainingEntitlements, 0);
  const totalCurrentlyInside = bookingsList.reduce((acc, b) => acc + b.currentlyInside, 0);

  const fullyUsedCount = bookingsList.filter((b) => b.status === "FULLY_USED").length;
  const partiallyUsedCount = bookingsList.filter((b) => b.status === "PARTIALLY_USED").length;
  const unusedCount = bookingsList.filter((b) => b.status === "UNUSED").length;

  return NextResponse.json({
    success: true,
    eventId,
    stats: {
      totalBookings,
      totalEntitlements,
      totalAdmitted,
      totalRemaining,
      totalCurrentlyInside,
      fullyUsedCount,
      partiallyUsedCount,
      unusedCount,
    },
    bookings: bookingsList,
    admissionHistory: (admissionLogs || []).map((l: any) => ({
      id: l.id,
      bookingReference: l.group_booking_reference,
      admittedCount: l.admitted_count,
      totalEntitlements: l.total_entitlements,
      previouslyAdmitted: l.previously_admitted,
      remainingAfter: l.remaining_after,
      gateName: l.gate?.name || "Gate A",
      operatorEmail: l.operator_email || "gate@urpass.space",
      deviceId: l.device_id || "web-scanner",
      admittedAt: l.admitted_at,
    })),
  });
}

/**
 * POST /api/events/[eventId]/group-entry
 * Gate staff scanning or supervisor corrections
 */
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
    action = "admit", // "lookup" | "admit" | "supervisor_correction"
    correctionQuantity,
    auditReason,
  } = body ?? {};

  if (!bookingReference) {
    return NextResponse.json({ error: "Booking reference or group QR token is required." }, { status: 400 });
  }

  const db = adminClient();

  const isEventUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
  let eventLookup = db
    .from("events")
    .select("id, name, organizer_id, organization_id, status, custom_pass_design");
  eventLookup = isEventUuid ? eventLookup.eq("id", eventId) : eventLookup.eq("apply_slug", eventId);
  const { data: event, error: eventErr } = await eventLookup.maybeSingle();

  if (eventErr || !event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const canonicalEventId = event.id;

  if (user.id === "service-role") {
    user = { id: event.organizer_id, email: user.email };
  }

  const access = await authorizeEventAccess({
    db,
    event,
    userId: user.id,
    permission: action === "lookup" ? "viewCheckIn" : "manageCheckIn",
  });
  if (!access.allowed) {
    return NextResponse.json({ error: "Event not found or unauthorized.", status: "UNAUTHORIZED_OPERATOR" }, { status: 403 });
  }

  if (
    action === "supervisor_correction" &&
    !["owner", "admin", "event_manager", "gate_manager"].includes(access.role ?? "")
  ) {
    return NextResponse.json(
      { error: "Supervisor correction requires event manager or gate manager permission.", status: "UNAUTHORIZED_OPERATOR" },
      { status: 403 }
    );
  }

  const gateAccess = await assertGateBelongsToEvent({ db, eventId: canonicalEventId, gateId });
  if (!gateAccess.allowed) {
    return NextResponse.json({ error: gateAccess.error, status: "GATE_NOT_ALLOWED" }, { status: 403 });
  }

  if (event.status && event.status !== "active") {
    return NextResponse.json(
      { error: `Event is ${event.status}. Group check-in disabled.`, status: "EVENT_INACTIVE" },
      { status: 403 }
    );
  }

  // Check feature flag
  if (!isFeatureEnabled(event, "group_entry")) {
    return NextResponse.json(
      { error: "Group QR Partial Entry is disabled for this event.", status: "FEATURE_DISABLED" },
      { status: 403 }
    );
  }

  // 3. Extract clean booking reference
  const parsedQR = parseScannedGroupQR(bookingReference);
  const cleanRef = parsedQR.bookingReference || normalizeScannedToken(bookingReference);

  // 4. Lookup Booking state (Support order, group master pass, or individual pass)
  let orderData: any = null;
  let passData: any = null;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanRef);

  let orderQuery = db
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
      group_qr_code,
      group_entry_enabled,
      group_entry_mode,
      attendee_id,
      group_members
    `)
    .eq("event_id", canonicalEventId);

  if (isUUID) {
    orderQuery = orderQuery.or(`id.eq.${cleanRef},group_qr_code.eq.${cleanRef}`);
  } else {
    orderQuery = orderQuery.or(`group_qr_code.eq.${cleanRef},razorpay_order_id.eq.${cleanRef}`);
  }

  const { data: directOrder } = await orderQuery.maybeSingle();
  orderData = directOrder;

  let passQuery = db
    .from("passes")
    .select(`
      id,
      event_id,
      pass_token,
      pass_type,
      status,
      total_guests,
      checked_in_guests,
      group_members,
      order_id,
      is_group_master,
      is_group_pass,
      attendee_id,
      ticket_type:ticket_types (id, name, is_group_pass, included_guests),
      attendee:attendees (id, name, email, pass_type, custom_responses)
    `)
    .eq("event_id", canonicalEventId);

  if (isUUID) {
    passQuery = passQuery.or(`pass_token.eq.${cleanRef},id.eq.${cleanRef}`);
  } else {
    passQuery = passQuery.eq("pass_token", cleanRef);
  }

  const { data: directPass } = await passQuery.maybeSingle();

  if (directPass) {
    passData = directPass;
    if (directPass.order_id && !orderData) {
      const { data: parentOrder } = await db
        .from("ticket_orders")
        .select("*")
        .eq("id", directPass.order_id)
        .maybeSingle();
      orderData = parentOrder;
    }
  }

  if (orderData && !passData) {
    const { data: linkedPass } = await db
      .from("passes")
      .select(`
        id,
        event_id,
        pass_token,
        pass_type,
        status,
        total_guests,
        checked_in_guests,
        group_members,
        order_id,
        is_group_master,
        is_group_pass,
        attendee_id,
        ticket_type:ticket_types (id, name, is_group_pass, included_guests),
        attendee:attendees (id, name, email, pass_type, custom_responses)
      `)
      .eq("order_id", orderData.id)
      .eq("event_id", canonicalEventId)
      .maybeSingle();
    if (linkedPass) passData = linkedPass;
  }

  // Fallback 1: Check if cleanRef starts with URP- or #URP- (human-readable ticket code)
  if (!orderData && !passData) {
    const rawCode = cleanRef.replace(/^#?URP-/i, "").trim();
    if (rawCode.length >= 4) {
      const { data: passByPrefix } = await db
        .from("passes")
        .select(`
          id,
          event_id,
          pass_token,
          pass_type,
          status,
          total_guests,
          checked_in_guests,
          group_members,
          order_id,
          is_group_master,
          is_group_pass,
          attendee_id,
          ticket_type:ticket_types (id, name, is_group_pass, included_guests),
          attendee:attendees (id, name, email, pass_type, custom_responses)
        `)
        .eq("event_id", canonicalEventId)
        .ilike("pass_token", `${rawCode}%`)
        .maybeSingle();

      if (passByPrefix) {
        passData = passByPrefix;
        if (passByPrefix.order_id) {
          const { data: parentOrder } = await db
            .from("ticket_orders")
            .select("*")
            .eq("id", passByPrefix.order_id)
            .maybeSingle();
          orderData = parentOrder;
        }
      }
    }
  }

  // Fallback 2: Check if cleanRef matches a custom ticket ID
  if (!orderData && !passData) {
    try {
      const { data: attendeeWithCustomId } = await db
        .from("attendees")
        .select("id, name, email")
        .eq("event_id", canonicalEventId)
        .contains("custom_responses", { custom_ticket_id: cleanRef })
        .maybeSingle();

      if (attendeeWithCustomId?.id) {
        const { data: passForAttendee } = await db
          .from("passes")
          .select(`
            id,
            event_id,
            pass_token,
            pass_type,
            status,
            total_guests,
              checked_in_guests,
              group_members,
              order_id,
              is_group_master,
              is_group_pass,
              attendee_id,
              ticket_type:ticket_types (id, name, is_group_pass, included_guests),
              attendee:attendees (id, name, email, pass_type, custom_responses)
          `)
          .eq("attendee_id", attendeeWithCustomId.id)
          .eq("event_id", canonicalEventId)
          .maybeSingle();

        if (passForAttendee) {
          passData = passForAttendee;
          if (passForAttendee.order_id) {
            const { data: parentOrder } = await db
              .from("ticket_orders")
              .select("*")
              .eq("id", passForAttendee.order_id)
              .maybeSingle();
            orderData = parentOrder;
          }
        }
      }
    } catch {
      // Non-blocking
    }
  }

  if (!orderData && !passData) {
    const notFoundBody = {
      success: false,
      error: "Group booking or pass reference not found.",
      status: "BOOKING_NOT_FOUND",
      isGroupQR: false,
      credentialType: "UNKNOWN",
    };

    return NextResponse.json(
      notFoundBody,
      { status: action === "lookup" ? 200 : 404 }
    );
  }

  const attendeeObj = passData ? (Array.isArray(passData.attendee) ? passData.attendee[0] : passData.attendee) : null;
  const buyerName = orderData?.buyer_name || attendeeObj?.name || "Group Pass Holder";
  const buyerEmail = orderData?.buyer_email || attendeeObj?.email || "";
  const customResponses = (attendeeObj?.custom_responses as Record<string, any>) || {};

  const ticketTypeObj = passData ? (Array.isArray(passData.ticket_type) ? passData.ticket_type[0] : passData.ticket_type) : null;

  const totalEntitlements = Number(
    orderData?.total_attendee_count ||
    orderData?.total_entitlements ||
    (passData?.total_guests && Number(passData.total_guests) > 1 ? passData.total_guests : null) ||
    customResponses.group_attendee_count ||
    customResponses.bulk_quantity ||
    customResponses.guest_count ||
    (Array.isArray(customResponses.group_members) ? customResponses.group_members.length : null) ||
    passData?.total_guests ||
    1
  );
  const admittedEntitlements = Number(orderData?.admitted_entitlements || passData?.checked_in_guests || 0);
  const remaining = Math.max(0, totalEntitlements - admittedEntitlements);
  const rawStatus = (orderData?.status || passData?.status || "VALID").toUpperCase();

  // Authoritative credential type resolution.
  const isSingleGroupQr = Boolean(
    passData?.is_group_master ||
    passData?.is_group_pass ||
    Number(passData?.total_guests) > 1 ||
    ticketTypeObj?.is_group_pass ||
    Number(ticketTypeObj?.included_guests) > 1 ||
    customResponses.is_single_group_qr === true ||
    customResponses.is_single_group_qr === "true" ||
    Number(customResponses.group_attendee_count) > 1 ||
    Number(customResponses.bulk_quantity) > 1 ||
    Number(customResponses.guest_count) > 1 ||
    (Array.isArray(customResponses.group_members) && customResponses.group_members.length > 1) ||
    customResponses.credential_type === "GROUP_QR" ||
    customResponses.credentialType === "GROUP_QR"
  );

  const isAuthoritativeGroupCredential =
    isSingleGroupQr ||
    Boolean(orderData && orderData.group_entry_enabled && orderData.group_qr_code && orderData.group_qr_code === cleanRef) ||
    cleanRef.startsWith("URP-GRP-") ||
    cleanRef.startsWith("GRP-") ||
    cleanRef.startsWith("GROUP-") ||
    parsedQR.isGroupQR;

  // Background synchronize pass master state only after credential type is explicit.
  if (passData?.id && isSingleGroupQr && (!passData.is_group_master || passData.total_guests !== totalEntitlements)) {
    void Promise.resolve(
      db.from("passes").update({ is_group_master: true, total_guests: totalEntitlements }).eq("id", passData.id)
    ).catch(() => {});
  }

  if (!isAuthoritativeGroupCredential) {
    return NextResponse.json(
      {
        success: false,
        isGroupQR: false,
        credentialType: "INDIVIDUAL_QR",
        status: "NOT_GROUP_PASS",
        message: "Scanned pass is an individual pass, not a group booking.",
      },
      { status: action === "lookup" ? 200 : 422 }
    );
  }

  // If action is Supervisor-only correction of erroneous admissions
  if (action === "supervisor_correction") {
    if (!auditReason || !auditReason.trim()) {
      return NextResponse.json(
        { error: "Supervisor audit reason is mandatory for admission count corrections." },
        { status: 400 }
      );
    }

    const targetAdmitted = Number(correctionQuantity);
    if (isNaN(targetAdmitted) || targetAdmitted < 0 || targetAdmitted > totalEntitlements) {
      return NextResponse.json(
        { error: `Correction count must be between 0 and ${totalEntitlements}.` },
        { status: 400 }
      );
    }

    const newRemaining = totalEntitlements - targetAdmitted;

    // Update in database
    if (orderData?.id) {
      await db
        .from("ticket_orders")
        .update({
          admitted_entitlements: targetAdmitted,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderData.id);
    }

    if (passData?.id) {
      await db
        .from("passes")
        .update({
          checked_in_guests: targetAdmitted,
          status: newRemaining === 0 ? "checked_in" : targetAdmitted > 0 ? "partially_checked_in" : "generated",
          updated_at: new Date().toISOString(),
        })
        .eq("id", passData.id);
    }

    // Insert durable correction audit record
    try {
      await db.from("group_entry_admissions").insert({
        event_id: canonicalEventId,
        order_id: orderData?.id || null,
        pass_id: passData?.id || null,
        group_booking_reference: cleanRef,
        admitted_count: targetAdmitted - admittedEntitlements,
        total_entitlements: totalEntitlements,
        previously_admitted: admittedEntitlements,
        remaining_after: newRemaining,
        entry_mode: "supervisor_correction",
        operator_email: user.email || "supervisor@urpass.space",
        device_id: `supervisor-correction: ${auditReason}`,
        admitted_at: new Date().toISOString(),
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      status: "CORRECTION_APPLIED",
      bookingReference: cleanRef,
      buyerName,
      totalEntitlements,
      admittedEntitlements: targetAdmitted,
      remainingEntries: newRemaining,
      message: `Supervisor corrected admitted balance to ${targetAdmitted}/${totalEntitlements}. Reason: ${auditReason}`,
    });
  }

  // If action is purely a lookup
  if (action === "lookup") {
    if (rawStatus === "REFUNDED" || rawStatus === "CANCELLED" || rawStatus === "EXPIRED" || rawStatus === "REVOKED") {
      return NextResponse.json({
        success: false,
        status: "BOOKING_INVALID",
        error: `Booking is ${rawStatus.toLowerCase()}. Access denied.`,
        bookingReference: cleanRef,
        buyerName,
        totalEntitlements,
        previouslyAdmitted: admittedEntitlements,
        remainingEntries: 0,
      }, { status: 422 });
    }

    if (remaining <= 0) {
      return NextResponse.json({
        success: false,
        status: "EXHAUSTED",
        error: "All group entitlements have already been admitted.",
        bookingReference: cleanRef,
        buyerName,
        totalEntitlements,
        previouslyAdmitted: admittedEntitlements,
        remainingEntries: 0,
      }, { status: 422 });
    }

    let batchHistory: any[] = [];
    try {
      const { data: hist } = await db
        .from("group_entry_admissions")
        .select("id, admitted_count, remaining_after, admitted_at, gate_id")
        .eq("group_booking_reference", cleanRef)
        .order("admitted_at", { ascending: false })
        .limit(5);
      if (hist) {
        batchHistory = hist.map((h) => ({
          id: h.id,
          admittedCount: h.admitted_count,
          remainingAfter: h.remaining_after,
          admittedAt: h.admitted_at,
          gateName: gateName || "Gate A",
        }));
      }
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      status: "VALID",
      credentialType: "GROUP_QR",
      bookingReference: cleanRef,
      buyerName,
      buyerEmail,
      ticketCategory: "General Admission · Group Booking",
      totalEntitlements,
      previouslyAdmitted: admittedEntitlements,
      remainingEntries: remaining,
      entryMode: orderData?.group_entry_mode || entryMode,
      members: orderData?.group_members || passData?.group_members || [],
      history: batchHistory,
    });
  }

  // 5. Execute the database atomic stored procedure. Group admissions must not
  // fall back to non-transactional updates because that can over-admit under
  // concurrent gate scans.
  try {
    const { data: rpcResult, error: rpcErr } = await db.rpc("atomic_group_entry_checkin", {
      p_group_booking_ref: cleanRef,
      p_event_id: canonicalEventId,
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
    return NextResponse.json(
      {
        success: false,
        status: "GROUP_ENTRY_RPC_FAILED",
        error: rpcErr?.message || "Atomic group admission function did not return a result.",
      },
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: "GROUP_ENTRY_RPC_FAILED",
        error: error instanceof Error ? error.message : "Atomic group admission failed.",
      },
      { status: 503 }
    );
  }
}
