import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const { createAdminClient, handleRazorpayWebhook } = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  handleRazorpayWebhook: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({ createClient: createAdminClient }));
vi.mock("@/lib/razorpay-webhook", () => ({ handleRazorpayWebhook }));

import { GET } from "@/app/api/cron/billing-webhook-recovery/route";

describe("billing webhook recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("CRON_SECRET", "recovery-secret");
    vi.stubEnv("BILLING_WEBHOOK_RECOVERY_ENABLED", "true");
  });

  it("includes failed events with a cleared lease and replays their signed payload", async () => {
    const rows = [{ event_id: "evt_failed", status: "failed", raw_body: '{"event":"payment.captured"}',
      signature: "signed", retry_count: 1 }];
    const query = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: rows, error: null }),
    };
    createAdminClient.mockReturnValue({ from: vi.fn().mockReturnValue(query) });
    handleRazorpayWebhook.mockResolvedValue(NextResponse.json({ received: true }));

    const response = await GET(new NextRequest("http://localhost/api/cron/billing-webhook-recovery", {
      headers: { authorization: "Bearer recovery-secret" },
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ recovered: 1, failed: 0, scanned: 1 });
    expect(query.or).toHaveBeenCalledWith(expect.stringMatching(/^lease_until\.is\.null,lease_until\.lt\./));
    const replay = handleRazorpayWebhook.mock.calls[0][0] as NextRequest;
    expect(replay.headers.get("x-razorpay-event-id")).toBe("evt_failed");
    expect(replay.headers.get("x-razorpay-signature")).toBe("signed");
    expect(await replay.text()).toBe(rows[0].raw_body);
  });
});
