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
  mcpListSessions,
  mcpCreateSession,
  mcpListRooms,
  mcpListSpeakers,
  mcpAssignSpeaker,
  mcpVerifySessionCheckin,
  mcpGetConferenceAnalytics,
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
  {
    name: "urpass_list_sessions",
    description: "List conference agenda sessions for an event, filterable by date, room, and track.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        date: { type: "string", description: "Filter by session date (YYYY-MM-DD)" },
        roomId: { type: "string", description: "Filter by room UUID" },
        trackId: { type: "string", description: "Filter by track UUID" },
        limit: { type: "number", description: "Max sessions to return" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "urpass_create_session",
    description: "Create a new conference agenda session with scheduling conflict prevention.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        title: { type: "string", description: "Session title" },
        session_type: { type: "string", description: "Session type (keynote, presentation, workshop, panel, break, networking)" },
        session_date: { type: "string", description: "Session date (YYYY-MM-DD)" },
        start_time: { type: "string", description: "Start time (HH:MM)" },
        end_time: { type: "string", description: "End time (HH:MM)" },
        room_id: { type: "string", description: "Room UUID" },
        track_id: { type: "string", description: "Track UUID" },
        capacity: { type: "number", description: "Session capacity limit" },
        registration_required: { type: "boolean", description: "Require prior reservation" },
        description: { type: "string", description: "Session description" },
      },
      required: ["eventId", "title", "session_date", "start_time", "end_time"],
    },
  },
  {
    name: "urpass_list_rooms",
    description: "List conference halls, rooms, floors, and capacities for an event.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "urpass_list_speakers",
    description: "List conference speakers, bios, organisations, and social links for an event.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "urpass_assign_speaker",
    description: "Assign a speaker to an agenda session with double-booking prevention.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "Session UUID" },
        speakerId: { type: "string", description: "Speaker UUID" },
        role: { type: "string", description: "Role: speaker, moderator, panelist, host, trainer" },
      },
      required: ["sessionId", "speakerId"],
    },
  },
  {
    name: "urpass_verify_session_checkin",
    description: "Verify an attendee pass and record entry into a specific conference session.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "Session UUID" },
        passToken: { type: "string", description: "Scanned pass token, URL, or attendee UUID" },
        override: { type: "boolean", description: "Override reservation requirement if full/unreserved" },
      },
      required: ["sessionId", "passToken"],
    },
  },
  {
    name: "urpass_get_conference_analytics",
    description: "Get real-time conference analytics: room utilisation, session occupancy rates, and peak check-in velocity.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
      },
      required: ["eventId"],
    },
  },
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Urpass-Client",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

async function resolveAuth(req: NextRequest) {
  let effectiveReq = req;
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    const queryKey = req.nextUrl.searchParams.get("api_key") || req.nextUrl.searchParams.get("apiKey");
    if (queryKey) {
      const headers = new Headers(req.headers);
      headers.set("authorization", `Bearer ${queryKey}`);
      effectiveReq = new NextRequest(req.url, {
        method: req.method,
        headers,
        body: req.body,
      });
    }
  }
  return authenticateApiKey(effectiveReq);
}

export async function GET(req: NextRequest) {
  // If user provides API Key, authenticate to confirm key validity
  const auth = await resolveAuth(req);

  return NextResponse.json(
    {
      name: "urpass-mcp",
      version: "1.1.0",
      protocolVersion: "2024-11-05",
      description: "URPASS Model Context Protocol (MCP) Server for AI Assistants & Agents",
      authenticated: Boolean(auth),
      toolsCount: MCP_TOOLS_MANIFEST.length,
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
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  const auth = await resolveAuth(req);
  if (!auth) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Unauthorized. Provide a valid URPASS Bearer API key in Authorization header or ?api_key query parameter.",
        },
        id: null,
      },
      { status: 401, headers: CORS_HEADERS }
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
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: responseId,
          result: {
            protocolVersion: "2024-11-05",
            serverInfo: {
              name: "urpass-mcp",
              version: "1.1.0",
            },
            capabilities: {
              tools: {
                listChanged: false,
              },
            },
          },
        },
        { headers: CORS_HEADERS }
      );

    case "notifications/initialized":
      return NextResponse.json({ jsonrpc: "2.0", id: responseId, result: {} }, { headers: CORS_HEADERS });

    case "ping":
      return NextResponse.json({ jsonrpc: "2.0", id: responseId, result: {} }, { headers: CORS_HEADERS });

    case "tools/list":
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: responseId,
          result: {
            tools: MCP_TOOLS_MANIFEST,
          },
        },
        { headers: CORS_HEADERS }
      );

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
          case "urpass_list_sessions":
            resultData = await mcpListSessions(ctx, args as never);
            break;
          case "urpass_create_session":
            resultData = await mcpCreateSession(ctx, args as never);
            break;
          case "urpass_list_rooms":
            resultData = await mcpListRooms(ctx, args as never);
            break;
          case "urpass_list_speakers":
            resultData = await mcpListSpeakers(ctx, args as never);
            break;
          case "urpass_assign_speaker":
            resultData = await mcpAssignSpeaker(ctx, args as never);
            break;
          case "urpass_verify_session_checkin":
            resultData = await mcpVerifySessionCheckin(ctx, args as never);
            break;
          case "urpass_get_conference_analytics":
            resultData = await mcpGetConferenceAnalytics(ctx, args as never);
            break;
          default:
            return NextResponse.json(
              {
                jsonrpc: "2.0",
                id: responseId,
                error: { code: -32601, message: `Tool not found: ${toolName}` },
              },
              { headers: CORS_HEADERS }
            );
        }

        return NextResponse.json(
          {
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
          },
          { headers: CORS_HEADERS }
        );
      } catch (toolError: unknown) {
        const errorMsg = toolError instanceof Error ? toolError.message : String(toolError);
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id: responseId,
            result: {
              isError: true,
              content: [{ type: "text", text: `Error executing ${toolName}: ${errorMsg}` }],
            },
          },
          { headers: CORS_HEADERS }
        );
      }
    }

    default:
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: responseId,
          error: { code: -32601, message: `Method not found: ${method}` },
        },
        { headers: CORS_HEADERS }
      );
  }
}
