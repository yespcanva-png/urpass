import type { Metadata } from "next";
import {
  Globe2,
  ShieldCheck,
  Zap,
  Ticket,
  Smartphone,
  Users,
  BarChart3,
  CreditCard,
  Building2,
  CheckCircle2,
  ScanLine,
  Lock,
  Layers,
  Server,
  Key,
  Cpu,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Global Event Registration, Digital Passes & QR Check-In Platform | URPASS",
  description:
    "Zero-commission global event registration, digital QR ticketing, and sub-second browser gate check-in platform for conferences, summits, hackathons, and enterprise events worldwide. No app downloads required.",
  keywords: [
    "global event registration platform",
    "international event ticketing software",
    "zero commission event ticketing",
    "browser based QR ticket scanner",
    "QR event check-in software",
    "digital event pass generator",
    "Eventbrite alternative global",
    "multi gate event check in",
    "enterprise event management platform",
    "Model Context Protocol event management",
    "URPASS global",
  ],
  alternates: {
    canonical: "https://urpass.space/global",
    languages: {
      "en-US": "https://urpass.space/global",
      "en-GB": "https://urpass.space/uk",
      "en-IN": "https://urpass.space/in",
      "x-default": "https://urpass.space",
    },
  },
  openGraph: {
    title: "Global Event Registration, Digital Passes & QR Check-In Platform | URPASS",
    description:
      "Zero-commission global event registration, digital QR ticketing, and sub-second browser gate check-in platform for conferences, summits, and hackathons worldwide.",
    url: "https://urpass.space/global",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "URPASS Global — Digital Event Passes & QR Check-In Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Event Registration, Digital Passes & QR Check-In Platform | URPASS",
    description:
      "Zero-commission global event registration, digital QR ticketing, and sub-second browser gate check-in platform worldwide.",
    images: ["https://urpass.space/og-image.png"],
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "distribution": "Global",
  },
};

export default function GlobalPage() {
  return (
    <SEOPage
      config={{
        badge: "GLOBAL EVENT INFRASTRUCTURE",
        h1: "Global Event Registration, Digital Passes & QR Check-In Platform",
        canonicalUrl: "https://urpass.space/global",
        description:
          "Zero-commission global event registration, digital QR ticketing, and sub-second browser gate check-in platform for conferences, summits, hackathons, and corporate gatherings worldwide.",
        ctaLabel: "Start Hosting Globally",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is URPASS and How Does it Power Events Worldwide?",
          summary:
            "URPASS is an international event registration, digital pass issuance, and high-velocity QR check-in platform engineered by Yesp Corporation. Built with zero per-ticket platform commissions, URPASS enables organizers globally to issue tamper-proof single-use QR passes and execute sub-second (<0.3s) door check-ins through standard smartphone browsers without requiring hardware rentals or proprietary app installations for staff or attendees.",
          keyPoints: [
            "0% per-ticket platform commission fees worldwide — keep 100% of ticket sales",
            "Universal mobile browser check-in (<0.3s) with camera scanning, audio chimes, and haptics",
            "Cryptographic single-use QR tokens with atomic anti-duplicate entry protection",
            "Offline-resilient scanning with local manifest caching and timestamped synchronization",
          ],
        },

        // 10-Point Standard: Key Facts & Global Specifications Table
        keyFactsTable: {
          title: "Global Event Infrastructure & Technical Specifications",
          subtitle: "Documented platform capabilities, security architecture, and operational specifications for international events.",
          headers: ["Platform Capability", "URPASS Global Specification", "Legacy Global Ticketing (e.g., Eventbrite)"],
          rows: [
            {
              col1: "Platform Commission on Tickets",
              col2: "0% (Flat transparent plans from $0/mo free to $19/mo)",
              col3: "3.7% to 10% per ticket sold + fixed processing fees",
            },
            {
              col1: "Scanner App Requirements",
              col2: "Zero downloads. Runs in any mobile browser (Safari, Chrome)",
              col3: "Mandatory proprietary iOS / Android app installation",
            },
            {
              col1: "Gate Check-In Latency",
              col2: "< 0.3 seconds per attendee on standard mobile cameras",
              col3: "3.0 to 6.5 seconds per scan; frequent focus hunting",
            },
            {
              col1: "Duplicate Entry Prevention",
              col2: "Atomic PostgreSQL transaction locks with device & time stamps",
              col3: "Often delayed sync leading to accidental duplicate admissions",
            },
            {
              col1: "Offline Gate Resilience",
              col2: "Service worker manifest caching with background sync",
              col3: "Fails or requires expensive offline handheld rental devices",
            },
            {
              col1: "Enterprise Multi-Tenancy",
              col2: "Workspaces, multi-location campuses, RBAC, SCIM & SSO",
              col3: "Separate accounts or expensive enterprise custom contracts",
            },
            {
              col1: "AI Agent Operations",
              col2: "Native Model Context Protocol (MCP) server & JSON-RPC endpoint",
              col3: "No native MCP support for AI coding or workflow agents",
            },
            {
              col1: "Free Forever Tier",
              col2: "Free forever: 2 events/mo, 100 registrations/mo, QR check-in",
              col3: "Strict attendee caps or paid-only ticketing access",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Globe2,
            title: "0% Commission Global Ticketing",
            desc: "Sell paid tickets directly without sacrificing 5% to 10% of gross revenue to ticketing platform middlemen. Transparent flat plans only.",
          },
          {
            icon: Smartphone,
            title: "Browser-Based QR Scanner (<0.3s)",
            desc: "Turn any iOS or Android phone or tablet into an ultra-fast gate scanner without installing software or requiring App Store downloads.",
          },
          {
            icon: Ticket,
            title: "Bespoke Ticket Studio & Passes",
            desc: "Design responsive digital passes, printable PDF passes, and vertical lanyard conference badges with dynamic QR codes and attendee data.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Anti-Duplicate Security",
            desc: "Cryptographically signed single-use pass tokens prevent screenshot sharing, duplicate entries, and unauthorized venue access.",
          },
          {
            icon: Server,
            title: "Offline Sync & Venue Reliability",
            desc: "Keep gates moving even when basement auditoriums or remote outdoor festival grounds experience intermittent cellular network drops.",
          },
          {
            icon: Cpu,
            title: "Native Model Context Protocol (MCP)",
            desc: "Control attendee approvals, ticket issuance, and gate metrics autonomously via Claude Desktop, Cursor, and custom AI agents.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "ENGINEERED FOR SCALE",
          title: "Tested Across International Summits, Hackathons & Conferences",
          description:
            "From tech conferences and global developer buildathons to academic symposiums, URPASS delivers zero-downtime gate management and frictionless attendee check-ins.",
          type: "scanner",
        },

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS vs Legacy Global Ticketing Platforms",
          subtitle: "Documented, feature-by-feature comparison based on actual production software capabilities.",
          competitorName: "Eventbrite",
          sourceCitations: [
            "Eventbrite published pricing and ticketing fee schedule",
            "URPASS production release specifications (urpass.space)",
          ],
          rows: [
            {
              criteria: "Per-Ticket Platform Percentage Fee",
              urpass: "0% commission on all plans",
              competitor: "3.7% + per-ticket fee",
              urpassAdvantage: true,
            },
            {
              criteria: "Scanner Deployment Model",
              urpass: "Instant browser URL (Safari / Chrome)",
              competitor: "Requires downloading mobile app",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Verification Latency",
              urpass: "< 0.3s sub-second camera scanning",
              competitor: "3-6 seconds typical scan latency",
              urpassAdvantage: true,
            },
            {
              criteria: "Hardware Rentals Required",
              urpass: "None; works on existing staff smartphones",
              competitor: "Often recommends renting laser scanners",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Registration Approval Queues",
              urpass: "Built-in 1-click application screening",
              competitor: "Limited or requires complex add-ons",
              urpassAdvantage: true,
            },
            {
              criteria: "Multi-Gate Anti-Duplicate Enforcement",
              urpass: "Atomic database locks with live audit logs",
              competitor: "Standard check-in sync",
              urpassAdvantage: true,
            },
            {
              criteria: "Model Context Protocol (MCP) Integration",
              urpass: "Native MCP server (10 production tools)",
              competitor: "Not supported",
              urpassAdvantage: true,
            },
            {
              criteria: "30-Day Free Trial without Credit Card",
              urpass: "Full 30-day trial at $0 without credit card",
              competitor: "Mandatory credit card for plan trials",
              urpassAdvantage: true,
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "ZERO-COMMISSION ADVANTAGE",
            title: "Why Global Organizers are Moving Away from Percentage Ticketing Cuts",
            paragraphs: [
              "For over a decade, legacy ticketing aggregators have charged organizers 3.7% to 10% of gross ticket sales in addition to fixed processing fees. On an international conference, technical summit, or festival generating $100,000 in gross registrations, organizers frequently pay between $5,000 and $10,000 solely for basic ticket delivery and check-in software.",
              "URPASS disrupts this legacy pricing architecture with transparent, predictable software tiers. By separating payment processing from ticketing software, organizers retain 100% of their ticket revenues. Whether you host 100 attendees or 10,000 attendees, your software costs remain flat and transparent.",
            ],
            bullets: [
              "0% ticketing platform commissions across all tiers",
              "Keep 100% of your ticket revenue directly in your connected merchant account",
              "Eliminate surprise per-ticket service charges that cause buyer checkout drop-offs",
              "Complete, unencumbered ownership of your attendee relationships and email lists",
            ],
            takeaway:
              "Switching from commission-based ticketing to flat software pricing saves international organizers thousands of dollars per event.",
          },
          {
            badge: "SUB-SECOND GATE VELOCITY",
            title: "Eliminating Entrance Bottlenecks with In-Browser QR Check-In",
            paragraphs: [
              "The most vulnerable point of any physical event is the registration desk and entrance gate. Traditional check-in software requires staff to download dedicated app store applications, log in with administrative credentials, and fight sluggish autofocus routines that take 3 to 6 seconds per attendee.",
              "URPASS re-engineers entry scanning by leveraging modern WebRTC camera APIs directly in mobile Safari and Chrome. Gate volunteers simply open a secure PIN-verified scanner link on their personal smartphones. The scanner locks onto passes in under 0.3 seconds, instantly sounding an audio confirmation and displaying a green status banner.",
            ],
            bullets: [
              "Under 0.3-second barcode recognition and token validation",
              "No App Store or Google Play downloads required for volunteers or security staff",
              "Continuous scan mode for rapid high-volume queue clearance",
              "Audible confirmation chimes and haptic vibration feedback for noisy entrance environments",
            ],
            takeaway:
              "A single volunteer using a standard smartphone can easily process 200+ attendees per hour without queue slowdowns.",
          },
          {
            badge: "CRYPTOGRAPHIC FRAUD PREVENTION",
            title: "Stopping Duplicate Entries, Screenshot Sharing, and Gate Fraud",
            paragraphs: [
              "Paper tickets, PDF printouts, and static QR codes are notoriously susceptible to screenshot sharing. An attendee forwards their pass image to friends, allowing multiple unauthorized individuals to enter through separate gates before staff notice the duplication.",
              "URPASS passes utilize cryptographically signed UUID tokens verified against an atomic PostgreSQL backend. The exact millisecond a pass is scanned, its record updates to checked-in status across the entire network. If the same pass or a forwarded screenshot is presented at any other gate, the scanner flashes a red alert displaying the exact gate and timestamp of the original check-in.",
            ],
            bullets: [
              "Atomic database transactions prevent simultaneous duplicate check-in race conditions",
              "Instant visual and audio warning if a pass has already been admitted",
              "Audit logging tracks exact check-in timestamp, device ID, and scanning volunteer",
              "Manual override capabilities for organizers handling exceptional attendee cases",
            ],
            takeaway:
              "Cryptographic token validation ensures zero revenue loss from unauthorized badge sharing or ticket counterfeiting.",
          },
          {
            badge: "ENTERPRISE MULTI-TENANCY",
            title: "Corporate Workspaces, Campus Governance & Role-Based Access Control",
            paragraphs: [
              "Enterprise organizations, universities, and multi-city event series require centralized visibility without sacrificing operational delegation. URPASS provides multi-tenant organizational consoles designed for enterprise governance.",
              "Admins can create distinct workspaces for marketing, engineering, student clubs, or regional chapters, configure physical campus venues, and assign granular RBAC roles (Owner, Admin, Event Manager, Check-in Staff, and Viewer). Enterprise deployments also support SAML 2.0 / OIDC Single Sign-On and automated SCIM v2 user provisioning.",
            ],
            bullets: [
              "Multi-workspace segregation for corporate departments, university clubs, and regional teams",
              "Five-tier Role-Based Access Control (RBAC) ensuring least-privilege security",
              "Enterprise SSO integration supporting Okta, Microsoft Entra ID, Google Workspace, and Ping",
              "Automated SCIM v2 user synchronization and instant session revocation",
            ],
            takeaway:
              "URPASS scales from independent community meetups to multi-campus universities and global enterprise event programs.",
          },
          {
            badge: "AUTONOMOUS AI OPERATIONS",
            title: "First-Class Model Context Protocol (MCP) Server for AI Assistants",
            paragraphs: [
              "As autonomous software agents transform productivity, event organizers shouldn't be trapped doing repetitive administrative data entry. URPASS is built with first-class support for Anthropic's Model Context Protocol (MCP).",
              "By connecting Claude Desktop, Cursor IDE, or custom autonomous agents to the URPASS MCP Server (`https://urpass.space/api/mcp` or `npx urpass-mcp`), organizers can query live event registration counts, filter attendee rosters, approve speaker applications, and inspect gate velocity using natural language.",
            ],
            bullets: [
              "10 production-ready MCP tools covering event querying, attendee screening, and pass issuance",
              "Seamless integration with Claude Desktop, Cursor IDE, and LangChain/CrewAI agents",
              "Non-destructive pass verification and atomic pass redemption tools",
              "JSON-RPC 2.0 HTTPS transport and local stdio CLI execution",
            ],
            takeaway:
              "URPASS is the only event registration platform purpose-built for the emerging agentic AI software ecosystem.",
          },
        ],

        // 5-Step Process
        steps: [
          { n: "01", title: "Create Your Event", desc: "Define your international event details, pass tiers (Free, Paid, VIP), registration questions, and capacity caps in minutes." },
          { n: "02", title: "Customize Pass Design", desc: "Use Ticket Studio to style responsive digital passes, printable tickets, or conference lanyard badges with your brand identity." },
          { n: "03", title: "Distribute Public Link", desc: "Share your high-converting, mobile-optimized registration URL with zero-friction checkout and instant confirmation." },
          { n: "04", title: "Issue Fraud-Proof Passes", desc: "Attendees receive cryptographically signed QR passes directly via email, mobile web, or Apple Wallet compatible passes." },
          { n: "05", title: "Scan Fast & Analyze", desc: "Deploy door staff with standard smartphones to verify passes in <0.3s while tracking live arrival velocity curves in real time." },
        ],

        // Callout Box
        callout: {
          badge: "INTERNATIONAL RELIABILITY",
          title: "Built for international hackathons, academic summits, and enterprise conferences.",
          description:
            "From tech conferences across North America and Europe to developer summits in Asia and community meetups worldwide, URPASS by Yesp Corporation powers seamless gate management without heavy contracts or clunky hardware rentals.",
          bullets: [
            "Ultra-low latency worldwide powered by Supabase edge cloud infrastructure",
            "Zero friction for attendees — passes open instantly in mobile Safari and Chrome",
            "Multi-gate live sync across unlimited staff devices simultaneously",
            "Full data export with timestamped audit trails for all verified check-ins",
          ],
        },

        // Comprehensive Global FAQs (10+ detailed questions)
        faqs: [
          {
            q: "What makes URPASS different from Eventbrite for international events?",
            a: "URPASS operates on a zero-commission model (0% ticket cut vs Eventbrite's 3.7% + per-ticket fee), saving organizers thousands of dollars. Additionally, URPASS requires zero mobile app downloads for ticket scanning (runs entirely in mobile Safari/Chrome), validates passes in under 0.3s, offers native Model Context Protocol (MCP) tools for AI agents, and provides transparent monthly subscription pricing with a 30-day free trial requiring no credit card.",
          },
          {
            q: "Can international attendees check in without creating an account or downloading an app?",
            a: "Yes. Attendees register via your clean public event URL and instantly access their digital QR pass in their mobile browser, save it to their home screen, download a PDF badge, or open it via their email confirmation. Neither attendees nor gate volunteers ever need to download an app store application.",
          },
          {
            q: "Does URPASS charge per-ticket transaction percentage fees?",
            a: "No. URPASS never takes a percentage of your ticket sales. Organizers pay only a predictable flat monthly software subscription (or use our permanent Free tier for up to 100 registrations/month). All ticket revenues flow directly into your connected payment account.",
          },
          {
            q: "What devices can door staff use to scan passes at the venue?",
            a: "Any modern smartphone or tablet equipped with a camera running Apple Safari, Google Chrome, Mozilla Firefox, or Microsoft Edge can serve as an enterprise gate scanner. Staff simply navigate to your event's PIN-secured scanner link and begin scanning immediately.",
          },
          {
            q: "How does URPASS prevent ticket sharing, duplicate entries, and screenshot fraud?",
            a: "Every URPASS ticket features a cryptographically signed UUID token. When scanned, an atomic database transaction verifies and marks the ticket as checked in. If an attendee attempts to share a screenshot with a friend, subsequent scans immediately flash red with an 'Already Checked In' warning displaying the exact timestamp and gate of initial admission.",
          },
          {
            q: "What happens if venue Wi-Fi or cellular service is unstable?",
            a: "URPASS includes built-in offline gate resilience. Check-in manifests are cached locally in the browser via IndexedDB and service workers. If network connectivity drops, door staff can continue admitting attendees offline, with scans queued and synchronized automatically once network connectivity resumes.",
          },
          {
            q: "How many entrance gates and scanning staff can operate simultaneously?",
            a: "There is no limit on concurrent gates or scanning devices. Whether you deploy two volunteers at a community meetup or 20 staff across North, South, and VIP entrances at a multi-day conference, all scans synchronize in real time across the cloud.",
          },
          {
            q: "Can organizers review and approve attendees before issuing tickets?",
            a: "Yes. URPASS includes native approval workflows. Organizers can review registrant applications, screen custom form questions (such as portfolio links, university affiliations, or corporate credentials), and issue passes with a single click.",
          },
          {
            q: "What is the Model Context Protocol (MCP) server in URPASS?",
            a: "URPASS includes a production Model Context Protocol (MCP) server conforming to the open standard developed by Anthropic. It allows AI assistants like Claude Desktop, Cursor IDE, and autonomous agents to query events, filter attendees, screen applications, and inspect check-in velocity via natural language.",
          },
          {
            q: "Does URPASS offer a free trial?",
            a: "Yes. URPASS offers a 30-day free trial on all paid plans (Starter, Pro, and Business) with ₹0 / $0 due today and no credit card required. In addition, URPASS offers a permanent Free tier for up to 2 events per month and 100 registrations per month.",
          },
          {
            q: "How does enterprise multi-tenancy work in URPASS?",
            a: "Large organizations and universities can create corporate organizations with multiple workspaces (for departments, faculties, or regional teams), manage physical campus locations, assign Role-Based Access Control (RBAC) permissions, enforce SAML 2.0 / OIDC Single Sign-On, and automate directory synchronization via SCIM v2.",
          },
          {
            q: "Who operates URPASS globally?",
            a: "URPASS is engineered and operated globally by Yesp Corporation, a software product firm dedicated to high-performance event infrastructure and autonomous software tools.",
          },
        ],

        // Comprehensive Categorized Internal Links
        relatedLinks: [
          // Regional & Hubs
          { title: "India Event Registration Hub", href: "/in", category: "Location" },
          { title: "UK Event Registration Hub", href: "/uk", category: "Location" },
          { title: "Global Event Platform", href: "/global", category: "Location" },
          { title: "Bangalore Event Software", href: "/in/bangalore", category: "Location" },
          { title: "London Event Registration", href: "/uk/london", category: "Location" },
          // Products & Core Tech
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "Custom Pass & Badge Designer", href: "/design-your-ticket", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
          { title: "Model Context Protocol Hub", href: "/mcp-event-management", category: "Product" },
          { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Event Attendance Software", href: "/event-attendance-software", category: "Product" },
          // Alternatives & Comparisons
          { title: "Eventbrite Alternative (Global)", href: "/compare/eventbrite-alternative", category: "Comparison" },
          { title: "Eventbrite Alternative UK", href: "/uk/eventbrite-alternative", category: "Comparison" },
          { title: "Eventbrite Alternative India", href: "/compare/eventbrite-alternative-india", category: "Comparison" },
          { title: "Google Forms vs URPASS", href: "/compare/google-forms-vs-urpass", category: "Comparison" },
          { title: "Zoho Backstage Alternative", href: "/compare/zoho-backstage-alternative", category: "Comparison" },
          // Guides & Best Practices
          { title: "What is QR Event Check-In?", href: "/guides/what-is-qr-event-check-in", category: "Guide" },
          { title: "How to Check In 1,000 Attendees Quickly", href: "/guides/how-to-check-in-1000-attendees-quickly", category: "Guide" },
          { title: "Preventing Duplicate Event Entry", href: "/guides/prevent-duplicate-event-entry", category: "Guide" },
          { title: "Managing Multiple Venue Entrances", href: "/guides/how-to-manage-multiple-event-entrances", category: "Guide" },
          { title: "How to Create Digital Event Passes", href: "/guides/how-to-create-digital-event-passes", category: "Guide" },
          // Use Cases
          { title: "Conference Registration Software", href: "/conference-registration-software", category: "Use Case" },
          { title: "Hackathon Registration Platform", href: "/hackathon-registration-platform", category: "Use Case" },
          { title: "College Fest Management Software", href: "/college-fest-management-software", category: "Use Case" },
          { title: "Workshop Registration Software", href: "/workshop-registration-software", category: "Use Case" },
          { title: "Corporate Event Management", href: "/corporate-event-management", category: "Use Case" },
        ],
      }}
    />
  );
}
