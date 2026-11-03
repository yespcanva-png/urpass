import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_016_UK_CONFERENCE_CONFIG } from "@/lib/seo/templates/high-intent-25/uk-solutions";

export const metadata: Metadata = {
  title: PAGE_016_UK_CONFERENCE_CONFIG.seoTitle,
  description: PAGE_016_UK_CONFERENCE_CONFIG.metaDescription,
  keywords: [
    PAGE_016_UK_CONFERENCE_CONFIG.primaryKeyword,
    ...PAGE_016_UK_CONFERENCE_CONFIG.secondaryKeywords,
    "conference registration software uk",
    "conference ticketing software uk",
    "delegate badge check in uk",
    "b2b conference registration platform",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/conference-registration-software",
  },
  openGraph: {
    title: PAGE_016_UK_CONFERENCE_CONFIG.seoTitle,
    description: PAGE_016_UK_CONFERENCE_CONFIG.metaDescription,
    url: "https://urpass.space/uk/conference-registration-software",
    siteName: "UrPass",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_016_UK_CONFERENCE_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_016_UK_CONFERENCE_CONFIG.seoTitle,
    description: PAGE_016_UK_CONFERENCE_CONFIG.metaDescription,
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

export default function UkConferenceRegistrationSoftwarePage() {
  return <SeoGeoLandingTemplate config={PAGE_016_UK_CONFERENCE_CONFIG} />;
}
