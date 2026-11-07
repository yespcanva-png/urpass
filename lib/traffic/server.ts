import { adminClient } from "@/lib/supabase/admin";

export const TRAFFIC_VISITOR_COOKIE = "urpass_traffic_vid";
export const TRAFFIC_CONSENT_COOKIE = "urpass_analytics_consent";

export function validVisitorId(value: string | null | undefined): value is string {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

export async function linkTrafficVisitorToUser(visitorId: string | null | undefined, userId: string) {
  if (!validVisitorId(visitorId) || !userId) return;
  const { error } = await adminClient().rpc("link_traffic_visitor", {
    p_visitor_id: visitorId,
    p_user_id: userId,
  });
  if (error) console.warn("[traffic] Could not link visitor attribution:", error.message);
}
