"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from "lucide-react";

interface EventImageCarouselProps {
  images: string[];
  eventName?: string;
  className?: string;
}

export default function EventImageCarousel({
  images,
  eventName = "Event Photo",
  className = "",
}: EventImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Clean empty/null URLs
  const validImages = images.filter((img) => typeof img === "string" && img.trim().length > 0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const nextIndex = Math.round(scrollLeft / clientWidth);
      if (nextIndex !== activeIndex && nextIndex >= 0 && nextIndex < validImages.length) {
        setActiveIndex(nextIndex);
      }
    }
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const targetLeft = index * scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: targetLeft, behavior: "smooth" });
    setActiveIndex(index);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowLeft" && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
      else if (e.key === "ArrowRight" && lightboxIndex < validImages.length - 1) setLightboxIndex(lightboxIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, validImages.length]);

  if (validImages.length === 0) return null;

  return (
    <>
      <div className={`relative w-full rounded-2xl overflow-hidden group bg-neutral-900 shadow-sm ${className}`}>
        {/* Horizontal Scroll Snap Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none aspect-[16/9] sm:aspect-[21/9] max-h-[360px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {validImages.map((src, idx) => (
            <div
              key={idx}
              className="w-full shrink-0 h-full snap-center relative cursor-pointer select-none bg-neutral-950"
              onClick={() => setLightboxIndex(idx)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${eventName} photo ${idx + 1}`}
                className="w-full h-full object-cover sm:object-contain bg-neutral-900 transition-transform duration-300 hover:scale-[1.01]"
                loading={idx === 0 ? "eager" : "lazy"}
              />

              {/* View Fullscreen Action Hint */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                  <Maximize2 className="w-3 h-3" />
                  View Full
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Buttons (Desktop) */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToSlide(Math.max(0, activeIndex - 1));
              }}
              disabled={activeIndex === 0}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-neutral-900 backdrop-blur-md shadow-md flex items-center justify-center transition-all disabled:opacity-0 cursor-pointer disabled:pointer-events-none z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToSlide(Math.min(validImages.length - 1, activeIndex + 1));
              }}
              disabled={activeIndex === validImages.length - 1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-neutral-900 backdrop-blur-md shadow-md flex items-center justify-center transition-all disabled:opacity-0 cursor-pointer disabled:pointer-events-none z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Floating Slide Counter Badge */}
        {validImages.length > 1 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold tracking-wider z-10 shadow-sm">
            {activeIndex + 1} / {validImages.length}
          </div>
        )}

        {/* Dot Indicators */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
            {validImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToSlide(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                  activeIndex === idx
                    ? "w-6 bg-white shadow-sm"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Close image preview"
          >
            <X className="w-5 h-5" />
          </button>

          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(Math.max(0, lightboxIndex - 1));
                }}
                disabled={lightboxIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(Math.min(validImages.length - 1, lightboxIndex + 1));
                }}
                disabled={lightboxIndex === validImages.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={validImages[lightboxIndex]}
              alt={`${eventName} photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            {validImages.length > 1 && (
              <span className="text-white/70 text-xs font-medium mt-3">
                {lightboxIndex + 1} of {validImages.length}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
