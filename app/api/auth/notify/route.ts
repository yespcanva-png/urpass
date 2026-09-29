import { NextRequest, NextResponse } from "next/server";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || (body.type !== "signup" && body.type !== "login")) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const provider =
      body.provider === "google" || body.provider === "sso" || body.provider === "magiclink"
        ? body.provider
        : "email";
    const name =
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : typeof body.name === "string"
        ? body.name
        : null;

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const userAgent = req.headers.get("user-agent") || null;

    if (body.type === "signup") {
      await Promise.allSettled([
        notifyOwnerNewUser({
          name,
          email: user.email,
          provider: provider === "google" ? "google" : "email",
          userId: user.id,
        }),
        sendUserWelcomeEmail({
          to: user.email,
          name,
        }),
      ]);
    } else {
      // Login notification
      await notifyOwnerUserLogin({
        name,
        email: user.email,
        provider,
        userId: user.id,
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
