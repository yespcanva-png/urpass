"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Calendar,
  ScanLine,
  CreditCard,
  Settings,
  LogOut,
  Ticket,
  Star,
  Key,
  Palette,
  Zap,
  ChevronRight,
  Building2,
  BarChart3,
  GraduationCap,
  CalendarDays,
  Building,
  Users,
  BookOpen,
  ShieldCheck,
  SlidersHorizontal,
  Crown,
  Sparkles,
} from "lucide-react";
import type { CampusContext, CampusRole } from "@/types";

const mainNav = [
  { label: "Dashboard", href: "/dashboard",        icon: LayoutDashboard, exact: true },
  { label: "Events",    href: "/dashboard/events", icon: Calendar,        exact: false },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3,    exact: false },
  { label: "Scanner",   href: "/scan",              icon: ScanLine,        exact: false },
];

const campusNav: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  roles: CampusRole[];
}[] = [
  { label: "Overview", href: "/dashboard/campus", icon: GraduationCap, exact: true, roles: ["INSTITUTION_ADMIN", "DEPARTMENT_ADMIN", "CLUB_ADMIN", "ORGANIZER", "SCANNER"] },
  { label: "Events", href: "/dashboard/campus/events", icon: CalendarDays, exact: false, roles: ["INSTITUTION_ADMIN", "DEPARTMENT_ADMIN", "CLUB_ADMIN", "ORGANIZER", "SCANNER"] },
  { label: "Departments", href: "/dashboard/campus/departments", icon: Building, exact: false, roles: ["INSTITUTION_ADMIN", "DEPARTMENT_ADMIN"] },
  { label: "Clubs", href: "/dashboard/campus/clubs", icon: Users, exact: false, roles: ["INSTITUTION_ADMIN", "DEPARTMENT_ADMIN", "CLUB_ADMIN"] },
  { label: "Students", href: "/dashboard/campus/students", icon: BookOpen, exact: false, roles: ["INSTITUTION_ADMIN", "DEPARTMENT_ADMIN", "CLUB_ADMIN"] },
  { label: "Analytics", href: "/dashboard/campus/analytics", icon: BarChart3, exact: false, roles: ["INSTITUTION_ADMIN", "DEPARTMENT_ADMIN"] },
  { label: "Team", href: "/dashboard/campus/team", icon: ShieldCheck, exact: false, roles: ["INSTITUTION_ADMIN", "DEPARTMENT_ADMIN", "CLUB_ADMIN"] },
  { label: "Settings", href: "/dashboard/campus/settings", icon: SlidersHorizontal, exact: false, roles: ["INSTITUTION_ADMIN"] },
];

const bottomNav = [
  { label: "Billing",  href: "/billing",            icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

type Props = {
  email: string;
  fullName: string;
  planSlug?: string;
  campusContext?: CampusContext | null;
};

function NavLink({ href, icon: Icon, label, active }: {
  href: string; icon: React.ComponentType<{ className?: string }>;
  label: string; exact?: boolean; active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        active
          ? "bg-white/10 text-white"
          : "text-white/45 hover:text-white/80 hover:bg-white/6"
      )}
    >
      <Icon className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-white/40")} />
      {label}
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-200 shrink-0" />}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-bold tracking-widest uppercase text-white/25 px-3 mb-1">
      {children}
    </p>
  );
}

export default function Sidebar({ email, fullName, planSlug, campusContext }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = fullName
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "U";

  const isBusiness = planSlug === "business" || planSlug === "enterprise";

  const planBadge =
    planSlug === "business"   ? { label: "Business Suite", color: "#f59e0b" }
    : planSlug === "enterprise" ? { label: "Enterprise",     color: "#94a3b8" }
    : planSlug === "pro"        ? { label: "Pro",            color: "#fbbf24" }
    : planSlug === "starter"    ? { label: "Starter",        color: "#a78bfa" }
    : null;

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#0e0c16] border-r border-white/5"
    >

      <div className="relative flex flex-col h-full px-3 py-5 gap-5 overflow-hidden">

        {/* ── Logo ──────────────────────────────────────────────── */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-1 mb-1 shrink-0 group">
          <div className="relative shrink-0">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shadow-lg relative transition-all duration-300",
                isBusiness
                  ? "ring-1.5 ring-amber-400/80 shadow-[0_0_18px_rgba(245,158,11,0.35)] overflow-hidden"
                  : ""
              )}
              style={{
                background: isBusiness
                  ? "linear-gradient(135deg, #18181b 0%, #2e1065 45%, #78350f 100%)"
                  : "linear-gradient(135deg, #6D28D9, #4c1d95)",
              }}
            >
              {isBusiness && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />
              )}
              <Ticket className={cn("w-4 h-4", isBusiness ? "text-amber-200" : "text-white")} />
            </div>
            {isBusiness ? (
              <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-2 border-[#0e0c16] rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                <Crown className="w-2.5 h-2.5 fill-neutral-950 text-neutral-950" />
              </div>
            ) : planSlug === "starter" ? (
              <div className="absolute -top-1 -right-1 bg-amber-400 border-2 border-[#0f0620] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                <Star className="w-2 h-2 fill-neutral-950 text-neutral-950" />
              </div>
            ) : null}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-widest uppercase text-white leading-none">
                URPASS
              </span>
              {isBusiness && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400/25 via-yellow-300/20 to-amber-500/25 text-amber-300 border border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                  <Sparkles className="w-2 h-2 text-amber-300 animate-pulse" />
                  BUSINESS
                </span>
              )}
            </div>
            {planBadge && !isBusiness && (
              <span
                className="text-[9px] font-bold tracking-widest uppercase leading-none mt-0.5"
                style={{ color: planBadge.color }}
              >
                {planBadge.label}
              </span>
            )}
            {isBusiness && (
              <span className="text-[8.5px] font-semibold text-amber-300/80 tracking-wide mt-0.5">
                Executive Suite
              </span>
            )}
          </div>
        </Link>

        {/* ── Scrollable middle section ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-5 pr-1 -mr-1">
          {/* ── Main nav ──────────────────────────────────────────── */}
          <nav className="flex flex-col gap-0.5">
            <SectionLabel>Main</SectionLabel>
            {mainNav.map(({ label, href, icon, exact }) => (
              <NavLink key={href} href={href} icon={icon} label={label} exact={exact} active={isActive(href, exact)} />
            ))}
          </nav>

          {/* ── Campus (Academic Multi-Tenant) ────────────────────── */}
          {campusContext && (
            <nav className="flex flex-col gap-0.5" aria-label="Campus navigation">
              <div className="flex items-center justify-between px-3 mb-1">
                <p className="text-[9px] font-bold tracking-widest uppercase text-white/25">
                  Campus
                </p>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand/20 text-brand-300 border border-brand/30">
                  {campusContext.institutionCode}
                </span>
              </div>
              {campusNav
                .filter((item) => item.roles.includes(campusContext.role))
                .map(({ label, href, icon, exact }) => (
                  <NavLink
                    key={href}
                    href={href}
                    icon={icon}
                    label={label}
                    exact={exact}
                    active={isActive(href, exact)}
                  />
                ))}
            </nav>
          )}

          {/* ── Organizations (Starter+) ──────────────────────────── */}
          {planSlug && planSlug !== "free" && (
            <nav className="flex flex-col gap-0.5">
              <SectionLabel>Teams</SectionLabel>
              <NavLink href="/dashboard/organizations" icon={Building2} label="Organizations" active={isActive("/dashboard/organizations") || isActive("/org")} />
            </nav>
          )}

          {/* ── Tools nav ─────────────────────────────────────────── */}
          <nav className="flex flex-col gap-0.5">
            <SectionLabel>Tools</SectionLabel>
            <NavLink href="/dashboard/branding" icon={Palette} label="Branding" active={isActive("/dashboard/branding")} />
            <NavLink
              href="/studio"
              icon={Ticket}
              label="Ticket Studio"
              active={isActive("/studio") || isActive("/dashboard/ticket-design") || isActive("/dashboard/pass-design")}
            />
            {planSlug && ["pro", "business", "campus", "enterprise"].includes(planSlug) && (
              <NavLink href="/dashboard/api-keys" icon={Key} label="API Keys" active={isActive("/dashboard/api-keys")} />
            )}
          </nav>

          {/* ── Spacer ────────────────────────────────────────────── */}
          <div className="flex-1" />

          {/* ── Upgrade CTA (free only) ───────────────────────────── */}
          {(!planSlug || planSlug === "free") && (
            <Link
              href="/billing"
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 transition-colors"
            >
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white leading-none">Upgrade plan</p>
                <p className="text-[10px] text-white/50 mt-1 leading-none">Unlock more features</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
            </Link>
          )}

          {/* ── Account nav ───────────────────────────────────────── */}
          <nav className="flex flex-col gap-0.5">
            <SectionLabel>Account</SectionLabel>
            {bottomNav.map(({ label, href, icon }) => (
              <NavLink key={href} href={href} icon={icon} label={label} active={isActive(href)} />
            ))}
          </nav>
        </div>

        {/* ── User row ──────────────────────────────────────────── */}
        <div className="border-t border-white/8 pt-4 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/6 transition-colors group cursor-default">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold text-white ring-2 ring-white/10"
              style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white/80">{fullName}</p>
              <p className="text-[10px] text-white/30 truncate">{email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/15 transition-all opacity-0 group-hover:opacity-100"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
