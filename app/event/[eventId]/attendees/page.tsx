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

  const { data: event } = await supabase
    .from("events")
    .select("id, name, attendee_limit, application_enabled, apply_slug, organizer_id, organization_id, custom_fields")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) redirect("/dashboard");
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

  const [{ data: attendees }, { data: passes }, { data: ticketOrders }, plan] = await Promise.all([
    supabase
      .from("attendees")
      .select("id, name, email, phone, pass_type, application_status, pass_status, custom_responses, ticket_type_id, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false }),
    supabase
      .from("passes")
      .select("attendee_id, pass_token")
      .eq("event_id", eventId),
    supabase
      .from("ticket_orders")
      .select("id, attendee_id, buyer_email, amount, currency, status, razorpay_payment_id, razorpay_order_id, created_at")
      .eq("event_id", eventId),
    getUserPlan(supabase, user.id),
  ]);

  const initialPassTokens: Record<string, string> = Object.fromEntries(
    (passes ?? []).map((p) => [p.attendee_id, p.pass_token])
  );

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
        canCSV={plan.canCSV}
        canExport={plan.canExport}
        customFields={event.custom_fields ?? []}
      />
    </div>
  );
}
