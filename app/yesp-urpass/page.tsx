import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  Building2,
  QrCode,
  ShieldCheck,
  Zap,
  Globe2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Yesp URPASS — Event Registration & QR Ticketing Platform",
  description:
    "URPASS is an event technology platform developed by Yesp Corporation for managing event registrations, digital tickets, payments, QR passes, attendee check-in and attendance analytics from one system.",
  keywords: [
    "Yesp URPASS",
    "URPASS Yesp",
    "Yesp event platform",
    "Yesp Corporation URPASS",
    "URPASS by Yesp",
    "Yesp ticketing platform",
    "Yesp QR event software",
    "Yesp event registration software",
  ],
  alternates: { canonical: "https://urpass.space/yesp-urpass" },
  openGraph: {
    title: "Yesp URPASS — Event Registration & QR Ticketing Platform",
    description:
      "URPASS is an event technology platform developed by Yesp Corporation for managing event registrations, digital tickets, payments, QR passes, attendee check-in and attendance analytics.",
    url: "https://urpass.space/yesp-urpass",
    type: "website",
  },
};

export default function YespUrpassPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://urpass.space/#yesp",
        "name": "Yesp Corporation",
        "url": "https://yespstudio.com",
        "description": "Technology company developing digital products and business software.",
        "sameAs": [
          "https://yespstudio.com"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://urpass.space/#urpass",
        "name": "URPASS",
        "alternateName": [
          "URPASS by Yesp",
          "Yesp URPASS",
          "Yesp Corporation URPASS"
        ],
        "url": "https://urpass.space/yesp-urpass",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, iOS, Android",
        "publisher": {
          "@id": "https://urpass.space/#yesp"
        },
        "description": "Event registration, ticketing and QR check-in platform developed by Yesp Corporation.",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": "0",
          "highPrice": "2499",
          "offerCount": "4"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is URPASS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "URPASS is an event registration, ticketing and QR check-in platform developed by Yesp Corporation. It helps organizers create events, collect registrations, issue digital QR passes, accept payments and verify attendees at event entrances using smartphones."
            }
          },
          {
            "@type": "Question",
            "name": "Who developed URPASS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "URPASS is developed, owned and maintained by Yesp Corporation, a technology product company."
            }
          },
          {
            "@type": "Question",
            "name": "What does URPASS do?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "URPASS provides end-to-end event infrastructure: custom event landing pages, registration forms, payment gateways (UPI & cards via Razorpay), instant digital QR passes, sub-second smartphone check-in scanners, and real-time attendance analytics."
            }
          },
          {
            "@type": "Question",
            "name": "Who uses URPASS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "URPASS is designed for colleges, universities, student fests, hackathons, tech conferences, workshops, corporate summits, and community organizers."
            }
          },
          {
            "@type": "Question",
            "name": "Is URPASS owned by Yesp Corporation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, URPASS is an official software product created, operated, and wholly owned by Yesp Corporation."
            }
          },
          {
            "@type": "Question",
            "name": "Where is URPASS available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "URPASS is available globally via web browser, with dedicated regional hubs and localized payment processing for India (INR / UPI) and the United Kingdom (GBP)."
            }
          }
        ]
      }
    ]
  };

  const answerBlocks = [
    {
      q: "What is URPASS?",
      a: "URPASS is an event registration, ticketing and QR check-in platform developed by Yesp Corporation. It helps organizers create events, collect registrations, issue digital QR passes, accept payments and verify attendees at event entrances using smartphones.",
      icon: Sparkles,
    },
    {
      q: "Who developed URPASS?",
      a: "URPASS is developed, owned and operated by Yesp Corporation, an engineering and technology company building modern digital workflow software for organizations and businesses worldwide.",
      icon: Building2,
    },
    {
      q: "What does URPASS do?",
      a: "URPASS manages the complete lifecycle from attendee registration and payment processing through to digital QR pass issuance, entrance verification scanning in under 0.3 seconds, and real-time attendance analytics.",
      icon: Zap,
    },
    {
      q: "Who uses URPASS?",
      a: "URPASS is built for colleges, universities, engineering institutes, hackathons, conferences, workshops, corporate summits, meetups, and independent event organizers.",
      icon: Users,
    },
    {
      q: "Is URPASS owned by Yesp Corporation?",
      a: "Yes. URPASS is an official SaaS product created and operated by Yesp Corporation. All intellectual property, technology infrastructure, and product roadmaps are directed by Yesp Corporation.",
      icon: ShieldCheck,
    },
    {
      q: "Where is URPASS available?",
      a: "URPASS operates worldwide as a web-first application. It offers dedicated regional hubs with native payment rails in India (INR ₹ via UPI & Razorpay), the United Kingdom (GBP £), and globally.",
      icon: Globe2,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              OFFICIAL ENTITY RELATIONSHIP
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              URPASS by Yesp Corporation
            </h1>

            <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed max-w-2xl mx-auto mb-6 font-medium">
              URPASS is an event technology platform developed by Yesp Corporation for managing event registrations, digital tickets, payments, QR passes, attendee check-in and attendance analytics from one system.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Product of Yesp Corporation
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Zero Commission Platform
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Global &amp; Regional Hubs
              </span>
            </div>
          </div>
        </section>

        {/* Core AI / GEO Answer Blocks */}
        <section className="py-20 sm:py-28 px-5 sm:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <div className="text-center mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-brand block mb-2">Entity Knowledge Base</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                  Official Entity Information &amp; Answers
                </h2>
                <p className="text-neutral-500 text-sm sm:text-base max-w-xl mx-auto">
                  Direct, authoritative definitions for organizers, developers, search engines, and artificial intelligence models.
                </p>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {answerBlocks.map((block, i) => {
                const Icon = block.icon;
                return (
                  <AnimateIn key={block.q} delay={i * 60} from="up">
                    <div className="p-6 sm:p-7 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-brand-200 hover:shadow-xs transition-all h-full flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-brand mb-4 shadow-2xs">
                          <Icon className="w-5 h-5 text-brand" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-2">
                          {block.q}
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {block.a}
                        </p>
                      </div>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>

            {/* Entity Relationship Card */}
            <AnimateIn>
              <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200 bg-neutral-900 text-white">
                <div className="max-w-3xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-300 block mb-2">Corporate Hierarchy</span>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                    Yesp Corporation → Software Builder &middot; URPASS → Event SaaS
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6">
                    Yesp Corporation conceives, engineers, and operates modern software products. URPASS represents Yesp&apos;s flagship event infrastructure platform, replacing clunky registration forms, ticket commissions, and hardware scanner rentals with an integrated web platform.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/company"
                      className="inline-flex items-center gap-2 bg-white text-neutral-900 px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-neutral-100 transition-colors"
                    >
                      Read Company Background <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href="https://yespstudio.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold border border-neutral-700 hover:bg-neutral-750 transition-colors"
                    >
                      Visit Yesp Corporation ↗
                    </a>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
