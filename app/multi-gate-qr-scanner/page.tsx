import type { Metadata } from "next";
import { Users, ScanLine, ShieldCheck, Smartphone, Zap, BarChart3, Lock, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Gate QR Scanner for Concurrent Event Entrances | URPASS",
  description:
    "Synchronize ticket scanning across multiple venue entrances simultaneously. Atomic anti-duplicate locking, volunteer PIN access, sub-0.3s speed, and zero app downloads.",
  keywords: [
    "multi gate qr scanner",
    "multiple entrance event scanner",
    "concurrent ticket scanner",
    "multi lane event check in",
    "synchronized qr check in",
    "venue gate access control",
  ],
  alternates: { canonical: "https://urpass.space/multi-gate-qr-scanner" },
  openGraph: {
    title: "Multi-Gate QR Scanner for Concurrent Event Entrances | URPASS",
    description: "Synchronize ticket scanning across multiple venue entrances simultaneously.",
    url: "https://urpass.space/multi-gate-qr-scanner",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CONCURRENT GATE COORDINATION",
        h1: "Multi-Gate QR Scanner for High-Capacity Venue Entrances",
        canonicalUrl: "https://urpass.space/multi-gate-qr-scanner",
        description:
          "Coordinate 2 to 20+ entrance lanes across North, South, and VIP gates with instant real-time synchronization, atomic anti-duplicate protection, and zero hardware rentals.",
        ctaLabel: "Deploy Multi-Gate Scanning",
        directAnswer: {
          title: "How Does URPASS Synchronize Multiple Event Gates?",
          summary:
            "URPASS uses an atomic PostgreSQL cloud database with row-level transaction locks to synchronize check-in events across multiple gates in real time. Volunteers open a PIN-secured scanner link on standard smartphones. When a pass is scanned at Gate A, it locks instantaneously across the entire network in under 0.3s, guaranteeing that the same pass or a forwarded screenshot cannot be used simultaneously at Gate B.",
          keyPoints: [
            "Unlimited concurrent entrance lanes and volunteer devices across multiple gates",
            "Atomic transaction locks prevent simultaneous duplicate check-in race conditions across gates",
            "Zero app downloads: volunteers open secure PIN links directly in mobile Safari or Chrome",
            "Real-time gate telemetry showing arrival breakdown across North, South, and VIP entrances",
          ],
        },
        keyFactsTable: {
          title: "Multi-Gate Operational Architecture",
          subtitle: "Specifications for multi-entrance synchronization and anti-fraud protection.",
          headers: ["Capability", "URPASS Multi-Gate Specification", "Traditional Event Scanners"],
          rows: [
            { col1: "Concurrent Gate Capacity", col2: "Unlimited lanes (tested across 20+ simultaneous phones)", col3: "Requires renting expensive laser handhelds" },
            { col1: "Cross-Gate Sync Latency", col2: "Sub-second cloud sync via Supabase edge infrastructure", col3: "Delayed batch sync causing duplicate admissions" },
            { col1: "Volunteer Onboarding", col2: "Instant PIN code access without user accounts or app stores", col3: "Mandatory account creation and app downloads" },
            { col1: "Gate Identification", col2: "Scans tagged with specific gate identifier (VIP, North, South)", col3: "Generic aggregate check-in totals" },
            { col1: "Offline Sync Protocol", col2: "Timestamped conflict resolution on reconnection", col3: "Frequent overwrite errors or blocked offline gates" },
          ],
        },
        features: [
          { icon: Users, title: "Unlimited Simultaneous Lanes", desc: "Deploy as many scanning lanes as your venue requires. Coordinate North, South, East, and VIP gates in real time." },
          { icon: ShieldCheck, title: "Atomic Duplicate Lockout", desc: "If an attendee attempts to share a ticket screenshot with a friend at another gate, the second scan triggers an immediate red alarm." },
          { icon: Smartphone, title: "Zero App Download for Staff", desc: "Volunteers access the camera scanner via a secure event PIN in Safari or Chrome, preserving device storage and battery." },
          { icon: Zap, title: "Sub-0.3s Scan Verification", desc: "Fast optical decoders verify passes instantly with audible success chimes and haptics, even in noisy outdoor entrance areas." },
          { icon: Lock, title: "Secure Volunteer PIN Access", desc: "Keep financial reports and attendee contact databases private while giving gate staff pure scanning functionality." },
          { icon: BarChart3, title: "Per-Gate Live Analytics", desc: "Track arrival velocity and queue bottlenecks per gate to redeploy volunteers dynamically to the busiest entrance." },
        ],
        steps: [
          { n: "01", title: "Configure Gates", desc: "Label your venue gates (e.g., Gate 1 - Main, Gate 2 - VIP) in your event dashboard." },
          { n: "02", title: "Share Scanner PIN", desc: "Provide gate volunteers with the secure event scanner URL and 6-digit access PIN." },
          { n: "03", title: "Staff Open Web Link", desc: "Volunteers open the link in mobile Safari or Chrome; camera activates instantly." },
          { n: "04", title: "Simultaneous Queue Clearance", desc: "All lanes scan incoming attendees concurrently with sub-second audio confirmations." },
          { n: "05", title: "Monitor Gate Flow", desc: "Watch real-time headcount and gate distribution metrics update continuously." },
        ],
        callout: {
          badge: "HIGH CAPACITY",
          title: "Engineered for 5,000+ attendee auditoriums, stadiums, and festival grounds.",
          description: "Don't let gate bottlenecks cause safety hazards or attendee frustration. URPASS scales across dozens of simultaneous volunteer smartphones with zero hardware rental costs.",
          bullets: [
            "Atomic anti-duplicate locking guarantees zero unauthorized admissions",
            "Eliminates expensive scanner rental equipment and logistical headaches",
            "Offline-resilient scanning ensures gates keep moving even if Wi-Fi fluctuates",
            "Instant CSV attendance audit logs exportable by gate and timestamp",
          ],
        },
        faqs: [
          { q: "What happens if two people scan the exact same pass at different gates simultaneously?", a: "URPASS utilizes atomic PostgreSQL database locks. Exactly one scan will be recorded as successful, and the other will immediately flash red with an 'Already Checked In' duplicate warning." },
          { q: "Do volunteers need to install an app on their phones?", a: "No. Volunteers simply open a web link in Safari or Chrome, enter your 6-digit gate PIN, and begin scanning immediately using their phone's camera." },
          { q: "Can we see which gate admitted each attendee?", a: "Yes. Every check-in log records the exact gate ID, device identifier, volunteer name, and millisecond timestamp." },
          { q: "Is there a limit on how many phones can scan simultaneously?", a: "No. You can connect 2, 10, or 50+ volunteer phones concurrently without hitting licensing caps or performance throttling." },
        ],
        relatedLinks: [
          { title: "Multiple Gate Event Check-In", href: "/multiple-gate-event-check-in", category: "Product" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "How to Manage Multiple Venue Entrances", href: "/guides/how-to-manage-multiple-event-entrances", category: "Guide" },
          { title: "Preventing Duplicate Event Entry", href: "/guides/prevent-duplicate-event-entry", category: "Guide" },
        ],
      }}
    />
  );
}
