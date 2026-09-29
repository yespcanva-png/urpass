import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Plus,
  Users,
  Globe,
  ExternalLink,
  ChevronRight,
  Key,
  BadgeCheck,
} from "lucide-react";
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

  const canCreateEvent = userRole === "owner" || userRole === "admin" || userRole === "event_manager";

  return (
    <AppShell
      fullName={fullName}
      email={email}
      planSlug={plan.slug}
      orgs={orgs}
      activeOrgSlug={orgSlug}
    >
      <div className="px-4 lg:px-10 py-6 sm:py-8 bg-neutral-50/70 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ── Enterprise Breadcrumbs ── */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <Link
              href="/dashboard/organizations"
              className="hover:text-neutral-900 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Organizations</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <span className="text-neutral-900 font-bold">{org.name}</span>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-200/60 text-neutral-700">
              CORPORATE CONSOLE
            </span>
          </nav>

          {/* ── Corporate Entity Hero Header ── */}
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
            {/* Subtle background ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-100/40 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Identity Section */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center shrink-0 text-white font-black text-2xl shadow-md ring-4 ring-neutral-100 overflow-hidden"
                  style={{ background: org.brand_color || "#6D28D9" }}
                >
                  {org.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={org.logo_url}
                      alt={org.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    org.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                      {org.name}
                    </h1>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Enterprise
                    </span>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      {userRole}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500 font-medium">
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-neutral-600 hover:text-purple-700 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{org.website.replace(/^https?:\/\//, "")}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
                      </a>
                    )}

                    <span className="text-neutral-300">•</span>
                    <span className="font-mono text-[11px] text-neutral-500">
                      Entity ID: <span className="text-neutral-800 font-semibold">org_{orgSlug}</span>
                    </span>

                    <span className="text-neutral-300">•</span>
                    <span className="inline-flex items-center gap-1 text-neutral-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                      RBAC & Multi-Gate Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Executive Action Bar */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                {canCreateEvent && (
                  <Link
                    href={`/create-event?org=${org.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition-all cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Corporate Event</span>
                  </Link>
                )}

                <Link
                  href={`/org/${orgSlug}/members`}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Manage Team</span>
                </Link>

                {(userRole === "owner" || userRole === "admin") && (
                  <Link
                    href={`/org/${orgSlug}/settings/security`}
                    className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-all cursor-pointer"
                    title="Enterprise Security & SSO"
                  >
                    <Key className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── Sub Navigation Bar ── */}
          <OrgSubNav orgSlug={orgSlug} userRole={userRole as OrgRole} />

          {/* ── Tab View Content ── */}
          <main>{children}</main>
        </div>
      </div>
    </AppShell>
  );
}
