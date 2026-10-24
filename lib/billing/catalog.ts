/**
 * UrPass Production-Ready Pricing & Product Catalog
 * Covers both Self-Service recurring subscriptions and Remote Managed Services (one-time event fees).
 */

export type ServiceModel = "self_service" | "remote_managed";
export type BillingCycle = "monthly" | "annual";

export interface SelfServicePlan {
  id: string;
  slug: "free" | "starter" | "pro" | "business";
  name: string;
  badge?: string;
  popular?: boolean;
  tagline: string;
  priceMonthlyInr: number; // in Rupees (excl. GST)
  priceMonthlyPaise: number; // in integer Paise
  priceAnnualInr: number; // in Rupees (excl. GST)
  priceAnnualPaise: number;
  razorpayMonthlyPlanId: string;
  razorpayAnnualPlanId: string;
  annualBillingAvailable: boolean; // Set to true only when provider annual mandate is activated
  limits: {
    activeEvents: number | "unlimited";
    attendeesPerEvent: number | "unlimited";
    teamSeats: number;
    customFields: number | "unlimited";
  };
  features: string[];
  restrictions?: string[];
  ctaText: string;
  ctaHref: string;
}

export interface RemoteManagedPackage {
  code: "essential" | "pro" | "premium" | "enterprise";
  name: string;
  badge?: string;
  popular?: boolean;
  tagline: string;
  maxAttendees: number | "unlimited";
  priceInr: number; // in Rupees (excl. GST)
  pricePaise: number; // in integer Paise
  depositPercentage: number; // 50% advance
  balancePercentage: number; // 50% balance
  includedTrainingSessions: number;
  supportLevel: "standard" | "priority" | "dedicated";
  features: string[];
  extraAttendeeRatePer1000Inr?: number;
  ctaText: string;
}

// ─── 1. SELF-SERVICE SUBSCRIPTIONS CATALOG ────────────────────────────────────

export const SELF_SERVICE_PLANS: SelfServicePlan[] = [
  {
    id: "plan_free",
    slug: "free",
    name: "Free Forever",
    badge: "No Credit Card Needed",
    tagline: "For individuals, student groups, and community meetups.",
    priceMonthlyInr: 0,
    priceMonthlyPaise: 0,
    priceAnnualInr: 0,
    priceAnnualPaise: 0,
    razorpayMonthlyPlanId: "",
    razorpayAnnualPlanId: "",
    annualBillingAvailable: false,
    limits: {
      activeEvents: 1,
      attendeesPerEvent: 100,
      teamSeats: 1,
      customFields: 3,
    },
    features: [
      "1 active event at a time",
      "Up to 100 registrations per event",
      "Free event registration & RSVP",
      "Basic custom registration forms",
      "Standard digital QR passes",
      "Basic smartphone camera scanning",
      "Basic attendance reporting",
      "Standard email confirmations",
      "Standard UrPass branding",
    ],
    restrictions: [
      "No paid ticket sales (free events only)",
      "No multi-gate scanning or group entry",
      "No advanced CSV exports or webhooks",
      "No white-label pass customization",
    ],
    ctaText: "Create Free Account",
    ctaHref: "/login?intent=signup&plan=free",
  },
  {
    id: "plan_starter",
    slug: "starter",
    name: "Starter",
    badge: "Best for Independent Hosts",
    tagline: "For workshops, club events, and independent organizers.",
    priceMonthlyInr: 499,
    priceMonthlyPaise: 49900,
    priceAnnualInr: 4999,
    priceAnnualPaise: 499900,
    razorpayMonthlyPlanId: process.env.RAZORPAY_STARTER_MONTHLY_PLAN_ID || "plan_TgkC27ktwiBn8b",
    razorpayAnnualPlanId: process.env.RAZORPAY_STARTER_YEARLY_PLAN_ID || "plan_TgkCnLPoiw44QA",
    annualBillingAvailable: false, // Annual plans require explicit merchant approval
    limits: {
      activeEvents: 3,
      attendeesPerEvent: 1000,
      teamSeats: 2,
      customFields: 10,
    },
    features: [
      "3 active events at a time",
      "Up to 1,000 attendees per event",
      "Free and paid ticketing (0% platform commission)",
      "Instant Razorpay payment integration",
      "Full CSV attendee import and export",
      "Standard gate check-in & duplicate scan detection",
      "Detailed attendance & registration reports",
      "Standard automated email notifications",
      "2 team member seats with role permissions",
    ],
    ctaText: "Select Starter Plan",
    ctaHref: "/billing?plan=starter",
  },
  {
    id: "plan_pro",
    slug: "pro",
    name: "Pro",
    popular: true,
    badge: "Most Popular",
    tagline: "For college fests, corporate gatherings, and recurring ticketed events.",
    priceMonthlyInr: 999,
    priceMonthlyPaise: 99900,
    priceAnnualInr: 9999,
    priceAnnualPaise: 999900,
    razorpayMonthlyPlanId: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || "plan_TgkEXl5vWzIhTS",
    razorpayAnnualPlanId: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID || "plan_TgkGA4nSLn91s2",
    annualBillingAvailable: false,
    limits: {
      activeEvents: 10,
      attendeesPerEvent: 5000,
      teamSeats: 5,
      customFields: "unlimited",
    },
    features: [
      "10 active events at a time",
      "Up to 5,000 attendees per event",
      "All Starter features included",
      "Advanced tiered ticketing & early-bird pricing",
      "Group QR tickets & partial family redemption",
      "Multi-session attendance tracking",
      "Custom pass design & branding controls",
      "Bulk CSV attendee uploads & invite links",
      "5 team member seats with granular access",
      "Multi-gate scanning configuration",
      "Priority customer email support",
    ],
    ctaText: "Select Pro Plan",
    ctaHref: "/billing?plan=pro",
  },
  {
    id: "plan_business",
    slug: "business",
    name: "Business",
    badge: "Scale & High Volume",
    tagline: "For event agencies, corporate summits, and multi-track conferences.",
    priceMonthlyInr: 2499,
    priceMonthlyPaise: 249900,
    priceAnnualInr: 24999,
    priceAnnualPaise: 2499900,
    razorpayMonthlyPlanId: process.env.RAZORPAY_BUSINESS_MONTHLY_PLAN_ID || "plan_TgkEzt9SACX9bc",
    razorpayAnnualPlanId: process.env.RAZORPAY_BUSINESS_YEARLY_PLAN_ID || "plan_TgkIV32JgsrRgg",
    annualBillingAvailable: false,
    limits: {
      activeEvents: 30,
      attendeesPerEvent: 15000,
      teamSeats: 15,
      customFields: "unlimited",
    },
    features: [
      "30 active events at a time",
      "Up to 15,000 attendees per event",
      "All Pro features included",
      "Advanced multi-tenant team permissions",
      "15 team member seats",
      "Cross-event analytics & executive exports",
      "Custom domain & DNS verification",
      "REST API access and custom webhooks",
      "Advanced multi-gate operational sync",
      "Dedicated priority technical support",
    ],
    ctaText: "Select Business Plan",
    ctaHref: "/billing?plan=business",
  },
];

// ─── 2. REMOTE MANAGED SERVICES CATALOG ───────────────────────────────────────

export const REMOTE_MANAGED_PACKAGES: RemoteManagedPackage[] = [
  {
    code: "essential",
    name: "Essential Managed",
    tagline: "Complete remote technical setup for events up to 1,000 attendees.",
    maxAttendees: 1000,
    priceInr: 2999,
    pricePaise: 299900,
    depositPercentage: 50,
    balancePercentage: 50,
    includedTrainingSessions: 1,
    supportLevel: "standard",
    features: [
      "Up to 1,000 attendees maximum",
      "End-to-end event registration configuration",
      "Custom form setup & capacity limits",
      "Ticket tier & pricing setup",
      "Branded QR pass generation & testing",
      "Basic automated email invitations setup",
      "1 remote scanner training session (Google Meet / Zoom)",
      "Standard remote coordinator support during agreed event hours",
      "Post-event attendance CSV and audit summary",
    ],
    extraAttendeeRatePer1000Inr: 1000,
    ctaText: "Book Essential Setup",
  },
  {
    code: "pro",
    name: "Pro Managed",
    popular: true,
    badge: "Most Popular Setup",
    tagline: "Dedicated remote technical operations for events up to 5,000 attendees.",
    maxAttendees: 5000,
    priceInr: 7999,
    pricePaise: 799900,
    depositPercentage: 50,
    balancePercentage: 50,
    includedTrainingSessions: 2,
    supportLevel: "priority",
    features: [
      "Up to 5,000 attendees maximum",
      "All Essential features included",
      "Complex tiered tickets & VIP pass logic",
      "Bulk guest list import & deduplication",
      "Group QR pass configuration & partial entry",
      "Multi-gate scanner routing and setup",
      "WhatsApp template setup & message testing (organizer provides template quota)",
      "2 remote training sessions for gate staff and coordinators",
      "Priority remote event day support via direct phone/chat hotline",
      "Detailed reconciliation & duplicate scan audit report",
    ],
    extraAttendeeRatePer1000Inr: 1500,
    ctaText: "Book Pro Setup",
  },
  {
    code: "premium",
    name: "Premium Managed",
    badge: "High-Traffic & Multi-Gate",
    tagline: "Full-scale technical rehearsal & coordination for events up to 15,000 attendees.",
    maxAttendees: 15000,
    priceInr: 14999,
    pricePaise: 1499900,
    depositPercentage: 50,
    balancePercentage: 50,
    includedTrainingSessions: 3,
    supportLevel: "dedicated",
    features: [
      "Up to 15,000 attendees maximum",
      "All Pro Managed features included",
      "Complex multi-track and session attendance logic",
      "Advanced multi-gate operational zoning",
      "Pre-event technical rehearsal with gate leads",
      "3 remote training sessions across multiple shifts",
      "Dedicated remote operations manager assigned to your event",
      "Live remote check-in telemetry monitoring",
      "Comprehensive post-event analytics, reconciliation & audit export",
    ],
    extraAttendeeRatePer1000Inr: 2000,
    ctaText: "Book Premium Setup",
  },
  {
    code: "enterprise",
    name: "Enterprise Managed",
    badge: "Over 15,000 Attendees",
    tagline: "Custom multi-day summits, national conventions, and high-concurrency festivals.",
    maxAttendees: "unlimited",
    priceInr: 0,
    pricePaise: 0,
    depositPercentage: 50,
    balancePercentage: 50,
    includedTrainingSessions: 4,
    supportLevel: "dedicated",
    features: [
      "Custom capacity (over 15,000 attendees)",
      "Multi-day festival & conference coordination",
      "Dedicated senior operations engineer",
      "Custom API/webhook data integrations",
      "Multiple rehearsal & simulation runs",
      "Custom SLA with guaranteed remote response time",
      "Enterprise security & data compliance handover",
    ],
    ctaText: "Request Enterprise Quote",
  },
];

// ─── 3. STRICT REMOTE BOUNDARY DISCLOSURE ─────────────────────────────────────

export const REMOTE_MANAGED_SERVICE_BOUNDARIES = {
  headline: "Strict Remote Technical Scope",
  description:
    "UrPass Remote Managed Services provide comprehensive technical event setup, registration configuration, QR pass generation, coordinator training, and real-time remote hotline support.",
  exclusions: [
    "NO on-site UrPass staff or venue physical attendance",
    "NO physical hardware rentals (smartphones, laptops, barcode scanners)",
    "NO venue security screening, metal detector checks, or statutory identity policing",
    "NO physical crowd control, physical gate construction, or turnstile maintenance",
    "NO venue internet, Wi-Fi, or cellular network provision",
  ],
  organizerResponsibilities: [
    "Providing on-site check-in volunteers or gate staff",
    "Providing smartphones with working web browsers and cameras",
    "Ensuring adequate internet/cellular connectivity at entry gates",
    "Managing physical venue queues, crowd flow, and security screening",
  ],
};
