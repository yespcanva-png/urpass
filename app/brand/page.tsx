import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  Download,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Globe,
  Tag,
  Palette,
  FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS Brand Assets & Media Kit | Official Brand Identity",
  description:
    "Official brand assets, logo guidelines, color palette, pronunciation, and media kit for URPASS (pronounced 'Your Pass'), the digital event passes and QR check-in platform by Yesp Corporation.",
  keywords: [
    "URPASS",
    "URPASS brand",
    "URPASS logo",
    "URPASS media kit",
    "URPASS official site",
    "URPASS space",
    "URPASS pronunciation",
    "what is URPASS",
    "URPASS press kit",
    "Yesp Corporation URPASS",
  ],
  alternates: { canonical: "https://urpass.space/brand" },
  openGraph: {
    title: "URPASS Brand Assets & Media Kit | Official Brand Identity",
    description:
      "Official brand identity, logos, and guidelines for URPASS — the modern event registration and QR check-in platform.",
    url: "https://urpass.space/brand",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "URPASS Brand Assets & Official Identity",
      },
    ],
  },
};

export default function BrandPage() {
  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": "https://urpass.space/#brand",
    name: "URPASS",
    alternateName: ["URPASS Space", "URPASS Event Passes", "urpass", "urpass.space"],
    url: "https://urpass.space",
    logo: "https://urpass.space/icon.png",
    slogan: "Create. Share. Scan. Instant digital event passes and sub-second QR check-in.",
    description:
      "URPASS (pronounced 'Your Pass') is a modern event ticketing, registration, and lightning QR entrance check-in platform developed by Yesp Corporation.",
    sameAs: [
      "https://www.instagram.com/urpass.space",
      "https://www.youtube.com/channel/UCzUliQs5vwGlLAM7X6aB9zg/",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://urpass.space",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Brand & Media Kit",
        item: "https://urpass.space/brand",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div>
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              OFFICIAL BRAND ASSETS &amp; MEDIA KIT
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              URPASS Brand Identity
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-4">
              Everything you need to reference, write about, and represent URPASS accurately in media, press, and partner integrations.
            </p>

            <div className="inline-flex items-center gap-3 bg-white border border-neutral-200/80 rounded-xl px-4 py-2.5 text-xs text-neutral-600 shadow-2xs">
              <span className="font-semibold text-neutral-900">Pronunciation:</span>
              <span className="font-mono text-emerald-700 font-medium">/jʊər pæs/ (&ldquo;Your Pass&rdquo;)</span>
              <span className="text-neutral-300">|</span>
              <span className="font-semibold text-neutral-900">Official Domain:</span>
              <span className="font-mono text-neutral-700 font-medium">urpass.space</span>
            </div>
          </div>
        </section>

        {/* Brand Overview & Entity Disambiguation */}
        <section className="py-20 px-5 sm:px-8 bg-white border-b border-neutral-100">
          <div className="max-w-4xl mx-auto">
            <AnimateIn>
              <div className="max-w-3xl mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                  Entity Overview
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                  What is URPASS?
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
                  <strong>URPASS</strong> is an event operating system and ticketing platform created by <strong>Yesp Corporation</strong>. It provides instant digital event passes, sub-second (under 0.3s) QR entry check-in, bespoke ticket design, automated approval workflows, and native Model Context Protocol (MCP) AI tooling for conferences, hackathons, college fests, workshops, and business events across India, the UK, and globally.
                </p>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/40">
                <h3 className="font-semibold text-neutral-900 text-base mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Spelling &amp; Casing Rules
                </h3>
                <ul className="space-y-2.5 text-sm text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-emerald-700 font-mono">DO:</span>
                    <span>Write as <strong>URPASS</strong> (all caps).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-emerald-700 font-mono">DO:</span>
                    <span>Refer to the website as <strong>urpass.space</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-red-600 font-mono">DON&apos;T:</span>
                    <span>Do not spell as &ldquo;Urpass&rdquo;, &ldquo;UrPass&rdquo;, &ldquo;Ur-pass&rdquo;, or confuse with &ldquo;surpass&rdquo;.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/40">
                <h3 className="font-semibold text-neutral-900 text-base mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  Key Brand Facts
                </h3>
                <dl className="space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                    <dt className="text-neutral-500">Legal Parent:</dt>
                    <dd className="font-medium text-neutral-900">Yesp Corporation</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                    <dt className="text-neutral-500">Founded:</dt>
                    <dd className="font-medium text-neutral-900">2026</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                    <dt className="text-neutral-500">Headquarters:</dt>
                    <dd className="font-medium text-neutral-900">Chennai, Tamil Nadu, India</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Core Verticals:</dt>
                    <dd className="font-medium text-neutral-900">Colleges, Tech Events, Summits</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Colors & Typography */}
        <section className="py-20 px-5 sm:px-8 bg-neutral-50/50 border-b border-neutral-100">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                Color Palette &amp; Type
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                Official Visual Language
              </h2>
              <p className="text-base text-neutral-600">
                Our clean, accessible visual identity is built on high contrast, precision typography, and vivid emerald accents.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="h-16 rounded-lg bg-emerald-600 mb-3 shadow-inner" />
                <p className="font-semibold text-xs text-neutral-900">Brand Emerald</p>
                <p className="text-[11px] font-mono text-neutral-500">#059669</p>
                <p className="text-[10px] text-neutral-400 mt-1">Primary accent</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="h-16 rounded-lg bg-neutral-900 mb-3 shadow-inner" />
                <p className="font-semibold text-xs text-neutral-900">Neutral 900</p>
                <p className="text-[11px] font-mono text-neutral-500">#171717</p>
                <p className="text-[10px] text-neutral-400 mt-1">Deep text &amp; headers</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="h-16 rounded-lg bg-neutral-100 mb-3 border border-neutral-200/80 shadow-inner" />
                <p className="font-semibold text-xs text-neutral-900">Surface 100</p>
                <p className="text-[11px] font-mono text-neutral-500">#F5F5F5</p>
                <p className="text-[10px] text-neutral-400 mt-1">Subtle backgrounds</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="h-16 rounded-lg bg-white mb-3 border border-neutral-300 shadow-inner" />
                <p className="font-semibold text-xs text-neutral-900">Pure White</p>
                <p className="text-[11px] font-mono text-neutral-500">#FFFFFF</p>
                <p className="text-[10px] text-neutral-400 mt-1">Cards &amp; canvases</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 bg-white">
              <h3 className="font-semibold text-neutral-900 text-sm mb-2">Typography</h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                URPASS utilizes <strong>Geist Sans</strong> by Vercel for interface hierarchy and high-legibility numerals, paired with <strong>Geist Mono</strong> for ticket serials, timestamps, and scan confirmation receipts.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-500">
                <span className="px-2.5 py-1 bg-neutral-100 rounded-md">Geist Sans (Regular, Medium, Semibold, Bold)</span>
                <span className="px-2.5 py-1 bg-neutral-100 rounded-md">Geist Mono (Ticketing &amp; Timestamps)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Assets & Downloads */}
        <section className="py-20 px-5 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
                Logos &amp; Mark
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                Official Logo Assets
              </h2>
              <p className="text-base text-neutral-600">
                Use the high-resolution vector and raster assets below when integrating or featuring URPASS.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {/* Light background logo */}
              <div className="border border-neutral-200 rounded-2xl p-8 bg-white flex flex-col items-center justify-between text-center min-h-[240px]">
                <div className="my-auto">
                  <span className="font-bold text-3xl tracking-tight text-neutral-900">
                    URPASS
                  </span>
                  <p className="text-xs text-neutral-400 mt-1 tracking-widest uppercase font-mono">Dark on Light</p>
                </div>
                <div className="w-full flex items-center justify-center gap-3 pt-4 border-t border-neutral-100">
                  <a
                    href="/icon.png"
                    download="urpass-logo.png"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PNG Mark
                  </a>
                  <a
                    href="/og-image.png"
                    download="urpass-social-banner.png"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Social Card (1200x630)
                  </a>
                </div>
              </div>

              {/* Dark background logo */}
              <div className="border border-neutral-800 rounded-2xl p-8 bg-neutral-950 flex flex-col items-center justify-between text-center min-h-[240px]">
                <div className="my-auto">
                  <span className="font-bold text-3xl tracking-tight text-white">
                    URPASS
                  </span>
                  <p className="text-xs text-neutral-500 mt-1 tracking-widest uppercase font-mono">Light on Dark</p>
                </div>
                <div className="w-full flex items-center justify-center gap-3 pt-4 border-t border-neutral-800">
                  <a
                    href="/icon.png"
                    download="urpass-white-logo.png"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PNG Mark
                  </a>
                </div>
              </div>
            </div>

            {/* Media Contact CTA */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">
                  Need custom press materials or founder interviews?
                </h3>
                <p className="text-xs text-neutral-600">
                  Contact our communications team for high-resolution vector assets, founder quotes, or co-marketing collateral.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/contact?subject=Brand%20and%20Media%20Inquiry"
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Contact Press Team
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
