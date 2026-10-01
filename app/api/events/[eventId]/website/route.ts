import { NextRequest, NextResponse } from "next/server";
import { verifyEventOrganizerAccess } from "@/lib/conference/auth";
import { slugify } from "@/lib/conference/helpers";

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

  // Get or auto-initialize website record
  let { data: website } = await auth.supabase
    .from("event_websites")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  if (!website) {
    const baseSlug = slugify(auth.event?.name || "conference");
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existing } = await auth.supabase
        .from("event_websites")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const { data: created, error } = await auth.supabase
      .from("event_websites")
      .insert({
        event_id: eventId,
        slug,
        theme: "modern",
        primary_colour: "#6C63FF",
        secondary_colour: "#0e0c16",
        published: true,
        seo_title: `${auth.event?.name} — Official Event Website`,
        seo_description: `Join us at ${auth.event?.name} at ${auth.event?.venue}. Browse the full agenda, speakers, and reserve your seat.`,
        cta_text: "Register Now",
      })
      .select()
      .single();

    if (!error && created) {
      website = created;
    }
  }

  return NextResponse.json({ data: website });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const auth = await verifyEventOrganizerAccess(eventId);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const updates: Record<string, any> = {};
  if (body.slug !== undefined) updates.slug = slugify(body.slug);
  if (body.custom_domain !== undefined) updates.custom_domain = body.custom_domain?.trim() || null;
  if (body.theme !== undefined) updates.theme = body.theme;
  if (body.primary_colour !== undefined) updates.primary_colour = body.primary_colour.trim();
  if (body.secondary_colour !== undefined) updates.secondary_colour = body.secondary_colour.trim();
  if (body.hero_image !== undefined) updates.hero_image = body.hero_image?.trim() || null;
  if (body.published !== undefined) updates.published = Boolean(body.published);
  if (body.seo_title !== undefined) updates.seo_title = body.seo_title?.trim() || null;
  if (body.seo_description !== undefined) updates.seo_description = body.seo_description?.trim() || null;
  if (body.sections_config !== undefined) updates.sections_config = body.sections_config;
  if (body.social_links !== undefined) updates.social_links = body.social_links;
  if (body.cta_text !== undefined) updates.cta_text = body.cta_text.trim();
  if (body.footer_text !== undefined) updates.footer_text = body.footer_text?.trim() || null;

  const { data: website, error } = await auth.supabase
    .from("event_websites")
    .upsert({
      event_id: eventId,
      ...updates,
    }, { onConflict: "event_id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: website });
}
