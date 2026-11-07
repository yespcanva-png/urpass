import { NextRequest, NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { adminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isOpsAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const daysParam = Number(req.nextUrl.searchParams.get("days") || "30");
  const days = Number.isInteger(daysParam) && daysParam >= 1 && daysParam <= 180 ? daysParam : 30;

  const { data, error } = await adminClient().rpc("user_intelligence_report", {
    p_days: days,
  });

  if (error) {
    console.error("[ops/intelligence] Report unavailable:", error.message);
    return NextResponse.json({ error: "User intelligence report unavailable" }, { status: 503 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "private, no-store" },
  });
}

