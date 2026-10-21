import React from "react";
import { Sparkles, Lightbulb, TrendingUp, Compass } from "lucide-react";

const VALUE_CARDS = [
  {
    icon: Compass,
    title: "Real Impact",
    tagline: "Used by real organizers and attendees",
    description:
      "Build solutions that event organisers and attendees use in the real world. Your code and designs power entry gates, ticket confirmations, and live venue check-ins.",
    accent: "text-purple-300",
    bg: "bg-purple-950/40",
    border: "border-purple-500/20",
  },
  {
    icon: Lightbulb,
    title: "Freedom to Innovate",
    tagline: "Challenge assumptions & shape products",
    description:
      "Share ideas, challenge assumptions, and help shape better products. We favor prototypes over endless debate and encourage testing fresh approaches to event operations.",
    accent: "text-amber-300",
    bg: "bg-amber-950/40",
    border: "border-amber-500/20",
  },
  {
    icon: TrendingUp,
    title: "Grow With Us",
    tagline: "Meaningful technology challenges",
    description:
      "Gain hands-on experience working on meaningful technology challenges. From distributed offline synchronization to low-latency gate analytics, there is no shortage of depth.",
    accent: "text-emerald-300",
    bg: "bg-emerald-950/40",
    border: "border-emerald-500/20",
  },
  {
    icon: Sparkles,
    title: "Ownership Matters",
    tagline: "Direct accountability & outcome focus",
    description:
      "Take responsibility, collaborate closely, and focus on outcomes. Every team member has autonomy over their domain, from architecture to execution.",
    accent: "text-sky-300",
    bg: "bg-sky-950/40",
    border: "border-sky-500/20",
  },
];

export default function WhyWorkWithUs() {
  return (
    <section id="why-urpass" className="py-20 sm:py-28 bg-[#0a0910] relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-[#c4b5fd] tracking-widest uppercase mb-4">
            Culture &amp; Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why work with UrPass?
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
            We are a focused, high-execution team building technology for live experiences. Here is how we think and work every day.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {VALUE_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group relative p-7 sm:p-8 rounded-2xl bg-[#12101b] border border-white/8 hover:border-purple-500/30 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center ${card.accent} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                      0{idx + 1} &middot; Value
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                      {card.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#a78bfa] mb-3">
                  {card.tagline}
                </p>

                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
