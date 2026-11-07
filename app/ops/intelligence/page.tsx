import type { Metadata } from "next";
import OpsUserIntelligenceDashboard from "@/components/ops/OpsUserIntelligenceDashboard";
import { isOpsAuthenticated } from "@/lib/ops/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "User Intelligence & Organiser Funnel | UrPass Ops",
  robots: { index: false, follow: false },
};

export default async function OpsIntelligencePage() {
  return <OpsUserIntelligenceDashboard initialAuthenticated={await isOpsAuthenticated()} />;
}

