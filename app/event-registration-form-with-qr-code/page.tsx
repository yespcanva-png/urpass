import type { Metadata } from "next";
import {
  ClipboardList,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  BarChart3,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Form with QR Code Generation | URPASS",
  description:
    "Create custom event registration forms that automatically generate digital QR code passes. Fast in-browser door scanning, anti-fraud lock, and free plan.",
  keywords: [
    "event registration form with qr code",
    "online registration form with qr code",
    "generate qr code after form submission",
    "event form qr code generator",
    "google forms alternative with qr code",
    "free event registration form qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-registration-form-with-qr-code",
  },
  openGraph: {
    title: "Event Registration Form with QR Code Generation | URPASS",
    description:
      "Build custom registration forms that issue instant QR passes upon submission. Sub-second entrance scanning and permanent free plan.",
    url: "https://urpass.space/event-registration-form-with-qr-code",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventRegistrationFormWithQrCodePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-registration-form-with-qr-code",
        badge: "FORM & TICKET GENERATION",
        h1: "Event Registration Form With QR Code Generation",
        description:
          "The easiest way to collect attendee sign-ups and instantly issue tamper-proof digital QR code passes. Add custom questions, collect payments via UPI or cards, and scan attendee badges at the door in under 0.28 seconds.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "How Does a Form with QR Code Generation Work?",
          summary:
            "Instead of using generic form tools that require manual mail merges or complex third-party add-ons, URPASS natively combines custom form building with automatic QR pass generation. When an attendee submits your registration form, the system immediately generates a personalized, cryptographically signed QR code pass containing their verified information, ready for in-browser smartphone gate scanning.",
          keyPoints: [
            "Native QR Generation: Instant digital pass created automatically upon form submission or approval",
            "Custom Form Fields: Collect phone numbers, student roll numbers, dietary choices, and file uploads",
            "Entrance Gate Scanning: Point any mobile browser camera at the pass for 0.28s validation",
            "Permanent Free Tier: ₹0 forever for up to 50 attendees per event with no credit card required",
          ],
        },
        productProof: {
          badge: "FORM TO PASS AUTOMATION",
          title: "Instant QR Pass Delivery",
          description:
            "Registrants fill out your form and receive an encrypted digital pass instantly on mobile web with Apple and Google Wallet sync.",
          type: "passes",
        },
        features: [
          {
            icon: ClipboardList,
            title: "Custom Form Builder",
            desc: "Create clean, responsive forms with text inputs, dropdowns, radio buttons, and document upload fields in minutes.",
          },
          {
            icon: QrCode,
            title: "Automated QR Generation",
            desc: "Every submission automatically generates an individual, cryptographically signed mobile pass with zero manual effort.",
          },
          {
            icon: ScanLine,
            title: "0.28s Door Scanning",
            desc: "Volunteers scan attendee passes using any smartphone browser (Chrome or Safari) without installing dedicated apps.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Fraud Verification",
            desc: "Prevent ticket screenshot sharing with instant real-time duplicate check-in detection across all entrance doors.",
          },
          {
            icon: Zap,
            title: "Integrated Payment Rails",
            desc: "Collect ticket fees via Google Pay, PhonePe, UPI, and cards with direct bank settlements and 0% commission.",
          },
          {
            icon: BarChart3,
            title: "One-Click Data Export",
            desc: "Download complete registration rosters with custom form answers and verified check-in timestamps anytime.",
          },
        ],
        steps: [
          { n: "01", title: "Build Form", desc: "Set up registration fields, custom questions, and capacity in 2 minutes." },
          { n: "02", title: "Share Public Link", desc: "Share your clean registration link across WhatsApp, social media, and email." },
          { n: "03", title: "Auto-Generate Passes", desc: "Attendees submit details and receive encrypted QR passes immediately." },
          { n: "04", title: "Scan at the Gates", desc: "Volunteers validate badges in under 0.28s with zero door delays." },
        ],
        callout: {
          badge: "SEAMLESS AUTOMATION",
          title: "Stop hacking Google Forms with fragile add-ons",
          description:
            "Generic form builders were not engineered for events. Avoid spreadsheet chaos, email merge limits, and stressful manual door lookups.",
          bullets: [
            "Permanent free plan available — no credit card needed",
            "In-browser smartphone camera scanning (<0.28s)",
            "Automated Apple & Google Wallet pass delivery",
            "Real-time duplicate ticket blocking across all gates",
          ],
        },
        useCases: [
          "College events, hackathons & student club meets",
          "Workshops, training sessions & masterclasses",
          "Conferences, expos & industry summits",
          "Webinars, seminars & corporate town halls",
          "Community sports & social gatherings",
        ],
        faqs: [
          {
            q: "How does URPASS generate the QR code after form submission?",
            a: "As soon as an attendee completes your registration form, URPASS automatically generates a unique digital pass with an encrypted QR code containing their verified registration ID. The attendee sees the pass immediately on their screen and can save it to their phone wallet.",
          },
          {
            q: "Can I collect custom questions on the form?",
            a: "Yes! You can add text fields, multiple choice options, dropdowns, student roll numbers, organization names, or dietary choices.",
          },
          {
            q: "Is this free to use?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 attendees per event, including full digital QR pass generation and unlimited gate scanning.",
          },
          {
            q: "How do I scan the QR codes at the event?",
            a: "Organizers open their dashboard on any smartphone and tap 'Open Scanner'. It launches the camera directly inside Safari or Chrome to scan passes in under 0.28 seconds with zero app installation.",
          },
        ],
        ctaTitle: "Create your registration form with QR codes",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
