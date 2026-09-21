import type { Metadata } from "next";
import { CheckCircle2, QrCode, ClipboardList, Mail, ScanLine, ShieldCheck, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Create QR Codes for Event Attendees: Step-by-Step",
  description: "To create QR codes for event attendees, use an event platform like URPASS that links an online registration form directly to an automated token generator. When participants submit their details or purchase a ticket, the system automatically creates a unique, encrypted QR code tied to their record and delivers it as an interactive mobile pass.",
  keywords: [
    "how to create qr codes for event attendees",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-create-qr-codes-for-event-attendees" },
  openGraph: {
    title: "How to Create QR Codes for Event Attendees: Step-by-Step | URPASS",
    description: "To create QR codes for event attendees, use an event platform like URPASS that links an online registration form directly to an automated token generator. When participants submit their details or purchase a ticket, the system automatically creates a unique, encrypted QR code tied to their record and delivers it as an interactive mobile pass.",
    url: "https://urpass.space/guides/how-to-create-qr-codes-for-event-attendees",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "STEP-BY-STEP GUIDE",
        h1: "How to Create QR Codes for Event Attendees",
        canonicalUrl: "https://urpass.space/guides/how-to-create-qr-codes-for-event-attendees",
        description: "To create QR codes for event attendees, use an event platform like URPASS that links an online registration form directly to an automated token generator. When participants submit their details or purchase a ticket, the system automatically creates a unique, encrypted QR code tied to their record and delivers it as an interactive mobile pass.",
        ctaLabel: "Create attendee QR codes free",
        features: [
          { icon: QrCode, title: "Automated Generation", desc: "Never generate QR codes manually one-by-one. URPASS generates unique cryptographic QR codes automatically upon registration." },
          { icon: ClipboardList, title: "Tied to Attendee Records", desc: "Each QR code encapsulates an encrypted token linked to the attendee's name, email, ticket tier, and check-in status." },
          { icon: Mail, title: "High-Contrast Visual Format", desc: "Generated with generous quiet zones and sharp contrast so phone cameras scan them instantly even in dim venues." },
          { icon: ScanLine, title: "Multi-Channel Delivery", desc: "Attendees access their QR pass via instant confirmation web links, email confirmations, or Apple Wallet." },
          { icon: ShieldCheck, title: "Anti-Tamper Cryptography", desc: "QR tokens cannot be guessed, sequentially altered, or fabricated by unauthorized attendees." },
          { icon: Smartphone, title: "Ready for Entrance Scanning", desc: "Codes connect seamlessly to the URPASS mobile browser scanner for rapid door verification." },
        ],
        steps: [
          { n: "01", title: "Create Your Event", desc: "Sign up on URPASS and enter event name, venue address, and date." },
          { n: "02", title: "Configure Form", desc: "Set up the required attendee fields (name, email, phone, custom questions)." },
          { n: "03", title: "Share Public Link", desc: "Publish the registration link for attendees to submit their signups." },
          { n: "04", title: "Auto-Issue QR Codes", desc: "Approved attendees receive their personalized digital QR pass instantly." },
          { n: "05", title: "Scan at Doors", desc: "Use any phone browser to scan and verify attendee QR codes at the gate." },
        ],
        callout: {
          badge: "AUTOMATION",
          title: "Stop using spreadsheet mail-merges to generate QR codes.",
          description: "Using free online QR generators and mail merge scripts is tedious and insecure. If codes lack centralized database validation, anyone can duplicate them. URPASS automates the entire registration, generation, and validation lifecycle.",
          bullets: [
            "Zero manual copy-pasting into image generators",
            "Instant token validation against live cloud database",
            "Permanent free tier for up to 100 registrations/month",
            "Single-use security ensures passes cannot be reused",
          ],
        },
        useCases: [
          "College Technical Symposiums",
          "Corporate Webinars & Summits",
          "Hackathon Team Passes",
          "Workshop Certifications",
          "Alumni Dinners",
          "Annual Campus Festivals",
        ],
        faqs: [
          { q: "Can I generate QR codes for an existing attendee list in Excel?", a: "Yes. You can import an existing CSV file of attendees into URPASS, and the platform will automatically generate unique QR passes for everyone." },
          { q: "Can attendees print their QR code on paper?", a: "Yes. URPASS passes are optimized for both mobile screens and standard printable paper badges." },
          { q: "What data is stored inside the attendee QR code?", a: "The QR code contains a secure, encrypted token that refers back to the attendee's database profile, preventing sensitive personal data exposure." },
          { q: "Is it free to generate QR codes for attendees?", a: "Yes. URPASS includes full QR code generation and mobile scanning on its permanent free plan for up to 100 attendees per month." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
