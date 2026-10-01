import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { data: rooms, error } = await auth.supabase
    .from("event_rooms")
    .select("*")
    .eq("event_id", eventId)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: rooms });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.name?.trim()) {
    return NextResponse.json({ error: "Room name is required" }, { status: 400 });
  }

  const { name, description, floor, location, capacity, checkin_enabled } = body;

  if (capacity !== undefined) {
    const capNum = Number(capacity);
    if (isNaN(capNum) || capNum <= 0) {
      return NextResponse.json({ error: "Room capacity must be a positive number greater than 0" }, { status: 400 });
    }
  }

  const { data: room, error } = await auth.supabase
    .from("event_rooms")
    .insert({
      event_id: eventId,
      name: name.trim(),
      description: description?.trim() || null,
      floor: floor?.trim() || null,
      location: location?.trim() || null,
      capacity: capacity ? Number(capacity) : 100,
      checkin_enabled: checkin_enabled !== false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: room }, { status: 201 });
}
