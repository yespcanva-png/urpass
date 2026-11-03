import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_023_HYDERABAD_CONFIG } from "@/lib/seo/templates/high-intent-25/city-solutions";

export const metadata: Metadata = {
  title: PAGE_023_HYDERABAD_CONFIG.seoTitle,
  description: PAGE_023_HYDERABAD_CONFIG.metaDescription,
  keywords: [
    PAGE_023_HYDERABAD_CONFIG.primaryKeyword,
    ...PAGE_023_HYDERABAD_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: PAGE_023_HYDERABAD_CONFIG.canonicalUrl,
  },
  openGraph: {
    title: PAGE_023_HYDERABAD_CONFIG.seoTitle,
    description: PAGE_023_HYDERABAD_CONFIG.metaDescription,
    url: PAGE_023_HYDERABAD_CONFIG.canonicalUrl,
    siteName: "UrPass",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_023_HYDERABAD_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_023_HYDERABAD_CONFIG.seoTitle,
    description: PAGE_023_HYDERABAD_CONFIG.metaDescription,
    images: ["https://urpass.space/og-events-your-way.png"],
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad",
    "geo.position": "17.3850;78.4867",
    ICBM: "17.3850, 78.4867",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HyderabadCollegeFestPage() {
  return <SeoGeoLandingTemplate config={PAGE_023_HYDERABAD_CONFIG} />;
}

