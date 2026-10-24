import type { Metadata } from "next";
import { MarketingPageConfig } from "./types";
import { TICKET_OG_IMAGE, TICKET_OG_IMAGE_META } from "./og-images";

export function generatePageMetadata(page: MarketingPageConfig): Metadata {
  const canonicalUrl = page.canonicalUrl || `https://urpass.space/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonicalUrl,
      siteName: "UrPass",
      locale: "en_IN",
      type: "website",
      images: [TICKET_OG_IMAGE_META],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [TICKET_OG_IMAGE],
    },
    robots: {
      index: page.status === "published",
      follow: page.status === "published",
      googleBot: {
        index: page.status === "published",
        follow: page.status === "published",
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const generateMarketingMetadata = generatePageMetadata;
