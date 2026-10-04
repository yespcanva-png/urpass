import type { Metadata } from "next";
import { Banknote, BarChart3, Building2, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Alumni Event Registration & Digital QR Passes | URPASS",
  description: "Alumni event registration software for class reunions, university homecomings, and gala dinners. Graduation year intake, digital QR passes, and fast check-in.",
  keywords: ["alumni event registration", "class reunion registration software", "alumni homecoming check-in", "university alumni ticketing", "alumni gala dinner registration", "alumni guest pass generator"],
  alternates: {
    canonical: "https://urpass.space/alumni-event-registration",
  },
  openGraph: {
    title: "Alumni Event Registration & Digital QR Passes | URPASS",
    description: "Alumni event registration software for class reunions, university homecomings, and gala dinners. Graduation year intake, digital QR passes, and fast check-in.",
    url: "https://urpass.space/alumni-event-registration",
    locale: "en_US",
    type: "website",
  },
};

export default function AlumniEventRegistrationPage() {
  return (
    <SEOPage
      config={{
  "badge": "ALUMNI & REUNIONS",
  "h1": "Alumni Event Registration & Digital QR Passes",
  "canonicalUrl": "https://urpass.space/alumni-event-registration",
  "description": "Alumni event registration software for class reunions, university homecomings, and gala dinners. Graduation year intake, digital QR passes, and fast check-in.",
  "ctaLabel": "Create Alumni Event Free →",
  "ctaTitle": "Welcome Alumni Home with Seamless Check-In",
  "ctaDescription": "Capture graduation years and partner tickets, issue branded digital passes, and welcome returning alumni warmly without paper check-in delays.",
  "directAnswer": {
    "title": "What is Alumni Event Registration Software?",
    "summary": "URPASS is alumni event registration and check-in software built for university alumni associations, collegiate homecomings, class reunions, and donor galas. It captures graduation years, degree faculties, and guest tickets, delivers branded mobile QR credentials, and enables warm, sub-second arrival greetings using volunteer smartphones.",
    "keyPoints": [
      "Custom alumni intake: graduation year, degree faculty, student house, and dietary needs",
      "Partner and family guest tickets managed seamlessly under one primary registration",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
      "0% platform commission on paid gala dinner and reunion tickets"
    ]
  },
  "whatIs": {
    "title": "What is Alumni Event Registration Software?",
    "definition": "Alumni event registration software is a digital event platform designed for universities, schools, and institutional advancement teams. It manages class reunion bookings, homecoming celebrations, donor dinners, and campus access for returning graduates.",
    "details": [
      "Captures alumni records including matriculation year, degree, and career updates",
      "Replaces paper check-in clipboards with sleek, mobile-friendly digital QR credentials",
      "Enables advancement staff to know when prominent alumni and major donors arrive on campus",
      "Maintains campus security by ensuring only registered alumni and guests enter campus venues"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Alumni Reunions",
  "howItWorksSubtitle": "From reunion invitation to campus welcome.",
  "steps": [
    {
      "n": "01",
      "title": "Configure reunion event",
      "desc": "Set reunion milestone years, gala dinner pricing, and custom alumni questions."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Distribute your branded event page via alumni newsletters, email, and social groups."
    },
    {
      "n": "03",
      "title": "Alumni register online",
      "desc": "Graduates book tickets for themselves and their partners in seconds."
    },
    {
      "n": "04",
      "title": "Deliver digital alumni passes",
      "desc": "Attendees receive mobile QR passes featuring their name, graduation year, and degree."
    },
    {
      "n": "05",
      "title": "Scan at campus reception",
      "desc": "Student ambassadors scan passes in <0.3s with smartphone cameras."
    },
    {
      "n": "06",
      "title": "Live alumni engagement",
      "desc": "Advancement teams monitor arrival records and donor engagement live from the dashboard."
    }
  ],
  "featuresTitle": "Features for Institutional Advancement Teams",
  "featuresSubtitle": "Graduation year capture, guest ticketing, and sub-second phone scanning.",
  "features": [
    {
      icon: Building2,
      "title": "Graduation Year & Faculty Capture",
      "desc": "Collect matriculation years, degree programs, student house affiliations, and professional updates."
    },
    {
      icon: Users,
      "title": "Partner & Family Ticketing",
      "desc": "Allow alumni to reserve tickets for spouses and guests under a single booking with individual passes."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Arrival Greeting",
      "desc": "Admit alumni warmly in under 0.3 seconds. Eliminate awkward waiting lines outside dining halls."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "Keep 100% of reunion gala ticket funds. No per-ticket cuts taking money from alumni endowments."
    },
    {
      icon: ShieldCheck,
      "title": "Strict Data Privacy",
      "desc": "Alumni contact details are stored securely without third-party marketing brokers or public exposure."
    },
    {
      icon: BarChart3,
      "title": "Real-Time Engagement Tracking",
      "desc": "Track attendance rates by graduating class year to measure long-term institutional engagement."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Alumni Event Registration Software?",
    "subtitle": "From higher education advancement offices to independent schools.",
    "personas": [
      {
        "badge": "UNIVERSITY",
        "title": "University Advancement Offices",
        "desc": "Central alumni relations teams managing annual homecoming weekends and donor galas."
      },
      {
        "badge": "COLLEGES",
        "title": "Collegiate & Departmental Clubs",
        "desc": "College formal reunions, law school anniversaries, and medical faculty reunions."
      },
      {
        "badge": "SCHOOLS",
        "title": "Independent & High School Alumni",
        "desc": "Class of 10-year, 25-year, and 50-year reunions and school foundation dinners."
      },
      {
        "badge": "STUDENTS",
        "title": "Student Alumni Ambassadors",
        "desc": "Student-run welcoming committees greeting returning graduates at campus gates."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Alumni QR Check-In Works",
    "subtitle": "Fast, warm, and professional arrival verification.",
    "description": "Returning alumni present their mobile QR pass on their phone screen. Student ambassadors or advancement staff open the scanner URL in Safari or Chrome on their smartphones. Pointing the camera at the pass validates the alumnus in under 0.3 seconds, displaying their name and graduation year (e.g. 'Class of 2004 - Engineering'), allowing staff to welcome them back personally.",
    "points": [
      "Zero equipment rentals: runs smoothly on student ambassadors' mobile phones.",
      "Instant verification displays alumnus name, degree, and graduation year.",
      "Offline resilience ensures check-in continues smoothly in historic stone dining halls.",
      "Quick search bar enables rapid manual lookup if an alumnus forgets their phone."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Manual Reunion Check-In",
    "subtitle": "How URPASS elevates the alumni homecoming experience.",
    "headers": [
      "Reunion Operation",
      "Paper Check-In Clipboards",
      "Connected URPASS Platform"
    ],
    "rows": [
      {
        "col1": "Welcome Desk Speed",
        "col2": "15 to 30 second delay searching alphabetized binders",
        "col3": "<0.3s camera scan on student volunteer's phone"
      },
      {
        "col1": "Alumni Data Capture",
        "col2": "Illegible handwritten contact and job updates",
        "col3": "Clean digital intake during online registration"
      },
      {
        "col1": "Ticketing Fees",
        "col2": "Legacy ticketing platforms take 5% to 8% of gala funds",
        "col3": "0% commission; keep 100% of alumni dinner revenue"
      },
      {
        "col1": "Advancement Tracking",
        "col2": "Weeks spent manually typing paper check-in sheets",
        "col3": "Instant digital CSV export with exact arrival times"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is alumni event registration software?",
      "a": "It is an event registration platform designed for universities, colleges, and schools to manage class reunions, homecoming events, alumni passes, and entrance check-in."
    },
    {
      "q": "Can alumni purchase tickets for their partners and family?",
      "a": "Yes. Alumni can purchase multiple tickets under one registration, and each guest receives their own unique digital QR entry pass."
    },
    {
      "q": "Can we collect graduation years and degree information?",
      "a": "Yes. Custom registration fields allow you to collect graduation years, degree faculties, student houses, and current employer details."
    },
    {
      "q": "Does URPASS charge per-ticket fees on reunion dinners?",
      "a": "No. URPASS charges 0% commission on ticket sales, ensuring your alumni association retains all event proceeds."
    },
    {
      "q": "Can student ambassadors scan passes without seeing sensitive donor data?",
      "a": "Yes. The scanner interface only displays attendee verification status and name, keeping sensitive financial and contact data secure."
    },
    {
      "q": "Can we capture graduation year and department during alumni registration?",
      "a": "Yes. Custom form fields can be configured to collect graduation year, degree program, current employer, and reunion table seating preferences."
    },
    {
      "q": "Can alumni pay for dinner tickets or partner passes during registration?",
      "a": "Yes. Paid ticket tiers allow alumni to purchase single admission, couple passes, or sponsor packages with direct online payment processing."
    }
  ],
  "relatedLinks": [
    {
      "title": "University Event Registration & QR Check-In Software",
      "href": "/university-event-management-software",
      "category": "Use Case"
    },
    {
      "title": "Corporate Event Registration & Attendee Check-In",
      "href": "/corporate-event-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Networking Event Registration Software",
      "href": "/networking-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Digital Event Pass Generator with QR Codes",
      "href": "/digital-event-pass-generator",
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
