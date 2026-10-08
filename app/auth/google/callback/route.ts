import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";
import { notifyOwnerNewUser, notifyOwnerUserLogin, sendUserWelcomeEmail } from "@/lib/email";
import {
  clearAuthCookies,
  GOOGLE_OAUTH_NEXT_COOKIE,
  GOOGLE_OAUTH_NONCE_COOKIE,
  isRefreshTokenMissingError,
} from "@/lib/supabase/auth-cookies";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export function clearRecentExchangedCodes() {
  // Kept as a harmless test helper for older test imports. Supabase now owns code replay protection.
}

type StoredOAuthState = {
  next?: string;
  nonce?: string;
  redirect_uri?: string;
  ts?: number;
};

function getAppOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host") || "";
  const forwardedProto = req.headers.get("x-forwarded-proto");

  if (host) {
    const isLocal =
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.startsWith("192.168.") ||
      host.startsWith("10.");
    const proto = forwardedProto || (isLocal ? "http" : "https");
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  if (req.nextUrl?.origin && req.nextUrl.origin !== "null") {
    return req.nextUrl.origin.replace(/\/$/, "");
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  return "https://urpass.space";
}

function decodeStoredState(value?: string): StoredOAuthState | null {
  if (!value) return null;

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === "object") {
      return parsed as StoredOAuthState;
    }
  } catch {
    return null;
  }

  return null;
}

function resolveStoredDestination(req: NextRequest) {
  const stored = decodeStoredState(req.cookies.get(GOOGLE_OAUTH_NEXT_COOKIE)?.value);
  const nonceCookie = req.cookies.get(GOOGLE_OAUTH_NONCE_COOKIE)?.value;
  const now = Date.now();
  const isFresh = typeof stored?.ts === "number" && now - stored.ts <= 10 * 60 * 1000;
  const nonceMatches = !!stored?.nonce && stored.nonce === nonceCookie;

  if (!stored || !isFresh || !nonceMatches) {
    return { destination: "/dashboard", valid: false };
  }

  const destination = resolvePostAuthRedirect(
    { get: (key: string) => (key === "next" ? stored.next || null : null) },
    null
  );

  return { destination, valid: true };
}

function clearOAuthState(response: NextResponse, req: NextRequest) {
  const secure = req.nextUrl.protocol === "https:";
  for (const name of [GOOGLE_OAUTH_NEXT_COOKIE, GOOGLE_OAUTH_NONCE_COOKIE]) {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure,
      sameSite: "lax",
    });
  }
}

function redirectWithNoStore(url: string | URL, req: NextRequest) {
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  clearOAuthState(response, req);
  return response;
}

async function notifyLogin(user: User) {
  const createdAt = new Date(user.created_at).getTime();
  const isNew = Date.now() - createdAt < 15 * 60 * 1000;
  const provider = (user.app_metadata?.provider as "email" | "google") || "google";

  if (isNew) {
    await Promise.allSettled([
      notifyOwnerNewUser({
        name: user.user_metadata?.full_name || null,
        email: user.email || null,
        provider,
        userId: user.id,
      }),
      user.email
        ? sendUserWelcomeEmail({
            to: user.email,
            name: user.user_metadata?.full_name || null,
          })
        : Promise.resolve(),
    ]);
    return;
  }

  await notifyOwnerUserLogin({
    name: user.user_metadata?.full_name || null,
    email: user.email || null,
    provider,
    userId: user.id,
  });
}

export async function GET(req: NextRequest) {
  const origin = getAppOrigin(req);
  const code = req.nextUrl.searchParams.get("code");
  const oauthError = req.nextUrl.searchParams.get("error");
  const { destination, valid } = resolveStoredDestination(req);

  if (oauthError) {
    console.warn("[google-callback] Provider returned error:", oauthError);
    return redirectWithNoStore(`${origin}/login?error=${encodeURIComponent(oauthError)}`, req);
  }

  if (!valid) {
    const response = redirectWithNoStore(`${origin}/login?error=oauth_state_invalid`, req);
    clearAuthCookies(response, req);
    return response;
  }

  if (!code) {
    return redirectWithNoStore(`${origin}/login?error=oauth_callback_failed`, req);
  }

  const cookieStore = await cookies();
  const response = redirectWithNoStore(`${origin}${destination}`, req);

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Route handlers can set cookies; keep this tolerant for tests and future reuse.
          }
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.warn("[google-callback] Supabase OAuth exchange error:", {
      code: error.code,
      message: error.message,
      status: error.status,
    });

    if (isRefreshTokenMissingError(error)) {
      const redirect = redirectWithNoStore(`${origin}/login?error=refresh_token_not_found`, req);
      clearAuthCookies(redirect, req);
      return redirect;
    }
    return redirectWithNoStore(`${origin}/login?error=oauth_session_failed`, req);
  }

  if (data.user) {
    try {
      await notifyLogin(data.user);
    } catch (error) {
      console.error("[google-callback] login notification error:", error);
    }
  }

  return response;
}
