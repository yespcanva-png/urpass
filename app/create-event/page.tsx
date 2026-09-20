import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import CreateEventForm from "./CreateEventForm";

export default async function CreateEventPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { org: orgId } = await searchParams;

  const [plan, { count: activeEventCount }, { data: memberships }] = await Promise.all([
    getUserPlan(supabase, user.id),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("organizer_id", user.id)
      .in("status", ["draft", "active"]),
    supabase
      .from("organization_members")
      .select("role, organization:organizations(id, slug, name, brand_color)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin"]),
  ]);

  const orgs = (memberships ?? []).map((m) => {
    const o = m.organization as unknown as { id: string; slug: string; name: string; brand_color: string };
    return { id: o.id, slug: o.slug, name: o.name, brand_color: o.brand_color, role: m.role };
  });

  return (
    <CreateEventForm
      maxAttendees={plan.maxAttendees}
      activeEventCount={activeEventCount ?? 0}
      maxEvents={plan.maxEvents}
      unlimited={plan.unlimited}
      canCreatePaidEvents={plan.canCreatePaidEvents}
      organizationId={orgId}
      orgs={orgs}
    />
  );
}
