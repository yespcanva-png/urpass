import type { Metadata } from "next";
import { Banknote, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Eventbrite Alternative for Event Registration & QR Check-In | URPASS",
  description: "The zero-commission Eventbrite alternative for event registration, digital QR passes, and sub-second smartphone check-in. Keep 100% of your ticket sales.",
  keywords: ["Eventbrite alternative", "Eventbrite alternative without fees", "zero commission ticketing", "Eventbrite competitor qr check-in", "free event registration platform", "event ticketing software"],
  alternates: {
    canonical: "https://urpass.space/eventbrite-alternative",
  },
  openGraph: {
    title: "Eventbrite Alternative for Event Registration & QR Check-In | URPASS",
    description: "The zero-commission Eventbrite alternative for event registration, digital QR passes, and sub-second smartphone check-in. Keep 100% of your ticket sales.",
    url: "https://urpass.space/eventbrite-alternative",
    locale: "en_US",
    type: "website",
  },
};

export default function EventbriteAlternativePage() {
  return (
    <SEOPage
      config={{
  "badge": "ZERO-COMMISSION ALTERNATIVE",
  "h1": "Eventbrite Alternative for Event Registration & QR Check-In",
  "canonicalUrl": "https://urpass.space/eventbrite-alternative",
  "description": "The zero-commission Eventbrite alternative for event registration, digital QR passes, and sub-second smartphone check-in. Keep 100% of your ticket sales.",
  "ctaLabel": "Switch to URPASS Free →",
  "ctaTitle": "Stop Losing 5-10% of Your Event Revenue",
  "ctaDescription": "Join thousands of organisers switching from Eventbrite to URPASS. Create registration pages in 3 minutes, issue digital QR passes, and keep 100% of your ticket sales.",
  "directAnswer": {
    "title": "Why is URPASS the Best Eventbrite Alternative?",
    "summary": "URPASS is a zero-commission Eventbrite alternative built for organizers who need fast online registration, automated digital QR passes, and sub-second smartphone check-in. Unlike Eventbrite, which charges up to 6.95% + $1.59 per ticket and locks organizer email communication behind paywalls, URPASS charges 0% ticketing commission and gives you full ownership of your attendee data.",
    "keyPoints": [
      "0% platform ticketing commission — retain 100% of your gross ticket revenue",
      "Sub-second (<0.3s) camera check-in on any phone with zero app downloads",
      "Full ownership of your attendee email list with zero competitor ads",
      "Transparent flat monthly pricing instead of per-ticket percentage penalties"
    ]
  },
  "whatIs": {
    "title": "What is an Eventbrite Alternative?",
    "definition": "An Eventbrite alternative is an event registration and ticketing platform that provides organizers with modern registration forms, attendee management, digital ticketing, and entrance scanning without charging aggressive per-ticket percentage fees, promoting competitor events to your audience, or requiring expensive hardware.",
    "details": [
      "Eliminates per-ticket service fees that cut into organizer profit margins",
      "Gives you direct access to your attendee contact list without platform restrictions",
      "Replaces slow, battery-draining scanner apps with lightweight web camera check-in",
      "Allows instant direct payouts through your own payment gateway account"
    ]
  },
  "howItWorksTitle": "How Switching to URPASS Works",
  "howItWorksSubtitle": "Migrate your event from Eventbrite in minutes.",
  "steps": [
    {
      "n": "01",
      "title": "Create your event",
      "desc": "Set your event date, ticket tiers, capacity caps, and custom registration fields in 3 minutes."
    },
    {
      "n": "02",
      "title": "Connect direct payments",
      "desc": "Link your Stripe, Razorpay, or merchant gateway to receive ticket revenues directly."
    },
    {
      "n": "03",
      "title": "Publish your registration link",
      "desc": "Share your clean, branded registration page with zero competitor ads or distractions."
    },
    {
      "n": "04",
      "title": "Issue digital QR passes",
      "desc": "Attendees receive responsive mobile QR passes instantly via email and mobile web."
    },
    {
      "n": "05",
      "title": "Scan with any phone",
      "desc": "Door staff open the web scanner on their smartphone to validate passes in <0.3s."
    },
    {
      "n": "06",
      "title": "Own your attendee data",
      "desc": "Export verified attendee rosters, timestamps, and marketing data with zero restrictions."
    }
  ],
  "featuresTitle": "Why Organizers Are Moving from Eventbrite",
  "featuresSubtitle": "Fair pricing, superior check-in speed, and attendee privacy.",
  "features": [
    {
      icon: Banknote,
      "title": "0% Ticketing Commission",
      "desc": "Keep 100% of your ticket price. On a £10,000 / $10,000 event, Eventbrite deducts £700 to £1,000. URPASS charges zero commission."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Smartphone Scanning",
      "desc": "Eventbrite's app is notoriously slow on older devices. URPASS scans QR passes in under 0.3 seconds directly in mobile Safari or Chrome."
    },
    {
      icon: Users,
      "title": "No Competitor Event Ads",
      "desc": "Eventbrite promotes competing events to your attendees on your confirmation pages. URPASS is 100% white-label and ad-free."
    },
    {
      icon: Lock,
      "title": "Atomic Multi-Gate Sync",
      "desc": "Synchronize door scanning across multiple entrances in real time, preventing screenshotted or duplicated tickets."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Resilience",
      "desc": "Pre-cached guest lists allow volunteer phones to continue scanning smoothly even when venue Wi-Fi or mobile coverage drops."
    },
    {
      icon: ShieldCheck,
      "title": "Full Attendee Data Ownership",
      "desc": "Eventbrite restricts emailing your attendees unless you pay monthly organizer fees. URPASS gives you full access to your data."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Switch from Eventbrite?",
    "subtitle": "Built for organizers who are tired of high fees and restrictive platforms.",
    "personas": [
      {
        "badge": "CONFERENCES",
        "title": "Conference & Summit Directors",
        "desc": "Save thousands in platform commission fees on high-ticket B2B delegate passes."
      },
      {
        "badge": "UNIVERSITIES",
        "title": "University Societies & Campus Clubs",
        "desc": "Avoid losing student club budgets to ticketing cuts on balls and fests."
      },
      {
        "badge": "COMMUNITY",
        "title": "Meetup & Community Leaders",
        "desc": "Host free or low-cost community gatherings without paying mandatory monthly listing fees."
      },
      {
        "badge": "TRAINERS",
        "title": "Workshop Leaders & Instructors",
        "desc": "Collect masterclass fees directly with simple capacity capping and instant QR ticketing."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How URPASS QR Check-In Works",
    "subtitle": "Faster, simpler, and hardware-free entrance management.",
    "description": "Door volunteers open the private scanner URL on their own smartphone browser (Safari or Chrome). No app download or account creation required. Pointing the camera at an attendee's QR pass decodes and verifies the ticket in under 0.3 seconds with an audible green chime and instant name confirmation, admitting 45+ attendees per minute per volunteer.",
    "points": [
      "Zero app store downloads: volunteers start scanning in 15 seconds.",
      "Atomic row-locking prevents shared pass screenshots between attendees.",
      "Offline resilience ensures check-in continues during convention hall Wi-Fi drops.",
      "Instant search bar enables rapid manual lookup by name or email."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Eventbrite Feature Comparison",
    "subtitle": "Direct comparison across pricing, check-in performance, and data ownership.",
    "headers": [
      "Feature / Capability",
      "URPASS",
      "Eventbrite"
    ],
    "rows": [
      {
        "col1": "Ticketing Commission",
        "col2": "0% commission; keep 100% of revenue",
        "col3": "Up to 6.95% + $1.59 / £0.59 per ticket"
      },
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s camera scan on any phone browser",
        "col3": "2.5 to 4.0s on heavy native app"
      },
      {
        "col1": "Volunteer App Download",
        "col2": "Zero downloads; runs in mobile browser",
        "col3": "Volunteers must download Eventbrite Organizer app"
      },
      {
        "col1": "Competitor Event Ads",
        "col2": "Zero ads; 100% white-label experience",
        "col3": "Promotes competing events on confirmation page"
      },
      {
        "col1": "Attendee Email Messaging",
        "col2": "Full access to your list with zero paywalls",
        "col3": "Paywalled behind Pro organizer subscription"
      },
      {
        "col1": "Offline Gate Scanning",
        "col2": "Built-in offline memory cache",
        "col3": "Prone to sync errors and lockouts during signal drops"
      }
    ]
  },
  "faqs": [
    {
      "q": "What makes URPASS a better alternative to Eventbrite?",
      "a": "URPASS charges 0% commission on ticket sales, does not show competitor ads to your attendees, allows door volunteers to scan with phone browsers without downloading apps, and gives you complete ownership of your attendee data."
    },
    {
      "q": "How much can I save by switching from Eventbrite to URPASS?",
      "a": "On an event selling £10,000 / $10,000 in tickets, Eventbrite typically deducts £700 to £1,000 in ticketing fees. With URPASS, you pay a simple flat subscription and keep 100% of your ticket revenue."
    },
    {
      "q": "Do my attendees need an Eventbrite or URPASS account to register?",
      "a": "No. Unlike Eventbrite which often forces attendees to create accounts and passwords, URPASS allows frictionless one-click registration."
    },
    {
      "q": "Can my door staff scan tickets without downloading an app?",
      "a": "Yes! Volunteers simply open a private web scanner link on their mobile browser (iOS Safari or Android Chrome) and can start scanning immediately."
    },
    {
      "q": "Can I use URPASS for completely free events?",
      "a": "Yes. Free events are 100% free on URPASS with full access to custom forms, QR code generation, and mobile scanning."
    },
    {
      "q": "How do ticket payouts work on URPASS?",
      "a": "You connect your own payment gateway (Stripe, Razorpay, etc.), so ticket revenues land directly into your own bank account on your standard payout schedule."
    }
  ],
  "relatedLinks": [
    {
      "title": "Eventbrite Alternative UK",
      "href": "/eventbrite-alternative-uk",
      "category": "Comparison"
    },
    {
      "title": "Eventbrite Alternative India",
      "href": "/eventbrite-alternative-india",
      "category": "Comparison"
    },
    {
      "title": "Google Forms Alternative for Event Registration",
      "href": "/google-forms-event-registration-alternative",
      "category": "Comparison"
    },
    {
      "title": "Zoho Backstage Alternative",
      "href": "/zoho-backstage-alternative",
      "category": "Comparison"
    },
    {
      "title": "Zero-Commission Event Ticketing Platform",
      "href": "/zero-commission-event-ticketing",
      "category": "Product"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    }
  ]
}}
    />
  );
}
