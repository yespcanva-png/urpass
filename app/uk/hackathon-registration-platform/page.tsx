import type { Metadata } from "next";
import {
  Code,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  BarChart3,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Hackathon Registration Platform UK | Fast Check-In Passes",
  description:
    "UK hackathon registration and check-in software for tech societies, universities, and student developer hackathons. Collect GitHub profiles, issue digital QR passes, and scan in 0.28s.",
  keywords: [
    "hackathon registration platform uk",
    "uk hackathon software",
    "student hackathon ticketing uk",
    "hackathon check in app uk",
    "university hackathon registration uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/hackathon-registration-platform",
  },
  openGraph: {
    title: "Hackathon Registration Platform UK | URPASS",
    description:
      "Modern registration and check-in software for UK hackathons. Apple Wallet support, sub-second scanning, and UK GDPR compliance.",
    url: "https://urpass.space/uk/hackathon-registration-platform",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkHackathonRegistrationPlatformPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/hackathon-registration-platform",
        badge: "UK TECH & HACKATHONS",
        h1: "Hackathon Registration Platform for UK Events",
        description:
          "The modern registration and check-in platform built for UK hackathons, tech societies, and developer communities. Collect GitHub handles, issue digital QR passes to Apple and Google Wallet, and scan hackers at the door in under 0.28 seconds.",
        ctaLabel: "Create Hackathon Free",
        directAnswer: {
          title: "How URPASS Powers UK Hackathons",
          summary:
            "UK university hackathons (such as ICHack, GreatUniHack, OxHack, and HackCambridge) welcome hundreds of student developers for 24-48 hour coding sprints. URPASS simplifies participant registration, captures tech stacks, verifies student IDs, and delivers encrypted digital passes. Volunteers scan passes in under 0.28 seconds in any mobile browser to eliminate entrance queues.",
          keyPoints: [
            "Entrance Velocity: Sub-0.28s mobile browser scanning ensures hackers get to work immediately",
            "Developer Profiles: Capture GitHub usernames, LinkedIn links, and team rosters seamlessly",
            "Swag & Catering Scanning: Re-scan passes to distribute midnight pizza, Red Bull, and sponsor swag",
            "UK GDPR Compliant: Stored with encryption and strict privacy standards",
          ],
        },
        productProof: {
          badge: "DEVELOPER PASSES",
          title: "Sub-Second In-Browser Scan Engine",
          description:
            "Volunteers point phone cameras at hacker passes. Instant audio chime confirmation with duplicate pass detection.",
          type: "scanner",
        },
        features: [
          {
            icon: Code,
            title: "Custom Developer Questions",
            desc: "Collect GitHub handles, student emails, dietary needs, and team member names directly on your registration form.",
          },
          {
            icon: QrCode,
            title: "Digital Hacker Passes",
            desc: "Personalized mobile passes with encrypted QR signatures and native Apple Wallet & Google Wallet integration.",
          },
          {
            icon: ScanLine,
            title: "0.28s Gate Validation",
            desc: "Volunteers scan participant badges in under 0.28s directly in Safari or Chrome without installing apps.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Spoofing Security",
            desc: "Cryptographically signed QR tokens prevent unauthorized badge duplication or forwarded screenshot access.",
          },
          {
            icon: Users,
            title: "Team Roster Management",
            desc: "Group hackers by team name, filter approval status, and manage waitlists from a single portal.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Tracking",
            desc: "Monitor arrival rates in real time, track venue capacity, and export verified attendance records to CSV.",
          },
        ],
        steps: [
          { n: "01", title: "Build Form", desc: "Set up registration fields, tracks, and submission caps in 2 minutes." },
          { n: "02", title: "Circulate Link", desc: "Share registration URLs across Discord, Devpost, Slack, and university channels." },
          { n: "03", title: "Approve Hackers", desc: "Issue digital QR badges to accepted participants in one click." },
          { n: "04", title: "Scan at Doors", desc: "Check in hackers in under 0.28 seconds with zero registration lines." },
        ],
        callout: {
          badge: "UK HACKATHON READY",
          title: "Built for university tech societies and student clubs",
          description:
            "Whether you are organizing an internal 50-hacker sprint or a major 500-developer inter-university event, URPASS keeps check-in lightning fast.",
          bullets: [
            "Permanent free plan available for student-led hackathons",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Instant multi-gate cloud sync across venue entry doors",
            "Full UK GDPR compliance and attendee data ownership",
          ],
        },
        useCases: [
          "24-hour & 48-hour student hackathons across UK universities",
          "AI, machine learning & cloud developer hackathons",
          "Open-source sprints & community bug bashes",
          "Corporate engineering innovation days in London & Manchester",
          "High school tech competitions & code challenges",
        ],
        faqs: [
          {
            q: "Can UK student societies use URPASS for free?",
            a: "Yes! URPASS provides a permanent free plan with no credit card required, allowing student societies to host up to 50 attendees per event with digital QR passes and unlimited scanning.",
          },
          {
            q: "Does URPASS comply with UK GDPR?",
            a: "Yes. Attendee personal data is encrypted and handled in strict compliance with the UK Data Protection Act 2018 and UK GDPR.",
          },
          {
            q: "Can we use URPASS to manage catering and swag queues?",
            a: "Yes! Hackathon organizers frequently use URPASS check-in counters to track dinner lines, midnight snacks, and sponsor swag bag claims.",
          },
          {
            q: "Do volunteers need to install an app to scan tickets?",
            a: "No. Volunteers simply open a private scanner URL in Chrome or Safari on their personal smartphones. The scanner activates the camera immediately with zero app store downloads.",
          },
        ],
        ctaTitle: "Launch your UK hackathon with URPASS",
        ctaDescription: "Permanent free plan · Apple Wallet passes · 0.28s gate scanning · UK GDPR compliant",
      }}
    />
  );
}
