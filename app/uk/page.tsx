import type { Metadata } from "next";
import { FileText, Lock, QrCode, ScanLine, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software UK | URPASS",
  description: "Online event registration, digital QR passes, and sub-second smartphone check-in for UK conferences, universities, and festivals. Flat GBP pricing and UK GDPR compliant.",
  keywords: ["event registration software UK", "event check-in software UK", "QR check-in software UK", "event ticketing software UK", "UK event registration platform", "QR ticketing system UK", "event attendance tracking software UK", "zero commission event ticketing UK"],
  alternates: {
    canonical: "https://urpass.space/uk",
  },
  openGraph: {
    title: "Event Registration & QR Check-In Software UK | URPASS",
    description: "Online event registration, digital QR passes, and sub-second smartphone check-in for UK conferences, universities, and festivals. Flat GBP pricing and UK GDPR compliant.",
    url: "https://urpass.space/uk",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.4360",
  },
};

export default function UkPage() {
  return (
    <SEOPage
      config={{
  "badge": "UK EVENT PLATFORM · FAST QR ENTRY",
  "h1": "Event Registration & QR Check-In Software UK",
  "canonicalUrl": "https://urpass.space/uk",
  "description": "Online event registration, digital QR passes, and sub-second smartphone check-in for UK conferences, universities, and festivals. Flat GBP pricing and UK GDPR compliant.",
  "ctaLabel": "Create Your UK Event Free →",
  "ctaTitle": "Run Your Next UK Event With URPASS",
  "ctaDescription": "Set up registration in 3 minutes. Issue mobile QR tickets. Scan attendees in under 0.3s on any phone. Transparent GBP pricing with 0% ticketing commission.",
  "directAnswer": {
    "title": "What is URPASS UK Event Registration & QR Check-In Software?",
    "summary": "URPASS is an event registration and QR check-in platform that lets UK organisers create custom registration pages, issue digital QR passes, manage attendees, and scan tickets at event entrances using standard phones. It supports free and paid events with 0% ticketing commission and provides real-time attendance tracking from the organiser dashboard.",
    "keyPoints": [
      "Custom online registration forms with instant attendee pass generation",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
      "Built for UK GDPR and Data Protection Act 2018 compliance",
      "Zero commission on paid tickets with transparent flat GBP subscription tiers"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software in the UK?",
    "definition": "Event registration software in the UK is a digital system that automates attendee signups, collects delegate details, processes payments in British Pounds (GBP), issues digital entry credentials, and tracks entrance attendance. Modern platforms replace paper spreadsheets and expensive hardware turnstiles with mobile QR code scanning on volunteers' existing smartphones.",
    "details": [
      "Eliminates paper lists, manual check-in tallying, and long foyer queues",
      "Delivers unique encrypted QR passes instantly via email, link, or digital wallet",
      "Protects attendee personal data under UK GDPR with strict access controls",
      "Provides live arrival analytics to monitor venue capacity and fire safety limits"
    ]
  },
  "howItWorksTitle": "How URPASS Works for UK Events",
  "howItWorksSubtitle": "From registration form setup to entrance gate check-in in six simple steps.",
  "steps": [
    {
      "n": "01",
      "title": "Create your event",
      "desc": "Configure event date, venue, custom registration fields, and ticket tiers in GBP."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Send your clean event URL via email, student union portals, or social media."
    },
    {
      "n": "03",
      "title": "Attendees register & pay",
      "desc": "Delegates register in seconds without forced account creation or spam popups."
    },
    {
      "n": "04",
      "title": "Issue digital QR passes",
      "desc": "Unique scannable mobile QR passes are delivered instantly to attendees."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Door staff scan passes with any smartphone camera in <0.3s for green entry."
    },
    {
      "n": "06",
      "title": "Track live attendance",
      "desc": "Monitor gate throughput, peak arrival velocity, and no-shows in real time."
    }
  ],
  "featuresTitle": "UK Event Management & Gate Control Features",
  "featuresSubtitle": "Everything UK conference directors, university committees, and event teams need.",
  "features": [
    {
      icon: FileText,
      "title": "Custom Registration Forms",
      "desc": "Collect dietary requirements, company details, Student IDs, and accessibility needs with clean custom fields."
    },
    {
      icon: QrCode,
      "title": "Instant Digital QR Passes",
      "desc": "Mobile-optimized passes sent straight to attendees' smartphones. No printer required, reducing event waste."
    },
    {
      icon: ScanLine,
      "title": "Sub-Second Smartphone Scanning",
      "desc": "Validate QR codes in under 0.3 seconds using iOS Safari or Android Chrome. Zero app store downloads needed."
    },
    {
      icon: Lock,
      "title": "Atomic Duplicate Protection",
      "desc": "Instantly flags screenshotted, forwarded, or reused passes across multiple entrances with audio and visual warnings."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Resilience",
      "desc": "Maintains check-in speeds in historic UK stone buildings and basement venues even if Wi-Fi or mobile network drops."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA Compliance",
      "desc": "Attendee data is stored securely in compliant infrastructure with role-based access and zero third-party data broker ads."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in the UK?",
    "subtitle": "Designed for professional organisers and student committees who value speed and reliability.",
    "personas": [
      {
        "badge": "HIGHER ED",
        "title": "Universities & Student Unions",
        "desc": "Manage freshers' fairs, society balls, academic guest lectures, and departmental symposiums with student ID capture."
      },
      {
        "badge": "B2B CONFERENCES",
        "title": "Conference & Summit Directors",
        "desc": "Run smooth multi-track check-ins at ExCeL, Olympia, or regional venues with synchronized multi-gate scanning."
      },
      {
        "badge": "TRAINING & CPD",
        "title": "Workshop Leaders & Masterclasses",
        "desc": "Capped-capacity seminars with simple delegate confirmation, check-in timestamps, and CPD attendance records."
      },
      {
        "badge": "COMMUNITY",
        "title": "Meetups & Tech Communities",
        "desc": "Free event registration without ticketing commissions or attendee paywalls. Keep 100% of event sponsorships."
      },
      {
        "badge": "CULTURAL",
        "title": "Festivals & Exhibitions",
        "desc": "Fast gate entry across large grounds with volunteer phone scanning, eliminating expensive laser hardware rentals."
      },
      {
        "badge": "CORPORATE",
        "title": "Internal Enterprise Comms",
        "desc": "Employee town halls, shareholder AGMs, and client showcases with branded passes and audit-ready arrival reports."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How QR Event Check-In Works",
    "subtitle": "Hardware-free camera verification in under 0.3 seconds.",
    "description": "Each attendee pass contains an encrypted cryptographic token embedded inside a 2D QR code. At the venue entrance, volunteer staff open the URPASS scanner URL in mobile Safari or Chrome. The device camera decodes the pass, validates it against the secure event registry in under 0.3s, displays attendee credentials with an audible confirmation tone, and atomically locks the ticket against duplicate reuse.",
    "points": [
      "Zero app store downloads: volunteers simply open a secure web scanner URL.",
      "Real-time database sync updates the central dashboard within 100ms.",
      "Offline cache pre-loads the attendee manifest to guarantee uninterrupted scanning during signal drops.",
      "Instant visual indicators: high-contrast green for valid, vibrant red for duplicate or invalid passes."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Fragmented UK Event Workflows",
    "subtitle": "How URPASS replaces spreadsheets, paper printouts, and high-fee legacy ticketing.",
    "headers": [
      "Operational Stage",
      "Traditional UK Event Workflow",
      "Connected URPASS Workflow"
    ],
    "rows": [
      {
        "col1": "Ticketing Commission",
        "col2": "Up to 6.95% + £0.59 per ticket on Eventbrite",
        "col3": "0% commission with flat monthly subscriptions"
      },
      {
        "col1": "Entrance Check-In Speed",
        "col2": "3 to 5 seconds per guest searching paper sheets",
        "col3": "<0.3 seconds via smartphone camera scan"
      },
      {
        "col1": "Scanner Hardware",
        "col2": "Rented handheld laser scanners (£50–£120/day)",
        "col3": "Any volunteer phone browser with zero hardware costs"
      },
      {
        "col1": "Duplicate Pass Detection",
        "col2": "Zero detection; forwarded PDFs get admitted twice",
        "col3": "Atomic locking immediately flags duplicate scans"
      },
      {
        "col1": "Underground Venue Signal",
        "col2": "App freezes and crashes when mobile 4G/5G drops",
        "col3": "Automatic offline cache continues validating passes"
      },
      {
        "col1": "Attendance Reporting",
        "col2": "Manual cross-checking taking days after the event",
        "col3": "Instant live attendance analytics and CSV exports"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is event registration software UK?",
      "a": "Event registration software in the UK is a platform that allows organisers to create registration pages, collect attendee details, accept GBP payments, distribute digital QR passes, and check attendees in at venue entrances."
    },
    {
      "q": "Can URPASS process ticket payments in British Pounds (GBP)?",
      "a": "Yes. URPASS supports transparent GBP pricing with 0% ticketing commission on paid tickets, connecting directly to your payment gateway so you keep your revenue."
    },
    {
      "q": "Do UK attendees need to install an app on their phone?",
      "a": "No. URPASS operates entirely via responsive mobile web links. Attendees open their pass in their phone browser or email, and door volunteers scan with mobile Safari or Chrome."
    },
    {
      "q": "How does URPASS comply with UK GDPR?",
      "a": "URPASS adheres strictly to UK GDPR and the Data Protection Act 2018. Attendee data is stored securely without third-party advertising trackers or selling data to promotional brokers."
    },
    {
      "q": "Can multiple volunteers scan attendees at the same time across different doors?",
      "a": "Yes. URPASS supports unlimited simultaneous scanners. Scans sync in real time across all gates to ensure passes cannot be reused at different entrances."
    },
    {
      "q": "What happens if our UK venue loses Wi-Fi or mobile reception?",
      "a": "URPASS includes an offline scanning engine that pre-loads the attendee list in browser memory, continuing validation smoothly even in basement spaces or rural venues."
    },
    {
      "q": "Can URPASS be used for UK university and student union events?",
      "a": "Yes. UK universities, student unions, and campus societies use URPASS for balls, guest lectures, career fairs, and hackathons with custom Student ID fields."
    },
    {
      "q": "Is there a free plan available for free UK events?",
      "a": "Yes. Free community meetups, charity workshops, and academic seminars can use URPASS completely free of charge with full QR generation and scanning capabilities."
    },
    {
      "q": "How fast is the check-in scan?",
      "a": "URPASS validates passes in under 0.3 seconds from up to 30cm away, enabling a single volunteer to admit 40 to 50 attendees per minute."
    },
    {
      "q": "How do I export post-event attendance data?",
      "a": "You can export full attendance logs with exact check-in timestamps and gate identifiers directly to CSV from your organiser dashboard in one click."
    }
  ],
  "relatedLinks": [
    {
      "title": "London Event Registration & QR Check-In",
      "href": "/uk/london",
      "category": "Location"
    },
    {
      "title": "Manchester Event Registration Software",
      "href": "/uk/manchester",
      "category": "Location"
    },
    {
      "title": "Birmingham Event Registration & Check-In",
      "href": "/uk/birmingham",
      "category": "Location"
    },
    {
      "title": "Edinburgh Event Registration & Check-In",
      "href": "/uk/edinburgh",
      "category": "Location"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Eventbrite Alternative UK",
      "href": "/eventbrite-alternative-uk",
      "category": "Comparison"
    },
    {
      "title": "Zero Commission Event Ticketing UK",
      "href": "/zero-commission-event-ticketing-uk",
      "category": "Product"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB",
    "placename": "United Kingdom",
    "position": "55.3781;-3.4360",
    "latitude": 55.3781,
    "longitude": -3.436,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
