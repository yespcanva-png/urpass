import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { TRAFFIC_CONSENT_COOKIE, TRAFFIC_VISITOR_COOKIE, validVisitorId } from "@/lib/traffic/server";

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

  const body = await req.json().catch(() => null);
  if (!body || typeof body.eventName !== "string") {
    return noStore({ error: "Invalid event payload" }, 400);
  }

  const visitorId = req.cookies.get(TRAFFIC_VISITOR_COOKIE)?.value;
  const validVid = validVisitorId(visitorId) ? visitorId : null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await adminClient().rpc("record_lifecycle_event", {
    p_visitor_id: validVid,
    p_user_id: user?.id || null,
    p_event_name: body.eventName.slice(0, 80),
    p_properties: typeof body.properties === "object" && body.properties !== null ? body.properties : {},
  });

  if (error) {
    console.debug("[analytics/events] Event recording skipped:", error.message);
    return noStore({ recorded: false });
  }

  return noStore({ recorded: true });
}

