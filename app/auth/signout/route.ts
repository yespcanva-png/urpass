import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseUrl, getSupabaseAnonKey, getAppOrigin } from "@/lib/supabase/config";
import { clearAuthCookies } from "@/lib/supabase/auth-cookies";

export const dynamic = "force-dynamic";

async function handleSignOut(req: NextRequest) {
  const origin = getAppOrigin(req);
  const response = NextResponse.redirect(`${origin}/login`);

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    console.warn("[signout-route] signOut error:", err);
  }

  // Clear all cookies
  clearAuthCookies(response, req);

  // Set Cache-Control headers to prevent caching
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
  response.headers.set("Pragma", "no-cache");

  return response;
}

export async function POST(req: NextRequest) {
  return handleSignOut(req);
}

export async function GET(req: NextRequest) {
  return handleSignOut(req);
}
