import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
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
} from "./core";

/**
 * Creates and configures an official Model Context Protocol (MCP) server
 * for a specific authenticated URPASS user context.
 */
export function createUrpassMcpServer(ctx: McpToolContext) {
  const server = new McpServer({
    name: "urpass-mcp",
    version: "1.0.0",
  });

  // 1. urpass_list_events
  server.tool(
    "urpass_list_events",
    "List all events organized by the user with dates, venues, attendee counts, and capacities.",
    {
      status: z.enum(["draft", "active", "completed"]).optional().describe("Filter events by status"),
      limit: z.number().int().min(1).max(100).optional().describe("Number of events to return (default 20)"),
      offset: z.number().int().min(0).optional().describe("Pagination offset"),
    },
    async (args) => {
      try {
        const result = await mcpListEvents(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpGetEvent(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
      start_time: z.string().describe("Event start time (e.g. 10:00 AM or 18:30)"),
      end_time: z.string().optional().describe("Event end time"),
      venue: z.string().min(2).describe("Venue address or physical location"),
      description: z.string().optional().describe("Event description or agenda"),
      attendee_limit: z.number().int().min(1).optional().describe("Maximum attendee capacity"),
      auto_approve: z.boolean().optional().describe("Whether attendees are automatically approved and receive passes immediately"),
      is_paid_event: z.boolean().optional().describe("Whether this is a paid event"),
      ticket_price: z.number().int().min(0).optional().describe("Ticket price in Indian Rupees (INR)"),
      event_type: z.enum(["physical", "online", "hybrid"]).optional().describe("Type of event"),
      meeting_url: z.string().url().optional().describe("Online meeting URL if online or hybrid"),
      meeting_platform: z.enum(["zoom", "google_meet", "teams", "custom"]).optional(),
    },
    async (args) => {
      try {
        const result = await mcpCreateEvent(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpListAttendees(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpApproveAttendee(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpRejectAttendee(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpLookupPass(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpVerifyCheckin(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpGetEventAnalytics(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpIssuePass(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
      }
    }
  );

  return server;
}
