import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; speakerId: string }> }
) {
  const { eventId, speakerId } = await params;
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
  if (body.photo !== undefined) updates.photo = body.photo?.trim() || null;
  if (body.job_title !== undefined) updates.job_title = body.job_title?.trim() || null;
  if (body.company !== undefined) updates.company = body.company?.trim() || null;
  if (body.bio !== undefined) updates.bio = body.bio?.trim() || null;
  if (body.linkedin_url !== undefined) updates.linkedin_url = body.linkedin_url?.trim() || null;
  if (body.website_url !== undefined) updates.website_url = body.website_url?.trim() || null;
  if (body.email !== undefined) updates.email = body.email?.trim() || null;
  if (body.phone !== undefined) updates.phone = body.phone?.trim() || null;
  if (body.country !== undefined) updates.country = body.country?.trim() || null;
  if (body.city !== undefined) updates.city = body.city?.trim() || null;
  if (body.topics !== undefined) updates.topics = Array.isArray(body.topics) ? body.topics : [];
  if (body.display_order !== undefined) updates.display_order = body.display_order;
  if (body.visibility !== undefined) updates.visibility = body.visibility;

  const { data: speaker, error } = await auth.supabase
    .from("event_speakers")
    .update(updates)
    .eq("id", speakerId)
    .eq("event_id", eventId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: speaker });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; speakerId: string }> }
) {
  const { eventId, speakerId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { error } = await auth.supabase
    .from("event_speakers")
    .delete()
    .eq("id", speakerId)
    .eq("event_id", eventId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
