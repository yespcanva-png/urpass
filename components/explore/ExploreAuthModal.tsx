"use client";

import { useState, useEffect } from "react";
import {
  X,
  Ticket,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ExploreAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  returnUrl?: string;
  onSuccess?: () => void;
}

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

export default function ExploreAuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  returnUrl = "/explore",
  onSuccess,
}: ExploreAuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setNeedsConfirmation(false);
  }, [initialMode, isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    const target = returnUrl || "/explore";
    window.location.href = `/api/auth/google/redirect?next=${encodeURIComponent(target)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup" && !fullName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          if (error.message.toLowerCase().includes("invalid login credentials")) {
            setErrorMsg("Invalid email or password. Please check your credentials.");
          } else if (error.message.toLowerCase().includes("email not confirmed")) {
            setErrorMsg("Email not confirmed yet. Please verify your inbox.");
          } else {
            setErrorMsg(error.message);
          }
          setLoading(false);
          return;
        }

        onSuccess?.();
        onClose();
        window.location.reload();
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
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

        // If email confirmation is required by Supabase
        if (data.user && !data.session) {
          setNeedsConfirmation(true);
          setLoading(false);
          return;
        }

        onSuccess?.();
        onClose();
        window.location.reload();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication failed.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explore-auth-title"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          aria-label="Close auth dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-xs">
            <Ticket className="w-4 h-4 -rotate-12" />
          </div>
          <div>
            <h2
              id="explore-auth-title"
              className="text-base font-bold text-neutral-950 tracking-tight leading-tight"
            >
              UrPass Explore
            </h2>
            <p className="text-[11px] text-neutral-500">
              Discover, book, and access digital passes
            </p>
          </div>
        </div>

        {/* Tab Toggle: Sign In / Sign Up */}
        <div className="flex p-1 bg-neutral-100 rounded-2xl my-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === "signin"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Email confirmation notice */}
        {needsConfirmation ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Confirmation link sent!</span>
            </div>
            <p className="text-emerald-700 leading-relaxed">
              We&apos;ve sent a confirmation email to <strong>{email}</strong>.
              Click the link in the message to activate your Explore account.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* 1. Google OAuth Button */}
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
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                or with email
              </span>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-3.5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 2. Manual Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Your Name
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 bg-neutral-50/60 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

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
                    autoComplete="email"
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
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 bg-neutral-50/60 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full mt-2 py-3 rounded-2xl font-bold text-xs text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                }}
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {mode === "signin" ? "Sign In to Explore" : "Create Explore Account"}
                </span>
              </button>
            </form>

            {/* Footer toggle note */}
            <p className="mt-4 text-center text-[11px] text-neutral-500">
              {mode === "signin" ? (
                <>
                  New to UrPass Explore?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMsg(null);
                    }}
                    className="font-bold text-violet-700 hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg(null);
                    }}
                    className="font-bold text-violet-700 hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
