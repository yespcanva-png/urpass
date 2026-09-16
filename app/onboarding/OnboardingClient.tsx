"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Ticket, Building2, ArrowRight, Loader2, Check,
  Sparkles, Zap, ChevronRight, User,
} from "lucide-react";
import Link from "next/link";
import { orgSchema, type OrgInput } from "@/lib/validations/organization";
import { createOrganization } from "@/app/actions/organizations";

const inputCls =
  "border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors bg-white placeholder:text-neutral-300 w-full";

interface Props {
  firstName: string;
  canCreateOrg: boolean;
  planSlug: string;
}

export default function OnboardingClient({ firstName, canCreateOrg, planSlug }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"choice" | "create-org">("choice");
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OrgInput>({
    resolver: zodResolver(orgSchema),
    defaultValues: { brand_color: "#6D28D9" },
  });

  async function onSubmit(data: OrgInput) {
    setServerError("");
    const result = await createOrganization(data);
    if (!result) { router.push("/dashboard"); return; }
    if ("error" in result) { setServerError(result.error); return; }
    router.push(`/org/${result.slug}`);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "radial-gradient(ellipse 100% 50% at 50% -10%, #ede9fe 0%, #f5f3ff 40%, #ffffff 70%)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
          >
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase text-neutral-900">URPASS</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          Skip for now →
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">

          {step === "choice" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                  style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}>
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Welcome, {firstName}!
                </h1>
                <p className="text-neutral-500 text-sm mt-2">
                  How are you planning to use UrPass?
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Create organization */}
                {canCreateOrg ? (
                  <button
                    type="button"
                    onClick={() => setStep("create-org")}
                    className="flex items-center gap-4 bg-white border-2 border-brand rounded-2xl px-5 py-4 text-left hover:bg-brand-50 transition-all group shadow-sm"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
                    >
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900">Create an organization</p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        For colleges, agencies, companies, and teams running multiple events
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-brand shrink-0" />
                  </button>
                ) : (
                  <div className="flex items-center gap-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-5 py-4 text-left relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{ background: "repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(0,0,0,0.03) 6px, rgba(0,0,0,0.03) 12px)" }} />
                    <div className="w-12 h-12 rounded-xl bg-neutral-200 flex items-center justify-center shrink-0 relative">
                      <Building2 className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0 relative">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-neutral-500">Create an organization</p>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                          <Zap className="w-2.5 h-2.5" /> Starter+
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Upgrade to invite your team and manage events together
                      </p>
                      <Link
                        href="/billing"
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand mt-2 hover:underline"
                      >
                        Upgrade plan <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Personal workspace */}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 bg-white border-2 border-neutral-200 rounded-2xl px-5 py-4 text-left hover:border-neutral-300 hover:shadow-sm transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-neutral-200 transition-colors">
                    <User className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-800">Personal workspace</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Manage events on your own — you can create an organization any time later
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors" />
                </Link>
              </div>

              {/* Plan indicator */}
              {planSlug === "free" && (
                <p className="text-center text-xs text-neutral-400">
                  On the free plan ·{" "}
                  <Link href="/billing" className="text-brand hover:underline font-medium">
                    Upgrade for organizations &amp; more
                  </Link>
                </p>
              )}
            </div>
          )}

          {step === "create-org" && (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("choice")}
                  className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors mb-4"
                >
                  ← Back
                </button>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Create your organization
                </h1>
                <p className="text-neutral-500 text-sm mt-2">
                  You can always update these details later in settings.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-800">Organization name *</label>
                  <input {...register("name")} placeholder="ABC Engineering College" className={inputCls} autoFocus />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">Website</label>
                    <input {...register("website")} placeholder="https://example.com" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">Contact email</label>
                    <input {...register("contact_email")} type="email" placeholder="hello@org.com" className={inputCls} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-800">Brand color</label>
                  <div className="flex items-center gap-3">
                    <input {...register("brand_color")} type="color"
                      className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer p-0.5" />
                    <input {...register("brand_color")} placeholder="#6D28D9" className={inputCls} />
                  </div>
                  <p className="text-xs text-neutral-400">Used on event passes and pages across your organization</p>
                </div>

                {serverError && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" }}
                >
                  {isSubmitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                    : <><Check className="w-4 h-4" /> Create organization</>
                  }
                </button>
              </form>

              <p className="text-center text-xs text-neutral-400">
                You&apos;ll be the owner and can invite your team next.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
