import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { verifyOAuthToken, ALL_MCP_SCOPES } from "@/lib/mcp/oauth";
import {
  mcpListEvents,
  mcpGetEvent,
  mcpCreateEvent,
  mcpUpdateEvent,
  mcpListTicketTiers,
  mcpCreateTicketTier,
  mcpGetRegistrations,
  mcpListAttendees,
  mcpApproveAttendee,
  mcpRejectAttendee,
  mcpLookupPass,
  mcpVerifyCheckin,
  mcpGetEventAnalytics,
  mcpGetEventReadiness,
  mcpGetScannerStats,
  mcpPublishEvent,
  mcpSubmitToExplore,
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

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiter: In-memory sliding window (120 req/min read, 30 req/min write)
// ─────────────────────────────────────────────────────────────────────────────
interface RateLimitBucket {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitBucket>();

function checkRateLimit(key: string, limit: number, windowMs = 60000): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = rateLimitMap.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count++;
  return { allowed: true, retryAfter: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 12 Claude-Standard MCP Tools
// ─────────────────────────────────────────────────────────────────────────────
export const CLAUDE_MCP_TOOLS = [
  {
    name: "list_events",
    description: "List all events organized by the user or their authorized organization with dates, venues, attendee counts, and capacities.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["draft", "active", "completed"], description: "Filter by status" },
        limit: { type: "number", description: "Number of events to return (default 20, max 100)" },
        offset: { type: "number", description: "Pagination offset index" },
      },
    },
  },
  {
    name: "get_event",
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
    name: "create_event",
    description: "Create a draft event on UrPass with digital passes, QR check-in, and shareable registration link.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Event title" },
        event_date: { type: "string", description: "Event date (YYYY-MM-DD)" },
        start_time: { type: "string", description: "Event start time (e.g. 10:00 AM or 18:30)" },
        end_time: { type: "string", description: "Event end time" },
        venue: { type: "string", description: "Venue name or physical address" },
        description: { type: "string", description: "Event description or agenda" },
        attendee_limit: { type: "number", description: "Max attendee capacity" },
        auto_approve: { type: "boolean", description: "Auto-approve registrations immediately" },
        is_paid_event: { type: "boolean", description: "Whether this is a paid event" },
        ticket_price: { type: "number", description: "Ticket price in INR" },
        event_type: { type: "string", enum: ["physical", "online", "hybrid"] },
        meeting_url: { type: "string", description: "Online meeting URL if online or hybrid" },
        status: { type: "string", enum: ["draft", "active"], description: "Initial status (defaults to draft)" },
      },
      required: ["name", "event_date", "start_time", "venue"],
    },
  },
  {
    name: "update_event",
    description: "Update event details: title, date, operational hours, venue, capacity, or ticket pricing.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        name: { type: "string", description: "New event title" },
        event_date: { type: "string", description: "New date (YYYY-MM-DD)" },
        start_time: { type: "string", description: "New start time" },
        end_time: { type: "string", description: "New end time" },
        venue: { type: "string", description: "New venue address" },
        description: { type: "string", description: "Updated description" },
        attendee_limit: { type: "number", description: "Updated capacity limit" },
        is_paid_event: { type: "boolean" },
        ticket_price: { type: "number", description: "Updated ticket price in INR" },
        auto_approve: { type: "boolean" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "list_ticket_tiers",
    description: "Retrieve all ticket types, pricing (in INR and paise), capacities, and sold counts for an event.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "create_ticket_tier",
    description: "Add a new ticket tier (e.g. VIP, General Entry, Early Bird) with price in INR and capacity limit.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        name: { type: "string", description: "Ticket tier name (e.g. VIP Pass, Early Bird)" },
        price: { type: "number", description: "Price in INR (e.g. 299 for ₹299)" },
        capacity: { type: "number", description: "Maximum seats/passes for this tier" },
        category: { type: "string", description: "Category: general, vip, student, early_bird" },
        description: { type: "string", description: "Tier benefits and perks description" },
        maxPerPerson: { type: "number", description: "Max tickets per booking (default 1)" },
      },
      required: ["eventId", "name", "price"],
    },
  },
  {
    name: "get_registrations",
    description: "List registered attendees for an event with privacy-preserving PII masking.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        status: { type: "string", enum: ["all", "pending", "approved", "rejected"], description: "Application status filter" },
        query: { type: "string", description: "Search by name or email" },
        limit: { type: "number", description: "Max records (default 50, max 100)" },
        offset: { type: "number" },
        unmaskPII: { type: "boolean", description: "Set true only when explicit attendee email/phone reveal is authorized" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "get_event_analytics",
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
    name: "get_event_readiness",
    description: "Evaluate 7 pre-flight readiness checks (dates, ticket setup, capacity, payment gateway, venue) before publishing.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "get_scanner_stats",
    description: "Retrieve live venue check-in figures, gate occupancy, and entry velocity per hour.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        gateId: { type: "string", description: "Optional Gate ID filter" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "publish_event",
    description: "Publish an event to live status after pre-flight readiness verification. Consequential action requiring explicit confirm: true.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        confirm: { type: "boolean", description: "Must be true to execute live publishing. If false, returns readiness preview." },
      },
      required: ["eventId"],
    },
  },
  {
    name: "submit_to_explore",
    description: "Submit an event to the UrPass Explore consumer discovery marketplace moderation queue. Consequential action requiring explicit confirm: true.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "Event UUID" },
        city: { type: "string", description: "Target city hub (e.g. Bangalore, Chennai, Mumbai, Hyderabad, Delhi NCR)" },
        category: { type: "string", description: "Marketplace category (e.g. tech-conferences, workshops, music-concerts, standup-comedy)" },
        editorialSummary: { type: "string", description: "Short 1-line event summary for Explore card (up to 140 characters)" },
        confirm: { type: "boolean", description: "Must be true to execute submission. If false, returns eligibility preview." },
      },
      required: ["eventId", "city", "category"],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Legacy 17 Tools (preserved for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────
export const LEGACY_MCP_TOOLS = [
  {
    name: "urpass_list_events",
    description: "List all events organized by the user with dates, venues, attendee counts, and capacities.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["draft", "active", "completed"] },
        limit: { type: "number" },
        offset: { type: "number" },
      },
    },
  },
  {
    name: "urpass_get_event",
    description: "Get full details for an event including ticket types, capacity, and live attendee statistics.",
    inputSchema: {
      type: "object",
      properties: {
        eventId: { type: "string" },
      },
      required: ["eventId"],
    },
  },
  {
    name: "urpass_create_event",
    description: "Create a new event on UrPass with digital passes, QR check-in, and shareable registration link.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        event_date: { type: "string" },
        start_time: { type: "string" },
        end_time: { type: "string" },
        venue: { type: "string" },
        description: { type: "string" },
        attendee_limit: { type: "number" },
        auto_approve: { type: "boolean" },
        is_paid_event: { type: "boolean" },
        ticket_price: { type: "number" },
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
        eventId: { type: "string" },
        status: { type: "string", enum: ["all", "pending", "approved", "rejected"] },
        query: { type: "string" },
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
        attendeeId: { type: "string" },
        eventId: { type: "string" },
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
        attendeeId: { type: "string" },
        eventId: { type: "string" },
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
        passTokenOrEmail: { type: "string" },
        eventId: { type: "string" },
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
        passToken: { type: "string" },
        eventId: { type: "string" },
        gateId: { type: "string" },
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
        eventId: { type: "string" },
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
        eventId: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        passType: { type: "string" },
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
        eventId: { type: "string" },
        date: { type: "string" },
        roomId: { type: "string" },
        trackId: { type: "string" },
        limit: { type: "number" },
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
        eventId: { type: "string" },
        title: { type: "string" },
        session_type: { type: "string" },
        session_date: { type: "string" },
        start_time: { type: "string" },
        end_time: { type: "string" },
        room_id: { type: "string" },
        track_id: { type: "string" },
        capacity: { type: "number" },
        registration_required: { type: "boolean" },
        description: { type: "string" },
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
        eventId: { type: "string" },
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
        eventId: { type: "string" },
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
        sessionId: { type: "string" },
        speakerId: { type: "string" },
        role: { type: "string" },
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
        sessionId: { type: "string" },
        passToken: { type: "string" },
        override: { type: "boolean" },
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
        eventId: { type: "string" },
      },
      required: ["eventId"],
    },
  },
];

// Combined manifest containing both standard Claude names and legacy prefixed names
export const MCP_TOOLS_MANIFEST = [...LEGACY_MCP_TOOLS, ...CLAUDE_MCP_TOOLS];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Urpass-Client, X-Mcp-Client",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

function hasInsecureQueryApiKey(req: NextRequest): boolean {
  return req.nextUrl.searchParams.has("api_key") || req.nextUrl.searchParams.has("apiKey");
}

async function resolveAuth(req: NextRequest): Promise<McpToolContext | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  // 1. Check if OAuth access token
  if (token && token.startsWith("urp_mcp_at_")) {
    const oauthRecord = verifyOAuthToken(token);
    if (!oauthRecord) return null;

    return {
      userId: oauthRecord.userId,
      organizationId: oauthRecord.organizationId,
      scopes: oauthRecord.scopes,
      actorEmail: "claude-mcp@urpass.space",
    };
  }

  // 2. Delegate to API Key authenticator
  const apiAuth = await authenticateApiKey(req);
  if (!apiAuth) return null;

  return {
    userId: apiAuth.userId,
    organizationId: apiAuth.organizationId,
    scopes: ALL_MCP_SCOPES,
    actorEmail: "api-key@urpass.space",
  };
}

export async function GET(req: NextRequest) {
  if (hasInsecureQueryApiKey(req)) {
    return NextResponse.json(
      {
        error: "INSECURE_AUTH_METHOD",
        message: "API keys in URL query parameters are strictly forbidden for security. Pass your Bearer token via the 'Authorization: Bearer <token>' header.",
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const auth = await resolveAuth(req);
  const isClaudeClient = req.nextUrl.searchParams.get("client") === "claude" || req.headers.get("x-mcp-client") === "claude";
  const displayedTools = isClaudeClient ? CLAUDE_MCP_TOOLS : MCP_TOOLS_MANIFEST;

  return NextResponse.json(
    {
      name: "urpass-mcp",
      version: "2.0.0",
      protocolVersion: "2024-11-05",
      description: "UrPass Model Context Protocol (MCP) Server for Claude & AI Assistants",
      authenticated: Boolean(auth),
      toolsCount: displayedTools.length,
      tools: displayedTools,
      claudeTools: CLAUDE_MCP_TOOLS,
      usage: {
        endpoint: "https://mcp.urpass.space/mcp",
        alternativeEndpoint: "https://urpass.space/api/mcp",
        oauthAuthorizationEndpoint: "https://urpass.space/api/oauth/authorize",
        oauthTokenEndpoint: "https://urpass.space/api/oauth/token",
        method: "POST",
        headers: {
          Authorization: "Bearer <oauth_token_or_api_key>",
          "Content-Type": "application/json",
        },
        transport: "Streamable HTTP / JSON-RPC 2.0",
      },
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  if (hasInsecureQueryApiKey(req)) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32600,
          message: "Invalid Request: API keys in URL query parameters are strictly forbidden for security. Provide your token in the 'Authorization: Bearer <token>' header.",
        },
        id: null,
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const auth = await resolveAuth(req);
  if (!auth) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Unauthorized. Provide a valid UrPass OAuth Bearer access token or Bearer API key in the Authorization header.",
        },
        id: null,
      },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  // Rate Limiting check
  const isWriteAttempt = req.headers.get("x-mcp-action") === "write";
  const limitCheck = checkRateLimit(auth.userId, isWriteAttempt ? 30 : 120);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: `Too Many Requests. Rate limit exceeded. Please back off for ${limitCheck.retryAfter}s.`,
        },
        id: null,
      },
      { status: 429, headers: { ...CORS_HEADERS, "Retry-After": String(limitCheck.retryAfter) } }
    );
  }

  const ctx: McpToolContext = auth;
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
              version: "2.0.0",
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

    case "tools/list": {
      const isClaude = req.nextUrl.searchParams.get("client") === "claude" || req.headers.get("x-mcp-client") === "claude";
      const toolsToReturn = isClaude ? CLAUDE_MCP_TOOLS : MCP_TOOLS_MANIFEST;
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: responseId,
          result: {
            tools: toolsToReturn,
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    case "tools/call": {
      const toolName = (params?.name as string) || "";
      const args = (params?.arguments as Record<string, unknown>) || {};

      try {
        let resultData: unknown;

        switch (toolName) {
          // ── Events ──────────────────────────────────────────────
          case "list_events":
          case "urpass_list_events":
            resultData = await mcpListEvents(ctx, args as never);
            break;

          case "get_event":
          case "urpass_get_event":
            resultData = await mcpGetEvent(ctx, args as never);
            break;

          case "create_event":
          case "urpass_create_event":
            resultData = await mcpCreateEvent(ctx, args as never);
            break;

          case "update_event":
            resultData = await mcpUpdateEvent(ctx, args as never);
            break;

          case "publish_event":
            resultData = await mcpPublishEvent(ctx, args as never);
            break;

          case "get_event_readiness":
            resultData = await mcpGetEventReadiness(ctx, args as never);
            break;

          case "submit_to_explore":
            resultData = await mcpSubmitToExplore(ctx, args as never);
            break;

          // ── Ticket Tiers ─────────────────────────────────────────
          case "list_ticket_tiers":
            resultData = await mcpListTicketTiers(ctx, args as never);
            break;

          case "create_ticket_tier":
            resultData = await mcpCreateTicketTier(ctx, args as never);
            break;

          // ── Registrations & Attendees ────────────────────────────
          case "get_registrations":
            resultData = await mcpGetRegistrations(ctx, args as never);
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

          case "urpass_issue_pass":
            resultData = await mcpIssuePass(ctx, args as never);
            break;

          // ── Analytics & Scanner Stats ────────────────────────────
          case "get_event_analytics":
          case "urpass_get_event_analytics":
            resultData = await mcpGetEventAnalytics(ctx, args as never);
            break;

          case "get_scanner_stats":
            resultData = await mcpGetScannerStats(ctx, args as never);
            break;

          // ── Conference Tools ─────────────────────────────────────
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
