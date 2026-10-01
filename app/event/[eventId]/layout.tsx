import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layouts/AppShell";
import EventHeader from "@/components/event/EventHeader";
import { getUserPlan } from "@/lib/plan";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("name, venue")
    .eq("id", eventId)
    .single();

  if (!event) return { title: "Event" };
  return {
    title: event.name,
    description: `Manage attendees, passes, and check-in for ${event.name} at ${event.venue}.`,
    robots: { index: false, follow: false },
  };
}

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: event }, { data: profile }, plan, { data: memberships }] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, status, event_date, start_time, end_time, venue, organizer_id, organization_id, apply_slug")
      .eq("id", eventId)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", user.id)
      .single(),
    getUserPlan(supabase, user.id),
    supabase
      .from("organization_members")
      .select("role, organization_id, organization:organizations(slug, name, brand_color)")
      .eq("user_id", user.id)
      .eq("status", "active"),
  ]);

  if (!event) notFound();
  if (event.organizer_id !== user.id) {
    const isMember = Boolean(
      event.organization_id &&
      memberships?.some((m) => m.organization_id === event.organization_id)
    );
    if (!isMember) notFound();
  }

  const fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "Organizer";
  const email    = profile?.email ?? user.email ?? "";

  // Supabase returns related records as objects (not arrays) for single FK joins
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgs = ((memberships ?? []) as any[])
    .filter((m) => m.organization != null)
    .map((m) => {
      const org = Array.isArray(m.organization) ? m.organization[0] : m.organization;
      if (!org) return null;
      return {
        slug: org.slug as string,
        name: org.name as string,
        brand_color: org.brand_color as string,
        role: m.role as string,
      };
    })
    .filter(Boolean) as { slug: string; name: string; brand_color: string; role: string }[];

  const matchingOrg = event.organization_id
    ? orgs.find((o) =>
        (memberships ?? []).some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (m: any) =>
            m.organization_id === event.organization_id &&
            (Array.isArray(m.organization) ? m.organization[0]?.slug : m.organization?.slug) === o.slug
        )
      ) || null
    : null;

  return (
    <AppShell fullName={fullName} email={email} planSlug={plan.slug} orgs={orgs}>
      {/* ── Executive Pinned Global Breadcrumbs & Event Sub-Header ── */}
      <EventHeader
        event={{
          id: event.id,
          name: event.name,
          status: event.status,
          event_date: event.event_date,
          start_time: event.start_time,
          end_time: event.end_time,
          venue: event.venue,
          apply_slug: event.apply_slug,
        }}
        org={matchingOrg ? { name: matchingOrg.name, slug: matchingOrg.slug } : null}
      />

      {/* ── Page content ──────────────────────────────────────── */}
      <div className="px-4 lg:px-8 py-6">{children}</div>
    </AppShell>
  );
}
