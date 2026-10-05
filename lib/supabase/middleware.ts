import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const feedbackMatch = pathname.match(/^\/event\/([^/]+)\/feedback$/);
    if (feedbackMatch) {
      url.pathname = `/feedback/${feedbackMatch[1]}`;
      return NextResponse.redirect(url);
    }
    const destination = `${pathname}${url.search}`;
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", destination);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const nextParam = url.searchParams.get("next");
    if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
      url.pathname = nextParam;
      url.search = "";
      return NextResponse.redirect(url);
    }
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
