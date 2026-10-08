import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatCustomTicketId,
  parseCustomTicketId,
  validateCustomTicketId,
  generateContinuationBatch,
  resolveNextTicketSequence,
  sanitizePrefix,
  DEFAULT_TICKET_ID_CONFIG,
} from "@/lib/tickets/custom-id";
import {
  getEventTicketIdConfig,
  updateEventTicketIdConfig,
  syncEventContinuationOffset,
} from "@/app/actions/custom-ticket-ids";
import type { CustomTicketIdConfig } from "@/types/custom-ticket-id";

// Mock createClient from @/lib/supabase/server
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({
  eq: vi.fn(() => ({
    eq: vi.fn(() => ({
      single: mockSingle,
      maybeSingle: mockSingle,
    })),
    single: mockSingle,
    maybeSingle: mockSingle,
    in: vi.fn(() => ({
      single: mockSingle,
      maybeSingle: mockSingle,
    })),
  })),
  in: vi.fn(() => ({
    eq: vi.fn(() => Promise.resolve({ count: 5 })),
  })),
}));

const mockUpdate = vi.fn(() => ({
  eq: vi.fn().mockResolvedValue({ error: null }),
}));

const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: "test-user-id", email: "organizer@example.com" } },
      error: null,
    }),
  },
  from: vi.fn((table: string) => {
    if (table === "events") {
      return {
        select: mockSelect,
        update: mockUpdate,
      };
    }
    if (table === "attendees") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ count: 12 }),
          }),
        }),
      };
    }
    return {
      select: mockSelect,
      update: mockUpdate,
    };
  }),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Custom Ticket ID & Continuation System", () => {
  describe("sanitizePrefix", () => {
    it("cleans and uppercases prefixes with hyphens and underscores", () => {
      expect(sanitizePrefix("tech26-")).toBe("TECH26-");
      expect(sanitizePrefix(" euphoria_ ")).toBe("EUPHORIA_");
      expect(sanitizePrefix("!@#$VIP-")).toBe("VIP-");
      expect(sanitizePrefix("")).toBe("URP-");
      expect(sanitizePrefix(undefined)).toBe("URP-");
    });
  });

  describe("formatCustomTicketId", () => {
    it("formats default ticket ID with 4 digit padding", () => {
      expect(formatCustomTicketId(null, 1)).toBe("URP-0001");
      expect(formatCustomTicketId(DEFAULT_TICKET_ID_CONFIG, 42)).toBe("URP-0042");
    });

    it("formats custom event prefix with custom padding", () => {
      const config: CustomTicketIdConfig = {
        enabled: true,
        prefix: "TECH26-",
        digitPadding: 5,
        startNumber: 1,
      };
      expect(formatCustomTicketId(config, 1)).toBe("TECH26-00001");
      expect(formatCustomTicketId(config, 250)).toBe("TECH26-00250");
    });

    it("formats prefix without trailing hyphen by adding separator automatically", () => {
      const config: CustomTicketIdConfig = {
        enabled: true,
        prefix: "EUPHORIA",
        digitPadding: 4,
        startNumber: 1,
      };
      expect(formatCustomTicketId(config, 7)).toBe("EUPHORIA-0007");
    });

    it("includes tier code when includeTierCode is enabled", () => {
      const config: CustomTicketIdConfig = {
        enabled: true,
        prefix: "CONF-",
        digitPadding: 4,
        startNumber: 1,
        includeTierCode: true,
      };
      expect(formatCustomTicketId(config, 1, { tierCode: "VIP" })).toBe("CONF-VIP-0001");
      expect(formatCustomTicketId(config, 99, { passType: "student" })).toBe("CONF-STU-0099");
    });

    it("supports optional suffix", () => {
      const config: CustomTicketIdConfig = {
        enabled: true,
        prefix: "URP-",
        suffix: "-2026",
        digitPadding: 3,
        startNumber: 1,
      };
      expect(formatCustomTicketId(config, 5)).toBe("URP-005-2026");
    });
  });

  describe("parseCustomTicketId", () => {
    it("correctly parses standard prefix and sequence number", () => {
      const parsed = parseCustomTicketId("TECH26-0042");
      expect(parsed.isValid).toBe(true);
      expect(parsed.prefix).toBe("TECH26");
      expect(parsed.seq).toBe(42);
    });

    it("correctly parses tier-prefixed custom ticket IDs", () => {
      const parsed = parseCustomTicketId("CONF-VIP-0100");
      expect(parsed.isValid).toBe(true);
      expect(parsed.prefix).toBe("CONF");
      expect(parsed.tierCode).toBe("VIP");
      expect(parsed.seq).toBe(100);
    });

    it("handles invalid or non-numeric strings gracefully", () => {
      const parsed = parseCustomTicketId("INVALID_CODE");
      expect(parsed.isValid).toBe(false);
      expect(parsed.seq).toBe(0);
    });
  });

  describe("validateCustomTicketId", () => {
    it("validates conforming ticket IDs", () => {
      expect(validateCustomTicketId("TECH26-0001", { prefix: "TECH26-" })).toBe(true);
      expect(validateCustomTicketId("URP-1234", { prefix: "URP-" })).toBe(true);
    });

    it("rejects mismatched prefixes or invalid formats", () => {
      expect(validateCustomTicketId("OTHER-0001", { prefix: "TECH26-" })).toBe(false);
      expect(validateCustomTicketId("", { prefix: "TECH26-" })).toBe(false);
    });
  });

  describe("generateContinuationBatch", () => {
    it("generates sequential array of ticket IDs", () => {
      const config: CustomTicketIdConfig = {
        enabled: true,
        prefix: "EUPH-",
        digitPadding: 4,
        startNumber: 1,
      };
      const batch = generateContinuationBatch(config, 101, 3);
      expect(batch).toEqual(["EUPH-0101", "EUPH-0102", "EUPH-0103"]);
    });
  });

  describe("resolveNextTicketSequence", () => {
    it("calculates next sequence incorporating startNumber, continuationOffset, and count", async () => {
      const config: CustomTicketIdConfig = {
        enabled: true,
        prefix: "BATCH-",
        startNumber: 1000,
        continuationOffset: 50,
        digitPadding: 5,
      };

      const result = await resolveNextTicketSequence(mockSupabase, "event-123", config);
      // startNumber (1000) + continuationOffset (50) + count (12 from mock) = 1062
      expect(result.nextSequence).toBe(1062);
      expect(result.customTicketId).toBe("BATCH-01062");
    });
  });

  describe("Server Actions", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("getEventTicketIdConfig returns event config and continuation stats", async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          id: "event-123",
          organizer_id: "test-user-id",
          custom_pass_design: {
            ticketIdConfig: {
              enabled: true,
              prefix: "HACK26-",
              digitPadding: 4,
              startNumber: 1,
              continuationOffset: 0,
            },
          },
        },
      });

      const res = await getEventTicketIdConfig("event-123");
      expect(res.config.prefix).toBe("HACK26-");
      expect(res.stats.enabled).toBe(true);
      expect(res.stats.nextTicketIdPreview).toContain("HACK26-");
    });

    it("updateEventTicketIdConfig updates and sanitizes custom ID config", async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          id: "event-123",
          organizer_id: "test-user-id",
          custom_pass_design: {},
        },
      });

      const res = await updateEventTicketIdConfig("event-123", {
        enabled: true,
        prefix: "summit26-",
        digitPadding: 4,
        startNumber: 100,
        continuationOffset: 25,
      });

      expect(res.success).toBe(true);
      expect(res.config?.prefix).toBe("SUMMIT26-");
      expect(res.config?.startNumber).toBe(100);
      expect(res.config?.continuationOffset).toBe(25);
    });

    it("syncEventContinuationOffset sets continuation offset and returns updated sequence", async () => {
      mockSingle.mockResolvedValueOnce({
        data: {
          id: "event-123",
          organizer_id: "test-user-id",
          custom_pass_design: {
            ticketIdConfig: {
              enabled: true,
              prefix: "LIVE-",
              startNumber: 1,
              digitPadding: 4,
            },
          },
        },
      });

      const res = await syncEventContinuationOffset("event-123", 200);
      expect(res.success).toBe(true);
      expect(res.nextSequence).toBeGreaterThanOrEqual(200);
      expect(res.nextTicketId).toContain("LIVE-");
    });
  });
});
