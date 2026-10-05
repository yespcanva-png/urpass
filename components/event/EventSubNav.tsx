"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  Globe,
  BarChart3,
  Settings,
  Radio,
  Store,
  Mail,
} from "lucide-react";

interface SubNavTab {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string, base: string) => boolean;
  subTabs?: { label: string; href: string; isActive: (pathname: string) => boolean }[];
}

export default function EventSubNav({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  const base = `/event/${eventId}`;

  const tabs: SubNavTab[] = [
    {
      id: "overview",
      label: "Overview",
      href: base,
      icon: LayoutDashboard,
      isActive: (p, b) => p === b || p === `${b}/`,
    },
    {
      id: "program",
      label: "Program",
      href: `${base}/agenda`,
      icon: CalendarDays,
      isActive: (p, b) =>
        p.startsWith(`${b}/agenda`) ||
        p.startsWith(`${b}/sessions`) ||
        p.startsWith(`${b}/speakers`) ||
        p.startsWith(`${b}/rooms`),
      subTabs: [
        { label: "Agenda", href: `${base}/agenda`, isActive: (p) => p.startsWith(`${base}/agenda`) },
        { label: "Sessions", href: `${base}/sessions`, isActive: (p) => p.startsWith(`${base}/sessions`) },
        { label: "Speakers", href: `${base}/speakers`, isActive: (p) => p.startsWith(`${base}/speakers`) },
        { label: "Rooms & Halls", href: `${base}/rooms`, isActive: (p) => p.startsWith(`${base}/rooms`) },
      ],
    },
    {
      id: "registration",
      label: "Registration",
      href: `${base}/tickets`,
      icon: Ticket,
      isActive: (p, b) =>
        p.startsWith(`${b}/tickets`) ||
        p.startsWith(`${b}/finance`) ||
        p.startsWith(`${b}/pass-design`) ||
        p.includes(`/studio/${eventId}`),
      subTabs: [
        { label: "Ticket Tiers", href: `${base}/tickets`, isActive: (p) => p.startsWith(`${base}/tickets`) },
        { label: "Ticket Studio", href: `/studio/${eventId}`, isActive: (p) => p.includes(`/studio/${eventId}`) || p.includes(`/pass-design`) },
        { label: "Finance & Payouts", href: `${base}/finance`, isActive: (p) => p.startsWith(`${base}/finance`) },
      ],
    },
    {
      id: "attendees",
      label: "Attendees",
      href: `${base}/attendees`,
      icon: Users,
      isActive: (p, b) =>
        p.startsWith(`${b}/attendees`) ||
        p.startsWith(`${b}/checkins`) ||
        p.startsWith(`${b}/feedback`),
      subTabs: [
        { label: "Attendee List", href: `${base}/attendees`, isActive: (p) => p.startsWith(`${base}/attendees`) },
        { label: "Gate Check-ins", href: `${base}/checkins`, isActive: (p) => p.startsWith(`${base}/checkins`) },
        { label: "Feedback & Reviews", href: `${base}/feedback`, isActive: (p) => p.startsWith(`${base}/feedback`) },
      ],
    },
    {
      id: "operations",
      label: "Operations",
      href: `${base}/operations`,
      icon: Radio,
      isActive: (p, b) =>
        p.startsWith(`${b}/operations`) ||
        p.startsWith(`${b}/badges`) ||
        p.startsWith(`${b}/desk`) ||
        p.startsWith(`${b}/zones`) ||
        p.startsWith(`${b}/access-rules`) ||
        p.startsWith(`${b}/staff-devices`) ||
        p.startsWith(`${b}/operations-analytics`),
      subTabs: [
        { label: "Live Ops", href: `${base}/operations`, isActive: (p) => p === `${base}/operations` || p === `${base}/operations/` },
        { label: "Badge Studio & Print", href: `${base}/badges`, isActive: (p) => p.startsWith(`${base}/badges`) },
        { label: "Onsite Desk", href: `${base}/desk`, isActive: (p) => p.startsWith(`${base}/desk`) },
        { label: "Zones & Floor Plan", href: `${base}/zones`, isActive: (p) => p.startsWith(`${base}/zones`) },
        { label: "Access Rules", href: `${base}/access-rules`, isActive: (p) => p.startsWith(`${base}/access-rules`) },
        { label: "Staff & Devices", href: `${base}/staff-devices`, isActive: (p) => p.startsWith(`${base}/staff-devices`) },
        { label: "Audit & Analytics", href: `${base}/operations-analytics`, isActive: (p) => p.startsWith(`${base}/operations-analytics`) },
      ],
    },
    {
      id: "commercial",
      label: "Commercial",
      href: `${base}/exhibitors-sponsors`,
      icon: Store,
      isActive: (p, b) =>
        p.startsWith(`${b}/exhibitors-sponsors`) ||
        p.startsWith(`${b}/exhibitors-admin`) ||
        p.startsWith(`${b}/sponsors-admin`) ||
        p.startsWith(`${b}/booths`) ||
        p.startsWith(`${b}/lead-retrieval`) ||
        p.startsWith(`${b}/deliverables`) ||
        p.startsWith(`${b}/meetings`) ||
        p.startsWith(`${b}/directory`),
      subTabs: [
        { label: "Overview", href: `${base}/exhibitors-sponsors`, isActive: (p) => p === `${base}/exhibitors-sponsors` || p === `${base}/exhibitors-sponsors/` },
        { label: "Exhibitors", href: `${base}/exhibitors-admin`, isActive: (p) => p.startsWith(`${base}/exhibitors-admin`) },
        { label: "Sponsors & Tiers", href: `${base}/sponsors-admin`, isActive: (p) => p.startsWith(`${base}/sponsors-admin`) },
        { label: "Booth Allocation", href: `${base}/booths`, isActive: (p) => p.startsWith(`${base}/booths`) },
        { label: "Deliverables Tracker", href: `${base}/deliverables`, isActive: (p) => p.startsWith(`${base}/deliverables`) },
        { label: "Lead Retrieval", href: `${base}/lead-retrieval`, isActive: (p) => p.startsWith(`${base}/lead-retrieval`) },
        { label: "B2B Meetings", href: `${base}/meetings`, isActive: (p) => p.startsWith(`${base}/meetings`) },
        { label: "Public Directory", href: `${base}/directory`, isActive: (p) => p.startsWith(`${base}/directory`) },
      ],
    },
    {
      id: "communications",
      label: "Communications",
      href: `${base}/communications`,
      icon: Mail,
      isActive: (p, b) => p.startsWith(`${b}/communications`),
      subTabs: [
        { label: "Broadcasts & Campaigns", href: `${base}/communications`, isActive: (p) => p === `${base}/communications` || p === `${base}/communications/` },
      ],
    },
    {
      id: "experience",
      label: "Experience",
      href: `${base}/website`,
      icon: Globe,
      isActive: (p, b) => p.startsWith(`${b}/website`),
      subTabs: [
        { label: "Event Website", href: `${base}/website`, isActive: (p) => p === `${base}/website` || p === `${base}/website/` },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      href: `${base}/analytics`,
      icon: BarChart3,
      isActive: (p, b) => p.startsWith(`${b}/analytics`),
    },
    {
      id: "settings",
      label: "Settings",
      href: `${base}/settings`,
      icon: Settings,
      isActive: (p, b) => p.startsWith(`${b}/settings`),
    },
  ];

  // Determine active primary tab
  const activeTab = tabs.find((t) => t.isActive(pathname, base)) || tabs[0];
  const hasSubTabs = Boolean(activeTab.subTabs && activeTab.subTabs.length > 0);

  return (
    <div className="space-y-0">
      {/* Primary Corporate Nav Bar */}
      <nav className="flex items-center gap-1 -mb-px overflow-x-auto scrollbar-none flex-nowrap pt-1">
        {tabs.map((tab) => {
          const active = tab.id === activeTab.id;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "group relative inline-flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm transition-all shrink-0 whitespace-nowrap tracking-tight font-medium",
                active
                  ? "text-neutral-950 font-semibold"
                  : "text-neutral-400 hover:text-neutral-700"
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5 transition-colors shrink-0",
                  active ? "text-neutral-900" : "text-neutral-400 group-hover:text-neutral-600"
                )}
              />
              <span>{tab.label}</span>

              {/* Active Underline Pill */}
              {active && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-neutral-900 animate-in fade-in duration-150" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Contextual Sub-Nav Bar (Clean Corporate Pills) */}
      {hasSubTabs && activeTab.subTabs && (
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none border-t border-neutral-100/90 -mx-4 lg:-mx-8 px-4 lg:px-8 bg-neutral-50/60 transition-all">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mr-2 hidden sm:inline select-none">
            {activeTab.label}
          </span>
          {activeTab.subTabs.map((sub) => {
            const subActive = sub.isActive(pathname);
            return (
              <Link
                key={sub.href}
                href={sub.href}
                className={cn(
                  "px-3 py-1 text-xs rounded-lg transition-all whitespace-nowrap shrink-0",
                  subActive
                    ? "bg-white text-neutral-900 font-semibold shadow-2xs border border-neutral-200/80"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/80 font-medium"
                )}
              >
                {sub.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
