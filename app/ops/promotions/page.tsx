import type { Metadata } from "next";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getAdminCampaignsAction } from "@/app/actions/explore-ads";
import MarketplacePromotionsAdmin from "@/components/ops/MarketplacePromotionsAdmin";
import type { AdCampaign, AdPerformanceRow } from "@/lib/explore/ads-types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Explore Marketplace Promotions | URPASS Ops",
  description: "Configure and manage sponsored banner placements, event campaigns, and newsletter retainers on UrPass Explore.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function OpsPromotionsPage() {
  const isAuthenticated = await isOpsAuthenticated();
  if (!isAuthenticated) {
    return <main className="min-h-screen grid place-items-center bg-slate-50 p-6"><div className="rounded-2xl bg-white border p-8 text-center"><h1 className="font-bold text-xl">Administrator access required</h1><Link href="/ops" className="text-violet-700 underline mt-4 inline-block">Open Ops sign in</Link></div></main>;
  }
  let campaigns: AdCampaign[] = [];
  let performance: AdPerformanceRow[] = [];

  try {
    const res = await getAdminCampaignsAction();
    if (res.success && res.campaigns) {
      campaigns = res.campaigns;
      performance = res.performance || [];
    }
  } catch (err) {
    console.error("[OpsPromotionsPage] Error loading campaigns:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MarketplacePromotionsAdmin
        initialCampaigns={campaigns}
        initialPerformance={performance}
      />
    </div>
  );
}
