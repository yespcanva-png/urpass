import type { Metadata } from "next";
import { CheckCircle2, ScanLine, ShieldCheck, Users, Zap, Lock, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Entry System & Gate Access Control Software",
  description: "Manage venue gates, prevent credential re-use, and authenticate digital QR passes in under 0.3s. Built for high-volume college fests and large conferences.",
  keywords: [
    "event entry system",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-entry-system" },
  openGraph: {
    title: "Event Entry System & Gate Access Control Software | URPASS",
    description: "Manage venue gates, prevent credential re-use, and authenticate digital QR passes in under 0.3s. Built for high-volume college fests and large conferences.",
    url: "https://urpass.space/event-entry-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT ENTRY SYSTEM",
        h1: "Event Entry System for High-Throughput Access Control",
        canonicalUrl: "https://urpass.space/event-entry-system",
        description: "Manage venue gates, prevent credential re-use, and authenticate digital QR passes in under 0.3s. Built for high-volume college fests and large conferences.",
        ctaLabel: "Set up entry system free",
        features: [
          { icon: ScanLine, title: "High-Speed Camera Recognition", desc: "Engineered to decode high-contrast QR passes in under 0.3 seconds from phone screens or printed badges." },
          { icon: ShieldCheck, title: "Duplicate Pass Prevention", desc: "Single-use cryptographic tokens ensure each pass can only be admitted once across all gates." },
          { icon: Users, title: "Multi-Gate Synchronization", desc: "Run 10+ scanning lanes simultaneously with instant cloud synchronization to eliminate door bottlenecks." },
          { icon: Zap, title: "Low-Bandwidth Resilience", desc: "Smart client-side caching ensures reliable verification even in crowded auditoriums with weak Wi-Fi." },
          { icon: Lock, title: "Volunteer Scanner Links", desc: "Deploy entry staff using PIN-protected links that restrict access strictly to entrance scanning." },
          { icon: BarChart3, title: "Live Gate Analytics", desc: "Monitor entry velocity, total admissions, and remaining capacity live from the command dashboard." },
        ],
        steps: [
          { n: "01", title: "Set Up Gates", desc: "Configure entry gates and generate secure scanner URLs for door staff." },
          { n: "02", title: "Issue Digital Passes", desc: "Approved attendees receive unique, fraud-proof digital QR credentials." },
          { n: "03", title: "Open Mobile Scanners", desc: "Staff open the scanner in phone browsers with zero hardware setup." },
          { n: "04", title: "Verify Attendees", desc: "Scan passes with instant green confirmation and audible chime alerts." },
          { n: "05", title: "Monitor Headcount", desc: "Watch live arrival graphs and manage venue capacity in real time." },
        ],
        callout: {
          badge: "GATE PERFECTION",
          title: "Engineered for high-volume crowds and strict security.",
          description: "When thousands of attendees arrive at once, entrance chaos can ruin your event. URPASS event entry system combines sub-second scanning speed with instant duplicate lockout.",
          bullets: [
            "Tested for high-velocity gate check-in throughput",
            "Immediate duplicate detection across all entry points",
            "Zero specialized hardware rentals or barcode guns",
            "Complete timestamped audit trail of all admissions",
          ],
        },
        useCases: [
          "College Fest Gate 1 & 2",
          "Arena Concert Turnstiles",
          "Conference Registration Desks",
          "Exhibition Main Entrances",
          "Sports Stadium Gates",
          "Hackathon Security Checkpoints",
        ],
        faqs: [
          { q: "What happens if someone shares a screenshot of their pass with a friend?", a: "The moment the pass is scanned at any gate, it is locked in the system. When the second person attempts to enter, the scanner flashes red with 'Already Checked In'." },
          { q: "Do we need to rent dedicated barcode scanners?", a: "No. Any modern smartphone with a camera and web browser acts as an enterprise-grade QR code scanner." },
          { q: "How many scanning devices can we operate simultaneously?", a: "You can connect as many scanning devices as your gates require. All devices sync instantaneously." },
          { q: "Can we track check-ins per individual gate?", a: "Yes. Scans record timestamps and device metadata, allowing you to see traffic velocity across different entrance gates." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
