import type { Metadata } from "next";
import { Ticket, Smartphone, QrCode, ShieldCheck, Printer, Zap, BarChart3, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Digital Conference Badges & Mobile Event Passes | URPASS",
  description:
    "Generate responsive digital conference badges, mobile wallet passes, and vertical lanyard passes with dynamic QR codes. Zero paper waste and sub-0.3s check-in.",
  keywords: [
    "digital conference badges",
    "mobile event badges",
    "digital pass generator",
    "paperless conference passes",
    "mobile wallet event ticket",
    "conference lanyard badge design",
  ],
  alternates: { canonical: "https://urpass.space/digital-conference-badges" },
  openGraph: {
    title: "Digital Conference Badges & Mobile Event Passes | URPASS",
    description: "Generate responsive digital conference badges and mobile passes with dynamic QR codes.",
    url: "https://urpass.space/digital-conference-badges",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "PAPERLESS BADGING STACK",
        h1: "Digital Conference Badges & Mobile Event Passes",
        canonicalUrl: "https://urpass.space/digital-conference-badges",
        description:
          "Issue beautiful, responsive mobile badges with custom branding, attendee details, and single-use QR credentials. Decodable in under 0.3s by standard phone cameras.",
        ctaLabel: "Create Digital Badges Free",
        directAnswer: {
          title: "What are Digital Conference Badges and How Do They Work?",
          summary:
            "Digital conference badges are responsive, web-based credentials issued to event attendees via email or direct web link. Instead of relying solely on printed plastic badges, attendees carry an interactive pass on their mobile browser featuring their name, company, ticket tier, and a cryptographically signed QR code that venue staff scan in under 0.3 seconds for instant gate verification.",
          keyPoints: [
            "100% paperless mobile badges that load instantly in Safari, Chrome, and mobile wallets",
            "Embeds dynamic attendee details: full name, company/institution, tier, and cryptographic token",
            "Sub-0.3s camera scanning at conference hall doors with audible chime and haptic feedback",
            "Optional printable export in vertical lanyard (440x640) or horizontal ticket (780x340) formats",
          ],
        },
        keyFactsTable: {
          title: "Digital vs Plastic Physical Badges",
          subtitle: "Environmental, financial, and operational comparison for conferences.",
          headers: ["Aspect", "URPASS Digital Badges", "Traditional Plastic Lanyard Badges"],
          rows: [
            { col1: "Material & Production Cost", col2: "$0 / ₹0 (Zero printing or plastic waste)", col3: "$2.50 to $6.00 per attendee for plastic/lanyards" },
            { col1: "Last-Minute Typos & Changes", col2: "Instant digital updates from organizer console", col3: "Requires throwing away and reprinting badge" },
            { col1: "Delivery Speed", col2: "Instant via transactional email within seconds", col3: "Long registration desk queues on Day 1" },
            { col1: "Gate Scan Latency", col2: "< 0.3s directly on smartphone screen", col3: "Often requires manual visual inspection" },
            { col1: "Anti-Duplication Security", col2: "Cryptographic single-use UUID token lock", col3: "Easily handed off or swapped between attendees" },
          ],
        },
        features: [
          { icon: Smartphone, title: "Universal Mobile View", desc: "Passes render beautifully across iPhone and Android screens with add-to-home-screen and wallet-friendly access." },
          { icon: QrCode, title: "High-Contrast Optical QR", desc: "Designed for rapid optical capture, decodable in under 0.3s even with screen glare or cracked phone glass." },
          { icon: ShieldCheck, title: "Atomic Anti-Sharing Guard", desc: "Single-use tokens lock immediately upon initial admission, preventing attendees from sharing pass screenshots." },
          { icon: Ticket, title: "Multi-Tier Badge Styling", desc: "Differentiate VIPs, Keynote Speakers, Press, Sponsors, and General Delegates with distinct badge color palettes." },
          { icon: Printer, title: "Hybrid Print-Ready Export", desc: "Need physical badges for specific VIPs? Export standard vertical lanyard badges (440x640) with a single click." },
          { icon: BarChart3, title: "Real-Time Scan Telemetry", desc: "Monitor session attendance, hall capacity, and peak check-in rush hours live from your organizer dashboard." },
        ],
        steps: [
          { n: "01", title: "Style Badge in Ticket Studio", desc: "Choose color accents, upload conference emblems, and customize badge typography." },
          { n: "02", title: "Collect Delegate Information", desc: "Attendees register or buy passes with their name, job title, and company details." },
          { n: "03", title: "Automatic Digital Dispatch", desc: "Unique digital badges are emailed to delegates instantly upon confirmation." },
          { n: "04", title: "Doors Open & Scanning", desc: "Staff scan badges using phone cameras in <0.3s at main auditorium and breakout doors." },
          { n: "05", title: "Analyze Track Attendance", desc: "Review real-time attendance percentages and export comprehensive attendance audit logs." },
        ],
        callout: {
          badge: "SUSTAINABLE EVENTS",
          title: "Cut conference badge printing costs to zero while speeding up entry.",
          description: "Major academic and tech conferences spend thousands of dollars on single-use plastic badge sleeves that end up in landfills. URPASS offers a modern, high-velocity digital alternative.",
          bullets: [
            "Zero printing and shipping lead times — launch badges hours before your event",
            "Eliminates 30-minute registration desk queues on opening morning",
            "Attendees keep their digital badge safely accessible on their phone screen",
            "Full attendance tracking across keynote rooms and breakout workshop sessions",
          ],
        },
        faqs: [
          { q: "Can attendees save their digital badge to their phone wallet?", a: "Yes. Attendees can save their digital badge to their mobile home screen or download a high-resolution image for immediate offline access." },
          { q: "What if an attendee's phone battery runs out?", a: "Door staff can instantly look up the attendee by first name, last name, or email on the scanner interface to check them in manually." },
          { q: "Can we still print physical badges if required?", a: "Yes. URPASS supports hybrid workflows: you can issue digital passes to general attendees and print high-resolution lanyard badges for VIPs and keynote speakers." },
          { q: "Does creating digital badges require design experience?", a: "No. The built-in URPASS Ticket Studio features intuitive templates that format attendee names, company titles, and QR codes automatically." },
        ],
        relatedLinks: [
          { title: "Pass & Ticket Studio", href: "/design-your-ticket", category: "Product" },
          { title: "Event Badge Printing Software", href: "/event-badge-printing-software", category: "Product" },
          { title: "How to Create Digital Passes", href: "/guides/how-to-create-digital-event-passes", category: "Guide" },
          { title: "Conference Registration Software", href: "/conference-registration-software", category: "Use Case" },
        ],
      }}
    />
  );
}
