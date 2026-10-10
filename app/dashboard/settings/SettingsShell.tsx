"use client";

import { useState } from "react";
import {
  User, ShieldCheck, CreditCard, Puzzle, AlertTriangle,
  Check, Sparkles, Zap, Crown, Building2, ArrowUpRight,
  ChevronRight, Mail, KeyRound, LogOut, Code2, Palette, Ticket,
} from "lucide-react";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import PasswordResetButton from "./PasswordResetButton";
import SignOutButton from "./SignOutButton";
import RazorpayCard from "./RazorpayCard";
import PayUCard from "@/components/payments/PayUCard";
import DeveloperDashboard, { type ApiKeyRow } from "@/app/dashboard/developer/DeveloperDashboard";
import type { ApiUsage } from "@/app/actions/api-usage";
import type { WebhookEndpoint, WebhookDelivery } from "@/app/actions/webhooks";
import RbacPermissionEditor from "@/components/org/RbacPermissionEditor";

type Section = "profile" | "security" | "rbac" | "billing" | "branding" | "integrations" | "developer" | "danger";

export interface SettingsPlan {
  slug: string;
  maxEvents: number;
  unlimited: boolean;
  registrationsPerMonth: number;
  canUseDeveloperTools: boolean;
  canUsePayments: boolean;
}

export interface BrandingInfo {
  orgName?: string | null;
  brandColor?: string | null;
  orgLogoUrl?: string | null;
  hideBranding?: boolean;
}

interface Props {
  fullName: string;
  email: string;
  initials: string;
  phone?: string | null;
  companyName?: string | null;
  gstin?: string | null;
  billingAddress?: string | null;
  plan: SettingsPlan;
  currentPlan: { name: string; price_monthly: number; slug: string } | null;
  isTrial?: boolean;
  branding?: BrandingInfo | null;
  renewalDate: string | null;
  cancelAtPeriodEnd: boolean;
  activeEventCount: number;
  billingCycle: "monthly" | "annual";
  registrationsUsed: number;
  existingPaymentKeyId: string | null;
  existingPayUMerchantKey?: string | null;
  existingPayUEnvironment?: "production" | "sandbox";
  apiUsage: ApiUsage;
  apiKeys: ApiKeyRow[];
  webhookEndpoints: WebhookEndpoint[];
  recentDeliveries: WebhookDelivery[];
  orgId?: string;
  orgSlug?: string;
  orgName?: string;
  userRole?: string;
}

const NAV: { id: Section; label: string; icon: React.ComponentType<{ className?: string }>; danger?: boolean }[] = [
  { id: "profile",      label: "Profile",       icon: User },
  { id: "security",     label: "Security",       icon: ShieldCheck },
  { id: "rbac",         label: "Roles & RBAC",  icon: KeyRound },
  { id: "billing",      label: "Plan & Billing", icon: CreditCard },
  { id: "branding",     label: "Branding",       icon: Palette },
  { id: "integrations", label: "Integrations",   icon: Puzzle },
  { id: "developer",    label: "Developer",      icon: Code2 },
  { id: "danger",       label: "Danger zone",    icon: AlertTriangle, danger: true },
];

const PLAN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  free: Sparkles, starter: Zap, pro: Crown, business: Building2, campus: Building2, enterprise: Building2,
};
const PLAN_GRADIENT: Record<string, string> = {
  free:       "linear-gradient(135deg, #1c1c28 0%, #13111c 100%)",
  starter:    "linear-gradient(135deg, #1e1030 0%, #13111c 100%)",
  pro:        "linear-gradient(135deg, #2a1a00 0%, #13111c 100%)",
  business:   "linear-gradient(135deg, #082f49 0%, #13111c 100%)",
  campus:     "linear-gradient(135deg, #064e3b 0%, #13111c 100%)",
  enterprise: "linear-gradient(135deg, #0c1624 0%, #13111c 100%)",
};
const PLAN_ACCENT: Record<string, string> = {
  free: "#a78bfa", starter: "#a78bfa", pro: "#fbbf24", business: "#38bdf8", campus: "#34d399", enterprise: "#94a3b8",
};
const PLAN_FEATURES: Record<string, string[]> = {
  free:       ["2 events/month", "100 registrations/month", "Digital passes", "QR check-in"],
  starter:    ["10 events/month", "500 registrations/month", "CSV upload", "Standard analytics"],
  pro:        ["Unlimited events", "2,500 registrations/month", "API access", "Webhooks"],
  business:   ["Unlimited events", "10,000 registrations/month", "Advanced teams", "API & webhooks"],
  campus:     ["Unlimited events", "Unlimited registrations", "Campus teams", "API & webhooks"],
  enterprise: ["Everything in Business", "Dedicated support", "Custom SLAs", "Volume discounts"],
};

/* ── Shared section label ──────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-1 mb-2 mt-5 first:mt-0">
      {children}
    </p>
  );
}

/* ── Plan card (shared between mobile and desktop) ─────────────────────── */
function PlanCard({
  plan,
  currentPlan,
  isTrial,
  renewalDate,
  cancelAtPeriodEnd,
  activeEventCount,
  billingCycle,
  registrationsUsed,
}: {
  plan: SettingsPlan;
  currentPlan: Props["currentPlan"];
  isTrial?: boolean;
  renewalDate: string | null;
  cancelAtPeriodEnd: boolean;
  activeEventCount: number;
  billingCycle: Props["billingCycle"];
  registrationsUsed: number;
}) {
  const PlanIcon     = PLAN_ICONS[plan.slug] ?? Sparkles;
  const planGradient = PLAN_GRADIENT[plan.slug] ?? PLAN_GRADIENT.free;
  const planAccent   = PLAN_ACCENT[plan.slug] ?? PLAN_ACCENT.free;
  const planFeatures = PLAN_FEATURES[plan.slug] ?? PLAN_FEATURES.free;
  const displayPrice = currentPlan
    ? billingCycle === "annual" ? currentPlan.price_monthly * 10 : currentPlan.price_monthly
    : 0;
  const eventUsagePct = plan.unlimited
    ? 18
    : Math.min(100, (activeEventCount / plan.maxEvents) * 100);
  const registrationLimit = plan.registrationsPerMonth;
  const registrationsUnlimited = registrationLimit >= 999_999;
  const registrationUsagePct = registrationsUnlimited
    ? 18
    : Math.min(100, (registrationsUsed / registrationLimit) * 100);

  return (
    <div className="space-y-3">
      {/* Dark plan card */}
      <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: planGradient }}>
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${planAccent}, transparent 70%)` }}
        />
        <div className="relative flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${planAccent}25`, border: `1px solid ${planAccent}30`, color: planAccent }}
            >
              <PlanIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/30">Current plan</p>
                {isTrial && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    Trial Active
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-white">{currentPlan?.name ?? (plan.slug !== "free" ? plan.slug.toUpperCase() : "Free")}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              {isTrial ? "₹0 / £0" : displayPrice === 0 ? "₹0" : `₹${(displayPrice / 100).toFixed(0)}`}
            </p>
            <p className="text-[10px] text-white/30">
              {isTrial
                ? "30-day trial"
                : currentPlan && currentPlan.price_monthly > 0
                ? billingCycle === "annual" ? "/year" : "/month"
                : "forever"}
            </p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] text-white/35 mb-1">Events used</p>
            <p className="text-sm font-bold text-white">
              {activeEventCount}
              <span className="text-white/35 font-normal"> / {plan.unlimited ? "∞" : plan.maxEvents}</span>
            </p>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2.5">
              <div className="h-full rounded-full transition-all" style={{ width: `${eventUsagePct}%`, background: planAccent }} />
            </div>
          </div>
          <div className="rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] text-white/35 mb-1">Registrations</p>
            <p className="text-sm font-bold text-white">
              {registrationsUsed.toLocaleString()}
              <span className="text-white/35 font-normal">
                {" "}/ {registrationsUnlimited ? "∞" : registrationLimit.toLocaleString()}
              </span>
            </p>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2.5">
              <div className="h-full rounded-full transition-all" style={{ width: `${registrationUsagePct}%`, background: planAccent }} />
            </div>
          </div>
        </div>

        {renewalDate && currentPlan && currentPlan.price_monthly > 0 && (
          <p className="relative text-[10px] text-white/25">
            {cancelAtPeriodEnd ? "Cancels" : "Renews"} {renewalDate}
          </p>
        )}
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3">Included in your plan</p>
        <ul className="flex flex-col gap-2.5">
          {planFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-brand" />
              </span>
              <span className="text-sm text-neutral-600">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.slug === "free" || plan.slug === "starter" ? (
        <Link
          href="/billing"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
        >
          <Zap className="w-4 h-4 text-yellow-300" />
          Upgrade plan
        </Link>
      ) : (
        <Link
          href="/billing"
          className="flex items-center justify-center gap-1.5 w-full py-3.5 rounded-2xl text-sm font-semibold text-brand bg-brand-50 hover:bg-brand-100 transition-colors"
        >
          Manage billing <ArrowUpRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function DeveloperLocked() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
        <Code2 className="w-5 h-5 text-amber-500" />
      </div>
      <h2 className="text-lg font-bold tracking-tight text-neutral-900">Developer tools are available on Pro and above</h2>
      <p className="text-sm text-neutral-400 mt-1 mb-5">
        Upgrade to generate API keys, configure webhooks, and access API logs.
      </p>
      <Link
        href="/billing"
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        style={{ background: "#6D28D9" }}
      >
        Upgrade to Pro <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function SettingsShell({
  fullName, email, initials, phone, companyName, gstin, billingAddress, plan, currentPlan, isTrial, branding,
  renewalDate, cancelAtPeriodEnd, activeEventCount, billingCycle, registrationsUsed, existingPaymentKeyId,
  existingPayUMerchantKey, existingPayUEnvironment,
  apiUsage, apiKeys, webhookEndpoints, recentDeliveries,
  orgId, orgSlug, orgName, userRole,
}: Props) {
  const [section, setSection] = useState<Section>("profile");
  const canUseDeveloperTools = plan.canUseDeveloperTools;
  const canUsePayments = plan.canUsePayments;

  /* ── Desktop section content ──────────────────────────────────────────── */
  function renderDesktopContent() {
    switch (section) {
      case "profile":
        return (
          <div className="max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">Profile & Organization</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Manage your personal profile, organizer contact details, and registered business invoicing information.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <ProfileForm
                fullName={fullName}
                email={email}
                initials={initials}
                phone={phone}
                companyName={companyName}
                gstin={gstin}
                billingAddress={billingAddress}
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">Security</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Manage your password and account access.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Password</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Reset link sent to <span className="font-medium text-neutral-600">{email}</span>
                </p>
              </div>
              <PasswordResetButton />
            </div>
          </div>
        );

      case "rbac":
        return (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">Roles & Access Control (RBAC)</h2>
              <p className="text-sm text-neutral-400 mt-0.5">
                Configure granular permissions and invite team members with least-privilege roles across Event Management, Checkpoints, Scanners, and Finance.
              </p>
            </div>
            <RbacPermissionEditor orgId={orgId} orgSlug={orgSlug} orgName={orgName} userRole={userRole} />
          </div>
        );

      case "billing":
        return (
          <div className="max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">Plan & Billing</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Your current plan, usage, and upgrade options.</p>
            </div>
            <PlanCard
              plan={plan} currentPlan={currentPlan} isTrial={isTrial} renewalDate={renewalDate}
              cancelAtPeriodEnd={cancelAtPeriodEnd} activeEventCount={activeEventCount}
              billingCycle={billingCycle} registrationsUsed={registrationsUsed}
            />
          </div>
        );

      case "branding":
        return (
          <div className="max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">Branding & White-Label</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Manage your organization identity, brand palette, and white-label pass settings.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5 border border-neutral-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold text-sm"
                    style={{ background: branding?.brandColor || "#6D28D9" }}
                  >
                    {branding?.orgLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={branding.orgLogoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white/20 p-0.5" />
                    ) : (
                      (branding?.orgName || "ORG").slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-neutral-900">{branding?.orgName || "Default Organization"}</p>
                      {plan.slug !== "free" ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {plan.slug.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                          Free
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Brand Color: <span className="font-mono font-semibold uppercase">{branding?.brandColor || "#6D28D9"}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    branding?.hideBranding
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {branding?.hideBranding ? "White-Label Active" : "Standard Branding"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/dashboard/branding"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-90 transition-all"
                  style={{ background: "#6D28D9" }}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Configure Organization Branding</span>
                </Link>

                <Link
                  href="/studio"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Open Ticket Studio</span>
                </Link>
              </div>
            </div>
          </div>
        );

      case "integrations":
        return (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">Integrations</h2>
              <p className="text-sm text-neutral-400 mt-0.5">
                Connect payment gateways to accept ticket sales directly into your merchant accounts.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Payment gateways</p>
                <span className="text-[11px] text-neutral-500 font-medium">Direct settlement into your bank account</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <RazorpayCard canUsePayments={canUsePayments} existingKeyId={existingPaymentKeyId} />
                <PayUCard
                  canUsePayments={canUsePayments}
                  existingMerchantKey={existingPayUMerchantKey ?? null}
                  existingEnvironment={existingPayUEnvironment ?? "production"}
                />
              </div>
            </div>
          </div>
        );

      case "developer":
        return canUseDeveloperTools ? (
          <DeveloperDashboard
            apiUsage={apiUsage}
            apiKeys={apiKeys}
            webhookEndpoints={webhookEndpoints}
            recentDeliveries={recentDeliveries}
          />
        ) : (
          <DeveloperLocked />
        );

      case "danger":
        return (
          <div className="max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900">Danger zone</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Irreversible account actions.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
              <SignOutButton />
              <div className="pt-3 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-700 mb-1">Delete account</p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Permanently removes your account and all data. Email{" "}
                  <a href="mailto:urpass.space@yespstudio.com" className="font-semibold text-neutral-600 hover:text-brand transition-colors">
                    urpass.space@yespstudio.com
                  </a>{" "}
                  to request deletion.
                </p>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="page-in">
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">Account</p>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Settings</h1>
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE — single scrollable page
          ════════════════════════════════════════════════════════ */}
      <div className="lg:hidden space-y-1">

        {/* ── Profile ─────────────────────────────────────── */}
        <SectionLabel>Profile & Organization</SectionLabel>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <ProfileForm
            fullName={fullName}
            email={email}
            initials={initials}
            phone={phone}
            companyName={companyName}
            gstin={gstin}
            billingAddress={billingAddress}
          />
        </div>

        {/* ── Security ────────────────────────────────────── */}
        <SectionLabel>Security</SectionLabel>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-neutral-50">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900">Password</p>
              <p className="text-xs text-neutral-400 mt-0.5 truncate">
                Reset link → {email}
              </p>
            </div>
            <PasswordResetButton />
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900">Email</p>
              <p className="text-xs text-neutral-400 mt-0.5 truncate">{email}</p>
            </div>
            <span className="text-[10px] font-semibold text-neutral-300 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full shrink-0">
              Fixed
            </span>
          </div>
        </div>

        {/* ── Roles & RBAC ────────────────────────────────── */}
        <SectionLabel>Roles & Access Control (RBAC)</SectionLabel>
        <RbacPermissionEditor orgId={orgId} orgSlug={orgSlug} orgName={orgName} userRole={userRole} />

        {/* ── Plan & Billing ──────────────────────────────── */}
        <SectionLabel>Plan & Billing</SectionLabel>
        <PlanCard
          plan={plan} currentPlan={currentPlan} isTrial={isTrial} renewalDate={renewalDate}
          cancelAtPeriodEnd={cancelAtPeriodEnd} activeEventCount={activeEventCount}
          billingCycle={billingCycle} registrationsUsed={registrationsUsed}
        />

        {/* ── Branding & White-Label ──────────────────────── */}
        <SectionLabel>Branding & White-Label</SectionLabel>
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4 border border-neutral-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-2xs"
                style={{ background: branding?.brandColor || "#6D28D9" }}
              >
                {branding?.orgLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={branding.orgLogoUrl} alt="Logo" className="w-6 h-6 rounded object-contain bg-white/20 p-0.5" />
                ) : (
                  (branding?.orgName || "ORG").slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">{branding?.orgName || "Default Organization"}</p>
                <p className="text-xs text-neutral-400">
                  Brand Color: <span className="font-mono font-semibold uppercase">{branding?.brandColor || "#6D28D9"}</span>
                </p>
              </div>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              branding?.hideBranding
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-neutral-100 text-neutral-500"
            }`}>
              {branding?.hideBranding ? "White-Label" : "Standard"}
            </span>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
            <Link
              href="/dashboard/branding"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white text-center shadow-2xs"
              style={{ background: "#6D28D9" }}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Branding</span>
            </Link>
            <Link
              href="/studio"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 text-center"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Ticket Studio</span>
            </Link>
          </div>
        </div>

        {/* ── Integrations ────────────────────────────────── */}
        <SectionLabel>Integrations</SectionLabel>
        <div className="space-y-4">
          <RazorpayCard canUsePayments={canUsePayments} existingKeyId={existingPaymentKeyId} />
          <PayUCard
            canUsePayments={canUsePayments}
            existingMerchantKey={existingPayUMerchantKey ?? null}
            existingEnvironment={existingPayUEnvironment ?? "production"}
          />
        </div>

        {/* ── Developer ───────────────────────────────────── */}
        <SectionLabel>Developer</SectionLabel>
        {canUseDeveloperTools ? (
          <DeveloperDashboard
            apiUsage={apiUsage}
            apiKeys={apiKeys}
            webhookEndpoints={webhookEndpoints}
            recentDeliveries={recentDeliveries}
          />
        ) : (
          <DeveloperLocked />
        )}

        {/* ── Account actions ─────────────────────────────── */}
        <SectionLabel>Account</SectionLabel>
        <SignOutButton />

        {/* ── Danger ──────────────────────────────────────── */}
        <SectionLabel>Danger zone</SectionLabel>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs font-semibold text-neutral-700 mb-1">Delete account</p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Permanently removes your account and all data. Email{" "}
            <a href="mailto:urpass.space@yespstudio.com" className="font-semibold text-neutral-600 hover:text-brand transition-colors">
              urpass.space@yespstudio.com
            </a>{" "}
            to request deletion.
          </p>
        </div>

        {/* Bottom spacing for mobile nav */}
        <div className="h-4" />
      </div>

      {/* ════════════════════════════════════════════════════════
          DESKTOP — sidebar + sectioned content
          ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 bg-white rounded-2xl shadow-sm p-2 sticky top-6">
          <div className="mb-1">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-3 mb-1 mt-2">Account</p>
            {(["profile", "security"] as Section[]).map((id) => {
              const item = NAV.find((n) => n.id === id)!;
              const active = section === id;
              return (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-neutral-100 text-neutral-900" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />}
                </button>
              );
            })}
          </div>

          <div className="mb-1">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-3 mb-1 mt-3">Workspace & Access</p>
            {(["rbac", "billing", "branding", "integrations", "developer"] as Section[]).map((id) => {
              const item = NAV.find((n) => n.id === id)!;
              const active = section === id;
              return (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-neutral-100 text-neutral-900" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-neutral-100">
            <button
              onClick={() => setSection("danger")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                section === "danger" ? "bg-red-50 text-red-600" : "text-red-400 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Danger zone
              {section === "danger" && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />}
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {renderDesktopContent()}
        </main>
      </div>
    </div>
  );
}
