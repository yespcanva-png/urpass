import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import BrandingForm from "./BrandingForm";
import BrandingUpgradeGate from "./BrandingUpgradeGate";
import Link from "next/link";
import { ArrowLeft, Ticket, ArrowRight, Sparkles, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Branding",
  description: "Customise how your brand appears on event passes and attendee pages.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BrandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [plan, { data: sub }] = await Promise.all([
    getUserPlan(supabase, user.id),
    supabase
      .from("subscriptions")
      .select("status, is_trial, trial_plan, trial_ends_at")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .maybeSingle(),
  ]);

  if (!plan.canRemoveBranding) {
    return (
      <div className="min-h-screen bg-neutral-50 pb-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <BrandingUpgradeGate
            userEmail={user.email}
            userName={user.user_metadata?.full_name}
          />
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_name, brand_color, org_logo_url, hide_urpass_branding")
    .eq("user_id", user.id)
    .single();

  const isPro = plan.canUse("custom_pass_design");
  const isTrialActive = Boolean(sub?.is_trial || sub?.status === "trialing");
  const trialEndsFormatted = sub?.trial_ends_at
    ? new Date(sub.trial_ends_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand">Branding</p>
            {isTrialActive && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                30-Day Pro Free Trial Active
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-1">
            Organization Branding
          </h1>
          <p className="text-sm text-neutral-500">
            Control whether URPASS branding appears on passes and attendee pages, and set your organisation identity.
          </p>
        </div>

        {/* Pro Trial Info Banner */}
        {isTrialActive && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border border-emerald-200/80 flex items-start gap-3 text-xs text-neutral-800 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-neutral-900">
                You have full access to all Pro Custom Branding features!
              </p>
              <p className="text-neutral-600 mt-0.5 leading-relaxed">
                Remove the URPASS watermark, set your custom brand color & logo, and customize passes in Ticket Studio.
                {trialEndsFormatted ? ` Your 30-day free trial is active until ${trialEndsFormatted}.` : ""}
              </p>
            </div>
          </div>
        )}

        {/* Dedicated Connection Card to Ticket Design Studio */}
        <div className="mb-6 bg-gradient-to-br from-violet-900 via-purple-900 to-neutral-900 text-white rounded-2xl p-5 shadow-sm border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Custom Ticket Pass Design</h3>
                {isPro ? (
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Pro Unlocked
                  </span>
                ) : (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                    Pro Feature
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-200/80 mt-1 max-w-md leading-relaxed">
                Customize themes (Classic, Glassmorphism, Conference Badge, Cyberpunk), backgrounds, textures, and typography.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/ticket-design"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-bold transition-all shadow-sm"
          >
            <span>Open Ticket Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Branding Form */}
        <BrandingForm
          initial={{
            org_name: profile?.org_name ?? "",
            brand_color: profile?.brand_color ?? "#6D28D9",
            org_logo_url: profile?.org_logo_url ?? "",
            hide_urpass_branding: profile?.hide_urpass_branding ?? false,
          }}
          isPro={isPro}
          canHideBranding={plan.canRemoveBranding}
        />
      </div>
    </div>
  );
}
