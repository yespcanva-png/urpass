import { NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getLiveOpsEvents, type OpsLogItem } from "@/lib/ops/events";
import { getSponsorshipApplications } from "@/lib/ops/sponsorship";

export const dynamic = "force-dynamic";

export interface OpsInvoiceItem {
  id: string;
  user_id: string;
  invoice_number: string;
  invoice_date: string;
  customer_name: string;
  customer_email: string;
  customer_address: string | null;
  customer_gstin: string | null;
  place_of_supply: string | null;
  state_code: string | null;
  taxable_amount: number | string | null;
  cgst_amount: number | string | null;
  sgst_amount: number | string | null;
  igst_amount: number | string | null;
  total_amount: number | string | null;
  currency: string | null;
  payment_status: string;
  invoice_status: string;
  payment_id: string | null;
  created_at: string;
}

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function fetchAllAuthUsers(admin: ReturnType<typeof adminClient>) {
  const allUsers: any[] = [];
  let page = 1;
  const perPage = 1000;
  while (page <= 20) {
    try {
      const res = await admin.auth.admin.listUsers({ page, perPage });
      const users = res?.data?.users || [];
      allUsers.push(...users);
      if (users.length < perPage) break;
      page++;
    } catch {
      break;
    }
  }
  return allUsers;
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

    // Parallel fetch: fetch comprehensive data across all operational collections
    const [subsRes, profRes, evRes, ciRes, auditRes, invRes, authUsers, commSettingsRes, managedReqRes, orgMembersRes, orgsRes] = await Promise.all([
      admin
        .from("subscriptions")
        .select("id, user_id, status, provider, autopay_status, billing_cycle, updated_at, created_at")
        .order("updated_at", { ascending: false })
        .limit(2000),

      admin
        .from("profiles")
        .select("id, user_id, email, full_name, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(2000),

      admin
        .from("events")
        .select("id, organizer_id, name, venue, event_date, status, created_at, updated_at, organization_id")
        .order("created_at", { ascending: false })
        .limit(2000),

      admin
        .from("check_ins")
        .select("id, pass_id, event_id, attendee_id, checked_in_at, checked_in_by, created_at")
        .order("created_at", { ascending: false })
        .limit(2000),

      admin
        .from("enterprise_audit_logs")
        .select("id, action, resource_type, resource_id, details, ip_address, created_at")
        .order("created_at", { ascending: false })
        .limit(2000),

      admin
        .from("invoices")
        .select("id, user_id, invoice_number, invoice_date, customer_name, customer_email, customer_address, customer_gstin, place_of_supply, state_code, taxable_amount, cgst_amount, sgst_amount, igst_amount, total_amount, currency, payment_status, invoice_status, payment_id, created_at")
        .order("invoice_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(2000),

      fetchAllAuthUsers(admin),

      admin
        .from("organization_communication_settings")
        .select("organization_id, enable_communication, whatsapp_communication, whatsapp_integration_model, whatsapp_setup_status")
        .limit(2000),

      admin
        .from("whatsapp_managed_service_requests")
        .select("id, organization_id, requested_by, status, estimated_monthly_volume, use_case, contact_email, contact_phone, created_at")
        .order("created_at", { ascending: false })
        .limit(500),

      admin
        .from("organization_members")
        .select("organization_id, user_id, role")
        .limit(2000),

      admin
        .from("organizations")
        .select("id, name, slug, created_by")
        .limit(2000),
    ]);

    const subs = subsRes.data || [];
    const profiles = profRes.data || [];
    const events = evRes.data || [];
    const checkIns = ciRes.data || [];
    const auditLogs = auditRes.data || [];
    const invoices = (invRes.data || []) as OpsInvoiceItem[];
    const commSettings = commSettingsRes.data || [];
    const managedRequests = managedReqRes.data || [];
    const orgMembers = orgMembersRes.data || [];
    const organizations = orgsRes.data || [];

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

    // 100 Daily Target calculation
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todaySignups = Math.max(
      authUsers.filter((u) => u.created_at && u.created_at >= todayStart).length,
      profiles.filter((p) => p.created_at && p.created_at >= todayStart).length
    );
    const todayEvents = events.filter((e) => e.created_at && e.created_at >= todayStart).length;
    const todayCheckIns = checkIns.filter((c) => (c.checked_in_at || c.created_at) >= todayStart).length;
    const dailyTargetGoal = 100;
    const percentAchieved = Math.min(100, Math.round((todaySignups / dailyTargetGoal) * 100));
    const remaining = Math.max(0, dailyTargetGoal - todaySignups);
    const paceStatus = percentAchieved >= 80 ? "accelerating" : percentAchieved >= 30 ? "on_track" : "behind";

    const dailyTarget = {
      target: dailyTargetGoal,
      todaySignups,
      todayEvents,
      todayCheckIns,
      percentAchieved,
      remaining,
      paceStatus,
    };

    // Sponsorship applications
    let sponsorshipsList: any[] = [];
    try {
      sponsorshipsList = await getSponsorshipApplications();
    } catch {
      sponsorshipsList = [];
    }
    const pendingSponsorshipsCount = sponsorshipsList.filter((s) => s.status === "pending").length;

    // Construct complete user roster including both profiles and Supabase Auth accounts
    const userMap = new Map<string, {
      id: string;
      email: string;
      name: string;
      plan: string;
      billingCycle: string;
      status: string;
      autopayStatus: string;
      healthStatus: "healthy" | "trialing" | "warning" | "expired";
      lastActive: string | null;
      createdDate: string;
      whatsappManaged?: boolean;
      whatsappStatus?: "active" | "pending" | "disabled";
      orgId?: string;
    }>();

    // Build user -> org and org -> communication settings mappings
    const userToOrgMap = new Map<string, string>();
    orgMembers.forEach((m) => {
      if (m.user_id && m.organization_id) {
        userToOrgMap.set(m.user_id, m.organization_id);
      }
    });
    organizations.forEach((o) => {
      if (o.created_by && o.id) {
        userToOrgMap.set(o.created_by, o.id);
      }
    });
    events.forEach((e) => {
      if (e.organizer_id && e.organization_id) {
        userToOrgMap.set(e.organizer_id, e.organization_id);
      }
    });

    const orgToSettingsMap = new Map<string, any>();
    commSettings.forEach((cs) => {
      if (cs.organization_id) {
        orgToSettingsMap.set(cs.organization_id, cs);
      }
    });

    const userToRequestMap = new Map<string, any>();
    managedRequests.forEach((mr) => {
      if (mr.requested_by) {
        userToRequestMap.set(mr.requested_by, mr);
      }
      if (mr.organization_id) {
        userToRequestMap.set(mr.organization_id, mr);
      }
    });

    for (const p of profiles) {
      const sub = subs.find((s) => s.user_id === p.user_id || s.user_id === p.id);
      let healthStatus: "healthy" | "trialing" | "warning" | "expired" = "healthy";

      if (sub?.status === "trialing") {
        healthStatus = "trialing";
      } else if (sub?.status === "MANDATE_PENDING" || sub?.autopay_status === "pending") {
        healthStatus = "warning";
      } else if (sub?.status === "cancelled" || sub?.status === "expired") {
        healthStatus = "expired";
      }

      const userId = (p.user_id || p.id || "").toString();
      const userOrgId = userToOrgMap.get(userId) || `personal_${userId}`;
      const orgSetting = orgToSettingsMap.get(userOrgId) || orgToSettingsMap.get(`personal_${userId}`);
      const userReq = userToRequestMap.get(userId) || userToRequestMap.get(userOrgId);

      const isManagedActive =
        orgSetting?.whatsapp_integration_model === "managed" &&
        orgSetting?.whatsapp_setup_status === "active";
      const isPending =
        !isManagedActive &&
        userReq &&
        (userReq.status === "pending_review" ||
          userReq.status === "quote_provided" ||
          userReq.status === "pending_payment" ||
          orgSetting?.whatsapp_setup_status === "pending_verification");

      const whatsappStatus: "active" | "pending" | "disabled" = isManagedActive
        ? "active"
        : isPending
        ? "pending"
        : "disabled";

      const key = (p.user_id || p.id || p.email || "").toString();
      if (key) {
        userMap.set(key, {
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
          whatsappManaged: isManagedActive,
          whatsappStatus,
          orgId: userOrgId,
        });
      }
    }

    // Merge auth accounts not yet in profiles table
    for (const u of authUsers) {
      const existing =
        userMap.get(u.id) ||
        (u.email ? Array.from(userMap.values()).find((e) => e.email.toLowerCase() === u.email.toLowerCase()) : null);
      if (!existing) {
        const sub = subs.find((s) => s.user_id === u.id);
        let healthStatus: "healthy" | "trialing" | "warning" | "expired" = "healthy";

        if (sub?.status === "trialing") {
          healthStatus = "trialing";
        } else if (sub?.status === "MANDATE_PENDING" || sub?.autopay_status === "pending") {
          healthStatus = "warning";
        } else if (sub?.status === "cancelled" || sub?.status === "expired") {
          healthStatus = "expired";
        }

        const userOrgId = userToOrgMap.get(u.id) || `personal_${u.id}`;
        const orgSetting = orgToSettingsMap.get(userOrgId) || orgToSettingsMap.get(`personal_${u.id}`);
        const userReq = userToRequestMap.get(u.id) || userToRequestMap.get(userOrgId);

        const isManagedActive =
          orgSetting?.whatsapp_integration_model === "managed" &&
          orgSetting?.whatsapp_setup_status === "active";
        const isPending =
          !isManagedActive &&
          userReq &&
          (userReq.status === "pending_review" ||
            userReq.status === "quote_provided" ||
            userReq.status === "pending_payment" ||
            orgSetting?.whatsapp_setup_status === "pending_verification");

        const whatsappStatus: "active" | "pending" | "disabled" = isManagedActive
          ? "active"
          : isPending
          ? "pending"
          : "disabled";

        userMap.set(u.id, {
          id: u.id,
          email: u.email || "unknown@urpass.space",
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "User",
          plan: sub?.status || "Free",
          billingCycle: sub?.billing_cycle || "monthly",
          status: sub?.status || "free",
          autopayStatus: sub?.autopay_status || "none",
          healthStatus,
          lastActive: u.last_sign_in_at || u.updated_at || u.created_at,
          createdDate: u.created_at,
          whatsappManaged: isManagedActive,
          whatsappStatus,
          orgId: userOrgId,
        });
      }
    }

    const userRoster = Array.from(userMap.values()).sort(
      (a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime()
    );

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

    invoices.forEach((inv) => {
      logs.push({
        id: `invoice-${inv.id}`,
        timestamp: inv.created_at || inv.invoice_date,
        level: inv.payment_status === "paid" ? "SUCCESS" : "INFO",
        category: "BILLING",
        message: `Invoice issued: ${inv.invoice_number} for ${inv.customer_email} total=${inv.currency || "INR"} ${inv.total_amount}`,
        details: {
          invoiceId: inv.id,
          customer: inv.customer_name,
          placeOfSupply: inv.place_of_supply,
          stateCode: inv.state_code,
          paymentId: inv.payment_id,
        },
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
        totalAccounts: Math.max(totalAccounts, userRoster.length),
        paidSubs,
        trialingSubs,
        mandatePending,
        lifetimeSubs: 0,
        cancelledSubs,
        healthScore,
        roster: userRoster, // Return all users without 50 limit
      },
      activeUsers: {
        active1h,
        active24h,
        active7d,
        activeEventsCount,
        openGatesCount,
      },
      dailyTarget,
      sponsorships: {
        pendingCount: pendingSponsorshipsCount,
        totalCount: sponsorshipsList.length,
        items: sponsorshipsList,
      },
      invoices: {
        totalCount: invoices.length,
        items: invoices,
      },
      whatsappManaged: {
        activeCount: userRoster.filter((u) => u.whatsappStatus === "active").length,
        pendingCount: userRoster.filter((u) => u.whatsappStatus === "pending").length,
        requests: managedRequests,
      },
      logs: uniqueLogs, // Return all logs without 100 limit
    });
  } catch (err: unknown) {
    console.error("[ops/telemetry] Unhandled error:", err);
    const msg = err instanceof Error ? err.message : "Internal telemetry error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
