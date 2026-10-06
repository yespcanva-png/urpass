import type { Metadata } from "next";
import ApplyPage, { generateMetadata as applyMetadata } from "@/app/apply/[eventId]/page";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return applyMetadata({ params: Promise.resolve({ eventId: slug }) });
}

export default async function EventSeoSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ApplyPage params={Promise.resolve({ eventId: slug })} />;
}
