"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HeroSection from "./HeroSection";
import EventWorkflow from "./EventWorkflow";
import FeatureExplanation from "./FeatureExplanation";
import EventUseCase from "./EventUseCase";
import ServiceComparison from "./ServiceComparison";
import PricingDisclosure from "./PricingDisclosure";
import FAQSection from "./FAQSection";
import DualConversionCTA from "./DualConversionCTA";
import RelatedPages from "./RelatedPages";
import { MarketingPageConfig } from "@/lib/seo/types";
import { ResolvedLink } from "@/lib/seo/linking";
import { trackConversion, getClientTrackingContext } from "@/lib/seo/analytics";
import { generateStructuredData } from "@/lib/seo/structured-data";

interface MarketingPageProps {
  page: MarketingPageConfig;
  relatedPages?: ResolvedLink[];
}

export default function MarketingPage({ page, relatedPages = [] }: MarketingPageProps) {
  useEffect(() => {
    const ctx = getClientTrackingContext(page.slug, page.cluster);
    trackConversion("seo_landing_view", ctx);
  }, [page.slug, page.cluster]);

  const jsonLdString = generateStructuredData(page);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-violet-100 selection:text-violet-900">
      {/* Inject Google/Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          badge={page.badge}
          h1={page.h1}
          valueProposition={page.hero.valueProposition}
          openingAnswer={page.hero.openingAnswer}
          pageSlug={page.slug}
          contentCluster={page.cluster}
          audience={page.audience}
        />

        {/* 2. Step-by-Step Workflow */}
        <EventWorkflow
          title={page.workflow.title}
          steps={page.workflow.steps}
        />

        {/* 3. Detailed Features & Use Cases */}
        <FeatureExplanation
          features={page.features}
          h1={page.h1}
        />

        {/* 4. Practical Operational Scenario */}
        <EventUseCase
          scenario={page.practicalScenario}
        />

        {/* 5. Self-Service vs Remote Managed Service Comparison */}
        <ServiceComparison
          comparison={page.serviceComparison}
        />

        {/* 6. Pricing Disclosure */}
        <PricingDisclosure />

        {/* 7. FAQs */}
        <FAQSection
          faqs={page.faqs}
          title={`Frequently Asked Questions: ${page.badge}`}
        />

        {/* 8. Contextual Closing CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white border-b border-neutral-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100 mb-4">
              Get Started Today
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mb-4">
              Ready to Launch Your Event Registration & QR Entry?
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-xl mb-8">
              Join thousands of event organizers across India saving hours on check-ins, eliminating spreadsheet confusion, and keeping 100% of their ticket revenue.
            </p>

            <DualConversionCTA
              pageSlug={page.slug}
              contentCluster={page.cluster}
              position="footer"
              eventTypeName={page.h1}
            />
          </div>
        </section>

        {/* 9. Related Pages Directory */}
        <RelatedPages related={relatedPages} />
      </main>

      <Footer />
    </div>
  );
}
