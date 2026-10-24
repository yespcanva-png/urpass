import type { Metadata } from "next";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getCampaignDashboardData } from "@/app/actions/campaigns";
import OpsCampaignsClient from "@/components/ops/OpsCampaignsClient";

export const metadata: Metadata = {
  title: "SEO & Growth Engine Command | URPASS Ops",
  description: "Monitor 40 SEO/GEO landing pages, organic attribution, conversion funnels, and managed service pipeline.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function OpsCampaignsPage() {
  const isAuthenticated = await isOpsAuthenticated();
  let inquiries: any[] = [];
  let conversions: any[] = [];

  if (isAuthenticated) {
    try {
      const data = await getCampaignDashboardData();
      if (data) {
        inquiries = data.inquiries || [];
        conversions = data.conversions || [];
      }
    } catch (err) {
      console.error("[OpsCampaignsPage] Error loading campaign data:", err);
    }
  }

  return (
    <OpsCampaignsClient
      initialAuthenticated={isAuthenticated}
      initialInquiries={inquiries}
      initialConversions={conversions}
    />
  );
}
