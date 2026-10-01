import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUserById = vi.fn();
const mockUpdateUserById = vi.fn();
const mockUpsertSingle = vi.fn();
const mockSelectMaybeSingle = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: mockUpsertSingle,
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: mockSelectMaybeSingle,
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    })),
    auth: {
      admin: {
        getUserById: mockGetUserById,
        updateUserById: mockUpdateUserById,
      },
    },
  })),
}));

import {
  saveEventPaymentConfigService,
  getEventPaymentConfigService,
} from "@/lib/payments/service";

describe("Event Payment Config with Safe Multi-Tier Persistence", () => {
  const sampleEventId = "evt-test-999";
  const sampleUserId = "11111111-1111-4111-8111-111111111111";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles missing public.event_payment_configs schema table and safely persists to user_metadata fallback", async () => {
    // Simulate table missing in Supabase schema cache
    mockUpsertSingle.mockRejectedValue(
      new Error("Could not find the table 'public.event_payment_configs' in the schema cache")
    );
    mockGetUserById.mockResolvedValue({
      data: {
        user: {
          id: sampleUserId,
          user_metadata: {},
        },
      },
      error: null,
    });
    mockUpdateUserById.mockResolvedValue({ data: {}, error: null });

    const config = await saveEventPaymentConfigService({
      eventId: sampleEventId,
      paymentMode: "URPASS_MANAGED",
      feeBearer: "ATTENDEE",
      platformFeePercent: 2.0,
      gatewayFeePercent: 2.0,
      refundPolicy: "FLEXIBLE_24H",
      userId: sampleUserId,
    });

    expect(config).toBeDefined();
    expect(config.eventId).toBe(sampleEventId);
    expect(config.paymentMode).toBe("URPASS_MANAGED");
    expect(config.feeBearer).toBe("ATTENDEE");
    expect(config.refundPolicy).toBe("FLEXIBLE_24H");
    expect(mockUpdateUserById).toHaveBeenCalledWith(
      sampleUserId,
      expect.objectContaining({
        user_metadata: expect.objectContaining({
          event_payment_configs: expect.objectContaining({
            [sampleEventId]: expect.objectContaining({
              paymentMode: "URPASS_MANAGED",
              feeBearer: "ATTENDEE",
              refundPolicy: "FLEXIBLE_24H",
            }),
          }),
        }),
      })
    );
  });

  it("fetches fallback config from user_metadata when table does not exist", async () => {
    // Table query errors
    mockSelectMaybeSingle.mockRejectedValue(
      new Error("Could not find the table 'public.event_payment_configs' in the schema cache")
    );
    mockGetUserById.mockResolvedValue({
      data: {
        user: {
          id: sampleUserId,
          user_metadata: {
            event_payment_configs: {
              [sampleEventId]: {
                eventId: sampleEventId,
                paymentMode: "ORGANIZER_GATEWAY",
                feeBearer: "ORGANIZER",
                refundPolicy: "NON_REFUNDABLE",
              },
            },
          },
        },
      },
      error: null,
    });

    const config = await getEventPaymentConfigService(sampleEventId, sampleUserId);
    expect(config).toBeDefined();
    expect(config.eventId).toBe(sampleEventId);
    expect(config.paymentMode).toBe("ORGANIZER_GATEWAY");
    expect(config.feeBearer).toBe("ORGANIZER");
    expect(config.refundPolicy).toBe("NON_REFUNDABLE");
  });

  it("returns clean default config if table and user_metadata do not exist", async () => {
    mockSelectMaybeSingle.mockRejectedValue(new Error("Table missing"));
    mockGetUserById.mockResolvedValue({ data: null, error: new Error("User not found") });

    const config = await getEventPaymentConfigService("evt-unconfigured-123");
    expect(config).toBeDefined();
    expect(config.eventId).toBe("evt-unconfigured-123");
    expect(config.paymentMode).toBe("URPASS_MANAGED");
    expect(config.feeBearer).toBe("ATTENDEE");
    expect(config.refundPolicy).toBe("ORGANIZER_DISCRETION");
    expect(config.platformFeePercent).toBe(2.0);
    expect(config.gatewayFeePercent).toBe(2.0);
  });
});
