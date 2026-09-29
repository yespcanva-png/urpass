import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Building2, Lock, ShieldCheck, Briefcase, Users, BadgeCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { getUserOrganizations } from "@/app/actions/organizations";
import OrgCard from "@/components/org/OrgCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Organizations | URPASS Enterprise",
  robots: { index: false, follow: false },
};

export default async function OrganizationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [orgs, plan] = await Promise.all([
    getUserOrganizations(),
    getUserPlan(supabase, user.id),
  ]);

  return (
    <div className="max-w-5xl mx-auto page-in space-y-6">
      {/* ── Enterprise Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              Corporate Organizations
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
              Multi-Tenant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Enterprise event governance, cross-department workspaces, and collaborative gate check-in.
          </p>
        </div>

        {plan.canCreateOrganizations ? (
          <Link
            href="/dashboard/organizations/new"
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:opacity-95 transition-opacity shrink-0"
            style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" }}
          >
            <Plus className="w-4 h-4" />
            <span>New Organization</span>
          </Link>
        ) : (
          <Link
            href="/billing"
            className="flex items-center gap-2 text-purple-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors shrink-0"
          >
            <Lock className="w-4 h-4" />
            <span>Upgrade to Create</span>
          </Link>
        )}
      </div>

      {!plan.canCreateOrganizations && (
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" }}
        >
          <div
            className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 0%, transparent 70%)",
              transform: "translate(20%, -30%)",
            }}
          />
          <div className="relative text-white">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-amber-300" />
              <p className="text-sm font-bold">Enterprise Organizations Available on Starter & Pro</p>
            </div>
            <p className="text-xs text-white/70 leading-relaxed max-w-xl">
              Enable enterprise workspaces, delegate gate scanner permissions, invite cross-functional team members, and enforce anti-duplicate pass verification across your entire company.
            </p>
          </div>
          <Link
            href="/billing"
            className="relative flex items-center justify-center gap-1.5 bg-white text-purple-900 font-bold px-4 py-2 rounded-xl text-xs shrink-0 hover:bg-neutral-100 transition-colors shadow-xs"
          >
            Explore Plans
          </Link>
        </div>
      )}

      {/* ── Organization List or Empty State ── */}
      {orgs.length === 0 ? (
        <div className="bg-white rounded-3xl p-14 text-center shadow-xs border border-neutral-200/90">
          <div className="w-14 h-14 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-neutral-800 mb-1">No corporate organizations found</h2>
          <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto leading-relaxed">
            Create an enterprise organization to partition departments, delegate entrance staff, and centralize attendee check-in telemetry.
          </p>
          {plan.canCreateOrganizations && (
            <Link
              href="/dashboard/organizations/new"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-xs hover:opacity-95 transition-opacity"
              style={{ background: "#6D28D9" }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Organization</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase tracking-wider px-1">
            <span>Your Corporate Entities ({orgs.length})</span>
            <span>Role Assignment</span>
          </div>

          <div className="flex flex-col gap-3">
            {orgs.map(({ org, role }) => (
              <OrgCard key={org.id} org={org} role={role} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
