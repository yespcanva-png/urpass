import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  ShieldCheck,
  Lock,
  Server,
  FileCheck,
  KeyRound,
  EyeOff,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS Security & Compliance — Enterprise Data Protection",
  description:
    "Learn about URPASS security standards: atomic anti-duplicate QR verification, end-to-end encryption, DPDP and GDPR compliance, role-based access control, and enterprise SSO.",
  keywords: [
    "URPASS security",
    "event ticketing security",
    "QR pass encryption",
    "anti duplicate ticket check in",
    "GDPR event ticketing",
    "DPDP compliance",
    "enterprise event ticketing SSO",
    "SCIM provisioning",
  ],
  alternates: { canonical: "https://urpass.space/security" },
  openGraph: {
    title: "URPASS Security & Compliance — Enterprise Data Protection",
    description:
      "Enterprise-grade security, anti-duplicate QR verification, and data privacy principles powering URPASS.",
    url: "https://urpass.space/security",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "URPASS Security & Data Protection",
      },
    ],
  },
};

const securityPillars = [
  {
    icon: Lock,
    title: "Atomic Anti-Duplicate QR Locks",
    description:
      "Each digital pass contains an encrypted cryptographic hash. The moment a pass is scanned, our database executes an atomic row lock. Attempting to scan a forwarded screenshot at another gate triggers an instant warning with the exact second of first entry.",
  },
  {
    icon: Database,
    title: "Strict Data Isolation & Privacy",
    description:
      "Your attendee lists and customer data belong exclusively to you. URPASS never sells, monetizes, or shares attendee contact details with third-party promoters or advertisers. Full compliance with DPDP India and GDPR standards.",
  },
  {
    icon: KeyRound,
    title: "Enterprise SSO & SCIM Provisioning",
    description:
      "Seamlessly authenticate university faculty, corporate staff, and event teams using Okta, Google Workspace, Azure AD, or SAML 2.0. Automate team onboarding and offboarding with SCIM directory sync.",
  },
  {
    icon: UserCheck,
    title: "Role-Based Entrance Staff Permissions",
    description:
      "Give volunteers and security staff scanner-only access. Door teams can validate tickets and view attendee names without accessing billing records, attendee phone numbers, or administrative settings.",
  },
  {
    icon: Server,
    title: "High-Availability Cloud Infrastructure",
    description:
      "Built on globally distributed edge networks with automated failover, real-time database replication, and daily encrypted backups to guarantee continuous operation even during massive festival entry rushes.",
  },
  {
    icon: RefreshCw,
    title: "Offline Failover & Local Manifest Sync",
    description:
      "Venue Wi-Fi crashes happen. URPASS mobile scanners locally verify ticket signatures offline using cryptographic keys, caching check-ins locally and automatically synchronizing when connectivity resumes.",
  },
];

export default function SecurityPage() {
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
        name: "Security",
        item: "https://urpass.space/security",
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
              TRUST, SECURITY &amp; COMPLIANCE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              Security by Design
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-8">
              From cryptographic pass verification to strict data isolation, discover how URPASS protects high-stakes events and attendee privacy.
            </p>

            <div className="inline-flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-xl text-xs text-neutral-600 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SOC-2 Aligned · DPDP Compliant · 256-bit TLS Encryption</span>
            </div>
          </div>
        </section>

        {/* Security Grid */}
        <section className="py-24 px-5 sm:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityPillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <AnimateIn key={p.title} delay={idx * 50} from="up">
                    <div className="p-7 rounded-2xl border border-neutral-200/80 bg-neutral-50/40 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all h-full flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-emerald-600 mb-5 shadow-2xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2.5 tracking-tight">
                          {p.title}
                        </h2>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security FAQ / Compliance note */}
        <section className="py-20 px-5 sm:px-8 bg-neutral-50/50 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6 text-center">
              Enterprise Security Questions?
            </h2>
            <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-4 text-sm text-neutral-600 leading-relaxed">
              <p>
                <strong>Vulnerability Reporting:</strong> If you discover a security vulnerability or security bug in URPASS, please disclose it responsibly by contacting our security team directly at <a href="mailto:security@yespstudio.com" className="text-emerald-700 underline font-mono">security@yespstudio.com</a>.
              </p>
              <p>
                <strong>Data Processing Agreements:</strong> Custom Data Processing Agreements (DPAs) and vendor security questionnaire responses are available for Enterprise plan subscribers.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
