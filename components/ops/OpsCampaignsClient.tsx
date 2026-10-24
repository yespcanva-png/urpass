"use client";

import { useState } from "react";
import OpsPinModal from "./OpsPinModal";
import OpsCampaignsDashboard from "./OpsCampaignsDashboard";

interface Props {
  initialAuthenticated: boolean;
  initialInquiries: any[];
  initialConversions: any[];
}

export default function OpsCampaignsClient({
  initialAuthenticated,
  initialInquiries,
  initialConversions,
}: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);

  if (!authenticated) {
    return <OpsPinModal onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <OpsCampaignsDashboard
      initialInquiries={initialInquiries}
      initialConversions={initialConversions}
    />
  );
}
