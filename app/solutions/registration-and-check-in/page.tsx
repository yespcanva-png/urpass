import type { Metadata } from "next";
import {
  Layers,
  CheckCircle2,
  ScanLine,
  ClipboardList,
  QrCode,
  Zap,
  Users,
  ShieldCheck,
  BarChart3,
  Smartphone,
  Sparkles,
  Clock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration and Check-In Platform — Unified Operations | UrPass",
  description:
    "Connect pre-event registration to day-of entrance check-in on a single unified platform. Eliminate data discrepancies, paper lists, and third-party scanner apps.",
  keywords: [
    "event registration and check-in platform",
    "all in one event check in and registration",
    "event registration and check in app",
    "seamless event registration and entry",
    "unified event management platform",
    "event ticketing and entrance software",
  ],
  alternates: {
    canonical: "https://urpass.space/solutions/registration-and-check-in",
  },
  openGraph: {
    title: "Event Registration and Check-In Platform — Unified Operations | UrPass",
    description:
      "Bridge pre-event signups and door check-ins in one unified database. Instant pass issuance, sub-0.3s phone scanning, and live attendance tracking.",
    url: "https://urpass.space/solutions/registration-and-check-in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Registration and Check-In Platform | UrPass",
    description:
      "All-in-one event platform unifying custom forms, digital QR passes, and mobile phone entrance scanning.",
  },
};

export default function RegistrationAndCheckInSolutionPage() {
  return (
    <SEOPage
      config={{
        badge: "CORE SOLUTION // UNIFIED PLATFORM",
        h1: "Event Registration and Check-In Platform in One Unified System",
        canonicalUrl: "https://urpass.space/solutions/registration-and-check-in",
        description:
          "Connect your pre-event registration pipeline directly to physical entrance gates. Eliminate CSV exports, third-party scanner syncing, and paper lists with a single seamless platform.",
        ctaLabel: "Launch Unified Event Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "See How It Works",
        secondaryCtaHref: "/guides/what-is-qr-event-check-in",

        // GEO Direct Answer
        directAnswer: {
          title: "Why Should Organizers Use a Unified Registration and Check-In Platform?",
          summary:
            "A unified event registration and check-in platform integrates attendee signup (custom forms, approvals, ticketing payments) and physical venue entry (QR pass scanning, multi-gate security) into a single database. UrPass ensures that the exact millisecond an attendee completes registration or receives approval, their entry pass is live and scannable at every entrance door—eliminating dangerous CSV exports, manual list uploads, and missing attendee records.",
          keyPoints: [
            "Zero sync delay: registrations immediately appear in the gate check-in scanner engine",
            "Eliminates CSV exports: stops the scramble of transferring spreadsheet rows into scanner apps",
            "Multi-gate cloud security: atomic duplicate lockout prevents pass sharing across doors",
            "Unified attendee history: connects registration answers to exact gate check-in timestamps",
            "Mobile-first workflow: zero equipment rentals; runs entirely in standard mobile phone browsers",
          ],
        },

        whatIs: {
          title: "The Danger of Fragmented Event Tech Stacks",
          definition:
            "Most event organizers cobble together three or four disparate tools: Google Forms for registration, Excel for attendee management, a third-party ticketing portal for payments, and a separate rented scanner or app for the door. When an attendee registers late or swaps names on event morning, the disconnected tools fail to sync—leading to angry crowds and denied entry at the entrance.",
          details: [
            "Eliminates last-minute data migration panics before the venue doors open",
            "Guarantees that late-registering walk-in guests can be scanned and admitted immediately",
            "Saves event producers 15+ hours of tedious pre-event file formatting and list reconciliation",
          ],
        },

        keyFactsTable: {
          title: "UrPass Unified Platform vs. Disconnected Event Tools",
          subtitle: "Direct comparison of operational reliability and setup complexity.",
          headers: ["Operational Capability", "UrPass Unified Platform", "Fragmented Tools (Forms + Scanner App)", "Paper Rosters"],
          rows: [
            {
              col1: "Registration to Gate Sync",
              col2: "Instant (<1 second live cloud sync)",
              col3: "Manual CSV export and app re-upload required",
              col4: "Requires re-printing all paper pages",
            },
            {
              col1: "Late Registrations & Walk-Ins",
              col2: "Supported instantly at the door",
              col3: "Fail to scan (not in downloaded list)",
              col4: "Must be handwritten at bottom of page",
            },
            {
              col1: "Tools to Learn & Manage",
              col2: "1 centralized dashboard",
              col3: "3–4 separate tools and logins",
              col4: "Printers, binders, and clipboards",
            },
            {
              col1: "Cost Overhead",
              col2: "0% commission + flat plan (or ₹0 free)",
              col3: "Multiple SaaS tool subscriptions",
              col4: "Printing and binding expenses",
            },
            {
              col1: "Duplicate Entry Alerting",
              col2: "Instant multi-gate lockout",
              col3: "Depends on intermittent app syncing",
              col4: "None (pen checks easily bypassed)",
            },
          ],
        },

        featuresTitle: "The All-in-One Engine for Flawless Event Delivery",
        featuresSubtitle: "From the first promotional click to the final attendee departure.",
        features: [
          {
            icon: ClipboardList,
            title: "Custom Form Builder",
            desc: "Gather crucial delegate details, preferences, and documents with conditional questions and automatic capacity capping.",
          },
          {
            icon: ShieldCheck,
            title: "Attendee Approval Screening",
            desc: "Filter guest applications with 1-click approvals, automated waitlists, and instant confirmation notifications.",
          },
          {
            icon: QrCode,
            title: "Cryptographic Pass Engine",
            desc: "Generate dynamic, tamper-proof QR code passes automatically delivered to Apple Wallet, email, and WhatsApp.",
          },
          {
            icon: ScanLine,
            title: "Browser Camera Scanner",
            desc: "Validate guest passes at entrances using any smartphone camera in under 0.3 seconds with zero app store downloads.",
          },
          {
            icon: Zap,
            title: "Atomic Multi-Gate Sync",
            desc: "Coordinate admissions across 1 to 20 doors simultaneously. Passes scanned at Gate A are immediately locked out at Gate B.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Analytics",
            desc: "Watch real-time check-in graphs, calculate no-show rates, and export audit-ready CSV reports with exact timestamps.",
          },
        ],

        howItWorksTitle: "How Unified Event Operations Deliver Peace of Mind",
        howItWorksSubtitle: "Four unified stages covering your entire event lifecycle.",
        steps: [
          { n: "01", title: "Build & Publish", desc: "Create your event registration page, configure custom questions, and set seat capacity." },
          { n: "02", title: "Collect & Review", desc: "Receive attendee signups, process payments or approvals, and auto-issue digital passes." },
          { n: "03", title: "Scan at Entrances", desc: "Gate staff scan guest QR passes using mobile phone cameras; attendance updates instantly." },
          { n: "04", title: "Analyze Live Data", desc: "Track room occupancy, monitor peak arrival curves, and download verified attendance rosters." },
        ],

        deepDiveSections: [
          {
            badge: "OPERATIONAL PEACE OF MIND",
            title: "Why Seamless Synchronization Eliminates Entrance Day Chaos",
            paragraphs: [
              "Every event manager knows the panic of event morning: dozens of attendees register in the final 24 hours, but the printed guest list or offline scanner app was finalized the night before. Volunteers turn away legitimate guests, creating confusion, anger, and line delays.",
              "UrPass eliminates this vulnerability completely. Because registration and gate check-in run on the exact same database, an attendee who registers in the parking lot 60 seconds before approaching the door can be scanned and admitted without a single issue. The volunteer’s phone camera immediately recognizes the pass, flashes green, and welcomes the attendee inside.",
            ],
            bullets: [
              "Supports last-minute ticket sales and on-site walk-in registrations seamlessly",
              "Ensures attendee name updates or ticket tier swaps reflect instantly across all entrance doors",
              "Saves the organizing team from stressful late-night spreadsheet formatting sessions",
            ],
            takeaway: "One unified platform replaces four fragmented tools, delivering bulletproof entrance reliability.",
          },
        ],

        whoShouldUse: {
          title: "Created for Event Teams Seeking Total Simplicity",
          subtitle: "Trusted by organizers who want fewer tools and better results.",
          personas: [
            {
              title: "Conference & Convention Directors",
              desc: "Manage registration forms, delegate tiers, speaker credentials, and multi-day hall check-in from one console.",
              badge: "Conferences",
            },
            {
              title: "College Fest Organizing Committees",
              desc: "Run student signups, inter-college passes, security approvals, and crowd gate control seamlessly.",
              badge: "Campus",
            },
            {
              title: "Corporate HR & Communications",
              desc: "Coordinate employee town halls, partner conferences, and internal summits with verified attendance rosters.",
              badge: "Corporate",
            },
            {
              title: "Event Production Agencies",
              desc: "Deliver flawless registration and gate entry for client brand activations and product launches.",
              badge: "Agencies",
            },
          ],
        },

        faqs: [
          {
            q: "Do I need to export data between registration and check-in?",
            a: "No. Never. The moment an attendee registers or is approved, their digital pass is active in the check-in system across all gates automatically.",
          },
          {
            q: "Can I sell tickets at the door while gate staff are checking guests in?",
            a: "Yes. Attendees can purchase tickets on their phones while standing in line, receive their QR pass immediately, and be scanned in seconds later.",
          },
          {
            q: "Can I manage multiple gates and doors simultaneously?",
            a: "Yes. UrPass supports unlimited simultaneous volunteer scanners across multiple entry points, all synchronized in real time.",
          },
          {
            q: "Is there any software to install on venue computers?",
            a: "No. UrPass is 100% cloud-based and mobile-first. It runs directly inside modern web browsers on phones, tablets, and laptops.",
          },
        ],

        relatedLinks: [
          { title: "Best Event Registration Software", href: "/solutions/event-registration-software", category: "Product" },
          { title: "Event Check-In Software with QR Scanning", href: "/solutions/event-check-in-software", category: "Product" },
          { title: "Event Attendance Tracking Software", href: "/solutions/event-attendance-tracking", category: "Product" },
          { title: "UrPass Pricing & Plans", href: "/pricing", category: "Product" },
        ],
      }}
    />
  );
}
