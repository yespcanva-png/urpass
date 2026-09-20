"use client";

import { useState, useTransition } from "react";
import {
  Key,
  Webhook,
  Activity,
  LayoutDashboard,
  Check,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import type { ApiUsage } from "@/app/actions/api-usage";
import type { WebhookEndpoint, WebhookDelivery } from "@/app/actions/webhooks";
import { createApiKey, revokeApiKey, deleteApiKey, rotateApiKey } from "@/app/actions/api-keys";
import { createWebhookEndpoint, deleteWebhookEndpoint } from "@/app/actions/webhooks";

/* ── Types ──────────────────────────────────────────────────────────── */
export interface ApiKeyRow {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  environment: string;
}

type Tab = "overview" | "keys" | "webhooks" | "logs";

interface Props {
  apiUsage: ApiUsage;
  apiKeys: ApiKeyRow[];
  webhookEndpoints: WebhookEndpoint[];
  recentDeliveries: WebhookDelivery[];
}

/* ── Helpers ────────────────────────────────────────────────────────── */
function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDatetime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(str: string, max = 40) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

const ALL_EVENTS = [
  "registration.created",
  "registration.approved",
  "registration.rejected",
  "payment.success",
  "payment.failed",
  "ticket.issued",
  "checkin.completed",
  "pass.issued",
];

const EVENT_COLORS: Record<string, string> = {
  "registration.created":  "bg-blue-50 text-blue-700 border-blue-100",
  "registration.approved": "bg-green-50 text-green-700 border-green-100",
  "registration.rejected": "bg-red-50 text-red-700 border-red-100",
  "payment.success":       "bg-emerald-50 text-emerald-700 border-emerald-100",
  "payment.failed":        "bg-rose-50 text-rose-700 border-rose-100",
  "ticket.issued":         "bg-violet-50 text-violet-700 border-violet-100",
  "checkin.completed":     "bg-amber-50 text-amber-700 border-amber-100",
  "pass.issued":           "bg-indigo-50 text-indigo-700 border-indigo-100",
};

/* ── Shared copy button ─────────────────────────────────────────────── */
function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className={`p-1.5 rounded-lg hover:bg-neutral-100 transition-colors ${className ?? ""}`}
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
    </button>
  );
}

/* ── Secret reveal banner ───────────────────────────────────────────── */
function SecretBanner({
  label,
  secret,
  onDismiss,
}: {
  label: string;
  secret: string;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-3 mb-3">
        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-800">{label}</p>
          <p className="text-xs text-green-700 mt-0.5">Copy this now — it won&apos;t be shown again.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-white border border-green-200 rounded-xl px-3 py-2.5 font-mono text-xs text-neutral-700 mb-3">
        <span className="flex-1 truncate">
          {visible ? secret : `${secret.slice(0, 18)}${"•".repeat(32)}`}
        </span>
        <button
          onClick={() => setVisible(!visible)}
          className="p-1 rounded hover:bg-neutral-100 transition-colors"
        >
          {visible ? <EyeOff className="w-3.5 h-3.5 text-neutral-400" /> : <Eye className="w-3.5 h-3.5 text-neutral-400" />}
        </button>
        <CopyButton value={secret} />
      </div>
      <button onClick={onDismiss} className="text-xs text-green-700 hover:underline underline-offset-2">
        I&apos;ve copied it, dismiss
      </button>
    </div>
  );
}

/* ── Progress bar ───────────────────────────────────────────────────── */
function UsageCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">{value.toLocaleString()}</p>
      <p className="text-xs font-medium text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════ */
export default function DeveloperDashboard({
  apiUsage,
  apiKeys: initialKeys,
  webhookEndpoints: initialEndpoints,
  recentDeliveries: initialDeliveries,
}: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [isPending, startTransition] = useTransition();

  // --- API Keys state ---
  const [keys, setKeys] = useState(initialKeys);
  const [keyEnvFilter, setKeyEnvFilter] = useState<"production" | "sandbox">("production");
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<"sandbox" | "production">("production");
  const [creatingKey, setCreatingKey] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);

  // --- Webhook state ---
  const [endpoints, setEndpoints] = useState(initialEndpoints);
  const [showAddEndpoint, setShowAddEndpoint] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookDesc, setWebhookDesc] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [webhookError, setWebhookError] = useState("");
  const [creatingWebhook, setCreatingWebhook] = useState(false);
  const [newWebhookSecret, setNewWebhookSecret] = useState<string | null>(null);

  // --- Logs state ---
  const [deliveries] = useState(initialDeliveries);
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);

  /* ── Handlers ── */
  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setCreatingKey(true);
    setKeyError("");
    const result = await createApiKey(newKeyName.trim(), newKeyEnv);
    setCreatingKey(false);
    if ("error" in result) {
      setKeyError(result.error);
      return;
    }
    setNewRawKey(result.key);
    setKeys((prev) => [
      {
        id: result.id,
        name: newKeyName.trim(),
        key_prefix: result.key.slice(0, newKeyEnv === "sandbox" ? 17 : 16),
        permissions: ["events:read", "attendees:read"],
        is_active: true,
        last_used_at: null,
        expires_at: null,
        created_at: new Date().toISOString(),
        environment: newKeyEnv,
      },
      ...prev,
    ]);
    setNewKeyName("");
    setShowCreateKey(false);
  }

  function handleRevokeKey(id: string) {
    startTransition(async () => {
      await revokeApiKey(id);
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, is_active: false } : k)));
    });
  }

  function handleDeleteKey(id: string) {
    startTransition(async () => {
      await deleteApiKey(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
    });
  }

  async function handleRotateKey(id: string) {
    setRotatingId(id);
    const result = await rotateApiKey(id);
    setRotatingId(null);
    if ("error" in result) {
      alert(result.error);
      return;
    }
    setNewRawKey(result.key);
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? { ...k, is_active: false }
          : k
      ).concat([
        {
          id: result.id,
          name: prev.find((k) => k.id === id)?.name ?? "Rotated key",
          key_prefix: result.key.slice(0, result.key.startsWith("urp_test_") ? 17 : 16),
          permissions: ["events:read", "attendees:read"],
          is_active: true,
          last_used_at: null,
          expires_at: null,
          created_at: new Date().toISOString(),
          environment: prev.find((k) => k.id === id)?.environment ?? "production",
        },
      ])
    );
  }

  async function handleAddEndpoint(e: React.FormEvent) {
    e.preventDefault();
    setCreatingWebhook(true);
    setWebhookError("");
    const result = await createWebhookEndpoint(webhookUrl, webhookDesc, selectedEvents);
    setCreatingWebhook(false);
    if (result.error) {
      setWebhookError(result.error);
      return;
    }
    if (result.endpoint) {
      setNewWebhookSecret(result.endpoint.secret);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { secret, ...epWithoutSecret } = result.endpoint;
      setEndpoints((prev) => [{ ...epWithoutSecret, delivery_total: 0, delivery_success: 0 }, ...prev]);
    }
    setWebhookUrl("");
    setWebhookDesc("");
    setSelectedEvents([]);
    setShowAddEndpoint(false);
  }

  function handleDeleteEndpoint(id: string) {
    startTransition(async () => {
      await deleteWebhookEndpoint(id);
      setEndpoints((prev) => prev.filter((e) => e.id !== id));
    });
  }

  function toggleEvent(evt: string) {
    setSelectedEvents((prev) =>
      prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]
    );
  }

  const filteredKeys = keys.filter((k) => k.environment === keyEnvFilter);

  /* ══════════════════════════════════════════════════════════════════
     TAB: OVERVIEW
  ══════════════════════════════════════════════════════════════════ */
  function renderOverview() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">API STATUS</p>
            <p className="text-sm font-semibold text-neutral-900">Active on Pro</p>
          </div>
        </div>

        {/* Usage cards */}
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Usage this month</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <UsageCard label="API Requests" value={apiUsage.api_requests} />
          <UsageCard label="Registrations" value={apiUsage.registrations} />
          <UsageCard label="Events" value={apiUsage.events} />
        </div>

        {/* Base URL callout */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">Base URL</p>
            <code className="text-sm font-mono text-neutral-700">https://urpass.space/api/v1</code>
          </div>
          <a
            href="https://urpass.space/docs/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:opacity-80 transition-opacity shrink-0"
          >
            View Documentation <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════
     TAB: API KEYS
  ══════════════════════════════════════════════════════════════════ */
  function renderKeys() {
    return (
      <div className="space-y-5">
        {newRawKey && (
          <SecretBanner
            label="API key created"
            secret={newRawKey}
            onDismiss={() => setNewRawKey(null)}
          />
        )}

        {/* Env tabs */}
        <div className="flex gap-2">
          {(["production", "sandbox"] as const).map((env) => (
            <button
              key={env}
              onClick={() => setKeyEnvFilter(env)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                keyEnvFilter === env
                  ? env === "production"
                    ? "bg-violet-600 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {env === "production" ? "Production" : "Sandbox"}
            </button>
          ))}
        </div>

        {/* Create form */}
        {!showCreateKey ? (
          <button
            onClick={() => setShowCreateKey(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "#6D28D9" }}
          >
            <Plus className="w-4 h-4" />
            Create API key
          </button>
        ) : (
          <form
            onSubmit={handleCreateKey}
            className="bg-white border border-neutral-100 rounded-2xl p-5 flex flex-col gap-3"
          >
            <p className="text-sm font-semibold text-neutral-800">New API key</p>
            <input
              type="text"
              placeholder="e.g. Production app, Zapier, Internal"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors"
              required
              minLength={2}
              maxLength={64}
              autoFocus
            />
            {/* Environment toggle */}
            <div className="flex gap-2">
              {(["production", "sandbox"] as const).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setNewKeyEnv(env)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    newKeyEnv === env
                      ? env === "production"
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  {env === "production" ? "Production" : "Sandbox"}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-400">
              {newKeyEnv === "sandbox"
                ? "Sandbox keys (urp_test_…) work against test data only."
                : "Production keys (urp_live_…) access live data."}
            </p>
            {keyError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {keyError}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={creatingKey}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: "#6D28D9" }}
              >
                {creatingKey ? "Creating…" : "Generate"}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateKey(false); setKeyError(""); }}
                className="px-4 py-2 rounded-xl text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Keys list */}
        {filteredKeys.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-neutral-300" />
            </div>
            <p className="text-sm font-medium text-neutral-700 mb-1">
              No {keyEnvFilter} keys yet
            </p>
            <p className="text-xs text-neutral-400">
              Create a {keyEnvFilter} key to start integrating with UrPass.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredKeys.map((k) => (
              <div
                key={k.id}
                className="bg-white border border-neutral-100 rounded-2xl p-5 flex items-start gap-4"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: k.is_active ? "#f5f3ff" : "#f5f5f5",
                    border: `1px solid ${k.is_active ? "#ddd6fe" : "#e5e5e5"}`,
                  }}
                >
                  <Key className={`w-4 h-4 ${k.is_active ? "text-brand" : "text-neutral-300"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{k.name}</p>
                    {/* Environment badge */}
                    <span
                      className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${
                        k.environment === "sandbox"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-violet-50 text-violet-700 border-violet-100"
                      }`}
                    >
                      {k.environment}
                    </span>
                    {!k.is_active && (
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-400 border border-neutral-200">
                        Revoked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <code className="text-xs font-mono text-neutral-500">
                      {k.key_prefix}{"•".repeat(32)}
                    </code>
                    <CopyButton value={k.key_prefix} />
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <p className="text-xs text-neutral-400">Created {formatDate(k.created_at)}</p>
                    <span className="text-neutral-200">·</span>
                    <p className="text-xs text-neutral-400">Last used: {formatDate(k.last_used_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {k.is_active && (
                    <>
                      <button
                        onClick={() => handleRotateKey(k.id)}
                        disabled={rotatingId === k.id || isPending}
                        className="text-xs text-neutral-400 hover:text-brand transition-colors px-2 py-1 rounded-lg hover:bg-brand-50 flex items-center gap-1"
                        title="Rotate key"
                      >
                        <RefreshCw className="w-3 h-3" />
                        {rotatingId === k.id ? "…" : "Rotate"}
                      </button>
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        disabled={isPending}
                        className="text-xs text-neutral-400 hover:text-amber-600 transition-colors px-2 py-1 rounded-lg hover:bg-amber-50"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteKey(k.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete key"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-neutral-300 hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick usage */}
        <div className="mt-4 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl">
          <p className="text-xs font-semibold text-neutral-700 mb-2">Quick usage</p>
          <pre className="text-xs font-mono text-neutral-500 overflow-x-auto whitespace-pre-wrap">
{`curl https://urpass.space/api/v1/events \\
  -H "Authorization: Bearer urp_live_..."`}
          </pre>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════
     TAB: WEBHOOKS
  ══════════════════════════════════════════════════════════════════ */
  function renderWebhooks() {
    return (
      <div className="space-y-5">
        {newWebhookSecret && (
          <SecretBanner
            label="Webhook endpoint created"
            secret={newWebhookSecret}
            onDismiss={() => setNewWebhookSecret(null)}
          />
        )}

        {/* Add endpoint form toggle */}
        <button
          onClick={() => setShowAddEndpoint(!showAddEndpoint)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: "#6D28D9" }}
        >
          <Plus className="w-4 h-4" />
          Add endpoint
          {showAddEndpoint ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>

        {showAddEndpoint && (
          <form
            onSubmit={handleAddEndpoint}
            className="bg-white border border-neutral-100 rounded-2xl p-5 flex flex-col gap-4"
          >
            <p className="text-sm font-semibold text-neutral-800">New webhook endpoint</p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-600">URL</label>
              <input
                type="url"
                placeholder="https://your-app.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-600">Description (optional)</label>
              <input
                type="text"
                placeholder="e.g. My Zapier integration"
                value={webhookDesc}
                onChange={(e) => setWebhookDesc(e.target.value)}
                className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors"
                maxLength={200}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-neutral-600 mb-2">Events to subscribe</p>
              <div className="grid grid-cols-2 gap-2">
                {ALL_EVENTS.map((evt) => (
                  <label key={evt} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(evt)}
                      onChange={() => toggleEvent(evt)}
                      className="w-3.5 h-3.5 rounded accent-violet-600"
                    />
                    <span className="text-xs text-neutral-700">{evt}</span>
                  </label>
                ))}
              </div>
            </div>

            {webhookError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {webhookError}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={creatingWebhook}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: "#6D28D9" }}
              >
                {creatingWebhook ? "Adding…" : "Add endpoint"}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddEndpoint(false); setWebhookError(""); }}
                className="px-4 py-2 rounded-xl text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Endpoint list */}
        {endpoints.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Webhook className="w-6 h-6 text-neutral-300" />
            </div>
            <p className="text-sm font-medium text-neutral-700 mb-1">No webhook endpoints yet</p>
            <p className="text-xs text-neutral-400">Add an endpoint to start receiving events.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {endpoints.map((ep) => (
              <div key={ep.id} className="bg-white border border-neutral-100 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <code className="text-xs font-mono text-neutral-700 truncate max-w-xs">
                        {truncate(ep.url, 50)}
                      </code>
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${
                          ep.is_active
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}
                      >
                        {ep.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {ep.description && (
                      <p className="text-xs text-neutral-400 mb-2">{ep.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {ep.subscribed_events.map((evt) => (
                        <span
                          key={evt}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${EVENT_COLORS[evt] ?? "bg-neutral-50 text-neutral-500 border-neutral-200"}`}
                        >
                          {evt}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-400">
                      Last 30 days: {ep.delivery_total ?? 0} delivered, {ep.delivery_success ?? 0} successful
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEndpoint(ep.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    title="Delete endpoint"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-neutral-300 hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════
     TAB: WEBHOOK LOGS
  ══════════════════════════════════════════════════════════════════ */
  function renderLogs() {
    return (
      <div className="space-y-3">
        {deliveries.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-neutral-300" />
            </div>
            <p className="text-sm font-medium text-neutral-700 mb-1">No deliveries yet</p>
            <p className="text-xs text-neutral-400">
              Webhook delivery logs will appear here once your endpoints start receiving events.
            </p>
          </div>
        ) : (
          deliveries.map((d) => {
            const isExpanded = expandedDelivery === d.id;
            const statusOk = d.response_status !== null && d.response_status >= 200 && d.response_status < 300;
            return (
              <div key={d.id} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                  onClick={() => setExpandedDelivery(isExpanded ? null : d.id)}
                >
                  {/* URL */}
                  <code className="text-xs font-mono text-neutral-500 truncate max-w-[180px] shrink-0">
                    {truncate(d.endpoint_url ?? d.endpoint_id, 30)}
                  </code>
                  {/* Event type */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${EVENT_COLORS[d.event_type] ?? "bg-neutral-50 text-neutral-500 border-neutral-200"}`}
                  >
                    {d.event_type}
                  </span>
                  {/* Status code */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      statusOk
                        ? "bg-green-50 text-green-700 border-green-100"
                        : d.response_status === null
                        ? "bg-neutral-100 text-neutral-500 border-neutral-200"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {d.response_status ?? "—"}
                  </span>
                  <span className="text-xs text-neutral-400 ml-auto shrink-0">{formatDatetime(d.delivered_at)}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-300 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-300 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="border-t border-neutral-100 px-5 py-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">Payload</p>
                      <pre className="text-xs font-mono text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap max-h-48">
                        {d.payload ? JSON.stringify(d.payload, null, 2) : "(no payload)"}
                      </pre>
                    </div>
                    {d.response_body && (
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">Response</p>
                        <pre className="text-xs font-mono text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap max-h-32">
                          {d.response_body}
                        </pre>
                      </div>
                    )}
                    <p className="text-xs text-neutral-400">Attempt #{d.attempt}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */
  const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview",  label: "Overview",      icon: LayoutDashboard },
    { id: "keys",      label: "API Keys",       icon: Key },
    { id: "webhooks",  label: "Webhooks",       icon: Webhook },
    { id: "logs",      label: "Webhook Logs",   icon: Activity },
  ];

  return (
    <div className="page-in">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">Developer</p>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">API &amp; Developer</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage API keys, webhooks, and monitor usage.</p>
      </div>

      {/* Tab pills */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-2xl w-fit mb-6 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === id
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview"  && renderOverview()}
      {tab === "keys"      && renderKeys()}
      {tab === "webhooks"  && renderWebhooks()}
      {tab === "logs"      && renderLogs()}
    </div>
  );
}
