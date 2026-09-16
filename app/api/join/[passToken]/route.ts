import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ passToken: string }> }
) {
  const { passToken } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";

  const supabase = await createClient();

  // Find pass by token
  const { data: pass } = await supabase
    .from("passes")
    .select("attendee_id, event_id, status")
    .eq("pass_token", passToken)
    .single();

  if (!pass) {
    return NextResponse.redirect(`${appUrl}/pass/${passToken}?error=invalid`);
  }

  // Check attendee is approved
  const { data: attendee } = await supabase
    .from("attendees")
    .select("application_status")
    .eq("id", pass.attendee_id)
    .single();

  if (!attendee || attendee.application_status !== "approved") {
    return NextResponse.redirect(`${appUrl}/pass/${passToken}?error=not_approved`);
  }

  // Get event meeting URL
  const { data: event } = await supabase
    .from("events")
    .select("event_type, meeting_url")
    .eq("id", pass.event_id)
    .single();

  if (!event?.meeting_url || event.event_type === "physical") {
    return NextResponse.redirect(`${appUrl}/pass/${passToken}?error=no_meeting`);
  }

  return NextResponse.redirect(event.meeting_url);
}
