import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_024_MUMBAI_CONFIG } from "@/lib/seo/templates/high-intent-25/city-solutions";

export const metadata: Metadata = {
  title: PAGE_024_MUMBAI_CONFIG.seoTitle,
  description: PAGE_024_MUMBAI_CONFIG.metaDescription,
  keywords: [
    PAGE_024_MUMBAI_CONFIG.primaryKeyword,
    ...PAGE_024_MUMBAI_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: PAGE_024_MUMBAI_CONFIG.canonicalUrl,
  },
  openGraph: {
    title: PAGE_024_MUMBAI_CONFIG.seoTitle,
    description: PAGE_024_MUMBAI_CONFIG.metaDescription,
    url: PAGE_024_MUMBAI_CONFIG.canonicalUrl,
    siteName: "UrPass",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_024_MUMBAI_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_024_MUMBAI_CONFIG.seoTitle,
    description: PAGE_024_MUMBAI_CONFIG.metaDescription,
    images: ["https://urpass.space/og-events-your-way.png"],
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Mumbai",
    "geo.position": "19.0760;72.8777",
    ICBM: "19.0760, 72.8777",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MumbaiAgencyPage() {
  return <SeoGeoLandingTemplate config={PAGE_024_MUMBAI_CONFIG} />;
}

