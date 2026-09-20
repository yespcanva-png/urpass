import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import PassDesigner from "@/components/pass/PassDesigner";
import Link from "next/link";
import { ArrowLeft, Sparkles, Palette, ArrowRight, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Ticket Design Studio",
  description: "Customize digital ticket passes, themes, brand colors, and layouts for your attendees.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TicketDesignPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getUserPlan(supabase, user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_name, brand_color, org_logo_url, custom_pass_design")
    .eq("user_id", user.id)
    .single();

  const isPro = plan.canUse("custom_pass_design");

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Direct link connecting with Branding */}
          <Link
            href="/dashboard/branding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-brand bg-white border border-neutral-200 hover:border-brand/40 px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
          >
            <Palette className="w-3.5 h-3.5 text-brand" />
            <span>Organization Branding</span>
            <ArrowRight className="w-3 h-3 text-neutral-400" />
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand">
              Ticket Experience Studio
            </span>
            {isPro && (
              <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Pro Unlocked
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Ticket Design Studio
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Design how your attendee entry passes look across all your events. Customize themes, colors,
            patterns, typography, and disclaimers with live interactive preview.
          </p>

          {/* Connected Identity Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3 bg-white border border-neutral-200/80 rounded-2xl px-4 py-2.5 max-w-3xl text-xs">
            <span className="text-neutral-400 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Connected Identity:
            </span>
            <span className="font-bold text-neutral-800">
              {profile?.org_name || "URPASS (Default)"}
            </span>
            {profile?.brand_color && (
              <span className="flex items-center gap-1.5 text-neutral-500 font-mono">
                <span
                  className="w-3 h-3 rounded-full border border-black/10 inline-block"
                  style={{ backgroundColor: profile.brand_color }}
                />
                {profile.brand_color.toUpperCase()}
              </span>
            )}
            <Link
              href="/dashboard/branding"
              className="ml-auto text-brand hover:underline font-semibold"
            >
              Edit brand logo & name &rarr;
            </Link>
          </div>
        </div>

        {/* Pass Designer component */}
        <PassDesigner
          initialDesign={profile?.custom_pass_design}
          orgName={profile?.org_name ?? "Your Organisation"}
          orgLogoUrl={profile?.org_logo_url ?? ""}
          isPro={isPro}
          mode="profile"
        />
      </div>
    </div>
  );
}
