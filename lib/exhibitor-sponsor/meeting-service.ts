import type { ExhibitorB2BMeeting, AttendeeExhibitorBookmark, MeetingStatus } from "./types";
import { getAdminClient } from "./db";

declare global {
  // eslint-disable-next-line no-var
  var __urpass_b2b_meetings: Record<string, ExhibitorB2BMeeting[]> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_exhibitor_bookmarks: Record<string, AttendeeExhibitorBookmark[]> | undefined;
}

if (!globalThis.__urpass_b2b_meetings) {
  globalThis.__urpass_b2b_meetings = {};
}
if (!globalThis.__urpass_exhibitor_bookmarks) {
  globalThis.__urpass_exhibitor_bookmarks = {};
}

export interface RequestMeetingInput {
  eventId: string;
  exhibitorId: string;
  attendeeId?: string;
  requesterName: string;
  requesterEmail: string;
  requesterCompany?: string;
  proposedTime: string;
  durationMinutes?: number;
  location?: string;
  meetingNotes?: string;
}

export async function requestB2BMeetingDb(input: RequestMeetingInput): Promise<ExhibitorB2BMeeting> {
  const admin = getAdminClient();
  const now = new Date().toISOString();
  const meeting: ExhibitorB2BMeeting = {
    id: `meet-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: input.eventId,
    exhibitorId: input.exhibitorId,
    attendeeId: input.attendeeId,
    requesterName: input.requesterName,
    requesterEmail: input.requesterEmail,
    requesterCompany: input.requesterCompany,
    status: "pending",
    proposedTime: input.proposedTime,
    durationMinutes: input.durationMinutes || 30,
    location: input.location || "Exhibitor Booth",
    meetingNotes: input.meetingNotes,
    createdAt: now,
  };

  if (!globalThis.__urpass_b2b_meetings![input.exhibitorId]) {
    globalThis.__urpass_b2b_meetings![input.exhibitorId] = [];
  }
  globalThis.__urpass_b2b_meetings![input.exhibitorId].unshift(meeting);

  if (!admin) return meeting;

  try {
    const { data: inserted } = await admin
      .from("exhibitor_b2b_meetings")
      .insert({
        event_id: input.eventId,
        exhibitor_id: input.exhibitorId,
        attendee_id: input.attendeeId && !input.attendeeId.startsWith("att-") ? input.attendeeId : null,
        requester_name: input.requesterName,
        requester_email: input.requesterEmail,
        requester_company: input.requesterCompany || null,
        status: "pending",
        proposed_time: input.proposedTime,
        duration_minutes: input.durationMinutes || 30,
        location: meeting.location,
        meeting_notes: input.meetingNotes || null,
      })
      .select()
      .single();

    if (inserted?.id) meeting.id = inserted.id;
  } catch (err) {
    console.warn("[meeting-service] Error creating B2B meeting in DB:", err);
  }

  return meeting;
}

export async function getExhibitorMeetingsDb(
  eventId: string,
  exhibitorId?: string
): Promise<ExhibitorB2BMeeting[]> {
  const admin = getAdminClient();
  if (!admin) {
    return exhibitorId
      ? globalThis.__urpass_b2b_meetings![exhibitorId] || []
      : Object.values(globalThis.__urpass_b2b_meetings || {}).flat();
  }

  try {
    let query = admin
      .from("exhibitor_b2b_meetings")
      .select("*")
      .eq("event_id", eventId)
      .order("proposed_time", { ascending: true });

    if (exhibitorId) query = query.eq("exhibitor_id", exhibitorId);

    const { data, error } = await query;
    if (error || !data) return [];

    const mapped: ExhibitorB2BMeeting[] = data.map((d: any) => ({
      id: d.id,
      eventId: d.event_id,
      exhibitorId: d.exhibitor_id,
      attendeeId: d.attendee_id || undefined,
      requesterName: d.requester_name,
      requesterEmail: d.requester_email,
      requesterCompany: d.requester_company || undefined,
      status: d.status as MeetingStatus,
      proposedTime: d.proposed_time,
      durationMinutes: d.duration_minutes || 30,
      location: d.location || "Exhibitor Booth",
      meetingNotes: d.meeting_notes || undefined,
      createdAt: d.created_at,
    }));

    return mapped;
  } catch (err) {
    console.warn("[meeting-service] Error reading meetings from DB:", err);
    return [];
  }
}

export async function updateMeetingStatusDb(meetingId: string, status: MeetingStatus): Promise<boolean> {
  const admin = getAdminClient();
  if (!admin) return true;

  try {
    await admin.from("exhibitor_b2b_meetings").update({ status }).eq("id", meetingId);
    return true;
  } catch (err) {
    console.warn("[meeting-service] Error updating meeting status in DB:", err);
    return false;
  }
}

export async function bookmarkExhibitorDb(
  eventId: string,
  exhibitorId: string,
  attendeeId: string,
  callbackRequested = false,
  businessCardShared = false
): Promise<AttendeeExhibitorBookmark> {
  const admin = getAdminClient();
  const now = new Date().toISOString();
  const item: AttendeeExhibitorBookmark = {
    id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    exhibitorId,
    attendeeId,
    callbackRequested,
    businessCardShared,
    createdAt: now,
  };

  if (!admin) return item;

  try {
    const { data } = await admin
      .from("attendee_exhibitor_bookmarks")
      .insert({
        event_id: eventId,
        exhibitor_id: exhibitorId,
        attendee_id: attendeeId,
        callback_requested: callbackRequested,
        business_card_shared: businessCardShared,
      })
      .select()
      .single();

    if (data?.id) item.id = data.id;
  } catch (err) {
    console.warn("[meeting-service] Error bookmarking exhibitor in DB:", err);
  }

  return item;
}

export function requestB2BMeeting(input: RequestMeetingInput): ExhibitorB2BMeeting {
  const now = new Date().toISOString();
  const meeting: ExhibitorB2BMeeting = {
    id: `meet-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: input.eventId,
    exhibitorId: input.exhibitorId,
    attendeeId: input.attendeeId,
    requesterName: input.requesterName,
    requesterEmail: input.requesterEmail,
    requesterCompany: input.requesterCompany,
    status: "pending",
    proposedTime: input.proposedTime,
    durationMinutes: input.durationMinutes || 30,
    location: input.location || "Exhibitor Booth",
    meetingNotes: input.meetingNotes,
    createdAt: now,
  };

  if (!globalThis.__urpass_b2b_meetings![input.exhibitorId]) {
    globalThis.__urpass_b2b_meetings![input.exhibitorId] = [];
  }
  globalThis.__urpass_b2b_meetings![input.exhibitorId].unshift(meeting);
  return meeting;
}

export function getExhibitorMeetings(eventId: string, exhibitorId?: string): ExhibitorB2BMeeting[] {
  if (exhibitorId) {
    return globalThis.__urpass_b2b_meetings?.[exhibitorId] || [];
  }
  return Object.values(globalThis.__urpass_b2b_meetings || {}).flat();
}

export function updateMeetingStatus(meetingId: string, status: MeetingStatus): boolean {
  for (const exhId of Object.keys(globalThis.__urpass_b2b_meetings || {})) {
    const list = globalThis.__urpass_b2b_meetings![exhId] || [];
    const target = list.find((m) => m.id === meetingId);
    if (target) {
      target.status = status;
      return true;
    }
  }
  return false;
}

export function bookmarkExhibitor(
  eventId: string,
  exhibitorId: string,
  attendeeId: string,
  callbackRequested = false,
  businessCardShared = false
): AttendeeExhibitorBookmark {
  const now = new Date().toISOString();
  const item: AttendeeExhibitorBookmark = {
    id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId,
    exhibitorId,
    attendeeId,
    callbackRequested,
    businessCardShared,
    createdAt: now,
  };

  if (!globalThis.__urpass_exhibitor_bookmarks![exhibitorId]) {
    globalThis.__urpass_exhibitor_bookmarks![exhibitorId] = [];
  }
  globalThis.__urpass_exhibitor_bookmarks![exhibitorId].push(item);
  return item;
}

