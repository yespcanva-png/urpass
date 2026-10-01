import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEventFinanceDataAction } from "@/app/actions/finance-payouts";
import { getEventPaymentConfigAction } from "@/app/actions/managed-payments";
import OrganizerFinanceDashboard from "@/components/payments/OrganizerFinanceDashboard";
import EventPaymentConfigForm from "@/components/payments/EventPaymentConfigForm";

export const dynamic = "force-dynamic";

export default async function EventFinancePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, is_paid_event")
    .eq("id", eventId)
    .single();

  if (!event) notFound();

  // Fetch real live finance metrics, transactions, settlements, and payout account
  const [financeData, paymentConfig] = await Promise.all([
    getEventFinanceDataAction(eventId, event.organization_id || undefined),
    getEventPaymentConfigAction(eventId),
  ]);

  const linkedAccountLabel = financeData.payoutAccount?.bankName
    ? `${financeData.payoutAccount.bankName} (${financeData.payoutAccount.accountNumberMasked})`
    : financeData.payoutAccount?.upiId || "No bank account connected yet";

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Finance, Settlements & Route Payouts
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Marketplace split settlements, transaction ledger, and automatic transfer reconciliations.
        </p>
      </div>

      {/* Finance Metrics Dashboard with Real Working Data */}
      <OrganizerFinanceDashboard
        eventId={eventId}
        organizationId={event.organization_id || undefined}
        initialMetrics={financeData.metrics}
        initialTransactions={financeData.transactions}
        initialSettlements={financeData.settlements}
        initialPayoutAccount={financeData.payoutAccount}
        customGateway={financeData.customGateway}
      />

      {/* Event Payment Architecture Configuration */}
      <div className="pt-6 border-t border-neutral-200">
        <EventPaymentConfigForm
          eventId={eventId}
          initialConfig={paymentConfig}
          linkedAccountDisplay={linkedAccountLabel}
        />
      </div>
    </div>
  );
}
