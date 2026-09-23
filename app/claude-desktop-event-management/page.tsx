import type { Metadata } from "next";
import { Bot, Terminal, Code, Cpu, Sparkles, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Claude Desktop Event Management with MCP | URPASS",
  description:
    "Control your event passes, check-in gates, and attendee approvals directly inside Anthropic Claude Desktop. Official URPASS Model Context Protocol (MCP) configuration guide and tools.",
  keywords: [
    "Claude Desktop event management",
    "Claude MCP event ticketing",
    "Anthropic Claude MCP server",
    "claude_desktop_config.json urpass",
    "AI event assistant Claude",
    "manage events with Claude Desktop",
  ],
  alternates: { canonical: "https://urpass.space/claude-desktop-event-management" },
  openGraph: {
    title: "Claude Desktop Event Management with MCP | URPASS",
    description: "Manage event tickets, attendees, and gate check-ins through natural language prompts directly inside Anthropic Claude Desktop.",
    url: "https://urpass.space/claude-desktop-event-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ANTHROPIC CLAUDE DESKTOP INTEGRATION",
        h1: "Claude Desktop Event Management with MCP",
        canonicalUrl: "https://urpass.space/claude-desktop-event-management",
        description:
          "Connect Anthropic Claude Desktop directly to your URPASS event operations. Query attendance velocity, approve hackathon registrations, issue VIP passes, and analyze gate throughput—all through natural conversation in Claude.",
        ctaLabel: "Configure Claude Desktop",
        features: [
          { icon: Bot, title: "Natural Language Event Ops", desc: "Ask Claude: 'What is our check-in percentage for today's summit?' or 'Send passes to all accepted speakers.'" },
          { icon: Terminal, title: "1-Minute Setup", desc: "Add a single JSON block to your claude_desktop_config.json file and restart Claude to immediately unlock 10 event tools." },
          { icon: Cpu, title: "Deep Analytical Reasoning", desc: "Leverage Claude 3.5 Sonnet's reasoning to cross-analyze attendee demographics, registration velocity, and peak entry hours." },
          { icon: Code, title: "Full Stdio Protocol", desc: "Executes securely via local stdio process (npx urpass-mcp) with no exposed external ports on your workstation." },
          { icon: Sparkles, title: "Batch Actions Made Simple", desc: "Instruct Claude to approve batches of candidates or export attendee CSV rosters without touching your browser." },
          { icon: CheckCircle2, title: "Live Sync with Web Dashboard", desc: "Any pass issued or attendee approved by Claude appears instantly on your URPASS web and mobile scanner views." },
        ],
        steps: [
          { n: "01", title: "Open Claude Settings", desc: "In Claude Desktop, open Settings > Developer and click 'Edit Config' to open claude_desktop_config.json." },
          { n: "02", title: "Add URPASS MCP Server", desc: "Paste the urpass configuration block specifying command: 'npx' with args: ['-y', 'urpass-mcp']." },
          { n: "03", title: "Set Your API Key", desc: "Add your URPASS_API_KEY from your URPASS dashboard under Developer Settings to the env block." },
          { n: "04", title: "Restart Claude Desktop", desc: "Quit and relaunch Claude Desktop; the hammer icon will display the 10 active URPASS event management tools." },
          { n: "05", title: "Start Commanding Events", desc: "Prompt Claude: 'List my upcoming events and show registration progress for each ticket tier.'" },
        ],
        callout: {
          badge: "DESKTOP PRODUCTIVITY",
          title: "Run entire conferences from your Claude Desktop chat window.",
          description: "Organizers toggle between dozens of browser tabs, CSV spreadsheets, and email clients during event week. By connecting Claude Desktop to URPASS through MCP, you unify event analytics, attendee customer support, and gate operations into a single conversational window.",
          bullets: [
            "Official Model Context Protocol implementation supported by Anthropic",
            "Automatic tool selection: Claude chooses the right tool based on your conversational prompt",
            "Zero context loss: Claude remembers past queries and attendee discussions throughout the chat",
            "Compatible with macOS and Windows versions of Claude Desktop",
          ],
        },
        deepDiveSections: [
          {
            badge: "CONFIGURATION SNIPPET",
            title: "Exact claude_desktop_config.json setup snippet",
            paragraphs: [
              "Configuring Claude Desktop is as simple as adding an entry to your mcpServers object. On macOS, this file is located at ~/Library/Application Support/Claude/claude_desktop_config.json, and on Windows at %APPDATA%\\Claude\\claude_desktop_config.json.",
              "Example snippet:\n{\n  \"mcpServers\": {\n    \"urpass\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"urpass-mcp\"],\n      \"env\": {\n        \"URPASS_API_KEY\": \"urpass_live_your_actual_key_here\"\n      }\n    }\n  }\n}",
            ],
            takeaway: "Paste, add your API key, and restart Claude to start managing live events.",
          },
          {
            badge: "PROMPT EXAMPLES",
            title: "High-leverage prompts you can run in Claude Desktop",
            paragraphs: [
              "Claude Desktop handles both simple lookups and complex multi-step operations. You can ask: 'Find attendee John Doe and check him in at North Gate', or 'Analyze which ticket tier had the fastest check-in rate today.'",
              "Claude automatically queries the right tools—list_events, list_attendees, get_event_stats—synthesizes the raw JSON response, and formats a clean markdown report with actionable takeaways.",
            ],
            takeaway: "Turn raw database records into executive-level event summaries in seconds.",
          },
        ],
        faqs: [
          { q: "Where do I get my URPASS API Key?", a: "Log into URPASS, go to Developer Settings at /dashboard/developer, and generate a new production API key." },
          { q: "Does Claude Desktop need Node.js installed?", a: "Yes. Running npx urpass-mcp requires Node.js 18 or newer installed on your machine." },
          { q: "Can Claude modify events without my permission?", a: "Claude only executes tools that you explicitly ask it to run, and sensitive changes can be prompted with confirmation safeguards." },
        ],
        relatedLinks: [
          { title: "MCP Server for Events", href: "/mcp-server-for-events", category: "Product" },
          { title: "Cursor MCP Event Ticketing", href: "/cursor-mcp-event-ticketing", category: "Product" },
          { title: "AI Event Analytics", href: "/ai-event-analytics", category: "Use Case" },
          { title: "Developer Documentation", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
