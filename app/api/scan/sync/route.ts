import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendWebhooks } from "@/lib/webhooks";
import { recordApiUsage } from "@/lib/api-usage";

export const dynamic = "force-dynamic";

interface ScanSyncItem {
  scanOperationId: string;
  passToken: string;
  gateId?: string | null;
  gateName?: string | null;
  checkInMethod?: "qr" | "manual";
  scannedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safeMaybeSingle<T = any>(query: any): Promise<{ data: T | null; error: any }> {
  if (query && typeof query.maybeSingle === "function") {
    return query.maybeSingle();
  }
  return { data: null, error: null };
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { eventId, scans } = (body ?? {}) as {
    eventId?: string;
    scans?: ScanSyncItem[];
  };

  if (!eventId || !Array.isArray(scans) || scans.length === 0) {
    return NextResponse.json({ error: "Missing eventId or scans array" }, { status: 400 });
  }

  // Verify access to event
  const { data: event } = await supabase
    .from("events")
    .select("id, name, organizer_id, organization_id")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 });
  }

  const isOrganizer = event.organizer_id === user.id;
  let hasOrgAccess = false;
  if (!isOrganizer && event.organization_id) {
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin", "event_manager", "checkin_staff"])
      .single();
    hasOrgAccess = !!member;
  }

  if (!isOrganizer && !hasOrgAccess) {
    return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 403 });
  }

  // Pre-fetch gate names for friendly conflict reporting
  const { data: gateList } = await supabase
    .from("scanner_gates")
    .select("id, name, zone_id")
    .eq("event_id", eventId);

  const gateMap = new Map((gateList || []).map((g) => [g.id, g.name]));

  // Track reconciliation results
  const results: Array<{
    scanOperationId: string;
    status: "CHECKED_IN" | "ALREADY_CHECKED_IN" | "INVALID_PASS" | "ACCESS_DENIED" | "ERROR";
    success: boolean;
    conflict?: boolean;
    conflictMessage?: string;
    winningGateId?: string | null;
    winningGateName?: string | null;
    winningCheckedInAt?: string | null;
    checkedInAt?: string | null;
  }> = [];

  let syncedCount = 0;
  let conflictCount = 0;
  let errorCount = 0;

  for (const scan of scans) {
    const { scanOperationId, passToken, gateId, checkInMethod = "qr", scannedAt } = scan;
    const cleanPassToken = typeof passToken === "string"
      ? passToken.trim().replace(/^https?:\/\/[^\/]+\/pass\//, "")
      : passToken;

    // 1. Check idempotency: if this exact scan was already processed
    const { data: existingOp } = await safeMaybeSingle(
      supabase
        .from("check_ins")
        .select("id, checked_in_at, gate_id")
        .eq("scan_operation_id", scanOperationId)
    );

    if (existingOp) {
      results.push({
        scanOperationId,
        status: "CHECKED_IN",
        success: true,
        checkedInAt: existingOp.checked_in_at,
      });
      syncedCount++;
      continue;
    }

    // 2. Fetch pass scoped to event
    const { data: pass } = await safeMaybeSingle(
      supabase
        .from("passes")
        .select("id, pass_token, pass_type, status, attendee_id, event_id, ticket_type_id")
        .eq("pass_token", cleanPassToken)
        .eq("event_id", eventId)
    );

    if (!pass) {
      results.push({
        scanOperationId,
        status: "INVALID_PASS",
        success: false,
        conflictMessage: "Pass not found for this event",
      });
      errorCount++;
      continue;
    }

    // 3. Zone check
    if (gateId && pass.ticket_type_id) {
      const gate = (gateList || []).find((g) => g.id === gateId);
      if (gate?.zone_id) {
        const { data: zoneAccess } = await safeMaybeSingle(
          supabase
            .from("ticket_zone_access")
            .select("id")
            .eq("ticket_type_id", pass.ticket_type_id)
            .eq("zone_id", gate.zone_id)
        );

        if (!zoneAccess) {
          results.push({
            scanOperationId,
            status: "ACCESS_DENIED",
            success: false,
            conflictMessage: "Pass is not authorized for this gate / zone",
          });
          errorCount++;
          continue;
        }
      }
    }

    // 4. Duplicate Check: Check if pass is already checked in by another gate/device
    const { data: existingCi } = await safeMaybeSingle(
      supabase
        .from("check_ins")
        .select("id, checked_in_at, gate_id, scan_operation_id, scanned_at")
        .eq("pass_id", pass.id)
    );

    if (existingCi) {
      // Offline Concurrency Conflict!
      conflictCount++;
      const winningGateName = existingCi.gate_id ? gateMap.get(existingCi.gate_id) || "Another gate" : "Online gate";

      // Log conflict in check_in_conflicts table for audit trail
      try {
        await supabase.from("check_in_conflicts").insert({
          event_id: eventId,
          pass_id: pass.id,
          attendee_id: pass.attendee_id,
          gate_id: gateId || null,
          conflict_type: "OFFLINE_DUPLICATE",
          winning_check_in_id: existingCi.id,
          conflicting_scan_operation_id: scanOperationId,
          conflicting_scanned_at: scannedAt || new Date().toISOString(),
          winning_scanned_at: existingCi.scanned_at || existingCi.checked_in_at,
          details: {
            scannedAt,
            winningGateId: existingCi.gate_id,
            winningGateName,
            winningCheckedInAt: existingCi.checked_in_at,
          },
        });
      } catch {
        // Table might not be migrated yet in non-db test environments
      }

      results.push({
        scanOperationId,
        status: "ALREADY_CHECKED_IN",
        success: false,
        conflict: true,
        conflictMessage: `Already checked in at ${winningGateName}`,
        winningGateId: existingCi.gate_id,
        winningGateName,
        winningCheckedInAt: existingCi.checked_in_at,
      });
      continue;
    }

    // 5. Atomic Insert Check-in
    const actualScannedAt = scannedAt || new Date().toISOString();
    const syncedAt = new Date().toISOString();

    const { error: ciError } = await supabase.from("check_ins").insert({
      pass_id: pass.id,
      event_id: eventId,
      attendee_id: pass.attendee_id,
      checked_in_by: user.id,
      gate_id: gateId || null,
      check_in_method: checkInMethod,
      scan_operation_id: scanOperationId,
      checked_in_at: actualScannedAt,
      scanned_at: actualScannedAt,
      synced_at: syncedAt,
      is_offline: true,
    });

    if (ciError) {
      // Concurrent race caught by DB unique constraint
      if (ciError.code === "23505" || ciError.message?.includes("unique") || ciError.message?.includes("duplicate")) {
        conflictCount++;
        results.push({
          scanOperationId,
          status: "ALREADY_CHECKED_IN",
          success: false,
          conflict: true,
          conflictMessage: "Pass was checked in by another gate just prior to sync",
        });
        continue;
      }

      errorCount++;
      results.push({
        scanOperationId,
        status: "ERROR",
        success: false,
        conflictMessage: ciError.message,
      });
      continue;
    }

    // Update pass & attendee status
    await supabase.from("passes").update({ status: "checked_in" }).eq("id", pass.id);
    await supabase.from("attendees").update({ pass_status: "checked_in" }).eq("id", pass.attendee_id);

    // Sync reservation status if paid
    try {
      const admin = createAdminClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!);
      const { data: att } = await safeMaybeSingle(
        supabase.from("attendees").select("email").eq("id", pass.attendee_id)
      );
      if (att?.email) {
        await admin
          .from("ticket_reservations")
          .update({ status: "CHECKED_IN", updated_at: syncedAt })
          .eq("event_id", eventId)
          .eq("buyer_email", att.email)
          .in("status", ["PAID", "APPROVED"]);
      }
    } catch {
      // Non-blocking
    }

    // Webhooks & API usage
    sendWebhooks(event.organizer_id, "checkin.completed", {
      event_id: eventId,
      pass_id: pass.id,
      attendee_id: pass.attendee_id,
      checked_in_at: actualScannedAt,
      is_offline: true,
    }).catch(() => {});

    void recordApiUsage(event.organizer_id, "check_ins");

    results.push({
      scanOperationId,
      status: "CHECKED_IN",
      success: true,
      checkedInAt: actualScannedAt,
    });
    syncedCount++;
  }

  return NextResponse.json({
    eventId,
    total: scans.length,
    synced: syncedCount,
    conflicts: conflictCount,
    errors: errorCount,
    results,
  });
}
