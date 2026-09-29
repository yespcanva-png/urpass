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
  CalendarCheck,
  Lock,
  Layers,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software UK | URPASS",
  description:
    "Manage event registration, digital QR passes, attendee check-in and attendance tracking with URPASS. Simple event software for UK conferences, universities, workshops and community events.",
  keywords: [
    "event registration software UK",
    "event check-in software UK",
    "QR check-in software UK",
    "event ticketing software UK",
    "event registration platform UK",
    "QR ticketing system UK",
    "event attendance tracking software UK",
    "digital event pass UK",
    "conference registration software UK",
    "university event management software UK",
  ],
  alternates: {
    canonical: "https://urpass.space/uk",
    languages: {
      "en-GB": "https://urpass.space/uk",
      "en-IN": "https://urpass.space/in",
      "x-default": "https://urpass.space",
    },
  },
  openGraph: {
    title: "Event Registration & QR Check-In Software UK | URPASS",
    description:
      "Manage event registration, digital QR passes, attendee check-in and attendance tracking with URPASS. Simple event software for UK conferences, universities, workshops and community events.",
    url: "https://urpass.space/uk",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image-uk.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "URPASS UK — Event Registration & QR Check-In Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Registration & QR Check-In Software UK | URPASS",
    description:
      "Manage event registration, digital QR passes, attendee check-in and attendance tracking with URPASS. Simple event software for UK conferences, universities, workshops and community events.",
    images: ["https://urpass.space/og-image-uk.png"],
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.4360",
  },
};

export default function UkEventPillarPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk",
        badge: "REGISTRATION · DIGITAL PASSES · FAST QR CHECK-IN",
        h1: "Event Registration & QR Check-In Software for UK Events",
        description:
          "URPASS helps event organisers manage registrations, issue digital QR passes, check attendees in at the entrance and track attendance from one place. Run conferences, university events, workshops, seminars, hackathons, exhibitions, community events and business events without juggling forms, spreadsheets and manual guest lists.",
        ctaLabel: "Create Your Event Free →",

        // 10-Point Standard: Direct Answer (40–60 words)
        directAnswer: {
          title: "What is URPASS UK Event Registration & QR Check-In Software?",
          summary:
            "URPASS is a connected event operating system developed for UK event organisers, universities, conferences, and community hosts. It brings online registration forms, automated digital QR passes, sub-second smartphone gate scanning, duplicate-entry blocking, and real-time attendance analytics into one connected workflow. Designed for fast event entry with zero attendee app downloads and transparent GBP pricing.",
          keyPoints: [
            "Online event registration: create branded forms and collect attendee data in minutes",
            "Digital QR passes delivered automatically to attendee smartphones via email or link",
            "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
            "Real-time attendance analytics distinguishing registered from checked-in guests",
          ],
        },

        // Core Platform Capabilities: Everything You Need to Run Event Registration
        features: [
          {
            icon: FileText,
            title: "Online Event Registration",
            desc: "Create a registration page and share one simple link with your attendees. Collect the information you need and manage registrations from your organiser dashboard.",
          },
          {
            icon: QrCode,
            title: "Digital QR Passes",
            desc: "Each approved attendee receives a unique digital QR pass for event entry. No printed guest lists. No manual ticket verification.",
          },
          {
            icon: ScanLine,
            title: "QR Event Check-In",
            desc: "Turn a phone into an event scanner. Scan an attendee's QR pass at the entrance and validate their registration in <0.3s.",
          },
          {
            icon: Lock,
            title: "Duplicate Entry Protection",
            desc: "Previously scanned or invalid passes are identified immediately during check-in, helping gate teams control event access.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Tracking",
            desc: "See registrations and check-ins from your event dashboard and understand exactly how many attendees have arrived in real time.",
          },
          {
            icon: Users,
            title: "Attendee Management",
            desc: "Keep attendee information, registration status, custom fields, and check-in activity organised in one centralised place.",
          },
        ],

        // 6-Step Check-In Process matching user specification
        steps: [
          {
            n: "01",
            title: "Create your event",
            desc: "Set up your event title, date, venue, and custom registration fields in your organiser dashboard.",
          },
          {
            n: "02",
            title: "Share your registration link",
            desc: "Send your URPASS event page through email, social media, WhatsApp, or embed it on your website.",
          },
          {
            n: "03",
            title: "Attendees register",
            desc: "Registrations appear inside your organiser dashboard with automatic or manual approval queues.",
          },
          {
            n: "04",
            title: "Generate digital QR passes",
            desc: "Each attendee receives a unique, mobile-responsive digital event pass delivered straight to their inbox.",
          },
          {
            n: "05",
            title: "Scan at the entrance",
            desc: "Your event team scans the QR code using any smartphone camera for instant green verification.",
          },
          {
            n: "06",
            title: "Track attendance",
            desc: "See who has arrived and monitor real-time event entry throughput directly on your dashboard.",
          },
        ],

        // Key Facts Table: Workflow Transformation
        keyFactsTable: {
          title: "Replace Forms + Spreadsheets + Manual Check-In",
          subtitle:
            "How URPASS transforms fragmented manual event tools into one connected workflow from registration to entrance.",
          headers: ["Event Stage", "Fragmented Manual Workflow", "Connected URPASS Workflow"],
          rows: [
            {
              col1: "1. Registration",
              col2: "Google Form or generic survey tool",
              col3: "Branded online registration form with custom fields",
            },
            {
              col1: "2. Data Storage",
              col2: "Clunky spreadsheet prone to accidental edits",
              col3: "Centralised attendee management with status tagging",
            },
            {
              col1: "3. Ticket Issuance",
              col2: "Manual confirmation emails or generic PDF attachments",
              col3: "Automated digital QR passes sent instantly to attendee phones",
            },
            {
              col1: "4. Gate Entry",
              col2: "Printed paper sheets with slow pen-and-paper crossing",
              col3: "Sub-second (<0.3s) camera scanning on any volunteer's phone",
            },
            {
              col1: "5. Duplicate Protection",
              col2: "Zero detection; forwarded emails or copied tickets pass through",
              col3: "Immediate red alert flags duplicate or reused tickets",
            },
            {
              col1: "6. Attendance Tracking",
              col2: "Manual counting after the event ends",
              col3: "Live real-time check-in stats and arrival velocity curves",
            },
          ],
        },

        // Deep-Dive Sections: Universities, No-Hardware, Simple Alternative, Free & Paid, Multi-Gate
        deepDiveSections: [
          {
            badge: "CAMPUS & HIGHER EDUCATION",
            title: "Event Registration Software for UK Universities & Students' Unions",
            paragraphs: [
              "University events often involve multiple departments, societies, organisers, and student volunteers. URPASS helps UK institutions centralise event registrations and attendee entry.",
              "Whether coordinating student society formals, academic department conferences, university open days, freshers' fairs, technical symposiums, or alumni galas, URPASS gives committees total visibility over registrations and gate flow.",
            ],
            bullets: [
              "Capture mandatory Student IDs, department affiliations, and society memberships",
              "Multi-committee access with role-based permissions for easy annual handovers",
              "Fast volunteer training: student door staff start scanning in seconds via phone browser",
              "Full compliance with UK GDPR and the Data Protection Act 2018",
            ],
            takeaway: "Your organisers can manage registrations while volunteers use QR scanning for attendee entry.",
          },
          {
            badge: "HARDWARE-FREE GATE SCANNING",
            title: "Event Check-In Software Without Complicated Hardware",
            paragraphs: [
              "You shouldn't need specialist laser equipment or rented scanning hardware for a straightforward event. URPASS is designed to make event entry simple.",
              "Your team can use compatible smartphones (iOS Safari, Android Chrome) to scan QR passes and validate attendees in under 0.3 seconds. This makes URPASS suitable for single entrance events (workshops, intimate meetups), multiple entrances (conferences, society balls), and high-volume venues.",
            ],
            bullets: [
              "Zero app downloads required: runs directly in mobile web browsers",
              "Offline caching engine keeps scanning functional even when venue Wi-Fi drops",
              "Multi-door synchronization in real time across unlimited volunteer phones",
              "Rapid manual search allows door staff to admit guests if phone batteries run out",
            ],
            takeaway: "Eliminate expensive hardware rentals and keep entrance queues moving smoothly.",
          },
          {
            badge: "SIMPLICITY & EFFICIENCY",
            title: "A Simple, Focused Alternative for Event Organisers",
            paragraphs: [
              "Large legacy event-management platforms can include dozens of complicated features that smaller organisers may never use, bundled with heavy per-ticket commissions and third-party ads.",
              "URPASS focuses on the core attendee journey: Register → Receive Pass → Scan → Enter. That makes it suitable for organisers who want straightforward event registration and QR check-in without unnecessary complexity.",
            ],
            bullets: [
              "Simple setup: create your event in under 3 minutes",
              "Digital-first: replace printed registration sheets with live digital passes",
              "QR-based entry: validate attendees with precision and speed",
              "Built for different event sizes: from 20-person workshops to 5,000-person summits",
            ],
            takeaway: "Spend less time managing administrative tools and more time delivering a great event.",
          },
          {
            badge: "DATA & REPORTING",
            title: "Know Who Actually Attended — Not Just Who Registered",
            paragraphs: [
              "Registration numbers do not always equal actual attendance. For free events, workshops, and corporate seminars, no-show rates can range from 20% to 50%.",
              "URPASS allows organisers to distinguish between registered attendees (people who signed up) and checked-in attendees (people who actually arrived at the venue). That gives organisers actionable attendance data for venue health & safety compliance, catering adjustments, and future event planning.",
            ],
            bullets: [
              "Live headcount graphs and entrance velocity tracking",
              "Instant CSV exports showing exact arrival timestamps and gate numbers",
              "Identify no-shows for targeted follow-up communication",
              "Real-time capacity warnings for venue fire safety limits",
            ],
            takeaway: "Gain accurate post-event insights backed by verified gate check-in records.",
          },
        ],

        // Built for Events Across the UK
        useCases: [
          "Conferences & Industry Summits",
          "University & Student Society Events",
          "Workshops & Professional Masterclasses",
          "Hackathons & Coding Competitions",
          "Business Networking & Product Launches",
          "Community Gatherings & Cultural Festivals",
          "Educational & CPD Seminars",
          "Multi-Gate Exhibitions & Trade Shows",
        ],

        // Comprehensive Internal Linking: Core Features, Verticals, and UK Cities
        relatedLinks: [
          // P0 Core Features
          {
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
          {
            title: "UK Event Check-In Software",
            href: "/uk/event-check-in-software",
            category: "Product",
          },
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "UK Event Ticketing Software",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "QR Ticketing System UK",
            href: "/uk/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },

          // P1 Higher Ed & Verticals
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
            title: "College Event Registration UK",
            href: "/uk/college-event-registration",
            category: "Use Case",
          },
          {
            title: "Conference Registration Software UK",
            href: "/uk/conference-registration-software",
            category: "Use Case",
          },
          {
            title: "Workshop Booking Software UK",
            href: "/uk/workshop-registration-software",
            category: "Use Case",
          },
          {
            title: "Free Event Registration UK",
            href: "/uk/free-event-registration",
            category: "Product",
          },
          {
            title: "Attendee Management Software UK",
            href: "/uk/attendee-management-software",
            category: "Product",
          },
          {
            title: "Digital Event Passes UK",
            href: "/uk/digital-event-passes",
            category: "Product",
          },
          {
            title: "Event Guest List Software UK",
            href: "/uk/event-guest-list-software",
            category: "Product",
          },

          // P2 UK Cities
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Manchester Event Registration & Check-In",
            href: "/uk/manchester",
            category: "Location",
          },
          {
            title: "Birmingham Event Registration & Check-In",
            href: "/uk/birmingham",
            category: "Location",
          },
          {
            title: "Edinburgh Event Registration & Check-In",
            href: "/uk/edinburgh",
            category: "Location",
          },
          {
            title: "Glasgow Event Registration & Check-In",
            href: "/uk/glasgow",
            category: "Location",
          },
          {
            title: "Leeds Event Registration & Check-In",
            href: "/uk/leeds",
            category: "Location",
          },
          {
            title: "Bristol Event Registration & Check-In",
            href: "/uk/bristol",
            category: "Location",
          },
          {
            title: "Liverpool Event Registration & Check-In",
            href: "/uk/liverpool",
            category: "Location",
          },
          {
            title: "Cambridge Event Registration & Check-In",
            href: "/uk/cambridge",
            category: "Location",
          },
          {
            title: "Zero Commission Event Ticketing UK",
            href: "/zero-commission-event-ticketing-uk",
            category: "Product",
          },
          {
            title: "University Society Event Ticketing",
            href: "/university-society-event-ticketing",
            category: "Product",
          },
        ],

        // 10 Detailed FAQs matching user specification
        faqs: [
          {
            q: "What is event registration software?",
            a: "Event registration software allows organisers to collect attendee registrations online, manage participant information and organise the attendee journey before an event. URPASS combines registration with digital QR passes, event entry and attendance tracking.",
          },
          {
            q: "What is QR event check-in?",
            a: "QR event check-in allows attendees to present a unique QR code when they arrive. The event team scans the code to validate the attendee and record their entry in under 0.3 seconds.",
          },
          {
            q: "Can URPASS be used for events in the UK?",
            a: "Yes. UK organisers can use URPASS to manage registrations, attendee information, digital passes and event check-in across England, Scotland, Wales, and Northern Ireland.",
          },
          {
            q: "Do attendees need to download an app?",
            a: "No. URPASS is designed around digital registration and mobile-responsive web QR passes, eliminating the need for attendees to install a separate event app for basic entry.",
          },
          {
            q: "Can URPASS be used for university events?",
            a: "Yes. URPASS can be used for university conferences, student society events, workshops, hackathons, symposiums, freshers' fairs, and other campus events with custom Student ID fields.",
          },
          {
            q: "Can I use URPASS for a free event?",
            a: "Yes. URPASS supports free event registration workflows. Organisers can create events, collect registrations, generate attendee QR passes, and manage entry completely free of charge.",
          },
          {
            q: "Can multiple people scan attendees?",
            a: "Yes. URPASS is designed to support event entry workflows where unlimited event staff or volunteers handle attendee check-in simultaneously across multiple doors with real-time sync.",
          },
          {
            q: "Can URPASS detect a QR code that has already been scanned?",
            a: "Yes. URPASS validates attendee passes during check-in and immediately identifies duplicate, reused, or invalid entry attempts with visual and haptic warnings.",
          },
          {
            q: "Does URPASS track attendance?",
            a: "Yes. Organisers can use registration and check-in information on their dashboard to understand who registered and who actually attended the event.",
          },
          {
            q: "What types of events can use URPASS?",
            a: "URPASS can be used for conferences, workshops, university events, hackathons, seminars, exhibitions, networking events, community events, and business events.",
          },
        ],

        // High-Converting Primary Conversion Callout
        ctaTitle: "Run Your Next UK Event With URPASS",
        ctaDescription:
          "Registration shouldn't end in a spreadsheet. Bring registration, attendee passes and event entry into one connected workflow. Create your event. Share the link. Scan attendees.",
        geo: {
          region: "GB",
          placename: "United Kingdom",
          position: "55.3781;-3.4360",
          latitude: 55.3781,
          longitude: -3.4360,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
