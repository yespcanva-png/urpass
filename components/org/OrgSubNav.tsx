"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Users,
  Settings,
  Briefcase,
  MapPin,
  ShieldCheck,
  Building2,
} from "lucide-react";
import type { OrgRole } from "@/types";

const TABS = [
  { label: "Overview & Events", href: "", icon: Calendar, minRole: "viewer" as OrgRole },
  { label: "Departments & Workspaces", href: "/workspaces", icon: Briefcase, minRole: "viewer" as OrgRole },
  { label: "Campuses & Venues", href: "/locations", icon: MapPin, minRole: "viewer" as OrgRole },
  { label: "Team & RBAC", href: "/members", icon: Users, minRole: "viewer" as OrgRole },
  { label: "Security & SSO", href: "/settings/security", icon: ShieldCheck, minRole: "admin" as OrgRole },
  { label: "Policies & Settings", href: "/settings", icon: Settings, minRole: "admin" as OrgRole },
];

const ROLE_ORDER: OrgRole[] = ["viewer", "checkin_staff", "event_manager", "admin", "owner"];

function hasAccess(userRole: OrgRole, minRole: OrgRole) {
  return ROLE_ORDER.indexOf(userRole) >= ROLE_ORDER.indexOf(minRole);
}

export default function OrgSubNav({ orgSlug, userRole }: { orgSlug: string; userRole: OrgRole }) {
  const pathname = usePathname();
  const base = `/org/${orgSlug}`;

  return (
    <nav className="flex items-center gap-1.5 bg-white border border-neutral-200/80 rounded-2xl p-1.5 shadow-xs mb-8 overflow-x-auto scrollbar-none">
      {TABS.filter((t) => hasAccess(userRole, t.minRole)).map(({ label, href, icon: Icon }) => {
        const fullHref = `${base}${href}`;
        const active = href === "" ? pathname === base : pathname.startsWith(fullHref);
        return (
          <Link
            key={label}
            href={fullHref}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              active
                ? "bg-neutral-900 text-white shadow-sm border border-neutral-800"
                : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70 border border-transparent"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-purple-400" : "text-neutral-400"}`} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
