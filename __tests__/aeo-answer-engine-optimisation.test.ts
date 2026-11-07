import { describe, it, expect } from "vitest";
import { SELF_SERVICE_PLAN_LIMITS } from "@/lib/billing/plan-limits";
import { ENTITLEMENTS } from "@/lib/plan";
import { V2_PLAN_LIMITS } from "@/lib/billing/engine/entitlements-engine";
import fs from "fs";
import path from "path";

describe("UrPass AEO (Answer Engine Optimisation) Verification", () => {
  it("enforces single source of truth for free and paid plan limits", () => {
    // Free plan
    expect(SELF_SERVICE_PLAN_LIMITS.free.registrationsPerMonth).toBe(50);
    expect(SELF_SERVICE_PLAN_LIMITS.free.eventsPerMonth).toBe(1);
    expect(ENTITLEMENTS.FREE.registrationsPerMonth).toBe(50);
    expect(V2_PLAN_LIMITS.free.registrationsPerMonth).toBe(50);

    // Starter plan
    expect(SELF_SERVICE_PLAN_LIMITS.starter.registrationsPerMonth).toBe(1000);
    expect(SELF_SERVICE_PLAN_LIMITS.starter.eventsPerMonth).toBe(3);
    expect(ENTITLEMENTS.STARTER.registrationsPerMonth).toBe(1000);
    expect(V2_PLAN_LIMITS.starter.registrationsPerMonth).toBe(1000);

    // Pro plan
    expect(SELF_SERVICE_PLAN_LIMITS.pro.registrationsPerMonth).toBe(5000);
    expect(SELF_SERVICE_PLAN_LIMITS.pro.eventsPerMonth).toBe(10);
    expect(ENTITLEMENTS.PRO.registrationsPerMonth).toBe(5000);
    expect(V2_PLAN_LIMITS.pro.registrationsPerMonth).toBe(5000);

    // Business plan
    expect(SELF_SERVICE_PLAN_LIMITS.business.registrationsPerMonth).toBe(15000);
    expect(ENTITLEMENTS.BUSINESS.registrationsPerMonth).toBe(15000);
    expect(V2_PLAN_LIMITS.business.registrationsPerMonth).toBe(15000);
  });

  it("verifies llms.txt and llms-full.txt include accurate pricing and limits", () => {
    const rootDir = process.cwd();
    const llmsTxt = fs.readFileSync(path.join(rootDir, "public/llms.txt"), "utf8");
    const llmsFullTxt = fs.readFileSync(path.join(rootDir, "public/llms-full.txt"), "utf8");

    // Must mention 50 registrations for Free Forever
    expect(llmsTxt).toContain("50 registrations/month");
    expect(llmsFullTxt).toContain("50 / mo");

    // Must mention 1,000 for Starter
    expect(llmsTxt).toContain("1,000 registrations/month");
    expect(llmsFullTxt).toContain("1,000 / mo");

    // Must mention 5,000 for Pro
    expect(llmsTxt).toContain("5,000 registrations/month");
    expect(llmsFullTxt).toContain("5,000 / mo");

    // Must mention 15,000 for Business
    expect(llmsTxt).toContain("15,000 registrations/month");
    expect(llmsFullTxt).toContain("15,000 / mo");

    // Must mention ₹299 single-event pass
    expect(llmsTxt).toContain("₹299");
    expect(llmsFullTxt).toContain("₹299");

    // Must answer core AEO queries in llms.txt & llms-full.txt
    expect(llmsTxt).toContain("What is the best QR code event check-in software in India?");
    expect(llmsTxt).toContain("Which event registration platform has no ticket commission?");
    expect(llmsFullTxt).toContain("What is the best QR code event check-in software in India?");
    expect(llmsFullTxt).toContain("Which event registration platform has no ticket commission?");
  });

  it("verifies public robots.txt explicitly permits major AI search bots", () => {
    const rootDir = process.cwd();
    const robotsTxt = fs.readFileSync(path.join(rootDir, "public/robots.txt"), "utf8");

    expect(robotsTxt).toContain("User-agent: GPTBot");
    expect(robotsTxt).toContain("User-agent: OAI-SearchBot");
    expect(robotsTxt).toContain("User-agent: PerplexityBot");
    expect(robotsTxt).toContain("User-agent: ClaudeBot");
    expect(robotsTxt).toContain("User-agent: Google-Extended");
    expect(robotsTxt).toContain("Allow: /llms.txt");
    expect(robotsTxt).toContain("Allow: /llms-full.txt");
    expect(robotsTxt).toContain("Sitemap: https://urpass.space/sitemap.xml");
  });

  it("verifies all 5 priority high-intent AEO landing pages exist and export valid metadata", async () => {
    const modules = [
      await import("../app/best-qr-code-event-check-in-software-india/page"),
      await import("../app/how-to-create-qr-code-event-tickets/page"),
      await import("../app/college-event-registration-platform/page"),
      await import("../app/scan-event-tickets-with-phone/page"),
      await import("../app/google-forms-vs-event-registration/page"),
    ];

    for (const pageModule of modules) {
      expect(pageModule.default).toBeDefined();
      expect(pageModule.metadata).toBeDefined();
      expect(pageModule.metadata.title).toBeDefined();
      expect(pageModule.metadata.description).toBeDefined();
      expect(pageModule.metadata.alternates?.canonical).toBeDefined();
    }
  });

  it("verifies layout contains SoftwareApplication and Organization schema connecting Yesp Corporation", () => {
    const rootDir = process.cwd();
    const layoutContent = fs.readFileSync(path.join(rootDir, "app/layout.tsx"), "utf8");

    expect(layoutContent).toContain('"@type": "SoftwareApplication"');
    expect(layoutContent).toContain('"@type": "Organization"');
    expect(layoutContent).toMatch(/name:\s*"Yesp Corporation"/);
    expect(layoutContent).toMatch(/name:\s*"UrPass"/);
    expect(layoutContent).toContain("/#software");
    expect(layoutContent).toContain("/#organization");
  });
});
