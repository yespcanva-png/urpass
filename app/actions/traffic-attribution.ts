"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { linkTrafficVisitorToUser, TRAFFIC_CONSENT_COOKIE, TRAFFIC_VISITOR_COOKIE } from "@/lib/traffic/server";

export async function linkCurrentTrafficAttribution() {
  const cookieStore = await cookies();
  if (cookieStore.get(TRAFFIC_CONSENT_COOKIE)?.value !== "1") return;
  const visitorId = cookieStore.get(TRAFFIC_VISITOR_COOKIE)?.value;
  if (!visitorId) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) await linkTrafficVisitorToUser(visitorId, user.id);
}
