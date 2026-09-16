import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface GoogleTokenInfo {
  sub: string;
  email: string;
  email_verified: string;
  name: string;
  picture: string;
  aud: string;
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({}));

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  // Exchange authorization code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "postmessage",
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokenRes.ok || !tokens.id_token) {
    console.error("[google-auth] token exchange error:", tokens);
    return NextResponse.json({ error: "Failed to exchange Google code" }, { status: 401 });
  }

  // Verify the ID token via Google's tokeninfo endpoint
  const infoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
  );
  if (!infoRes.ok) {
    return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
  }

  const info: GoogleTokenInfo = await infoRes.json();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (clientId && info.aud !== clientId) {
    return NextResponse.json({ error: "Token audience mismatch" }, { status: 401 });
  }

  if (info.email_verified !== "true") {
    return NextResponse.json({ error: "Google email not verified" }, { status: 401 });
  }

  const admin = adminClient();

  const { data: profileRow } = await admin
    .from("profiles")
    .select("user_id")
    .eq("email", info.email)
    .maybeSingle();

  let userId: string;

  if (profileRow?.user_id) {
    userId = profileRow.user_id;
    await admin.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: info.name,
        avatar_url: info.picture,
        google_id: info.sub,
      },
    });
  } else {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: info.email,
      email_confirm: true,
      user_metadata: {
        full_name: info.name,
        avatar_url: info.picture,
        google_id: info.sub,
      },
    });
    if (createErr || !created?.user) {
      console.error("[google-auth] createUser error:", createErr);
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
    userId = created.user.id;
  }

  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: info.email,
  });

  if (linkErr || !linkData?.properties?.hashed_token) {
    console.error("[google-auth] generateLink error:", linkErr);
    return NextResponse.json({ error: "Failed to generate session" }, { status: 500 });
  }

  return NextResponse.json({
    token_hash: linkData.properties.hashed_token,
    userId,
  });
}
