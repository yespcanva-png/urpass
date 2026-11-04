import { VisitorSegment } from "./types";
import { detectVisitorSegment } from "./attribution";

export type FunnelTemplateKey =
  | "conference"
  | "badge"
  | "scanner"
  | "college_fest"
  | "workshop"
  | "corporate"
  | "vip_access"
  | "pitch_day"
  | "alumni"
  | "networking"
  | "product_launch"
  | "hackathon"
  | "general";

export interface ResolvedFunnelIntent {
  template: FunnelTemplateKey;
  ctaText: string;
  suggestedEventName: string;
  suggestedCapacity: number;
  category: "conference" | "college" | "workshop" | "corporate" | "festival" | "general";
  badgeSummary: string;
  visitorSegment: VisitorSegment;
  signupUrl: string;
  sampleTicket: {
    eventName: string;
    ticketTier: string;
    attendeeName: string;
    organization: string;
    zone: string;
    token: string;
  };
  sampleFormFields: Array<{
    label: string;
    type: string;
    placeholder: string;
    value: string;
  }>;
}

/**
 * Resolves high-intent conversion funnel configuration from an SEO page slug or keyword.
 */
export function resolveFunnelIntent(slugOrPageId: string): ResolvedFunnelIntent {
  const s = slugOrPageId.toLowerCase();

  // 1. Conference & Symposia
  if (s.includes("conference") || s.includes("summit") || s.includes("symposi") || s.includes("delegate")) {
    const isBadge = s.includes("badge");
    if (isBadge) {
      return {
        template: "badge",
        ctaText: "Design My Badge",
        suggestedEventName: "Leadership Summit Badges",
        suggestedCapacity: 250,
        category: "conference",
        badgeSummary: "Badge Generator · Formatted for Avery sheets & thermal prints",
        visitorSegment: "corporate",
        signupUrl: buildSignupUrl(s, "badge", "Design My Badge", "Leadership Summit Badges", 250, "corporate"),
        sampleTicket: {
          eventName: "Global Leadership Summit 2026",
          ticketTier: "Keynote Speaker",
          attendeeName: "Dr. Ananya Rao",
          organization: "Stanford Medicine • Chair",
          zone: "HALL A • STAGE ACCESS",
          token: "URPASS-BDG-7712",
        },
        sampleFormFields: [
          { label: "Full Name & Degree", type: "text", placeholder: "Dr. Ananya Rao, MD", value: "Dr. Ananya Rao" },
          { label: "Affiliation / Hospital", type: "text", placeholder: "Stanford Medicine", value: "Stanford Medicine" },
          { label: "Badge Ribbon", type: "select", placeholder: "Speaker", value: "Keynote Speaker" },
        ],
      };
    }
    return {
      template: "conference",
      ctaText: "Create Conference",
      suggestedEventName: "Annual Technology Conference 2026",
      suggestedCapacity: 500,
      category: "conference",
      badgeSummary: "Conference Template · Multi-track agenda & QR badge check-in ready",
      visitorSegment: "corporate",
      signupUrl: buildSignupUrl(s, "conference", "Create Conference", "Annual Technology Conference 2026", 500, "corporate"),
      sampleTicket: {
        eventName: "Annual Technology Conference 2026",
        ticketTier: "All-Access Delegate",
        attendeeName: "Vikram Sengupta",
        organization: "Acme Global • Enterprise Engineering",
        zone: "MAIN AUDITORIUM + WORKSHOPS",
        token: "URPASS-CONF-9821",
      },
      sampleFormFields: [
        { label: "Delegate Full Name", type: "text", placeholder: "e.g. Vikram Sengupta", value: "Vikram Sengupta" },
        { label: "Corporate Email", type: "email", placeholder: "name@company.com", value: "v.sengupta@acme-corp.com" },
        { label: "Workshop Track Selection", type: "select", placeholder: "AI Architecture", value: "Track 1: Cloud & AI" },
      ],
    };
  }

  // 2. Scanner & Offline Gate Control
  if (s.includes("scanner") || s.includes("offline") || s.includes("turnstile") || s.includes("gate")) {
    return {
      template: "scanner",
      ctaText: "Try Offline Scanner",
      suggestedEventName: "Live Festival Gate Check-In",
      suggestedCapacity: 1000,
      category: "festival",
      badgeSummary: "Gate Control · 100% Offline IndexedDB cache & sub-0.28s scanning",
      visitorSegment: "ticketing",
      signupUrl: buildSignupUrl(s, "scanner", "Try Offline Scanner", "Live Festival Gate Check-In", 1000, "ticketing"),
      sampleTicket: {
        eventName: "Sunset Music & Arts Festival",
        ticketTier: "General Admission",
        attendeeName: "Rohan Varma",
        organization: "Pass #48291",
        zone: "GATE 3 • NORTH TURNSTILE",
        token: "URPASS-GATE-3304",
      },
      sampleFormFields: [
        { label: "Attendee Name", type: "text", placeholder: "e.g. Rohan Varma", value: "Rohan Varma" },
        { label: "Mobile Number", type: "tel", placeholder: "+91 98765 43210", value: "+91 98765 43210" },
        { label: "Emergency Contact", type: "text", placeholder: "Contact Name & Phone", value: "Pooja Varma (+91 98765 11223)" },
      ],
    };
  }

  // 3. College & Student Fests
  if (s.includes("college") || s.includes("campus") || s.includes("fest") || s.includes("student") || s.includes("freshers")) {
    return {
      template: "college_fest",
      ctaText: "Create College Fest",
      suggestedEventName: "Campus Cultural & Tech Fest 2026",
      suggestedCapacity: 2500,
      category: "college",
      badgeSummary: "Campus Fest Template · Anti-screenshot dynamic foils & duplicate blocking",
      visitorSegment: "college",
      signupUrl: buildSignupUrl(s, "college_fest", "Create College Fest", "Campus Cultural & Tech Fest 2026", 2500, "college"),
      sampleTicket: {
        eventName: "Rhapsody Cultural Fest 2026",
        ticketTier: "Pro Night All-Access",
        attendeeName: "Aditi Sharma",
        organization: "St. Xavier's College • Roll #CS-224",
        zone: "MAIN ARENA • FRONT STAGE",
        token: "URPASS-FEST-5519",
      },
      sampleFormFields: [
        { label: "Student Full Name", type: "text", placeholder: "e.g. Aditi Sharma", value: "Aditi Sharma" },
        { label: "College / University ID", type: "text", placeholder: "ID Card #", value: "Roll #CS-224" },
        { label: "Pro-Night Artist Pass", type: "select", placeholder: "Pass Type", value: "Day 2 Celebrity Night" },
      ],
    };
  }

  // 4. Paid Workshops & Masterclasses
  if (s.includes("workshop") || s.includes("training") || s.includes("masterclass") || s.includes("bootcamp")) {
    return {
      template: "workshop",
      ctaText: "Create Paid Workshop",
      suggestedEventName: "Executive AI & Product Masterclass",
      suggestedCapacity: 30,
      category: "workshop",
      badgeSummary: "Workshop Template · Strict seat cap, instant UPI payouts & GST tax invoices",
      visitorSegment: "ticketing",
      signupUrl: buildSignupUrl(s, "workshop", "Create Paid Workshop", "Executive AI & Product Masterclass", 30, "ticketing"),
      sampleTicket: {
        eventName: "Executive AI Masterclass",
        ticketTier: "Confirmed Participant",
        attendeeName: "Meera Krishnan",
        organization: "TechCorp Labs • Lead Architect",
        zone: "SEAT #14 • HANDS-ON LAB",
        token: "URPASS-WKS-1092",
      },
      sampleFormFields: [
        { label: "Participant Name", type: "text", placeholder: "e.g. Meera Krishnan", value: "Meera Krishnan" },
        { label: "Company GSTIN (For Invoice)", type: "text", placeholder: "29AAAAA0000A1Z5", value: "29AABCT1332M1ZQ" },
        { label: "Years of Experience", type: "select", placeholder: "5-10 years", value: "8+ Years (Lead / Principal)" },
      ],
    };
  }

  // 5. VIP Access & Gala
  if (s.includes("vip") || s.includes("access-control") || s.includes("private-event") || s.includes("invite-only")) {
    return {
      template: "vip_access",
      ctaText: "Configure VIP Entry",
      suggestedEventName: "VIP Investor Gala & Private Lounge",
      suggestedCapacity: 100,
      category: "corporate",
      badgeSummary: "VIP Access Template · Zone restrictions, host alerts & anti-passback",
      visitorSegment: "corporate",
      signupUrl: buildSignupUrl(s, "vip_access", "Configure VIP Entry", "VIP Investor Gala & Private Lounge", 100, "corporate"),
      sampleTicket: {
        eventName: "Founders & Investors Gala 2026",
        ticketTier: "VIP Partner Pass",
        attendeeName: "Sanjay Kapoor",
        organization: "Sequoia Surge • Managing Partner",
        zone: "VIP LOUNGE + BOARDROOM",
        token: "URPASS-VIP-0044",
      },
      sampleFormFields: [
        { label: "Guest Name", type: "text", placeholder: "e.g. Sanjay Kapoor", value: "Sanjay Kapoor" },
        { label: "Corporate Title", type: "text", placeholder: "Managing Partner", value: "Managing Partner" },
        { label: "Lounge Table Preference", type: "select", placeholder: "Table 1", value: "Table 1: Tech & AI" },
      ],
    };
  }

  // 6. Startup Pitch & Demo Days
  if (s.includes("pitch") || s.includes("demo-day") || s.includes("startup")) {
    return {
      template: "pitch_day",
      ctaText: "Host Demo Day",
      suggestedEventName: "Startup Pitch Demo Day 2026",
      suggestedCapacity: 150,
      category: "corporate",
      badgeSummary: "Demo Day Template · Founder deck collection & demo table assignments",
      visitorSegment: "corporate",
      signupUrl: buildSignupUrl(s, "pitch_day", "Host Demo Day", "Startup Pitch Demo Day 2026", 150, "corporate"),
      sampleTicket: {
        eventName: "Cohort 12 Startup Demo Day",
        ticketTier: "Pitching Founder",
        attendeeName: "Kavita Rao",
        organization: "NeuralFlow AI • Founder & CEO",
        zone: "DEMO BOOTH #08 • MAIN STAGE",
        token: "URPASS-PITCH-8812",
      },
      sampleFormFields: [
        { label: "Startup Name", type: "text", placeholder: "e.g. NeuralFlow AI", value: "NeuralFlow AI" },
        { label: "Pitch Deck URL", type: "url", placeholder: "https://pitch.com/...", value: "https://pitch.com/neuralflow-deck" },
        { label: "Funding Stage", type: "select", placeholder: "Seed", value: "Seed ($1M - $2M)" },
      ],
    };
  }

  // 7. Alumni Reunion
  if (s.includes("alumni") || s.includes("reunion") || s.includes("jubilee")) {
    return {
      template: "alumni",
      ctaText: "Plan Alumni Reunion",
      suggestedEventName: "Class of 2001 Silver Jubilee Reunion",
      suggestedCapacity: 200,
      category: "general",
      badgeSummary: "Alumni Reunion Template · Batch year tagging & family group passes",
      visitorSegment: "general",
      signupUrl: buildSignupUrl(s, "alumni", "Plan Alumni Reunion", "Class of 2001 Silver Jubilee Reunion", 200, "general"),
      sampleTicket: {
        eventName: "Silver Jubilee Reunion (Class of 2001)",
        ticketTier: "Alumnus + Spouse Pass",
        attendeeName: "Deepak Mehta",
        organization: "Class of 2001 • B.Tech Mech • Mandakini Hostel",
        zone: "CAMPUS ENTRY + GALA DINNER",
        token: "URPASS-ALUM-2001",
      },
      sampleFormFields: [
        { label: "Alumnus Full Name", type: "text", placeholder: "e.g. Deepak Mehta", value: "Deepak Mehta" },
        { label: "Graduation Batch Year", type: "text", placeholder: "e.g. 2001", value: "2001" },
        { label: "College Hostel / House", type: "text", placeholder: "e.g. Mandakini", value: "Mandakini Hostel" },
      ],
    };
  }

  // 8. Business Networking & Mixers
  if (s.includes("networking") || s.includes("mixer") || s.includes("b2b")) {
    return {
      template: "networking",
      ctaText: "Host Networking Mixer",
      suggestedEventName: "B2B Founders & Tech Executives Mixer",
      suggestedCapacity: 120,
      category: "corporate",
      badgeSummary: "Networking Template · Digital vCard QR contact exchange & role badges",
      visitorSegment: "corporate",
      signupUrl: buildSignupUrl(s, "networking", "Host Networking Mixer", "B2B Founders & Tech Executives Mixer", 120, "corporate"),
      sampleTicket: {
        eventName: "B2B Founders & Leaders Mixer",
        ticketTier: "Founder / Executive",
        attendeeName: "Pooja Sundaram",
        organization: "Apex Cloud • VP of Growth",
        zone: "NETWORKING LOUNGE",
        token: "URPASS-NET-4091",
      },
      sampleFormFields: [
        { label: "Full Name", type: "text", placeholder: "e.g. Pooja Sundaram", value: "Pooja Sundaram" },
        { label: "Company & Designation", type: "text", placeholder: "Apex Cloud • VP", value: "Apex Cloud • VP of Growth" },
        { label: "LinkedIn Profile (vCard QR)", type: "url", placeholder: "https://linkedin.com/in/...", value: "https://linkedin.com/in/poojasundaram" },
      ],
    };
  }

  // 9. Product Launch
  if (s.includes("product-launch") || s.includes("launch")) {
    return {
      template: "product_launch",
      ctaText: "Create Launch Event",
      suggestedEventName: "Confidential Flagship Product Debut",
      suggestedCapacity: 100,
      category: "corporate",
      badgeSummary: "Product Launch Template · Media accreditation vetting & NDA acknowledgment",
      visitorSegment: "corporate",
      signupUrl: buildSignupUrl(s, "product_launch", "Create Launch Event", "Confidential Flagship Product Debut", 100, "corporate"),
      sampleTicket: {
        eventName: "Project Orion Flagship Unveiling",
        ticketTier: "Accredited Press & VIP",
        attendeeName: "Tara Deshmukh",
        organization: "TechWire Global • Senior Editor",
        zone: "KEYNOTE HALL + DEMO LABS",
        token: "URPASS-NDA-0912",
      },
      sampleFormFields: [
        { label: "Journalist / Guest Name", type: "text", placeholder: "e.g. Tara Deshmukh", value: "Tara Deshmukh" },
        { label: "Publication / Outlet", type: "text", placeholder: "TechWire Global", value: "TechWire Global" },
        { label: "Embargo / NDA Acknowledgment", type: "checkbox", placeholder: "Agreed", value: "Agreed (Strict Embargo to 10:00 AM)" },
      ],
    };
  }

  // Default: Corporate / General Event
  const segment = detectVisitorSegment(`/solutions/${slugOrPageId}`);
  return {
    template: "corporate",
    ctaText: "Set Up Corporate Event",
    suggestedEventName: "Corporate Event 2026",
    suggestedCapacity: 200,
    category: "corporate",
    badgeSummary: "Corporate Template · Custom registration, digital QR passes & gate sync",
    visitorSegment: segment,
    signupUrl: buildSignupUrl(s, "corporate", "Set Up Corporate Event", "Corporate Event 2026", 200, segment),
    sampleTicket: {
      eventName: "Corporate Annual Gathering 2026",
      ticketTier: "Confirmed Attendee",
      attendeeName: "Rahul Sharma",
      organization: "Enterprise Global",
      zone: "MAIN HALL",
      token: "URPASS-CORP-1011",
    },
    sampleFormFields: [
      { label: "Full Name", type: "text", placeholder: "e.g. Rahul Sharma", value: "Rahul Sharma" },
      { label: "Work Email", type: "email", placeholder: "name@company.com", value: "rahul@enterprise.com" },
      { label: "Department", type: "text", placeholder: "e.g. Operations", value: "Operations" },
    ],
  };
}

function buildSignupUrl(
  slug: string,
  template: FunnelTemplateKey,
  ctaText: string,
  eventName: string,
  capacity: number,
  segment: VisitorSegment
): string {
  const params = new URLSearchParams();
  params.set("source", slug);
  params.set("campaign", slug);
  params.set("from", `/solutions/${slug}`);
  params.set("template", template);
  params.set("intent", ctaText);
  params.set("eventName", eventName);
  params.set("capacity", capacity.toString());
  params.set("segment", segment);
  return `/signup?${params.toString()}`;
}
