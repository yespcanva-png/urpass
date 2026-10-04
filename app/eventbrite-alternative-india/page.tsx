import type { Metadata } from "next";
import { Banknote, Building2, Lock, ScanLine, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Eventbrite Alternative India with UPI & QR Check-In | URPASS",
  description: "India's zero-commission Eventbrite alternative with instant UPI & Razorpay payments, WhatsApp passes, sub-second QR scanning, and college fest workflows.",
  keywords: ["Eventbrite alternative India", "event ticketing software India", "UPI event ticketing", "Razorpay event registration", "college fest ticketing platform India", "zero commission event ticketing India"],
  alternates: {
    canonical: "https://urpass.space/eventbrite-alternative-india",
  },
  openGraph: {
    title: "Eventbrite Alternative India with UPI & QR Check-In | URPASS",
    description: "India's zero-commission Eventbrite alternative with instant UPI & Razorpay payments, WhatsApp passes, sub-second QR scanning, and college fest workflows.",
    url: "https://urpass.space/eventbrite-alternative-india",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function EventbriteAlternativeIndiaPage() {
  return (
    <SEOPage
      config={{
  "badge": "INDIA ZERO-COMMISSION ALTERNATIVE",
  "h1": "Eventbrite Alternative India with UPI & QR Check-In",
  "canonicalUrl": "https://urpass.space/eventbrite-alternative-india",
  "description": "India's zero-commission Eventbrite alternative with instant UPI & Razorpay payments, WhatsApp passes, sub-second QR scanning, and college fest workflows.",
  "ctaLabel": "Switch to URPASS India Free →",
  "ctaTitle": "Sell Event Tickets in India with Instant UPI & 0% Commission",
  "ctaDescription": "Connect your Razorpay account, accept direct UPI payments, issue WhatsApp & digital QR passes, and admit attendees in <0.3s with volunteer phones.",
  "directAnswer": {
    "title": "Why Choose URPASS as Your Eventbrite Alternative in India?",
    "summary": "URPASS is India's leading zero-commission Eventbrite alternative, designed for Indian conferences, college fests, workshops, and tech summits. Unlike Eventbrite, which lacks native UPI QR checkout, charges heavy platform cuts, and delays payouts, URPASS integrates directly with Razorpay for instant UPI settlement, charges 0% ticketing commission, and provides sub-second phone QR scanning.",
    "keyPoints": [
      "Direct Razorpay integration: accept Google Pay, PhonePe, Paytm, and UPI QR",
      "0% platform ticketing commission — retain 100% of event revenue in your bank",
      "Digital QR passes delivered via WhatsApp and email with zero app downloads",
      "Built for Indian college fests, tech conferences, and cultural symposiums"
    ]
  },
  "whatIs": {
    "title": "What is an Eventbrite Alternative in India?",
    "definition": "An Eventbrite alternative in India is an event registration and ticketing platform designed for the Indian payment ecosystem and event operational realities. It supports instant UPI QR checkout, Razorpay gateway integration, WhatsApp ticket delivery, and fast mobile camera check-in for high-volume crowds.",
    "details": [
      "Replaces foreign-currency card checkouts with seamless Indian UPI payments",
      "Eliminates 5% to 10% ticketing aggregator commissions, saving lakhs on large events",
      "Handles morning arrival surges of thousands of students at college fest gates",
      "Functions hardware-free on student volunteers' existing Android and iOS phones"
    ]
  },
  "howItWorksTitle": "How Indian Organisers Switch to URPASS",
  "howItWorksSubtitle": "Set up your event with UPI payments and QR check-in in minutes.",
  "steps": [
    {
      "n": "01",
      "title": "Create your event",
      "desc": "Configure event date, venue, ticket tiers, and registration questions in INR (₹)."
    },
    {
      "n": "02",
      "title": "Connect your Razorpay",
      "desc": "Link your Razorpay merchant key to receive instant UPI payments directly to your bank."
    },
    {
      "n": "03",
      "title": "Share registration link",
      "desc": "Post your clean event link on WhatsApp groups, Instagram, and college portals."
    },
    {
      "n": "04",
      "title": "Issue digital QR passes",
      "desc": "Attendees receive unique mobile QR tickets via email and WhatsApp."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Volunteers scan passes with smartphone cameras in <0.3s for instant green entry."
    },
    {
      "n": "06",
      "title": "Own your event revenue",
      "desc": "All funds settle directly to your bank account with zero platform deductions."
    }
  ],
  "featuresTitle": "Built for the Realities of Indian Events",
  "featuresSubtitle": "Native UPI checkout, WhatsApp delivery, and sub-second phone scanning.",
  "features": [
    {
      icon: Banknote,
      "title": "Instant UPI & Razorpay Settlement",
      "desc": "Accept payments via Google Pay, PhonePe, Paytm, and Cards. Funds settle directly to your bank account with 0% platform cuts."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Volunteer Gate Scanning",
      "desc": "College volunteers open a web link on their own smartphones and scan passes in under 0.3 seconds. No app downloads required."
    },
    {
      icon: Building2,
      "title": "College Fest & Roll Number Fields",
      "desc": "Capture mandatory college names, student roll numbers, department streams, and team member details at checkout."
    },
    {
      icon: Lock,
      "title": "Anti-Gatecrashing Protection",
      "desc": "Stop duplicate pass reuse. When a ticket is scanned at Gate 1, it cannot be reused at Gate 2 or shared via WhatsApp screenshot."
    },
    {
      icon: Zap,
      "title": "Offline Scanning Engine",
      "desc": "Indian auditoriums and campus grounds often lose mobile data. URPASS offline mode keeps scanning uninterrupted."
    },
    {
      icon: Users,
      "title": "GST Compliant Invoicing",
      "desc": "Capture company/institution GSTIN numbers during registration and generate automated corporate tax invoices."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses URPASS in India?",
    "subtitle": "From IIT/NIT college fests to Bengaluru tech summits.",
    "personas": [
      {
        "badge": "COLLEGES",
        "title": "Engineering & Medical College Fests",
        "desc": "Cultural fests, technical symposiums, and sports meets with thousands of inter-college students."
      },
      {
        "badge": "TECH",
        "title": "Bengaluru, Hyderabad & Pune Tech Meets",
        "desc": "Developer conferences, AI summits, and startup demo days wanting fast morning entry."
      },
      {
        "badge": "WORKSHOPS",
        "title": "Professional Training & Workshops",
        "desc": "Design bootcamps, clinical masterclasses, and corporate workshops with capped seating."
      },
      {
        "badge": "COMMUNITY",
        "title": "Community & Cultural Gatherings",
        "desc": "Marathons, music concerts, and comedy shows needing direct UPI checkout without aggregator fees."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Indian QR Check-In Works",
    "subtitle": "Sub-second camera scanning on student volunteer phones.",
    "description": "Student volunteers open the scanner link on their mobile Chrome or Safari browser. Pointing the camera at the attendee's QR pass validates the ticket in under 0.3 seconds with an audible green chime, verifying their ticket tier (e.g. 'Inter-College Delegate') and student roll number. If campus mobile networks crash, local browser caching ensures entry never stops.",
    "points": [
      "Zero equipment costs: volunteers use their personal mobile phones.",
      "Offline engine pre-loads ticket databases to validate passes with zero network connectivity.",
      "Atomic row-locking prevents shared pass screenshots across different gate tents.",
      "Rapid manual lookup by name if an attendee's phone battery has died."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Eventbrite India Comparison",
    "subtitle": "Direct comparison across payments, check-in speed, and platform fees.",
    "headers": [
      "Feature / Metric",
      "URPASS India",
      "Eventbrite"
    ],
    "rows": [
      {
        "col1": "UPI Payment Support",
        "col2": "Native Google Pay, PhonePe, Paytm QR",
        "col3": "No native UPI; foreign gateway friction"
      },
      {
        "col1": "Ticketing Commission",
        "col2": "0% commission; keep 100% of revenue",
        "col3": "5% to 8% cut totaling lakhs on large fests"
      },
      {
        "col1": "Payout Timeline",
        "col2": "Direct to your bank account via Razorpay",
        "col3": "Delayed payouts held until after the event"
      },
      {
        "col1": "Gate Check-In Speed",
        "col2": "<0.3s camera scan on any phone browser",
        "col3": "2.5 to 4.0s on heavy native app"
      },
      {
        "col1": "College Fest Features",
        "col2": "Roll number capture & team registrations",
        "col3": "Generic B2B corporate form fields only"
      },
      {
        "col1": "WhatsApp Pass Delivery",
        "col2": "Direct delivery via WhatsApp link",
        "col3": "Email only with high spam drop-off"
      }
    ]
  },
  "faqs": [
    {
      "q": "Why is URPASS better than Eventbrite for events in India?",
      "a": "URPASS supports native Indian UPI payments (Google Pay, PhonePe, Paytm) through Razorpay, charges 0% commission on ticket sales, offers WhatsApp pass delivery, and provides sub-second phone scanning tailored for Indian college fests and conferences."
    },
    {
      "q": "How does ticket payment work with UPI?",
      "a": "You connect your Razorpay account to URPASS. Attendees pay using any UPI app or credit/debit card, and 100% of the funds settle directly to your bank account without platform cuts."
    },
    {
      "q": "Can college committees collect Student Roll Numbers during registration?",
      "a": "Yes. Custom intake fields allow you to mandate Student Roll Numbers, college names, department branches, and year of study."
    },
    {
      "q": "How fast is the check-in scanner at college fest gates?",
      "a": "URPASS validates passes in under 0.3 seconds from up to 30cm away, allowing a single volunteer to admit 40 to 50 attendees per minute."
    },
    {
      "q": "Can URPASS scan passes if campus Wi-Fi or mobile data fails?",
      "a": "Yes. URPASS pre-caches attendee records in browser memory, enabling uninterrupted scanning even in crowded auditoriums with jammed mobile towers."
    },
    {
      "q": "Is URPASS free for free college events?",
      "a": "Yes! URPASS is completely free for free college fests, symposiums, and community meetups with full access to QR generation and mobile scanning."
    }
  ],
  "relatedLinks": [
    {
      "title": "Eventbrite Alternative",
      "href": "/eventbrite-alternative",
      "category": "Comparison"
    },
    {
      "title": "Eventbrite Alternative UK",
      "href": "/eventbrite-alternative-uk",
      "category": "Comparison"
    },
    {
      "title": "Event Ticketing with Razorpay, UPI & QR Passes",
      "href": "/event-ticketing-with-razorpay",
      "category": "Product"
    },
    {
      "title": "Zero-Commission Event Ticketing Platform",
      "href": "/zero-commission-event-ticketing",
      "category": "Product"
    },
    {
      "title": "College Event Registration Software",
      "href": "/college-event-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "IN",
    "placename": "India",
    "position": "20.5937;78.9629",
    "latitude": 20.5937,
    "longitude": 78.9629,
    "country": "India",
    "countryCode": "IN"
  }
}}
    />
  );
}
