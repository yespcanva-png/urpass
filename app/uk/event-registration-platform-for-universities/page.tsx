import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_018_UK_UNIVERSITIES_CONFIG } from "@/lib/seo/templates/high-intent-25/uk-solutions";

export const metadata: Metadata = {
  title: PAGE_018_UK_UNIVERSITIES_CONFIG.seoTitle,
  description: PAGE_018_UK_UNIVERSITIES_CONFIG.metaDescription,
  keywords: [
    PAGE_018_UK_UNIVERSITIES_CONFIG.primaryKeyword,
    ...PAGE_018_UK_UNIVERSITIES_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: "https://urpass.space/uk/event-registration-platform-for-universities",
  },
  openGraph: {
    title: PAGE_018_UK_UNIVERSITIES_CONFIG.seoTitle,
    description: PAGE_018_UK_UNIVERSITIES_CONFIG.metaDescription,
    url: "https://urpass.space/uk/event-registration-platform-for-universities",
    siteName: "UrPass",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_018_UK_UNIVERSITIES_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_018_UK_UNIVERSITIES_CONFIG.seoTitle,
    description: PAGE_018_UK_UNIVERSITIES_CONFIG.metaDescription,
    images: ["https://urpass.space/og-events-your-way.png"],
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    ICBM: "55.3781, -3.4360",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UkUniversitiesPage() {
  return <SeoGeoLandingTemplate config={PAGE_018_UK_UNIVERSITIES_CONFIG} />;
}

