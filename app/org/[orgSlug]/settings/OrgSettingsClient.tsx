"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  AlertTriangle,
  Settings2,
  CreditCard,
  Globe2,
  ShieldCheck,
  Building2,
  Check,
} from "lucide-react";
import { orgSchema, type OrgInput } from "@/lib/validations/organization";
import { updateOrganization, deleteOrganization } from "@/app/actions/organizations";
import { updateOrganizationSettings } from "@/app/actions/organization-settings";
import OrgRazorpayCard from "@/components/org/OrgRazorpayCard";
import type { Organization, OrgRole, OrganizationSettings } from "@/types";

const inputCls =
  "border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand transition-colors bg-white placeholder:text-neutral-300 w-full";

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-800">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
      <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-brand" />
      </div>
      <div>
        <p className="text-sm font-bold text-neutral-900">{title}</p>
        {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
      </div>
    </div>
  );
}

interface Props {
  org: Organization;
  orgSlug: string;
  userRole: OrgRole;
  existingPaymentKeyId: string | null;
  initialSettings: OrganizationSettings | null;
}

export default function OrgSettingsClient({
  org,
  orgSlug,
  userRole,
  existingPaymentKeyId,
  initialSettings,
}: Props) {
  // General org form
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);

  // Enterprise settings
  const [timezone, setTimezone] = useState(initialSettings?.timezone || "Asia/Kolkata");
  const [currency, setCurrency] = useState(initialSettings?.currency || "INR");
  const [dateFormat, setDateFormat] = useState(initialSettings?.date_format || "DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">(initialSettings?.time_format || "12h");
  const [allowedDomainsStr, setAllowedDomainsStr] = useState(
    (initialSettings?.allowed_domains || []).join(", ")
  );
  const [enforce2FA, setEnforce2FA] = useState(initialSettings?.enforce_2fa || false);
  const [requirePassApproval, setRequirePassApproval] = useState(
    initialSettings?.require_approval_for_passes || false
  );
  const [defaultTemplate, setDefaultTemplate] = useState(
    initialSettings?.default_pass_template || "modern"
  );
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrgInput>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: org.name,
      website: org.website ?? "",
      contact_email: org.contact_email ?? "",
      contact_phone: org.contact_phone ?? "",
      brand_color: org.brand_color,
    },
  });

  async function onSubmit(data: OrgInput) {
    setServerError("");
    setSaved(false);
    const result = await updateOrganization(org.id, data);
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSaveEnterpriseSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError("");
    setSettingsSaved(false);

    const domains = allowedDomainsStr
      .split(",")
      .map((d) => d.trim().toLowerCase().replace(/^@/, ""))
      .filter(Boolean);

    const res = await updateOrganizationSettings(org.id, {
      timezone,
      currency,
      date_format: dateFormat,
      time_format: timeFormat,
      allowed_domains: domains,
      enforce_2fa: enforce2FA,
      require_approval_for_passes: requirePassApproval,
      default_pass_template: defaultTemplate,
      brand_primary_color: org.brand_color,
      brand_secondary_color: "#4C1D95",
      features: initialSettings?.features || {},
    });

    if (res.error) {
      setSettingsError(res.error);
      setSettingsLoading(false);
      return;
    }

    setSettingsSaved(true);
    setSettingsLoading(false);
    setTimeout(() => setSettingsSaved(false), 3500);
  }

  async function handleDelete() {
    if (deleteConfirm !== org.name) {
      setDeleteError("Organization name doesn't match.");
      return;
    }
    setDeleting(true);
    const result = await deleteOrganization(org.id);
    if (result?.error) {
      setDeleteError(result.error);
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── 1. General Profile & Branding ──────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xs p-6 space-y-5 border border-neutral-200/80">
        <SectionHeader
          icon={Building2}
          title="Organization Profile"
          subtitle="Identity, public metadata, and signature theme color"
        />

        <Field label="Organization name *" error={errors.name?.message}>
          <input {...register("name")} className={inputCls} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Website" error={errors.website?.message}>
            <input {...register("website")} placeholder="https://example.com" className={inputCls} />
          </Field>
          <Field label="Contact email" error={errors.contact_email?.message}>
            <input {...register("contact_email")} type="email" className={inputCls} />
          </Field>
        </div>

        <Field label="Contact phone">
          <input {...register("contact_phone")} className={inputCls} />
        </Field>

        <Field label="Brand color" hint="Primary theme color used across badges, digital passes, and scanner UI">
          <div className="flex items-center gap-3">
            <input
              {...register("brand_color")}
              type="color"
              className="w-10 h-10 rounded-xl border border-neutral-200 cursor-pointer p-0.5"
            />
            <input {...register("brand_color")} placeholder="#6D28D9" className={inputCls} />
          </div>
        </Field>

        {serverError && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3">{serverError}</p>}
        {saved && <p className="text-xs text-green-600 bg-green-50 rounded-xl px-4 py-3">Profile saved successfully.</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2.5 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{ background: "#6D28D9" }}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Profile
        </button>
      </form>

      {/* ── 2. Enterprise Organization-Level Settings ──────────────────── */}
      <form
        onSubmit={handleSaveEnterpriseSettings}
        className="bg-white rounded-2xl shadow-xs p-6 space-y-5 border border-neutral-200/80"
      >
        <SectionHeader
          icon={Globe2}
          title="Tenant Settings &amp; Policies"
          subtitle="Localization, format defaults, security rules, and access domains"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-800 block mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={inputCls}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-800 block mb-1">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputCls}
            >
              <option value="INR">INR (₹ Indian Rupee)</option>
              <option value="USD">USD ($ United States Dollar)</option>
              <option value="EUR">EUR (€ Euro)</option>
              <option value="GBP">GBP (£ British Pound)</option>
              <option value="SGD">SGD (S$ Singapore Dollar)</option>
              <option value="AED">AED (United Arab Emirates Dirham)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-800 block mb-1">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className={inputCls}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 25/12/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 12/25/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-12-25)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-800 block mb-1">
            Allowed Email Domains for Team Auto-Join
          </label>
          <input
            type="text"
            value={allowedDomainsStr}
            onChange={(e) => setAllowedDomainsStr(e.target.value)}
            placeholder="e.g. company.com, college.edu.in, university.ac.in"
            className={inputCls}
          />
          <p className="text-[11px] text-neutral-400 mt-1">
            Anyone signing in with an email matching these domains can join this organization automatically.
          </p>
        </div>

        <div className="pt-2 border-t border-neutral-100 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enforce2FA}
              onChange={(e) => setEnforce2FA(e.target.checked)}
              className="w-4 h-4 rounded text-brand focus:ring-brand"
            />
            <div>
              <p className="text-xs font-semibold text-neutral-900">Enforce Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-neutral-400">
                Require all organization members to have 2FA enabled before accessing gate check-in scanners.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requirePassApproval}
              onChange={(e) => setRequirePassApproval(e.target.checked)}
              className="w-4 h-4 rounded text-brand focus:ring-brand"
            />
            <div>
              <p className="text-xs font-semibold text-neutral-900">Require Manual Pass Approval</p>
              <p className="text-[11px] text-neutral-400">
                Newly registered event attendees require explicit coordinator approval before digital passes are dispatched.
              </p>
            </div>
          </label>
        </div>

        {settingsError && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3">{settingsError}</p>}
        {settingsSaved && <p className="text-xs text-green-600 bg-green-50 rounded-xl px-4 py-3">Tenant settings saved successfully.</p>}

        <button
          type="submit"
          disabled={settingsLoading}
          className="py-2.5 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{ background: "#6D28D9" }}
        >
          {settingsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Tenant Settings
        </button>
      </form>

      {/* ── 3. Payment Integration ───────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-xs p-6 space-y-4 border border-neutral-200/80">
        <SectionHeader
          icon={CreditCard}
          title="Payment Gateway Integration"
          subtitle="Collect registration ticket revenue directly to your organization's Razorpay account"
        />
        <p className="text-xs text-neutral-500 leading-relaxed">
          Connect Razorpay to accept UPI, RuPay, cards, and net banking for all events in this organization.
          Revenue goes directly to your bank account — URPASS never holds your money.
        </p>
        <OrgRazorpayCard orgId={org.id} orgSlug={orgSlug} existingKeyId={existingPaymentKeyId} />
      </div>

      {/* ── 4. Danger Zone ──────────────────────────────────── */}
      {userRole === "owner" && (
        <div className="bg-white rounded-2xl shadow-xs p-6 space-y-4 border border-red-200">
          <div className="flex items-center gap-3 pb-4 border-b border-red-100">
            <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-600">Danger Zone</p>
              <p className="text-xs text-neutral-400">Irreversible actions on this tenant</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Deleting this organization will unlink all associated events, workspaces, locations, and member records.
            Type <strong>{org.name}</strong> to confirm.
          </p>

          <input
            value={deleteConfirm}
            onChange={(e) => {
              setDeleteConfirm(e.target.value);
              setDeleteError("");
            }}
            placeholder={`Type "${org.name}" to confirm`}
            className="border border-red-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm outline-none focus:border-red-400 transition-colors bg-white w-full placeholder:text-neutral-300"
          />

          {deleteError && <p className="text-xs text-red-600">{deleteError}</p>}

          <button
            onClick={handleDelete}
            disabled={deleting || deleteConfirm !== org.name}
            className="py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 transition-colors flex items-center gap-2"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Organization
          </button>
        </div>
      )}
    </div>
  );
}
