import type { Metadata } from "next";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getOpsReferralData } from "@/app/actions/ops-referrals";
import OpsReferralClient from "@/components/ops/OpsReferralClient";

export const metadata: Metadata = {
  title: "Refer & Earn Control Plane | URPASS Ops",
  description: "Monitor and manage the UrPass Give ₹100, Get ₹150 referral growth engine.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OpsReferralsPage() {
  const isAuthenticated = await isOpsAuthenticated();
  let initialData: {
    metrics: {
      totalCodes: number;
      totalSignups: number;
      totalConversions: number;
      pendingLiabilityRupees: number;
      availableLiabilityRupees: number;
    };
    rewards: any[];
    fraudFlags: any[];
    topCodes: any[];
  } = {
    metrics: {
      totalCodes: 0,
      totalSignups: 0,
      totalConversions: 0,
      pendingLiabilityRupees: 0,
      availableLiabilityRupees: 0,
    },
    rewards: [],
    fraudFlags: [],
    topCodes: [],
  };

  if (isAuthenticated) {
    const res = await getOpsReferralData();
    if (res && "success" in res && res.success) {
      initialData = {
        metrics: res.metrics,
        rewards: res.rewards,
        fraudFlags: res.fraudFlags,
        topCodes: res.topCodes,
      };
    }
  }

  return (
    <OpsReferralClient
      initialAuthenticated={isAuthenticated}
      initialData={initialData}
    />
  );
}
