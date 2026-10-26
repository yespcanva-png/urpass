import type { Metadata } from "next";
import { Suspense } from "react";
import ExploreClient from "./ExploreClient";
import { fetchExploreMarketplaceEvents } from "@/lib/explore/service";
import { fetchExplorePlacements } from "@/lib/explore/ads-service";
import type {
  ExploreCategory,
  ExploreDateFilter,
  ExplorePricingFilter,
  ExploreSortOrder,
} from "@/lib/explore/types";

export const metadata: Metadata = {
  title: "Explore Events in India | UrPass",
  description:
    "Discover verified live music, tech conferences, creative workshops, food festivals, and community gatherings. Book official tickets with instant UrPass QR check-in.",
  keywords: [
    "UrPass explore",
    "event discovery India",
    "buy event tickets online",
    "verified music concerts",
    "tech conferences Bengaluru Mumbai Delhi",
    "workshops and meetups",
    "QR event passes",
    "UrPass marketplace",
  ],
  alternates: {
    canonical: "https://urpass.space/explore",
  },
  openGraph: {
    title: "Explore Events in India | UrPass",
    description:
      "Explore curated, verified events across India. Instant booking, guest-first checkout, and seamless QR passes.",
    url: "https://urpass.space/explore",
    siteName: "UrPass",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "UrPass Explore Events in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Events in India | UrPass",
    description:
      "Discover verified events across music, tech, workshops, and sports. Effortless browsing and instant guest booking.",
    images: ["https://urpass.space/og-image.png"],
  },
};

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    category?: string;
    date?: string;
    pricing?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  const [initialResult, initialAds] = await Promise.all([
    fetchExploreMarketplaceEvents({
      query: params.q || undefined,
      city: params.city && params.city !== "All Cities" ? params.city : undefined,
      category: params.category as ExploreCategory | undefined,
      dateFilter: (params.date as ExploreDateFilter) || "all",
      pricing: (params.pricing as ExplorePricingFilter) || "all",
      sort: (params.sort as ExploreSortOrder) || "soonest",
      page: params.page ? Number(params.page) : 1,
      limit: 12,
    }),
    fetchExplorePlacements(params.city),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ExploreClient initialResult={initialResult} initialAds={initialAds} />
    </Suspense>
  );
}
