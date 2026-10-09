"use client";

import { useParams } from "next/navigation";
import TicketDistributionDashboard from "@/components/tickets/TicketDistributionDashboard";

export default function OrderDistributePage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  return (
    <div className="min-h-screen bg-neutral-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <TicketDistributionDashboard orderId={orderId} />
      </div>
    </div>
  );
}
