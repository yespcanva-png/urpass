import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { handleRazorpayWebhook } from "@/lib/razorpay-webhook";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.BILLING_WEBHOOK_RECOVERY_ENABLED !== "true") {
    return NextResponse.json({ enabled: false });
  }
  const admin = createClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: rows, error } = await admin.from("processed_webhook_events")
    .select("event_id, status, raw_body, signature, retry_count")
    .eq("provider", "razorpay").in("status", ["processing", "failed"])
    .or(`lease_until.is.null,lease_until.lt.${new Date().toISOString()}`)
    .order("received_at").limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 503 });
  let recovered = 0;
  let failed = 0;
  for (const row of rows ?? []) {
    if (!row.raw_body || !row.signature) {
      console.error("[billing-webhook-recovery] missing signed payload", { eventId: row.event_id });
      failed++;
      continue;
    }
    const replay = new NextRequest(req.url, { method: "POST", body: row.raw_body,
      headers: { "x-razorpay-signature": row.signature, "x-razorpay-event-id": row.event_id } });
    const result = await handleRazorpayWebhook(replay);
    if (result.ok) recovered++;
    else failed++;
  }
  if (failed) console.error("[billing-webhook-recovery] failures", { recovered, failed });
  return NextResponse.json({ recovered, failed, scanned: rows?.length ?? 0 });
}
