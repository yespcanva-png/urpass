import type { Metadata } from "next";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getOpsBillingData } from "@/app/actions/ops-billing";
import OpsBillingClient from "@/components/ops/OpsBillingClient";

export const metadata: Metadata = {
  title: "Billing & Subscriptions Control | URPASS Ops",
  description: "Operations command center for Razorpay autopay, managed service orders, deposit collections, and audit trails.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function OpsBillingPage() {
  const isAuthenticated = await isOpsAuthenticated();
  let billingData = {
    subscriptions: [],
    managedOrders: [],
    auditLogs: [],
    metrics: {
      activeSubscribers: 0,
      pastDueSubscribers: 0,
      managedOrdersCount: 0,
      managedRevenueInr: 0,
    },
  };

  if (isAuthenticated) {
    try {
      const data = await getOpsBillingData();
      if (data && !("error" in data)) {
        billingData = data as any;
      }
    } catch (err) {
      console.error("[OpsBillingPage] Failed loading data:", err);
    }
  }

  return (
    <OpsBillingClient
      initialAuthenticated={isAuthenticated}
      initialData={billingData}
    />
  );
}
