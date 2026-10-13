import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateOfferEligibility } from "@/lib/billing/engine/pricing-engine";
import type { PlanSlug, BillingCycle, CurrencyCode } from "@/lib/billing/types/subscription";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const planSlug = (searchParams.get("plan") || "pro") as PlanSlug;
  const billingCycle = (searchParams.get("cycle") || "monthly") as BillingCycle;
  const currency = (searchParams.get("currency") || "INR") as CurrencyCode;
  const orgId = searchParams.get("orgId") || null;

  const eligibility = await evaluateOfferEligibility({
    userId: user.id,
    organizationId: orgId,
    planSlug,
    billingCycle,
    currency,
  });

  return NextResponse.json(eligibility);
}
