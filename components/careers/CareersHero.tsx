"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowDown, ChevronRight, Zap, Target, Rocket } from "lucide-react";

export default function CareersHero() {
  function scrollToOpportunities(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const target = document.getElementById("open-positions");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  function scrollToCulture(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const target = document.getElementById("why-urpass");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden bg-[#0a0910]">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] sm:w-[800px] sm:h-[450px] rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, #6200EE 0%, #3700B3 50%, transparent 75%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-[0.2em] text-[#a78bfa] uppercase mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" />
          <span>BUILD WITH URPASS</span>
        </div>

        {/* Primary H1 */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
          Your next big thing <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-[#a78bfa]">
            starts here.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-neutral-300 font-normal leading-relaxed mb-10">
          We&apos;re building smarter ways to bring people together. Join us in creating technology that makes every event experience better.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16">
          <a
            href="#open-positions"
            onClick={scrollToOpportunities}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#6200EE] hover:bg-[#5200cc] shadow-[0_0_24px_rgba(98,0,238,0.45)] hover:shadow-[0_0_32px_rgba(98,0,238,0.6)] transition-all duration-200"
          >
            <span>Explore Opportunities</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="#why-urpass"
            onClick={scrollToCulture}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-neutral-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            <span>Life at UrPass</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </a>
        </div>

        {/* Core Startup Culture Pillars */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto pt-6 border-t border-white/8">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-[#a78bfa]">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white">Build</span>
            <span className="text-[10px] text-neutral-400">High Speed &amp; Craft</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white">Innovate</span>
            <span className="text-[10px] text-neutral-400">Challenging Norms</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white">Grow</span>
            <span className="text-[10px] text-neutral-400">Real-World Mastery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
