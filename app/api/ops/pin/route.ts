import { NextRequest, NextResponse } from "next/server";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { updateOpsPinInDb } from "@/lib/ops/pin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authenticated = await isOpsAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const newPin = body?.newPin;

    if (!newPin || typeof newPin !== "string") {
      return NextResponse.json(
        { error: "New PIN string is required." },
        { status: 400 }
      );
    }

    const result = await updateOpsPinInDb(newPin);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update PIN in database." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ops PIN updated successfully in the database.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
