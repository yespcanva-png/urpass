import type { Metadata } from "next";
import { BadgeCheck, Radio, ScanLine, ShieldCheck, Smartphone, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Smartphone QR Ticket Scanner | UrPass",
  description: "No expensive handheld scanners required. Use any iPhone or Android camera to scan and validate attendee QR passes in under 0.3s.",
  keywords: [
    "smartphone qr ticket scanner",
    "scan event tickets with any compatible smartphone",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/smartphone-qr-ticket-scanner" },
  openGraph: {
    title: "Smartphone QR Ticket Scanner | UrPass",
    description: "No expensive handheld scanners required. Use any iPhone or Android camera to scan and validate attendee QR passes in under 0.3s.",
    url: "https://urpass.space/smartphone-qr-ticket-scanner",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "BROWSER-BASED SCANNING ENGINE",
        h1: "Scan Event Tickets with Any Compatible Smartphone",
        canonicalUrl: "https://urpass.space/smartphone-qr-ticket-scanner",
        description: "No expensive handheld scanners required. Use any iPhone or Android camera to scan and validate attendee QR passes in under 0.3s.",
        ctaLabel: "Test Smartphone Scanner",
        directAnswer: {
          title: "How Does the UrPass Smartphone QR Ticket Scanner Work?",
          summary: "UrPass operates entirely inside standard mobile web browsers (Safari, Chrome) using hardware-accelerated WebRTC camera feeds. Event volunteers and gate staff simply tap a secure scanner link, grant camera permission, and scan digital or printed QR passes in under 0.3 seconds with zero App Store or Play Store downloads.",
          keyPoints: ["Sub-300ms verification speed rivaling dedicated industrial laser hardware", "Zero app installation required \u2014 runs in any modern iOS or Android web browser", "Large color-coded validation screens with haptic vibration and audio feedback", "Offline scanning fallback validating passes even when venue cell reception fails"],
        },
        keyFactsTable: {
          title: "Smartphone Scanner vs Dedicated Hardware Rentals",
          subtitle: "Operational speed and cost efficiency comparison.",
          headers: ["Scanner Capability", "UrPass Mobile Browser Scanner", "Industrial Laser Handheld Rentals"],
          rows: [
            {
                        "col1": "Equipment Rental Cost",
                        "col2": "$0 / \u20b90 \u2014 staff use their existing smartphones",
                        "col3": "$150 to $250 rental fee per unit plus shipping"
            },
            {
                        "col1": "Setup & Training Time",
                        "col2": "Under 60 seconds (open URL and point camera)",
                        "col3": "Complex 30-minute training and software pairing"
            },
            {
                        "col1": "Hardware Failure Risk",
                        "col2": "If a phone battery dies, switch to another phone in 10s",
                        "col3": "Dead terminal shuts down entry lane completely"
            },
            {
                        "col1": "Scan Verification Speed",
                        "col2": "<0.3s instant camera detection",
                        "col3": "1 to 2 seconds aiming laser reticle"
            },
            {
                        "col1": "Screen Feedback Clarity",
                        "col2": "High-contrast full-screen emerald/crimson flash",
                        "col3": "Small monochromatic display on bulky plastic brick"
            }
],
        },
        features: [
          { icon: Smartphone, title: "Zero App Downloads", desc: "Volunteers open a simple link in Chrome or Safari; no account creation or app store downloads required." },
          { icon: ScanLine, title: "Sub-0.3s Instant Camera Engine", desc: "Optimized WebRTC and WebAssembly barcode processing reads passes from distances up to 1 meter." },
          { icon: BadgeCheck, title: "Full-Screen Visual Feedback", desc: "Screen flashes bright green for valid entries and deep crimson for duplicate or invalid passes." },
          { icon: Radio, title: "Offline Scanning Resilience", desc: "Client-side cryptographic validation allows scanning to continue when venue WiFi drops." },
          { icon: ShieldCheck, title: "Atomic Duplicate Protection", desc: "Sub-150ms cloud sync prevents the same QR code from being scanned twice across different gates." },
          { icon: Zap, title: "Flashlight / Torch Toggle", desc: "Built-in torch button illuminates passes in dimly lit auditoriums, concert halls, or night festivals." }
        ],
        steps: [
          { n: "01", title: "Generate Scanner Link", desc: "Click 'Launch Scanner' on your event dashboard to generate a secure scanning URL." },
          { n: "02", title: "Share with Staff", desc: "Send the link to volunteer WhatsApp groups or display a coordinator QR code to open it." },
          { n: "03", title: "Grant Camera Access", desc: "Staff tap 'Allow Camera' on their phone browser (Safari or Chrome)." },
          { n: "04", title: "Point and Scan", desc: "Point the camera at attendee phones or printed passes; verification happens in <0.3s." },
          { n: "05", title: "Watch Queues Disappear", desc: "Clear lines at a rate of 1,200+ attendees per hour per smartphone scanning lane." }
        ],
        callout: {
          badge: "ZERO RENTAL HEADACHES",
          title: "Never spend event budget renting obsolete laser hardware again.",
          description: "Event organizers waste thousands of dollars renting bulky laser scanners that are prone to battery failures, complex pairing steps, and slow aiming. Modern smartphone cameras are significantly faster.",
          bullets: ["Zero equipment rental, shipping, insurance, or damage deposit fees", "Deploy as many scanning lanes as needed by inviting additional volunteers", "Works seamlessly on both Apple iPhones and Android devices", "Instant audio beep and haptic buzz confirms valid passes without looking"],
        },
        faqs: [
          { q: "Do volunteers need to install an app from the App Store or Google Play?", a: "No! UrPass operates directly in standard mobile web browsers (Safari, Chrome). Volunteers simply open a link and start scanning." },
          { q: "Does the scanner work in low-light environments?", a: "Yes. The scanner includes an on-screen flashlight toggle that activates the smartphone torch for night events or dark club venues." },
          { q: "Can the scanner read passes displayed on dim phone screens?", a: "Yes. The advanced computer vision engine automatically adjusts exposure to read QR codes from dim screens, cracked glass, or printed paper." },
          { q: "What happens if a volunteer's phone loses internet access?", a: "UrPass caches validation keys locally in the browser so passes continue to be validated securely even if venue connectivity drops temporarily." }
        ],
        relatedLinks: [
          { title: "Conference Badge Scanning Software", href: "/conference-badge-scanning-software", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" }
        ],
      }}
    />
  );
}
