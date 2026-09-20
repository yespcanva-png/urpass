import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import BrandingForm from "./BrandingForm";
import PassDesigner from "@/components/pass/PassDesigner";
import Link from "next/link";
import { ArrowLeft, Lock, Sparkles, Shield, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "Branding & Custom Pass Design",
  description: "Customize your ticket passes, brand identity, and theme layouts.",
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
            Remove URPASS branding on Starter. Design custom tickets, themes, and brand colors on Pro.
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
    .select("org_name, brand_color, org_logo_url, hide_urpass_branding, custom_pass_design")
    .eq("user_id", user.id)
    .single();

  const isPro = plan.canUse("custom_pass_design");

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold tracking-widest uppercase text-brand">
                Brand & Design Studio
              </span>
              {isPro && (
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Pro Unlocked
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Pass Designer & Identity
            </h1>
            <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
              Design how your digital tickets look for attendees across your events, and configure your organization identity.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {/* Section 1: Custom Pass Designer */}
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand" />
                Digital Pass Designer
              </h2>
              <p className="text-xs text-neutral-500">
                Choose themes (Classic Cutout, Modern Glass, Minimal Monochrome, Conference Badge, Cyberpunk), gradients, patterns, and typography.
              </p>
            </div>

            <PassDesigner
              initialDesign={profile?.custom_pass_design}
              orgName={profile?.org_name ?? "Your Organisation"}
              orgLogoUrl={profile?.org_logo_url ?? ""}
              isPro={isPro}
              mode="profile"
            />
          </div>

          {/* Section 2: Organization Identity & Visibility */}
          <div className="pt-6 border-t border-neutral-200/80">
            <div className="mb-4">
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-neutral-600" />
                Organization Identity & Visibility
              </h2>
              <p className="text-xs text-neutral-500">
                Control logo display, organization naming, and whether the URPASS badge is visible.
              </p>
            </div>

            <div className="max-w-2xl">
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
        </div>
      </div>
    </div>
  );
}
