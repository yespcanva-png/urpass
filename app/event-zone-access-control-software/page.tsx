import type { Metadata } from "next";
import { ShieldCheck, DoorOpen, Users, AlertTriangle, Activity, Lock, CheckCircle2, QrCode } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Zone Access Control Software & Live Occupancy Tracking | URPASS",
  description:
    "Secure event venues with multi-zone QR access control, granular ticket tier rules, anti-passback prevention, and live zone occupancy tracking with capacity alerts.",
  keywords: [
    "event zone access control software",
    "multi-gate event access control",
    "live event occupancy tracking",
    "vip zone gate scanner",
    "conference access rules software",
    "venue capacity management software",
    "anti-passback event ticketing",
    "event gate entry management",
  ],
  alternates: { canonical: "https://urpass.space/event-zone-access-control-software" },
  openGraph: {
    title: "Event Zone Access Control Software & Live Occupancy Tracking | URPASS",
    description:
      "Granular multi-zone access control for conferences and festivals. Real-time headcount, anti-passback duplicate blocking, capacity protection, and supervisor overrides.",
    url: "https://urpass.space/event-zone-access-control-software",
    siteName: "URPASS by Yesp Corporation",
    type: "website",
  },
};

export default function EventZoneAccessControlPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-zone-access-control-software",
        badge: "ZONE SECURITY & LIVE OCCUPANCY",
        h1: "Event Zone Access Control Software & Live Occupancy Tracking",
        description:
          "Partition your venue into secure zones: Main Stage, VIP Lounges, Backstage, Expo Floors, and Catering Areas. Enforce granular access rules, prevent credential passback, and monitor live room occupancy in real time.",
        ctaLabel: "Set Up Access Control Free",
        directAnswer: {
          title: "How does multi-zone event access control work with URPASS?",
          summary:
            "URPASS allows event organizers to divide venues into distinct physical or logical zones with unique capacity limits. Organizers configure granular access rules mapping ticket tiers (General Admission, VIP, All-Access), badge roles (Speaker, Press, Staff, Sponsor), and specific gates or time windows to each zone. Gate scanners running UrPass One authenticate attendee QR credentials in under 300ms, displaying instant Green (Granted) or Red (Denied) feedback. Built-in anti-passback logic prevents badge-sharing fraud, while live occupancy meters calculate real-time net headcounts and alert security when zones approach fire safety thresholds.",
          keyPoints: [
            "Granular access rules based on ticket tier, badge role, assigned gate, day, and time window",
            "Real-time live occupancy meters tracking net headcounts, entry rates, exit rates, and peak times",
            "Anti-passback protection blocking unauthorized re-entry and badge-sharing across gates",
            "Automated capacity thresholds triggering warning alerts and automatic gate entry freezes",
            "Authorized supervisor emergency overrides with permanent cryptographic audit logging",
          ],
        },
        keyFactsTable: {
          title: "URPASS Multi-Zone Access Control vs Generic Single-Gate Scanners",
          subtitle: "Why multi-stage festivals, enterprise summits, and secure expos require zone intelligence.",
          headers: ["Security Dimension", "URPASS Multi-Zone Access Engine", "Generic Single-Gate Scanner Apps"],
          rows: [
            { col1: "Zone Segmentation", col2: "Unlimited discrete zones (VIP, Main Stage, Expo, Backstage, Dining)", col3: "Single binary event-level entry scan only" },
            { col1: "Credential Re-use (Anti-Passback)", col2: "Real-time duplicate rejection blocks badge-passing over barricades", col3: "Allows identical badges to be scanned repeatedly without warnings" },
            { col1: "Live Headcount Occupancy", col2: "Real-time net occupancy meters (Entries minus Exits) per zone", col3: "Cumulative check-in totals only; zero knowledge of live room density" },
            { col1: "Capacity Safety Enforcement", col2: "Automatic gate lockout upon reaching fire-code thresholds", col3: "Manual security counts prone to overcrowding violations" },
            { col1: "Emergency Override Protocol", col2: "Supervisor PIN override with mandatory rationale & audit trail", col3: "Informal, unmonitored gate exceptions with zero accountability" },
            { col1: "Scan Latency", col2: "Sub-300ms verification on local edge cache even with low bandwidth", col3: "2–4 second cloud roundtrips creating bottlenecks at busy gates" },
          ],
        },
        features: [
          {
            icon: DoorOpen,
            title: "Multi-Zone Venue Architecture",
            desc: "Define distinct zones—Keynote Auditorium, VIP Lounge, Workshop Room A, Press Area, and Dining Zone—each with its own capacity and access hierarchy.",
          },
          {
            icon: ShieldCheck,
            title: "Granular Ticket & Role Rules",
            desc: "Specify exactly which ticket types, badge roles, or attendee tags are permitted into each zone, restricted by gate location and program time windows.",
          },
          {
            icon: Activity,
            title: "Live Occupancy & Headcount Meters",
            desc: "Track real-time people inside, entry velocities, exit rates, and peak occupancy percentages with live dashboard visuals for crowd safety teams.",
          },
          {
            icon: Lock,
            title: "Anti-Passback Duplicate Rejection",
            desc: "Instantly flags and blocks duplicate scan attempts if an attendee pass is presented again at the same gate without a corresponding exit record.",
          },
          {
            icon: AlertTriangle,
            title: "Automated Capacity Protection",
            desc: "Set room safety limits. When a zone hits 90% or 100% capacity, scanners automatically lock entry and notify venue operations managers.",
          },
          {
            icon: Users,
            title: "Audited Supervisor Overrides",
            desc: "Empower authorized floor managers to override capacity limits or grant exceptional entry using secure PINs, recording full timestamped audit logs.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Define Zones & Set Capacities",
            desc: "Map your venue layout into zones (Main Hall, VIP Area, Expo Hall) and set safety capacity thresholds for each room.",
          },
          {
            n: "02",
            title: "Configure Granular Access Rules",
            desc: "Map ticket tiers (VIP, Speaker, GA) and time windows to allowed zones and assign specific scanners to designated gates.",
          },
          {
            n: "03",
            title: "Scan & Monitor Live Crowd Flow",
            desc: "Gate staff scan attendee credentials with instant allow/deny feedback while the operations dashboard tracks live headcount.",
          },
        ],
        useCases: [
          "Multi-Stage Music & Cultural Festivals",
          "Enterprise Summits with VIP Executive Suites",
          "Academic Conferences with Parallel Breakout Rooms",
          "Stadium & Arena Sporting Exhibitions",
          "Convention Center Trade Shows with Restricted Zones",
          "Government & Defense Industry Forums",
        ],
        faqs: [
          {
            q: "What happens when an attendee tries to enter an unauthorized zone?",
            a: "The scanner screen flashes red with an audible alert indicating 'Access Denied: Ticket Tier GA Not Permitted in VIP Lounge'. The attempt is logged in real time with the attendee name, timestamp, and gate ID for security auditing.",
          },
          {
            q: "How does anti-passback duplicate prevention work?",
            a: "If an attendee passes their badge or QR code through a gate to another person outside, the second scan triggers an immediate 'Duplicate Scan Rejected: Attendee Already Inside' alert, preventing credential sharing fraud.",
          },
          {
            q: "Can scanners track both entries and exits to calculate live occupancy?",
            a: "Yes. Gate staff can toggle scanner mode between Entry and Exit, or use dual-direction scanning lanes. URPASS continuously calculates net occupancy (Total In minus Total Out) to report accurate room headcounts.",
          },
          {
            q: "Can a supervisor override a locked gate in an emergency?",
            a: "Yes. Authorized supervisors can enter an override PIN to permit entry even if a zone has reached full capacity. The system logs the supervisor identity, timestamp, and mandatory override reason in the tamper-proof audit trail.",
          },
          {
            q: "Does zone access control work without reliable venue internet?",
            a: "Yes. Access rules and attendee roster hashes are cached directly on scanning devices. Local mesh synchronization verifies credentials and checks for duplicates even during temporary expo center Wi-Fi outages.",
          },
          {
            q: "Is zone access control available on the free plan?",
            a: "Yes. Organizers can configure zones, access rules, and live occupancy on the Free Forever plan (2 events/month, up to 50 attendees per event) to test multi-room security workflows without upfront cost.",
          },
        ],
        relatedLinks: [
          { title: "Event Badge Printing Software", href: "/event-badge-printing-software", category: "Product" },
          { title: "Onsite Registration Desk Software", href: "/onsite-event-registration-software", category: "Product" },
          { title: "Event Lead Retrieval Software", href: "/event-lead-retrieval-software", category: "Product" },
          { title: "Multi-Gate QR Scanner", href: "/multi-gate-qr-scanner", category: "Product" },
          { title: "Offline Event Check-In System", href: "/offline-event-check-in-system", category: "Product" },
        ],
        ctaTitle: "Protect your venue with intelligent zone access",
        ctaDescription: "Multi-zone rule engine · Anti-passback security · Live occupancy meters",
      }}
    />
  );
}
