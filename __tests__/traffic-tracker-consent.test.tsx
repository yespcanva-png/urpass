// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/signup" }));
import TrafficSourceTracker from "@/components/analytics/TrafficSourceTracker";

const visitorId = "11111111-1111-4111-8111-111111111111";

describe("traffic tracker consent", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "urpass_traffic_vid=; Max-Age=0; Path=/";
    document.cookie = "urpass_analytics_consent=; Max-Age=0; Path=/";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("does not create a visitor cookie or send a visit before consent", () => {
    render(<TrafficSourceTracker />);
    expect(fetch).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain("urpass_traffic_vid=");
  });

  it("records after acceptance and requests erasure after rejection", async () => {
    document.cookie = `urpass_traffic_vid=${visitorId}; Path=/`;
    const view = render(<TrafficSourceTracker />);
    localStorage.setItem("urpass_cookie_consent", "all");
    window.dispatchEvent(new CustomEvent("urpass:cookie-consent", { detail: { analytics: true } }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/analytics/traffic", expect.objectContaining({ method: "POST" })));
    expect(document.cookie).toContain("urpass_analytics_consent=1");
    localStorage.setItem("urpass_cookie_consent", "essential_only");
    window.dispatchEvent(new CustomEvent("urpass:cookie-consent", { detail: { analytics: false } }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/analytics/traffic", expect.objectContaining({ method: "DELETE" })));
    view.unmount();
  });
});
