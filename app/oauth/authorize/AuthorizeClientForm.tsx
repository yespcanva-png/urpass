"use client";

import { useState } from "react";
import { Sparkles, Calendar, Ticket, Users, BarChart3, ShieldCheck, ArrowRight, Check } from "lucide-react";
import Image from "next/image";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface AuthorizeClientFormProps {
  userEmail: string;
  organizations: Organization[];
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}

export function AuthorizeClientForm({
  userEmail,
  organizations,
  clientId,
  redirectUri,
  scope,
  state,
  codeChallenge,
  codeChallengeMethod,
}: AuthorizeClientFormProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = clientId === "claude" ? "Claude (Anthropic)" : "Claude AI Assistant";

  async function handleAuthorize() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/oauth/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          redirectUri,
          scope,
          state,
          codeChallenge,
          codeChallengeMethod,
          organizationId: selectedOrgId || null,
          action: "approve",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Authorization failed");
      }

      window.location.href = data.redirectUrl;
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleDeny() {
    setLoading(true);
    try {
      const res = await fetch("/api/oauth/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          redirectUri,
          state,
          action: "deny",
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div>
      {/* Logos and Connection Indicator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-md">
          <span className="text-white font-extrabold text-lg tracking-tight">Ur</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-md">
          <Sparkles className="w-7 h-7 text-amber-600" />
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Connect to {clientName}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Signed in as <span className="font-semibold text-neutral-800">{userEmail}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Organization Selection (if applicable) */}
      {organizations.length > 0 && (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Authorize Account Context:
          </label>
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Personal Account (My Events)</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Permissions List */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider text-[11px]">
          Permissions Requested:
        </p>

        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
          <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-neutral-900">Events Management</p>
            <p className="text-neutral-500">Create drafts, edit details, and inspect schedules.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
          <Ticket className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-neutral-900">Tickets &amp; Pricing</p>
            <p className="text-neutral-500">Configure ticket tiers, capacities, and pricing.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
          <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-neutral-900">Attendee Registrations</p>
            <p className="text-neutral-500">View attendee list with privacy-preserving PII masking.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
          <BarChart3 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-neutral-900">Telemetry &amp; Analytics</p>
            <p className="text-neutral-500">Access check-in velocity and real-time gate statistics.</p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl mb-6 text-[11px] text-amber-900 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>Human Confirmation:</strong> Consequential actions like publishing live events or submitting to Explore always require your conversational approval in Claude.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDeny}
          disabled={loading}
          className="flex-1 py-2.5 px-4 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAuthorize}
          disabled={loading}
          className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-neutral-900 hover:bg-black rounded-xl transition shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Authorizing..." : "Authorize Claude"}
        </button>
      </div>
    </div>
  );
}
