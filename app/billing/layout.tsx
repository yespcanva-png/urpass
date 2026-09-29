import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layouts/AppShell";
import { getUserPlan } from "@/lib/plan";
import type { CampusContext, CampusRole } from "@/types";

export default async function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [
    { data: profile },
    plan,
    { data: memberships },
    { data: ownedInstitution },
    { data: campusMember },
  ] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("user_id", user.id).single(),
    getUserPlan(supabase, user.id),
    supabase
      .from("organization_members")
      .select("role, organization:organizations(slug, name, brand_color)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("institutions")
      .select("id, name, institution_code, status")
      .eq("primary_admin_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("campus_members")
      .select("role, department_id, club_id, institution:institutions(id, name, institution_code, status)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle(),
  ]);

  const fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "Organizer";
  const email = profile?.email ?? user.email ?? "";

  const orgs = (memberships ?? []).map((m) => ({
    slug: (m.organization as unknown as { slug: string; name: string; brand_color: string }).slug,
    name: (m.organization as unknown as { slug: string; name: string; brand_color: string }).name,
    brand_color: (m.organization as unknown as { slug: string; name: string; brand_color: string }).brand_color,
    role: m.role,
  }));

  let campusContext: CampusContext | null = null;
  if (ownedInstitution) {
    campusContext = {
      institutionId: ownedInstitution.id,
      institutionName: ownedInstitution.name,
      institutionCode: ownedInstitution.institution_code,
      role: "INSTITUTION_ADMIN",
    };
  } else if (campusMember && campusMember.institution) {
    const inst = campusMember.institution as unknown as {
      id: string;
      name: string;
      institution_code: string;
      status: string;
    };
    if (inst.status === "active") {
      campusContext = {
        institutionId: inst.id,
        institutionName: inst.name,
        institutionCode: inst.institution_code,
        role: campusMember.role as CampusRole,
        departmentId: campusMember.department_id,
        clubId: campusMember.club_id,
      };
    }
  }

  return (
    <AppShell
      fullName={fullName}
      email={email}
      planSlug={plan.slug}
      orgs={orgs}
      campusContext={campusContext}
    >
      <div className="px-4 lg:px-8 py-6">{children}</div>
    </AppShell>
  );
}
