"use client";

import React from "react";
import Link from "next/link";
import { ResolvedLink } from "@/lib/seo/linking";
import { ArrowRight, Compass } from "lucide-react";

interface RelatedPagesProps {
  related: ResolvedLink[];
}

export default function RelatedPages({ related }: RelatedPagesProps) {
  if (!related || related.length === 0) return null;

  return (
    <section className="py-14 bg-white border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider text-neutral-500">
          <Compass className="w-4 h-4 text-violet-600" />
          <span>Related Event Guides & Solutions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group rounded-2xl bg-neutral-50/60 border border-neutral-200/80 p-4 hover:border-violet-300 hover:bg-violet-50/30 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-violet-700 bg-white px-2 py-0.5 rounded border border-neutral-200 inline-block mb-2">
                  {item.badge}
                </span>
                <h4 className="text-sm font-bold text-neutral-900 group-hover:text-violet-700 transition-colors line-clamp-2">
                  {item.h1}
                </h4>
              </div>

              <div className="mt-4 pt-2 border-t border-neutral-200/50 flex items-center justify-between text-xs font-semibold text-neutral-500 group-hover:text-violet-700">
                <span>Explore guide</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
