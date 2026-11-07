import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/analytics/traffic/route";

function request(headers: Record<string, string>) {
  return new NextRequest("https://urpass.space/api/analytics/traffic", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ path: "/signup", utmSource: "producthunt" }),
  });
}

describe("traffic API consent gate", () => {
  it("does not record a visit without an affirmative analytics cookie", async () => {
    const response = await POST(request({}));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ recorded: false });
  });

  it("honours browser opt-out signals even after consent", async () => {
    const signals: Record<string, string>[] = [{ dnt: "1" }, { "sec-gpc": "1" }];
    for (const signal of signals) {
      const response = await POST(request({
        cookie: "urpass_analytics_consent=1; urpass_traffic_vid=11111111-1111-4111-8111-111111111111",
        ...signal,
      }));
      expect(await response.json()).toEqual({ recorded: false });
    }
  });
});
