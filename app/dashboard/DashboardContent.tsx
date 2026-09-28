"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";

const emptySubscribe = () => () => {};
import {
  Plus,
  Calendar,
  QrCode,
  CheckCircle2,
  Ticket,
  ArrowUpRight,
  ScanLine,
  Zap,
  ChevronRight,
  TrendingUp,
  Users,
  Clock,
  Building2,
  AlertCircle,
  BarChart3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { getUserOrganizations } from "@/app/actions/organizations";
import { createClient } from "@/lib/supabase/client";

interface EventRow {
  id: string;
  name: string;
  venue: string;
  event_date: string;
  status: string;
}

interface OrgRow {
  slug: string;
  name: string;
  brand_color: string;
  role: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  active:    { label: "Active",    cls: "bg-green-50 text-green-700 border border-green-100",    dot: "bg-green-500" },
  draft:     { label: "Draft",     cls: "bg-neutral-100 text-neutral-500 border border-neutral-200", dot: "bg-neutral-400" },
  completed: { label: "Completed", cls: "bg-blue-50 text-blue-600 border border-blue-100",       dot: "bg-blue-500" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600 border border-red-100",          dot: "bg-red-500" },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function StatCard({
  label, value, icon: Icon, accent, loaded,
}: {
  label: string; value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; loaded: boolean;
}) {
  if (!loaded) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs">
        <div className="skeleton w-8 h-8 rounded-lg mb-3" />
        <div className="skeleton h-7 w-14 rounded mb-1.5" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs hover:border-neutral-300 transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold tracking-tight tabular-nums text-neutral-900">{value.toLocaleString()}</p>
      <p className="text-xs text-neutral-500 mt-1 font-medium">{label}</p>
    </div>
  );
}

function EventSkeleton() {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-neutral-200/80 px-5 py-3.5 shadow-xs">
      <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-4 rounded w-48" />
        <div className="skeleton h-3 rounded w-32" />
      </div>
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
  );
}

export default function DashboardContent() {
  const [firstName, setFirstName] = useState("");
  const dateLabel = useSyncExternalStore(emptySubscribe, formatDate, () => "Today");
  const greeting = useSyncExternalStore(emptySubscribe, getGreeting, () => "Welcome");
  const [planSlug, setPlanSlug] = useState("free");
  const [trialInfo, setTrialInfo] = useState<{
    isEligible: boolean;
    isActiveTrial: boolean;
    planName: string;
    planSlug: string;
    daysRemaining: number;
    scheduledAmountRupees: number;
    renewalDate: string;
    autopayCancelled: boolean;
    hasAutopay: boolean;
  } | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, passes: 0, checkedIn: 0 });
  const [events, setEvents] = useState<EventRow[]>([]);
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {

    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoaded(true);
          return;
        }

        const [{ data: profile }, { data: eventRows }, { data: sub }, memberships] = await Promise.all([
          supabase.from("profiles").select("full_name").eq("user_id", user.id).single(),
          supabase.from("events").select("id, name, venue, event_date, status")
            .eq("organizer_id", user.id).order("created_at", { ascending: false }),
          supabase
            .from("subscriptions")
            .select("status, is_trial, trial_used, trial_plan, trial_starts_at, trial_ends_at, current_period_end, autopay_status, cancel_at_period_end, plan:plans(name, slug)")
            .eq("user_id", user.id)
            .in("status", ["active", "trialing"])
            .maybeSingle(),
          getUserOrganizations(),
        ]);

        const allIds = eventRows?.map((e) => e.id) ?? [];
        const [{ count: totalPasses }, { count: totalCheckedIn }] = await Promise.all([
          allIds.length
            ? supabase.from("passes").select("*", { count: "exact", head: true }).in("event_id", allIds)
            : Promise.resolve({ count: 0 }),
          allIds.length
            ? supabase.from("check_ins").select("*", { count: "exact", head: true }).in("event_id", allIds)
            : Promise.resolve({ count: 0 }),
        ]);

        const isTrial = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) >= new Date());
        const isTrialExpired = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) < new Date());
        const slug = isTrialExpired ? "free" : ((sub?.plan as unknown as { slug: string } | null)?.slug ?? "free");
        const planName = (sub?.plan as unknown as { name: string } | null)?.name ?? (slug ? slug.toUpperCase() : "Pro");
        const trialUsed = sub?.trial_used ?? false;

        let trialState = null;
        if (!trialUsed && slug === "free") {
          trialState = {
            isEligible: true,
            isActiveTrial: false,
            planName: "",
            planSlug: "",
            daysRemaining: 0,
            scheduledAmountRupees: 0,
            renewalDate: "",
            autopayCancelled: false,
            hasAutopay: false,
          };
        } else if (isTrial && sub?.trial_ends_at) {
          const endsAt = new Date(sub.trial_ends_at);
          const msRemaining = endsAt.getTime() - Date.now();
          const daysRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
          const monthlyPrice = slug === "starter" ? 499 : slug === "business" ? 2499 : 999;
          const scheduledAmountRupees = Math.round(monthlyPrice * 1.18);
          const renewalDate = endsAt.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const autopayCancelled = Boolean(sub?.cancel_at_period_end || sub?.autopay_status === "cancelled");
          const hasAutopay = sub?.autopay_status === "active";

          trialState = {
            isEligible: false,
            isActiveTrial: true,
            planName,
            planSlug: slug,
            daysRemaining,
            scheduledAmountRupees,
            renewalDate,
            autopayCancelled,
            hasAutopay,
          };
        }
        setTrialInfo(trialState);

        setFirstName(profile?.full_name?.split(" ")[0] ?? "there");
        setPlanSlug(slug);
        setStats({
          total: allIds.length,
          active: eventRows?.filter((e) => e.status === "active").length ?? 0,
          passes: totalPasses ?? 0,
          checkedIn: totalCheckedIn ?? 0,
        });
        setEvents((eventRows ?? []).slice(0, 6));
        setOrgs(
          (memberships ?? []).map((m) => {
            return { slug: m.org.slug, name: m.org.name, brand_color: m.org.brand_color, role: m.role };
          })
        );
        setLoaded(true);
      } catch (error) {
        console.error("Failed to load dashboard", error);
        setLoadError("We couldn't load your dashboard data. Refresh the page or sign in again.");
        setLoaded(true);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Events",  value: stats.total,     icon: Calendar,     accent: "bg-neutral-100 text-neutral-600" },
    { label: "Active Events", value: stats.active,    icon: Ticket,       accent: "bg-brand-50 text-brand" },
    { label: "Passes Issued", value: stats.passes,    icon: QrCode,       accent: "bg-blue-50 text-blue-600" },
    { label: "Checked In",    value: stats.checkedIn, icon: CheckCircle2, accent: "bg-emerald-50 text-emerald-600" },
  ];

  const quickActions = [
    { label: "New event",    href: "/create-event",        icon: Plus,      primary: true },
    { label: "Analytics",    href: "/dashboard/analytics", icon: BarChart3, primary: false },
    { label: "Open scanner", href: "/scan",                 icon: ScanLine,  primary: false },
    { label: "All events",   href: "/dashboard/events",    icon: Calendar,  primary: false },
  ];

  return (
    <div className="max-w-4xl mx-auto page-in space-y-8">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
            {dateLabel}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {greeting}{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Here&apos;s what&apos;s happening across your events
          </p>
        </div>

        <Link
          href="/create-event"
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          New event
        </Link>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{loadError}</p>
        </div>
      )}

      {/* ── Free Trial / Status Banner (With Skeleton Placeholder to prevent CLS) ── */}
      {!loaded ? (
        <div className="rounded-xl p-5 border border-neutral-200/80 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="skeleton w-9 h-9 rounded-lg shrink-0" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-48 rounded" />
                <div className="skeleton h-3 w-72 rounded" />
              </div>
            </div>
            <div className="skeleton h-9 w-36 rounded-lg shrink-0 hidden sm:block" />
          </div>
        </div>
      ) : trialInfo?.isEligible ? (
        <div className="rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs border border-neutral-800 bg-neutral-900 content-in">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  EXCLUSIVE OFFER
                </span>
                <span className="text-xs font-medium text-neutral-400">30 DAYS · ANY PLAN · ₹0</span>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                Your account is eligible for one free 30-day plan
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Choose Starter, Pro or Business when you&apos;re ready. Full feature access with no credit card or AutoPay required.
              </p>
            </div>
          </div>
          <Link
            href="/billing"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white text-neutral-950 hover:bg-neutral-100 shadow-xs shrink-0 transition-colors whitespace-nowrap"
          >
            Choose My Free Plan
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : trialInfo?.isActiveTrial ? (
        <div className="rounded-xl p-4 sm:p-5 bg-neutral-900 text-white shadow-xs border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 content-in">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-neutral-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {trialInfo.planName.toUpperCase()} · FREE TRIAL
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {trialInfo.daysRemaining} {trialInfo.daysRemaining === 1 ? "day" : "days"} remaining
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal">
                {trialInfo.autopayCancelled
                  ? `AutoPay cancelled · Free trial access active until ${trialInfo.renewalDate}`
                  : trialInfo.hasAutopay
                  ? `Your first payment of ₹${trialInfo.scheduledAmountRupees.toLocaleString("en-IN")} + taxes is scheduled for ${trialInfo.renewalDate}.`
                  : `Free trial active until ${trialInfo.renewalDate} · No card on file (reverts to Free plan)`}
              </p>
            </div>
          </div>
          <Link
            href="/billing"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700 shrink-0 transition-colors whitespace-nowrap"
          >
            Manage Subscription
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : null}

      {/* ── Stats grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} loaded={loaded} />
        ))}
      </div>

      {/* ── Quick actions ─────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3">
          Quick actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ label, href, icon: Icon, primary }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-2.5 rounded-xl px-4 py-4 text-center transition-all ${
                primary
                  ? "bg-neutral-900 text-white border border-neutral-900 hover:bg-neutral-800 shadow-xs"
                  : "bg-white text-neutral-700 border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50 shadow-xs"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Organizations ────────────────────────────────────────── */}
      {loaded && orgs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Organizations</p>
            <Link href="/dashboard/organizations" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {orgs.slice(0, 4).map((org) => (
              <Link
                key={org.slug}
                href={`/org/${org.slug}`}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: org.brand_color }}
                >
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-brand transition-colors">{org.name}</p>
                  <p className="text-xs text-neutral-500 capitalize">{org.role}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors shrink-0" />
              </Link>
            ))}
            {planSlug !== "free" && (
              <Link
                href="/dashboard/organizations/new"
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-xs hover:shadow-sm transition-all border border-dashed border-neutral-300 hover:border-neutral-400 group"
              >
                <div className="w-9 h-9 rounded-lg border border-dashed border-neutral-300 group-hover:border-neutral-400 flex items-center justify-center shrink-0 group-hover:bg-neutral-50 transition-all">
                  <Plus className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
                </div>
                <p className="text-sm font-medium text-neutral-500 group-hover:text-neutral-900 transition-colors">New organization</p>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Starter+ but no orgs yet — suggest creating one */}
      {loaded && orgs.length === 0 && planSlug !== "free" && (
        <Link
          href="/dashboard/organizations/new"
          className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-xs hover:shadow-sm transition-all group border border-dashed border-neutral-300 hover:border-neutral-400"
        >
          <div className="w-9 h-9 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all">
            <Building2 className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-900">Create your organization</p>
            <p className="text-xs text-neutral-500 mt-0.5">Invite your team and manage events together</p>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors shrink-0" />
        </Link>
      )}

      {/* ── Upgrade prompt (free plan after trial used) ─────────── */}
      {loaded && planSlug === "free" && !trialInfo?.isEligible && (
        <div
          className="rounded-xl px-6 py-4 flex items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 text-white shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <p className="text-sm font-semibold text-white">Upgrade to Starter</p>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Unlock 5 events, 500 attendees, CSV upload &amp; remove branding
            </p>
          </div>
          <Link
            href="/billing"
            className="flex items-center gap-1.5 bg-white text-neutral-900 px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 hover:bg-neutral-100 transition-colors"
          >
            Upgrade <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Recent events ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
            Recent events
          </p>
          <Link
            href="/dashboard/events"
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!loaded ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => <EventSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-xs border border-neutral-200/80">
            <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-5 h-5 text-neutral-600" />
            </div>
            <p className="text-sm font-semibold text-neutral-900 mb-1">No events yet</p>
            <p className="text-xs text-neutral-500 mb-4 max-w-xs mx-auto">
              Create your first event to start issuing digital passes and scanning attendees
            </p>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2 content-in">
            {events.map((event) => {
              const cfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.cancelled;
              const dateStr = new Date(event.event_date).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              });
              const isPast = new Date(event.event_date) < new Date();

              return (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="flex items-center gap-4 bg-white rounded-xl px-5 py-3.5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all group"
                >
                  {/* Date block */}
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200/80 flex flex-col items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-colors">
                    <span className="text-[8px] font-bold text-neutral-500 uppercase group-hover:text-neutral-400 leading-none">
                      {new Date(event.event_date).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-white leading-none mt-0.5">
                      {new Date(event.event_date).getDate()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-neutral-700 transition-colors">
                      {event.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-neutral-500 truncate">{event.venue}</span>
                      <span className="text-neutral-300 text-xs">·</span>
                      <span className="flex items-center gap-1 text-xs text-neutral-400 shrink-0">
                        {isPast ? <Clock className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${cfg.cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom tip ────────────────────────────────────────────── */}
      {loaded && events.length > 0 && (
        <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3.5 border border-neutral-200/80 shadow-xs">
          <div className="w-8 h-8 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-neutral-600" />
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed flex-1">
            Tip: Open the <span className="font-semibold text-neutral-900">Scanner</span> on your phone at the event entrance to check in attendees instantly via QR code.
          </p>
          <Link href="/scan" className="text-xs font-semibold text-neutral-900 shrink-0 hover:underline">
            Open →
          </Link>
        </div>
      )}
    </div>
  );
}
