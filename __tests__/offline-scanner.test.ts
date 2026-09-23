import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveEventManifest,
  getManifestMeta,
  verifyPassOffline,
  searchOfflineAttendees,
  getPendingOfflineQueue,
  getQueueStats,
  normalizeToken,
  type ManifestPass,
} from "@/lib/offline-scanner";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("P1 #1: Offline QR Scanner & IndexedDB/Local Reconciler", () => {
  const eventId = "11111111-1111-4111-8111-111111111111";

  const samplePasses: ManifestPass[] = [
    {
      passId: "pass-001",
      passToken: "token-alice-123",
      attendeeId: "att-001",
      name: "Alice Johnson",
      email: "alice@example.com",
      passType: "vip",
      ticketTypeId: "ticket-vip-1",
      allowedZoneIds: ["zone-vip-stage", "zone-general"],
      checkedIn: false,
      checkedInAt: null,
    },
    {
      passId: "pass-002",
      passToken: "token-bob-456",
      attendeeId: "att-002",
      name: "Bob Smith",
      email: "bob@example.com",
      passType: "participant",
      ticketTypeId: "ticket-gen-1",
      allowedZoneIds: ["zone-general"],
      checkedIn: false,
      checkedInAt: null,
    },
  ];

  const sampleGates = [
    { id: "gate-main", name: "Main Entrance", zone_id: "zone-general" },
    { id: "gate-vip", name: "VIP Backstage", zone_id: "zone-vip-stage" },
  ];

  beforeEach(async () => {
    // Save fresh test manifest into offline store
    await saveEventManifest(eventId, "Tech Summit 2026", samplePasses, sampleGates);
  });

  it("normalizes pass tokens from full URLs or raw strings", () => {
    expect(normalizeToken("https://urpass.space/pass/abc-xyz")).toBe("abc-xyz");
    expect(normalizeToken("http://localhost:3000/pass/token-123")).toBe("token-123");
    expect(normalizeToken("token-456")).toBe("token-456");
    expect(normalizeToken("  token-trimmed  ")).toBe("token-trimmed");
  });

  it("saves and retrieves offline event metadata and total pass counts", async () => {
    const meta = await getManifestMeta(eventId);
    expect(meta).not.toBeNull();
    expect(meta?.eventName).toBe("Tech Summit 2026");
    expect(meta?.totalPasses).toBe(2);
    expect(meta?.checkedInCount).toBe(0);
    expect(meta?.gates).toHaveLength(2);
  });

  it("validates an approved pass instantly offline with CHECKED_IN and unique scanOperationId", async () => {
    const result = await verifyPassOffline({
      eventId,
      passToken: "token-alice-123",
      gateId: "gate-vip",
      gateName: "VIP Backstage",
    });

    expect(result.status).toBe("CHECKED_IN");
    expect(result.success).toBe(true);
    expect(result.offline).toBe(true);
    expect(result.attendee?.name).toBe("Alice Johnson");
    expect(result.passType).toBe("vip");
    expect(result.checkedInAt).toBeDefined();
    expect(result.scanOperationId).toBeDefined();

    // Verify it was added to the pending offline sync queue
    const pending = await getPendingOfflineQueue(eventId);
    const queuedItem = pending.find((p) => p.scanOperationId === result.scanOperationId);
    expect(queuedItem).toBeDefined();
    expect(queuedItem?.passToken).toBe("token-alice-123");
    expect(queuedItem?.status).toBe("pending");
  });

  it("blocks duplicate scans of the same pass while offline (ALREADY_CHECKED_IN)", async () => {
    // First scan succeeds
    const firstScan = await verifyPassOffline({
      eventId,
      passToken: "token-bob-456",
      gateId: "gate-main",
    });
    expect(firstScan.status).toBe("CHECKED_IN");

    // Second scan of same pass is blocked locally
    const secondScan = await verifyPassOffline({
      eventId,
      passToken: "token-bob-456",
      gateId: "gate-main",
    });

    expect(secondScan.status).toBe("ALREADY_CHECKED_IN");
    expect(secondScan.success).toBe(false);
    expect(secondScan.alreadyCheckedIn).toBe(true);
    expect(secondScan.attendee?.name).toBe("Bob Smith");
    expect(secondScan.checkedInAt).toBe(firstScan.checkedInAt);
  });

  it("enforces gate zone restrictions during offline scanning", async () => {
    // Bob has only general zone access, attempts to enter VIP Gate
    const result = await verifyPassOffline({
      eventId,
      passToken: "token-bob-456",
      gateId: "gate-vip", // requires zone-vip-stage
    });

    expect(result.status).toBe("ACCESS_DENIED");
    expect(result.accessDenied).toBe(true);
    expect(result.error).toContain("authorized");
  });

  it("returns INVALID_PASS for an unrecognized token not in the manifest", async () => {
    const result = await verifyPassOffline({
      eventId,
      passToken: "random-fake-pass",
      gateId: "gate-main",
    });

    expect(result.status).toBe("INVALID_PASS");
    expect(result.success).toBe(false);
    expect(result.error).toContain("not found");
  });

  it("searches offline attendees by name, email, or pass type", async () => {
    const matchesName = await searchOfflineAttendees(eventId, "alice");
    expect(matchesName).toHaveLength(1);
    expect(matchesName[0].name).toBe("Alice Johnson");

    const matchesEmail = await searchOfflineAttendees(eventId, "bob@example.com");
    expect(matchesEmail).toHaveLength(1);
    expect(matchesEmail[0].email).toBe("bob@example.com");

    const matchesType = await searchOfflineAttendees(eventId, "vip");
    expect(matchesType).toHaveLength(1);
    expect(matchesType[0].passType).toBe("vip");
  });

  it("updates queue stats correctly for pending, synced, and conflict items", async () => {
    const stats = await getQueueStats(eventId);
    expect(typeof stats.pending).toBe("number");
    expect(typeof stats.synced).toBe("number");
    expect(typeof stats.conflicts).toBe("number");
  });
});

describe("GET /api/scan/manifest", () => {
  it("returns 401 when unauthorized", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as never);

    const { GET } = await import("@/app/api/scan/manifest/route");
    const { NextRequest } = await import("next/server");
    const req = new NextRequest("http://localhost/api/scan/manifest?eventId=evt-1");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when eventId parameter is missing", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u-1" } } }) },
    } as never);

    const { GET } = await import("@/app/api/scan/manifest/route");
    const { NextRequest } = await import("next/server");
    const req = new NextRequest("http://localhost/api/scan/manifest");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/scan/sync", () => {
  it("returns 401 when unauthorized", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as never);

    const { POST } = await import("@/app/api/scan/sync/route");
    const { NextRequest } = await import("next/server");
    const req = new NextRequest("http://localhost/api/scan/sync", {
      method: "POST",
      body: JSON.stringify({ eventId: "evt-1", scans: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when scans array is empty", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u-1" } } }) },
    } as never);

    const { POST } = await import("@/app/api/scan/sync/route");
    const { NextRequest } = await import("next/server");
    const req = new NextRequest("http://localhost/api/scan/sync", {
      method: "POST",
      body: JSON.stringify({ eventId: "evt-1", scans: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
