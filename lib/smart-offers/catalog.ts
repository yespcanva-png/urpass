import { SmartOffer, UserIntent } from "./types";

export const SMART_OFFERS_CATALOG: Record<string, SmartOffer> = {
  free_event_creation: {
    id: "free_event_creation",
    category: "value",
    intent: "exploring",
    title: "Free Event Creation",
    headline: "Explore UrPass with Zero Risk",
    subtext:
      "Publish your first RSVP event for free. Up to 50 attendee registrations, sub-second QR entry scanning, and 0% platform commission.",
    badge: "Free Forever Entry Point",
    primaryCtaLabel: "Create Free Event",
    primaryCtaUrl: "/create-event",
    secondaryCtaLabel: "Explore All Features",
    secondaryCtaUrl: "/features",
    discountPaise: 0,
    helperNote: "Free entry point · No credit card or discount required",
    isActive: true,
  },

  free_guided_setup: {
    id: "free_guided_setup",
    category: "value",
    intent: "first_event",
    title: "Free Guided Setup",
    headline: "Launch your first event with UrPass",
    subtext:
      "Create your event, customise registrations and test your first QR pass. Need a hand? Our engineering team configures it for you in 24 hours at no cost.",
    badge: "First-Time Organiser Privilege",
    primaryCtaLabel: "Create Free Event",
    primaryCtaUrl: "/create-event",
    secondaryCtaLabel: "Claim Free 24h Setup (₹0)",
    secondaryCtaUrl: "/create-event?concierge=free",
    discountPaise: 0,
    helperNote: "Free entry point · No discount required",
    isActive: true,
  },

  single_event_pass: {
    id: "single_event_pass",
    category: "product",
    intent: "one_time_event",
    title: "Single-Event Pass",
    headline: "One Event? Pay Once, No Subscription Needed",
    subtext:
      "Running a single annual conference, festival, or one-off meetup? Get full Pro features (up to 250 attendees, custom ticket design, CSV export) for just ₹299 once.",
    badge: "Zero Recurring Commitment",
    primaryCtaLabel: "Get One-Event Pass (₹299)",
    primaryCtaUrl: "/pricing#single-event",
    secondaryCtaLabel: "Compare All Plans",
    secondaryCtaUrl: "/pricing",
    discountPaise: 0,
    helperNote: "One-time purchase · 0% platform commission · Never auto-renews",
    isActive: true,
  },

  paid_plan_comparison: {
    id: "paid_plan_comparison",
    category: "product",
    intent: "paid_ticketing",
    title: "Paid Ticketing Plan Comparison",
    headline: "Sell Tickets with 0% Platform Commission",
    subtext:
      "Keep 100% of your ticket revenue minus standard gateway fees. Starter (₹499/mo) or Pro (₹999/mo) unlock paid ticketing, multi-tier passes, and instant UPI payouts.",
    badge: "0% Platform Cut",
    primaryCtaLabel: "Explore Paid Plans",
    primaryCtaUrl: "/pricing",
    secondaryCtaLabel: "Calculate Your Savings",
    secondaryCtaUrl: "/ticket-fee-calculator",
    discountPaise: 0,
    helperNote: "Direct Razorpay & UPI payouts straight to your bank account",
    isActive: true,
  },

  business_demo_support: {
    id: "business_demo_support",
    category: "value",
    intent: "large_event",
    title: "Business Demo & Setup Support",
    headline: "Large Event Access Control & Dedicated Support",
    subtext:
      "Hosting 500+ attendees or managing multiple gate turnstiles? Get a live architecture walkthrough, custom hardware recommendations, and assigned engineering support.",
    badge: "Enterprise Readiness",
    primaryCtaLabel: "Book Technical Demo",
    primaryCtaUrl: "/contact?intent=enterprise_demo",
    secondaryCtaLabel: "Speak with Engineers",
    secondaryCtaUrl: "/contact",
    discountPaise: 0,
    helperNote: "Tailored for 500 to 10,000+ attendee summits, expos, and festivals",
    isActive: true,
  },

  price_sensitive_help: {
    id: "price_sensitive_help",
    category: "value",
    intent: "price_sensitive",
    title: "Free Plan & Consultation",
    headline: "Need Help Choosing the Right Setup?",
    subtext:
      "UrPass includes a 100% Free Forever plan for events up to 50 attendees. Let our team understand your requirements and find the most cost-effective path.",
    badge: "Cost-Conscious Assistance",
    primaryCtaLabel: "Start on Free Plan",
    primaryCtaUrl: "/create-event",
    secondaryCtaLabel: "Talk to Event Specialist",
    secondaryCtaUrl: "/contact?intent=pricing_guidance",
    discountPaise: 0,
    helperNote: "Zero cost entry · We prioritize helpful guidance over forced discounts",
    isActive: true,
  },

  repeat_event_shortcut: {
    id: "repeat_event_shortcut",
    category: "product",
    intent: "returning_organizer",
    title: "Repeat Event Shortcut",
    headline: "Ready for Your Next Event?",
    subtext:
      "Duplicate your past event settings, forms, and ticket design in one click. Or upgrade to a recurring monthly plan for unlimited events.",
    badge: "Returning Organiser Shortcut",
    primaryCtaLabel: "Duplicate Previous Event",
    primaryCtaUrl: "/create-event?duplicate=recent",
    secondaryCtaLabel: "View Annual Plans",
    secondaryCtaUrl: "/pricing?cycle=annual",
    discountPaise: 0,
    helperNote: "Preserves your branding, ticket fields, and gate scanner setup",
    isActive: true,
  },
};

export const INTENT_TO_DEFAULT_OFFER: Record<UserIntent, SmartOffer> = {
  exploring: SMART_OFFERS_CATALOG.free_event_creation,
  first_event: SMART_OFFERS_CATALOG.free_guided_setup,
  one_time_event: SMART_OFFERS_CATALOG.single_event_pass,
  paid_ticketing: SMART_OFFERS_CATALOG.paid_plan_comparison,
  large_event: SMART_OFFERS_CATALOG.business_demo_support,
  price_sensitive: SMART_OFFERS_CATALOG.price_sensitive_help,
  returning_organizer: SMART_OFFERS_CATALOG.repeat_event_shortcut,
};
