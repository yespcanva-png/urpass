import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendNewsletterWelcomeEmail, notifyOwnerNewsletterSubscriber } from "@/lib/email";
import { recordLiveOpsEvent } from "@/lib/ops/events";

export const dynamic = "force-dynamic";

const subscribeSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address."),
  name: z.string().trim().max(100).optional().nullable(),
});

function getAdminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = subscribeSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email address." },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const subscriberName = name || null;

    // Database persistence attempt (graceful if table does not exist or schema differs)
    try {
      const admin = getAdminClient();
      await admin.from("newsletter_subscribers").upsert(
        {
          email: normalizedEmail,
          name: subscriberName,
          subscribed_at: new Date().toISOString(),
          is_active: true,
          source: "website_footer",
        },
        { onConflict: "email" }
      );
    } catch (dbErr) {
      console.warn("[newsletter] Note: DB persistence skipped or table pending migration:", dbErr);
    }

    // Record in Live Ops buffer
    try {
      recordLiveOpsEvent({
        level: "INFO",
        category: "EMAIL",
        message: `New newsletter subscription: ${normalizedEmail}${subscriberName ? ` (${subscriberName})` : ""}`,
        details: { email: normalizedEmail, name: subscriberName },
      });
    } catch {
      // Non-blocking
    }

    // Dispatch Welcome email to subscriber & alert to UrPass owner
    await Promise.allSettled([
      sendNewsletterWelcomeEmail({
        to: normalizedEmail,
        name: subscriberName,
      }),
      notifyOwnerNewsletterSubscriber({
        email: normalizedEmail,
        name: subscriberName,
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "You're subscribed! Check your inbox for your confirmation.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error";
    console.error("[newsletter/subscribe] Error:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
