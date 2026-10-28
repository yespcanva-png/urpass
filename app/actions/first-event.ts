"use server";

import { createClient } from "@/lib/supabase/server";
import { findAvailableEventSlug } from "@/app/actions/events";
import { recordFirstEventConversion } from "@/lib/conversion/first-event";
import { firstEventConversionEnabledFor } from "@/lib/feature-flags/first-event";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getRazorpayClient } from "@/lib/razorpay";
import { cookies } from "next/headers";
import { ANON_SESSION_COOKIE } from "@/lib/conversion/attribution";
import { linkSessionToUserId } from "@/lib/conversion/server";

export async function recordSignupCompletion() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || Date.now() - new Date(user.created_at).getTime() > 15 * 60 * 1000) return;
  const sessionId = (await cookies()).get(ANON_SESSION_COOKIE)?.value;
  if (sessionId) await linkSessionToUserId(sessionId, user.id);
  await recordFirstEventConversion({ userId: user.id, eventName: "signup_completed",
    idempotencyKey: `signup:${user.id}`, pageSlug: "/signup" });
}

export async function saveQuickFirstEventDraft(input: {
  name: string;
  expectedRegistrations: number;
}): Promise<{ eventId?: string; error?: string }> {
  const name = input.name?.trim();
  const expectedRegistrations = Number(input.expectedRegistrations);
  if (!name || name.length < 2 || name.length > 160) {
    return { error: "Enter an event name between 2 and 160 characters." };
  }
  if (!Number.isInteger(expectedRegistrations) || expectedRegistrations < 1 || expectedRegistrations > 100000) {
    return { error: "Expected registrations must be between 1 and 100,000." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to save your event draft." };
  if (!firstEventConversionEnabledFor(user.id)) return { error: "Quick event creation is not available yet." };

  const { data: existing, error: lookupError } = await supabase
    .from("events")
    .select("id, is_onboarding_draft")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (lookupError) return { error: "Could not check your existing events. Please try again." };
  if (existing) {
    if (existing.is_onboarding_draft) return { eventId: existing.id };
    return { error: "You already have an event. Continue from your event dashboard." };
  }

  const applySlug = await findAvailableEventSlug(supabase, name);
  const { data: inserted, error } = await supabase.from("events").insert({
    organizer_id: user.id,
    name,
    event_date: null,
    start_time: null,
    end_time: null,
    venue: null,
    attendee_limit: expectedRegistrations,
    expected_registrations: expectedRegistrations,
    onboarding_category: "corporate",
    onboarding_objective: "collect_registrations",
    is_onboarding_draft: true,
    status: "draft",
    application_enabled: true,
    apply_slug: applySlug,
  }).select("id").single();

  if (error?.code === "23505") {
    const { data: concurrent } = await supabase.from("events")
      .select("id")
      .eq("organizer_id", user.id)
      .eq("is_onboarding_draft", true)
      .eq("status", "draft")
      .maybeSingle();
    if (concurrent) return { eventId: concurrent.id };
  }
  if (error || !inserted) return { error: error?.message || "Could not save your event draft." };
  await recordFirstEventConversion({ userId: user.id, eventId: inserted.id,
    eventName: "first_event_draft_created", idempotencyKey: `first-draft:${inserted.id}`,
    metadata: { event_category: "corporate", expected_registrations: expectedRegistrations } });
  return { eventId: inserted.id };
}

export async function recordFirstEventCheckoutState(input: {
  draftId: string; subscriptionId: string; state: "autopay_authorization_started" | "checkout_failed";
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const [{ data: draft }, { data: intent }] = await Promise.all([
    supabase.from("events").select("id").eq("id", input.draftId)
      .eq("organizer_id", user.id).eq("is_onboarding_draft", true).maybeSingle(),
    supabase.from("subscription_checkout_intents").select("id, plan_slug")
      .eq("user_id", user.id).eq("provider_subscription_id", input.subscriptionId).maybeSingle(),
  ]);
  if (!draft || !intent) return;
  await recordFirstEventConversion({ userId: user.id, eventId: draft.id,
    eventName: input.state, idempotencyKey: `${input.state}:${intent.id}`,
    planSlug: intent.plan_slug, billingCycle: "monthly" });
}

export async function cancelPendingFirstEventCheckout(subscriptionId: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to manage this checkout." };
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { error: "Checkout management is unavailable." };
  const admin = createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: intent } = await admin.from("subscription_checkout_intents")
    .select("id, status").eq("user_id", user.id)
    .eq("provider_subscription_id", subscriptionId).maybeSingle();
  if (!intent || intent.status !== "pending") return { error: "No pending checkout was found." };
  try {
    const razorpay = getRazorpayClient();
    const subscriptions = razorpay.subscriptions as unknown as {
      fetch: (id: string) => Promise<{ status: string }>;
      cancel: (id: string, options: { cancel_at_cycle_end: number }) => Promise<unknown>;
    };
    const provider = await subscriptions.fetch(subscriptionId);
    if (provider?.status === "active") return { error: "This subscription is already active. Cancel future renewals in Billing." };
    if (provider?.status !== "cancelled") {
      await subscriptions.cancel(subscriptionId, { cancel_at_cycle_end: 0 });
    }
    const { error } = await admin.from("subscription_checkout_intents")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", intent.id).eq("status", "pending");
    return error ? { error: "Razorpay cancelled checkout, but local reconciliation is pending. Contact support." } : { success: true };
  } catch {
    return { error: "Could not confirm cancellation with Razorpay. Retry before starting another checkout." };
  }
}
