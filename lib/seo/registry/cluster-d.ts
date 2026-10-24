import { MarketingPageConfig } from "../types";

export const CLUSTER_D_PAGES: MarketingPageConfig[] = [
  // 35. /event-registration-software-india
  {
    slug: "event-registration-software-india",
    canonicalUrl: "https://urpass.space/event-registration-software-india",
    title: "Event Registration Software in India | UrPass",
    description: "Create online event registrations, custom forms, QR passes and attendance reports with UrPass event registration software.",
    h1: "Event Registration Software for Organizers in India",
    badge: "All-in-One Registration & Gate Ingress",
    cluster: "evergreen",
    audience: "Conference producers, corporate HR teams, college fest committees, exhibition coordinators, and event agencies in India.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Modernize event registrations across India with custom forms, approval workflows, instant UPI payments, digital QR passes, and sub-0.3s gate check-in.",
      openingAnswer: "UrPass is the modern event registration platform built for Indian organizers. It replaces disjointed Google Forms, manual UPI screenshot verification, and paper guest lists with an automated workflow. Publish custom branded registration forms, accept UPI payments directly via your own Razorpay, issue digital passes to WhatsApp and Apple Wallet, and verify thousands of attendees on standard volunteer smartphones.",
    },
    workflow: {
      title: "End-to-End Event Registration to Attendance Workflow",
      steps: [
        {
          step: 1,
          title: "Publish Custom Registration Form",
          desc: "Create your branded event portal with custom fields (text, textarea, dropdowns, secure file uploads), approval workflows, and capacity limits.",
        },
        {
          step: 2,
          title: "Automated Digital Pass Issuance",
          desc: "Confirmed attendees receive cryptographic QR passes delivered via WhatsApp and transactional email, ready to save to Apple Wallet or mobile galleries.",
        },
        {
          step: 3,
          title: "Sub-0.3s Smartphone Camera Check-in",
          desc: "Gate staff scan passes using standard mobile browsers (Chrome/Safari) with zero app downloads, blocking duplicate entries with atomic locking.",
        },
      ],
    },
    features: [
      {
        icon: "zap",
        title: "Direct UPI & Razorpay Settlement",
        desc: "Connect your verified Razorpay merchant account in 60 seconds. Accept GPay, PhonePe, Paytm, and cards with 0% platform commission.",
        bullets: ["Direct organizer bank settlement", "No post-event fund hold", "Sub-5 second UPI checkout"],
      },
      {
        icon: "shield",
        title: "Atomic Anti-Duplicate Protection",
        desc: "Prevent ticket forwarding across WhatsApp groups with transaction-safe PostgreSQL row-level locks that reject duplicate scans instantly.",
        bullets: ["Sub-0.3s camera scan on standard phones", "Instant duplicate alert", "Operator check-in audit logs"],
      },
      {
        icon: "chart",
        title: "Comprehensive Attendance Analytics",
        desc: "Monitor live headcount velocity across multiple gates. Export verified attendance logs directly to Excel/CSV for post-event reporting.",
        bullets: ["Gate-wise attendance distribution", "No-show tracking for catering audits", "Instant Excel/CSV export"],
      },
    ],
    practicalScenario: {
      title: "Annual Tech Conference in Bangalore with 2,400 Delegates",
      problem: "Organizers faced 45-minute morning lobby queues as volunteers struggled with paper name badges and cross-referencing manual bank transfers.",
      solution: "The conference adopted UrPass, automating delegate registration with direct Razorpay payments and deploying 4 volunteer smartphone scanners at the entrance.",
      outcome: "All 2,400 delegates entered within 30 minutes with an average scan speed of 1.2s. The committee saved ₹1.4 lakhs in ticketing fees.",
    },
    serviceComparison: {
      headline: "Self-Service Platform vs. Remote Managed Event Setup",
      selfServicePoints: [
        "Create, publish, and manage events directly from your dashboard",
        "Connect your Razorpay account with 0% platform commission",
        "Deploy unlimited volunteer scanners using simple 4-digit PINs",
        "Flat monthly software plans starting at ₹499/month",
      ],
      managedServicePoints: [
        "UrPass engineers remotely configure your registration forms, custom fields, and ticket tiers",
        "Custom branded pass design with your organization logo and theme colors",
        "Pre-event staff scanner orientation via Google Meet / Zoom",
        "Dedicated remote technical standby during peak event arrival hours",
      ],
      recommendedFor: "Self-Service is great for tech-comfortable teams; Remote Managed Setup is ideal for busy organizers who want done-for-you peace of mind.",
    },
    faqs: [
      {
        q: "What makes UrPass better than Google Forms for events in India?",
        a: "Google Forms cannot verify UPI payments automatically, cannot enforce hard capacity limits, cannot prevent duplicate submissions, and cannot scan QR codes at venue doors. UrPass automates all four.",
      },
      {
        q: "How does payment settlement work with Razorpay?",
        a: "UrPass integrates directly with your own Razorpay merchant account. 100% of ticket sales flow directly into your bank on standard T+2 rolling settlements.",
      },
      {
        q: "Do gate volunteers need to install any mobile application to scan passes?",
        a: "No. Volunteers simply open a secure web link on Chrome or Safari on their personal smartphones. No app installation or account creation is required.",
      },
      {
        q: "Can we collect documents like resumes or college ID cards during registration?",
        a: "Yes. UrPass supports secure file uploads (PDF, JPEG, PNG up to 5MB) with private Supabase Storage buckets, authorized access, and virus safety checks.",
      },
      {
        q: "What pricing plans does UrPass offer for Indian organizers?",
        a: "UrPass offers a 100-attendee Free tier, Starter at ₹499/month (500 registrations), Pro at ₹999/month (2,500 registrations), and Business at ₹2,499/month (10,000 registrations) with 0% platform ticket commissions.",
      },
    ],
    relatedSlugs: ["event-ticketing-software-india", "qr-event-check-in-software", "remote-managed-event-services", "self-service-vs-managed-events"],
  },

  // 36. /event-ticketing-software-india
  {
    slug: "event-ticketing-software-india",
    canonicalUrl: "https://urpass.space/event-ticketing-software-india",
    title: "Online Event Ticketing Software India | UrPass",
    description: "Manage paid event tickets, pricing tiers, digital passes and QR entry with UrPass. Explore self-service or remote setup.",
    h1: "Event Ticketing Software for Indian Organizers",
    badge: "0% Commission Paid Ticketing",
    cluster: "evergreen",
    audience: "Commercial event promoters, festival producers, conference organizers, training companies, and entertainment venues.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Sell event tickets online with 0% platform commission, direct Razorpay settlement, multi-tier pricing, and high-speed QR door scanning.",
      openingAnswer: "UrPass gives Indian event organizers a high-margin alternative to commercial ticketing aggregators. Stop giving away 5% to 10% of your gross ticket sales. Connect your own verified Razorpay account, publish mobile-optimized ticket checkout pages, accept UPI (GPay, PhonePe, Paytm) and cards, and scan attendees in sub-0.3 seconds at the door.",
    },
    workflow: {
      title: "Ticket Setup to Door Admission Workflow",
      steps: [
        {
          step: 1,
          title: "Configure Ticket Tiers & Pricing",
          desc: "Create Early Bird, General Admission, VIP, Student, and Group passes with individual pricing, tax rules, and inventory limits.",
        },
        {
          step: 2,
          title: "Direct UPI & Card Payment Settlement",
          desc: "Buyers complete checkout in 3 taps via UPI or cards. Revenue settles directly into your bank account on rolling T+2 days with 0% platform fee.",
        },
        {
          step: 3,
          title: "Multi-Gate QR Door Verification",
          desc: "Staff scan digital passes on smartphone cameras in 0.3s. Instant visual checks confirm ticket tier and prevent duplicate screenshot reuse.",
        },
      ],
    },
    features: [
      {
        icon: "card",
        title: "0% Commission Direct Settlement",
        desc: "Save lakhs in aggregator commission fees. Ticket revenues flow directly into your own Razorpay account with zero platform commission from UrPass.",
        bullets: ["Direct merchant bank settlement", "No 10-day post-event payment hold", "Sub-5s frictionless UPI checkout"],
      },
      {
        icon: "shield",
        title: "Cryptographic Anti-Duplicate Scanning",
        desc: "Prevent ticket forwarding across WhatsApp groups with single-redemption cryptographic verification backed by PostgreSQL row locks.",
        bullets: ["Instant duplicate scan warning", "Timestamped gate admission log", "Sub-0.3s camera scan on standard phones"],
      },
      {
        icon: "chart",
        title: "Live Box Office Telemetry",
        desc: "Monitor real-time sales velocity, discount code redemptions, and gate arrival rates from your organizer dashboard.",
        bullets: ["Real-time sales velocity graphs", "Discount and promo code tracking", "Automated GST-compliant invoices"],
      },
    ],
    practicalScenario: {
      title: "Commercial Business Summit with ₹15 Lakhs in Ticket Sales",
      problem: "A conference producer lost ₹1.5 lakhs in aggregator commissions in previous years and faced cash flow shortages when waiting 2 weeks for payouts.",
      solution: "The producer switched to UrPass on a flat ₹999/month Pro subscription, processing all ticket payments directly through their corporate Razorpay.",
      outcome: "Saved over ₹1.4 lakhs in net fees. Funds settled daily on rolling T+2 days, providing immediate liquidity to pay venue advances.",
    },
    serviceComparison: {
      headline: "Promoter Self-Service vs. Remote Managed Ticketing Setup",
      selfServicePoints: [
        "Connect Razorpay and launch ticket sales in 10 minutes",
        "Create promo codes and tiered ticket inventories directly",
        "Deploy door scanners using simple 4-digit PINs",
        "Keep 100% of ticket sales revenue with flat monthly pricing",
      ],
      managedServicePoints: [
        "UrPass team configures payment webhooks, ticket tiers, and capacity rules",
        "Custom branded pass design featuring event branding and sponsor logos",
        "Pre-event door staff orientation and gate load testing",
        "Active remote technical monitoring during peak arrival hours",
      ],
      recommendedFor: "Independent promoters love the self-service margins; large multi-hall summits benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "How does UrPass 0% commission work compared to BookMyShow or Townscript?",
        a: "Traditional aggregators charge 5% to 10% commission on every ticket sold and hold funds for 7 to 15 days. UrPass charges 0% commission on ticket sales; you only pay standard payment gateway fees (~2%) and a flat, predictable monthly software subscription.",
      },
      {
        q: "When do organizers receive ticket funds?",
        a: "Funds flow directly into your verified Razorpay merchant account and settle into your bank account on standard T+2 rolling business days.",
      },
      {
        q: "What payment methods are supported for attendees?",
        a: "Attendees can pay using all UPI apps (Google Pay, PhonePe, Paytm, Cred, BHIM), all major Credit/Debit Cards, Net Banking, and digital wallets.",
      },
      {
        q: "Can we create promo codes and early-bird discounts?",
        a: "Yes. You can configure percentage or flat-rate discount codes, set maximum usage counts, and specify start and end dates.",
      },
      {
        q: "Can we issue refunds if an attendee requests cancellation?",
        a: "Yes. You can process refunds directly from your Razorpay dashboard or UrPass console, which automatically revokes the customer's QR entry pass.",
      },
    ],
    relatedSlugs: ["event-registration-software-india", "qr-event-check-in-software", "remote-managed-event-services", "event-management-for-agencies"],
  },

  // 37. /qr-event-check-in-software
  {
    slug: "qr-event-check-in-software",
    canonicalUrl: "https://urpass.space/qr-event-check-in-software",
    title: "QR Code Event Check-in & Scanning Software | UrPass",
    description: "Scan event QR passes, manage guest entry, prevent duplicate scans and monitor live attendance using UrPass.",
    h1: "QR Event Check-in and Guest Entry Software",
    badge: "Sub-Second Ingress & Gate Operations",
    cluster: "evergreen",
    audience: "Gate operations managers, venue security leads, event coordinators, and registration desk staff.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Transform any smartphone into a sub-0.3s ticket scanner with zero app downloads, multi-gate duplicate prevention, and live telemetry.",
      openingAnswer: "UrPass delivers the fastest, most reliable event gate check-in experience available in a browser. Say goodbye to expensive rented barcode hardware, slow Bluetooth scanners, and paper guest lists. Point any iPhone or Android camera at arriving passes to verify tickets in under 0.3 seconds, backed by transaction-safe database verification.",
    },
    workflow: {
      title: "Gate Setup to Fast-Track Admission",
      steps: [
        {
          step: 1,
          title: "Generate Gate Scanner Links",
          desc: "Create secure scanner access links with 4-digit PINs for volunteers and security staff. No app download or account creation required.",
        },
        {
          step: 2,
          title: "Scan Arriving Digital Passes",
          desc: "Staff point smartphone cameras at digital passes on phone screens or printed badges. Verification happens in sub-0.3s.",
        },
        {
          step: 3,
          title: "Real-time Telemetry & Ingress Monitoring",
          desc: "Monitor live arrival rates, gate-wise traffic distribution, and capacity limits in real time on the organizer operations dashboard.",
        },
      ],
    },
    features: [
      {
        icon: "zap",
        title: "Sub-0.3s Browser Camera Scanning",
        desc: "Engineered with optimized WebAssembly barcode processing to scan passes directly from mobile browser windows (Chrome/Safari).",
        bullets: ["Works on any iOS or Android phone", "No native app installation needed", "Audible chime and haptic feedback"],
      },
      {
        icon: "shield",
        title: "Atomic Row-Level Duplicate Prevention",
        desc: "PostgreSQL transaction-safe concurrency ensures a ticket scanned at Gate 1 cannot simultaneously be used at Gate 2.",
        bullets: ["Instant duplicate scan alert", "Timestamped gate admission log", "Zero accidental duplicate admissions"],
      },
      {
        icon: "users",
        title: "Multi-Gate & Session Routing",
        desc: "Configure separate scanning lanes for General Admission, VIP, Speakers, and Re-entry with custom access permissions.",
        bullets: ["Role-based scanner PIN access", "Zone and track verification", "Instant guest directory search lookup"],
      },
    ],
    practicalScenario: {
      title: "Open-Air Music & Food Festival with 7,000 Visitors",
      problem: "A festival suffered gate crushes when rented optical barcode guns malfunctioned, creating 40-minute lines outside the venue.",
      solution: "Organizers switched to UrPass on the spot, sharing scanner PIN links with 12 volunteer phones across 4 main gates.",
      outcome: "Check-in rate reached 85 scans per minute across 12 phones. The entire entrance backlog was cleared in under 20 minutes.",
    },
    serviceComparison: {
      headline: "In-House Gate Crew vs. Remote Managed Gate Oversight",
      selfServicePoints: [
        "Deploy unlimited scanner devices using simple security PINs",
        "Monitor real-time scans on your organizer mobile dashboard",
        "Set re-entry rules and ticket revocation directly",
        "Flat software fee with no per-scan or device rental charges",
      ],
      managedServicePoints: [
        "UrPass team configures gate routing, lane allocations, and ticket rules",
        "Pre-event entrance simulation with simulated concurrent load testing",
        "Live remote technical monitoring and server auto-scaling during event",
        "Post-event comprehensive gate telemetry report",
      ],
      recommendedFor: "Standard events easily operate self-service; multi-acre outdoor festivals benefit from Remote Managed Setup.",
    },
    faqs: [
      {
        q: "What devices can staff use to scan passes?",
        a: "Any standard smartphone (iPhone or Android) with a camera. Staff open a secure scanner link on Safari or Chrome; no app download is needed.",
      },
      {
        q: "What happens if someone presents a screenshot from a friend who already entered?",
        a: "The scanner screen immediately flashes bright red with a clear duplicate alert showing the exact time and gate where the pass was previously redeemed.",
      },
      {
        q: "How many scanning devices can we use simultaneously?",
        a: "There is no limit on scanning devices on UrPass. You can deploy 2, 10, or 50 volunteer or bouncer smartphones scanning concurrently.",
      },
      {
        q: "Can scanner staff see private financial data or ticket revenue?",
        a: "No. The Gate Scanner interface only shows attendee name, ticket tier, check-in status, and notes. Financial data is strictly hidden.",
      },
      {
        q: "What if an attendee's phone battery is dead?",
        a: "Gate staff can look up the attendee instantly by name, email, or phone number on the scanner search bar and check them in manually.",
      },
    ],
    relatedSlugs: ["event-registration-software-india", "event-ticketing-software-india", "remote-managed-event-services", "self-service-vs-managed-events"],
  },

  // 38. /remote-managed-event-services
  {
    slug: "remote-managed-event-services",
    canonicalUrl: "https://urpass.space/remote-managed-event-services",
    title: "Remote Managed Event Registration & Ticketing | UrPass",
    description: "Let UrPass remotely configure event registrations, tickets, QR passes, invitations and scanner setup for your event.",
    h1: "Remote Managed Event Registration and Ticketing Services",
    badge: "Done-For-You Technical Setup & Support",
    cluster: "evergreen",
    audience: "Busy event directors, corporate HR teams, conference producers, and non-technical organizers needing white-glove setup.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Leave the technical setup to UrPass cloud engineers. We remotely configure your forms, ticket tiers, branded passes, and scanner access.",
      openingAnswer: "UrPass Remote Managed Services provide busy event organizers with complete done-for-you technical setup. Our cloud engineers build your custom registration forms, set up ticket tiers and payment routing, design branded digital QR passes, orient your gate staff remotely, and monitor check-in telemetry on event day.",
    },
    workflow: {
      title: "Remote Managed Service Delivery Process",
      steps: [
        {
          step: 1,
          title: "Technical Discovery & Briefing",
          desc: "Share your event schedule, ticket tiers, branding assets, and custom question requirements during a dedicated kickoff call.",
        },
        {
          step: 2,
          title: "Remote Engineering Configuration",
          desc: "Our engineers configure your registration portal, payment gateway webhooks, ticket capacity limits, and branded pass artwork.",
        },
        {
          step: 3,
          title: "Gate Crew Walkthrough & Rehearsal",
          desc: "We conduct a pre-event video orientation with your gate leads, run concurrency scanner tests, and provide live remote standby.",
        },
      ],
    },
    features: [
      {
        icon: "sparkles",
        title: "Bespoke Digital Pass Design",
        desc: "Our design team crafts branded digital QR tickets incorporating your organization's logo, color palette, and sponsor banners.",
        bullets: ["Brand-accurate pass layouts", "Apple Wallet pass integration", "Web pass accessible without app download"],
      },
      {
        icon: "shield",
        title: "Pre-Event Concurrency Simulation",
        desc: "We perform automated load testing against your event's database to verify gate scanning performance under high-arrival bursts.",
        bullets: ["Simulated concurrent check-in testing", "Gate lane allocation planning", "Zero gate queue guarantee"],
      },
      {
        icon: "clock",
        title: "Live Remote Technical Standby",
        desc: "A dedicated UrPass cloud engineer monitors your event's server telemetry and scanner performance during peak check-in hours.",
        bullets: ["Active monitoring during arrival rush", "Real-time technical troubleshooting", "Post-event attendance reconciliation"],
      },
    ],
    practicalScenario: {
      title: "National Healthcare Symposium with 1,800 Medical Delegates",
      problem: "A medical association lacked technical staff to configure complex workshop allocations and payment webhooks ahead of their annual conference.",
      solution: "They engaged UrPass Remote Managed Services. UrPass engineers configured all 6 workshop tracks and conducted a video rehearsal with registration staff.",
      outcome: "Registration and gate entry executed flawlessly. All 1,800 doctors were checked in smoothly, and the association saved 40 hours of manual technical setup.",
    },
    serviceComparison: {
      headline: "Package Comparison: Remote Managed Event Setup",
      selfServicePoints: [
        "Essential (₹1,000 / event): Up to 1,000 attendees, basic registration form, standard passes, business hours email support",
        "Pro (₹5,000 / event): Up to 5,000 attendees, custom branded passes, tiered ticketing, staff orientation, priority support",
        "Premium (₹15,000 / event): Up to 15,000 attendees, multi-gate routing, live remote standby coordinator, detailed telemetry audit",
        "Enterprise (₹49,000+ custom): 15,000+ attendees, custom integrations, multi-event annual roadmaps",
      ],
      managedServicePoints: [
        "UrPass provides 100% remote cloud configuration and technical supervision",
        "Organizer supplies gate staff, venue facilities, devices, and internet connectivity",
        "Zero on-site physical staffing (keeps costs 70% lower than traditional event agencies)",
        "Fixed, transparent per-event pricing with zero hidden surcharges",
      ],
      recommendedFor: "Organizers who want complete professional technical assurance without hiring internal web developers or event tech consultants.",
    },
    faqs: [
      {
        q: "Does UrPass provide on-site physical event staff or hardware scanners?",
        a: "No. All UrPass services are delivered remotely by our cloud engineers. The organizer provides venue facilities, smartphones, and gate staff. This remote model keeps our pricing 70% lower than traditional event production agencies.",
      },
      {
        q: "What is included in the Pro Managed Package (₹5,000)?",
        a: "The Pro package includes complete registration portal setup for up to 5,000 attendees, custom branded pass design, payment gateway configuration, volunteer scanner video walkthrough, and priority support.",
      },
      {
        q: "How far in advance should we request managed event setup?",
        a: "We recommend requesting managed setup at least 5 to 7 days before you intend to launch registration, allowing time for asset collection and client approval.",
      },
      {
        q: "Can UrPass help clean and import our existing attendee list?",
        a: "Yes. In the Pro, Premium, and Enterprise tiers, our team reviews, cleans, and imports your attendee CSV spreadsheets into the system.",
      },
      {
        q: "What happens if we need technical help on the day of the event?",
        a: "In our Premium and Enterprise tiers, a dedicated technical coordinator is on active remote standby via phone and Slack/WhatsApp throughout your arrival window.",
      },
    ],
    relatedSlugs: ["self-service-vs-managed-events", "event-registration-software-india", "event-ticketing-software-india", "event-management-for-agencies"],
  },

  // 39. /self-service-vs-managed-events
  {
    slug: "self-service-vs-managed-events",
    canonicalUrl: "https://urpass.space/self-service-vs-managed-events",
    title: "Self-Service vs Managed Event Platform | UrPass",
    description: "Compare UrPass self-service subscriptions and remote managed event services to choose the best registration and ticketing setup.",
    h1: "Self-Service vs Remote Managed Events: Which Fits You?",
    badge: "Service Model Decision Guide",
    cluster: "evergreen",
    audience: "Event decision makers, corporate executives, committee chairs, and organizers evaluating execution options.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Compare responsibilities, pricing models, support boundaries, and operational timelines to make the right choice for your event.",
      openingAnswer: "UrPass offers two proven paths to successful event execution: Self-Service Software and Remote Managed Services. Whether you prefer complete hands-on control using our intuitive dashboard or want our cloud engineers to remotely handle technical configuration, this guide provides an objective breakdown of responsibilities and costs.",
    },
    workflow: {
      title: "Decision Framework: Selecting Your Delivery Model",
      steps: [
        {
          step: 1,
          title: "Assess Technical Comfort & Bandwidth",
          desc: "If your team is comfortable with web forms and digital dashboards, Self-Service gives you instant control. If bandwidth is tight, Managed Setup saves hours.",
        },
        {
          step: 2,
          title: "Evaluate Event Complexity",
          desc: "Single-day meetups and simple registrations work great on self-service; multi-gate festivals and multi-track conferences benefit from managed testing.",
        },
        {
          step: 3,
          title: "Select & Launch Seamlessly",
          desc: "Sign up directly for self-service or submit a managed service inquiry. You can easily switch models between events as your needs evolve.",
        },
      ],
    },
    features: [
      {
        icon: "users",
        title: "Hands-on Control vs. Done-for-You Ease",
        desc: "Self-service gives you instant access to modify forms and tickets 24/7; managed services assign an engineer to do the work for you.",
        bullets: ["Direct dashboard editing (Self-Service)", "Expert technical configuration (Managed)", "Both feature 0% ticket commissions"],
      },
      {
        icon: "shield",
        title: "Clear Responsibility Boundaries",
        desc: "Understand exactly who does what. UrPass handles cloud software and remote configuration; the organizer manages venue, devices, and gate staff.",
        bullets: ["Transparent service boundaries", "No hidden on-site staffing claims", "Complete data ownership in both models"],
      },
      {
        icon: "card",
        title: "Predictable, Transparent Cost Structures",
        desc: "Choose between flat monthly subscriptions (₹499/mo to ₹2,499/mo) or per-event setup packages (₹1,000 to ₹15,000 per event).",
        bullets: ["Monthly subscriptions for recurring events", "Per-event fees for annual galas", "Zero per-ticket commissions in both"],
      },
    ],
    practicalScenario: {
      title: "College Alumni Association Decision Scenario",
      problem: "An alumni association organizing a 1,000-guest reunion had enthusiastic student volunteers but faculty leads with zero time to build forms.",
      solution: "They selected the Pro Managed Service (₹5,000). UrPass configured the ticketing portal and pass designs, while student volunteers operated scanners at the venue.",
      outcome: "Faculty spent zero hours on technical troubleshooting. Gates admitted all 1,000 guests in 18 minutes with complete attendance records.",
    },
    serviceComparison: {
      headline: "Responsibilities Matrix: Self-Service vs. Remote Managed",
      selfServicePoints: [
        "Software Access: Full access to organizer console, forms, ticket tiers, and scanner PINs",
        "Configuration: Handled directly by organizer via intuitive web dashboard",
        "Support: In-app knowledge base, documentation, and standard business-hours support",
        "Pricing: Flat monthly subscription starting at ₹499/month with 0% ticket fees",
      ],
      managedServicePoints: [
        "Software Access: Complete access plus dedicated remote engineer setup",
        "Configuration: Handled end-to-end by UrPass engineers based on your event brief",
        "Support: Pre-event video walkthrough, rehearsal testing, and active live remote standby",
        "Pricing: Transparent per-event setup packages (Essential ₹1,000, Pro ₹5,000, Premium ₹15,000)",
      ],
      recommendedFor: "Regular meetups and workshops thrive on Self-Service; high-profile annual galas and corporate summits thrive on Remote Managed Setup.",
    },
    faqs: [
      {
        q: "Can I start with Self-Service and upgrade to Remote Managed later if I get busy?",
        a: "Yes! If you start building an event in Self-Service and decide you'd rather have our team finish the configuration and conduct staff training, you can request Managed Setup anytime.",
      },
      {
        q: "Does Remote Managed Service include physical gate staff at the venue?",
        a: "No. UrPass provides remote cloud technical services only. The organizer provides venue facilities, staff, devices, and internet connectivity.",
      },
      {
        q: "Do both models have 0% platform ticket commissions?",
        a: "Yes! Whether you choose Self-Service or Remote Managed Setup, UrPass takes 0% commission on ticket sales.",
      },
      {
        q: "Which model is better for recurring weekly or monthly events?",
        a: "Self-Service with a monthly subscription (Starter at ₹499/mo or Pro at ₹999/mo) is typically much more cost-effective for recurring event series.",
      },
      {
        q: "Which model is better for high-stakes annual conferences with multi-gates?",
        a: "Remote Managed Setup (Pro or Premium) provides the peace of mind of pre-event load testing, gate configuration, and live remote standby.",
      },
    ],
    relatedSlugs: ["remote-managed-event-services", "event-registration-software-india", "event-ticketing-software-india", "qr-event-check-in-software"],
  },

  // 40. /event-management-for-agencies
  {
    slug: "event-management-for-agencies",
    canonicalUrl: "https://urpass.space/event-management-for-agencies",
    title: "Event Registration Software for Agencies | UrPass",
    description: "Manage client event registrations, ticketing, QR passes and attendance with UrPass for event management agencies.",
    h1: "Event Registration and Ticketing for Event Agencies",
    badge: "Agencies, Event Production & Corporate Planners",
    cluster: "evergreen",
    audience: "Event management agencies, experiential marketing firms, PR consultancies, and independent event producers.",
    status: "published",
    updatedAt: "2026-10-24T12:00:00Z",
    hero: {
      valueProposition: "Deliver flawless registration, branded client passes, and sub-second QR check-in across all your client accounts with 0% ticket commissions.",
      openingAnswer: "UrPass gives event management agencies a powerful, white-label friendly registration and check-in platform. Manage multiple client events under one account, issue branded digital QR passes with client monograms and sponsor logos, equip on-ground staff with smartphone scanners, and deliver audit-ready attendance analytics to your clients.",
    },
    workflow: {
      title: "Agency Event Production Workflow",
      steps: [
        {
          step: 1,
          title: "Build Client-Branded Registration Portals",
          desc: "Create bespoke registration portals matching your client's brand guidelines, custom questions, and sponsor placements.",
        },
        {
          step: 2,
          title: "Issue Client-Branded Digital Passes",
          desc: "Deliver custom passes featuring client logos, venue itineraries, and VIP classifications directly via WhatsApp and email.",
        },
        {
          step: 3,
          title: "Execute Rapid Multi-Gate Check-in",
          desc: "Equip your agency on-ground crew with smartphone scanners using simple PIN links. Export professional attendance reports for your client post-event.",
        },
      ],
    },
    features: [
      {
        icon: "users",
        title: "Multi-Client Event Architecture",
        desc: "Organize dozens of client events independently under your agency master account without data cross-contamination.",
        bullets: ["Centralized agency dashboard", "Independent event configurations", "Client-specific reporting exports"],
      },
      {
        icon: "sparkles",
        title: "Bespoke Client Pass Styling",
        desc: "Customize digital pass layouts with client logos, primary brand colors, sponsor logos, and VIP badge indicators.",
        bullets: ["Client brand color matching", "Apple Wallet pass integration", "Web passes without third-party app branding"],
      },
      {
        icon: "shield",
        title: "Rapid On-Ground Crew Deployment",
        desc: "Onboard temporary agency ground staff in 30 seconds using role-based Gate PIN links that work on their personal smartphones.",
        bullets: ["Zero app download needed for crew", "Sub-0.3s camera scan on standard phones", "Audited entrance logs for client signoff"],
      },
    ],
    practicalScenario: {
      title: "Event Agency Producing 4 Product Launches in One Month",
      problem: "An experiential agency spent ₹1.2 lakhs on rented barcode scanners and aggregator fees across 4 client product launches.",
      solution: "The agency standardized on UrPass Business tier, deploying mobile browser scanners on crew phones across all 4 events.",
      outcome: "Saved over ₹1.1 lakhs in equipment rentals and ticketing fees. Client marketing heads praised the instant check-in speed and clean post-event analytics.",
    },
    serviceComparison: {
      headline: "Agency Self-Service vs. Remote Managed Agency Partnerships",
      selfServicePoints: [
        "Agency team manages unlimited client events directly on the Business plan",
        "Connect client Razorpay accounts directly or collect fees centrally",
        "Deploy temporary agency crew using simple 4-digit security PINs",
        "Flat monthly agency subscription with 0% ticket commissions",
      ],
      managedServicePoints: [
        "UrPass serves as your agency's white-glove technical backend partner",
        "Our engineers configure forms, capacity rules, and custom pass artwork",
        "Pre-event entrance simulation testing and gate crew walkthroughs",
        "Dedicated remote technical standby during client gala hours",
      ],
      recommendedFor: "Agencies with internal production teams love self-service; agencies seeking white-glove technical execution choose Remote Managed Partnerships.",
    },
    faqs: [
      {
        q: "Can we connect different Razorpay accounts for different clients?",
        a: "Yes! You can configure client-specific Razorpay merchant credentials per event, so ticket revenues flow directly into your client's corporate bank account.",
      },
      {
        q: "Can we remove UrPass branding from client passes?",
        a: "Yes. Our Business tier and Pro tier include white-label pass customization, allowing you to showcase your client's branding prominently.",
      },
      {
        q: "How many crew members can scan passes at the same time?",
        a: "There is no limit on scanning devices. Your agency can deploy 5, 20, or 50 crew members scanning concurrently at large client galas.",
      },
      {
        q: "Can we export clean attendance spreadsheets for client reporting?",
        a: "Yes. You can export complete timestamped attendance logs with attendee names, emails, check-in gates, and custom field responses directly to Excel/CSV.",
      },
      {
        q: "Can UrPass act as a white-label remote technical partner for our agency?",
        a: "Yes! Through our Remote Managed Service, our engineers configure event forms and passes behind the scenes, allowing your agency to deliver flawless tech to your clients.",
      },
    ],
    relatedSlugs: ["remote-managed-event-services", "self-service-vs-managed-events", "event-registration-software-india", "qr-event-check-in-software"],
  },
];
