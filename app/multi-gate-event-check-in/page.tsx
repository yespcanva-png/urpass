import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Multi-Gate Event Check-In System — Synchronized Scanning & Anti-Duplication | URPASS",
  description:
    "Synchronized multi-gate event check-in system for arenas, stadium gates, and large venues. Validate QR passes across 20+ gates in <0.3s with atomic duplicate blocking.",
  keywords: [
    "multi-gate event check-in",
    "multi-gate qr check in",
    "multiple entrance event scanner",
    "synchronized event check-in",
    "prevent duplicate event ticket entry",
    "arena gate scanning software",
  ],
  alternates: { canonical: "https://urpass.space/multi-gate-event-check-in" },
  openGraph: {
    title: "Multi-Gate Event Check-In System | Synchronized QR Scanning | URPASS",
    description:
      "Coordinate multiple entrance gates with real-time synchronized QR verification. Sub-second scanning, atomic duplicate locks, and zero hardware rentals.",
    url: "https://urpass.space/multi-gate-event-check-in",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function MultiGateEventCheckInPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/multi-gate-event-check-in",
        badge: "MULTI-GATE INFRASTRUCTURE",
        h1: "Multi-Gate Event Check-In System",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Manage synchronized entrance gates across large auditoriums, sports grounds, and convention centers. Atomic database row locks guarantee duplicate passes or shared screenshots are blocked instantly.",
        primaryCtaLabel: "Book demo",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Calculate Gate Throughput",
        secondaryCtaHref: "/event-check-in-calculator",
        trustHighlights: ["Atomic duplicate locks", "Sub-0.3s validation", "Offline sync", "Zero hardware rentals"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Multi-gate event check-in system: synchronize 20+ venue gates simultaneously, prevent duplicate pass reuse, and monitor gate-by-gate attendance in real time.",
        comparisonRows: [
          {
            criteria: "Multi-Gate Synchronization Speed",
            urpass: "Sub-50ms atomic state replication across all active gates",
            competitor: "Periodic polling or slow cloud sync causing duplicate passes",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Hardware Requirements",
            urpass: "Any volunteer smartphone browser (Safari / Chrome)",
            competitor: "Proprietary handheld laser guns costing thousands per gate",
            urpassAdvantage: true,
          },
          {
            criteria: "Offline Fault Tolerance",
            urpass: "IndexedDB client queue continues validating if WiFi drops",
            competitor: "System freezes completely during network blackouts",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate-by-Gate Live Telemetry",
            urpass: "Real-time breakdown of arrivals per gate, throughput, and bottleneck alerts",
            competitor: "Aggregate count only with no gate-specific insights",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Hardware Turnstile & Laser Vendors",
        pageSpecificTakeaway:
          "Large venues require real-time synchronization between entrance gates. URPASS atomic row locking ensures that once a ticket is scanned at Gate 1, it cannot be reused seconds later at Gate 5.",
      }}
    />
  );
}
