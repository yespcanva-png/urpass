import { describe, expect, it } from "vitest";
import { DIRECT_SOURCE, resolveTrafficSource } from "@/lib/traffic/source";
import { isTrackableTrafficPath } from "@/lib/traffic/path";

describe("traffic source attribution", () => {
  it.each([
    ["https://chatgpt.com/c/abc", "ChatGPT"],
    ["https://www.producthunt.com/posts/urpass", "Product Hunt"],
    ["https://www.google.co.in/search?q=urpass", "Google"],
    ["https://www.bing.com/search?q=urpass", "Bing"],
    ["https://claude.ai/new", "Claude"],
    ["https://gemini.google.com/app", "Gemini"],
    ["https://www.perplexity.ai/search", "Perplexity"],
    ["https://www.reddit.com/r/events", "Reddit"],
    ["https://www.linkedin.com/feed", "LinkedIn"],
    ["https://l.instagram.com/", "Instagram"],
    ["https://m.facebook.com/", "Facebook"],
    ["https://t.co/abc", "X"],
    ["https://example.org/a?email=private@example.org", "Other"],
  ])("detects %s as %s and stores only its host", (referrer, source) => {
    const result = resolveTrafficSource({ referrer, siteHost: "urpass.space" });
    expect(result.source).toBe(source);
    expect(result.referrerHost).toBe(new URL(referrer).hostname);
    expect(result.referrerHost).not.toContain("/");
    expect(result.referrerHost).not.toContain("?");
  });

  it("prefers UTM source over referrer and normalizes campaign values", () => {
    expect(resolveTrafficSource({ utmSource: "Product_Hunt", utmCampaign: "launch", referrer: "https://google.com/" }))
      .toMatchObject({ source: "Product Hunt", utmSource: "Product_Hunt", utmCampaign: "launch" });
  });

  it("uses Direct / Unknown when a referrer is missing or internal", () => {
    expect(resolveTrafficSource({}).source).toBe(DIRECT_SOURCE);
    expect(resolveTrafficSource({ referrer: "https://uk.urpass.space/pricing", siteHost: "app.uk.urpass.space" }))
      .toMatchObject({ source: DIRECT_SOURCE, referrerHost: null });
  });

  it("does not mistake lookalike domains for Google", () => {
    expect(resolveTrafficSource({ referrer: "https://google.evil.com/" }).source).toBe("Other");
  });

  it("drops UTM values that look like personal data", () => {
    expect(resolveTrafficSource({ utmSource: "person@example.com" }))
      .toMatchObject({ source: DIRECT_SOURCE, utmSource: null });
  });

  it("tracks organiser acquisition pages while excluding attendee and internal routes", () => {
    expect(isTrackableTrafficPath("/event-management-software-pricing")).toBe(true);
    expect(isTrackableTrafficPath("/signup")).toBe(true);
    for (const path of ["/apply/event-1", "/e/summit", "/dashboard", "/ops/traffic", "/create-event", "/api/analytics/traffic"]) {
      expect(isTrackableTrafficPath(path)).toBe(false);
    }
  });
});
