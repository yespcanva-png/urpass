import type { Metadata } from "next";
import { Banknote, BarChart3, FileText, ScanLine, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Exhibition Visitor Registration & QR Check-In | URPASS",
  description: "Exhibition registration software with visitor badging, multi-hall entrance control, trade buyer pre-registration, and sub-second phone scanning.",
  keywords: ["exhibition registration software", "visitor registration software", "exhibition ticketing platform", "trade exhibition check-in", "exhibition entrance management", "expo visitor qr code scanner"],
  alternates: {
    canonical: "https://urpass.space/exhibition-registration-software",
  },
  openGraph: {
    title: "Exhibition Visitor Registration & QR Check-In | URPASS",
    description: "Exhibition registration software with visitor badging, multi-hall entrance control, trade buyer pre-registration, and sub-second phone scanning.",
    url: "https://urpass.space/exhibition-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function ExhibitionRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "EXHIBITIONS & TRADE EXPOS",
  "h1": "Exhibition Visitor Registration & QR Check-In",
  "canonicalUrl": "https://urpass.space/exhibition-registration-software",
  "description": "Exhibition registration software with visitor badging, multi-hall entrance control, trade buyer pre-registration, and sub-second phone scanning.",
  "ctaLabel": "Create Your Exhibition Free →",
  "ctaTitle": "Manage High-Volume Exhibition Entrances",
  "ctaDescription": "Pre-register trade visitors, issue digital QR entry badges, and validate thousands of visitors across multiple halls with volunteer phones.",
  "directAnswer": {
    "title": "What is Exhibition Registration Software?",
    "summary": "URPASS is exhibition visitor registration and QR check-in software built for art exhibitions, trade expos, industrial showcases, and consumer fairs. It manages trade buyer pre-registration, visitor badge generation, multi-hall entrance gates, and real-time floor attendance with sub-second smartphone camera scanning and zero hardware rentals.",
    "keyPoints": [
      "Pre-registration and on-site visitor intake with custom trade credential fields",
      "Instant digital QR badge delivery via email, web link, or mobile pass",
      "Sub-second (<0.3s) camera check-in across multiple exhibition hall gates",
      "Real-time floor occupancy tracking for venue crowd control and safety"
    ]
  },
  "whatIs": {
    "title": "What is Exhibition Registration Software?",
    "definition": "Exhibition registration software is an event management platform built to coordinate high-volume visitor flow at trade exhibitions, art fairs, and consumer expos. It handles visitor pre-registration, ticketing, digital credential issuance, and synchronized gate scanning across large exhibition halls.",
    "details": [
      "Replaces slow reception badge printing desks with instant mobile QR passes",
      "Coordinates entrance access across multiple exhibition halls and trade zones",
      "Maintains entrance speed during peak morning trade buyer arrival windows",
      "Provides verified visitor demographics and attendance data for exhibitors and sponsors"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Exhibitions",
  "howItWorksSubtitle": "From visitor pre-registration to multi-hall entrance scanning.",
  "steps": [
    {
      "n": "01",
      "title": "Configure exhibition",
      "desc": "Set exhibition dates, multi-day passes, trade buyer categories, and hall zones."
    },
    {
      "n": "02",
      "title": "Publish registration page",
      "desc": "Distribute your branded registration link to trade buyers, exhibitors, and the public."
    },
    {
      "n": "03",
      "title": "Visitors register online",
      "desc": "Attendees register with their company details, job titles, and visiting interests."
    },
    {
      "n": "04",
      "title": "Issue digital visitor badges",
      "desc": "Visitors receive dynamic digital QR entry passes delivered straight to their phones."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Door teams scan passes with phone cameras in <0.3s across all hall entrances."
    },
    {
      "n": "06",
      "title": "Track live floor capacity",
      "desc": "Monitor hall headcounts, entrance velocity, and peak visitor hours in real time."
    }
  ],
  "featuresTitle": "Features Built for High-Volume Exhibition Venues",
  "featuresSubtitle": "Multi-hall sync, offline resilience, and rapid visitor badging.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-0.3s Visitor Scanning",
      "desc": "Admit 40 to 50 visitors per minute per scanner line. Keep main exhibition concourses clear of queues."
    },
    {
      icon: Users,
      "title": "Multi-Hall Synchronization",
      "desc": "Synchronize scanning across multiple halls and turnstiles in under 150ms to prevent duplicate badge entry."
    },
    {
      icon: FileText,
      "title": "Trade Buyer Demographics",
      "desc": "Collect company names, job titles, procurement budgets, and product categories of interest."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Resilience",
      "desc": "Pre-cached visitor manifests ensure entrance scanning continues even when exhibition center Wi-Fi drops."
    },
    {
      icon: BarChart3,
      "title": "Live Hall Occupancy",
      "desc": "Monitor real-time visitor counts in each hall to comply with venue fire safety and crowd management rules."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "Keep 100% of visitor ticket and exhibitor pass revenues with flat transparent monthly subscriptions."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Exhibition Registration Software?",
    "subtitle": "From major trade expos to independent art galleries.",
    "personas": [
      {
        "badge": "TRADE EXPOS",
        "title": "Industrial & Trade Show Organizers",
        "desc": "B2B manufacturing, construction, and technology trade shows managing thousands of verified buyers."
      },
      {
        "badge": "ART & DESIGN",
        "title": "Art Fairs & Design Showcases",
        "desc": "Contemporary art exhibitions, gallery weekends, and design festivals requiring sleek mobile passes."
      },
      {
        "badge": "CONSUMER",
        "title": "Consumer Expos & Festivals",
        "desc": "Food and wine expos, home and garden shows, and hobby exhibitions with timed entry slots."
      },
      {
        "badge": "CAREER",
        "title": "Job & Career Fairs",
        "desc": "University career expos and professional recruitment fairs connecting job seekers with recruiters."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Exhibition QR Check-In Works",
    "subtitle": "Sub-second camera scanning across all venue gates.",
    "description": "Visitors show their digital QR badge on their smartphone screen as they approach the entrance turnstiles. Door staff scan the code in under 0.3 seconds using standard smartphone web browsers. The scanner confirms visitor status with an audible green chime and atomically updates the central cloud manifest to prevent badge pass-backs.",
    "points": [
      "Zero scanner hardware rentals: runs smoothly on standard smartphones.",
      "Atomic row-locking prevents shared badge screenshots between attendees.",
      "Offline resilience allows continued check-in during convention hall Wi-Fi outages.",
      "Instant search bar enables rapid manual lookup by name or company."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Traditional Exhibition Badging",
    "subtitle": "How URPASS eliminates badge printing queues and hardware costs.",
    "headers": [
      "Exhibition Metric",
      "Traditional Onsite Badge Printers / Laser Scanners",
      "Connected URPASS Workflow"
    ],
    "rows": [
      {
        "col1": "Morning Entrance Queue",
        "col2": "30 to 60 minute delay queuing for thermal badge printing",
        "col3": "<0.3s digital QR scan; visitors walk straight in"
      },
      {
        "col1": "Equipment Cost",
        "col2": "Thousands spent on rented badge printers and laser scanners",
        "col3": "£0 equipment cost; uses staff smartphones"
      },
      {
        "col1": "Multi-Hall Protection",
        "col2": "High risk of badge sharing between hall entrances",
        "col3": "Atomic state replication blocks reused passes"
      },
      {
        "col1": "Visitor Data",
        "col2": "Messy paper business card drops and manual lead sheets",
        "col3": "Digital visitor database with verified entry records"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is exhibition registration software?",
      "a": "It is an event management platform that manages visitor pre-registration, digital badge delivery, and entrance scanning for trade exhibitions and public expos."
    },
    {
      "q": "Can URPASS handle multi-hall exhibitions with different entrances?",
      "a": "Yes. URPASS supports multi-gate synchronization across unlimited entrances with real-time replication in under 150ms."
    },
    {
      "q": "Do visitors need to print their badges before arriving?",
      "a": "No. Visitors can present their responsive digital QR badge directly on their mobile phone screen for instant scanning."
    },
    {
      "q": "What happens if the exhibition hall Wi-Fi becomes overloaded?",
      "a": "URPASS pre-caches visitor data in local browser memory, allowing gate staff to continue validating passes without interruption."
    },
    {
      "q": "Can we collect company names and buyer interests during registration?",
      "a": "Yes. The custom form builder lets you add mandatory fields for company details, job titles, and purchasing interests."
    },
    {
      "q": "Can URPASS handle multi-day exhibition visitor badges?",
      "a": "Yes. Each visitor QR pass can be configured for single-day or multi-day badge access, recording daily re-entries without resetting attendee records."
    },
    {
      "q": "Can exhibitor staff scan visitor passes for lead capture?",
      "a": "Yes. URPASS supports exhibitor pass scanning permissions, allowing booth managers to scan visitor QR passes to capture consent-based delegate contact details."
    }
  ],
  "relatedLinks": [
    {
      "title": "Trade Show Registration & Visitor Check-In Software",
      "href": "/trade-show-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    },
    {
      "title": "Event Entry Management & QR Access Control",
      "href": "/event-entry-management-software",
      "category": "Product"
    },
    {
      "title": "Digital Event Pass Generator with QR Codes",
      "href": "/digital-event-pass-generator",
      "category": "Product"
    }
  ]
}}
    />
  );
}
