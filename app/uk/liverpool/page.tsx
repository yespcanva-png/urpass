import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Smartphone,
  Banknote,
  Users,
  Zap,
  BarChart3,
  MapPin,
  Clock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Liverpool | 0% Commission | URPASS",
  description:
    "High-speed event registration and QR check-in software for Liverpool venues, ACC Liverpool conferences, Baltic Triangle creative gatherings, and Liverpool Guild of Students societies. Sub-second scanning, offline caching, and 0% ticket commission.",
  keywords: [
    "event registration software liverpool",
    "qr event check-in liverpool",
    "acc liverpool conference ticketing",
    "liverpool guild of students ticketing",
    "baltic triangle event software",
    "sound city liverpool ticketing",
    "zero commission event ticketing liverpool",
    "eventbrite alternative liverpool",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/liverpool",
    languages: {
      "en-GB": "https://urpass.space/uk/liverpool",
      "x-default": "https://urpass.space/uk",
    },
  },
  openGraph: {
    title: "Event Registration & QR Check-In Liverpool | URPASS",
    description:
      "Run seamless gate check-ins across Liverpool venues from ACC Liverpool to Camp and Furnace. Sub-second phone scanning, student union features, and 0% ticket commission.",
    url: "https://urpass.space/uk/liverpool",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-LIV",
    "geo.placename": "Liverpool",
    "geo.position": "53.4084;-2.9916",
    "ICBM": "53.4084, -2.9916",
  },
};

export default function LiverpoolEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/liverpool",
        badge: "LIVERPOOL EVENT TECH · MERSEYSIDE GATE CONTROL",
        h1: "Event Registration & Fast QR Check-In Software for Liverpool Events",
        description:
          "Keep entrance queues moving across Liverpool's world-class waterfront venues. From major conferences at ACC Liverpool and Exhibition Centre Liverpool to creative gatherings in the Baltic Triangle and society balls at Liverpool Guild of Students, URPASS delivers sub-second phone scanning with 0% ticket commission.",
        ctaLabel: "Start Free in Liverpool",

        directAnswer: {
          title: "Why choose URPASS for Liverpool events and university operations?",
          summary:
            "URPASS is designed for Liverpool's rich musical, cultural, academic, and conference ecosystem. It eliminates entrance delays by allowing door staff and student volunteers to scan attendee QR passes in under 0.3 seconds directly within standard smartphone web browsers. Featuring multi-door cloud sync across large waterfront exhibition halls, offline caching for historic dock buildings, and 0% per-ticket commission, URPASS keeps Merseyside event costs transparent and guest entry rapid.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning on any smartphone browser without app downloads",
            "0% commission on ticket sales saves thousands compared to Eventbrite UK or Skiddle",
            "Student ID verification built for University of Liverpool Guild of Students and JMSU",
            "Offline caching ensures entrance continuity in historic dock buildings and waterfront spaces",
          ],
        },

        keyFactsTable: {
          title: "Liverpool Venue Check-In & Entry Performance",
          subtitle: "Comparison of URPASS operations against traditional ticketing apps in Liverpool venues.",
          headers: ["Operational Metric", "URPASS Liverpool", "Traditional Ticketing Apps (Eventbrite / Skiddle)"],
          rows: [
            {
              col1: "Gate Check-In Speed",
              col2: "<0.3 seconds per scan (camera reads from 30cm away)",
              col3: "2.5 to 5 seconds per attendee",
            },
            {
              col1: "Platform Commission",
              col2: "0% Commission (Free plan £0, paid tiers from £15/mo)",
              col3: "6.5% + booking surcharge per ticket",
            },
            {
              col1: "Scanner Hardware",
              col2: "Standard smartphones (Safari / Chrome, no app download)",
              col3: "Requires proprietary scanner app download or handheld hardware rental",
            },
            {
              col1: "Offline Failover",
              col2: "Local browser caching: scans continue seamlessly without Wi-Fi",
              col3: "Frequent network freeze errors in historic waterfront or warehouse venues",
            },
            {
              col1: "Student Union Integration",
              col2: "Custom Student ID fields, course capture, and role-based permissions",
              col3: "Generic ticketing with no university-specific integration",
            },
          ],
        },

        productProof: {
          badge: "REAL-TIME ENTRY SPEED",
          title: "Rapid Gate Check-In for Merseyside Crowds",
          description:
            "From ACC Liverpool Kings Dock and St George's Hall to Camp and Furnace in the Baltic Triangle and Liverpool Guild of Students Mountford Hall, volunteer stewards scan mobile QR passes in under 300ms using ordinary phone cameras.",
          type: "scanner",
        },

        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Camera Scanning",
            desc: "Turn student committee phones or event steward devices into high-speed scanners. Scans validate in <0.3s with clear haptic cues.",
          },
          {
            icon: Zap,
            title: "Offline Vault Caching",
            desc: "Scanners continue validating passes without interruption even in thick stone buildings or dockside venues with fluctuating cellular signal.",
          },
          {
            icon: Banknote,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your ticket revenue. Transparent flat plans in GBP (£) with zero per-ticket cuts or booking fee surcharges.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Merseyside attendee personal data is held under strict UK privacy laws, never remarketed to competing events or third parties.",
          },
          {
            icon: Building2,
            title: "Liverpool Student Guild Ready",
            desc: "Capture institutional Student IDs and society membership credentials for University of Liverpool Guild of Students and Liverpool John Moores SU.",
          },
          {
            icon: Users,
            title: "Multi-Gate Cloud Synchronisation",
            desc: "Synchronise attendance across multiple entrances (such as Kings Dock Hall A & Hall B) in real time to prevent ticket sharing across doors.",
          },
        ],

        useCases: [
          "ACC Liverpool Conferences & Exhibitions",
          "Liverpool Guild of Students Formals & Gig Nights",
          "Baltic Triangle Tech & Creative Showcases",
          "Liverpool Sound City Industry Showcases",
          "St George's Hall Cultural Galas & Banquets",
          "Liverpool John Moores University (JMSU) Freshers Events",
        ],

        relatedLinks: [
          {
            title: "Manchester Event Registration & Check-In",
            href: "/uk/manchester",
            category: "Location",
          },
          {
            title: "University Event Management Software UK",
            href: "/uk/university-event-software",
            category: "Use Case",
          },
          {
            title: "Student Union Event Ticketing",
            href: "/uk/student-union-event-ticketing",
            category: "Use Case",
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
        ],

        faqs: [
          {
            q: "Can Liverpool student societies use URPASS for formals and gigs at Mountford Hall?",
            a: "Yes. URPASS is ideally suited for student society balls, sports socials, and club gigs at venues like Mountford Hall. Organisers collect Student IDs and dietary preferences with zero ticket commission.",
          },
          {
            q: "How does the scanner handle waterfront venues where cellular signal is weak?",
            a: "URPASS includes an intelligent offline caching engine. The approved attendee roster is cached in the browser locally upon opening the scanner session, allowing tickets to validate with zero internet connection.",
          },
          {
            q: "Can door stewards scan tickets without installing an app from the App Store?",
            a: "Yes. Organisers simply share a secure scanner link and a 4-digit gate PIN. Stewards open the link in Safari or Chrome and start scanning tickets immediately.",
          },
        ],

        ctaTitle: "Ready to run your next Liverpool event?",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Sub-second scanning, 0% commission, and full UK GDPR compliance.",
        geo: {
          region: "GB-LIV",
          placename: "Liverpool",
          position: "53.4084;-2.9916",
          latitude: 53.4084,
          longitude: -2.9916,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
