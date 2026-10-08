import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { clearAuthCookies, isRefreshTokenMissingError } from "@/lib/supabase/auth-cookies";
import { logAuth, logAuthWarn } from "@/lib/auth/logger";

const PROTECTED = ["/dashboard", "/event", "/create-event", "/scan", "/billing", "/org"];
const AUTH_PAGES = ["/login", "/signup"];

function matchesPathSegment(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function isProtectedPath(pathname: string) {
  return PROTECTED.some((p) => matchesPathSegment(pathname, p));
}

export function isAuthPagePath(pathname: string) {
  return AUTH_PAGES.some((p) => matchesPathSegment(pathname, p));
}

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const isProtected = isProtectedPath(pathname);
  const isAuthPage = isAuthPagePath(pathname);

  // Only touch Supabase for routes that need auth
  if (!isProtected && !isAuthPage) {
    return NextResponse.next({ request });
  }

  const { url: supabaseUrl, anonKey: supabaseKey } = getSupabaseConfig();

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  let authError: unknown = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    } else if (error) {
      authError = error;
    }
  } catch (error) {
    // Gracefully handle stale or revoked refresh tokens (e.g. refresh_token_not_found)
    authError = error;
    user = null;
  }

  const hasInvalidRefreshToken = isRefreshTokenMissingError(authError);

  if (isProtected && !user) {
    logAuthWarn("middleware", "Unauthenticated request on protected route -> Redirecting to login", {
      path: pathname,
      invalidRefreshToken: hasInvalidRefreshToken ? true : undefined,
    });
    const feedbackMatch = pathname.match(/^\/event\/([^/]+)\/feedback$/);
    if (feedbackMatch) {
      url.pathname = `/feedback/${feedbackMatch[1]}`;
      const res = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        res.cookies.set(cookie);
      });
      if (hasInvalidRefreshToken) {
        clearAuthCookies(res, request);
      }
      return res;
    }
    const destination = `${pathname}${url.search}`;
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", destination);
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      res.cookies.set(cookie);
    });
    if (hasInvalidRefreshToken) {
      clearAuthCookies(res, request);
    }
    return res;
  }

  if (isAuthPage && user) {
    logAuth("middleware", "Authenticated user accessed login/signup -> Redirecting to dashboard", {
      userId: user.id,
      email: user.email,
    });
    url.pathname = "/dashboard";
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      res.cookies.set(cookie);
    });
    return res;
  }

  if (isAuthPage && hasInvalidRefreshToken) {
    clearAuthCookies(supabaseResponse, request);
  }

  return supabaseResponse;
}
