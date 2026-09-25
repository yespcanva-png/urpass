import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/app/actions/organizations";
import { getSSOConnection } from "@/app/actions/sso";
import { getVerifiedDomains } from "@/app/actions/domains";
import { getSecurityPolicies, getEnterpriseSessions } from "@/app/actions/security";
import { getEnterpriseAuditLogs } from "@/app/actions/audit-logs";
import EnterpriseSecurityClient from "./EnterpriseSecurityClient";

export default async function OrgSecurityPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
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

  const [ssoConnection, domains, policies, sessions, auditLogs] = await Promise.all([
    getSSOConnection(org.id),
    getVerifiedDomains(org.id),
    getSecurityPolicies(org.id),
    getEnterpriseSessions(org.id),
    getEnterpriseAuditLogs(org.id, 50),
  ]);

  return (
    <EnterpriseSecurityClient
      org={org}
      orgSlug={orgSlug}
      userRole={userRole}
      initialSso={ssoConnection}
      initialDomains={domains}
      initialPolicies={policies}
      initialSessions={sessions}
      initialAuditLogs={auditLogs}
    />
  );
}
