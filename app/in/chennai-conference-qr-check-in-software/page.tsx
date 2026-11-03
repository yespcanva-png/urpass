import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_022_CHENNAI_CONFIG } from "@/lib/seo/templates/high-intent-25/city-solutions";

export const metadata: Metadata = {
  title: PAGE_022_CHENNAI_CONFIG.seoTitle,
  description: PAGE_022_CHENNAI_CONFIG.metaDescription,
  keywords: [
    PAGE_022_CHENNAI_CONFIG.primaryKeyword,
    ...PAGE_022_CHENNAI_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: PAGE_022_CHENNAI_CONFIG.canonicalUrl,
  },
  openGraph: {
    title: PAGE_022_CHENNAI_CONFIG.seoTitle,
    description: PAGE_022_CHENNAI_CONFIG.metaDescription,
    url: PAGE_022_CHENNAI_CONFIG.canonicalUrl,
    siteName: "UrPass",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_022_CHENNAI_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_022_CHENNAI_CONFIG.seoTitle,
    description: PAGE_022_CHENNAI_CONFIG.metaDescription,
    images: ["https://urpass.space/og-events-your-way.png"],
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Chennai",
    "geo.position": "13.0827;80.2707",
    ICBM: "13.0827, 80.2707",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ChennaiConferencePage() {
  return <SeoGeoLandingTemplate config={PAGE_022_CHENNAI_CONFIG} />;
}

