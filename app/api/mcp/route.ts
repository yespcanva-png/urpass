import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import {
  mcpListEvents,
  mcpGetEvent,
  mcpCreateEvent,
  mcpListAttendees,
  mcpApproveAttendee,
  mcpRejectAttendee,
  mcpLookupPass,
  mcpVerifyCheckin,
  mcpGetEventAnalytics,
  mcpIssuePass,
  type McpToolContext,
} from "@/lib/mcp/core";

export const dynamic = "force-dynamic";

export const MCP_TOOLS_MANIFEST = [
  {
    name: "urpass_list_events",
    description: "List all events organized by the user with dates, venues, attendee counts, and capacities.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["draft", "active", "completed"], description: "Filter by status" },
        limit: { type: "number", description: "Number of events to return (default 20)" },
        offset: { type: "number", description: "Pagination offset" },
      },
    },
  },
  {
    name: "urpass_get_event",
    description: "Get full details for an event including ticket types, capacity, and live attendee statistics.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "The unique UUID of the event" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "urpass_create_event",
    description: "Create a new event on URPASS with digital passes, QR check-in, and shareable registration link.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Event title" },
        event_date: { type: "string", description: "Event date (YYYY-MM-DD)" },
        start_time: { type: "string", description: "Event start time (e.g. 10:00 AM)" },
        end_time: { type: "string", description: "Event end time" },
        venue: { type: "string", description: "Venue name or physical address" },
        description: { type: "string", description: "Event description" },
        attendee_limit: { type: "number", description: "Max attendee capacity" },
        auto_approve: { type: "boolean", description: "Auto-approve registrations immediately" },
        is_paid_event: { type: "boolean", description: "Whether this is a paid event" },
        ticket_price: { type: "number", description: "Ticket price in INR" },
        event_type: { type: "string", enum: ["physical", "online", "hybrid"] },
      },
      required: ["name", "event_date", "start_time", "venue"],
    },
  },
  {
    name: "urpass_list_attendees",
    description: "List registered attendees for an event, filterable by application and pass status, with search.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        status: { type: "string", enum: ["all", "pending", "approved", "rejected"] },
        query: { type: "string", description: "Search term for name or email" },
        limit: { type: "number" },
        offset: { type: "number" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "urpass_approve_attendee",
    description: "Approve a pending attendee registration and automatically issue and email their digital QR pass.",
    inputSchema: {
      type: "object",
      properties: {
        attendeeId: { type: "string", description: "Attendee UUID" },
        eventId: { type: "string", description: "Event UUID" },
      },
      required: ["attendeeId", "eventId"],
    },
  },
  {
    name: "urpass_reject_attendee",
    description: "Reject an attendee application.",
    inputSchema: {
      type: "object",
      properties: {
        attendeeId: { type: "string", description: "Attendee UUID" },
        eventId: { type: "string", description: "Event UUID" },
      },
      required: ["attendeeId", "eventId"],
    },
  },
  {
    name: "urpass_lookup_pass",
    description: "Look up pass details by QR pass token or attendee email to verify validity and check-in status.",
    inputSchema: {
      type: "object",
      properties: {
        passTokenOrEmail: { type: "string", description: "Pass token or attendee email" },
        eventId: { type: "string", description: "Optional Event UUID" },
      },
      required: ["passTokenOrEmail"],
    },
  },
  {
    name: "urpass_verify_checkin",
    description: "Verify a pass token and record entry check-in with duplicate entry protection.",
    inputSchema: {
      type: "object",
      properties: {
        passToken: { type: "string", description: "Pass token or pass URL" },
        eventId: { type: "string", description: "Event UUID" },
        gateId: { type: "string", description: "Optional Gate ID" },
      },
      required: ["passToken", "eventId"],
    },
  },
  {
    name: "urpass_get_event_analytics",
    description: "Get live event analytics: registration totals, approval rates, check-in velocity, and ticket revenue.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "urpass_issue_pass",
    description: "Directly register an attendee, approve their pass, and send their digital ticket.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        name: { type: "string", description: "Attendee name" },
        email: { type: "string", description: "Attendee email" },
        phone: { type: "string", description: "Attendee phone" },
        passType: { type: "string", description: "Pass type (e.g. participant, vip)" },
      },
      required: ["eventId", "name", "email"],
    },
  },
];

export async function GET(req: NextRequest) {
  // If user provides API Key, authenticate to confirm key validity
  const auth = await authenticateApiKey(req);

  return NextResponse.json({
    name: "urpass-mcp",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    description: "URPASS Model Context Protocol (MCP) Server for AI Assistants & Agents",
    authenticated: Boolean(auth),
    tools: MCP_TOOLS_MANIFEST,
    usage: {
      endpoint: "https://urpass.space/api/mcp",
      method: "POST",
      headers: {
        Authorization: "Bearer urp_live_...",
        "Content-Type": "application/json",
      },
      transport: "JSON-RPC 2.0 / HTTP",
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await authenticateApiKey(req);
  if (!auth) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Unauthorized. Provide a valid URPASS Bearer API key in Authorization header.",
        },
        id: null,
      },
      { status: 401 }
    );
  }

  const ctx: McpToolContext = { userId: auth.userId };
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32700, message: "Parse error: Invalid JSON" }, id: null },
      { status: 400 }
    );
  }

  const { jsonrpc, id, method, params } = body as {
    jsonrpc?: string;
    id?: string | number | null;
    method?: string;
    params?: Record<string, unknown>;
  };

  const responseId = id ?? null;

  switch (method) {
    case "initialize":
      return NextResponse.json({
        jsonrpc: "2.0",
        id: responseId,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: {
            name: "urpass-mcp",
            version: "1.0.0",
          },
          capabilities: {
            tools: {
              listChanged: false,
            },
          },
        },
      });

    case "notifications/initialized":
      return NextResponse.json({ jsonrpc: "2.0", id: responseId, result: {} });

    case "ping":
      return NextResponse.json({ jsonrpc: "2.0", id: responseId, result: {} });

    case "tools/list":
      return NextResponse.json({
        jsonrpc: "2.0",
        id: responseId,
        result: {
          tools: MCP_TOOLS_MANIFEST,
        },
      });

    case "tools/call": {
      const toolName = (params?.name as string) || "";
      const args = (params?.arguments as Record<string, unknown>) || {};

      try {
        let resultData: unknown;

        switch (toolName) {
          case "urpass_list_events":
            resultData = await mcpListEvents(ctx, args as never);
            break;
          case "urpass_get_event":
            resultData = await mcpGetEvent(ctx, args as never);
            break;
          case "urpass_create_event":
            resultData = await mcpCreateEvent(ctx, args as never);
            break;
          case "urpass_list_attendees":
            resultData = await mcpListAttendees(ctx, args as never);
            break;
          case "urpass_approve_attendee":
            resultData = await mcpApproveAttendee(ctx, args as never);
            break;
          case "urpass_reject_attendee":
            resultData = await mcpRejectAttendee(ctx, args as never);
            break;
          case "urpass_lookup_pass":
            resultData = await mcpLookupPass(ctx, args as never);
            break;
          case "urpass_verify_checkin":
            resultData = await mcpVerifyCheckin(ctx, args as never);
            break;
          case "urpass_get_event_analytics":
            resultData = await mcpGetEventAnalytics(ctx, args as never);
            break;
          case "urpass_issue_pass":
            resultData = await mcpIssuePass(ctx, args as never);
            break;
          default:
            return NextResponse.json({
              jsonrpc: "2.0",
              id: responseId,
              error: { code: -32601, message: `Tool not found: ${toolName}` },
            });
        }

        return NextResponse.json({
          jsonrpc: "2.0",
          id: responseId,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(resultData, null, 2),
              },
            ],
          },
        });
      } catch (toolError: unknown) {
        const errorMsg = toolError instanceof Error ? toolError.message : String(toolError);
        return NextResponse.json({
          jsonrpc: "2.0",
          id: responseId,
          result: {
            isError: true,
            content: [{ type: "text", text: `Error executing ${toolName}: ${errorMsg}` }],
          },
        });
      }
    }

    default:
      return NextResponse.json({
        jsonrpc: "2.0",
        id: responseId,
        error: { code: -32601, message: `Method not found: ${method}` },
      });
  }
}
