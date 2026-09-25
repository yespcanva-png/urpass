import { NextRequest, NextResponse } from "next/server";
import { lookupSSOByEmail } from "@/app/actions/sso";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email query parameter is required" }, { status: 400 });
    }

    const result = await lookupSSOByEmail(email);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("[api/auth/sso/lookup] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
