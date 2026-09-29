import type { Metadata } from "next";
import { Globe2, ShieldCheck, Zap, Ticket, Smartphone, Users, BarChart3, CreditCard } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Global Event Registration & Ticketing Platform | URPASS by Yesp",
  description:
    "International event registration, digital QR ticketing, and sub-second entrance check-in platform for conferences, summits, and hackathons worldwide. Zero commissions.",
  keywords: [
    "global event registration platform",
    "international event ticketing software",
    "event check-in platform",
    "QR event ticketing software",
    "URPASS global",
    "event registration worldwide",
  ],
  alternates: { canonical: "https://urpass.space/global" },
  openGraph: {
    title: "Global Event Registration & Ticketing Platform | URPASS by Yesp",
    description:
      "International event registration, digital QR ticketing, and sub-second entrance check-in platform for conferences, summits, and hackathons worldwide.",
    url: "https://urpass.space/global",
    type: "website",
  },
};

export default function GlobalPage() {
  return (
    <SEOPage
      config={{
        badge: "GLOBAL EVENT INFRASTRUCTURE",
        h1: "Global Event Registration & Digital Ticketing Platform",
        canonicalUrl: "https://urpass.space/global",
        description:
          "URPASS by Yesp Corporation empowers organizers worldwide to launch high-converting event pages, issue fraud-proof digital passes, and scan attendees at entrance gates without hardware rentals.",
        ctaLabel: "Start Hosting Globally",
        directAnswer: {
          title: "What makes URPASS the preferred global event platform?",
          summary:
            "URPASS is an international event registration and QR check-in platform developed by Yesp Corporation. It provides zero-commission ticketing, instant digital passes compatible with all mobile browsers, multi-currency processing, and sub-second door check-ins without requiring proprietary hardware or attendee app downloads.",
          keyPoints: [
            "Zero per-ticket percentage commission fees worldwide",
            "Universal mobile browser compatibility — no app download required for guests or door staff",
            "Instant multi-counter cloud synchronization with offline backup protection",
            "Tamper-proof cryptographic single-use QR credentials",
          ],
        },
        features: [
          {
            icon: Globe2,
            title: "Global Multi-Currency Readiness",
            desc: "Host attendees from across the world with seamless payments, multi-region low latency cloud endpoints, and localized check-in passes.",
          },
          {
            icon: Ticket,
            title: "Custom Ticket & Pass Designer",
            desc: "Create bespoke digital passes featuring custom branding, attendee names, VIP access tiers, and security QR codes.",
          },
          {
            icon: Smartphone,
            title: "Browser-Based QR Scanner",
            desc: "Turn any iOS or Android phone or tablet into an enterprise gate scanner in under 0.3s without downloading separate apps.",
          },
          {
            icon: ShieldCheck,
            title: "Cryptographic Fraud Defense",
            desc: "Single-use dynamic verification tokens eliminate duplicate entries, ticket pass sharing, and screenshot reuse.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Gate Velocity",
            desc: "Monitor live arrival curves, peak rush periods, and attendee turnout metrics as guests arrive across all entrances.",
          },
          {
            icon: CreditCard,
            title: "0% Platform Commissions",
            desc: "Unlike legacy ticketing platforms taking 5% to 10% of gross ticket sales, URPASS offers transparent flat-fee or free plans.",
          },
        ],
        steps: [
          { n: "01", title: "Set Up Global Event", desc: "Define your international event details, pass tiers, and registration questions." },
          { n: "02", title: "Share Public Link", desc: "Publish your lightning-fast event registration page worldwide with direct links." },
          { n: "03", title: "Issue Digital Passes", desc: "Attendees receive personalized digital QR passes directly in their email and browser." },
          { n: "04", title: "Scan at the Gate", desc: "Staff scan passes with standard smartphone cameras in under 0.3s at any venue entrance." },
          { n: "05", title: "Track Real-Time Data", desc: "Analyze international attendance metrics, peak hours, and export audit-ready reports." },
        ],
        callout: {
          badge: "INTERNATIONAL RELIABILITY",
          title: "Built for international hackathons, academic summits, and tech conferences.",
          description:
            "From college campuses in Bangalore and London to tech conferences across Europe, Asia, and the Americas, URPASS by Yesp Corporation powers seamless gate management without heavy contracts or clunky equipment.",
          bullets: [
            "Ultra-low latency worldwide powered by Supabase edge infrastructure",
            "Zero friction for attendees — passes open instantly in mobile Safari and Chrome",
            "Multi-gate live sync across unlimited staff devices simultaneously",
            "Full data export with timestamped audit trails for all verified check-ins",
          ],
        },
        faqs: [
          {
            q: "Can international attendees use URPASS without creating an account?",
            a: "Yes. Attendees apply or purchase tickets via your public event URL and receive their digital QR pass without needing to sign up or install any third-party app.",
          },
          {
            q: "Does URPASS charge per-ticket transaction percentage fees?",
            a: "No. URPASS operates on 0% platform commissions, allowing organizers to retain 100% of their ticket revenues.",
          },
          {
            q: "What devices can event staff use for ticket scanning?",
            a: "Any modern smartphone or tablet with a camera running Chrome, Safari, Edge, or Firefox can serve as a secure entrance scanner.",
          },
          {
            q: "Who operates URPASS globally?",
            a: "URPASS is engineered and operated globally by Yesp Corporation, a technology software product firm.",
          },
        ],
      }}
    />
  );
}
