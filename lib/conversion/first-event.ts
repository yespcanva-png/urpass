import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordServerConversion } from "@/lib/conversion/server";

export type FirstEventConversionName =
  | "signup_completed" | "first_event_draft_created" | "pricing_viewed" | "subscription_plan_selected"
  | "checkout_started" | "autopay_authorization_started" | "autopay_authorized"
  | "subscription_activated" | "checkout_failed" | "free_plan_activated"
  | "registration_setup_completed" | "first_event_published";

/** Only server-verified actions call this recorder. A missing analytics migration never blocks billing or events. */
export async function recordFirstEventConversion(input: {
  userId: string; eventName: FirstEventConversionName; idempotencyKey: string;
  eventId?: string; planSlug?: string; billingCycle?: string;
  pageSlug?: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const admin = createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } });
    const { data: session } = await admin.from("conversion_visitor_sessions")
      .select("anonymous_session_id, first_touch_page_slug, first_touch_utm_source, first_touch_utm_medium, first_touch_utm_campaign, first_touch_referrer, device_category, visitor_segment")
      .eq("user_id", input.userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    await recordServerConversion({
      eventName: input.eventName,
      sessionId: session?.anonymous_session_id || `user:${input.userId}`,
      userId: input.userId,
      pageSlug: input.pageSlug || "/onboarding/first-event",
      visitorSegment: session?.visitor_segment || "corporate",
      deviceCategory: session?.device_category || "unknown",
      utmSource: session?.first_touch_utm_source || null,
      utmMedium: session?.first_touch_utm_medium || null,
      utmCampaign: session?.first_touch_utm_campaign || null,
      referrer: session?.first_touch_referrer || null,
      idempotencyKey: input.idempotencyKey,
      metadata: { event_id: input.eventId || null, plan: input.planSlug || null,
        billing_interval: input.billingCycle || null, landing_page: session?.first_touch_page_slug || null,
        ...input.metadata },
    });
  } catch (error) {
    console.error("[first-event-conversion]", error);
  }
}
