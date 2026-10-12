import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AttendeeTable from "@/components/event/AttendeeTable";
import { getUserPlan } from "@/lib/plan";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function AttendeesPage({ params }: Props) {
  const { eventId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId);
  const eventQuery = supabase
    .from("events")
    .select("id, name, attendee_limit, application_enabled, apply_slug, organizer_id, organization_id, custom_fields");
  const { data: event } = isUuid
    ? await eventQuery.eq("id", eventId).maybeSingle()
    : await eventQuery.eq("apply_slug", eventId).maybeSingle();

  if (!event) redirect("/dashboard");
  const canonicalEventId = event.id;

  if (event.organizer_id !== user.id) {
    if (!event.organization_id) redirect("/dashboard");
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager", "finance", "gate_manager", "checkin_staff"])
      .maybeSingle();
    if (!member) redirect("/dashboard");
  }

  const [attendeesResult, plan] = await Promise.all([
    supabase
      .from("attendees")
      .select("id, name, email, phone, pass_type, application_status, pass_status, custom_responses, ticket_type_id, created_at, last_scanned_at, venue_presence_state")
      .eq("event_id", canonicalEventId)
      .order("created_at", { ascending: false }),
    getUserPlan(supabase, user.id),
  ]);

  let attendees = attendeesResult.data;
  if (attendeesResult.error) {
    const { data: fallbackAttendees } = await supabase
      .from("attendees")
      .select("id, name, email, phone, pass_type, application_status, pass_status, custom_responses, ticket_type_id, created_at")
      .eq("event_id", canonicalEventId)
      .order("created_at", { ascending: false });
    attendees = fallbackAttendees?.map((a) => ({
      ...a,
      last_scanned_at: null,
      venue_presence_state: null,
    })) ?? null;
  }

  const [
    { data: passesWithGroupColumns, error: passesError },
    { data: ticketOrders },
    { data: checkinsData },
    { data: groupAdmissionsData },
  ] = await Promise.all([
    supabase
      .from("passes")
      .select("id, attendee_id, pass_token, total_guests, checked_in_guests, is_group_master, is_group_pass, status, updated_at")
      .eq("event_id", canonicalEventId),
    supabase
      .from("ticket_orders")
      .select("id, attendee_id, buyer_email, amount, currency, status, razorpay_payment_id, razorpay_order_id, created_at")
      .eq("event_id", canonicalEventId),
    supabase
      .from("check_ins")
      .select("attendee_id, gate_id, check_in_method, checked_in_at, gate:scanner_gates(name)")
      .eq("event_id", canonicalEventId)
      .order("checked_in_at", { ascending: false }),
    supabase
      .from("group_entry_admissions")
      .select("id, pass_id, order_id, group_booking_reference, admitted_count, total_entitlements, remaining_after, admitted_at, gate:scanner_gates(name)")
      .eq("event_id", canonicalEventId)
      .order("admitted_at", { ascending: false }),
  ]);

  let passes = passesWithGroupColumns;
  if (passesError) {
    const { data: fallbackPasses } = await supabase
      .from("passes")
      .select("id, attendee_id, pass_token, total_guests, checked_in_guests, is_group_master, status, updated_at")
      .eq("event_id", canonicalEventId);
    passes = fallbackPasses?.map((p) => ({ ...p, is_group_pass: false })) ?? null;
  }

  const initialPassTokens: Record<string, string> = Object.fromEntries(
    (passes ?? []).map((p) => [p.attendee_id, p.pass_token])
  );

  // Map passId and orderId to attendeeId for linking group entry admissions
  const passToAttendeeMap = new Map<string, string>();
  for (const p of passes ?? []) {
    if (p.id && p.attendee_id) {
      passToAttendeeMap.set(p.id, p.attendee_id);
    }
  }

  const orderToAttendeeMap = new Map<string, string>();
  for (const o of ticketOrders ?? []) {
    if (o.id && o.attendee_id) {
      orderToAttendeeMap.set(o.id, o.attendee_id);
    }
  }

  // Group admissions history per attendee
  const admissionsByAttendee = new Map<string, Array<{
    id: string;
    admittedCount: number;
    totalEntitlements: number;
    remainingAfter: number;
    admittedAt: string;
    gateName: string;
  }>>();

  for (const adm of (groupAdmissionsData ?? []) as any[]) {
    const targetAttendeeId =
      (adm.pass_id && passToAttendeeMap.get(adm.pass_id)) ||
      (adm.order_id && orderToAttendeeMap.get(adm.order_id)) ||
      null;

    if (targetAttendeeId) {
      const gateObj = adm.gate;
      const gateName = Array.isArray(gateObj) ? gateObj[0]?.name : gateObj?.name || "Main Gate";
      const list = admissionsByAttendee.get(targetAttendeeId) ?? [];
      list.push({
        id: adm.id,
        admittedCount: Number(adm.admitted_count || 1),
        totalEntitlements: Number(adm.total_entitlements || 1),
        remainingAfter: Number(adm.remaining_after || 0),
        admittedAt: adm.admitted_at,
        gateName,
      });
      admissionsByAttendee.set(targetAttendeeId, list);
    }
  }

  const groupPassMap: Record<string, {
    totalGuests: number;
    checkedInGuests: number;
    isGroupMaster: boolean;
    lastAdmittedAt?: string;
    admissions?: Array<{
      id: string;
      admittedCount: number;
      totalEntitlements: number;
      remainingAfter: number;
      admittedAt: string;
      gateName: string;
    }>;
  }> = {};

  for (const p of passes ?? []) {
    if (p.attendee_id && (p.is_group_master || p.is_group_pass)) {
      groupPassMap[p.attendee_id] = {
        totalGuests: Number(p.total_guests || 1),
        checkedInGuests: Number(p.checked_in_guests || 0),
        isGroupMaster: Boolean(p.is_group_master),
        lastAdmittedAt: p.updated_at,
        admissions: admissionsByAttendee.get(p.attendee_id),
      };
    }
  }

  for (const a of attendees ?? []) {
    const cr = (a.custom_responses as Record<string, any>) || {};
    const isGroup = Boolean(
      cr.is_single_group_qr === true ||
      cr.is_single_group_qr === "true" ||
      cr.credential_type === "GROUP_QR" ||
      cr.credentialType === "GROUP_QR"
    );
    if (isGroup) {
      const count = Number(cr.group_attendee_count || cr.bulk_quantity || cr.guest_count || 1);
      const existing = groupPassMap[a.id];
      groupPassMap[a.id] = {
        totalGuests: Math.max(existing?.totalGuests || 1, count),
        checkedInGuests: Number(existing?.checkedInGuests ?? (a.pass_status === "checked_in" ? count : 0)),
        isGroupMaster: true,
        lastAdmittedAt: existing?.lastAdmittedAt || a.last_scanned_at || undefined,
        admissions: existing?.admissions || admissionsByAttendee.get(a.id),
      };
    }
  }

  // Build latest check-in info map per attendee
  const checkInInfoMap: Record<string, {
    gateName: string;
    checkedInAt: string;
    checkInMethod?: string;
  }> = {};

  for (const chk of (checkinsData ?? []) as any[]) {
    if (chk.attendee_id && !checkInInfoMap[chk.attendee_id]) {
      const gateObj = chk.gate;
      const gateName = Array.isArray(gateObj) ? gateObj[0]?.name : gateObj?.name || "Main Gate";
      checkInInfoMap[chk.attendee_id] = {
        gateName,
        checkedInAt: chk.checked_in_at,
        checkInMethod: chk.check_in_method || "qr",
      };
    }
  }

  const payments: Record<string, {
    orderId: string;
    paymentId: string | null;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
  }> = {};

  for (const order of ticketOrders ?? []) {
    const entry = {
      orderId: order.razorpay_order_id || order.id,
      paymentId: order.razorpay_payment_id || null,
      amount: Number(order.amount || 0),
      currency: order.currency || "INR",
      status: order.status,
      createdAt: order.created_at,
    };
    if (order.attendee_id) {
      payments[order.attendee_id] = entry;
    }
    if (order.buyer_email) {
      payments[`email:${order.buyer_email.toLowerCase()}`] = entry;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-0 py-6 page-in">
      <AttendeeTable
        attendees={attendees ?? []}
        eventId={eventId}
        eventName={event.name}
        attendeeLimit={event.attendee_limit}
        applySlug={event.apply_slug}
        applicationEnabled={event.application_enabled}
        initialPassTokens={initialPassTokens}
        payments={payments}
        groupPassMap={groupPassMap}
        checkInInfoMap={checkInInfoMap}
        canCSV={plan.canCSV}
        canExport={plan.canExport}
        customFields={event.custom_fields ?? []}
      />
    </div>
  );
}
