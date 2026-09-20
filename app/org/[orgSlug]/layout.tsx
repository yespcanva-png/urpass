import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layouts/AppShell";
import { getOrganization } from "@/app/actions/organizations";
import { getUserPlan } from "@/lib/plan";
import OrgSubNav from "@/components/org/OrgSubNav";
import type { OrgRole } from "@/types";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [result, { data: profile }, plan, { data: memberships }] = await Promise.all([
    getOrganization(orgSlug),
    supabase.from("profiles").select("full_name, email").eq("user_id", user.id).single(),
    getUserPlan(supabase, user.id),
    supabase
      .from("organization_members")
      .select("role, organization:organizations(slug, name, brand_color)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  if (!result) notFound();
  const { org, userRole } = result;
  if (!userRole) redirect("/dashboard/organizations");

  const fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "Organizer";
  const email = profile?.email ?? user.email ?? "";

  const orgs = (memberships ?? []).map((m) => ({
    slug: (m.organization as unknown as { slug: string; name: string; brand_color: string }).slug,
    name: (m.organization as unknown as { slug: string; name: string; brand_color: string }).name,
    brand_color: (m.organization as unknown as { slug: string; name: string; brand_color: string }).brand_color,
    role: m.role,
  }));

  return (
    <AppShell
      fullName={fullName}
      email={email}
      planSlug={plan.slug}
      orgs={orgs}
      activeOrgSlug={orgSlug}
    >
      <div className="px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto page-in">
          {/* Org header */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-md"
              style={{ background: org.brand_color }}
            >
              {org.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                org.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">{org.name}</h1>
              {org.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-400 hover:text-brand transition-colors"
                >
                  {org.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>

          <OrgSubNav orgSlug={orgSlug} userRole={userRole as OrgRole} />

          {children}
        </div>
      </div>
    </AppShell>
  );
}
