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
  GraduationCap,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Cambridge | 0% Commission | URPASS",
  description:
    "High-speed event registration and QR check-in software for Cambridge deep-tech summits, university college formal dinners, May Balls, and Judge Business School conferences. Sub-second scanning, offline caching, and 0% ticket commission.",
  keywords: [
    "event registration software cambridge",
    "qr event check-in cambridge",
    "cambridge college event ticketing",
    "silicon fen tech event software",
    "cambridge may ball ticketing",
    "cambridge judge business school conferences",
    "zero commission event ticketing cambridge",
    "eventbrite alternative cambridge",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/cambridge",
    languages: {
      "en-GB": "https://urpass.space/uk/cambridge",
      "x-default": "https://urpass.space/uk",
    },
  },
  openGraph: {
    title: "Event Registration & QR Check-In Cambridge | URPASS",
    description:
      "Run seamless gate check-ins across Cambridge collegiate halls and Silicon Fen tech hubs. Sub-second phone scanning, collegiate features, and 0% ticket commission.",
    url: "https://urpass.space/uk/cambridge",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-CAM",
    "geo.placename": "Cambridge",
    "geo.position": "52.2053;0.1218",
    "ICBM": "52.2053, 0.1218",
  },
};

export default function CambridgeEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/cambridge",
        badge: "CAMBRIDGE EVENT TECH · SILICON FEN & COLLEGIATE ENTRY CONTROL",
        h1: "Event Registration & Fast QR Check-In Software for Cambridge Events",
        description:
          "Keep entrance queues moving across Cambridge's world-leading collegiate colleges and deep-tech innovation hubs. From high-stakes life science summits and Cambridge Judge Business School forums to collegiate May Balls and guest lectures, URPASS delivers sub-second phone scanning with 0% ticket commission.",
        ctaLabel: "Start Free in Cambridge",

        directAnswer: {
          title: "Why choose URPASS for Cambridge events, colleges, and tech symposiums?",
          summary:
            "URPASS is designed to meet the rigorous demands of Cambridge's world-class academic institutions and Silicon Fen technology cluster. In historic collegiate colleges where thick medieval stone walls block cellular reception, URPASS's offline caching engine enables porters and student committees to validate attendee QR passes in under 0.3s without internet signal. With mandatory Student ID capture, VIP plus-one screening, and 0% per-ticket commission, URPASS protects budgets and delivers flawless entrance control.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning on any smartphone browser without app downloads",
            "Offline caching ensures scanning functions perfectly inside medieval stone college halls",
            "Collegiate student ID verification and meal preference capture for formal dinners",
            "0% commission on ticket sales saves thousands for Cambridge societies, colleges, and startups",
          ],
        },

        keyFactsTable: {
          title: "Cambridge Venue Check-In & Entry Performance",
          subtitle: "Comparison of URPASS operations against traditional ticketing apps in Cambridge venues.",
          headers: ["Operational Metric", "URPASS Cambridge", "Traditional Ticketing Apps (Eventbrite / FIXR)"],
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
              col1: "Historic Hall Offline Caching",
              col2: "Local browser caching: scans continue seamlessly with zero Wi-Fi/cellular",
              col3: "Frequent network freeze errors in historic stone courts and chapel foyers",
            },
            {
              col1: "Collegiate & Society Integration",
              col2: "Custom Student ID, CRSId (@cam.ac.uk), college affiliation, and formal meal choices",
              col3: "Generic ticketing with no collegiate or university format validation",
            },
            {
              col1: "Scanner Hardware",
              col2: "Standard smartphones (Safari / Chrome, no app download required)",
              col3: "Requires proprietary scanner app download or handheld hardware rental",
            },
          ],
        },

        productProof: {
          badge: "REAL-TIME ENTRY SPEED",
          title: "Rapid Gate Check-In for Cambridge Audiences",
          description:
            "From Cambridge Corn Exchange and West Cambridge Innovation Campus to historic college dining halls (Trinity, King's, St John's, Jesus) and the Cambridge Union, volunteer stewards scan mobile QR passes in under 300ms using ordinary phone cameras.",
          type: "scanner",
        },

        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Camera Scanning",
            desc: "Turn student committee phones or college porter devices into high-speed scanners. Scans validate in <0.3s with clear haptic cues.",
          },
          {
            icon: Zap,
            title: "Offline Vault Caching",
            desc: "Scanners continue validating passes without interruption even in thick medieval stone courts or college chapels with zero mobile signal.",
          },
          {
            icon: Banknote,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your ticket revenue. Transparent flat plans in GBP (£) with zero per-ticket cuts or booking fee surcharges.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Academic and biotech attendee personal data is held under strict UK privacy laws, never remarketed to competing events or third parties.",
          },
          {
            icon: GraduationCap,
            title: "Cambridge Collegiate Ready",
            desc: "Capture Cambridge CRSIds (@cam.ac.uk), college affiliation, student ID numbers, and dietary requirements for formal hall sittings.",
          },
          {
            icon: Users,
            title: "VIP & Plus-One Screening",
            desc: "Screen guest applications and manage named plus-ones for prestigious college balls, venture capital pitch days, and private dinners.",
          },
        ],

        useCases: [
          "Silicon Fen Deep-Tech & Biotech Summits",
          "Collegiate May Balls & Winter Formals",
          "Cambridge Judge Business School Conferences",
          "Cambridge Union Society Debating Events",
          "University Open Days & Admissions Inductions",
          "West Cambridge Science Park Research Expos",
        ],

        relatedLinks: [
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
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
            title: "Student Union Event Ticketing",
            href: "/uk/student-union-event-ticketing",
            category: "Use Case",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
        ],

        faqs: [
          {
            q: "How does URPASS work in historic Cambridge college dining halls with no Wi-Fi?",
            a: "URPASS includes an offline caching engine. The approved attendee roster is cached in the browser locally upon opening the scanner session at the porter's lodge or hall entrance, allowing tickets to validate with zero internet connection.",
          },
          {
            q: "Can we restrict event tickets exclusively to verified Cambridge students (@cam.ac.uk)?",
            a: "Yes. Organisers can require attendees to sign up with a valid University of Cambridge CRSId email address (@cam.ac.uk) or enter a valid Student ID number before receiving a ticket.",
          },
          {
            q: "Can we manage formal hall dining choices and seating allocations?",
            a: "Yes. Organisers can create custom dropdown and text fields during registration to collect meal preferences (vegan, halal, gluten-free), table selections, and plus-one details.",
          },
        ],

        ctaTitle: "Ready to run your next Cambridge event?",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Sub-second scanning, 0% commission, and full UK GDPR compliance.",
        geo: {
          region: "GB-CAM",
          placename: "Cambridge",
          position: "52.2053;0.1218",
          latitude: 52.2053,
          longitude: 0.1218,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
