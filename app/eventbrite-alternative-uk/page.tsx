import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Eventbrite Alternative UK for Events & Ticketing | URPASS",
  description: "The UK's zero-commission Eventbrite alternative. Flat GBP pricing, 0% ticket fees, instant smartphone QR check-in, and UK GDPR compliance.",
  keywords: ["Eventbrite alternative UK", "Eventbrite UK fees alternative", "zero commission ticketing UK", "UK event ticketing software", "free event registration platform UK", "Eventbrite competitor UK"],
  alternates: {
    canonical: "https://urpass.space/eventbrite-alternative-uk",
  },
  openGraph: {
    title: "Eventbrite Alternative UK for Events & Ticketing | URPASS",
    description: "The UK's zero-commission Eventbrite alternative. Flat GBP pricing, 0% ticket fees, instant smartphone QR check-in, and UK GDPR compliance.",
    url: "https://urpass.space/eventbrite-alternative-uk",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.4360",
  },
};

export default function EventbriteAlternativeUkPage() {
  return (
    <SEOPage
      config={{
  "badge": "UK ZERO-COMMISSION ALTERNATIVE",
  "h1": "Eventbrite Alternative UK for Events & Ticketing",
  "canonicalUrl": "https://urpass.space/eventbrite-alternative-uk",
  "description": "The UK's zero-commission Eventbrite alternative. Flat GBP pricing, 0% ticket fees, instant smartphone QR check-in, and UK GDPR compliance.",
  "ctaLabel": "Switch to URPASS UK Free →",
  "ctaTitle": "Escape Eventbrite UK's 6.95% + £0.59 Per-Ticket Cut",
  "ctaDescription": "Join UK universities, conference directors, and event promoters switching to URPASS. Flat transparent GBP pricing, 0% ticket commission, and sub-second QR check-in.",
  "directAnswer": {
    "title": "Why Choose URPASS as Your Eventbrite Alternative in the UK?",
    "summary": "URPASS is the leading zero-commission Eventbrite alternative in the UK. While Eventbrite UK charges up to 6.95% + £0.59 per ticket and locks organizers behind monthly listing paywalls, URPASS charges 0% ticketing commission with transparent flat GBP subscriptions. It offers sub-second (<0.3s) volunteer phone check-in and full UK GDPR compliance.",
    "keyPoints": [
      "0% platform ticketing commission on paid UK tickets — keep 100% of event revenue",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
      "Full compliance with UK GDPR and the Data Protection Act 2018",
      "Direct GBP payouts to your merchant account without Eventbrite payout delays"
    ]
  },
  "whatIs": {
    "title": "What is an Eventbrite Alternative in the UK?",
    "definition": "An Eventbrite alternative in the UK is an event registration and ticketing platform tailored for British event organisers. It provides online ticket sales in British Pounds (GBP), automated digital QR passes, and entrance check-in without Eventbrite's heavy percentage fees or promotional paywalls.",
    "details": [
      "Saves UK organizers thousands of pounds in per-ticket booking fees",
      "Complies strictly with UK Information Commissioner Office (ICO) data protection standards",
      "Functions reliably inside historic stone and basement UK venues with offline caching",
      "Allows volunteer door staff to scan tickets directly in mobile web browsers without installing native apps"
    ]
  },
  "howItWorksTitle": "How UK Organisers Switch to URPASS",
  "howItWorksSubtitle": "Simple setup, transparent GBP pricing, and zero ticket cuts.",
  "steps": [
    {
      "n": "01",
      "title": "Create your event",
      "desc": "Configure your UK event title, venue, GBP ticket tiers, and custom questions."
    },
    {
      "n": "02",
      "title": "Connect direct payments",
      "desc": "Link your Stripe or merchant account to receive ticket revenues directly."
    },
    {
      "n": "03",
      "title": "Share registration link",
      "desc": "Send your clean URL via student union portals, email, or social media."
    },
    {
      "n": "04",
      "title": "Issue digital QR passes",
      "desc": "Attendees receive responsive mobile QR passes delivered straight to their inboxes."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Volunteers scan passes with phone cameras in <0.3s for green entry."
    },
    {
      "n": "06",
      "title": "Own your attendee data",
      "desc": "Export verified attendee rosters, timestamps, and marketing data with zero restrictions."
    }
  ],
  "featuresTitle": "Why UK Organisers Prefer URPASS over Eventbrite UK",
  "featuresSubtitle": "Zero ticket commission, UK GDPR compliance, and sub-second phone scanning.",
  "features": [
    {
      icon: Banknote,
      "title": "0% Commission on UK Tickets",
      "desc": "Keep 100% of your ticket price. On a £10,000 UK conference or student ball, Eventbrite deducts £700 to £1,000. URPASS charges zero commission."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & DPA 2018 Compliant",
      "desc": "Attendee data is stored securely in compliant UK infrastructure with zero third-party advertising trackers or promotional cross-selling."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Phone Scanning",
      "desc": "Volunteers scan QR passes in under 0.3s directly in mobile Safari or Chrome. No app store downloads or logins required."
    },
    {
      icon: Zap,
      "title": "UK Venue Offline Mode",
      "desc": "Historic stone college halls and London basement venues often lose mobile signal. URPASS offline mode keeps scanning uninterrupted."
    },
    {
      icon: Users,
      "title": "No Competitor Event Ads",
      "desc": "Eventbrite promotes competing events to your attendees on your confirmation pages. URPASS is 100% white-label and ad-free."
    },
    {
      icon: Building2,
      "title": "UK Universities & SUs",
      "desc": "Capture mandatory Student IDs, college affiliations, and society memberships seamlessly during registration."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Switch from Eventbrite in the UK?",
    "subtitle": "Built for British organizers who value fair pricing and speed.",
    "personas": [
      {
        "badge": "CAMPUS",
        "title": "UK Universities & Student Unions",
        "desc": "Save thousands in club budgets across freshers' events, summer balls, and society fests."
      },
      {
        "badge": "CONFERENCES",
        "title": "London & Regional Conferences",
        "desc": "B2B conferences at ExCeL, Olympia, Manchester Central, and EICC wanting zero ticket cuts."
      },
      {
        "badge": "COMMUNITY",
        "title": "UK Meetups & Community Charities",
        "desc": "Host community gatherings without paying mandatory monthly Eventbrite listing fees."
      },
      {
        "badge": "TRAINING",
        "title": "Workshops & CPD Masterclasses",
        "desc": "Professional training academies capping seats and issuing verified attendance records."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How UK QR Check-In Works",
    "subtitle": "Sub-second camera scanning on volunteer phones.",
    "description": "Volunteers open the scanner link on their mobile Safari or Chrome browser. The camera reads the attendee's QR pass from 30cm away in under 0.3s, validates the ticket in memory, chimes green, and records the gate arrival timestamp. If mobile reception drops inside thick stone walls, local browser caching ensures entry never stops.",
    "points": [
      "Zero equipment costs: no need to rent expensive laser scanner hardware.",
      "Fast volunteer onboarding: staff begin scanning within 15 seconds of receiving the link.",
      "Atomic row-locking prevents shared pass screenshots across different entrances.",
      "Manual guest lookup available if an attendee's phone battery runs out."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Eventbrite UK Comparison",
    "subtitle": "Direct comparison across fees, check-in speed, and UK GDPR compliance.",
    "headers": [
      "Feature / Metric",
      "URPASS UK",
      "Eventbrite UK"
    ],
    "rows": [
      {
        "col1": "Ticketing Commission",
        "col2": "0% commission; flat GBP plan (£15-£79/mo)",
        "col3": "Up to 6.95% + £0.59 per ticket"
      },
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s camera scan in mobile browser",
        "col3": "2.5 to 4.0s on heavy native app"
      },
      {
        "col1": "UK GDPR & ICO Standards",
        "col2": "Strict UK GDPR compliance, zero ads",
        "col3": "Shares data and targets attendees with ads"
      },
      {
        "col1": "Volunteer App Download",
        "col2": "Zero downloads; runs in mobile browser",
        "col3": "Volunteers must download Eventbrite Organizer app"
      },
      {
        "col1": "Offline Basement Scanning",
        "col2": "Full offline memory caching",
        "col3": "Freezes or times out on low signal"
      },
      {
        "col1": "Attendee Messaging",
        "col2": "Full access to your list with zero paywalls",
        "col3": "Paywalled behind Pro organizer subscription"
      }
    ]
  },
  "faqs": [
    {
      "q": "Why are UK event organisers switching from Eventbrite to URPASS?",
      "a": "UK organisers are switching to avoid Eventbrite's steep 6.95% + £0.59 ticketing fees, escape mandatory monthly listing paywalls, eliminate competitor ads on their checkout pages, and use faster browser-based QR scanning."
    },
    {
      "q": "How does URPASS compare on fees for a £20 ticket in the UK?",
      "a": "On a £20 ticket, Eventbrite UK deducts up to £1.98 per ticket in fees. On 500 tickets (£10,000 revenue), Eventbrite takes nearly £1,000. URPASS charges 0% commission, saving you almost the entire fee."
    },
    {
      "q": "Is URPASS fully compliant with UK GDPR?",
      "a": "Yes. URPASS complies strictly with UK GDPR and the Data Protection Act 2018. We never sell attendee data to third-party advertisers or promote competing events to your guests."
    },
    {
      "q": "Can UK student unions use URPASS for balls and fests?",
      "a": "Yes! Student unions and collegiate societies across Oxford, Cambridge, London, Manchester, and Scotland use URPASS for fests and formals with custom Student ID fields."
    },
    {
      "q": "Do door volunteers need to download an app on their phones?",
      "a": "No. Door staff open a secure scanner link in mobile Safari or Chrome and start validating passes in under 15 seconds."
    },
    {
      "q": "Can URPASS scan passes in historic UK stone buildings without signal?",
      "a": "Yes. URPASS features an offline scanning engine that pre-loads attendee records, allowing phones to scan passes in historic venues even when mobile signal drops."
    }
  ],
  "relatedLinks": [
    {
      "title": "Event Registration & QR Check-In Software UK",
      "href": "/uk",
      "category": "Location"
    },
    {
      "title": "Eventbrite Alternative",
      "href": "/eventbrite-alternative",
      "category": "Comparison"
    },
    {
      "title": "Eventbrite Alternative India",
      "href": "/eventbrite-alternative-india",
      "category": "Comparison"
    },
    {
      "title": "Zero Commission Event Ticketing UK",
      "href": "/zero-commission-event-ticketing-uk",
      "category": "Product"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB",
    "placename": "United Kingdom",
    "position": "55.3781;-3.4360",
    "latitude": 55.3781,
    "longitude": -3.436,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
