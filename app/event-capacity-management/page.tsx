import type { Metadata } from "next";
import { ShieldAlert, Users, QrCode, Building, BarChart3, CheckCircle2, ArrowRight, Activity, DoorOpen } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Capacity Management Software | URPASS",
  description: "Control event capacity and venue occupancy in real time. Manage multi-gate entry, prevent overcrowding, monitor live headcounts, and adhere to safety limits.",
  keywords: [
    "event capacity management",
    "venue capacity software",
    "real time event occupancy tracking",
    "prevent event overcrowding",
    "event crowd management",
    "multi gate entry capacity",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-capacity-management" },
  openGraph: {
    title: "Event Capacity Management Software | URPASS",
    description: "Control event capacity and venue occupancy in real time. Manage multi-gate entry and prevent overcrowding.",
    url: "https://urpass.space/event-capacity-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CROWD & SAFETY CONTROL",
        h1: "Control Event Capacity in Real Time",
        canonicalUrl: "https://urpass.space/event-capacity-management",
        description:
          "Event capacity management tracks live venue headcounts, gate entry rates, and room occupancy across multiple entrances to maintain venue fire code compliance and comfort. URPASS synchronizes check-in scanners in under 0.3 seconds, giving organizers unified attendance dashboards and instant gate lockouts when venue thresholds are reached.",
        ctaLabel: "Manage Event Capacity",
        features: [
          { icon: Activity, title: "Live Occupancy Dashboard", desc: "View real-time venue headcount, total admitted attendees, and current entry velocity across all gates simultaneously." },
          { icon: ShieldAlert, title: "Hard Capacity Thresholds", desc: "Define hard limits that automatically freeze scanner approvals when room capacity or fire safety caps are hit." },
          { icon: DoorOpen, title: "Multi-Gate Synchronization", desc: "Sync dozens of mobile volunteer scanners in sub-seconds so admission numbers update instantly across all gates." },
          { icon: Building, title: "Sub-Zone & Room Tracking", desc: "Manage capacity for specific auditoriums, workshop rooms, or VIP lounges within a larger convention venue." },
          { icon: QrCode, title: "In-and-Out Pass Management", desc: "Support re-entry scanning so attendees leaving the venue release capacity back to waiting attendees in real time." },
          { icon: BarChart3, title: "Historical Density Analytics", desc: "Analyze peak arrival curves, gate throughput bottlenecks, and dwell time to optimize future event floorplans." },
        ],
        steps: [
          { n: "01", title: "Set Venue Limits", desc: "Enter physical venue maximum capacity, fire marshal caps, and per-room seating limits in URPASS." },
          { n: "02", title: "Deploy Mobile Scanners", desc: "Staff open the URPASS scanner URL on any mobile device at entry and exit gates — no app install needed." },
          { n: "03", title: "Sub-0.3s Entry Scans", desc: "Attendees scan their dynamic passes; headcount increments centrally in real-time." },
          { n: "04", title: "Threshold Alerts", desc: "Organizers receive visual warnings when occupancy hits 80%, 90%, and 100% capacity." },
          { n: "05", title: "Automated Gate Freezes", desc: "Scanners dynamically block new entries once hard limits are reached, preventing dangerous overcrowding." },
        ],
        callout: {
          badge: "SAFETY & COMPLIANCE",
          title: "Eliminate crowd crushes and fire safety violations.",
          description: "Relying on manual clickers or paper guest lists across multiple doors guarantees inaccurate counts and dangerous overcrowding. URPASS delivers centralized, real-time admission telemetry that venue directors and authorities trust.",
          bullets: [
            "Centralized database sync prevents split-gate counting discrepancies",
            "Color-coded scanner feedback shows staff exact remaining capacity",
            "Audit-ready digital logs of entry timestamps for venue compliance",
            "Works smoothly on spotty mobile networks with local caching",
          ],
        },
        deepDiveSections: [
          {
            badge: "MULTI-GATE LOGISTICS",
            title: "How does real-time capacity management work across multiple gates?",
            paragraphs: [
              "When an event has 4 or 5 different entry gates (e.g., North Gate, South Gate, VIP Entrance), manual clicker counters fail because staff cannot communicate count updates in real time.",
              "URPASS connects all entrance devices to an active WebSocket and distributed database synchronization engine. When Gate 1 scans an attendee, Gate 2, 3, and 4 reflect the updated capacity within 300 milliseconds. If the master ceiling of 2,000 attendees is reached, every scanner simultaneously halts entry.",
            ],
            takeaway: "Distributed synchronization eliminates blind spots and ensures multi-entrance venues stay compliant.",
          },
          {
            badge: "ROOM-LEVEL RESTRICTIONS",
            title: "Can organizers manage sub-capacity for specific workshops or stages?",
            paragraphs: [
              "In multi-track conferences and festivals, the overall building may hold 3,000 people, but specific breakout rooms or keynote halls might only seat 150 people. URPASS allows organizers to assign specific ticket types or session passes to designated room scanners.",
              "When a session fills up, the door scanner notifies staff immediately, preventing overcrowding and keeping aisles clear for safety.",
            ],
            takeaway: "Hierarchical capacity tracking protects both overall venue compliance and individual room safety.",
          },
        ],
        faqs: [
          {
            q: "Can URPASS track attendees who leave the venue (exit scanning)?",
            a: "Yes. Scanners can be toggled into 'Check-Out' mode, decrementing the live venue headcount as attendees depart.",
          },
          {
            q: "What happens if cellular connectivity drops at the venue?",
            a: "URPASS scanners cache pass verification data locally and sync with the cloud database the moment connection resumes.",
          },
          {
            q: "Can security personnel access the live capacity dashboard on their phones?",
            a: "Yes. Organizers can share read-only live headcount links with venue security and fire marshals without granting full admin rights.",
          },
        ],
        relatedLinks: [
          { title: "Multi-Gate Event Check-in", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Live Event Check-in Dashboard", href: "/event-check-in-dashboard", category: "Product" },
          { title: "Ticket Inventory Management", href: "/event-ticket-inventory-management", category: "Product" },
          { title: "Conference Management", href: "/conferences", category: "Use Case" },
        ],
      }}
    />
  );
}
