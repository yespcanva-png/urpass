import type { Metadata } from "next";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import { PAGE_017_UK_QR_CHECKIN_CONFIG } from "@/lib/seo/templates/high-intent-25/uk-solutions";

export const metadata: Metadata = {
  title: PAGE_017_UK_QR_CHECKIN_CONFIG.seoTitle,
  description: PAGE_017_UK_QR_CHECKIN_CONFIG.metaDescription,
  keywords: [
    PAGE_017_UK_QR_CHECKIN_CONFIG.primaryKeyword,
    ...PAGE_017_UK_QR_CHECKIN_CONFIG.secondaryKeywords,
  ],
  alternates: {
    canonical: "https://urpass.space/uk/qr-code-event-check-in-software",
  },
  openGraph: {
    title: PAGE_017_UK_QR_CHECKIN_CONFIG.seoTitle,
    description: PAGE_017_UK_QR_CHECKIN_CONFIG.metaDescription,
    url: "https://urpass.space/uk/qr-code-event-check-in-software",
    siteName: "UrPass",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-events-your-way.png",
        width: 1200,
        height: 630,
        alt: PAGE_017_UK_QR_CHECKIN_CONFIG.h1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_017_UK_QR_CHECKIN_CONFIG.seoTitle,
    description: PAGE_017_UK_QR_CHECKIN_CONFIG.metaDescription,
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

export default function UkQrCodeEventCheckInPage() {
  return <SeoGeoLandingTemplate config={PAGE_017_UK_QR_CHECKIN_CONFIG} />;
}

