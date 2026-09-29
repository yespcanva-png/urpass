import Link from "next/link";
import { Building2, Users, ChevronRight, ShieldCheck, BadgeCheck } from "lucide-react";
import type { Organization, OrgRole } from "@/types";

const ROLE_BADGE: Record<OrgRole, { label: string; cls: string }> = {
  owner:         { label: "Executive Owner", cls: "bg-purple-50 text-purple-700 border-purple-200" },
  admin:         { label: "Admin",           cls: "bg-blue-50 text-blue-700 border-blue-200" },
  event_manager: { label: "Event Manager",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
  checkin_staff: { label: "Check-in Staff",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  viewer:        { label: "Auditor / Viewer",cls: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  member:        { label: "Member",          cls: "bg-neutral-100 text-neutral-600 border-neutral-200" },
};

export default function OrgCard({
  org,
  role,
  memberCount,
}: {
  org: Organization;
  role: OrgRole;
  memberCount?: number;
}) {
  const badge = ROLE_BADGE[role] || ROLE_BADGE.member;

  return (
    <Link
      href={`/org/${org.slug}`}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all group cursor-pointer"
    >
      <div className="flex items-start sm:items-center gap-4">
        {/* Corporate Brand Icon / Logo */}
        <div
          className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-xs ring-2 ring-neutral-100"
          style={{ background: org.brand_color || "#6D28D9" }}
        >
          {org.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-black text-xl">
              {org.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Corporate Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-neutral-900 group-hover:text-purple-700 transition-colors">
              {org.name}
            </h3>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <BadgeCheck className="w-3 h-3 text-emerald-600" />
              Corporate
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium flex-wrap">
            <span className="font-mono text-[11px] text-neutral-500">/{org.slug}</span>
            {memberCount !== undefined && (
              <>
                <span className="text-neutral-300">•</span>
                <span className="flex items-center gap-1 text-neutral-500">
                  <Users className="w-3 h-3" />
                  {memberCount} team member{memberCount !== 1 ? "s" : ""}
                </span>
              </>
            )}
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1 text-neutral-500">
              <ShieldCheck className="w-3 h-3 text-indigo-500" />
              SAML Ready
            </span>
          </div>
        </div>
      </div>

      {/* Role & Enter Button */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border shrink-0 ${badge.cls}`}>
          {badge.label}
        </span>

        <span className="text-xs font-bold text-neutral-700 group-hover:text-purple-700 flex items-center gap-1 transition-colors">
          <span>Open Console</span>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all" />
        </span>
      </div>
    </Link>
  );
}
