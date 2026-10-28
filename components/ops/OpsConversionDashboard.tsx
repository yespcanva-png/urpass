"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RefreshCw,
  Sliders,
  Layers,
  Globe,
  Compass,
  FileText,
  Activity,
  Bot,
  Percent,
  Check,
  ChevronRight,
  Clock,
  Calendar,
  Lock,
} from "lucide-react";
import {
  approveRecommendationAction,
  rejectRecommendationAction,
  triggerAgentAnalysisAction,
  rollbackExperimentAction,
} from "@/app/actions/conversion-dashboard";

interface Props {
  initialData: any;
}

export default function OpsConversionDashboard({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "funnel"
    | "pages"
    | "sources"
    | "experiments"
    | "recommendations"
    | "recovery"
    | "activity"
    | "settings"
  >("overview");
  const [isPending, startTransition] = useTransition();
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const funnel = data?.funnel || {};
  const experiments = data?.experiments || [];
  const recommendations = data?.recommendations || [];
  const agentLogs = data?.agentLogs || [];
  const ctaConfigs = data?.ctaConfigs || [];
  const recentEvents = data?.recentEvents || [];
  const auditLogs = data?.auditLogs || [];

  const handleRunAgent = () => {
    setActionMsg("Running AI Growth Agent analysis across all funnels...");
    startTransition(async () => {
      const res = await triggerAgentAnalysisAction();
      if (res.success) {
        setActionMsg(`Analysis complete! Created ${res.count || 0} recommendations.`);
        window.location.reload();
      } else {
        setActionMsg(`Agent analysis failed: ${res.error}`);
      }
    });
  };

  const handleApproveRec = (id: string) => {
    startTransition(async () => {
      const res = await approveRecommendationAction(id);
      if (res.success) {
        setActionMsg("Recommendation approved and applied successfully.");
        window.location.reload();
      } else {
        setActionMsg(`Failed to approve: ${res.error}`);
      }
    });
  };

  const handleRejectRec = (id: string) => {
    startTransition(async () => {
      const res = await rejectRecommendationAction(id);
      if (res.success) {
        setActionMsg("Recommendation rejected.");
        window.location.reload();
      }
    });
  };

  const handleRollback = (expId: string) => {
    if (!confirm("Are you sure you want to roll back this experiment? All visitors will immediately revert to the control.")) return;
    startTransition(async () => {
      const res = await rollbackExperimentAction(expId);
      if (res.success) {
        setActionMsg("Experiment rolled back to control.");
        window.location.reload();
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Signup Conversion Agent
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Agent 01 Active
                  </span>
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Autonomous Growth Telemetry, Intent CTA Engine &amp; Conversion Optimization
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ops/campaigns"
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
            >
              SEO Campaigns
            </Link>
            <Link
              href="/ops"
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
            >
              Ops Home
            </Link>
            <button
              onClick={handleRunAgent}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
              Run Agent Analysis
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3 bg-neutral-900 border border-violet-500/40 text-violet-300 text-xs rounded-xl flex items-center justify-between">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg(null)} className="text-neutral-500 hover:text-white">✕</button>
          </div>
        )}

        {/* Primary KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Visitors</div>
            <div className="text-2xl font-bold text-white mt-1">{(funnel.totalVisitors || 0).toLocaleString()}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{(funnel.uniqueSessions || 0).toLocaleString()} sessions</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">CTA Click Rate</div>
            <div className="text-2xl font-bold text-white mt-1">{funnel.ctaClickThroughRate || 0}%</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{funnel.ctaClicks || 0} total clicks</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Signup Starts</div>
            <div className="text-2xl font-bold text-white mt-1">{funnel.signupStarts || 0}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{funnel.signupStartRate || 0}% of visitors</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-violet-500/30 bg-violet-950/20">
            <div className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">Signups (Primary KPI)</div>
            <div className="text-2xl font-bold text-white mt-1">{funnel.signupCompletions || 0}</div>
            <div className="text-[11px] text-violet-300 mt-0.5">{funnel.signupCompletionRate || 0}% completion</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">1st Events Created</div>
            <div className="text-2xl font-bold text-white mt-1">{funnel.firstEventsCreated || 0}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{funnel.firstEventActivationRate || 0}% activation</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Leads &amp; Paid</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{funnel.managedServiceLeads || 0} <span className="text-xs text-neutral-500">/</span> {funnel.paidConversions || 0}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Managed leads / Subscriptions</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-neutral-800 text-xs">
          {[
            { id: "overview", label: "Overview & Funnel", icon: Activity },
            { id: "pages", label: "Landing Pages", icon: Layers },
            { id: "sources", label: "Traffic Sources & GEO", icon: Globe },
            { id: "experiments", label: "A/B Experiments", icon: Sliders, badge: experiments.length },
            { id: "recommendations", label: "AI Recommendations", icon: Sparkles, badge: recommendations.filter((r: any) => r.status === "pending").length },
            { id: "recovery", label: "Signup Recovery", icon: ShieldCheck },
            { id: "activity", label: "Agent Activity & Audits", icon: Bot },
            { id: "settings", label: "CTA Configurations", icon: Percent },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-violet-600 text-white shadow-xs"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white text-violet-700" : "bg-neutral-800 text-neutral-300"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Funnel */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Visual Funnel */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800">
              <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400" />
                End-to-End Organizer Conversion Funnel
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
                {[
                  { stage: "Landing Page Views", count: funnel.landingPageViews || 0, rate: "100%", sub: "Top of Funnel" },
                  { stage: "Primary CTA Clicks", count: funnel.ctaClicks || 0, rate: `${funnel.ctaClickThroughRate || 0}%`, sub: "Intent Formed" },
                  { stage: "Signup Started", count: funnel.signupStarts || 0, rate: `${funnel.signupStartRate || 0}%`, sub: "Form Interacted" },
                  { stage: "Signup Completed", count: funnel.signupCompletions || 0, rate: `${funnel.overallSignupConversionRate || 0}%`, sub: "Account Created" },
                  { stage: "1st Event Created", count: funnel.firstEventsCreated || 0, rate: `${funnel.firstEventActivationRate || 0}%`, sub: "Draft Ready" },
                  { stage: "Event Published / Paid", count: (funnel.firstEventsPublished || 0) + (funnel.paidConversions || 0), rate: `${funnel.paidConversionRate || 0}%`, sub: "Active Customer" },
                ].map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 relative flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Step {idx + 1}</div>
                      <div className="text-sm font-semibold text-white mt-1">{step.stage}</div>
                      <div className="text-xl font-bold text-violet-300 mt-2">{step.count.toLocaleString()}</div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">{step.sub}</span>
                      <span className="font-semibold text-emerald-400">{step.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Segment Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-violet-400" />
                  Conversion by Visitor Segment
                </h3>
                <div className="space-y-3">
                  {Object.entries(funnel.bySegment || {}).map(([seg, sdata]: any) => {
                    const ctr = sdata.views > 0 ? ((sdata.ctaClicks / sdata.views) * 100).toFixed(1) : "0";
                    return (
                      <div key={seg} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold uppercase text-white tracking-wide">{seg}</div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {sdata.views} views · {sdata.ctaClicks} clicks ({ctr}% CTR)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-violet-400">{sdata.signups} Signups</div>
                          <div className="text-[10px] text-neutral-500">{sdata.leads} managed leads</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights from Agent */}
              <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Latest AI Growth Agent Insights
                </h3>
                <div className="space-y-3">
                  {(agentLogs[0]?.insights || [
                    { type: "positive", title: "Organic Attribution Intact", description: "First-touch UTM and referrer attribution tracking active across all SEO clusters." },
                    { type: "info", title: "A/B Testing Guardrails Active", description: "Statistical significance tests active with two-tailed z-score and 100+ sample threshold." }
                  ]).map((insight: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {insight.type === "positive" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {insight.type === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {insight.type === "alert" && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                        {insight.type === "info" && <Bot className="w-3.5 h-3.5 text-violet-400" />}
                        <span>{insight.title}</span>
                      </div>
                      <p className="text-neutral-400 mt-1 leading-relaxed">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Landing Pages Performance */}
        {activeTab === "pages" && (
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-white">Landing Pages Conversion Telemetry</h2>
            <p className="text-xs text-neutral-400">
              Monitors views, CTA clicks, click-through rate, and completed organizer signups by landing page slug.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800 bg-neutral-950/40">
                  <tr>
                    <th className="py-3 px-4">Landing Page Slug</th>
                    <th className="py-3 px-3">Views</th>
                    <th className="py-3 px-3">CTA Clicks</th>
                    <th className="py-3 px-3">CTR (%)</th>
                    <th className="py-3 px-3">Signups</th>
                    <th className="py-3 px-4">Agent Diagnostic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {(funnel.topUnderperformingPages || []).length > 0 ? (
                    funnel.topUnderperformingPages.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-neutral-800/30">
                        <td className="py-3 px-4 font-mono text-violet-300">{row.pageSlug}</td>
                        <td className="py-3 px-3">{row.views}</td>
                        <td className="py-3 px-3">{row.ctaClicks}</td>
                        <td className="py-3 px-3 font-semibold text-white">{row.ctr}%</td>
                        <td className="py-3 px-3 font-bold text-emerald-400">{row.signups}</td>
                        <td className="py-3 px-4 text-neutral-400">{row.potentialIssue}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-neutral-500">
                        Collecting landing page impressions across public SEO/GEO routes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Traffic Sources & GEO */}
        {activeTab === "sources" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-400" /> Traffic Sources Attribution
              </h2>
              <div className="space-y-2">
                {Object.entries(funnel.byTrafficSource || {}).map(([src, s]: any) => (
                  <div key={src} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">{src}</span>
                      <span className="text-neutral-500 ml-2">({s.views} views)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400">{s.signups} signups</span>
                      <span className="text-neutral-500 ml-2">({s.cr}% CR)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-violet-400" /> GEO Country Distribution
              </h2>
              <div className="space-y-2">
                {Object.entries(funnel.byGeoCountry || {}).map(([geo, g]: any) => (
                  <div key={geo} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Country: {geo}</span>
                    <span className="text-neutral-400">{g.views} views · {g.signups} signups</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: A/B Experiments */}
        {activeTab === "experiments" && (
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">A/B Testing Experiments</h2>
                <p className="text-xs text-neutral-400">
                  Deterministic variant hashing, exposure tracking, and statistical significance verification.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {experiments.map((exp: any) => (
                <div key={exp.id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{exp.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-neutral-800 text-neutral-300">
                          {exp.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 font-mono">{exp.experiment_key} · Target: {exp.target_page_slug || "Global"} ({exp.target_segment || "all segments"})</p>
                    </div>

                    {exp.status === "active" && (
                      <button
                        onClick={() => handleRollback(exp.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 transition-colors"
                      >
                        Rollback to Control
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(exp.variants || []).map((v: any) => (
                      <div key={v.id} className={`p-3.5 rounded-xl border text-xs ${
                        v.is_control ? "bg-neutral-900/60 border-neutral-800" : "bg-violet-950/20 border-violet-800/40"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{v.name}</span>
                          <span className="text-[10px] text-neutral-400">{v.weight}% weight {v.is_control ? "(Control)" : "(Variant)"}</span>
                        </div>
                        <div className="mt-2 text-[11px] text-neutral-400 font-mono">
                          Payload: {JSON.stringify(v.payload)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: AI Recommendations */}
        {activeTab === "recommendations" && (
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">AI Growth Agent Recommendations</h2>
              <p className="text-xs text-neutral-400">
                Requires explicit human operator approval before modifying any CTA copy or rolling out experiment winners.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {recommendations.length > 0 ? (
                recommendations.map((rec: any) => (
                  <div key={rec.id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          rec.priority === "high" || rec.priority === "critical"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}>
                          {rec.priority} Priority
                        </span>
                        <h3 className="text-sm font-bold text-white">{rec.title}</h3>
                      </div>

                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        rec.status === "approved" ? "bg-emerald-500/20 text-emerald-300" :
                        rec.status === "rejected" ? "bg-neutral-800 text-neutral-400" :
                        "bg-amber-500/20 text-amber-300"
                      }`}>
                        {rec.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">{rec.summary}</p>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                      <strong className="text-neutral-200">Hypothesis:</strong> {rec.hypothesis}
                    </div>

                    <div className="text-[11px] font-mono text-neutral-500">
                      Target Metric: {rec.target_metric} · Proposed: {JSON.stringify(rec.proposed_changes)}
                    </div>

                    {rec.status === "pending" && (
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleApproveRec(rec.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve &amp; Apply
                        </button>
                        <button
                          onClick={() => handleRejectRec(rec.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No pending recommendations. Click &quot;Run Agent Analysis&quot; to evaluate current funnel data.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Signup Recovery */}
        {activeTab === "recovery" && (
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-white">Signup Recovery Telemetry</h2>
            <p className="text-xs text-neutral-400">
              Tracks exit-intent modal triggers, assistance interactions, and derived abandonment intervals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs text-neutral-400">Derived Abandonment (Today)</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">{data?.derivedAbandonmentToday || 0}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Stalled &gt;30m without completion</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs text-neutral-400">Recovery Modal Triggers</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {recentEvents.filter((e: any) => e.event_name === "recovery_modal_shown").length}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Exit intent &amp; hesitation assists</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs text-neutral-400">Privacy Safeguard</div>
                <div className="text-sm font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> 100% Fingerprint-Free
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Strict PECR/GDPR compliance</div>
              </div>
            </div>

            {/* Recent Events Feed */}
            <div className="pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Live Funnel Event Stream</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="text-[10px] uppercase text-neutral-500 bg-neutral-950/60 border-b border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3">Event Name</th>
                      <th className="py-2.5 px-3">Session</th>
                      <th className="py-2.5 px-3">Page</th>
                      <th className="py-2.5 px-3">Segment</th>
                      <th className="py-2.5 px-3">Source</th>
                      <th className="py-2.5 px-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/40">
                    {recentEvents.map((evt: any) => (
                      <tr key={evt.id} className="hover:bg-neutral-800/20">
                        <td className="py-2.5 px-3 font-semibold text-violet-300">{evt.event_name}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-500">{evt.session_id.slice(0, 10)}…</td>
                        <td className="py-2.5 px-3">{evt.page_slug}</td>
                        <td className="py-2.5 px-3 text-neutral-400">{evt.visitor_segment}</td>
                        <td className="py-2.5 px-3 text-neutral-400">{evt.utm_source || "direct"}</td>
                        <td className="py-2.5 px-3 text-neutral-500">{new Date(evt.created_at).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Agent Activity & Audits */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <h2 className="text-base font-bold text-white">Agent Execution Logs</h2>
              <div className="space-y-3">
                {agentLogs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-400 uppercase tracking-wide">{log.run_type}</span>
                      <span className="text-neutral-500">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-neutral-300">
                      Evaluated {log.metrics_analyzed?.totalVisitors || 0} visitors · Created {log.recommendations_count} recommendations.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <h2 className="text-base font-bold text-white">Operator Audit Records</h2>
              <div className="space-y-2">
                {auditLogs.map((audit: any) => (
                  <div key={audit.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">{audit.action}</span>
                      <span className="text-neutral-500 ml-2">by {audit.actor_email}</span>
                    </div>
                    <span className="text-neutral-500">{new Date(audit.created_at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: CTA Configurations */}
        {activeTab === "settings" && (
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-white">Intent-Based CTA Configurations</h2>
            <p className="text-xs text-neutral-400">
              Active CTA rules governing hero buttons, value propositions, and badges across visitor segments.
            </p>

            <div className="space-y-4 pt-2">
              {ctaConfigs.map((cfg: any) => (
                <div key={cfg.id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase text-violet-400 tracking-wider">{cfg.segment}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {cfg.badge_text || "Active"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                      <div className="text-[10px] uppercase text-neutral-500 font-semibold">Primary CTA</div>
                      <div className="font-bold text-white mt-1">{cfg.primary_cta_label}</div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">{cfg.primary_cta_subtext}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                      <div className="text-[10px] uppercase text-neutral-500 font-semibold">Secondary CTA</div>
                      <div className="font-bold text-white mt-1">{cfg.secondary_cta_label}</div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">{cfg.secondary_cta_subtext}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
