import { NextRequest, NextResponse } from "next/server";
import { verifyOpsPinWithRateLimit } from "@/lib/ops/pin";
import { signOpsSessionToken, OPS_COOKIE_NAME } from "@/lib/ops/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const pin = body?.pin;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { error: "PIN is required." },
        { status: 400 }
      );
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = (forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "127.0.0.1").trim();
    const userAgent = req.headers.get("user-agent") || undefined;

    const verification = await verifyOpsPinWithRateLimit(pin, ip, userAgent);

    if (verification.rateLimited) {
      return NextResponse.json(
        { error: verification.error || "Too many failed attempts. Ops PIN verification is temporarily locked." },
        { status: 429 }
      );
    }

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || "Access Denied: Incorrect operational PIN." },
        { status: 401 }
      );
    }

    const token = signOpsSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Operational access authorized.",
    });

    response.cookies.set({
      name: OPS_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
