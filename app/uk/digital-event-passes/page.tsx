import type { Metadata } from "next";
import {
  QrCode,
  Smartphone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Digital Event Passes UK — Mobile QR & Wallet Ready | URPASS",
  description:
    "Branded digital event passes for UK conferences, universities, and festivals. Generate mobile QR credentials, customize ticket artwork, eliminate paper waste, and scan in <0.3s.",
  keywords: [
    "digital event passes uk",
    "mobile event ticket uk",
    "qr code event pass uk",
    "digital ticket designer uk",
    "paperless event passes uk",
    "mobile badge generator uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/digital-event-passes",
    languages: {
      "en-GB": "https://urpass.space/uk/digital-event-passes",
      "x-default": "https://urpass.space/digital-event-pass",
    },
  },
  openGraph: {
    title: "Digital Event Passes UK — Mobile QR & Wallet Ready | URPASS",
    description:
      "Deliver beautiful, scannable digital passes directly to attendee smartphones across the UK. Zero paper waste, custom branding, and instant verification.",
    url: "https://urpass.space/uk/digital-event-passes",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkDigitalEventPassesPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/digital-event-passes",
        badge: "UK DIGITAL PASSES · PAPERLESS CREDENTIALS",
        h1: "Digital Event Passes & Mobile Tickets for UK Events",
        description:
          "Replace costly plastic badges and paper tickets with elegant, mobile-optimised digital event passes. Customize ticket artwork with your brand, deliver passes straight to attendee smartphones, and scan in under 0.3 seconds.",
        ctaLabel: "Design Your First Pass Free",

        directAnswer: {
          title: "What are digital event passes and how do they benefit UK organisers?",
          summary:
            "Digital event passes are mobile-responsive electronic credentials containing encrypted QR codes, event schedules, and attendee identifiers. Delivered automatically via email and web links, they render seamlessly on iPhone and Android screens without requiring app downloads. For UK organizers, digital passes eliminate printing costs, reduce environmental impact, prevent physical ticket loss, and validate in under 0.3 seconds at the door.",
          keyPoints: [
            "100% paperless credentials: eliminate ticket printing and plastic lanyard waste",
            "Customise pass layout, banner artwork, accent colours, and attendee details",
            "Cryptographically signed QR codes prevent screenshot forgery and touting",
            "Loads instantly in any mobile browser with high-contrast screen scanning",
          ],
        },

        features: [
          {
            icon: QrCode,
            title: "Cryptographic QR Engine",
            desc: "Each digital pass features an encrypted QR payload that ties uniquely to the attendee's profile and validates against the live cloud database.",
          },
          {
            icon: Smartphone,
            title: "Zero-App Mobile Display",
            desc: "Passes open instantly in Safari or Chrome. Attendees can easily add the pass to their home screen or bookmark the link for gate presentation.",
          },
          {
            icon: Sparkles,
            title: "Visual Pass Designer",
            desc: "Customise your digital pass with your organisation's logo, hero banner image, brand colour palette, and custom ticket labels.",
          },
          {
            icon: Lock,
            title: "Anti-Screenshot Protection",
            desc: "Real-time state validation ensures that once a pass is scanned at the entrance, subsequent attempts display an immediate duplicate warning.",
          },
          {
            icon: Layers,
            title: "Tiered Pass Badging",
            desc: "Issue visually distinctive passes for VIP, Speaker, Delegate, Student, and Press categories with custom badge colours.",
          },
          {
            icon: Zap,
            title: "Eco-Friendly & Cost-Effective",
            desc: "Cut your event carbon footprint and save hundreds of pounds by eliminating paper tickets, wristbands, and plastic lanyard badges.",
          },
        ],

        useCases: [
          "UK University Society Formals & Balls",
          "Academic & Industry Conferences",
          "Tech Hackathons & Startup Summits",
          "Film Screenings & Theatrical Performances",
          "Music Festivals & Nightlife Events",
          "Charity Galas & Award Banquets",
        ],

        relatedLinks: [
          {
            title: "QR Ticketing System UK",
            href: "/uk/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "UK Event Ticketing Software",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can attendees save their digital pass offline?",
            a: "Yes. Attendees can save their digital pass page to their mobile browser offline reading list, take a screenshot, or print out a paper copy. The high-contrast QR code scans reliably from all formats.",
          },
          {
            q: "Can we include venue directions and event schedules on the pass?",
            a: "Yes. The digital pass displays venue address, Google Maps links, start times, and custom instructions configured by the organiser.",
          },
          {
            q: "What happens if an attendee loses their pass link?",
            a: "Organisers can resend the pass link to the attendee's email with a single click from the dashboard, or look up their name manually at the gate.",
          },
        ],

        ctaTitle: "Upgrade to paperless digital event passes",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Beautiful passes, sub-second scanning, and 0% ticket commission.",
      }}
    />
  );
}
