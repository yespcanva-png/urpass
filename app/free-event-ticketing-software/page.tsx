import type { Metadata } from "next";
import { BarChart3, FileText, Lock, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Free Event Ticketing & QR Check-In Software | URPASS",
  description: "100% free event ticketing software with automated digital QR passes, mobile phone check-in, custom registration forms, and zero ticketing fees.",
  keywords: ["free event ticketing software", "free event registration platform", "free qr code ticket generator", "free event check-in app", "free ticketing platform for non-profits", "free community event ticketing"],
  alternates: {
    canonical: "https://urpass.space/free-event-ticketing-software",
  },
  openGraph: {
    title: "Free Event Ticketing & QR Check-In Software | URPASS",
    description: "100% free event ticketing software with automated digital QR passes, mobile phone check-in, custom registration forms, and zero ticketing fees.",
    url: "https://urpass.space/free-event-ticketing-software",
    locale: "en_US",
    type: "website",
  },
};

export default function FreeEventTicketingSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "100% FREE FOR FREE EVENTS",
  "h1": "Free Event Ticketing & QR Check-In Software",
  "canonicalUrl": "https://urpass.space/free-event-ticketing-software",
  "description": "100% free event ticketing software with automated digital QR passes, mobile phone check-in, custom registration forms, and zero ticketing fees.",
  "ctaLabel": "Create Free Event Ticket →",
  "ctaTitle": "Run Free Events with Professional Digital Passes",
  "ctaDescription": "Create registration pages, issue dynamic digital QR passes, and check attendees in in <0.3s with volunteer smartphones. Completely free.",
  "directAnswer": {
    "title": "What is Free Event Ticketing Software?",
    "summary": "Free event ticketing software is a digital event platform that allows organizers to create registration pages, issue digital QR passes, and manage entrance check-in for free events without paying platform fees. URPASS offers a 100% free plan for free events, providing full access to custom forms, automated QR pass issuance, and mobile camera scanning.",
    "keyPoints": [
      "100% free with zero hidden platform charges for free events",
      "Automated unique digital QR passes delivered instantly to attendees",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
      "Live real-time attendance dashboard replacing fragile paper guest lists"
    ]
  },
  "whatIs": {
    "title": "What is Free Event Ticketing Software?",
    "definition": "Free event ticketing software is an event management platform built for community organizers, universities, non-profits, and meetups that host free admission events. It provides RSVP collection, capacity capping, digital credential issuance, and door validation without charging subscription or ticketing fees.",
    "details": [
      "Allows non-profits and community groups to look professional without software costs",
      "Replaces printed guest lists and manual pen ticking with instant smartphone scanning",
      "Prevents room overcrowding with automated waitlists and capacity limits",
      "Gives organizers full ownership of their attendee list with zero third-party ads"
    ]
  },
  "howItWorksTitle": "How Free Event Ticketing Operates",
  "howItWorksSubtitle": "From free event setup to entrance door check-in in six simple steps.",
  "steps": [
    {
      "n": "01",
      "title": "Create your free event",
      "desc": "Set date, venue, guest capacity, and custom registration fields in 3 minutes."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Post your clean event link on social media, community groups, or your website."
    },
    {
      "n": "03",
      "title": "Attendees RSVP online",
      "desc": "Guests register in seconds with zero friction or forced account signups."
    },
    {
      "n": "04",
      "title": "Instant digital QR passes",
      "desc": "Attendees receive unique, mobile-responsive QR passes delivered straight to their inboxes."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Door volunteers scan passes with phone cameras in <0.3s for green entry."
    },
    {
      "n": "06",
      "title": "Live attendance telemetry",
      "desc": "Monitor check-in velocity and know who is in the room in real time."
    }
  ],
  "featuresTitle": "Enterprise Features Included on the Free Plan",
  "featuresSubtitle": "Custom forms, digital passes, and sub-second phone scanning.",
  "features": [
    {
      icon: QrCode,
      "title": "Automated Digital QR Passes",
      "desc": "Every RSVP automatically receives a unique encrypted mobile QR pass via email and web link."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Phone Camera Scanning",
      "desc": "Turn any volunteer phone into an entrance scanner. Scan passes in under 0.3 seconds without printing paper sheets."
    },
    {
      icon: Lock,
      "title": "Duplicate Entry Protection",
      "desc": "Prevent shared passes. When a ticket is scanned at the entrance, it is atomically locked across all doors."
    },
    {
      icon: FileText,
      "title": "Custom Registration Fields",
      "desc": "Collect mandatory dietary needs, job titles, Student IDs, and file uploads with custom intake questions."
    },
    {
      icon: Users,
      "title": "Accurate Capacity Caps",
      "desc": "Set maximum venue limits. Registration halts automatically once capacity is reached to prevent overbooking."
    },
    {
      icon: BarChart3,
      "title": "Live Attendance Telemetry",
      "desc": "Distinguish registered signups from actual attendees. Track no-show rates live from your dashboard."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Free Event Ticketing Software?",
    "subtitle": "From community meetups to non-profit galas.",
    "personas": [
      {
        "badge": "COMMUNITY",
        "title": "Community Meetups & User Groups",
        "desc": "Tech meetups, book clubs, and creative freelancer mixers hosting free monthly gatherings."
      },
      {
        "badge": "CAMPUS",
        "title": "University Clubs & Student Unions",
        "desc": "Free campus lectures, student orientation events, and club freshers' fairs."
      },
      {
        "badge": "NON-PROFIT",
        "title": "Charities & Non-Profits",
        "desc": "Volunteer training days, fundraising information evenings, and community town halls."
      },
      {
        "badge": "OPEN SOURCE",
        "title": "Developer Hackathons",
        "desc": "Free hackathons and developer build jams needing fast Saturday morning check-in."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Free Event Check-In Operates",
    "subtitle": "Sub-second camera scanning on volunteer phones.",
    "description": "Attendees display their mobile QR pass on their phone screen. Volunteer staff open the scanner URL in Safari or Chrome on their smartphones. Pointing the camera at the pass validates the ticket in under 0.3 seconds with an audible green chime, verifying their registration without needing a paper roster.",
    "points": [
      "Zero equipment costs: volunteers use their personal mobile phones.",
      "Offline engine pre-loads ticket databases to validate passes with zero network connectivity.",
      "Atomic row-locking prevents shared pass screenshots across different gate tents.",
      "Rapid manual lookup by name if an attendee's phone battery has died."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS Free Plan vs Legacy Ticketing Platforms",
    "subtitle": "Why community organizers choose URPASS for free events.",
    "headers": [
      "Platform Feature",
      "Legacy Ticketing Networks (Eventbrite)",
      "URPASS Free Plan"
    ],
    "rows": [
      {
        "col1": "Free Event Cost",
        "col2": "Paywalled behind mandatory organizer subscriptions",
        "col3": "100% free with unlimited free event registrations"
      },
      {
        "col1": "Competitor Event Ads",
        "col2": "Promotes competitor events on your confirmation page",
        "col3": "100% white-label and ad-free experience"
      },
      {
        "col1": "Door Check-In Speed",
        "col2": "2.5 to 4.0s on heavy native scanner apps",
        "col3": "<0.3s camera scan on any mobile phone browser"
      },
      {
        "col1": "Attendee Data Privacy",
        "col2": "Collects attendee data for platform marketing",
        "col3": "Strict data privacy; you own your attendee list"
      }
    ]
  },
  "faqs": [
    {
      "q": "Is URPASS really free for free events?",
      "a": "Yes! URPASS is 100% free for free events. There are no setup fees, no monthly listing charges, and no per-ticket fees for free registration."
    },
    {
      "q": "Are there any limits on how many attendees can register on the free plan?",
      "a": "No. You can collect unlimited registrations and issue unlimited digital QR passes for your free events."
    },
    {
      "q": "Do attendees need to download an app to access their tickets?",
      "a": "No. Attendees receive their digital QR ticket via email and can open it in any mobile web browser without installing an app."
    },
    {
      "q": "How do volunteers scan tickets at the door?",
      "a": "Volunteers open a private scanner link in mobile Safari or Chrome and can start scanning attendee passes immediately with their phone cameras."
    },
    {
      "q": "Can I export my attendee list to CSV?",
      "a": "Yes. You can export complete attendee rosters and check-in records to CSV in one click at any time."
    },
    {
      "q": "Are there hidden fees for free event tickets on URPASS?",
      "a": "No. URPASS is 100% free for free events. No credit card required, no per-ticket fees, and no attendee limits on free tiers."
    },
    {
      "q": "Can I approve or reject free registrations before tickets are sent?",
      "a": "Yes. You can enable \"Require Approval\" mode so only vetted applicants receive a valid QR entry pass."
    }
  ],
  "relatedLinks": [
    {
      "title": "Zero-Commission Event Ticketing Platform",
      "href": "/zero-commission-event-ticketing",
      "category": "Product"
    },
    {
      "title": "Event Registration with QR Code Tickets",
      "href": "/event-registration-with-qr-code",
      "category": "Product"
    },
    {
      "title": "Meetup Registration & QR Check-In Platform",
      "href": "/meetup-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Event Check-In App with QR Scanner",
      "href": "/event-check-in-app",
      "category": "Product"
    },
    {
      "title": "Google Forms Alternative for Event Registration",
      "href": "/google-forms-event-registration-alternative",
      "category": "Comparison"
    }
  ]
}}
    />
  );
}
