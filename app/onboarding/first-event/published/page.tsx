import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ShareActions from "./ShareActions";

export default async function FirstEventPublishedPage({ searchParams }: {
  searchParams: Promise<{ event?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const eventId = (await searchParams).event;
  if (!eventId) redirect("/dashboard");
  const { data: event } = await supabase.from("events")
    .select("id, name, apply_slug, status")
    .eq("id", eventId).eq("organizer_id", user.id).maybeSingle();
  if (!event || event.status !== "active") redirect("/dashboard");
  const publicPath = `/apply/${event.id}`;

  return <main className="min-h-screen bg-neutral-50 px-4 py-12 text-neutral-900">
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-7 shadow-sm">
      <p className="text-sm font-semibold text-violet-700">Step 5 of 5 · Published</p>
      <h1 className="mt-3 text-3xl font-bold">{event.name} is live</h1>
      <p className="mt-3 text-sm text-neutral-600">Share your registration link and watch the first registrations arrive.</p>
      <div className="mt-5 break-all rounded-lg bg-neutral-50 p-3 text-sm">{publicPath}</div>
      <ShareActions path={publicPath} title={event.name} />
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={publicPath} className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white">Open registration</Link>
        <Link href={`/event/${event.id}/attendees`} className="rounded-lg border px-4 py-2 text-sm font-semibold">Registration dashboard</Link>
        <Link href={`/event/${event.id}/communications`} className="rounded-lg border px-4 py-2 text-sm font-semibold">Send your first invitation</Link>
      </div>
    </div>
  </main>;
}
