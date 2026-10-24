import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMarketingPage, getAllPublishedSlugs, MARKETING_PAGES_BY_SLUG } from "@/lib/seo/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getRelatedPages } from "@/lib/seo/linking";
import MarketingPage from "@/components/marketing/MarketingPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getMarketingPage(slug);
  if (!page || page.status !== "published") {
    return { title: "Page Not Found | UrPass" };
  }
  return generatePageMetadata(page);
}

export default async function DynamicMarketingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getMarketingPage(slug);
  if (!page || page.status !== "published") {
    notFound();
  }

  const related = getRelatedPages(page, MARKETING_PAGES_BY_SLUG);

  return <MarketingPage page={page} relatedPages={related} />;
}
