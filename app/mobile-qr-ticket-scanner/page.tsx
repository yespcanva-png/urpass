import type { Metadata } from "next";
import { Smartphone, ScanLine, Zap, ShieldCheck, CheckCircle2, Wifi, QrCode } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Mobile QR Ticket Scanner for Events | URPASS by Yesp",
  description: "Turn any mobile browser into a lightning-fast QR ticket scanner. No app store downloads or scanner rentals required. Built by Yesp Corporation.",
  keywords: [
    "mobile QR ticket scanner",
    "QR ticket scanner app",
    "phone ticket scanner",
    "event ticket scanner mobile",
    "mobile check-in scanner"
  ],
  alternates: { canonical: "https://urpass.space/mobile-qr-ticket-scanner" },
  openGraph: {
    title: "Mobile QR Ticket Scanner for Events | URPASS by Yesp",
    description: "Turn any mobile browser into a lightning-fast QR ticket scanner. Built by Yesp Corporation.",
    url: "https://urpass.space/mobile-qr-ticket-scanner",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MOBILE QR TICKET SCANNER",
        h1: "Mobile QR Ticket Scanner for Fast Event Entrance",
        canonicalUrl: "https://urpass.space/mobile-qr-ticket-scanner",
        description: "URPASS by Yesp Corporation converts any mobile phone into an enterprise-grade QR ticket scanner in seconds. Open your camera in Safari or Chrome and scan passes in under 0.3s.",
        ctaLabel: "Try Mobile Scanner",
        directAnswer: {
          title: "How does the URPASS mobile QR ticket scanner work?",
          summary: "The URPASS mobile ticket scanner operates directly within standard mobile browsers using WebRTC camera APIs. Gate coordinators open a dedicated scanner link on iOS or Android, point their camera at an attendee's digital pass, and the system verifies the cryptographic token against the cloud database in under 0.3s.",
          keyPoints: [
            "No App Store or Google Play downloads required",
            "Zero barcode hardware rentals — works on standard phones and tablets",
            "Instant haptic, audio, and high-visibility visual feedback for pass status",
            "Real-time fraud defense rejecting screenshots and already-scanned tickets"
          ]
        },
        features: [
          { icon: Smartphone, title: "Browser-Based Convenience", desc: "No APKs or app installations. Volunteers scan a QR or open a link to launch the scanner immediately." },
          { icon: Zap, title: "Lightning-Fast Optics", desc: "Optimized barcode recognition decodes damaged, dim, or off-angle phone screens effortlessly." },
          { icon: ShieldCheck, title: "Instant Duplicate Detection", desc: "If a pass has already been admitted, the scanner displays a clear red screen with the exact previous check-in time." },
          { icon: Wifi, title: "Multi-Scanner Sync", desc: "All volunteer phones synchronize state via real-time websockets, eliminating double entries across gates." },
          { icon: CheckCircle2, title: "Clear Admission Badges", desc: "Displays attendee name, pass category (VIP, Speaker, Participant), and check-in confirmation in bold text." },
          { icon: QrCode, title: "Works in Low Light", desc: "Equipped with built-in torch toggle for night concerts, outdoor festivals, and dim auditoriums." }
        ],
        faqs: [
          { q: "Does the scanner work on both iPhones and Android devices?", a: "Yes. The scanner runs flawlessly on iOS (Safari/Chrome) and Android (Chrome/Edge/Firefox) with standard camera permissions." },
          { q: "Do volunteers need an account to scan passes?", a: "No. Organizers can generate secure, self-authenticating scanner links with optional PIN protection for temporary gate volunteers." },
          { q: "Who developed the mobile QR ticket scanner?", a: "The mobile scanning engine is engineered and hosted by Yesp Corporation." }
        ]
      }}
    />
  );
}
