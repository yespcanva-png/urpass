import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getExploreEligibility } from "@/lib/explore/eligibility";

export const dynamic = "force-dynamic";
export const metadata = { title: "Private Explore preview | UrPass", robots: { index: false, follow: false } };

export default async function ExplorePreview({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(eventId)) notFound();
  const db = adminClient();
  const { data: event } = await db.from("events").select("id, name, description, banner_url, logo_url, event_date, start_time, venue, organizer_id, organization_id, apply_slug").eq("id", eventId).maybeSingle();
  if (!event) notFound();
  const ops = await isOpsAuthenticated();
  if (!ops) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) notFound();
    if (user.id !== event.organizer_id) {
      const { data: member } = await db.from("organization_members").select("id")
        .eq("organization_id", event.organization_id).eq("user_id", user.id)
        .eq("status", "active").in("role", ["owner", "admin", "event_manager"]).maybeSingle();
      if (!member) notFound();
    }
  }
  const { data: listing } = await db.from("explore_marketplace_listings")
    .select("status, category, city, editorial_summary").eq("event_id", eventId).maybeSingle();
  const assessment = await getExploreEligibility(eventId, {
    city: listing?.city || "Bengaluru", category: listing?.category || "community",
    editorialSummary: listing?.editorial_summary,
  });
  return <main className="min-h-screen bg-neutral-50 p-5 text-neutral-900 sm:p-10">
    <div className="mx-auto max-w-3xl"><Link href={ops ? "/ops/explore" : `/event/${eventId}`} className="text-sm font-semibold text-violet-700">← Back</Link>
      <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800"><strong>Private preview</strong> · {listing?.status || "Not submitted"}. Only authorized organizers and admins can view this page.</div>
      <article className="mt-5 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="relative aspect-[16/9] bg-violet-100">{event.banner_url || event.logo_url ? <Image src={event.banner_url || event.logo_url} alt={event.name} fill unoptimized className="object-cover" /> : null}</div>
        <div className="p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wide text-violet-700">{listing?.category || "Category pending"} · {listing?.city || "City pending"}</p>
          <h1 className="mt-3 text-3xl font-bold">{event.name}</h1>
          <p className="mt-4 text-sm text-neutral-600">{event.event_date} · {event.start_time} · {event.venue}</p>
          <p className="mt-5 whitespace-pre-wrap text-neutral-700">{listing?.editorial_summary || event.description}</p>
          <p className="mt-6 text-xl font-bold">{assessment.isFree ? "Free" : `From ₹${(assessment.minPricePaise / 100).toLocaleString("en-IN")}`}</p>
          <p className="mt-1 text-sm text-neutral-500">{assessment.ready ? "Tickets available" : "Not ready for public listing"}</p>
        </div>
      </article>
      {!assessment.ready && <section className="mt-5 rounded-2xl border bg-white p-5"><h2 className="font-bold">Before this can be published</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600">{assessment.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></section>}
    </div>
  </main>;
}
