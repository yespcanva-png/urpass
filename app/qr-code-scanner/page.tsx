import type { Metadata } from "next";
import { Smartphone, Zap, ShieldCheck, Wifi, Users, Clock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Mobile QR Code Scanner for Event Entry & Gate Check-In | URPASS",
  description: "Fast, hardware-free QR code scanner for event check-in. Turn any iPhone or Android camera into a high-speed event entry scanner. Prevent duplicate entries with instant gate sync.",
  keywords: [
    "event QR code scanner",
    "mobile check-in scanner",
    "event gate entry app",
    "QR pass scanner without app",
    "volunteer ticket scanner",
    "prevent duplicate event entry",
    "offline event check-in",
    "fast event registration scanner",
  ],
  alternates: { canonical: "https://urpass.space/qr-code-scanner" },
  openGraph: {
    title: "Mobile QR Code Scanner for Event Entry & Gate Check-In | URPASS",
    description: "Scan attendee QR passes in under a second using any phone. No app downloads required. Instant duplicate prevention and multi-counter synchronization.",
    url: "https://urpass.space/qr-code-scanner",
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

export default function QrCodeScannerPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS ENTRY · FAST QR SCANNER",
        h1: "Turn any phone into a high-speed event scanner",
        canonicalUrl: "https://urpass.space/qr-code-scanner",
        description: "Zero hardware rentals. No App Store or Play Store downloads. Simply open your event scanner URL in Safari or Chrome, grant camera access, and check in attendees in 0.3 seconds.",
        ctaLabel: "Try scanner demo free",
        features: [
          { icon: Zap, title: "Sub-second camera recognition", desc: "Recognizes QR codes instantly from phone screens, printed badges, dim venue lighting, and awkward angles." },
          { icon: Smartphone, title: "No app installation required", desc: "Volunteers and door staff can scan immediately in their browser without creating an app account or logging in." },
          { icon: ShieldCheck, title: "Instant duplicate prevention", desc: "If an attendee attempts to reuse or forward their QR code, the scanner turns red and blocks duplicate entry with a sound alert." },
          { icon: Users, title: "Multi-gate real-time sync", desc: "Deploy 2, 5, or 20 scanning counters simultaneously. Check-in statuses synchronize across all devices in real time." },
          { icon: Wifi, title: "Offline-resilient caching", desc: "Spotty venue Wi-Fi or cellular networks? Scans are verified with smart local caching and synced once reconnected." },
          { icon: Clock, title: "Audio & haptic feedback", desc: "Clear green/red visual banners, pleasant chime confirmations, and gentle vibration feedback keep entry lines moving fast." },
        ],
        steps: [
          { n: "01", title: "Open Scanner URL", desc: "Navigate to your event check-in URL or share a PIN-protected link with entrance volunteers." },
          { n: "02", title: "Allow Camera", desc: "Grant one-time browser camera access on any iOS or Android smartphone or tablet." },
          { n: "03", title: "Scan QR Pass", desc: "Aim camera at attendee phone or printed badge. The pass is verified in under 300 milliseconds." },
          { n: "04", title: "Instant Validation", desc: "Screen flashes green with attendee name, ticket tier, and check-in timestamp." },
          { n: "05", title: "Track Attendance", desc: "Watch total gate counts, check-in velocity, and remaining capacity live on your organizer dashboard." },
        ],
        callout: {
          badge: "EVENT ENTRY SPEED",
          title: "Check in 60+ attendees per minute per gate.",
          description: "Long registration lines kill event momentum. URPASS mobile scanner eliminates paper lists, manual lookups, and slow hardware barcodes.",
          bullets: [
            "Works on any modern smartphone browser (Chrome, Safari, Firefox)",
            "Instant duplicate pass lockout across all entry points",
            "PIN-protected volunteer links with zero access to financial settings",
            "Export full timestamped check-in logs directly to Excel / CSV",
          ],
        },
        useCases: [
          "College Fest Main Gate", "Conference Badging Desk", "VIP Backstage Access", "Workshop Room Entry",
          "Hackathon Late Night Re-entry", "Concert Turnstiles", "Exhibition Floor Access", "Sports Tournament Gates",
        ],
        faqs: [
          { q: "Do volunteers need to install an app from the App Store or Play Store?", a: "No. The URPASS scanner runs completely in the mobile web browser. Organizers simply share the check-in URL." },
          { q: "What happens if someone shares their QR code with a friend?", a: "The moment the first pass is scanned, it is marked as checked-in. Any subsequent scan of the same code immediately triggers a red 'Duplicate Pass Detected' warning." },
          { q: "Can we have multiple volunteers scanning at different entrance gates?", a: "Yes! You can run as many simultaneous scanning counters as you need. Every device synchronizes in real time to prevent duplicate entry." },
          { q: "Does the scanner work in low lighting conditions?", a: "Yes. The scanner leverages your device's native camera focus and features an on-screen torch toggle for dim auditorium or evening event entrances." },
          { q: "Can I manually check in an attendee if their phone battery died?", a: "Yes. Organizers can search attendees by name, email, or ticket ID on the dashboard and mark them checked in manually." },
        ],
        ctaTitle: "Streamline your event check-in today",
        ctaDescription: "Free plan available · Zero hardware setup · Scans in 0.3 seconds",
      }}
    />
  );
}
