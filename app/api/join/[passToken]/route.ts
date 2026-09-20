import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ passToken: string }> }
) {
  const { passToken } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";

  const admin = adminClient();

  // Find pass by token
  const { data: pass } = await admin
    .from("passes")
    .select("attendee_id, event_id, status")
    .eq("pass_token", passToken)
    .maybeSingle();

  if (!pass) {
    return NextResponse.redirect(`${appUrl}/pass/${passToken}?error=invalid`);
  }

  // Check attendee is approved
  const { data: attendee } = await admin
    .from("attendees")
    .select("application_status")
    .eq("id", pass.attendee_id)
    .maybeSingle();

  if (!attendee || attendee.application_status !== "approved") {
    return NextResponse.redirect(`${appUrl}/pass/${passToken}?error=not_approved`);
  }

  // Get event meeting URL
  const { data: event } = await admin
    .from("events")
    .select("event_type, meeting_url")
    .eq("id", pass.event_id)
    .maybeSingle();

  if (!event?.meeting_url || event.event_type === "physical") {
    return NextResponse.redirect(`${appUrl}/pass/${passToken}?error=no_meeting`);
  }

  return NextResponse.redirect(event.meeting_url);
}
