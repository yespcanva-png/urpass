import { SeoGeoPageConfig } from "./seo-geo-template.types";

export const PAGE_001_CORPORATE_CONFIG: SeoGeoPageConfig = {
  pageNumber: "Page 001",
  pageId: "corporate-event-registration-software",
  slug: "corporate-event-registration-software",
  canonicalUrl: "https://urpass.space/solutions/corporate-event-registration-software",

  // Page Configuration
  primaryKeyword: "Corporate event registration software",
  secondaryKeywords: [
    "Corporate event ticketing",
    "QR event check-in",
    "employee event registration",
  ],
  market: "India, with global applicability",
  audience: "HR, administration, corporate event teams, agencies",
  searchIntent: "Commercial",
  conversionGoal: "Organizer signup",

  // SEO metadata
  seoTitle: "Corporate Event Registration Software | UrPass",
  metaDescription:
    "Simplify corporate event registration with UrPass. Create forms, issue digital QR passes, manage attendees, and track check-ins in one platform.",
  badge: "SOLUTIONS // CORPORATE & ENTERPRISE",
  h1: "Corporate Event Registration Software That Simplifies Every Check-In",

  // Hero Section
  heroSubtitle:
    "Plan your corporate event. Manage registrations. Welcome every attendee with confidence.",
  heroDescription:
    "From employee gatherings and business conferences to corporate seminars and networking events, UrPass brings event registration, digital ticketing, QR check-in, and attendance tracking into one easy-to-manage platform.",
  primaryCtaLabel: "Create Your First Event",
  secondaryCtaLabel: "See How UrPass Works",

  // Problem Section
  problemSection: {
    badge: "OPERATIONAL BOTTLENECKS",
    title: "Organizing a Corporate Event Shouldn't Be Complicated",
    paragraphs: [
      "Corporate events involve more than booking a venue and sending invitations.",
      "Event organizers often need to collect attendee information, manage registrations, communicate event details, prepare entry passes, and coordinate check-ins.",
      "Without a centralized system, these responsibilities can become scattered across spreadsheets, forms, emails, and manual checklists.",
      "UrPass helps bring these workflows together so your team can spend less time managing registrations and more time delivering a smooth event experience.",
    ],
  },

  // Capabilities / Features
  capabilitiesSection: {
    badge: "CORE SUITE CAPABILITIES",
    title: "Everything You Need to Manage Corporate Event Registrations",
    subtitle:
      "A complete operating system for internal company gatherings, client conferences, and executive summits.",
    items: [
      {
        stepNumber: "01",
        title: "Create a Professional Event Registration Page",
        description:
          "Set up a dedicated registration experience for your corporate event. Add important event information, configure registration fields, and give attendees a straightforward way to register.",
        bestFor:
          "Employee events, seminars, training programs, corporate conferences, and networking sessions.",
        technicalProof: "Serverless static site generation with edge-cached form submission and instant SSL.",
        icon: "file-text",
      },
      {
        stepNumber: "02",
        title: "Collect the Information You Actually Need",
        description:
          "Every corporate event has different registration requirements. Collect relevant attendee details using configurable registration forms, such as names, contact information, organizations, and other event-specific information. Keep registrations organized in one attendee management system.",
        bestFor:
          "Department allocations, dietary preferences, executive designations, and compliance requirements.",
        technicalProof: "Schema-validated custom JSON form fields with granular regex validation.",
        icon: "sliders",
      },
      {
        stepNumber: "03",
        title: "Issue Digital QR Event Passes",
        description:
          "Replace manual entry lists with digital QR passes. Registered attendees can receive their passes and present them at the event entrance. Each pass helps your team verify registrations during check-in.",
        bestFor:
          "Mobile-first ticket delivery via email & WhatsApp with Apple Wallet and gallery pass access.",
        technicalProof: "Dynamic cryptographic barcode generation with animated holographic security canvas.",
        icon: "qr-code",
      },
      {
        stepNumber: "04",
        title: "Make Event Entry Faster With QR Scanning",
        description:
          "Use UrPass QR scanning to validate attendee passes at the entrance. Your gate team can scan passes, identify invalid or duplicate entries, and manage check-ins. This reduces reliance on printed guest lists and manual verification.",
        bestFor:
          "High-throughput executive arrivals, lobby security gates, and multi-entrance convention foyers.",
        technicalProof: "Hardware-accelerated WebAssembly camera scanner operating at sub-0.3s (0.28s) latency.",
        icon: "scan-line",
      },
      {
        stepNumber: "05",
        title: "Monitor Event Attendance",
        description:
          "View event registration and check-in information from the organizer dashboard. Understand how many people have registered and track attendance as guests arrive. Use attendance information to support event coordination and post-event reporting.",
        bestFor:
          "Real-time headcount visibility, catering counts, fire safety roll calls, and executive audit logs.",
        technicalProof: "Real-time WebSocket data stream syncing arrival counts across all gate devices.",
        icon: "bar-chart-3",
      },
    ],
  },

  // Workflow / How It Works
  howItWorksSection: {
    badge: "5-STEP WORKFLOW",
    title: "How Corporate Event Registration Works With UrPass",
    steps: [
      {
        stepNumber: "Step 1",
        title: "Create your event",
        description:
          "Add the event title, date, venue, description, and registration settings.",
      },
      {
        stepNumber: "Step 2",
        title: "Customize registrations",
        description:
          "Configure attendee fields, approval requirements, and available ticket or pass options.",
      },
      {
        stepNumber: "Step 3",
        title: "Share your registration link",
        description:
          "Invite employees, partners, customers, or delegates to register.",
      },
      {
        stepNumber: "Step 4",
        title: "Distribute digital passes",
        description:
          "Give confirmed attendees access to their event passes.",
      },
      {
        stepNumber: "Step 5",
        title: "Scan and manage attendance",
        description:
          "Use QR scanning to check in guests and monitor event attendance.",
      },
    ],
    ctaLabel: "Create Your Corporate Event",
  },

  // Event Types / Use Cases
  eventTypesSection: {
    badge: "VERSATILE USE CASES",
    title: "Built for Different Types of Corporate Events",
    items: [
      {
        title: "Employee Engagement Events",
        description:
          "Manage registrations for internal celebrations, annual gatherings, and company activities.",
        badge: "INTERNAL COMMS",
      },
      {
        title: "Corporate Conferences",
        description:
          "Organize delegate registration and digital entry passes for business conferences.",
        badge: "CONFERENCES",
      },
      {
        title: "Seminars and Workshops",
        description:
          "Collect registrations and track participant attendance at professional learning events.",
        badge: "L&D & TRAINING",
      },
      {
        title: "Product Launches",
        description:
          "Coordinate guest registrations and event entry for product announcements and launch events.",
        badge: "GUEST ACCESS",
      },
      {
        title: "Business Networking Events",
        description:
          "Create a structured registration and attendee check-in experience for business networking sessions.",
        badge: "NETWORKING",
      },
    ],
  },

  // Comparison Table
  comparisonSection: {
    badge: "OPERATIONAL ADVANTAGE",
    title: "Why Use UrPass Instead of Manual Registration?",
    headers: ["Manual approach", "With UrPass"],
    rows: [
      {
        manual: "Registration spreadsheets",
        urpass: "Centralized attendee records",
      },
      {
        manual: "Printed guest lists",
        urpass: "Digital QR passes",
      },
      {
        manual: "Manual name verification",
        urpass: "QR-based pass validation",
      },
      {
        manual: "Separate registration tools",
        urpass: "Connected registration and ticketing",
      },
      {
        manual: "Manual attendance counting",
        urpass: "Check-in and attendance dashboard",
      },
    ],
    summaryText:
      "UrPass is designed to make registration and entry management simpler, especially when your team is coordinating multiple attendees and event activities.",
  },

  // Audience / Personas
  audienceSection: {
    badge: "WHO BENEFITS",
    title: "Who Can Use UrPass for Corporate Events?",
    leadText: "UrPass is suitable for:",
    audiences: [
      "HR and employee engagement teams",
      "Corporate administration teams",
      "Event management agencies",
      "Conference and seminar organizers",
      "Marketing and brand activation teams",
      "Business associations and professional communities",
    ],
    summaryText:
      "Whether you're coordinating an internal company event or managing registrations for an external business audience, UrPass gives your team a centralized registration workflow.",
  },

  // GEO-Ready Answer Block (for AI & Knowledge Engines)
  geoAnswerBlock: {
    question: "What is UrPass corporate event registration software?",
    answer:
      "UrPass is an event registration and digital ticketing platform that helps corporate event organizers create registration forms, manage attendees, issue QR passes, scan tickets at entry, and monitor attendance. It can be used for employee gatherings, seminars, conferences, workshops, and business events.",
    highlights: [
      "Custom branded registration portal with corporate fields",
      "Digital tamper-proof QR passes sent to email and WhatsApp",
      "Sub-0.3s gate check-in scanning on standard mobile phones",
      "Live attendance dashboard with instant CSV audit exports",
    ],
  },

  // Real Product Proof Section
  productProofSection: {
    badge: "PROVEN PRODUCTION ARCHITECTURE",
    title: "Real UrPass Software in Action",
    subtitle:
      "Built for reliability under real venue conditions. From custom form intake to entrance scanners and live operations.",
  },

  // Pricing Section
  pricingSection: {
    badge: "TRANSPARENT PRICING",
    title: "Simple, Predictable Plans for Corporate Teams",
    subtitle: "No surprise platform commissions or per-attendee checkout markups.",
    features: [
      "0% platform ticketing fee on all corporate registrations",
      "Free forever tier includes 1 event & up to 100 registrations",
      "Starter plan at ₹499/mo and Pro plan at ₹999/mo with unlimited scanners",
      "Business plan at ₹2,499/mo with executive approval workflows and custom branding",
      "Direct payouts into your company bank account via Razorpay or Stripe",
    ],
  },

  // FAQs
  faqSection: {
    badge: "QUESTIONS & ANSWERS",
    title: "Corporate Event Registration: Frequently Asked Questions",
    faqs: [
      {
        q: "What is corporate event registration software?",
        a: "Corporate event registration software helps organizations collect event registrations, organize attendee details, distribute invitations or passes, and manage event check-ins through a digital platform.",
      },
      {
        q: "Can I create a corporate event registration form online?",
        a: "Yes. UrPass allows organizers to create events and configure registration forms to collect relevant attendee information.",
      },
      {
        q: "Can attendees receive QR passes?",
        a: "Yes. UrPass supports digital QR passes that attendees can present during event entry.",
      },
      {
        q: "Can UrPass help prevent duplicate check-ins?",
        a: "UrPass QR scanning includes duplicate-entry detection to help gate staff identify passes that have already been scanned.",
      },
      {
        q: "Is UrPass suitable for employee events and conferences?",
        a: "Yes. UrPass can support registration and check-in workflows for employee events, workshops, seminars, networking programs, and corporate conferences.",
      },
      {
        q: "Do attendees need to create an organizer account?",
        a: "Attendees and organizers have different experiences. Event organizers manage events through their accounts, while attendee registration follows the configuration of the individual event.",
      },
      {
        q: "Can I track attendance during an event?",
        a: "Yes. UrPass includes registration and attendance management functionality, allowing organizers to monitor attendee check-in activity.",
      },
    ],
  },

  // Closing CTA
  closingCtaSection: {
    badge: "GET STARTED TODAY",
    title: "Planning a Corporate Event? Let's Make Registration Easier.",
    description:
      "Stop juggling registration spreadsheets, scattered attendee details, and manual entry processes. Create a professional corporate event registration experience with UrPass.",
    primaryCtaLabel: "Create Your First Event",
    secondaryCtaLabel: "View Pricing",
  },

  // Sales Lead Demo Form
  salesDemoSection: {
    badge: "CONSULT WITH OUR SOLUTIONS TEAM",
    title: "Need Help Setting Up Your Corporate Event?",
    description:
      "Tell us about your event and the registration experience you're looking for. Our team can review your requirements and help you understand how UrPass could support your event.",
    submitCtaLabel: "Request a Corporate Event Demo",
    disclaimer:
      "By submitting, you agree to be contacted regarding your enquiry. Any optional marketing consent should be collected separately.",
    tagline: "UrPass — From Event Registration to the Entrance.",
  },
};
