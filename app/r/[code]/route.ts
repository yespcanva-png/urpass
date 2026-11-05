import { NextRequest, NextResponse } from "next/server";
import { recordReferralClick, validateReferralCode } from "@/lib/referrals/service";
import { REFERRAL_COMMERCIAL_RULES } from "@/lib/referrals/types";
import { getPublicAppOrigin } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const rawCode = (code || "").trim().toUpperCase();

  // 1. Centralized validated public origin (strictly guarantees no localhost redirect in production)
  const publicOrigin = getPublicAppOrigin(req);

  // 2. Extract UTMs and visitor telemetry
  const searchParams = req.nextUrl.searchParams;
  const utmSource = searchParams.get("utm_source") || undefined;
  const utmMedium = searchParams.get("utm_medium") || undefined;
  const utmCampaign = searchParams.get("utm_campaign") || undefined;
  const visitorId = req.cookies.get("urpass_anon_session")?.value;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") || undefined;

  // 3. Server-side referral code validation
  const validation = await validateReferralCode(rawCode);

  // 4. Handle invalid, missing, or disabled codes gracefully without redirect loops
  if (!validation.valid || !validation.codeRecord) {
    const fallbackUrl = new URL("/signup", publicOrigin);
    fallbackUrl.searchParams.set("ref_error", validation.reason || "invalid_code");

    // Preserve non-ref query parameters (e.g. UTMs)
    for (const [key, value] of searchParams.entries()) {
      if (key !== "ref" && key !== "ref_error") {
        fallbackUrl.searchParams.set(key, value);
      }
    }

    const errorResponse = NextResponse.redirect(fallbackUrl, 307);
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    return errorResponse;
  }

  const validCode = validation.codeRecord.code;

  // 5. Record click event non-blocking for genuine analytics
  try {
    await recordReferralClick(validCode, {
      visitorId,
      ip,
      userAgent,
      utmSource,
      utmMedium,
      utmCampaign,
    });
  } catch (err) {
    console.error("[route /r/[code]] click record error:", err);
  }

  // 6. Construct canonical signup target URL on validated public origin
  const signupUrl = new URL("/signup", publicOrigin);
  signupUrl.searchParams.set("ref", validCode);

  for (const [key, value] of searchParams.entries()) {
    if (key !== "ref" && key !== "ref_error") {
      signupUrl.searchParams.set(key, value);
    }
  }

  const response = NextResponse.redirect(signupUrl, 307);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  // 7. Set 30-day attribution cookie on visitor's device
  response.cookies.set({
    name: REFERRAL_COMMERCIAL_RULES.COOKIE_NAME,
    value: validCode,
    maxAge: REFERRAL_COMMERCIAL_RULES.COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" || publicOrigin.startsWith("https://"),
    httpOnly: false,
  });

  return response;
}

