"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Ticket,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
        fill="#4285F4"
      />
      <path
        d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function ExploreSignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextTarget = searchParams.get("next") || "/explore";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    window.location.href = `/api/auth/google/redirect?next=${encodeURIComponent(nextTarget)}`;
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = email.trim();
    if (!trimmed || !password || !fullName.trim()) {
      setErrorMsg("Please fill in your name, email, and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: trimmed,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user && !data.session) {
        setNeedsConfirmation(true);
        setLoading(false);
        return;
      }

      window.location.href = nextTarget;
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Signup failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/60 via-white to-white flex flex-col items-center justify-center p-4">
      {/* Back button */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href={nextTarget}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Explore</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700">
          <Ticket className="w-4 h-4 -rotate-12" />
          <span>Explore Events</span>
        </div>
      </div>

      {/* Main Signup Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xl shadow-violet-950/5">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100/80 text-violet-800 text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3 h-3 text-violet-600" />
            <span>Attendee Account</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-950 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Book tickets in one click and keep all your event passes in one place.
          </p>
        </div>

        {needsConfirmation ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Check your email</span>
            </div>
            <p className="leading-relaxed">
              We&apos;ve sent a verification email to <strong>{email}</strong>.
              Confirm your email address to complete your registration.
            </p>
            <Link
              href={`/explore/login?next=${encodeURIComponent(nextTarget)}`}
              className="inline-block mt-2 font-bold text-emerald-800 underline"
            >
              Go to Sign In →
            </Link>
          </div>
        ) : (
          <>
            {/* 1. Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-neutral-200/90 bg-white hover:bg-neutral-50/80 active:scale-[0.98] transition-all text-xs font-bold text-neutral-800 shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
              ) : (
                <GoogleIcon />
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                or with email
              </span>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 2. Manual Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 bg-neutral-50/60 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 bg-neutral-50/60 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 bg-neutral-50/60 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full mt-2 py-3 rounded-2xl font-bold text-xs text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                }}
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Create Account</span>
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-neutral-500">
              Already have an account?{" "}
              <Link
                href={`/explore/login?next=${encodeURIComponent(nextTarget)}`}
                className="font-bold text-violet-700 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ExploreSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
        </div>
      }
    >
      <ExploreSignupContent />
    </Suspense>
  );
}
