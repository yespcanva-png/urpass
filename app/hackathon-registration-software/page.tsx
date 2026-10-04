import type { Metadata } from "next";
import { BarChart3, FileText, Lock, ScanLine, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Hackathon Registration & QR Check-In Software | URPASS",
  description: "Hackathon registration software with team formation, GitHub/portfolio fields, midnight meal QR scanning, and fast volunteer smartphone check-in.",
  keywords: ["hackathon registration software", "hackathon check-in system", "hackathon team registration platform", "hackathon meal qr scanning", "developer hackathon registration", "hackathon attendee management"],
  alternates: {
    canonical: "https://urpass.space/hackathon-registration-software",
  },
  openGraph: {
    title: "Hackathon Registration & QR Check-In Software | URPASS",
    description: "Hackathon registration software with team formation, GitHub/portfolio fields, midnight meal QR scanning, and fast volunteer smartphone check-in.",
    url: "https://urpass.space/hackathon-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function HackathonRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "HACKATHON & BUILDER EDITION",
  "h1": "Hackathon Registration & QR Check-In Software",
  "canonicalUrl": "https://urpass.space/hackathon-registration-software",
  "description": "Hackathon registration software with team formation, GitHub/portfolio fields, midnight meal QR scanning, and fast volunteer smartphone check-in.",
  "ctaLabel": "Create Your Hackathon Free →",
  "ctaTitle": "Run Frictionless 24-48 Hour Hackathons",
  "ctaDescription": "Manage builder applications, team registrations, midnight meal validation, and overnight venue access with sub-second QR scanning.",
  "directAnswer": {
    "title": "What is Hackathon Registration Software?",
    "summary": "URPASS is hackathon registration and attendee check-in software built for coding competitions, collegiate hackathons, and developer builder jams. It handles team signups, technical track selection, GitHub profile collection, instant digital QR badges, multi-gate security access, and multi-session meal tracking with volunteer smartphone cameras.",
    "keyPoints": [
      "Custom developer fields: GitHub profiles, tech stacks, team names, and dietary needs",
      "Multi-purpose QR pass: entrance security, meal voucher validation, and swag check-in",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads",
      "100% free for free hackathons with full access to QR generation and analytics"
    ]
  },
  "whatIs": {
    "title": "What is Hackathon Registration Software?",
    "definition": "Hackathon registration software is an event platform designed for fast-paced 24-to-48-hour engineering competitions. It manages builder applications, team allocations, project track selection, venue access security, and multi-checkpoint scanning for midnight snacks, sponsor swag, and mentor sessions.",
    "details": [
      "Captures technical developer credentials including GitHub, LinkedIn, and portfolio links",
      "Replaces printed badges and manual paper food tickets with dynamic mobile QR passes",
      "Maintains multi-day venue security so only registered hackers and mentors enter overnight",
      "Tracks check-in velocity during morning opening ceremonies to keep hacking schedules on time"
    ]
  },
  "howItWorksTitle": "How URPASS Powers Hackathons",
  "howItWorksSubtitle": "From hacker application to midnight meal scanning.",
  "steps": [
    {
      "n": "01",
      "title": "Configure hackathon",
      "desc": "Set tracks, team size limits, custom questions (GitHub, skills), and capacity."
    },
    {
      "n": "02",
      "title": "Share registration link",
      "desc": "Post your event URL on Discord, Devpost, campus channels, and Twitter."
    },
    {
      "n": "03",
      "title": "Hackers register & form teams",
      "desc": "Builders submit applications with their GitHub and dietary preferences."
    },
    {
      "n": "04",
      "title": "Issue digital hacker passes",
      "desc": "Accepted hackers receive unique mobile QR credentials via email."
    },
    {
      "n": "05",
      "title": "Scan at the entrance",
      "desc": "Organizers scan passes in <0.3s at doors, swag distribution, and food lines."
    },
    {
      "n": "06",
      "title": "Track attendance & meals",
      "desc": "Monitor live hacker headcount and meal redemptions from the dashboard."
    }
  ],
  "featuresTitle": "Built for 24-48 Hour Coding Sprints",
  "featuresSubtitle": "Developer intake, multi-checkpoint scanning, and overnight access control.",
  "features": [
    {
      icon: FileText,
      "title": "Developer Intake Fields",
      "desc": "Collect GitHub URLs, Devpost usernames, team names, dietary restrictions, and T-shirt sizes."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Gate Check-In",
      "desc": "Admit hundreds of eager hackers quickly on Saturday morning without delaying the opening keynote."
    },
    {
      icon: Lock,
      "title": "Overnight Venue Security",
      "desc": "Ensure only registered builders, mentors, and judges enter the hacking venue during overnight hours."
    },
    {
      icon: Zap,
      "title": "Multi-Checkpoint Scanning",
      "desc": "Use the same QR pass to check in hackers at the entrance, verify dinner redemptions, and distribute swag."
    },
    {
      icon: Users,
      "title": "Team & Track Management",
      "desc": "Organize participants by challenge tracks (AI, Web3, FinTech) and coordinate mentor allocations."
    },
    {
      icon: BarChart3,
      "title": "Live Builder Analytics",
      "desc": "Monitor arrival rates, no-show percentages, and meal distribution counts in real time."
    }
  ],
  "whoShouldUse": {
    "title": "Who Uses Hackathon Registration Software?",
    "subtitle": "From collegiate student clubs to tech enterprise developer teams.",
    "personas": [
      {
        "badge": "COLLEGIATE",
        "title": "University Hackathon Societies",
        "desc": "Student-run collegiate hackathons (HackMIT, HackTheNorth, Local Hack Days) managing thousands of applicants."
      },
      {
        "badge": "TECH GIANTS",
        "title": "Enterprise Developer Relations",
        "desc": "Cloud providers, API platforms, and AI companies hosting developer hackathons to drive product adoption."
      },
      {
        "badge": "COMMUNITY",
        "title": "Open Source & Web3 Collectives",
        "desc": "Decentralized builder communities, startup weekends, and local developer meetups."
      },
      {
        "badge": "INCUBATORS",
        "title": "Accelerators & Angel Networks",
        "desc": "Fast-paced prototype hackathons connecting early-stage founders with venture capital mentors."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Hackathon QR Check-In Works",
    "subtitle": "Sub-second camera scanning across doors and food stations.",
    "description": "Hackers display their mobile QR pass from their email, screenshot, or digital wallet. Volunteers use smartphone web browsers to scan the QR code in under 0.3 seconds. The scanner displays the builder's name, team designation, T-shirt size, and dietary requirements (e.g. Vegan), providing an instant audio chime for rapid queue throughput.",
    "points": [
      "Zero hardware rentals: runs smoothly on any smartphone camera.",
      "Atomic row-locking prevents shared pass screenshots between delegates.",
      "Offline resilience allows continued check-in during convention hall Wi-Fi outages.",
      "Instant search bar enables rapid manual lookup by name or organization."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS vs Clunky Hackathon Sheets",
    "subtitle": "How URPASS transforms hackathon logistics.",
    "headers": [
      "Hackathon Logistics",
      "Manual Spreadsheets / Paper Meal Tickets",
      "Connected URPASS Workflow"
    ],
    "rows": [
      {
        "col1": "Morning Entrance Queue",
        "col2": "1 hour bottleneck searching 500+ names on spreadsheets",
        "col3": "<0.3s camera scan; doors clear in 15 minutes"
      },
      {
        "col1": "Meal Distribution",
        "col2": "Physical paper meal tokens easily lost, traded, or faked",
        "col3": "Digital QR pass scan verifies meal redemptions"
      },
      {
        "col1": "Overnight Gate Security",
        "col2": "Relying on paper wristbands that tear or get transferred",
        "col3": "Cryptographically secure digital QR passes on phones"
      },
      {
        "col1": "Software Cost",
        "col2": "Expensive enterprise ticketing platforms charging fees",
        "col3": "100% free for free community hackathons"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is hackathon registration software?",
      "a": "It is an event registration and attendee check-in system designed specifically for hackathons to manage participant applications, team formations, QR credentials, and meal distribution."
    },
    {
      "q": "Can we use URPASS for free hackathons?",
      "a": "Yes! URPASS is completely free for free hackathons, with unlimited registrations, full QR code issuance, and mobile scanner access."
    },
    {
      "q": "Can we collect GitHub profile URLs and dietary requirements?",
      "a": "Yes. The custom form builder lets you add mandatory fields for GitHub links, portfolio URLs, team names, T-shirt sizes, and dietary restrictions."
    },
    {
      "q": "Can we use the same QR code to track meals (breakfast, lunch, dinner)?",
      "a": "Yes. Organizers can configure multiple check-in checkpoints to validate that hackers only claim their designated meals."
    },
    {
      "q": "Do hackathon volunteers need to download an app?",
      "a": "No. Volunteers simply open a private scanner link in their mobile browser (Safari or Chrome) and begin scanning passes immediately."
    },
    {
      "q": "Can URPASS prevent unregistered walk-ins from entering overnight?",
      "a": "Yes. Every attendee QR code is cryptographically tied to an approved registration. If an unregistered walk-in presents an unverified or screenshot code, the browser scanner instantly flashes red with an invalid pass warning."
    },
    {
      "q": "Can teams or group registrations be tracked together?",
      "a": "Yes. Organizers can add custom team name fields during registration and group attendees by project or team for streamlined badge printing and check-in."
    }
  ],
  "relatedLinks": [
    {
      "title": "University Event Registration & QR Check-In Software",
      "href": "/university-event-management-software",
      "category": "Use Case"
    },
    {
      "title": "Startup Event Registration & QR Check-In",
      "href": "/startup-event-registration",
      "category": "Use Case"
    },
    {
      "title": "Free Event Ticketing & QR Check-In Software",
      "href": "/free-event-ticketing-software",
      "category": "Product"
    },
    {
      "title": "Event Check-In App with QR Scanner",
      "href": "/event-check-in-app",
      "category": "Product"
    },
    {
      "title": "Digital Event Pass Generator with QR Codes",
      "href": "/digital-event-pass-generator",
      "category": "Product"
    }
  ]
}}
    />
  );
}
