import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_020_UK_WORKSHOPS_CONFIG } from "@/lib/seo/templates/high-intent-25/uk-solutions";

export const metadata: Metadata = {
  title: PAGE_020_UK_WORKSHOPS_CONFIG.seoTitle,
  description: PAGE_020_UK_WORKSHOPS_CONFIG.metaDescription,
  keywords: [
    PAGE_020_UK_WORKSHOPS_CONFIG.primaryKeyword,
    ...PAGE_020_UK_WORKSHOPS_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: "https://urpass.space/uk/event-ticketing-software-for-workshops",
  },
  openGraph: {
    title: PAGE_020_UK_WORKSHOPS_CONFIG.seoTitle,
    description: PAGE_020_UK_WORKSHOPS_CONFIG.metaDescription,
    url: "https://urpass.space/uk/event-ticketing-software-for-workshops",
    siteName: "UrPass",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_020_UK_WORKSHOPS_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_020_UK_WORKSHOPS_CONFIG.seoTitle,
    description: PAGE_020_UK_WORKSHOPS_CONFIG.metaDescription,
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

export default function UkWorkshopsPage() {
  return <SeoGeoLandingTemplate config={PAGE_020_UK_WORKSHOPS_CONFIG} />;
}

