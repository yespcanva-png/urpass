import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import AnimateIn from "@/components/ui/AnimateIn";
import FAQItemSection from "@/components/landing/FAQItemSection";
import Footer from "@/components/landing/Footer";

export interface SEOFeature {
  icon: React.ElementType;
  title: string;
  desc: string;
}

export interface SEOFaq {
  q: string;
  a: string;
}

export interface SEOGeo {
  region: string;
  placename: string;
  position: string;
  latitude: number;
  longitude: number;
}

export interface SEOPageConfig {
  badge: string;
  h1: string;
  description: string;
  ctaLabel?: string;
  features: SEOFeature[];
  steps?: { n: string; title: string; desc: string }[];
  callout?: {
    badge: string;
    title: string;
    description: string;
    bullets: string[];
  };
  useCases?: string[];
  faqs: SEOFaq[];
  ctaTitle?: string;
  ctaDescription?: string;
  geo?: SEOGeo;
  canonicalUrl?: string;
}

const DEFAULT_STEPS = [
  { n: "01", title: "Create",  desc: "Set up your event, configure registration fields, and set capacity." },
  { n: "02", title: "Share",   desc: "Share your public registration link — no logins needed for attendees." },
  { n: "03", title: "Approve", desc: "Review applications and issue digital QR passes in one click." },
  { n: "04", title: "Scan",    desc: "Use any phone or tablet as a scanner at the entrance." },
  { n: "05", title: "Track",   desc: "Monitor check-ins and attendance in real time on your dashboard." },
];

const INDIAN_HUBS = [
  { name: "Bengaluru", state: "Karnataka", href: "/in/bangalore", tag: "Tech & Startups" },
  { name: "Chennai", state: "Tamil Nadu", href: "/in/chennai", tag: "Colleges & Fests" },
  { name: "Mumbai", state: "Maharashtra", href: "/in/mumbai", tag: "Summits & Business" },
  { name: "Hyderabad", state: "Telangana", href: "/in/hyderabad", tag: "IT & Hackathons" },
  { name: "Delhi NCR", state: "National Capital", href: "/in/delhi", tag: "Conferences & Meets" },
  { name: "Pune", state: "Maharashtra", href: "/in/pune", tag: "Student & Tech Fests" },
  { name: "Coimbatore", state: "Tamil Nadu", href: "/in/coimbatore", tag: "Engineering & Workshops" },
  { name: "Kochi", state: "Kerala", href: "/in/kochi", tag: "Startups & Creator Events" },
  { name: "Kolkata", state: "West Bengal", href: "/in/kolkata", tag: "Cultural & Tech Fests" },
  { name: "Ahmedabad", state: "Gujarat", href: "/in/ahmedabad", tag: "Business & Innovation" },
  { name: "All India", state: "National Hub", href: "/in", tag: "INR Pricing & Razorpay" },
];

export default function SEOPage({ config }: { config: SEOPageConfig }) {
  const steps = config.steps ?? DEFAULT_STEPS;
  const canonical = config.canonicalUrl || "https://urpass.space";

  const faqSchema =
    config.faqs && config.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: config.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        }
      : null;

  const isCityPage = canonical.includes("/in/") && canonical !== "https://urpass.space/in";
  const isGuidePage = canonical.includes("/guides/");
  const isComparePage = canonical.includes("/compare/");

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://urpass.space",
    },
  ];

  if (isCityPage) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: "Events in India",
      item: "https://urpass.space/in",
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: config.geo?.placename || config.h1,
      item: canonical,
    });
  } else if (isGuidePage) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: "Guides",
      item: "https://urpass.space/guides/what-is-qr-event-check-in",
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: config.h1,
      item: canonical,
    });
  } else if (isComparePage) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: "Alternatives & Comparisons",
      item: "https://urpass.space/compare/eventbrite-alternative",
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: config.h1,
      item: canonical,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: config.h1,
      item: canonical,
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const geoSchema = config.geo
    ? {
        "@context": "https://schema.org",
        "@type": "Place",
        "@id": `${canonical}#place`,
        name: config.geo.placename,
        geo: {
          "@type": "GeoCoordinates",
          latitude: config.geo.latitude,
          longitude: config.geo.longitude,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: config.geo.placename,
          addressRegion: config.geo.region,
          addressCountry: "IN",
        },
      }
    : null;

  const serviceSchema = config.geo
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: config.h1,
        serviceType: "Event Registration, Ticketing & QR Check-In Platform",
        description: config.description,
        provider: {
          "@type": "Organization",
          name: "URPASS",
          url: "https://urpass.space",
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: config.geo.placename,
          containedInPlace: {
            "@type": "Country",
            name: "India",
          },
        },
        serviceOutput: "Digital QR Event Pass & Real-time Attendance Analytics",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: "0",
          highPrice: "799",
          offerCount: "3",
        },
      }
    : null;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {geoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(geoSchema) }}
        />
      )}
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      <div>
        <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-32 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
            {config.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] mb-6">
            {config.h1}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-10">
            {config.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors"
            >
              {config.ctaLabel ?? "Start for free"}
              <span className="text-neutral-400">→</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 border border-neutral-200 px-7 py-3.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              View pricing
            </Link>
          </div>
          <p className="mt-6 text-xs text-neutral-400">Free plan available · No credit card required</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-5 sm:px-8 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest text-brand mb-3">FEATURES</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Everything you need
              </h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.features.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 80} from="up">
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 h-full hover:border-brand-200 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-brand mb-3">HOW IT WORKS</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">One simple workflow</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <AnimateIn key={step.n} delay={i * 80} from="up">
                <div className="relative h-full">
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-5 left-full w-full h-px bg-neutral-100 z-0" />
                  )}
                  <div className="relative bg-white border border-neutral-100 rounded-2xl p-5 hover:border-brand-200 hover:shadow-sm transition-all h-full">
                    <span className="text-xs font-mono text-neutral-300 mb-3 block">{step.n}</span>
                    <h3 className="font-semibold text-neutral-900 mb-1.5">{step.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Callout / dark section */}
      {config.callout && (
        <section className="py-28 px-5 sm:px-8 bg-neutral-900">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimateIn from="left">
              <div>
                <p className="text-xs font-semibold tracking-widest text-brand-200 mb-4">
                  {config.callout.badge}
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-6">
                  {config.callout.title}
                </h2>
                <p className="text-white/50 text-base leading-relaxed mb-6">
                  {config.callout.description}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {config.callout.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-white/60">
                      <span className="w-1 h-1 rounded-full bg-brand block shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
            <AnimateIn from="right" delay={80}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-white/50">PASS SCANNED</p>
                    <p className="text-sm font-semibold text-white mt-0.5">Attendee check-in successful</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                  {["Real-time dashboard update", "Duplicate entry prevented", "Check-in timestamp recorded"].map((t) => (
                    <div key={t} className="flex items-center gap-2.5 text-sm text-white/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand block shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      )}

      {/* Use cases */}
      {config.useCases && config.useCases.length > 0 && (
        <section className="py-20 px-5 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <AnimateIn>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
                Works for every type of event
              </h2>
            </AnimateIn>
            <div className="flex flex-wrap gap-3 justify-center">
              {config.useCases.map((uc, i) => (
                <AnimateIn key={uc} delay={i * 40} from="scale">
                  <div className="border border-neutral-100 rounded-2xl px-5 py-3 text-sm font-medium text-neutral-700 hover:border-brand-200 hover:bg-brand-50 transition-all">
                    {uc}
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Indian Hubs Directory (for Geo & Local SEO Authority) */}
      {(config.geo || canonical.includes("/in")) && (
        <section className="py-16 px-5 sm:px-8 bg-neutral-50/80 border-t border-neutral-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand">Regional Event Ecosystems</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                Event Registration &amp; QR Check-In across India
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Local INR pricing, Razorpay payment gateway integration, and rapid 0.2s entry check-in tailored for Indian hubs.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {INDIAN_HUBS.map((hub) => {
                const isActive = canonical.endsWith(hub.href);
                return (
                  <Link
                    key={hub.href}
                    href={hub.href}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isActive
                        ? "bg-white border-brand shadow-xs ring-1 ring-brand/30"
                        : "bg-white border-neutral-200/80 hover:border-neutral-400 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-neutral-900">{hub.name}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                    </div>
                    <span className="text-[10px] text-neutral-500 block">{hub.state}</span>
                    <span className="text-[9px] font-semibold text-brand/80 mt-1 block truncate">
                      {hub.tag}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 px-5 sm:px-8 bg-neutral-900">
        <div className="max-w-2xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
              {config.ctaTitle ?? "Start your first event today"}
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              {config.ctaDescription ?? "Free plan · No credit card · Up and running in 5 minutes"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors"
              >
                Create free account
                <span className="text-neutral-400">→</span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
              >
                See plans
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      </div>
      <Footer />
    </div>
  );
}
