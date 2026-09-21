import type { Metadata } from "next";
import { QrCode, Zap, Ticket, Smartphone, ShieldCheck, RefreshCw } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event QR Code Generator for Attendees",
  description: "Generate unique QR codes for every event attendee automatically. Each QR is linked to the attendee's registration, single-use, and scannable at entry. No printing needed.",
  alternates: { canonical: "https://urpass.space/event-qr-code-generator" },
  openGraph: {
    title: "Event QR Code Generator for Attendees | URPASS",
    description: "Automatically generate a unique QR code for every attendee. Scan at entry for instant verification.",
    url: "https://urpass.space/event-qr-code-generator",
  },
};

export default function EventQrCodeGeneratorPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT QR CODE GENERATOR",
        h1: "Generate QR Codes for Event Attendees",
        description: "URPASS automatically generates a unique QR code for every approved attendee. No manual work. Each QR is embedded in a digital pass and scannable at your event entrance.",
        ctaLabel: "Generate QR codes free",
        features: [
          { icon: QrCode, title: "Auto-generated QR codes", desc: "A unique QR code is created instantly for every attendee when you approve their application." },
          { icon: Zap, title: "Zero manual work", desc: "No external QR generator needed. URPASS handles generation, delivery, and validation automatically." },
          { icon: ShieldCheck, title: "Cryptographically unique", desc: "Every QR code is a unique token tied to a specific attendee registration — impossible to guess or duplicate." },
          { icon: Smartphone, title: "Mobile-ready delivery", desc: "QR codes are embedded in a digital pass that opens in any mobile browser — no app or printing needed." },
          { icon: RefreshCw, title: "Single-use enforcement", desc: "Each QR can only be scanned once. Second scan attempts are blocked with an 'Already used' result." },
          { icon: Ticket, title: "Scannable at entry", desc: "Staff uses the URPASS scanner on any phone to validate QR codes at the entrance in under a second." },
        ],
        callout: {
          badge: "AUTOMATIC GENERATION",
          title: "One approval. One unique QR. Done.",
          description: "You approve the attendee. URPASS creates their unique QR code, embeds it in a digital pass, and makes it available via a direct link — automatically.",
          bullets: [
            "No external tools or services",
            "Unique per attendee registration",
            "Scannable at entry point",
            "Works on any phone screen",
          ],
        },
        useCases: [
          "Workshops", "College events", "Hackathons", "Conferences",
          "Corporate events", "Seminars", "Community events", "Tech events",
        ],
        faqs: [
          { q: "How does URPASS generate QR codes for attendees?", a: "When you approve an attendee in URPASS, the system automatically generates a unique QR token and embeds it in a digital pass page. The attendee receives the link to their pass with the QR code included." },
          { q: "Do I need to use a separate QR generator?", a: "No. URPASS handles QR generation automatically. There is no need for external QR tools or services." },
          { q: "Is each QR code unique per attendee?", a: "Yes. Every QR code is a cryptographically unique token that is tied to a specific attendee registration and event. The same QR cannot be reused for another attendee." },
          { q: "Can I print the QR codes as physical passes?", a: "URPASS is designed for digital passes. Attendees show their QR on a phone screen. However, attendees can screenshot their pass if needed." },
          { q: "What happens if an attendee tries to use someone else's QR?", a: "The QR is single-use. Once the original attendee has checked in, any subsequent scan of that QR shows 'Already Checked In' and is blocked." },
          { q: "How many QR codes can I generate?", a: "Free plan supports up to 50 QR codes per event. Starter supports 500 and Pro supports 2,000 per event." },
        ],
        ctaTitle: "Auto-generate QR codes for your attendees",
        ctaDescription: "Zero manual work · Unique per attendee · Scannable at entry · Free to start",
      }}
    />
  );
}
