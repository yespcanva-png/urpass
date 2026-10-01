export type TemplateComplexity = "Simple" | "Standard" | "Advanced";

export type EventTemplateCategory =
  | "All"
  | "Corporate"
  | "Conference"
  | "Campus"
  | "Workshop"
  | "Exhibition"
  | "Networking"
  | "Product Launch"
  | "Hackathon"
  | "Sports"
  | "RSVP"
  | "Private / VIP"
  | "Paid Event"
  | "Internal Employee Event"
  | "Multi-Gate Event"
  | "High-Volume Event";

// Alias for backwards compatibility
export type TemplateCategory = EventTemplateCategory;

export interface EventTemplateConfig {
  eventDefaults: {
    title: string;
    eventType: string;
    expectedAttendees: number;
    durationDays: number;
    isVirtual: boolean;
  };
  registrationConfig: {
    fields: Array<{ name: string; label: string; type: string; required: boolean }>;
    approvalRequired: boolean;
    registrationLimits?: number;
    isRsvp: boolean;
    isPublic: boolean;
  };
  ticketConfig: {
    passTemplateId: string;
    ticketTypes: Array<{ name: string; price: number; capacity?: number; badgeTier?: string }>;
    qrSettings: { scanTimeoutMs: number; dynamicToken: boolean };
  };
  accessConfig: {
    gates: Array<{ id: string; name: string; allowedTiers: string[] }>;
    zones: string[];
    allowCheckIn: boolean;
    allowCheckOut: boolean;
  };
  paymentConfig: {
    isPaid: boolean;
    currency: string;
    platformFeeBearer: "organizer" | "attendee";
  };
  notificationConfig: {
    emailEnabled: boolean;
    whatsAppEnabled: boolean;
    sendConfirmation: boolean;
    sendReminder: boolean;
  };
  brandingConfig: {
    primaryColor: string;
    logoPlaceholder?: string;
  };
  analyticsConfig: {
    trackGatePace: boolean;
    trackDropOff: boolean;
  };
}

export interface EventSetupTemplate {
  id: string;
  name: string;
  category: EventTemplateCategory;
  secondaryCategory?: string;
  subtitle: string;
  bestFor: string;
  complexity: TemplateComplexity;
  featured?: boolean;
  chips: string[];
  accentColor: string;
  version: string;
  ownerType?: "system" | "organization";
  organizationName?: string;
  config: EventTemplateConfig;
  formFields: string[];
  approvalWorkflow: "Automatic Confirmation" | "Manual Review & Approval" | "Invite-Only Token" | "Paid Instant Ticket";
  gateConfig: "Single Gate Check-in" | "Multi-Gate Turnstiles" | "VIP & Executive Gate" | "Zone & Session Access";
  confirmationDetails: string;
  includedFeatures: string[];
  eventPage: {
    heroTitle: string;
    heroSubtitle: string;
    badge: string;
    date: string;
    venue: string;
    highlights: string[];
  };
  registrationForm: {
    formTitle: string;
    fields: Array<{ label: string; placeholder: string; required: boolean; type?: string }>;
    submitButtonText: string;
  };
  qrPass: {
    passType: string;
    tier: string;
    primaryColor: string;
    attendeeName: string;
    role: string;
    qrToken: string;
    venue: string;
    date: string;
  };
  lanyardBadge: {
    badgeType: string;
    strapColor: string;
    strapLabel: string;
    clipColor: "silver" | "gold" | "black";
    attendeeName: string;
    organization: string;
    accessBarText: string;
    accessColor: string;
  };
}

export const EVENT_SETUP_TEMPLATES: EventSetupTemplate[] = [
  // 1. Corporate Conference (Featured #1)
  {
    id: "corporate-conference",
    name: "Corporate Conference",
    category: "Corporate",
    secondaryCategory: "Conference",
    subtitle: "Complete operational setup for enterprise conferences, summits, and leadership forums.",
    bestFor: "Conferences, seminars & business summits",
    complexity: "Standard",
    featured: true,
    chips: ["Registration", "QR Pass", "Approval", "Multi-Gate"],
    accentColor: "#0F172A",
    version: "v2.1",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Annual Global Conference 2026",
        eventType: "conference",
        expectedAttendees: 600,
        durationDays: 2,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "email", label: "Work Email", type: "email", required: true },
          { name: "phone", label: "Mobile Number", type: "tel", required: true },
          { name: "company", label: "Company", type: "text", required: true },
          { name: "title", label: "Designation", type: "text", required: true },
        ],
        approvalRequired: false,
        registrationLimits: 600,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "corporate-minimal",
        ticketTypes: [
          { name: "General Delegate", price: 0, capacity: 450, badgeTier: "DELEGATE" },
          { name: "Speaker Pass", price: 0, capacity: 50, badgeTier: "SPEAKER" },
          { name: "VIP Executive", price: 499, capacity: 100, badgeTier: "VIP" },
        ],
        qrSettings: { scanTimeoutMs: 300, dynamicToken: true },
      },
      accessConfig: {
        gates: [
          { id: "gate-a", name: "Main Turnstile Gate", allowedTiers: ["DELEGATE", "SPEAKER", "VIP"] },
          { id: "gate-vip", name: "Executive VIP Lounge", allowedTiers: ["VIP", "SPEAKER"] },
        ],
        zones: ["Main Hall", "Breakout Rooms", "VIP Lounge"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#0F172A" },
      analyticsConfig: { trackGatePace: true, trackDropOff: true },
    },
    formFields: ["Full Name", "Work Email", "Phone", "Company", "Designation"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "Instant email confirmation with ICS calendar invite and digital QR pass.",
    includedFeatures: [
      "Registration form with professional field logic",
      "Delegate / Speaker / VIP passes preconfigured",
      "Sub-0.3s camera turnstile scanning",
      "Email & WhatsApp ticket delivery",
      "General + VIP gates segregation",
      "Live attendance drop-off analytics",
    ],
    eventPage: {
      heroTitle: "Global Tech Summit 2026",
      heroSubtitle: "Connecting 1,200+ enterprise leaders, engineers, and product visionaries.",
      badge: "EXECUTIVE CONFERENCE",
      date: "Thursday, 24 October 2026 · 09:00 AM",
      venue: "Grand Ballroom, Convention Center, Bangalore",
      highlights: ["3 Keynote Stages", "40+ Industry Speakers", "VIP Networking Lounge"],
    },
    registrationForm: {
      formTitle: "Conference Delegate Accreditation",
      fields: [
        { label: "Full Name", placeholder: "e.g. Dr. Rajesh Kumar", required: true },
        { label: "Work Email", placeholder: "rajesh@enterprise.com", required: true, type: "email" },
        { label: "Phone Number", placeholder: "+91 98765 43210", required: true, type: "tel" },
        { label: "Company / Organization", placeholder: "Acme Enterprises Corp", required: true },
        { label: "Designation / Title", placeholder: "Chief Technology Officer", required: true },
      ],
      submitButtonText: "Confirm Registration",
    },
    qrPass: {
      passType: "Executive Delegate Pass",
      tier: "DELEGATE ACCESS",
      primaryColor: "#0F172A",
      attendeeName: "DR. RAJESH KUMAR",
      role: "CTO · ACME ENTERPRISES",
      qrToken: "URP-CORP-CONF-849204",
      venue: "Main Convention Hall",
      date: "24 OCT 2026",
    },
    lanyardBadge: {
      badgeType: "Executive Lanyard Badge",
      strapColor: "#0F172A",
      strapLabel: "DELEGATE",
      clipColor: "silver",
      attendeeName: "DR. RAJESH KUMAR",
      organization: "Acme Enterprises Corp",
      accessBarText: "ALL SESSIONS ACCESS",
      accessColor: "#0F172A",
    },
  },

  // 2. Annual General Meeting (AGM)
  {
    id: "annual-general-meeting",
    name: "Annual General Meeting",
    category: "Corporate",
    subtitle: "Accredited shareholder verification, quorum check-in, and formal proxy tracking.",
    bestFor: "Corporate AGMs, board meetings & shareholder assemblies",
    complexity: "Standard",
    chips: ["Shareholder Token", "Quorum Check-in", "Strict Approval"],
    accentColor: "#1E293B",
    version: "v1.4",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Annual General Meeting of Shareholders 2026",
        eventType: "corporate",
        expectedAttendees: 300,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "shareholderFolio", label: "DP ID / Folio Number", type: "text", required: true },
          { name: "fullName", label: "Registered Shareholder Name", type: "text", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
          { name: "sharesCount", label: "Holding Shares Count", type: "number", required: true },
        ],
        approvalRequired: true,
        isRsvp: true,
        isPublic: false,
      },
      ticketConfig: {
        passTemplateId: "executive-blue",
        ticketTypes: [
          { name: "Shareholder", price: 0, capacity: 250, badgeTier: "SHAREHOLDER" },
          { name: "Proxy Delegate", price: 0, capacity: 50, badgeTier: "PROXY" },
        ],
        qrSettings: { scanTimeoutMs: 250, dynamicToken: true },
      },
      accessConfig: {
        gates: [{ id: "quorum-gate", name: "Quorum Verification Gate", allowedTiers: ["SHAREHOLDER", "PROXY"] }],
        zones: ["Board Assembly Hall"],
        allowCheckIn: true,
        allowCheckOut: false,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#1E293B" },
      analyticsConfig: { trackGatePace: true, trackDropOff: false },
    },
    formFields: ["DP ID / Folio", "Shareholder Name", "Email", "Holding Shares Count"],
    approvalWorkflow: "Manual Review & Approval",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Strict ledger approval with encrypted audit quorum pass.",
    includedFeatures: [
      "Shareholder Folio number verification",
      "Manual registrar review and approval",
      "Real-time quorum headcount counter",
      "Immutable entry check-in log",
    ],
    eventPage: {
      heroTitle: "38th Annual General Meeting",
      heroSubtitle: "Official shareholder assembly and governance proceedings.",
      badge: "SHAREHOLDER ACCREDITATION",
      date: "Friday, 18 September 2026 · 10:30 AM",
      venue: "Auditorium Hall, Apex Towers, Mumbai",
      highlights: ["Quorum Verification", "Voting Resolution Desk", "Annual Report Briefing"],
    },
    registrationForm: {
      formTitle: "Shareholder Verification & Entry",
      fields: [
        { label: "DP ID / Client Folio No.", placeholder: "IN300123-10928374", required: true },
        { label: "Full Shareholder Name", placeholder: "Vikram Singhania", required: true },
        { label: "Registered Email", placeholder: "vikram.s@investor.in", required: true, type: "email" },
        { label: "Number of Shares Held", placeholder: "500", required: true, type: "number" },
      ],
      submitButtonText: "Submit for Quorum Approval",
    },
    qrPass: {
      passType: "Accredited Shareholder Pass",
      tier: "SHAREHOLDER",
      primaryColor: "#1E293B",
      attendeeName: "VIKRAM SINGHANIA",
      role: "FOLIO #IN300123-1092",
      qrToken: "URP-AGM-QUORUM-92182",
      venue: "Apex Towers, Mumbai",
      date: "18 SEP 2026",
    },
    lanyardBadge: {
      badgeType: "Shareholder Pass",
      strapColor: "#1E293B",
      strapLabel: "SHAREHOLDER",
      clipColor: "silver",
      attendeeName: "VIKRAM SINGHANIA",
      organization: "Apex Industries Ltd",
      accessBarText: "VOTING ELIGIBLE",
      accessColor: "#1E293B",
    },
  },

  // 3. Employee Town Hall
  {
    id: "employee-town-hall",
    name: "Employee Town Hall",
    category: "Internal Employee Event",
    secondaryCategory: "Corporate",
    subtitle: "Internal company all-hands with corporate domain authentication and cafeteria check-in.",
    bestFor: "Internal all-hands, leadership town halls & quarterly reviews",
    complexity: "Simple",
    chips: ["Domain Restriction", "RSVP", "Internal Badge"],
    accentColor: "#2563EB",
    version: "v1.2",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Q3 Global Company Town Hall",
        eventType: "corporate",
        expectedAttendees: 800,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "employeeId", label: "Employee ID", type: "text", required: true },
          { name: "fullName", label: "Employee Name", type: "text", required: true },
          { name: "department", label: "Department / Team", type: "text", required: true },
        ],
        approvalRequired: false,
        isRsvp: true,
        isPublic: false,
      },
      ticketConfig: {
        passTemplateId: "tech-pulse",
        ticketTypes: [{ name: "Employee", price: 0, capacity: 800, badgeTier: "TEAM" }],
        qrSettings: { scanTimeoutMs: 200, dynamicToken: false },
      },
      accessConfig: {
        gates: [{ id: "atrium-gate", name: "Main Atrium Entrance", allowedTiers: ["TEAM"] }],
        zones: ["Main Amphitheatre", "Cafeteria Lunch"],
        allowCheckIn: true,
        allowCheckOut: false,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: false, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#2563EB" },
      analyticsConfig: { trackGatePace: true, trackDropOff: false },
    },
    formFields: ["Employee ID", "Full Name", "Department"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Instant calendar ICS invite with digital company pass.",
    includedFeatures: [
      "Company domain-restricted access",
      "One-click internal RSVP",
      "Sub-0.2s turnstile check-in",
      "Department attendance breakdown",
    ],
    eventPage: {
      heroTitle: "Q3 Vision & Leadership Town Hall",
      heroSubtitle: "Connecting 800+ team members for quarterly roadmap announcements.",
      badge: "INTERNAL ALL-HANDS",
      date: "Wednesday, 14 October 2026 · 03:00 PM",
      venue: "Grand Amphitheatre & Live Stream, Tech Park Campus",
      highlights: ["Executive AMA Session", "Product Roadmap Preview", "Team Awards"],
    },
    registrationForm: {
      formTitle: "Employee Attendance Confirmation",
      fields: [
        { label: "Employee ID", placeholder: "EMP-4920", required: true },
        { label: "Full Name", placeholder: "Priya Sundaram", required: true },
        { label: "Department / Pod", placeholder: "Product Engineering", required: true },
      ],
      submitButtonText: "Confirm Attendance",
    },
    qrPass: {
      passType: "Employee Digital Pass",
      tier: "EMPLOYEE ALL-ACCESS",
      primaryColor: "#2563EB",
      attendeeName: "PRIYA SUNDARAM",
      role: "STAFF SOFTWARE ENGINEER",
      qrToken: "URP-EMP-TOWN-29104",
      venue: "Tech Park Amphitheatre",
      date: "14 OCT 2026",
    },
    lanyardBadge: {
      badgeType: "Employee Badge",
      strapColor: "#2563EB",
      strapLabel: "TEAM",
      clipColor: "silver",
      attendeeName: "PRIYA SUNDARAM",
      organization: "Enterprise Tech Labs",
      accessBarText: "ALL-HANDS DELEGATE",
      accessColor: "#2563EB",
    },
  },

  // 4. Product Launch
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Product Launch",
    secondaryCategory: "Corporate",
    subtitle: "High-impact brand launch setup with press embargo tokens and demo zone access.",
    bestFor: "Hardware launches, SaaS keynotes, press days & demo events",
    complexity: "Standard",
    chips: ["Press Access", "Embargo Token", "Demo Zones"],
    accentColor: "#4F46E5",
    version: "v2.0",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Horizon 4.0 Product Reveal",
        eventType: "corporate",
        expectedAttendees: 400,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "mediaOutlet", label: "Publication / Company", type: "text", required: true },
          { name: "email", label: "Work Email", type: "email", required: true },
        ],
        approvalRequired: true,
        isRsvp: true,
        isPublic: false,
      },
      ticketConfig: {
        passTemplateId: "future-grid",
        ticketTypes: [
          { name: "Press & Media", price: 0, capacity: 100, badgeTier: "PRESS" },
          { name: "Partner VIP", price: 0, capacity: 150, badgeTier: "PARTNER" },
          { name: "Customer Attendee", price: 0, capacity: 150, badgeTier: "GUEST" },
        ],
        qrSettings: { scanTimeoutMs: 300, dynamicToken: true },
      },
      accessConfig: {
        gates: [
          { id: "keynote-gate", name: "Keynote Hall", allowedTiers: ["PRESS", "PARTNER", "GUEST"] },
          { id: "hands-on-gate", name: "Hands-on Experience Lab", allowedTiers: ["PRESS", "PARTNER"] },
        ],
        zones: ["Auditorium", "Hands-on Lab"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#4F46E5" },
      analyticsConfig: { trackGatePace: true, trackDropOff: true },
    },
    formFields: ["Full Name", "Media Outlet / Publication", "Work Email"],
    approvalWorkflow: "Manual Review & Approval",
    gateConfig: "VIP & Executive Gate",
    confirmationDetails: "Embargo agreement confirmation with secure digital access pass.",
    includedFeatures: [
      "Media credential review workflow",
      "Keynote & Hands-on Demo Lab segregation",
      "Embargo QR token validation",
      "Press kit auto-dispatch on check-in",
    ],
    eventPage: {
      heroTitle: "Next-Gen Keynote '26",
      heroSubtitle: "Witness the launch of our autonomous AI infrastructure platform.",
      badge: "GLOBAL PRODUCT UNPACKED",
      date: "Tuesday, 03 November 2026 · 11:00 AM",
      venue: "Dome Experience Center, Cyber City, Gurgaon",
      highlights: ["Live Hardware Keynote", "Exclusive Press Q&A", "Hands-on Device Pavilions"],
    },
    registrationForm: {
      formTitle: "Press Accreditation & RSVP",
      fields: [
        { label: "Journalist / Analyst Name", placeholder: "Arunav Sen", required: true },
        { label: "Publication / Outlet", placeholder: "TechCrunch / The Ken", required: true },
        { label: "Press Email", placeholder: "arunav@techpress.com", required: true, type: "email" },
      ],
      submitButtonText: "Apply for Press Accreditation",
    },
    qrPass: {
      passType: "Press Accreditation Pass",
      tier: "PRESS & MEDIA",
      primaryColor: "#4F46E5",
      attendeeName: "ARUNAV SEN",
      role: "CHIEF TECH CORRESPONDENT",
      qrToken: "URP-PRESS-UNPACK-4821",
      venue: "Dome Center, Cyber City",
      date: "03 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Press Lanyard Badge",
      strapColor: "#4F46E5",
      strapLabel: "PRESS",
      clipColor: "silver",
      attendeeName: "ARUNAV SEN",
      organization: "Tech Press Guild",
      accessBarText: "FULL LAB ACCESS",
      accessColor: "#4F46E5",
    },
  },

  // 5. Business Networking Event
  {
    id: "networking-meetup",
    name: "Business Networking Event",
    category: "Networking",
    secondaryCategory: "Corporate",
    subtitle: "High-value connection mixer with digital vCard QR exchange and attendee matchmaking tags.",
    bestFor: "Founder mixers, investor roundtables, B2B speed networking & alumni meetups",
    complexity: "Simple",
    chips: ["vCard QR", "Curated Guests", "Matchmaking Tags"],
    accentColor: "#059669",
    version: "v1.5",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Founders & Venture Capital Mixer",
        eventType: "meetup",
        expectedAttendees: 150,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "linkedin", label: "LinkedIn Profile URL", type: "url", required: true },
          { name: "industry", label: "Focus Sector", type: "text", required: true },
        ],
        approvalRequired: true,
        isRsvp: true,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "networking-pro",
        ticketTypes: [
          { name: "Founder", price: 0, capacity: 100, badgeTier: "FOUNDER" },
          { name: "Investor", price: 0, capacity: 50, badgeTier: "INVESTOR" },
        ],
        qrSettings: { scanTimeoutMs: 300, dynamicToken: false },
      },
      accessConfig: {
        gates: [{ id: "lounge-gate", name: "Rooftop Terrace Entrance", allowedTiers: ["FOUNDER", "INVESTOR"] }],
        zones: ["Rooftop Lounge", "Pitch Corner"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#059669" },
      analyticsConfig: { trackGatePace: false, trackDropOff: false },
    },
    formFields: ["Full Name", "Company / Fund", "LinkedIn URL", "Industry Focus"],
    approvalWorkflow: "Manual Review & Approval",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Approved invite with dynamic contact exchange QR code.",
    includedFeatures: [
      "Curated founder/investor vetting",
      "Dynamic contact badge generation",
      "Sub-second camera door check-in",
      "Post-event connection roster export",
    ],
    eventPage: {
      heroTitle: "Founders & Leaders Mixer",
      heroSubtitle: "An intimate evening with 150 top venture-backed founders and active angels.",
      badge: "CURATED NETWORKING",
      date: "Friday, 20 November 2026 · 07:00 PM",
      venue: "Skyline Terrace, Indiranagar, Bangalore",
      highlights: ["1:1 Dealmaking Corner", "Open Bar & Hors d'oeuvres", "No Keynotes, Only Connections"],
    },
    registrationForm: {
      formTitle: "Mixer Request for Invite",
      fields: [
        { label: "Full Name", placeholder: "Rohan Varma", required: true },
        { label: "Company / Venture Name", placeholder: "HyperScale AI", required: true },
        { label: "LinkedIn Profile URL", placeholder: "linkedin.com/in/rohanvarma", required: true },
        { label: "Fundraising Stage", placeholder: "Series A / Looking to connect", required: true },
      ],
      submitButtonText: "Request Private Invitation",
    },
    qrPass: {
      passType: "Digital Networking Pass",
      tier: "FOUNDER ACCESS",
      primaryColor: "#059669",
      attendeeName: "ROHAN VARMA",
      role: "FOUNDER · HYPERSCALE AI",
      qrToken: "URP-MIXER-FOUNDER-8421",
      venue: "Skyline Lounge, Indiranagar",
      date: "20 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Networking Credential",
      strapColor: "#059669",
      strapLabel: "FOUNDER",
      clipColor: "gold",
      attendeeName: "ROHAN VARMA",
      organization: "HyperScale AI",
      accessBarText: "INVESTOR LOUNGE",
      accessColor: "#059669",
    },
  },

  // 6. Trade Exhibition
  {
    id: "trade-exhibition",
    name: "Trade Exhibition",
    category: "Exhibition",
    secondaryCategory: "High-Volume Event",
    subtitle: "Enterprise B2B trade show architecture with Exhibitor, Buyer, and Trade Visitor badge streams.",
    bestFor: "Industrial expos, buyer-seller trade meets, tech expos & trade fairs",
    complexity: "Advanced",
    chips: ["Exhibitor vs Buyer", "Hall Access", "Lead Badge"],
    accentColor: "#D97706",
    version: "v2.2",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "International Industrial Expo 2026",
        eventType: "exhibition",
        expectedAttendees: 5000,
        durationDays: 3,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "company", label: "Company Name", type: "text", required: true },
          { name: "taxId", label: "GSTIN / Business Registration", type: "text", required: false },
          { name: "category", label: "Badge Category", type: "text", required: true },
        ],
        approvalRequired: false,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "expo-pro",
        ticketTypes: [
          { name: "Trade Visitor", price: 0, capacity: 4000, badgeTier: "VISITOR" },
          { name: "Exhibitor Booth Pass", price: 0, capacity: 800, badgeTier: "EXHIBITOR" },
          { name: "VIP Buyer", price: 999, capacity: 200, badgeTier: "BUYER" },
        ],
        qrSettings: { scanTimeoutMs: 250, dynamicToken: false },
      },
      accessConfig: {
        gates: [
          { id: "hall-1", name: "Hall 1 Entrance", allowedTiers: ["VISITOR", "EXHIBITOR", "BUYER"] },
          { id: "hall-2", name: "Hall 2 Machinery", allowedTiers: ["VISITOR", "EXHIBITOR", "BUYER"] },
          { id: "b2b-lounge", name: "VIP Buyer Lounge", allowedTiers: ["BUYER", "EXHIBITOR"] },
        ],
        zones: ["Hall 1", "Hall 2", "B2B Lounge"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: true, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#D97706" },
      analyticsConfig: { trackGatePace: true, trackDropOff: true },
    },
    formFields: ["Full Name", "Company", "GSTIN", "Procurement Role"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "Instant thermal badge credential with barcode and lead retrieval QR.",
    includedFeatures: [
      "Separate Exhibitor / Buyer / Visitor registration pathways",
      "Multi-hall zone gating permissions",
      "High-speed turnstile scan throughput (1,500/hr/scanner)",
      "Instant thermal lanyard badge generation",
    ],
    eventPage: {
      heroTitle: "Global Manufacturing & Robotics Expo",
      heroSubtitle: "South Asia's largest industrial showcase with 350+ global exhibitors.",
      badge: "B2B TRADE EXHIBITION",
      date: "12–14 November 2026 · Daily 10 AM",
      venue: "BIEC International Exhibition Complex, Bangalore",
      highlights: ["Halls 1, 2 & 3 Open", "International Buyer Lounge", "Live Heavy Machine Demos"],
    },
    registrationForm: {
      formTitle: "Trade Visitor Accreditation",
      fields: [
        { label: "Visitor Full Name", placeholder: "Manoj Deshmukh", required: true },
        { label: "Enterprise / Company", placeholder: "Deshmukh Precision Tools", required: true },
        { label: "GSTIN / Business Registration", placeholder: "29AAAAA0000A1Z5", required: false },
        { label: "Sourcing Interest", placeholder: "Automation & CNC Machinery", required: true },
      ],
      submitButtonText: "Generate Trade Visitor Badge",
    },
    qrPass: {
      passType: "Trade Visitor Badge",
      tier: "COMMERCIAL BUYER",
      primaryColor: "#D97706",
      attendeeName: "MANOJ DESHMUKH",
      role: "DESHMUKH PRECISION TOOLS",
      qrToken: "URP-EXPO-BUYER-83921",
      venue: "BIEC Exhibition Complex",
      date: "12-14 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Trade Buyer Badge",
      strapColor: "#D97706",
      strapLabel: "BUYER",
      clipColor: "silver",
      attendeeName: "MANOJ DESHMUKH",
      organization: "Deshmukh Precision Tools",
      accessBarText: "ALL EXHIBIT HALLS",
      accessColor: "#D97706",
    },
  },

  // 7. College Fest (Featured #2)
  {
    id: "college-fest",
    name: "College Fest",
    category: "Campus",
    secondaryCategory: "High-Volume Event",
    subtitle: "High-volume campus cultural fest setup with student roll-number checks and security gate turnstiles.",
    bestFor: "University cultural fests, inter-college days, DJ pro-nights & talent events",
    complexity: "Advanced",
    featured: true,
    chips: ["Campus", "Roll Number", "Security Gate", "Pro-Night"],
    accentColor: "#7C3AED",
    version: "v3.0",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Waves 2026 — Annual Cultural Fest",
        eventType: "fest",
        expectedAttendees: 3500,
        durationDays: 3,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Student Name", type: "text", required: true },
          { name: "college", label: "College / University", type: "text", required: true },
          { name: "rollNo", label: "Roll / Registration Number", type: "text", required: true },
          { name: "phone", label: "WhatsApp Number", type: "tel", required: true },
        ],
        approvalRequired: false,
        registrationLimits: 3500,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "campus-pop",
        ticketTypes: [
          { name: "Campus Pass (All 3 Days)", price: 0, capacity: 2500, badgeTier: "STUDENT" },
          { name: "Pro-Night VIP Arena", price: 199, capacity: 1000, badgeTier: "PRONIGHT" },
        ],
        qrSettings: { scanTimeoutMs: 200, dynamicToken: true },
      },
      accessConfig: {
        gates: [
          { id: "main-gate", name: "Main Campus Gate", allowedTiers: ["STUDENT", "PRONIGHT"] },
          { id: "pronight-gate", name: "Amphitheatre Pro-Night Gate", allowedTiers: ["PRONIGHT"] },
        ],
        zones: ["Campus Grounds", "Amphitheatre"],
        allowCheckIn: true,
        allowCheckOut: false,
      },
      paymentConfig: { isPaid: true, currency: "INR", platformFeeBearer: "attendee" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#7C3AED" },
      analyticsConfig: { trackGatePace: true, trackDropOff: true },
    },
    formFields: ["Student Name", "College / Institute", "Student ID", "WhatsApp"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "WhatsApp delivery with offline-encrypted QR pass for zero-network entry.",
    includedFeatures: [
      "Student ID / Roll Number validation",
      "Instant WhatsApp ticket delivery",
      "Offline encrypted QR verification (works with zero internet)",
      "Pro-night arena gate isolation",
    ],
    eventPage: {
      heroTitle: "Waves 2026 — Annual Cultural Fest",
      heroSubtitle: "3 days of electrifying concerts, battles of the bands, dance showcases, and DJ night.",
      badge: "CAMPUS CULTURAL FEST",
      date: "05–07 November 2026 · Gates Open 04:00 PM",
      venue: "University Main Ground & Open Air Theatre, Chennai",
      highlights: ["3 Celebrity Pro-Nights", "45+ Inter-College Events", "Sub-0.2s Offline Gate Entry"],
    },
    registrationForm: {
      formTitle: "Student Fest Delegate Registration",
      fields: [
        { label: "Student Full Name", placeholder: "Sneha Nair", required: true },
        { label: "College / University Name", placeholder: "PSG College of Technology", required: true },
        { label: "Student Roll / ID No.", placeholder: "22BCS1084", required: true },
        { label: "WhatsApp Phone Number", placeholder: "+91 98765 11223", required: true, type: "tel" },
      ],
      submitButtonText: "Claim Free Student Pass",
    },
    qrPass: {
      passType: "Official Campus Pass",
      tier: "ALL-DAYS ACCESS",
      primaryColor: "#7C3AED",
      attendeeName: "SNEHA NAIR",
      role: "PSG TECH · 22BCS1084",
      qrToken: "URP-CAMPUS-WAVES-90214",
      venue: "University Main Ground",
      date: "05-07 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "College Fest Lanyard",
      strapColor: "#7C3AED",
      strapLabel: "STUDENT",
      clipColor: "silver",
      attendeeName: "SNEHA NAIR",
      organization: "PSG College of Technology",
      accessBarText: "ALL ARENAS ACCESS",
      accessColor: "#7C3AED",
    },
  },

  // 8. College Symposium
  {
    id: "college-symposium",
    name: "College Symposium",
    category: "Campus",
    secondaryCategory: "Conference",
    subtitle: "Department technical symposium with paper presentation tracks and lab entry scanning.",
    bestFor: "Engineering department symposiums, student conferences & tech project displays",
    complexity: "Standard",
    chips: ["Dept Symposium", "Track Selection", "Faculty Review"],
    accentColor: "#0284C7",
    version: "v1.6",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "National Technical Symposium on Autonomous Systems",
        eventType: "symposium",
        expectedAttendees: 500,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "studentName", label: "Student Name", type: "text", required: true },
          { name: "department", label: "Department / Major", type: "text", required: true },
          { name: "paperTitle", label: "Paper / Project Title", type: "text", required: false },
        ],
        approvalRequired: false,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "campus-classic",
        ticketTypes: [
          { name: "Delegate", price: 0, capacity: 400, badgeTier: "DELEGATE" },
          { name: "Paper Presenter", price: 0, capacity: 100, badgeTier: "PRESENTER" },
        ],
        qrSettings: { scanTimeoutMs: 300, dynamicToken: false },
      },
      accessConfig: {
        gates: [
          { id: "seminar-hall", name: "Main Seminar Hall", allowedTiers: ["DELEGATE", "PRESENTER"] },
          { id: "robotics-lab", name: "Robotics Research Lab", allowedTiers: ["PRESENTER"] },
        ],
        zones: ["Seminar Hall", "Robotics Lab"],
        allowCheckIn: true,
        allowCheckOut: false,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#0284C7" },
      analyticsConfig: { trackGatePace: false, trackDropOff: false },
    },
    formFields: ["Participant Name", "College", "Department", "Track"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Certificate-ready digital participant credential with unique paper ID.",
    includedFeatures: [
      "Department track segregation",
      "Faculty reviewer credential check-in",
      "Automatic digital participation certificate dispatch",
      "Camera verification at lab gates",
    ],
    eventPage: {
      heroTitle: "InnovateX '26 — National Symposium",
      heroSubtitle: "Department of Computer Science & Artificial Intelligence.",
      badge: "ACADEMIC SYMPOSIUM",
      date: "Saturday, 17 October 2026 · 09:30 AM",
      venue: "Auditorium & Research Labs, Block IV",
      highlights: ["Keynote by IEEE Fellow", "32 Paper Presentations", "Project Expo Hall"],
    },
    registrationForm: {
      formTitle: "Symposium Delegate Registration",
      fields: [
        { label: "Participant Name", placeholder: "Karthik Subramanian", required: true },
        { label: "Institution / College", placeholder: "National Institute of Tech", required: true },
        { label: "Department / Stream", placeholder: "Computer Science & Engg", required: true },
      ],
      submitButtonText: "Register for Technical Symposium",
    },
    qrPass: {
      passType: "Academic Delegate Pass",
      tier: "SYMPOSIUM DELEGATE",
      primaryColor: "#0284C7",
      attendeeName: "KARTHIK SUBRAMANIAN",
      role: "NIT TRICHY · CSE",
      qrToken: "URP-SYMP-2026-8921",
      venue: "Block IV Auditorium",
      date: "17 OCT 2026",
    },
    lanyardBadge: {
      badgeType: "Academic Lanyard Badge",
      strapColor: "#0284C7",
      strapLabel: "DELEGATE",
      clipColor: "silver",
      attendeeName: "KARTHIK SUBRAMANIAN",
      organization: "National Institute of Tech",
      accessBarText: "RESEARCH TRACK",
      accessColor: "#0284C7",
    },
  },

  // 9. Workshop / Training
  {
    id: "workshop-training",
    name: "Workshop / Training",
    category: "Workshop",
    secondaryCategory: "Corporate",
    subtitle: "Hands-on certified training event with seat quota limits and attendance completion tracking.",
    bestFor: "Executive masterclasses, bootcamps, corporate training & hands-on labs",
    complexity: "Simple",
    chips: ["Seat Limits", "Attendance Completion", "Certificate"],
    accentColor: "#0D9488",
    version: "v1.8",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Hands-on GenAI Engineering Masterclass",
        eventType: "workshop",
        expectedAttendees: 60,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
          { name: "experienceLevel", label: "Current Tech Stack", type: "text", required: true },
        ],
        approvalRequired: false,
        registrationLimits: 60,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "workshop-clean",
        ticketTypes: [{ name: "Masterclass Seat", price: 999, capacity: 60, badgeTier: "SEAT" }],
        qrSettings: { scanTimeoutMs: 300, dynamicToken: false },
      },
      accessConfig: {
        gates: [{ id: "lab-gate", name: "Training Lab Gate", allowedTiers: ["SEAT"] }],
        zones: ["Training Room"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: true, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#0D9488" },
      analyticsConfig: { trackGatePace: false, trackDropOff: false },
    },
    formFields: ["Full Name", "Email", "Organization", "GitHub / LinkedIn"],
    approvalWorkflow: "Paid Instant Ticket",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Instant pass with lab repo access link and seating allocation.",
    includedFeatures: [
      "Strict seat capacity cutoff limit (e.g. 60 seats)",
      "Instant paid ticketing with Razorpay / UPI",
      "Check-in timestamp for certification eligibility",
      "Automated post-session survey delivery",
    ],
    eventPage: {
      heroTitle: "Production GenAI & Agents Masterclass",
      heroSubtitle: "Build and deploy production-grade LLM applications in a full-day intensive workshop.",
      badge: "EXECUTIVE MASTERCLASS",
      date: "Saturday, 28 November 2026 · 10:00 AM",
      venue: "Tech Innovation Hub, Indiranagar, Bangalore",
      highlights: ["Hands-on GPU Lab Access", "Certificate of Completion", "Lunch & Refreshments"],
    },
    registrationForm: {
      formTitle: "Reserve Masterclass Seat",
      fields: [
        { label: "Attendee Name", placeholder: "Divya Nambiar", required: true },
        { label: "Work Email", placeholder: "divya@startup.co", required: true, type: "email" },
        { label: "Current Role", placeholder: "Senior Data Scientist", required: true },
      ],
      submitButtonText: "Enroll in Masterclass",
    },
    qrPass: {
      passType: "Masterclass Access Pass",
      tier: "CERTIFIED TRAINEE",
      primaryColor: "#0D9488",
      attendeeName: "DIVYA NAMBIAR",
      role: "SENIOR DATA SCIENTIST",
      qrToken: "URP-WS-GENAI-0941",
      venue: "Tech Innovation Hub",
      date: "28 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Workshop Badge",
      strapColor: "#0D9488",
      strapLabel: "TRAINEE",
      clipColor: "silver",
      attendeeName: "DIVYA NAMBIAR",
      organization: "Tech Innovation Hub",
      accessBarText: "CERTIFIED SEAT #14",
      accessColor: "#0D9488",
    },
  },

  // 10. Hackathon
  {
    id: "hackathon",
    name: "Hackathon",
    category: "Hackathon",
    secondaryCategory: "Campus",
    subtitle: "36-hour sprint setup with team grouping, midnight meal coupons, and mentor access badges.",
    bestFor: "Developer hackathons, AI buildathons & internal company code fests",
    complexity: "Advanced",
    chips: ["Team Groups", "Meal QR", "36-Hour Check-in"],
    accentColor: "#10B981",
    version: "v2.5",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "HackVerse 2026 — 36hr AI Hackathon",
        eventType: "fest",
        expectedAttendees: 400,
        durationDays: 2,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "teamName", label: "Team Name", type: "text", required: true },
          { name: "hackerName", label: "Lead Hacker Name", type: "text", required: true },
          { name: "github", label: "GitHub Profile URL", type: "url", required: true },
        ],
        approvalRequired: true,
        isRsvp: true,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "future-grid",
        ticketTypes: [
          { name: "Hacker Pass", price: 0, capacity: 350, badgeTier: "HACKER" },
          { name: "Mentor / Judge", price: 0, capacity: 50, badgeTier: "MENTOR" },
        ],
        qrSettings: { scanTimeoutMs: 250, dynamicToken: true },
      },
      accessConfig: {
        gates: [
          { id: "arena", name: "Hacking Arena", allowedTiers: ["HACKER", "MENTOR"] },
          { id: "midnight-meal", name: "Midnight Food Court", allowedTiers: ["HACKER", "MENTOR"] },
        ],
        zones: ["Arena Floor", "Rest Pods", "Food Court"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#10B981" },
      analyticsConfig: { trackGatePace: true, trackDropOff: false },
    },
    formFields: ["Team Name", "Hacker Name", "GitHub Profile", "Dietary Preference"],
    approvalWorkflow: "Manual Review & Approval",
    gateConfig: "Zone & Session Access",
    confirmationDetails: "Discord onboarding token + encrypted meal pass with multiple redemptions.",
    includedFeatures: [
      "Team registration and member grouping",
      "Multi-scan meal coupon validation (Breakfast/Dinner)",
      "24/7 re-entry scanning without re-verification",
      "Judge & Mentor privileged gate scanning",
    ],
    eventPage: {
      heroTitle: "HackVerse 2026 — 36hr AI Sprint",
      heroSubtitle: "Build next-generation autonomous software with $50,000 in bounties.",
      badge: "GLOBAL DEVELOPER HACKATHON",
      date: "16–18 October 2026 · Check-in 08:00 AM",
      venue: "Open Innovation Complex, Whitefield, Bangalore",
      highlights: ["36 Hours Non-Stop", "Hardware & Cloud Credits", "Midnight Pizza & Energy Drinks"],
    },
    registrationForm: {
      formTitle: "Hacker Team Application",
      fields: [
        { label: "Team Name", placeholder: "ByteCommanders", required: true },
        { label: "Hacker Name", placeholder: "Aditya Roy", required: true },
        { label: "GitHub Profile", placeholder: "github.com/adityaroy", required: true },
        { label: "Project Idea Summary", placeholder: "Decentralized offline mesh verification...", required: true },
      ],
      submitButtonText: "Submit Hacker Application",
    },
    qrPass: {
      passType: "Hacker Credential Pass",
      tier: "HACKER · 36HR NON-STOP",
      primaryColor: "#10B981",
      attendeeName: "ADITYA ROY",
      role: "TEAM: BYTECOMMANDERS",
      qrToken: "URP-HACK-BYTE-49210",
      venue: "Open Innovation Complex",
      date: "16-18 OCT 2026",
    },
    lanyardBadge: {
      badgeType: "Hacker Lanyard Badge",
      strapColor: "#10B981",
      strapLabel: "BUILDER",
      clipColor: "black",
      attendeeName: "ADITYA ROY",
      organization: "ByteCommanders",
      accessBarText: "MEAL VOUCHER ACTIVE",
      accessColor: "#10B981",
    },
  },

  // 11. Sports Tournament
  {
    id: "sports-tournament",
    name: "Sports Tournament",
    category: "Sports",
    subtitle: "Tournament access architecture with Athlete, Coach, Referee, and Spectator stand controls.",
    bestFor: "Inter-college sports, football tournaments, badminton cups & athletic meets",
    complexity: "Standard",
    chips: ["Athlete vs Spectator", "Pitch Gate", "Match Schedule"],
    accentColor: "#EA580C",
    version: "v1.7",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "All-India Inter-University Football Cup",
        eventType: "sports",
        expectedAttendees: 1200,
        durationDays: 3,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "playerName", label: "Player / Attendee Name", type: "text", required: true },
          { name: "teamName", label: "Team / University", type: "text", required: true },
          { name: "jerseyNo", label: "Jersey / Bib Number", type: "text", required: false },
        ],
        approvalRequired: false,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "sports-arena",
        ticketTypes: [
          { name: "Spectator Stand", price: 99, capacity: 1000, badgeTier: "STAND" },
          { name: "Athlete / Staff", price: 0, capacity: 200, badgeTier: "ATHLETE" },
        ],
        qrSettings: { scanTimeoutMs: 250, dynamicToken: false },
      },
      accessConfig: {
        gates: [
          { id: "spectator-gate", name: "Stand B Entrance", allowedTiers: ["STAND", "ATHLETE"] },
          { id: "pitch-gate", name: "Player Locker & Pitch Gate", allowedTiers: ["ATHLETE"] },
        ],
        zones: ["Spectator Stands", "Player Locker Room", "Pitch"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: true, currency: "INR", platformFeeBearer: "attendee" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#EA580C" },
      analyticsConfig: { trackGatePace: true, trackDropOff: false },
    },
    formFields: ["Participant Name", "Team Name", "Jersey / Bib No", "Emergency Contact"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Zone & Session Access",
    confirmationDetails: "Match schedule pass with dedicated player dugout access.",
    includedFeatures: [
      "Player vs Spectator gate segregation",
      "Pitch & locker room restricted access control",
      "Spectator stand ticket ticketing",
      "Fast camera gate verification under direct sunlight",
    ],
    eventPage: {
      heroTitle: "Championship Football Cup '26",
      heroSubtitle: "16 elite university football teams battling for the national championship.",
      badge: "INTER-UNIVERSITY CUP",
      date: "04–06 December 2026 · Daily 08 AM",
      venue: "Jawaharlal Nehru Stadium, Kochi",
      highlights: ["32 Knockout Matches", "LED Match Scoreboard", "Live Stadium Commentary"],
    },
    registrationForm: {
      formTitle: "Spectator & Fan Ticket Booking",
      fields: [
        { label: "Full Name", placeholder: "Deepak Menon", required: true },
        { label: "Supporting Team", placeholder: "Kerala Strikers FC", required: true },
        { label: "Seat Block", placeholder: "East Stand (General)", required: true },
      ],
      submitButtonText: "Book Spectator Ticket",
    },
    qrPass: {
      passType: "Tournament Stadium Pass",
      tier: "EAST STAND · ROW 12",
      primaryColor: "#EA580C",
      attendeeName: "DEEPAK MENON",
      role: "SPECTATOR ACCESS",
      qrToken: "URP-SPORT-STAD-98214",
      venue: "Jawaharlal Nehru Stadium",
      date: "04-06 DEC 2026",
    },
    lanyardBadge: {
      badgeType: "Athlete / Staff Badge",
      strapColor: "#EA580C",
      strapLabel: "ATHLETE",
      clipColor: "silver",
      attendeeName: "DEEPAK MENON",
      organization: "Kerala Strikers FC",
      accessBarText: "PITCH & DUGOUT",
      accessColor: "#EA580C",
    },
  },

  // 12. Marathon
  {
    id: "marathon",
    name: "Marathon",
    category: "Sports",
    secondaryCategory: "High-Volume Event",
    subtitle: "Mass endurance race setup with Bib numbering, medical emergency contacts, and wave starting lines.",
    bestFor: "City marathons, 10K runs, half marathons & charity walkathons",
    complexity: "Advanced",
    chips: ["Race Bib #", "Wave Corrals", "Medical Emergency"],
    accentColor: "#16A34A",
    version: "v2.1",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Metro City Half Marathon 2026",
        eventType: "sports",
        expectedAttendees: 4000,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "runnerName", label: "Runner Full Name", type: "text", required: true },
          { name: "category", label: "Race Category (21K / 10K / 5K)", type: "text", required: true },
          { name: "emergencyContact", label: "Emergency Contact Phone", type: "tel", required: true },
          { name: "tshirtSize", label: "T-Shirt Size", type: "text", required: true },
        ],
        approvalRequired: false,
        registrationLimits: 4000,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "marathon-pass",
        ticketTypes: [
          { name: "21K Half Marathon", price: 1200, capacity: 2000, badgeTier: "21K" },
          { name: "10K Timed Run", price: 900, capacity: 2000, badgeTier: "10K" },
        ],
        qrSettings: { scanTimeoutMs: 200, dynamicToken: false },
      },
      accessConfig: {
        gates: [
          { id: "bib-expo", name: "Bib Collection Expo", allowedTiers: ["21K", "10K"] },
          { id: "wave-a", name: "Race Corral Wave A", allowedTiers: ["21K"] },
          { id: "wave-b", name: "Race Corral Wave B", allowedTiers: ["10K"] },
        ],
        zones: ["Holding Area", "Race Track", "Finish Line Lounge"],
        allowCheckIn: true,
        allowCheckOut: false,
      },
      paymentConfig: { isPaid: true, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#16A34A" },
      analyticsConfig: { trackGatePace: true, trackDropOff: false },
    },
    formFields: ["Runner Name", "Category", "Emergency Contact", "Medical Blood Group"],
    approvalWorkflow: "Paid Instant Ticket",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Instant race bib allocation with timing chip pickup QR code.",
    includedFeatures: [
      "Automatic Bib Number assignment (#4219)",
      "Bib Expo verification and chip distribution",
      "Staggered wave corral gate entry control",
      "Emergency contact & blood group data on digital pass",
    ],
    eventPage: {
      heroTitle: "City Run 2026 — 21K & 10K",
      heroSubtitle: "Run through iconic landmarks with 4,000 runners in South India's largest certified run.",
      badge: "CITY HALF MARATHON",
      date: "Sunday, 15 November 2026 · Flag-off 05:30 AM",
      venue: "Marina Promenade, Chennai",
      highlights: ["AIMS Certified Course", "Timed RFID Bib Included", "Finisher Medal & Breakfast"],
    },
    registrationForm: {
      formTitle: "Marathon Runner Registration",
      fields: [
        { label: "Runner Full Name", placeholder: "Ananya Iyer", required: true },
        { label: "Race Category", placeholder: "21.1K Half Marathon", required: true },
        { label: "Emergency Contact Phone", placeholder: "+91 94444 88990", required: true, type: "tel" },
        { label: "Blood Group", placeholder: "O Positive", required: true },
      ],
      submitButtonText: "Register for Marathon",
    },
    qrPass: {
      passType: "Runner Race Pass",
      tier: "RUNNER BIB #4219",
      primaryColor: "#16A34A",
      attendeeName: "ANANYA IYER",
      role: "21K HALF MARATHON",
      qrToken: "URP-RUN-BIB-4219-918",
      venue: "Marina Promenade, Chennai",
      date: "15 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Race Bib Credential",
      strapColor: "#16A34A",
      strapLabel: "CORRAL-A",
      clipColor: "silver",
      attendeeName: "ANANYA IYER",
      organization: "BIB #4219",
      accessBarText: "TIMED RUNNER",
      accessColor: "#16A34A",
    },
  },

  // 13. VIP Invitation Event
  {
    id: "vip-invitation",
    name: "VIP Invitation Event",
    category: "Private / VIP",
    secondaryCategory: "Corporate",
    subtitle: "High-touch private dinner and gala setup with non-transferable personalized invitation tokens.",
    bestFor: "Executive dinners, awards galas, private product reveals & patron receptions",
    complexity: "Simple",
    chips: ["Discreet Pass", "Token Invite", "Host Valet"],
    accentColor: "#F59E0B",
    version: "v1.9",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "The Chairman's Circle Annual Gala",
        eventType: "vip",
        expectedAttendees: 80,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "token", label: "Secret Invitation Code", type: "text", required: true },
          { name: "dietary", label: "Chef Dietary Preferences", type: "text", required: true },
        ],
        approvalRequired: true,
        isRsvp: true,
        isPublic: false,
      },
      ticketConfig: {
        passTemplateId: "vip-midnight",
        ticketTypes: [{ name: "VIP Patron", price: 0, capacity: 80, badgeTier: "PATRON" }],
        qrSettings: { scanTimeoutMs: 350, dynamicToken: true },
      },
      accessConfig: {
        gates: [{ id: "valet-door", name: "Private Valet & Concierge", allowedTiers: ["PATRON"] }],
        zones: ["Banquet Hall", "Private Cellar"],
        allowCheckIn: true,
        allowCheckOut: false,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#F59E0B" },
      analyticsConfig: { trackGatePace: false, trackDropOff: false },
    },
    formFields: ["Invitation Code", "Guest Name", "Dietary", "Valet Vehicle No"],
    approvalWorkflow: "Invite-Only Token",
    gateConfig: "VIP & Executive Gate",
    confirmationDetails: "Discreet luxury pass for Google/Apple Wallet with private concierge door.",
    includedFeatures: [
      "Encrypted non-transferable token RSVP",
      "Executive concierge greeting display upon camera scan",
      "Discreet dark luxury wallet styling",
      "Valet parking integration tag",
    ],
    eventPage: {
      heroTitle: "The Chairman's Circle Annual Gala",
      heroSubtitle: "An evening of fine dining and celebration honoring key industry visionaries.",
      badge: "STRICTLY PRIVATE INVITATION",
      date: "Saturday, 12 December 2026 · 07:30 PM",
      venue: "The Oberoi Grand Ballroom, Mumbai",
      highlights: ["Curated 7-Course Chef Dinner", "Acoustic Symphony", "Valet & Dedicated Concierge"],
    },
    registrationForm: {
      formTitle: "RSVP Invitation Validation",
      fields: [
        { label: "Private Invitation Token", placeholder: "CHAIRMAN-VIP-8821", required: true },
        { label: "Guest Full Name", placeholder: "Mr. & Mrs. Singhania", required: true },
        { label: "Dietary & Wine Preferences", placeholder: "Vegetarian / French Red", required: true },
      ],
      submitButtonText: "Confirm Gala Attendance",
    },
    qrPass: {
      passType: "Chairman's Circle Pass",
      tier: "HONORED GUEST · PATRON",
      primaryColor: "#F59E0B",
      attendeeName: "ELIZABETH VANCE",
      role: "HONORED PATRON",
      qrToken: "URP-VIP-GALA-88192",
      venue: "The Oberoi, Mumbai",
      date: "12 DEC 2026",
    },
    lanyardBadge: {
      badgeType: "VIP Gold Credential",
      strapColor: "#18181B",
      strapLabel: "PATRON",
      clipColor: "gold",
      attendeeName: "ELIZABETH VANCE",
      organization: "Executive Trustee",
      accessBarText: "TABLE #04 · VIP",
      accessColor: "#F59E0B",
    },
  },

  // 14. RSVP Private Event
  {
    id: "rsvp-private",
    name: "RSVP Private Event",
    category: "RSVP",
    secondaryCategory: "Private / VIP",
    subtitle: "Simple guest-list confirmation for dinners, weddings, anniversaries, and community meetups.",
    bestFor: "Private dinners, social celebrations, anniversary parties & club gatherings",
    complexity: "Simple",
    chips: ["RSVP Response", "Guest Count", "Instant Confirm"],
    accentColor: "#DB2777",
    version: "v1.3",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Celebration Dinner & Social Evening",
        eventType: "vip",
        expectedAttendees: 100,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "guestName", label: "Full Name", type: "text", required: true },
          { name: "attending", label: "Will You Attend? (Yes/No)", type: "text", required: true },
          { name: "plusOnes", label: "Accompanying Guests (+1)", type: "number", required: false },
        ],
        approvalRequired: false,
        isRsvp: true,
        isPublic: false,
      },
      ticketConfig: {
        passTemplateId: "elegant-rsvp",
        ticketTypes: [{ name: "Confirmed Guest", price: 0, capacity: 100, badgeTier: "GUEST" }],
        qrSettings: { scanTimeoutMs: 300, dynamicToken: false },
      },
      accessConfig: {
        gates: [{ id: "reception", name: "Host Reception Desk", allowedTiers: ["GUEST"] }],
        zones: ["Banquet Lawn"],
        allowCheckIn: true,
        allowCheckOut: false,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#DB2777" },
      analyticsConfig: { trackGatePace: false, trackDropOff: false },
    },
    formFields: ["Guest Name", "RSVP Status (Yes/No)", "Plus Ones (+1)", "Dietary"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Elegant calendar invite with companion QR pass.",
    includedFeatures: [
      "Fast one-tap Yes/No RSVP response",
      "Plus-one guest counter (+1, +2)",
      "Host smartphone guest-list checking",
      "Automatic WhatsApp reminder 24h before",
    ],
    eventPage: {
      heroTitle: "Private Reception & Dinner",
      heroSubtitle: "Join us for an intimate evening of celebration and shared memories.",
      badge: "PRIVATE CELEBRATION",
      date: "Saturday, 21 November 2026 · 06:30 PM",
      venue: "The Heritage Gardens, Bangalore",
      highlights: ["Lawn Reception", "Live Acoustic Music", "Dinner & Cocktails"],
    },
    registrationForm: {
      formTitle: "Guest RSVP Confirmation",
      fields: [
        { label: "Guest Name", placeholder: "Siddharth & Meera", required: true },
        { label: "Attending", placeholder: "Yes, Delighted to Attend", required: true },
        { label: "Number of Guests", placeholder: "2", required: true, type: "number" },
      ],
      submitButtonText: "Confirm My RSVP",
    },
    qrPass: {
      passType: "Guest Invitation Pass",
      tier: "CONFIRMED GUEST",
      primaryColor: "#DB2777",
      attendeeName: "SIDDHARTH & MEERA",
      role: "TABLE RESERVED #8",
      qrToken: "URP-RSVP-SIDD-19024",
      venue: "The Heritage Gardens",
      date: "21 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Guest Pass",
      strapColor: "#DB2777",
      strapLabel: "GUEST",
      clipColor: "silver",
      attendeeName: "SIDDHARTH & MEERA",
      organization: "Family Guest",
      accessBarText: "TABLE #8",
      accessColor: "#DB2777",
    },
  },

  // 15. Paid Conference
  {
    id: "paid-conference",
    name: "Paid Conference",
    category: "Paid Event",
    secondaryCategory: "Conference",
    subtitle: "Commercial conference ticketing with multi-tier pricing, GST invoices, and instant Razorpay checkout.",
    bestFor: "Paid developer summits, business forums, industry conferences & paid seminars",
    complexity: "Standard",
    chips: ["Multi-Tier Tickets", "GST Invoice", "Razorpay"],
    accentColor: "#2563EB",
    version: "v2.3",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "India FinTech Summit 2026",
        eventType: "conference",
        expectedAttendees: 800,
        durationDays: 2,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "email", label: "Billing Email", type: "email", required: true },
          { name: "company", label: "Company / Firm", type: "text", required: true },
          { name: "gstin", label: "GSTIN (for B2B Tax Credit)", type: "text", required: false },
        ],
        approvalRequired: false,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "corporate-minimal",
        ticketTypes: [
          { name: "Early Bird Pass", price: 1499, capacity: 300, badgeTier: "EARLYBIRD" },
          { name: "Standard Delegate", price: 2499, capacity: 400, badgeTier: "DELEGATE" },
          { name: "VIP All-Access Pass", price: 4999, capacity: 100, badgeTier: "VIP" },
        ],
        qrSettings: { scanTimeoutMs: 250, dynamicToken: true },
      },
      accessConfig: {
        gates: [
          { id: "main-hall", name: "Main Summit Hall", allowedTiers: ["EARLYBIRD", "DELEGATE", "VIP"] },
          { id: "vip-lunch", name: "VIP Speaker Luncheon", allowedTiers: ["VIP"] },
        ],
        zones: ["Main Hall", "Expo Area", "VIP Dining"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: true, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#2563EB" },
      analyticsConfig: { trackGatePace: true, trackDropOff: true },
    },
    formFields: ["Full Name", "Billing Email", "Company", "GSTIN No"],
    approvalWorkflow: "Paid Instant Ticket",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "Instant tax invoice PDF + QR attendee ticket delivered via WhatsApp & Email.",
    includedFeatures: [
      "Zero platform ticket commission model",
      "Automated GST invoice generation with company GSTIN",
      "Instant UPI, credit card, and netbanking checkout",
      "Real-time revenue & sales payout dashboard",
    ],
    eventPage: {
      heroTitle: "India FinTech Summit 2026",
      heroSubtitle: "Where 800+ banking leaders, payments founders, and regulators shape the future.",
      badge: "PAID COMMERCIAL CONFERENCE",
      date: "09–10 November 2026 · 09:00 AM",
      venue: "JW Marriott Grand Ballroom, Bangalore",
      highlights: ["3 Multi-Track Stages", "B2B Regulatory Roundtables", "Gourmet Buffet Included"],
    },
    registrationForm: {
      formTitle: "Conference Ticket Selection",
      fields: [
        { label: "Delegate Name", placeholder: "Nikhil Kamath", required: true },
        { label: "Company / Firm", placeholder: "Zerodha Tech Labs", required: true },
        { label: "GSTIN (for B2B invoice)", placeholder: "29AABCU9603R1ZM", required: false },
        { label: "Ticket Category", placeholder: "VIP All-Access Pass (₹4,999)", required: true },
      ],
      submitButtonText: "Proceed to Payment",
    },
    qrPass: {
      passType: "Paid Delegate Ticket",
      tier: "VIP ALL-ACCESS",
      primaryColor: "#2563EB",
      attendeeName: "NIKHIL KAMATH",
      role: "ZERODHA TECH LABS",
      qrToken: "URP-PAID-CONF-48201",
      venue: "JW Marriott Ballroom",
      date: "09-10 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Paid Delegate Badge",
      strapColor: "#2563EB",
      strapLabel: "VIP DELEGATE",
      clipColor: "gold",
      attendeeName: "NIKHIL KAMATH",
      organization: "Zerodha Tech Labs",
      accessBarText: "ALL SESSIONS + DINNER",
      accessColor: "#2563EB",
    },
  },

  // 16. Multi-Day Conference
  {
    id: "multi-day-conference",
    name: "Multi-Day Conference",
    category: "Conference",
    secondaryCategory: "Multi-Gate Event",
    subtitle: "3-day technical conference setup with day-specific check-ins and session track turnstiles.",
    bestFor: "Multi-day symposiums, 3-day conferences & multi-track developer conventions",
    complexity: "Advanced",
    chips: ["Day 1/2/3 Gating", "Track Turnstiles", "Multi-Day QR"],
    accentColor: "#3B82F6",
    version: "v2.4",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "National Architecture & Cloud Congress 2026",
        eventType: "conference",
        expectedAttendees: 1500,
        durationDays: 3,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "company", label: "Company", type: "text", required: true },
          { name: "daysAttending", label: "Days Attending", type: "text", required: true },
        ],
        approvalRequired: false,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "minimal-monochrome",
        ticketTypes: [
          { name: "All 3 Days Pass", price: 3999, capacity: 1000, badgeTier: "ALL3DAYS" },
          { name: "Day 1 Only", price: 1499, capacity: 250, badgeTier: "DAY1" },
          { name: "Day 2 Only", price: 1499, capacity: 250, badgeTier: "DAY2" },
        ],
        qrSettings: { scanTimeoutMs: 250, dynamicToken: true },
      },
      accessConfig: {
        gates: [
          { id: "gate-day1", name: "Day 1 Entrance", allowedTiers: ["ALL3DAYS", "DAY1"] },
          { id: "gate-day2", name: "Day 2 Entrance", allowedTiers: ["ALL3DAYS", "DAY2"] },
          { id: "gate-day3", name: "Day 3 Entrance", allowedTiers: ["ALL3DAYS"] },
        ],
        zones: ["Track A", "Track B", "Keynote Auditorium"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: true, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#3B82F6" },
      analyticsConfig: { trackGatePace: true, trackDropOff: true },
    },
    formFields: ["Full Name", "Company", "Days Selection", "Session Interests"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Zone & Session Access",
    confirmationDetails: "One smart pass that dynamically activates for Day 1, Day 2, and Day 3.",
    includedFeatures: [
      "Dynamic day-based gate access rules on a single QR token",
      "Automated check-in tracking per day for certificate eligibility",
      "Session track entrance scanning (Track A, B, C)",
      "Multi-day attendance drop-off curves",
    ],
    eventPage: {
      heroTitle: "Global Cloud Architecture Congress",
      heroSubtitle: "3 days of deep-dive distributed systems, Kubernetes, and AI infrastructure.",
      badge: "3-DAY TECHNICAL CONGRESS",
      date: "14–16 October 2026 · Daily 09:00 AM",
      venue: "Hyderabad International Convention Centre (HICC)",
      highlights: ["3 Parallel Tracks", "1,500 Cloud Architects", "Hands-on Workshops on Day 3"],
    },
    registrationForm: {
      formTitle: "Conference Pass Registration",
      fields: [
        { label: "Attendee Name", placeholder: "Shreya Ghoshal", required: true },
        { label: "Company", placeholder: "Microsoft IDC", required: true },
        { label: "Select Access Days", placeholder: "All 3 Days (Full Pass)", required: true },
      ],
      submitButtonText: "Confirm Multi-Day Pass",
    },
    qrPass: {
      passType: "Multi-Day Congress Pass",
      tier: "DAY 1 • DAY 2 • DAY 3",
      primaryColor: "#3B82F6",
      attendeeName: "SHREYA GHOSHAL",
      role: "PRINCIPAL ARCHITECT",
      qrToken: "URP-MULTI-CONF-38291",
      venue: "HICC Hyderabad",
      date: "14-16 OCT 2026",
    },
    lanyardBadge: {
      badgeType: "Multi-Day Badge",
      strapColor: "#3B82F6",
      strapLabel: "3-DAYS",
      clipColor: "silver",
      attendeeName: "SHREYA GHOSHAL",
      organization: "Microsoft IDC",
      accessBarText: "ALL 3 DAYS VALID",
      accessColor: "#3B82F6",
    },
  },

  // 17. Multi-Gate Mega Event (Featured #3)
  {
    id: "multi-gate-mega-event",
    name: "Multi-Gate Mega Event",
    category: "Multi-Gate Event",
    secondaryCategory: "High-Volume Event",
    subtitle: "Enterprise turnstile architecture designed for 10,000+ attendee venues with 8 segregated gates.",
    bestFor: "Stadium concerts, mega exhibitions, university fests & high-throughput summits",
    complexity: "Advanced",
    featured: true,
    chips: ["8 Turnstiles", "Sub-0.2s Scan", "10,000+ Attendees"],
    accentColor: "#DC2626",
    version: "v3.2",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "National Mega Summit 2026",
        eventType: "fest",
        expectedAttendees: 10000,
        durationDays: 2,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text", required: true },
          { name: "gateZone", label: "Assigned Entry Gate", type: "text", required: true },
          { name: "phone", label: "Mobile Phone", type: "tel", required: true },
        ],
        approvalRequired: false,
        registrationLimits: 12000,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "ultra-qr",
        ticketTypes: [
          { name: "Gate 1 North", price: 0, capacity: 2500, badgeTier: "GATE1" },
          { name: "Gate 2 South", price: 0, capacity: 2500, badgeTier: "GATE2" },
          { name: "Gate 3 East", price: 0, capacity: 2500, badgeTier: "GATE3" },
          { name: "Gate 4 VIP", price: 499, capacity: 2500, badgeTier: "VIP" },
        ],
        qrSettings: { scanTimeoutMs: 150, dynamicToken: true },
      },
      accessConfig: {
        gates: [
          { id: "gate-1", name: "Gate 1 (North Turnstile)", allowedTiers: ["GATE1"] },
          { id: "gate-2", name: "Gate 2 (South Turnstile)", allowedTiers: ["GATE2"] },
          { id: "gate-3", name: "Gate 3 (East Turnstile)", allowedTiers: ["GATE3"] },
          { id: "gate-vip", name: "Gate 4 (VIP Fast-Track)", allowedTiers: ["VIP"] },
        ],
        zones: ["North Arena", "South Arena", "VIP Box"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#DC2626" },
      analyticsConfig: { trackGatePace: true, trackDropOff: true },
    },
    formFields: ["Full Name", "Assigned Gate", "Mobile WhatsApp", "ID Verification"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "Oversized ultra-fast QR pass optimized for extreme-speed gate turnstile scanners.",
    includedFeatures: [
      "Strict gate zoning to prevent crowd crush at single entrances",
      "Sub-0.2 second optical camera scan speed",
      "Zero-latency edge verification across 8 simultaneous scanners",
      "Live throughput monitoring (scans/minute per turnstile)",
    ],
    eventPage: {
      heroTitle: "National Mega Summit & Festival",
      heroSubtitle: "10,000+ attendees across 8 coordinated turnstile gate sectors.",
      badge: "HIGH-CAPACITY ENTERPRISE SETUP",
      date: "28–29 November 2026 · Gates Open 08:30 AM",
      venue: "Yashobhoomi International Convention Centre (IICC), New Delhi",
      highlights: ["8 Segregated Turnstile Gates", "Real-Time Crowd Balancing", "Sub-0.2s Scan Speed"],
    },
    registrationForm: {
      formTitle: "Mega Event Fast-Track Entry",
      fields: [
        { label: "Attendee Full Name", placeholder: "Devendra Patel", required: true },
        { label: "Assigned Entrance Sector", placeholder: "North Sector (Gate 1)", required: true },
        { label: "Mobile Phone (for pass)", placeholder: "+91 99887 76655", required: true, type: "tel" },
      ],
      submitButtonText: "Claim Fast-Track Entry Pass",
    },
    qrPass: {
      passType: "Mega Event Rapid Pass",
      tier: "GATE 1 • NORTH SECTOR",
      primaryColor: "#DC2626",
      attendeeName: "DEVENDRA PATEL",
      role: "NORTH SECTOR · TURNSTILE A",
      qrToken: "URP-MEGA-TURNSTILE-01924",
      venue: "Yashobhoomi IICC Delhi",
      date: "28-29 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Mega Event Badge",
      strapColor: "#DC2626",
      strapLabel: "GATE 1",
      clipColor: "black",
      attendeeName: "DEVENDRA PATEL",
      organization: "Sector North Turnstile",
      accessBarText: "GATE 1 EXCLUSIVE",
      accessColor: "#DC2626",
    },
  },

  // 18. Expo Visitor Registration
  {
    id: "expo-visitor-registration",
    name: "Expo Visitor Registration",
    category: "Exhibition",
    secondaryCategory: "High-Volume Event",
    subtitle: "High-throughput public expo entry with thermal kiosk badge printing and trade visitor categorization.",
    bestFor: "Public consumer expos, auto expos, book fairs & trade exhibitions",
    complexity: "Standard",
    chips: ["Thermal Kiosk", "Visitor Badge", "Fast Entry"],
    accentColor: "#EA580C",
    version: "v2.0",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "India Consumer Electronics & Auto Expo",
        eventType: "exhibition",
        expectedAttendees: 6000,
        durationDays: 4,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "visitorName", label: "Full Name", type: "text", required: true },
          { name: "city", label: "City", type: "text", required: true },
          { name: "category", label: "Visitor Type", type: "text", required: true },
        ],
        approvalRequired: false,
        isRsvp: false,
        isPublic: true,
      },
      ticketConfig: {
        passTemplateId: "expo-pro",
        ticketTypes: [{ name: "General Visitor", price: 100, capacity: 6000, badgeTier: "VISITOR" }],
        qrSettings: { scanTimeoutMs: 200, dynamicToken: false },
      },
      accessConfig: {
        gates: [{ id: "kiosk-gate", name: "Main Kiosk Turnstiles", allowedTiers: ["VISITOR"] }],
        zones: ["Pavilion 1", "Pavilion 2", "Food Stalls"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: true, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#EA580C" },
      analyticsConfig: { trackGatePace: true, trackDropOff: false },
    },
    formFields: ["Visitor Name", "City", "Mobile Phone", "Visitor Type"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Instant thermal kiosk barcode for automatic badge printing on arrival.",
    includedFeatures: [
      "Thermal self-service kiosk check-in support",
      "Automated WhatsApp barcode delivery",
      "Multi-day re-entry pass rules",
      "Sub-0.2s camera verification",
    ],
    eventPage: {
      heroTitle: "National Consumer Auto Expo 2026",
      heroSubtitle: "Over 200 leading automotive and EV brands displaying next-generation vehicles.",
      badge: "PUBLIC TRADE EXPO",
      date: "19–22 November 2026 · Daily 10 AM",
      venue: "Pragati Maidan, New Delhi",
      highlights: ["Halls 5–12 Open", "Electric Vehicle Ride Arena", "Concept Car Unveils"],
    },
    registrationForm: {
      formTitle: "Visitor Entry Registration",
      fields: [
        { label: "Visitor Name", placeholder: "Amitabh Banerjee", required: true },
        { label: "City / Location", placeholder: "New Delhi", required: true },
        { label: "Mobile WhatsApp", placeholder: "+91 98111 22334", required: true, type: "tel" },
      ],
      submitButtonText: "Get Instant Visitor Pass",
    },
    qrPass: {
      passType: "Visitor Admission Badge",
      tier: "TRADE VISITOR",
      primaryColor: "#EA580C",
      attendeeName: "AMITABH BANERJEE",
      role: "PUBLIC VISITOR",
      qrToken: "URP-EXPO-VISIT-7721",
      venue: "Pragati Maidan, Delhi",
      date: "19-22 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Expo Visitor Badge",
      strapColor: "#EA580C",
      strapLabel: "VISITOR",
      clipColor: "silver",
      attendeeName: "AMITABH BANERJEE",
      organization: "Auto Expo Delhi",
      accessBarText: "PUBLIC ACCESS",
      accessColor: "#EA580C",
    },
  },

  // 19. Speaker & Delegate Event
  {
    id: "speaker-delegate-event",
    name: "Speaker & Delegate Event",
    category: "Conference",
    secondaryCategory: "Corporate",
    subtitle: "Distinguished keynote & panelist accreditation with green speaker badges and stage green-room access.",
    bestFor: "Keynote summits, TEDx-style events, speaker forums & intellectual panels",
    complexity: "Standard",
    chips: ["Green-Room Access", "Speaker Badge", "VIP Concierge"],
    accentColor: "#059669",
    version: "v2.1",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Future of Intelligence Summit",
        eventType: "conference",
        expectedAttendees: 300,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "speakerName", label: "Speaker / Delegate Name", type: "text", required: true },
          { name: "designation", label: "Designation & Organization", type: "text", required: true },
          { name: "bio", label: "Speaker Bio / Topic", type: "text", required: false },
        ],
        approvalRequired: true,
        isRsvp: true,
        isPublic: false,
      },
      ticketConfig: {
        passTemplateId: "speaker-badge",
        ticketTypes: [
          { name: "Distinguished Speaker", price: 0, capacity: 40, badgeTier: "SPEAKER" },
          { name: "VIP Delegate", price: 0, capacity: 260, badgeTier: "DELEGATE" },
        ],
        qrSettings: { scanTimeoutMs: 300, dynamicToken: true },
      },
      accessConfig: {
        gates: [
          { id: "main-hall", name: "Main Stage Auditorium", allowedTiers: ["SPEAKER", "DELEGATE"] },
          { id: "green-room", name: "Speaker Green Room & Lounge", allowedTiers: ["SPEAKER"] },
        ],
        zones: ["Auditorium", "Speaker Lounge"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#059669" },
      analyticsConfig: { trackGatePace: false, trackDropOff: false },
    },
    formFields: ["Speaker Name", "Designation", "Topic / Session", "Green-Room Requirements"],
    approvalWorkflow: "Manual Review & Approval",
    gateConfig: "VIP & Executive Gate",
    confirmationDetails: "Personalized keynote credential with stage timing schedule and backstage pass.",
    includedFeatures: [
      "Keynote speaker backstage & green-room access gating",
      "Prominent emerald role banner credential",
      "Executive liaison concierge alerts upon arrival",
      "Speaker slides & audio prep check-in sync",
    ],
    eventPage: {
      heroTitle: "Global Leaders & Thinkers Summit",
      heroSubtitle: "Gathering 40 world-class speakers and 260 curated C-suite delegates.",
      badge: "KEYNOTE & THOUGHT LEADERSHIP",
      date: "Wednesday, 18 November 2026 · 09:30 AM",
      venue: "Grand Hyatt Ballroom, Mumbai",
      highlights: ["Keynote Address by Industry Pioneers", "Private Speaker Luncheon", "Fireside Chats"],
    },
    registrationForm: {
      formTitle: "Speaker Accreditation & Dossier",
      fields: [
        { label: "Speaker Full Name", placeholder: "Dr. Arvind Subramanian", required: true },
        { label: "Organization / Institution", placeholder: "Oxford Global Institute", required: true },
        { label: "Keynote Topic", placeholder: "Macroeconomic Waves in Emerging Markets", required: true },
      ],
      submitButtonText: "Confirm Speaker Accreditation",
    },
    qrPass: {
      passType: "Keynote Speaker Credential",
      tier: "CONFIRMED SPEAKER",
      primaryColor: "#059669",
      attendeeName: "DR. ARVIND SUBRAMANIAN",
      role: "OXFORD GLOBAL INSTITUTE",
      qrToken: "URP-SPKR-LEAD-88219",
      venue: "Grand Hyatt, Mumbai",
      date: "18 NOV 2026",
    },
    lanyardBadge: {
      badgeType: "Speaker Lanyard Credential",
      strapColor: "#0F172A",
      strapLabel: "KEYNOTE",
      clipColor: "silver",
      attendeeName: "DR. ARVIND SUBRAMANIAN",
      organization: "Oxford Global Institute",
      accessBarText: "STAGE & GREEN ROOM",
      accessColor: "#10B981",
    },
  },

  // 20. Internal Company Event
  {
    id: "internal-company-event",
    name: "Internal Company Event",
    category: "Internal Employee Event",
    secondaryCategory: "Corporate",
    subtitle: "Confidential company milestone gathering with single-sign-on validation and security check-in.",
    bestFor: "Company offsites, annual day celebrations, internal awards & founder milestone parties",
    complexity: "Simple",
    chips: ["Confidential", "SSO Verify", "Offsite Pass"],
    accentColor: "#1E293B",
    version: "v1.5",
    ownerType: "system",
    config: {
      eventDefaults: {
        title: "Annual Company Day & Celebration",
        eventType: "corporate",
        expectedAttendees: 500,
        durationDays: 1,
        isVirtual: false,
      },
      registrationConfig: {
        fields: [
          { name: "employeeId", label: "Employee ID", type: "text", required: true },
          { name: "fullName", label: "Employee Name", type: "text", required: true },
          { name: "busRoute", label: "Shuttle Bus Route", type: "text", required: false },
        ],
        approvalRequired: false,
        isRsvp: true,
        isPublic: false,
      },
      ticketConfig: {
        passTemplateId: "tech-pulse",
        ticketTypes: [{ name: "Employee Pass", price: 0, capacity: 500, badgeTier: "STAFF" }],
        qrSettings: { scanTimeoutMs: 250, dynamicToken: false },
      },
      accessConfig: {
        gates: [{ id: "resort-gate", name: "Main Resort Security Gate", allowedTiers: ["STAFF"] }],
        zones: ["Celebration Lawn", "Dining Hall"],
        allowCheckIn: true,
        allowCheckOut: true,
      },
      paymentConfig: { isPaid: false, currency: "INR", platformFeeBearer: "organizer" },
      notificationConfig: { emailEnabled: true, whatsAppEnabled: true, sendConfirmation: true, sendReminder: true },
      brandingConfig: { primaryColor: "#1E293B" },
      analyticsConfig: { trackGatePace: false, trackDropOff: false },
    },
    formFields: ["Employee ID", "Employee Name", "Team", "Shuttle Bus Route"],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Internal company pass with shuttle bus pickup location and team dinner table.",
    includedFeatures: [
      "Company SSO / Employee ID verification",
      "Shuttle bus pickup route coordination",
      "Sub-second offline camera check-in at resort gate",
      "Employee lucky draw token assignment",
    ],
    eventPage: {
      heroTitle: "Annual Company Celebration 2026",
      heroSubtitle: "Celebrating 10 years of innovation, growth, and extraordinary teamwork.",
      badge: "INTERNAL COMPANY CELEBRATION",
      date: "Friday, 11 December 2026 · 04:00 PM",
      venue: "Golden Palms Resort & Spa, Bangalore",
      highlights: ["Milestone Awards Ceremony", "DJ & Live Band", "Gala Dinner & Cocktail Lounge"],
    },
    registrationForm: {
      formTitle: "Employee Attendance Confirmation",
      fields: [
        { label: "Employee ID", placeholder: "EMP-1029", required: true },
        { label: "Full Name", placeholder: "Anand Rangarajan", required: true },
        { label: "Shuttle Bus Pickup Point", placeholder: "Electronic City Gate 2", required: true },
      ],
      submitButtonText: "Confirm Offsite Attendance",
    },
    qrPass: {
      passType: "Company Celebration Pass",
      tier: "EMPLOYEE PASS",
      primaryColor: "#1E293B",
      attendeeName: "ANAND RANGARAJAN",
      role: "EMP #1029 · ENGG",
      qrToken: "URP-CORP-OFFSITE-2901",
      venue: "Golden Palms Resort",
      date: "11 DEC 2026",
    },
    lanyardBadge: {
      badgeType: "Employee Offsite Badge",
      strapColor: "#1E293B",
      strapLabel: "TEAM",
      clipColor: "silver",
      attendeeName: "ANAND RANGARAJAN",
      organization: "Enterprise Labs",
      accessBarText: "OFFSITE ALL-ARENAS",
      accessColor: "#1E293B",
    },
  },
];

// Enterprise Organization Templates Sample Library
export const ORGANIZATION_TEMPLATES: EventSetupTemplate[] = [
  {
    ...EVENT_SETUP_TEMPLATES[0],
    id: "yesp-corporate-standard",
    name: "YESP Corporate Event Standard",
    category: "Corporate",
    subtitle: "Enterprise approved standard event blueprint with dual approval and compliance reporting.",
    bestFor: "Enterprise internal and external corporate assemblies",
    ownerType: "organization",
    organizationName: "YESP Technologies Ltd",
    version: "v2.0",
    chips: ["Org Blueprint", "Compliance Audit", "Dual Gate"],
  },
  {
    ...EVENT_SETUP_TEMPLATES[6],
    id: "university-symposium-standard",
    name: "University Annual Symposium Standard",
    category: "Campus",
    subtitle: "Approved departmental symposium template with institutional branding and student roll check.",
    bestFor: "Annual college conferences and academic departments",
    ownerType: "organization",
    organizationName: "National University System",
    version: "v1.4",
    chips: ["Dept Standard", "Dean Approved", "Roll Check"],
  },
];
