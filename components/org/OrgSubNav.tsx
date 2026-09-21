"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, Settings, Briefcase, MapPin } from "lucide-react";
import type { OrgRole } from "@/types";

const TABS = [
  { label: "Events", href: "", icon: Calendar, minRole: "viewer" as OrgRole },
  { label: "Workspaces", href: "/workspaces", icon: Briefcase, minRole: "viewer" as OrgRole },
  { label: "Locations", href: "/locations", icon: MapPin, minRole: "viewer" as OrgRole },
  { label: "Members", href: "/members", icon: Users, minRole: "viewer" as OrgRole },
  { label: "Settings", href: "/settings", icon: Settings, minRole: "admin" as OrgRole },
];

const ROLE_ORDER: OrgRole[] = ["viewer", "checkin_staff", "event_manager", "admin", "owner"];

function hasAccess(userRole: OrgRole, minRole: OrgRole) {
  return ROLE_ORDER.indexOf(userRole) >= ROLE_ORDER.indexOf(minRole);
}

export default function OrgSubNav({ orgSlug, userRole }: { orgSlug: string; userRole: OrgRole }) {
  const pathname = usePathname();
  const base = `/org/${orgSlug}`;

  return (
    <nav className="flex flex-wrap sm:flex-nowrap gap-1 bg-white rounded-2xl p-1.5 shadow-sm mb-6 border border-neutral-100">
      {TABS.filter((t) => hasAccess(userRole, t.minRole)).map(({ label, href, icon: Icon }) => {
        const fullHref = `${base}${href}`;
        const active = href === "" ? pathname === base : pathname.startsWith(fullHref);
        return (
          <Link
            key={label}
            href={fullHref}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-1 justify-center whitespace-nowrap ${
              active
                ? "text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
            }`}
            style={active ? { background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" } : {}}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
