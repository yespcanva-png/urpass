import type { Metadata } from "next";
import OpsTrafficDashboard from "@/components/ops/OpsTrafficDashboard";
import { isOpsAuthenticated } from "@/lib/ops/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Traffic Source Analytics | UrPass Ops",
  robots: { index: false, follow: false },
};

export default async function OpsTrafficPage() {
  return <OpsTrafficDashboard initialAuthenticated={await isOpsAuthenticated()} />;
}
