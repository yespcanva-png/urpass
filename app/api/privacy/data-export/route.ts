import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/**
 * UK GDPR Article 15 (Right of Access / Subject Access Request) and
 * Article 20 (Right to Data Portability) Export Endpoint.
 *
 * Provides a structured, commonly used, and machine-readable JSON export
 * of all personal data held about the authenticated user.
 */
export async function GET(req: Request) {
  return handleExport(req);
}

export async function POST(req: Request) {
  return handleExport(req);
}

async function handleExport(req: Request) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const admin = createAdminClient(getSupabaseUrl(), key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let targetEmail: string | null = user?.email || null;
    let targetUserId: string | null = user?.id || null;

    // Check for authorized admin export with header
    const authHeader = req.headers.get("authorization") || "";
    const adminSecret = process.env.CRON_SECRET || process.env.ADMIN_API_KEY || key;
    const isAuthorizedAdmin = authHeader === `Bearer ${adminSecret}` || authHeader === `Bearer ${key}`;

    if (!user && isAuthorizedAdmin) {
      const url = new URL(req.url);
      const emailParam = url.searchParams.get("email");
      if (emailParam) {
        targetEmail = emailParam.toLowerCase();
      }
    }

    if (!targetEmail) {
      return NextResponse.json(
        { error: "Authentication required to export personal data under UK GDPR Art. 15/20." },
        { status: 401 }
      );
    }

    // Parallel extraction of all user records across the platform
    const [
      profileRes,
      attendeesRes,
      ordersRes,
      invoicesRes,
      subscriptionsRes,
      eventsRes,
    ] = await Promise.all([
      targetUserId
        ? admin.from("profiles").select("*").eq("user_id", targetUserId).maybeSingle()
        : admin.from("profiles").select("*").ilike("email", targetEmail).maybeSingle(),
      admin.from("attendees").select("*, passes(*)").ilike("email", targetEmail),
      admin.from("ticket_orders").select("*").ilike("buyer_email", targetEmail),
      targetUserId
        ? admin.from("invoices").select("*").or(`user_id.eq.${targetUserId},customer_email.ilike.${targetEmail}`)
        : admin.from("invoices").select("*").ilike("customer_email", targetEmail),
      targetUserId
        ? admin.from("subscriptions").select("*, plans(*)").eq("user_id", targetUserId).maybeSingle()
        : Promise.resolve({ data: null }),
      targetUserId
        ? admin.from("events").select("id, name, event_date, venue, country_code, currency, timezone, created_at").eq("organizer_id", targetUserId)
        : Promise.resolve({ data: [] }),
    ]);

    const trafficIds = [...new Set([
      profileRes.data?.first_traffic_visitor_id,
      profileRes.data?.last_traffic_visitor_id,
    ].filter((value): value is string => typeof value === "string"))];
    const trafficRes = trafficIds.length
      ? await admin.from("traffic_visitors").select("*").in("id", trafficIds)
      : { data: [] };

    const exportPayload = {
      compliance: {
        regulation: "UK General Data Protection Regulation (UK GDPR)",
        rightsExercised: ["Article 15 - Right of access by the data subject", "Article 20 - Right to data portability"],
        controller: "UrPass Technologies",
        exportTimestamp: new Date().toISOString(),
        subjectEmail: targetEmail,
      },
      userProfile: profileRes.data || { email: targetEmail },
      trafficAttribution: trafficRes.data || [],
      organizedEvents: eventsRes.data || [],
      attendeeRegistrations: (attendeesRes.data || []).map((att: any) => ({
        id: att.id,
        eventId: att.event_id,
        name: att.name,
        email: att.email,
        phone: att.phone,
        passType: att.pass_type,
        applicationStatus: att.application_status,
        passStatus: att.pass_status,
        customResponses: att.custom_responses,
        createdAt: att.created_at,
        passes: att.passes || [],
      })),
      ticketOrders: (ordersRes.data || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.razorpay_order_id || o.id,
        eventId: o.event_id,
        amount: o.amount,
        currency: o.currency || "INR",
        status: o.status,
        createdAt: o.created_at,
      })),
      invoicesAndReceipts: (invoicesRes.data || []).map((inv: any) => ({
        invoiceNumber: inv.invoice_number,
        invoiceDate: inv.invoice_date,
        totalAmount: inv.total_amount,
        currency: inv.currency,
        paymentStatus: inv.payment_status,
        pdfUrl: inv.pdf_url,
      })),
      subscription: subscriptionsRes.data || null,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="urpass-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[privacy] Data export error:", msg);
    return NextResponse.json({ error: "Failed to assemble personal data export" }, { status: 500 });
  }
}

