import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; roomId: string }> }
) {
  const { eventId, roomId } = await params;
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
  if (body.floor !== undefined) updates.floor = body.floor?.trim() || null;
  if (body.location !== undefined) updates.location = body.location?.trim() || null;
  if (body.capacity !== undefined) updates.capacity = Number(body.capacity);
  if (body.checkin_enabled !== undefined) updates.checkin_enabled = Boolean(body.checkin_enabled);

  const { data: room, error } = await auth.supabase
    .from("event_rooms")
    .update(updates)
    .eq("id", roomId)
    .eq("event_id", eventId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: room });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; roomId: string }> }
) {
  const { eventId, roomId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Check if room is used by sessions
  const { count: sessionCount } = await auth.supabase
    .from("event_sessions")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId);

  if (sessionCount && sessionCount > 0) {
    return NextResponse.json(
      { error: "This room contains active sessions. Reassign or remove them before deleting the room." },
      { status: 400 }
    );
  }

  const { error } = await auth.supabase
    .from("event_rooms")
    .delete()
    .eq("id", roomId)
    .eq("event_id", eventId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
