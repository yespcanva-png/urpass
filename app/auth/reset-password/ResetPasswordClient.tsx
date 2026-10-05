"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Ticket,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAuthResetRedirectUrl } from "@/lib/auth-redirect";

const inputCls =
  "bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white transition-all w-full placeholder:text-neutral-400";

const BG = {
  background:
    "radial-gradient(ellipse 100% 50% at 50% -10%, #ede9fe 0%, #f5f3ff 40%, #ffffff 70%)",
};

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [initError, setInitError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Quick resend state
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function initAuth() {
      // 1. Check for error in query params or hash fragment
      const queryError = searchParams.get("error_description") || searchParams.get("error");
      if (queryError) {
        if (isMounted) {
          setInitError(decodeURIComponent(queryError.replace(/\+/g, " ")));
          setCheckingSession(false);
        }
        return;
      }

      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const hashError = params.get("error_description") || params.get("error");
        if (hashError) {
          if (isMounted) {
            setInitError(decodeURIComponent(hashError.replace(/\+/g, " ")));
            setCheckingSession(false);
          }
          return;
        }

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error: sessionErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!sessionErr && isMounted) {
            setSessionReady(true);
            setCheckingSession(false);
            return;
          }
        }
      }

      // 2. Check for PKCE authorization code
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
        if (!exchangeErr) {
          if (isMounted) {
            setSessionReady(true);
            setCheckingSession(false);
          }
          return;
        }
      }

      // 3. Check existing active session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && isMounted) {
        setSessionReady(true);
        setCheckingSession(false);
        return;
      }

      // 4. If neither code, hash, nor session is valid and we had a code/error attempt
      if (code && isMounted) {
        setInitError("This reset link has expired or is invalid. Please request a new one below.");
      } else if (isMounted) {
        // Allow user to enter new password if browser holds recovery state or prompt
        setSessionReady(true);
      }
      if (isMounted) setCheckingSession(false);
    }

    // 5. Auth State Change listener for PASSWORD_RECOVERY events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "PASSWORD_RECOVERY" ||
        event === "SIGNED_IN" ||
        (session && event === "INITIAL_SESSION")
      ) {
        if (isMounted) {
          setSessionReady(true);
          setInitError("");
          setCheckingSession(false);
        }
      }
    });

    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    }
  }

  async function handleQuickResend(e: React.FormEvent) {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    setResendLoading(true);
    setResendError("");
    setResendSuccess(false);

    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : null;
      const redirectTo = getAuthResetRedirectUrl(origin);
      const { error: err } = await supabase.auth.resetPasswordForEmail(resendEmail.trim(), {
        redirectTo,
      });

      if (err) {
        setResendError(err.message);
      } else {
        setResendSuccess(true);
      }
    } catch {
      setResendError("Failed to send reset link. Please try again.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5" style={BG}>
      {/* Top row */}
      <div className="flex items-center justify-between w-full max-w-md mb-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
        <div className="flex items-center gap-1.5">
          <Ticket className="w-4 h-4 text-brand" />
          <span className="text-sm font-bold tracking-widest uppercase text-neutral-900">URPASS</span>
        </div>
        <div className="w-20" />
      </div>

      {/* Checking session loader */}
      {checkingSession && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />
          <p className="text-sm text-neutral-500">Verifying your security credentials…</p>
        </div>
      )}

      {/* Invalid / expired link */}
      {!checkingSession && initError && (
        <div
          className="w-full max-w-md bg-white rounded-3xl border border-neutral-100 p-8 text-center space-y-5"
          style={{ boxShadow: "0 4px 32px 0 rgba(109,40,217,0.08)" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 mb-1">Reset link expired</h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm mx-auto">
              Password reset links can only be used once and expire for security. Enter your email to receive a fresh link instantly.
            </p>
          </div>

          {resendSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>New reset link sent!</span>
              </div>
              <p className="text-neutral-600">
                We sent a fresh reset link to <strong>{resendEmail}</strong>. Please check your inbox and click the newest link.
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuickResend} className="space-y-3 text-left pt-2">
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              {resendError && (
                <p className="text-xs text-red-500">{resendError}</p>
              )}

              <button
                type="submit"
                disabled={resendLoading || !resendEmail.trim()}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-brand hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {resendLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send Fresh Reset Link</span>
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-neutral-100">
            <Link
              href="/login"
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              ← Back to Sign in
            </Link>
          </div>
        </div>
      )}

      {/* Success State */}
      {!checkingSession && success && (
        <div
          className="w-full max-w-md bg-white rounded-3xl border border-neutral-100 p-8 text-center"
          style={{ boxShadow: "0 4px 32px 0 rgba(109,40,217,0.08)" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-2">Password updated</h2>
          <p className="text-sm text-neutral-500">Taking you to your dashboard…</p>
        </div>
      )}

      {/* New password form */}
      {!checkingSession && !initError && !success && sessionReady && (
        <div
          className="w-full max-w-md bg-white rounded-3xl border border-neutral-100 p-8"
          style={{ boxShadow: "0 4px 32px 0 rgba(109,40,217,0.08)" }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`${inputCls} pl-10 pr-10`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`${inputCls} pl-10`}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1 cursor-pointer"
              style={{ background: "#6D28D9" }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
