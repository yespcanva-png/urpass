import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ApplyPage from "@/app/apply/[eventId]/page";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "UrPass Event",
    alternates: {
      canonical: `https://urpass.space/explore/event/${slug}`,
    },
  };
}

export default async function EventSeoSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  const supabase = await createClient();

  const query = supabase
    .from("events")
    .select("id, apply_slug, status")
    .eq("status", "active");

  const { data: event } = await (isUuid
    ? query.eq("id", slug)
    : query.eq("apply_slug", slug)
  ).maybeSingle();

  if (!event) {
    return <ApplyPage params={Promise.resolve({ eventId: slug })} />;
  }

  permanentRedirect(`/explore/event/${encodeURIComponent(event.apply_slug || event.id)}`);
}
