import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_025_PUNE_CONFIG } from "@/lib/seo/templates/high-intent-25/city-solutions";

export const metadata: Metadata = {
  title: PAGE_025_PUNE_CONFIG.seoTitle,
  description: PAGE_025_PUNE_CONFIG.metaDescription,
  keywords: [
    PAGE_025_PUNE_CONFIG.primaryKeyword,
    ...PAGE_025_PUNE_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: PAGE_025_PUNE_CONFIG.canonicalUrl,
  },
  openGraph: {
    title: PAGE_025_PUNE_CONFIG.seoTitle,
    description: PAGE_025_PUNE_CONFIG.metaDescription,
    url: PAGE_025_PUNE_CONFIG.canonicalUrl,
    siteName: "UrPass",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_025_PUNE_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_025_PUNE_CONFIG.seoTitle,
    description: PAGE_025_PUNE_CONFIG.metaDescription,
    images: ["https://urpass.space/og-events-your-way.png"],
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Pune",
    "geo.position": "18.5204;73.8567",
    ICBM: "18.5204, 73.8567",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PuneCorporatePage() {
  return <SeoGeoLandingTemplate config={PAGE_025_PUNE_CONFIG} />;
}

