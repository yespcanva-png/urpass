import type { Metadata } from "next";
import { Server, Zap, ShieldCheck, Smartphone, Users, BarChart3, WifiOff, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Offline Event Check-In System & QR Scanner | URPASS",
  description:
    "Check in attendees without internet access. Local browser manifest caching, sub-0.3s camera scanning, and automated background sync when connection restores.",
  keywords: [
    "offline event check in system",
    "offline qr scanner for events",
    "event check in without internet",
    "offline attendee management",
    "venue wifi failure check in",
    "offline ticket verification",
  ],
  alternates: { canonical: "https://urpass.space/offline-event-check-in-system" },
  openGraph: {
    title: "Offline Event Check-In System & QR Scanner | URPASS",
    description: "Check in attendees without internet access with local caching and automated background sync.",
    url: "https://urpass.space/offline-event-check-in-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "OFFLINE GATE RESILIENCE",
        h1: "Offline Event Check-In System & Local QR Scanner",
        canonicalUrl: "https://urpass.space/offline-event-check-in-system",
        description:
          "Keep entrance gates moving even during venue Wi-Fi outages and zero cellular signal. Local IndexedDB manifest caching with automated background synchronization.",
        ctaLabel: "Test Offline Check-In Free",
        directAnswer: {
          title: "How Does Offline Event Check-In Work on URPASS?",
          summary:
            "URPASS incorporates an offline-first architecture using browser service workers and IndexedDB storage. Before or during check-in, the event attendee manifest is cached securely inside the scanner browser (`/api/scan/manifest`). If venue Wi-Fi crashes or cellular data drops, staff continue scanning passes in under 0.3 seconds. Scans are stored locally with millisecond timestamps and synchronize automatically to the cloud (`/api/scan/sync`) upon reconnection.",
          keyPoints: [
            "Local browser manifest caching via IndexedDB ensures zero check-in downtime during network failures",
            "Sub-0.3s verification speed continues uninterrupted even in flight mode or basement auditoriums",
            "Automatic timestamped background synchronization when internet connectivity is restored",
            "Zero app downloads required — offline resilience runs directly inside mobile Safari and Chrome",
          ],
        },
        keyFactsTable: {
          title: "Offline Gate Performance Specifications",
          subtitle: "Technical architecture for zero-connectivity check-in environments.",
          headers: ["Feature / Parameter", "URPASS Offline Implementation", "Traditional Cloud-Only Systems"],
          rows: [
            { col1: "Local Storage Engine", col2: "Client-side IndexedDB with Service Worker caching", col3: "Requires continuous live connection" },
            { col1: "Scan Latency Offline", col2: "< 0.3s (instant local hash match)", col3: "Freezes, times out, or fails with network errors" },
            { col1: "Reconnection Protocol", col2: "Automated batch sync via `/api/scan/sync`", col3: "Manual CSV reconciliations and lost records" },
            { col1: "Conflict Resolution", col2: "Timestamp-priority atomic reconciliation", col3: "Frequent duplicate overwrites" },
            { col1: "Hardware Requirements", col2: "Standard smartphone browsers (Safari, Chrome)", col3: "Expensive proprietary offline handheld rentals" },
          ],
        },
        features: [
          { icon: WifiOff, title: "Uninterrupted Offline Scanning", desc: "Basement convention halls and remote outdoor grounds often drop signal. URPASS ensures gates never halt." },
          { icon: Server, title: "IndexedDB Manifest Caching", desc: "Attendee lists download securely to the browser on scanner launch, enabling instant offline credential matching." },
          { icon: Zap, title: "Sub-0.3s Local Verification", desc: "Local cryptographic token comparison decodes passes instantaneously with audible chimes and green status banners." },
          { icon: ShieldCheck, title: "Timestamped Conflict Sync", desc: "Offline check-in logs retain their exact local scan timestamp, synchronizing safely to the central cloud upon reconnection." },
          { icon: Smartphone, title: "Zero App Download Needed", desc: "Runs directly in mobile Safari and Chrome without requiring native App Store downloads or updates." },
          { icon: BarChart3, title: "Post-Event Audit Trail", desc: "Full attendance records merge seamlessly with online check-ins for audit-ready attendance reports." },
        ],
        steps: [
          { n: "01", title: "Open Scanner Online", desc: "Load the scanner URL once before doors open to download the encrypted attendee manifest." },
          { n: "02", title: "Continue Entry Seamlessly", desc: "If Wi-Fi drops, the scanner automatically transitions to offline mode without interrupting staff." },
          { n: "03", title: "Scan Passes Locally", desc: "Point camera at incoming passes for instant sub-0.3s audio and visual confirmation." },
          { n: "04", title: "Local Queue Logging", desc: "Check-in timestamps are safely queued in the device's browser database." },
          { n: "05", title: "Automated Cloud Sync", desc: "The instant cellular or Wi-Fi connectivity returns, queued records sync to cloud analytics." },
        ],
        callout: {
          badge: "ZERO RISK ENTRY",
          title: "Venue internet should never dictate whether your attendees can enter.",
          description: "Major events have suffered embarrassing entrance riots due to venue Wi-Fi crashes. URPASS guarantees that your gate staff can always admit valid attendees regardless of local network conditions.",
          bullets: [
            "Tested in concrete basements, convention centers, and remote festival fields",
            "Zero equipment rental fees — works on standard volunteer smartphones",
            "Preserves exact scan timestamps for accurate arrival velocity reporting",
            "Automatic conflict resolution prevents duplicate entries after network reconnects",
          ],
        },
        faqs: [
          { q: "Do volunteers need to do anything special to enable offline mode?", a: "No. The scanner automatically caches the attendee list on load and detects when internet is lost, transitioning to local IndexedDB verification seamlessly." },
          { q: "What happens to the scanned tickets when the phone goes back online?", a: "The scanner continuously monitors network connectivity. As soon as a connection is detected, queued scans sync to `/api/scan/sync` in the background with zero staff action needed." },
          { q: "Can an attendee pass be checked in offline twice on the same phone?", a: "No. The local IndexedDB database immediately marks the pass as checked in locally, preventing duplicate scans on that device even while offline." },
          { q: "Does offline mode require a native mobile app?", a: "No. URPASS utilizes modern Progressive Web App (PWA) standards, service workers, and IndexedDB directly inside mobile Safari and Chrome." },
        ],
        relatedLinks: [
          { title: "Offline QR Event Check-In", href: "/offline-qr-event-check-in", category: "Product" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "How QR Ticket Validation Works", href: "/how-qr-ticket-validation-works", category: "Guide" },
          { title: "Preventing Duplicate Event Entry", href: "/guides/prevent-duplicate-event-entry", category: "Guide" },
        ],
      }}
    />
  );
}
