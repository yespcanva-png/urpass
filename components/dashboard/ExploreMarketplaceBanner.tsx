"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  ArrowRight,
  X,
  ExternalLink,
} from "lucide-react";

interface Props {
  events?: Array<{
    id: string;
    name: string;
    status: string;
    apply_slug?: string;
  }>;
}

export default function ExploreMarketplaceBanner({ events = [] }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const activeEvent = events.find((e) => e.status === "active") || events[0];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-violet-950 p-5 sm:p-6 text-white shadow-lg border border-violet-700/50">
      {/* Decorative background glow & mesh */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 left-1/3 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="relative shrink-0 mt-0.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Compass className="w-6 h-6 text-violet-300" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-400 ring-2 ring-violet-950" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-violet-500/30 text-violet-200 border border-violet-400/30">
                <Sparkles className="w-3 h-3 text-violet-300 animate-pulse" />
                Now Live · Marketplace
              </span>
              <span className="text-[11px] text-violet-300/80 hidden sm:inline">
                Zero Commission · Verified Passes
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Publish Your Event on UrPass Explore
            </h2>

            <p className="text-xs sm:text-sm text-violet-200/90 leading-relaxed">
              Get discovered on the public <strong className="text-white font-semibold">/explore</strong> marketplace by thousands of verified event goers across India. Enable public attendee discovery, direct ticket bookings, and digital QR passes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pl-16 md:pl-0">
          {activeEvent ? (
            <Link
              href={`/event/${activeEvent.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-violet-950 text-xs font-bold hover:bg-violet-50 transition-colors shadow-sm"
            >
              <span>Publish on Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/create-event"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-violet-950 text-xs font-bold hover:bg-violet-50 transition-colors shadow-sm"
            >
              <span>Create Event to Publish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <Link
            href="/explore"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold transition-colors backdrop-blur-sm"
          >
            <span>View /explore</span>
            <ExternalLink className="w-3 h-3 text-violet-300" />
          </Link>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-violet-300/60 hover:text-white hover:bg-white/10 transition-colors ml-1"
            title="Dismiss banner"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
