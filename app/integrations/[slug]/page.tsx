import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMarketingPage, MARKETING_PAGES_BY_SLUG, ALL_MARKETING_PAGES } from "@/lib/seo/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getRelatedPages } from "@/lib/seo/linking";
import MarketingPage from "@/components/marketing/MarketingPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const matchingSlugs: string[] = [];
  for (const page of ALL_MARKETING_PAGES) {
    if (page.canonicalUrl.includes("/integrations/")) {
      const slug = page.canonicalUrl.split("/integrations/")[1];
      if (slug && !matchingSlugs.includes(slug)) {
        matchingSlugs.push(slug);
      }
    }
  }
  return matchingSlugs.map((slug) => ({ slug }));
}

function resolvePage(slug: string) {
  return (
    getMarketingPage(`integrations/${slug}`) ||
    getMarketingPage(`integrations-${slug}`) ||
    getMarketingPage(slug) ||
    ALL_MARKETING_PAGES.find((p) => p.canonicalUrl.endsWith(`/integrations/${slug}`))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page || page.status !== "published") {
    return { title: "Page Not Found | UrPass" };
  }
  return generatePageMetadata(page);
}

export default async function IntegrationsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page || page.status !== "published") {
    notFound();
  }

  const related = getRelatedPages(page, MARKETING_PAGES_BY_SLUG);
  return <MarketingPage page={page} relatedPages={related} />;
}
