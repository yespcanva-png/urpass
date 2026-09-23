import type { Metadata } from "next";
import { Server, Terminal, Zap, ShieldCheck, Cpu, Code2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Model Context Protocol (MCP) Server for Events & Ticketing | URPASS",
  description:
    "Deploy or connect the official URPASS Model Context Protocol (MCP) Server. Stdio and JSON-RPC 2.0 transport for Claude Desktop, Cursor IDE, and autonomous event agents.",
  keywords: [
    "MCP server for events",
    "Model Context Protocol event server",
    "event ticketing MCP server",
    "urpass-mcp npm",
    "MCP JSON-RPC event API",
    "stdio event server",
    "Claude MCP server events",
  ],
  alternates: { canonical: "https://urpass.space/mcp-server-for-events" },
  openGraph: {
    title: "Model Context Protocol (MCP) Server for Events & Ticketing | URPASS",
    description: "The open standard MCP server connecting LLMs to live event ticketing, attendee rosters, and sub-second QR gate check-ins.",
    url: "https://urpass.space/mcp-server-for-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "OPEN MCP SERVER STANDARD",
        h1: "Model Context Protocol (MCP) Server for Events & Ticketing",
        canonicalUrl: "https://urpass.space/mcp-server-for-events",
        description:
          "The official URPASS MCP Server exposes 10 high-performance operational tools via Anthropic's Model Context Protocol. Run locally with npx urpass-mcp over stdio, or connect your cloud agents to our remote JSON-RPC 2.0 HTTP endpoint.",
        ctaLabel: "Get MCP Server Config",
        features: [
          { icon: Server, title: "Dual Transport Architecture", desc: "Run via local stdio for Claude Desktop and Cursor, or over remote JSON-RPC 2.0 HTTPS for cloud agents and webhooks." },
          { icon: Terminal, title: "Instant NPX Run", desc: "No local builds or cloned repositories required. Run 'npx urpass-mcp' with your API key to immediately mount event tools." },
          { icon: Cpu, title: "10 Production Event Tools", desc: "Includes list_events, get_event_stats, list_attendees, approve_attendee, reject_attendee, verify_pass, and check_in_attendee." },
          { icon: ShieldCheck, title: "Encrypted Bearer Auth", desc: "All requests authenticate against scoped developer API keys with strict organizer isolation and database RLS." },
          { icon: Zap, title: "Sub-50ms Response Time", desc: "Optimized PostgreSQL indexes and direct Supabase server connections keep agent tool invocations lightning fast." },
          { icon: Code2, title: "TypeScript & JSON Schema", desc: "Full input validation with Zod and standard JSON Schema definitions ensuring zero hallucinated tool arguments." },
        ],
        steps: [
          { n: "01", title: "Obtain Organizer API Key", desc: "Navigate to your URPASS dashboard at /dashboard/developer and generate a production API key." },
          { n: "02", title: "Configure Client Manifest", desc: "Add the urpass-mcp command and URPASS_API_KEY environment variable to your AI agent's configuration." },
          { n: "03", title: "Initialize Handshake", desc: "Client calls initialize; server responds with capabilities and the complete 10-tool operational schema." },
          { n: "04", title: "Execute Tool Invocations", desc: "Agent issues tools/call requests in response to user prompts, automating pass issuance and gate verification." },
          { n: "05", title: "Stream Live Updates", desc: "Changes reflect immediately across organizer web views, attendee digital passes, and mobile scanner interfaces." },
        ],
        callout: {
          badge: "STANDARDIZED AGENT PROTOCOL",
          title: "Stop building custom bespoke event plugins. Use the open MCP standard.",
          description: "Rather than writing one-off integrations for every AI assistant, the Model Context Protocol gives you a single, universally compatible interface. Any MCP-compliant client can instantly manage passes, check attendees in, and inspect gate capacity.",
          bullets: [
            "Official Model Context Protocol v1.0 compliant specification",
            "Zero daemon maintenance — stdio processes automatically lifecycle with the client",
            "Full error reporting with JSON-RPC error codes and actionable recovery hints",
            "Continuous real-time synchronization with URPASS live database",
          ],
        },
        deepDiveSections: [
          {
            badge: "LOCAL VS REMOTE TRANSPORT",
            title: "Stdio vs Remote HTTP/SSE: Which transport should you use?",
            paragraphs: [
              "For local desktop workflows like Anthropic Claude Desktop and Cursor IDE, stdio transport is ideal. The client spawns 'npx urpass-mcp' as a child process and communicates through standard input/output streams with zero network configuration.",
              "For cloud microservices, Slack bots, and autonomous web agents, URPASS provides a remote JSON-RPC 2.0 endpoint at https://urpass.space/api/mcp. Cloud agents simply POST tool requests with an Authorization: Bearer <api_key> header.",
            ],
            takeaway: "Flexible deployment allows seamless desktop pair-programming or 24/7 cloud event automation.",
          },
          {
            badge: "SCHEMA INTEGRITY",
            title: "How does URPASS MCP prevent LLM hallucination in event ops?",
            paragraphs: [
              "Every tool exposed by URPASS MCP includes rigorous JSON Schema parameter definitions with explicit descriptions, required fields, and enum constraints.",
              "If an LLM provides an invalid pass token or malformed attendee ID, the MCP server rejects the call with an informative client error, allowing the model to self-correct before touching production databases.",
            ],
            takeaway: "Deterministic execution guarantees gate safety and operational precision at high-stakes events.",
          },
        ],
        faqs: [
          { q: "How do I install the URPASS MCP server?", a: "Run 'npx urpass-mcp' directly, or install globally via 'npm install -g urpass-mcp'. Set URPASS_API_KEY in your environment." },
          { q: "Can I self-host the MCP server?", a: "Yes. The server script is open and can be run with Node.js 18+ anywhere you host microservices or serverless functions." },
          { q: "What permissions does the MCP server have?", a: "The server acts strictly within the permissions of the organizer API key provided. It cannot access events belonging to other organizations." },
        ],
        relatedLinks: [
          { title: "MCP Event Management Overview", href: "/mcp-event-management", category: "Product" },
          { title: "Claude Desktop Setup Guide", href: "/claude-desktop-event-management", category: "Guide" },
          { title: "Cursor MCP Ticketing", href: "/cursor-mcp-event-ticketing", category: "Product" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
