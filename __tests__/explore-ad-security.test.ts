import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/ops/auth", () => ({ isOpsAuthenticated: vi.fn().mockResolvedValue(false) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { getAdminCampaignsAction, saveAdminCampaignAction, toggleCampaignStatusAction, uploadCampaignCreativeAction } from "@/app/actions/explore-ads";
import { POST } from "@/app/api/explore/ads/event/route";
import { NextRequest } from "next/server";
import { adminApproveExploreListingAction } from "@/app/actions/explore";

describe("Explore ad authorization and submission boundary", () => {
  it("rejects campaign reads, writes, status changes, and uploads without an ops session", async () => {
    expect((await getAdminCampaignsAction()).success).toBe(false);
    expect((await saveAdminCampaignAction({ title: "Sponsor" })).success).toBe(false);
    expect((await toggleCampaignStatusAction("11111111-1111-4111-8111-111111111111", "active")).success).toBe(false);
    expect((await uploadCampaignCreativeAction(new FormData())).success).toBe(false);
    expect((await adminApproveExploreListingAction("11111111-1111-4111-8111-111111111111")).success).toBe(false);
  });

  it("rejects forged telemetry events before storage", async () => {
    const req = new NextRequest("http://localhost:3000/api/explore/ads/event", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ campaignId: "not-a-uuid", placement: "hero", eventType: "impression", sessionId: "sid_valid_session_12345" }),
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
