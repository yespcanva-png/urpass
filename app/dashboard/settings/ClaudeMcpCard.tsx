"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Radio,
} from "lucide-react";

type ConnectionStatus = "loading" | "connected" | "not_connected" | "setup_required" | "error";

interface ConnectionDetails {
  connected: boolean;
  clientId?: string;
  organizationId?: string | null;
  scopes?: string[];
  createdAt?: string;
  lastUsedAt?: string | null;
}

export function ClaudeMcpCard() {
  const [status, setStatus] = useState<ConnectionStatus>("loading");
  const [details, setDetails] = useState<ConnectionDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const mcpUrl = "https://mcp.urpass.space/mcp";
  const claudeSettingsUrl = "https://claude.ai/settings/connectors";

  // Fetch actual verified backend status
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/oauth/status", { cache: "no-store" });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = await res.json();
      if (data.connected) {
        setStatus("connected");
        setDetails(data);
      } else {
        setStatus("not_connected");
        setDetails(null);
      }
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Re-check status on window focus (when user returns from Claude auth tab)
  useEffect(() => {
    const onFocus = () => {
      checkStatus();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [checkStatus]);

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(mcpUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  async function handleConnectToClaude() {
    // 1. Copy MCP endpoint to clipboard
    try {
      await navigator.clipboard.writeText(mcpUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard copy fallback
    }

    // 2. Open official Claude connector settings
    window.open(claudeSettingsUrl, "_blank", "noopener,noreferrer");

    // 3. User feedback explaining the step
    setActionNotice(
      "Copied endpoint to clipboard! In the Claude settings tab that just opened, select 'Add Custom Connector', paste the URL, and sign in to approve."
    );

    // 4. Poll status for the next 60 seconds
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      await checkStatus();
      if (attempts >= 15) clearInterval(interval);
    }, 4000);
  }

  async function handleDisconnect() {
    if (!confirm("Are you sure you want to disconnect Claude? This will revoke active OAuth tokens.")) {
      return;
    }
    setDisconnecting(true);
    try {
      const res = await fetch("/api/oauth/status", { method: "DELETE" });
      if (res.ok) {
        setStatus("not_connected");
        setDetails(null);
        setActionNotice("Claude disconnected successfully. Active tokens were revoked.");
      }
    } catch {
      alert("Failed to disconnect. Please try again.");
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#D97706]/10 border border-[#D97706]/20 flex items-center justify-center shrink-0">
            {/* Claude Anthropic Star Symbol */}
            <svg
              className="w-6 h-6 text-[#D97706]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-label="Claude"
            >
              <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">Claude by Anthropic</h3>
              {/* Dynamic Status Badge */}
              {status === "loading" && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  Checking
                </span>
              )}
              {status === "connected" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              )}
              {status === "not_connected" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  Not connected
                </span>
              )}
              {status === "setup_required" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Setup required
                </span>
              )}
              {status === "error" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Connection error
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">Manage your UrPass events with Claude.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {status === "connected" ? (
            <>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy URL"}
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {disconnecting ? "Disconnecting..." : "Disconnect"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy MCP URL"}
              </button>
              <button
                type="button"
                onClick={handleConnectToClaude}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-black rounded-xl transition shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Connect to Claude
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start justify-between gap-2">
          <span>{actionNotice}</span>
          <button
            onClick={() => setActionNotice(null)}
            className="text-amber-700 hover:text-amber-950 font-bold shrink-0 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Connected Details (if active) */}
      {status === "connected" && details && (
        <div className="mb-4 p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Authorized via OAuth 2.0 with scopes:{" "}
              <code className="font-mono text-[11px] bg-white/80 px-1 py-0.5 rounded border border-emerald-200">
                {details.scopes?.join(", ") || "full access"}
              </code>
            </span>
          </div>
          {details.lastUsedAt && (
            <span className="text-[11px] text-emerald-800 font-medium">
              Last active: {new Date(details.lastUsedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      )}

      {/* Compact Expandable Instructions */}
      <div className="pt-3 border-t border-neutral-100">
        <button
          type="button"
          onClick={() => setInstructionsOpen(!instructionsOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-600 hover:text-neutral-900 py-1 transition cursor-pointer"
        >
          <span>Setup instructions &amp; prompts</span>
          {instructionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {instructionsOpen && (
          <div className="mt-3 space-y-3 text-xs text-neutral-600">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-2">
              <p className="font-semibold text-neutral-800">Connection Endpoint:</p>
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-neutral-200 font-mono text-[11px]">
                <span className="text-neutral-800 truncate select-all">{mcpUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="text-neutral-500 hover:text-neutral-800 cursor-pointer ml-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                1. Open <a href={claudeSettingsUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-medium">Claude Settings → Connectors</a><br />
                2. Click <strong>Add Custom Connector</strong> and paste the endpoint above.<br />
                3. Authorize with your UrPass account.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Example Prompts:
              </p>
              <div className="space-y-1.5">
                {[
                  "Create a New Year celebration for 500 guests on January 1, add VIP tickets at ₹999 and regular tickets at ₹299.",
                  "Show today's registrations and check-in rate for my event.",
                  "Run a pre-flight readiness check before publishing my event.",
                  "Publish my draft event once tickets are confirmed.",
                ].map((prompt) => (
                  <div
                    key={prompt}
                    onClick={() => navigator.clipboard.writeText(prompt)}
                    className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-100 text-[11px] text-neutral-700 italic cursor-pointer transition flex items-center justify-between group"
                  >
                    <span>“{prompt}”</span>
                    <span className="text-[10px] text-neutral-400 group-hover:text-neutral-700 font-sans not-italic">
                      Copy
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
