import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganization } from "@/app/actions/organizations";
import { getLocations } from "@/app/actions/locations";
import LocationsClient from "./LocationsClient";
import type { OrgRole } from "@/types";

export default async function OrgLocationsPage({
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

  const locations = await getLocations(org.id);

  return (
    <LocationsClient
      orgId={org.id}
      orgSlug={orgSlug}
      locations={locations}
      userRole={userRole as OrgRole}
    />
  );
}
