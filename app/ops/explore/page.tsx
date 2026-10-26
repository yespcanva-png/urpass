import Link from "next/link";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { adminClient } from "@/lib/supabase/admin";
import ExploreReviewList from "@/components/ops/ExploreReviewList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Explore review | UrPass Ops", robots: { index: false, follow: false } };

export default async function ExploreReviewPage() {
  if (!await isOpsAuthenticated()) {
    return <main className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-bold">Administrator access required</h1><Link href="/ops" className="text-violet-700 underline">Open operations sign in</Link></main>;
  }
  const { data, error } = await adminClient().from("explore_marketplace_listings")
    .select("event_id, status, category, city, editorial_summary, rejection_reason, updated_at, event:events(name, event_date, venue, apply_slug)")
    .in("status", ["pending", "approved", "rejected", "changes_requested", "suspended", "unlisted"])
    .order("updated_at", { ascending: false }).limit(100);
  return <main className="mx-auto max-w-5xl p-5 sm:p-8">
    <Link href="/ops" className="text-sm font-semibold text-violet-700">← Operations</Link>
    <h1 className="mt-5 text-3xl font-bold">Explore listing review</h1>
    <p className="mt-2 text-sm text-neutral-600">Review existing events before they appear in Explore.</p>
    {error ? <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">{error.message}</p> : <ExploreReviewList listings={(data || []).map((item) => ({ ...item, event: Array.isArray(item.event) ? item.event[0] : item.event }))} />}
  </main>;
}
