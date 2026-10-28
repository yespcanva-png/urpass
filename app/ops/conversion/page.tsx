import type { Metadata } from "next";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getConversionDashboardData } from "@/app/actions/conversion-dashboard";
import OpsConversionClient from "@/components/ops/OpsConversionClient";

export const metadata: Metadata = {
  title: "Signup Conversion Agent (Agent 01) | URPASS Ops",
  description: "Monitor organizer signup funnels, intent-based CTAs, A/B experiments, and AI growth recommendations.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function OpsConversionPage() {
  const isAuthenticated = await isOpsAuthenticated();
  let data = null;

  if (isAuthenticated) {
    try {
      data = await getConversionDashboardData(30);
    } catch (err) {
      console.error("[OpsConversionPage] Error loading conversion data:", err);
    }
  }

  return (
    <OpsConversionClient
      initialAuthenticated={isAuthenticated}
      initialData={data}
    />
  );
}
