import type { Metadata } from "next";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import OpsPageClient from "@/components/ops/OpsPageClient";

export const metadata: Metadata = {
  title: "Operations Command Center | URPASS",
  description: "Real-time system telemetry, active users, user health, and terminal logs.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function OpsPage() {
  const isAuthenticated = await isOpsAuthenticated();

  return <OpsPageClient initialAuthenticated={isAuthenticated} />;
}
