import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  Newspaper,
  Calendar,
  ArrowRight,
  ExternalLink,
  Download,
  Mail,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS Press & Newsroom — Company Announcements & Media",
  description:
    "Official press releases, product updates, and media announcements from URPASS and Yesp Corporation. Media kit, founder interviews, and partnership inquiries.",
  keywords: [
    "URPASS press",
    "URPASS news",
    "URPASS press release",
    "Yesp Corporation newsroom",
    "URPASS media contact",
  ],
  alternates: { canonical: "https://urpass.space/press" },
  openGraph: {
    title: "URPASS Press & Newsroom — Company Announcements",
    description:
      "Latest announcements, product releases, and media resources for URPASS.",
    url: "https://urpass.space/press",
    locale: "en_IN",
    type: "website",
  },
};

const pressReleases = [
  {
    date: "September 2026",
    title: "URPASS Introduces Native Model Context Protocol (MCP) AI Server for Event Operations",
    excerpt:
      "Yesp Corporation announces full Model Context Protocol integration, enabling organizers to manage attendee lists, gate validation, and attendance analytics directly from Claude Desktop and Cursor.",
    category: "Product Launch",
    href: "/mcp-event-management",
  },
  {
    date: "August 2026",
    title: "URPASS Expands Across UK and European Higher Education Institutions",
    excerpt:
      "Following strong adoption across Indian university fests and developer hackathons, URPASS launches dedicated multi-currency GBP support and zero-commission ticketing for student unions.",
    category: "Expansion",
    href: "/uk",
  },
  {
    date: "June 2026",
    title: "Ticket Studio & Bespoke Badge Designer Released for Corporate Summits",
    excerpt:
      "Organizers can now design custom attendee badges, dynamic QR lanyard templates, and VIP access tags with an intuitive drag-and-drop studio.",
    category: "Feature Release",
    href: "/ticket-templates",
  },
  {
    date: "March 2026",
    title: "URPASS Launches Zero-Commission Ticketing with Direct UPI & Razorpay Settlement",
    excerpt:
      "URPASS challenges legacy ticketing giants by giving organizers 100% of their ticket earnings with instant direct deposits to their own merchant accounts.",
    category: "Company Milestone",
    href: "/zero-commission-event-ticketing",
  },
];

export default function PressPage() {
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
        name: "Press",
        item: "https://urpass.space/press",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div>
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              PRESS &amp; MEDIA ROOM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              URPASS Newsroom
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Official press releases, product updates, and media resources covering URPASS and Yesp Corporation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/brand"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                Download Brand Assets
              </Link>
              <Link
                href="/contact?subject=Press%20Inquiry"
                className="inline-flex items-center gap-2 border border-neutral-300 bg-white text-neutral-800 px-5 py-3 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Media Inquiries
              </Link>
            </div>
          </div>
        </section>

        {/* Press Releases List */}
        <section className="py-24 px-5 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto space-y-6">
            {pressReleases.map((pr, idx) => (
              <AnimateIn key={pr.title} delay={idx * 60} from="up">
                <article className="p-8 rounded-2xl border border-neutral-200/90 bg-neutral-50/30 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {pr.date}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                        {pr.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-neutral-900 mb-2 hover:text-emerald-700 transition-colors">
                      <Link href={pr.href}>{pr.title}</Link>
                    </h2>

                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {pr.excerpt}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={pr.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-emerald-600"
                    >
                      Read full story
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
