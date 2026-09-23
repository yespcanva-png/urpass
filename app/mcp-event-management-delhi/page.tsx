import type { Metadata } from "next";
import { MapPin, Bot, Terminal, QrCode, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP Event Management Platform Delhi NCR | AI Ticketing URPASS",
  description:
    "Model Context Protocol (MCP) event ticketing and QR check-in platform for Delhi NCR summits, Bharat Mandapam expos, Gurgaon tech conferences, and Noida hackathons.",
  keywords: [
    "MCP event management Delhi",
    "Delhi NCR conference AI ticketing",
    "Model Context Protocol Delhi",
    "Bharat Mandapam expo check-in",
    "Gurgaon tech summit ticketing",
    "URPASS Delhi NCR MCP",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-management-delhi" },
  openGraph: {
    title: "MCP Event Management Platform Delhi NCR | AI Ticketing URPASS",
    description: "Manage Delhi NCR trade expos, government summits, and tech conferences with AI agents via Model Context Protocol.",
    url: "https://urpass.space/mcp-event-management-delhi",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-DL",
    "geo.placename": "Delhi NCR, India",
    "geo.position": "28.6139;77.2090",
    ICBM: "28.6139, 77.2090",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DELHI NCR & NATIONAL CAPITAL REGION",
        h1: "MCP Event Management Platform for Delhi NCR",
        canonicalUrl: "https://urpass.space/mcp-event-management-delhi",
        geo: {
          region: "DL",
          placename: "Delhi NCR",
          position: "28.6139;77.2090",
          latitude: 28.6139,
          longitude: 77.2090,
        },
        description:
          "Delhi NCR is the national center for massive exhibitions, international government summits, and thriving tech startup corridors across Gurgaon and Noida. URPASS brings Model Context Protocol (MCP) to Delhi organizers—delivering enterprise-grade gate security, sub-0.3s QR check-in, and autonomous AI attendee operations.",
        ctaLabel: "Launch Delhi NCR MCP Event",
        features: [
          { icon: MapPin, title: "Engineered for Mega Venues", desc: "Designed for Bharat Mandapam (Pragati Maidan), Yashobhoomi (IICC Dwarka), Cyber Hub Gurgaon, and India Expo Mart Noida." },
          { icon: Bot, title: "Autonomous AI Operations", desc: "Command Claude Desktop or Cursor to screen VIP delegations, approve trade registrations, and issue dynamic QR badges." },
          { icon: Terminal, title: "Full Stdio & Remote JSON-RPC", desc: "Run 'npx urpass-mcp' over local stdio or integrate your cloud agent with our HTTPS JSON-RPC 2.0 endpoint." },
          { icon: QrCode, title: "Sub-0.3s Gate Verification", desc: "Maintain rapid entrance flow at high-security venues without bulky hardware or slow badge printing stations." },
          { icon: Zap, title: "Zero Ticket Commission", desc: "Collect attendee ticket fees via UPI (GPay, PhonePe, Paytm) and net banking with zero per-ticket commission fees." },
          { icon: ShieldCheck, title: "Government & Enterprise Security", desc: "256-bit cryptographic token validation prevents counterfeit badges and strictly logs all gate access timestamps." },
        ],
        steps: [
          { n: "01", title: "Set Up Delhi NCR Event", desc: "Define your summit, trade exhibition, or tech fest on URPASS with custom branding and registration fields." },
          { n: "02", title: "Add MCP Configuration", desc: "Equip your AI assistant or development environment with the URPASS MCP server using your developer API key." },
          { n: "03", title: "Automate Delegate Badging", desc: "Let AI agents auto-verify corporate credentials, approve government delegations, and dispatch digital passes." },
          { n: "04", title: "Scan at Secure Gates", desc: "Security and entrance personnel verify digital QR passes in under 0.3 seconds using any smartphone browser." },
          { n: "05", title: "Real-Time Telemetry & Reports", desc: "Query live hall occupancy and generate official security debriefs with natural language prompts." },
        ],
        callout: {
          badge: "MEGA VENUES & NATIONAL SUMMITS",
          title: "The entry infrastructure built for India's largest convention spaces.",
          description: "Mega venues like Bharat Mandapam and Yashobhoomi host tens of thousands of visitors across multiple halls and security perimeters. URPASS MCP synchronizes gate entries across dozens of distributed scanning lanes in real time, preventing duplicate passes and maintaining strict venue capacity limits.",
          bullets: [
            "Handles up to 10,000+ attendees across multi-hall convention venues",
            "Zero per-ticket fees — save substantial overhead on high-ticket enterprise registrations",
            "Supports offline verification caches for high-density environments",
            "Standardized Model Context Protocol compatibility for Claude, Cursor, and custom bots",
          ],
        },
        deepDiveSections: [
          {
            badge: "HIGH-SECURITY GATES",
            title: "Operating multi-perimeter security checkpoints at Delhi summits",
            paragraphs: [
              "International conferences in Delhi NCR require multi-layered verification: outer perimeter security, main registration hall, and restricted VIP/ministerial lounges.",
              "With URPASS MCP tools, security coordinators can define distinct gates and verify attendee credentials with verify_pass before permitting entry, keeping high-profile areas strictly controlled.",
            ],
            takeaway: "Enterprise-grade venue security with zero hardware footprint.",
          },
          {
            badge: "GURGAON & NOIDA TECH CORRIDORS",
            title: "Streamlining developer meetups and startup summits in Cyber City",
            paragraphs: [
              "Startup hubs in Cyber City Gurgaon and Sector 62 Noida host rapid-fire tech meetups and founder pitch days. Organizers often struggle with high RSVP drop-off rates.",
              "URPASS AI ticketing bots can send automated WhatsApp pass reminders on the morning of the event, dramatically increasing show-up rates and providing instant digital pass retrieval.",
            ],
            takeaway: "Boost event turnout and delight tech professionals across NCR.",
          },
        ],
        faqs: [
          { q: "Can URPASS integrate with on-site thermal badge printers?", a: "Yes. The QR pass tokens can trigger automated badge printers at kiosk terminals upon check-in." },
          { q: "Can we restrict registration to official corporate domains?", a: "Yes. Domain filtering can restrict registrations to authorized enterprise or institutional email addresses." },
          { q: "Does URPASS charge per-ticket fees for exhibition tickets?", a: "No! URPASS charges zero per-ticket commission fees, keeping your exhibition margins intact." },
        ],
        relatedLinks: [
          { title: "Delhi NCR Event Software Guide", href: "/event-registration-software-delhi", category: "Location" },
          { title: "AI Conference Management", href: "/ai-conference-management", category: "Use Case" },
          { title: "Autonomous Event Check-In", href: "/autonomous-event-check-in", category: "Product" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
