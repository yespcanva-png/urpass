"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Terminal, Bot, Server, ChevronDown, ChevronUp } from "lucide-react";

export default function McpIntegrationCard() {
  const [activeTab, setActiveTab] = useState<"claude" | "cursor" | "remote">("claude");
  const [copied, setCopied] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        urpass: {
          command: "npx",
          args: ["-y", "urpass-mcp"],
          env: {
            URPASS_API_KEY: "urp_live_YOUR_API_KEY_HERE",
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
          command: "npx -y urpass-mcp",
          env: {
            URPASS_API_KEY: "urp_live_YOUR_API_KEY_HERE",
          },
        },
      },
    },
    null,
    2
  );

  const remoteCurl = `# Initialize MCP session via HTTP / SSE
curl -X POST https://urpass.space/api/mcp \\
  -H "Authorization: Bearer urp_live_YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'`;

  const currentSnippet =
    activeTab === "claude" ? claudeConfig : activeTab === "cursor" ? cursorConfig : remoteCurl;

  async function copyConfig() {
    await navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const toolsList = [
    { name: "urpass_list_events", desc: "List all your events, dates, capacity & check-in counts" },
    { name: "urpass_get_event", desc: "Detailed breakdown of ticket types, live check-ins, and event stats" },
    { name: "urpass_create_event", desc: "Create a new event, configure dates, venue, and tickets directly from AI chat" },
    { name: "urpass_list_attendees", desc: "Query, search, and filter attendees by application/pass status" },
    { name: "urpass_approve_attendee", desc: "Approve a registration and automatically dispatch their digital pass" },
    { name: "urpass_reject_attendee", desc: "Reject an application" },
    { name: "urpass_lookup_pass", desc: "Look up pass status & validity by QR pass token or email" },
    { name: "urpass_verify_checkin", desc: "Check in attendees at entry gates with duplicate detection" },
    { name: "urpass_get_event_analytics", desc: "Live check-in rates, attendance velocity, and ticket revenue metrics" },
    { name: "urpass_issue_pass", desc: "Directly issue VIP or guest passes without filling forms" },
  ];

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-white">
                Model Context Protocol (MCP)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                AI Agent Support
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Connect Claude Desktop, Cursor, Antigravity, and Zed directly to your URPASS events.
            </p>
          </div>
        </div>

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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab("claude")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "claude"
              ? "bg-violet-600 text-white font-semibold"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          Claude Desktop
        </button>
        <button
          onClick={() => setActiveTab("cursor")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "cursor"
              ? "bg-violet-600 text-white font-semibold"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          Cursor (.cursor/mcp.json)
        </button>
        <button
          onClick={() => setActiveTab("remote")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "remote"
              ? "bg-violet-600 text-white font-semibold"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          Remote HTTP / SSE
        </button>
      </div>

      {/* Code Snippet Box */}
      <div className="relative rounded-2xl bg-black/60 border border-neutral-800/80 p-4 font-mono text-xs overflow-x-auto text-neutral-300 mb-5">
        <pre className="whitespace-pre">{currentSnippet}</pre>
      </div>

      {/* How it works info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs text-neutral-400">
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60">
          <span className="font-semibold text-white block mb-0.5">1. Generate Key</span>
          <span>Create an API key above and replace `YOUR_API_KEY_HERE`.</span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60">
          <span className="font-semibold text-white block mb-0.5">2. Paste Config</span>
          <span>Add snippet to your AI app config and restart your client.</span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60">
          <span className="font-semibold text-white block mb-0.5">3. Chat with Urpass</span>
          <span>Ask Claude or Cursor: &quot;What is the check-in count for my summit?&quot;</span>
        </div>
      </div>

      {/* Available Tools Accordion */}
      <div className="border-t border-neutral-800/80 pt-4">
        <button
          type="button"
          onClick={() => setShowTools(!showTools)}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>10 Available AI Agent Tools</span>
          </span>
          {showTools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTools && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-200">
            {toolsList.map((t) => (
              <div
                key={t.name}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px]"
              >
                <code className="text-violet-300 font-mono font-semibold">{t.name}</code>
                <p className="text-neutral-400 mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
