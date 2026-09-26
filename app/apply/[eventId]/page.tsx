import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { CalendarDays, Ticket, ScanLine, Wifi, LayoutGrid } from "lucide-react";
import ApplyForm from "./ApplyForm";
import { getSupabaseUrl } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId: idOrSlug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const supabase = await createClient();
  const query = supabase
    .from("events")
    .select("id, name, venue, event_date, start_time, description, apply_slug, status")
    .eq("status", "active");

  const { data: event } = await (isUuid
    ? query.eq("id", idOrSlug)
    : query.eq("apply_slug", idOrSlug)
  ).maybeSingle();

  if (!event) return { title: "Register for Event — URPASS" };
  const date = new Date(event.event_date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const canonicalUrl = `https://urpass.space/apply/${event.apply_slug || event.id}`;
  const desc = event.description
    ? `${event.description.slice(0, 150)}... Register now for ${event.name} at ${event.venue} on ${date}.`
    : `Register for ${event.name} at ${event.venue} on ${date}. Get your digital QR event pass instantly on approval.`;

  return {
    title: `Register for ${event.name} — Passes & Entry`,
    description: desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: `${event.name} — Registration & Entry Pass`,
      description: desc,
      url: canonicalUrl,
      siteName: "URPASS",
      locale: "en_IN",
      images: [
        {
          url: "https://urpass.space/og-image.png",
          width: 1200,
          height: 630,
          alt: `${event.name} on URPASS`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} — Register Now`,
      description: desc,
      images: ["https://urpass.space/og-image.png"],
    },
    other: {
      "geo.placename": event.venue || "India",
      "geo.region": "IN",
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
  sales_start?: string | null;
  sales_end?: string | null;
  isUpcoming?: boolean;
  isEnded?: boolean;
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
  attendee_limit: number;
  event_type: string;
  apply_slug?: string | null;
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
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId: idOrSlug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const supabase = await createClient();

  const query = supabase
    .from("events")
    .select("id, name, description, event_date, start_time, venue, auto_approve, is_paid_event, ticket_price, attendee_limit, organizer_id, organization_id, event_type, apply_slug")
    .eq("status", "active")
    .eq("application_enabled", true);

  const { data: event } = await (isUuid
    ? query.eq("id", idOrSlug)
    : query.eq("apply_slug", idOrSlug)
  ).maybeSingle();

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
      .select("plan:plans(slug), is_trial, trial_ends_at")
      .eq("user_id", event.organizer_id)
      .in("status", ["active", "trialing"])
      .maybeSingle(),
    adminForBranding
      .from("profiles")
      .select("org_name, brand_color, org_logo_url, hide_urpass_branding")
      .eq("user_id", event.organizer_id)
      .single(),
  ]);

  const isTrialExpired = sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) < new Date();
  const planSlug = isTrialExpired ? "free" : ((sub?.plan as unknown as { slug: string } | null)?.slug ?? "free");
  console.log("[apply] organizer_id:", event.organizer_id, "planSlug:", planSlug);
  const isPro = ["pro", "business", "campus", "enterprise"].includes(planSlug);
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

  // Use admin client to fetch all non-closed ticket types.
  let { data: ticketTypeRows, error: ticketErr } = await admin
    .from("ticket_types")
    .select("id, name, description, category, price, capacity, max_per_person, sales_start, sales_end, position, status")
    .eq("event_id", event.id)
    .neq("status", "closed")
    .order("position", { ascending: true });

  // If this event has no ticket types in the database, auto-create a default General Admission
  // tier so visitors can always select a pass.
  if (!ticketTypeRows || ticketTypeRows.length === 0) {
    const defaultData = {
      event_id: event.id,
      name: "General Admission",
      description: event.is_paid_event ? "Standard event ticket" : "Standard registration",
      category: "general",
      price: event.is_paid_event ? Math.round(Number(event.ticket_price) * 100) : 0,
      capacity: event.attendee_limit,
      max_per_person: 1,
      status: "on_sale",
      position: 0,
    };

    const { data: defaultTT } = await admin
      .from("ticket_types")
      .insert(defaultData)
      .select("id, name, description, category, price, capacity, max_per_person, sales_start, sales_end, position, status")
      .single();

    if (defaultTT) {
      ticketTypeRows = [defaultTT];
    } else {
      ticketTypeRows = [
        {
          id: "default",
          ...defaultData,
          sales_start: null,
          sales_end: null,
        },
      ];
    }
  }

  const ticketTypeIds = (ticketTypeRows ?? [])
    .map((ticketType) => ticketType.id)
    .filter((id) => id !== "default");

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

  const nowTimestamp = Date.now();
  const ticketTypes: ApplyTicketType[] = (ticketTypeRows ?? []).map((ticketType) => {
    const startsAt = ticketType.sales_start ? new Date(ticketType.sales_start).getTime() : null;
    const endsAt = ticketType.sales_end ? new Date(ticketType.sales_end).getTime() : null;
    const isUpcoming = startsAt != null && startsAt > nowTimestamp;
    const isEnded = endsAt != null && endsAt < nowTimestamp;
    const reserved = reservedByTicketType.get(ticketType.id) ?? 0;
    return {
      id: ticketType.id,
      name: ticketType.name,
      description: ticketType.description,
      category: ticketType.category,
      price: ticketType.price,
      capacity: ticketType.capacity,
      max_per_person: ticketType.max_per_person,
      sales_start: ticketType.sales_start,
      sales_end: ticketType.sales_end,
      isUpcoming,
      isEnded,
      remaining: ticketType.capacity == null ? null : Math.max(0, ticketType.capacity - reserved),
    };
  });

  // Check payment gateway only when the event has any paid flow
  const hasPaidTicketTypes = ticketTypes.some((t) => t.price > 0);
  const isPaidFlow = event.is_paid_event || hasPaidTicketTypes;
  let hasPaymentGateway = !isPaidFlow; // free events don't need a gateway
  if (isPaidFlow) {
    if (event.organization_id) {
      const { data: orgPs } = await admin
        .from("org_payment_settings")
        .select("razorpay_key_id")
        .eq("organization_id", event.organization_id)
        .maybeSingle();
      if (orgPs?.razorpay_key_id) {
        hasPaymentGateway = true;
      }
    }

    if (!hasPaymentGateway) {
      const { data: ps } = await admin
        .from("payment_settings")
        .select("razorpay_key_id")
        .eq("user_id", event.organizer_id)
        .maybeSingle();
      hasPaymentGateway = !!(ps?.razorpay_key_id);
    }
  }

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description || `Register for ${event.name} at ${event.venue}.`,
    startDate: event.event_date + (event.start_time ? `T${event.start_time}:00+05:30` : "T09:00:00+05:30"),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : isHybrid
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: isOnline
      ? {
          "@type": "VirtualLocation",
          url: `https://urpass.space/apply/${event.apply_slug || event.id}`,
        }
      : {
          "@type": "Place",
          name: event.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: event.venue,
            addressCountry: "IN",
          },
        },
    organizer: {
      "@type": "Organization",
      name: branding.orgName || "URPASS Organizer",
      url: "https://urpass.space",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...(ticketTypes.length ? ticketTypes.map((t) => t.price) : [event.ticket_price || 0])),
      highPrice: Math.max(...(ticketTypes.length ? ticketTypes.map((t) => t.price) : [event.ticket_price || 0])),
      offerCount: ticketTypes.length || 1,
      availability: "https://schema.org/InStock",
      url: `https://urpass.space/apply/${event.apply_slug || event.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
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
              <span className="text-white/90">No ticket types — visitors cannot select one</span>
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
      />
    </>
  );
}
