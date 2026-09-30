import type { Metadata } from "next";
import { Cpu, Ticket, ShieldCheck, Zap, Users, BarChart3, Globe2, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Developer Conference Registration & Ticketing Platform | URPASS",
  description:
    "End-to-end registration, multi-tier badges, and QR check-in platform for developer conferences, tech summits, and open-source meetups. 0% ticket commission and native MCP support.",
  keywords: [
    "developer conference registration",
    "tech conference ticketing",
    "developer event passes",
    "open source conference check in",
    "tech summit ticketing platform",
    "software conference registration",
  ],
  alternates: { canonical: "https://urpass.space/developer-conference-registration" },
  openGraph: {
    title: "Developer Conference Registration & Ticketing Platform | URPASS",
    description: "End-to-end registration, multi-tier badges, and QR check-in platform for developer conferences.",
    url: "https://urpass.space/developer-conference-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TECH SUMMIT & CONF STACK",
        h1: "Developer Conference Registration & Badge Platform",
        canonicalUrl: "https://urpass.space/developer-conference-registration",
        description:
          "Issue speaker, sponsor, and attendee badges, accept payments with 0% platform commission, and check in software engineers in under 0.3s with smartphone camera scanners.",
        ctaLabel: "Launch Developer Summit",
        directAnswer: {
          title: "Why Choose URPASS for Developer & Tech Conferences?",
          summary:
            "URPASS is engineered for tech summits, developer conferences, and developer community meetups. It provides 0% ticket commissions, multi-tier badging (General, VIP, Speaker, Sponsor, Volunteer), sub-second (<0.3s) camera check-in, automated GST tax invoicing, and native Model Context Protocol (MCP) tooling for AI assistants and autonomous workflows.",
          keyPoints: [
            "0% per-ticket platform commission — keep 100% of conference ticket revenues",
            "Multi-tier badge design: digital mobile passes, printable tickets, and conference lanyard badges",
            "Sub-0.3s smartphone camera entry scanning with zero app downloads for staff or delegates",
            "Native Model Context Protocol (MCP) server for automated attendee querying and screening via AI",
          ],
        },
        keyFactsTable: {
          title: "Developer Conference Specifications",
          subtitle: "Key technical capabilities designed for high-density engineering summits.",
          headers: ["Requirement", "URPASS Technical Specification", "Legacy Ticketing Tools"],
          rows: [
            { col1: "Platform Commission", col2: "0% on all plans (flat software subscription)", col3: "3.7% to 8% cut on every ticket sold" },
            { col1: "Badge Format Support", col2: "Vertical lanyard (440x640), PDF, digital web pass", col3: "Basic email confirmation only" },
            { col1: "Gate Check-In Speed", col2: "< 0.3s on volunteer smartphones (Safari/Chrome)", col3: "3–6s per attendee on proprietary apps" },
            { col1: "AI & MCP Integration", col2: "Native Model Context Protocol server (10 tools)", col3: "No native MCP support" },
            { col1: "Tax Compliance (India)", col2: "Automated B2B GST invoices with HSN/SAC codes", col3: "Foreign entity invoices without tax credits" },
          ],
        },
        features: [
          { icon: Cpu, title: "Model Context Protocol Native", desc: "Manage your conference using Claude Desktop, Cursor, or AI agents to inspect attendee stats and approve tickets via natural language." },
          { icon: Ticket, title: "Multi-Tier Badge Management", desc: "Design distinct lanyard badge styles and colors for Keynote Speakers, Sponsors, VIPs, and General Attendees." },
          { icon: Zap, title: "Sub-0.3s Gate Scan Velocity", desc: "Admit hundreds of engineers per hour without lobby queues using standard phone cameras in mobile Safari and Chrome." },
          { icon: ShieldCheck, title: "Atomic Duplicate Lockout", desc: "Single-use cryptographic QR tokens eliminate badge sharing and unauthorized workshop session hopping." },
          { icon: Globe2, title: "0% Commission Payments", desc: "Collect payments via Razorpay (UPI, Net Banking, cards) or Stripe with 0% platform cuts taken from your earnings." },
          { icon: BarChart3, title: "Live Session & Gate Telemetry", desc: "Track room capacity, keynote turnout percentages, and arrival velocity in real time from any browser." },
        ],
        steps: [
          { n: "01", title: "Configure Conference Tiers", desc: "Define Early-bird, Standard, Speaker, and Sponsor ticket tiers with custom attendee fields." },
          { n: "02", title: "Design Conference Badges", desc: "Use Ticket Studio to style high-contrast lanyard badges and mobile passes with your branding." },
          { n: "03", title: "Publish Registration Portal", desc: "Share your clean, developer-friendly registration URL with instant frictionless checkout." },
          { n: "04", title: "Automated Pass Delivery", desc: "Attendees receive cryptographically signed QR passes via email and direct mobile web links." },
          { n: "05", title: "Sub-Second Gate Entry", desc: "Volunteers scan badges at conference doors in <0.3s, tracking live attendance across all tracks." },
        ],
        callout: {
          badge: "OPEN STANDARDS",
          title: "Built by software engineers for software engineering conferences.",
          description: "Forget clunky ticketing interfaces designed in 2008. URPASS brings modern Next.js performance, sub-second WebRTC scanning, and native Model Context Protocol (MCP) integrations to technical events.",
          bullets: [
            "Keep 100% of your conference ticket revenue with zero per-ticket cuts",
            "Zero equipment rentals — works on any modern iOS or Android phone",
            "Offline-resilient scanning in auditorium basements and convention halls",
            "Export audit-ready attendee and tax reports with a single click",
          ],
        },
        faqs: [
          { q: "Can we issue free tickets to speakers and sponsors?", a: "Yes. Organizers can create 100% discounted or custom Speaker and Sponsor badge tiers with custom approval workflows." },
          { q: "Can we print physical lanyard badges for our conference?", a: "Yes. Ticket Studio exports vertical lanyard badges (440x640 px) and printable passes (780x340 px) ready for professional on-site badge printers." },
          { q: "Do corporate attendees receive GST tax invoices?", a: "Yes. In India, URPASS automatically generates compliant B2B tax invoices with your organizer GSTIN and the buyer's company details for input tax credit." },
          { q: "How can our team use MCP with our developer conference?", a: "Connect Claude Desktop or Cursor to `https://urpass.space/api/mcp` or run `npx urpass-mcp` with your API key to query registration counts, approve speakers, and inspect check-ins via AI." },
        ],
        relatedLinks: [
          { title: "Conference Registration Software", href: "/conference-registration-software", category: "Use Case" },
          { title: "Model Context Protocol Hub", href: "/mcp-event-management", category: "Product" },
          { title: "Pass & Ticket Studio", href: "/design-your-ticket", category: "Product" },
          { title: "Developer Meetups Platform", href: "/developer-meetups", category: "Use Case" },
        ],
      }}
    />
  );
}
