import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { mcpIssuePass } from "@/lib/mcp/core";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const auth = await authenticateApiKey(req);
  if (!auth) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Provide a valid Bearer API key in the Authorization header (e.g. 'Bearer urp_live_...').",
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON", message: "Request body must be a valid JSON object." },
        { status: 400 }
      );
    }

    const { eventId, name, email, phone, passType } = body;

    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json(
        { error: "Validation Error", message: "Field 'eventId' is required (UUID format)." },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Validation Error", message: "Field 'name' is required." },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Validation Error", message: "Field 'email' must be a valid email address." },
        { status: 400 }
      );
    }

    const result = await mcpIssuePass(
      { userId: auth.userId },
      {
        eventId: eventId.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: typeof phone === "string" ? phone.trim() : undefined,
        passType: typeof passType === "string" ? passType.trim() : undefined,
      }
    );

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        passToken: result.passToken,
        passUrl: result.passUrl,
        qrCodeUrl: result.passUrl,
        attendeeId: result.attendeeId,
        passType: passType || "participant",
        status: "generated",
      },
      meta: {
        latencyMs,
        environment: auth.keyId ? "authenticated" : "unknown",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Pass Issuance Failed",
        message: err.message || "Failed to generate pass.",
      },
      { status: 500 }
    );
  }
}
