import { afterEach, describe, expect, it, vi } from "vitest";
import { trackConversionEvent } from "@/lib/conversion/tracker";

describe("conversion event delivery", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses keepalive fetch and reports a rejected server response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", fetchMock);

    trackConversionEvent("signup_started", { pageSlug: "/signup/delivery-test" });

    await vi.waitFor(() => expect(warn).toHaveBeenCalledWith(
      "[conversion-tracker] Event was not recorded:", 503
    ));
    expect(fetchMock).toHaveBeenCalledWith("/api/conversion/track", expect.objectContaining({
      method: "POST",
      keepalive: true,
    }));
  });
});
