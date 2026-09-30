import type { Metadata } from "next";
import { Cpu, ScanLine, ShieldCheck, Zap, Bot, BarChart3, Users, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Model Context Protocol (MCP) Event Check-In & AI Telemetry | URPASS",
  description:
    "AI-driven gate check-in and attendance verification via Model Context Protocol. Verify passes, inspect door velocity, and automate kiosks with Claude and Cursor.",
  keywords: [
    "mcp event check in",
    "model context protocol check in",
    "ai event check in",
    "autonomous check in kiosk",
    "claude desktop event check in",
    "cursor mcp event verification",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-check-in" },
  openGraph: {
    title: "Model Context Protocol (MCP) Event Check-In & AI Telemetry | URPASS",
    description: "AI-driven gate check-in and attendance verification via Model Context Protocol.",
    url: "https://urpass.space/mcp-event-check-in",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "AGENTIC GATE PROTOCOLS",
        h1: "Model Context Protocol (MCP) Event Check-In & AI Telemetry",
        canonicalUrl: "https://urpass.space/mcp-event-check-in",
        description:
          "Integrate autonomous gate kiosks, conversational attendee check-in agents, and real-time attendance telemetry with Claude Desktop, Cursor, and the URPASS MCP server.",
        ctaLabel: "Inspect MCP Check-In Tools",
        directAnswer: {
          title: "How Does Model Context Protocol (MCP) Check-In Work on URPASS?",
          summary:
            "The URPASS MCP Server exposes specialized check-in and gate telemetry tools including `verify_pass`, `check_in_attendee`, and `get_event_stats`. By communicating via local stdio (`npx urpass-mcp`) or remote HTTPS JSON-RPC 2.0 (`/api/mcp`), autonomous software agents and AI assistants can inspect ticket validity, execute atomic gate redemptions, and query real-time arrival counts using natural language.",
          keyPoints: [
            "`verify_pass`: Non-destructively validates pass token authenticity and ticket tier before redemption",
            "`check_in_attendee`: Atomically redeems pass tokens with gate ID and timestamp logging",
            "`get_event_stats`: Streams live check-in percentage, total checked-in, and velocity curves",
            "Universal support for Anthropic Claude Desktop, Cursor IDE, LangChain, and autonomous kiosks",
          ],
        },
        keyFactsTable: {
          title: "MCP Check-In Tool Specifications",
          subtitle: "Tool signatures and parameter schemas available to Large Language Models.",
          headers: ["MCP Tool", "Input Parameters", "Output Returned to Agent"],
          rows: [
            { col1: "`verify_pass`", col2: "`pass_token` (string)", col3: "Validity status, attendee name, email, ticket tier, existing check-in time" },
            { col1: "`check_in_attendee`", col2: "`pass_token`, `gate_id` (optional)", col3: "Admission result (`CHECKED_IN` or `ALREADY_CHECKED_IN`), arrival timestamp" },
            { col1: "`get_event_stats`", col2: "`event_id` (string)", col3: "Total registered, total checked in, check-in percentage, velocity" },
            { col1: "`list_attendees`", col2: "`event_id`, `status` (`checked_in`, `pending`)", col3: "Filtered attendee array with names, tiers, and check-in timestamps" },
            { col1: "`issue_pass`", col2: "`event_id`, `name`, `email`, `tier`", col3: "Created attendee record, signed QR token, and direct pass delivery URL" },
          ],
        },
        features: [
          { icon: Cpu, title: "10 Production MCP Tools", desc: "Interact with your event database conversationally. Query attendee lists, verify credentials, and redeem passes." },
          { icon: ScanLine, title: "Non-Destructive Pass Inspection", desc: "The `verify_pass` tool lets AI check ticket tier and access permissions without redeeming the pass prematurely." },
          { icon: Zap, title: "Atomic Pass Redemption", desc: "The `check_in_attendee` tool records gate location, device ID, and timestamp while preventing duplicate entry." },
          { icon: Bot, title: "Autonomous Kiosk Integration", desc: "Power autonomous entry kiosks and reception tablets by connecting AI agents to URPASS via Model Context Protocol." },
          { icon: ShieldCheck, title: "Anti-Duplicate Locking", desc: "Atomic PostgreSQL transaction locks ensure tickets cannot be checked in twice, even during simultaneous AI calls." },
          { icon: BarChart3, title: "Live Gate Telemetry", desc: "Ask your AI assistant 'What is the check-in percentage right now?' for instant live database numbers." },
        ],
        steps: [
          { n: "01", title: "Generate Organizer API Key", desc: "Create your secret API key in the developer settings section of URPASS." },
          { n: "02", title: "Add MCP Server Config", desc: "Configure your client with `npx -y urpass-mcp` or point to `https://urpass.space/api/mcp`." },
          { n: "03", title: "Inspect Event Attendance", desc: "Ask your AI assistant for live event stats, check-in percentages, and remaining capacity." },
          { n: "04", title: "Validate Guest Credentials", desc: "Call `verify_pass` to check attendee credentials and tier permissions conversationally." },
          { n: "05", title: "Admit Attendees", desc: "Call `check_in_attendee` to complete verification with instant timestamped logging." },
        ],
        callout: {
          badge: "DEVELOPER ECOSYSTEM",
          title: "Bring intelligent automation to venue entrance gates.",
          description: "Model Context Protocol connects AI assistants directly to physical event logistics. URPASS provides the tools you need to build next-generation event experiences.",
          bullets: [
            "Conforms to Anthropic's open Model Context Protocol (MCP) standard",
            "Zero per-ticket percentage cuts with predictable software pricing",
            "Permanent Free Tier available for developers and community projects",
            "Secure API keys ensure organizers retain complete control over permissions",
          ],
        },
        faqs: [
          { q: "What is the difference between `verify_pass` and `check_in_attendee`?", a: "`verify_pass` inspects the pass status, tier, and attendee name without altering its state. `check_in_attendee` atomically marks the pass as used and records the gate location and timestamp." },
          { q: "Can I use MCP with Claude Desktop on Mac or Windows?", a: "Yes. Adding `npx -y urpass-mcp` to your `claude_desktop_config.json` allows Claude Desktop to run URPASS tools on both macOS and Windows." },
          { q: "Can I connect custom Python or TypeScript AI agents to URPASS?", a: "Yes. URPASS exposes a standard JSON-RPC 2.0 endpoint at `https://urpass.space/api/mcp` that can be queried by any MCP client library (LangChain, CrewAI, or official MCP SDKs)." },
          { q: "Is pass check-in through MCP as fast as the browser camera scanner?", a: "Yes. MCP tool calls query the same high-performance PostgreSQL endpoints, executing verification and locking in under 0.3 seconds." },
        ],
        relatedLinks: [
          { title: "Model Context Protocol Hub", href: "/mcp-event-management", category: "Product" },
          { title: "MCP Server Specification", href: "/mcp-server-for-events", category: "Product" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "Cursor MCP Ticketing", href: "/cursor-mcp-event-ticketing", category: "Product" },
        ],
      }}
    />
  );
}
