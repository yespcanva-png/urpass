import { adminClient } from "@/lib/supabase/admin";
import { VisitorSegment, AgentRecommendation, AgentLog } from "./types";
import { calculateExperimentStatistics } from "./experiments";

export interface FunnelMetricsSummary {
  periodDays: number;
  totalVisitors: number;
  uniqueSessions: number;
  landingPageViews: number;
  ctaClicks: number;
  ctaClickThroughRate: number; // percentage
  signupStarts: number;
  signupStartRate: number; // percentage of visitors
  signupCompletions: number;
  signupCompletionRate: number; // percentage of starts
  overallSignupConversionRate: number; // percentage of visitors
  firstEventsCreated: number;
  firstEventActivationRate: number; // percentage of signups
  firstEventsPublished: number;
  managedServiceLeads: number;
  paidConversions: number;
  paidConversionRate: number;
  bySegment: Record<VisitorSegment, { views: number; ctaClicks: number; signups: number; leads: number }>;
  byTrafficSource: Record<string, { views: number; signups: number; cr: number }>;
  byGeoCountry: Record<string, { views: number; signups: number }>;
  topUnderperformingPages: Array<{
    pageSlug: string;
    views: number;
    ctaClicks: number;
    ctr: number;
    signups: number;
    potentialIssue: string;
  }>;
}

/**
 * Aggregates funnel metrics from conversion_events and visitor sessions for the given lookback period.
 */
export async function getFunnelMetricsSummary(lookbackDays = 30): Promise<FunnelMetricsSummary> {
  const admin = adminClient();
  const sinceDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString();

  // 1. Fetch events
  const { data: events, error } = await admin
    .from("conversion_events")
    .select("event_name, session_id, page_slug, visitor_segment, utm_source, device_category, created_at, metadata")
    .gte("created_at", sinceDate);

  const safeEvents = events || [];

  const sessionsSet = new Set<string>();
  let landingPageViews = 0;
  let ctaClicks = 0;
  let signupStarts = 0;
  let signupCompletions = 0;
  let firstEventsCreated = 0;
  let firstEventsPublished = 0;
  let managedServiceLeads = 0;
  let paidConversions = 0;

  const segmentMetrics: Record<VisitorSegment, { views: number; ctaClicks: number; signups: number; leads: number }> = {
    college: { views: 0, ctaClicks: 0, signups: 0, leads: 0 },
    corporate: { views: 0, ctaClicks: 0, signups: 0, leads: 0 },
    ticketing: { views: 0, ctaClicks: 0, signups: 0, leads: 0 },
    managed_service: { views: 0, ctaClicks: 0, signups: 0, leads: 0 },
    general: { views: 0, ctaClicks: 0, signups: 0, leads: 0 },
  };

  const pageMetrics: Record<string, { views: number; ctaClicks: number; signups: number }> = {};
  const sourceMetrics: Record<string, { views: number; signups: number }> = {};
  const geoMetrics: Record<string, { views: number; signups: number }> = {};

  for (const evt of safeEvents) {
    if (evt.session_id) sessionsSet.add(evt.session_id);

    const seg = (evt.visitor_segment as VisitorSegment) || "general";
    if (!segmentMetrics[seg]) {
      segmentMetrics[seg] = { views: 0, ctaClicks: 0, signups: 0, leads: 0 };
    }

    const page = evt.page_slug || "unknown";
    if (!pageMetrics[page]) pageMetrics[page] = { views: 0, ctaClicks: 0, signups: 0 };

    const source = evt.utm_source || "organic";
    if (!sourceMetrics[source]) sourceMetrics[source] = { views: 0, signups: 0 };

    const ipCountry = (evt.metadata as any)?.ip_country || "IN";
    if (!geoMetrics[ipCountry]) geoMetrics[ipCountry] = { views: 0, signups: 0 };

    switch (evt.event_name) {
      case "landing_page_view":
        landingPageViews++;
        segmentMetrics[seg].views++;
        pageMetrics[page].views++;
        sourceMetrics[source].views++;
        geoMetrics[ipCountry].views++;
        break;
      case "primary_cta_click":
      case "secondary_cta_click":
        ctaClicks++;
        segmentMetrics[seg].ctaClicks++;
        pageMetrics[page].ctaClicks++;
        break;
      case "signup_started":
        signupStarts++;
        break;
      case "signup_completed":
        signupCompletions++;
        segmentMetrics[seg].signups++;
        pageMetrics[page].signups++;
        sourceMetrics[source].signups++;
        geoMetrics[ipCountry].signups++;
        break;
      case "first_event_created":
        firstEventsCreated++;
        break;
      case "first_event_published":
        firstEventsPublished++;
        break;
      case "managed_service_enquiry":
        managedServiceLeads++;
        segmentMetrics[seg].leads++;
        break;
      case "subscription_started":
      case "subscription_activated":
        paidConversions++;
        break;
    }
  }

  const uniqueSessions = sessionsSet.size;
  const totalVisitors = Math.max(uniqueSessions, landingPageViews);

  const ctaClickThroughRate = totalVisitors > 0 ? Number(((ctaClicks / totalVisitors) * 100).toFixed(1)) : 0;
  const signupStartRate = totalVisitors > 0 ? Number(((signupStarts / totalVisitors) * 100).toFixed(1)) : 0;
  const signupCompletionRate = signupStarts > 0 ? Number(((signupCompletions / signupStarts) * 100).toFixed(1)) : 0;
  const overallSignupConversionRate = totalVisitors > 0 ? Number(((signupCompletions / totalVisitors) * 100).toFixed(2)) : 0;
  const firstEventActivationRate = signupCompletions > 0 ? Number(((firstEventsCreated / signupCompletions) * 100).toFixed(1)) : 0;
  const paidConversionRate = signupCompletions > 0 ? Number(((paidConversions / signupCompletions) * 100).toFixed(1)) : 0;

  // Identify high-traffic, low-conversion landing pages
  const topUnderperformingPages = Object.entries(pageMetrics)
    .filter(([slug, m]) => slug !== "/signup" && slug !== "/login" && m.views >= 5)
    .map(([pageSlug, m]) => {
      const ctr = m.views > 0 ? Number(((m.ctaClicks / m.views) * 100).toFixed(1)) : 0;
      let potentialIssue = "Healthy conversion";
      if (ctr < 3.0) potentialIssue = "Low CTA click-through (<3%): copy or visual contrast issue";
      else if (m.ctaClicks > 5 && m.signups === 0) potentialIssue = "High CTA intent but 0 signups: auth friction or mismatch";
      return { pageSlug, views: m.views, ctaClicks: m.ctaClicks, ctr, signups: m.signups, potentialIssue };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const byTrafficSource: Record<string, { views: number; signups: number; cr: number }> = {};
  for (const [src, data] of Object.entries(sourceMetrics)) {
    const cr = data.views > 0 ? Number(((data.signups / data.views) * 100).toFixed(2)) : 0;
    byTrafficSource[src] = { ...data, cr };
  }

  return {
    periodDays: lookbackDays,
    totalVisitors,
    uniqueSessions,
    landingPageViews,
    ctaClicks,
    ctaClickThroughRate,
    signupStarts,
    signupStartRate,
    signupCompletions,
    signupCompletionRate,
    overallSignupConversionRate,
    firstEventsCreated,
    firstEventActivationRate,
    firstEventsPublished,
    managedServiceLeads,
    paidConversions,
    paidConversionRate,
    bySegment: segmentMetrics,
    byTrafficSource,
    byGeoCountry: geoMetrics,
    topUnderperformingPages,
  };
}

/**
 * AI Growth Agent analysis runner.
 * Evaluates conversion funnels, generates intelligent hypotheses, and writes recommendations.
 */
export async function runSignupConversionAgentAnalysis(
  runType: "scheduled_daily" | "scheduled_weekly" | "manual_trigger" = "manual_trigger"
): Promise<{ insights: any[]; recommendationsCreated: number }> {
  const admin = adminClient();
  const metrics = await getFunnelMetricsSummary(30);

  const insights: Array<{
    type: "positive" | "warning" | "alert" | "info";
    title: string;
    description: string;
    metric?: string;
  }> = [];

  const recommendationsToCreate: Array<{
    title: string;
    summary: string;
    hypothesis: string;
    targetMetric: string;
    targetPageSlug?: string;
    targetSegment?: VisitorSegment;
    proposedChanges: Record<string, unknown>;
    priority: "low" | "medium" | "high" | "critical";
  }> = [];

  // Insight 1: Overall Signup Conversion Health
  if (metrics.overallSignupConversionRate >= 5.0) {
    insights.push({
      type: "positive",
      title: "Strong Overall Conversion Rate",
      description: `Overall signup conversion is healthy at ${metrics.overallSignupConversionRate}% (${metrics.signupCompletions} signups across ${metrics.totalVisitors} visitors).`,
      metric: `${metrics.overallSignupConversionRate}%`,
    });
  } else {
    insights.push({
      type: "warning",
      title: "Conversion Optimization Opportunity",
      description: `Overall signup conversion is at ${metrics.overallSignupConversionRate}%. Improving top landing page CTA resonance can drive +20–30% more organizer signups.`,
      metric: `${metrics.overallSignupConversionRate}%`,
    });
  }

  // Insight 2: Segment Drop-offs & Opportunities
  const collegeMetrics = metrics.bySegment.college;
  if (collegeMetrics.views > 0 && collegeMetrics.ctaClicks / Math.max(1, collegeMetrics.views) < 0.05) {
    insights.push({
      type: "alert",
      title: "Campus & College Segment Friction",
      description: `College pages have high traffic (${collegeMetrics.views} views) but under 5% CTA CTR. Campus fest organizers respond strongly to free pass allowances and sub-second QR entry guarantees.`,
    });

    recommendationsToCreate.push({
      title: "Deploy Campus-Specific CTA Headline & Badges",
      summary: "Highlight Free Forever tier, zero ticket commission, and gate scanning throughput on all campus fest landing pages.",
      hypothesis: "Clarifying the 100 free ticket allowance and zero commission will decrease hesitation among student organizers, increasing CTA clicks by >25%.",
      targetMetric: "signup_completed",
      targetSegment: "college",
      priority: "high",
      proposedChanges: {
        primaryCtaLabel: "Create Free College Event",
        primaryCtaSubtext: "0% Commission · 100 Free Tickets Included · Sub-second Gate Scan",
        badgeText: "Campus Fest Verified",
      },
    });
  }

  // Insight 3: Evaluate Active Experiments
  const { data: activeExperiments } = await admin
    .from("conversion_experiments")
    .select("*, variants:conversion_experiment_variants(*)")
    .eq("status", "active");

  if (activeExperiments && activeExperiments.length > 0) {
    for (const exp of activeExperiments) {
      const variants = exp.variants || [];
      const control = variants.find((v: any) => v.is_control) || variants[0];
      const variantB = variants.find((v: any) => !v.is_control);

      if (control && variantB) {
        // Query conversion counts for each variant
        const { data: eventCounts } = await admin
          .from("conversion_events")
          .select("variant_id, event_name")
          .eq("experiment_id", exp.id);

        const expEvents = eventCounts || [];
        const visitorsA = expEvents.filter((e) => e.variant_id === control.id && e.event_name === "experiment_exposed").length;
        const conversionsA = expEvents.filter((e) => e.variant_id === control.id && e.event_name === "signup_completed").length;
        const visitorsB = expEvents.filter((e) => e.variant_id === variantB.id && e.event_name === "experiment_exposed").length;
        const conversionsB = expEvents.filter((e) => e.variant_id === variantB.id && e.event_name === "signup_completed").length;

        const stats = calculateExperimentStatistics(visitorsA, conversionsA, visitorsB, conversionsB);

        if (stats.isStatisticallySignificant && stats.recommendation === "declare_winner") {
          insights.push({
            type: "positive",
            title: `A/B Experiment "${exp.name}" Won with ${stats.confidencePercent}% Confidence`,
            description: `Variant "${variantB.name}" outperformed control by +${stats.relativeLift}% relative lift (p=${stats.pValue}). Ready for manual rollout.`,
            metric: `+${stats.relativeLift}% Lift`,
          });

          recommendationsToCreate.push({
            title: `Promote Winning Variant for Experiment: ${exp.name}`,
            summary: `Variant "${variantB.name}" demonstrated a statistically significant lift of +${stats.relativeLift}% over control.`,
            hypothesis: `Applying "${variantB.name}" globally will permanently improve conversion for ${exp.target_segment || "all"} visitors.`,
            targetMetric: "signup_completed",
            targetPageSlug: exp.target_page_slug,
            targetSegment: exp.target_segment,
            priority: "high",
            proposedChanges: {
              action: "promote_variant",
              experimentId: exp.id,
              variantId: variantB.id,
              payload: variantB.payload,
            },
          });
        }
      }
    }
  }

  // Insight 4: High-traffic underperforming pages
  if (metrics.topUnderperformingPages.length > 0) {
    const worst = metrics.topUnderperformingPages[0];
    if (worst.ctr < 3.0 && worst.views >= 10) {
      recommendationsToCreate.push({
        title: `A/B Test Intent CTA on High-Traffic Page: ${worst.pageSlug}`,
        summary: `Page ${worst.pageSlug} recorded ${worst.views} visits with only ${worst.ctr}% CTR. Test an action-oriented primary CTA.`,
        hypothesis: `Replacing passive copy with outcome-based phrasing will double click-through rate from ${worst.ctr}% to >6%.`,
        targetMetric: "primary_cta_click",
        targetPageSlug: worst.pageSlug,
        priority: "medium",
        proposedChanges: {
          action: "create_experiment",
          experimentKey: `ab_${worst.pageSlug.replace(/^\//, "").replace(/-/g, "_")}_cta`,
          targetPageSlug: worst.pageSlug,
          control: { primaryCtaLabel: "Create Your Event" },
          variant: { primaryCtaLabel: "Start Free in 60 Seconds" },
        },
      });
    }
  }

  // Persist Recommendations (Status = pending, requires explicit approval)
  let recommendationsCreated = 0;
  for (const rec of recommendationsToCreate) {
    // Avoid duplicate pending recommendations
    const { data: existing } = await admin
      .from("conversion_agent_recommendations")
      .select("id")
      .eq("title", rec.title)
      .eq("status", "pending")
      .maybeSingle();

    if (!existing) {
      await admin.from("conversion_agent_recommendations").insert({
        title: rec.title,
        summary: rec.summary,
        hypothesis: rec.hypothesis,
        target_metric: rec.targetMetric,
        target_page_slug: rec.targetPageSlug || null,
        target_segment: rec.targetSegment || null,
        proposed_changes: rec.proposedChanges,
        status: "pending",
        priority: rec.priority,
      });
      recommendationsCreated++;
    }
  }

  // Record Agent Log
  await admin.from("conversion_agent_logs").insert({
    run_type: runType,
    metrics_analyzed: {
      totalVisitors: metrics.totalVisitors,
      ctaClicks: metrics.ctaClicks,
      signupCompletions: metrics.signupCompletions,
      overallSignupConversionRate: metrics.overallSignupConversionRate,
    },
    insights,
    recommendations_count: recommendationsCreated,
  });

  return { insights, recommendationsCreated };
}
