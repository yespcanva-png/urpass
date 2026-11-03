import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getRazorpayClient } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: intent, error } = await admin.from("subscription_checkout_intents")
    .select("id, provider_subscription_id, expires_at").eq("user_id", user.id)
    .eq("status", "pending").maybeSingle();
  if (error) return NextResponse.json({ error: "Checkout lookup failed." }, { status: 503 });
  if (!intent) return NextResponse.json({ success: true, alreadyCancelled: true });
  if (intent.provider_subscription_id) {
    try {
      const api = getRazorpayClient().subscriptions as unknown as {
        fetch: (id: string) => Promise<{ status?: string }>;
        cancel: (id: string, options: { cancel_at_cycle_end: number }) => Promise<unknown>;
      };
      const provider = await api.fetch(intent.provider_subscription_id);
      if (!["created", "authenticated", "pending", "halted", "cancelled"].includes(String(provider.status || ""))) {
        return NextResponse.json({ error: "A charge or activation may exist. Reconcile this subscription before cancelling checkout." }, { status: 409 });
      }
      if (provider.status !== "cancelled") await api.cancel(intent.provider_subscription_id, { cancel_at_cycle_end: 0 });
    } catch (cause) {
      console.error("[billing-checkout-cancel] provider cancellation failed", { intentId: intent.id, cause });
      return NextResponse.json({ error: "Razorpay cancellation could not be confirmed." }, { status: 503 });
    }
  }
  const { error: updateError } = await admin.from("subscription_checkout_intents")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", intent.id).eq("status", "pending");
  if (updateError) return NextResponse.json({ error: "Checkout cancellation could not be saved." }, { status: 503 });
  return NextResponse.json({ success: true });
}
