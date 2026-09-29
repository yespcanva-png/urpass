import type { Metadata } from "next";
import {
  Building2,
  Users,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Conference Registration Software UK — Passes & Badges | URPASS",
  description:
    "UK conference registration and delegate check-in software. Deliver digital QR passes, manage VIPs and speakers, scan delegates in <0.3s at major UK exhibition centres (ExCeL, SEC, NEC), and comply with UK GDPR.",
  keywords: [
    "conference registration software uk",
    "uk delegate management software",
    "conference check-in app uk",
    "b2b summit ticketing uk",
    "corporate conference badge scanner uk",
    "event entry management uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/conference-registration-software",
    languages: {
      "en-GB": "https://urpass.space/uk/conference-registration-software",
      "x-default": "https://urpass.space/conference-registration-software",
    },
  },
  openGraph: {
    title: "Conference Registration Software UK — Passes & Badges | URPASS",
    description:
      "High-speed delegate check-in and branded registration for UK conferences. Sub-second browser scanning, live capacity tracking, and UK GDPR compliance.",
    url: "https://urpass.space/uk/conference-registration-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkConferenceRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/conference-registration-software",
        badge: "UK B2B & CONFERENCES · DELEGATE MANAGEMENT",
        h1: "Conference Registration & Entry Management Software UK",
        description:
          "Run professional conferences, corporate summits, and industry exhibitions with ease. From custom delegate registration forms and digital QR credentials to sub-second smartphone check-in at major UK convention centres, URPASS keeps your delegates moving.",
        ctaLabel: "Launch Conference Free Trial",

        directAnswer: {
          title: "How does URPASS manage conference delegate registration in the UK?",
          summary:
            "URPASS provides UK conference producers and corporate event planners with an all-in-one registration and gate management solution. It captures delegate profiles, job titles, and workshop choices, generates branded digital QR delegate credentials, enables sub-second check-in using smartphone browsers across multiple doors, and complies strictly with the UK Data Protection Act 2018 and UK GDPR.",
          keyPoints: [
            "Branded registration forms capturing company name, job title, and dietary preferences",
            "Segmented ticket tiers: General Delegate, Speaker, Sponsor, Press, and VIP",
            "Sub-second (<0.3s) camera scanning on volunteer smartphones with zero hardware rentals",
            "Strict enterprise data privacy with zero third-party marketing to delegates",
          ],
        },

        features: [
          {
            icon: Building2,
            title: "Major Venue Ready",
            desc: "Tested for high-throughput gate operations at major UK exhibition centres including ExCeL London, NEC Birmingham, and SEC Glasgow.",
          },
          {
            icon: Users,
            title: "Delegate Tier Segmentation",
            desc: "Differentiate between Standard Attendees, Speakers, Exhibitors, and VIPs with distinct pass branding and access rights.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Gate Scanning",
            desc: "Check in hundreds of delegates during the 08:30–09:30 morning peak without building frustrating foyer queues.",
          },
          {
            icon: QrCode,
            title: "Dynamic Digital Credentials",
            desc: "Passes display delegate names, company branding, QR codes, and breakout session designations clearly on mobile screens.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Entrance Analytics",
            desc: "Track live delegate arrival curves, gate velocities, and attendance rates live on your organiser dashboard.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Built with enterprise data governance, customizable consent checkboxes, and one-click data purge functionality.",
          },
        ],

        useCases: [
          "UK Industry Conferences & Trade Summits",
          "Academic Research & Medical Symposiums",
          "Technology & Developer User Conferences",
          "Corporate Annual AGMs & Partner Summits",
          "Continuing Professional Development (CPD) Days",
          "Financial & Legal Sector Roundtables",
        ],

        relatedLinks: [
          {
            title: "UK Event Ticketing Software",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Attendee Management Software UK",
            href: "/uk/attendee-management-software",
            category: "Product",
          },
          {
            title: "Event Check-In Software UK",
            href: "/uk/event-check-in-software",
            category: "Product",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Birmingham Event Registration & Check-In",
            href: "/uk/birmingham",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can we print physical delegate badges on-site?",
            a: "Yes. Organisers can use URPASS digital passes for mobile scanning or export formatted attendee data to badge printing software and laser printers at the registration desk.",
          },
          {
            q: "How many scanner stations can we set up for a 2,000-person conference?",
            a: "There is no limit on concurrent scanner stations. For a 2,000-person conference, you can deploy 8 to 12 volunteer smartphones across your entrance doors to check in the entire crowd in under 25 minutes.",
          },
          {
            q: "Can we track attendance for specific breakout sessions and workshops?",
            a: "Yes. Organisers can set up separate gate stations for main plenary halls and specific breakout tracks to track attendance per session for CPD accreditation.",
          },
        ],

        ctaTitle: "Elevate your UK conference experience",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Professional registration, rapid gate scanning, and enterprise UK GDPR compliance.",
      }}
    />
  );
}
