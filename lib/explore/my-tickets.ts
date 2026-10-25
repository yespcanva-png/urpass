import "server-only";

import { adminClient } from "@/lib/supabase/admin";

export type ExploreTicket = {
  id: string;
  eventId: string;
  name: string;
  date: string;
  startTime: string;
  venue: string;
  image: string | null;
  status: "upcoming" | "past" | "cancelled";
  statusLabel: string;
  ticketLabel: string;
  quantity: number;
  passes: { token: string; name: string; type: string }[];
  refundStatus: string | null;
  canShare: boolean;
};

type Order = {
  id: string;
  event_id: string;
  attendee_id: string | null;
  buyer_email: string;
  status: string;
  refund_status: string | null;
  total_attendee_count: number | null;
  group_qr_code: string | null;
  group_members: { name?: string; attendeeId?: string; passToken?: string }[] | null;
  ticket_type_id: string | null;
  created_at: string;
};

type Attendee = { id: string; event_id: string; name: string; email: string; pass_type: string; application_status: string };
type Pass = { attendee_id: string; event_id: string; pass_token: string; pass_type: string; status: string };
type Event = { id: string; name: string; event_date: string; start_time: string; venue: string; banner_url: string | null; logo_url: string | null; status: string; whatsapp_settings: { allow_pass_sharing?: boolean } | null; custom_pass_design: { allow_pass_sharing?: boolean } | null };

/** The caller must first authenticate the user and verify ownership of email. */
export async function getExploreTickets(verifiedEmail: string): Promise<ExploreTicket[]> {
  const db = adminClient();
  const email = verifiedEmail.trim().toLowerCase();
  // Escape LIKE metacharacters, then check exact normalized email again below.
  const emailPattern = email.replace(/[\\%_]/g, "\\$&");
  const [ordersResult, attendeesResult] = await Promise.all([
    db.from("ticket_orders")
      .select("id, event_id, attendee_id, buyer_email, status, refund_status, total_attendee_count, group_qr_code, group_members, ticket_type_id, created_at")
      .ilike("buyer_email", emailPattern)
      .in("status", ["paid", "refunded", "partially_refunded", "cancelled"])
      .order("created_at", { ascending: false })
      .limit(500),
    db.from("attendees")
      .select("id, event_id, name, email, pass_type, application_status")
      .ilike("email", emailPattern)
      .eq("application_status", "approved")
      .limit(500),
  ]);
  if (ordersResult.error) throw ordersResult.error;
  if (attendeesResult.error) throw attendeesResult.error;

  const orders = ((ordersResult.data ?? []) as Order[]).filter((o) => o.buyer_email?.trim().toLowerCase() === email);
  const attendees = ((attendeesResult.data ?? []) as Attendee[]).filter((a) => a.email?.trim().toLowerCase() === email);
  const eventIds = [...new Set([...orders.map((o) => o.event_id), ...attendees.map((a) => a.event_id)])];
  if (!eventIds.length) return [];

  const attendeeIds = [...new Set([...attendees.map((a) => a.id), ...orders.map((o) => o.attendee_id).filter((id): id is string => !!id), ...orders.flatMap((o) => Array.isArray(o.group_members) ? o.group_members.map((member) => member.attendeeId).filter((id): id is string => !!id) : [])])];
  const groupTokens = [...new Set([...orders.map((o) => o.group_qr_code), ...orders.flatMap((o) => Array.isArray(o.group_members) ? o.group_members.map((member) => member.passToken) : [])].filter((token): token is string => !!token))];
  const [eventsResult, passesResult, groupPassesResult, itemsResult, typesResult] = await Promise.all([
    db.from("events").select("id, name, event_date, start_time, venue, banner_url, logo_url, status, whatsapp_settings, custom_pass_design").in("id", eventIds),
    attendeeIds.length
      ? db.from("passes").select("attendee_id, event_id, pass_token, pass_type, status").in("attendee_id", attendeeIds)
      : Promise.resolve({ data: [], error: null }),
    groupTokens.length
      ? db.from("passes").select("attendee_id, event_id, pass_token, pass_type, status").in("pass_token", groupTokens)
      : Promise.resolve({ data: [], error: null }),
    orders.length
      ? db.from("ticket_order_items").select("order_id, ticket_type_name, quantity").in("order_id", orders.map((o) => o.id))
      : Promise.resolve({ data: [], error: null }),
    orders.some((o) => o.ticket_type_id)
      ? db.from("ticket_types").select("id, name").in("id", orders.map((o) => o.ticket_type_id).filter((id): id is string => !!id))
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (eventsResult.error) throw eventsResult.error;
  if (passesResult.error) throw passesResult.error;
  if (groupPassesResult.error) throw groupPassesResult.error;
  // Older installations may not have line items; a booking still has its pass.
  const events = new Map(((eventsResult.data ?? []) as Event[]).map((event) => [event.id, event]));
  const allPasses = [...((passesResult.data ?? []) as Pass[]), ...((groupPassesResult.data ?? []) as Pass[])];
  const byAttendee = new Map(attendees.map((a) => [a.id, a]));
  const items = (itemsResult.data ?? []) as { order_id: string; ticket_type_name: string; quantity: number }[];
  const types = new Map(((typesResult.data ?? []) as { id: string; name: string }[]).map((type) => [type.id, type.name]));
  const now = Date.now();

  function shape(event: Event, id: string, order: Order | null, relatedPasses: Pass[], fallbackAttendee?: Attendee): ExploreTicket {
    const cancelled = event.status === "cancelled" || !!order && ["refunded", "cancelled"].includes(order.status);
    const eventStart = new Date(`${event.event_date}T${event.start_time || "00:00:00"}`).getTime();
    const status = cancelled ? "cancelled" : eventStart < now ? "past" : "upcoming";
    const orderItems = order ? items.filter((item) => item.order_id === order.id) : [];
    const uniquePasses = [...new Map(relatedPasses.filter((pass) => pass.status !== "refunded").map((pass) => [pass.pass_token, {
      token: pass.pass_token,
      name: (order && Array.isArray(order.group_members) ? order.group_members.find((member) => member.passToken === pass.pass_token || member.attendeeId === pass.attendee_id)?.name : null) || byAttendee.get(pass.attendee_id)?.name || fallbackAttendee?.name || "Event guest",
      type: pass.pass_type,
    }])).values()];
    const quantity = orderItems.length
      ? orderItems.reduce((sum, item) => sum + item.quantity, 0)
      : Math.max(order?.total_attendee_count || 0, uniquePasses.length, 1);
    const ticketLabel = orderItems.length
      ? orderItems.map((item) => `${item.quantity} × ${item.ticket_type_name}`).join(", ")
      : `${quantity} × ${order?.ticket_type_id ? types.get(order.ticket_type_id) || "Admission" : fallbackAttendee?.pass_type || "Admission"}`;
    return {
      id, eventId: event.id, name: event.name, date: event.event_date, startTime: event.start_time,
      venue: event.venue, image: event.banner_url || event.logo_url,
      status, statusLabel: cancelled ? (order?.status === "refunded" ? "Refunded" : "Cancelled") : status === "past" ? "Completed" : "Confirmed",
      ticketLabel, quantity, passes: uniquePasses, refundStatus: order?.refund_status || null,
      canShare: event.whatsapp_settings?.allow_pass_sharing !== false && event.custom_pass_design?.allow_pass_sharing !== false,
    };
  }

  const tickets: ExploreTicket[] = [];
  const coveredAttendeeIds = new Set<string>();
  for (const order of orders) {
    const event = events.get(order.event_id);
    if (!event) continue;
    if (order.attendee_id) coveredAttendeeIds.add(order.attendee_id);
    const memberIds = new Set(Array.isArray(order.group_members) ? order.group_members.map((member) => member.attendeeId).filter(Boolean) : []);
    const memberTokens = new Set(Array.isArray(order.group_members) ? order.group_members.map((member) => member.passToken).filter(Boolean) : []);
    const related = allPasses.filter((pass) => pass.event_id === order.event_id &&
      (pass.attendee_id === order.attendee_id || pass.pass_token === order.group_qr_code || memberIds.has(pass.attendee_id) || memberTokens.has(pass.pass_token)));
    tickets.push(shape(event, `order-${order.id}`, order, related, attendees.find((a) => a.id === order.attendee_id)));
  }
  for (const attendee of attendees) {
    if (coveredAttendeeIds.has(attendee.id)) continue;
    const event = events.get(attendee.event_id);
    if (!event) continue;
    const related = allPasses.filter((pass) => pass.attendee_id === attendee.id && pass.event_id === attendee.event_id);
    if (!related.length) continue;
    tickets.push(shape(event, `attendee-${attendee.id}`, null, related, attendee));
  }
  return tickets.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
}
