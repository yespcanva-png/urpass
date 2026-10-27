import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
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
    async (args) => {
      try {
        const result = await mcpListSessions(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpCreateSession(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpListRooms(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpListSpeakers(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpAssignSpeaker(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpVerifySessionCheckin(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
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
    async (args) => {
      try {
        const result = await mcpGetConferenceAnalytics(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `Error: ${msg}` }] };
      }
    }
  );

  // ─────────────────────────────────────────────────────────
  // 12 Claude-Standard MCP Tools (Direct conversational actions)
  // ─────────────────────────────────────────────────────────

  // list_events
  server.tool(
    "list_events",
    "List all events organized by the user or organization with dates, capacities, and attendee counts.",
    {
      status: z.enum(["draft", "active", "completed"]).optional().describe("Filter events by status"),
      limit: z.number().int().min(1).max(100).optional().describe("Number of events to return"),
      offset: z.number().int().min(0).optional(),
    },
    async (args) => {
      try {
        const result = await mcpListEvents(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // get_event
  server.tool(
    "get_event",
    "Get full details for an event including ticket types, capacity, and live attendee statistics.",
    { eventId: z.string().describe("The unique UUID of the event") },
    async (args) => {
      try {
        const result = await mcpGetEvent(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // create_event
  server.tool(
    "create_event",
    "Create a draft event on UrPass with digital passes, QR check-in, and shareable registration link.",
    {
      name: z.string().min(2).describe("Event name/title"),
      event_date: z.string().describe("Date of the event (YYYY-MM-DD)"),
      start_time: z.string().describe("Event start time (e.g. 10:00 AM or 18:30)"),
      end_time: z.string().optional().describe("Event end time"),
      venue: z.string().min(2).describe("Venue address or physical location"),
      description: z.string().optional().describe("Event description"),
      attendee_limit: z.number().int().min(1).optional().describe("Maximum attendee capacity"),
      auto_approve: z.boolean().optional(),
      is_paid_event: z.boolean().optional(),
      ticket_price: z.number().int().min(0).optional(),
      event_type: z.enum(["physical", "online", "hybrid"]).optional(),
      meeting_url: z.string().optional(),
      status: z.enum(["draft", "active"]).optional(),
    },
    async (args) => {
      try {
        const result = await mcpCreateEvent(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // update_event
  server.tool(
    "update_event",
    "Update event title, dates, hours, venue, description, capacity, or ticket pricing.",
    {
      eventId: z.string().describe("Event UUID"),
      name: z.string().optional(),
      event_date: z.string().optional(),
      start_time: z.string().optional(),
      end_time: z.string().optional(),
      venue: z.string().optional(),
      description: z.string().optional(),
      attendee_limit: z.number().optional(),
      is_paid_event: z.boolean().optional(),
      ticket_price: z.number().optional(),
      auto_approve: z.boolean().optional(),
    },
    async (args) => {
      try {
        const result = await mcpUpdateEvent(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // list_ticket_tiers
  server.tool(
    "list_ticket_tiers",
    "Retrieve ticket types, prices (INR), capacities, and sold counts for an event.",
    { eventId: z.string().describe("Event UUID") },
    async (args) => {
      try {
        const result = await mcpListTicketTiers(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // create_ticket_tier
  server.tool(
    "create_ticket_tier",
    "Add a new ticket tier with pricing in INR and capacity limit.",
    {
      eventId: z.string().describe("Event UUID"),
      name: z.string().describe("Ticket tier name"),
      price: z.number().min(0).describe("Ticket price in INR"),
      capacity: z.number().optional(),
      category: z.string().optional(),
      description: z.string().optional(),
      maxPerPerson: z.number().optional(),
    },
    async (args) => {
      try {
        const result = await mcpCreateTicketTier(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // get_registrations
  server.tool(
    "get_registrations",
    "List registered attendees for an event with privacy-preserving PII masking.",
    {
      eventId: z.string().describe("Event UUID"),
      status: z.enum(["all", "pending", "approved", "rejected"]).optional(),
      query: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      unmaskPII: z.boolean().optional(),
    },
    async (args) => {
      try {
        const result = await mcpGetRegistrations(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // get_event_analytics
  server.tool(
    "get_event_analytics",
    "Get live event analytics: registration totals, approval rates, check-in velocity, and ticket revenue.",
    { eventId: z.string().describe("Event UUID") },
    async (args) => {
      try {
        const result = await mcpGetEventAnalytics(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // get_event_readiness
  server.tool(
    "get_event_readiness",
    "Evaluate 7 pre-flight readiness checks (dates, ticket setup, capacity, payment gateway, venue) before publishing.",
    { eventId: z.string().describe("Event UUID") },
    async (args) => {
      try {
        const result = await mcpGetEventReadiness(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // get_scanner_stats
  server.tool(
    "get_scanner_stats",
    "Retrieve live venue check-in figures, gate occupancy, and entry velocity per hour.",
    {
      eventId: z.string().describe("Event UUID"),
      gateId: z.string().optional(),
    },
    async (args) => {
      try {
        const result = await mcpGetScannerStats(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // publish_event
  server.tool(
    "publish_event",
    "Publish an event to live status after pre-flight readiness verification. Requires confirm: true.",
    {
      eventId: z.string().describe("Event UUID"),
      confirm: z.boolean().optional().describe("Explicit user confirmation flag"),
    },
    async (args) => {
      try {
        const result = await mcpPublishEvent(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  // submit_to_explore
  server.tool(
    "submit_to_explore",
    "Submit an event to the UrPass Explore consumer discovery marketplace moderation queue. Requires confirm: true.",
    {
      eventId: z.string().describe("Event UUID"),
      city: z.string().describe("City hub (e.g. Bangalore, Chennai, Mumbai)"),
      category: z.string().describe("Category slug"),
      editorialSummary: z.string().optional(),
      confirm: z.boolean().optional().describe("Explicit user confirmation flag"),
    },
    async (args) => {
      try {
        const result = await mcpSubmitToExplore(ctx, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        return { isError: true, content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }] };
      }
    }
  );

  return server;
}
