import type { Metadata } from "next";
import {
  GraduationCap,
  Building,
  Users,
  QrCode,
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Event Registration Software UK | URPASS",
  description:
    "UK college event registration and check-in software. Ideal for collegiate universities, FE colleges, and sixth forms. Manage open days, alumni reunions, formal dinners, and campus guest lectures with sub-second QR entry.",
  keywords: [
    "college event registration uk",
    "collegiate university event management uk",
    "sixth form open day registration",
    "fe college event ticketing",
    "alumni reunion registration uk",
    "oxbridge college event software",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/college-event-registration",
    languages: {
      "en-GB": "https://urpass.space/uk/college-event-registration",
      "x-default": "https://urpass.space/college-event-registration",
    },
  },
  openGraph: {
    title: "College Event Registration Software UK | URPASS",
    description:
      "Manage college open days, formal halls, alumni reunions, and campus lectures across UK colleges with high-speed QR check-in and UK GDPR compliance.",
    url: "https://urpass.space/uk/college-event-registration",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkCollegeEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/college-event-registration",
        badge: "UK COLLEGIATE & FE SECTOR · CAMPUS GUEST MANAGEMENT",
        h1: "College Event Registration & Check-In Software UK",
        description:
          "From collegiate university formal dinners and alumni reunions in Oxford, Cambridge, and Durham, to busy open days at Further Education (FE) colleges and sixth forms, URPASS simplifies guest registration and door check-in.",
        ctaLabel: "Start Free College Trial",

        directAnswer: {
          title: "How does URPASS streamline college event registration in the UK?",
          summary:
            "URPASS provides UK colleges with a dedicated platform for coordinating prospective student open days, formal hall dinners, alumni reunions, and public guest lectures. It enables colleges to create branded online registration forms that capture institutional affiliations, dietary choices, and emergency contacts, deliver digital QR passes straight to attendee phones, and check guests in swiftly at college porters' lodges or dining halls without paper guest lists.",
          keyPoints: [
            "Branded registration workflows for prospective students, alumni, and fellows",
            "Collect dietary requirements, seating requests, and student identification",
            "Porters and event stewards scan passes in <0.3s using smartphone cameras",
            "Complete data protection adherence with UK GDPR and DPA 2018",
          ],
        },

        features: [
          {
            icon: Building,
            title: "Collegiate & Campus Ready",
            desc: "Designed to handle the unique prestige and operational needs of UK colleges, from medieval dining halls to modern FE campuses.",
          },
          {
            icon: ScanLine,
            title: "Instant Porter's Lodge Entry",
            desc: "Porters and event staff scan attendee digital passes at gates and entrances in under 300ms using any smartphone browser.",
          },
          {
            icon: Users,
            title: "Alumni & Fellow Management",
            desc: "Manage formal invitations, alumni reunions, and high-table guest lists with customized registration tiers and approval controls.",
          },
          {
            icon: QrCode,
            title: "Paperless QR Passes",
            desc: "Deliver elegant digital QR passes directly to attendee inboxes, eliminating physical ticket printing and lost paper vouchers.",
          },
          {
            icon: ShieldCheck,
            title: "Safeguarding & UK GDPR Compliance",
            desc: "Ensure rigorous privacy controls for sixth-form open days and prospective student registrations under UK data protection laws.",
          },
          {
            icon: Calendar,
            title: "Capacity Capping per Session",
            desc: "Set strict maximum capacities for campus tours, subject masterclasses, and formal dinner sittings with automated sold-out stops.",
          },
        ],

        useCases: [
          "Sixth-Form & FE College Open Days",
          "Collegiate Formal Hall Dinners & Feasts",
          "Alumni Gaudy & Reunion Weekends",
          "Subject Taster Days & Masterclasses",
          "Public College Lectures & Debates",
          "College Sports Matches & Garden Parties",
        ],

        relatedLinks: [
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
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
          {
            title: "Cambridge Event Registration & Check-In",
            href: "/uk/cambridge",
            category: "Location",
          },
          {
            title: "Oxford / London Event Management",
            href: "/uk/london",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can college porters scan tickets using their own phones or college tablets?",
            a: "Yes. The scanner runs directly in any modern web browser (Safari, Chrome, Edge) on phones, iPads, or desktop PCs. Porters simply open the scanner link, enter the station PIN, and begin scanning.",
          },
          {
            q: "How does the system handle prospective student open days with time slots?",
            a: "Organisers can configure separate ticket tiers for different arrival windows or department talks (e.g., 10:00 AM Science Tour, 11:30 AM Humanities Talk), each with its own capacity limit.",
          },
          {
            q: "Can we restrict dinner registration to verified college members?",
            a: "Yes. You can require attendees to provide their college membership number or register with an official college email address, or place all registrations into a manual approval queue.",
          },
        ],

        ctaTitle: "Modernise your college event operations",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Branded registration, rapid QR scanning, and UK GDPR compliance.",
      }}
    />
  );
}
