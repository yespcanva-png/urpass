import type { Metadata } from "next";
import { Code2, Cpu, ShieldCheck, Zap, Database, BarChart3, Users, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Open Event Ticketing Alternative & MCP API Platform | URPASS",
  description:
    "An open, developer-friendly alternative to legacy ticketing platforms. Native Model Context Protocol (MCP) server, open JSON-RPC API, and full attendee data ownership.",
  keywords: [
    "open event ticketing alternative",
    "developer friendly ticketing",
    "eventbrite open alternative",
    "model context protocol ticketing",
    "mcp event server",
    "self hosted friendly event ticketing",
  ],
  alternates: { canonical: "https://urpass.space/open-source-event-ticketing-alternative" },
  openGraph: {
    title: "Open Event Ticketing Alternative & MCP API Platform | URPASS",
    description: "An open, developer-friendly alternative to legacy ticketing platforms with native MCP support.",
    url: "https://urpass.space/open-source-event-ticketing-alternative",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DEVELOPER-FIRST EVENT STACK",
        h1: "Open Event Ticketing Alternative & Model Context Protocol Platform",
        canonicalUrl: "https://urpass.space/open-source-event-ticketing-alternative",
        description:
          "Take back control of your event data. Enjoy zero ticket commissions, open JSON-RPC 2.0 API endpoints, and a native Model Context Protocol (MCP) server for autonomous AI agents.",
        ctaLabel: "Connect via MCP Free",
        directAnswer: {
          title: "Why Choose URPASS as an Open Alternative to Legacy Ticketing?",
          summary:
            "URPASS provides an open, developer-centric alternative to proprietary ticketing silos. By adopting Anthropic's open Model Context Protocol (MCP) standard, URPASS exposes 10 production tools for querying events, screening applicants, issuing cryptographic passes, and streaming gate telemetry via local stdio (`npx urpass-mcp`) and remote HTTPS JSON-RPC 2.0 (`/api/mcp`), paired with unencumbered CSV data ownership and 0% ticket commissions.",
          keyPoints: [
            "Native Model Context Protocol (MCP) server conforming to open v1.0.0 specification",
            "10 production-ready AI agent tools covering event listing, attendee approval, and gate check-in",
            "Full data portability: complete unencumbered CSV export of all attendee records and check-in logs",
            "Zero per-ticket platform commission fees with transparent flat software subscription pricing",
          ],
        },
        keyFactsTable: {
          title: "Developer Openness Comparison: URPASS vs Proprietary Silos",
          subtitle: "Technical architecture, API openness, and agentic AI integration capabilities.",
          headers: ["Open Capability", "URPASS Developer Platform", "Legacy Aggregators (Eventbrite / etc.)"],
          rows: [
            { col1: "Model Context Protocol (MCP)", col2: "Native stdio CLI & HTTPS JSON-RPC 2.0 endpoint", col3: "No native MCP support for AI assistants" },
            { col1: "Data Ownership & Portability", col2: "Complete unencumbered CSV and API export", col3: "Proprietary locked-down attendee databases" },
            { col1: "Ticketing Commission", col2: "0% platform commission on ticket volume", col3: "3.7% to 10% cut on every ticket sold" },
            { col1: "Gate Scanner Integration", col2: "Open WebRTC browser scanner via secure PIN URL", col3: "Proprietary app store downloads mandatory" },
            { col1: "Webhooks & Automation", col2: "Native event-driven webhooks for check-in and tickets", col3: "Limited or gated behind enterprise sales tiers" },
          ],
        },
        features: [
          { icon: Cpu, title: "Native Model Context Protocol", desc: "Connect Claude Desktop, Cursor IDE, or custom autonomous AI agents to manage events and query rosters via natural language." },
          { icon: Database, title: "100% Attendee Data Ownership", desc: "Your attendee database is yours. Export complete CSV rosters with contact details and timestamps with a single click." },
          { icon: Code2, title: "Open JSON-RPC 2.0 API", desc: "Integrate custom check-in kiosks, mobile apps, or backend CRM workflows directly with `/api/mcp` and REST endpoints." },
          { icon: Zap, title: "Sub-0.3s WebRTC Camera Check-In", desc: "Scan passes directly in mobile Safari and Chrome without requiring staff to install proprietary native app binaries." },
          { icon: ShieldCheck, title: "Cryptographic Single-Use Passes", desc: "UUID-based pass tokens prevent duplicate entries and unauthorized ticket duplication across entrance gates." },
          { icon: BarChart3, title: "Real-Time Telemetry Streaming", desc: "Access live arrival curves, check-in percentages, and attendance velocity programmatically or via web dashboard." },
        ],
        steps: [
          { n: "01", title: "Generate URPASS API Key", desc: "Create a secure API key in your developer settings dashboard." },
          { n: "02", title: "Configure MCP Client", desc: "Add URPASS to Claude Desktop config (`npx -y urpass-mcp`) or connect via HTTPS." },
          { n: "03", title: "Query & Manage Events", desc: "Use conversational AI to list events, inspect registration velocity, and filter attendees." },
          { n: "04", title: "Issue Cryptographic Passes", desc: "Automate attendee screening and digital pass issuance with `approve_attendee`." },
          { n: "05", title: "Stream Gate Check-Ins", desc: "Verify passes atomically at venue gates with sub-0.3s latency and live event logging." },
        ],
        callout: {
          badge: "DEVELOPER POWER",
          title: "Build the next generation of autonomous event experiences.",
          description: "Whether building an AI agent that manages registrations or an autonomous door check-in kiosk, URPASS provides the open protocols and developer primitives you need.",
          bullets: [
            "Native Model Context Protocol (MCP) server with 10 production tools",
            "Zero per-ticket percentage cuts keeping your platform costs predictable",
            "Permanent Free Tier for open-source meetups and developer hackathons",
            "Complete unencumbered ownership of your attendee relationships and data",
          ],
        },
        faqs: [
          { q: "How do I connect URPASS to Claude Desktop via MCP?", a: "Add `\"urpass\": { \"command\": \"npx\", \"args\": [\"-y\", \"urpass-mcp\"], \"env\": { \"URPASS_API_KEY\": \"YOUR_KEY\" } }` to your `claude_desktop_config.json` file." },
          { q: "Can I self-host the gate scanner?", a: "The URPASS scanner runs directly in any modern mobile browser without requiring app installations or local server hosting, backed by global Supabase edge cloud infrastructure." },
          { q: "What tools does the URPASS MCP server provide?", a: "The MCP server provides 10 tools: `list_events`, `get_event`, `get_event_stats`, `list_attendees`, `get_attendee`, `approve_attendee`, `reject_attendee`, `verify_pass`, `check_in_attendee`, and `issue_pass`." },
          { q: "Can I export all attendee data to CSV?", a: "Yes. Organizers can export full attendee databases, contact details, ticket tiers, and timestamped check-in logs with zero data lock-in." },
        ],
        relatedLinks: [
          { title: "Model Context Protocol Hub", href: "/mcp-event-management", category: "Product" },
          { title: "Claude Desktop Event Ops", href: "/claude-desktop-event-management", category: "Product" },
          { title: "Cursor MCP Ticketing", href: "/cursor-mcp-event-ticketing", category: "Product" },
          { title: "Developer Meetups Platform", href: "/developer-meetups", category: "Use Case" },
        ],
      }}
    />
  );
}
