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
  title: "Hackathon Registration Platform with QR Check-In | URPASS",
  description:
    "Fast, developer-friendly hackathon registration platform. Collect GitHub profiles, team rosters, issue digital QR passes, and check in hackers in 0.28s.",
  keywords: [
    "hackathon registration platform",
    "hackathon management software",
    "hackathon check in app",
    "hackathon ticketing system",
    "hackathon participant management",
    "free hackathon registration",
  ],
  alternates: {
    canonical: "https://urpass.space/hackathon-registration-platform",
  },
  openGraph: {
    title: "Hackathon Registration Platform with QR Check-In | URPASS",
    description:
      "Modern registration and check-in software for hackathons. Collect tech stacks, issue digital QR passes, and scan hackers in 0.28s.",
    url: "https://urpass.space/hackathon-registration-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function HackathonRegistrationPlatformPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/hackathon-registration-platform",
        badge: "DEV & HACKATHONS",
        h1: "Hackathon Registration Platform With QR Check-In",
        description:
          "The modern registration and check-in engine built for hackathon organizers. Collect GitHub profiles, tech stacks, and team members. Deliver sleek digital passes to Apple and Google Wallet, and check in hundreds of hackers in under 0.28 seconds.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "Why Hackathons Need Dedicated QR Check-In",
          summary:
            "Hackathons require smooth participant verification, team confirmation, and food/swag badge scanning across 24 to 48 continuous hours. Spreadsheets create painful entrance bottlenecks and make tracking midnight meal distributions chaotic. URPASS provides digital QR passes with instant in-browser camera scanning, multi-gate sync, and permanent free tier access for developer communities.",
          keyPoints: [
            "Fast Entrance: 0.28s smartphone camera scanning eliminates check-in delays",
            "Custom Hacker Fields: Collect GitHub URLs, LinkedIn profiles, skills, and dietary requirements",
            "Swag & Food Tracking: Re-scan passes to verify hackathon meal and swag bag distribution",
            "Permanent Free Tier: ₹0 forever for student and community hackathons with up to 50 participants",
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
            desc: "Collect GitHub handles, portfolio links, years of experience, and team member names directly on your form.",
          },
          {
            icon: QrCode,
            title: "Digital Hacker Passes",
            desc: "Personalized mobile passes featuring participant name, track, and encrypted QR token with mobile wallet sync.",
          },
          {
            icon: ScanLine,
            title: "0.28s Gate Validation",
            desc: "Check in participants at venue doors in milliseconds using any smartphone running Chrome or Safari.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Spoofing Security",
            desc: "Cryptographically signed QR tokens prevent unauthorized badge duplication or forwarded screenshot access.",
          },
          {
            icon: Users,
            title: "Team Roster Management",
            desc: "Easily group participants by team name, filter approval status, and manage waitlists from a unified dashboard.",
          },
          {
            icon: BarChart3,
            title: "Live Hacker Headcount",
            desc: "Monitor arrival velocity, track physical occupancy, and export verified attendance rosters anytime.",
          },
        ],
        steps: [
          { n: "01", title: "Configure Form", desc: "Set up registration fields, tracks, and submission caps in 2 minutes." },
          { n: "02", title: "Publish Link", desc: "Share registration URLs across Discord, Devpost, X, and student channels." },
          { n: "03", title: "Approve Hackers", desc: "Issue digital QR badges to accepted participants in one click." },
          { n: "04", title: "Scan at Doors", desc: "Check in hackers in under 0.28 seconds with zero registration lines." },
        ],
        callout: {
          badge: "HACKATHON READY",
          title: "Built for developer communities, student clubs, and tech accelerators",
          description:
            "From small 50-hacker weekend jams to major 1,000+ developer hackathons, URPASS keeps check-in fast, professional, and reliable.",
          bullets: [
            "Permanent free plan available for community hackathons",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Real-time duplicate entry prevention across all venue doors",
            "One-click CSV exports with verified arrival timestamps",
          ],
        },
        useCases: [
          "24-hour & 48-hour student campus hackathons",
          "Web3, AI, and cloud developer hackathons",
          "Open source contribution sprints & bug bashes",
          "Internal corporate engineering hackathons",
          "High school tech competitions & code jams",
        ],
        faqs: [
          {
            q: "Can I use URPASS for a free hackathon?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 attendees per event, including full digital QR pass generation and unlimited gate scanning.",
          },
          {
            q: "Can we collect GitHub and LinkedIn profiles during registration?",
            a: "Yes. You can add custom fields for GitHub usernames, LinkedIn URLs, tech stacks, team member names, and dietary preferences.",
          },
          {
            q: "Can volunteers scan passes using their personal phones?",
            a: "Yes. Volunteers simply open a private scanner link in Chrome or Safari on their personal smartphones. The scanner activates immediately with zero app store downloads.",
          },
          {
            q: "Can we use URPASS to track midnight food or swag bag distribution?",
            a: "Yes! Organizers frequently use URPASS check-in counters to track dinner lines, midnight energy drink handouts, and swag bag claims.",
          },
        ],
        ctaTitle: "Launch your hackathon registration today",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
