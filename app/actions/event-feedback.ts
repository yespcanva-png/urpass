"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { createOrganizerNotification } from "./in-app-notifications";
import { revalidatePath } from "next/cache";
import {
  type EventFeedbackFormConfig,
  type AttendeeFeedbackSubmission,
  type FeedbackAnalyticsStats,
  getDefaultFormConfig,
  createEmptyStats,
  calculateFeedbackStats,
} from "@/lib/event-feedback";

export type {
  FeedbackAspect,
  FeedbackCustomQuestion,
  EventFeedbackFormConfig,
  AttendeeFeedbackSubmission,
  FeedbackAnalyticsStats,
} from "@/lib/event-feedback";

function getAdminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function verifyOrganizer(supabase: Awaited<ReturnType<typeof createClient>>, eventId: string, userId: string) {
  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, apply_slug")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) return null;
  if (event.organizer_id === userId) return event;

  if (event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", userId)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager"])
      .maybeSingle();
    if (member) return event;
  }

  return null;
}

/**
 * Fetch feedback form configuration for an event (public or organizer).
 */
export async function getEventFeedbackForm(eventIdOrSlug: string): Promise<{
  form: EventFeedbackFormConfig;
  event: {
    id: string;
    name: string;
    event_date: string;
    venue: string;
    apply_slug: string | null;
    logo_url: string | null;
    organizer_id: string;
  } | null;
  error?: string;
}> {
  const admin = getAdminClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventIdOrSlug);

  // Fetch event
  let eventQuery = admin
    .from("events")
    .select("id, name, event_date, venue, apply_slug, logo_url, organizer_id");

  if (isUuid) {
    eventQuery = eventQuery.eq("id", eventIdOrSlug);
  } else {
    eventQuery = eventQuery.eq("apply_slug", eventIdOrSlug);
  }

  const { data: event, error: eventErr } = await eventQuery.maybeSingle();

  if (eventErr || !event) {
    return {
      form: getDefaultFormConfig(eventIdOrSlug),
      event: null,
      error: "Event not found",
    };
  }

  const eventId = event.id;
  const defaultConfig = getDefaultFormConfig(eventId, event.name);

  // 1. Try relational table
  try {
    const { data: formRow, error: formErr } = await admin
      .from("event_feedback_forms")
      .select("*")
      .eq("event_id", eventId)
      .maybeSingle();

    if (!formErr && formRow) {
      return {
        form: {
          ...defaultConfig,
          ...formRow,
          questions: formRow.questions && formRow.questions.length > 0 ? formRow.questions : defaultConfig.questions,
          theme: formRow.theme ?? defaultConfig.theme,
          thank_you: formRow.thank_you ?? defaultConfig.thank_you,
          aspects: formRow.aspects ?? defaultConfig.aspects,
          custom_questions: formRow.custom_questions ?? defaultConfig.custom_questions,
        },
        event,
      };
    }
  } catch {
    // Table doesn't exist yet, fallback
  }

  // 2. Fallback: Check event_communications config row
  try {
    const { data: commRow } = await admin
      .from("event_communications")
      .select("subject, sent_at")
      .eq("event_id", eventId)
      .eq("type", "feedback_form_config")
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (commRow?.subject) {
      const parsed = JSON.parse(commRow.subject) as Partial<EventFeedbackFormConfig>;
      return {
        form: {
          ...defaultConfig,
          ...parsed,
          questions: parsed.questions && parsed.questions.length > 0 ? parsed.questions : defaultConfig.questions,
          theme: parsed.theme ?? defaultConfig.theme,
          thank_you: parsed.thank_you ?? defaultConfig.thank_you,
          aspects: parsed.aspects ?? defaultConfig.aspects,
          custom_questions: parsed.custom_questions ?? defaultConfig.custom_questions,
        },
        event,
      };
    }
  } catch {
    // Fallback parsing failed
  }

  return { form: defaultConfig, event };
}

/**
 * Save / update the feedback form configuration (Organizer only).
 */
export async function saveEventFeedbackForm(
  eventId: string,
  updates: Partial<EventFeedbackFormConfig>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const event = await verifyOrganizer(supabase, eventId, user.id);
  if (!event) return { success: false, error: "Insufficient permissions for this event" };

  const admin = getAdminClient();
  const currentConfigRes = await getEventFeedbackForm(eventId);
  const updatedConfig: EventFeedbackFormConfig = {
    ...currentConfigRes.form,
    ...updates,
    event_id: eventId,
    updated_at: new Date().toISOString(),
  };

  let savedInTable = false;

  // 1. Try upserting into event_feedback_forms
  try {
    const { error } = await admin
      .from("event_feedback_forms")
      .upsert(
        {
          event_id: eventId,
          title: updatedConfig.title,
          description: updatedConfig.description,
          is_enabled: updatedConfig.is_enabled,
          allow_anonymous: updatedConfig.allow_anonymous,
          require_attendee_email: updatedConfig.require_attendee_email,
          questions: updatedConfig.questions,
          theme: updatedConfig.theme,
          thank_you: updatedConfig.thank_you,
          aspects: updatedConfig.aspects,
          enable_nps: updatedConfig.enable_nps,
          nps_question: updatedConfig.nps_question,
          custom_questions: updatedConfig.custom_questions,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "event_id" }
      );

    if (!error) savedInTable = true;
  } catch {
    // Table not migrated yet
  }

  // 2. Always maintain backup sync in event_communications
  try {
    await admin
      .from("event_communications")
      .delete()
      .eq("event_id", eventId)
      .eq("type", "feedback_form_config");

    await admin.from("event_communications").insert({
      event_id: eventId,
      type: "feedback_form_config",
      subject: JSON.stringify(updatedConfig),
      recipient_count: 1,
      sent_by: user.id,
    });
  } catch (err) {
    if (!savedInTable) {
      console.error("Failed to save feedback form config:", err);
      return { success: false, error: "Failed to save feedback form configuration." };
    }
  }

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/feedback`);
  revalidatePath(`/feedback/${eventId}`);
  if (event.apply_slug) {
    revalidatePath(`/feedback/${event.apply_slug}`);
  }

  return { success: true };
}

/**
 * Submit feedback for an event (Public attendee action).
 */
export async function submitAttendeeFeedback(
  eventId: string,
  payload: {
    attendee_name?: string;
    attendee_email?: string;
    rating?: number;
    nps_score?: number | null;
    feedback_text?: string;
    aspects?: Record<string, number>;
    answers?: Record<string, string | string[] | number | boolean>;
  }
): Promise<{ success: boolean; error?: string }> {
  const admin = getAdminClient();

  // Validate event existence and if feedback is enabled
  const { form, event, error: formErr } = await getEventFeedbackForm(eventId);
  if (formErr || !event) {
    return { success: false, error: "Event not found." };
  }

  if (!form.is_enabled) {
    return { success: false, error: "Feedback submissions for this event are currently closed." };
  }

  if (form.require_attendee_email && (!payload.attendee_email || !payload.attendee_email.includes("@"))) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (form.require_attendee_name && (!payload.attendee_name || payload.attendee_name.trim().length === 0)) {
    return { success: false, error: "Please provide your name." };
  }

  // Auto-detect rating if not passed directly
  let finalRating = payload.rating;
  if (!finalRating && payload.answers) {
    for (const [k, v] of Object.entries(payload.answers)) {
      if (typeof v === "number" && v >= 1 && v <= 5) {
        finalRating = v;
        break;
      }
    }
  }
  if (!finalRating || finalRating < 1 || finalRating > 5) {
    finalRating = 5;
  }

  // Auto-detect NPS if not passed directly
  let finalNps = payload.nps_score;
  if ((finalNps === undefined || finalNps === null) && payload.answers) {
    for (const [k, v] of Object.entries(payload.answers)) {
      if ((k.includes("nps") || k.includes("recommend")) && typeof v === "number") {
        finalNps = v;
        break;
      }
    }
  }

  // Auto-detect text comment if feedback_text is empty
  let finalText = payload.feedback_text?.trim() || null;
  if (!finalText && payload.answers) {
    for (const [k, v] of Object.entries(payload.answers)) {
      if (typeof v === "string" && v.length > 5 && !finalText) {
        finalText = v;
      }
    }
  }

  const responseRecord: AttendeeFeedbackSubmission = {
    id: crypto.randomUUID(),
    event_id: event.id,
    attendee_name: payload.attendee_name?.trim() || (form.allow_anonymous ? "Anonymous Attendee" : "Attendee"),
    attendee_email: payload.attendee_email?.trim() || null,
    rating: Math.round(finalRating),
    nps_score: finalNps !== undefined && finalNps !== null ? Number(finalNps) : null,
    feedback_text: finalText,
    aspects: payload.aspects || {},
    answers: payload.answers || {},
    created_at: new Date().toISOString(),
  };

  let savedInTable = false;

  // 1. Try insert into relational table
  try {
    const { error: insertErr } = await admin
      .from("event_feedback_responses")
      .insert({
        id: responseRecord.id,
        event_id: responseRecord.event_id,
        attendee_name: responseRecord.attendee_name,
        attendee_email: responseRecord.attendee_email,
        rating: responseRecord.rating,
        nps_score: responseRecord.nps_score,
        feedback_text: responseRecord.feedback_text,
        aspects: responseRecord.aspects,
        answers: responseRecord.answers,
      });

    if (!insertErr) savedInTable = true;
  } catch {
    // Relational table not migrated yet
  }

  // 2. Resilient backup in event_communications
  try {
    await admin.from("event_communications").insert({
      event_id: event.id,
      type: "attendee_feedback",
      subject: JSON.stringify(responseRecord),
      recipient_count: 1,
    });
  } catch (err) {
    if (!savedInTable) {
      console.error("Feedback submission error:", err);
      return { success: false, error: "Unable to record feedback right now. Please try again." };
    }
  }

  // Notify organizer about new feedback
  try {
    if (event.organizer_id) {
      const reviewerName = responseRecord.attendee_name || "An attendee";
      await createOrganizerNotification({
        userId: event.organizer_id,
        eventId: event.id,
        title: `New Feedback for ${event.name}`,
        message: `${reviewerName} gave ${responseRecord.rating} ⭐ rating and shared post-event thoughts.`,
        type: "feedback",
        link: `/event/${event.id}/feedback`,
      });
    }
  } catch {
    // Non-blocking notification failure
  }

  revalidatePath(`/event/${event.id}`);
  revalidatePath(`/event/${event.id}/feedback`);

  return { success: true };
}

/**
 * Fetch all feedback responses and aggregated metrics for an event (Organizer only).
 */
export async function getEventFeedbackData(eventId: string): Promise<{
  form: EventFeedbackFormConfig;
  responses: AttendeeFeedbackSubmission[];
  stats: FeedbackAnalyticsStats;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      form: getDefaultFormConfig(eventId),
      responses: [],
      stats: createEmptyStats(),
      error: "Unauthorized",
    };
  }

  const event = await verifyOrganizer(supabase, eventId, user.id);
  if (!event) {
    return {
      form: getDefaultFormConfig(eventId),
      responses: [],
      stats: createEmptyStats(),
      error: "Forbidden",
    };
  }

  const admin = getAdminClient();
  const { form } = await getEventFeedbackForm(eventId);
  let responses: AttendeeFeedbackSubmission[] = [];

  // 1. Try relational table
  try {
    const { data: rows, error } = await admin
      .from("event_feedback_responses")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (!error && rows && rows.length > 0) {
      responses = rows as AttendeeFeedbackSubmission[];
    }
  } catch {
    // Relational table not migrated yet
  }

  // 2. If no rows from table, check event_communications backup
  if (responses.length === 0) {
    try {
      const { data: commRows } = await admin
        .from("event_communications")
        .select("id, subject, sent_at")
        .eq("event_id", eventId)
        .eq("type", "attendee_feedback")
        .order("sent_at", { ascending: false });

      if (commRows && commRows.length > 0) {
        responses = commRows
          .map((r) => {
            try {
              const parsed = JSON.parse(r.subject);
              return {
                id: parsed.id || r.id,
                event_id: eventId,
                attendee_name: parsed.attendee_name || "Attendee",
                attendee_email: parsed.attendee_email || null,
                rating: parsed.rating || 5,
                nps_score: parsed.nps_score ?? null,
                feedback_text: parsed.feedback_text || null,
                aspects: parsed.aspects || {},
                answers: parsed.answers || {},
                created_at: parsed.created_at || r.sent_at,
              };
            } catch {
              return null;
            }
          })
          .filter(Boolean) as AttendeeFeedbackSubmission[];
      }
    } catch {
      // Fallback read failed
    }
  }

  // Deduplicate responses by ID
  const dedupMap = new Map<string, AttendeeFeedbackSubmission>();
  for (const r of responses) {
    if (!dedupMap.has(r.id)) {
      dedupMap.set(r.id, r);
    }
  }
  const uniqueResponses = Array.from(dedupMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const stats = calculateFeedbackStats(uniqueResponses, form.aspects);

  return {
    form,
    responses: uniqueResponses,
    stats,
  };
}

/**
 * Delete a specific feedback response (Organizer only).
 */
export async function deleteEventFeedback(
  eventId: string,
  responseId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const event = await verifyOrganizer(supabase, eventId, user.id);
  if (!event) return { success: false, error: "Forbidden" };

  const admin = getAdminClient();

  // Try relational table
  try {
    await admin.from("event_feedback_responses").delete().eq("id", responseId).eq("event_id", eventId);
  } catch {
    // Ignore
  }

  // Also try deleting matching event_communications row
  try {
    const { data: rows } = await admin
      .from("event_communications")
      .select("id, subject")
      .eq("event_id", eventId)
      .eq("type", "attendee_feedback");

    if (rows) {
      for (const row of rows) {
        if (row.id === responseId || (row.subject && row.subject.includes(responseId))) {
          await admin.from("event_communications").delete().eq("id", row.id);
        }
      }
    }
  } catch {
    // Ignore
  }

  revalidatePath(`/event/${eventId}`);
  revalidatePath(`/event/${eventId}/feedback`);

  return { success: true };
}
