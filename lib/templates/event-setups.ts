export type TemplateCategory =
  | "All"
  | "Corporate"
  | "Campus"
  | "Conferences"
  | "Social"
  | "Ticketed"
  | "Invite Only";

export interface EventSetupTemplate {
  id: string;
  name: string;
  category: "Corporate" | "Campus" | "Conferences" | "Social" | "Ticketed" | "Invite Only";
  secondaryCategory?: string;
  subtitle: string;
  bestFor: string;
  featured?: boolean;
  wide?: boolean;
  chips: string[];
  accentColor: string;
  // Proven Setup details
  formFields: string[];
  approvalWorkflow: "Automatic Confirmation" | "Manual Review & Approval" | "Invite-Only Token" | "Paid Instant Ticket";
  gateConfig: "Single Gate Check-in" | "Multi-Gate Turnstiles" | "VIP & Executive Gate" | "Zone & Session Access";
  confirmationDetails: string;
  includedFeatures: string[];
  // Assets for Canva 4-way preview
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
    secondaryCategory: "Conferences",
    subtitle: "Clean professional setup for conferences, seminars and business events.",
    bestFor: "Conferences, seminars & business events",
    featured: true,
    chips: ["Corporate", "Registration", "QR Pass", "Multi-Gate"],
    accentColor: "#0F172A",
    formFields: [
      "Full Name",
      "Work Email Address",
      "Phone Number",
      "Company / Organization",
      "Designation / Job Title",
    ],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "Instant email pass with ICS calendar invite and attendee badge.",
    includedFeatures: [
      "Name, Email, Phone, Company, Designation",
      "Email confirmation with calendar invite",
      "QR attendee pass & lanyard badge",
      "Approval optional (auto-approve enabled)",
      "General Entry & Keynote session gates",
      "Real-time attendance analytics & sub-0.3s camera scan",
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
      formTitle: "Conference Delegate Registration",
      fields: [
        { label: "Full Name", placeholder: "e.g., Arun Kumar", required: true },
        { label: "Work Email", placeholder: "arun.kumar@enterprise.com", required: true, type: "email" },
        { label: "Phone Number", placeholder: "+91 98765 43210", required: true, type: "tel" },
        { label: "Company / Organization", placeholder: "e.g., Acme Technologies", required: true },
        { label: "Designation / Role", placeholder: "e.g., VP of Engineering", required: true },
      ],
      submitButtonText: "Confirm Registration →",
    },
    qrPass: {
      passType: "Digital Delegate Credential",
      tier: "EXECUTIVE DELEGATE",
      primaryColor: "#0F172A",
      attendeeName: "Arun Kumar",
      role: "VP of Engineering · Acme Tech",
      qrToken: "URP-CONF-89124",
      venue: "Convention Center, Bangalore",
      date: "24 OCT 2026 · 09:00 AM",
    },
    lanyardBadge: {
      badgeType: "Conference Lanyard Badge",
      strapColor: "#0F172A",
      strapLabel: "URPASS DELEGATE",
      clipColor: "silver",
      attendeeName: "Arun Kumar",
      organization: "Acme Technologies",
      accessBarText: "EXECUTIVE DELEGATE · PLENARY & EXPO ACCESS",
      accessColor: "#0F172A",
    },
  },

  // 2. College Fest (Featured #2)
  {
    id: "college-fest",
    name: "College Fest",
    category: "Campus",
    subtitle: "High-energy campus setup for cultural fests, symposiums & inter-college meets.",
    bestFor: "Campus events, fests & student symposiums",
    featured: true,
    chips: ["Campus", "RSVP", "Student Pass", "Zone-Based"],
    accentColor: "#1E3A8A",
    formFields: [
      "Student Full Name",
      "College Email Address",
      "College / University Name",
      "Roll / Registration Number",
      "Department & Academic Year",
    ],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Zone & Session Access",
    confirmationDetails: "Instant pass on student portal with encrypted QR anti-proxy token.",
    includedFeatures: [
      "Student Name, College Email, Roll Number, Department",
      "Automated student verification & ID check",
      "Lanyard fest badge with woven strap & slot cutout",
      "Zone & stage gate validation (Main Stage, Pro-Show)",
      "Zero-proxy entry with sub-0.3s camera check-in",
      "Live campus footfall dashboard",
    ],
    eventPage: {
      heroTitle: "RIVIERA CULTURAL FEST 2026",
      heroSubtitle: "Annual national inter-collegiate symposium with 60+ competitive events.",
      badge: "CAMPUS FESTIVAL",
      date: "Friday, 18 September 2026 · 09:00 AM",
      venue: "University Open Air Theatre & Main Campus",
      highlights: ["60+ Competitions", "Celebrity Pro-Night", "Inter-College Trophies"],
    },
    registrationForm: {
      formTitle: "Student Fest Delegate Entry",
      fields: [
        { label: "Student Full Name", placeholder: "e.g., Sneha Reddy", required: true },
        { label: "College Email", placeholder: "sneha.22cs@annauniv.edu", required: true, type: "email" },
        { label: "Roll / Register Number", placeholder: "e.g., 2022103492", required: true },
        { label: "College / Institution", placeholder: "e.g., College of Engineering Guindy", required: true },
        { label: "Department & Year", placeholder: "e.g., Computer Science · 3rd Year", required: true },
      ],
      submitButtonText: "Get Free Student Pass →",
    },
    qrPass: {
      passType: "Official Student Festival Pass",
      tier: "STUDENT DELEGATE",
      primaryColor: "#1E3A8A",
      attendeeName: "Sneha Reddy",
      role: "Anna University · Dept of CSE",
      qrToken: "URP-CAMPUS-48201",
      venue: "University Main Campus",
      date: "18 SEP 2026 · ALL-DAY",
    },
    lanyardBadge: {
      badgeType: "Campus Lanyard Pass",
      strapColor: "#1E3A8A",
      strapLabel: "RIVIERA '26",
      clipColor: "silver",
      attendeeName: "Sneha Reddy",
      organization: "Anna University",
      accessBarText: "ACADEMIC DELEGATE · ALL-CAMPUS ACCESS",
      accessColor: "#1E3A8A",
    },
  },

  // 3. RSVP Event (Featured #3)
  {
    id: "rsvp-event",
    name: "RSVP Event",
    category: "Social",
    secondaryCategory: "Invite Only",
    subtitle: "Elegant minimalist guest registration for weddings, receptions & private galas.",
    bestFor: "Weddings, private galas & intimate gatherings",
    featured: true,
    chips: ["Social", "RSVP", "Minimal Pass", "Single Gate"],
    accentColor: "#475569",
    formFields: [
      "Guest Full Name",
      "Phone / WhatsApp Number",
      "Attending Status (Attending / Regret)",
      "Plus-One (+1) Guest Name",
      "Dietary Preference / Notes",
    ],
    approvalWorkflow: "Invite-Only Token",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Personalized WhatsApp & email invitation with discreet entry QR.",
    includedFeatures: [
      "Guest Name, WhatsApp, Attending Status, +1 Guest",
      "One-click RSVP accept / decline link",
      "Minimalist digital invitation pass with personal QR",
      "Host guest list counter & instant concierge check-in",
      "No tickets or payment required — purely private guest management",
      "Automatic headcount tally for catering and seating",
    ],
    eventPage: {
      heroTitle: "Meera & Rohan’s Wedding Reception",
      heroSubtitle: "Join us for an evening of joy, dinner, and celebration under the stars.",
      badge: "PRIVATE CELEBRATION",
      date: "Sunday, 14 November 2026 · 06:30 PM",
      venue: "The Glass House Gardens, Bangalore",
      highlights: ["Welcome Cocktails", "Seated Gala Dinner", "Live Jazz Quartet"],
    },
    registrationForm: {
      formTitle: "Guest RSVP Confirmation",
      fields: [
        { label: "Your Full Name", placeholder: "e.g., Vikram & Priya Mehra", required: true },
        { label: "WhatsApp Number", placeholder: "+91 98450 12345", required: true, type: "tel" },
        { label: "RSVP Status", placeholder: "Gladly Attending", required: true },
        { label: "Total Number of Guests", placeholder: "2 Guests", required: true },
        { label: "Dietary Preferences", placeholder: "e.g., Vegetarian / Gluten-Free", required: false },
      ],
      submitButtonText: "Confirm RSVP →",
    },
    qrPass: {
      passType: "Private Guest Invitation",
      tier: "INVITED GUEST",
      primaryColor: "#475569",
      attendeeName: "Vikram & Priya Mehra",
      role: "Table 12 · Guest of the Family",
      qrToken: "URP-RSVP-09142",
      venue: "The Glass House Gardens",
      date: "14 NOV 2026 · 06:30 PM",
    },
    lanyardBadge: {
      badgeType: "Concierge Guest Card",
      strapColor: "#334155",
      strapLabel: "PRIVATE GUEST",
      clipColor: "gold",
      attendeeName: "Vikram Mehra",
      organization: "Invited Guest (Table 12)",
      accessBarText: "HONORED GUEST · PRIVATE ACCESS",
      accessColor: "#334155",
    },
  },

  // 4. Workshop & Masterclass (Conferences / Corporate)
  {
    id: "workshop",
    name: "Workshop & Masterclass",
    category: "Conferences",
    secondaryCategory: "Corporate",
    subtitle: "Capacity-capped training setup with instructor review and attendee certificates.",
    bestFor: "Training, hands-on masterclasses & executive bootcamps",
    chips: ["Corporate", "Approval Required", "Digital Pass", "Single Gate"],
    accentColor: "#0F766E",
    formFields: [
      "Participant Name",
      "Work Email Address",
      "LinkedIn Profile URL",
      "Current Experience Level",
      "What do you hope to learn?",
    ],
    approvalWorkflow: "Manual Review & Approval",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Approval notification email with workspace prep instructions and pass.",
    includedFeatures: [
      "Participant Name, Email, LinkedIn, Skill Level",
      "Instructor review & strict capacity cap (e.g. 40 seats)",
      "Automated approval/waitlist workflow",
      "Verifiable completion certificate token",
      "Single gate entrance scanner",
      "Pre-event materials delivery via pass",
    ],
    eventPage: {
      heroTitle: "Applied AI & LLM Systems Masterclass",
      heroSubtitle: "Hands-on architectural deep-dive with production code and model deployment.",
      badge: "TECHNICAL WORKSHOP",
      date: "Saturday, 10 October 2026 · 10:00 AM",
      venue: "WeWork Labs Arena, Koramangala",
      highlights: ["Limited to 40 Engineers", "Live Cloud GPUs Provided", "Verifiable Pass"],
    },
    registrationForm: {
      formTitle: "Workshop Application & Seat Request",
      fields: [
        { label: "Full Name", placeholder: "e.g., Karthik Natarajan", required: true },
        { label: "Work / Professional Email", placeholder: "karthik@startup.io", required: true, type: "email" },
        { label: "LinkedIn / GitHub URL", placeholder: "linkedin.com/in/karthikn", required: true },
        { label: "Primary Programming Language", placeholder: "e.g., Python / TypeScript", required: true },
      ],
      submitButtonText: "Apply for Seat →",
    },
    qrPass: {
      passType: "Masterclass Access Pass",
      tier: "WORKSHOP PARTICIPANT",
      primaryColor: "#0F766E",
      attendeeName: "Karthik Natarajan",
      role: "Applied AI Masterclass · Seat #18",
      qrToken: "URP-WRK-30192",
      venue: "WeWork Labs Arena, Bangalore",
      date: "10 OCT 2026 · 10:00 AM",
    },
    lanyardBadge: {
      badgeType: "Masterclass Lanyard Badge",
      strapColor: "#0F766E",
      strapLabel: "URPASS ACADEMY",
      clipColor: "silver",
      attendeeName: "Karthik Natarajan",
      organization: "Participant · Cohort 04",
      accessBarText: "CONFIRMED FELLOW · LAB ACCESS",
      accessColor: "#0F766E",
    },
  },

  // 5. Exhibition & Trade Expo (Corporate) - Wide Card
  {
    id: "exhibition",
    name: "Exhibition & Trade Expo",
    category: "Corporate",
    subtitle: "Multi-category trade show with color-coded badges for exhibitors, buyers & speakers.",
    bestFor: "Expos, trade shows, vendor conventions & summits",
    wide: true,
    chips: ["Corporate", "Multi-Category", "Exhibitor Badge", "Multi-Gate"],
    accentColor: "#2563EB",
    formFields: [
      "Registrant Name",
      "Company Name",
      "Registration Category (Buyer / Exhibitor / Press)",
      "Tax / GST ID (Optional)",
      "Product Interests",
    ],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "Instant high-density trade badge with QR lead-retrieval support.",
    includedFeatures: [
      "Multi-category registration: Buyer, Exhibitor, Speaker, Press",
      "Color-coded lanyard badges for instant visual identification",
      "Multi-hall turnstile scanning & lead retrieval exchange",
      "Exhibitor portal for booth team pass allocation",
      "Real-time floor occupancy and flow analytics",
      "Thermal printer compatible printable format included",
    ],
    eventPage: {
      heroTitle: "India Clean Energy Trade Expo 2026",
      heroSubtitle: "Over 350 international exhibitors and 12,000 industrial buyers under one roof.",
      badge: "INTERNATIONAL B2B EXPO",
      date: "12-14 November 2026 · 10:00 AM - 06:00 PM",
      venue: "Pragati Maidan, Hall 4-7, New Delhi",
      highlights: ["350+ Exhibitor Booths", "B2B Buyer Matchmaking", "12,000+ Trade Visitors"],
    },
    registrationForm: {
      formTitle: "Trade Visitor & Buyer Accreditation",
      fields: [
        { label: "Full Name", placeholder: "e.g., Rajesh Singhania", required: true },
        { label: "Corporate Email", placeholder: "rajesh@singhaniagroup.in", required: true, type: "email" },
        { label: "Company Name", placeholder: "Singhania Industrial Corp", required: true },
        { label: "Registration Category", placeholder: "Accredited Trade Buyer", required: true },
        { label: "City & Country", placeholder: "Mumbai, India", required: true },
      ],
      submitButtonText: "Register for Free Trade Pass →",
    },
    qrPass: {
      passType: "Official Trade Pass",
      tier: "ACCREDITED BUYER",
      primaryColor: "#2563EB",
      attendeeName: "Rajesh Singhania",
      role: "Singhania Industrial Corp",
      qrToken: "URP-EXPO-77210",
      venue: "Pragati Maidan, New Delhi",
      date: "12-14 NOV 2026 · 10:00 AM",
    },
    lanyardBadge: {
      badgeType: "B2B Trade Lanyard Badge",
      strapColor: "#2563EB",
      strapLabel: "TRADE EXPO '26",
      clipColor: "silver",
      attendeeName: "Rajesh Singhania",
      organization: "Singhania Industrial Corp",
      accessBarText: "ACCREDITED TRADE BUYER · B2B VIP",
      accessColor: "#2563EB",
    },
  },

  // 6. Networking Event (Social / Corporate)
  {
    id: "networking-meetup",
    name: "Networking Event",
    category: "Social",
    secondaryCategory: "Corporate",
    subtitle: "Lightweight mixer setup with icebreaker tags and instant mobile pass check-in.",
    bestFor: "Founder breakfasts, professional mixers & community meetups",
    chips: ["Social", "Simple Registration", "QR Pass", "Single Gate"],
    accentColor: "#6D28D9",
    formFields: [
      "Your Name",
      "Email Address",
      "Company / Project Name",
      "Looking for (Hiring / Funding / Co-founder)",
    ],
    approvalWorkflow: "Automatic Confirmation",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Direct pass link sent via SMS/WhatsApp and email.",
    includedFeatures: [
      "Name, Email, Company, Looking For",
      "Instant pass delivery with personal icebreaker tags",
      "Lightweight mobile pass with 0.2s gate check-in",
      "Live attendee digital rolodex for easy introductions",
      "Single host door check-in via smartphone camera",
      "Automated post-event networking directory email",
    ],
    eventPage: {
      heroTitle: "SaaS Founders & Builders Mixer",
      heroSubtitle: "Casual evening of conversations, product demos, and founder stories.",
      badge: "COMMUNITY MIXER",
      date: "Friday, 02 October 2026 · 06:30 PM",
      venue: "Third Wave Roasters, Indiranagar, Bangalore",
      highlights: ["80+ Bootstrapped Founders", "Open Mic Demos", "No Pitch Decks"],
    },
    registrationForm: {
      formTitle: "Mixer Guest Registration",
      fields: [
        { label: "Full Name", placeholder: "e.g., Divya Ramanathan", required: true },
        { label: "Email Address", placeholder: "divya@builderstack.com", required: true, type: "email" },
        { label: "Current Startup / Project", placeholder: "BuilderStack AI", required: true },
        { label: "What are you currently looking for?", placeholder: "e.g., Angel Investors / Design Partner", required: false },
      ],
      submitButtonText: "Join the Guestlist →",
    },
    qrPass: {
      passType: "Mixer Pass",
      tier: "FOUNDER / ATTENDEE",
      primaryColor: "#6D28D9",
      attendeeName: "Divya Ramanathan",
      role: "BuilderStack AI · Founder",
      qrToken: "URP-MIX-19402",
      venue: "Third Wave, Indiranagar",
      date: "02 OCT 2026 · 06:30 PM",
    },
    lanyardBadge: {
      badgeType: "Mixer Badge",
      strapColor: "#6D28D9",
      strapLabel: "FOUNDER MIX",
      clipColor: "silver",
      attendeeName: "Divya Ramanathan",
      organization: "BuilderStack AI",
      accessBarText: "COMMUNITY MEMBER · OPEN ACCESS",
      accessColor: "#6D28D9",
    },
  },

  // 7. Product Launch (Corporate / Invite Only)
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Corporate",
    secondaryCategory: "Invite Only",
    subtitle: "High-impact brand keynote setup with press accreditation and embargo agreements.",
    bestFor: "Keynotes, hardware debuts & brand reveals",
    chips: ["Corporate", "Invite Only", "VIP Pass", "VIP Gate"],
    accentColor: "#09090B",
    formFields: [
      "Guest / Press Name",
      "Media Publication / Firm",
      "Accreditation Code",
      "Embargo NDA Agreement Check",
    ],
    approvalWorkflow: "Invite-Only Token",
    gateConfig: "VIP & Executive Gate",
    confirmationDetails: "Personalized media badge with press kit download lock.",
    includedFeatures: [
      "Guest Name, Publication, VIP Access Token",
      "Embargo NDA agreement confirmation checkbox",
      "Dark glass executive pass with holographic styling",
      "White-glove VIP door scanning with concierge greeting",
      "Press kit release trigger tied to entrance scan",
      "Private VIP greenroom and lounge permissions",
    ],
    eventPage: {
      heroTitle: "ORION V2 GLOBAL PRODUCT REVEAL",
      heroSubtitle: "Unveiling our next generation spatial compute platform.",
      badge: "KEYNOTE & PRESS DEBUT",
      date: "Wednesday, 16 September 2026 · 10:00 AM",
      venue: "Auditorium Hall A, Aerocity, New Delhi",
      highlights: ["Live Hardware Keynote", "Hands-on Demo Pavilions", "Press Briefing"],
    },
    registrationForm: {
      formTitle: "Press & VIP Keynote Accreditation",
      fields: [
        { label: "Full Name", placeholder: "e.g., Amitav Sen", required: true },
        { label: "Publication / Outlet", placeholder: "e.g., TechCrunch / Wired India", required: true },
        { label: "Work Email", placeholder: "amitav.sen@media.com", required: true, type: "email" },
        { label: "Accreditation Invite Token", placeholder: "Enter 8-character invite code", required: true },
      ],
      submitButtonText: "Claim Press Credential →",
    },
    qrPass: {
      passType: "VIP Press Keynote Pass",
      tier: "PRESS & MEDIA VIP",
      primaryColor: "#09090B",
      attendeeName: "Amitav Sen",
      role: "Wired India · Senior Editor",
      qrToken: "URP-PRESS-00918",
      venue: "Auditorium A, Aerocity",
      date: "16 SEP 2026 · 10:00 AM",
    },
    lanyardBadge: {
      badgeType: "Keynote Lanyard Badge",
      strapColor: "#18181B",
      strapLabel: "ORION KEYNOTE",
      clipColor: "gold",
      attendeeName: "Amitav Sen",
      organization: "Wired India",
      accessBarText: "PRESS & KEYNOTE VIP · EMBARGO PASS",
      accessColor: "#18181B",
    },
  },

  // 8. VIP Invitation Gala (Invite Only) - Wide Card
  {
    id: "vip-invitation",
    name: "VIP Invitation Gala",
    category: "Invite Only",
    subtitle: "Prestigious black-tie setup with valet check-in and private lounge clearance.",
    bestFor: "Awards nights, charity galas & executive dinners",
    wide: true,
    chips: ["Invite Only", "Approval Required", "VIP Pass", "VIP Gate"],
    accentColor: "#18181B",
    formFields: [
      "Patron Full Name",
      "Executive Title & Board Affiliation",
      "Direct Mobile Number",
      "Dietary & Beverage Preferences",
      "Vehicle Plate Number (For Valet)",
    ],
    approvalWorkflow: "Manual Review & Approval",
    gateConfig: "VIP & Executive Gate",
    confirmationDetails: "Encrypted gold-embossed digital pass with private arrival chauffeur link.",
    includedFeatures: [
      "Patron Name, Title, Direct Phone, Valet Vehicle Number",
      "Secret access token & concierge whitelist verification",
      "Luxury matte obsidian & champagne gold card aesthetics",
      "Host arrival alerts via push notification when patron scans in",
      "Valet parking integration and trustee lounge clearance",
      "Private table number assignment on pass screen",
    ],
    eventPage: {
      heroTitle: "ANNUAL LEADERSHIP FELLOWS GALA",
      heroSubtitle: "An exclusive black-tie evening honoring global philanthropic trustees.",
      badge: "INVITATION ONLY",
      date: "Saturday, 05 December 2026 · 07:00 PM",
      venue: "The Oberoi Grand Ballroom, Mumbai",
      highlights: ["Black-Tie Dinner", "Philanthropy Awards", "Trustee Lounge Access"],
    },
    registrationForm: {
      formTitle: "Trustee & Patron RSVP Verification",
      fields: [
        { label: "Honored Guest Name", placeholder: "e.g., Vikramaditya Singhania", required: true },
        { label: "Designation / Institution", placeholder: "e.g., Chairman, Singhania Foundation", required: true },
        { label: "Private Email", placeholder: "v.singhania@privateoffice.in", required: true, type: "email" },
        { label: "VIP Invite Passcode", placeholder: "Enter confidential VIP code", required: true },
      ],
      submitButtonText: "Validate VIP Pass →",
    },
    qrPass: {
      passType: "Luxury Gala Credential",
      tier: "HONORED TRUSTEE",
      primaryColor: "#18181B",
      attendeeName: "Vikramaditya Singhania",
      role: "Chairman · Table 01",
      qrToken: "URP-VIP-88001",
      venue: "The Oberoi, Mumbai",
      date: "05 DEC 2026 · 07:00 PM",
    },
    lanyardBadge: {
      badgeType: "Obsidian Gold Lanyard",
      strapColor: "#18181B",
      strapLabel: "TRUSTEE GALA",
      clipColor: "gold",
      attendeeName: "V. Singhania",
      organization: "Singhania Foundation",
      accessBarText: "EXECUTIVE PATRON · TRUSTEE LOUNGE CLEARANCE",
      accessColor: "#18181B",
    },
  },

  // 9. Paid Event (Ticketed)
  {
    id: "paid-event",
    name: "Paid Event",
    category: "Ticketed",
    subtitle: "Tiered ticketing with instant Razorpay 0% commission UPI and printable stubs.",
    bestFor: "Ticket sales, concerts, festivals & premium summits",
    chips: ["Ticketed", "Paid Ticketing", "Perforated Stub", "Multi-Gate"],
    accentColor: "#D97706",
    formFields: [
      "Buyer Name",
      "Email Address",
      "Phone Number",
      "Ticket Tier Selection (Early Bird / GA / VIP)",
      "Number of Tickets",
    ],
    approvalWorkflow: "Paid Instant Ticket",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "Instant ticket delivery via WhatsApp & email upon payment success.",
    includedFeatures: [
      "Tiered ticket types: Early Bird, General Admission, VIP Box",
      "0% platform commission: Direct to your Razorpay account",
      "Instant UPI payments: Google Pay, PhonePe, Paytm, Cred",
      "Dual QR & barcode anti-duplicate ticket validation",
      "Printable tear-off ticket stub format included",
      "Live sales revenue and check-in conversion analytics",
    ],
    eventPage: {
      heroTitle: "ECHOES LIVE MUSIC & ARTS FESTIVAL",
      heroSubtitle: "2 Days, 3 Stages, 24 Artists under the open amphitheatre sky.",
      badge: "LIVE CONCERT FESTIVAL",
      date: "28-29 November 2026 · 03:00 PM",
      venue: "JLN Stadium Amphitheatre, New Delhi",
      highlights: ["3 Live Music Stages", "Food Village & Flea Market", "Fast Turnstile Scanning"],
    },
    registrationForm: {
      formTitle: "Select Ticket Category & Checkout",
      fields: [
        { label: "Buyer Full Name", placeholder: "e.g., Aditya Roy", required: true },
        { label: "Email Address", placeholder: "aditya.roy@gmail.com", required: true, type: "email" },
        { label: "WhatsApp Number", placeholder: "+91 98112 34567", required: true, type: "tel" },
        { label: "Select Ticket Category", placeholder: "General Admission Pass (Phase 1) — ₹999", required: true },
      ],
      submitButtonText: "Proceed to UPI Payment (₹999) →",
    },
    qrPass: {
      passType: "Digital Entry Ticket",
      tier: "GENERAL ADMISSION",
      primaryColor: "#D97706",
      attendeeName: "Aditya Roy",
      role: "Gate 04 · Phase 1 Pass",
      qrToken: "URP-TKT-99301",
      venue: "JLN Amphitheatre, Delhi",
      date: "28 NOV 2026 · 03:00 PM",
    },
    lanyardBadge: {
      badgeType: "Concert Ticket Stub",
      strapColor: "#9A3412",
      strapLabel: "ECHOES FEST",
      clipColor: "black",
      attendeeName: "Aditya Roy",
      organization: "General Admission Pass",
      accessBarText: "FESTIVAL ADMISSION · ALL-STAGES ACCESS",
      accessColor: "#9A3412",
    },
  },

  // 10. Hackathon Terminal (Campus)
  {
    id: "hackathon",
    name: "Hackathon",
    category: "Campus",
    secondaryCategory: "Corporate",
    subtitle: "24-48h developer hackathon setup with team grouping and meal token tracking.",
    bestFor: "Tech hackathons, campus buildathons & code jams",
    chips: ["Campus", "Approval Required", "Developer Badge", "Multi-Gate"],
    accentColor: "#050505",
    formFields: [
      "Hacker Name",
      "GitHub Username",
      "Team Name & Leader Status",
      "Primary Tech Stack",
      "T-Shirt Size & Dietary Requirements",
    ],
    approvalWorkflow: "Manual Review & Approval",
    gateConfig: "Multi-Gate Turnstiles",
    confirmationDetails: "Developer terminal pass with meal token counters and mentor review.",
    includedFeatures: [
      "Hacker Name, GitHub, Team Name, Tech Stack, T-Shirt",
      "Team grouping & mentor review approval workflow",
      "Matrix terminal pass with meal counters (Breakfast, Lunch, Dinner)",
      "Hacker arena 24h continuous re-entry gate check",
      "Discord / Slack invite auto-link inside digital pass",
      "Sub-0.3s camera scanner on organizer smartphones",
    ],
    eventPage: {
      heroTitle: "HACKNATION 2026: 36H BUILDATHON",
      heroSubtitle: "Over 500 hackers building autonomous agents and cloud primitives.",
      badge: "DEVELOPER BUILDATHON",
      date: "17-18 October 2026 · 36 Hours",
      venue: "Tech Innovation Hub, IIT Madras Research Park",
      highlights: ["₹10,00,000 Prize Pool", "Cloud Credits for all", "Midnight Mentorship"],
    },
    registrationForm: {
      formTitle: "Hacker Application & Team Registration",
      fields: [
        { label: "Hacker Full Name", placeholder: "e.g., Harish Vardhan", required: true },
        { label: "Email Address", placeholder: "harish@devs.in", required: true, type: "email" },
        { label: "GitHub Profile", placeholder: "github.com/harishv", required: true },
        { label: "Team Name", placeholder: "e.g., NeuralStack", required: true },
        { label: "Primary Track", placeholder: "AI Agents & Autonomous Systems", required: true },
      ],
      submitButtonText: "Submit Project Proposal →",
    },
    qrPass: {
      passType: "Developer Terminal Pass",
      tier: "HACKER / BUILDER",
      primaryColor: "#050505",
      attendeeName: "Harish Vardhan",
      role: "Team NeuralStack · Hacker #042",
      qrToken: "URP-HACK-04281",
      venue: "IITM Research Park",
      date: "17-18 OCT 2026",
    },
    lanyardBadge: {
      badgeType: "Hacker Lanyard Badge",
      strapColor: "#0F172A",
      strapLabel: "HACKNATION '26",
      clipColor: "silver",
      attendeeName: "Harish Vardhan",
      organization: "Team NeuralStack",
      accessBarText: "AUTHORIZED BUILDER · 24H ARENA ACCESS",
      accessColor: "#050505",
    },
  },

  // 11. Sports Tournament (Social / Ticketed)
  {
    id: "sports-tournament",
    name: "Sports Tournament",
    category: "Social",
    secondaryCategory: "Ticketed",
    subtitle: "Athletic event setup with bib numbers, player category tags and zone security.",
    bestFor: "Marathons, tournaments, sports meets & leagues",
    chips: ["Social", "Paid Ticketing", "Sports Pass", "Zone-Based"],
    accentColor: "#1E1B4B",
    formFields: [
      "Athlete / Participant Name",
      "Age & Gender Category",
      "Emergency Contact Name & Phone",
      "T-Shirt / Jersey Size",
      "Medical Fitness Self-Declaration",
    ],
    approvalWorkflow: "Paid Instant Ticket",
    gateConfig: "Zone & Session Access",
    confirmationDetails: "Digital athlete bib with zone permissions (Pitch, Locker, Spectator).",
    includedFeatures: [
      "Athlete Name, Category, Emergency Contact, Medical Check",
      "Dynamic Bib number allocation with color-coded category",
      "Locker room, warm-up track & field zone permissions",
      "Medic & race timing chip checkpoint scanning",
      "Spectator entrance turnstile gate management",
      "Instant race result notification link on digital pass",
    ],
    eventPage: {
      heroTitle: "BANGALORE CITY 10K & HALF MARATHON",
      heroSubtitle: "Run through the green heart of the city with 8,000+ passionate runners.",
      badge: "OFFICIAL RUNNING EVENT",
      date: "Sunday, 22 November 2026 · 05:30 AM",
      venue: "Kanteerava Stadium, Bangalore",
      highlights: ["AIMS Certified Route", "Finisher Medal & Tee", "Hydration & Medical Support"],
    },
    registrationForm: {
      formTitle: "Athlete Entry & Category Selection",
      fields: [
        { label: "Runner Full Name", placeholder: "e.g., Manoj Krishnan", required: true },
        { label: "Email Address", placeholder: "manoj.krishnan@run.in", required: true, type: "email" },
        { label: "Race Category", placeholder: "10K Timed Run (Age 25-35)", required: true },
        { label: "Emergency Contact Phone", placeholder: "+91 94440 98765", required: true, type: "tel" },
      ],
      submitButtonText: "Register & Pay Race Fee →",
    },
    qrPass: {
      passType: "Official Athlete Credential",
      tier: "TIMED ATHLETE",
      primaryColor: "#1E1B4B",
      attendeeName: "Manoj Krishnan",
      role: "Bib #1042 · Wave 1 (10K)",
      qrToken: "URP-RUN-10420",
      venue: "Kanteerava Stadium",
      date: "22 NOV 2026 · 05:30 AM",
    },
    lanyardBadge: {
      badgeType: "Athlete Bib Badge",
      strapColor: "#1E1B4B",
      strapLabel: "BLR 10K '26",
      clipColor: "silver",
      attendeeName: "Manoj Krishnan",
      organization: "Bib #1042 (Wave 1)",
      accessBarText: "ATHLETE · LOCKER & TRACK CLEARANCE",
      accessColor: "#1E1B4B",
    },
  },

  // 12. Employee Event & Offsite (Corporate)
  {
    id: "employee-event",
    name: "Employee Event",
    category: "Corporate",
    secondaryCategory: "Invite Only",
    subtitle: "Internal company summit with SSO authentication, shuttle bus booking & meal passes.",
    bestFor: "Internal corporate offsites, annual days & team retreats",
    chips: ["Corporate", "Invite Only", "Corporate Badge", "Single Gate"],
    accentColor: "#334155",
    formFields: [
      "Employee Full Name",
      "Corporate Work Email",
      "Department & Business Unit",
      "Office Location / City",
      "Shuttle Bus Route Selection",
    ],
    approvalWorkflow: "Invite-Only Token",
    gateConfig: "Single Gate Check-in",
    confirmationDetails: "Pass added to Apple Wallet / Google Wallet with employee bus seat info.",
    includedFeatures: [
      "Employee Name, Work Email, Department, Shuttle Route",
      "Corporate SSO / Domain whitelist matching validation",
      "Shuttle bus pickup scan & venue entrance check",
      "Team bonding activity & dining hall meal coupon",
      "Zero registration friction — 1-click internal RSVP",
      "Live HR attendance & department participation statistics",
    ],
    eventPage: {
      heroTitle: "ACME GLOBAL ANNUAL SUMMIT 2026",
      heroSubtitle: "Celebrating our milestones, team innovations, and 2027 vision.",
      badge: "INTERNAL TEAM OFFSITE",
      date: "Friday, 11 December 2026 · 09:30 AM",
      venue: "Leela Palace Grand Ballroom & Lawn, Bangalore",
      highlights: ["Townhall Keynote", "Team Innovation Awards", "Gala Dinner & DJ"],
    },
    registrationForm: {
      formTitle: "Employee Attendance & Shuttle RSVP",
      fields: [
        { label: "Employee Name", placeholder: "e.g., Neha Sundaram", required: true },
        { label: "Corporate Email", placeholder: "neha.s@acmecorp.com", required: true, type: "email" },
        { label: "Department / Pod", placeholder: "Design Systems & Product", required: true },
        { label: "Shuttle Pickup Point", placeholder: "Indiranagar Metro Station (08:00 AM)", required: true },
      ],
      submitButtonText: "Confirm Offsite Attendance →",
    },
    qrPass: {
      passType: "Corporate Employee Pass",
      tier: "STAFF / EMPLOYEE",
      primaryColor: "#334155",
      attendeeName: "Neha Sundaram",
      role: "Design Systems · Shuttle Route B",
      qrToken: "URP-EMP-55201",
      venue: "Leela Palace, Bangalore",
      date: "11 DEC 2026 · 09:30 AM",
    },
    lanyardBadge: {
      badgeType: "Employee Lanyard Pass",
      strapColor: "#334155",
      strapLabel: "ACME OFFSITE",
      clipColor: "silver",
      attendeeName: "Neha Sundaram",
      organization: "Product & Design Pod",
      accessBarText: "INTERNAL STAFF · FULL SUMMIT ACCESS",
      accessColor: "#334155",
    },
  },
];
