import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { CalendarDays, Ticket, ScanLine, Wifi, LayoutGrid } from "lucide-react";
import ApplyForm from "./ApplyForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("name, venue, event_date")
    .eq("id", eventId)
    .eq("status", "active")
    .single();

  if (!event) return { title: "Apply for Event" };
  const date = new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return {
    title: `Apply — ${event.name}`,
    description: `Register for ${event.name} at ${event.venue} on ${date}. Get your digital pass instantly on approval.`,
    openGraph: {
      title: `Apply for ${event.name}`,
      description: `Register for ${event.name} at ${event.venue} on ${date}.`,
    },
  };
}

export interface ApplyTicketType {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  capacity: number | null;
  max_per_person: number;
  remaining: number | null;
}

interface EventInfo {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  start_time: string;
  venue: string;
  auto_approve: boolean;
  is_paid_event: boolean;
  ticket_price: number;
  event_type: string;
}

interface Branding {
  showUrpassBranding: boolean;
  orgName: string | null;
  brandColor: string;
  orgLogoUrl: string | null;
}

const gradientBg = "radial-gradient(ellipse 100% 50% at 50% -10%, #ede9fe 0%, #f5f3ff 40%, #ffffff 70%)";

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId: slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, description, event_date, start_time, venue, auto_approve, is_paid_event, ticket_price, organizer_id, organization_id, event_type")
    .eq("apply_slug", slug)
    .eq("status", "active")
    .eq("application_enabled", true)
    .single();

  if (!event) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: gradientBg }}
      >
        <div className="flex items-center gap-1.5 mb-10 apply-in-1">
          <Ticket className="w-4 h-4 text-brand" />
          <span className="text-sm font-bold tracking-widest uppercase text-neutral-900">
            URPASS
          </span>
        </div>
        <div className="text-center max-w-sm apply-in-2">
          <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CalendarDays className="w-6 h-6 text-brand" />
          </div>
          <h1 className="text-xl font-bold mb-2">Applications closed</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            This event is not currently accepting applications.
          </p>
          <p className="text-xs text-neutral-300 mt-8">Powered by URPASS</p>
        </div>
      </div>
    );
  }

  // Fetch organizer branding — must use admin client because subscriptions and profiles
  // have owner-only RLS policies; anonymous visitors cannot read another user's rows.
  const adminForBranding = adminClient();
  const [{ data: sub }, { data: orgProfileRaw }] = await Promise.all([
    adminForBranding
      .from("subscriptions")
      .select("plan:plans(slug)")
      .eq("user_id", event.organizer_id)
      .eq("status", "active")
      .single(),
    adminForBranding
      .from("profiles")
      .select("org_name, brand_color, org_logo_url, hide_urpass_branding")
      .eq("user_id", event.organizer_id)
      .single(),
  ]);

  const planSlug = (sub?.plan as unknown as { slug: string } | null)?.slug ?? "free";
  console.log("[apply] organizer_id:", event.organizer_id, "planSlug:", planSlug);
  const isPro = planSlug === "pro";
  const canRemoveBranding = planSlug !== "free";
  const orgProfile = canRemoveBranding ? orgProfileRaw : null;

  const branding: Branding = {
    showUrpassBranding: !(canRemoveBranding && orgProfile?.hide_urpass_branding),
    orgName: (isPro && orgProfile?.org_name) ? orgProfile.org_name : null,
    brandColor: (isPro && orgProfile?.brand_color) ? orgProfile.brand_color : "#6D28D9",
    orgLogoUrl: (isPro && orgProfile?.org_logo_url) ? orgProfile.org_logo_url : null,
  };

  // Check if current user is logged-in staff for this event
  let staffScanLink: string | null = null;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const isOrganizer = event.organizer_id === user.id;
    if (isOrganizer) {
      staffScanLink = `/scan/${event.id}`;
    } else if (event.organization_id) {
      // Check if user is an active org member with check-in access for this event's org
      const { data: member } = await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", event.organization_id)
        .eq("user_id", user.id)
        .eq("status", "active")
        .in("role", ["owner", "admin", "event_manager", "checkin_staff"])
        .maybeSingle();
      if (member) staffScanLink = `/scan/${event.id}`;
    }
  }

  const isOnline = event.event_type === "online";
  const isHybrid = event.event_type === "hybrid";
  const admin = adminClient();

  // Use admin client to fetch all non-closed ticket types regardless of status.
  // This is a server component so the service role key is never exposed.
  const { data: ticketTypeRows, error: ticketErr } = await admin
    .from("ticket_types")
    .select("id, name, description, category, price, capacity, max_per_person, sales_start, sales_end, position, status")
    .eq("event_id", event.id)
    .neq("status", "closed")
    .order("position", { ascending: true });
  console.log("[apply] event.id:", event.id, "ticketTypeRows:", ticketTypeRows?.length ?? 0, "err:", ticketErr?.message);

  const ticketTypeIds = (ticketTypeRows ?? []).map((ticketType) => ticketType.id);
  const { data: ticketTypeAttendees } = ticketTypeIds.length
    ? await admin
        .from("attendees")
        .select("ticket_type_id")
        .eq("event_id", event.id)
        .neq("application_status", "rejected")
        .in("ticket_type_id", ticketTypeIds)
    : { data: [] };

  const reservedByTicketType = new Map<string, number>();
  for (const attendee of ticketTypeAttendees ?? []) {
    if (!attendee.ticket_type_id) continue;
    reservedByTicketType.set(
      attendee.ticket_type_id,
      (reservedByTicketType.get(attendee.ticket_type_id) ?? 0) + 1
    );
  }

  const now = Date.now();
  const ticketTypes: ApplyTicketType[] = (ticketTypeRows ?? [])
    .filter((ticketType) => {
      const startsAt = ticketType.sales_start ? new Date(ticketType.sales_start).getTime() : null;
      const endsAt = ticketType.sales_end ? new Date(ticketType.sales_end).getTime() : null;
      return (startsAt == null || startsAt <= now) && (endsAt == null || endsAt >= now);
    })
    .map((ticketType) => {
      const reserved = reservedByTicketType.get(ticketType.id) ?? 0;
      return {
        id: ticketType.id,
        name: ticketType.name,
        description: ticketType.description,
        category: ticketType.category,
        price: ticketType.price,
        capacity: ticketType.capacity,
        max_per_person: ticketType.max_per_person,
        remaining: ticketType.capacity == null ? null : Math.max(0, ticketType.capacity - reserved),
      };
    });

  // Check payment gateway only when the event has any paid flow
  const hasPaidTicketTypes = ticketTypes.some((t) => t.price > 0);
  const isPaidFlow = event.is_paid_event || hasPaidTicketTypes;
  let hasPaymentGateway = !isPaidFlow; // free events don't need a gateway
  if (isPaidFlow) {
    const { data: ps } = await admin
      .from("payment_settings")
      .select("razorpay_key_id")
      .eq("user_id", event.organizer_id)
      .single();
    hasPaymentGateway = !!(ps?.razorpay_key_id);
  }

  return (
    <>
      {staffScanLink && (
        <div className="fixed top-0 inset-x-0 z-50 flex flex-col"
          style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" }}>
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-white text-sm font-semibold">
            <div className="flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-white/70" />
              <span>Staff view</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/event/${event.id}/tickets`}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Tickets
              </Link>
              <Link
                href={staffScanLink}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                <ScanLine className="w-3.5 h-3.5" />
                Scanner
              </Link>
            </div>
          </div>
          {ticketTypes.length === 0 && (
            <div className="flex items-center justify-between gap-3 px-4 py-2 bg-amber-500/30 border-t border-white/10 text-xs">
              <span className="text-white/90">No ticket types — visitors can't select one</span>
              <Link
                href={`/event/${event.id}/tickets/new`}
                className="bg-white/20 hover:bg-white/30 transition-colors px-2.5 py-1 rounded-md font-bold text-white shrink-0"
              >
                Add ticket →
              </Link>
            </div>
          )}
        </div>
      )}
      {isOnline && (
        <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border-b border-blue-100"
          style={{ top: staffScanLink ? 44 : 0 }}>
          <Wifi className="w-4 h-4 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-700 font-medium">
            Online Event — you&apos;ll receive joining instructions on your pass after approval.
          </p>
        </div>
      )}
      {isHybrid && (
        <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-50 border-b border-violet-100"
          style={{ top: staffScanLink ? 44 : 0 }}>
          <LayoutGrid className="w-4 h-4 text-violet-600 shrink-0" />
          <p className="text-sm text-violet-700 font-medium">
            Hybrid Event — attend in-person or join online.
          </p>
        </div>
      )}
      <ApplyForm
        event={event as EventInfo}
        branding={branding}
        staffScanLink={staffScanLink}
        ticketTypes={ticketTypes}
        hasPaymentGateway={hasPaymentGateway}
        eventSlug={slug}
      />
    </>
  );
}
