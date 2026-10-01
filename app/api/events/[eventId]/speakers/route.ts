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

  const { data: speakers, error } = await auth.supabase
    .from("event_speakers")
    .select(`
      *,
      session_speakers (
        id,
        role,
        sort_order,
        session:event_sessions (
          id,
          title,
          slug,
          session_date,
          start_time,
          end_time,
          session_type
        )
      )
    `)
    .eq("event_id", eventId)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: speakers });
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
    return NextResponse.json({ error: "Speaker name is required" }, { status: 400 });
  }

  const {
    name,
    photo,
    job_title,
    company,
    bio,
    linkedin_url,
    website_url,
    email,
    phone,
    country,
    city,
    topics,
    display_order,
    visibility,
  } = body;

  const { data: speaker, error } = await auth.supabase
    .from("event_speakers")
    .insert({
      event_id: eventId,
      name: name.trim(),
      photo: photo?.trim() || null,
      job_title: job_title?.trim() || null,
      company: company?.trim() || null,
      bio: bio?.trim() || null,
      linkedin_url: linkedin_url?.trim() || null,
      website_url: website_url?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      country: country?.trim() || null,
      city: city?.trim() || null,
      topics: Array.isArray(topics) ? topics : [],
      display_order: typeof display_order === "number" ? display_order : 0,
      visibility: visibility || "public",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: speaker }, { status: 201 });
}
