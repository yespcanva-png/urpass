"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import OpsPinModal from "./OpsPinModal";
import {
  Sparkles,
  Users,
  CalendarCheck,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
  Compass,
  Zap,
} from "lucide-react";

type OverviewData = {
  visitors: number;
  signups: number;
  activated: number;
  paying: number;
  visitorToSignupRate: number;
  signupToActivationRate: number;
  activationToPaidRate: number;
  overallConversionRate: number;
};

type SourceRow = {
  source: string;
  visitors: number;
  signups: number;
  activated: number;
  paying: number;
  signupRate: number;
  paidRate: number;
};

type UserJourneyRow = {
  userId: string;
  name: string;
  firstSource: string;
  lastSource: string;
  referrerHost: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  stage: "Paying" | "Activated" | "Signed up" | "Abandoned";
  action: string;
  eventsCount?: number;
  signedUpAt: string;
  lastSeenAt: string;
};

type ReportData = {
  overview: OverviewData;
  sources: SourceRow[];
  users: UserJourneyRow[];
  abandoned?: UserJourneyRow[];
};

const SOURCE_COLORS: Record<string, string> = {
  "ChatGPT": "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  "Product Hunt": "bg-orange-500/10 text-orange-300 border-orange-500/30",
  "Google": "bg-blue-500/10 text-blue-300 border-blue-500/30",
  "Reddit": "bg-red-500/10 text-red-300 border-red-500/30",
  "LinkedIn": "bg-sky-500/10 text-sky-300 border-sky-500/30",
  "X": "bg-neutral-800 text-neutral-200 border-neutral-700",
  "Claude": "bg-amber-500/10 text-amber-300 border-amber-500/30",
  "Gemini": "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  "Direct / Unknown": "bg-purple-500/10 text-purple-300 border-purple-500/30",
};

export default function OpsUserIntelligenceDashboard({
  initialAuthenticated,
}: {
  initialAuthenticated: boolean;
}) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [days, setDays] = useState<number>(30);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("All");

  useEffect(() => {
    if (!authenticated) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(`/api/ops/intelligence?days=${days}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load intelligence report.");
        setReport(data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load intelligence report.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [authenticated, days]);

  const combinedUsers = useMemo(() => {
    const list: UserJourneyRow[] = [...(report?.users || [])];
    if (report?.abandoned && report.abandoned.length > 0) {
      list.push(...(report.abandoned as UserJourneyRow[]));
    }
    return list;
  }, [report]);

  const filteredUsers = useMemo(() => {
    return combinedUsers.filter((user) => {
      const matchesStage = stageFilter === "All" || user.stage === stageFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.firstSource.toLowerCase().includes(q) ||
        user.action.toLowerCase().includes(q) ||
        (user.referrerHost && user.referrerHost.toLowerCase().includes(q));
      return matchesStage && matchesSearch;
    });
  }, [combinedUsers, stageFilter, searchQuery]);

  if (!authenticated) {
    return <OpsPinModal onSuccess={() => setAuthenticated(true)} />;
  }

  const overview = report?.overview || {
    visitors: 0,
    signups: 0,
    activated: 0,
    paying: 0,
    visitorToSignupRate: 0,
    signupToActivationRate: 0,
    activationToPaidRate: 0,
    overallConversionRate: 0,
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Navigation */}
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-violet-400 font-medium">
              <Link href="/ops" className="hover:text-white transition-colors">
                ← Ops Hub
              </Link>
              <span>/</span>
              <span className="text-slate-400">User Intelligence</span>
              <span className="text-slate-600">·</span>
              <Link href="/ops/traffic" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Traffic Sources →
              </Link>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>User Intelligence Dashboard</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                5 Tools Connected
              </span>
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              Track full organizer lifecycles: from discovery (ChatGPT, Google, Product Hunt, Reddit) to signup, event creation, and paying customer.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  days === d
                    ? "bg-violet-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Last {d} Days
              </button>
            ))}
          </div>
        </header>

        {error && (
          <div role="alert" className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* ── 1. Central Executive Funnel Cards ── */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Organiser Acquisition Funnel · Last {days} Days
            </h2>
            <span className="text-xs text-slate-500">
              Overall Visitor → Paid Conversion: <strong className="text-emerald-400 font-bold">{overview.overallConversionRate}%</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1: Visitors */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider">1. Visitors</span>
                <Users className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-3xl font-extrabold text-white">
                {Number(overview.visitors).toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Landing page discovery</p>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Baseline</span>
                <span className="text-slate-300 font-mono font-bold">100%</span>
              </div>
            </div>

            {/* Step 2: Signups */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider">2. Signups</span>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-blue-400">
                {Number(overview.signups).toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Organiser accounts created</p>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Visitor → Signup</span>
                <span className="text-blue-300 font-mono font-bold">
                  {overview.visitorToSignupRate}%
                </span>
              </div>
            </div>

            {/* Step 3: Activated Organisers */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider">3. Activated Organisers</span>
                <CalendarCheck className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-3xl font-extrabold text-violet-400">
                {Number(overview.activated).toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Created 1st real event</p>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Signup → First Event</span>
                <span className="text-violet-300 font-mono font-bold">
                  {overview.signupToActivationRate}%
                </span>
              </div>
            </div>

            {/* Step 4: Paying Organisers */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider">4. Paying Organisers</span>
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">
                {Number(overview.paying).toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Paid subscription / pass</p>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Active → Paid</span>
                <span className="text-emerald-300 font-mono font-bold">
                  {overview.activationToPaidRate}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Visitor Acquisition Sources Breakdown ── */}
        <section className="mt-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <span>Acquisition Sources &amp; Commercial Quality</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Which source brings organisers who actually create events and pay?
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs text-slate-400 border-b border-slate-800 pb-2">
                <tr>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold text-right">Visitors</th>
                  <th className="pb-3 font-semibold text-right">Signups</th>
                  <th className="pb-3 font-semibold text-right">Signup Rate</th>
                  <th className="pb-3 font-semibold text-right">Activated</th>
                  <th className="pb-3 font-semibold text-right">Paying Organisers</th>
                  <th className="pb-3 font-semibold text-right">Paid Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(report?.sources || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-xs text-slate-500">
                      {loading ? "Loading acquisition data…" : "No traffic source data recorded in this period."}
                    </td>
                  </tr>
                ) : (
                  (report?.sources || []).map((row) => {
                    const badgeClass =
                      SOURCE_COLORS[row.source] || "bg-slate-800 text-slate-300 border-slate-700";
                    return (
                      <tr key={row.source} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${badgeClass}`}
                          >
                            {row.source}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-300">
                          {Number(row.visitors).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 text-right font-mono font-semibold text-blue-300">
                          {Number(row.signups).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-400">
                          {row.signupRate}%
                        </td>
                        <td className="py-3.5 text-right font-mono font-semibold text-violet-300">
                          {Number(row.activated).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-emerald-400">
                          {Number(row.paying).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-emerald-300">
                          {row.paidRate}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 3. Organiser Journey & Lifecycle Activity Table ── */}
        <section className="mt-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <span>Organiser Lifecycle &amp; Journey Intelligence</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every user tracked from first visit source to payment action.
              </p>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Stage Filter */}
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
                {["All", "Paying", "Activated", "Signed up", "Abandoned"].map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setStageFilter(stage)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      stageFilter === stage
                        ? "bg-slate-800 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search user, source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 pb-2">
                <tr>
                  <th className="pb-3 font-semibold">User / Organiser</th>
                  <th className="pb-3 font-semibold">First Source</th>
                  <th className="pb-3 font-semibold">Latest Source</th>
                  <th className="pb-3 font-semibold">Current Stage</th>
                  <th className="pb-3 font-semibold">Action / Activity</th>
                  <th className="pb-3 font-semibold text-right">Signed Up / First Seen</th>
                  <th className="pb-3 font-semibold text-right">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                      {loading ? "Loading user journeys…" : "No organisers found matching your filters."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, i) => {
                    const badgeClass =
                      SOURCE_COLORS[u.firstSource] || "bg-slate-800 text-slate-300 border-slate-700";

                    const stageBadge =
                      u.stage === "Paying"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                        : u.stage === "Activated"
                        ? "bg-violet-500/15 text-violet-300 border-violet-500/40"
                        : u.stage === "Signed up"
                        ? "bg-blue-500/15 text-blue-300 border-blue-500/40"
                        : "bg-amber-500/15 text-amber-300 border-amber-500/40";

                    return (
                      <tr key={`${u.userId}-${i}`} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 font-medium text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-300">
                            {u.name.slice(0, 1).toUpperCase()}
                          </span>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${badgeClass}`}>
                            {u.firstSource}
                          </span>
                          {u.referrerHost && (
                            <span className="block text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                              {u.referrerHost}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-slate-300 text-[11px]">
                          {u.lastSource}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${stageBadge}`}>
                            {u.stage}
                          </span>
                        </td>
                        <td className="py-3 font-medium text-slate-200">
                          {u.action}
                        </td>
                        <td className="py-3 text-right text-slate-400 font-mono text-[11px]">
                          {new Date(u.signedUpAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="py-3 text-right text-slate-400 font-mono text-[11px]">
                          {new Date(u.lastSeenAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 4. Connected Tools Status Card ── */}
        <section className="mt-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Active Analytics Integrations:</span>
            <span className="text-slate-400">
              GA4 (<span className="text-emerald-400">Live</span>) · Microsoft Clarity (<span className="text-emerald-400">Ready</span>) · PostHog (<span className="text-emerald-400">Ready</span>) · Search Console (<span className="text-emerald-400">Verified</span>) · Supabase Tracking (<span className="text-emerald-400">Active</span>)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ops/traffic"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Traffic Time Series</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
