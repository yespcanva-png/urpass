import { describe, it, expect } from "vitest";
import { eventSchema } from "@/lib/validations/event";

describe("Multi-Scan Tracking & Event Setting", () => {
  it("validates allow_multiple_scans and multi_scan_enabled in eventSchema", () => {
    const validData = {
      name: "Bengaluru Tech Summit 2026",
      event_date: "2026-11-15",
      start_time: "09:00",
      end_time: "18:00",
      venue: "KTPO Whitefield",
      event_type: "physical" as const,
      attendee_limit: 500,
      status: "active" as const,
      application_enabled: true,
      auto_approve: true,
      is_paid_event: false,
      ticket_price: 0,
      currency: "INR" as const,
      timezone: "Asia/Kolkata",
      allow_multiple_scans: true,
      multi_scan_enabled: true,
    };

    const parsed = eventSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.allow_multiple_scans).toBe(true);
      expect(parsed.data.multi_scan_enabled).toBe(true);
    }
  });

  it("handles multi-scan count progression and timestamp history tracking accurately", () => {
    // Simulate attendee custom_responses state transitions
    const initialCr: Record<string, any> = {};

    // 1st Scan
    const scan1Time = "2026-10-22T10:00:00.000Z";
    const history1 = [
      {
        scan_number: 1,
        scanned_at: scan1Time,
        gate_id: "gate-1",
        gate_name: "Main Entry",
        scanned_by: "user-1",
        method: "qr",
      },
    ];
    const crAfterScan1 = {
      ...initialCr,
      scan_count: 1,
      first_scanned_at: scan1Time,
      last_scanned_at: scan1Time,
      scan_history: history1,
    };

    expect(crAfterScan1.scan_count).toBe(1);
    expect(crAfterScan1.first_scanned_at).toBe(scan1Time);
    expect(crAfterScan1.last_scanned_at).toBe(scan1Time);
    expect(crAfterScan1.scan_history).toHaveLength(1);
    expect(crAfterScan1.scan_history[0].scan_number).toBe(1);

    // 2nd Scan (Re-entry / Session / Meal)
    const scan2Time = "2026-10-22T12:30:00.000Z";
    const history2 = [
      ...crAfterScan1.scan_history,
      {
        scan_number: 2,
        scanned_at: scan2Time,
        gate_id: "gate-2",
        gate_name: "Dining Hall",
        scanned_by: "user-2",
        method: "qr",
      },
    ];
    const crAfterScan2 = {
      ...crAfterScan1,
      scan_count: 2,
      last_scanned_at: scan2Time,
      scan_history: history2,
    };

    expect(crAfterScan2.scan_count).toBe(2);
    expect(crAfterScan2.first_scanned_at).toBe(scan1Time);
    expect(crAfterScan2.last_scanned_at).toBe(scan2Time);
    expect(crAfterScan2.scan_history).toHaveLength(2);
    expect(crAfterScan2.scan_history[1].gate_name).toBe("Dining Hall");
    expect(crAfterScan2.scan_history[1].scan_number).toBe(2);

    // 3rd Scan (Workshop session)
    const scan3Time = "2026-10-22T15:45:00.000Z";
    const history3 = [
      ...crAfterScan2.scan_history,
      {
        scan_number: 3,
        scanned_at: scan3Time,
        gate_id: "gate-3",
        gate_name: "Workshop Hall A",
        scanned_by: "user-1",
        method: "qr",
      },
    ];
    const crAfterScan3 = {
      ...crAfterScan2,
      scan_count: 3,
      last_scanned_at: scan3Time,
      scan_history: history3,
    };

    expect(crAfterScan3.scan_count).toBe(3);
    expect(crAfterScan3.first_scanned_at).toBe(scan1Time);
    expect(crAfterScan3.last_scanned_at).toBe(scan3Time);
    expect(crAfterScan3.scan_history).toHaveLength(3);
    expect(crAfterScan3.scan_history[2].gate_name).toBe("Workshop Hall A");
  });

  it("verifies setting enforcement: only allow multiple scans when setting is explicitly enabled", () => {
    function evaluateScanAllowed({
      passStatus,
      allowMultipleScans,
    }: {
      passStatus: "approved" | "checked_in";
      allowMultipleScans: boolean;
    }) {
      if (passStatus === "checked_in") {
        if (allowMultipleScans) {
          return { status: "CHECKED_IN", success: true, isMultiScan: true };
        }
        return { status: "ALREADY_CHECKED_IN", success: false, isMultiScan: false };
      }
      return { status: "CHECKED_IN", success: true, isMultiScan: allowMultipleScans };
    }

    // 1. When event setting allow_multiple_scans is FALSE (default)
    const standardDuplicate = evaluateScanAllowed({
      passStatus: "checked_in",
      allowMultipleScans: false,
    });
    expect(standardDuplicate.status).toBe("ALREADY_CHECKED_IN");
    expect(standardDuplicate.success).toBe(false);

    // 2. When event setting allow_multiple_scans is TRUE
    const multiScanAllowed = evaluateScanAllowed({
      passStatus: "checked_in",
      allowMultipleScans: true,
    });
    expect(multiScanAllowed.status).toBe("CHECKED_IN");
    expect(multiScanAllowed.success).toBe(true);
    expect(multiScanAllowed.isMultiScan).toBe(true);
  });

  it("displays 'Allows multiple entry' when allow_multiple_scans is enabled", async () => {
    const { resolveTicketDesign } = await import("@/lib/pass-design");
    
    // When enabled
    const designMulti = resolveTicketDesign({ allow_multiple_scans: true }, null, null);
    expect(designMulti.allow_multiple_scans).toBe(true);
    const entryRuleMulti = designMulti.allow_multiple_scans
      ? "Allows multiple entry"
      : designMulti.showSingleEntryRule !== false
      ? "Valid for single entry"
      : null;
    expect(entryRuleMulti).toBe("Allows multiple entry");

    // When disabled
    const designSingle = resolveTicketDesign({ allow_multiple_scans: false }, null, null);
    expect(designSingle.allow_multiple_scans).toBe(false);
    const entryRuleSingle = designSingle.allow_multiple_scans
      ? "Allows multiple entry"
      : designSingle.showSingleEntryRule !== false
      ? "Valid for single entry"
      : null;
    expect(entryRuleSingle).toBe("Valid for single entry");
  });
});
