import { redirect } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "@/app/actions/org-members";

interface Props {
  params: Promise<{ orgSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function JoinPage({ params, searchParams }: Props) {
  const { orgSlug } = await params;
  const { token } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/org/${orgSlug}/join${token ? `?token=${token}` : ""}`);
  }

  // If user is ALREADY an active member of this organization, redirect straight to org dashboard
  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .eq("slug", orgSlug)
    .maybeSingle();

  if (org) {
    const { data: activeMembership } = await supabase
      .from("organization_members")
      .select("id, status")
      .eq("organization_id", org.id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (activeMembership) {
      redirect(`/org/${org.slug}`);
    }
  }

  if (!token) {
    return (
      <ErrorCard
        title="Missing Invite Token"
        message="Invalid invite link — no token was found in the link URL."
        orgSlug={orgSlug}
        orgName={org?.name}
        currentUserEmail={user.email}
      />
    );
  }

  const result = await acceptInvite(token);

  if ("error" in result) {
    if (result.error === "not_authenticated") {
      redirect(`/login?next=/org/${orgSlug}/join?token=${token}`);
    }
    return (
      <ErrorCard
        title="Invite error"
        message={result.error}
        orgSlug={orgSlug}
        orgName={org?.name}
        token={token}
        currentUserEmail={user.email}
      />
    );
  }

  redirect(`/org/${result.orgSlug}`);
}

function ErrorCard({
  title = "Invite error",
  message,
  orgSlug,
  orgName,
  token,
  currentUserEmail,
}: {
  title?: string;
  message: string;
  orgSlug?: string;
  orgName?: string;
  token?: string;
  currentUserEmail?: string | null;
}) {
  const isEmailMismatch = message.toLowerCase().includes("different email");
  const isExpiredOrInvalid = message.toLowerCase().includes("invalid or expired");

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-neutral-100">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <XCircle className="w-7 h-7 text-red-500" />
        </div>
        <h1 className="text-lg font-bold text-neutral-900 mb-2">{title}</h1>
        {orgName && (
          <p className="text-xs font-semibold text-violet-700 bg-violet-50 px-3 py-1 rounded-full inline-block mb-3 border border-violet-100">
            {orgName}
          </p>
        )}
        <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{message}</p>

        {isEmailMismatch && currentUserEmail && (
          <div className="mb-6 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs text-neutral-600 space-y-1">
            <p className="font-semibold text-neutral-900">Signed in as:</p>
            <p className="font-mono text-neutral-700 break-all">{currentUserEmail}</p>
            <p className="text-[11px] text-neutral-500 pt-1">
              Please switch to the email address that received the invitation to join.
            </p>
          </div>
        )}

        {isExpiredOrInvalid && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-left text-xs text-amber-900 space-y-1.5">
            <p className="font-semibold">Why am I seeing this?</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
              <li>You may have already accepted this invitation previously.</li>
              <li>The invite link may have expired (links expire after 7 days).</li>
              <li>The organization admin may have resent or refreshed the invite with a newer link.</li>
            </ul>
            <p className="text-[11px] text-amber-700 pt-1">
              Contact the organization owner or admin to resend an invite email or share a fresh join link.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {isEmailMismatch && (
            <Link
              href={`/login?next=/org/${orgSlug}/join${token ? `?token=${token}` : ""}`}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-xs"
              style={{ background: "#6D28D9" }}
            >
              Sign in with another account
            </Link>
          )}

          <Link
            href={orgSlug ? `/org/${orgSlug}` : "/dashboard"}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-xs"
            style={{ background: isEmailMismatch ? "#374151" : "#6D28D9" }}
          >
            {orgSlug ? "Check Organization Access" : "Go to dashboard"}
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center text-xs font-medium text-neutral-500 hover:text-neutral-900 py-1 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

