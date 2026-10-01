#!/usr/bin/env node

/**
 * URPASS Model Context Protocol (MCP) Server CLI
 *
 * Connects Claude Desktop, Cursor, Google Antigravity, Windsurf, Zed, and VS Code
 * directly to your URPASS event management account.
 *
 * Usage:
 *   npx urpass-mcp
 *   npx urpass-mcp --test
 *   npx urpass-mcp --tools
 *   npx urpass-mcp --config claude|cursor|antigravity|windsurf|zed|cline
 *   URPASS_API_KEY=urp_live_... npx urpass-mcp
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ── Key & URL Resolution ───────────────────────────────────────────────────
function findApiKey() {
  if (process.env.URPASS_API_KEY) return process.env.URPASS_API_KEY.trim();
  if (process.env.URP_API_KEY) return process.env.URP_API_KEY.trim();
  if (process.env.URPASS_KEY) return process.env.URPASS_KEY.trim();

  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith("--api-key=")) return arg.split("=")[1].trim();
    if (arg.startsWith("--key=")) return arg.split("=")[1].trim();
    if ((arg === "--api-key" || arg === "-k" || arg === "--key") && process.argv[i + 1]) {
      return process.argv[i + 1].trim();
    }
  }

  const candidateEnvFiles = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
    path.join(process.cwd(), ".urpassrc"),
  ];
  for (const envPath of candidateEnvFiles) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, "utf8");
        const match = content.match(/^(?:URPASS_API_KEY|URP_API_KEY|URPASS_KEY)\s*=\s*["']?([^"'\r\n]+)["']?/m);
        if (match && match[1]) return match[1].trim();
      } catch {}
    }
  }

  const home = os.homedir();
  const candidateHomeFiles = [
    path.join(home, ".urpassrc"),
    path.join(home, ".urpass", "config.json"),
  ];
  for (const homeFile of candidateHomeFiles) {
    if (fs.existsSync(homeFile)) {
      try {
        const content = fs.readFileSync(homeFile, "utf8");
        if (homeFile.endsWith(".json")) {
          const parsed = JSON.parse(content);
          if (parsed.apiKey || parsed.URPASS_API_KEY) return (parsed.apiKey || parsed.URPASS_API_KEY).trim();
        } else {
          const match = content.match(/^(?:URPASS_API_KEY|URP_API_KEY|apiKey)\s*=\s*["']?([^"'\r\n]+)["']?/m);
          if (match && match[1]) return match[1].trim();
        }
      } catch {}
    }
  }

  return null;
}

const customUrlArg = process.argv.find((a) => a.startsWith("--api-url="))?.split("=")[1];
const apiUrl = (
  customUrlArg ||
  process.env.URPASS_API_URL ||
  "https://urpass.space"
).replace(/\/+$/, "");

const apiKey = findApiKey();

// ── CLI Command Handlers ───────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
URPASS Model Context Protocol (MCP) Server CLI
Version: 1.1.0 · Official AI Agent Integration for URPASS

Usage:
  npx urpass-mcp [options]

Commands & Options:
  --help, -h             Show this help menu
  --test, --ping         Test connection to URPASS API using current key
  --tools, --list-tools  List all 17 available MCP tools
  --config <client>      Print ready-to-paste config (claude, cursor, antigravity, windsurf, zed, cline)
  --api-key=<key>        Specify API key directly (or set URPASS_API_KEY)
  --api-url=<url>        Custom API endpoint (default: https://urpass.space)

AI Assistant Quick Setup:
  • Claude Desktop:
      Add to claude_desktop_config.json under "mcpServers"
      Run: npx urpass-mcp --config claude

  • Cursor:
      Add to .cursor/mcp.json
      Run: npx urpass-mcp --config cursor

  • Google Antigravity:
      Run: npx urpass-mcp --config antigravity

  • Windsurf:
      Add to ~/.codeium/windsurf/mcp_config.json
      Run: npx urpass-mcp --config windsurf

  • Zed:
      Add to settings.json
      Run: npx urpass-mcp --config zed

Generate your API key at: https://urpass.space/dashboard/api-keys
`);
  process.exit(0);
}

if (args.includes("--tools") || args.includes("--list-tools")) {
  console.log(`
URPASS MCP Tools (17 tools available):

Event & Registration Management:
  1.  urpass_list_events          List organizer events, dates, venues, attendee capacities
  2.  urpass_get_event            Detailed ticket types, live check-ins, attendee metrics
  3.  urpass_create_event         Create event with digital passes and QR check-in
  4.  urpass_list_attendees       Filter attendees by status, search by name/email
  5.  urpass_approve_attendee     Approve registration and dispatch digital QR pass
  6.  urpass_reject_attendee      Reject an attendee application
  7.  urpass_lookup_pass          Lookup pass validity and status by QR token or email
  8.  urpass_verify_checkin       Gate entry check-in with duplicate scan prevention
  9.  urpass_get_event_analytics  Live registration totals, check-in velocity, ticket revenue
  10. urpass_issue_pass           Directly issue VIP or guest ticket without form filling

Conference & Agenda Management:
  11. urpass_list_sessions        List agenda sessions filterable by date, room, and track
  12. urpass_create_session       Create conference session with room collision check
  13. urpass_list_rooms           List halls, rooms, floors, and capacities
  14. urpass_list_speakers        List speakers, bios, organisations, and social links
  15. urpass_assign_speaker       Assign speaker to session with double-booking check
  16. urpass_verify_session_checkin Check in attendee to specific conference session
  17. urpass_get_conference_analytics Live room utilisation, occupancy %, peak arrivals
`);
  process.exit(0);
}

const configArgIdx = args.findIndex((a) => a === "--config" || a.startsWith("--config="));
if (configArgIdx !== -1) {
  const target = args[configArgIdx].includes("=")
    ? args[configArgIdx].split("=")[1].toLowerCase()
    : (args[configArgIdx + 1] || "claude").toLowerCase();

  const currentKey = apiKey || "urp_live_YOUR_API_KEY_HERE";

  switch (target) {
    case "claude":
      console.log(
        JSON.stringify(
          {
            mcpServers: {
              urpass: {
                command: "npx",
                args: ["-y", "urpass-mcp"],
                env: {
                  URPASS_API_KEY: currentKey,
                  URPASS_API_URL: apiUrl,
                },
              },
            },
          },
          null,
          2
        )
      );
      break;

    case "cursor":
      console.log(
        JSON.stringify(
          {
            mcpServers: {
              urpass: {
                command: `npx -y urpass-mcp --api-key=${currentKey}`,
                env: {
                  URPASS_API_KEY: currentKey,
                },
              },
            },
          },
          null,
          2
        )
      );
      break;

    case "antigravity":
    case "agy":
      console.log(
        JSON.stringify(
          {
            mcpServers: {
              urpass: {
                command: "npx",
                args: ["-y", "urpass-mcp"],
                env: {
                  URPASS_API_KEY: currentKey,
                  URPASS_API_URL: apiUrl,
                },
              },
            },
          },
          null,
          2
        )
      );
      console.log("\nOr run with Antigravity CLI:");
      console.log(`agy mcp add urpass npx -y urpass-mcp --env URPASS_API_KEY=${currentKey}`);
      break;

    case "windsurf":
      console.log(
        JSON.stringify(
          {
            mcpServers: {
              urpass: {
                command: "npx",
                args: ["-y", "urpass-mcp"],
                env: {
                  URPASS_API_KEY: currentKey,
                },
              },
            },
          },
          null,
          2
        )
      );
      break;

    case "zed":
      console.log(
        JSON.stringify(
          {
            experimental: {
              model_context_protocol: {
                servers: {
                  urpass: {
                    command: "npx",
                    args: ["-y", "urpass-mcp"],
                    env: {
                      URPASS_API_KEY: currentKey,
                    },
                  },
                },
              },
            },
          },
          null,
          2
        )
      );
      break;

    case "cline":
    case "roocode":
    case "vscode":
      console.log(
        JSON.stringify(
          {
            mcpServers: {
              urpass: {
                command: "npx",
                args: ["-y", "urpass-mcp"],
                env: {
                  URPASS_API_KEY: currentKey,
                },
                disabled: false,
                autoApprove: [],
              },
            },
          },
          null,
          2
        )
      );
      break;

    default:
      console.error(`Unknown client: "${target}". Available: claude, cursor, antigravity, windsurf, zed, cline`);
      process.exit(1);
  }
  process.exit(0);
}

if (args.includes("--test") || args.includes("--ping") || args.includes("--check")) {
  if (!apiKey) {
    console.error("✗ Error: No API key found.");
    console.error("  Pass --api-key=urp_live_... or set URPASS_API_KEY environment variable.");
    console.error("  Create a key at https://urpass.space/dashboard/api-keys\n");
    process.exit(1);
  }

  console.log(`[urpass-mcp] Testing connection to ${apiUrl}/api/mcp...`);
  try {
    const res = await fetch(`${apiUrl}/api/mcp`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/list",
      }),
    });

    if (res.status === 401) {
      console.error(`✗ Authentication failed (401 Unauthorized).`);
      console.error(`  The API key "${apiKey.slice(0, 10)}..." is invalid or revoked.`);
      console.error(`  Please verify your key at https://urpass.space/dashboard/api-keys\n`);
      process.exit(1);
    }

    if (!res.ok) {
      const err = await res.text();
      console.error(`✗ URPASS MCP Server responded with status ${res.status}: ${err}`);
      process.exit(1);
    }

    const data = await res.json();
    const toolCount = data.result?.tools?.length || 0;

    console.log(`✓ Connected successfully!`);
    console.log(`✓ Authenticated with URPASS server (${apiUrl})`);
    console.log(`✓ ${toolCount} MCP tools available for your AI assistant.`);
    console.log(`✓ Server ready for Claude, Cursor, Antigravity, Windsurf, Zed, and VS Code.\n`);
    process.exit(0);
  } catch (err) {
    console.error(`✗ Failed to connect to ${apiUrl}: ${err.message}`);
    process.exit(1);
  }
}

// ── Require Key for Stdio Mode ─────────────────────────────────────────────
if (!apiKey) {
  process.stderr.write(
    `\n[urpass-mcp] Error: URPASS_API_KEY is required to connect AI assistants.\n\n` +
      `  1. Generate an API key in your URPASS dashboard:\n` +
      `     https://urpass.space/dashboard/api-keys\n\n` +
      `  2. Set environment variable or configure your AI assistant:\n` +
      `     URPASS_API_KEY=urp_live_... npx urpass-mcp\n\n` +
      `  3. Or run with your key directly:\n` +
      `     npx urpass-mcp --api-key=urp_live_...\n\n` +
      `  For full setup guides and configs, run:\n` +
      `     npx urpass-mcp --help\n\n`
  );
  process.exit(1);
}

// ── MCP Server Definition ──────────────────────────────────────────────────
const server = new McpServer({
  name: "urpass-mcp",
  version: "1.1.0",
});

async function callUrpassMcpTool(name, toolArgs) {
  const endpoint = `${apiUrl}/api/mcp`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "urpass-mcp-cli/1.1.0",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name,
        arguments: toolArgs,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`URPASS API error (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(`URPASS MCP error: ${json.error.message || JSON.stringify(json.error)}`);
  }

  return json.result;
}

// 1. urpass_list_events
server.tool(
  "urpass_list_events",
  "List all events organized by the user with dates, venues, attendee counts, and capacities.",
  {
    status: z.enum(["draft", "active", "completed"]).optional().describe("Filter events by status"),
    limit: z.number().int().min(1).max(100).optional().describe("Number of events to return (default 20)"),
    offset: z.number().int().min(0).optional().describe("Pagination offset"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_list_events", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 2. urpass_get_event
server.tool(
  "urpass_get_event",
  "Get full details for an event including ticket types, capacity, and live attendee statistics.",
  {
    eventId: z.string().describe("The unique UUID of the event"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_get_event", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 3. urpass_create_event
server.tool(
  "urpass_create_event",
  "Create a new event on URPASS with digital passes, QR check-in, and shareable registration link.",
  {
    name: z.string().min(2).describe("Event name/title"),
    event_date: z.string().describe("Date of the event (YYYY-MM-DD)"),
    start_time: z.string().describe("Event start time (e.g. 10:00 AM)"),
    end_time: z.string().optional().describe("Event end time"),
    venue: z.string().min(2).describe("Venue address or physical location"),
    description: z.string().optional().describe("Event description or agenda"),
    attendee_limit: z.number().int().min(1).optional().describe("Maximum attendee capacity"),
    auto_approve: z.boolean().optional().describe("Whether attendees are automatically approved and receive passes immediately"),
    is_paid_event: z.boolean().optional().describe("Whether this is a paid event"),
    ticket_price: z.number().int().min(0).optional().describe("Ticket price in INR"),
    event_type: z.enum(["physical", "online", "hybrid"]).optional().describe("Type of event"),
    meeting_url: z.string().url().optional().describe("Online meeting URL if online or hybrid"),
    meeting_platform: z.enum(["zoom", "google_meet", "teams", "custom"]).optional(),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_create_event", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 4. urpass_list_attendees
server.tool(
  "urpass_list_attendees",
  "List registered attendees for an event, filterable by application and pass status, with search.",
  {
    eventId: z.string().describe("Event UUID"),
    status: z.enum(["all", "pending", "approved", "rejected"]).optional().describe("Filter by application status"),
    query: z.string().optional().describe("Search term for attendee name or email"),
    limit: z.number().int().min(1).max(100).optional().describe("Number of attendees to return (default 50)"),
    offset: z.number().int().min(0).optional().describe("Pagination offset"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_list_attendees", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 5. urpass_approve_attendee
server.tool(
  "urpass_approve_attendee",
  "Approve a pending attendee registration and automatically issue and email their digital QR pass.",
  {
    attendeeId: z.string().describe("Attendee UUID"),
    eventId: z.string().describe("Event UUID"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_approve_attendee", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 6. urpass_reject_attendee
server.tool(
  "urpass_reject_attendee",
  "Reject an attendee application.",
  {
    attendeeId: z.string().describe("Attendee UUID"),
    eventId: z.string().describe("Event UUID"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_reject_attendee", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 7. urpass_lookup_pass
server.tool(
  "urpass_lookup_pass",
  "Look up pass details by QR pass token or attendee email to verify validity and check-in status.",
  {
    passTokenOrEmail: z.string().describe("The pass token hex string, full pass URL, or attendee email address"),
    eventId: z.string().optional().describe("Optional Event UUID to scope search"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_lookup_pass", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 8. urpass_verify_checkin
server.tool(
  "urpass_verify_checkin",
  "Verify a pass token and record entry check-in with duplicate entry protection.",
  {
    passToken: z.string().describe("The scanned pass token or pass URL"),
    eventId: z.string().describe("Event UUID"),
    gateId: z.string().optional().describe("Optional Gate ID where check-in occurred"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_verify_checkin", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 9. urpass_get_event_analytics
server.tool(
  "urpass_get_event_analytics",
  "Get live event analytics: registration totals, approval rates, check-in velocity, and ticket revenue.",
  {
    eventId: z.string().describe("Event UUID"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_get_event_analytics", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 10. urpass_issue_pass
server.tool(
  "urpass_issue_pass",
  "Directly register an attendee, approve their pass, and send their digital ticket (for VIPs/manual registrations).",
  {
    eventId: z.string().describe("Event UUID"),
    name: z.string().min(1).describe("Attendee full name"),
    email: z.string().email().describe("Attendee email"),
    phone: z.string().optional().describe("Attendee phone number"),
    passType: z.string().optional().describe("Pass type (e.g. participant, vip, speaker)"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_issue_pass", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 11. urpass_list_sessions
server.tool(
  "urpass_list_sessions",
  "List conference agenda sessions for an event, filterable by date, room, and track.",
  {
    eventId: z.string().describe("Event UUID"),
    date: z.string().optional().describe("Filter by session date (YYYY-MM-DD)"),
    roomId: z.string().optional().describe("Filter by room UUID"),
    trackId: z.string().optional().describe("Filter by track UUID"),
    limit: z.number().int().min(1).max(100).optional().describe("Max sessions to return"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_list_sessions", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 12. urpass_create_session
server.tool(
  "urpass_create_session",
  "Create a new conference agenda session with scheduling conflict prevention.",
  {
    eventId: z.string().describe("Event UUID"),
    title: z.string().min(2).describe("Session title"),
    session_type: z.string().optional().describe("Session type (keynote, presentation, workshop, panel, break, networking)"),
    session_date: z.string().describe("Session date (YYYY-MM-DD)"),
    start_time: z.string().describe("Start time (HH:MM)"),
    end_time: z.string().describe("End time (HH:MM)"),
    room_id: z.string().optional().describe("Room UUID"),
    track_id: z.string().optional().describe("Track UUID"),
    capacity: z.number().int().min(1).optional().describe("Session capacity limit"),
    registration_required: z.boolean().optional().describe("Require prior seat reservation"),
    description: z.string().optional().describe("Session description"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_create_session", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 13. urpass_list_rooms
server.tool(
  "urpass_list_rooms",
  "List conference halls, rooms, floors, and capacities for an event.",
  {
    eventId: z.string().describe("Event UUID"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_list_rooms", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 14. urpass_list_speakers
server.tool(
  "urpass_list_speakers",
  "List conference speakers, bios, organisations, and social links for an event.",
  {
    eventId: z.string().describe("Event UUID"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_list_speakers", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 15. urpass_assign_speaker
server.tool(
  "urpass_assign_speaker",
  "Assign a speaker to an agenda session with double-booking prevention.",
  {
    sessionId: z.string().describe("Session UUID"),
    speakerId: z.string().describe("Speaker UUID"),
    role: z.string().optional().describe("Role: speaker, moderator, panelist, host, trainer"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_assign_speaker", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 16. urpass_verify_session_checkin
server.tool(
  "urpass_verify_session_checkin",
  "Verify an attendee pass and record entry into a specific conference session.",
  {
    sessionId: z.string().describe("Session UUID"),
    passToken: z.string().describe("Scanned pass token, URL, or attendee UUID"),
    override: z.boolean().optional().describe("Override reservation requirement if full/unreserved"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_verify_session_checkin", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

// 17. urpass_get_conference_analytics
server.tool(
  "urpass_get_conference_analytics",
  "Get real-time conference analytics: room utilisation, session occupancy rates, and peak check-in velocity.",
  {
    eventId: z.string().describe("Event UUID"),
  },
  async (toolArgs) => {
    try {
      const result = await callUrpassMcpTool("urpass_get_conference_analytics", toolArgs);
      return result;
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: String(err.message || err) }] };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`[urpass-mcp] Server v1.1.0 connected over stdio (target: ${apiUrl})\n`);
}

main().catch((err) => {
  process.stderr.write(`[urpass-mcp] Fatal error: ${err.message}\n`);
  process.exit(1);
});
