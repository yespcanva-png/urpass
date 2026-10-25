"use client";

import Link from "next/link";
import AdCreativeImage from "./AdCreativeImage";
import { ArrowUpRight } from "lucide-react";
import type { AdCampaign } from "@/lib/explore/ads-types";
import ViewabilityTracker from "./ViewabilityTracker";

interface TopSidebarBannerProps {
  campaign: AdCampaign | null;
  activeCity?: string;
  className?: string;
}

export default function TopSidebarBanner({
  campaign,
  activeCity,
  className = "",
}: TopSidebarBannerProps) {
  if (!campaign) return null;

  return (
    <div className={`w-full ${className}`}>
      <ViewabilityTracker
        campaignId={campaign.id}
        placement="top_sidebar"
        city={activeCity}
      >
        {(trackClick) => (
          <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md hover:border-neutral-300">
            {/* Creative Image Header (600 × 350 px aspect ratio) */}
            <div className="relative w-full aspect-[16/9] bg-neutral-100 overflow-hidden">
<AdCreativeImage campaign={campaign} sizes="(max-width: 1024px) 100vw, 360px" />
              <div className="absolute top-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white/95 border border-white/10">
                  Sponsored
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  {campaign.advertiserName}
                </p>
                <h3 className="text-sm font-bold text-neutral-900 leading-snug mb-1.5 line-clamp-2">
                  {campaign.title}
                </h3>
                {campaign.description && (
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                    {campaign.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <Link
                href={campaign.destinationUrl}
                onClick={trackClick}
                className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100/80 active:bg-violet-100 transition-colors border border-violet-100/90 group"
              >
                <span>{campaign.ctaText || "Learn More"}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </ViewabilityTracker>
    </div>
  );
}
