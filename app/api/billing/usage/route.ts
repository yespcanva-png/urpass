import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRemainingQuota } from "@/lib/billing/engine/entitlements-engine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId") || user.id;

  const [eventsQuota, registrationsQuota, seatsQuota] = await Promise.all([
    getRemainingQuota(orgId, "events_per_month"),
    getRemainingQuota(orgId, "registrations_per_month"),
    getRemainingQuota(orgId, "organizer_seats"),
  ]);

  return NextResponse.json({
    organizationId: orgId,
    usage: {
      events: eventsQuota,
      registrations: registrationsQuota,
      seats: seatsQuota,
    },
  });
}
