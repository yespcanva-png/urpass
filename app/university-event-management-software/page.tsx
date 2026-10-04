import type { Metadata } from "next";
import { Banknote, Building2, Lock, ScanLine, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Event Registration & QR Check-In Software | URPASS",
  description: "Campus-wide university event registration software for student unions, collegiate societies, fests, and academic symposiums. Student ID verification and 0% ticket fees.",
  keywords: ["university event management software", "campus event registration platform", "student union ticketing software", "college fest check-in software", "academic conference management software", "university qr check-in app"],
  alternates: {
    canonical: "https://urpass.space/university-event-management-software",
  },
  openGraph: {
    title: "University Event Registration & QR Check-In Software | URPASS",
    description: "Campus-wide university event registration software for student unions, collegiate societies, fests, and academic symposiums. Student ID verification and 0% ticket fees.",
    url: "https://urpass.space/university-event-management-software",
    locale: "en_US",
    type: "website",
  },
};

export default function UniversityEventManagementSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "HIGHER ED & CAMPUS SUITE",
  "h1": "University Event Registration & QR Check-In Software",
  "canonicalUrl": "https://urpass.space/university-event-management-software",
  "description": "Campus-wide university event registration software for student unions, collegiate societies, fests, and academic symposiums. Student ID verification and 0% ticket fees.",
  "ctaLabel": "Start Free for Universities →",
  "ctaTitle": "Power Fast Campus Event Registration & Gate Control",
  "ctaDescription": "Empower student unions, academic departments, and collegiate societies to run fests, formals, and symposiums with sub-second QR check-in.",
  "directAnswer": {
    "title": "What is University Event Management Software?",
    "summary": "URPASS is university event management and QR check-in software that simplifies campus-wide event registration, student union ticketing, collegiate formals, and academic symposiums. It enables organizers to collect Student IDs, issue mobile QR passes, and admit thousands of students using volunteer smartphones with zero app downloads and zero ticket commission.",
    "keyPoints": [
      "Mandatory Student ID, department, and society membership capture during registration",
      "Sub-second (<0.3s) camera check-in on student volunteer phones with zero hardware costs",
      "0% platform commission on paid tickets, saving student clubs significant budget",
      "Multi-gate synchronization to eliminate long queues outside campus auditoriums"
    ]
  },
  "whatIs": {
    "title": "What is University Event Management Software?",
    "definition": "University event management software is a centralized digital platform tailored for higher education institutions, student unions, and campus societies. It automates ticket distribution, student verification, digital badge delivery, and entrance security across campus venues.",
    "details": [
      "Handles campus fests, academic symposiums, society formals, freshers' fairs, and convocation entries",
      "Eliminates paper ticket collection and slow manual pen-and-paper list checking",
      "Runs on student volunteers' existing phones without requiring rented scanning equipment",
      "Prevents gate crashers and duplicate pass sharing with real-time atomic QR validation"
    ]
  },
  "howItWorksTitle": "How URPASS Works on Campus",
  "howItWorksSubtitle": "From committee setup to student entrance scanning.",
  "steps": [
    {
      "n": "01",
      "title": "Create campus event",
      "desc": "Configure event date, venue, ticket tiers, and mandatory Student ID fields."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Send the link through university WhatsApp groups, society portals, or Instagram."
    },
    {
      "n": "03",
      "title": "Students register",
      "desc": "Students sign up instantly in their mobile browser without downloading native apps."
    },
    {
      "n": "04",
      "title": "Issue digital passes",
      "desc": "Personalized digital QR passes are delivered instantly to student email addresses."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Committee volunteers scan passes with their phone cameras in under 0.3 seconds."
    },
    {
      "n": "06",
      "title": "Monitor live capacity",
      "desc": "Track real-time hall capacity and student arrival curves on the organizer dashboard."
    }
  ],
  "featuresTitle": "Campus Capabilities Engineered for Student Committees",
  "featuresSubtitle": "Zero commission, Student ID verification, and volunteer phone scanning.",
  "features": [
    {
      icon: Building2,
      "title": "Student ID & Department Fields",
      "desc": "Collect mandatory roll numbers, Student IDs, degree programs, and dietary preferences at checkout."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Volunteer Scanning",
      "desc": "Any student committee member can scan tickets immediately using their own mobile Safari or Chrome browser."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "Student societies keep 100% of event revenue. Avoid losing hundreds of pounds/rupees to legacy ticketing fees."
    },
    {
      icon: Lock,
      "title": "Anti-Gatecrashing Protection",
      "desc": "Prevents screenshot pass sharing. When a pass is scanned at Gate 1, it cannot be reused at Gate 2."
    },
    {
      icon: Zap,
      "title": "Campus Offline Mode",
      "desc": "Auditoriums and basement venues with weak Wi-Fi remain fully operational with offline memory caching."
    },
    {
      icon: Users,
      "title": "Multi-Committee Permissions",
      "desc": "Allow different society committees and door staff to scan without sharing master administrative credentials."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses URPASS in Higher Education?",
    "subtitle": "Built for student councils, academic departments, and campus clubs.",
    "personas": [
      {
        "badge": "STUDENTS' UNION",
        "title": "Student Union Societies & Clubs",
        "desc": "Cultural societies, sports clubs, debate unions, and musical societies hosting regular ticketed nights."
      },
      {
        "badge": "CAMPUS FESTS",
        "title": "Annual College Fests & Balls",
        "desc": "Multi-thousand attendee campus cultural festivals, spring formals, and freshers' week parties."
      },
      {
        "badge": "FACULTY",
        "title": "Academic Departments & Conferences",
        "desc": "Research symposiums, visiting guest lectures, departmental seminars, and career fairs."
      },
      {
        "badge": "ADMINISTRATION",
        "title": "Convocation & Graduation Ceremonies",
        "desc": "Auditorium seat access and guest ticketing for graduation and awards ceremonies."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Campus QR Check-In Works",
    "subtitle": "No hardware rentals, zero attendee app downloads.",
    "description": "Student volunteers open a secure web link on their own smartphones. No app installation or logins required. The camera detects the attendee's QR pass from 30cm away in under 0.3s, validates the ticket in memory, chimes green with the student's name, and records the gate arrival. If mobile reception drops inside thick campus walls, local browser caching ensures entry never stops.",
    "points": [
      "Zero equipment rentals: volunteers use their personal smartphones.",
      "Atomic duplicate protection blocks forwarded or screenshot tickets immediately.",
      "Offline engine verifies passes without active 4G/5G or Wi-Fi.",
      "Fast manual search option for dead-phone situations."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Traditional Campus Ticketing",
    "subtitle": "How URPASS transforms student event gate management.",
    "headers": [
      "Campus Operation",
      "Paper Tickets / Google Forms",
      "Connected URPASS Platform"
    ],
    "rows": [
      {
        "col1": "Entrance Speed",
        "col2": "Slow pen-and-paper list ticking taking 5+ seconds",
        "col3": "<0.3s camera scan on volunteer smartphones"
      },
      {
        "col1": "Ticket Fraud",
        "col2": "Students share screenshots or duplicate paper stubs",
        "col3": "Atomic locking detects and rejects duplicate passes"
      },
      {
        "col1": "Hardware Demands",
        "col2": "Laptops on tables with extension cables",
        "col3": "Any student phone browser with zero cables"
      },
      {
        "col1": "Platform Fees",
        "col2": "Legacy ticketing cuts 5% to 8% of society revenue",
        "col3": "0% commission; clubs keep 100% of ticket sales"
      },
      {
        "col1": "Attendance Records",
        "col2": "Lost clipboards with illegible handwritten marks",
        "col3": "Instant digital CSV export with exact check-in times"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is university event management software?",
      "a": "It is an event registration and digital check-in platform designed for universities, student unions, and campus societies to manage events, issue QR passes, and check attendees in at the door."
    },
    {
      "q": "Can student societies use URPASS for free events?",
      "a": "Yes. Free campus events, guest lectures, and student meetups can use URPASS completely free with full QR generation and check-in scanning."
    },
    {
      "q": "Can we mandate Student ID numbers during registration?",
      "a": "Yes. Custom registration fields allow you to require Student IDs, department names, roll numbers, and society membership numbers."
    },
    {
      "q": "How many student volunteers can scan at the entrance?",
      "a": "Unlimited student volunteers can scan simultaneously across multiple doors. Scans sync in real time to prevent duplicate entry attempts."
    },
    {
      "q": "Does URPASS charge ticketing commissions on student society tickets?",
      "a": "No. URPASS charges 0% commission on ticket sales, allowing student unions and clubs to retain 100% of their ticket funds."
    },
    {
      "q": "Can URPASS scan passes in auditoriums without Wi-Fi?",
      "a": "Yes. URPASS includes an offline scanning engine that pre-loads student records, continuing validation smoothly even in basement auditoriums."
    }
  ],
  "relatedLinks": [
    {
      "title": "Hackathon Registration & QR Check-In Software",
      "href": "/hackathon-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Workshop Registration & Digital Ticketing Software",
      "href": "/workshop-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Alumni Event Registration & Digital QR Passes",
      "href": "/alumni-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    },
    {
      "title": "Free Event Ticketing & QR Check-In Software",
      "href": "/free-event-ticketing-software",
      "category": "Product"
    }
  ]
}}
    />
  );
}
