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
  title: "Event Registration & QR Check-In Software Leeds | 0% Commission | URPASS",
  description:
    "High-speed event registration and QR check-in software for Leeds venues, tech summits, Leeds University Union (LUU) societies, and corporate conferences. Sub-second scanning, offline caching, and 0% ticket commission.",
  keywords: [
    "event registration software leeds",
    "qr event check-in leeds",
    "leeds conference check-in app",
    "leeds university union ticketing",
    "luu society event software",
    "leeds digital festival ticketing",
    "zero commission event ticketing leeds",
    "eventbrite alternative leeds",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/leeds",
    languages: {
      "en-GB": "https://urpass.space/uk/leeds",
      "x-default": "https://urpass.space/uk",
    },
  },
  openGraph: {
    title: "Event Registration & QR Check-In Leeds | URPASS",
    description:
      "Run seamless gate check-ins across Leeds venues from the Royal Armouries to Leeds University Union. Sub-second phone scanning, student union features, and 0% ticket commission.",
    url: "https://urpass.space/uk/leeds",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-LDS",
    "geo.placename": "Leeds",
    "geo.position": "53.8008;-1.5491",
    "ICBM": "53.8008, -1.5491",
  },
};

export default function LeedsEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/leeds",
        badge: "LEEDS EVENT TECH · YORKSHIRE GATE CONTROL",
        h1: "Event Registration & Fast QR Check-In Software for Leeds Events",
        description:
          "Keep entrance queues moving across West Yorkshire's premier venues. From corporate conferences at the Royal Armouries and Leeds Digital Festival gatherings to massive society balls at Leeds University Union (LUU), URPASS provides sub-second phone scanning with 0% ticket commission.",
        ctaLabel: "Start Free in Leeds",

        directAnswer: {
          title: "Why choose URPASS for Leeds events and university operations?",
          summary:
            "URPASS is tailored to Leeds' thriving digital technology sector, major corporate services market, and extensive student community. It eliminates entrance bottlenecks by enabling door staff and student volunteers to scan attendee QR codes in under 0.3 seconds directly within standard smartphone browsers. With support for Leeds University Union (LUU) student IDs, offline entrance caching, and 0% per-ticket commission, URPASS maximizes ticket margins and ensures smooth event operations across Yorkshire.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning on any smartphone browser without app downloads",
            "0% commission on ticket sales saves thousands compared to Eventbrite UK",
            "Student ID verification built for Leeds University Union (LUU) and Leeds Beckett SU",
            "Offline caching ensures entrance continuity in historic halls or basement spaces",
          ],
        },

        keyFactsTable: {
          title: "Leeds Venue Check-In & Entry Performance",
          subtitle: "Comparison of URPASS operations against traditional ticketing apps in Leeds venues.",
          headers: ["Operational Metric", "URPASS Leeds", "Traditional Ticketing Apps (Eventbrite / Ticketmaster)"],
          rows: [
            {
              col1: "Gate Check-In Speed",
              col2: "<0.3 seconds per scan (camera reads from 30cm away)",
              col3: "3 to 5 seconds per attendee",
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
              col3: "Frequent network freeze errors in historic halls or dockside venues",
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
          title: "Rapid Gate Check-In for Yorkshire Audiences",
          description:
            "From Royal Armouries New Dock Hall and Leeds Town Hall to Leeds University Union (LUU) Stylus and Belgrave Music Hall, volunteer stewards scan mobile QR passes in under 300ms using ordinary phone cameras.",
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
            desc: "Yorkshire attendee personal data is held under strict UK privacy laws, never remarketed to competing events or third parties.",
          },
          {
            icon: Building2,
            title: "Leeds Student Union Ready",
            desc: "Capture institutional Student IDs and society membership credentials for Leeds University Union (over 300 societies) and Leeds Beckett SU.",
          },
          {
            icon: Users,
            title: "Multi-Gate Cloud Synchronisation",
            desc: "Synchronise attendance across multiple entrances in real time to prevent ticket sharing across doors.",
          },
        ],

        useCases: [
          "Leeds Digital Festival Tech Meetups",
          "Royal Armouries Conferences & Expos",
          "Leeds University Union (LUU) Balls & Formals",
          "Leeds Beckett Students' Union Club Nights",
          "Corporate Legal & Financial Summits",
          "Belgrave Music Hall & Arts Showcases",
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
            q: "Can Leeds student societies use URPASS for balls and society events?",
            a: "Yes. URPASS is widely used for student society formals, freshers mixers, and guest lectures. It enables committees to collect Student IDs, meal preferences, and table allocations while keeping 100% of ticket proceeds.",
          },
          {
            q: "How does the scanner handle weak mobile reception in Leeds venues?",
            a: "URPASS includes an intelligent offline caching engine. The approved attendee roster is cached in the browser locally upon opening the scanner session, allowing tickets to validate with zero internet connection.",
          },
          {
            q: "Can volunteer door staff scan tickets without downloading an app?",
            a: "Yes. Organisers simply share a secure scanner link and a 4-digit gate PIN. Volunteers open the link in Safari or Chrome and start scanning tickets immediately.",
          },
        ],

        ctaTitle: "Ready to run your next Leeds event?",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Sub-second scanning, 0% commission, and full UK GDPR compliance.",
        geo: {
          region: "GB-LDS",
          placename: "Leeds",
          position: "53.8008;-1.5491",
          latitude: 53.8008,
          longitude: -1.5491,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
