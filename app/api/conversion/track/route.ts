import { NextRequest, NextResponse } from "next/server";
import { recordServerConversion } from "@/lib/conversion/server";
import { ANON_SESSION_COOKIE, generateSessionId } from "@/lib/conversion/attribution";
import { TrackConversionPayload } from "@/lib/conversion/types";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text();
    if (!rawText) {
      return NextResponse.json({ ok: true });
    }

    const body = JSON.parse(rawText) as TrackConversionPayload;
    if (!body.eventName || !body.pageSlug) {
      return NextResponse.json({ error: "Missing eventName or pageSlug" }, { status: 400 });
    }

    // Resolve or establish anonymous session ID
    let sessionId = req.cookies.get(ANON_SESSION_COOKIE)?.value || body.sessionId;
    let isNewCookie = false;
    if (!sessionId) {
      sessionId = req.cookies.get(ANON_SESSION_COOKIE)?.value;
    }
    if (!sessionId) {
      sessionId = generateSessionId();
      isNewCookie = true;
    }

    body.sessionId = sessionId;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    body.userId = user?.id || null;

    // Detect IP country
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      req.headers.get("cloudfront-viewer-country") ||
      "IN";

    if (!body.metadata) body.metadata = {};
    body.metadata.ip_country = country;

    await recordServerConversion(body);

    const response = NextResponse.json({ ok: true, sessionId });

    if (isNewCookie) {
      const isHttps = req.nextUrl.protocol === "https:";
      response.cookies.set(ANON_SESSION_COOKIE, sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        secure: isHttps,
      });
    }

    return response;
  } catch (err) {
    console.warn("[api/conversion/track] Error handling conversion tracking:", err);
    return NextResponse.json({ ok: true });
  }
}
