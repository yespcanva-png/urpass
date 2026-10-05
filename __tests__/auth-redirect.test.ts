import { describe, it, expect } from "vitest";
import { resolvePostAuthRedirect, getAuthResetRedirectUrl } from "@/lib/auth-redirect";

describe("resolvePostAuthRedirect", () => {
  function makeParams(obj: Record<string, string>): { get: (k: string) => string | null } {
    return {
      get: (k: string) => obj[k] ?? null,
    };
  }

  it("redirects to /billing?claim=true when next points to founder-lifetime-deal", () => {
    const params = makeParams({ next: "/founder-lifetime-deal?claim=true" });
    expect(resolvePostAuthRedirect(params)).toBe("/billing?claim=true");
  });

  it("redirects to /billing?claim=true when full URL points to founder-lifetime-deal", () => {
    const params = makeParams({ next: "https://urpass.space/founder-lifetime-deal" });
    expect(resolvePostAuthRedirect(params)).toBe("/billing?claim=true");
  });

  it("redirects to /billing?claim=true when from=founder-lifetime-deal", () => {
    const params = makeParams({ from: "founder-lifetime-deal" });
    expect(resolvePostAuthRedirect(params)).toBe("/billing?claim=true");
  });

  it("redirects to /billing when next points to pricing page", () => {
    const params = makeParams({ next: "/pricing" });
    expect(resolvePostAuthRedirect(params)).toBe("/billing");
  });

  it("redirects to /billing when full URL points to https://urpass.space/pricing", () => {
    const params = makeParams({ next: "https://urpass.space/pricing" });
    expect(resolvePostAuthRedirect(params)).toBe("/billing");
  });

  it("redirects to /billing when from=pricing", () => {
    const params = makeParams({ from: "pricing" });
    expect(resolvePostAuthRedirect(params)).toBe("/billing");
  });

  it("redirects to /billing?plan=pro when plan is specified on pricing signup", () => {
    const params = makeParams({ from: "pricing", plan: "pro" });
    expect(resolvePostAuthRedirect(params)).toBe("/billing?plan=pro");
  });

  it("redirects to /billing?claim=true when document.referrer is founder-lifetime-deal", () => {
    const res = resolvePostAuthRedirect(null, "https://urpass.space/founder-lifetime-deal");
    expect(res).toBe("/billing?claim=true");
  });

  it("redirects to /billing when document.referrer is pricing page", () => {
    const res = resolvePostAuthRedirect(null, "https://urpass.space/pricing");
    expect(res).toBe("/billing");
  });

  it("preserves explicit /billing candidate directly", () => {
    const params = makeParams({ next: "/billing?tab=invoices" });
    expect(resolvePostAuthRedirect(params)).toBe("/billing?tab=invoices");
  });

  it("preserves other safe relative routes when not from pricing or founder deal", () => {
    const params = makeParams({ next: "/org/acme/join?token=123" });
    expect(resolvePostAuthRedirect(params)).toBe("/org/acme/join?token=123");
  });

  it("drops external redirect destinations", () => {
    const params = makeParams({ next: "https://evil.example/phish" });
    expect(resolvePostAuthRedirect(params)).toBe("/dashboard");
  });

  it("drops protocol-relative redirect destinations", () => {
    const params = makeParams({ next: "//evil.example/phish" });
    expect(resolvePostAuthRedirect(params)).toBe("/dashboard");
  });

  it("drops auth callback destinations to avoid auth loops", () => {
    const params = makeParams({ next: "/auth/callback?code=abc" });
    expect(resolvePostAuthRedirect(params)).toBe("/dashboard");
  });

  it("drops login and signup destinations to avoid post-auth loops", () => {
    expect(resolvePostAuthRedirect(makeParams({ next: "/login" }))).toBe("/dashboard");
    expect(resolvePostAuthRedirect(makeParams({ next: "/signup?from=pricing" }))).toBe("/billing");
    expect(resolvePostAuthRedirect(makeParams({ next: "/signup" }))).toBe("/dashboard");
  });

  it("defaults to /dashboard when no params or relevant referrer are present", () => {
    expect(resolvePostAuthRedirect(null, "https://urpass.space/")).toBe("/dashboard");
  });
});

describe("getAuthResetRedirectUrl", () => {
  it("never returns localhost when passed localhost origin", () => {
    const url = getAuthResetRedirectUrl("http://localhost:3000");
    expect(url).toBe("https://urpass.space/auth/reset-password");
    expect(url).not.toContain("localhost");
  });

  it("never returns 127.0.0.1 when passed loopback origin", () => {
    const url = getAuthResetRedirectUrl("http://127.0.0.1:3000");
    expect(url).toBe("https://urpass.space/auth/reset-password");
    expect(url).not.toContain("127.0.0.1");
  });

  it("uses production domain https://urpass.space/auth/reset-password as standard default", () => {
    const url = getAuthResetRedirectUrl(null);
    expect(url).toBe("https://urpass.space/auth/reset-password");
  });

  it("preserves valid public domain origin when hosted on custom or staging subdomain", () => {
    const url = getAuthResetRedirectUrl("https://staging.urpass.space");
    expect(url).toBe("https://staging.urpass.space/auth/reset-password");
  });
});
