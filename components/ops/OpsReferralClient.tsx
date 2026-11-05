"use client";

import { useState } from "react";
import OpsPinModal from "./OpsPinModal";
import OpsReferralDashboard from "./OpsReferralDashboard";

interface Props {
  initialAuthenticated: boolean;
  initialData: {
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
  };
}

export default function OpsReferralClient({ initialAuthenticated, initialData }: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);

  if (!authenticated) {
    return <OpsPinModal onSuccess={() => setAuthenticated(true)} />;
  }

  return <OpsReferralDashboard initialData={initialData} />;
}
