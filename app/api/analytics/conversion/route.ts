import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    if (!text) return NextResponse.json({ ok: true });

    const data = JSON.parse(text);
    const {
      eventName,
      pageSlug,
      contentCluster,
      serviceModel,
      ctaPosition,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      referrer,
    } = data;

    if (!eventName || !pageSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const admin = adminClient();
    await admin
      .from("marketing_campaign_conversions")
      .insert({
        event_name: String(eventName).slice(0, 80),
        page_slug: String(pageSlug).slice(0, 120),
        content_cluster: contentCluster ? String(contentCluster).slice(0, 60) : null,
        service_model: serviceModel || null,
        cta_position: ctaPosition || null,
        utm_source: utmSource ? String(utmSource).slice(0, 100) : null,
        utm_medium: utmMedium ? String(utmMedium).slice(0, 100) : null,
        utm_campaign: utmCampaign ? String(utmCampaign).slice(0, 100) : null,
        utm_content: utmContent ? String(utmContent).slice(0, 100) : null,
        referrer: referrer ? String(referrer).slice(0, 255) : null,
      });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
