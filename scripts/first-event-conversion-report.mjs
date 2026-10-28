// Usage: node scripts/first-event-conversion-report.mjs 2026-10-26
// Prints the signup cohort beginning on the given UTC Monday; no data is changed.
import { createClient } from "@supabase/supabase-js";

const today = new Date();
const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
const daysSinceMonday = (todayUtc.getUTCDay() + 6) % 7;
const lastMonday = new Date(todayUtc.getTime() - (daysSinceMonday + 7) * 24 * 60 * 60 * 1000);
const weekStart = new Date(process.argv[2] || lastMonday.toISOString().slice(0, 10));
if (Number.isNaN(weekStart.getTime()) || weekStart.getUTCDay() !== 1) {
  throw new Error("Pass a UTC Monday in YYYY-MM-DD format.");
}
const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase URL and service role key are required.");
const db = createClient(url, key, { auth: { persistSession: false } });

async function pages(makeQuery) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await makeQuery().range(offset, offset + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 1000) return rows;
  }
}

const signups = await pages(() => db.from("conversion_events")
  .select("user_id, created_at, utm_source, device_category, metadata")
  .eq("event_name", "signup_completed")
  .gte("created_at", weekStart.toISOString())
  .lt("created_at", weekEnd.toISOString())
  .order("created_at", { ascending: true }));
const signupByUser = new Map(signups.filter((row) => row.user_id).map((row) => [row.user_id, row]));
const ids = [...signupByUser.keys()];
const events = [];
for (let i = 0; i < ids.length; i += 100) {
  const batch = ids.slice(i, i + 100);
  events.push(...await pages(() => db.from("conversion_events")
    .select("user_id, event_name, created_at, metadata")
    .in("user_id", batch).order("created_at", { ascending: true })));
}
const byUser = new Map();
for (const event of events) {
  const existing = byUser.get(event.user_id) || { stages: new Set(), plan: "none", billingInterval: "none", category: "unknown" };
  existing.stages.add(event.event_name);
  if (event.metadata?.plan) existing.plan = event.metadata.plan;
  if (event.metadata?.billing_interval) existing.billingInterval = event.metadata.billing_interval;
  if (event.metadata?.event_category) existing.category = event.metadata.event_category;
  byUser.set(event.user_id, existing);
}

const dimensions = ["acquisitionSource", "landingPage", "eventCategory", "device", "billingInterval", "selectedPlan"];
const stages = ["first_event_draft_created", "subscription_plan_selected", "autopay_authorization_started",
  "autopay_authorized", "subscription_activated", "free_plan_activated", "first_event_published"];
const report = { weekStart: weekStart.toISOString(), weekEnd: weekEnd.toISOString(),
  signups: ids.length, stages: Object.fromEntries(stages.map((name) => [name, 0])), segments: {} };
for (const [userId, signup] of signupByUser) {
  const journey = byUser.get(userId) || { stages: new Set(), plan: "none", billingInterval: "none", category: "unknown" };
  for (const stage of stages) if (journey.stages.has(stage)) report.stages[stage]++;
  const values = {
    acquisitionSource: signup.utm_source || "direct",
    landingPage: signup.metadata?.landing_page || "unknown",
    eventCategory: journey.category,
    device: signup.device_category || "unknown",
    billingInterval: journey.billingInterval,
    selectedPlan: journey.plan,
  };
  for (const dimension of dimensions) {
    const key = `${dimension}:${values[dimension]}`;
    const segment = report.segments[key] ||= { signups: 0, stages: Object.fromEntries(stages.map((name) => [name, 0])) };
    segment.signups++;
    for (const stage of stages) if (journey.stages.has(stage)) segment.stages[stage]++;
  }
}
const ratio = (numerator, denominator) => denominator ? Number((numerator / denominator).toFixed(4)) : null;
report.rates = {
  signupToDraft: ratio(report.stages.first_event_draft_created, report.signups),
  draftToPlan: ratio(report.stages.subscription_plan_selected + report.stages.free_plan_activated, report.stages.first_event_draft_created),
  planToAutopay: ratio(report.stages.autopay_authorized, report.stages.subscription_plan_selected),
  autopayToActive: ratio(report.stages.subscription_activated, report.stages.autopay_authorized),
  signupToPublished: ratio(report.stages.first_event_published, report.signups),
  signupToPaying: ratio(report.stages.subscription_activated, report.signups),
};
report.recommendations = [];
if (report.stages.first_event_draft_created >= 20 && report.rates.draftToPlan !== null && report.rates.draftToPlan < 0.6) {
  report.recommendations.push({ area: "plan selection", proposal: "Test clearer plan CTA wording and an ordering based on expected registrations.", status: "review_required" });
}
if (report.stages.subscription_plan_selected >= 20 && report.rates.planToAutopay !== null && report.rates.planToAutopay < 0.6) {
  report.recommendations.push({ area: "AutoPay", proposal: "Review authorization failure and interruption records; add billing help near the authorize button.", status: "review_required" });
}
if (report.stages.first_event_draft_created >= 20 && report.rates.signupToPublished !== null && report.rates.signupToPublished < 0.3) {
  report.recommendations.push({ area: "event activation", proposal: "Review setup blockers and test a guided checklist for date, venue, registration form and QR pass.", status: "review_required" });
}
console.log(JSON.stringify(report, null, 2));
