import type { Metadata } from "next";
import { Code2, Terminal, Server, Key, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP Event API & Real-Time JSON-RPC 2.0 Integration | URPASS",
  description:
    "Developer reference for the URPASS Model Context Protocol (MCP) JSON-RPC 2.0 API. Connect cloud AI agents, LangChain, AutoGen, and custom LLM workflows via /api/mcp.",
  keywords: [
    "MCP event API",
    "Model Context Protocol JSON-RPC API",
    "URPASS MCP endpoint",
    "AI agent ticketing API",
    "/api/mcp documentation",
    "remote MCP server for events",
    "LangChain event MCP",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-api" },
  openGraph: {
    title: "MCP Event API & Real-Time JSON-RPC 2.0 Integration | URPASS",
    description: "The complete technical API specification for connecting autonomous AI workflows to the URPASS MCP JSON-RPC 2.0 server.",
    url: "https://urpass.space/mcp-event-api",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DEVELOPER SPECIFICATION",
        h1: "MCP Event API & Real-Time JSON-RPC 2.0 Integration",
        canonicalUrl: "https://urpass.space/mcp-event-api",
        description:
          "Connect any AI framework—LangChain, LlamaIndex, AutoGen, crewAI, or custom Python/TypeScript agents—to live event ticketing. The URPASS remote MCP endpoint exposes standard JSON-RPC 2.0 protocol methods over HTTPS at https://urpass.space/api/mcp.",
        ctaLabel: "View MCP API Reference",
        features: [
          { icon: Server, title: "Standard JSON-RPC 2.0", desc: "Strict adherence to JSON-RPC 2.0 specifications with typed request IDs, standard error objects, and structured params." },
          { icon: Terminal, title: "Dual Transport", desc: "Invoke over HTTPS POST at /api/mcp or spawn the CLI binary over local stdio with npx urpass-mcp." },
          { icon: Key, title: "Bearer Token Authentication", desc: "Authenticate with 'Authorization: Bearer <URPASS_API_KEY>' headers, granting secure scoped access to your events." },
          { icon: Code2, title: "10 Production MCP Tools", desc: "Full coverage for event queries, attendee management, pass issuance, cryptographic verification, and gate check-ins." },
          { icon: Zap, title: "Sub-50ms Execution", desc: "High-performance Edge runtime execution with direct PostgreSQL pooling ensures rapid LLM tool response cycles." },
          { icon: ShieldCheck, title: "Strict Input Sanitization", desc: "Zod-validated JSON Schema definitions prevent injection attacks and catch hallucinated parameters before DB mutations." },
        ],
        steps: [
          { n: "01", title: "Generate Developer API Key", desc: "Log in to URPASS and generate a production API key at /dashboard/developer." },
          { n: "02", title: "Initialize Protocol Handshake", desc: "Send a POST request to /api/mcp with method: 'initialize' to negotiate capabilities and protocol version." },
          { n: "03", title: "Discover Available Tools", desc: "Invoke method: 'tools/list' to retrieve the list of 10 supported tools and their JSON Schema parameter specifications." },
          { n: "04", title: "Execute Tool Invocation", desc: "Call method: 'tools/call' with { name: 'list_events', arguments: { status: 'active' } } to fetch live events." },
          { n: "05", title: "Integrate with Agent Loop", desc: "Bind the tool manifest into your agent's tool execution runtime (LangChain, AutoGen, or OpenAI-compatible client)." },
        ],
        callout: {
          badge: "UNIVERSAL PROTOCOL COMPATIBILITY",
          title: "One protocol to power every AI agent framework.",
          description: "Instead of maintaining custom Python or TypeScript wrapper libraries for every proprietary event system, the Model Context Protocol gives developers an industry-standard interface. With URPASS MCP, your agent can discover available tools, inspect required schemas, and execute operations dynamically.",
          bullets: [
            "Conforms to the Model Context Protocol 2024-11-05 specification",
            "Full support for ping, initialize, tools/list, and tools/call methods",
            "Comprehensive error codes: -32700 (Parse error), -32600 (Invalid Request), -32601 (Method not found)",
            "Direct webhook bridging for asynchronous event notifications",
          ],
        },
        deepDiveSections: [
          {
            badge: "REQUEST EXAMPLES",
            title: "Calling the remote /api/mcp endpoint via cURL",
            paragraphs: [
              "You can interact with the URPASS remote MCP server using any standard HTTP client. Here is an example tools/call request:\n\ncurl -X POST https://urpass.space/api/mcp \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -d '{\n    \"jsonrpc\": \"2.0\",\n    \"id\": 1,\n    \"method\": \"tools/call\",\n    \"params\": {\n      \"name\": \"get_event_stats\",\n      \"arguments\": { \"event_id\": \"evt_sample123\" }\n    }\n  }'",
              "The response returns structured text blocks containing JSON data that LLMs can parse and synthesize with zero ambiguity.",
            ],
            takeaway: "Integrate with cloud agents, AWS Lambdas, or serverless functions in minutes.",
          },
          {
            badge: "AGENT TOOL BINDINGS",
            title: "Connecting with Python LangChain and LlamaIndex",
            paragraphs: [
              "Connecting URPASS MCP to Python agent frameworks requires only a standard MCP adapter. The agent calls tools/list during startup, automatically populating its LangChain Tool or LlamaIndex FunctionCallingTool collection.",
              "When an end-user asks your Slack bot or Telegram assistant to check in an attendee or register a guest speaker, the agent runtime handles tool selection, parameter coercion, and execution seamlessly.",
            ],
            takeaway: "Build custom conversational event bots with minimal boilerplate code.",
          },
        ],
        faqs: [
          { q: "Is the remote /api/mcp endpoint rate-limited?", a: "Yes. Endpoints are protected by generous rate limits suitable for high-frequency agent tool calling loops." },
          { q: "What format does tools/call return?", a: "tools/call returns an object with a 'content' array containing type: 'text' blocks with JSON or formatted output." },
          { q: "Can I use this endpoint in production enterprise environments?", a: "Yes. The endpoint is hosted on high-availability infrastructure with SOC-2 compliant database guarantees." },
        ],
        relatedLinks: [
          { title: "MCP Server for Events", href: "/mcp-server-for-events", category: "Product" },
          { title: "AI Event Ticketing Bot", href: "/ai-event-ticketing-bot", category: "Use Case" },
          { title: "Developer API & REST Docs", href: "/docs", category: "Guide" },
          { title: "Claude Desktop Setup Guide", href: "/claude-desktop-event-management", category: "Guide" },
        ],
      }}
    />
  );
}
