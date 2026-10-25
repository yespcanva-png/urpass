"use client";

import Link from "next/link";
import AdCreativeImage from "./AdCreativeImage";
import { ArrowUpRight } from "lucide-react";
import type { AdCampaign } from "@/lib/explore/ads-types";
import ViewabilityTracker from "./ViewabilityTracker";

interface BottomSidebarBannerProps {
  campaign: AdCampaign | null;
  activeCity?: string;
  className?: string;
}

export default function BottomSidebarBanner({
  campaign,
  activeCity,
  className = "",
}: BottomSidebarBannerProps) {
  // Default fallback if no admin campaign is scheduled
  const activeCampaign: AdCampaign = campaign || {
    id: "camp-default-organize",
    title: "Organize Your Event with UrPass",
    description: "Launch ticketing, accept online registrations, and check in guests with instant QR codes. Zero hidden commissions.",
    placement: "bottom_sidebar",
    campaignType: "urpass_house",
    advertiserName: "UrPass for Organizers",
    desktopImageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    badgeLabel: "UrPass Official",
    ctaText: "Create Event",
    destinationUrl: "/create-event",
    cityTargeting: ["All Cities"],
    startsAt: "2026-01-01T00:00:00Z",
    priority: 10,
    status: "active",
    impressionsCount: 0,
    clicksCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className={`w-full ${className}`}>
      <ViewabilityTracker
        campaignId={activeCampaign.id}
        placement="bottom_sidebar"
        city={activeCity}
      >
        {(trackClick) => (
          <div className="rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-violet-50/60 to-white shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md hover:border-violet-200">
            {/* Creative Banner Image (600 × 280 px aspect) */}
            <div className="relative w-full aspect-[2.1/1] bg-neutral-100 overflow-hidden">
              <AdCreativeImage campaign={activeCampaign} sizes="(max-width: 1024px) 100vw, 360px" />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-violet-600/90 backdrop-blur-md text-white border border-violet-400/30">
                  {campaign ? "Sponsored" : "UrPass"}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 leading-snug mb-1.5">
                  {activeCampaign.title}
                </h3>
                {activeCampaign.description && (
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                    {activeCampaign.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <Link
                href={activeCampaign.destinationUrl}
                onClick={trackClick}
                className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-xs group"
              >
                <span>{activeCampaign.ctaText || "Create Event"}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </ViewabilityTracker>
    </div>
  );
}
