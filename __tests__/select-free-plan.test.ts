import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/config", () => ({ getSupabaseUrl: () => "https://example.supabase.co" }));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { selectFreePlan } from "@/app/actions/billing";

describe("selectFreePlan", () => {
  const user = { id: "free-user", user_metadata: {} };
  const upsert = vi.fn();
  const updateUserById = vi.fn();
  const maybeSingle = vi.fn();
  const from = vi.fn((table: string) => {
    if (table === "plans") {
      return { select: () => ({ eq: () => ({ maybeSingle }) }) };
    }
    if (table === "subscriptions") return { upsert };
    throw new Error(`Unexpected table: ${table}`);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    } as never);
    vi.mocked(createAdminClient).mockReturnValue({
      from,
      auth: { admin: { updateUserById } },
    } as never);
    maybeSingle.mockResolvedValue({ data: { id: "free-plan", slug: "free" }, error: null });
    upsert.mockResolvedValue({ error: null });
    updateUserById.mockResolvedValue({ error: null });
  });

  it("stores no billing cycle for Free Forever and grants access", async () => {
    expect(await selectFreePlan()).toEqual({ success: true });
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: user.id,
        plan_id: "free-plan",
        provider: "free",
        billing_cycle: null,
      }),
      { onConflict: "user_id" }
    );
  });

  it("does not substitute a paid plan when the free plan is missing", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });

    expect(await selectFreePlan()).toEqual({
      error: "Free Forever is temporarily unavailable. Please try again later.",
    });
    expect(upsert).not.toHaveBeenCalled();
  });
});
