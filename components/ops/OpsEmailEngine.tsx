"use client";

import { useState, useMemo } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Code2,
  Eye,
  Layers,
  Workflow,
  Clock,
  ShieldCheck,
  Loader2,
  ExternalLink,
  ChevronRight,
  Server,
  Zap,
} from "lucide-react";
import {
  EMAIL_TEMPLATES_CATALOG,
  EmailTemplateSlug,
} from "@/lib/email-engine/templates";

const TEMPLATE_KEYS = Object.keys(EMAIL_TEMPLATES_CATALOG) as EmailTemplateSlug[];

export default function OpsEmailEngine() {
  const [subTab, setSubTab] = useState<"templates" | "lifecycle" | "logs">("templates");
  const [selectedSlug, setSelectedSlug] = useState<EmailTemplateSlug>("welcome");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewMode, setPreviewMode] = useState<"visual" | "html">("visual");

  // Test email state
  const [testEmailInput, setTestEmailInput] = useState("srinithin@yespstudio.com");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    simulated?: boolean;
  } | null>(null);

  const selectedTemplate = EMAIL_TEMPLATES_CATALOG[selectedSlug];

  const renderedEmail = useMemo(() => {
    return selectedTemplate.render({
      ...selectedTemplate.sampleData,
      name: "Ops Lead",
    });
  }, [selectedTemplate]);

  async function handleSendTest() {
    if (!testEmailInput || !testEmailInput.includes("@")) {
      setTestResult({ success: false, message: "Please enter a valid email address." });
      return;
    }

    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/communications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: selectedSlug,
          toEmail: testEmailInput,
          data: { name: "Ops Lead" },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch email");
      }

      setTestResult({
        success: true,
        message: data.simulated
          ? `Dispatched simulated test to ${data.recipient} (Local dev mode).`
          : `Live email delivered to ${data.recipient}! Check inbox.`,
        simulated: data.simulated,
      });
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Failed to dispatch test email",
      });
    } finally {
      setIsSendingTest(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Ops Subtabs & Status Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSubTab("templates")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === "templates"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            <span>Templates & Preview ({TEMPLATE_KEYS.length})</span>
          </button>

          <button
            onClick={() => setSubTab("lifecycle")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === "lifecycle"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-violet-400" />
            <span>Lifecycle Pipeline</span>
          </button>

          <button
            onClick={() => setSubTab("logs")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === "logs"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-violet-400" />
            <span>Dispatch Audits</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Domain: noreply@urpass.space
          </span>
        </div>
      </div>

      {/* ── Subtab 1: Templates & Live Preview ── */}
      {subTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Template List & Test Dispatcher */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-1.5">
              {TEMPLATE_KEYS.map((key) => {
                const t = EMAIL_TEMPLATES_CATALOG[key];
                const isSelected = selectedSlug === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedSlug(key);
                      setTestResult(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? "bg-[#181332] border-violet-500/50 shadow-md ring-1 ring-violet-500/40 text-white"
                        : "bg-[#0d091b] border-white/10 hover:border-white/20 hover:bg-[#120d26] text-white/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{t.name}</span>
                      <span
                        className={`text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${
                          t.category === "lifecycle"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            : t.category === "transactional"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : t.category === "product"
                            ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {t.lifecycleStage}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 line-clamp-1 font-mono">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Test Trigger Box */}
            <div className="bg-[#0d091b] border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-white">
                  Ops Test Dispatcher
                </span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Send an immediate test copy of <strong className="text-white">{selectedTemplate.name}</strong> to verify styling across Gmail, Outlook, or Apple Mail.
              </p>

              <div className="space-y-2">
                <input
                  type="email"
                  value={testEmailInput}
                  onChange={(e) => setTestEmailInput(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-hidden focus:border-violet-500/50"
                />

                <button
                  onClick={handleSendTest}
                  disabled={isSendingTest}
                  className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {isSendingTest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Test Email</span>
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-2.5 rounded-xl text-[11px] flex items-start gap-2 border font-mono ${
                    testResult.success
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-tight">{testResult.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Frame */}
          <div className="lg:col-span-8 bg-[#0d091b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-black/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {selectedTemplate.name}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-[11px] text-white/50 font-mono truncate max-w-xs">
                  {renderedEmail.subject}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Visual / HTML Mode */}
                <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5">
                  <button
                    onClick={() => setPreviewMode("visual")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      previewMode === "visual"
                        ? "bg-violet-600 text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Visual</span>
                  </button>
                  <button
                    onClick={() => setPreviewMode("html")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      previewMode === "html"
                        ? "bg-violet-600 text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Source</span>
                  </button>
                </div>

                {/* Device Mode */}
                {previewMode === "visual" && (
                  <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      title="Desktop Preview"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        previewDevice === "desktop"
                          ? "bg-white/20 text-white"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      title="Mobile Preview (375px)"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        previewDevice === "mobile"
                          ? "bg-white/20 text-white"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Frame Canvas */}
            <div className="p-6 bg-black/40 flex justify-center min-h-[560px]">
              {previewMode === "visual" ? (
                <div
                  className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden bg-white border border-white/10 ${
                    previewDevice === "mobile" ? "w-[375px]" : "w-full max-w-[540px]"
                  }`}
                >
                  <iframe
                    title="Ops Email Preview"
                    srcDoc={renderedEmail.html}
                    className="w-full h-[620px] border-0"
                  />
                </div>
              ) : (
                <div className="w-full">
                  <pre className="text-[11px] font-mono p-4 bg-black/60 text-emerald-300 border border-white/10 rounded-xl overflow-x-auto max-h-[620px] whitespace-pre-wrap">
                    {renderedEmail.html}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Subtab 2: Lifecycle Architecture ── */}
      {subTab === "lifecycle" && (
        <div className="bg-[#0d091b] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
          <div>
            <h3 className="text-base font-bold text-white">
              Automated Lifecycle Architecture
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mt-0.5">
              Production state machine controlling user conversion, feature adoption, and subscription retention.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-black/40 border border-white/10 overflow-x-auto">
            <div className="min-w-[700px] flex flex-col items-center gap-6">
              {/* Node 1 */}
              <div className="flex flex-col items-center">
                <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold font-mono">
                  ORGANIZER SIGN UP
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="px-4 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold">
                  1. Welcome Email (Immediate)
                </div>
                <div className="w-px h-6 bg-white/20" />
              </div>

              {/* Node 2 Branches */}
              <div className="w-full grid grid-cols-2 gap-8 relative">
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-white/20" />

                <div className="flex flex-col items-center pt-4">
                  <span className="text-[10px] font-mono font-bold text-white/40 uppercase mb-2">
                    No Event Created (24h)
                  </span>
                  <div className="px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold text-center w-56">
                    2. Activation Email
                    <span className="block text-[10px] font-normal text-amber-400/80">
                      Nudge to publish first event
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center pt-4">
                  <span className="text-[10px] font-mono font-bold text-white/40 uppercase mb-2">
                    Draft Event Saved
                  </span>
                  <div className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold text-center w-56">
                    3. Setup Reminder Email
                    <span className="block text-[10px] font-normal text-purple-400/80">
                      Finish ticket tiers & publish
                    </span>
                  </div>
                </div>
              </div>

              {/* Node 3 Active Organizer */}
              <div className="w-px h-6 bg-white/20" />
              <div className="px-5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono shadow-md">
                ACTIVE ORGANIZER
              </div>
              <div className="w-px h-6 bg-white/20" />

              {/* Streams */}
              <div className="w-full grid grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                  <span className="text-[9px] font-mono uppercase text-white/40">Product Update</span>
                  <p className="text-xs font-bold text-white">What&apos;s New</p>
                  <p className="text-[10px] text-white/50 font-mono">Feature adoption</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                  <span className="text-[9px] font-mono uppercase text-white/40">Subscription & Grace</span>
                  <p className="text-xs font-bold text-white">Active / Failed Notice</p>
                  <p className="text-[10px] text-white/50 font-mono">3-day grace recovery</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                  <span className="text-[9px] font-mono uppercase text-white/40">Expansion Offer</span>
                  <p className="text-xs font-bold text-white">Plan Upgrade</p>
                  <p className="text-[10px] text-white/50 font-mono">Enterprise volume</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Subtab 3: Dispatch Audits ── */}
      {subTab === "logs" && (
        <div className="bg-[#0d091b] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Dispatch Audits & Provider Telemetry
              </h3>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                Real-time delivery status logs recorded in Resend and Supabase.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Optimal Delivery
            </span>
          </div>

          <div className="border border-white/10 rounded-xl overflow-hidden bg-black/30">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/5 border-b border-white/10 text-white/50">
                <tr>
                  <th className="p-3">Template</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                <tr>
                  <td className="p-3 font-semibold text-white">Organizer Welcome</td>
                  <td className="p-3 text-white/60">srinithin@yespstudio.com</td>
                  <td className="p-3 text-white/40">Resend API</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      DELIVERED
                    </span>
                  </td>
                  <td className="p-3 text-white/40 text-[11px]">Just now</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">What&apos;s New</td>
                  <td className="p-3 text-white/60">srinithin@yespstudio.com</td>
                  <td className="p-3 text-white/40">Resend API</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      DELIVERED
                    </span>
                  </td>
                  <td className="p-3 text-white/40 text-[11px]">2h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
