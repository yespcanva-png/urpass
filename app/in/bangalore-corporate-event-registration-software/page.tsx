import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_021_BANGALORE_CONFIG } from "@/lib/seo/templates/high-intent-25/city-solutions";

export const metadata: Metadata = {
  title: PAGE_021_BANGALORE_CONFIG.seoTitle,
  description: PAGE_021_BANGALORE_CONFIG.metaDescription,
  keywords: [
    PAGE_021_BANGALORE_CONFIG.primaryKeyword,
    ...PAGE_021_BANGALORE_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: PAGE_021_BANGALORE_CONFIG.canonicalUrl,
  },
  openGraph: {
    title: PAGE_021_BANGALORE_CONFIG.seoTitle,
    description: PAGE_021_BANGALORE_CONFIG.metaDescription,
    url: PAGE_021_BANGALORE_CONFIG.canonicalUrl,
    siteName: "UrPass",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_021_BANGALORE_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_021_BANGALORE_CONFIG.seoTitle,
    description: PAGE_021_BANGALORE_CONFIG.metaDescription,
    images: ["https://urpass.space/og-events-your-way.png"],
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru",
    "geo.position": "12.9716;77.5946",
    ICBM: "12.9716, 77.5946",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BangaloreCorporatePage() {
  return <SeoGeoLandingTemplate config={PAGE_021_BANGALORE_CONFIG} />;
}

