import { NextRequest, NextResponse } from "next/server";
import { recordReferralClick } from "@/lib/referrals/service";
import { REFERRAL_COMMERCIAL_RULES } from "@/lib/referrals/types";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const rawCode = (code || "").trim().toUpperCase();

  const searchParams = req.nextUrl.searchParams;
  const utmSource = searchParams.get("utm_source") || undefined;
  const utmMedium = searchParams.get("utm_medium") || undefined;
  const utmCampaign = searchParams.get("utm_campaign") || undefined;
  const visitorId = req.cookies.get("urpass_anon_session")?.value;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") || undefined;

  // Record click event non-blocking
  try {
    if (rawCode) {
      await recordReferralClick(rawCode, {
        visitorId,
        ip,
        userAgent,
        utmSource,
        utmMedium,
        utmCampaign,
      });
    }
  } catch (err) {
    console.error("[route /r/[code]] click record error:", err);
  }

  // Construct target URL to /signup with ref query param
  const signupUrl = new URL("/signup", req.url);
  signupUrl.searchParams.set("ref", rawCode);

  for (const [key, value] of searchParams.entries()) {
    if (key !== "ref") {
      signupUrl.searchParams.set(key, value);
    }
  }

  const response = NextResponse.redirect(signupUrl, 307);

  // Set 30-day attribution cookie
  response.cookies.set({
    name: REFERRAL_COMMERCIAL_RULES.COOKIE_NAME,
    value: rawCode,
    maxAge: REFERRAL_COMMERCIAL_RULES.COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });

  return response;
}
