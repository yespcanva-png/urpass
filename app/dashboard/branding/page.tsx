import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import BrandingForm from "./BrandingForm";
import Link from "next/link";
import { ArrowLeft, Lock, Ticket, ArrowRight, Sparkles } from "lucide-react";

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

  const plan = await getUserPlan(supabase, user.id);

  if (!plan.canRemoveBranding) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Starter+ feature</h1>
          <p className="text-sm text-neutral-500 mb-6">
            Remove URPASS branding on Starter. Add your own logo and brand colour on Pro.
          </p>
          <Link
            href="/billing"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "#6D28D9" }}
          >
            Upgrade plan
          </Link>
          <div className="mt-4">
            <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
              ← Dashboard
            </Link>
          </div>
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
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-1">Branding</p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-1">
            Organization Branding
          </h1>
          <p className="text-sm text-neutral-500">
            Control whether URPASS branding appears on passes and attendee pages, and set your organisation identity.
          </p>
        </div>

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
