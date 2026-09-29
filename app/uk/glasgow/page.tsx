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
  title: "Event Registration & QR Check-In Software Glasgow | 0% Commission | URPASS",
  description:
    "High-speed event registration and QR check-in software for Glasgow venues, SEC conferences, university societies, and Finnieston creative meetups. Sub-second scanning, offline caching, and 0% ticket commission.",
  keywords: [
    "event registration software glasgow",
    "qr event check-in glasgow",
    "glasgow conference check-in app",
    "sec glasgow event ticketing",
    "strathclyde student union ticketing",
    "glasgow university society events",
    "zero commission event ticketing glasgow",
    "eventbrite alternative glasgow",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/glasgow",
    languages: {
      "en-GB": "https://urpass.space/uk/glasgow",
      "x-default": "https://urpass.space/uk",
    },
  },
  openGraph: {
    title: "Event Registration & QR Check-In Glasgow | URPASS",
    description:
      "Run seamless gate check-ins across Glasgow venues from the SEC to SWG3. Sub-second phone scanning, student union features, offline mode, and 0% ticket commission.",
    url: "https://urpass.space/uk/glasgow",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-GLG",
    "geo.placename": "Glasgow",
    "geo.position": "55.8642;-4.2518",
    "ICBM": "55.8642, -4.2518",
  },
};

export default function GlasgowEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/glasgow",
        badge: "GLASGOW EVENT TECH · HIGHLAND & CITY ENTRY CONTROL",
        h1: "Event Registration & Fast QR Check-In Software for Glasgow Events",
        description:
          "Keep entrance queues moving across Glasgow's premier event spaces. From major trade exhibitions at the Scottish Event Campus (SEC) and creative gatherings in Finnieston to student society balls at Glasgow and Strathclyde universities, URPASS delivers sub-second phone scanning with 0% ticket fees.",
        ctaLabel: "Start Free in Glasgow",

        directAnswer: {
          title: "Why choose URPASS for Glasgow events and university operations?",
          summary:
            "URPASS is tailored to Glasgow's vibrant live event, academic, and conference culture. Designed to handle unpredictable Scottish weather, it eliminates outdoor entrance queues by enabling door volunteers to scan attendee QR passes in under 0.3s on standard smartphone browsers. With multi-door real-time sync, local offline caching for thick-walled Victorian halls, and 0% ticket commission, URPASS keeps Glasgow event costs low and door flows seamless.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning clears outdoor queues before Scottish rain causes frustration",
            "Local offline database caching keeps scanning operational in thick-walled venues without Wi-Fi",
            "0% commission on ticket sales saves thousands for Glasgow independent organisers and societies",
            "Student ID verification tailored for University of Glasgow and Strathclyde student unions",
          ],
        },

        keyFactsTable: {
          title: "Glasgow Venue Check-In & Entry Performance",
          subtitle: "Comparison of URPASS operations against traditional ticketing apps in Glasgow venues.",
          headers: ["Operational Metric", "URPASS Glasgow", "Traditional Ticket Apps (Eventbrite / Skiddle)"],
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
              col2: "Any volunteer smartphone (Safari / Chrome, no app download)",
              col3: "Requires proprietary scanner app download or laser terminal rentals",
            },
            {
              col1: "Offline Failover",
              col2: "Full offline caching for basement clubs or converted warehouses",
              col3: "Gate app freezes when venue Wi-Fi or cellular data drops",
            },
            {
              col1: "Student Union Support",
              col2: "Custom Student ID fields, course capture, and role-based permissions",
              col3: "Generic ticketing with no university-specific integration",
            },
          ],
        },

        productProof: {
          badge: "REAL-TIME ENTRY SPEED",
          title: "Rapid Gate Check-In for Glasgow Crowds",
          description:
            "From SEC Glasgow exhibition concourses and the OVO Hydro to SWG3 warehouse raves and George Square festival entrances, volunteer stewards scan mobile QR passes in under 300ms using ordinary phone cameras.",
          type: "scanner",
        },

        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Camera Scanning",
            desc: "Turn student committee phones or venue steward devices into high-speed scanners. Scans validate in <0.3s with clear haptic cues.",
          },
          {
            icon: Zap,
            title: "Offline Vault Caching",
            desc: "Scanners continue validating passes without interruption even in thick Victorian stone buildings or underground club basements.",
          },
          {
            icon: Banknote,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your box office revenue. Transparent flat plans in GBP (£) with zero per-ticket cuts or booking fee surcharges.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Scottish attendee personal data is held under strict UK privacy laws, never remarketed to competing events or third parties.",
          },
          {
            icon: Building2,
            title: "Glasgow Higher Education Ready",
            desc: "Capture institutional Student IDs and society membership credentials for Glasgow University (GUU & QMU) and Strathclyde Union events.",
          },
          {
            icon: Users,
            title: "Multi-Gate Cloud Synchronisation",
            desc: "Synchronise attendance across multiple entrances (such as East and West SEC gates) in real time to prevent ticket sharing.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Set Up Glasgow Event",
            desc: "Configure event details, ticket categories, and custom fields like Student ID or company affiliation.",
          },
          {
            n: "02",
            title: "Distribute Registration URL",
            desc: "Share the direct link across university portals, society Instagram pages, or conference marketing newsletters.",
          },
          {
            n: "03",
            title: "Deliver Digital Passes",
            desc: "Attendees receive clean mobile QR passes directly via email, ready to display on smartphone screens.",
          },
          {
            n: "04",
            title: "Scan at the Entrance",
            desc: "Door staff open the browser scanner on their phones and check in attendees in <0.3s with instant green verification.",
          },
          {
            n: "05",
            title: "Review Attendance Stats",
            desc: "Access live arrival graphs, gate velocities, and complete CSV attendee reports on your organiser dashboard.",
          },
        ],

        deepDiveSections: [
          {
            badge: "SCOTTISH EVENT HUBS",
            title: "Built for Glasgow's Distinctive Venue Landscape",
            paragraphs: [
              "Glasgow hosts Scotland's most intensive event calendar, spanning massive international trade summits at the Scottish Event Campus (SEC) on the River Clyde, cutting-edge creative showcases at SWG3 in Finnieston, and vibrant student gatherings in the West End.",
              "Traditional ticketing providers burden local organizers with punitive 6% to 8% booking fees and clunky scanner apps that require extensive staff training. URPASS simplifies entrance logistics: door stewards open a browser link, enter a 4-digit PIN, and begin admitting guests at rapid speed.",
            ],
            bullets: [
              "Check in 60+ guests per minute per door steward",
              "Works in outdoor festival setups in George Square and Glasgow Green",
              "Prevents duplicate admissions with real-time cloud conflict checks",
              "Instant 30-day free trial for Glasgow organisers with no card required",
            ],
            takeaway: "Empower your Glasgow event team with fast, zero-commission check-in technology.",
          },
        ],

        useCases: [
          "SEC Glasgow Conferences & Trade Shows",
          "University of Glasgow Society Balls & Formals",
          "University of Strathclyde Union Club Nights",
          "SWG3 Finnieston Creative & Music Showcases",
          "Glasgow Tech Meetups & Developer Hackathons",
          "George Square & Merchant City Festivals",
        ],

        relatedLinks: [
          {
            title: "Edinburgh Event Registration & Check-In",
            href: "/uk/edinburgh",
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
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
        ],

        faqs: [
          {
            q: "Can URPASS handle large events at SEC Glasgow or OVO Hydro?",
            a: "Yes. URPASS is built on high-performance cloud infrastructure capable of processing thousands of concurrent check-ins across dozens of entrance doors with sub-50ms synchronization latency.",
          },
          {
            q: "Does the scanner work in basement venues or areas with weak mobile reception?",
            a: "Yes. URPASS features an offline caching engine. The approved attendee roster is cached in the browser locally upon opening the scanner session, allowing tickets to validate with zero internet connection.",
          },
          {
            q: "Can Glasgow student societies use URPASS for free?",
            a: "Yes. URPASS provides a Free Forever tier for events with up to 100 registrations per month. For larger balls and freshers events, paid plans start at just £15/month with zero ticket commissions.",
          },
        ],

        ctaTitle: "Ready to run your next Glasgow event?",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Sub-second scanning, 0% commission, and full UK GDPR compliance.",
        geo: {
          region: "GB-GLG",
          placename: "Glasgow",
          position: "55.8642;-4.2518",
          latitude: 55.8642,
          longitude: -4.2518,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
