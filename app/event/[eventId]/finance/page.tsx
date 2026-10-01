import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizerFinanceMetricsAction, getEventPaymentConfigAction } from "@/app/actions/managed-payments";
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id, is_paid_event")
    .eq("id", eventId)
    .single();

  if (!event) notFound();

  // Fetch metrics and config
  const [financeData, paymentConfig] = await Promise.all([
    getOrganizerFinanceMetricsAction(eventId, event.organization_id || undefined),
    getEventPaymentConfigAction(eventId),
  ]);

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

      {/* Finance Metrics Dashboard */}
      <OrganizerFinanceDashboard
        eventId={eventId}
        organizationId={event.organization_id || undefined}
        initialMetrics={financeData.metrics}
        initialTransactions={financeData.transactions}
      />

      {/* Event Payment Architecture Configuration */}
      <div className="pt-6 border-t border-neutral-200">
        <EventPaymentConfigForm
          eventId={eventId}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialConfig={paymentConfig as any}
        />
      </div>
    </div>
  );
}
