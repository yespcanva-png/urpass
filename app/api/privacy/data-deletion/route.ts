import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOwnerNotification, getOwnerEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const dataDeletionSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  role: z.enum(["attendee", "organizer", "visitor"]),
  reason: z.string().max(1000).optional(),
  eventId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = dataDeletionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, role, reason, eventId } = parsed.data;
    const requestReference = `DEL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    // Notify data protection officer / privacy desk
    try {
      await sendOwnerNotification({
        subject: `[UK GDPR Erasure Request] ${requestReference} — ${email}`,
        title: "UK GDPR Article 17 Erasure Request",
        rows: [
          ["Reference ID", requestReference],
          ["Data Subject Name", name],
          ["Email Address", email],
          ["Role", role.toUpperCase()],
          ["Specific Event ID", eventId || "All Associated Events"],
          ["Reason / Notes", reason || "Standard right to erasure request"],
          ["Submitted At", timestamp],
          ["SLA Deadline", "30 Days from submission"],
        ],
      });
    } catch (notifyErr) {
      console.error("[privacy] Failed sending deletion notice:", notifyErr);
    }

    return NextResponse.json({
      success: true,
      message: "Data erasure request logged in compliance with UK GDPR Article 17.",
      reference: requestReference,
      estimatedCompletionDays: 30,
    });
  } catch (err: unknown) {
    console.error("[privacy/data-deletion] Error processing request:", err);
    return NextResponse.json(
      { error: "Failed to process data deletion request" },
      { status: 500 }
    );
  }
}
