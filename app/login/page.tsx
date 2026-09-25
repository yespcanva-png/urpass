"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Mail,
  Lock,
  Ticket,
  AlertCircle,
  ArrowLeft,
  Building2,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { lookupSSOByEmail } from "@/app/actions/sso";

const passwordSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const ssoSchema = z.object({
  email: z.string().email("Enter your corporate email address"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type SsoFormData = z.infer<typeof ssoSchema>;

const inputCls =
  "bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white transition-all w-full placeholder:text-neutral-400 pl-10";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authMode, setAuthMode] = useState<"standard" | "sso">("standard");
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [isEmergencyOwnerLogin, setIsEmergencyOwnerLogin] = useState(false);
  const [ssoSuccessMsg, setSsoSuccessMsg] = useState("");

  // Handle URL errors (e.g. from SSO callback redirects)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const msgParam = searchParams.get("msg");
    if (errorParam) {
      if (errorParam === "sso_not_active") {
        setServerError("Enterprise SSO is not yet active for this organization.");
      } else if (errorParam === "sso_jit_disabled") {
        setServerError("Auto-provisioning is disabled for this organization. Contact your IT administrator for an invite.");
      } else if (msgParam) {
        setServerError(decodeURIComponent(msgParam));
      } else {
        setServerError(`Authentication failed (${errorParam}). Please try again.`);
      }
    }
  }, [searchParams]);

  // Form for password login
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  // Form for Enterprise SSO
  const {
    register: registerSso,
    handleSubmit: handleSsoSubmit,
    formState: { errors: ssoErrors },
  } = useForm<SsoFormData>({ resolver: zodResolver(ssoSchema) });

  async function onPasswordSubmit(data: PasswordFormData) {
    setServerError("");

    // If not in emergency owner bypass mode, check if domain has enforced SSO
    if (!isEmergencyOwnerLogin) {
      try {
        const lookup = await lookupSSOByEmail(data.email);
        if (lookup.ssoAvailable && lookup.enforced) {
          setServerError(
            `Single Sign-On is enforced for @${data.email.split("@")[1]}. Please use 'Continue with Enterprise SSO' below.`
          );
          return;
        }
      } catch (err) {
        console.warn("[login] SSO pre-check error:", err);
      }
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function onSsoSubmit(data: SsoFormData) {
    setServerError("");
    setSsoSuccessMsg("");
    setSsoLoading(true);

    try {
      const lookup = await lookupSSOByEmail(data.email);
      if (!lookup.ssoAvailable || !lookup.loginUrl) {
        const domain = data.email.split("@")[1];
        setServerError(
          `Domain '@${domain}' is not configured for Enterprise SSO. Please sign in with Google or email, or contact your IT admin.`
        );
        setSsoLoading(false);
        return;
      }

      setSsoSuccessMsg(`Redirecting to ${lookup.orgName || "Enterprise"} Identity Provider (${lookup.protocol || "SAML"})...`);
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = lookup.loginUrl;
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Failed to initiate Enterprise SSO.");
      setSsoLoading(false);
    }
  }

  function handleGoogleLogin() {
    setGoogleLoading(true);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/api/auth/google/redirect";
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5"
      style={{
        background:
          "radial-gradient(ellipse 100% 50% at 50% -10%, #ede9fe 0%, #f5f3ff 40%, #ffffff 70%)",
      }}
    >
      {/* Top row: back + wordmark */}
      <div className="flex items-center justify-between w-full max-w-md mb-8 apply-in-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
        <div className="flex items-center gap-1.5">
          <Ticket className="w-4 h-4 text-brand" />
          <span className="text-sm font-bold tracking-widest uppercase text-neutral-900">URPASS</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Main Card */}
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-neutral-100 p-8 apply-in-2"
        style={{ boxShadow: "0 4px 32px 0 rgba(109,40,217,0.08)" }}
      >
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight">
            {authMode === "sso" ? "Enterprise SSO" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {authMode === "sso"
              ? "Sign in using your organization's SAML 2.0 or OIDC Identity Provider"
              : "Sign in to your organizer account"}
          </p>
        </div>

        {authMode === "standard" ? (
          <>
            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || isPasswordSubmitting}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-medium text-neutral-700 border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors disabled:opacity-60 mb-3"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? "Signing in…" : "Continue with Google"}
            </button>

            {/* Enterprise SSO Switch Button */}
            <button
              type="button"
              onClick={() => {
                setServerError("");
                setAuthMode("sso");
              }}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-semibold text-brand border border-brand/20 bg-brand-50/50 hover:bg-brand-50 transition-colors mb-5"
            >
              <Building2 className="w-4 h-4 text-brand" />
              Continue with Enterprise SSO
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-neutral-100" />
              <span className="text-xs text-neutral-300 font-medium">or email password</span>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>

            {/* Emergency Owner Bypass Indicator */}
            {isEmergencyOwnerLogin && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Emergency Owner Login active.</strong> Bypasses organization SSO enforcement in case of IdP misconfiguration or expired certificates.
                </div>
              </div>
            )}

            {/* Standard Password Form */}
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputCls}
                    {...registerPassword("email")}
                  />
                </div>
                {passwordErrors.email && (
                  <p className="text-xs text-red-500">{passwordErrors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-brand font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={inputCls}
                    {...registerPassword("password")}
                  />
                </div>
                {passwordErrors.password && (
                  <p className="text-xs text-red-500">{passwordErrors.password.message}</p>
                )}
              </div>

              {serverError && (
                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                  <div>
                    {serverError}
                    {!isEmergencyOwnerLogin && (
                      <button
                        type="button"
                        onClick={() => setIsEmergencyOwnerLogin(true)}
                        className="block mt-1 font-semibold text-brand underline"
                      >
                        Organization Owner? Use Emergency Login
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPasswordSubmitting || googleLoading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1 shadow-sm"
                style={{ background: "#6D28D9" }}
              >
                {isPasswordSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPasswordSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </>
        ) : (
          /* Enterprise SSO Mode */
          <div className="space-y-5">
            <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-brand" />
              </div>
              <p className="text-xs text-neutral-600 leading-snug">
                Enter your work or university email to be securely routed to your organization&apos;s identity provider.
              </p>
            </div>

            <form onSubmit={handleSsoSubmit(onSsoSubmit)} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Corporate / Student Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 pointer-events-none" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className={inputCls}
                    {...registerSso("email")}
                  />
                </div>
                {ssoErrors.email && (
                  <p className="text-xs text-red-500">{ssoErrors.email.message}</p>
                )}
              </div>

              {ssoSuccessMsg && (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  {ssoSuccessMsg}
                </div>
              )}

              {serverError && (
                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={ssoLoading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 shadow-sm"
                style={{ background: "#6D28D9" }}
              >
                {ssoLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {ssoLoading ? "Connecting to Identity Provider…" : "Continue with SSO"}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setServerError("");
                  setAuthMode("standard");
                }}
                className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors font-medium"
              >
                ← Back to standard login
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-neutral-500 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-neutral-900 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <p className="text-xs text-neutral-400 mt-6 apply-in-3">
        Enterprise SSO · SAML 2.0 &amp; OpenID Connect compliant
      </p>
    </div>
  );
}
