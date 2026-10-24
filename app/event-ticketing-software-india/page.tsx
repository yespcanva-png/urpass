import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMarketingPage, MARKETING_PAGES_BY_SLUG } from "@/lib/seo/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getRelatedPages } from "@/lib/seo/linking";
import MarketingPage from "@/components/marketing/MarketingPage";

const SLUG = "event-ticketing-software-india";

export function generateMetadata(): Metadata {
  const page = getMarketingPage(SLUG);
  if (!page) return { title: "Online Event Ticketing Software India | UrPass" };
  return generatePageMetadata(page);
}

export default function Page() {
  const page = getMarketingPage(SLUG);
  if (!page) notFound();
  const related = getRelatedPages(page, MARKETING_PAGES_BY_SLUG);
  return <MarketingPage page={page} relatedPages={related} />;
}
