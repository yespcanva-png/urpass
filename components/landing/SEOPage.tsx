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

export interface SEODeepDiveSection {
  badge?: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  takeaway?: string;
}

export interface SEORelatedLink {
  title: string;
  href: string;
  category: "Product" | "Use Case" | "Guide" | "Comparison" | "Location";
}

export interface SEODirectAnswer {
  title?: string;
  summary: string;
  keyPoints?: string[];
}

export interface SEOKeyFactsTable {
  title?: string;
  subtitle?: string;
  headers: [string, string, string?];
  rows: Array<{
    col1: string;
    col2: string;
    col3?: string;
  }>;
}

export interface SEOProductProof {
  badge?: string;
  title: string;
  description: string;
  type: "ticket-studio" | "scanner" | "analytics" | "passes";
}

export interface SEOIndiaHighlights {
  title?: string;
  subtitle?: string;
  items: Array<{
    title: string;
    description: string;
    badge?: string;
  }>;
}

export interface SEOCompetitorComparison {
  title?: string;
  subtitle?: string;
  competitorName: string;
  sourceCitations?: string[];
  rows: Array<{
    criteria: string;
    urpass: string;
    competitor: string;
    urpassAdvantage?: boolean;
  }>;
}

export interface SEOPageConfig {
  badge: string;
  h1: string;
  description: string;
  directAnswer?: SEODirectAnswer;
  keyFactsTable?: SEOKeyFactsTable;
  productProof?: SEOProductProof;
  indiaHighlights?: SEOIndiaHighlights;
  competitorComparison?: SEOCompetitorComparison;
  ctaLabel?: string;
  features: SEOFeature[];
  steps?: { n: string; title: string; desc: string }[];
  callout?: {
    badge: string;
    title: string;
    description: string;
    bullets: string[];
  };
  deepDiveSections?: SEODeepDiveSection[];
  useCases?: string[];
  relatedLinks?: SEORelatedLink[];
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
      item: "https://urpass.space/guides",
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
      item: "https://urpass.space/compare",
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
          highPrice: "2499",
          offerCount: "4",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "URPASS",
            applicationCategory: "BusinessApplication",
            applicationSubCategory: "Event Ticketing & Check-In Platform",
            operatingSystem: "Web, iOS, Android",
            url: canonical,
            description: `${config.description} — URPASS is an India-focused digital event registration, QR pass and check-in platform for colleges, conferences, hackathons, workshops and corporate events.`,
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "INR",
              lowPrice: "0",
              highPrice: "2499",
              offerCount: "4",
            },
          }),
        }}
      />
      <div>
        <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-32 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {breadcrumbItems.length > 1 && (
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center flex-wrap gap-2 text-xs text-neutral-400">
              {breadcrumbItems.map((item, idx) => {
                const isLast = idx === breadcrumbItems.length - 1;
                return (
                  <span key={item.position} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-neutral-300">/</span>}
                    {isLast ? (
                      <span className="text-neutral-600 font-medium truncate max-w-[200px] sm:max-w-xs">{item.name}</span>
                    ) : (
                      <Link href={item.item.replace("https://urpass.space", "") || "/"} className="hover:text-neutral-900 transition-colors">
                        {item.name}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
          )}
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

          {/* Direct Answer at the top: 40-80 words engineered for Featured Snippets & AI Search */}
          {config.directAnswer && (
            <div className="mt-12 text-left bg-gradient-to-br from-brand-50/40 via-white to-neutral-50/80 border border-brand-200/70 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-brand" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand">
                  {config.directAnswer.title || "Direct Answer & Overview"}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-medium">
                {config.directAnswer.summary}
              </p>
              {config.directAnswer.keyPoints && config.directAnswer.keyPoints.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-brand-100">
                  {config.directAnswer.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                      <span className="text-brand font-bold">✓</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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

      {/* Key Facts / Specifications Table */}
      {config.keyFactsTable && (
        <section className="py-20 px-5 sm:px-8 bg-white border-t border-neutral-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-xs font-semibold tracking-widest text-brand mb-2">QUICK COMPARISON &amp; KEY FACTS</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                {config.keyFactsTable.title || "Key Specifications & Capabilities"}
              </h2>
              {config.keyFactsTable.subtitle && (
                <p className="text-sm text-neutral-500 mt-2">{config.keyFactsTable.subtitle}</p>
              )}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-2xs">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="p-3.5 sm:p-4 font-bold text-neutral-900">{config.keyFactsTable.headers[0]}</th>
                    <th className="p-3.5 sm:p-4 font-bold text-brand">{config.keyFactsTable.headers[1]}</th>
                    {config.keyFactsTable.headers[2] && (
                      <th className="p-3.5 sm:p-4 font-bold text-neutral-600">{config.keyFactsTable.headers[2]}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {config.keyFactsTable.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-3.5 sm:p-4 font-semibold text-neutral-800">{r.col1}</td>
                      <td className="p-3.5 sm:p-4 font-medium text-neutral-900">{r.col2}</td>
                      {r.col3 && <td className="p-3.5 sm:p-4 text-neutral-500">{r.col3}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Real Product Proof */}
      {config.productProof && (
        <section className="py-20 px-5 sm:px-8 bg-neutral-900 text-white border-t border-neutral-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              {config.productProof.badge && (
                <span className="text-xs font-semibold tracking-widest text-brand-200 uppercase bg-brand/10 border border-brand/20 px-3.5 py-1 rounded-full inline-block mb-3">
                  {config.productProof.badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
                {config.productProof.title}
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                {config.productProof.description}
              </p>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
              {config.productProof.type === "ticket-studio" ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4 text-xs">
                    <span className="font-mono text-brand">URPASS TICKET STUDIO // WYSIWYG CANVAS</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">12 Built-In Templates</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-bold text-neutral-500">FORMAT 01</span>
                      <h4 className="text-sm font-bold text-white my-2">Digital Mobile Pass</h4>
                      <p className="text-xs text-neutral-400">Vertical 380x680px layout with scannable QR and Apple Wallet delivery.</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-bold text-neutral-500">FORMAT 02</span>
                      <h4 className="text-sm font-bold text-white my-2">Printable Ticket</h4>
                      <p className="text-xs text-neutral-400">Landscape 780x340px ticket with perforated tear-off stub for physical check-in.</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-bold text-neutral-500">FORMAT 03</span>
                      <h4 className="text-sm font-bold text-white my-2">Conference Badge</h4>
                      <p className="text-xs text-neutral-400">Lanyard badge 440x640px with student/speaker credentials and gate tier.</p>
                    </div>
                  </div>
                </div>
              ) : config.productProof.type === "scanner" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">SUB-SECOND CHECK-IN SPEED</span>
                    <h3 className="text-2xl font-bold text-white">Any Smartphone as Gate Scanner</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Volunteers open a simple URL in Safari or Chrome. No app download or account creation required. Sub-second QR verification with audio chime and haptic buzz.
                    </p>
                    <div className="flex items-center gap-4 text-xs font-semibold text-neutral-300">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> &lt;0.3s Scan Time</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand" /> Offline Sync Support</span>
                    </div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                      <span>Gate 1 · Main Entrance</span>
                      <span className="text-emerald-400 font-bold">LIVE ONLINE</span>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">CHECKED IN</span>
                      <p className="text-base font-bold text-white mt-1">Arjun Kumar · VIP Pass</p>
                      <span className="text-[11px] font-mono text-neutral-400">#URP-10284 · 10:14:02 AM</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                    <span className="text-3xl font-extrabold text-white">99.8%</span>
                    <p className="text-xs text-neutral-400 mt-1">Check-in Accuracy</p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                    <span className="text-3xl font-extrabold text-brand">0.3s</span>
                    <p className="text-xs text-neutral-400 mt-1">Gate Validation Speed</p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                    <span className="text-3xl font-extrabold text-emerald-400">0%</span>
                    <p className="text-xs text-neutral-400 mt-1">Ticketing Commission</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* India-Specific Features */}
      {config.indiaHighlights && (
        <section className="py-20 px-5 sm:px-8 bg-neutral-50/70 border-t border-neutral-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-semibold tracking-widest text-brand mb-2">BUILT FOR INDIA</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                {config.indiaHighlights.title || "Engineered for Indian Events & UPI Payments"}
              </h2>
              {config.indiaHighlights.subtitle && (
                <p className="text-sm text-neutral-500 mt-2">{config.indiaHighlights.subtitle}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.indiaHighlights.items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-2xs hover:border-brand-200 transition-all">
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand inline-block mb-3">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-neutral-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Competitor Comparison Section */}
      {config.competitorComparison && (
        <section className="py-20 px-5 sm:px-8 bg-white border-t border-neutral-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-xs font-semibold tracking-widest text-brand mb-2">COMPETITIVE COMPARISON</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                {config.competitorComparison.title || `URPASS vs ${config.competitorComparison.competitorName}`}
              </h2>
              {config.competitorComparison.subtitle && (
                <p className="text-sm text-neutral-500 mt-2">{config.competitorComparison.subtitle}</p>
              )}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-2xs">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="p-3.5 sm:p-4 font-bold text-neutral-900">Evaluation Criteria</th>
                    <th className="p-3.5 sm:p-4 font-bold text-brand">URPASS</th>
                    <th className="p-3.5 sm:p-4 font-bold text-neutral-600">{config.competitorComparison.competitorName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {config.competitorComparison.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-3.5 sm:p-4 font-semibold text-neutral-800">{row.criteria}</td>
                      <td className="p-3.5 sm:p-4 font-medium text-neutral-900">
                        <span className="text-brand font-bold mr-1.5">{row.urpassAdvantage !== false ? "✓" : "●"}</span>
                        {row.urpass}
                      </td>
                      <td className="p-3.5 sm:p-4 text-neutral-600">{row.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {config.competitorComparison.sourceCitations && config.competitorComparison.sourceCitations.length > 0 && (
              <p className="text-[11px] text-neutral-400 mt-3 text-center">
                Sources: {config.competitorComparison.sourceCitations.join(" · ")}
              </p>
            )}
          </div>
        </section>
      )}

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

      {/* Editorial Deep Dive / In-Depth Content */}
      {config.deepDiveSections && config.deepDiveSections.length > 0 && (
        <section className="py-20 px-5 sm:px-8 bg-white border-t border-neutral-100">
          <div className="max-w-4xl mx-auto space-y-16">
            {config.deepDiveSections.map((section, idx) => (
              <AnimateIn key={section.title} delay={idx * 60} from="up">
                <div className="space-y-5">
                  {section.badge && (
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand bg-brand-50 border border-brand-100 px-3 py-1 rounded-full inline-block">
                      {section.badge}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-base text-neutral-600 leading-relaxed">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {section.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-sm text-neutral-700 bg-neutral-50 border border-neutral-100 rounded-xl p-3.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.takeaway && (
                    <div className="bg-brand-50/60 border-l-4 border-brand p-4 rounded-r-xl text-sm text-neutral-800 font-medium">
                      <strong className="text-brand font-bold block mb-1">Key Takeaway:</strong>
                      {section.takeaway}
                    </div>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        </section>
      )}

      {/* Use cases */}
      {config.useCases && config.useCases.length > 0 && (
        <section className="py-20 px-5 sm:px-8 bg-neutral-50/60 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto text-center">
            <AnimateIn>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
                Works for every type of event
              </h2>
            </AnimateIn>
            <div className="flex flex-wrap gap-3 justify-center">
              {config.useCases.map((uc, i) => (
                <AnimateIn key={uc} delay={i * 40} from="scale">
                  <div className="border border-neutral-200/80 bg-white rounded-2xl px-5 py-3 text-sm font-medium text-neutral-700 hover:border-brand-200 hover:bg-brand-50 transition-all">
                    {uc}
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Ecosystem / Related Cluster Links */}
      {config.relatedLinks && config.relatedLinks.length > 0 && (
        <section className="py-16 px-5 sm:px-8 bg-white border-t border-neutral-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand">Content Ecosystem</span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 mt-1">
                Explore Related Guides &amp; Solutions
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Discover how URPASS powers ticketing, digital credentials, and entrance management across different scenarios.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {config.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 hover:border-brand-300 hover:bg-white hover:shadow-xs transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                      {link.category}
                    </span>
                    <span className="text-neutral-400 group-hover:text-brand transition-colors text-xs font-semibold">
                      &rarr;
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900 group-hover:text-brand transition-colors">
                    {link.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion Section */}
      {config.faqs && config.faqs.length > 0 && (
        <FAQItemSection faqs={config.faqs} />
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
                Local INR pricing, Razorpay payment gateway integration, and fast, sub-second QR check-in tailored for Indian hubs.
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
