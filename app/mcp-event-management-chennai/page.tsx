import type { Metadata } from "next";
import { MapPin, Bot, Terminal, QrCode, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP Event Management Platform Chennai | AI Ticketing URPASS",
  description:
    "Model Context Protocol (MCP) event ticketing and QR check-in platform for Chennai tech summits, OMR developer meetups, and college symposiums. Manage passes in Claude and Cursor.",
  keywords: [
    "MCP event management Chennai",
    "Chennai college symposium ticketing",
    "Model Context Protocol Chennai",
    "OMR tech meetup check-in",
    "Chennai trade expo ticketing AI",
    "URPASS Chennai MCP",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-management-chennai" },
  openGraph: {
    title: "MCP Event Management Platform Chennai | AI Ticketing URPASS",
    description: "Operate Chennai college symposiums, tech conferences, and industrial expos with AI agents via Model Context Protocol.",
    url: "https://urpass.space/mcp-event-management-chennai",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Chennai, India",
    "geo.position": "13.0827;80.2707",
    ICBM: "13.0827, 80.2707",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CHENNAI TECH & COLLEGE CORRIDOR",
        h1: "MCP Event Management Platform for Chennai",
        canonicalUrl: "https://urpass.space/mcp-event-management-chennai",
        geo: {
          region: "TN",
          placename: "Chennai",
          position: "13.0827;80.2707",
          latitude: 13.0827,
          longitude: 80.2707,
        },
        description:
          "Chennai is the powerhouse of engineering talent, SaaS startups, and college symposiums. URPASS Model Context Protocol (MCP) allows organizers across OMR, Guindy, Chennai Trade Centre, and top engineering institutions to operate events, verify passes, and monitor gate queues conversationally using AI.",
        ctaLabel: "Launch Chennai MCP Event",
        features: [
          { icon: MapPin, title: "Engineered for Chennai Hubs", desc: "Trusted at Chennai Trade Centre Nandambakkam, IITM Research Park, OMR tech corridors, and leading engineering colleges." },
          { icon: Bot, title: "Autonomous Attendee Approvals", desc: "Let AI assistants review inter-college registrations, verify student IDs, and release digital passes automatically." },
          { icon: Terminal, title: "Cursor & Claude Desktop Ready", desc: "Run 'npx urpass-mcp' directly from developer machines, managing college hackathons and tech meetups in terminal." },
          { icon: QrCode, title: "Sub-0.3s Camera Check-in", desc: "Clear morning campus gate rushes of 2,000+ students in minutes using any smartphone browser." },
          { icon: Zap, title: "Instant UPI & Zero Platform Cuts", desc: "Razorpay UPI payments with zero per-ticket commission fees, preserving budgets for student committees and fest organizers." },
          { icon: ShieldCheck, title: "Duplicate Entry Prevention", desc: "Tamper-proof single-use QR codes prevent forwarded screenshots and ensure fair campus gate control." },
        ],
        steps: [
          { n: "01", title: "Create Chennai Event", desc: "Set up your symposium, conference, or workshop on URPASS with custom college fields and ticket tiers." },
          { n: "02", title: "Add MCP to Your Workflow", desc: "Configure urpass-mcp in your AI agent or Claude Desktop using your organizer developer key." },
          { n: "03", title: "Screen & Issue Badges", desc: "AI agents parse team registrations, approve participants, and email cryptographic digital passes." },
          { n: "04", title: "Gate Entry on Mobile", desc: "Student volunteers open /scan on their personal phones to scan arriving attendees with sub-0.3s speed." },
          { n: "05", title: "Live Roster & Analytics", desc: "Check turnout percentages and export CSV reports with a single conversational prompt." },
        ],
        callout: {
          badge: "COLLEGES & SAAS CAPITAL",
          title: "The modern standard for Chennai tech summits and college fests.",
          description: "Chennai hosts some of India's largest technical symposiums and SaaS founder gatherings. Traditional paper tickets get lost, and generic ticketing portals charge hefty convenience fees. URPASS MCP gives Chennai organizers modern AI capabilities and zero per-ticket commission.",
          bullets: [
            "Adopted across Anna University affiliated colleges, private universities, and OMR SaaS firms",
            "Zero per-ticket fees — save budget on every attendee registration",
            "Mobile-first pass delivery: works seamlessly on low-bandwidth campus 4G/5G",
            "Compatible with both local stdio and remote JSON-RPC 2.0 MCP servers",
          ],
        },
        deepDiveSections: [
          {
            badge: "COLLEGE SYMPOSIUM OPS",
            title: "Managing thousands of inter-college symposium attendees",
            paragraphs: [
              "When colleges host annual symposiums, hundreds of external students arrive at 8:30 AM demanding fast entry to make morning paper presentations and hackathons.",
              "URPASS browser scanner allows student coordinators to deploy 10 simultaneous scanning lanes in 60 seconds with no app installs. Volatile arrival crowds clear smoothly without friction.",
            ],
            takeaway: "Eliminate long gate queues at campus entrances with instant camera scanning.",
          },
          {
            badge: "TRADE EXPOS & SUMMITS",
            title: "Multi-track badges for Chennai Trade Centre conventions",
            paragraphs: [
              "Conventions at Chennai Trade Centre Nandambakkam require distinct badge tiers for delegates, exhibitors, speakers, and VIPs. URPASS MCP makes tier verification instant.",
              "Door staff verify permissions for specific conference halls or VIP networking areas with the verify_pass tool, keeping restricted sessions exclusive.",
            ],
            takeaway: "Enterprise-grade venue access control without expensive scanner rental hardware.",
          },
        ],
        faqs: [
          { q: "Can student committees use URPASS for free events?", a: "Yes! URPASS offers a 100% free tier for 2 events/month and 100 registrations with full QR scanning features." },
          { q: "Can we collect college ID numbers and department details?", a: "Yes. Custom form fields can be added to your registration page to collect any required institutional data." },
          { q: "How are tickets delivered to Chennai attendees?", a: "Attendees receive an instant email and WhatsApp-ready link opening their digital pass on any browser." },
        ],
        relatedLinks: [
          { title: "Chennai Event Software Guide", href: "/event-registration-software-chennai", category: "Location" },
          { title: "Technical Symposium Guide", href: "/technical-symposium", category: "Use Case" },
          { title: "College Events Management", href: "/college-events", category: "Use Case" },
          { title: "Developer API Reference", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
