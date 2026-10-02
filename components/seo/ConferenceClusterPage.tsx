import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Mic,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Layers,
  Users,
  Check,
  X,
  HelpCircle,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import {
  CLUSTER_PAGES,
  PILLAR_SLUGS,
  ClusterPageConfig,
} from "@/lib/seo-cluster/data";

interface Props {
  slug: string;
}

export default function ConferenceClusterPage({ slug }: Props) {
  const page: ClusterPageConfig = CLUSTER_PAGES[slug] || CLUSTER_PAGES["event-agenda-builder"];
  const canonicalUrl = `https://urpass.space/${page.slug}`;

  // Pillar list for topic cluster navigation
  const pillarPages = PILLAR_SLUGS.map((pSlug) => CLUSTER_PAGES[pSlug]);

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://urpass.space/#organization",
        name: "UrPass",
        url: "https://urpass.space",
        logo: "https://urpass.space/icons/icon-512x512.png",
        sameAs: ["https://x.com/urpass_space"],
      },
      {
        "@type": "SoftwareApplication",
        name: `UrPass — ${page.h1}`,
        operatingSystem: "Web",
        applicationCategory: "BusinessApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
        },
        description: page.metaDescription,
        url: canonicalUrl,
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: page.title,
        description: page.metaDescription,
        breadcrumb: {
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
              name: "Conference Software",
              item: "https://urpass.space/conference-management-software",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: page.h1,
              item: canonicalUrl,
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="pt-24 lg:pt-28 pb-20">
        {/* ── 1. Hero Section ────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-6 pb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-bold tracking-widest uppercase text-neutral-700">
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
            {page.badge}
          </div>

          {/* H1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 leading-tight max-w-4xl mx-auto">
            {page.h1}
          </h1>

          {/* Opening Copy */}
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {page.openingCopy}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-neutral-950 text-white font-bold text-sm hover:bg-neutral-800 transition-all shadow-sm"
            >
              <span>Create Your Conference</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-neutral-800 font-semibold text-sm border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <span>Explore Pricing & Features</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-xs text-neutral-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              0% Ticket Commission
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Sub-second QR Check-in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Zero Hardware Required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Live Schedule Sync
            </span>
          </div>
        </section>

        {/* ── 2. Unified Product Story Flow Bar ─────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center mb-3">
              The Unified UrPass Conference Operating System
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-neutral-700">
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900">Registration</span>
              <span className="text-neutral-300">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900">Agenda</span>
              <span className="text-neutral-300">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900">Sessions</span>
              <span className="text-neutral-300">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900">Speakers</span>
              <span className="text-neutral-300">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900">QR Pass</span>
              <span className="text-neutral-300">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-violet-100 text-violet-900 font-extrabold">Session Check-In</span>
              <span className="text-neutral-300">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900">Analytics</span>
            </div>
          </div>
        </section>

        {/* ── 3. GEO Strategy: Concise Answer Blocks ──────────────────── */}
        {page.geoAnswers && page.geoAnswers.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Quick Facts & Entity Definition
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {page.geoAnswers.map((geo, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-2"
                  >
                    <h2 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-violet-600 shrink-0" />
                      <span>{geo.question}</span>
                    </h2>
                    <blockquote className="text-xs text-neutral-600 leading-relaxed pl-6 border-l-2 border-violet-500 m-0">
                      {geo.answer}
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 4. Deep Feature Capabilities ────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Enterprise Features Built for Scale
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Purpose-built capabilities designed for symposiums, developer summits, and academic conferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {page.features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs flex flex-col justify-between gap-4 hover:border-neutral-300 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {feat.points && (
                  <ul className="space-y-1.5 pt-2 border-t border-neutral-100">
                    {feat.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-[11px] text-neutral-600 flex items-start gap-1.5 leading-snug">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Comparison: UrPass vs Spreadsheets & Legacy Tools ───────── */}
        {page.comparison && page.comparison.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-violet-700 tracking-wider uppercase">
                  Modern Software vs Legacy Tools
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                  Why Modern Conferences Switch from Spreadsheets to UrPass
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 font-semibold uppercase text-[10px]">
                      <th className="py-3 px-3">Criteria</th>
                      <th className="py-3 px-3 w-1/2">Manual Spreadsheets & PDFs</th>
                      <th className="py-3 px-3 text-neutral-950 bg-violet-50/50 rounded-t-xl">
                        UrPass Platform
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {page.comparison.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-neutral-900">{row.criteria}</td>
                        <td className="py-3.5 px-3 text-neutral-500">
                          <span className="flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            {row.spreadsheet}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-neutral-900 bg-violet-50/30">
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {row.urpass}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── 6. Step-by-Step Workflow Explanation ────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase">
                Direct End-to-End Workflow
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                How UrPass Operates on Event Day
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-violet-400 font-bold">01. Registration</span>
                <p className="text-white/70">Attendee registers online and receives encrypted UrPass QR badge via email/SMS.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-violet-400 font-bold">02. Main Gate Entrance</span>
                <p className="text-white/70">Main entrance door scanner validates badge in &lt;0.3s. Turnstile flag clears.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-violet-400 font-bold">03. Session Discovery</span>
                <p className="text-white/70">Attendee browses live multi-track agenda on mobile pass and reserves workshop seats.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-violet-400 font-bold">04. Doorway Scan</span>
                <p className="text-white/70">Staff scans same primary QR at workshop doorway. Ticket tier and seat verified.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-violet-400 font-bold">05. Capacity Enforcement</span>
                <p className="text-white/70">Automatic room capacity lock prevents hallway crowding and seat poaching.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-violet-400 font-bold">06. Instant Reporting</span>
                <p className="text-white/70">Live dashboard logs session attendance, sponsor scan stats, and CPE compliance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Real FAQs Accordion ─────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Detailed answers about UrPass {page.primaryKeyword} capabilities.
            </p>
          </div>

          <div className="space-y-3">
            {page.faqs.map((faq, fIdx) => (
              <details
                key={fIdx}
                className="group bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs open:border-neutral-300 transition-all cursor-pointer"
              >
                <summary className="flex items-center justify-between text-sm font-bold text-neutral-900 list-none select-none">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-open:rotate-90 transition-transform shrink-0 ml-3" />
                </summary>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-3 mt-2 border-t border-neutral-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── 8. Stage 1 SEO Cluster Navigation ───────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-violet-700 tracking-wider uppercase">
                Stage 1 Topic Architecture
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
                Explore the Conference Management Cluster
              </h2>
            </div>

            {/* The 5 Pillar Pages */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Core Pillar Pages
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pillarPages.map((pillar) => (
                  <Link
                    key={pillar.slug}
                    href={`/${pillar.slug}`}
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      pillar.slug === page.slug
                        ? "bg-violet-50/80 border-violet-300 text-violet-950 shadow-2xs ring-1 ring-violet-400/50"
                        : "bg-neutral-50/60 border-neutral-200 text-neutral-800 hover:border-neutral-300 hover:bg-white"
                    }`}
                  >
                    <span>{pillar.h1}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Topics in this Sub-Cluster */}
            {page.relatedSlugs && page.relatedSlugs.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Related Topics & Sub-Features
                </span>
                <div className="flex flex-wrap gap-2">
                  {page.relatedSlugs.map((relSlug) => {
                    const relPage = CLUSTER_PAGES[relSlug];
                    if (!relPage) return null;
                    return (
                      <Link
                        key={relSlug}
                        href={`/${relSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-medium transition-colors"
                      >
                        <span>{relPage.primaryKeyword}</span>
                        <ChevronRight className="w-3 h-3 text-neutral-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 9. Final High-Impact CTA Banner ──────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-950 p-8 sm:p-12 text-center text-white space-y-4 shadow-xl">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(109,40,217,0.8), transparent 70%)",
              }}
            />
            <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Launch Your Conference with UrPass
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Join thousands of organizers running conferences, summits, and symposiums with zero commission, sub-second QR entrance validation, and unified multi-track agendas.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/create-event"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-sm"
                >
                  Create Your Event Now &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-xs border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Talk to Our Team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
