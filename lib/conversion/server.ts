import { adminClient } from "@/lib/supabase/admin";
import { TrackConversionPayload } from "./types";

/**
 * Server-side conversion recorder.
 * Handles idempotent event storage and first & last touch visitor attribution.
 */
export async function recordServerConversion(payload: TrackConversionPayload) {
  if (!payload.eventName || !payload.pageSlug) {
    return { error: "Missing required eventName or pageSlug" };
  }

  try {
    const admin = adminClient();
    const sessionId = payload.sessionId || `server_${payload.userId || "anon"}`;

    // 1. Maintain Visitor Session (First-Touch & Last-Touch)
    const { data: existingSession } = await admin
      .from("conversion_visitor_sessions")
      .select("id, user_id, first_touch_url")
      .eq("anonymous_session_id", sessionId)
      .maybeSingle();

    if (!existingSession) {
      await admin.from("conversion_visitor_sessions").insert({
        anonymous_session_id: sessionId,
        user_id: payload.userId || null,
        visitor_segment: payload.visitorSegment || "general",
        device_category: payload.deviceCategory || "desktop",
        first_touch_url: payload.landingUrl || null,
        first_touch_page_slug: payload.pageSlug,
        first_touch_cluster: payload.contentCluster || null,
        first_touch_utm_source: payload.utmSource || null,
        first_touch_utm_medium: payload.utmMedium || null,
        first_touch_utm_campaign: payload.utmCampaign || null,
        first_touch_utm_content: payload.utmContent || null,
        first_touch_referrer: payload.referrer || null,
        last_touch_url: payload.landingUrl || null,
        last_touch_page_slug: payload.pageSlug,
        last_touch_cluster: payload.contentCluster || null,
        last_touch_utm_source: payload.utmSource || null,
        last_touch_utm_medium: payload.utmMedium || null,
        last_touch_utm_campaign: payload.utmCampaign || null,
        last_touch_utm_content: payload.utmContent || null,
        last_touch_referrer: payload.referrer || null,
      });
    } else {
      const updatePayload: Record<string, unknown> = {
        last_touch_page_slug: payload.pageSlug,
        last_touch_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (payload.landingUrl) updatePayload.last_touch_url = payload.landingUrl;
      if (payload.contentCluster) updatePayload.last_touch_cluster = payload.contentCluster;
      if (payload.utmSource) updatePayload.last_touch_utm_source = payload.utmSource;
      if (payload.utmMedium) updatePayload.last_touch_utm_medium = payload.utmMedium;
      if (payload.utmCampaign) updatePayload.last_touch_utm_campaign = payload.utmCampaign;
      if (payload.utmContent) updatePayload.last_touch_utm_content = payload.utmContent;
      if (payload.referrer) updatePayload.last_touch_referrer = payload.referrer;
      if (payload.userId && !existingSession.user_id) updatePayload.user_id = payload.userId;

      await admin
        .from("conversion_visitor_sessions")
        .update(updatePayload)
        .eq("id", existingSession.id);
    }

    // 2. Insert Idempotent Conversion Event
    const { error: insertError } = await admin.from("conversion_events").insert({
      event_name: payload.eventName,
      session_id: sessionId,
      user_id: payload.userId || null,
      page_slug: payload.pageSlug,
      content_cluster: payload.contentCluster || null,
      visitor_segment: payload.visitorSegment || "general",
      cta_position: payload.ctaPosition || null,
      experiment_id: payload.experimentId || null,
      variant_id: payload.variantId || null,
      device_category: payload.deviceCategory || "desktop",
      utm_source: payload.utmSource || null,
      utm_medium: payload.utmMedium || null,
      utm_campaign: payload.utmCampaign || null,
      utm_content: payload.utmContent || null,
      referrer: payload.referrer || null,
      idempotency_key: payload.idempotencyKey || null,
      metadata: payload.metadata || {},
    });

    if (insertError && insertError.code !== "23505") {
      console.warn("[conversion-recorder] Insert error:", insertError.message);
      return { error: insertError.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[conversion-recorder] Exception:", err);
    return { error: err instanceof Error ? err.message : "Internal error" };
  }
}

/**
 * Links an anonymous session to an authenticated user ID upon signup/login.
 */
export async function linkSessionToUserId(sessionId: string, userId: string) {
  if (!sessionId || !userId) return;
  try {
    const admin = adminClient();
    await Promise.allSettled([
      admin
        .from("conversion_visitor_sessions")
        .update({ user_id: userId, updated_at: new Date().toISOString() })
        .eq("anonymous_session_id", sessionId)
        .is("user_id", null),
      admin
        .from("conversion_events")
        .update({ user_id: userId })
        .eq("session_id", sessionId)
        .is("user_id", null),
    ]);
  } catch (e) {
    console.warn("[conversion-link] Link error:", e);
  }
}

/**
 * Derives signup abandonment by scanning sessions that triggered signup_started
 * more than 30 minutes ago without a matching signup_completed event.
 */
export async function deriveSignupAbandonment(timeWindowMinutes = 30): Promise<number> {
  try {
    const admin = adminClient();
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000).toISOString();
    const windowStart = new Date(Date.now() - (timeWindowMinutes + 60) * 60 * 1000).toISOString();

    // 1. Get sessions with signup_started within window
    const { data: startedEvents } = await admin
      .from("conversion_events")
      .select("session_id, page_slug, visitor_segment, utm_source, utm_medium, utm_campaign, created_at")
      .eq("event_name", "signup_started")
      .gte("created_at", windowStart)
      .lte("created_at", cutoffTime);

    if (!startedEvents || startedEvents.length === 0) return 0;

    const sessionIds = Array.from(new Set(startedEvents.map((e) => e.session_id)));

    // 2. Check which sessions completed signup
    const { data: completedEvents } = await admin
      .from("conversion_events")
      .select("session_id")
      .eq("event_name", "signup_completed")
      .in("session_id", sessionIds);

    const completedSessionSet = new Set((completedEvents || []).map((e) => e.session_id));

    // 3. Check which sessions already have signup_abandoned recorded
    const { data: alreadyAbandoned } = await admin
      .from("conversion_events")
      .select("session_id")
      .eq("event_name", "signup_abandoned")
      .in("session_id", sessionIds);

    const alreadyAbandonedSet = new Set((alreadyAbandoned || []).map((e) => e.session_id));

    let count = 0;
    for (const evt of startedEvents) {
      if (!completedSessionSet.has(evt.session_id) && !alreadyAbandonedSet.has(evt.session_id)) {
        alreadyAbandonedSet.add(evt.session_id);
        count++;
        await admin.from("conversion_events").insert({
          event_name: "signup_abandoned",
          session_id: evt.session_id,
          page_slug: evt.page_slug,
          visitor_segment: evt.visitor_segment,
          utm_source: evt.utm_source,
          utm_medium: evt.utm_medium,
          utm_campaign: evt.utm_campaign,
          idempotency_key: `abandoned:${evt.session_id}`,
          metadata: {
            started_at: evt.created_at,
            derived_at: new Date().toISOString(),
            window_minutes: timeWindowMinutes,
          },
        });
      }
    }

    return count;
  } catch (err) {
    console.error("[deriveSignupAbandonment] Error:", err);
    return 0;
  }
}
