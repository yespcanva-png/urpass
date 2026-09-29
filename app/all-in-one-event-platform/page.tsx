import type { Metadata } from "next";
import { Layers, Ticket, QrCode, ScanLine, BarChart3, Users, Zap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "All-In-One Event Platform | URPASS by Yesp Corporation",
  description: "The complete all-in-one event platform by Yesp Corporation. Registration, payments, pass design, QR check-in, and real-time attendance analytics in a single unified OS.",
  keywords: [
    "all-in-one event platform",
    "all in one event management",
    "complete event platform",
    "unified event software",
    "URPASS event platform"
  ],
  alternates: { canonical: "https://urpass.space/all-in-one-event-platform" },
  openGraph: {
    title: "All-In-One Event Platform | URPASS by Yesp Corporation",
    description: "The complete all-in-one event platform by Yesp Corporation. Registration, ticketing, passes, and check-in in one system.",
    url: "https://urpass.space/all-in-one-event-platform",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ALL-IN-ONE EVENT PLATFORM",
        h1: "The All-In-One Event Platform Built for Modern Organizers",
        canonicalUrl: "https://urpass.space/all-in-one-event-platform",
        description: "URPASS by Yesp Corporation unites registration, ticketing, pass generation, gate scanning, and analytics into one seamless operating system. Stop managing 5 separate tools.",
        ctaLabel: "Launch Your All-In-One Event",
        directAnswer: {
          title: "What makes URPASS a true all-in-one event platform?",
          summary: "URPASS eliminates fragmented event technology stacks. Instead of paying for a separate form builder, email delivery service, ticketing platform with 10% commission, and hardware scanner rentals, URPASS consolidates the complete registration-to-entrance lifecycle into one web-first platform.",
          keyPoints: [
            "Registration, payments, passes, scanner, and analytics in one place",
            "Zero percentage commission fees — keep 100% of ticket revenue",
            "No app downloads required for attendees or volunteer gate staff",
            "Real-time synchronized attendance metrics with audit-ready CSV exports"
          ]
        },
        features: [
          { icon: Layers, title: "Consolidated Command Center", desc: "Manage event setup, guest lists, ticket inventory, entrance gates, and post-event reporting in one unified dashboard." },
          { icon: Ticket, title: "Interactive Ticket Designer", desc: "Build branded, eye-catching digital passes with custom colors, event badges, and cryptographic QR tokens." },
          { icon: ScanLine, title: "0.3s Browser-Based Scanner", desc: "Scan attendee passes with any standard phone camera in mobile Safari or Chrome without downloading apps." },
          { icon: ShieldCheck, title: "Anti-Passback Protection", desc: "Built-in cryptographic validation stops pass sharing and duplicate gate check-in attempts instantly." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Watch arrival curves, peak rush periods, and attendance conversion rates update live as guests arrive." },
          { icon: Zap, title: "0% Commission Guarantee", desc: "Retain 100% of your ticket revenue without predatory per-ticket platform cuts or locked contracts." }
        ],
        steps: [
          { n: "01", title: "Create Your Event", desc: "Configure event details, ticket tiers, and custom registration fields." },
          { n: "02", title: "Share Public Link", desc: "Publish and share your responsive event page across community channels." },
          { n: "03", title: "Issue Digital Passes", desc: "Approve applicants and issue secure digital passes automatically." },
          { n: "04", title: "Scan at the Entrance", desc: "Check in guests in under 0.3s using ordinary smartphone cameras." },
          { n: "05", title: "Analyze Live Metrics", desc: "Review real-time arrival curves and export audit-ready attendance data." }
        ],
        faqs: [
          { q: "Can URPASS replace Google Forms, Eventbrite, and rented barcode scanners?", a: "Yes. URPASS replaces all three: providing responsive registration forms, zero-commission ticketing, and high-speed smartphone camera scanning." },
          { q: "Is URPASS suitable for both free and paid events?", a: "Yes. URPASS supports free community events, hackathons, college culturals, and high-volume paid conferences." },
          { q: "Who develops the URPASS all-in-one platform?", a: "URPASS is engineered, operated, and maintained by Yesp Corporation." }
        ]
      }}
    />
  );
}
