"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import OpsPinModal from "./OpsPinModal";

type Grain = "day" | "week" | "month";
type SourceRow = {
  source: string; visitors: number; signups: number; eventsCreated: number;
  paidSubscriptions: number; signupRate: number; paidRate: number;
};
type SeriesRow = { bucket: string; source: string; visitors: number };
type VisitorRow = {
  id: string; firstSource: string; lastSource: string;
  firstReferrerHost: string | null; firstUtmSource: string | null;
  firstUtmMedium: string | null; firstUtmCampaign: string | null;
  firstLandingPath: string | null; firstSeenAt: string; lastSeenAt: string;
  signups: number; eventsCreated: number; paidSubscriptions: number;
};
type Report = { sources: SourceRow[]; series: SeriesRow[]; visitors: VisitorRow[] };

const COLORS = ["#7c3aed", "#0891b2", "#059669", "#ea580c", "#dc2626", "#4f46e5", "#ca8a04", "#64748b"];
const GRAIN_DAYS: Record<Grain, number> = { day: 30, week: 90, month: 180 };

function formatDate(value: string, grain: Grain) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return date.toLocaleDateString("en-IN", {
    timeZone: "UTC", day: grain === "month" ? undefined : "numeric",
    month: "short", year: grain === "month" ? "2-digit" : undefined,
  });
}

export default function OpsTrafficDashboard({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [grain, setGrain] = useState<Grain>("day");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authenticated) return;
    const controller = new AbortController();
    fetch(`/api/ops/traffic?grain=${grain}&days=${GRAIN_DAYS[grain]}`, {
      cache: "no-store", signal: controller.signal,
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load traffic report.");
      setReport(data);
    }).catch((cause) => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load traffic report.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [authenticated, grain]);

  const chart = useMemo(() => {
    const buckets = new Map<string, Map<string, number>>();
    for (const row of report?.series || []) {
      const sources = buckets.get(row.bucket) || new Map<string, number>();
      sources.set(row.source, Number(row.visitors));
      buckets.set(row.bucket, sources);
    }
    return [...buckets].sort(([a], [b]) => a.localeCompare(b)).map(([bucket, sources]) => ({
      bucket, sources, total: [...sources.values()].reduce((a, b) => a + b, 0),
    }));
  }, [report]);
  const sourceNames = useMemo(() => [...new Set((report?.series || []).map((row) => row.source))], [report]);
  const colorFor = (source: string) => COLORS[sourceNames.indexOf(source) % COLORS.length];
  const maxTotal = Math.max(1, ...chart.map((row) => row.total));
  const totals = (report?.sources || []).reduce((acc, row) => ({
    visitors: acc.visitors + Number(row.visitors),
    signups: acc.signups + Number(row.signups),
    events: acc.events + Number(row.eventsCreated),
    paid: acc.paid + Number(row.paidSubscriptions),
  }), { visitors: 0, signups: 0, events: 0, paid: 0 });

  const aiTotals = (report?.sources || [])
    .filter((row) => ["ChatGPT", "Perplexity", "Gemini", "Claude"].includes(row.source))
    .reduce((acc, row) => ({
      visitors: acc.visitors + Number(row.visitors),
      signups: acc.signups + Number(row.signups),
      events: acc.events + Number(row.eventsCreated),
      paid: acc.paid + Number(row.paidSubscriptions),
    }), { visitors: 0, signups: 0, events: 0, paid: 0 });

  if (!authenticated) return <OpsPinModal onSuccess={() => setAuthenticated(true)} />;

  return <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-violet-300">
            <Link href="/ops" className="hover:text-white">← Ops</Link>
            <span className="text-slate-600">·</span>
            <Link href="/ops/intelligence" className="text-indigo-400 hover:text-indigo-300 font-medium">User Intelligence Dashboard →</Link>
          </div>
          <h1 className="mt-2 text-3xl font-bold">Traffic &amp; AI Discovery Analytics</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">Consented, unique visitor acquisition by first touch. Tracks AEO attribution (ChatGPT, Perplexity, Gemini, Claude), search, community, and direct cohorts through signup and payment.</p>
        </div>
        <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1" aria-label="Chart interval">
          {(["day", "week", "month"] as const).map((value) => <button key={value} type="button"
            onClick={() => { setLoading(true); setError(""); setGrain(value); }} aria-pressed={grain === value}
            className={`rounded-md px-4 py-2 text-sm capitalize ${grain === value ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>{value === "day" ? "Daily" : value === "week" ? "Weekly" : "Monthly"}</button>)}
        </div>
      </header>

      {error && <p role="alert" className="mt-6 rounded-lg border border-red-700 bg-red-950 p-4 text-sm text-red-200">{error}</p>}
      {loading && <p className="mt-6 text-sm text-slate-400">Loading traffic data…</p>}
      {report && <>
        {/* Dedicated AEO Discovery & Attribution Section */}
        <section className="mt-8 rounded-2xl border border-violet-500/30 bg-violet-950/20 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-500/20 pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase">AEO Intelligence</span>
              <h2 className="text-xl font-bold text-white">AI Discovery &amp; Attribution Hub</h2>
              <p className="text-xs text-slate-400">Aggregated performance from Generative AI search engines (ChatGPT, Perplexity, Gemini, Claude).</p>
            </div>
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
              Live Attribution
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-violet-900/60 bg-slate-900/90 p-5">
              <p className="text-xs text-violet-300">AI Referral Sessions</p>
              <p className="mt-2 text-3xl font-extrabold text-white">{Number(aiTotals.visitors).toLocaleString("en-IN")}</p>
              <p className="mt-1 text-[11px] text-slate-400">Unique visitors referred by LLM engines</p>
            </div>
            <div className="rounded-xl border border-violet-900/60 bg-slate-900/90 p-5">
              <p className="text-xs text-violet-300">AI-Sourced Signups</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-400">{Number(aiTotals.signups).toLocaleString("en-IN")}</p>
              <p className="mt-1 text-[11px] text-slate-400">{aiTotals.visitors > 0 ? `${((aiTotals.signups / aiTotals.visitors) * 100).toFixed(1)}% conversion` : "0% conversion"}</p>
            </div>
            <div className="rounded-xl border border-violet-900/60 bg-slate-900/90 p-5">
              <p className="text-xs text-violet-300">Events Created</p>
              <p className="mt-2 text-3xl font-extrabold text-cyan-400">{Number(aiTotals.events).toLocaleString("en-IN")}</p>
              <p className="mt-1 text-[11px] text-slate-400">Live events published by AI cohort</p>
            </div>
            <div className="rounded-xl border border-violet-900/60 bg-slate-900/90 p-5">
              <p className="text-xs text-violet-300">Paid Conversions</p>
              <p className="mt-2 text-3xl font-extrabold text-amber-400">{Number(aiTotals.paid).toLocaleString("en-IN")}</p>
              <p className="mt-1 text-[11px] text-slate-400">Paid subscriptions &amp; passes</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[["Total new visitors", totals.visitors], ["Total signups", totals.signups], ["Events created", totals.events], ["Paid organisers", totals.paid]].map(([label, value]) =>
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{Number(value).toLocaleString("en-IN")}</p></div>)}
        </section>

        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Unique visitors by source · {grain === "day" ? "last 30 days" : grain === "week" ? "last 90 days" : "last 180 days"}</h2>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-300">
            {sourceNames.map((name) => <span key={name} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colorFor(name) }} />{name}</span>)}
          </div>
          {chart.length === 0 ? <p className="mt-6 text-sm text-slate-400">No consented visits recorded in this period.</p> :
            <div className="mt-6 space-y-2 overflow-x-auto">
              {chart.map((row) => <div key={row.bucket} className="flex min-w-[480px] items-center gap-3 text-xs">
                <span className="w-16 shrink-0 text-slate-400">{formatDate(row.bucket, grain)}</span>
                <div className="flex h-5 overflow-hidden rounded bg-slate-800" style={{ width: `${Math.max(2, row.total / maxTotal * 85)}%` }} title={`${row.total} unique visitors`}>
                  {[...row.sources].map(([source, count]) => <div key={source} style={{ width: `${count / row.total * 100}%`, backgroundColor: colorFor(source) }} title={`${source}: ${count}`} />)}
                </div>
                <span className="font-semibold">{row.total}</span>
              </div>)}
            </div>}
        </section>

        <section className="mt-8 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Acquisition by first-touch source</h2>
          <p className="mt-1 text-xs text-slate-400">Signups, events, and paid organisers belong to new visitors acquired in the selected lookback period. One visitor is counted once per source cohort.</p>
          <table className="mt-5 w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs text-slate-400"><tr className="border-b border-slate-700"><th className="pb-3">Source</th><th className="pb-3 text-right">Visitors</th><th className="pb-3 text-right">Signups</th><th className="pb-3 text-right">Events</th><th className="pb-3 text-right">Paid</th><th className="pb-3 text-right">Signup rate</th><th className="pb-3 text-right">Paid rate</th></tr></thead>
            <tbody>{(report.sources || []).map((row) => <tr key={row.source} className="border-b border-slate-800"><td className="py-3 font-medium">{row.source}</td><td className="py-3 text-right">{row.visitors}</td><td className="py-3 text-right">{row.signups}</td><td className="py-3 text-right">{row.eventsCreated}</td><td className="py-3 text-right">{row.paidSubscriptions}</td><td className="py-3 text-right">{row.signupRate}%</td><td className="py-3 text-right">{row.paidRate}%</td></tr>)}</tbody>
          </table>
        </section>

        <section className="mt-8 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Recent visitor acquisition</h2>
          <p className="mt-1 text-xs text-slate-400">Latest 100 consented visitors. IDs are shortened in Ops; no IP addresses or full referrer URLs are stored.</p>
          <table className="mt-5 w-full min-w-[1050px] text-left text-xs">
            <thead className="text-slate-400"><tr className="border-b border-slate-700"><th className="pb-3">Visitor</th><th className="pb-3">First seen</th><th className="pb-3">First source</th><th className="pb-3">Last source</th><th className="pb-3">Referrer host</th><th className="pb-3">UTM source / medium / campaign</th><th className="pb-3">Landing</th><th className="pb-3 text-right">Signups</th><th className="pb-3 text-right">Events</th><th className="pb-3 text-right">Paid</th></tr></thead>
            <tbody>{(report.visitors || []).map((row) => <tr key={row.id} className="border-b border-slate-800 text-slate-200"><td className="py-3 font-mono">{row.id.slice(0, 8)}</td><td className="py-3">{new Date(row.firstSeenAt).toLocaleDateString("en-IN")}</td><td className="py-3">{row.firstSource}</td><td className="py-3">{row.lastSource}</td><td className="py-3">{row.firstReferrerHost || "—"}</td><td className="py-3">{[row.firstUtmSource, row.firstUtmMedium, row.firstUtmCampaign].filter(Boolean).join(" / ") || "—"}</td><td className="py-3">{row.firstLandingPath || "—"}</td><td className="py-3 text-right">{row.signups}</td><td className="py-3 text-right">{row.eventsCreated}</td><td className="py-3 text-right">{row.paidSubscriptions}</td></tr>)}</tbody>
          </table>
        </section>
      </>}
    </div>
  </main>;
}
