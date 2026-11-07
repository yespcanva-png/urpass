import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminClient } from "@/lib/supabase/admin";

const leadSchema = z.object({
  organisationName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(30).optional(),
  market: z.enum(["IN", "GB"]).default("IN"),
  eventType: z.string().trim().max(100).optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  estimatedRegistrations: z.coerce.number().int().positive().max(1_000_000).optional(),
  requirements: z.string().trim().max(1500).optional(),
  expectedBudgetInr: z.coerce.number().int().nonnegative().max(1_000_000_000).optional(),
  sourcePage: z.string().trim().max(160).optional(),
  utmSource: z.string().trim().max(100).optional(),
  utmMedium: z.string().trim().max(100).optional(),
  utmCampaign: z.string().trim().max(100).optional(),
  consentToContact: z.literal(true),
  marketingOptIn: z.boolean().default(false),
  website: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Check the required fields and consent." }, { status: 400 });
  const lead = parsed.data;
  if (lead.website) return NextResponse.json({ ok: true });

  const db = adminClient();
  const email = lead.email.toLowerCase();
  const { count, error: lookupError } = await db.from("sales_leads")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());
  if (lookupError) return NextResponse.json({ error: "Could not save your request." }, { status: 503 });
  if (count && count > 0) return NextResponse.json({ ok: true });

  const { error } = await db.from("sales_leads").insert({
    organisation_name: lead.organisationName,
    contact_name: lead.contactName,
    email,
    phone: lead.phone || null,
    market: lead.market,
    event_type: lead.eventType || null,
    event_date: lead.eventDate || null,
    estimated_registrations: lead.estimatedRegistrations || null,
    requirements: lead.requirements || null,
    expected_budget_inr: lead.expectedBudgetInr ?? null,
    source_page: lead.sourcePage || null,
    utm_source: lead.utmSource || null,
    utm_medium: lead.utmMedium || null,
    utm_campaign: lead.utmCampaign || null,
    consent_to_contact: true,
    marketing_opt_in: lead.marketingOptIn,
    next_action: "Review requirements and offer a demo slot",
  });
  if (error) return NextResponse.json({ error: "Could not save your request." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
