import type { Metadata } from "next";
import { CheckCircle2, QrCode, ScanLine, ShieldCheck, Users, Smartphone, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How Does QR Event Check-In Work? Complete Workflow",
  description: "QR event check-in works by assigning each registered attendee a cryptographically unique QR token. When an attendee arrives at the venue entrance, staff scans their code using any smartphone browser in under 0.3 seconds. The system immediately verifies the token against the event database, records the arrival timestamp, and marks the pass as used so it cannot be scanned again.",
  keywords: [
    "how does qr event check in work",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-does-qr-event-check-in-work" },
  openGraph: {
    title: "How Does QR Event Check-In Work? Complete Workflow | URPASS",
    description: "QR event check-in works by assigning each registered attendee a cryptographically unique QR token. When an attendee arrives at the venue entrance, staff scans their code using any smartphone browser in under 0.3 seconds. The system immediately verifies the token against the event database, records the arrival timestamp, and marks the pass as used so it cannot be scanned again.",
    url: "https://urpass.space/guides/how-does-qr-event-check-in-work",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "EXPLAINER GUIDE",
        h1: "How Does QR Event Check-In Work?",
        canonicalUrl: "https://urpass.space/guides/how-does-qr-event-check-in-work",
        description: "QR event check-in works by assigning each registered attendee a cryptographically unique QR token. When an attendee arrives at the venue entrance, staff scans their code using any smartphone browser in under 0.3 seconds. The system immediately verifies the token against the event database, records the arrival timestamp, and marks the pass as used so it cannot be scanned again.",
        ctaLabel: "Try QR check-in free",
        features: [
          { icon: QrCode, title: "1. Unique Token Generation", desc: "When an attendee registers or is approved, the platform creates an encrypted digital pass with a unique QR code tied specifically to their record." },
          { icon: ScanLine, title: "2. Mobile Pass Presentation", desc: "Attendees open their pass in any mobile web browser or save it to Apple Wallet. No mobile app download is required." },
          { icon: ShieldCheck, title: "3. Browser-Based Camera Scan", desc: "Volunteers open the organizer's scanner URL in Safari or Chrome, grant camera access, and point at the attendee's screen." },
          { icon: Users, title: "4. Cryptographic Validation", desc: "The scanner decodes the QR code and checks its validity against the cloud database in under 0.3 seconds." },
          { icon: Smartphone, title: "5. Single-Use Invalidation", desc: "Upon first scan, the pass status updates to 'Checked In'. Any duplicate scan attempt immediately triggers a red duplicate warning." },
          { icon: BarChart3, title: "6. Real-Time Dashboard Sync", desc: "Every scan updates the organizer's dashboard instantly, displaying live headcount, gate velocity, and arrival timestamps." },
        ],
        steps: [
          { n: "01", title: "Attendee Registers", desc: "Participant fills out online form and receives a direct digital pass link." },
          { n: "02", title: "Pass Displays at Gate", desc: "Attendee shows the high-contrast QR code on their smartphone screen." },
          { n: "03", title: "Staff Scans Code", desc: "Gate volunteer aims phone camera at the pass using browser scanner." },
          { n: "04", title: "Instant Verification", desc: "Screen displays green banner with attendee name and ticket tier." },
          { n: "05", title: "Attendance Logged", desc: "Pass is marked used, preventing any duplicate entry across all gates." },
        ],
        callout: {
          badge: "TECHNICAL PRECISION",
          title: "Why QR check-in outperforms legacy barcode scanners.",
          description: "Traditional 1D barcodes require dedicated laser scanner guns, can easily be photocopied, and lack real-time synchronization. Modern 2D QR codes store secure cryptographic tokens that validate across multiple mobile devices simultaneously.",
          bullets: [
            "Sub-0.3 second recognition from mobile screens and badges",
            "Cryptographically tamper-proof tokens preventing pass forgery",
            "Instant synchronization across multiple venue entrance gates",
            "Eliminates hardware rental costs and paper printing waste",
          ],
        },
        useCases: [
          "College Fests & Culturals",
          "Tech Conferences",
          "Hackathons & Buildathons",
          "Hands-on Workshops",
          "Corporate Summits",
          "Exhibition Entrances",
        ],
        faqs: [
          { q: "How long does each check-in scan take?", a: "The QR code is decoded and verified against the database in under 0.3 seconds directly inside the browser." },
          { q: "Can an attendee screenshot their QR code and share it with someone else?", a: "They can share the image, but the pass can only be used once. Whichever person arrives at the gate first is admitted; any subsequent scan triggers an immediate red 'Already Checked In' warning." },
          { q: "Do attendees need an internet connection at the door to show their pass?", a: "If the attendee has already opened the pass or saved it to their Apple Wallet, camera roll, or home screen, it displays offline without cellular connection." },
          { q: "Do volunteers need to download an app to scan passes?", a: "No. The URPASS scanner runs completely in mobile Safari or Chrome without any App Store or Play Store downloads." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
