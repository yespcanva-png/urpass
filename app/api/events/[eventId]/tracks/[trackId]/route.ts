import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; trackId: string }> }
) {
  const { eventId, trackId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const updates: Record<string, any> = {};
  if (body.name !== undefined) updates.name = body.name.trim();
  if (body.description !== undefined) updates.description = body.description?.trim() || null;
  if (body.colour !== undefined) updates.colour = body.colour.trim();
  if (body.sort_order !== undefined) updates.sort_order = body.sort_order;
  if (body.visibility !== undefined) updates.visibility = body.visibility;

  const { data: track, error } = await auth.supabase
    .from("event_tracks")
    .update(updates)
    .eq("id", trackId)
    .eq("event_id", eventId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: track });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; trackId: string }> }
) {
  const { eventId, trackId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Check if track is used by sessions
  const { count: sessionCount } = await auth.supabase
    .from("event_sessions")
    .select("id", { count: "exact", head: true })
    .eq("track_id", trackId);

  if (sessionCount && sessionCount > 0) {
    return NextResponse.json(
      { error: "This track contains sessions. Reassign or remove them before deleting the track." },
      { status: 400 }
    );
  }

  const { error } = await auth.supabase
    .from("event_tracks")
    .delete()
    .eq("id", trackId)
    .eq("event_id", eventId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
