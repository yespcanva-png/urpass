import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_001_CORPORATE_CONFIG } from "@/lib/seo/templates/page-001-corporate";

export const metadata: Metadata = {
  title: PAGE_001_CORPORATE_CONFIG.seoTitle,
  description: PAGE_001_CORPORATE_CONFIG.metaDescription,
  keywords: [
    PAGE_001_CORPORATE_CONFIG.primaryKeyword,
    ...PAGE_001_CORPORATE_CONFIG.secondaryKeywords,
    "corporate event registration",
    "corporate check-in app",
    "employee event registration software",
    "b2b conference registration",
  ],
  alternates: {
    canonical: PAGE_001_CORPORATE_CONFIG.canonicalUrl,
  },
  openGraph: {
    title: PAGE_001_CORPORATE_CONFIG.seoTitle,
    description: PAGE_001_CORPORATE_CONFIG.metaDescription,
    url: PAGE_001_CORPORATE_CONFIG.canonicalUrl,
    siteName: "UrPass",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_001_CORPORATE_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_001_CORPORATE_CONFIG.seoTitle,
    description: PAGE_001_CORPORATE_CONFIG.metaDescription,
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

export default function CorporateEventRegistrationSoftwarePage() {
  return <SeoGeoLandingTemplate config={PAGE_001_CORPORATE_CONFIG} />;
}
