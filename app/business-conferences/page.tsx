import type { Metadata } from "next";
import { CheckCircle2, Building2, Users, ScanLine, Palette, Download, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Business Conference Check-In & Delegate Badge Software",
  description: "Deliver a polished corporate entrance for summits and conventions. Issue branded digital credentials, verify executive badges in under 0.3s, and export audit-ready attendance logs.",
  keywords: [
    "business conference check in software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/business-conferences" },
  openGraph: {
    title: "Business Conference Check-In & Delegate Badge Software | URPASS",
    description: "Deliver a polished corporate entrance for summits and conventions. Issue branded digital credentials, verify executive badges in under 0.3s, and export audit-ready attendance logs.",
    url: "https://urpass.space/business-conferences",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "BUSINESS CONFERENCES",
        h1: "Business Conference Registration & Delegate Check-In Software",
        canonicalUrl: "https://urpass.space/business-conferences",
        description: "Deliver a polished corporate entrance for summits and conventions. Issue branded digital credentials, verify executive badges in under 0.3s, and export audit-ready attendance logs.",
        ctaLabel: "Manage business conference free",
        features: [
          { icon: Building2, title: "Executive Credentials", desc: "Issue branded digital passes featuring company logos, delegate designations, and clear VIP badge pills." },
          { icon: Users, title: "Sub-Second Desk Check-In", desc: "Check in delegates in under 0.3 seconds at foyer registration tables to avoid awkward morning queues." },
          { icon: ScanLine, title: "Apple Wallet & Mobile Web", desc: "Executives open passes directly in mobile Safari/Chrome or save credentials to Apple Wallet with one tap." },
          { icon: Palette, title: "Session & Track Attendance", desc: "Track attendance across keynotes, breakout tracks, and executive roundtables with multi-device scanning." },
          { icon: Download, title: "Zero Proprietary Hardware", desc: "Check-in staff use iPads, tablets, or smartphones to scan passes without renting expensive barcode hardware." },
          { icon: ShieldCheck, title: "C-Level Reporting & CSV Logs", desc: "Export timestamped attendance records with delegate job titles, companies, and arrival times." },
        ],
        steps: [
          { n: "01", title: "Setup Conference", desc: "Configure summit tracks, keynote halls, and executive capacity." },
          { n: "02", title: "Collect Registrations", desc: "Executives register via clean, professional online forms." },
          { n: "03", title: "Deliver Branded Badges", desc: "Delegates receive digital QR credentials with corporate branding." },
          { n: "04", title: "Foyer Check-In", desc: "Hostesses scan badges in under 0.3s for seamless morning entry." },
          { n: "05", title: "Export Sponsor Reports", desc: "Download verified delegate attendance records for sponsors and board." },
        ],
        callout: {
          badge: "CORPORATE EXCELLENCE",
          title: "A sophisticated arrival experience for executive delegates.",
          description: "Senior executives and keynote speakers shouldn't wait in line while staff search printed spreadsheets. URPASS delivers a frictionless, prestigious digital check-in flow.",
          bullets: [
            "Custom branded passes with company and sponsor logos",
            "Instant 0.3s camera recognition from phones or lanyards",
            "Full exportable delegate rosters with check-in timestamps",
            "Enterprise security with zero data reselling or advertisements",
          ],
        },
        useCases: [
          "C-Suite Leadership Summits",
          "National Industry Conventions",
          "Financial & FinTech Conferences",
          "Pharma & Healthcare Congresses",
          "SaaS & Cloud User Conferences",
          "Investor & Shareholder Meetings",
        ],
        faqs: [
          { q: "Can we print delegate badges for lanyard sleeves?", a: "Yes. Digital passes include print-ready PDF formats optimized for standard conference lanyard holders." },
          { q: "Can we display sponsor branding on attendee passes?", a: "Yes. You can upload primary summit and sponsor logos directly in the custom pass designer." },
          { q: "Can we track attendance across multiple breakout rooms?", a: "Yes. Deploy separate scanning tablets at each breakout room door to track track-specific attendance." },
          { q: "Is URPASS secure for proprietary corporate events?", a: "Yes. URPASS utilizes encrypted cloud infrastructure and does not monetize or share attendee databases." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
