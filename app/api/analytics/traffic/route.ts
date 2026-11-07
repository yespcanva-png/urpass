import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resolveTrafficSource } from "@/lib/traffic/source";
import { isTrackableTrafficPath } from "@/lib/traffic/path";
import { linkTrafficVisitorToUser, TRAFFIC_CONSENT_COOKIE, TRAFFIC_VISITOR_COOKIE, validVisitorId } from "@/lib/traffic/server";

export const dynamic = "force-dynamic";

function noStore(data: object, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function optsOut(req: NextRequest) {
  return req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1";
}

export async function POST(req: NextRequest) {
  if (req.cookies.get(TRAFFIC_CONSENT_COOKIE)?.value !== "1" || optsOut(req)) {
    return noStore({ recorded: false });
  }
  if (Number(req.headers.get("content-length") || "0") > 4096) {
    return noStore({ error: "Visit payload too large" }, 413);
  }
  const visitorId = req.cookies.get(TRAFFIC_VISITOR_COOKIE)?.value;
  if (!validVisitorId(visitorId)) return noStore({ error: "Visitor cookie missing" }, 400);
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return noStore({ error: "Invalid visit" }, 400);

  if (body.linkOnly === true) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await linkTrafficVisitorToUser(visitorId, user.id);
    return noStore({ linked: Boolean(user) });
  }

  const path = typeof body.path === "string" ? body.path : "";
  if (!isTrackableTrafficPath(path) || path.length > 160) {
    return noStore({ recorded: false });
  }

  const source = resolveTrafficSource({
    utmSource: typeof body.utmSource === "string" ? body.utmSource : null,
    utmMedium: typeof body.utmMedium === "string" ? body.utmMedium : null,
    utmCampaign: typeof body.utmCampaign === "string" ? body.utmCampaign : null,
    referrer: typeof body.referrer === "string" ? body.referrer : null,
    siteHost: req.nextUrl.hostname,
  });

  const { error } = await adminClient().rpc("record_traffic_visit", {
    p_visitor_id: visitorId,
    p_source: source.source,
    p_referrer_host: source.referrerHost,
    p_utm_source: source.utmSource,
    p_utm_medium: source.utmMedium,
    p_utm_campaign: source.utmCampaign,
    p_landing_path: path,
  });
  if (error) {
    console.warn("[traffic] Visit recording failed:", error.message);
    return noStore({ error: "Traffic analytics unavailable" }, 503);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) await linkTrafficVisitorToUser(visitorId, user.id);
  return noStore({ recorded: true });
}

export async function DELETE(req: NextRequest) {
  const visitorId = req.cookies.get(TRAFFIC_VISITOR_COOKIE)?.value;
  if (validVisitorId(visitorId)) {
    const { error } = await adminClient().rpc("delete_traffic_visitor", { p_visitor_id: visitorId });
    if (error) return noStore({ error: "Could not delete traffic attribution" }, 503);
  }
  const response = noStore({ deleted: true });
  response.cookies.delete(TRAFFIC_VISITOR_COOKIE);
  response.cookies.delete(TRAFFIC_CONSENT_COOKIE);
  return response;
}
