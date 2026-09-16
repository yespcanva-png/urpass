import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layouts/AppShell";
import { getUserPlan } from "@/lib/plan";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, plan, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("user_id", user.id).single(),
    getUserPlan(supabase, user.id),
    supabase
      .from("organization_members")
      .select("role, organization:organizations(slug, name, brand_color)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  const fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "Organizer";
  const email = profile?.email ?? user.email ?? "";

  const orgs = (memberships ?? []).map((m) => ({
    slug: (m.organization as unknown as { slug: string; name: string; brand_color: string }).slug,
    name: (m.organization as unknown as { slug: string; name: string; brand_color: string }).name,
    brand_color: (m.organization as unknown as { slug: string; name: string; brand_color: string }).brand_color,
    role: m.role,
  }));

  return (
    <AppShell fullName={fullName} email={email} planSlug={plan.slug} orgs={orgs}>
      <div className="px-4 lg:px-8 py-6">{children}</div>
    </AppShell>
  );
}
