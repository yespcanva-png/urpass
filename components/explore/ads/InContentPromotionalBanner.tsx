"use client";

import Link from "next/link";
import AdCreativeImage from "./AdCreativeImage";
import { ArrowRight } from "lucide-react";
import type { AdCampaign } from "@/lib/explore/ads-types";
import ViewabilityTracker from "./ViewabilityTracker";

interface InContentPromotionalBannerProps {
  campaign: AdCampaign | null;
  activeCity?: string;
  className?: string;
}

export default function InContentPromotionalBanner({
  campaign,
  activeCity,
  className = "",
}: InContentPromotionalBannerProps) {
  if (!campaign) return null;

  return (
    <div className={`w-full my-8 ${className}`}>
      <ViewabilityTracker
        campaignId={campaign.id}
        placement="in_content"
        city={activeCity}
      >
        {(trackClick) => (
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/90 bg-neutral-900 shadow-sm min-h-[160px] sm:min-h-[190px] md:min-h-[220px] transition-all duration-200 hover:shadow-md">
            {/* Desktop Background Image (1200 × 280 px aspect) */}
            <div className="absolute inset-0">
              <AdCreativeImage campaign={campaign} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px" />
              {/* Dynamic Gradient Overlay for Crisp Text Contrast across mobile vertical & desktop horizontal */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/50 md:bg-gradient-to-r md:from-black/90 md:via-black/75 md:to-black/30" />
            </div>

            {/* Content Flex Container */}
            <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 h-full">
              <div className="max-w-xl text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md text-white border border-white/20">
                    Sponsored
                  </span>
                  <span className="text-xs text-neutral-300">
                    Presented by {campaign.advertiserName}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug mb-1.5">
                  {campaign.title}
                </h3>
                {campaign.description && (
                  <p className="text-xs sm:text-sm text-neutral-200/90 line-clamp-2 leading-relaxed">
                    {campaign.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full md:w-auto pt-1 md:pt-0">
                <Link
                  href={campaign.destinationUrl}
                  onClick={trackClick}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white shadow-md shadow-violet-600/30 transition-all duration-150 touch-manipulation min-h-[42px]"
                >
                  <span>{campaign.ctaText || "Explore Offer"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </ViewabilityTracker>
    </div>
  );
}
