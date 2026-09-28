import type { Metadata } from "next";
import {
  GraduationCap,
  Building2,
  Users,
  ScanLine,
  ShieldCheck,
  Banknote,
  CheckCircle2,
  Zap,
  Smartphone,
  Calendar,
  Lock,
  Sparkles,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Society Event Ticketing Software UK | 0% Fees | URPASS",
  description:
    "Event ticketing and QR check-in software for UK university societies, Students' Unions, and campus clubs. Student ID capture, member ticket tiers, sub-second volunteer phone scanning, 0% platform commission.",
  keywords: [
    "university society event ticketing",
    "students union ticketing software uk",
    "campus society event registration",
    "student club ticketing app",
    "university freshers ball ticketing",
    "eventbrite alternative student societies",
    "fixr alternative uk university",
    "zero commission student society ticketing",
  ],
  alternates: { canonical: "https://urpass.space/university-society-event-ticketing" },
  openGraph: {
    title: "University Society Event Ticketing Software UK | URPASS",
    description:
      "Run seamless society events, balls, and freshers' nights. Student ID tracking, volunteer phone scanning, and 0% ticket fees for UK universities.",
    url: "https://urpass.space/university-society-event-ticketing",
    locale: "en_GB",
    type: "website",
  },
};

export default function UniversitySocietyEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/university-society-event-ticketing",
        badge: "STUDENTS' UNION & CAMPUS TICKETING · 0% PLATFORM FEES",
        h1: "University Society & Students' Union Event Ticketing Software",
        description:
          "Empower your society committee to sell tickets and run rapid gate check-ins without losing budget to ticketing platforms. Features Student ID collection, tiered member pricing, sub-second volunteer phone scanning, and 0% commission.",
        ctaLabel: "Start free for your society",

        directAnswer: {
          title: "Why Choose URPASS for UK University Societies & Students' Unions?",
          summary:
            "URPASS is high-speed event ticketing and QR check-in software purpose-built for UK university societies, sports clubs, and Students' Unions (SUs). It solves common campus ticketing headaches — including clunky SU union portals, high Eventbrite fees, and long queues in the rain — by offering volunteer-friendly smartphone QR scanning, Student ID capture, member pricing tiers, and 0% ticket commission with a 30-day free trial.",
          keyPoints: [
            "0% commission on ticket sales — keep every pound for your society budget",
            "Capture Student ID, course, year of study, and dietary requirements",
            "Volunteer phone scanning in under 0.3s with zero app downloads",
            "Instant 30-day free trial for UK student societies with no card required",
          ],
        },

        keyFactsTable: {
          title: "University Society Event Ticketing Platform Comparison",
          subtitle: "How URPASS supports student exec committees compared to legacy campus ticketing tools.",
          headers: ["Feature / Requirement", "URPASS for Societies", "Traditional Eventbrite & SU Portals"],
          rows: [
            {
              col1: "Platform Commission",
              col2: "0% commission (flat plans from £0–£35/mo)",
              col3: "6.95% + £0.59 per ticket on Eventbrite; internal SU cuts",
            },
            {
              col1: "Student ID & Course Capture",
              col2: "Built-in UK campus field presets",
              col3: "Clunky manual forms or locked to matriculation database",
            },
            {
              col1: "Door Check-In Speed",
              col2: "<0.3s per attendee on volunteer phones",
              col3: "2.5 to 4.0s per ticket or manual paper sheets",
            },
            {
              col1: "App Download Requirement",
              col2: "Zero app downloads (works in Safari/Chrome)",
              col3: "Mandatory app store downloads or paper printouts",
            },
            {
              col1: "Committee Handover",
              col2: "Instant PIN code sharing with door volunteers",
              col3: "Account credential sharing or slow SU admin cycles",
            },
          ],
        },

        productProof: {
          badge: "CAMPUS READY",
          title: "Engineered for Freshers' Fairs, Society Galas & Hackathons",
          description:
            "From high-volume freshers' events and hackathons to formal society balls and cultural showcases at Russell Group and campus universities, URPASS gives student committees enterprise-grade gate control without touching their event budget.",
          type: "scanner",
        },

        features: [
          {
            icon: GraduationCap,
            title: "Student ID & Details Capture",
            desc: "Collect Student ID numbers, course / degree, year of study, and dietary needs seamlessly on the registration form.",
          },
          {
            icon: Banknote,
            title: "0% Platform Commission",
            desc: "Stop handing over 7% to 10% of your society ticket revenue. Pay a flat GBP subscription or use our Free tier forever.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Volunteer Scanning",
            desc: "Any committee member can scan tickets immediately. Share a 6-digit PIN and start validating passes in under 300ms.",
          },
          {
            icon: Users,
            title: "Member vs Non-Member Tiers",
            desc: "Configure discounted ticket tiers for paid society members and standard pricing for guests and external attendees.",
          },
          {
            icon: Zap,
            title: "Underground & Club Offline Mode",
            desc: "Basement union bars and nightclub venues have poor mobile signals. Pre-cached guest lists ensure scanning never halts.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & SU Governance",
            desc: "Fully compliant with the UK Data Protection Act 2018. Student data is never sold to third-party marketing companies.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Create Society Event in 2 Minutes",
            desc: "Enter event name, London/UK timezone, campus venue, and choose your student registration questions.",
          },
          {
            n: "02",
            title: "Set Member & Guest Ticket Tiers",
            desc: "Define pricing and capacity limits for society members, general students, and external guests.",
          },
          {
            n: "03",
            title: "Share Branded Registration Page",
            desc: "Post your urpass.space/apply link directly to your society WhatsApp group, Instagram bio, or campus newsletter.",
          },
          {
            n: "04",
            title: "Scan Attendees with Any Phone",
            desc: "Door volunteers enter the 6-digit PIN on their phone browsers and scan QR codes as students walk through the doors.",
          },
          {
            n: "05",
            title: "Export Attendance for SU Reports",
            desc: "Download complete check-in rosters and analytics in clean CSV format for your Students' Union annual report.",
          },
        ],

        deepDiveSections: [
          {
            badge: "VOLUNTEER EXEC EFFICIENCY",
            title: "Designed for Student Committees: Zero Onboarding Friction",
            paragraphs: [
              "Every year, student society exec committees change hands. New presidents, treasurers, and events officers need ticketing software that works out of the box without complicated IT setup or waiting weeks for Students' Union approval.",
              "URPASS requires zero app downloads. To deploy door staff for an evening event, the events lead simply shares a 6-digit PIN. Committee volunteers open the link on their iPhones or Androids, point their camera at attendees' passes, and get instant green confirmation with attendee names.",
            ],
            bullets: [
              "Zero software installation required for door volunteers",
              "Works reliably on both student personal devices and SU tablets",
              "Haptic vibration confirms check-ins over loud music in union venues",
              "Complete attendance CSV downloads in one click for SU auditing",
            ],
            takeaway: "Effortless volunteer door management with zero training required.",
          },
          {
            badge: "TICKET TOUT PREVENTION",
            title: "Preventing Ticket Scalping and Screenshot Sharing at Campus Balls",
            paragraphs: [
              "High-demand student events like annual balls, boat parties, and freshers' week headliners frequently suffer from ticket touting and screenshot fraud. Students often resell tickets or share screenshot images with friends to sneak into sold-out venues.",
              "URPASS stops ticket fraud cold. When a QR pass is scanned at any entrance door, it is recorded in the central database within 150ms. If an attendee attempts entry with a duplicate screenshot, the scanner alerts staff immediately with a flashing red warning and exact timestamp.",
            ],
            bullets: [
              "Immediate 150ms cross-gate deduplication prevents duplicate entries",
              "Student ID verification matches ticket holder to their campus card",
              "Anti-screenshot dynamic pass verification",
              "Tamper-evident QR tokens resist spoofing and forging",
            ],
            takeaway: "Eliminate gate fraud and keep your campus events safe and compliant.",
          },
        ],

        useCases: [
          "Freshers' Week Welcome Fairs & Club Nights",
          "Annual Society Black-Tie Balls & Galas",
          "University Hackathons & Coding Competitions",
          "Cultural & National Society Showcases",
          "Sports Club Fixtures, Tours & Socials",
          "Academic Society Guest Lectures & Panels",
          "Charity Fundraisers & Student RAG Events",
          "Graduation Dinners & Boat Parties",
        ],

        relatedLinks: [
          {
            title: "UK Event Ticketing Master Hub",
            href: "/uk",
            category: "Location",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Manchester Event Registration & Check-In",
            href: "/uk/manchester",
            category: "Location",
          },
          {
            title: "Zero Commission Event Ticketing UK",
            href: "/zero-commission-event-ticketing-uk",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK Comparison",
            href: "/compare/eventbrite-alternative-uk",
            category: "Comparison",
          },
        ],

        faqs: [
          {
            q: "Can we capture Student ID numbers when attendees register?",
            a: "Yes. URPASS comes with pre-configured UK campus registration fields, allowing you to collect Student IDs, university emails (.ac.uk), course degrees, year of study, and dietary requirements.",
          },
          {
            q: "How much does URPASS cost for student societies?",
            a: "URPASS has a permanent Free tier (£0 forever for up to 100 registrations/month). For larger events or freshers' week, Starter (£15/mo) and Pro (£35/mo) provide unlimited events with 0% ticket commission. You can activate a 30-day free trial instantly with no credit card.",
          },
          {
            q: "Do our committee volunteers need to download an app to scan tickets?",
            a: "No app download is needed. Committee members and door volunteers simply open the scanner link in Safari or Chrome on their smartphones, enter the 6-digit PIN, and scan passes using their camera.",
          },
          {
            q: "How does URPASS prevent students sharing screenshots of tickets?",
            a: "Each QR code is validated against the live database in under 0.3s. Once a pass is scanned at any door, attempting to scan a screenshot of the same pass immediately triggers a red 'ALREADY CHECKED IN' alert with the exact time of entry.",
          },
          {
            q: "Will URPASS work in basement union bars without mobile signal?",
            a: "Yes. URPASS features an offline caching engine. When volunteers open the scanner, the guest list is cached in device memory, allowing continuous scanning even in underground venues without Wi-Fi or cellular reception.",
          },
          {
            q: "Can we export attendance rosters for our Students' Union (SU)?",
            a: "Yes. You can export complete check-in rosters and registration responses in clean CSV format at any time to submit for SU compliance, risk assessments, or grant funding requirements.",
          },
        ],

        ctaTitle: "Upgrade your student society events today",
        ctaDescription: "Join student unions and societies saving money and eliminating entrance queues. Start your 30-day free trial today.",
        geo: {
          region: "GB",
          placename: "United Kingdom",
          position: "55.3781;-3.4360",
          latitude: 55.3781,
          longitude: -3.4360,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
