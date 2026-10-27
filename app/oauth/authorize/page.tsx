import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthorizeClientForm } from "./AuthorizeClientForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authorize Claude — UrPass AI Connector",
  robots: { index: false, follow: false },
};

export default async function OAuthAuthorizePage({
  searchParams,
}: {
  searchParams: Promise<{
    client_id?: string;
    redirect_uri?: string;
    scope?: string;
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const returnUrl = encodeURIComponent(`/api/oauth/authorize?${new URLSearchParams(params as Record<string, string>).toString()}`);
    redirect(`/login?returnTo=${returnUrl}`);
  }

  // Fetch organizations the user belongs to
  const { data: memberships } = await supabase
    .from("organization_members")
    .select("role, organization:organizations(id, name, slug)")
    .eq("user_id", user.id)
    .eq("status", "active");

  const organizations = (memberships || [])
    .map((m: any) => m.organization)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 selection:bg-brand-100">
      <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-3xl shadow-xl shadow-neutral-200/50 p-6 sm:p-8">
        <AuthorizeClientForm
          userEmail={user.email || ""}
          organizations={organizations}
          clientId={params.client_id || "claude"}
          redirectUri={params.redirect_uri || ""}
          scope={params.scope || ""}
          state={params.state || ""}
          codeChallenge={params.code_challenge}
          codeChallengeMethod={params.code_challenge_method}
        />
      </div>

      <p className="mt-6 text-xs text-neutral-400 text-center max-w-sm">
        UrPass uses RFC 6749 and PKCE. Your credentials are never shared with AI assistants. You can revoke access at any time in Settings.
      </p>
    </div>
  );
}
