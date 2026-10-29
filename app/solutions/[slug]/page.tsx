import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMarketingPage, MARKETING_PAGES_BY_SLUG, ALL_MARKETING_PAGES } from "@/lib/seo/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getRelatedPages } from "@/lib/seo/linking";
import MarketingPage from "@/components/marketing/MarketingPage";
import HighIntentPage from "@/components/marketing/HighIntentPage";
import { HIGH_INTENT_30, HIGH_INTENT_30_BY_SLUG } from "@/lib/seo/high-intent-30";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const matchingSlugs: string[] = [];
  for (const page of ALL_MARKETING_PAGES) {
    if (page.canonicalUrl.includes("/solutions/")) {
      const slug = page.canonicalUrl.split("/solutions/")[1];
      if (slug && !matchingSlugs.includes(slug)) {
        matchingSlugs.push(slug);
      }
    }
  }
  for (const page of HIGH_INTENT_30) {
    if (!matchingSlugs.includes(page.slug)) matchingSlugs.push(page.slug);
  }
  return matchingSlugs.map((slug) => ({ slug }));
}

function resolvePage(slug: string) {
  return (
    getMarketingPage(`solutions/${slug}`) ||
    getMarketingPage(slug) ||
    ALL_MARKETING_PAGES.find((p) => p.canonicalUrl.endsWith(`/solutions/${slug}`))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const highIntentPage = HIGH_INTENT_30_BY_SLUG.get(slug);
  if (highIntentPage) {
    const canonical = `https://urpass.space/solutions/${slug}`;
    return { title: highIntentPage.title, description: highIntentPage.description, alternates: { canonical }, openGraph: { title: highIntentPage.title, description: highIntentPage.description, url: canonical, type: "website" }, robots: { index: true, follow: true } };
  }
  const page = resolvePage(slug);
  if (!page || page.status !== "published") {
    return { title: "Page Not Found | UrPass" };
  }
  return generatePageMetadata(page);
}

export default async function SolutionsPage({ params }: PageProps) {
  const { slug } = await params;
  const highIntentPage = HIGH_INTENT_30_BY_SLUG.get(slug);
  if (highIntentPage) return <HighIntentPage page={highIntentPage} />;
  const page = resolvePage(slug);
  if (!page || page.status !== "published") {
    notFound();
  }

  const related = getRelatedPages(page, MARKETING_PAGES_BY_SLUG);
  return <MarketingPage page={page} relatedPages={related} />;
}
