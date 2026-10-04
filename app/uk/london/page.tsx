import type { Metadata } from "next";
import { Banknote, Building2, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software London | URPASS",
  description: "Fast event registration and sub-second QR check-in software for London conferences, universities, and exhibitions. Offline mode for basement venues, 0% ticket fees, and UK GDPR.",
  keywords: ["event registration software London", "event check-in London", "QR check-in London", "London conference ticketing", "London exhibition registration", "London university event check-in", "Eventbrite alternative London"],
  alternates: {
    canonical: "https://urpass.space/uk/london",
  },
  openGraph: {
    title: "Event Registration & QR Check-In Software London | URPASS",
    description: "Fast event registration and sub-second QR check-in software for London conferences, universities, and exhibitions. Offline mode for basement venues, 0% ticket fees, and UK GDPR.",
    url: "https://urpass.space/uk/london",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-LND",
    "geo.placename": "London",
    "geo.position": "51.5074;-0.1278",
    "ICBM": "51.5074, -0.1278",
  },
};

export default function UkLondonPage() {
  return (
    <SEOPage
      config={{
  "badge": "LONDON EVENT TECH · SUB-SECOND ENTRY",
  "h1": "Event Registration & QR Check-In Software London",
  "canonicalUrl": "https://urpass.space/uk/london",
  "description": "Fast event registration and sub-second QR check-in software for London conferences, universities, and exhibitions. Offline mode for basement venues, 0% ticket fees, and UK GDPR.",
  "ctaLabel": "Start Free in London →",
  "ctaTitle": "Eradicate Entrance Queues in London Venues",
  "ctaDescription": "From Shoreditch warehouse venues and Westminster conference halls to university auditoriums in Bloomsbury, URPASS keeps your London entrance moving.",
  "directAnswer": {
    "title": "Why Choose URPASS for London Events & Conferences?",
    "summary": "URPASS is high-speed event registration and QR check-in software designed for London conferences, exhibitions, universities, and startup summits. It replaces paper guest lists and expensive rented scanners with browser-based QR scanning in under 0.3s on volunteer smartphones. It features offline caching for underground venues, 0% ticket commission, and full UK GDPR compliance.",
    "keyPoints": [
      "Sub-second (<0.3s) camera scanning with instant audio and visual entry cues",
      "Offline validation engine keeps scanning even in London basement spaces with zero 4G/5G",
      "0% per-ticket commission, saving organisers thousands compared to legacy ticketing",
      "Tailored for London universities (UCL, Imperial, KCL, LSE) and enterprise venues (ExCeL, Olympia)"
    ]
  },
  "whatIs": {
    "title": "What is Event Registration Software London?",
    "definition": "Event registration software in London is a cloud platform built to handle the high throughput, security demands, and venue conditions of London events. It provides online delegate booking, instant digital QR pass dispatch, and rapid smartphone gate validation without requiring hardware scanner rentals or software installations.",
    "details": [
      "Handles peak arrival bursts of hundreds of attendees per minute during morning London commute windows",
      "Functions reliably inside historic brick, stone, and subterranean event spaces lacking cellular reception",
      "Supports GBP currency transactions with zero platform cuts on corporate conference tickets",
      "Adheres strictly to UK Information Commissioner Office (ICO) data protection standards"
    ]
  },
  "howItWorksTitle": "How URPASS Powers London Events",
  "howItWorksSubtitle": "Designed for fast turnaround across London's premier event spaces.",
  "steps": [
    {
      "n": "01",
      "title": "Configure your event",
      "desc": "Set ticket types, VIP badges, and custom data fields in GBP."
    },
    {
      "n": "02",
      "title": "Publish London registration",
      "desc": "Share your branded link across LinkedIn, Eventbrite alternatives, or email."
    },
    {
      "n": "03",
      "title": "Manage delegate bookings",
      "desc": "Registrations update live with automatic approval and instant pass generation."
    },
    {
      "n": "04",
      "title": "Issue digital passes",
      "desc": "Delegates receive responsive digital mobile passes directly to their phones."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Door staff scan passes with phone cameras in <0.3s, preventing foyer queues."
    },
    {
      "n": "06",
      "title": "Monitor live throughput",
      "desc": "Track real-time capacity and attendance stats across all venue entrances."
    }
  ],
  "featuresTitle": "Features Built for London Venue Demands",
  "featuresSubtitle": "Sub-second camera scans, underground offline mode, and synchronized multi-door control.",
  "features": [
    {
      icon: ScanLine,
      "title": "Sub-Second Gate Scanning",
      "desc": "Admit 40 to 50 attendees per minute per volunteer. High-contrast screens ensure readability in dim lighting."
    },
    {
      icon: Zap,
      "title": "London Basement & Tube Offline Mode",
      "desc": "Subterranean and heritage venues often have dead signal spots. URPASS pre-caches attendee lists in browser memory."
    },
    {
      icon: Users,
      "title": "Multi-Entrance Synchronisation",
      "desc": "Managing multiple doors at ExCeL, Business Design Centre, or Tobacco Dock? Scans sync within 150ms."
    },
    {
      icon: ShieldCheck,
      "title": "UK GDPR & ICO Compliance",
      "desc": "Attendee data is stored securely without third-party advertising trackers, popups, or cross-site data harvesting."
    },
    {
      icon: Building2,
      "title": "London Universities & SUs",
      "desc": "Built for Bloomsbury, Strand, and South Kensington student events. Track Student IDs and society quotas easily."
    },
    {
      icon: Banknote,
      "title": "0% Commission on London Tickets",
      "desc": "Keep 100% of your ticket revenue with simple flat GBP subscriptions and zero per-ticket percentage deductions."
    }
  ],
  "whoShouldUse": {
    "title": "Who Should Use URPASS in London?",
    "subtitle": "Built for London's fast-moving event professionals and student committees.",
    "personas": [
      {
        "badge": "SUMMITS",
        "title": "City & Canary Wharf Financial Conferences",
        "desc": "Executive summits and FinTech conferences requiring VIP delegate credentials and instant check-in verification."
      },
      {
        "badge": "TECH CLUSTERS",
        "title": "Shoreditch & King's Cross Tech Meetups",
        "desc": "Developer gatherings, hackathons, and demo days wanting fast entrance flow without ticketing commissions."
      },
      {
        "badge": "HIGHER ED",
        "title": "London University Societies",
        "desc": "UCL, Imperial, LSE, and King's College London student balls, guest debates, and union societies."
      },
      {
        "badge": "EXPOS",
        "title": "Trade Exhibitions & Showcases",
        "desc": "Visitor badge scanning at Olympia, ExCeL, and Truman Brewery with multi-gate synchronization."
      },
      {
        "badge": "CREATIVE",
        "title": "Art, Fashion & Design Shows",
        "desc": "Pop-up gallery openings and creative showcases requiring sleek, branded digital mobile passes."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How London Venue QR Check-In Works",
    "subtitle": "No hardware rentals, no attendee app downloads, pure speed.",
    "description": "Volunteers open a scanner URL on their mobile browser (Safari or Chrome). No app installation or logins required. The camera recognizes the attendee's QR pass from 30cm away in under 0.3s, checks the pass against the event registry, produces an audible chime, and records the gate timestamp. If venue Wi-Fi drops, the local browser cache continues verifying passes uninterrupted.",
    "points": [
      "Zero equipment costs: no need to rent expensive laser scanner hardware.",
      "Fast volunteer onboarding: staff begin scanning within 15 seconds of receiving the link.",
      "Atomic row-locking prevents shared pass screenshots across different entrances.",
      "Manual guest lookup available if an attendee's phone battery runs out."
    ]
  },
  "keyFactsTable": {
    "title": "London Event Check-In Benchmark",
    "subtitle": "How URPASS outperforms legacy ticketing platforms in London venues.",
    "headers": [
      "Metric / Capability",
      "URPASS London",
      "Legacy Ticketing (Eventbrite / Bizzabo)"
    ],
    "rows": [
      {
        "col1": "Check-In Speed",
        "col2": "<0.3s per scan (45+ attendees/min)",
        "col3": "2.5 to 4.0s (slow camera tap confirmations)"
      },
      {
        "col1": "Basement Resilience",
        "col2": "Full offline memory caching",
        "col3": "Freezes or times out on low signal"
      },
      {
        "col1": "Hardware Demands",
        "col2": "Any volunteer phone browser",
        "col3": "Proprietary apps or rented hardware"
      },
      {
        "col1": "Multi-Gate Sync",
        "col2": "Instant sub-150ms atomic state replication",
        "col3": "Periodic sync allows duplicate entries"
      },
      {
        "col1": "Ticket Fee Model",
        "col2": "0% commission; flat GBP plan",
        "col3": "Up to 6.95% + £0.59 deducted per ticket"
      },
      {
        "col1": "Attendee Data Privacy",
        "col2": "Strict UK GDPR compliance, zero ads",
        "col3": "Promotes competitor events to attendees"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is event registration software London?",
      "a": "It is event software tailored for London conferences, meetups, and exhibitions, offering online registration, digital QR ticket issuance, and sub-second smartphone check-in."
    },
    {
      "q": "Can URPASS handle London venues with poor phone reception?",
      "a": "Yes. URPASS features an offline scanning engine that pre-loads the guest list in memory, allowing volunteer phones to validate QR passes even in subterranean vaults or warehouse basements."
    },
    {
      "q": "How does URPASS compare to Eventbrite in London?",
      "a": "URPASS charges 0% commission on ticket sales, does not promote competitor events to your attendees, and provides faster smartphone check-in with offline support."
    },
    {
      "q": "Can London university societies use URPASS for balls and fests?",
      "a": "Yes. Student unions and collegiate societies across UCL, Imperial, KCL, and LSE use URPASS for balls, guest lectures, and campus fests with custom Student ID fields."
    },
    {
      "q": "Do London attendees need to download an app to enter?",
      "a": "No. Passes display cleanly in any mobile browser or email, and door teams scan using web browsers without installing native apps."
    },
    {
      "q": "Can we manage multi-gate entry at large London venues like ExCeL or Olympia?",
      "a": "Yes. URPASS synchronises scans across all venue entrances in real time, preventing duplicate entry attempts across different gates."
    },
    {
      "q": "How much does URPASS cost for London events?",
      "a": "URPASS offers a free plan for free events and transparent flat monthly GBP subscriptions (£15 / £35 / £79/mo) for paid events with 0% ticketing commission."
    },
    {
      "q": "Can door staff manually search attendees if their phone dies?",
      "a": "Yes. The scanner includes a fast search bar to look up attendees by name, email, or booking reference in seconds."
    }
  ],
  "relatedLinks": [
    {
      "title": "UK Event Registration Software",
      "href": "/uk",
      "category": "Location"
    },
    {
      "title": "Manchester Event Registration Software",
      "href": "/uk/manchester",
      "category": "Location"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Corporate Event Registration & Attendee Check-In",
      "href": "/corporate-event-registration-software",
      "category": "Use Case"
    },
    {
      "title": "Eventbrite Alternative UK",
      "href": "/eventbrite-alternative-uk",
      "category": "Comparison"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "GB-LND",
    "placename": "London",
    "position": "51.5074;-0.1278",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "country": "United Kingdom",
    "countryCode": "GB"
  }
}}
    />
  );
}
