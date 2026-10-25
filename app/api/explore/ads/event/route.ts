import { NextRequest, NextResponse } from "next/server";
import { recordAdEventInDb } from "@/lib/explore/ads-service";
import type { AdEventPayload } from "@/lib/explore/ads-types";

export const dynamic = "force-dynamic";
const recent = new Map<string, { count: number; expires: number }>();

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== req.nextUrl.host) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    } catch { return NextResponse.json({ error: "Invalid origin" }, { status: 403 }); }
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  if (recent.size > 5000) for (const [key, value] of recent) if (value.expires < now) recent.delete(key);
  if (recent.size > 5000) recent.delete(recent.keys().next().value || "");
  const window = recent.get(ip);
  if (window && window.expires > now && window.count >= 30) return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  recent.set(ip, { count: window && window.expires > now ? window.count + 1 : 1, expires: window && window.expires > now ? window.expires : now + 60000 });
  try {
    if (Number(req.headers.get("content-length") || "0") > 2048) return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    const body = (await req.json()) as AdEventPayload;
    if (!body || !/^[0-9a-f-]{36}$/i.test(body.campaignId || "") ||
        !["hero", "top_sidebar", "in_content", "bottom_sidebar"].includes(body.placement) ||
        !["impression", "click"].includes(body.eventType) ||
        !/^[A-Za-z0-9_-]{16,100}$/.test(body.sessionId || "") ||
        (body.city && (typeof body.city !== "string" || body.city.length > 100))) {
      return NextResponse.json({ error: "Invalid ad event" }, { status: 400 });
    }
    const recorded = await recordAdEventInDb(body);
    return NextResponse.json({ ok: recorded });
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
}
