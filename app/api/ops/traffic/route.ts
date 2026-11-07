import { NextRequest, NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { adminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isOpsAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const grain = req.nextUrl.searchParams.get("grain") || "day";
  const days = Number(req.nextUrl.searchParams.get("days") || "30");
  if (!["day", "week", "month"].includes(grain) || !Number.isInteger(days) || days < 1 || days > 180) {
    return NextResponse.json({ error: "Invalid report range" }, { status: 400 });
  }
  const { data, error } = await adminClient().rpc("traffic_source_report", {
    p_days: days,
    p_grain: grain,
  });
  if (error) {
    console.error("[ops/traffic] Report unavailable:", error.message);
    return NextResponse.json({ error: "Traffic report unavailable" }, { status: 503 });
  }
  return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
}
