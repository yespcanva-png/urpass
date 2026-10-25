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
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ExploreAuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  targetEventSlug?: string | null;
  targetEventName?: string | null;
  actionType?: "get_tickets" | "apply";
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

export default function ExploreAuthPopup({
  isOpen,
  onClose,
  targetEventSlug,
  targetEventName,
  actionType = "get_tickets",
  onSuccess,
}: ExploreAuthPopupProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const destinationUrl = targetEventSlug
    ? `/events/${encodeURIComponent(targetEventSlug)}?ref=explore`
    : "/explore";

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep("email");
      setPassword("");
      setFullName("");
      setErrorMsg(null);
      setIsNewUser(false);
    }
  }, [isOpen]);

  // Handle Escape key
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
    window.location.href = `/api/auth/google/redirect?next=${encodeURIComponent(
      destinationUrl
    )}`;
  };

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (step === "email") {
      // Advance to password authentication step
      setStep("password");
      return;
    }

    // Step === "password": authenticate with Supabase
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      if (!isNewUser) {
        // Attempt Sign In first
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          if (
            signInError.message.toLowerCase().includes("invalid login credentials")
          ) {
            // Might be a new user needing account creation
            setIsNewUser(true);
            setErrorMsg(
              "No existing password match. Create a password or continue to sign up."
            );
            setLoading(false);
            return;
          }
          setErrorMsg(signInError.message);
          setLoading(false);
          return;
        }

        // Successfully signed in: forward to destination event without losing progress
        onSuccess?.();
        onClose();
        window.location.href = destinationUrl;
      } else {
        // Create Attendee Account (standard Supabase attendee, no organizer roles)
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim() || trimmedEmail.split("@")[0],
            },
          },
        });

        if (signUpError) {
          setErrorMsg(signUpError.message);
          setLoading(false);
          return;
        }

        onSuccess?.();
        onClose();
        window.location.href = destinationUrl;
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Authentication error. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explore-auth-heading"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Mobile Bottom Sheet Card */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100/80 z-10 animate-in zoom-in-95 max-sm:slide-in-from-bottom duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          aria-label="Close authentication popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-xs">
            <Ticket className="w-3.5 h-3.5 -rotate-12" />
          </div>
          <span className="text-xs font-bold text-neutral-900 tracking-tight">
            UrPass Explore
          </span>
        </div>

        {/* Action Context Banner if triggered by Get Tickets / Apply */}
        {targetEventName && (
          <div className="mb-4 p-3 rounded-2xl bg-violet-50/80 border border-violet-100 text-xs text-violet-900 flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="font-semibold text-violet-600 uppercase text-[10px] tracking-wider block">
                {actionType === "apply" ? "Apply for Event" : "Get Tickets"}
              </span>
              <span className="font-bold truncate block">{targetEventName}</span>
            </div>
            <Ticket className="w-4 h-4 text-violet-500 shrink-0" />
          </div>
        )}

        {/* Headline */}
        <div className="mb-6">
          <h2
            id="explore-auth-heading"
            className="text-2xl font-black text-neutral-950 tracking-tight leading-tight"
          >
            Get started
          </h2>
          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
            Sign in or create an account to continue.
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={handleEmailContinue} className="space-y-3.5">
          {step === "email" ? (
            <div>
              <label
                htmlFor="explore-auth-email"
                className="block text-[11px] font-bold text-neutral-600 mb-1"
              >
                Email address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="explore-auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200/90 text-sm font-medium text-neutral-900 bg-neutral-50/60 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-neutral-400"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-600 truncate">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setErrorMsg(null);
                  }}
                  className="text-violet-600 font-bold hover:underline cursor-pointer text-[11px]"
                >
                  Change
                </button>
              </div>

              {isNewUser && (
                <div>
                  <label
                    htmlFor="explore-auth-name"
                    className="block text-[11px] font-bold text-neutral-600 mb-1"
                  >
                    Your name
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                    <input
                      id="explore-auth-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200/90 text-sm font-medium text-neutral-900 bg-neutral-50/60 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="explore-auth-password"
                  className="block text-[11px] font-bold text-neutral-600 mb-1"
                >
                  {isNewUser ? "Create password" : "Password"}
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="explore-auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={isNewUser ? "new-password" : "current-password"}
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200/90 text-sm font-medium text-neutral-900 bg-neutral-50/60 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            or
          </span>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-neutral-200/90 bg-white hover:bg-neutral-50/90 active:scale-[0.98] transition-all text-xs sm:text-sm font-bold text-neutral-800 shadow-2xs cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
          ) : (
            <GoogleIcon />
          )}
          <span>Continue with Google</span>
        </button>

        {/* Legal Disclaimer */}
        <p className="mt-5 text-center text-[11px] text-neutral-400 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-neutral-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/terms#privacy" className="underline hover:text-neutral-600">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
