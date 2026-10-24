import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMarketingPage, MARKETING_PAGES_BY_SLUG } from "@/lib/seo/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getRelatedPages } from "@/lib/seo/linking";
import MarketingPage from "@/components/marketing/MarketingPage";

const SLUG = "hackathon-registration-platform";

export function generateMetadata(): Metadata {
  const page = getMarketingPage(SLUG);
  if (!page) return { title: "Hackathon Registration & Participant Management | UrPass" };
  return generatePageMetadata(page);
}

export default function Page() {
  const page = getMarketingPage(SLUG);
  if (!page) notFound();
  const related = getRelatedPages(page, MARKETING_PAGES_BY_SLUG);
  return <MarketingPage page={page} relatedPages={related} />;
}
