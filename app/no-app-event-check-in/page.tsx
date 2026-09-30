import type { Metadata } from "next";
import { Smartphone, ScanLine, Zap, ShieldCheck, Users, BarChart3, Clock, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "No-App Event Check-In Software | Browser QR Scanner | URPASS",
  description:
    "Check in attendees without downloading any app. Works directly inside mobile Safari and Chrome on any smartphone camera in under 0.3 seconds.",
  keywords: [
    "no app event check in",
    "web based event check in",
    "browser qr ticket scanner",
    "event check in without downloading app",
    "mobile safari qr scanner",
    "chrome event scanner",
  ],
  alternates: { canonical: "https://urpass.space/no-app-event-check-in" },
  openGraph: {
    title: "No-App Event Check-In Software | Browser QR Scanner | URPASS",
    description: "Check in attendees without downloading any app. Works directly inside mobile Safari and Chrome.",
    url: "https://urpass.space/no-app-event-check-in",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ZERO INSTALLATION ENTRY",
        h1: "No-App Event Check-In Software. Pure Browser Speed.",
        canonicalUrl: "https://urpass.space/no-app-event-check-in",
        description:
          "Turn any smartphone or tablet into an enterprise gate scanner in 5 seconds. No App Store downloads, no software installations, and sub-0.3s camera verification.",
        ctaLabel: "Open Web Scanner Free",
        directAnswer: {
          title: "How Does Event Check-In Work Without an App?",
          summary:
            "URPASS leverages modern HTML5 WebRTC camera APIs and client-side barcode detectors directly inside mobile web browsers (Apple Safari, Google Chrome, Mozilla Firefox). Event volunteers simply open a secure PIN-protected web URL on their personal smartphones. The camera activates immediately, scanning passes and verifying credentials in under 0.3 seconds with zero app downloads or account setups.",
          keyPoints: [
            "Zero App Store or Google Play downloads required for volunteers, staff, or attendees",
            "Instant onboarding: staff open a secure web link, enter an event PIN, and start scanning in 5 seconds",
            "Sub-0.3s camera detection with audible confirmation chimes and haptic vibrations",
            "Works on any modern iOS or Android device with a built-in camera and web browser",
          ],
        },
        keyFactsTable: {
          title: "Browser-Based Scanner vs Native App Store Scanners",
          subtitle: "Operational comparison for event check-in staff and volunteers.",
          headers: ["Operational Factor", "URPASS Browser Web Scanner", "Traditional Native App Scanners"],
          rows: [
            { col1: "Staff Setup Time", col2: "5 seconds (open web link & type PIN)", col3: "5–10 minutes (App Store download, login, password resets)" },
            { col1: "Volunteer Device Friction", col2: "Zero storage space taken; runs in browser tab", col3: "Volunteers object to installing work apps on personal phones" },
            { col1: "Verification Speed", col2: "< 0.3 seconds per scan (instant WebRTC capture)", col3: "3.0 to 6.0 seconds typical autofocus lag" },
            { col1: "Cross-Device Support", col2: "100% universal across iOS, Android, tablets, laptops", col3: "Frequent compatibility issues on older OS versions" },
            { col1: "Administrative Security", col2: "Volunteers get scanner-only view via PIN code", col3: "Requires sharing full organizer accounts or user invites" },
          ],
        },
        features: [
          { icon: Smartphone, title: "Pure Browser Execution", desc: "Runs directly in mobile Safari, Chrome, Edge, and Firefox. Zero software installation or app permissions required." },
          { icon: Zap, title: "Sub-0.3s Camera Decoding", desc: "High-contrast QR algorithms recognize passes instantaneously, even through cracked phone screens or in direct sunlight." },
          { icon: ShieldCheck, title: "Atomic Anti-Duplicate Protection", desc: "Passes lock in real time across the cloud. Forwarded screenshots trigger an immediate red duplicate warning." },
          { icon: Users, title: "Instant Volunteer Onboarding", desc: "Share a 6-digit access PIN with 2 or 20 volunteers to deploy multiple entrance lanes in seconds." },
          { icon: Clock, title: "Audio & Haptic Feedback", desc: "Loud audio confirmation chimes and distinct vibration buzzes make gate scanning effortless in noisy entrance lobbies." },
          { icon: BarChart3, title: "Live Real-Time Headcount", desc: "Every scan updates the central attendance analytics immediately, showing total checked in and remaining no-shows." },
        ],
        steps: [
          { n: "01", title: "Generate Scanner PIN", desc: "Set a 6-digit access PIN in your event dashboard." },
          { n: "02", title: "Share Scanner Link", desc: "Send the web scanner link to your gate volunteers or door staff." },
          { n: "03", title: "Staff Open Safari/Chrome", desc: "Volunteers open the link, enter the PIN, and tap 'Allow Camera'." },
          { n: "04", title: "Point & Scan", desc: "Aim the camera at the attendee's digital pass or lanyard badge." },
          { n: "05", title: "Instant Audio Chime", desc: "Sub-0.3s green banner and chime confirm entry, immediately ready for the next guest." },
        ],
        callout: {
          badge: "FRICTIONLESS LOGISTICS",
          title: "Volunteers shouldn't have to download 150MB apps to scan tickets for 2 hours.",
          description: "Staff and student volunteers hate installing enterprise event apps on their personal smartphones. URPASS eliminates this friction completely by running the entire scanner inside a clean, private browser window.",
          bullets: [
            "Zero App Store accounts, downloads, or mobile storage space consumed",
            "Protects organizer financial data by providing a PIN-restricted scanner view",
            "Continuous scan mode enables rapid clearance of hundreds of attendees per lane",
            "Permanent Free Tier available for community events up to 100 registrations",
          ],
        },
        faqs: [
          { q: "Do volunteers need an URPASS account to scan tickets?", a: "No. Volunteers do not need an account or login. You simply give them a 6-digit PIN that gives them access solely to the camera scanner for that specific event." },
          { q: "Does the web scanner require a strong internet connection?", a: "The scanner caches the attendee manifest locally in the browser using service workers. If venue Wi-Fi or cellular service fluctuates, scanning continues seamlessly offline." },
          { q: "Can volunteers see private attendee phone numbers or financials?", a: "No. The PIN-secured scanner view displays only the attendee's name, ticket tier, and check-in status, keeping private attendee contact details and revenue metrics hidden." },
          { q: "Does it work on iPads or Android tablets?", a: "Yes. The scanner works identically across any smartphone, iPad, Android tablet, or laptop equipped with a camera and modern browser." },
        ],
        relatedLinks: [
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "Fastest Event Check-In Software", href: "/fastest-event-check-in-software", category: "Product" },
          { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Event Check-In Without App Guide", href: "/guides/event-check-in-without-app", category: "Guide" },
        ],
      }}
    />
  );
}
