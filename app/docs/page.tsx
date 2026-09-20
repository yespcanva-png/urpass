import type { Metadata } from "next";
import Link from "next/link";
import {
  Ticket,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Zap,
  Users,
  QrCode,
  Upload,
  Download,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  Star,
  Globe,
  Code2,
  Webhook,
  Lock,
  Building2,
  Video,
  Key,
  Layers,
  Sliders,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";

export const metadata: Metadata = {
  title: "Documentation — Complete Developer & Organizer Guide to URPASS",
  description:
    "Complete documentation for URPASS. Learn how to create events, issue tiered passes, configure multi-gate check-ins, integrate the REST API, and verify webhooks.",
  keywords: [
    "URPASS documentation",
    "event pass API",
    "QR check-in tutorial",
    "digital pass API",
    "webhooks documentation",
    "event management guide India",
    "multi gate check-in",
    "event ticketing API",
    "URPASS how to use",
  ],
  alternates: { canonical: "https://urpass.space/docs" },
  openGraph: {
    title: "URPASS Documentation — Developer & Organizer Guide",
    description:
      "Full guide to creating digital passes, managing attendees, running multi-gate QR check-in, and integrating with the URPASS REST API and Webhooks.",
    url: "https://urpass.space/docs",
    type: "article",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    ICBM: "20.5937, 78.9629",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://urpass.space" },
    { "@type": "ListItem", position: 2, name: "Documentation", item: "https://urpass.space/docs" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is URPASS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "URPASS is a modern digital event pass, ticketing, and verification platform designed for organizers, colleges, tech conferences, and enterprise teams.",
      },
    },
    {
      "@type": "Question",
      name: "Do attendees need to download an app to access their pass or check in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No app is required. Attendees receive a responsive web pass that opens on any device, with optional Apple Wallet (.pkpass) export. Organizers and staff can scan QR passes using any phone browser at urpass.space/scan.",
      },
    },
    {
      "@type": "Question",
      name: "Does URPASS support virtual and hybrid events?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. URPASS natively supports in-person, online, and hybrid formats. For online and hybrid events, approved attendees can access verified direct-join redirects (/api/join/[passToken]) to Zoom, Google Meet, Microsoft Teams, or custom links.",
      },
    },
    {
      "@type": "Question",
      name: "How does multi-gate check-in and zone access control work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Organizers can define multiple scanner gates (e.g., Gate A, VIP Entrance, Backstage) and zones. Passes can be restricted so that specific ticket tiers are only admitted at authorized gates.",
      },
    },
    {
      "@type": "Question",
      name: "Are ticket prices stored in rupees or paise in the API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In accordance with standard Indian payment gateways like Razorpay, all financial amounts in the database and API are denominated in paise (1 INR = 100 paise). For instance, ₹499 is represented as 49900.",
      },
    },
    {
      "@type": "Question",
      name: "How do outbound webhooks work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Organizers on Pro and Business plans can register HTTPS endpoints in Dashboard → Developer → Webhooks. UrPass signs each webhook using HMAC-SHA256 with your endpoint secret and sends the signature in the X-UrPass-Signature header.",
      },
    },
    {
      "@type": "Question",
      name: "What team roles are supported in Organizations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "URPASS provides role-based access control with 5 distinct roles: Owner, Admin, Event Manager, Check-in Staff, and Viewer.",
      },
    },
  ],
};

const docSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "URPASS Complete Documentation — Developer & Organizer Guide",
  description:
    "Full reference for creating digital event passes, managing attendees, running multi-gate QR check-in, and integrating the URPASS REST API and Webhooks.",
  author: { "@type": "Organization", name: "URPASS", url: "https://urpass.space" },
  publisher: { "@type": "Organization", name: "URPASS", url: "https://urpass.space" },
  inLanguage: "en-IN",
  about: { "@type": "SoftwareApplication", name: "URPASS" },
};

const SECTIONS = [
  { id: "getting-started", label: "Getting started" },
  { id: "events", label: "Events & formats" },
  { id: "attendees", label: "Attendees & import" },
  { id: "tickets-passes", label: "Tickets & passes" },
  { id: "gates-checkin", label: "Gates & check-in" },
  { id: "organizations", label: "Organizations & roles" },
  { id: "api", label: "REST API reference" },
  { id: "webhooks", label: "Webhooks integration" },
  { id: "plans", label: "Plans & billing" },
  { id: "faq", label: "FAQ" },
];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
        style={{ background: "#6D28D9" }}
      >
        {n}
      </div>
      <div className="flex-1 pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
        <p className="text-sm font-semibold text-neutral-900 mb-1">{title}</p>
        <div className="text-sm text-neutral-500 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex gap-4 py-4 border-b border-neutral-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-brand" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-neutral-900">{title}</p>
          {badge && (
            <span className="text-[9px] font-bold tracking-wide uppercase bg-brand-50 text-brand px-1.5 py-0.5 rounded-full border border-brand-100">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docSchema) }}
      />

      <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-brand-100 selection:text-brand-900">
        {/* Top nav */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80">
          <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
              >
                <Ticket className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase text-neutral-900">URPASS</span>
              <span className="text-xs text-neutral-400 font-normal ml-1 hidden sm:inline">
                / Documentation
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/developer"
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors hidden sm:flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-neutral-400" />
                API Keys
              </Link>
              <Link
                href="/pricing"
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/signup"
                className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                style={{ background: "#6D28D9" }}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-5 py-10 flex gap-10">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-6 scrollbar-thin">
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3 px-3">
                Documentation
              </p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-brand transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-50/70"
                  >
                    <ChevronRight className="w-3 h-3 shrink-0 text-neutral-300 group-hover:text-brand" />
                    {s.label}
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-neutral-200">
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3 px-3">
                  Developer Resources
                </p>
                <div className="flex flex-col gap-1.5 px-3">
                  <Link
                    href="/dashboard/developer"
                    className="text-xs text-neutral-600 hover:text-brand flex items-center justify-between"
                  >
                    API Keys
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Link>
                  <Link
                    href="/scan"
                    className="text-xs text-neutral-600 hover:text-brand flex items-center justify-between"
                  >
                    Web QR Scanner
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-xs text-neutral-600 hover:text-brand flex items-center justify-between"
                  >
                    Plan Limits
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Link>
                  <a
                    href="mailto:support@urpass.space"
                    className="text-xs text-neutral-600 hover:text-brand flex items-center justify-between"
                  >
                    Support
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Hero */}
            <div className="mb-12">
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4 bg-white border border-neutral-200/80 rounded-full px-3 py-1 w-fit shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-brand" />
                <span>Production platform · Indian Rupee (₹) · REST API v1 · Outbound Webhooks</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mb-4">
                URPASS Documentation
              </h1>
              <p className="text-base text-neutral-600 leading-relaxed">
                Everything you need to create events, issue tiered digital passes, run high-speed multi-gate
                QR check-ins, and integrate with the URPASS developer platform.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl hover:opacity-95 transition-opacity shadow-sm"
                  style={{ background: "#6D28D9" }}
                >
                  Create free account
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="#api"
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-2xs"
                >
                  <Code2 className="w-4 h-4 text-brand" />
                  Explore REST API
                </a>
              </div>
            </div>

            {/* ── Section 1: Getting Started ───────────────────────── */}
            <section id="getting-started" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Getting started</h2>
                  <p className="text-xs text-neutral-500">Platform overview and end-to-end event workflow</p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-2xs">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">What is URPASS?</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  URPASS is a modern digital pass and check-in platform engineered for conferences,
                  college festivals, exhibitions, corporate summits, and community events. It eliminates
                  cumbersome physical badges, costly dedicated scanner hardware, and proprietary mobile app
                  downloads. Both organizers and attendees interact through responsive, secure web links.
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
                <h3 className="text-sm font-semibold text-neutral-900 mb-6">5-Step Quickstart</h3>
                <div className="flex flex-col gap-0">
                  <Step n={1} title="Create an Organizer Account">
                    Register at <Link href="/signup" className="text-brand font-medium hover:underline">urpass.space/signup</Link>.
                    Free plans include active event hosting and attendee pass generation with zero setup fees.
                  </Step>
                  <Step n={2} title="Configure Your Event">
                    Click <strong>New Event</strong>. Choose your event format (In-person, Online, or Hybrid),
                    set dates, capacity, registration options, and optional ticketing tiers.
                  </Step>
                  <Step n={3} title="Collect Registrations or Import Attendees">
                    Share your public application link (<code className="text-xs bg-neutral-100 px-1 py-0.5 rounded font-mono">/apply/your-event</code>)
                    with custom form fields, or bulk-import existing guest lists via CSV.
                  </Step>
                  <Step n={4} title="Issue Digital Passes">
                    Approved attendees instantly receive an email containing their digital pass link and QR code,
                    with direct Apple Wallet (<code className="text-xs bg-neutral-100 px-1 py-0.5 rounded font-mono">.pkpass</code>)
                    export.
                  </Step>
                  <Step n={5} title="Run Check-In at the Entrance">
                    Open <Link href="/scan" className="text-brand font-medium hover:underline">urpass.space/scan</Link> on
                    any smartphone camera. The system verifies passes with sub-second latency, enforces gate-zone
                    permissions, and rejects duplicate entries.
                  </Step>
                </div>
              </div>
            </section>

            {/* ── Section 2: Events & Formats ──────────────────────── */}
            <section id="events" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Events &amp; formats</h2>
                  <p className="text-xs text-neutral-500">In-person, virtual meetings, hybrid setups, and lifecycles</p>
                </div>
              </div>

              {/* Event formats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-1">In-Person</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Physical venue with entrance scanning, multi-gate check-in, and zone-based badge validation.
                  </p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Video className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-1">Online (Virtual)</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Connect Zoom, Google Meet, Microsoft Teams, or custom links. Approved attendees join with a secure one-click pass link.
                  </p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-1">Hybrid</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Simultaneous physical venue access for local attendees and automated meeting room redirects for remote participants.
                  </p>
                </div>
              </div>

              {/* Event Lifecycles */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6 shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h3 className="text-sm font-semibold text-neutral-900">Event status lifecycles</h3>
                </div>
                <div className="divide-y divide-neutral-100 px-6">
                  {[
                    ["Draft", "bg-neutral-100 text-neutral-600 border-neutral-200", "Event configuration is private. The public registration page is hidden and closed."],
                    ["Active", "bg-emerald-50 text-emerald-700 border-emerald-200", "Registration form is live. Attendees can register, purchase tickets, and passes are active."],
                    ["Completed", "bg-blue-50 text-blue-700 border-blue-200", "The event has concluded. Registration is locked, while analytics and export archives remain accessible."],
                    ["Cancelled", "bg-rose-50 text-rose-700 border-rose-200", "The event was called off. Passes are voided and scanning endpoints will reject entries."],
                  ].map(([status, badgeClass, desc]) => (
                    <div key={status} className="flex items-start gap-3 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 border ${badgeClass}`}>
                        {status}
                      </span>
                      <p className="text-sm text-neutral-600">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Form Fields */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <Sliders className="w-4 h-4 text-brand" />
                  <h3 className="text-sm font-semibold text-neutral-900">Custom registration form fields</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Every event can define custom registration fields to collect extra participant information
                  (e.g., College Name, T-shirt size, Dietary preferences, GitHub profile, Roll number).
                  Supported field types include <strong>text</strong>, <strong>number</strong>, <strong>dropdown select</strong>,
                  and <strong>checkbox</strong>.
                </p>
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 text-xs text-neutral-600">
                  <strong className="text-neutral-900">Plan Quotas:</strong> Free plans support up to 3 custom fields, Starter supports 10,
                  and Pro / Business plans allow unlimited custom registration fields.
                </div>
              </div>
            </section>

            {/* ── Section 3: Attendees ─────────────────────────────── */}
            <section id="attendees" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Attendees &amp; import</h2>
                  <p className="text-xs text-neutral-500">Attendee lifecycle, approval pipelines, and bulk CSV operations</p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl px-6 py-2 mb-6 shadow-2xs">
                <FeatureRow
                  icon={Users}
                  title="Manual Attendee Addition"
                  description="Add individual VIPs, speakers, or staff members directly from the event dashboard with instantaneous pass generation."
                />
                <FeatureRow
                  icon={Upload}
                  title="CSV Bulk Import"
                  description="Upload a CSV with name, email, phone, and pass_type to import hundreds of attendees in seconds. Duplicate emails are automatically de-duplicated."
                  badge="Starter+"
                />
                <FeatureRow
                  icon={Download}
                  title="CSV Data Export"
                  description="Export full attendee records with registration status, pass token, ticket tier, check-in timestamp, and custom form responses."
                  badge="Starter+"
                />
                <FeatureRow
                  icon={CheckCircle}
                  title="Approval Workflow & Auto-Approve"
                  description="Toggle auto-approve to immediately issue passes upon registration, or retain manual approval mode to review applications before passes are distributed."
                />
              </div>

              <div className="bg-neutral-900 text-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold tracking-wider uppercase text-neutral-400">
                    Standard CSV Import Format
                  </p>
                  <span className="text-[11px] font-mono text-neutral-400">attendees.csv</span>
                </div>
                <div className="bg-neutral-950 rounded-xl p-3 font-mono text-xs text-emerald-400 overflow-x-auto border border-neutral-800">
                  name,email,phone,pass_type<br />
                  Aarav Patel,aarav@example.com,+919876543210,participant<br />
                  Meera Nair,meera@example.com,+919876543211,vip<br />
                  Vikram Singh,vikram@example.com,+919876543212,speaker
                </div>
                <p className="text-xs text-neutral-400 mt-3">
                  Accepted pass types: <code className="text-neutral-200 font-mono">participant</code>,{" "}
                  <code className="text-neutral-200 font-mono">vip</code>,{" "}
                  <code className="text-neutral-200 font-mono">speaker</code>, and{" "}
                  <code className="text-neutral-200 font-mono">organizer</code>.
                </p>
              </div>
            </section>

            {/* ── Section 4: Tickets & Passes ───────────────────────── */}
            <section id="tickets-passes" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Tickets &amp; passes</h2>
                  <p className="text-xs text-neutral-500">Tiered ticketing, dynamic QR tokens, Apple Wallet, and online redirects</p>
                </div>
              </div>

              {/* Multi-tier Ticketing */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-2xs">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Multi-tier ticketing</h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Events can offer multiple ticket tiers (e.g. Early Bird, General Admission, VIP Pass, Student Pass).
                  Each tier configures its own pricing, quota limit, sale window, and assigned zone access.
                </p>
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900">
                  <strong className="text-amber-950">Currency &amp; Paise Denomination:</strong> In the URPASS database and API,
                  all monetary values are stored in <strong>paise</strong> (1 INR = 100 paise).
                  For example, a ticket priced at ₹499 is represented in API responses and orders as <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-semibold">49900</code>.
                </div>
              </div>

              {/* Pass Anatomy */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-2xs">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Pass features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ["Dynamic QR Code", "Secure, tamper-evident pass token rendered on high-contrast retina canvas."],
                    ["Apple Wallet (.pkpass)", "Attendees on iOS can tap 'Add to Apple Wallet' for quick access from the lock screen."],
                    ["Live Check-in Status", "Pass display updates live from 'Approved' to 'Checked In' with entry timestamp."],
                    ["Color-Coded Badges", "Distinct visual colors for Participant (Purple), VIP (Gold), Speaker (Blue), and Organizer (Green)."],
                    ["White-Label / Custom Branding", "Pro and Business tiers remove 'Powered by URPASS' watermarks for a pure brand experience."],
                    ["Virtual Join Link", "For online events, an integrated verified join button safely redirects to Zoom/Meet."],
                  ].map(([title, desc]) => (
                    <div key={title} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70">
                      <p className="text-xs font-semibold text-neutral-900 mb-1">{title}</p>
                      <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Online Join Endpoint */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-neutral-900">Online event verified join redirect</h3>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">GET /api/join/[passToken]</span>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    Instead of sharing open Zoom/Meet links on social media (which leads to uninvited attendees),
                    URPASS provides a verified redirect endpoint. When an approved attendee opens the link:
                  </p>
                  <ol className="flex flex-col gap-2 text-xs text-neutral-600 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-neutral-900">1.</span>
                      <span>The server validates the <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">passToken</code> and verifies that the attendee&apos;s application status is <code className="text-emerald-700 font-mono">approved</code>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-neutral-900">2.</span>
                      <span>The server inspects the event&apos;s configured meeting platform (Zoom, Google Meet, Teams, or Custom).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-neutral-900">3.</span>
                      <span>If verified, the browser is issued a 307 temporary redirect to the live meeting session.</span>
                    </li>
                  </ol>
                  <CodeBlock
                    title="Verified Join URL Pattern"
                    singleLanguage="http"
                    singleCode={`https://urpass.space/api/join/urp_pass_a8f9b2c3d4e5...`}
                  />
                </div>
              </div>
            </section>

            {/* ── Section 5: Gates & Check-in ───────────────────────── */}
            <section id="gates-checkin" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Gates &amp; check-in</h2>
                  <p className="text-xs text-neutral-500">Multi-gate routing, zone access control, and duplicate prevention</p>
                </div>
              </div>

              {/* Web Scanner */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-2xs">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">High-speed web scanner</h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Check-in staff can navigate to <Link href="/scan" className="text-brand font-medium hover:underline">urpass.space/scan</Link> on
                  any smartphone. No native app installation or permissions other than camera access are needed.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <p className="font-semibold text-neutral-900 mb-1">Zero Hardware</p>
                    <p className="text-neutral-500">Works directly in Safari, Chrome, and Firefox.</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <p className="font-semibold text-neutral-900 mb-1">Concurrency Safe</p>
                    <p className="text-neutral-500">Database constraints reject duplicate concurrent scans.</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <p className="font-semibold text-neutral-900 mb-1">Sub-second Latency</p>
                    <p className="text-neutral-500">Fast edge verification with immediate visual feedback.</p>
                  </div>
                </div>
              </div>

              {/* Multi-Gate & Zone Access Control */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-brand" />
                  <h3 className="text-sm font-semibold text-neutral-900">Multi-gate &amp; zone access control</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  For large venues, organizers can define custom gates (e.g., &ldquo;North Gate&rdquo;, &ldquo;Main Arena Entrance&rdquo;, &ldquo;VIP Lounge&rdquo;)
                  and link them to specific access zones.
                </p>
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs leading-relaxed space-y-2">
                  <p className="text-neutral-800 font-semibold">How Zone Validation Works:</p>
                  <p className="text-neutral-600">
                    When a gate is assigned a zone, the check-in engine queries <code className="bg-white px-1 py-0.5 rounded border border-neutral-200 font-mono">ticket_zone_access</code>.
                    If the attendee&apos;s ticket tier does not possess access permissions for that zone, entry is immediately denied
                    with a clear warning: <span className="text-rose-600 font-medium">&ldquo;This pass is not authorized for this gate / zone.&rdquo;</span>
                  </p>
                </div>
              </div>

              {/* Verification API */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h3 className="text-sm font-semibold text-neutral-900">Check-in verification endpoint</h3>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded font-mono">
                      POST
                    </span>
                    <code className="text-sm font-mono text-neutral-800">/api/verify</code>
                  </div>
                  <p className="text-xs text-neutral-600 mb-4">
                    Scanners and custom gate hardware submit scanned tokens to this endpoint. The endpoint accepts both the raw token string
                    or a full pass URL (e.g. <code className="font-mono">https://urpass.space/pass/urp_pass_...</code>).
                  </p>

                  <CodeBlock
                    tabs={[
                      {
                        label: "cURL",
                        language: "bash",
                        code: `curl -X POST https://urpass.space/api/verify \\
  -H "Content-Type: application/json" \\
  -H "Cookie: sb-access-token=..." \\
  -d '{
    "passToken": "urp_pass_9c4e82b71f...",
    "eventId": "3c84be2e-4b2a-4819-a9a3-5c5f49e19d77",
    "gateId": "7d91e602-0e83-4a11-b0ec-1c8821901a12",
    "checkInMethod": "qr"
  }'`,
                      },
                      {
                        label: "TypeScript",
                        language: "typescript",
                        code: `const response = await fetch("https://urpass.space/api/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    passToken: "urp_pass_9c4e82b71f...",
    eventId: "3c84be2e-4b2a-4819-a9a3-5c5f49e19d77",
    gateId: "7d91e602-0e83-4a11-b0ec-1c8821901a12",
    checkInMethod: "qr" // "qr" | "manual" | "nfc"
  }),
});

const result = await response.json();
if (result.success) {
  console.log("Checked in:", result.attendee.name);
} else if (result.alreadyCheckedIn) {
  console.warn("Already checked in:", result.attendee.name);
} else if (result.accessDenied) {
  console.error("Access denied for zone:", result.error);
}`,
                      },
                    ]}
                  />

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-neutral-700 mb-2">Success Response (200 OK)</p>
                    <CodeBlock
                      singleLanguage="json"
                      singleCode={`{
  "success": true,
  "attendee": {
    "name": "Kavitha Sundaram",
    "email": "kavitha@example.com",
    "pass_type": "vip"
  },
  "passType": "vip"
}`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section 6: Organizations & Roles ─────────────────── */}
            <section id="organizations" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Organizations &amp; roles</h2>
                  <p className="text-xs text-neutral-500">Multi-tenant teams and granular role-based permissions</p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-2xs">
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Organizations allow companies, student societies, and event agencies to collaborate seamlessly.
                  Invite colleagues via email, manage memberships, and assign role-based permissions tailored to each staff member&apos;s duties.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">Manage Org &amp; Billing</th>
                        <th className="py-2.5 px-3">Create / Edit Events</th>
                        <th className="py-2.5 px-3">Approve Attendees</th>
                        <th className="py-2.5 px-3">Scan Passes at Gates</th>
                        <th className="py-2.5 px-3">View Analytics</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900">Owner</td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900">Admin</td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900">Event Manager</td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900">Check-in Staff</td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900">Viewer</td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><X className="w-4 h-4 text-neutral-300" /></td>
                        <td className="py-2.5 px-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── Section 7: REST API ──────────────────────────────── */}
            <section id="api" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900">REST API reference</h2>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Pro &amp; Business
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">Programmatic access for events, attendees, and custom check-in gates</p>
                </div>
              </div>

              {/* Base URL */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-2xs">
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  The URPASS REST API follows standard REST principles. All responses return JSON payloads with
                  consistent top-level <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">data</code> and{" "}
                  <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">meta</code> pagination envelopes.
                </p>
                <div className="flex items-center gap-3 bg-neutral-900 text-white rounded-xl px-4 py-3 font-mono text-xs">
                  <span className="text-neutral-400 font-semibold">BASE URL</span>
                  <span className="text-emerald-400">https://urpass.space/api/v1</span>
                </div>
              </div>

              {/* Authentication */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6 shadow-2xs">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-100">
                  <Lock className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-semibold text-neutral-900">API key authentication</h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-neutral-600 mb-4">
                    Authenticate all API requests by supplying your API key in the{" "}
                    <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs font-mono text-neutral-800">Authorization</code> header
                    as a Bearer token. Generate keys from{" "}
                    <Link href="/dashboard/developer" className="text-brand font-medium hover:underline">
                      Dashboard → Developer → API Keys
                    </Link>.
                  </p>
                  <div className="space-y-2 text-xs text-neutral-600 mb-4">
                    <p>
                      • Production keys start with prefix: <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-neutral-800">urp_live_</code>
                    </p>
                    <p>
                      • Sandbox test keys start with prefix: <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-neutral-800">urp_test_</code>
                    </p>
                  </div>
                  <CodeBlock
                    tabs={[
                      {
                        label: "cURL",
                        language: "bash",
                        code: `curl -X GET https://urpass.space/api/v1/events \\
  -H "Authorization: Bearer urp_live_9a7b5c3d2e1f40..."`,
                      },
                      {
                        label: "JavaScript / Node",
                        language: "javascript",
                        code: `const response = await fetch("https://urpass.space/api/v1/events", {
  headers: {
    "Authorization": "Bearer urp_live_9a7b5c3d2e1f40..."
  }
});
const { data, meta } = await response.json();`,
                      },
                      {
                        label: "Python",
                        language: "python",
                        code: `import requests

headers = {
    "Authorization": "Bearer urp_live_9a7b5c3d2e1f40..."
}
response = requests.get("https://urpass.space/api/v1/events", headers=headers)
events = response.json().get("data", [])`,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Endpoint 1: GET /events */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6 shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                      GET
                    </span>
                    <code className="text-sm font-mono font-semibold text-neutral-900">/events</code>
                  </div>
                  <span className="text-xs text-neutral-500">List events</span>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-neutral-600 mb-4">
                    Returns a paginated list of events owned by the authenticated organizer.
                  </p>

                  <p className="text-xs font-semibold text-neutral-700 mb-2">Query Parameters</p>
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="grid grid-cols-[100px_80px_1fr] gap-2 p-2 rounded-lg bg-neutral-50 font-mono">
                      <span className="text-brand font-semibold">status</span>
                      <span className="text-neutral-400">string</span>
                      <span className="font-sans text-neutral-600">Filter by status: <code>draft</code>, <code>active</code>, <code>completed</code>, <code>cancelled</code></span>
                    </div>
                    <div className="grid grid-cols-[100px_80px_1fr] gap-2 p-2 rounded-lg bg-neutral-50 font-mono">
                      <span className="text-brand font-semibold">limit</span>
                      <span className="text-neutral-400">number</span>
                      <span className="font-sans text-neutral-600">Max records to return (default 50, maximum 100)</span>
                    </div>
                    <div className="grid grid-cols-[100px_80px_1fr] gap-2 p-2 rounded-lg bg-neutral-50 font-mono">
                      <span className="text-brand font-semibold">offset</span>
                      <span className="text-neutral-400">number</span>
                      <span className="font-sans text-neutral-600">Pagination offset index (default 0)</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-neutral-700 mb-2">Example Response</p>
                  <CodeBlock
                    singleLanguage="json"
                    singleCode={`{
  "data": [
    {
      "id": "e4210d65-3d84-4828-b997-c25f48719230",
      "name": "DevCon India 2026",
      "description": "Annual national developer conference",
      "event_date": "2026-11-20",
      "start_time": "09:30:00",
      "end_time": "18:00:00",
      "venue": "Bengaluru International Exhibition Centre",
      "status": "active",
      "is_paid_event": true,
      "ticket_price": 79900,
      "attendee_limit": 1000,
      "application_enabled": true,
      "apply_slug": "devcon-india-2026",
      "created_at": "2026-09-01T10:15:30.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}`}
                  />
                </div>
              </div>

              {/* Endpoint 2: GET /events/:id */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6 shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                      GET
                    </span>
                    <code className="text-sm font-mono font-semibold text-neutral-900">/events/:eventId</code>
                  </div>
                  <span className="text-xs text-neutral-500">Get event details</span>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-neutral-600 mb-4">
                    Retrieve complete metadata for an individual event by its UUID identifier.
                  </p>
                  <CodeBlock
                    tabs={[
                      {
                        label: "cURL",
                        language: "bash",
                        code: `curl -X GET https://urpass.space/api/v1/events/e4210d65-3d84-4828-b997-c25f48719230 \\
  -H "Authorization: Bearer urp_live_..."`,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Endpoint 3: GET /events/:id/attendees */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6 shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                      GET
                    </span>
                    <code className="text-sm font-mono font-semibold text-neutral-900">/events/:eventId/attendees</code>
                  </div>
                  <span className="text-xs text-neutral-500">List attendees</span>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-neutral-600 mb-4">
                    Retrieve all registered attendees for the specified event, with optional status filtering.
                  </p>

                  <p className="text-xs font-semibold text-neutral-700 mb-2">Query Parameters</p>
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="grid grid-cols-[140px_80px_1fr] gap-2 p-2 rounded-lg bg-neutral-50 font-mono">
                      <span className="text-brand font-semibold">application_status</span>
                      <span className="text-neutral-400">string</span>
                      <span className="font-sans text-neutral-600"><code>pending</code>, <code>approved</code>, <code>rejected</code></span>
                    </div>
                    <div className="grid grid-cols-[140px_80px_1fr] gap-2 p-2 rounded-lg bg-neutral-50 font-mono">
                      <span className="text-brand font-semibold">pass_status</span>
                      <span className="text-neutral-400">string</span>
                      <span className="font-sans text-neutral-600"><code>not_generated</code>, <code>generated</code>, <code>checked_in</code></span>
                    </div>
                    <div className="grid grid-cols-[140px_80px_1fr] gap-2 p-2 rounded-lg bg-neutral-50 font-mono">
                      <span className="text-brand font-semibold">limit</span>
                      <span className="text-neutral-400">number</span>
                      <span className="font-sans text-neutral-600">Max records to return (default 100, maximum 500)</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-neutral-700 mb-2">Example Response</p>
                  <CodeBlock
                    singleLanguage="json"
                    singleCode={`{
  "data": [
    {
      "id": "7bf31890-1c5e-49b2-9d33-149b1049c402",
      "name": "Ananya Roy",
      "email": "ananya@example.com",
      "phone": "+919123456780",
      "pass_type": "vip",
      "application_status": "approved",
      "pass_status": "checked_in",
      "created_at": "2026-09-12T11:42:00.000Z"
    }
  ],
  "meta": {
    "total": 340,
    "limit": 100,
    "offset": 0
  }
}`}
                  />
                </div>
              </div>

              {/* Error Codes */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h3 className="text-sm font-semibold text-neutral-900">Standard HTTP error codes</h3>
                </div>
                <div className="divide-y divide-neutral-100">
                  {[
                    ["400", "Bad Request", "Missing or invalid payload parameters or malformed UUID."],
                    ["401", "Unauthorized", "Missing, invalid, or expired Bearer API token."],
                    ["403", "Forbidden", "API key revoked, or subscription tier does not include developer access."],
                    ["404", "Not Found", "The requested event or attendee record does not exist or is not owned by your account."],
                    ["422", "Unprocessable Entity", "Attendee is not in 'approved' status for pass operations."],
                    ["429", "Too Many Requests", "Rate limit exceeded (standard limit is 120 req/minute). Back off and retry."],
                    ["500", "Internal Server Error", "Unexpected server error. Check URPASS status or reach out to support."],
                  ].map(([code, title, desc]) => (
                    <div key={code} className="flex items-start gap-4 px-6 py-3.5 text-xs">
                      <code className="font-mono font-bold text-rose-600 shrink-0 w-10">{code}</code>
                      <span className="font-semibold text-neutral-800 w-36 shrink-0">{title}</span>
                      <span className="text-neutral-500">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Section 8: Webhooks ──────────────────────────────── */}
            <section id="webhooks" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                  <Webhook className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900">Webhooks integration</h2>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Pro &amp; Business
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">Real-time outbound event notifications delivered to your servers</p>
                </div>
              </div>

              {/* Webhooks Overview */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 shadow-2xs">
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  URPASS outbound webhooks notify your server in real time when attendees register, complete payments,
                  or scan their passes at venue gates. Configure webhook endpoints from{" "}
                  <Link href="/dashboard/developer" className="text-brand font-medium hover:underline">
                    Dashboard → Developer → Webhooks
                  </Link>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <p className="font-semibold text-neutral-900 mb-1">HTTPS Required</p>
                    <p className="text-neutral-500">Webhook endpoints must be served over valid TLS/HTTPS.</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <p className="font-semibold text-neutral-900 mb-1">Delivery Logs &amp; Retries</p>
                    <p className="text-neutral-500">Review request headers, response status, and delivery history in your dashboard.</p>
                  </div>
                </div>
              </div>

              {/* Supported Webhook Events */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6 shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h3 className="text-sm font-semibold text-neutral-900">Supported event triggers</h3>
                </div>
                <div className="divide-y divide-neutral-100">
                  {[
                    ["registration.created", "Fired when a new attendee submits a registration form or buys a ticket."],
                    ["checkin.completed", "Fired when an attendee pass is scanned and successfully verified at any entrance gate."],
                    ["payment.success", "Fired when ticket checkout or attendee order payment is verified via Razorpay."],
                    ["pass.issued", "Fired when a digital pass QR token is generated and prepared for the attendee."],
                    ["registration.approved", "Fired when an organizer approves an attendee application."],
                    ["registration.rejected", "Fired when an organizer rejects or revokes an attendee application."],
                  ].map(([event, desc]) => (
                    <div key={event} className="flex items-start gap-3 px-6 py-3.5 text-xs">
                      <code className="font-mono font-semibold text-brand bg-brand-50 px-2 py-0.5 rounded border border-brand-100 shrink-0">
                        {event}
                      </code>
                      <span className="text-neutral-600">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Verification */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6 shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h3 className="text-sm font-semibold text-neutral-900">HMAC-SHA256 signature verification</h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    Every webhook request sent from URPASS includes an <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">X-UrPass-Signature</code> header
                    in the format <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">sha256=&lt;hash&gt;</code> and an{" "}
                    <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">X-UrPass-Event</code> header.
                    Compute the HMAC-SHA256 hash of the raw request payload using your webhook endpoint secret and compare it using a constant-time check.
                  </p>

                  <CodeBlock
                    tabs={[
                      {
                        label: "Node.js / Next.js",
                        language: "typescript",
                        code: `import crypto from "crypto";

export async function POST(req: Request) {
  const signature = req.headers.get("x-urpass-signature");
  const eventType = req.headers.get("x-urpass-event");
  const rawBody = await req.text();

  const secret = process.env.URPASS_WEBHOOK_SECRET!;
  const expectedSig = \`sha256=\${crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")}\`;

  const isValid =
    signature &&
    signature.length === expectedSig.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  console.log(\`Received event \${eventType}:\`, payload.data);

  return new Response("OK", { status: 200 });
}`,
                      },
                      {
                        label: "Python (FastAPI)",
                        language: "python",
                        code: `import hmac
import hashlib
import os
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()
SECRET = os.getenv("URPASS_WEBHOOK_SECRET", "").encode()

@app.post("/webhook/urpass")
async def handle_urpass_webhook(request: Request):
    sig_header = request.headers.get("x-urpass-signature", "")
    body_bytes = await request.body()

    expected = "sha256=" + hmac.new(SECRET, body_bytes, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(sig_header, expected):
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = await request.json()
    print("Event received:", payload.get("event_type"))
    return {"status": "ok"}`,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Sample Webhook Payloads */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h3 className="text-sm font-semibold text-neutral-900">Example webhook payloads</h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-xs font-semibold text-neutral-700 mb-2">
                    Check-in Completed (<code className="font-mono text-brand">checkin.completed</code>)
                  </p>
                  <CodeBlock
                    singleLanguage="json"
                    singleCode={`{
  "event_type": "checkin.completed",
  "timestamp": "2026-09-20T11:45:00.000Z",
  "data": {
    "attendee_id": "7bf31890-1c5e-49b2-9d33-149b1049c402",
    "event_id": "e4210d65-3d84-4828-b997-c25f48719230",
    "name": "Ananya Roy",
    "email": "ananya@example.com",
    "pass_type": "vip",
    "checked_in_at": "2026-09-20T11:45:00.000Z"
  }
}`}
                  />

                  <p className="text-xs font-semibold text-neutral-700 mt-5 mb-2">
                    Payment Success (<code className="font-mono text-brand">payment.success</code>)
                  </p>
                  <CodeBlock
                    singleLanguage="json"
                    singleCode={`{
  "event_type": "payment.success",
  "timestamp": "2026-09-20T10:30:12.000Z",
  "data": {
    "order_id": "order_NXv0b8A1C9dE3f",
    "event_id": "e4210d65-3d84-4828-b997-c25f48719230",
    "amount": 79900,
    "currency": "INR",
    "buyer_name": "Devansh Gupta",
    "buyer_email": "devansh@example.com"
  }
}`}
                  />
                </div>
              </div>
            </section>

            {/* ── Section 9: Plans & Billing ───────────────────────── */}
            <section id="plans" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Plans &amp; billing</h2>
                  <p className="text-xs text-neutral-500">Transparent Indian Rupee pricing, quota limits, and tax invoices</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    name: "Free",
                    price: "₹0",
                    period: "forever",
                    features: [
                      "2 events / month",
                      "100 registrations / month",
                      "1 organizer seat",
                      "3 custom form fields",
                      "Responsive digital passes",
                      "Mobile web scanner",
                      "URPASS branding",
                    ],
                    highlight: false,
                    cta: "Start free",
                    href: "/signup",
                  },
                  {
                    name: "Starter",
                    price: "₹499",
                    period: "/month",
                    features: [
                      "10 events / month",
                      "500 registrations / month",
                      "2 organizer seats",
                      "10 custom form fields",
                      "CSV bulk import & export",
                      "Standard analytics",
                      "Paid ticket support",
                    ],
                    highlight: false,
                    cta: "Choose Starter",
                    href: "/signup",
                  },
                  {
                    name: "Pro",
                    price: "₹999",
                    period: "/month",
                    features: [
                      "Unlimited events",
                      "2,500 registrations / month",
                      "5 organizer seats",
                      "Unlimited custom fields",
                      "Remove URPASS branding",
                      "Full REST API access",
                      "Outbound Webhooks",
                      "Priority email support",
                    ],
                    highlight: true,
                    cta: "Choose Pro",
                    href: "/signup",
                  },
                ].map((p) => (
                  <div
                    key={p.name}
                    className={`rounded-2xl p-5 flex flex-col justify-between ${
                      p.highlight
                        ? "bg-neutral-900 text-white shadow-md ring-2 ring-brand-500/20"
                        : "bg-white border border-neutral-200 shadow-2xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-[10px] font-bold tracking-widest uppercase ${p.highlight ? "text-brand-300" : "text-neutral-400"}`}>
                          {p.name}
                        </p>
                        {p.highlight && (
                          <span className="text-[10px] bg-brand font-bold text-white px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className={`text-2xl font-bold ${p.highlight ? "text-white" : "text-neutral-900"}`}>
                          {p.price}
                        </span>
                        <span className={`text-xs ${p.highlight ? "text-neutral-400" : "text-neutral-500"}`}>
                          {p.period}
                        </span>
                      </div>
                      <ul className="flex flex-col gap-2 mb-6">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs">
                            <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${p.highlight ? "text-brand-400" : "text-brand"}`} />
                            <span className={p.highlight ? "text-neutral-300" : "text-neutral-600"}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={p.href}
                      className={`text-center text-xs font-semibold py-2.5 rounded-xl transition-all ${
                        p.highlight
                          ? "bg-white text-neutral-900 hover:bg-neutral-100"
                          : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {p.cta}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Invoicing notes */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-sm text-neutral-600 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-brand shrink-0" />
                  <p className="font-semibold text-neutral-900">Billing &amp; Tax Compliance</p>
                </div>
                <ul className="flex flex-col gap-1.5 ml-6 text-xs text-neutral-500">
                  <li>• Secure payments processed via Razorpay supporting UPI, Cards, NetBanking, and Corporate Cards.</li>
                  <li>• Subscription invoices include 18% GST with your organization&apos;s GSTIN and state tax breakdown.</li>
                  <li>• Download PDF tax invoices anytime from <strong>Dashboard → Billing → Invoices</strong>.</li>
                  <li>• Upgrades, downgrades, and cancellations are managed directly from the billing portal.</li>
                </ul>
              </div>
            </section>

            {/* ── Section 10: FAQ ─────────────────────────────────── */}
            <section id="faq" className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Frequently asked questions</h2>
                  <p className="text-xs text-neutral-500">Common questions from organizers, developers, and college teams</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  {
                    q: "Do attendees need to install an app to present their QR pass?",
                    a: "No. The attendee pass is rendered as a lightweight, responsive web pass accessible on any smartphone browser. On iOS devices, attendees can also add the pass directly to Apple Wallet.",
                  },
                  {
                    q: "Can multiple check-in staff scan at different gates simultaneously?",
                    a: "Yes. Multiple staff members can scan at the same time using their own mobile phones. All check-in attempts are validated atomically against the central database to guarantee zero duplicate admissions.",
                  },
                  {
                    q: "How are ticket prices handled in the API and payment checkout?",
                    a: "All ticket prices and order amounts in URPASS are denominated in paise (1 INR = 100 paise), matching standard Indian payment systems. For example, a ₹499 ticket is passed as 49900 in the API.",
                  },
                  {
                    q: "What happens if a scanned attendee tries to enter a restricted zone or wrong gate?",
                    a: "If the gate is configured with an assigned zone and the attendee's ticket tier does not have zone access privileges in ticket_zone_access, the scanner immediately displays an 'Access Denied' alert.",
                  },
                  {
                    q: "How do virtual / online event passes work?",
                    a: "When you configure an event as 'Online' or 'Hybrid' with a meeting link (Zoom, Google Meet, Teams, or Custom), the attendee's digital pass includes a verified join button that resolves via /api/join/[passToken]. Only approved attendees can access the redirect.",
                  },
                  {
                    q: "Can I remove the URPASS watermark and branding from passes?",
                    a: "Yes. Pro and Business tier plans provide white-label passes with all URPASS branding and footers removed.",
                  },
                  {
                    q: "How secure is attendee data?",
                    a: "URPASS is built on Supabase PostgreSQL with rigorous Row-Level Security (RLS) policies. Attendee records and event data can only be accessed by authenticated organizers and team members with appropriate role permissions.",
                  },
                ].map(({ q, a }) => (
                  <div key={q} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs">
                    <p className="text-sm font-semibold text-neutral-900 mb-1.5">{q}</p>
                    <p className="text-xs text-neutral-500 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Support CTA */}
            <div className="bg-neutral-900 rounded-2xl p-8 text-center text-white shadow-md">
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
              >
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Need dedicated technical help?</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
                Whether you are integrating our REST API, writing custom scanner hardware integrations, or organizing
                a 5,000+ attendee campus festival, our team is ready to assist.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="mailto:support@urpass.space"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition-colors"
                >
                  support@urpass.space
                </a>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-900 bg-white px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  Start building for free
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
