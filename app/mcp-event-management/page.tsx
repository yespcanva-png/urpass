import type { Metadata } from "next";
import { Bot, Zap, ShieldCheck, QrCode, Terminal, TrendingUp } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Model Context Protocol (MCP) Event Management Platform | URPASS",
  description:
    "Control your event passes, registrations, and gate check-in through AI assistants. Official URPASS Model Context Protocol (MCP) integration for Claude Desktop, Cursor, and autonomous agents.",
  keywords: [
    "MCP event management",
    "Model Context Protocol event management",
    "Claude Desktop event management",
    "Cursor event registration MCP",
    "AI agent event check in",
    "AI ticketing MCP server",
    "URPASS MCP",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-management" },
  openGraph: {
    title: "Model Context Protocol (MCP) Event Management Platform | URPASS",
    description: "Control your event passes, registrations, and check-in using AI assistants and autonomous agents via MCP.",
    url: "https://urpass.space/mcp-event-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MODEL CONTEXT PROTOCOL (MCP)",
        h1: "Model Context Protocol (MCP) Event Management Platform",
        canonicalUrl: "https://urpass.space/mcp-event-management",
        description:
          "Model Context Protocol (MCP) transforms how organizers operate events by allowing LLMs and autonomous agents—like Claude Desktop, Cursor, and custom AI bots—to query live attendance, issue digital passes, approve registrations, and verify check-ins in real time.",
        ctaLabel: "Connect MCP to URPASS",
        features: [
          { icon: Bot, title: "Conversational Event Control", desc: "Ask your AI assistant to list events, show attendance velocity, or approve attendees in natural language." },
          { icon: Terminal, title: "Native Claude & Cursor Support", desc: "Drop our stdio server config into claude_desktop_config.json or .cursor/mcp.json and manage events without leaving your editor." },
          { icon: Zap, title: "Sub-Second Live Data Sync", desc: "MCP tool calls execute queries directly against live PostgreSQL with zero stale caching, giving you real-time check-in counts." },
          { icon: QrCode, title: "AI Pass Issuance", desc: "Command AI agents to issue VIP tickets, register guest speakers, and email digital passes with cryptographic QR codes." },
          { icon: ShieldCheck, title: "Scoped Bearer Token Security", desc: "All MCP operations are strictly sandboxed to your organizer account using encrypted URPASS API keys." },
          { icon: TrendingUp, title: "Natural Language Analytics", desc: "Query check-in velocity, compare morning vs afternoon gate attendance, and extract revenue metrics conversationally." },
        ],
        steps: [
          { n: "01", title: "Generate API Key", desc: "Create an active API key in your URPASS dashboard under Developer Settings." },
          { n: "02", title: "Add MCP Configuration", desc: "Paste the npx urpass-mcp command into your Claude Desktop, Cursor, or Antigravity config file." },
          { n: "03", title: "Launch AI Client", desc: "Start Claude Desktop or Cursor; URPASS tools automatically populate in the assistant's capability manifest." },
          { n: "04", title: "Ask Questions & Run Tasks", desc: "Prompt your AI: 'How many attendees checked in at Gate 1?' or 'Approve all pending hackathon teams.'" },
          { n: "05", title: "Live Real-Time Sync", desc: "Watch attendee statuses update live on your browser dashboard via WebSocket channels with zero page refreshes." },
        ],
        callout: {
          badge: "THE FUTURE OF EVENT OPS",
          title: "Stop clicking through complex dashboards. Let AI run your event logistics.",
          description: "During busy event mornings, organizers are overwhelmed by registration approvals, pass re-issues, and gate throughput monitoring. With URPASS MCP support, you simply chat with Claude or Cursor on your laptop or phone, and autonomous agents handle the operational heavy lifting.",
          bullets: [
            "Official Model Context Protocol implementation by Anthropic standard",
            "10 high-performance tools for events, tickets, attendees, and gate check-in",
            "Works with stdio local transport and remote JSON-RPC 2.0 HTTP/SSE endpoints",
            "Real-time two-way synchronization with URPASS web and mobile dashboards",
          ],
        },
        deepDiveSections: [
          {
            badge: "MCP PROTOCOL ARCHITECTURE",
            title: "How does URPASS MCP connect AI agents to live event gates?",
            paragraphs: [
              "The Model Context Protocol (MCP) establishes an open, standardized bridge between Large Language Models and external databases. The URPASS MCP server exposes typed tool schemas for event listing, pass lookup, attendee verification, and real-time analytics.",
              "When an agent decides to check an attendee in or query attendance rate, it emits a structured JSON-RPC 2.0 tool invocation. URPASS authenticates the request, executes the database operation, fires webhooks, and returns the response in milliseconds.",
            ],
            takeaway: "Organizers can operate their entire event logistics pipeline using conversational prompts inside their daily AI desktop clients.",
          },
          {
            badge: "GATE SECURITY",
            title: "Is it safe to let AI agents approve registrations and verify passes?",
            paragraphs: [
              "Security is paramount at event entrances. URPASS enforces role-based access control and strict capacity validations on every MCP tool execution. An AI agent cannot approve attendees past an event's maximum capacity, nor can it check in an invalid or previously redeemed pass token.",
              "All mutations are logged in audit tables, and API keys can be revoked or permission-scoped with a single click in your developer settings.",
            ],
            takeaway: "Automate event operations without compromising gate security or attendee data privacy.",
          },
        ],
        faqs: [
          { q: "What AI clients support the URPASS MCP server?", a: "Claude Desktop, Cursor, Antigravity, Zed, and any custom agent built with LangChain, LlamaIndex, or the official Anthropic MCP SDK." },
          { q: "Do I need a paid plan to use MCP event management?", a: "MCP support is included on the URPASS Pro and Business plans, and can be tested during the 30-day free trial." },
          { q: "Can I run the MCP server on a remote server?", a: "Yes. In addition to local stdio (npx urpass-mcp), URPASS hosts a remote JSON-RPC 2.0 endpoint at https://urpass.space/api/mcp." },
        ],
        relatedLinks: [
          { title: "URPASS MCP Server", href: "/mcp-server-for-events", category: "Product" },
          { title: "Claude Desktop Event Management", href: "/claude-desktop-event-management", category: "Product" },
          { title: "Cursor MCP Event Ticketing", href: "/cursor-mcp-event-ticketing", category: "Product" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
