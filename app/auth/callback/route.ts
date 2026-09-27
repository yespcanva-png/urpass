import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolvePostAuthRedirect } from "@/lib/auth-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const target = resolvePostAuthRedirect(searchParams, null);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
