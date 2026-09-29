import type { Metadata } from "next";
import { Cpu, Zap, Layers, ShieldCheck, BarChart3, Ticket, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Technology Platform for Modern Organizers | URPASS by Yesp",
  description: "Next-generation event technology platform built by Yesp Corporation. Connect registration, custom digital passes, QR check-in and attendance analytics into one unified OS.",
  keywords: [
    "event technology platform",
    "event tech platform",
    "modern event technology",
    "event SaaS",
    "URPASS event tech",
    "Yesp event platform"
  ],
  alternates: { canonical: "https://urpass.space/event-technology-platform" },
  openGraph: {
    title: "Event Technology Platform for Modern Organizers | URPASS by Yesp",
    description: "Next-generation event technology platform built by Yesp Corporation. Connect registration, custom digital passes, QR check-in and attendance analytics into one unified OS.",
    url: "https://urpass.space/event-technology-platform",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MODERN EVENT TECH STACK",
        h1: "Event Technology Platform Built for Seamless Execution",
        canonicalUrl: "https://urpass.space/event-technology-platform",
        description: "URPASS by Yesp Corporation is the event technology platform that eliminates fragmented workflows. Manage registrations, design passes, accept payments, and verify guests at the door with sub-second QR scanning.",
        ctaLabel: "Deploy Event Tech",
        directAnswer: {
          title: "What is an event technology platform?",
          summary: "An event technology platform is an all-in-one software ecosystem that manages the entire lifecycle of an event: from initial registration forms and payment collection, to digital credential issuance, venue access control, and post-event analytics. URPASS by Yesp Corporation delivers this without proprietary hardware or percentage commission fees.",
          keyPoints: [
            "Unified event architecture: registration, ticketing, pass generation, and entry management in one place",
            "Zero equipment rental needed: uses ordinary smartphones for scanning",
            "Real-time synchronized database across multiple entrances and counters",
            "Complete data ownership and instant audit-ready CSV exports"
          ]
        },
        features: [
          { icon: Layers, title: "Consolidated Architecture", desc: "Replace fragmented form tools, spreadsheets, payment links, and barcode scanners with one integrated cloud operating system." },
          { icon: Ticket, title: "Dynamic Pass Generation", desc: "Automatically generate personalized digital passes with single-use cryptographic QR tokens upon approval or ticket purchase." },
          { icon: ScanLine, title: "Sub-Second Gate Verification", desc: "Scan attendee QR passes in under 0.3s directly inside any mobile browser without renting specialized handheld terminals." },
          { icon: ShieldCheck, title: "Single-Use Entry Validation", desc: "Built-in anti-passback algorithms immediately flag screenshot sharing, duplicate attempts, or invalid credentials." },
          { icon: BarChart3, title: "Live Gate Velocity Metrics", desc: "Track entrance arrival curves, volunteer scan rates, and peak door traffic in real time from your organizer dashboard." },
          { icon: Users, title: "Role-Based Staff Access", desc: "Delegate dedicated scanner links to volunteers and gatekeepers without exposing sensitive registrant financial information." }
        ],
        steps: [
          { n: "01", title: "Launch Event Site", desc: "Set up schedules, pass tiers, capacity limits, and custom registration fields in minutes." },
          { n: "02", title: "Collect Registrations", desc: "Direct attendees to a frictionless, mobile-optimized public page with zero account creation required." },
          { n: "03", title: "Automate Pass Issuance", desc: "Distribute encrypted digital passes instantly via email and web confirmation." },
          { n: "04", title: "Scan at the Entrance", desc: "Coordinators scan passes using camera-enabled smartphones at multiple venue doors simultaneously." },
          { n: "05", title: "Monitor Real-Time Analytics", desc: "Track verified check-in counts, turn-out percentages, and door velocity live on your dashboard." }
        ],
        faqs: [
          { q: "What makes URPASS different from legacy event tech?", a: "Legacy platforms charge 5-10% commissions, require complex contracts, and force users to download dedicated apps. URPASS runs natively in web browsers, offers 0% platform commissions, and deploys instantly." },
          { q: "Who develops the URPASS event technology platform?", a: "URPASS is engineered, hosted, and operated by Yesp Corporation, a software product company focused on modern workflow tools." },
          { q: "Can URPASS handle multi-day or multi-track events?", a: "Yes. Organizers can create customized pass types (VIP, Speaker, Delegate, General) and verify specific access tiers at different gates." }
        ]
      }}
    />
  );
}
