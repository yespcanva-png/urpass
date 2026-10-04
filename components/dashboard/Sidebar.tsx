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
  Sparkles,
  HelpCircle,
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
  { label: "How to Use", href: "/docs",             icon: HelpCircle },
  { label: "Billing",    href: "/billing",          icon: CreditCard },
  { label: "Settings",   href: "/dashboard/settings", icon: Settings },
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

  const planSlugNormalized = (planSlug || "free").toLowerCase();

  const planConfig: {
    label: string;
    badgeClass: string;
    iconBorder: string;
    iconBg: string;
    iconColor: string;
    subtitle: string;
  } = {
    enterprise: {
      label: "Enterprise",
      badgeClass: "text-sky-300 bg-sky-500/10 border-sky-500/25",
      iconBorder: "border-sky-500/30",
      iconBg: "bg-neutral-900",
      iconColor: "text-sky-300",
      subtitle: "Dedicated Cloud",
    },
    business: {
      label: "Business",
      badgeClass: "text-amber-300 bg-amber-400/10 border-amber-400/25",
      iconBorder: "border-amber-500/30",
      iconBg: "bg-neutral-900",
      iconColor: "text-amber-300",
      subtitle: "Enterprise Suite",
    },
    pro: {
      label: "Pro",
      badgeClass: "text-violet-300 bg-violet-500/15 border-violet-500/25",
      iconBorder: "border-violet-500/30",
      iconBg: "bg-violet-950/60",
      iconColor: "text-violet-300",
      subtitle: "Professional",
    },
    starter: {
      label: "Starter",
      badgeClass: "text-neutral-300 bg-white/5 border-white/10",
      iconBorder: "border-white/15",
      iconBg: "bg-neutral-900",
      iconColor: "text-neutral-300",
      subtitle: "Tier 1",
    },
    campus: {
      label: "Campus",
      badgeClass: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
      iconBorder: "border-emerald-500/30",
      iconBg: "bg-neutral-900",
      iconColor: "text-emerald-300",
      subtitle: "Academic Suite",
    },
    free: {
      label: "Free",
      badgeClass: "text-neutral-400 bg-white/5 border-white/10",
      iconBorder: "border-white/10",
      iconBg: "bg-neutral-900",
      iconColor: "text-neutral-400",
      subtitle: "Standard Workspace",
    },
  }[planSlugNormalized] || {
    label: "Free",
    badgeClass: "text-neutral-400 bg-white/5 border-white/10",
    iconBorder: "border-white/10",
    iconBg: "bg-neutral-900",
    iconColor: "text-neutral-400",
    subtitle: "Standard Workspace",
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#0e0c16] border-r border-white/5"
    >

      <div className="relative flex flex-col h-full px-3 py-5 gap-5 overflow-hidden">

        {/* ── Corporate Logo Header ─────────────────────────────── */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-2 py-1.5 mb-1 shrink-0 rounded-xl hover:bg-white/4 transition-colors group"
        >
          {/* Minimalist Corporate Emblem */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 shadow-xs",
              planConfig.iconBg,
              planConfig.iconBorder
            )}
          >
            <Ticket className={cn("w-4 h-4", planConfig.iconColor)} />
          </div>

          {/* Clean Corporate Brand & Plan Hierarchy */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold tracking-tight text-white leading-none">
                URPASS
              </span>
              {planConfig.label !== "Free" && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase border leading-none",
                    planConfig.badgeClass
                  )}
                >
                  {planConfig.label}
                </span>
              )}
            </div>
            <span className="text-[10px] text-white/40 tracking-normal mt-1 font-medium truncate leading-none">
              {planConfig.subtitle}
            </span>
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
            <NavLink
              href="/dashboard/templates"
              icon={Sparkles}
              label="Templates"
              active={isActive("/dashboard/templates")}
            />
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
