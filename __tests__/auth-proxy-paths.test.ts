import { describe, expect, it } from "vitest";
import { isAuthPagePath, isProtectedPath } from "@/lib/supabase/middleware";

describe("auth proxy path classification", () => {
  it("protects exact app routes and nested pages", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/dashboard/events")).toBe(true);
    expect(isProtectedPath("/event/evt_123")).toBe(true);
    expect(isProtectedPath("/org/acme/settings")).toBe(true);
    expect(isProtectedPath("/scan/evt_123")).toBe(true);
  });

  it("does not protect public SEO routes with matching prefixes", () => {
    expect(isProtectedPath("/event-registration-software")).toBe(false);
    expect(isProtectedPath("/event-ticketing-platform")).toBe(false);
    expect(isProtectedPath("/scan-and-go")).toBe(false);
    expect(isProtectedPath("/organization-event-guide")).toBe(false);
  });

  it("classifies only login and signup route segments as auth pages", () => {
    expect(isAuthPagePath("/login")).toBe(true);
    expect(isAuthPagePath("/login/help")).toBe(true);
    expect(isAuthPagePath("/signup")).toBe(true);
    expect(isAuthPagePath("/signup/team")).toBe(true);
    expect(isAuthPagePath("/login-security-guide")).toBe(false);
    expect(isAuthPagePath("/signup-for-events")).toBe(false);
  });
});
