import { NextRequest, NextResponse } from "next/server";
import { submitApplication } from "@/app/actions/attendees";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { eventId, ticketTypeId, name, email, phone, pass_type } = body;

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: eventId, name, email" },
        { status: 400 }
      );
    }

    const result = await submitApplication(
      eventId,
      {
        name,
        email,
        phone: phone || undefined,
        pass_type: pass_type || "participant",
      },
      undefined,
      ticketTypeId || null
    );

    if (result?.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error.includes("capacity") || result.error.includes("limit") ? 429 : 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        passToken: result?.passToken,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
