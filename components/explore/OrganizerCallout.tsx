"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function OrganizerCallout() {
  return (
    <section className="bg-neutral-950 text-white py-10 sm:py-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl hover:shadow-violet-950/20 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-violet-400 uppercase tracking-wider">
              Host Your Community
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Organize with UrPass
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              Publish your conference, workshop, or campus festival in minutes. Enjoy instant QR ticket delivery, 0% platform fee, and high-speed in-browser phone scanning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 text-xs font-bold text-white px-5 py-3 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-violet-600/30 hover:-translate-y-0.5 active:scale-95 touch-manipulation min-h-[44px]"
              style={{ background: "linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)" }}
            >
              <span>Publish Event</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              href="/features"
              className="inline-flex items-center justify-center text-xs font-semibold text-neutral-300 hover:text-white px-4 py-3 rounded-xl sm:rounded-2xl border border-neutral-700 hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 touch-manipulation min-h-[44px]"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
