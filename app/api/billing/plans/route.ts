import { NextRequest, NextResponse } from "next/server";
import { STATIC_V2_PLANS } from "@/lib/billing/engine/pricing-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    plans: Object.entries(STATIC_V2_PLANS).map(([slug, data]) => ({
      slug,
      name: data.name,
      description: data.desc,
      inr: {
        monthly: data.inrMonthly / 100,
        annual: data.inrAnnual / 100,
      },
      gbp: {
        monthly: data.gbpMonthly / 100,
        annual: data.gbpAnnual / 100,
      },
      introOffer: null,
    })),
  });
}
