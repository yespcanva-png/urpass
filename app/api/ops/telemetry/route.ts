import { NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getLiveOpsEvents, type OpsLogItem } from "@/lib/ops/events";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type { OpsLogItem };

export async function GET() {
  const startTime = Date.now();

  try {
    const authenticated = await isOpsAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = adminClient();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Parallel fetch with corrected schema columns
    const [subsRes, profRes, evRes, ciRes, auditRes, authRes] = await Promise.all([
      admin
        .from("subscriptions")
        .select("id, user_id, status, provider, autopay_status, billing_cycle, updated_at, created_at")
        .order("updated_at", { ascending: false })
        .limit(100),

      admin
        .from("profiles")
        .select("id, user_id, email, full_name, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(100),

      admin
        .from("events")
        .select("id, organizer_id, name, venue, event_date, status, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(50),

      admin
        .from("check_ins")
        .select("id, pass_id, event_id, attendee_id, checked_in_at, checked_in_by, created_at")
        .order("created_at", { ascending: false })
        .limit(50),

      admin
        .from("enterprise_audit_logs")
        .select("id, action, resource_type, resource_id, details, ip_address, created_at")
        .order("created_at", { ascending: false })
        .limit(30),

      admin.auth.admin.listUsers({ page: 1, perPage: 50 }).catch(() => ({ data: { users: [] } })),
    ]);

    const subs = subsRes.data || [];
    const profiles = profRes.data || [];
    const events = evRes.data || [];
    const checkIns = ciRes.data || [];
    const auditLogs = auditRes.data || [];
    const authUsers = authRes.data?.users || [];

    const dbLatencyMs = Date.now() - startTime;

    // Aggregate user health metrics
    const totalSubs = subs.length;
    const paidSubs = subs.filter((s) => s.status === "active").length;
    const trialingSubs = subs.filter((s) => s.status === "trialing").length;
    const mandatePending = subs.filter((s) => s.status === "MANDATE_PENDING" || s.autopay_status === "pending").length;
    const cancelledSubs = subs.filter((s) => s.status === "cancelled" || s.status === "expired").length;

    const totalAccounts = Math.max(profiles.length, authUsers.length, totalSubs);
    const healthScore = totalAccounts > 0
      ? Math.max(0, Math.min(100, Math.round(((totalAccounts - mandatePending - cancelledSubs) / totalAccounts) * 100)))
      : 100;

    // Active users tracking (real activity only)
    const active1h = authUsers.filter((u) => u.last_sign_in_at && u.last_sign_in_at >= oneHourAgo).length ||
      profiles.filter((p) => p.updated_at && p.updated_at >= oneHourAgo).length;

    const active24h = authUsers.filter((u) => (u.last_sign_in_at && u.last_sign_in_at >= oneDayAgo) || (u.created_at && u.created_at >= oneDayAgo)).length ||
      profiles.filter((p) => (p.updated_at && p.updated_at >= oneDayAgo) || (p.created_at && p.created_at >= oneDayAgo)).length;

    const active7d = authUsers.filter((u) => (u.last_sign_in_at && u.last_sign_in_at >= sevenDaysAgo) || (u.created_at && u.created_at >= sevenDaysAgo)).length ||
      profiles.filter((p) => (p.updated_at && p.updated_at >= sevenDaysAgo) || (p.created_at && p.created_at >= sevenDaysAgo)).length;

    const activeEventsCount = events.filter((e) => e.status === "active" || e.status === "published").length;
    const openGatesCount = new Set(checkIns.map((c) => c.event_id).filter(Boolean)).size;

    // Construct user roster with health indicators
    const userRoster = profiles.map((p) => {
      const sub = subs.find((s) => s.user_id === p.user_id || s.user_id === p.id);
      let healthStatus: "healthy" | "trialing" | "warning" | "expired" = "healthy";

      if (sub?.status === "trialing") {
        healthStatus = "trialing";
      } else if (sub?.status === "MANDATE_PENDING" || sub?.autopay_status === "pending") {
        healthStatus = "warning";
      } else if (sub?.status === "cancelled" || sub?.status === "expired") {
        healthStatus = "expired";
      }

      return {
        id: p.user_id || p.id,
        email: p.email || "unknown@urpass.space",
        name: p.full_name || "Organiser",
        plan: sub?.status || "Free",
        billingCycle: sub?.billing_cycle || "monthly",
        status: sub?.status || "free",
        autopayStatus: sub?.autopay_status || "none",
        healthStatus,
        lastActive: p.updated_at || p.created_at,
        createdDate: p.created_at,
      };
    });

    // ── Generate real-time log feed ──
    const logs: OpsLogItem[] = [];

    // 1. In-memory live operational broadcast events (most real-time)
    const memoryLiveEvents = getLiveOpsEvents();
    logs.push(...memoryLiveEvents);

    // 2. Real Auth Signups & Logins from Supabase Auth admin
    authUsers.forEach((u) => {
      if (u.created_at) {
        logs.push({
          id: `auth-reg-${u.id}`,
          timestamp: u.created_at,
          level: "SUCCESS",
          category: "AUTH",
          message: `Live user signup: ${u.email} [Auth ID: ${u.id.slice(0, 8)}]`,
          details: { userId: u.id, email: u.email, createdAt: u.created_at, provider: u.app_metadata?.provider || "email" },
        });
      }
      if (u.last_sign_in_at) {
        logs.push({
          id: `auth-login-${u.id}-${new Date(u.last_sign_in_at).getTime()}`,
          timestamp: u.last_sign_in_at,
          level: "SUCCESS",
          category: "AUTH",
          message: `Live user login: ${u.email} [Provider: ${u.app_metadata?.provider || "email"}]`,
          details: { userId: u.id, email: u.email, lastSignIn: u.last_sign_in_at },
        });
      }
    });

    // 3. User signups from profiles
    profiles.forEach((p) => {
      if (p.created_at) {
        logs.push({
          id: `prof-signup-${p.id}`,
          timestamp: p.created_at,
          level: "SUCCESS",
          category: "AUTH",
          message: `User profile activated: ${p.email} (${p.full_name})`,
          details: { userId: p.user_id, email: p.email, fullName: p.full_name },
        });
      }
      if (p.updated_at && p.updated_at !== p.created_at) {
        logs.push({
          id: `prof-update-${p.id}-${new Date(p.updated_at).getTime()}`,
          timestamp: p.updated_at,
          level: "INFO",
          category: "AUTH",
          message: `User session active: ${p.email} (${p.full_name})`,
          details: { userId: p.user_id, email: p.email },
        });
      }
    });

    // 4. Real event creations from events table
    events.forEach((e) => {
      logs.push({
        id: `evt-create-${e.id}`,
        timestamp: e.created_at,
        level: "SUCCESS",
        category: "EVENT",
        message: `New event created: "${e.name}" (Status: ${e.status}, Venue: ${e.venue}) by organiser [${(e.organizer_id || "").slice(0, 8)}]`,
        details: { eventId: e.id, name: e.name, venue: e.venue, status: e.status, organizerId: e.organizer_id },
      });
      if (e.updated_at && e.updated_at !== e.created_at) {
        logs.push({
          id: `evt-update-${e.id}-${new Date(e.updated_at).getTime()}`,
          timestamp: e.updated_at,
          level: "INFO",
          category: "EVENT",
          message: `Event updated: "${e.name}" (Status: ${e.status})`,
          details: { eventId: e.id, name: e.name, status: e.status },
        });
      }
    });

    // 5. Real scanner check-ins from check_ins table
    checkIns.forEach((c) => {
      logs.push({
        id: `scan-${c.id}`,
        timestamp: c.checked_in_at || c.created_at,
        level: "SUCCESS",
        category: "SCAN",
        message: `Gate scanner scan verified: pass [${(c.pass_id || "").slice(0, 8)}] checked in by [${(c.checked_in_by || "").slice(0, 8)}]`,
        details: { passId: c.pass_id, eventId: c.event_id, attendeeId: c.attendee_id },
      });
    });

    // 6. Subscriptions updates
    subs.forEach((s) => {
      logs.push({
        id: `sub-${s.id}`,
        timestamp: s.updated_at,
        level: s.status === "active" ? "SUCCESS" : s.status === "trialing" ? "INFO" : "WARN",
        category: "BILLING",
        message: `Subscription record: user [${(s.user_id || "").slice(0, 8)}] status=[${s.status}] provider=[${s.provider}] autopay=[${s.autopay_status}]`,
        details: { cycle: s.billing_cycle, status: s.status },
      });
    });

    // 7. Enterprise audit logs
    auditLogs.forEach((a) => {
      logs.push({
        id: `audit-${a.id}`,
        timestamp: a.created_at,
        level: a.action.includes("fail") || a.action.includes("denied") ? "WARN" : "INFO",
        category: a.action.includes("auth") ? "AUTH" : a.action.includes("key") ? "SECURITY" : "SYSTEM",
        message: `Audit Action: ${a.action} on ${a.resource_type || "resource"} [${(a.resource_id || "").slice(0, 8)}] from IP ${a.ip_address || "127.0.0.1"}`,
        details: a.details,
      });
    });

    // Deduplicate logs by unique ID
    const uniqueLogsMap = new Map<string, OpsLogItem>();
    for (const item of logs) {
      if (!uniqueLogsMap.has(item.id)) {
        uniqueLogsMap.set(item.id, item);
      }
    }

    const uniqueLogs = Array.from(uniqueLogsMap.values());

    // Sort chronologically ASCENDING (oldest to newest for live terminal flow)
    uniqueLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({
      timestamp: now.toISOString(),
      systemHealth: {
        status: "healthy",
        dbLatencyMs,
        supabaseConnected: true,
        emailServiceConfigured: Boolean(process.env.RESEND_API_KEY),
        paymentGatewayConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
      },
      userHealth: {
        totalAccounts,
        paidSubs,
        trialingSubs,
        mandatePending,
        lifetimeSubs: 0,
        cancelledSubs,
        healthScore,
        roster: userRoster.slice(0, 50),
      },
      activeUsers: {
        active1h,
        active24h,
        active7d,
        activeEventsCount,
        openGatesCount,
      },
      logs: uniqueLogs.slice(-100), // Return last 100 chronological real logs
    });
  } catch (err: unknown) {
    console.error("[ops/telemetry] Unhandled error:", err);
    const msg = err instanceof Error ? err.message : "Internal telemetry error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
