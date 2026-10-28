import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getUserPlan } from "@/lib/plan";
import { sendPassEmail } from "@/lib/email";
import {
  checkRoomConflict,
  checkSpeakerConflicts,
} from "@/lib/conference/conflict-detection";
import { computeConferenceAnalytics, slugify } from "@/lib/conference/helpers";
import type { EventSession, EventRoom } from "@/types/conference";
import { resolveUserSubscriptionAccess } from "@/lib/billing/entitlement-resolver";
import type { McpScope } from "@/lib/mcp/oauth";
import { validateEventPreflightReadiness } from "@/lib/events/preflight";
import { getExploreEligibility } from "@/lib/explore/eligibility";
import { recordEnterpriseAudit } from "@/lib/audit/enterprise-audit";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface McpToolContext {
  userId: string;
  organizationId?: string | null;
  scopes?: McpScope[];
  actorEmail?: string | null;
}

export function assertScope(ctx: McpToolContext, requiredScope: McpScope) {
  if (ctx.scopes && ctx.scopes.length > 0 && !ctx.scopes.includes(requiredScope)) {
    throw new Error(`Forbidden: Token lacks required scope '${requiredScope}'`);
  }
}

// ─────────────────────────────────────────────────────────────
// 1. list_events
// ─────────────────────────────────────────────────────────────
export async function mcpListEvents(
  ctx: McpToolContext,
  params: { status?: string; limit?: number; offset?: number } = {}
) {
  assertScope(ctx, "events:read");
  const supabase = adminClient();
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
  const offset = Math.max(params.offset ?? 0, 0);

  let query = supabase
    .from("events")
    .select(
      "id, name, description, event_date, start_time, end_time, venue, status, is_paid_event, ticket_price, attendee_limit, apply_slug, organization_id, created_at",
      { count: "exact" }
    );

  if (ctx.organizationId) {
    query = query.or(`organizer_id.eq.${ctx.userId},organization_id.eq.${ctx.organizationId}`);
  } else {
    query = query.eq("organizer_id", ctx.userId);
  }

  query = query.order("event_date", { ascending: false }).range(offset, offset + limit - 1);

  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data: events, error, count } = await query;
  if (error) throw new Error(`Failed to list events: ${error.message}`);

  return {
    events: events ?? [],
    total: count ?? 0,
    limit,
    offset,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. get_event
// ─────────────────────────────────────────────────────────────
export async function mcpGetEvent(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  assertScope(ctx, "events:read");
  const supabase = adminClient();
  let query = supabase
    .from("events")
    .select("*")
    .eq("id", params.eventId);

  if (ctx.organizationId) {
    query = query.or(`organizer_id.eq.${ctx.userId},organization_id.eq.${ctx.organizationId}`);
  } else {
    query = query.eq("organizer_id", ctx.userId);
  }

  const { data: event, error } = await query.maybeSingle();

  if (error || !event) {
    throw new Error(`Event not found or unauthorized: ${params.eventId}`);
  }

  const [
    { count: totalAttendees },
    { count: approvedAttendees },
    { count: checkedInCount },
    { data: ticketTypes },
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", params.eventId),
    supabase
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", params.eventId)
      .eq("application_status", "approved"),
    supabase
      .from("check_ins")
      .select("*", { count: "exact", head: true })
      .eq("event_id", params.eventId),
    supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", params.eventId)
      .order("created_at", { ascending: true }),
  ]);

  return {
    ...event,
    applyUrl: `https://urpass.space/apply/${event.apply_slug || event.id}`,
    stats: {
      totalApplications: totalAttendees ?? 0,
      approved: approvedAttendees ?? 0,
      checkedIn: checkedInCount ?? 0,
      capacity: event.attendee_limit,
      capacityUsedPct: event.attendee_limit
        ? Math.round(((approvedAttendees ?? 0) / event.attendee_limit) * 100)
        : 0,
    },
    ticketTypes: ticketTypes ?? [],
  };
}

// ─────────────────────────────────────────────────────────────
// 3. create_event
// ─────────────────────────────────────────────────────────────
export async function mcpCreateEvent(
  ctx: McpToolContext,
  params: {
    name: string;
    event_date: string;
    start_time: string;
    end_time?: string;
    venue: string;
    description?: string;
    attendee_limit?: number;
    auto_approve?: boolean;
    is_paid_event?: boolean;
    ticket_price?: number;
    event_type?: "physical" | "online" | "hybrid";
    meeting_url?: string;
    meeting_platform?: "zoom" | "google_meet" | "teams" | "custom";
    status?: "draft" | "active";
  }
) {
  assertScope(ctx, "events:write");
  const supabase = adminClient();
  const plan = await getUserPlan(supabase, ctx.userId);

  // Check plan event limit
  if (!plan.unlimited) {
    const { count } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("organizer_id", ctx.userId)
      .in("status", ["draft", "active"]);

    if ((count ?? 0) >= plan.maxEvents) {
      throw new Error(
        `Plan event limit reached (${plan.maxEvents} events). Please upgrade to create more events.`
      );
    }
  }

  const slugBase = params.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const apply_slug = `${slugBase}-${randomSuffix}`;

  const initialStatus = params.status || "draft";

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      organizer_id: ctx.userId,
      organization_id: ctx.organizationId || null,
      name: params.name.trim(),
      event_date: params.event_date,
      start_time: params.start_time,
      end_time: params.end_time || null,
      venue: params.venue.trim(),
      description: params.description?.trim() || null,
      attendee_limit: params.attendee_limit ?? Math.min(100, plan.maxAttendees),
      auto_approve: params.auto_approve ?? false,
      is_paid_event: params.is_paid_event ?? false,
      ticket_price: params.ticket_price ?? 0,
      event_type: params.event_type ?? "physical",
      meeting_url: params.meeting_url || null,
      meeting_platform: params.meeting_platform || null,
      apply_slug,
      status: initialStatus,
      application_enabled: true,
    })
    .select("*")
    .single();

  if (error || !event) {
    throw new Error(`Failed to create event: ${error?.message}`);
  }

  void recordEnterpriseAudit({
    organizationId: event.organization_id || "personal",
    eventId: event.id,
    userId: ctx.userId,
    actorEmail: ctx.actorEmail || "claude-mcp@urpass.space",
    action: "CREATE_EVENT",
    resourceType: "event",
    resourceId: event.id,
    newValues: event,
    details: { channel: "mcp" },
  });

  return {
    event,
    applyUrl: `https://urpass.space/apply/${event.apply_slug || event.id}`,
    editorUrl: `https://urpass.space/event/${event.id}`,
    message: `Draft event '${event.name}' created successfully.`,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. list_attendees
// ─────────────────────────────────────────────────────────────
export async function mcpListAttendees(
  ctx: McpToolContext,
  params: {
    eventId: string;
    status?: "all" | "pending" | "approved" | "rejected";
    query?: string;
    limit?: number;
    offset?: number;
  }
) {
  const supabase = adminClient();
  // Ensure user owns event
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const limit = Math.min(Math.max(params.limit ?? 50, 1), 100);
  const offset = Math.max(params.offset ?? 0, 0);

  let q = supabase
    .from("attendees")
    .select(
      "id, name, email, phone, pass_type, application_status, pass_status, created_at, passes(id, pass_token, status)",
      { count: "exact" }
    )
    .eq("event_id", params.eventId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (params.status && params.status !== "all") {
    q = q.eq("application_status", params.status);
  }

  if (params.query) {
    const term = params.query.trim().toLowerCase();
    q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data: attendees, error, count } = await q;
  if (error) throw new Error(`Failed to list attendees: ${error.message}`);

  return {
    attendees: attendees ?? [],
    total: count ?? 0,
    limit,
    offset,
  };
}

// ─────────────────────────────────────────────────────────────
// 5. approve_attendee
// ─────────────────────────────────────────────────────────────
export async function mcpApproveAttendee(
  ctx: McpToolContext,
  params: { attendeeId: string; eventId: string }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, venue, attendee_limit")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  // Check capacity
  const { count: approvedCount } = await supabase
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("event_id", params.eventId)
    .eq("application_status", "approved");

  if ((approvedCount ?? 0) >= event.attendee_limit) {
    throw new Error(`Event is at maximum capacity (${event.attendee_limit}).`);
  }

  // Update attendee status
  const { data: attendee, error: attError } = await supabase
    .from("attendees")
    .update({ application_status: "approved" })
    .eq("id", params.attendeeId)
    .eq("event_id", params.eventId)
    .select("id, name, email, pass_type")
    .single();

  if (attError || !attendee) {
    throw new Error(`Failed to approve attendee: ${attError?.message}`);
  }

  // Generate pass if not exists
  let passToken: string | null = null;
  const { data: existingPass } = await supabase
    .from("passes")
    .select("pass_token")
    .eq("attendee_id", attendee.id)
    .eq("event_id", params.eventId)
    .maybeSingle();

  if (existingPass) {
    passToken = existingPass.pass_token;
  } else {
    const { data: newPass, error: passErr } = await supabase
      .from("passes")
      .insert({
        event_id: params.eventId,
        attendee_id: attendee.id,
        pass_type: attendee.pass_type,
      })
      .select("pass_token")
      .single();

    if (!passErr && newPass) {
      passToken = newPass.pass_token;
      await supabase
        .from("attendees")
        .update({ pass_status: "generated" })
        .eq("id", attendee.id);

      sendPassEmail({
        to: attendee.email,
        attendeeName: attendee.name,
        eventName: event.name,
        eventDate: event.event_date,
        venue: event.venue,
        passToken: newPass.pass_token,
        passType: attendee.pass_type,
      }).catch((err: unknown) => console.error("[mcp email]", err));
    }
  }

  return {
    success: true,
    message: `Attendee ${attendee.name} approved successfully`,
    passToken,
    passUrl: passToken ? `https://urpass.space/pass/${passToken}` : null,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. reject_attendee
// ─────────────────────────────────────────────────────────────
export async function mcpRejectAttendee(
  ctx: McpToolContext,
  params: { attendeeId: string; eventId: string }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const { error } = await supabase
    .from("attendees")
    .update({ application_status: "rejected" })
    .eq("id", params.attendeeId)
    .eq("event_id", params.eventId);

  if (error) throw new Error(`Failed to reject attendee: ${error.message}`);

  return { success: true, message: "Attendee rejected successfully" };
}

// ─────────────────────────────────────────────────────────────
// 7. lookup_pass
// ─────────────────────────────────────────────────────────────
export async function mcpLookupPass(
  ctx: McpToolContext,
  params: { passTokenOrEmail: string; eventId?: string }
) {
  const supabase = adminClient();
  const search = params.passTokenOrEmail.trim();

  let passQuery = supabase
    .from("passes")
    .select("id, pass_token, pass_type, status, generated_at, event_id, attendee_id, events(id, name, organizer_id), attendees(name, email, phone, application_status)");

  if (search.includes("@")) {
    const { data: attendee } = await supabase
      .from("attendees")
      .select("id, event_id")
      .eq("email", search)
      .maybeSingle();

    if (!attendee) throw new Error(`No attendee found with email: ${search}`);
    passQuery = passQuery.eq("attendee_id", attendee.id);
  } else {
    // Strip URL if full pass URL was provided
    const cleanToken = search.replace(/^https?:\/\/[^\/]+\/pass\//, "");
    passQuery = passQuery.eq("pass_token", cleanToken);
  }

  if (params.eventId) {
    passQuery = passQuery.eq("event_id", params.eventId);
  }

  const { data: pass, error } = await passQuery.maybeSingle();
  if (error || !pass) throw new Error("Pass not found");

  const event = pass.events as unknown as { id: string; name: string; organizer_id: string } | null;
  if (!event || event.organizer_id !== ctx.userId) {
    throw new Error("Pass found but you do not have permission to view this event");
  }

  // Get check-in details if checked in
  const { data: checkIn } = await supabase
    .from("check_ins")
    .select("checked_in_at, check_in_method")
    .eq("pass_id", pass.id)
    .maybeSingle();

  return {
    passToken: pass.pass_token,
    passType: pass.pass_type,
    status: pass.status,
    attendee: pass.attendees,
    event: { id: event.id, name: event.name },
    checkInDetails: checkIn || null,
    passUrl: `https://urpass.space/pass/${pass.pass_token}`,
  };
}

// ─────────────────────────────────────────────────────────────
// 8. verify_checkin
// ─────────────────────────────────────────────────────────────
export async function mcpVerifyCheckin(
  ctx: McpToolContext,
  params: { passToken: string; eventId: string; gateId?: string }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const cleanToken = params.passToken.trim().replace(/^https?:\/\/[^\/]+\/pass\//, "");

  const { data: pass } = await supabase
    .from("passes")
    .select("id, pass_token, pass_type, status, attendee_id")
    .eq("pass_token", cleanToken)
    .eq("event_id", params.eventId)
    .single();

  if (!pass) throw new Error("Pass not found for this event");

  const { data: attendee } = await supabase
    .from("attendees")
    .select("id, name, email, pass_type, application_status")
    .eq("id", pass.attendee_id)
    .single();

  if (pass.status === "revoked") {
    return {
      success: false,
      accessDenied: true,
      status: "REVOKED",
      message: "Pass has been revoked by the organizer.",
      attendee,
      passType: pass.pass_type,
    };
  }

  if (
    pass.status === "cancelled" ||
    attendee?.application_status === "cancelled" ||
    attendee?.application_status === "cancellation_requested"
  ) {
    return {
      success: false,
      accessDenied: true,
      status: "CANCELLED",
      message: "Ticket has been cancelled. Entry Denied.",
      attendee,
      passType: pass.pass_type,
    };
  }

  if (pass.status === "checked_in") {
    return {
      success: false,
      alreadyCheckedIn: true,
      message: `Pass has ALREADY been checked in.`,
      attendee,
      passType: pass.pass_type,
    };
  }

  // Record check-in
  const { error: ciError } = await supabase.from("check_ins").insert({
    pass_id: pass.id,
    event_id: params.eventId,
    attendee_id: pass.attendee_id,
    checked_in_by: ctx.userId,
    gate_id: params.gateId || null,
    check_in_method: "mcp",
  });

  if (ciError && ciError.code === "23505") {
    return {
      success: false,
      alreadyCheckedIn: true,
      message: `Pass has ALREADY been checked in concurrently.`,
      attendee,
      passType: pass.pass_type,
    };
  }

  await supabase.from("passes").update({ status: "checked_in" }).eq("id", pass.id);
  await supabase.from("attendees").update({ pass_status: "checked_in" }).eq("id", pass.attendee_id);

  return {
    success: true,
    message: `Successfully checked in ${attendee?.name || "Attendee"}`,
    attendee,
    passType: pass.pass_type,
    checkedInAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// 9. get_event_analytics
// ─────────────────────────────────────────────────────────────
export async function mcpGetEventAnalytics(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, venue, attendee_limit, is_paid_event, ticket_price")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const [
    { data: attendees },
    { data: checkIns },
    { data: orders },
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("application_status, pass_status, pass_type, created_at")
      .eq("event_id", params.eventId),
    supabase
      .from("check_ins")
      .select("checked_in_at, check_in_method")
      .eq("event_id", params.eventId),
    supabase
      .from("ticket_orders")
      .select("amount, status, created_at")
      .eq("event_id", params.eventId)
      .eq("status", "paid"),
  ]);

  const list = attendees ?? [];
  const total = list.length;
  const approved = list.filter((a) => a.application_status === "approved").length;
  const pending = list.filter((a) => a.application_status === "pending").length;
  const rejected = list.filter((a) => a.application_status === "rejected").length;
  const checkedIn = (checkIns ?? []).length;

  const totalRevenuePaise = (orders ?? []).reduce((acc, o) => acc + (o.amount || 0), 0);

  return {
    eventName: event.name,
    eventDate: event.event_date,
    metrics: {
      totalApplications: total,
      approved,
      pending,
      rejected,
      checkedIn,
      attendanceRatePct: approved > 0 ? Math.round((checkedIn / approved) * 100) : 0,
      capacity: event.attendee_limit,
      capacityOccupiedPct: event.attendee_limit
        ? Math.round((approved / event.attendee_limit) * 100)
        : 0,
      totalRevenue: `₹${(totalRevenuePaise / 100).toLocaleString("en-IN")}`,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// 10. issue_pass
// ─────────────────────────────────────────────────────────────
export async function mcpIssuePass(
  ctx: McpToolContext,
  params: {
    eventId: string;
    name: string;
    email: string;
    phone?: string;
    passType?: string;
  }
) {
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, event_date, venue, attendee_limit")
    .eq("id", params.eventId)
    .eq("organizer_id", ctx.userId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");

  const pass_type = params.passType || "participant";

  // Create attendee as approved
  const { data: attendee, error: attError } = await supabase
    .from("attendees")
    .insert({
      event_id: params.eventId,
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      phone: params.phone?.trim() || null,
      pass_type,
      application_status: "approved",
      pass_status: "generated",
    })
    .select("id, name, email")
    .single();

  if (attError || !attendee) {
    if (attError?.code === "23505") {
      throw new Error(`Attendee with email ${params.email} is already registered for this event.`);
    }
    throw new Error(`Failed to issue pass: ${attError?.message}`);
  }

  // Create pass
  const { data: pass, error: passError } = await supabase
    .from("passes")
    .insert({
      event_id: params.eventId,
      attendee_id: attendee.id,
      pass_type,
      status: "generated",
    })
    .select("pass_token")
    .single();

  if (passError || !pass) {
    throw new Error(`Failed to generate pass token: ${passError?.message}`);
  }

  sendPassEmail({
    to: attendee.email,
    attendeeName: attendee.name,
    eventName: event.name,
    eventDate: event.event_date,
    venue: event.venue,
    passToken: pass.pass_token,
    passType: pass_type,
  }).catch((err: unknown) => console.error("[mcp issue_pass email]", err));

  return {
    success: true,
    message: `Pass generated and emailed to ${attendee.email}`,
    attendeeId: attendee.id,
    passToken: pass.pass_token,
    passUrl: `https://urpass.space/pass/${pass.pass_token}`,
  };
}

// ─────────────────────────────────────────────────────────────
// Conference Management Tools
// ─────────────────────────────────────────────────────────────

async function verifyOrganizerEvent(
  supabase: ReturnType<typeof adminClient>,
  eventId: string,
  userId: string
) {
  const { data: event, error } = await supabase
    .from("events")
    .select("id, name, organizer_id")
    .eq("id", eventId)
    .single();

  if (error || !event || event.organizer_id !== userId) {
    throw new Error(`Event not found or unauthorized: ${eventId}`);
  }
  return event;
}

// 11. list_sessions
export async function mcpListSessions(
  ctx: McpToolContext,
  params: { eventId: string; date?: string; roomId?: string; trackId?: string; limit?: number }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  let query = supabase
    .from("event_sessions")
    .select(`
      id,
      title,
      session_type,
      description,
      session_date,
      start_time,
      end_time,
      capacity,
      registration_required,
      checkin_enabled,
      status,
      room:event_rooms(id, name, capacity),
      track:event_tracks(id, name, color),
      speakers:session_speakers(role, speaker:event_speakers(id, full_name, job_title, company))
    `)
    .eq("event_id", params.eventId)
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (params.date) query = query.eq("session_date", params.date);
  if (params.roomId) query = query.eq("room_id", params.roomId);
  if (params.trackId) query = query.eq("track_id", params.trackId);
  if (params.limit) query = query.limit(params.limit);

  const { data: sessions, error } = await query;
  if (error) throw new Error(`Failed to list sessions: ${error.message}`);

  return {
    eventId: params.eventId,
    total: sessions?.length || 0,
    sessions: sessions || [],
  };
}

// 12. create_session
export async function mcpCreateSession(
  ctx: McpToolContext,
  params: {
    eventId: string;
    title: string;
    session_type?: string;
    session_date: string;
    start_time: string;
    end_time: string;
    room_id?: string;
    track_id?: string;
    capacity?: number;
    registration_required?: boolean;
    description?: string;
  }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  if (params.room_id) {
    const { data: existingSessions } = await supabase
      .from("event_sessions")
      .select("id, title, room_id, session_date, start_time, end_time")
      .eq("event_id", params.eventId)
      .eq("room_id", params.room_id)
      .eq("session_date", params.session_date);

    const conflict = checkRoomConflict(
      {
        session_date: params.session_date,
        start_time: params.start_time,
        end_time: params.end_time,
        room_id: params.room_id,
      },
      (existingSessions || []) as EventSession[]
    );

    if (conflict) {
      throw new Error(`Schedule Conflict: ${conflict.message}`);
    }
  }

  const slug = `${slugify(params.title)}-${Date.now().toString(36)}`;

  const { data: session, error } = await supabase
    .from("event_sessions")
    .insert({
      event_id: params.eventId,
      title: params.title.trim(),
      slug,
      session_type: params.session_type || "presentation",
      session_date: params.session_date,
      start_time: params.start_time,
      end_time: params.end_time,
      room_id: params.room_id || null,
      track_id: params.track_id || null,
      capacity: params.capacity || null,
      registration_required: params.registration_required ?? false,
      description: params.description || null,
      status: "published",
    })
    .select("*")
    .single();

  if (error || !session) {
    throw new Error(`Failed to create session: ${error?.message}`);
  }

  return {
    success: true,
    message: `Session "${session.title}" created successfully.`,
    session,
  };
}

// 13. list_rooms
export async function mcpListRooms(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  const { data: rooms, error } = await supabase
    .from("event_rooms")
    .select("id, name, location, floor, capacity, checkin_enabled, description")
    .eq("event_id", params.eventId)
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to list rooms: ${error.message}`);
  return { eventId: params.eventId, rooms: rooms || [] };
}

// 14. list_speakers
export async function mcpListSpeakers(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  const { data: speakers, error } = await supabase
    .from("event_speakers")
    .select("id, full_name, job_title, company, bio, linkedin_url, website_url, email, visibility")
    .eq("event_id", params.eventId)
    .order("display_order", { ascending: true });

  if (error) throw new Error(`Failed to list speakers: ${error.message}`);
  return { eventId: params.eventId, speakers: speakers || [] };
}

// 15. assign_speaker
export async function mcpAssignSpeaker(
  ctx: McpToolContext,
  params: { sessionId: string; speakerId: string; role?: string }
) {
  const supabase = adminClient();

  const { data: session } = await supabase
    .from("event_sessions")
    .select("id, event_id, title, session_date, start_time, end_time")
    .eq("id", params.sessionId)
    .single();

  if (!session) throw new Error("Session not found");
  await verifyOrganizerEvent(supabase, session.event_id, ctx.userId);

  const { data: speakerSessions } = await supabase
    .from("session_speakers")
    .select(`
      session_id,
      session:event_sessions (id, title, session_date, start_time, end_time)
    `)
    .eq("speaker_id", params.speakerId);

  const existingSpeakerSessions = (speakerSessions || [])
    .map((s: any) => (Array.isArray(s.session) ? s.session[0] : s.session))
    .filter(Boolean);

  const conflicts = checkSpeakerConflicts(
    session as EventSession,
    [params.speakerId],
    existingSpeakerSessions as EventSession[]
  );

  if (conflicts.length > 0) {
    throw new Error(`Speaker Double-Booking: ${conflicts[0].message}`);
  }

  const { error } = await supabase
    .from("session_speakers")
    .upsert({
      session_id: params.sessionId,
      speaker_id: params.speakerId,
      role: params.role || "speaker",
    });

  if (error) throw new Error(`Failed to assign speaker: ${error.message}`);

  return {
    success: true,
    message: `Speaker assigned to session "${session.title}" as ${params.role || "speaker"}.`,
  };
}

// 16. verify_session_checkin
export async function mcpVerifySessionCheckin(
  ctx: McpToolContext,
  params: { sessionId: string; passToken: string; override?: boolean }
) {
  const supabase = adminClient();

  const { data: session } = await supabase
    .from("event_sessions")
    .select("id, event_id, title, capacity, registration_required, checkin_enabled, room:event_rooms(name, capacity)")
    .eq("id", params.sessionId)
    .single();

  if (!session) throw new Error("Session not found");
  await verifyOrganizerEvent(supabase, session.event_id, ctx.userId);

  let cleanToken = params.passToken.trim();
  if (cleanToken.includes("/pass/")) {
    cleanToken = cleanToken.split("/pass/")[1].split("?")[0];
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanToken);
  let passQuery = supabase
    .from("passes")
    .select("id, pass_token, pass_type, event_id, attendee:attendees(id, name, email, application_status)");

  const { data: pass } = await (isUuid
    ? passQuery.or(`id.eq.${cleanToken},pass_token.eq.${cleanToken}`)
    : passQuery.eq("pass_token", cleanToken)
  ).maybeSingle();

  if (!pass) throw new Error("Invalid QR Pass: Pass not found");
  if (pass.event_id !== session.event_id) throw new Error("Pass registered for a different event");

  const attendee = (pass as any).attendee;
  if (!attendee || attendee.application_status === "rejected") {
    throw new Error("Attendee application rejected or invalid");
  }

  const { data: existingCheckIn } = await supabase
    .from("session_checkins")
    .select("id, checkin_time")
    .eq("session_id", params.sessionId)
    .eq("attendee_id", attendee.id)
    .maybeSingle();

  if (existingCheckIn) {
    return {
      status: "ALREADY_CHECKED_IN",
      message: `Already checked in at ${new Date(existingCheckIn.checkin_time).toLocaleTimeString()}`,
      attendee: { name: attendee.name, email: attendee.email },
      sessionTitle: session.title,
    };
  }

  if (session.registration_required && !params.override) {
    const { data: res } = await supabase
      .from("session_reservations")
      .select("id, status")
      .eq("session_id", params.sessionId)
      .eq("attendee_id", attendee.id)
      .maybeSingle();

    if (!res || res.status !== "reserved") {
      throw new Error(`ACCESS NOT ALLOWED: ${attendee.name} has not reserved a seat in this session.`);
    }
  }

  const checkinTime = new Date().toISOString();
  await supabase
    .from("session_checkins")
    .insert({
      event_id: session.event_id,
      session_id: session.id,
      attendee_id: attendee.id,
      pass_id: pass.id,
      checkin_time: checkinTime,
      checkin_source: "mcp",
      sync_status: "synced",
    });

  const roomObj = Array.isArray(session.room) ? session.room[0] : (session.room as any);

  return {
    status: "CHECKED_IN",
    success: true,
    message: `✓ Checked in: ${attendee.name} to ${session.title}`,
    attendee: { name: attendee.name, email: attendee.email },
    sessionTitle: session.title,
    room: roomObj?.name || "Main Venue",
    checkinTime,
  };
}

// 17. get_conference_analytics
export async function mcpGetConferenceAnalytics(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  const supabase = adminClient();
  await verifyOrganizerEvent(supabase, params.eventId, ctx.userId);

  const { data: sessionsRaw } = await supabase
    .from("event_sessions")
    .select("id, title, room_id, capacity, session_date, start_time, end_time, status")
    .eq("event_id", params.eventId);

  const sessionIds = ((sessionsRaw || []) as Array<{ id: string }>).map((s) => s.id);

  const [
    { data: roomsRaw },
    { count: speakersCount },
    { count: tracksCount },
    { data: reservationsRaw },
    { data: checkinsRaw },
  ] = await Promise.all([
    supabase
      .from("event_rooms")
      .select("id, name, capacity")
      .eq("event_id", params.eventId),

    supabase
      .from("event_speakers")
      .select("id", { count: "exact", head: true })
      .eq("event_id", params.eventId),

    supabase
      .from("event_tracks")
      .select("id", { count: "exact", head: true })
      .eq("event_id", params.eventId),

    sessionIds.length > 0
      ? supabase
          .from("session_reservations")
          .select("session_id, status")
          .in("session_id", sessionIds)
      : Promise.resolve({ data: [] }),

    supabase
      .from("session_checkins")
      .select("session_id, checkin_time")
      .eq("event_id", params.eventId),
  ]);

  const sessions = (sessionsRaw || []) as unknown as EventSession[];
  const rooms = (roomsRaw || []) as unknown as EventRoom[];
  const reservations = (reservationsRaw || []) as Array<{ session_id: string; status: string }>;
  const checkins = (checkinsRaw || []) as Array<{ session_id: string; checkin_time: string }>;

  const analytics = computeConferenceAnalytics(
    sessions,
    rooms,
    speakersCount || 0,
    tracksCount || 0,
    reservations,
    checkins
  );

  return {
    eventId: params.eventId,
    analytics,
  };
}

// ─────────────────────────────────────────────────────────────
// 18. update_event
// ─────────────────────────────────────────────────────────────
export async function mcpUpdateEvent(
  ctx: McpToolContext,
  params: {
    eventId: string;
    name?: string;
    event_date?: string;
    start_time?: string;
    end_time?: string;
    venue?: string;
    description?: string;
    attendee_limit?: number;
    is_paid_event?: boolean;
    ticket_price?: number;
    auto_approve?: boolean;
    event_type?: "physical" | "online" | "hybrid";
    meeting_url?: string;
  }
) {
  assertScope(ctx, "events:write");
  const supabase = adminClient();

  const { data: existing, error: findErr } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.eventId)
    .single();

  if (findErr || !existing) {
    throw new Error(`Event not found: ${params.eventId}`);
  }

  if (existing.organizer_id !== ctx.userId && existing.organization_id !== ctx.organizationId) {
    throw new Error("Unauthorized to edit this event");
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (params.name !== undefined) updates.name = params.name.trim();
  if (params.event_date !== undefined) updates.event_date = params.event_date;
  if (params.start_time !== undefined) updates.start_time = params.start_time;
  if (params.end_time !== undefined) updates.end_time = params.end_time;
  if (params.venue !== undefined) updates.venue = params.venue.trim();
  if (params.description !== undefined) updates.description = params.description.trim();
  if (params.attendee_limit !== undefined) updates.attendee_limit = params.attendee_limit;
  if (params.is_paid_event !== undefined) updates.is_paid_event = params.is_paid_event;
  if (params.ticket_price !== undefined) updates.ticket_price = params.ticket_price;
  if (params.auto_approve !== undefined) updates.auto_approve = params.auto_approve;
  if (params.event_type !== undefined) updates.event_type = params.event_type;
  if (params.meeting_url !== undefined) updates.meeting_url = params.meeting_url;

  const { data: updated, error: updateErr } = await supabase
    .from("events")
    .update(updates)
    .eq("id", params.eventId)
    .select("*")
    .single();

  if (updateErr || !updated) {
    throw new Error(`Failed to update event: ${updateErr?.message}`);
  }

  void recordEnterpriseAudit({
    organizationId: updated.organization_id || "personal",
    eventId: updated.id,
    userId: ctx.userId,
    actorEmail: ctx.actorEmail || "claude-mcp@urpass.space",
    action: "UPDATE_EVENT",
    resourceType: "event",
    resourceId: updated.id,
    oldValues: existing,
    newValues: updated,
    details: { channel: "mcp" },
  });

  return {
    success: true,
    message: `Event '${updated.name}' updated successfully`,
    event: updated,
  };
}

// ─────────────────────────────────────────────────────────────
// 19. list_ticket_tiers
// ─────────────────────────────────────────────────────────────
export async function mcpListTicketTiers(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  assertScope(ctx, "tickets:read");
  const supabase = adminClient();

  const [{ data: tiers, error }, { data: attendees }] = await Promise.all([
    supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", params.eventId)
      .order("created_at", { ascending: true }),
    supabase
      .from("attendees")
      .select("id, ticket_type_id, application_status")
      .eq("event_id", params.eventId)
      .eq("application_status", "approved"),
  ]);

  if (error) throw new Error(`Failed to list ticket tiers: ${error.message}`);

  const soldCountByTier: Record<string, number> = {};
  for (const a of attendees ?? []) {
    if (a.ticket_type_id) {
      soldCountByTier[a.ticket_type_id] = (soldCountByTier[a.ticket_type_id] || 0) + 1;
    }
  }

  return {
    eventId: params.eventId,
    tiers: (tiers ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category || "general",
      priceINR: (t.price || 0) / 100,
      pricePaise: t.price || 0,
      capacity: t.capacity,
      soldCount: soldCountByTier[t.id] || 0,
      status: t.status || "active",
      maxPerPerson: t.max_per_person || 1,
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// 20. create_ticket_tier
// ─────────────────────────────────────────────────────────────
export async function mcpCreateTicketTier(
  ctx: McpToolContext,
  params: {
    eventId: string;
    name: string;
    price: number;
    capacity?: number;
    category?: string;
    description?: string;
    maxPerPerson?: number;
  }
) {
  assertScope(ctx, "tickets:write");
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", params.eventId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");
  if (event.organizer_id !== ctx.userId && event.organization_id !== ctx.organizationId) {
    throw new Error("Unauthorized to create ticket tiers for this event");
  }

  const pricePaise = Math.round((params.price || 0) * 100);
  const tierData = {
    event_id: params.eventId,
    name: params.name.trim(),
    price: pricePaise,
    capacity: params.capacity ?? null,
    category: params.category || "general",
    description: params.description?.trim() || null,
    max_per_person: params.maxPerPerson || 1,
    status: "active",
  };

  const { data: created, error } = await supabase
    .from("ticket_types")
    .insert(tierData)
    .select("*")
    .single();

  if (error || !created) {
    throw new Error(`Failed to create ticket tier: ${error?.message}`);
  }

  void recordEnterpriseAudit({
    organizationId: event.organization_id || "personal",
    eventId: event.id,
    userId: ctx.userId,
    actorEmail: ctx.actorEmail || "claude-mcp@urpass.space",
    action: "CREATE_TICKET_TIER",
    resourceType: "ticket_type",
    resourceId: created.id,
    newValues: created,
    details: { channel: "mcp" },
  });

  return {
    success: true,
    message: `Ticket tier '${created.name}' created at ₹${params.price}`,
    tier: {
      id: created.id,
      name: created.name,
      priceINR: params.price,
      pricePaise,
      capacity: created.capacity,
      status: created.status,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// 21. get_registrations
// ─────────────────────────────────────────────────────────────
export async function mcpGetRegistrations(
  ctx: McpToolContext,
  params: {
    eventId: string;
    status?: "all" | "pending" | "approved" | "rejected";
    query?: string;
    limit?: number;
    offset?: number;
    unmaskPII?: boolean;
  }
) {
  assertScope(ctx, "attendees:read");
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, organizer_id, organization_id")
    .eq("id", params.eventId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");
  if (event.organizer_id !== ctx.userId && event.organization_id !== ctx.organizationId) {
    throw new Error("Unauthorized to view registrations for this event");
  }

  const limit = Math.min(Math.max(params.limit ?? 50, 1), 100);
  const offset = Math.max(params.offset ?? 0, 0);

  let q = supabase
    .from("attendees")
    .select("id, name, email, phone, pass_type, application_status, pass_status, created_at", { count: "exact" })
    .eq("event_id", params.eventId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (params.status && params.status !== "all") {
    q = q.eq("application_status", params.status);
  }

  if (params.query) {
    const term = params.query.trim().toLowerCase();
    q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data: attendees, error, count } = await q;
  if (error) throw new Error(`Failed to list registrations: ${error.message}`);

  const maskEmail = (email: string) => {
    const [user, domain] = email.split("@");
    if (!domain) return "***";
    const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
    return `${maskedUser}@${domain}`;
  };

  const maskPhone = (phone?: string | null) => {
    if (!phone) return null;
    const clean = phone.trim();
    if (clean.length < 5) return "***";
    return `${clean.slice(0, 3)}*****${clean.slice(-2)}`;
  };

  const records = (attendees ?? []).map((att) => ({
    id: att.id,
    name: att.name,
    email: params.unmaskPII ? att.email : maskEmail(att.email),
    phone: params.unmaskPII ? att.phone : maskPhone(att.phone),
    passType: att.pass_type,
    applicationStatus: att.application_status,
    passStatus: att.pass_status,
    registeredAt: att.created_at,
  }));

  return {
    eventId: params.eventId,
    registrations: records,
    total: count ?? 0,
    limit,
    offset,
    piiProtected: !params.unmaskPII,
  };
}

// ─────────────────────────────────────────────────────────────
// 22. get_event_readiness
// ─────────────────────────────────────────────────────────────
export async function mcpGetEventReadiness(
  ctx: McpToolContext,
  params: { eventId: string }
) {
  assertScope(ctx, "events:read");
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, status")
    .eq("id", params.eventId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");
  if (event.organizer_id !== ctx.userId && event.organization_id !== ctx.organizationId) {
    throw new Error("Unauthorized to inspect readiness for this event");
  }

  const result = await validateEventPreflightReadiness(params.eventId, supabase);

  return {
    eventId: event.id,
    eventName: event.name,
    status: event.status,
    readyToPublish: result.ready,
    errors: result.errors.map((e) => ({ id: e.id, title: e.title, message: e.message })),
    warnings: result.warnings.map((w) => ({ id: w.id, title: w.title, message: w.message })),
    checksPassed: result.items.filter((i) => i.passed).length,
    totalChecks: result.items.length,
  };
}

// ─────────────────────────────────────────────────────────────
// 23. get_scanner_stats
// ─────────────────────────────────────────────────────────────
export async function mcpGetScannerStats(
  ctx: McpToolContext,
  params: { eventId: string; gateId?: string }
) {
  assertScope(ctx, "analytics:read");
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, name, attendee_limit, organizer_id, organization_id")
    .eq("id", params.eventId)
    .single();

  if (!event) throw new Error("Event not found or unauthorized");
  if (event.organizer_id !== ctx.userId && event.organization_id !== ctx.organizationId) {
    throw new Error("Unauthorized to access scanner telemetry");
  }

  let checkinQuery = supabase
    .from("check_ins")
    .select("id, gate_id, checked_in_at, check_in_method")
    .eq("event_id", params.eventId);

  if (params.gateId) {
    checkinQuery = checkinQuery.eq("gate_id", params.gateId);
  }

  const [{ data: checkIns }, { count: approvedCount }] = await Promise.all([
    checkinQuery,
    supabase
      .from("attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", params.eventId)
      .eq("application_status", "approved"),
  ]);

  const list = checkIns ?? [];
  const totalCheckedIn = list.length;
  const totalApproved = approvedCount ?? 0;
  const remaining = Math.max(0, totalApproved - totalCheckedIn);

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const scansLastHour = list.filter((c) => (c.checked_in_at || "") >= oneHourAgo).length;

  const gateCounts: Record<string, number> = {};
  for (const c of list) {
    const gate = c.gate_id || "Main Entrance";
    gateCounts[gate] = (gateCounts[gate] || 0) + 1;
  }

  return {
    eventId: event.id,
    eventName: event.name,
    totalApproved,
    totalCheckedIn,
    remainingToEnter: remaining,
    checkInVelocityPerHour: scansLastHour,
    turnoutRatePct: totalApproved > 0 ? Math.round((totalCheckedIn / totalApproved) * 100) : 0,
    gateBreakdown: gateCounts,
  };
}

// ─────────────────────────────────────────────────────────────
// 24. publish_event
// ─────────────────────────────────────────────────────────────
export async function mcpPublishEvent(
  ctx: McpToolContext,
  params: { eventId: string; confirm?: boolean }
) {
  assertScope(ctx, "events:write");
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.eventId)
    .single();

  if (!event) throw new Error("Event not found");
  if (event.organizer_id !== ctx.userId && event.organization_id !== ctx.organizationId) {
    throw new Error("Unauthorized to publish this event");
  }

  if (event.status === "active") {
    return {
      success: true,
      alreadyActive: true,
      message: "Event is already published and active.",
      liveUrl: `https://urpass.space/apply/${event.apply_slug || event.id}`,
    };
  }

  const preflight = await validateEventPreflightReadiness(params.eventId, supabase);
  if (!preflight.ready) {
    throw new Error(
      `Cannot publish: Pre-flight readiness checks failed:\n• ${preflight.errors.map((e) => e.message).join("\n• ")}`
    );
  }

  const plan = await getUserPlan(supabase, event.organizer_id);
  const eventsLimit = plan.getLimit("events_per_month");
  if (eventsLimit < 999_999) {
    const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const { count: publishedThisMonth } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("organizer_id", event.organizer_id)
      .eq("status", "active")
      .gte("created_at", periodStart.toISOString());

    if ((publishedThisMonth ?? 0) >= eventsLimit) {
      throw new Error(
        `Plan monthly event publish limit reached (${eventsLimit} events). Upgrade required.`
      );
    }
  }

  if (!params.confirm) {
    return {
      requiresConfirmation: true,
      message: `Event '${event.name}' is ready to publish. Please pass confirm: true to make it live to attendees.`,
      preflightPassed: true,
      projectedUrl: `https://urpass.space/apply/${event.apply_slug || event.id}`,
    };
  }

  const { data: published, error } = await supabase
    .from("events")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", params.eventId)
    .select("*")
    .single();

  if (error || !published) throw new Error(`Failed to publish event: ${error?.message}`);

  void recordEnterpriseAudit({
    organizationId: published.organization_id || "personal",
    eventId: published.id,
    userId: ctx.userId,
    actorEmail: ctx.actorEmail || "claude-mcp@urpass.space",
    action: "PUBLISH_EVENT",
    resourceType: "event",
    resourceId: published.id,
    newValues: { status: "active" },
    details: { channel: "mcp" },
  });

  return {
    success: true,
    message: `Event '${published.name}' has been published successfully!`,
    liveUrl: `https://urpass.space/apply/${published.apply_slug || published.id}`,
    event: published,
  };
}

// ─────────────────────────────────────────────────────────────
// 25. submit_to_explore
// ─────────────────────────────────────────────────────────────
export async function mcpSubmitToExplore(
  ctx: McpToolContext,
  params: {
    eventId: string;
    city: string;
    category: string;
    editorialSummary?: string;
    confirm?: boolean;
  }
) {
  assertScope(ctx, "events:write");
  const supabase = adminClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.eventId)
    .single();

  if (!event) throw new Error("Event not found");
  if (event.organizer_id !== ctx.userId && event.organization_id !== ctx.organizationId) {
    throw new Error("Unauthorized to submit this event to Explore");
  }

  const eligibility = await getExploreEligibility(params.eventId, {
    city: params.city,
    category: params.category,
    editorialSummary: params.editorialSummary,
  });

  if (!eligibility.ready) {
    throw new Error(`Event is not eligible for Explore: ${eligibility.issues[0] || "Requirements not met."}`);
  }

  if (!params.confirm) {
    return {
      requiresConfirmation: true,
      message: `Event '${event.name}' is eligible for UrPass Explore. Pass confirm: true to submit for marketplace moderation review.`,
      eligibility,
    };
  }

  const { data: listing, error } = await supabase
    .from("explore_marketplace_listings")
    .upsert(
      {
        event_id: params.eventId,
        city: params.city,
        category: params.category,
        editorial_summary: params.editorialSummary?.trim() || null,
        status: "pending",
        venue_address: event.venue,
        min_price_paise: eligibility.minPricePaise,
        currency: "INR",
        is_free: eligibility.isFree,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "event_id" }
    )
    .select("*")
    .single();

  if (error) throw new Error(`Failed to submit Explore listing: ${error.message}`);

  void recordEnterpriseAudit({
    organizationId: event.organization_id || "personal",
    eventId: event.id,
    userId: ctx.userId,
    actorEmail: ctx.actorEmail || "claude-mcp@urpass.space",
    action: "SUBMIT_TO_EXPLORE",
    resourceType: "explore_listing",
    resourceId: params.eventId,
    newValues: listing,
    details: { channel: "mcp" },
  });

  return {
    success: true,
    message: `Event '${event.name}' submitted to UrPass Explore moderation queue.`,
    listingStatus: "pending",
    reviewNotice: "Listing will appear on UrPass Explore city hubs once verified by moderation.",
  };
}
