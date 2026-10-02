import type { ElementType } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import FAQItemSection from "@/components/landing/FAQItemSection";
import BOFUDashboardVisual from "@/components/landing/BOFUDashboardVisual";
import BOFUTicketCalculator from "@/components/landing/BOFUTicketCalculator";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  DoorOpen,
  HelpCircle,
  QrCode,
  Receipt,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  Users,
  Zap,
} from "lucide-react";

export type BOFUCluster = "ticketing" | "college" | "enterprise" | "uk";

export interface BOFUFeature {
  icon: ElementType;
  title: string;
  desc: string;
}

export interface BOFUComparisonRow {
  criteria: string;
  urpass: string;
  competitor: string;
  urpassAdvantage?: boolean;
}

export interface BOFUPageConfig {
  h1: string;
  badge?: string;
  hook?: string;
  subDescription?: string;
  primaryCtaLabel: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  trustHighlights?: string[];
  currency?: "INR" | "GBP";
  cluster: BOFUCluster;
  canonicalUrl: string;
  description: string;
  features?: BOFUFeature[];
  comparisonRows?: BOFUComparisonRow[];
  competitorName?: string;
  customFaqs?: Array<{ q: string; a: string }>;
  pageSpecificTakeaway?: string;
}

const DEFAULT_INDIA_TRUST = [
  "₹0 to start",
  "Razorpay / UPI",
  "QR check-in",
  "WhatsApp passes",
];

const DEFAULT_UK_TRUST = [
  "£0 to start",
  "Stripe / Cards / Apple Pay",
  "QR check-in",
  "Apple Wallet & Email passes",
];

export const GEO_ENTITY_DEFINITION =
  "URPASS is an event registration, ticketing and QR check-in platform for event organisers. Organisers can create registration pages, sell tickets, collect payments, issue digital QR passes, deliver tickets and scan attendees at event entrances.";

export const CORE_GEO_FAQS = [
  {
    q: "What is URPASS?",
    a: "URPASS is an all-in-one event registration, ticketing, and QR check-in platform developed by Yesp Corporation. It enables organizers to launch branded event registration pages, sell tickets in INR or GBP with 0% platform commission, issue anti-duplicate digital QR passes, deliver passes via WhatsApp and email, and scan attendees in <0.3s using standard smartphone browsers.",
  },
  {
    q: "Who is URPASS for?",
    a: "URPASS is engineered for college fest organizers, conference producers, enterprise summit teams, corporate event managers, hackathons, workshop hosts, and exhibition directors who want transparent flat pricing, instant gate scanning, and direct payment gateway settlements.",
  },
  {
    q: "Does URPASS support paid events?",
    a: "Yes. Organizers can connect their verified Razorpay account (in India) or Stripe account (in the UK and internationally) to collect ticket payments directly. URPASS takes 0% commission on ticket revenue, allowing organizers to retain 100% of ticket sales minus standard payment gateway interchange fees.",
  },
  {
    q: "Can URPASS accept UPI?",
    a: "Yes. In India, attendees can pay with instant UPI apps including Google Pay, PhonePe, Paytm, Cred, and BHIM UPI with sub-5-second checkout, as well as net banking, debit cards, and credit cards.",
  },
  {
    q: "Does URPASS generate QR tickets?",
    a: "Yes. Every registration or ticket purchase instantly generates a cryptographically signed, high-contrast digital QR pass. Organizers can also customize the pass visual layout using URPASS Ticket Studio across 12 customizable badge and ticket templates.",
  },
  {
    q: "Can tickets be sent through WhatsApp?",
    a: "Yes. URPASS supports instant digital pass delivery via WhatsApp as well as email and Apple Wallet. Attendees receive their scannable QR ticket directly in their WhatsApp chat for frictionless venue entry.",
  },
  {
    q: "Can multiple gates scan tickets simultaneously?",
    a: "Yes. Gate scanners coordinate in real time using database-level atomic row locks. If an attendee or screenshot is presented at multiple venue gates simultaneously, the first scanner validates the ticket while all subsequent attempts trigger immediate amber duplicate alerts with entry timestamps.",
  },
  {
    q: "Can organisers use their own payment gateway?",
    a: "Yes. Organizers link their own direct merchant gateway (such as Razorpay or Stripe). All ticket proceeds deposit directly into the organizer's own bank account on standard T+2 rolling settlement cycles.",
  },
  {
    q: "Does URPASS support free events?",
    a: "Yes. URPASS offers a permanent Free Tier that includes up to 2 active events per month and up to 100 registrations per month with full QR code generation, browser-based mobile camera scanning, and attendee data export.",
  },
  {
    q: "How much does URPASS cost?",
    a: "URPASS offers transparent flat subscription pricing with 0% commission on ticket sales. In India, plans range from ₹0/mo (Free), ₹499/mo (Starter), to ₹999/mo (Pro). In the UK, plans start at £0/mo, £19/mo (Starter), and £39/mo (Pro). Enterprise and custom volume plans are also available.",
  },
];

export const CLUSTER_INTERNAL_LINKS: Record<
  BOFUCluster,
  { heading: string; description: string; links: Array<{ title: string; href: string; badge?: string }> }
> = {
  ticketing: {
    heading: "Explore the Ticketing & Payment Funnel",
    description: "Compare zero-commission models, payment gateways, and WhatsApp ticket delivery.",
    links: [
      { title: "Event Ticketing Software India", href: "/event-ticketing-software-india", badge: "Core" },
      { title: "Online Event Ticketing Platform India", href: "/online-event-ticketing-platform-india" },
      { title: "Zero Commission Event Ticketing India", href: "/zero-commission-event-ticketing-india", badge: "0% Fee" },
      { title: "Event Registration Software India", href: "/event-registration-software-india" },
      { title: "Razorpay Event Ticketing", href: "/razorpay-event-ticketing", badge: "Gateway" },
      { title: "UPI Event Ticketing Software", href: "/upi-event-ticketing-software" },
      { title: "WhatsApp Event Ticketing", href: "/whatsapp-event-ticketing", badge: "Delivery" },
      { title: "QR Code Event Check-In Software", href: "/qr-code-event-check-in-software" },
      { title: "QR Code Ticketing System", href: "/qr-code-ticketing-system", badge: "QR" },
      { title: "Event QR Code Scanner", href: "/event-qr-code-scanner", badge: "Scanner" },
      { title: "Online Ticket Booking System", href: "/online-ticket-booking-system-for-events" },
      { title: "Free Online Event Ticketing", href: "/free-online-event-ticketing", badge: "Free" },
      { title: "Event Ticketing Cost Calculator", href: "/event-ticketing-cost-calculator", badge: "Tool" },
      { title: "URPASS Pricing", href: "/pricing" },
    ],
  },
  college: {
    heading: "Campus & College Event Ecosystem",
    description: "Built for college fests, student symposiums, university summits, and campus clubs.",
    links: [
      { title: "College Event Management Software", href: "/college-event-management-software", badge: "Campus" },
      { title: "College Fest Ticketing Platform", href: "/college-fest-ticketing-platform", badge: "Fests" },
      { title: "College Cultural Fest Ticketing", href: "/college-cultural-fest-ticketing", badge: "Pronites" },
      { title: "College Fest Registration Software", href: "/college-fest-registration-software" },
      { title: "University Event Management System", href: "/university-event-management-system", badge: "Institutions" },
      { title: "Student Event Registration Platform", href: "/student-event-registration-platform", badge: "Clubs" },
      { title: "College Symposium Registration", href: "/college-symposium-registration-software", badge: "Academic" },
      { title: "College Workshop Registration", href: "/college-workshop-registration-system", badge: "Labs" },
      { title: "Inter-College Event Registration", href: "/inter-college-event-registration", badge: "Security" },
      { title: "Technical Symposium Registration", href: "/technical-symposium-registration", badge: "Coding" },
      { title: "Hackathon Registration Platform", href: "/hackathon-registration-platform" },
      { title: "Campus Events Hub", href: "/campus-events" },
      { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in" },
      { title: "Contact Campus Team", href: "/contact" },
    ],
  },
  enterprise: {
    heading: "Enterprise, Expo & Gate Infrastructure",
    description: "Multi-gate throughput, white-label ticketing, API integration, and trade show registration.",
    links: [
      { title: "Corporate Event Registration Software", href: "/corporate-event-registration-software", badge: "Corporate" },
      { title: "Conference Registration Software", href: "/conference-registration-software", badge: "Conferences" },
      { title: "Conference Ticketing Platform", href: "/conference-ticketing-platform" },
      { title: "Exhibition Registration Software", href: "/exhibition-registration-software", badge: "Expos" },
      { title: "Trade Show Registration Software", href: "/trade-show-registration-software" },
      { title: "Expo Ticketing Software", href: "/expo-ticketing-software" },
      { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", badge: "Gates" },
      { title: "White Label Event Ticketing", href: "/white-label-event-ticketing", badge: "Branding" },
      { title: "Event Ticketing API", href: "/event-ticketing-api", badge: "Developer" },
      { title: "Event Check-In Speed Calculator", href: "/event-check-in-calculator", badge: "Tool" },
    ],
  },
  uk: {
    heading: "United Kingdom Event Ecosystem",
    description: "Zero-commission ticketing with transparent GBP pricing and UK GDPR compliance.",
    links: [
      { title: "Event Ticketing Software UK", href: "/uk/event-ticketing-software", badge: "UK Hub" },
      { title: "Eventbrite Alternative UK", href: "/uk/eventbrite-alternative", badge: "Comparison" },
      { title: "QR Check-In Software UK", href: "/uk/qr-event-check-in-software", badge: "Scanner" },
      { title: "Conference Registration Software UK", href: "/uk/conference-registration-software", badge: "Conferences" },
      { title: "UK Student Union Event Ticketing", href: "/uk/student-union-event-ticketing" },
      { title: "All UK Event Hubs", href: "/uk" },
      { title: "Event Check-In Calculator", href: "/event-check-in-calculator", badge: "Tool" },
    ],
  },
};

export default function BOFUMoneyPage({ config }: { config: BOFUPageConfig }) {
  const isUk = config.currency === "GBP";
  const defaultHook = isUk
    ? "Sell tickets. Accept cards & Apple Pay. Send QR passes. Scan attendees. Keep your event revenue."
    : "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.";

  const hookText = config.hook ?? defaultHook;
  const trustList = config.trustHighlights ?? (isUk ? DEFAULT_UK_TRUST : DEFAULT_INDIA_TRUST);
  const primaryCta = config.primaryCtaLabel;
  const primaryHref = config.primaryCtaHref ?? "/signup";
  const secondaryCta = config.secondaryCtaLabel ?? "Book a Demo";
  const secondaryHref = config.secondaryCtaHref ?? "/contact";

  // Combine GEO entity FAQs with any custom page FAQs
  const combinedFaqs = [
    ...(config.customFaqs ?? []),
    ...CORE_GEO_FAQS,
  ];

  // Schema definitions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: combinedFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
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
      ...(isUk
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: "UK Ticketing",
              item: "https://urpass.space/uk",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: config.h1,
              item: config.canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: "Ticketing Solutions",
              item: "https://urpass.space/pricing",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: config.h1,
              item: config.canonicalUrl,
            },
          ]),
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "URPASS",
    alternateName: ["URPASS by Yesp", "Yesp URPASS"],
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Event Ticketing & Check-In Platform",
    operatingSystem: "Web, iOS, Android",
    url: config.canonicalUrl,
    publisher: {
      "@type": "Organization",
      "@id": "https://urpass.space/#yesp",
      name: "Yesp Corporation",
      url: "https://yespstudio.com",
    },
    description: `${config.description} — ${GEO_ENTITY_DEFINITION}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: isUk ? "GBP" : "INR",
      lowPrice: "0",
      highPrice: isUk ? "79" : "2499",
      offerCount: "4",
    },
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: config.h1,
    description: config.description,
    brand: {
      "@type": "Brand",
      name: "URPASS",
    },
    offers: {
      "@type": "Offer",
      url: config.canonicalUrl,
      priceCurrency: isUk ? "GBP" : "INR",
      price: "0",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "URPASS",
    url: "https://urpass.space",
    logo: "https://urpass.space/icon.png",
    parentOrganization: {
      "@type": "Organization",
      "@id": "https://urpass.space/#yesp",
      name: "Yesp Corporation",
      url: "https://yespstudio.com",
    },
    description: GEO_ENTITY_DEFINITION,
    sameAs: [
      "https://twitter.com/urpass_space",
      "https://github.com/yespcanva-png/urpass",
      "https://yespstudio.com",
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.h1,
    url: config.canonicalUrl,
    description: config.description,
    isPartOf: {
      "@type": "WebSite",
      name: "URPASS",
      url: "https://urpass.space",
    },
  };

  const clusterData = CLUSTER_INTERNAL_LINKS[config.cluster];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div>
        <Navbar />

        {/* SECTION 1: HERO (Commercial Visitor First, Google Second) */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-5 sm:px-8 bg-gradient-to-b from-neutral-50/80 via-white to-white">
          <div className="max-w-4xl mx-auto text-center">
            {/* Intent Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6 border border-brand-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              {config.badge ?? "BOTTOM-OF-FUNNEL TICKETING PLATFORM"}
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-6 text-neutral-900">
              {config.h1}
            </h1>

            {/* Immediate punchy commercial hook */}
            <p className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug max-w-3xl mx-auto mb-4 tracking-tight">
              {hookText}
            </p>

            {config.subDescription && (
              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-8">
                {config.subDescription}
              </p>
            )}

            {/* CTAs: Commercial First */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <span>{primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 border border-neutral-200 bg-white px-8 py-4 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <span>{secondaryCta}</span>
                <span className="text-neutral-400">→</span>
              </Link>
            </div>

            {/* Trust highlights pill row */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200/80 px-4 py-2.5 rounded-2xl shadow-2xs">
              {trustList.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                  {i > 0 && <span className="text-neutral-300">•</span>}
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: SHOW THE PRODUCT IMMEDIATELY */}
        <section className="py-16 sm:py-20 px-5 sm:px-8 bg-neutral-900 text-white">
          <div className="max-w-5xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Live Production Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Real-Time Gate Telemetry &amp; Attendance
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto">
              Track gross revenue, attendee check-ins, and multi-gate synchronization across your entire venue.
            </p>
          </div>
          <BOFUDashboardVisual currency={config.currency} />
        </section>

        {/* SECTION 3: MONEY CALCULATOR */}
        <section className="py-20 sm:py-24 px-5 sm:px-8 bg-neutral-50/70 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              Revenue Protection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
              Calculate Your Ticket Revenue &amp; Savings
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto">
              Compare 0% URPASS software pricing against traditional percentage-based platform deductions.
            </p>
          </div>
          <BOFUTicketCalculator
            currency={config.currency}
            primaryCtaLabel={primaryCta}
            primaryCtaHref={primaryHref}
          />
        </section>

        {/* SECTION 4: CORE SPECIFICATIONS / COMPARISON TABLE */}
        {config.comparisonRows && config.comparisonRows.length > 0 && (
          <section className="py-20 px-5 sm:px-8 bg-white border-t border-neutral-100">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-brand">
                  Commercial Comparison
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
                  URPASS vs. {config.competitorName ?? "Traditional Ticketing Platforms"}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  How URPASS delivers zero platform commission, direct settlements, and instant browser scanning.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-2xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="p-3.5 sm:p-4 font-bold text-neutral-900">Feature / Capability</th>
                      <th className="p-3.5 sm:p-4 font-bold text-brand">URPASS</th>
                      <th className="p-3.5 sm:p-4 font-bold text-neutral-600">
                        {config.competitorName ?? "Legacy Portals"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {config.comparisonRows.map((row, i) => (
                      <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-3.5 sm:p-4 font-semibold text-neutral-800">{row.criteria}</td>
                        <td className="p-3.5 sm:p-4 font-medium text-neutral-900">
                          <span className="text-brand font-bold mr-1.5">
                            {row.urpassAdvantage !== false ? "✓" : "●"}
                          </span>
                          {row.urpass}
                        </td>
                        <td className="p-3.5 sm:p-4 text-neutral-600">{row.competitor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* FEATURES GRID */}
        {config.features && config.features.length > 0 && (
          <section className="py-20 px-5 sm:px-8 bg-neutral-50/50 border-t border-neutral-100">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-brand">Core Architecture</span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
                  Built for Speed, Reliability, and Zero Cut
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.features.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs hover:border-brand-200 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 text-brand">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-1.5 text-sm">{title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: GEO OPTIMIZATION & ENTITY Q&A */}
        <section className="py-20 px-5 sm:px-8 bg-white border-t border-neutral-100">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Clean Definition Callout engineered for LLM entity extraction */}
            <div className="bg-gradient-to-br from-brand-50/50 via-white to-neutral-50 border border-brand-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-brand" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand">
                  Entity Overview &amp; Definition
                </span>
              </div>
              <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-semibold">
                {GEO_ENTITY_DEFINITION}
              </p>
              {config.pageSpecificTakeaway && (
                <p className="text-xs sm:text-sm text-neutral-600 mt-3 pt-3 border-t border-brand-100 leading-relaxed">
                  {config.pageSpecificTakeaway}
                </p>
              )}
            </div>

            {/* FAQ Accordion */}
            <div>
              <div className="text-center mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-brand">
                  Entity Questions &amp; Verification
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Structured answers about URPASS features, payment methods, gate hardware, and pricing.
                </p>
              </div>
              <FAQItemSection faqs={combinedFaqs} />
            </div>
          </div>
        </section>

        {/* SECTION 6: FUNNEL CLUSTER INTERNAL LINKS */}
        <section className="py-16 px-5 sm:px-8 bg-neutral-50/70 border-t border-neutral-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand">
                Related Commercial Pages
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                {clusterData.heading}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {clusterData.description}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {clusterData.links.map((link) => {
                const isActive = config.canonicalUrl.endsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      isActive
                        ? "bg-white border-brand shadow-xs ring-1 ring-brand/30"
                        : "bg-white border-neutral-200/80 hover:border-brand-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 group-hover:text-brand transition-colors">
                        {link.title}
                      </span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 7: FINAL INTENT CTA */}
        <section className="py-24 px-5 sm:px-8 bg-neutral-900 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Keep your event revenue. Start with URPASS.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Launch your registration in minutes. Accept payments directly to your merchant account with zero commission cut.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-xl text-sm font-bold hover:bg-neutral-100 transition-colors shadow-sm"
              >
                <span>{primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <span>{secondaryCta}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
