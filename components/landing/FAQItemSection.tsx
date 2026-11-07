import { Plus } from "lucide-react";
import type { SEOFaq } from "@/components/landing/SEOPage";

export default function FAQItemSection({ faqs }: { faqs: SEOFaq[] }) {
  return (
    <section className="py-20 px-5 sm:px-8 bg-white border-t border-neutral-100" id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              open={i === 0}
              className="group border border-neutral-200/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-neutral-300 open:bg-neutral-50/20"
            >
              <summary className="w-full flex items-center justify-between p-5 text-left gap-4 bg-white hover:bg-neutral-50/50 transition-colors cursor-pointer list-none select-none">
                <span className="text-sm sm:text-base font-semibold text-neutral-900">{faq.q}</span>
                <span className="shrink-0 text-neutral-500 bg-neutral-100 p-1.5 rounded-full transition-transform group-open:rotate-45">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100/80 bg-neutral-50/40">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
