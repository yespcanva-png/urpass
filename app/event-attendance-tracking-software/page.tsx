import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Attendance Tracking Software — Live Gate Telemetry & Audit Logs | URPASS",
  description:
    "Real-time event attendance tracking software. Track arrivals by gate, monitor peak flow curves, export CSV audit logs, and scan QR passes in <0.3s.",
  keywords: [
    "event attendance tracking software",
    "live event attendance tracker",
    "event check-in analytics",
    "track event attendance real time",
    "event turnout tracking software",
    "gate telemetry event software",
  ],
  alternates: { canonical: "https://urpass.space/event-attendance-tracking-software" },
  openGraph: {
    title: "Event Attendance Tracking Software | Live Gate Telemetry | URPASS",
    description:
      "Monitor event turnout in real time. Track check-ins per minute, export verifiable audit reports, and scan tickets with 0% platform commission.",
    url: "https://urpass.space/event-attendance-tracking-software",
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

export default function EventAttendanceTrackingSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-attendance-tracking-software",
        badge: "REAL-TIME TELEMETRY",
        h1: "Event Attendance Tracking Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Know exactly who has arrived and which gates are congested. Live telemetry gives event directors instant visibility into peak arrival curves, turnout percentages, and security logs.",
        primaryCtaLabel: "Try attendance tracking",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["Live gate charts", "CSV data exports", "Sub-0.3s scanning", "Zero hardware fees"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Event attendance tracking software: monitor live gate arrivals, track attendance percentages, export compliance logs, and scan QR passes without hardware rentals.",
        comparisonRows: [
          {
            criteria: "Attendance Telemetry Latency",
            urpass: "Sub-second live dashboard update as attendees pass the gate",
            competitor: "Batch synced or delayed by 15–30 minutes",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate-by-Gate Arrival Curves",
            urpass: "Detailed flow charts showing arrival rates per entrance gate",
            competitor: "Total attendee headcount only",
            urpassAdvantage: true,
          },
          {
            criteria: "Attendee Data Export",
            urpass: "Instant CSV export with check-in timestamp and gate ID",
            competitor: "Gated behind expensive enterprise tier upgrades",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Pricing",
            urpass: "Permanent Free Tier for small events; 0% commission on tickets",
            competitor: "Per-attendee tracking fee deducted from every ticket",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Generic Event Dashboards",
        pageSpecificTakeaway:
          "Real-time attendance tracking gives security and production teams the data needed to manage venue capacities, prevent lobby congestion, and maintain venue safety limits.",
      }}
    />
  );
}
