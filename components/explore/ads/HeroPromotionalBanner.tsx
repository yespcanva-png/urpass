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
      className="explore-fade-up relative w-full mb-6 sm:mb-8 focus:outline-none"
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
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/90 shadow-xl shadow-neutral-950/5 bg-neutral-950 group select-none">
            
            {/* Sliding Track with native touch-action for buttery smooth vertical scrolling */}
            <div
              className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
              style={{ transform: `translateX(-${currentIndex * 100}%)`, touchAction: "pan-y" }}
            >
              {activeCampaigns.map((camp, idx) => (
                <div
                  key={camp.id}
                  className="w-full shrink-0 min-w-full relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] aspect-[16/10] sm:aspect-[16/7] lg:aspect-[16/6]"
                  aria-hidden={idx !== currentIndex}
                >
                  <AdCreativeImage
                    campaign={camp}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
                    priority={idx === 0}
                  />

                  {/* Multi-stage High-Contrast Gradient Overlay for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-5 sm:p-8 lg:p-12 flex flex-col justify-end max-w-2xl text-white z-10">
                    {/* Badge & Sponsor Attribution */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase bg-violet-600/90 backdrop-blur-md text-white border border-violet-400/30 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{camp.badgeLabel || "Featured"}</span>
                      </span>
                      {camp.advertiserName && (
                        <span className="text-[11px] sm:text-xs font-medium text-neutral-300/90">
                          by {camp.advertiserName}
                        </span>
                      )}
                      {camp.startsAt && (
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-neutral-300/90 font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-violet-400 shrink-0" />
                          <span>
                            {new Date(camp.startsAt).toLocaleDateString("en-IN", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                            {" • 10:00 AM IST"}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Main Headline */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-1.5 sm:mb-2 leading-tight line-clamp-2">
                      {camp.title}
                    </h2>

                    {/* Short Supporting Description */}
                    {camp.description && (
                      <p className="text-xs sm:text-sm text-neutral-200/90 line-clamp-2 mb-3.5 sm:mb-5 leading-relaxed max-w-xl font-normal">
                        {camp.description}
                      </p>
                    )}

                    {/* CTA Action Button */}
                    <div className="flex items-center gap-3 sm:gap-4 pt-1">
                      <Link
                        href={camp.destinationUrl}
                        onClick={trackClick}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white shadow-lg shadow-violet-600/30 transition-all duration-150 touch-manipulation min-h-[40px] sm:min-h-[44px]"
                      >
                        <span>{camp.ctaText || "Book Tickets"}</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                  className="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 z-20 shadow-lg hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Next Slide Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next promotional slide"
                  className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 z-20 shadow-lg hover:scale-105 active:scale-95 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Top-Right Slide Counter Badge */}
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white text-[10px] sm:text-[11px] font-semibold tracking-wider">
                  <span>{currentIndex + 1}</span>
                  <span className="text-white/40">/</span>
                  <span className="text-white/70">{activeCampaigns.length}</span>
                </div>

                {/* Bottom Slide Indicators (Interactive Pills) */}
                <div className="absolute bottom-3 right-4 sm:bottom-6 sm:right-8 flex items-center gap-1.5 sm:gap-2 z-20">
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
                            ? "w-5 sm:w-7 h-1.5 sm:h-2 bg-violet-400 shadow-xs"
                            : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/75"
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
