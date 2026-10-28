"use server";

import { adminClient } from "@/lib/supabase/admin";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { getFunnelMetricsSummary, runSignupConversionAgentAnalysis } from "@/lib/conversion/agent";
import { deriveSignupAbandonment } from "@/lib/conversion/server";
import { VisitorSegment, CTAConfig } from "@/lib/conversion/types";
import { revalidatePath } from "next/cache";

export async function getConversionDashboardData(lookbackDays = 30) {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return null;

  const admin = adminClient();

  // 1. Funnel Metrics Summary
  const funnel = await getFunnelMetricsSummary(lookbackDays);

  // 2. Derive latest signup abandonment
  const derivedAbandonmentToday = await deriveSignupAbandonment(30);

  // 3. Fetch Experiments
  const { data: experiments } = await admin
    .from("conversion_experiments")
    .select("*, variants:conversion_experiment_variants(*)")
    .order("created_at", { ascending: false });

  // 4. Fetch Recommendations
  const { data: recommendations } = await admin
    .from("conversion_agent_recommendations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // 5. Fetch Agent Logs
  const { data: agentLogs } = await admin
    .from("conversion_agent_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  // 6. Fetch CTA Configurations
  const { data: ctaConfigs } = await admin
    .from("conversion_cta_configs")
    .select("*")
    .order("segment", { ascending: true });

  // 7. Fetch Recent Events
  const { data: recentEvents } = await admin
    .from("conversion_events")
    .select("id, event_name, session_id, page_slug, visitor_segment, utm_source, device_category, created_at")
    .order("created_at", { ascending: false })
    .limit(40);

  // 8. Fetch Audit Logs
  const { data: auditLogs } = await admin
    .from("conversion_audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  return {
    funnel,
    derivedAbandonmentToday,
    experiments: experiments || [],
    recommendations: recommendations || [],
    agentLogs: agentLogs || [],
    ctaConfigs: ctaConfigs || [],
    recentEvents: recentEvents || [],
    auditLogs: auditLogs || [],
  };
}

export async function approveRecommendationAction(
  recommendationId: string,
  actorEmail = "ops_admin"
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return { success: false, error: "Unauthorized" };

  try {
    const admin = adminClient();
    const { data: rec } = await admin
      .from("conversion_agent_recommendations")
      .select("*")
      .eq("id", recommendationId)
      .single();

    if (!rec) return { success: false, error: "Recommendation not found" };

    // Apply proposed changes if applicable
    const proposed = rec.proposed_changes || {};
    if (rec.target_segment && (proposed.primaryCtaLabel || proposed.badgeText)) {
      await admin
        .from("conversion_cta_configs")
        .update({
          primary_cta_label: proposed.primaryCtaLabel || undefined,
          primary_cta_subtext: proposed.primaryCtaSubtext || undefined,
          badge_text: proposed.badgeText || undefined,
          updated_by: actorEmail,
          updated_at: new Date().toISOString(),
        })
        .eq("segment", rec.target_segment);
    }

    if (proposed.action === "promote_variant" && proposed.experimentId && proposed.variantId) {
      await admin
        .from("conversion_experiments")
        .update({
          winning_variant_id: proposed.variantId,
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", proposed.experimentId);
    }

    // Update recommendation status to approved/applied
    await admin
      .from("conversion_agent_recommendations")
      .update({
        status: "approved",
        approved_by: actorEmail,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", recommendationId);

    // Audit log
    await admin.from("conversion_audit_logs").insert({
      action: "approve_recommendation",
      entity_type: "conversion_agent_recommendation",
      entity_id: recommendationId,
      actor_email: actorEmail,
      details: {
        title: rec.title,
        proposedChanges: rec.proposed_changes,
      },
    });

    revalidatePath("/ops/conversion");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error approving recommendation" };
  }
}

export async function rejectRecommendationAction(
  recommendationId: string,
  reason?: string,
  actorEmail = "ops_admin"
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return { success: false, error: "Unauthorized" };

  try {
    const admin = adminClient();
    await admin
      .from("conversion_agent_recommendations")
      .update({
        status: "rejected",
        approved_by: actorEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", recommendationId);

    await admin.from("conversion_audit_logs").insert({
      action: "reject_recommendation",
      entity_type: "conversion_agent_recommendation",
      entity_id: recommendationId,
      actor_email: actorEmail,
      details: { reason: reason || "Dismissed by operator" },
    });

    revalidatePath("/ops/conversion");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error rejecting recommendation" };
  }
}

export async function triggerAgentAnalysisAction(): Promise<{ success: boolean; count?: number; error?: string }> {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return { success: false, error: "Unauthorized" };

  try {
    const res = await runSignupConversionAgentAnalysis("manual_trigger");
    revalidatePath("/ops/conversion");
    return { success: true, count: res.recommendationsCreated };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Analysis run failed" };
  }
}

export async function rollbackExperimentAction(
  experimentId: string,
  actorEmail = "ops_admin"
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return { success: false, error: "Unauthorized" };

  try {
    const admin = adminClient();
    await admin
      .from("conversion_experiments")
      .update({
        status: "rolled_back",
        updated_at: new Date().toISOString(),
      })
      .eq("id", experimentId);

    await admin.from("conversion_audit_logs").insert({
      action: "rollback_experiment",
      entity_type: "conversion_experiment",
      entity_id: experimentId,
      actor_email: actorEmail,
      details: { timestamp: new Date().toISOString() },
    });

    revalidatePath("/ops/conversion");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error rolling back experiment" };
  }
}
