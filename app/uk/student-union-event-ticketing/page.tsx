import type { Metadata } from "next";
import {
  Users,
  QrCode,
  ScanLine,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Student Union Ticketing Software UK | URPASS",
  description:
    "Affordable student union ticketing software for UK universities. Sell society ball tickets, manage freshers week events, and scan passes in <0.3s with student volunteer phones. 0% ticket commission.",
  keywords: [
    "student union ticketing software",
    "uk student union event software",
    "society ball ticketing uk",
    "freshers week ticketing",
    "university society ticketing system",
    "cheap ticketing for student unions",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/student-union-event-ticketing",
    languages: {
      "en-GB": "https://urpass.space/uk/student-union-event-ticketing",
      "x-default": "https://urpass.space/student-union-event-ticketing",
    },
  },
  openGraph: {
    title: "Student Union Ticketing Software UK | URPASS",
    description:
      "Purpose-built ticketing and QR scanning for UK Students' Unions and student societies. Zero commission, student ID capture, and sub-second browser scanning.",
    url: "https://urpass.space/uk/student-union-event-ticketing",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkStudentUnionEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/student-union-event-ticketing",
        badge: "STUDENTS' UNION TICKETING · ZERO COMMISSION",
        h1: "Student Union Ticketing & Society Event Software UK",
        description:
          "Empower student committees and Union staff with frictionless ticketing. Sell society ball passes, run freshers week mixers, capture Student IDs, and validate tickets in under 0.3 seconds on volunteer smartphones.",
        ctaLabel: "Try Free for Your Society",

        directAnswer: {
          title: "Why is URPASS ideal for UK Students' Unions and societies?",
          summary:
            "URPASS removes the excessive per-ticket booking fees charged by commercial event apps, allowing UK Students' Unions (SUs) and student societies to retain 100% of their event revenues. Designed with annual committee handovers in mind, it provides simple registration forms with mandatory Student ID capture, digital QR passes that prevent scalping, and a browser-based camera scanner that committee members can run on their personal smartphones without downloading apps or renting hardware.",
          keyPoints: [
            "0% commission on ticket sales: save hundreds of pounds per society ball",
            "Door scanning on committee phones with zero hardware rental costs",
            "Mandatory Student ID and dietary requirement collection",
            "Prevents duplicate admissions and ticket touting between students",
          ],
        },

        features: [
          {
            icon: Banknote,
            title: "Zero Commission on Society Tickets",
            desc: "Keep 100% of your ticket money. Society funds stay in your union account rather than lining the pockets of commercial platforms.",
          },
          {
            icon: ScanLine,
            title: "Browser Camera Scanning",
            desc: "Volunteer committee members scan passes directly in Safari or Chrome. No App Store downloads or complex login setups.",
          },
          {
            icon: Users,
            title: "Student ID & Dietary Capture",
            desc: "Collect essential union data including Student ID, course, college affiliation, table seating preferences, and allergies.",
          },
          {
            icon: QrCode,
            title: "Anti-Touting Digital Passes",
            desc: "Dynamic digital QR passes prevent unauthorized resale and screenshot sharing at high-demand society formals and balls.",
          },
          {
            icon: Zap,
            title: "Multi-Door Synchronisation",
            desc: "Equip multiple committee members at different venue doors. Scans sync instantly to stop pass-sharing in real time.",
          },
          {
            icon: ShieldCheck,
            title: "Union Compliance & Reporting",
            desc: "Download complete attendee manifests and entrance logs for union health & safety, licensing, and financial auditing.",
          },
        ],

        useCases: [
          "Annual Society Formals & Winter Balls",
          "Freshers' Week Mixers & Club Nights",
          "Sports Club Matches & Tournaments",
          "Academic Society Guest Lectures",
          "Cultural Society Showcase Evenings",
          "Student Union Council & AGM Elections",
        ],

        relatedLinks: [
          {
            title: "University Event Management Software UK",
            href: "/uk/university-event-software",
            category: "Use Case",
          },
          {
            title: "College Event Registration UK",
            href: "/uk/college-event-registration",
            category: "Use Case",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "UK Event Ticketing Software",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Manchester Event Registration & Check-In",
            href: "/uk/manchester",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can committee members scan tickets without access to union bank details?",
            a: "Yes. Volunteers access the scanner interface using a restricted 4-digit gate PIN. They cannot see financial metrics, modify event settings, or view attendee private data.",
          },
          {
            q: "How does URPASS compare to platforms like FIXR or Native for student events?",
            a: "While apps like FIXR take substantial commission on every student ticket, URPASS operates on a transparent flat-fee model with 0% ticket commission. Furthermore, URPASS does not require students or door volunteers to download an app from an app store.",
          },
          {
            q: "Can we collect table seating and meal choices for society formals?",
            a: "Yes. Organisers can create custom dropdown and text fields during registration to collect meal preferences (vegan, halal, gluten-free), table selections, and plus-one details.",
          },
        ],

        ctaTitle: "Upgrade your society event ticketing today",
        ctaDescription:
          "Start your 30-day free trial on URPASS. 0% ticket commission, sub-second scanning, and student-friendly pricing.",
      }}
    />
  );
}
