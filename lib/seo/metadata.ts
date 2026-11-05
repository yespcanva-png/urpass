import type { Metadata } from "next";
import { MarketingPageConfig } from "./types";
import { TICKET_OG_IMAGE, TICKET_OG_IMAGE_META, UK_OG_IMAGE, UK_OG_IMAGE_META } from "./og-images";

export function generatePageMetadata(page: MarketingPageConfig): Metadata {
  const canonicalUrl = page.canonicalUrl || `https://urpass.space/${page.slug}`;
  const isUk =
    page.slug?.startsWith("uk/") ||
    page.slug === "uk" ||
    canonicalUrl.includes("/uk/") ||
    canonicalUrl.endsWith("/uk") ||
    page.slug?.endsWith("-uk");

  const locale = isUk ? "en_GB" : "en_IN";
  const ogImageMeta = isUk ? UK_OG_IMAGE_META : TICKET_OG_IMAGE_META;
  const ogImage = isUk ? UK_OG_IMAGE : TICKET_OG_IMAGE;

  const alternates: Metadata["alternates"] = {
    canonical: canonicalUrl,
  };
  if (isUk) {
    alternates.languages = {
      "en-GB": canonicalUrl,
    };
  }

  const otherMeta: Record<string, string> = {};
  if (isUk) {
    otherMeta["geo.region"] = "GB";
    otherMeta["geo.placename"] = "United Kingdom";
    otherMeta["geo.position"] = "55.3781;-3.4360";
    otherMeta["ICBM"] = "55.3781, -3.4360";
  }

  return {
    title: page.title,
    description: page.description,
    alternates,
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonicalUrl,
      siteName: "UrPass",
      locale,
      type: "website",
      images: [ogImageMeta],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
    other: Object.keys(otherMeta).length > 0 ? otherMeta : undefined,
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
