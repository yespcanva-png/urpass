import { describe, it, expect } from "vitest";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";

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

  it("defaults to /dashboard when no params or relevant referrer are present", () => {
    expect(resolvePostAuthRedirect(null, "https://urpass.space/")).toBe("/dashboard");
  });
});
