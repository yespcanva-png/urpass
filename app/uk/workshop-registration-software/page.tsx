import type { Metadata } from "next";
import {
  Sliders,
  Users,
  CalendarCheck,
  QrCode,
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Workshop Registration & Booking Software UK | URPASS",
  description:
    "UK workshop registration and booking software for trainers, masterclasses, and creative studios. Strict capacity limits, applicant screening, automated QR passes, and sub-second check-in.",
  keywords: [
    "workshop booking software uk",
    "uk workshop registration system",
    "training course booking software uk",
    "seminar registration software uk",
    "masterclass booking platform uk",
    "cpd workshop registration uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/workshop-registration-software",
    languages: {
      "en-GB": "https://urpass.space/uk/workshop-registration-software",
      "x-default": "https://urpass.space/workshop-registration-software",
    },
  },
  openGraph: {
    title: "Workshop Registration & Booking Software UK | URPASS",
    description:
      "Manage small-group workshop registrations, enforce strict capacity caps, and verify attendees with mobile QR passes across the United Kingdom.",
    url: "https://urpass.space/uk/workshop-registration-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkWorkshopRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/workshop-registration-software",
        badge: "UK TRAINING & MASTERCLASSES · CAPACITY CONTROL",
        h1: "Workshop Registration & Booking Software for UK Organisers",
        description:
          "Easily coordinate professional training workshops, creative masterclasses, and technical seminars. Enforce strict seat caps, review applicant experience levels, and admit attendees effortlessly with digital QR passes.",
        ctaLabel: "Start Workshop Trial",

        directAnswer: {
          title: "How does URPASS simplify workshop bookings in the UK?",
          summary:
            "URPASS is tailored for UK workshops, training bootcamps, and masterclasses where seat capacities are limited and participant screening is essential. It enables trainers and studios to build clean registration pages, set strict attendee limits, collect pre-requisite information (such as skill levels or dietary needs), approve attendees manually or automatically, and confirm attendance upon arrival via sub-second camera scanning.",
          keyPoints: [
            "Strict capacity limits prevent overbooking of small studio or lab spaces",
            "Screen attendees with approval queues for intermediate or advanced courses",
            "Automatic digital QR pass delivery with venue map and preparation notes",
            "0% commission on paid workshop fees with transparent GBP pricing",
          ],
        },

        features: [
          {
            icon: Sliders,
            title: "Strict Capacity Limits",
            desc: "Prevent awkward overbooking. Courses automatically mark as full or pause registration once seat limits are reached.",
          },
          {
            icon: Users,
            title: "Participant Screening",
            desc: "Collect portfolio links, experience levels, or employer details and review submissions before issuing confirmed passes.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Confirmed participants receive clean mobile passes with venue directions, room numbers, and required preparation files.",
          },
          {
            icon: ScanLine,
            title: "Rapid Arrival Check-In",
            desc: "Greet participants at the workshop door and confirm their attendance in under 0.3s using your smartphone camera.",
          },
          {
            icon: Clock,
            title: "Time-Slot Scheduling",
            desc: "Run morning and afternoon cohorts with separate ticket categories and distinct capacity controls for each session.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR Compliance",
            desc: "Protect sensitive corporate or attendee information with strict UK Data Protection Act 2018 controls and consent records.",
          },
        ],

        useCases: [
          "Professional CPD Accreditation Seminars",
          "Creative Arts, Photography & Pottery Workshops",
          "Software Engineering Bootcamps & Code Labs",
          "Executive Leadership & Management Masterclasses",
          "Barista, Culinary & Baking Masterclasses",
          "Academic Research Methodologies Training",
        ],

        relatedLinks: [
          {
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
          {
            title: "Attendee Management Software UK",
            href: "/uk/attendee-management-software",
            category: "Product",
          },
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "Bristol Event Registration & Check-In",
            href: "/uk/bristol",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can I limit registration to exactly 15 participants?",
            a: "Yes. You can define exact registration quotas for your workshop. As soon as the 15th participant registers, the registration form updates automatically to 'Sold Out'.",
          },
          {
            q: "Can I collect prerequisite information from applicants?",
            a: "Yes. Organisers can create custom mandatory questions on the registration form to ask for years of experience, software versions, or specific learning objectives.",
          },
          {
            q: "Can I send preparation materials along with the ticket confirmation?",
            a: "Yes. The automated confirmation email can include custom joining instructions, pre-reading links, venue access codes, and room directions.",
          },
        ],

        ctaTitle: "Run your next UK workshop with confidence",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Enforce seat capacities, issue digital passes, and scan attendees in <0.3s.",
      }}
    />
  );
}
