import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/app/actions/organizations";
import { getOrgPaymentSettings } from "@/app/actions/org-payment-settings";
import { getOrgPayUSettings } from "@/app/actions/payu-settings";
import { getOrganizationSettings } from "@/app/actions/organization-settings";
import OrgSettingsClient from "./OrgSettingsClient";

import { getOrganizationPaymentAccountAction } from "@/app/actions/managed-payments";

export default async function OrgSettingsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await getOrganization(orgSlug);
  if (!result) notFound();
  const { org, userRole } = result;

  if (userRole !== "owner" && userRole !== "admin") {
    redirect(`/org/${orgSlug}`);
  }

  const [paymentSettings, payuSettings, orgSettings, managedPaymentAccount] = await Promise.all([
    getOrgPaymentSettings(org.id),
    getOrgPayUSettings(org.id),
    getOrganizationSettings(org.id),
    getOrganizationPaymentAccountAction(org.id),
  ]);

  return (
    <OrgSettingsClient
      org={org}
      orgSlug={orgSlug}
      userRole={userRole as import("@/types").OrgRole}
      existingPaymentKeyId={paymentSettings?.razorpay_key_id ?? null}
      existingPayUMerchantKey={payuSettings?.merchantKey ?? null}
      existingPayUEnvironment={payuSettings?.environment ?? "production"}
      initialSettings={orgSettings}
      initialManagedAccount={managedPaymentAccount as any}
    />
  );
}
