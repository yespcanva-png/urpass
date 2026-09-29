"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Ticket,
  Building2,
  ArrowRight,
  Loader2,
  Check,
  ChevronRight,
  User,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { orgSchema, type OrgInput } from "@/lib/validations/organization";
import { createOrganization } from "@/app/actions/organizations";

const inputCls =
  "border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors bg-white placeholder:text-neutral-300 w-full text-neutral-900";

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
    defaultValues: { brand_color: "#18181b" },
  });

  async function onSubmit(data: OrgInput) {
    setServerError("");
    const result = await createOrganization(data);
    if (!result) { router.push("/dashboard"); return; }
    if ("error" in result) { setServerError(result.error); return; }
    router.push(`/org/${result.slug}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Zoho-style Minimalist Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 bg-white">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
            <Ticket className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase text-neutral-900">URPASS</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Skip to Dashboard →
        </Link>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {step === "choice" && (
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 text-[11px] font-semibold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Getting Started</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Welcome to UrPass, {firstName}!
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                  Select your workspace setup to get started in seconds.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Personal workspace (Clean, sleek, recommended) */}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 bg-white border border-neutral-200/90 rounded-xl p-4 text-left hover:border-neutral-900 hover:shadow-xs transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-colors">
                    <User className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-neutral-900">Personal Workspace</p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Ready
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Create events, design QR passes, and check in attendees individually with 0% commission.
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 shrink-0 transition-colors" />
                </Link>

                {/* Team / Organization workspace */}
                {canCreateOrg ? (
                  <button
                    type="button"
                    onClick={() => setStep("create-org")}
                    className="flex items-center gap-4 bg-white border border-neutral-200/90 rounded-xl p-4 text-left hover:border-neutral-900 hover:shadow-xs transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-colors">
                      <Building2 className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-neutral-900">Create an Organization</p>
                        <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full">
                          Team
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        For universities, societies, colleges, agencies, and teams running multi-track events.
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 shrink-0 transition-colors" />
                  </button>
                ) : (
                  <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-200/70 rounded-xl p-3.5 text-left">
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-700">Need Team & Campus Workspaces?</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Starter, Pro, and Business tiers support multi-organizer collaboration and departments.
                      </p>
                    </div>
                    <Link
                      href="/billing"
                      className="text-xs font-semibold text-neutral-900 hover:underline shrink-0"
                    >
                      View plans →
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  No credit card required
                </span>
                <span>Sub-second setup</span>
              </div>
            </div>
          )}

          {step === "create-org" && (
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => setStep("choice")}
                  className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors mb-3 flex items-center gap-1"
                >
                  ← Back to options
                </button>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Create your organization
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                  Set your organization name and branding. You can customize permissions anytime.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Organization Name *
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g. Oxford Tech Society or ABC College"
                    className={inputCls}
                    autoFocus
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Website
                    </label>
                    <input {...register("website")} placeholder="https://example.ac.uk" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Contact Email
                    </label>
                    <input {...register("contact_email")} type="email" placeholder="events@org.com" className={inputCls} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      {...register("brand_color")}
                      type="color"
                      className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                    />
                    <input {...register("brand_color")} placeholder="#18181b" className={inputCls} />
                  </div>
                  <p className="text-[11px] text-neutral-400">Used on digital passes and event landing pages</p>
                </div>

                {serverError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors disabled:opacity-50 mt-2 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Create Organization &amp; Continue
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
