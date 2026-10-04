import type { Metadata } from "next";
import { Banknote, BarChart3, FileText, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Workshop Registration & Digital Ticketing Software | URPASS",
  description: "Workshop registration software with capped capacity, custom intake forms, instant digital QR tickets, and sub-second phone check-in. 0% ticket fees.",
  keywords: ["workshop registration software", "workshop ticketing platform", "masterclass registration software", "training workshop check-in", "workshop attendee management", "capacity capped event registration"],
  alternates: {
    canonical: "https://urpass.space/workshop-registration-software",
  },
  openGraph: {
    title: "Workshop Registration & Digital Ticketing Software | URPASS",
    description: "Workshop registration software with capped capacity, custom intake forms, instant digital QR tickets, and sub-second phone check-in. 0% ticket fees.",
    url: "https://urpass.space/workshop-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function WorkshopRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "MASTERCLASSES & WORKSHOPS",
  "h1": "Workshop Registration & Digital Ticketing Software",
  "canonicalUrl": "https://urpass.space/workshop-registration-software",
  "description": "Workshop registration software with capped capacity, custom intake forms, instant digital QR tickets, and sub-second phone check-in. 0% ticket fees.",
  "ctaLabel": "Create Your Workshop Free →",
  "ctaTitle": "Host Smooth, Full-Capacity Workshops",
  "ctaDescription": "Set capacity caps, collect material fees with 0% ticketing commission, and admit participants in <0.3s with smartphone check-in.",
  "directAnswer": {
    "title": "What is Workshop Registration Software?",
    "summary": "URPASS is workshop registration and digital ticketing software built for masterclasses, hands-on training sessions, creative studios, and professional certifications. It allows instructors to cap seat capacities, accept registration payments with 0% ticketing fees, issue scannable QR tickets, and check participants in seamlessly using volunteer smartphones.",
    "keyPoints": [
      "Strict seat capacity limits preventing overbooking of studio or lab spaces",
      "Instant digital QR passes delivered immediately upon registration or payment",
      "Sub-second (<0.3s) camera check-in on instructor or assistant smartphones",
      "0% platform commission on paid workshop tickets with transparent plans"
    ]
  },
  "whatIs": {
    "title": "What is Workshop Registration Software?",
    "definition": "Workshop registration software is a booking and attendance management platform tailored for interactive, capped-capacity educational sessions. It manages seat reservations, participant intake questionnaires, payment collection, digital credential delivery, and door validation.",
    "details": [
      "Prevents room over-crowding in hands-on workshops with automatic waitlists and capacity caps",
      "Collects participant experience levels, software prerequisites, and equipment needs",
      "Replaces printed participant rosters with instant smartphone camera validation",
      "Provides verified arrival data to issue accredited course completion certificates"
    ]
  },
  "howItWorksTitle": "How URPASS Works for Workshops",
  "howItWorksSubtitle": "From seat reservation to hands-on classroom check-in.",
  "steps": [
    {
      "n": "01",
      "title": "Configure workshop",
      "desc": "Set date, venue, seat capacity limit, ticket pricing, and intake questions."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Post your clean event link on your website, newsletter, or social channels."
    },
    {
      "n": "03",
      "title": "Participants register & pay",
      "desc": "Attendees reserve their seat with zero ticketing commission fees deducted."
    },
    {
      "n": "04",
      "title": "Issue digital workshop passes",
      "desc": "Participants receive a digital QR pass with venue instructions and prep materials."
    },
    {
      "n": "05",
      "title": "Scan at the door",
      "desc": "Instructor or assistant scans passes in <0.3s with a phone camera."
    },
    {
      "n": "06",
      "title": "Issue completion certificates",
      "desc": "Export verified attendance records to issue completion certificates."
    }
  ],
  "featuresTitle": "Features for High-Impact Workshop Hosts",
  "featuresSubtitle": "Capacity caps, prerequisite collection, and sub-second phone scanning.",
  "features": [
    {
      icon: Users,
      "title": "Strict Seat Capacity Capping",
      "desc": "Prevent overbooking of limited workshop rooms, labs, or kitchen stations with automatic cutoff limits."
    },
    {
      icon: FileText,
      "title": "Prerequisite & Intake Questions",
      "desc": "Ask participants about their experience level, laptop specifications, or dietary needs during booking."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Door Scanning",
      "desc": "Check attendees in smoothly from your own phone so you can start teaching on time without roll calls."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "Retain 100% of your course fees. Avoid losing 5% to 10% of revenue on high-value professional masterclasses."
    },
    {
      icon: BarChart3,
      "title": "Attendance & No-Show Tracking",
      "desc": "Track exact participant arrival times and no-show rates to plan future workshop sessions effectively."
    },
    {
      icon: ShieldCheck,
      "title": "Secure Attendee Data",
      "desc": "Participant information is stored securely without third-party advertising brokers or public listings."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use Workshop Registration Software?",
    "subtitle": "From corporate trainers to creative craft studio instructors.",
    "personas": [
      {
        "badge": "PROFESSIONAL",
        "title": "Professional & Corporate Trainers",
        "desc": "Agile coaching, leadership bootcamps, and technical certification masterclasses."
      },
      {
        "badge": "CREATIVE",
        "title": "Design & Photography Studios",
        "desc": "Hands-on darkroom sessions, UI/UX design workshops, and ceramic studio classes."
      },
      {
        "badge": "TECH",
        "title": "Coding & Data Bootcamps",
        "desc": "Weekend Python, AI prompt engineering, and web development hands-on workshops."
      },
      {
        "badge": "WELLNESS",
        "title": "Culinary & Wellness Masterclasses",
        "desc": "Cooking academies, yoga intensives, and wellness retreats with limited equipment stations."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Workshop QR Check-In Works",
    "subtitle": "Instant verification so class starts on time.",
    "description": "Participants arrive with their digital QR pass on their phone screen. The instructor or assistant opens the URPASS web scanner URL on their smartphone. Pointing the camera at the pass validates the attendee in under 0.3 seconds with an audible green chime, confirming their name and reserved seat without needing a paper roster.",
    "points": [
      "Zero equipment costs: runs directly on instructor or assistant phones.",
      "Instant confirmation prevents unregistered drop-ins from taking reserved seats.",
      "Offline capability ensures scanning continues even in secluded studio venues.",
      "Quick search bar allows manual check-in if a participant's battery dies."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Manual Workshop Attendance",
    "subtitle": "How URPASS streamlines classroom check-in.",
    "headers": [
      "Workshop Stage",
      "Paper Attendance Sheets",
      "URPASS Digital Workflow"
    ],
    "rows": [
      {
        "col1": "Seat Allocation",
        "col2": "Risk of overbooking beyond classroom desk capacity",
        "col3": "Automated capacity capping halts sales when full"
      },
      {
        "col1": "Class Start Delay",
        "col2": "10 to 15 minutes calling names on paper rosters",
        "col3": "Instant <0.3s camera scan as participants enter"
      },
      {
        "col1": "Ticket Fees",
        "col2": "Legacy ticketing platforms take 5% to 9% cuts",
        "col3": "0% commission; flat transparent subscription"
      },
      {
        "col1": "Prerequisite Collection",
        "col2": "Messy back-and-forth emails before the workshop",
        "col3": "Custom questions captured directly during booking"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is workshop registration software?",
      "a": "It is an event registration and ticketing system designed for workshops, masterclasses, and seminars to manage seat capacities, participant intake, and door check-in."
    },
    {
      "q": "Can I set a maximum capacity limit for my workshop?",
      "a": "Yes. You can specify exact capacity limits. Once sold out, registration automatically closes to prevent room overcrowding."
    },
    {
      "q": "Does URPASS charge per-ticket fees on paid workshop tickets?",
      "a": "No. URPASS charges 0% commission on ticket sales. You keep 100% of your course fees."
    },
    {
      "q": "Can I ask participants questions during registration?",
      "a": "Yes. Custom intake fields allow you to ask for experience levels, laptop operating systems, dietary needs, or expectations."
    },
    {
      "q": "Do I need special hardware to check participants in?",
      "a": "No. You or your assistant can scan attendee QR passes directly using any smartphone browser (Safari or Chrome)."
    },
    {
      "q": "Can I cap workshop capacity to prevent overbooking?",
      "a": "Yes. You can set hard ticket limits per session. Once the quota is reached, registration automatically closes or moves attendees to a waitlist."
    },
    {
      "q": "Can attendees add workshop tickets to their Apple or Google Wallet?",
      "a": "Yes. Digital pass links can be saved directly on mobile browsers or added to digital wallets for instant offline retrieval at the classroom door."
    }
  ],
  "relatedLinks": [
    {
      "title": "Seminar Registration & Attendee Check-In Software",
      "href": "/seminar-registration-software",
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
      "title": "Event Registration Form Builder with QR Passes",
      "href": "/event-registration-form-builder",
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
