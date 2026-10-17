import { NextRequest, NextResponse } from "next/server";
import { generateAiTicketMagic } from "@/lib/ai/ticket-magic";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, vibe, eventName, venue, eventDate, categories } = body || {};

    const magicResult = await generateAiTicketMagic({
      prompt: typeof prompt === "string" ? prompt.trim() : "",
      vibe: typeof vibe === "string" ? vibe.trim() : "",
      eventName: typeof eventName === "string" ? eventName.trim() : "",
      venue: typeof venue === "string" ? venue.trim() : "",
      eventDate: typeof eventDate === "string" ? eventDate.trim() : "",
      categories: Array.isArray(categories) ? categories : [],
    });

    return NextResponse.json({
      ok: true,
      result: magicResult,
    });
  } catch (error) {
    console.error("[api/studio/ai-magic] Error generating ticket magic:", error);
    return NextResponse.json(
      { error: "Failed to generate AI ticket design. Please try again." },
      { status: 500 }
    );
  }
}
