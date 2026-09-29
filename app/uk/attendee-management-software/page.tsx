import type { Metadata } from "next";
import {
  Users,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Zap,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Attendee Management Software UK — Roster & Check-In | URPASS",
  description:
    "UK attendee management software for conferences, universities, and corporate events. Manage rosters, filter guest lists, export data, resend digital QR passes, and ensure full UK GDPR compliance.",
  keywords: [
    "attendee management software uk",
    "uk event guest list manager",
    "attendee tracking system uk",
    "event roster software uk",
    "delegate management tool uk",
    "gdpr compliant attendee management",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/attendee-management-software",
    languages: {
      "en-GB": "https://urpass.space/uk/attendee-management-software",
      "x-default": "https://urpass.space/attendee-management",
    },
  },
  openGraph: {
    title: "Attendee Management Software UK — Roster & Check-In | URPASS",
    description:
      "Take full control of your guest lists and attendee rosters. Real-time status tracking, instant pass resending, and UK GDPR data governance.",
    url: "https://urpass.space/uk/attendee-management-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkAttendeeManagementSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/attendee-management-software",
        badge: "UK ATTENDEE INTELLIGENCE · ROSTER CONTROL",
        h1: "Attendee Management & Check-In Software UK",
        description:
          "Maintain a single, real-time source of truth for your event attendees. Filter guest lists, approve registrations, resend digital QR passes, and export clean CSV reports with complete UK GDPR compliance.",
        ctaLabel: "Manage Attendees Free",

        directAnswer: {
          title: "How does URPASS streamline attendee management for UK organisations?",
          summary:
            "URPASS combines real-time attendee roster tracking with seamless gate operations. Event organizers can search and filter attendees by name, email, ticket tier, or approval status, resend digital QR passes with one click, handle on-site exceptions instantly, and export clean data to spreadsheets. All attendee data is held under strict UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018 guidelines.",
          keyPoints: [
            "Real-time attendee roster with instant search, filtering, and tagging",
            "One-click pass resending and registration approval workflows",
            "Instant CSV and Excel exports formatted for union or corporate reporting",
            "Robust UK GDPR data subject request handling and Article 17 erasure",
          ],
        },

        features: [
          {
            icon: Users,
            title: "Live Attendee Roster",
            desc: "Monitor registrations in real time with clear visual tags for Registered, Approved, Checked-In, and Cancelled status.",
          },
          {
            icon: Search,
            title: "Instant Search & Lookup",
            desc: "Find any attendee in milliseconds by name, email, student ID, or ticket reference code during entrance operations.",
          },
          {
            icon: Mail,
            title: "One-Click Pass Resend",
            desc: "Instantly re-dispatch digital QR passes via email to attendees who mislaid their ticket before reaching the gate.",
          },
          {
            icon: Download,
            title: "Comprehensive CSV Export",
            desc: "Download complete attendee manifests with custom form responses, check-in timestamps, and ticket categories.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR Data Subject Tools",
            desc: "Fulfill attendee access and erasure requests effortlessly with built-in data compliance and privacy audit tools.",
          },
          {
            icon: Zap,
            title: "Real-Time Cloud Sync",
            desc: "Changes made in the attendee dashboard reflect across all active entrance scanner stations in under 50 milliseconds.",
          },
        ],

        useCases: [
          "UK University Campus Events & Societies",
          "Corporate Summits & Delegate Coordination",
          "Trade Expos & Exhibition Delegate Tracking",
          "Private Dining & Exclusive VIP Guest Lists",
          "Charity Galas & Award Dinners",
          "Training Courses & Masterclass Rosters",
        ],

        relatedLinks: [
          {
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
          {
            title: "Event Check-In Software UK",
            href: "/uk/event-check-in-software",
            category: "Product",
          },
          {
            title: "Conference Registration Software UK",
            href: "/uk/conference-registration-software",
            category: "Use Case",
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
            q: "Can I manually add attendees who register on the day of the event?",
            a: "Yes. Organisers can add walk-in attendees directly from the attendee dashboard. The system instantly generates a valid digital QR pass that can be scanned immediately at the gate.",
          },
          {
            q: "How does URPASS handle UK GDPR attendee deletion requests?",
            a: "In accordance with Article 17 of the UK GDPR (Right to Erasure), organisers can permanently purge an individual's personal data with a single click, completely removing their record from the active roster while preserving anonymous statistical totals.",
          },
          {
            q: "Can I export custom form answers (like dietary requirements) into Excel?",
            a: "Yes. All custom registration questions, including dietary choices, student IDs, and company names, are included as separate columns in the exported CSV file.",
          },
        ],

        ctaTitle: "Master your event attendee management",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Complete roster visibility, real-time sync, and strict UK GDPR compliance.",
      }}
    />
  );
}
