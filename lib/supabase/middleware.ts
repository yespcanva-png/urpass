import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

const PROTECTED = ["/dashboard", "/event", "/create-event", "/scan", "/billing", "/org"];
const AUTH_PAGES = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

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
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
