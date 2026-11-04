import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMarketingPage, MARKETING_PAGES_BY_SLUG, ALL_MARKETING_PAGES } from "@/lib/seo/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getRelatedPages } from "@/lib/seo/linking";
import MarketingPage from "@/components/marketing/MarketingPage";
import HighIntentPage from "@/components/marketing/HighIntentPage";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { HIGH_INTENT_30, HIGH_INTENT_30_BY_SLUG } from "@/lib/seo/high-intent-30";
import {
  getHighIntent25Page,
  getAllHighIntentSlugs,
  HIGH_INTENT_25_BY_SLUG,
} from "@/lib/seo/templates/high-intent-25";
import {
  getHighIntentBatch2Page,
  getAllHighIntentBatch2Slugs,
  HIGH_INTENT_BATCH_2_BY_SLUG,
} from "@/lib/seo/templates/high-intent-batch-2";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const matchingSlugs: string[] = [];

  // Add 25 High-Intent SEO + GEO Slugs (Batch 1)
  const highIntent25Slugs = getAllHighIntentSlugs();
  for (const s of highIntent25Slugs) {
    if (!matchingSlugs.includes(s)) matchingSlugs.push(s);
  }

  // Also include Batch 1 aliases
  Object.keys(HIGH_INTENT_25_BY_SLUG).forEach((alias) => {
    if (!matchingSlugs.includes(alias)) matchingSlugs.push(alias);
  });

  // Add 25 High-Intent SEO + GEO Slugs (Batch 2)
  const highIntentBatch2Slugs = getAllHighIntentBatch2Slugs();
  for (const s of highIntentBatch2Slugs) {
    if (!matchingSlugs.includes(s)) matchingSlugs.push(s);
  }

  // Also include Batch 2 aliases
  Object.keys(HIGH_INTENT_BATCH_2_BY_SLUG).forEach((alias) => {
    if (!matchingSlugs.includes(alias)) matchingSlugs.push(alias);
  });

  // Add Marketing Pages
  for (const page of ALL_MARKETING_PAGES) {
    if (page.canonicalUrl.includes("/solutions/")) {
      const slug = page.canonicalUrl.split("/solutions/")[1];
      if (slug && !matchingSlugs.includes(slug)) {
        matchingSlugs.push(slug);
      }
    }
  }

  // Add High Intent 30
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

  // Check High-Intent SEO + GEO Pages first (Batch 1 & Batch 2)
  const highIntentPageConfig = getHighIntent25Page(slug) || getHighIntentBatch2Page(slug);
  if (highIntentPageConfig) {
    return {
      title: highIntentPageConfig.seoTitle,
      description: highIntentPageConfig.metaDescription,
      keywords: [highIntentPageConfig.primaryKeyword, ...highIntentPageConfig.secondaryKeywords],
      alternates: { canonical: highIntentPageConfig.canonicalUrl },
      openGraph: {
        title: highIntentPageConfig.seoTitle,
        description: highIntentPageConfig.metaDescription,
        url: highIntentPageConfig.canonicalUrl,
        type: "website",
        images: [
          {
            url: "https://urpass.space/og-events-your-way.png",
            width: 1200,
            height: 630,
            alt: highIntentPageConfig.h1,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: highIntentPageConfig.seoTitle,
        description: highIntentPageConfig.metaDescription,
        images: ["https://urpass.space/og-events-your-way.png"],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }

  // Check High Intent 30
  const highIntentPage = HIGH_INTENT_30_BY_SLUG.get(slug);
  if (highIntentPage) {
    const canonical = `https://urpass.space/solutions/${slug}`;
    return {
      title: highIntentPage.title,
      description: highIntentPage.description,
      alternates: { canonical },
      openGraph: {
        title: highIntentPage.title,
        description: highIntentPage.description,
        url: canonical,
        type: "website",
      },
      robots: { index: true, follow: true },
    };
  }

  // Check Marketing Pages
  const page = resolvePage(slug);
  if (!page || page.status !== "published") {
    return { title: "Page Not Found | UrPass" };
  }
  return generatePageMetadata(page);
}

export default async function SolutionsPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. High-Intent SEO + GEO Template (Batch 1 & Batch 2)
  const highIntentConfig = getHighIntent25Page(slug) || getHighIntentBatch2Page(slug);
  if (highIntentConfig) {
    return <SeoGeoLandingTemplate config={highIntentConfig} />;
  }

  // 2. High-Intent 30
  const highIntentPage = HIGH_INTENT_30_BY_SLUG.get(slug);
  if (highIntentPage) {
    return <HighIntentPage page={highIntentPage} />;
  }

  // 3. Marketing Pages
  const page = resolvePage(slug);
  if (!page || page.status !== "published") {
    notFound();
  }

  const related = getRelatedPages(page, MARKETING_PAGES_BY_SLUG);
  return <MarketingPage page={page} relatedPages={related} />;
}
