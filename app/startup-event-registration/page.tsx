import type { Metadata } from "next";
import { Banknote, BarChart3, FileText, Lock, ScanLine, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Startup Event Registration & QR Check-In | URPASS",
  description: "Startup event registration software for demo days, pitch nights, and investor mixers. Founder/investor pass tiers, sponsor branding, and 0% ticket fees.",
  keywords: ["startup event registration software", "demo day ticketing platform", "pitch night registration software", "investor mixer check-in", "tech startup event ticketing", "startup demo day badge scanner"],
  alternates: {
    canonical: "https://urpass.space/startup-event-registration",
  },
  openGraph: {
    title: "Startup Event Registration & QR Check-In | URPASS",
    description: "Startup event registration software for demo days, pitch nights, and investor mixers. Founder/investor pass tiers, sponsor branding, and 0% ticket fees.",
    url: "https://urpass.space/startup-event-registration",
    locale: "en_US",
    type: "website",
  },
};

export default function StartupEventRegistrationPage() {
  return (
    <SEOPage
      config={{
  "badge": "STARTUPS & DEMO DAYS",
  "h1": "Startup Event Registration & QR Check-In",
  "canonicalUrl": "https://urpass.space/startup-event-registration",
  "description": "Startup event registration software for demo days, pitch nights, and investor mixers. Founder/investor pass tiers, sponsor branding, and 0% ticket fees.",
  "ctaLabel": "Create Startup Event Free →",
  "ctaTitle": "Power High-Speed Demo Days & Pitch Nights",
  "ctaDescription": "Manage founder and investor registration, issue branded digital passes, and admit attendees in <0.3s with smartphone check-in.",
  "directAnswer": {
    "title": "What is Startup Event Registration Software?",
    "summary": "URPASS is startup event registration and check-in software built for accelerator demo days, angel pitch nights, tech mixers, and founder hackathons. It lets organizers create distinct pass tiers for founders, investors, and sponsors, issue sleek mobile QR credentials, and verify entrance in under 0.3 seconds on volunteer smartphones.",
    "keyPoints": [
      "Tailored attendee tiers: Investors, Founders, VIP Sponsors, and Press",
      "Custom intake fields: startup stage, investment thesis, and LinkedIn profiles",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
      "100% free for free community pitch nights and demo days"
    ]
  },
  "whatIs": {
    "title": "What is Startup Event Registration Software?",
    "definition": "Startup event registration software is an agile event management platform designed for tech startup ecosystems, accelerators, and venture capital networks. It coordinates attendee accreditation, investor verification, digital badge delivery, and entrance scanning for high-profile demo days and networking mixers.",
    "details": [
      "Differentiates between active investors and general attendees during registration",
      "Replaces slow reception desks with rapid digital mobile pass scanning",
      "Maintains exclusivity for private investor sessions with distinct ticket credentials",
      "Operates hardware-free on existing smartphones with zero software downloads"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Startup Events",
  "howItWorksSubtitle": "From investor registration to demo day gate control.",
  "steps": [
    {
      "n": "01",
      "title": "Configure startup event",
      "desc": "Set founder, investor, and general attendee tiers with custom intake questions."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Post your event URL on LinkedIn, Twitter, Substack, and investor WhatsApp groups."
    },
    {
      "n": "03",
      "title": "Attendees register",
      "desc": "Founders and angels register in seconds with their company details and LinkedIn."
    },
    {
      "n": "04",
      "title": "Issue digital startup passes",
      "desc": "Attendees receive sleek mobile QR passes with their designated credential tier."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Door teams scan passes with phone cameras in <0.3s for rapid admission."
    },
    {
      "n": "06",
      "title": "Live attendance tracking",
      "desc": "Monitor investor arrivals and auditorium capacity live from the organizer dashboard."
    }
  ],
  "featuresTitle": "Features Built for Fast-Moving Tech Ecosystems",
  "featuresSubtitle": "Investor tiers, LinkedIn capture, and sub-second phone scanning.",
  "features": [
    {
      icon: Zap,
      "title": "Founder & Investor Tiers",
      "desc": "Configure distinct badge passes for angel investors, venture capitalists, founders, and media."
    },
    {
      icon: FileText,
      "title": "Startup & Thesis Intake",
      "desc": "Collect company names, funding stages (Pre-Seed to Series A), and investment check sizes."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Entrance Scanning",
      "desc": "Admit 40+ attendees per minute per volunteer phone. Clear reception foyers quickly before keynotes start."
    },
    {
      icon: Lock,
      "title": "Exclusive Session Access",
      "desc": "Use QR validation to control entrance into private VIP investor lounges and closed-door pitch rooms."
    },
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "100% free for free demo days. Zero commission fees on paid founder networking workshops."
    },
    {
      icon: BarChart3,
      "title": "Live Investor Headcount",
      "desc": "Know exactly when key angel and VC investors arrive at the venue to alert presenting founders."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Startup Event Registration Software?",
    "subtitle": "From seed accelerators to venture capital firms.",
    "personas": [
      {
        "badge": "ACCELERATORS",
        "title": "Accelerators & Incubators",
        "desc": "Cohort demo days, graduation ceremonies, and investor preview nights."
      },
      {
        "badge": "VENTURE CAPITAL",
        "title": "VC Funds & Angel Syndicates",
        "desc": "Portfolio summits, annual LP meetings, and exclusive founder-funder roundtables."
      },
      {
        "badge": "COWORKING",
        "title": "Tech Hubs & Coworking Spaces",
        "desc": "Monthly tech mixers, pitch competitions, and startup showcase evenings."
      },
      {
        "badge": "STUDENTS",
        "title": "University Entrepreneurship Societies",
        "desc": "Student startup competitions, venture crawls, and campus founder workshops."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Startup Event QR Check-In Works",
    "subtitle": "Frictionless greeting for founders and investors.",
    "description": "Attendees display their mobile QR pass on their phone screen. Volunteer door staff open the scanner URL in Safari or Chrome on their smartphones. In under 0.3 seconds, the camera scans the pass, displays the attendee's name and tier (e.g. 'Angel Investor - Seed'), and chimes green, ensuring a smooth, modern arrival experience without paper badge clutter.",
    "points": [
      "Zero equipment rentals: runs smoothly on volunteer smartphones.",
      "Instant verification displays attendee name, role, and tier.",
      "Offline resilience ensures check-in continues smoothly in converted loft venues.",
      "Quick search bar enables rapid manual lookup if an attendee forgets their phone."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Traditional Startup Event Check-In",
    "subtitle": "How URPASS modernizes demo day and pitch night entry.",
    "headers": [
      "Startup Event Operation",
      "Spreadsheet Checklists / Printed Labels",
      "Connected URPASS Platform"
    ],
    "rows": [
      {
        "col1": "Entrance Flow",
        "col2": "15 to 20 minute bottleneck waiting for name badges",
        "col3": "<0.3s digital QR scan; attendees walk straight in"
      },
      {
        "col1": "VIP Investor Tracking",
        "col2": "Hosts have no idea if target VCs have arrived",
        "col3": "Live dashboard alerts hosts the second an investor checks in"
      },
      {
        "col1": "Platform Fees",
        "col2": "Legacy platforms charge fees even on free community events",
        "col3": "100% free for free startup events with zero cuts"
      },
      {
        "col1": "Attendee Data Privacy",
        "col2": "Legacy platforms spam founders with competitor events",
        "col3": "Zero third-party promotions; strict data ownership"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is startup event registration software?",
      "a": "It is an event registration platform designed for startup ecosystems, accelerators, and pitch events to manage attendee signups, investor tiers, and smartphone check-in."
    },
    {
      "q": "Can we differentiate between founders and investors?",
      "a": "Yes. You can create custom pass tiers (Founder, Investor, Sponsor, General) with distinct visual badges and access privileges."
    },
    {
      "q": "Is URPASS free for free demo days and pitch nights?",
      "a": "Yes! URPASS is completely free for free startup events with full access to QR ticket generation and mobile scanning."
    },
    {
      "q": "Can we collect LinkedIn profile links during registration?",
      "a": "Yes. Custom intake fields let you capture LinkedIn URLs, startup names, funding stages, and investment criteria."
    },
    {
      "q": "Do attendees need to download an app to enter?",
      "a": "No. Passes display cleanly in any mobile browser or email, and door teams scan using web browsers without installing native apps."
    },
    {
      "q": "Can we review pitch competition applicants before issuing entry passes?",
      "a": "Yes. Organizer approval workflows let you screen applications, review founder pitch decks, and send QR passes only to vetted founders and investors."
    },
    {
      "q": "Can we segment attendee passes for Founders, VCs, and General Attendees?",
      "a": "Yes. Different ticket tiers carry color-coded digital badges so your greeting staff can immediately identify VIP investors and founders at check-in."
    }
  ],
  "relatedLinks": [
    {
      "title": "Networking Event Registration Software",
      "href": "/networking-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Meetup Registration & QR Check-In Platform",
      "href": "/meetup-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Hackathon Registration & QR Check-In Software",
      "href": "/hackathon-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
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
