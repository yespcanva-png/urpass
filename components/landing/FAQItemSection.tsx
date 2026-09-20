"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { SEOFaq } from "@/components/landing/SEOPage";

export default function FAQItemSection({ faqs }: { faqs: SEOFaq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28 px-5 sm:px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-14">
          Questions
        </h2>
        <div className="flex flex-col divide-y divide-neutral-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
              >
                <span className="text-sm font-medium text-neutral-900">{faq.q}</span>
                <span className="shrink-0 text-neutral-400">
                  {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              {open === i && (
                <p className="pb-5 text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
