import { NextRequest, NextResponse } from "next/server";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const userAgent = req.headers.get("user-agent") || null;

    if (body.type === "signup") {
      await Promise.allSettled([
        notifyOwnerNewUser({
          name: body.name || null,
          email: body.email,
          provider: body.provider || "email",
          userId: body.userId || null,
        }),
        sendUserWelcomeEmail({
          to: body.email,
          name: body.name || null,
        }),
      ]);
    } else {
      // Login notification
      await notifyOwnerUserLogin({
        name: body.name || null,
        email: body.email,
        provider: body.provider || "email",
        userId: body.userId || null,
        ipAddress,
        userAgent,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/auth/notify] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
