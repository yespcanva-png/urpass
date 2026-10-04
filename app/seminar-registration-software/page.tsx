import type { Metadata } from "next";
import { Banknote, BarChart3, FileText, Lock, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Seminar Registration & Attendee Check-In Software | URPASS",
  description: "Professional seminar registration software with speaker agendas, CPD attendance credits, custom registration forms, and sub-second smartphone check-in.",
  keywords: ["seminar registration software", "seminar ticketing platform", "cpd seminar attendance tracking", "academic seminar check-in", "guest lecture registration software", "seminar qr check-in app"],
  alternates: {
    canonical: "https://urpass.space/seminar-registration-software",
  },
  openGraph: {
    title: "Seminar Registration & Attendee Check-In Software | URPASS",
    description: "Professional seminar registration software with speaker agendas, CPD attendance credits, custom registration forms, and sub-second smartphone check-in.",
    url: "https://urpass.space/seminar-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function SeminarRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "SEMINARS & CPD LECTURES",
  "h1": "Seminar Registration & Attendee Check-In Software",
  "canonicalUrl": "https://urpass.space/seminar-registration-software",
  "description": "Professional seminar registration software with speaker agendas, CPD attendance credits, custom registration forms, and sub-second smartphone check-in.",
  "ctaLabel": "Create Your Seminar Free →",
  "ctaTitle": "Run Professional Seminars with Accurate Attendance",
  "ctaDescription": "Collect delegate registrations, issue mobile QR credentials, and verify entrance in <0.3s to award verified CPD certification.",
  "directAnswer": {
    "title": "What is Seminar Registration Software?",
    "summary": "URPASS is seminar registration and attendee check-in software built for academic lectures, professional development seminars, and corporate briefing sessions. It lets organizers create customized registration pages, distribute digital QR passes, and record verified arrival timestamps with smartphone cameras for audit-ready CPD and professional accreditation.",
    "keyPoints": [
      "Detailed delegate intake: professional license numbers, affiliations, and job titles",
      "Instant digital QR passes delivered straight to attendees' mobile devices",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero hardware rentals",
      "Verified arrival timestamps to export official CPD attendance certificates"
    ]
  },
  "whatIs": {
    "title": "What is Seminar Registration Software?",
    "definition": "Seminar registration software is an educational event platform that manages delegate booking, speaker topic promotion, credential delivery, and entrance verification for professional and academic seminars.",
    "details": [
      "Replaces manual sign-in sheets with tamper-proof digital QR check-in records",
      "Tracks exact arrival and departure timestamps required for professional CPD credits",
      "Operates directly on standard mobile browsers with zero software downloads",
      "Provides live headcount monitoring to maintain lecture theatre fire safety limits"
    ]
  },
  "howItWorksTitle": "How URPASS Works for Seminars",
  "howItWorksSubtitle": "From lecture registration to verified CPD certification.",
  "steps": [
    {
      "n": "01",
      "title": "Configure seminar",
      "desc": "Set lecture title, guest speakers, CPD hours, and custom registration fields."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Distribute your clean event page to professional networks and members."
    },
    {
      "n": "03",
      "title": "Delegates register",
      "desc": "Attendees confirm registration and submit professional license details."
    },
    {
      "n": "04",
      "title": "Issue digital passes",
      "desc": "Personalized digital QR passes are sent instantly to delegates."
    },
    {
      "n": "05",
      "title": "Scan at the lecture hall",
      "desc": "Door staff scan passes in <0.3s with smartphone cameras as delegates enter."
    },
    {
      "n": "06",
      "title": "Export CPD records",
      "desc": "Generate verified attendance logs with exact timestamps for credit issuance."
    }
  ],
  "featuresTitle": "Features for High-Stakes Educational Seminars",
  "featuresSubtitle": "CPD logging, custom intake, and sub-second smartphone check-in.",
  "features": [
    {
      icon: FileText,
      "title": "Professional License Capture",
      "desc": "Capture bar numbers, medical license IDs, or engineering charter numbers during registration."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Entrance Scanning",
      "desc": "Admit delegates smoothly through lecture hall doors without paper sign-in bottlenecks."
    },
    {
      icon: BarChart3,
      "title": "Audit-Ready CPD Logs",
      "desc": "Export verified attendance records showing exact check-in times to issue continuing education credits."
    },
    {
      icon: Lock,
      "title": "Anti-Duplication Protection",
      "desc": "Prevent shared pass credentials. Tickets cannot be reused once validated at the door."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "Retain 100% of seminar registration fees with transparent flat monthly plans."
    },
    {
      icon: ShieldCheck,
      "title": "Full Privacy Compliance",
      "desc": "Attendee data is stored securely in compliant infrastructure with zero data monetization."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use Seminar Registration Software?",
    "subtitle": "From professional legal institutes to medical faculties.",
    "personas": [
      {
        "badge": "LEGAL & FINANCE",
        "title": "Legal & Financial Associations",
        "desc": "CPD-accredited legal briefings, tax seminars, and regulatory compliance updates."
      },
      {
        "badge": "HEALTHCARE",
        "title": "Medical & Clinical Faculties",
        "desc": "Grand rounds, clinical research seminars, and CME medical lectures."
      },
      {
        "badge": "ACADEMIC",
        "title": "University Departments",
        "desc": "Distinguished visiting professor lectures, academic colloquiums, and research presentations."
      },
      {
        "badge": "CORPORATE",
        "title": "Industry Think Tanks & Institutes",
        "desc": "Executive policy briefings, economic outlook seminars, and leadership roundtables."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Seminar QR Check-In Works",
    "subtitle": "Flawless audit-ready verification at the lecture hall door.",
    "description": "Delegates display their mobile QR pass upon arriving at the lecture hall. Door staff scan the code in under 0.3 seconds using a phone or tablet. The system validates their registration, produces a soft confirmation chime, and timestamps their arrival in the central cloud database for post-seminar accreditation.",
    "points": [
      "Instant verification prevents unregistered attendees from taking reserved seats.",
      "Accurate check-in timestamps provide verifiable proof of CPD attendance.",
      "Offline engine continues validating passes if lecture hall Wi-Fi drops.",
      "Manual search bar allows immediate lookup by delegate name or license number."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Pen-and-Paper Seminar Sign-Ins",
    "subtitle": "How URPASS modernizes professional seminar attendance.",
    "headers": [
      "Seminar Stage",
      "Paper Sign-In Binder",
      "URPASS Digital Workflow"
    ],
    "rows": [
      {
        "col1": "Entrance Speed",
        "col2": "Delegates queuing to scribble signatures on a binder",
        "col3": "<0.3s camera scan on door volunteer's phone"
      },
      {
        "col1": "Attendance Legibility",
        "col2": "Illegible handwriting causing lost CPD accreditation",
        "col3": "Digital verified check-in records matched to license ID"
      },
      {
        "col1": "Audit Verification",
        "col2": "Paper binder vulnerable to loss, damage, or proxy sign-ins",
        "col3": "Tamper-proof digital timestamp log in CSV/PDF"
      },
      {
        "col1": "Room Capacity",
        "col2": "Risk of room overcrowding violating fire safety codes",
        "col3": "Real-time headcount tracking against theatre capacity"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is seminar registration software?",
      "a": "It is an event registration and attendance tracking platform built for seminars, guest lectures, and CPD sessions to manage signups, issue passes, and record entrance timestamps."
    },
    {
      "q": "Can URPASS track attendance for CPD certification?",
      "a": "Yes. URPASS captures exact check-in timestamps, allowing organizers to export verifiable attendance records for continuing professional development (CPD) credits."
    },
    {
      "q": "Can we collect professional license numbers during registration?",
      "a": "Yes. Custom registration fields allow you to collect bar numbers, medical license IDs, or institutional affiliations."
    },
    {
      "q": "Does URPASS charge ticketing commissions on seminar tickets?",
      "a": "No. URPASS charges 0% commission on ticket sales, allowing institutes to keep 100% of registration fees."
    },
    {
      "q": "Do delegates need to print out their seminar tickets?",
      "a": "No. Delegates simply present their mobile QR pass on their smartphone screen for sub-second scanning."
    },
    {
      "q": "Can we issue Continuing Professional Development (CPD) or attendance certificates after the seminar?",
      "a": "Yes. URPASS records exact entry timestamps for every attendee, allowing you to filter verified attendees and export verified attendance lists for CPD certificate distribution."
    },
    {
      "q": "Can we collect attendee job titles and organization names at registration?",
      "a": "Yes. The registration form builder lets you add mandatory fields for organization name, job title, and professional accreditation numbers."
    }
  ],
  "relatedLinks": [
    {
      "title": "Workshop Registration & Digital Ticketing Software",
      "href": "/workshop-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Training Registration & Attendance Tracking",
      "href": "/training-event-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Real-Time Event Attendance Tracking Software",
      "href": "/event-attendance-tracking-software",
      "category": "Product"
    },
    {
      "title": "Zero-Commission Event Ticketing Platform",
      "href": "/zero-commission-event-ticketing",
      "category": "Product"
    }
  ]
}}
    />
  );
}
