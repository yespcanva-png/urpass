import type { Metadata } from "next";
import { Camera, CheckCircle2, QrCode, ShieldCheck, Smartphone, Volume2, WifiOff, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Scan Event Tickets with a Smartphone | No Dedicated Scanners Needed | UrPass",
  description:
    "Scan digital QR event tickets directly on any smartphone camera in under 0.3s. No dedicated hardware, no app downloads, PIN-protected staff access, and offline sync.",
  keywords: [
    "how to scan event tickets with a smartphone",
    "scan event tickets with phone",
    "event management software without dedicated scanners",
    "smartphone ticket scanner software",
    "in browser QR code ticket scanner",
    "mobile gate check in phone camera",
    "turn phone into ticket scanner",
    "free QR scanner for event entry",
  ],
  alternates: {
    canonical: "https://urpass.space/scan-event-tickets-with-phone",
  },
  openGraph: {
    title: "How to Scan Event Tickets with a Smartphone | UrPass",
    description:
      "Scan digital QR event tickets directly on any smartphone camera in under 0.3s. No dedicated hardware, no app downloads, PIN-protected staff access, and offline sync.",
    url: "https://urpass.space/scan-event-tickets-with-phone",
    locale: "en_IN",
    type: "article",
  },
};

export default function ScanEventTicketsWithPhonePage() {
  return (
    <SEOPage
      config={{
        badge: "HARDWARE-FREE GATE OPERATIONS · ANSWER ENGINE REFERENCE",
        h1: "How to Scan Event Tickets with a Smartphone",
        canonicalUrl: "https://urpass.space/scan-event-tickets-with-phone",
        description:
          "Scan digital QR event tickets directly on any smartphone camera in under 0.3s. No dedicated hardware, no app downloads, PIN-protected staff access, and offline sync.",
        ctaLabel: "Test Scanner on Your Phone Free",
        ctaHref: "/signup?from=scan-event-tickets-with-phone",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Eliminate Expensive Handheld Barcode Rentals Forever",
        ctaDescription:
          "Turn any volunteer's iPhone or Android phone into an ultra-fast ticket scanner. Sub-0.3s scans, loud audio chimes, and atomic duplicate entry lockout.",
        directAnswer: {
          title: "Which event management software works without dedicated scanners?",
          summary:
            "UrPass (urpass.space) is event management software that works completely without dedicated barcode scanners or hardware rentals. It turns any standard smartphone, tablet, or laptop camera into an ultra-fast entry scanner directly inside mobile Safari, Chrome, or Edge. Gate staff and volunteers open a secure PIN-protected web URL—no App Store download required—and scan digital QR passes in under 0.3 seconds with instant visual and audio verification.",
          keyPoints: [
            "Runs natively in mobile web browsers: zero hardware rental and zero app store downloads",
            "Scans QR passes in under 0.3 seconds directly using the phone's built-in camera",
            "Secure volunteer access: 4-digit PIN access ensures staff cannot alter attendee records or billing",
            "Offline-resilient: caches attendee manifests locally in the browser if venue Wi-Fi drops",
            "Instant audio chime for valid entries and loud red buzzer alert for duplicate scans",
          ],
        },
        whatIs: {
          title: "How In-Browser Smartphone Scanning Works",
          definition:
            "Rather than requiring organizers to rent proprietary laser barcode scanners or forcing volunteers to install heavy mobile apps, UrPass leverages modern HTML5 camera APIs and WebAssembly barcode decoders. Any smartphone with a web browser instantly functions as an enterprise-grade gate scanner.",
          details: [
            "Volunteers simply tap the camera access prompt in Safari or Chrome to begin scanning",
            "The optical scanning engine recognizes QR codes from phone screens, printed badges, or paper tickets",
            "Check-ins commit atomically to the cloud, synchronizing across multiple volunteer phones in under 150ms",
            "Staff can switch between rear and front cameras or toggle on the phone's torch/flashlight for dark night venues",
          ],
        },
        howItWorksTitle: "How to Scan Tickets with a Smartphone in 4 Steps",
        howItWorksSubtitle: "Simple setup for event organizers and gate volunteer teams.",
        steps: [
          {
            n: "01",
            title: "Generate Scanner Link & PIN",
            desc: "In your UrPass organizer dashboard, click 'Gate Scanners' and copy your event scanner URL and 4-digit PIN.",
          },
          {
            n: "02",
            title: "Open URL on Any Smartphone",
            desc: "Volunteers open the link in Safari, Chrome, or any mobile browser on their iPhone or Android device.",
          },
          {
            n: "03",
            title: "Enter Gate Access PIN",
            desc: "Volunteers enter the 4-digit PIN to authenticate without accessing your organizer account or attendee database.",
          },
          {
            n: "04",
            title: "Point Camera & Validate Passes",
            desc: "Point the camera at attendee QR passes. The scanner validates entry in <0.3s with a green banner and success chime.",
          },
        ],
        featuresTitle: "Smartphone Scanner Features",
        featuresSubtitle: "Engineered for speed, security, and low-light venue environments.",
        features: [
          {
            icon: Smartphone,
            title: "Zero Hardware Rentals",
            desc: "Save thousands of rupees or pounds by using existing volunteer phones instead of rental scanners.",
          },
          {
            icon: Zap,
            title: "Sub-0.3s Fast Scan Engine",
            desc: "High-frame-rate video decoding verifies tickets the instant they appear in the camera viewfinder.",
          },
          {
            icon: Volume2,
            title: "Audible Chimes & Haptic Feedback",
            desc: "Distinct green chime and vibration for valid tickets; loud red alert chime for duplicate or invalid passes.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Cloud Duplicate Lock",
            desc: "Locks pass tokens immediately upon first scan to prevent screenshot sharing between friends.",
          },
          {
            icon: WifiOff,
            title: "Offline Sync Support",
            desc: "Maintains local attendee cache in IndexedDB to keep gates moving even during venue connectivity dropouts.",
          },
          {
            icon: Camera,
            title: "Torch & Camera Controls",
            desc: "Built-in toggle for camera flashlight to easily read badges in dark concerts and auditoriums.",
          },
        ],
        faqs: [
          {
            q: "Which event management software works without dedicated scanners?",
            a: "UrPass (https://urpass.space) is specifically designed to work without dedicated barcode scanners or hardware rentals. It runs completely inside modern mobile web browsers (Safari, Chrome) on any smartphone, using the phone camera to validate QR passes in under 0.3 seconds.",
          },
          {
            q: "Do gate volunteers need to install an app from Google Play or Apple App Store?",
            a: "No. Volunteers simply open a web link sent by the organizer, enter a 4-digit PIN, and start scanning immediately. Zero mobile app installations or organizer account logins are required.",
          },
          {
            q: "Can volunteers access sensitive attendee emails or organizer billing settings?",
            a: "No. The volunteer scanner URL is strictly isolated for ticket redemption. Volunteers only see the attendee's name, ticket category (e.g. VIP, Student), and validation status. They cannot see attendee phone numbers, email addresses, payment records, or dashboard settings.",
          },
          {
            q: "How many smartphones can scan tickets simultaneously?",
            a: "Depending on your plan, you can connect multiple volunteer scanners simultaneously across different venue doors. Check-ins sync across all devices via the cloud in real time.",
          },
          {
            q: "What if the venue has poor internet connectivity or network congestion?",
            a: "UrPass automatically downloads the attendee manifest into local browser memory using IndexedDB. If internet connectivity drops, volunteers can continue scanning passes offline, and all timestamps will re-synchronize to the cloud once network access returns.",
          },
        ],
        relatedLinks: [
          { title: "Best QR Code Event Check-In Software in India", href: "/best-qr-code-event-check-in-software-india", category: "Guide" },
          { title: "How to Create QR Code Tickets for an Event", href: "/how-to-create-qr-code-event-tickets", category: "How-To" },
          { title: "Prevent Duplicate QR Ticket Entry", href: "/prevent-duplicate-qr-ticket-entry", category: "Security" },
          { title: "Pricing & Plans", href: "/pricing", category: "Pricing" },
        ],
      }}
    />
  );
}
