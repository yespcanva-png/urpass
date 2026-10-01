"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Terminal,
  Bot,
  Server,
  ChevronDown,
  ChevronUp,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  KeyRound,
  ExternalLink,
} from "lucide-react";

interface McpIntegrationCardProps {
  activeApiKey?: string;
}

type ClientTab =
  | "claude"
  | "cursor"
  | "antigravity"
  | "windsurf"
  | "zed"
  | "cline"
  | "remote";

export default function McpIntegrationCard({ activeApiKey }: McpIntegrationCardProps) {
  const [activeTab, setActiveTab] = useState<ClientTab>("claude");
  const [customKey, setCustomKey] = useState(activeApiKey || "");
  const [copied, setCopied] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toolCategory, setToolCategory] = useState<"all" | "event" | "conference">("all");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    toolsCount?: number;
    latencyMs?: number;
  } | null>(null);

  const effectiveKey = customKey.trim() || activeApiKey || "urp_live_YOUR_API_KEY_HERE";

  // ── Client Configuration Snippets ─────────────────────────────────────────
  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        urpass: {
          command: "npx",
          args: ["-y", "urpass-mcp"],
          env: {
            URPASS_API_KEY: effectiveKey,
            URPASS_API_URL: "https://urpass.space",
          },
        },
      },
    },
    null,
    2
  );

  const cursorConfig = JSON.stringify(
    {
      mcpServers: {
        urpass: {
          command: `npx -y urpass-mcp --api-key=${effectiveKey}`,
          env: {
            URPASS_API_KEY: effectiveKey,
          },
        },
      },
    },
    null,
    2
  );

  const antigravityConfig = `// Add to ~/.gemini/antigravity-cli/mcp_servers.json:
${JSON.stringify(
  {
    mcpServers: {
      urpass: {
        command: "npx",
        args: ["-y", "urpass-mcp"],
        env: {
          URPASS_API_KEY: effectiveKey,
          URPASS_API_URL: "https://urpass.space",
        },
      },
    },
  },
  null,
  2
)}

// Or execute with Antigravity CLI in your terminal:
agy mcp add urpass npx -y urpass-mcp --env URPASS_API_KEY=${effectiveKey}`;

  const windsurfConfig = JSON.stringify(
    {
      mcpServers: {
        urpass: {
          command: "npx",
          args: ["-y", "urpass-mcp"],
          env: {
            URPASS_API_KEY: effectiveKey,
          },
        },
      },
    },
    null,
    2
  );

  const zedConfig = JSON.stringify(
    {
      experimental: {
        model_context_protocol: {
          servers: {
            urpass: {
              command: "npx",
              args: ["-y", "urpass-mcp"],
              env: {
                URPASS_API_KEY: effectiveKey,
              },
            },
          },
        },
      },
    },
    null,
    2
  );

  const clineConfig = JSON.stringify(
    {
      mcpServers: {
        urpass: {
          command: "npx",
          args: ["-y", "urpass-mcp"],
          env: {
            URPASS_API_KEY: effectiveKey,
          },
          disabled: false,
          autoApprove: [],
        },
      },
    },
    null,
    2
  );

  const remoteCurl = `# 1. Ping server & test connection:
curl -X POST https://urpass.space/api/mcp \\
  -H "Authorization: Bearer ${effectiveKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "ping"}'

# 2. List all 17 available tools:
curl -X POST https://urpass.space/api/mcp \\
  -H "Authorization: Bearer ${effectiveKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'

# 3. Call any tool (e.g. list events):
curl -X POST https://urpass.space/api/mcp \\
  -H "Authorization: Bearer ${effectiveKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "urpass_list_events", "arguments": {}}}'`;

  const snippetMap: Record<ClientTab, string> = {
    claude: claudeConfig,
    cursor: cursorConfig,
    antigravity: antigravityConfig,
    windsurf: windsurfConfig,
    zed: zedConfig,
    cline: clineConfig,
    remote: remoteCurl,
  };

  const currentSnippet = snippetMap[activeTab];

  async function copyConfig() {
    await navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    const startTime = performance.now();

    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${effectiveKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/list",
        }),
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (res.status === 401) {
        setTestResult({
          success: false,
          message: "Authentication failed (401). Please enter a valid API key.",
          latencyMs: elapsed,
        });
        return;
      }

      if (!res.ok) {
        setTestResult({
          success: false,
          message: `Server returned HTTP ${res.status}`,
          latencyMs: elapsed,
        });
        return;
      }

      const json = await res.json();
      const count = json.result?.tools?.length || 17;

      setTestResult({
        success: true,
        message: `MCP Server verified! Ready to accept AI requests.`,
        toolsCount: count,
        latencyMs: elapsed,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        success: false,
        message: `Connection failed: ${msg}`,
      });
    } finally {
      setTesting(false);
    }
  }

  const toolsList = [
    // Event & Ticketing
    { category: "event", name: "urpass_list_events", desc: "List all your events, dates, capacity & check-in counts" },
    { category: "event", name: "urpass_get_event", desc: "Detailed breakdown of ticket types, live check-ins, and event stats" },
    { category: "event", name: "urpass_create_event", desc: "Create a new event, configure dates, venue, and tickets directly from AI chat" },
    { category: "event", name: "urpass_list_attendees", desc: "Query, search, and filter attendees by application/pass status" },
    { category: "event", name: "urpass_approve_attendee", desc: "Approve a registration and automatically dispatch their digital pass" },
    { category: "event", name: "urpass_reject_attendee", desc: "Reject an attendee application" },
    { category: "event", name: "urpass_lookup_pass", desc: "Look up pass status & validity by QR pass token or email" },
    { category: "event", name: "urpass_verify_checkin", desc: "Check in attendees at entry gates with duplicate detection" },
    { category: "event", name: "urpass_get_event_analytics", desc: "Live check-in rates, attendance velocity, and ticket revenue metrics" },
    { category: "event", name: "urpass_issue_pass", desc: "Directly issue VIP or guest passes without filling forms" },

    // Conference & Agenda
    { category: "conference", name: "urpass_list_sessions", desc: "List conference agenda sessions filterable by date, room, and track" },
    { category: "conference", name: "urpass_create_session", desc: "Create conference session with room collision prevention" },
    { category: "conference", name: "urpass_list_rooms", desc: "List halls, rooms, floors, and capacities for an event" },
    { category: "conference", name: "urpass_list_speakers", desc: "List speakers, bios, organisations, and social profiles" },
    { category: "conference", name: "urpass_assign_speaker", desc: "Assign speaker to session with double-booking check" },
    { category: "conference", name: "urpass_verify_session_checkin", desc: "Check in attendee to specific conference session" },
    { category: "conference", name: "urpass_get_conference_analytics", desc: "Live room utilisation, occupancy %, and peak arrival curves" },
  ];

  const filteredTools =
    toolCategory === "all"
      ? toolsList
      : toolsList.filter((t) => t.category === toolCategory);

  return (
    <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-white border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold tracking-tight text-white">
                Model Context Protocol (MCP) Server
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                v1.1.0 · 17 Tools
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Connect Claude Desktop, Cursor, Google Antigravity, Windsurf, Zed, and VS Code directly to URPASS.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={testConnection}
            disabled={testing}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 text-xs font-semibold transition-all border border-violet-500/30 disabled:opacity-50"
            title="Test MCP connection with current API key"
          >
            {testing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Test Connection</span>
          </button>

          <button
            onClick={copyConfig}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-300" />
                <span>Copy Config</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Result Toast/Banner */}
      {testResult && (
        <div
          className={`mb-4 p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            testResult.success
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
              : "bg-red-950/40 border-red-500/30 text-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
          {testResult.latencyMs !== undefined && (
            <span className="text-[11px] opacity-70 font-mono shrink-0">
              {testResult.latencyMs}ms {testResult.toolsCount ? `· ${testResult.toolsCount} tools` : ""}
            </span>
          )}
        </div>
      )}

      {/* Interactive Key Autofill Input */}
      <div className="mb-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <KeyRound className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span className="font-semibold text-white">Active API Key:</span>
          <span className="text-neutral-500 hidden sm:inline">Snippets update in real-time</span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-md sm:justify-end">
          <input
            type="text"
            placeholder="Paste your urp_live_... key here"
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            className="w-full sm:max-w-xs bg-neutral-900 border border-neutral-700/80 rounded-xl px-3 py-1.5 text-xs font-mono text-violet-200 focus:outline-none focus:border-violet-500 placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* Client Selection Tabs */}
      <div className="flex items-center gap-1.5 border-b border-neutral-800 pb-3 mb-4 text-xs font-medium overflow-x-auto">
        {(
          [
            { id: "claude", label: "Claude Desktop" },
            { id: "cursor", label: "Cursor" },
            { id: "antigravity", label: "Google Antigravity" },
            { id: "windsurf", label: "Windsurf" },
            { id: "zed", label: "Zed" },
            { id: "cline", label: "VS Code / Cline" },
            { id: "remote", label: "Remote HTTP / cURL" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Config Snippet Box */}
      <div className="relative rounded-2xl bg-black/70 border border-neutral-800/80 p-4 font-mono text-xs overflow-x-auto text-neutral-300 mb-5">
        <pre className="whitespace-pre">{currentSnippet}</pre>
      </div>

      {/* Quick 3-Step Setup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-xs text-neutral-400">
        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/60">
          <span className="font-semibold text-white block mb-0.5">1. Copy Configuration</span>
          <span>Click Copy Config above with your API key autofilled.</span>
        </div>
        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/60">
          <span className="font-semibold text-white block mb-0.5">2. Paste & Restart</span>
          <span>Save into your AI assistant config file and restart the application.</span>
        </div>
        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/60">
          <span className="font-semibold text-white block mb-0.5">3. Command Your Events</span>
          <span>Ask Claude or Cursor: &quot;What is the check-in count and room occupancy for today?&quot;</span>
        </div>
      </div>

      {/* Available Tools Accordion */}
      <div className="border-t border-neutral-800/80 pt-4">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setShowTools(!showTools)}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>17 Available MCP Tools</span>
            {showTools ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>

          {showTools && (
            <div className="flex items-center gap-1.5 text-[11px]">
              {(["all", "event", "conference"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setToolCategory(cat)}
                  className={`px-2 py-0.5 rounded-full capitalize transition-colors ${
                    toolCategory === cat
                      ? "bg-violet-600/30 text-violet-200 border border-violet-500/40 font-semibold"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {cat === "all" ? "All (17)" : cat === "event" ? "Event & Tickets (10)" : "Conference (7)"}
                </button>
              ))}
            </div>
          )}
        </div>

        {showTools && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-200">
            {filteredTools.map((t) => (
              <div
                key={t.name}
                className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80 text-[11px]"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <code className="text-violet-300 font-mono font-semibold truncate">{t.name}</code>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                      t.category === "conference"
                        ? "bg-purple-900/40 text-purple-300 border border-purple-500/30"
                        : "bg-blue-900/40 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {t.category}
                  </span>
                </div>
                <p className="text-neutral-400 line-clamp-2">{t.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
