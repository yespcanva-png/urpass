import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlanLimitsBySlug } from "@/lib/plan";
import PlanChoices from "./PlanChoices";
import { recordFirstEventConversion } from "@/lib/conversion/first-event";
import { firstEventConversionEnabledFor } from "@/lib/feature-flags/first-event";

const slugs = ["free", "starter", "pro", "business"] as const;

export default async function FirstEventPlansPage({ searchParams }: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/first-event");
  if (!firstEventConversionEnabledFor(user.id)) redirect("/onboarding/subscription");
  const draftId = (await searchParams).draft;
  if (!draftId) redirect("/onboarding/first-event");
  const { data: draft } = await supabase.from("events")
    .select("id, name, attendee_limit, status, is_onboarding_draft")
    .eq("id", draftId).eq("organizer_id", user.id).maybeSingle();
  if (!draft?.is_onboarding_draft || draft.status !== "draft") redirect("/onboarding/first-event");
  await recordFirstEventConversion({ userId: user.id, eventId: draft.id,
    eventName: "pricing_viewed", idempotencyKey: `pricing:${draft.id}` });

  const [{ data: plans, error: planError }, { data: prices, error: priceError }] = await Promise.all([
    supabase.from("billing_plans").select("id, slug, name, description")
      .in("slug", ["starter", "pro", "business"]).eq("is_active", true).eq("is_public", true),
    supabase.from("billing_plan_prices").select("plan_id, currency, billing_cycle, price_paise, tax_inclusive, tax_rate_percent, version")
      .eq("currency", "INR").eq("billing_cycle", "monthly").eq("is_active", true),
  ]);
  const paidPlans = slugs.slice(1).map((slug) => {
    const plan = plans?.find((item) => item.slug === slug);
    const price = prices?.filter((item) => item.plan_id === plan?.id)
      .sort((a, b) => b.version - a.version)[0];
    const limits = getPlanLimitsBySlug(slug);
    return plan && price ? {
      slug, name: plan.name, description: plan.description || "",
      amountPaise: price.price_paise, taxInclusive: price.tax_inclusive,
      taxRatePercent: Number(price.tax_rate_percent),
      registrations: limits.getLimit("registrations_per_month"),
      events: limits.getLimit("events_per_month"), seats: limits.getLimit("organizer_seats"),
      features: ["Registration forms", "QR passes", "Email confirmations",
        ...(limits.canUse("csv_export") ? ["CSV export"] : []),
        ...(limits.canUse("custom_pass_design") ? ["Custom pass design"] : []),
        ...(limits.canUse("api_access") ? ["API and webhooks"] : [])],
    } : null;
  });
  const freeLimits = getPlanLimitsBySlug("free");
  const allPlans = [{
    slug: "free", name: "Free", description: "For your first free event",
    amountPaise: 0, taxInclusive: true, taxRatePercent: 0,
    registrations: freeLimits.getLimit("registrations_per_month"),
    events: freeLimits.getLimit("events_per_month"), seats: freeLimits.getLimit("organizer_seats"),
    features: ["Registration forms", "QR passes", "Email confirmations"],
  }, ...paidPlans.filter((item): item is NonNullable<typeof item> => item !== null)];

  return <PlanChoices draftId={draft.id} eventName={draft.name} expectedRegistrations={draft.attendee_limit}
    plans={allPlans} catalogError={Boolean(planError || priceError || paidPlans.some((item) => !item))}
    userEmail={user.email || ""} userName={String(user.user_metadata?.full_name || user.email || "Organizer")} />;
}
