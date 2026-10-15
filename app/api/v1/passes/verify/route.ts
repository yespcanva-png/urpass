import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { mcpVerifyCheckin } from "@/lib/mcp/core";

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

    const { passToken, eventId, gateId } = body;

    if (!passToken || typeof passToken !== "string") {
      return NextResponse.json(
        { error: "Validation Error", message: "Field 'passToken' is required." },
        { status: 400 }
      );
    }
    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json(
        { error: "Validation Error", message: "Field 'eventId' is required (UUID format)." },
        { status: 400 }
      );
    }

    const result = await mcpVerifyCheckin(
      { userId: auth.userId },
      {
        passToken: passToken.trim(),
        eventId: eventId.trim(),
        gateId: typeof gateId === "string" ? gateId.trim() : undefined,
      }
    );

    const latencyMs = Date.now() - startTime;

    if (result.alreadyCheckedIn) {
      return NextResponse.json(
        {
          success: false,
          status: "DUPLICATE",
          message: "Access Denied: Pass has already been checked in.",
          attendee: result.attendee,
          passType: result.passType,
          latencyMs,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "VALID",
      message: result.message || "Access Granted",
      attendee: result.attendee,
      passType: result.passType,
      checkedInAt: result.checkedInAt || new Date().toISOString(),
      latencyMs,
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return NextResponse.json(
      {
        success: false,
        status: "INVALID",
        error: "Verification Failed",
        message: err.message || "Failed to verify pass.",
        latencyMs,
      },
      { status: 400 }
    );
  }
}
