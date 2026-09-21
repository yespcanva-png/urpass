import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/app/actions/organizations";
import { getWorkspaces } from "@/app/actions/workspaces";
import WorkspacesClient from "./WorkspacesClient";
import type { OrgRole } from "@/types";

export default async function OrgWorkspacesPage({
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
  if (!userRole) redirect("/dashboard/organizations");

  const workspaces = await getWorkspaces(org.id);

  return (
    <WorkspacesClient
      orgId={org.id}
      orgSlug={orgSlug}
      workspaces={workspaces}
      userRole={userRole as OrgRole}
    />
  );
}
