import type { Metadata } from "next";
import { Banknote, Briefcase, Lock, ScanLine, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Trade Show Registration & Visitor Check-In Software | URPASS",
  description: "Trade show registration software with B2B buyer credentialing, exhibitor staff passes, multi-gate sync, sub-second scanning, and 0% ticket fees.",
  keywords: ["trade show registration software", "trade show visitor management", "b2b trade show ticketing", "trade show badge scanner", "exhibitor pass management", "trade show check-in system"],
  alternates: {
    canonical: "https://urpass.space/trade-show-registration-software",
  },
  openGraph: {
    title: "Trade Show Registration & Visitor Check-In Software | URPASS",
    description: "Trade show registration software with B2B buyer credentialing, exhibitor staff passes, multi-gate sync, sub-second scanning, and 0% ticket fees.",
    url: "https://urpass.space/trade-show-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function TradeShowRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "B2B TRADE SHOW SUITE",
  "h1": "Trade Show Registration & Visitor Check-In Software",
  "canonicalUrl": "https://urpass.space/trade-show-registration-software",
  "description": "Trade show registration software with B2B buyer credentialing, exhibitor staff passes, multi-gate sync, sub-second scanning, and 0% ticket fees.",
  "ctaLabel": "Create Your Trade Show Free →",
  "ctaTitle": "Power Enterprise Trade Show Gate Operations",
  "ctaDescription": "Pre-qualify B2B trade buyers, manage exhibitor passes, and clear morning entrance concourses in seconds with smartphone QR scanning.",
  "directAnswer": {
    "title": "What is Trade Show Registration Software?",
    "summary": "URPASS is trade show registration and visitor check-in software built for commercial expos, buyer-seller meets, and industrial conventions. It manages B2B buyer credentialing, exhibitor team passes, synchronized multi-hall gate access, and real-time floor telemetry with sub-0.3s smartphone scanning and zero hardware rentals.",
    "keyPoints": [
      "B2B credential verification: company registration, VAT/tax IDs, and buyer qualification",
      "Distinct pass tiers for qualified buyers, VIP trade visitors, exhibitors, and press",
      "Sub-second (<0.3s) camera check-in to clear thousands of attendees at morning opening",
      "0% platform ticketing commission with automated corporate tax receipts"
    ]
  },
  "whatIs": {
    "title": "What is Trade Show Registration Software?",
    "definition": "Trade show registration software is an enterprise event platform designed to handle the professional credentialing, badging, and entrance logistics of B2B trade shows. It manages verified buyer registrations, exhibitor staff allocations, digital pass generation, and high-speed multi-entrance access control.",
    "details": [
      "Qualifies trade buyers to protect exhibitors from unqualified public traffic",
      "Replaces costly rented barcode guns with modern mobile smartphone scanners",
      "Synchronizes multiple venue gates to prevent credential sharing and badge pass-backs",
      "Provides verified visitor demographics and attendance velocity curves to show organizers"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Trade Shows",
  "howItWorksSubtitle": "From buyer credentialing to synchronized exhibition gate control.",
  "steps": [
    {
      "n": "01",
      "title": "Configure trade show",
      "desc": "Set buyer qualifications, exhibitor pass quotas, ticket categories, and hall zones."
    },
    {
      "n": "02",
      "title": "Trade buyers pre-register",
      "desc": "Buyers submit company credentials and procurement categories for verification."
    },
    {
      "n": "03",
      "title": "Approve or process booking",
      "desc": "Approve trade credentials automatically or via custom organizer review queues."
    },
    {
      "n": "04",
      "title": "Deliver digital trade badges",
      "desc": "Attendees receive mobile QR passes with their buyer tier, company name, and photo ID."
    },
    {
      "n": "05",
      "title": "Scan at the entrance gates",
      "desc": "Door teams scan badges in <0.3s across all hall concourses using smartphone cameras."
    },
    {
      "n": "06",
      "title": "Monitor real-time floor data",
      "desc": "Track buyer arrival velocity, hall occupancy, and exhibitor check-ins live."
    }
  ],
  "featuresTitle": "Trade Show Capabilities Engineered for Scale",
  "featuresSubtitle": "B2B buyer credentialing, multi-gate sync, and zero ticketing commission.",
  "features": [
    {
      icon: Briefcase,
      "title": "B2B Buyer Credentialing",
      "desc": "Capture company names, VAT/tax IDs, job titles, and procurement categories to qualify trade visitors."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Concourse Scanning",
      "desc": "Clear massive morning crowds without delay. Validate 45+ trade delegates per minute per scanner line."
    },
    {
      icon: Lock,
      "title": "Atomic Duplicate Lockout",
      "desc": "Prevent badge sharing. Passes scanned at Hall 1 cannot be reused moments later at Hall 3."
    },
    {
      icon: Users,
      "title": "Exhibitor Pass Quotas",
      "desc": "Assign dedicated exhibitor pass allocations to booth sponsors with distinct exhibitor badge designs."
    },
    {
      icon: Zap,
      "title": "Offline Exhibition Resilience",
      "desc": "Local browser caching ensures entrance gates remain fully functional during convention hall signal drops."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "Keep 100% of high-value trade show ticket revenue. Pay simple flat monthly subscriptions in GBP/INR."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Trade Show Registration Software?",
    "subtitle": "From industrial machinery expos to luxury goods conventions.",
    "personas": [
      {
        "badge": "INDUSTRIAL",
        "title": "Industrial & Manufacturing Expos",
        "desc": "Machinery, engineering, and supply chain trade shows requiring verified procurement buyer passes."
      },
      {
        "badge": "RETAIL & FMCG",
        "title": "Retail & Consumer Goods Trade Fairs",
        "desc": "Fashion, food, and consumer product buying shows with multiple hall access tiers."
      },
      {
        "badge": "TECHNOLOGY",
        "title": "Enterprise B2B Tech Expos",
        "desc": "Enterprise software, cybersecurity, and telecommunications trade conventions with VIP buyer lounges."
      },
      {
        "badge": "CONSTRUCTION",
        "title": "Building & Infrastructure Shows",
        "desc": "Large-scale construction expos with multiple vehicle and visitor entry checkpoints."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Trade Show QR Check-In Works",
    "subtitle": "Sub-second camera scanning across all venue gates.",
    "description": "Trade buyers and exhibitors display their mobile QR pass as they approach entrance turnstiles. Door staff scan the code in under 0.3 seconds using standard smartphone web browsers. The scanner confirms trade credentials with an audible green chime and atomically updates the central cloud manifest to prevent badge pass-backs.",
    "points": [
      "Zero scanner hardware rentals: runs smoothly on standard smartphones.",
      "Atomic row-locking prevents shared badge screenshots between attendees.",
      "Offline resilience allows continued check-in during convention hall Wi-Fi outages.",
      "Instant search bar enables rapid manual lookup by name or company."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Traditional Trade Show Systems",
    "subtitle": "How URPASS modernizes trade show entrance management.",
    "headers": [
      "Trade Show Operation",
      "Rented Laser Scanners / Badge Turnstiles",
      "Connected URPASS Workflow"
    ],
    "rows": [
      {
        "col1": "Hardware Rental Cost",
        "col2": "£100 to £250 per rented laser unit per show day",
        "col3": "£0 hardware cost; uses volunteers' existing phones"
      },
      {
        "col1": "Morning Concourse Speed",
        "col2": "Long lines waiting for manual badge printing",
        "col3": "<0.3s digital QR scan on mobile phones"
      },
      {
        "col1": "Badge Duplication",
        "col2": "High incidence of badge pass-backs to colleagues",
        "col3": "Atomic cloud locking immediately blocks duplicate entry"
      },
      {
        "col1": "Platform Ticketing Cut",
        "col2": "Legacy systems take 4% to 8% of commercial ticket sales",
        "col3": "0% commission; keep 100% of event revenue"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is trade show registration software?",
      "a": "It is an event registration and credentialing system that manages B2B trade buyer signups, exhibitor pass quotas, digital QR credentials, and entrance gate check-in for commercial trade shows."
    },
    {
      "q": "Can we qualify trade buyers before issuing tickets?",
      "a": "Yes. Organizers can set approval queues to review company tax IDs, corporate websites, or job titles before approving tickets."
    },
    {
      "q": "How does URPASS prevent badge sharing between colleagues?",
      "a": "When a badge is scanned, URPASS atomically updates its status across all entrances in under 150ms. Re-entry attempts show a vibrant red duplicate alert."
    },
    {
      "q": "Can exhibitor teams manage their own staff passes?",
      "a": "Yes. Organizers can allocate pass quotas to exhibitors, allowing booth managers to assign passes directly to their team members."
    },
    {
      "q": "Does URPASS work if the convention hall Wi-Fi fails?",
      "a": "Yes. The offline scanning engine caches attendee manifests in memory, allowing gates to continue admitting delegates without internet access."
    },
    {
      "q": "Can we categorize trade show passes into VIP, Buyer, Press, and Exhibitor tiers?",
      "a": "Yes. You can define distinct badge categories with customized branding, access privileges, and different entry gate allowances."
    },
    {
      "q": "What happens if trade show Wi-Fi drops during morning peak hours?",
      "a": "URPASS browser scanners cache attendee cryptographic signatures locally, allowing door staff to validate passes offline without delay and sync updates once connection returns."
    }
  ],
  "relatedLinks": [
    {
      "title": "Exhibition Visitor Registration & QR Check-In",
      "href": "/exhibition-registration-software",
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
      "title": "Zero-Commission Event Ticketing Platform",
      "href": "/zero-commission-event-ticketing",
      "category": "Product"
    }
  ]
}}
    />
  );
}
