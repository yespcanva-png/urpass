"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import AdCreativeImage from "./AdCreativeImage";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Calendar,
} from "lucide-react";
import type { AdCampaign } from "@/lib/explore/ads-types";
import ViewabilityTracker from "./ViewabilityTracker";

interface HeroPromotionalBannerProps {
  campaigns: AdCampaign[];
  activeCity?: string;
}

export default function HeroPromotionalBanner({
  campaigns,
  activeCity,
}: HeroPromotionalBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const activeCampaigns = campaigns && campaigns.length > 0 ? campaigns : [];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeCampaigns.length) % activeCampaigns.length);
  }, [activeCampaigns.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeCampaigns.length);
  }, [activeCampaigns.length]);

  // Autoplay timer with pause on hover or reduced motion
  useEffect(() => {
    if (activeCampaigns.length <= 1 || isHovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [activeCampaigns.length, isHovered, handleNext]);

  // Touch swipe support
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Keyboard navigation when banner is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeCampaigns.length <= 1) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  if (activeCampaigns.length === 0) {
    return null;
  }

  const current = activeCampaigns[currentIndex] || activeCampaigns[0];

  return (
    <div
      className="explore-fade-up relative w-full mb-8 focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Promotional Highlights Slider"
    >
      <ViewabilityTracker
        campaignId={current.id}
        placement="hero"
        city={activeCity}
      >
        {(trackClick) => (
          <div className="relative w-full rounded-3xl overflow-hidden border border-neutral-200/90 shadow-xl shadow-neutral-950/5 bg-neutral-950 group select-none">
            
            {/* Sliding Track */}
            <div
              className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {activeCampaigns.map((camp, idx) => (
                <div
                  key={camp.id}
                  className="w-full shrink-0 min-w-full relative min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] aspect-[16/6]"
                  aria-hidden={idx !== currentIndex}
                >
                  <AdCreativeImage
                    campaign={camp}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1280px"
                    priority={idx === 0}
                  />

                  {/* Multi-stage High-Contrast Gradient Overlay for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end max-w-2xl text-white z-10">
                    {/* Badge & Sponsor Attribution */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-violet-600/90 backdrop-blur-md text-white border border-violet-400/30 shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Sponsored</span>
                      </span>
                      {camp.badgeLabel && camp.badgeLabel.toLowerCase() !== "sponsored" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-white/20 backdrop-blur-md text-white border border-white/20">
                          {camp.badgeLabel}
                        </span>
                      )}
                      <span className="text-xs font-medium text-neutral-300/90">
                        by {camp.advertiserName}
                      </span>
                      {camp.startsAt && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300/90 font-medium bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                          <Calendar className="w-3 h-3 text-violet-400" />
                          <span>
                            {new Date(camp.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            {camp.endsAt ? ` – ${new Date(camp.endsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Main Headline */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2.5 leading-tight line-clamp-2">
                      {camp.title}
                    </h2>

                    {/* Short Supporting Description */}
                    {camp.description && (
                      <p className="text-xs sm:text-sm text-neutral-200/90 line-clamp-2 mb-5 leading-relaxed max-w-xl font-normal">
                        {camp.description}
                      </p>
                    )}

                    {/* CTA Action Button */}
                    <div className="flex items-center gap-4 pt-1">
                      <Link
                        href={camp.destinationUrl}
                        onClick={trackClick}
                        className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white shadow-lg shadow-violet-600/30 transition-all duration-150"
                      >
                        <span>{camp.ctaText || "Book Tickets"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls (if multiple campaigns) */}
            {activeCampaigns.length > 1 && (
              <>
                {/* Previous Slide Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous promotional slide"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 z-20 shadow-lg hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Next Slide Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next promotional slide"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 z-20 shadow-lg hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Top-Right Slide Counter Badge */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold tracking-wider">
                  <span>{currentIndex + 1}</span>
                  <span className="text-white/40">/</span>
                  <span className="text-white/70">{activeCampaigns.length}</span>
                </div>

                {/* Bottom Slide Indicators (Interactive Pills) */}
                <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-8 flex items-center gap-2 z-20">
                  {activeCampaigns.map((camp, idx) => {
                    const isSelected = idx === currentIndex;
                    return (
                      <button
                        key={camp.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "w-7 h-2 bg-violet-400 shadow-xs"
                            : "w-2 h-2 bg-white/40 hover:bg-white/75"
                        }`}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </ViewabilityTracker>
    </div>
  );
}
