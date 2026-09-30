import type { Metadata } from "next";
import { ShieldCheck, QrCode, Zap, Smartphone, Users, Lock, BarChart3, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Entry QR Code System & Access Control | URPASS",
  description:
    "Secure event entry QR code system with cryptographic single-use passes, sub-0.3s camera check-in, anti-screenshot fraud protection, and live gate analytics.",
  keywords: [
    "event entry qr code system",
    "event access qr system",
    "qr code event access control",
    "secure event entry system",
    "anti duplicate qr check in",
    "digital door entry passes",
  ],
  alternates: { canonical: "https://urpass.space/event-entry-qr-code-system" },
  openGraph: {
    title: "Event Entry QR Code System & Access Control | URPASS",
    description: "Secure event entry QR code system with cryptographic single-use passes and sub-0.3s camera check-in.",
    url: "https://urpass.space/event-entry-qr-code-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "FRAUD-PROOF ENTRY STACK",
        h1: "Event Entry QR Code System & Access Control",
        canonicalUrl: "https://urpass.space/event-entry-qr-code-system",
        description:
          "Protect venue doors from ticket counterfeiting and screenshot sharing. Issue cryptographically verified single-use QR passes decodable in under 0.3 seconds.",
        ctaLabel: "Secure Venue Entry Free",
        directAnswer: {
          title: "How Does the URPASS Event Entry QR Code System Work?",
          summary:
            "URPASS combines cryptographically signed digital pass tokens with an atomic cloud verification engine. Each attendee receives a unique QR code tied to their registration ID. When presented at a venue entrance, door staff scan the code using any standard smartphone camera. The system validates the token in under 0.3 seconds, immediately locking the pass to prevent duplicate admissions across all entrance doors.",
          keyPoints: [
            "Single-use cryptographic UUID tokens permanently eliminate ticket duplication and credential sharing",
            "Sub-0.3s gate camera scanning in mobile Safari and Chrome with zero app downloads",
            "High-contrast visual confirmation (green admitted vs red duplicate alert) plus audible chimes",
            "Offline-resilient scanning caches attendee manifests in-browser for uninterrupted door flow",
          ],
        },
        keyFactsTable: {
          title: "Entry Security & QR Verification Parameters",
          subtitle: "Technical architecture of URPASS event entry access control.",
          headers: ["Security Component", "URPASS QR Entry System", "Standard Static QR Codes"],
          rows: [
            { col1: "Pass Token Architecture", col2: "Cryptographically signed UUID v4 in PostgreSQL", col3: "Plain text string easily duplicated or guessed" },
            { col1: "Anti-Screenshot Protection", col2: "Atomic transaction lock upon initial door entry", col3: "None; same screenshot admits unlimited people" },
            { col1: "Scan-to-Verification Time", col2: "< 0.3s on volunteer smartphone cameras", col3: "3.5 to 6.0s on clunky scanner apps" },
            { col1: "Operator Warning Signals", col2: "Loud audio chime + green/red visual banners + haptics", col3: "Small text popup easily overlooked by staff" },
            { col1: "Audit Logging", col2: "Exact millisecond timestamp, device ID, and gate name", col3: "Unrecorded or aggregate scan counts only" },
          ],
        },
        features: [
          { icon: ShieldCheck, title: "Atomic Duplicate Lockout", desc: "Passes lock instantaneously upon entry. If an attendee forwards a screenshot, subsequent scans trigger an immediate red alarm." },
          { icon: Zap, title: "Sub-0.3s Optical Verification", desc: "Optical decoders recognize passes instantaneously, clearing entrance queues without lobby bottlenecks." },
          { icon: QrCode, title: "High-Contrast Barcode Design", desc: "Passes render crisp, high-error-correction QR codes readable on dim screens, cracked glass, or printed lanyard badges." },
          { icon: Smartphone, title: "Zero App Installation Needed", desc: "Door staff open a secure PIN link in mobile Safari or Chrome to turn personal smartphones into enterprise scanners." },
          { icon: Users, title: "Multi-Gate Cloud Sync", desc: "Deploy multiple scanning lanes across North, South, and VIP entrances with real-time synchronized pass validation." },
          { icon: BarChart3, title: "Real-Time Entry Telemetry", desc: "Monitor live arrival curves, peak rush periods, and total venue occupancy from any organizer dashboard." },
        ],
        steps: [
          { n: "01", title: "Create Access Tiers", desc: "Define ticket categories (General, VIP, Speaker) and capacity limits in your event settings." },
          { n: "02", title: "Issue Cryptographic Passes", desc: "Unique single-use digital passes are generated and emailed to attendees upon registration." },
          { n: "03", title: "Deploy Gate Scanners", desc: "Provide door staff with a 6-digit access PIN to open the web scanner on their phones." },
          { n: "04", title: "Scan Attendees at the Door", desc: "Point camera at incoming passes for instant sub-0.3s audio chime and green verification." },
          { n: "05", title: "Track Live Occupancy", desc: "Review real-time arrival numbers, gate throughput rates, and export attendance logs." },
        ],
        callout: {
          badge: "ZERO FRAUD TOLERANCE",
          title: "Eliminate gate crashers, fake tickets, and pass sharing.",
          description: "Music festivals, campus fests, and high-profile summits lose thousands of dollars to ticket sharing. URPASS provides airtight cryptographic gate security without requiring expensive specialized scanning hardware.",
          bullets: [
            "Atomic PostgreSQL database locks guarantee zero duplicate entries",
            "Eliminates paper checklists, clipboards, and manual ticket hole-punching",
            "Works completely offline if local venue Wi-Fi drops unexpectedly",
            "Permanent Free Tier available for events up to 100 registrations",
          ],
        },
        faqs: [
          { q: "What happens if someone tries to use a forwarded screenshot of a ticket?", a: "The first person to scan the ticket will be admitted. When the second person attempts to enter with the same screenshot, the scanner flashes a prominent red warning displaying 'Already Checked In' along with the exact gate and timestamp of the first entry." },
          { q: "Can we scan tickets without internet access?", a: "Yes. URPASS caches the attendee list in the scanner's browser using service workers. If internet drops, door staff can continue scanning offline, with all check-ins synchronizing automatically upon reconnection." },
          { q: "How fast is the verification process?", a: "Verification occurs in under 0.3 seconds on modern smartphones, allowing a single lane to easily process 25 to 30 attendees per minute." },
          { q: "Can we assign different permissions to VIP gates?", a: "Yes. You can filter scanning permissions by ticket tier, ensuring that VIP or Speaker passes can only be redeemed at designated executive entrances." },
        ],
        relatedLinks: [
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "Event Access Control Software", href: "/event-access-control-software", category: "Product" },
          { title: "Preventing Duplicate Event Entry", href: "/guides/prevent-duplicate-event-entry", category: "Guide" },
          { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", category: "Product" },
        ],
      }}
    />
  );
}
