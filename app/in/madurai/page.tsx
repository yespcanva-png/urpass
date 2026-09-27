import type { Metadata } from "next";
import { MapPin, GraduationCap, QrCode, ScanLine, Ticket, Users, Stethoscope, HeartHandshake } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Madurai — Colleges & Medical Summits",
  description:
    "URPASS event registration and QR check-in software for Madurai colleges, medical conferences, and cultural festivals. Thiagarajar College of Engineering (TCE), American College, and MKU ticketing.",
  keywords: [
    "event registration software Madurai",
    "QR check in Madurai",
    "Thiagarajar college symposium passes TCE",
    "Madurai medical conference passes",
    "The American College Madurai event registration",
    "Madurai cultural fest ticketing",
    "Madurai event ticketing platform",
  ],
  alternates: { canonical: "https://urpass.space/in/madurai" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Madurai | URPASS",
    description:
      "Digital event registration, fast QR entry passes, and phone check-in for Madurai college culturals, medical summits, and business conferences.",
    url: "https://urpass.space/in/madurai",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Madurai, Tamil Nadu, India",
    "geo.position": "9.9252;78.1198",
    "ICBM": "9.9252, 78.1198",
  },
};

export default function MaduraiPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · MADURAI TEMPLE CITY",
        h1: "Event Registration & QR Check-In Software for Madurai",
        canonicalUrl: "https://urpass.space/in/madurai",
        geo: {
          region: "IN-TN",
          placename: "Madurai, Tamil Nadu, India",
          position: "9.9252;78.1198",
          latitude: 9.9252,
          longitude: 78.1198,
        },
        description:
          "Powering national medical conferences, college cultural festivals, and engineering symposiums across Madurai with digital QR passes, instant UPI ticketing, and offline door scanning.",
        ctaLabel: "Launch your Madurai event",
        features: [
          {
            icon: GraduationCap,
            title: "TCE & College Culturals",
            desc: "Designed for Thiagarajar College of Engineering (TCE), The American College, Fatima College, and MKU inter-collegiate festivals and tech symposiums.",
          },
          {
            icon: Stethoscope,
            title: "Medical & Healthcare Summits",
            desc: "CME conference registration, doctor delegate passes, and CME credit tracking for Madurai Medical College, Apollo Madurai, and specialty clinical symposiums.",
          },
          {
            icon: Ticket,
            title: "Seamless UPI & Card Ticketing",
            desc: "Collect entry fees, delegate charges, and workshop fees via Google Pay, PhonePe, UPI, and debit cards with automated GST invoices.",
          },
          {
            icon: QrCode,
            title: "Branded Digital QR Passes",
            desc: "Issue personalized mobile passes with attendee category (Delegate, Speaker, Student, VIP), photo badges, and instant WhatsApp delivery.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Gate Check-In",
            desc: "Admit attendees in under 0.3 seconds using student smartphones or dedicated 2D laser barcode scanners with audio and tactile feedback.",
          },
          {
            icon: HeartHandshake,
            title: "Cultural & Community Events",
            desc: "Manage high-volume cultural programs, literary festivals, alumni reunions, and traditional temple city community gatherings with ease.",
          },
        ],
        callout: {
          badge: "CULTURAL & HEALTHCARE CAPITAL",
          title: "Simplifying Event Operations in South Tamil Nadu.",
          description:
            "From prestigious state-level medical conventions and engineering hackathons to large-scale cultural events across Madurai, URPASS guarantees rapid attendee verification and prevents unauthorized access.",
          bullets: [
            "National medical conferences (CME workshops & symposiums)",
            "Engineering symposiums at Thiagarajar College of Engineering",
            "College annual culturals & inter-collegiate tournaments",
            "Founder Lifetime Plan (₹19,999) available for local institutions",
          ],
        },
        useCases: [
          "TCE technical symposium passes",
          "Madurai medical specialty conferences",
          "American College culturals and seminars",
          "Fatima College inter-collegiate fests",
          "Madurai Kamaraj University academic seminars",
          "Madurai MSME trade & startup meetups",
          "Alumni reunions and annual general meetings",
          "Community cultural celebrations",
        ],
        faqs: [
          {
            q: "Can Madurai student clubs use URPASS for free events?",
            a: "Yes. The permanent Free Tier includes 2 events/month and up to 100 registrations/month at ₹0 forever with no credit card required—perfect for departmental paper presentations and club meetings.",
          },
          {
            q: "How does URPASS manage multi-gate entry at large Madurai venues?",
            a: "URPASS syncs check-ins atomically across all entrances in under 50ms, ensuring that once a QR pass is scanned at Gate 1, it cannot be reused at Gate 2 or anywhere else.",
          },
          {
            q: "Does the scanner work if mobile internet drops in convention halls?",
            a: "Yes. URPASS features an offline scanning engine with IndexedDB manifest caching. Volunteer staff can scan tickets continuously without an active internet connection, auto-syncing when network returns.",
          },
          {
            q: "Can medical conferences issue separate passes for Faculty, Delegates, and PGs?",
            a: "Yes. Ticket Studio allows you to create customized pass categories with unique colors, seat codes, access gates, and CME registration badges.",
          },
          {
            q: "Is there a lifetime software deal available for Madurai organizers?",
            a: "Yes. Local event teams, hospitals, and educational trusts can secure the URPASS Founder Lifetime Plan (₹19,999 one-time payment) for unlimited events with zero recurring subscription fees (limited to 20 accounts).",
          },
        ],
        ctaTitle: "Manage your Madurai event with URPASS",
        ctaDescription: "Trusted across South Tamil Nadu · QR passes · Zero monthly fee options",
      }}
    />
  );
}
