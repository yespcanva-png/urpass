import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { sendOwnerNotification } from "@/lib/email";
import { executeDataErasure } from "@/lib/privacy/erasure";

export const dynamic = "force-dynamic";

const dataDeletionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  role: z.enum(["attendee", "organizer", "visitor"]),
  reason: z.string().max(1000).optional(),
  eventId: z.string().uuid().optional(),
  action: z.enum(["request", "execute"]).optional(),
  referenceId: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = dataDeletionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload", details: parsed.error.format() }, { status: 400 });
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    return NextResponse.json({ error: "Privacy request service unavailable" }, { status: 503 });
  }

  const admin = createAdminClient(getSupabaseUrl(), key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { name, email, role, reason, eventId, action, referenceId } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // 1. Check for Admin Authorized Execution
  const authHeader = req.headers.get("authorization") || "";
  const adminSecret = process.env.CRON_SECRET || process.env.ADMIN_API_KEY || key;
  const isAuthorizedAdmin = authHeader === `Bearer ${adminSecret}` || authHeader === `Bearer ${key}`;

  if (action === "execute" && isAuthorizedAdmin) {
    const scrubResult = await executeDataErasure({
      email: normalizedEmail,
      eventId: eventId || null,
      referenceId: referenceId || null,
    });

    return NextResponse.json({
      success: scrubResult.success,
      status: scrubResult.success ? "COMPLETED" : "FAILED",
      recordsScrubbed: scrubResult.recordsScrubbed,
      error: scrubResult.error,
    });
  }

  // 2. Check if request comes from an authenticated user whose verified session matches
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email && user.email.toLowerCase() === normalizedEmail) {
      // Authenticated self-erasure: execute immediately for attendee records
      const reference = referenceId || `DEL-${randomUUID()}`;
      await admin.from("privacy_erasure_requests").insert({
        reference_id: reference,
        email: normalizedEmail,
        role,
        event_id: eventId || null,
        status: "PROCESSING",
        notes: reason ? `Verified session. Name: ${name}; reason: ${reason}` : `Verified session. Name: ${name}`,
      });

      const scrubResult = await executeDataErasure({
        email: normalizedEmail,
        eventId: eventId || null,
        referenceId: reference,
      });

      return NextResponse.json({
        success: scrubResult.success,
        reference,
        status: "COMPLETED",
        recordsScrubbed: scrubResult.recordsScrubbed,
        message: "Your personal data has been erased in accordance with UK GDPR Article 17.",
      });
    }
  } catch {
    // Session check error, fall through to intake
  }

  // 3. Unauthenticated Intake: record request and require identity verification
  const reference = `DEL-${randomUUID()}`;
  const { error } = await admin.from("privacy_erasure_requests").insert({
    reference_id: reference,
    email: normalizedEmail,
    role,
    event_id: eventId || null,
    status: "PENDING",
    notes: reason ? `Name: ${name}; reason: ${reason}` : `Name: ${name}`,
  });

  if (error) {
    console.error("[privacy] Failed to record erasure request:", error);
    return NextResponse.json({ error: "Privacy request could not be recorded" }, { status: 503 });
  }

  await sendOwnerNotification({
    subject: `[Privacy request] ${reference}`,
    title: "Identity verification required before erasure",
    rows: [
      ["Reference", reference],
      ["Email", email],
      ["Role", role],
      ["Event", eventId || "All events"],
    ],
  }).catch((notifyError) => console.error("[privacy] Notification failed:", notifyError));

  return NextResponse.json(
    {
      success: true,
      reference,
      status: "PENDING",
      message:
        "Your request was recorded. We will verify your identity and review statutory retention requirements before taking action.",
    },
    { status: 202 }
  );
}
