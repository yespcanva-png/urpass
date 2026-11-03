import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_019_UK_GUEST_MANAGEMENT_CONFIG } from "@/lib/seo/templates/high-intent-25/uk-solutions";

export const metadata: Metadata = {
  title: PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.seoTitle,
  description: PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.metaDescription,
  keywords: [
    PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.primaryKeyword,
    ...PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: "https://urpass.space/uk/corporate-event-guest-management-software",
  },
  openGraph: {
    title: PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.seoTitle,
    description: PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.metaDescription,
    url: "https://urpass.space/uk/corporate-event-guest-management-software",
    siteName: "UrPass",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.seoTitle,
    description: PAGE_019_UK_GUEST_MANAGEMENT_CONFIG.metaDescription,
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

export default function UkGuestManagementPage() {
  return <SeoGeoLandingTemplate config={PAGE_019_UK_GUEST_MANAGEMENT_CONFIG} />;
}

