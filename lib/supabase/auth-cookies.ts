import type { NextRequest, NextResponse } from "next/server";

export const GOOGLE_OAUTH_NEXT_COOKIE = "urpass_google_oauth_next";
export const GOOGLE_OAUTH_NONCE_COOKIE = "oauth_state_nonce";

const SUPABASE_COOKIE_PREFIX = "sb-";
const OAUTH_COOKIE_NAMES = [GOOGLE_OAUTH_NEXT_COOKIE, GOOGLE_OAUTH_NONCE_COOKIE];

type CookieTarget = {
  cookies: {
    set: NextResponse["cookies"]["set"];
  };
};

function expiredCookieOptions(secure: boolean) {
  return {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
  };
}

export function isRefreshTokenMissingError(error: unknown) {
  if (!error) return false;
  const code = typeof error === "object" && "code" in error ? String(error.code) : "";
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && "message" in error
        ? String(error.message)
        : String(error);

  return (
    code === "refresh_token_not_found" ||
    message.toLowerCase().includes("refresh token not found")
  );
}

export function clearAuthCookies(
  response: CookieTarget,
  request: Pick<NextRequest, "cookies" | "nextUrl">,
) {
  const isLocal =
    request.nextUrl.hostname.includes("localhost") ||
    request.nextUrl.hostname.includes("127.0.0.1") ||
    request.nextUrl.hostname.startsWith("192.168.") ||
    request.nextUrl.hostname.startsWith("10.");
  const secure = !isLocal || request.nextUrl.protocol === "https:" || process.env.NODE_ENV === "production";
  const cookieNames = new Set(
    request.cookies
      .getAll()
      .filter(({ name }) => name.startsWith(SUPABASE_COOKIE_PREFIX))
      .map(({ name }) => name),
  );

  OAUTH_COOKIE_NAMES.forEach((name) => cookieNames.add(name));

  for (const name of cookieNames) {
    response.cookies.set(name, "", expiredCookieOptions(secure));
  }
}
