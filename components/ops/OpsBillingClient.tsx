"use client";

import { useState } from "react";
import OpsPinModal from "./OpsPinModal";
import OpsBillingDashboard from "./OpsBillingDashboard";

interface Props {
  initialAuthenticated: boolean;
  initialData: {
    subscriptions: any[];
    managedOrders: any[];
    auditLogs: any[];
    metrics: {
      activeSubscribers: number;
      pastDueSubscribers: number;
      managedOrdersCount: number;
      managedRevenueInr: number;
    };
  };
}

export default function OpsBillingClient({ initialAuthenticated, initialData }: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);

  if (!authenticated) {
    return <OpsPinModal onSuccess={() => setAuthenticated(true)} />;
  }

  return <OpsBillingDashboard initialData={initialData} />;
}
