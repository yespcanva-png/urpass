import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAppleWalletPass, isAppleWalletConfigured } from "@/lib/wallet/apple-pass";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ passToken: string }> }
) {
  const { passToken } = await params;

  // Verify the pass exists
  const supabase = await createClient();
  const { data: pass } = await supabase
    .from("passes")
    .select("pass_token, pass_type, event_id, attendee_id")
    .eq("pass_token", passToken)
    .single();

  if (!pass) {
    return NextResponse.json({ error: "Pass not found" }, { status: 404 });
  }

  // If Apple Wallet signing credentials are configured, generate signed .pkpass
  if (isAppleWalletConfigured()) {
    const [{ data: attendee }, { data: event }] = await Promise.all([
      supabase
        .from("attendees")
        .select("name, email")
        .eq("id", pass.attendee_id)
        .single(),
      supabase
        .from("events")
        .select("name, event_date, venue")
        .eq("id", pass.event_id)
        .single(),
    ]);

    const pkpassBuffer = await generateAppleWalletPass({
      passToken: pass.pass_token,
      eventName: event?.name || "Event Pass",
      eventDate: event?.event_date,
      venue: event?.venue,
      attendeeName: attendee?.name || "Attendee",
      passType: pass.pass_type,
    });

    if (pkpassBuffer) {
      const fileName = `${(event?.name || "event").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-pass.pkpass`;
      return new NextResponse(new Uint8Array(pkpassBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.pkpass",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "no-cache",
        },
      });
    }
  }

  // Until Apple Developer certificates are configured, redirect to responsive web pass view
  return NextResponse.redirect(`${APP_URL}/pass/${passToken}`, { status: 302 });
}

