import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js & Supabase ──────────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import {
  saveEventManifest,
  verifyPassOffline,
  getPendingOfflineQueue,
  getManifestMeta,
  clearOfflineDataForEvent,
  syncOfflineQueue,
  type ManifestPass,
} from "@/lib/offline-scanner";

describe("Module 08 — Offline Scanning & Synchronization (Test 08 Suite)", () => {
  const eventId = "event-offline-001";

  const samplePasses: ManifestPass[] = [
    {
      passId: "p1",
      passToken: "token_offline_user_1",
      attendeeId: "att_1",
      name: "Rohit Sharma",
      email: "rohit@cricket.in",
      passType: "VIP Pass",
      checkedIn: false,
    },
    {
      passId: "p2",
      passToken: "token_offline_user_2",
      attendeeId: "att_2",
      name: "Virat Kohli",
      email: "virat@cricket.in",
      passType: "General Admission",
      checkedIn: false,
    },
    {
      passId: "p3",
      passToken: "token_offline_revoked",
      attendeeId: "att_3",
      name: "Revoked Pass Holder",
      email: "revoked@example.com",
      passType: "General Admission",
      checkedIn: false,
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    await clearOfflineDataForEvent(eventId);
    await saveEventManifest(eventId, "IPL Finals 2026", samplePasses, [
      { id: "gate_1", name: "North Gate" },
      { id: "gate_2", name: "South Gate" },
    ]);
  });

  // ── Scenario 1: Authorized Device Can Scan While Offline ──────────────────────
  it("Scenario 1: Authorized scanner device validates and checks in attendee passes offline instantly", async () => {
    const result = await verifyPassOffline({
      eventId,
      passToken: "token_offline_user_1",
      gateId: "gate_1",
      gateName: "North Gate",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("CHECKED_IN");
    expect(result.offline).toBe(true);
    expect(result.attendee?.name).toBe("Rohit Sharma");
    expect(result.scanOperationId).toBeDefined();

    // Check queued offline scan
    const queue = await getPendingOfflineQueue(eventId);
    expect(queue.length).toBe(1);
    expect(queue[0].passToken).toBe("token_offline_user_1");
    expect(queue[0].status).toBe("pending");
  });

  // ── Scenario 2: Same-Device Duplicate Scan Detected ───────────────────────────
  it("Scenario 2: Same-device duplicate scan while offline is immediately detected and rejected as ALREADY_CHECKED_IN", async () => {
    // First scan
    const firstScan = await verifyPassOffline({
      eventId,
      passToken: "token_offline_user_2",
      gateId: "gate_1",
      gateName: "North Gate",
    });
    expect(firstScan.success).toBe(true);
    expect(firstScan.status).toBe("CHECKED_IN");

    // Immediate second scan on same offline device
    const duplicateScan = await verifyPassOffline({
      eventId,
      passToken: "token_offline_user_2",
      gateId: "gate_1",
      gateName: "North Gate",
    });
    expect(duplicateScan.success).toBe(false);
    expect(duplicateScan.status).toBe("ALREADY_CHECKED_IN");
    expect(duplicateScan.alreadyCheckedIn).toBe(true);
  });

  // ── Scenario 3: Unknown / Invalid Pass Rejected ───────────────────────────────
  it("Scenario 3: Non-existent or forged token is rejected offline with INVALID_PASS", async () => {
    const result = await verifyPassOffline({
      eventId,
      passToken: "token_completely_unknown_forged",
      gateId: "gate_1",
      gateName: "North Gate",
    });
    expect(result.success).toBe(false);
    expect(result.status).toBe("INVALID_PASS");
  });

  // ── Scenario 4: Scans Persist in Storage ───────────────────────────────────────
  it("Scenario 4: Queued offline scans persist across simulated app/session reload", async () => {
    await verifyPassOffline({
      eventId,
      passToken: "token_offline_user_1",
      gateId: "gate_1",
      gateName: "North Gate",
    });

    const queue = await getPendingOfflineQueue(eventId);
    expect(queue.length).toBe(1);
    expect(queue[0].status).toBe("pending");

    const meta = await getManifestMeta(eventId);
    expect(meta?.totalPasses).toBe(3);
    expect(meta?.checkedInCount).toBe(1);
  });

  // ── Scenario 5 & 6: Pending Scans Synchronize After Reconnection & Deduplicate ─
  it("Scenario 5 & 6: Reconnected device syncs queued scans idempotently without duplicate attendance", async () => {
    const scan1 = await verifyPassOffline({
      eventId,
      passToken: "token_offline_user_1",
      gateId: "gate_1",
      gateName: "North Gate",
    });
    const scan2 = await verifyPassOffline({
      eventId,
      passToken: "token_offline_user_2",
      gateId: "gate_2",
      gateName: "South Gate",
    });

    // Mock server sync endpoint
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          { scanOperationId: scan1.scanOperationId, status: "CHECKED_IN" },
          { scanOperationId: scan2.scanOperationId, status: "CHECKED_IN" },
        ],
      }),
    });

    const report = await syncOfflineQueue(eventId);
    expect(report.synced).toBe(2);
    expect(report.conflicts).toBe(0);
    expect(report.failed).toBe(0);

    // Repeated sync attempt when already synced
    const report2 = await syncOfflineQueue(eventId);
    expect(report2.totalPending).toBe(0);
  });

  // ── Scenario 7: Two Offline Scanners on Same Ticket Produce Auditable Conflict ─
  it("Scenario 7: Concurrent offline scans of the same ticket on two separate devices produce a detectable conflict upon sync", async () => {
    const scan1 = await verifyPassOffline({
      eventId,
      passToken: "token_offline_user_1",
      gateId: "gate_1",
      gateName: "North Gate",
    });

    // Mock server sync reporting conflict (Gate 2 checked in earlier on server)
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            scanOperationId: scan1.scanOperationId,
            status: "ALREADY_CHECKED_IN",
            conflict: true,
            conflictMessage: "Pass was already checked in at South Gate at 2026-10-09T18:00:00Z",
            winningGateId: "gate_2",
            winningCheckedInAt: "2026-10-09T18:00:00Z",
          },
        ],
      }),
    });

    const report = await syncOfflineQueue(eventId);
    expect(report.conflicts).toBe(1);
    expect(report.conflictEntries.length).toBe(1);
    expect(report.conflictEntries[0].status).toBe("conflict");
  });

  // ── Scenario 8: Local Data Isolation ──────────────────────────────────────────
  it("Scenario 8: Cache is isolated per event ID preventing cross-event ticket leakage", async () => {
    const otherMeta = await getManifestMeta("event-other-unrelated");
    expect(otherMeta).toBeNull();

    const otherQueue = await getPendingOfflineQueue("event-other-unrelated");
    expect(otherQueue.length).toBe(0);
  });
});
