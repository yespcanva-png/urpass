import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Code Event Registration UK — Digital Passes & Entry | URPASS",
  description:
    "UK QR code event registration software. Build online registration forms, issue scannable digital QR passes instantly, and admit attendees in <0.3s. UK GDPR compliant.",
  keywords: [
    "qr code event registration uk",
    "qr event registration uk",
    "online registration with qr code uk",
    "event registration qr generator uk",
    "digital pass event registration uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/qr-code-event-registration",
  },
  openGraph: {
    title: "QR Code Event Registration UK — Digital Passes & Entry | URPASS",
    description:
      "Build registration pages that instantly issue digital QR passes to attendees across the UK. Zero manual tickets, fast gate scanning.",
    url: "https://urpass.space/uk/qr-code-event-registration",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkQrCodeEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/qr-code-event-registration",
        badge: "UK QR REGISTRATION · INSTANT DIGITAL PASSES",
        h1: "QR Code Event Registration Software for UK Events",
        description:
          "Combine online event registration with automatic digital QR pass delivery. Capture attendee details, deliver cryptographic QR tickets via email, and verify admissions in under 0.3 seconds at the door.",
        ctaLabel: "Create Your Event Free →",
        directAnswer: {
          title: "How does QR code event registration work in the UK?",
          summary:
            "When attendees register through your URPASS event page, the platform instantly generates a unique, encrypted QR code tied to their registration record. Attendees receive their digital pass via email and web link, which can be presented on any smartphone screen and scanned at the venue entrance in under 300 milliseconds without requiring app downloads.",
          keyPoints: [
            "Automatic digital QR pass generation upon attendee registration",
            "Delivered immediately via responsive web link and email confirmation",
            "Sub-second (<0.3s) camera check-in on volunteer smartphones",
            "Full UK GDPR compliance and attendee privacy protection",
          ],
        },
        features: [
          {
            icon: QrCode,
            title: "Automated QR Generation",
            desc: "Each attendee receives a unique, scannable QR code embedded directly into a responsive mobile pass.",
          },
          {
            icon: ScanLine,
            title: "Browser Camera Scanner",
            desc: "Validate passes at the entrance using standard smartphone browsers without downloading native apps.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Duplicate Protection",
            desc: "Instant duplicate warnings prevent ticket sharing and unauthorized reuse across all entrance doors.",
          },
        ],
        relatedLinks: [
          {
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
        ],
        faqs: [
          {
            q: "How are QR codes generated for registered attendees?",
            a: "As soon as an attendee completes your registration form, URPASS automatically generates an encrypted, tamper-proof QR code pass tied to their registration record. Attendees can access their pass on mobile web or save it to Apple Wallet.",
          },
          {
            q: "Can I collect custom registration fields?",
            a: "Yes. You can add custom questions, university student IDs, organization names, dietary requirements, or file uploads.",
          },
          {
            q: "Is URPASS compliant with UK GDPR?",
            a: "Yes. All personal data is encrypted and handled in strict accordance with the UK Data Protection Act 2018 and UK GDPR.",
          },
          {
            q: "How do door staff scan the QR code passes?",
            a: "Organizers share a secure scanner link. Door staff open it in Safari or Chrome on their smartphones and scan passes in under 0.28 seconds with zero app installation.",
          },
        ],
      }}
    />
  );
}
