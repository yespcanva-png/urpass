import { NextRequest, NextResponse } from "next/server";
import { communicationService } from "@/lib/communications";

export const dynamic = "force-dynamic";

/**
 * Background worker cron route to process pending / retryable WhatsApp dispatches
 * with exponential backoff.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await communicationService.processWhatsAppOutboxRetries();
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[CRON /api/cron/whatsapp-outbox] Error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
