"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Terminal as TerminalIcon,
  Play,
  Pause,
  Trash2,
  Download,
  Search,
  Filter,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import type { OpsLogItem } from "@/app/api/ops/telemetry/route";

interface Props {
  logs: OpsLogItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

type CategoryFilter = "ALL" | "AUTH" | "BILLING" | "SCAN" | "EMAIL" | "SECURITY" | "SYSTEM";

export default function OpsTerminal({ logs, isLoading, onRefresh }: Props) {
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Filter logs based on category and search query
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchCat = category === "ALL" || log.category === category;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.category.toLowerCase().includes(q) ||
        log.level.toLowerCase().includes(q) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(q))
      );
    });
  }, [logs, category, searchQuery]);

  // Handle auto-scrolling
  useEffect(() => {
    if (autoScroll && !isPaused && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs, autoScroll, isPaused]);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function handleDownloadLogs() {
    const raw = filteredLogs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.level}] [${l.category}] ${l.message} ${
            l.details ? JSON.stringify(l.details) : ""
          }`
      )
      .join("\n");
    const blob = new Blob([raw], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `urpass-ops-telemetry-${new Date().toISOString().slice(0, 19)}.log`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col bg-[#0b0914] border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* ── Terminal Header Bar ── */}
      <div className="bg-[#120e24] px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          {/* Mac-style traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/60" />
          </div>

          <div className="flex items-center gap-2 text-white/80 font-bold">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-white text-xs">urpass-ops-telemetry-daemon</span>
            <span className="text-white/30 text-[10px]">~ tail -f /var/log/system.log</span>
          </div>
        </div>

        {/* Live streaming indicator & quick actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
            <div
              className={`w-2 h-2 rounded-full ${
                isPaused
                  ? "bg-amber-400"
                  : "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              }`}
            />
            <span
              className={`text-[10px] font-bold tracking-wider ${
                isPaused ? "text-amber-300" : "text-emerald-400"
              }`}
            >
              {isPaused ? "STREAM PAUSED" : "LIVE FEED"}
            </span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume live stream" : "Pause live stream"}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadLogs}
            title="Export logs as .log file"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Terminal Controls & Filters Bar ── */}
      <div className="bg-[#0e0c1a] px-4 py-2.5 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(["ALL", "AUTH", "BILLING", "SCAN", "EMAIL", "SECURITY", "SYSTEM"] as CategoryFilter[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  category === cat
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-transparent"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Search bar & autoscroll toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/30 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search telemetry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-[11px] text-white placeholder-white/30 focus:outline-hidden focus:border-emerald-400 w-40 sm:w-56 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-[10px]"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
              autoScroll
                ? "bg-white/10 text-white border border-white/20"
                : "bg-white/5 text-white/40 hover:text-white/60"
            }`}
          >
            <ArrowDown className="w-3 h-3" />
            Autoscroll
          </button>
        </div>
      </div>

      {/* ── Terminal Body (Log stream) ── */}
      <div
        ref={terminalContainerRef}
        className="h-96 sm:h-[480px] overflow-y-auto p-4 space-y-1.5 select-text scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-[#080611]"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/30 gap-2">
            <TerminalIcon className="w-8 h-8 text-white/20" />
            <p>No telemetry events matched the selected filter.</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const date = new Date(log.timestamp);
            const timeStr = date.toLocaleTimeString("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            const ms = String(date.getMilliseconds()).padStart(3, "0");

            const levelColor =
              log.level === "SUCCESS"
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : log.level === "WARN"
                ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                : log.level === "ERROR"
                ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                : "text-sky-400 bg-sky-500/10 border-sky-500/30";

            const catColor =
              log.category === "SCAN"
                ? "text-teal-300"
                : log.category === "BILLING"
                ? "text-amber-300"
                : log.category === "AUTH"
                ? "text-indigo-300"
                : log.category === "EMAIL"
                ? "text-purple-300"
                : log.category === "SECURITY"
                ? "text-rose-300"
                : "text-white/70";

            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id || index}
                className="group flex flex-col hover:bg-white/[0.03] rounded-md px-2 py-1 transition-colors border border-transparent hover:border-white/5"
              >
                <div className="flex items-start gap-2.5 leading-relaxed">
                  {/* Line index */}
                  <span className="text-white/20 select-none w-6 text-right shrink-0">
                    {index + 1}
                  </span>

                  {/* Timestamp */}
                  <span className="text-white/40 shrink-0 select-none">
                    [{timeStr}.{ms}]
                  </span>

                  {/* Level Tag */}
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold border shrink-0 ${levelColor}`}
                  >
                    {log.level}
                  </span>

                  {/* Category Tag */}
                  <span className={`font-bold shrink-0 text-[10px] uppercase ${catColor}`}>
                    [{log.category}]
                  </span>

                  {/* Log Message */}
                  <span className="text-white/90 break-all flex-1">{log.message}</span>

                  {/* Actions (Copy / Expand) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => handleCopy(log.message, log.id)}
                      title="Copy log line"
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/60 hover:text-white"
                    >
                      {copiedId === log.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    {log.details && (
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[9px] text-white/70"
                      >
                        {isExpanded ? "hide json" : "view json"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded JSON details */}
                {isExpanded && log.details && (
                  <pre className="mt-1.5 ml-14 p-2.5 bg-black/60 border border-white/10 rounded-md text-[10px] text-emerald-300 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            );
          })
        )}

        {/* Blinking prompt line at bottom */}
        <div className="flex items-center gap-2 text-emerald-400/80 pt-2 select-none">
          <span className="text-emerald-500 font-bold">ops@urpass-cluster:~$</span>
          <span className="animate-pulse">_</span>
        </div>

        <div ref={terminalEndRef} />
      </div>

      {/* ── Terminal Footer Status ── */}
      <div className="bg-[#120e24] px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40">
        <span>Showing {filteredLogs.length} of {logs.length} telemetry records</span>
        <span className="flex items-center gap-2">
          <span>Buffer: OK</span>
          <span>•</span>
          <span>Encoding: UTF-8</span>
        </span>
      </div>
    </div>
  );
}
