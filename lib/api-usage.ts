import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

function adminClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export type UsageMetric = "api_requests" | "registrations" | "check_ins" | "events";

export async function recordApiUsage(
  userId: string,
  metric: UsageMetric,
  count = 1
): Promise<void> {
  if (!userId || count <= 0) return;
  const supabase = adminClient();
  if (!supabase) return;

  const yearMonth = new Date().toISOString().slice(0, 7);

  try {
    const { data: existing } = await supabase
      .from("api_usage")
      .select("id, api_requests, registrations, check_ins, events")
      .eq("user_id", userId)
      .eq("year_month", yearMonth)
      .maybeSingle();

    if (existing) {
      const currentVal = (existing[metric] ?? 0) as number;
      await supabase
        .from("api_usage")
        .update({
          [metric]: currentVal + count,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("api_usage").insert({
        user_id: userId,
        year_month: yearMonth,
        api_requests: metric === "api_requests" ? count : 0,
        registrations: metric === "registrations" ? count : 0,
        check_ins: metric === "check_ins" ? count : 0,
        events: metric === "events" ? count : 0,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error(`Failed to record API usage for user ${userId}:`, err);
  }
}
