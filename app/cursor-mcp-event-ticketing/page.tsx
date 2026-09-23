import type { Metadata } from "next";
import { Terminal, Code2, Cpu, Zap, Layers, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Cursor MCP Event Ticketing & Developer Operations | URPASS",
  description:
    "Manage event tickets, webhook integrations, and attendee databases directly within Cursor IDE. Official URPASS Model Context Protocol (MCP) configuration for .cursor/mcp.json.",
  keywords: [
    "Cursor MCP event ticketing",
    "Cursor IDE MCP server",
    ".cursor/mcp.json urpass",
    "developer event operations",
    "Cursor AI ticketing agent",
    "event management in Cursor IDE",
  ],
  alternates: { canonical: "https://urpass.space/cursor-mcp-event-ticketing" },
  openGraph: {
    title: "Cursor MCP Event Ticketing & Developer Operations | URPASS",
    description: "Build, test, and manage event passes, webhooks, and gate check-ins directly inside Cursor IDE with the URPASS MCP Server.",
    url: "https://urpass.space/cursor-mcp-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CURSOR IDE INTEGRATION",
        h1: "Cursor MCP Event Ticketing & Developer Operations",
        canonicalUrl: "https://urpass.space/cursor-mcp-event-ticketing",
        description:
          "For developers organizing hackathons, tech conferences, and developer summits: manage your event infrastructure directly inside Cursor IDE. Test webhooks, query live attendee data, and generate test passes without leaving your code editor.",
        ctaLabel: "Add URPASS to Cursor",
        features: [
          { icon: Terminal, title: "Native .cursor/mcp.json Support", desc: "Drop our stdio configuration directly into your project's .cursor/mcp.json or user-level Cursor settings." },
          { icon: Code2, title: "In-Editor Webhook Testing", desc: "Trigger test event registrations and verify your application's webhook listener endpoints without manual form fills." },
          { icon: Cpu, title: "Composer & Agent Mode", desc: "Command Cursor's agent to write custom attendee export scripts or query registration stats while writing code." },
          { icon: Zap, title: "Real-Time DB Reflection", desc: "Cursor queries live Supabase PostgreSQL event data in real time, keeping your development and live event in sync." },
          { icon: Layers, title: "Multi-Project Scoping", desc: "Scope MCP configurations per repository or globally across your entire development environment." },
          { icon: CheckCircle2, title: "Zero Context Switching", desc: "Stay in flow state while coordinating event registrations, speaker badges, and API webhooks." },
        ],
        steps: [
          { n: "01", title: "Create .cursor/mcp.json", desc: "Create a .cursor/mcp.json file in your project root or open Cursor Settings > Features > MCP." },
          { n: "02", title: "Define the Server Spec", desc: "Add 'urpass' with command 'npx', args: ['-y', 'urpass-mcp'], and your URPASS_API_KEY environment variable." },
          { n: "03", title: "Enable Tools in Cursor", desc: "Verify green status indicators in Cursor's MCP panel confirming 10 active URPASS event tools." },
          { n: "04", title: "Use in Chat or Composer", desc: "Open Cursor Chat (Cmd+L or Ctrl+L) and type: 'Fetch the latest 5 registered attendees for our hackathon.'" },
          { n: "05", title: "Automate Event Scripts", desc: "Have Cursor generate automation scripts, sync pass data to your CRM, or batch-issue VIP passes." },
        ],
        callout: {
          badge: "DEVELOPER-FIRST EVENT OPS",
          title: "The developer's secret weapon for running tech conferences & hackathons.",
          description: "When engineering teams organize hackathons and dev summits, managing event data usually means juggling unfamiliar third-party ticketing dashboards. With URPASS MCP inside Cursor, you query attendees, trigger passes, and verify API responses as easily as calling a function in your codebase.",
          bullets: [
            "Seamless integration with Cursor Composer and Chat agents",
            "Generate sample QR pass tokens directly in your test suites",
            "Verify HMAC-SHA256 webhook signatures using real event payloads",
            "Zero extra dependencies installed in your local node_modules",
          ],
        },
        deepDiveSections: [
          {
            badge: "CONFIGURATION SPECIFICATION",
            title: "Project-level .cursor/mcp.json setup example",
            paragraphs: [
              "You can check in your MCP config or keep it in your local developer workspace. Add the following to .cursor/mcp.json:\n{\n  \"mcpServers\": {\n    \"urpass\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"urpass-mcp\"],\n      \"env\": {\n        \"URPASS_API_KEY\": \"urpass_live_your_key_here\"\n      }\n    }\n  }\n}",
              "Once saved, Cursor connects to the process in milliseconds, allowing Cursor Chat and Composer to call all 10 tools seamlessly during your coding session.",
            ],
            takeaway: "One JSON file gives your entire development workspace direct control over your event backend.",
          },
          {
            badge: "WORKFLOW AUTOMATION",
            title: "Testing webhooks and building custom event integrations in Cursor",
            paragraphs: [
              "When building an internal Slack bot or CRM sync for your event, testing registration webhooks manually is tedious. In Cursor, you can ask the agent: 'Issue a test VIP pass to test@example.com and check if our webhook receiver logged the event correctly.'",
              "Cursor executes the issue_pass tool, receives the real-time response, and helps you inspect and debug your webhook handler code in the same window.",
            ],
            takeaway: "Cuts event integration development and testing time by more than 70%.",
          },
        ],
        faqs: [
          { q: "Does this require Cursor Pro?", a: "Cursor's MCP feature works across Cursor tiers with access to AI chat and agent capabilities." },
          { q: "Is my API key safe in .cursor/mcp.json?", a: "We recommend adding .cursor/mcp.json to your .gitignore if it contains raw API keys, or using environment variable references." },
          { q: "Can I use this alongside Claude Desktop?", a: "Yes. Both clients use the identical URPASS MCP server specification and can run concurrently without conflicts." },
        ],
        relatedLinks: [
          { title: "MCP Server for Events", href: "/mcp-server-for-events", category: "Product" },
          { title: "Claude Desktop Setup", href: "/claude-desktop-event-management", category: "Guide" },
          { title: "MCP Event API Documentation", href: "/mcp-event-api", category: "Guide" },
          { title: "Developer Docs & Webhooks", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
