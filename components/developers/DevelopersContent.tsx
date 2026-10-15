"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import { cn } from "@/lib/utils";
import { detectCountryClient } from "@/lib/country-config";
import {
  Code2,
  Terminal,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Server,
  Activity,
  Webhook,
  KeyRound,
  ExternalLink,
  Plus,
  Minus,
  Clock,
  Radio,
  FileCode,
  Lock,
  ChevronRight,
  Database,
  Cpu,
  Boxes,
  HelpCircle,
  QrCode,
  Shield,
} from "lucide-react";

export default function DevelopersContent() {
  const [country, setCountry] = useState<"IN" | "GB">("IN");
  const [activeCodeTab, setActiveCodeTab] = useState<"issue" | "verify" | "webhook" | "mcp">("issue");
  const [codeLang, setCodeLang] = useState<"typescript" | "curl" | "python">("typescript");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const detected = detectCountryClient();
    if (detected === "GB") setCountry("GB");

    const onCountryChanged = (e: Event) => {
      const custom = e as CustomEvent<{ country: "IN" | "GB" }>;
      if (custom.detail?.country) setCountry(custom.detail.country);
    };
    window.addEventListener("urpass_country_changed", onCountryChanged);
    return () => window.removeEventListener("urpass_country_changed", onCountryChanged);
  }, []);

  const isUk = country === "GB";

  // Code snippets by action and language
  const codeSnippets: Record<
    "issue" | "verify" | "webhook" | "mcp",
    Record<"typescript" | "curl" | "python", string>
  > = {
    issue: {
      typescript: `// Issue a cryptographic QR pass via UrPass API
import { UrPassClient } from "@urpass/sdk";

const urpass = new UrPassClient({
  apiKey: process.env.URPASS_API_KEY, // urp_live_...
});

const pass = await urpass.passes.issue({
  eventId: "evt_98a72df1-4321-4a1b",
  name: "Dr. Sarah Jenkins",
  email: "sarah.jenkins@ai-summit.org",
  passType: "VIP Delegate",
  metadata: {
    hall: "Grand Ballroom A",
    seat: "Row 3, Seat 12",
  },
});

console.log("Pass Generated:", pass.passToken);
console.log("Live Pass URL:", pass.passUrl);`,
      curl: `# Issue a cryptographic QR pass via cURL
curl -X POST https://urpass.space/api/v1/passes/issue \\
  -H "Authorization: Bearer urp_live_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventId": "evt_98a72df1-4321-4a1b",
    "name": "Dr. Sarah Jenkins",
    "email": "sarah.jenkins@ai-summit.org",
    "passType": "VIP Delegate"
  }'`,
      python: `# Issue a cryptographic QR pass via Python
import requests

response = requests.post(
    "https://urpass.space/api/v1/passes/issue",
    headers={
        "Authorization": "Bearer urp_live_secret_key",
        "Content-Type": "application/json",
    },
    json={
        "eventId": "evt_98a72df1-4321-4a1b",
        "name": "Dr. Sarah Jenkins",
        "email": "sarah.jenkins@ai-summit.org",
        "passType": "VIP Delegate",
    },
)

print(response.json())`,
    },
    verify: {
      typescript: `// Sub-second gate scanner verification
const verification = await urpass.passes.verify({
  passToken: "up_token_88a9df123",
  eventId: "evt_98a72df1-4321-4a1b",
  gateId: "gate_turnstile_1",
});

if (verification.status === "VALID") {
  console.log("Access Granted:", verification.attendee.name);
  console.log("Verification Latency:", verification.latencyMs, "ms");
} else if (verification.status === "DUPLICATE") {
  console.warn("ALREADY SCANNED AT:", verification.checkedInAt);
}`,
      curl: `# Verify gate ticket at entrance turnstile
curl -X POST https://urpass.space/api/v1/passes/verify \\
  -H "Authorization: Bearer urp_live_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "passToken": "up_token_88a9df123",
    "eventId": "evt_98a72df1-4321-4a1b",
    "gateId": "gate_turnstile_1"
  }'`,
      python: `# Verify pass in under 50ms
import requests

check = requests.post(
    "https://urpass.space/api/v1/passes/verify",
    headers={"Authorization": "Bearer urp_live_secret_key"},
    json={
        "passToken": "up_token_88a9df123",
        "eventId": "evt_98a72df1-4321-4a1b",
        "gateId": "gate_turnstile_1",
    },
).json()

if check["status"] == "VALID":
    print(f"Granted: {check['attendee']['name']} in {check['latencyMs']}ms")`,
    },
    webhook: {
      typescript: `// Handle real-time entrance webhook in Next.js / Express
import { verifyUrPassWebhook } from "@urpass/sdk";

export async function POST(req: Request) {
  const signature = req.headers.get("x-urpass-signature");
  const payload = await req.json();

  const event = verifyUrPassWebhook(payload, signature, process.env.URPASS_WEBHOOK_SECRET);

  if (event.type === "checkin.verified") {
    const { attendee, gateId, latencyMs } = event.data;
    // Trigger LED turnstile relay or push to internal university ERP
    await turnstileHardware.unlock(gateId);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}`,
      curl: `# Sample webhook payload dispatched to your endpoint:
# POST https://your-server.com/api/webhooks/urpass
# Header: x-urpass-signature: sha256=9b7f...
{
  "id": "evt_hook_889123",
  "type": "checkin.verified",
  "data": {
    "passToken": "up_token_88a9df123",
    "eventId": "evt_98a72df1",
    "gateId": "gate_1_auditorium",
    "attendee": {
      "name": "Dr. Sarah Jenkins",
      "email": "sarah.jenkins@ai-summit.org"
    },
    "checkedInAt": "2026-10-15T09:42:18.120Z",
    "latencyMs": 42
  }
}`,
      python: `# FastApi / Flask webhook endpoint
from fastapi import FastAPI, Header, HTTPException, Request

app = FastAPI()

@app.post("/webhooks/urpass")
async def handle_urpass_event(request: Request, x_urpass_signature: str = Header(None)):
    payload = await request.json()
    if payload["type"] == "checkin.verified":
        attendee = payload["data"]["attendee"]["name"]
        print(f"Gate Entry Logged: {attendee}")
    return {"status": "ok"}`,
    },
    mcp: {
      typescript: `// Model Context Protocol (MCP) AI Tool Call
// AI Agents (Claude, ChatGPT, cursor) can invoke UrPass natively
{
  "tool": "urpass_verify_checkin",
  "parameters": {
    "eventId": "evt_98a72df1-4321-4a1b",
    "passToken": "up_token_88a9df123",
    "gateId": "auditorium_east"
  }
}

// Or query real-time conference velocity:
{
  "tool": "urpass_get_event_analytics",
  "parameters": {
    "eventId": "evt_98a72df1-4321-4a1b"
  }
}`,
      curl: `# Query UrPass AI MCP endpoint directly
curl -X POST https://urpass.space/api/mcp \\
  -H "Authorization: Bearer urp_live_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "method": "tools/call",
    "params": {
      "name": "urpass_get_event_analytics",
      "arguments": { "eventId": "evt_98a72df1-4321-4a1b" }
    }
  }'`,
      python: `# Call UrPass MCP tools from an agentic pipeline
import requests

result = requests.post(
    "https://urpass.space/api/mcp",
    headers={"Authorization": "Bearer urp_live_secret_key"},
    json={
        "method": "tools/call",
        "params": {
            "name": "urpass_issue_pass",
            "arguments": {
                "eventId": "evt_98a72df1",
                "name": "Alex Vance",
                "email": "alex@mit.edu",
                "passType": "VIP"
            }
        }
    }
).json()

print(result)`,
    },
  };

  const handleCopyCode = () => {
    const text = codeSnippets[activeCodeTab][codeLang];
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npm install @urpass/sdk");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  // 5 Core Infrastructure Pillars
  const infraPillars = [
    {
      icon: QrCode,
      title: "Ticketing & Credential Engine",
      desc: "Generate cryptographically verifiable digital passes with dynamic QR codes, anti-screenshot tokens, and multi-tier categorization.",
      bullets: [
        "Cryptographic token generation & signatures",
        "Configurable capacity caps & inventory release schedules",
        "Bulk pass issuance API (1,000+ passes / batch)",
        "Apple Wallet & Google Wallet pass auto-generation",
      ],
    },
    {
      icon: Zap,
      title: "Access & Identity Infrastructure",
      desc: "Sub-300ms mobile camera scanning and hardware turnstile validation with database-level race condition and anti-passback defense.",
      bullets: [
        "Sub-100ms API response latency guarantee",
        "Concurrent duplicate scan prevention (Pessimistic DB lock)",
        "Multi-gate and operator security PIN routing",
        "Session-level & VIP lounge access permission rules",
      ],
    },
    {
      icon: Layers,
      title: "Registration & Attendee Engine",
      desc: "Headless registration workflows, custom schema validation, group enrollments, and attendee deduplication pipelines.",
      bullets: [
        "Dynamic JSON-schema registration form definitions",
        "Manual approval and instant issuance workflows",
        "CSV data cleansing and pre-registration bulk import",
        "GDPR & privacy-compliant attendee data retention",
      ],
    },
    {
      icon: Server,
      title: "Developer Infrastructure & APIs",
      desc: "Engineered like Stripe and Twilio. Dual sandbox/production keys, signed webhooks, rate limiting, and an AI-native MCP server.",
      bullets: [
        "Dual environments: urp_test_ and urp_live_ keys",
        "HMAC SHA-256 signed real-time webhooks",
        "Model Context Protocol (MCP) server for autonomous agents",
        "SCIM 2.0 protocol for enterprise identity sync",
      ],
    },
    {
      icon: Activity,
      title: "Event Operations & Observability",
      desc: "Real-time telemetry on entrance velocity, gate throughput, scanner battery status, and audit-ready attendance reporting.",
      bullets: [
        "Live scan velocity metrics (scans/sec per gate)",
        "Gate operator activity logs & device telemetry",
        "Offline buffer cache with automatic server reconciliation",
        "Audit-compliant exportable CSV logs & compliance reports",
      ],
    },
    {
      icon: ShieldCheck,
      title: "White-Label & Enterprise Tenancy",
      desc: "Embed UrPass into your proprietary SaaS, agency client portals, or university intranet with total tenant isolation.",
      bullets: [
        "Custom domain mapping (tickets.yourdomain.com)",
        "Full brand customization & custom CSS/templates",
        "Multi-tenant database isolation & organization roles",
        "Custom SLA guarantees & dedicated support engineering",
      ],
    },
  ];

  // Infrastructure Pricing Plans
  const infraPlans = [
    {
      id: "sandbox",
      name: "Developer Sandbox",
      badge: "Free Forever",
      price: isUk ? "£0" : "₹0",
      period: "unlimited test usage",
      desc: "Complete developer access to test passes, build turnstile integrations, and prototype applications.",
      features: [
        "Unlimited sandbox API calls (urp_test_ keys)",
        "100 free test passes issued / month",
        "Real-time webhook test endpoint tester",
        "Full Model Context Protocol (MCP) tool access",
        "Community Discord & GitHub support",
      ],
      cta: "Get Sandbox Keys",
      popular: false,
    },
    {
      id: "starter",
      name: "Starter API",
      badge: "Hackathons & Apps",
      price: isUk ? "£19" : "₹999",
      period: "per month",
      desc: "For small event platforms, university coding clubs, and developer projects needing live QR passes.",
      features: [
        "1,000 live passes issued / month",
        "5,000 gate verification requests",
        "Dual urp_test_ & urp_live_ environment",
        "Basic webhook event triggers",
        "Standard rate limit (10 req/sec)",
        "Extra passes at ₹0.80 / £0.015 each",
      ],
      cta: "Start with Starter API",
      popular: false,
    },
    {
      id: "growth",
      name: "Growth API",
      badge: "Event Platforms & Fests",
      price: isUk ? "£89" : "₹4,999",
      period: "per month",
      desc: "For growing event technology startups, multi-college symposiums, and high-frequency ticketing apps.",
      features: [
        "10,000 live passes issued / month",
        "50,000 gate verification requests",
        "Real-time checkin & duplicate scan webhooks",
        "Multi-gate scanner routing & PINs",
        "Elevated rate limit (50 req/sec)",
        "Sub-150ms verification SLA guarantee",
        "Extra passes at ₹0.50 / £0.009 each",
      ],
      cta: "Launch Growth API",
      popular: true,
    },
    {
      id: "business",
      name: "Business EIaaS",
      badge: "Agencies & Venues",
      price: isUk ? "£249" : "₹14,999",
      period: "per month",
      desc: "For event agencies, exhibition halls, and multi-track conferences requiring high-throughput infrastructure.",
      features: [
        "50,000 live passes issued / month",
        "Unlimited gate verification requests",
        "Sub-100ms database verification lock",
        "Offline-tolerant scanner buffer sync",
        "White-label domain & branded pass layouts",
        "Dedicated webhook queue with retry logic",
        "Priority Slack / WhatsApp developer channel",
      ],
      cta: "Deploy Business EIaaS",
      popular: false,
    },
  ];

  const devFaqs = [
    {
      q: "What is Event Infrastructure as a Service (EIaaS)?",
      a: "EIaaS is the underlying technology layer for events. Instead of using a closed ticketing portal, developers and event agencies use UrPass REST APIs, webhooks, and cryptographic pass engines to issue passes, verify entrance at turnstiles, and manage attendee state directly inside their own applications, ERPs, or custom portals.",
    },
    {
      q: "How fast is the QR pass verification API?",
      a: "UrPass gate verification runs on optimized database constraints and an in-memory token lookup index, routinely returning verification results in 35ms to 80ms. It is engineered specifically to prevent entrance bottlenecks when hundreds of attendees arrive simultaneously.",
    },
    {
      q: "How does UrPass prevent duplicate scans (anti-passback)?",
      a: "UrPass uses atomic database transactions with unique index constraints on check-in records. If the same QR pass is presented at two turnstiles or gates simultaneously, the system rejects the second scan with a 409 DUPLICATE response in under 50ms, identifying the timestamp and gate of first use.",
    },
    {
      q: "Can I test the API before going live?",
      a: "Yes. UrPass provides dual API key environments: test keys ('urp_test_...') and live keys ('urp_live_...'). In the sandbox environment, pass generation, verification, and webhooks are simulated without charging your balance or affecting production reports.",
    },
    {
      q: "Can I embed the smartphone camera scanner in my own app?",
      a: "Yes. In addition to our web-based camera scanner HUD (which runs in any mobile browser on iOS and Android without app store downloads), developers can consume our verification API via standard REST requests from React Native, Flutter, Swift, Kotlin, or hardware turnstiles.",
    },
    {
      q: "Does UrPass support webhooks?",
      a: "Yes. Webhook endpoints receive real-time JSON payloads with HMAC SHA-256 signatures for events like 'checkin.verified', 'checkin.duplicate_detected', 'pass.generated', and 'attendee.approved'.",
    },
    {
      q: "What is the Model Context Protocol (MCP) server?",
      a: "UrPass is the first AI-native event platform equipped with an MCP server (at /api/mcp). This allows AI agents in Claude, Cursor, and ChatGPT to autonomously query event analytics, issue passes, manage room capacities, and verify tickets using natural language.",
    },
    {
      q: "Can universities integrate UrPass with their student portal / ERP?",
      a: "Yes. Universities can use our REST API, SCIM 2.0 protocol, or bulk attendee import pipeline to sync student IDs directly with UrPass gate credentials without manual CSV handling.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col selection:bg-violet-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-24">
        {/* ── HERO SECTION ── */}
        <section className="px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 sm:mb-24">
            {/* Left: Value Proposition */}
            <div className="lg:col-span-7">
              <AnimateIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-violet-950/70 text-violet-300 border border-violet-700/60 mb-5 shadow-2xs">
                  <Terminal className="w-3.5 h-3.5 text-violet-400" />
                  <span>URPASS DEVELOPER PLATFORM · EVENT INFRASTRUCTURE AS A SERVICE</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.1]">
                  The Event Infrastructure for Modern Applications.
                </h1>

                <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-6 max-w-2xl">
                  Stripe powers payments. Twilio powers communications. <strong className="text-white">UrPass powers events.</strong> Issue cryptographic QR passes, verify gate turnstiles in sub-300ms, and stream live event webhooks into your applications with a single API.
                </p>

                {/* Quick install snippet */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 font-mono text-xs text-neutral-300">
                    <span className="text-violet-400">$</span>
                    <span>npm install @urpass/sdk</span>
                    <button
                      type="button"
                      onClick={handleCopyInstall}
                      className="ml-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy install command"
                    >
                      {copiedInstall ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">Node.js · Python · REST · MCP</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5">
                  <a
                    href="#infrastructure-pricing"
                    className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-violet-600/30 transition-all cursor-pointer group"
                  >
                    <span>Get API Keys (Free Sandbox)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <a
                    href="#interactive-code"
                    className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all"
                  >
                    <Code2 className="w-4 h-4 text-violet-400" />
                    <span>Explore API Reference</span>
                  </a>
                </div>
              </AnimateIn>
            </div>

            {/* Right: Live Interactive Code Showcase HUD */}
            <div className="lg:col-span-5" id="interactive-code">
              <AnimateIn delay={100} from="up">
                <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl overflow-hidden relative">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-mono text-neutral-400 ml-2">
                        urpass-eiaas.ts
                      </span>
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-0.5 border border-neutral-800 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setCodeLang("typescript")}
                        className={cn(
                          "px-2 py-0.5 rounded transition-colors",
                          codeLang === "typescript" ? "bg-violet-600 text-white" : "text-neutral-400"
                        )}
                      >
                        TS
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeLang("curl")}
                        className={cn(
                          "px-2 py-0.5 rounded transition-colors",
                          codeLang === "curl" ? "bg-violet-600 text-white" : "text-neutral-400"
                        )}
                      >
                        cURL
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeLang("python")}
                        className={cn(
                          "px-2 py-0.5 rounded transition-colors",
                          codeLang === "python" ? "bg-violet-600 text-white" : "text-neutral-400"
                        )}
                      >
                        Py
                      </button>
                    </div>
                  </div>

                  {/* Feature Action Tabs */}
                  <div className="grid grid-cols-4 gap-1 p-1.5 bg-neutral-950/60 border-b border-neutral-800 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("issue")}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer",
                        activeCodeTab === "issue"
                          ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      Issue Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("verify")}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer",
                        activeCodeTab === "verify"
                          ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      Verify Gate
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("webhook")}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer",
                        activeCodeTab === "webhook"
                          ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      Webhooks
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("mcp")}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer",
                        activeCodeTab === "mcp"
                          ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      AI (MCP)
                    </button>
                  </div>

                  {/* Code Editor Body */}
                  <div className="p-4 sm:p-5 font-mono text-xs overflow-x-auto text-neutral-300 relative min-h-[310px] bg-neutral-950/90">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="absolute top-3 right-3 text-neutral-400 hover:text-white bg-neutral-800/80 p-1.5 rounded-lg border border-neutral-700 transition-colors"
                      title="Copy snippet"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <pre className="text-left leading-relaxed">
                      <code>{codeSnippets[activeCodeTab][codeLang]}</code>
                    </pre>
                  </div>

                  {/* Bottom Verification Live Metric Strip */}
                  <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      HTTP 200 OK
                    </span>
                    <span className="text-violet-400 font-bold">Latency: 48ms</span>
                    <span className="text-neutral-500">P99 &lt; 95ms</span>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>

          {/* ── TELEMETRY & LATENCY BENCHMARK HUD ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-neutral-900/60 rounded-2xl border border-neutral-800 mb-20 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                &lt;50ms
              </div>
              <div>
                <div className="text-xs font-bold text-white">Scan Verification</div>
                <div className="text-[11px] text-neutral-400 font-mono">P99 sub-second gate</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/30 text-violet-400 flex items-center justify-center font-mono font-bold text-sm">
                0
              </div>
              <div>
                <div className="text-xs font-bold text-white">Duplicate Scans</div>
                <div className="text-[11px] text-neutral-400 font-mono">Pessimistic lock DB</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
                99.9%
              </div>
              <div>
                <div className="text-xs font-bold text-white">Availability SLA</div>
                <div className="text-[11px] text-neutral-400 font-mono">Multi-region active</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center font-mono font-bold text-sm">
                REST+AI
              </div>
              <div>
                <div className="text-xs font-bold text-white">Dual Interface</div>
                <div className="text-[11px] text-neutral-400 font-mono">REST &amp; MCP Native</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5 CORE INFRASTRUCTURE PILLARS ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 border-y border-neutral-900 bg-neutral-900/40">
          <div className="max-w-6xl mx-auto">
            <AnimateIn>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 block mb-2">
                  THE EVENT INFRASTRUCTURE STACK
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                  Everything You Need to Build Event Tech.
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                  Stop writing custom camera scanning, duplicate prevention, and ticketing logic from scratch. UrPass handles the mission-critical plumbing.
                </p>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {infraPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <AnimateIn key={pillar.title} delay={idx * 60} from="up">
                    <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 sm:p-7 flex flex-col justify-between h-full hover:border-violet-500/50 hover:bg-neutral-900 transition-all duration-300 group">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-700/50 flex items-center justify-center text-violet-400 mb-5 group-hover:scale-105 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-md">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-violet-300 transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5">
                          {pillar.desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-800/80 space-y-2 mt-auto">
                        {pillar.bullets.map((b) => (
                          <div key={b} className="flex items-start gap-2 text-xs text-neutral-300 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── BUILD VS BUY COMPARISON ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 block mb-2">
                ENGINEERING DECISION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                Build vs. Buy: Why Teams Embed UrPass
              </h2>
              <p className="text-sm text-neutral-400">
                Building ticketing and access control looks simple on Day 1 — until 2,000 attendees arrive at the doors simultaneously.
              </p>
            </div>
          </AnimateIn>

          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950">
                  <th className="py-4 px-5 font-bold text-neutral-400 w-1/3">Challenge</th>
                  <th className="py-4 px-5 font-bold text-red-400 w-1/3 border-l border-neutral-800">
                    Building In-House
                  </th>
                  <th className="py-4 px-5 font-bold text-emerald-400 bg-violet-950/20 w-1/3 border-l border-neutral-800">
                    With UrPass EIaaS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono text-xs">
                <tr>
                  <td className="py-3.5 px-5 text-neutral-300 font-semibold">Camera Scanning in Browser</td>
                  <td className="py-3.5 px-5 text-neutral-400 border-l border-neutral-800">
                    Flaky web workers, iOS WebRTC bugs, slow auto-focus
                  </td>
                  <td className="py-3.5 px-5 text-emerald-300 font-medium bg-violet-950/10 border-l border-neutral-800">
                    Sub-300ms hardware-accelerated scanner PWA
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 text-neutral-300 font-semibold">Concurrent Duplicate Scans</td>
                  <td className="py-3.5 px-5 text-neutral-400 border-l border-neutral-800">
                    Race conditions allow duplicate entry at parallel gates
                  </td>
                  <td className="py-3.5 px-5 text-emerald-300 font-medium bg-violet-950/10 border-l border-neutral-800">
                    Pessimistic row-locking prevents any simultaneous pass-through
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 text-neutral-300 font-semibold">Gate Network Drops</td>
                  <td className="py-3.5 px-5 text-neutral-400 border-l border-neutral-800">
                    Long entrance queues stall when venue Wi-Fi fails
                  </td>
                  <td className="py-3.5 px-5 text-emerald-300 font-medium bg-violet-950/10 border-l border-neutral-800">
                    Pre-buffered cryptographic verification with auto-reconcile
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 text-neutral-300 font-semibold">Time to Market</td>
                  <td className="py-3.5 px-5 text-neutral-400 border-l border-neutral-800">
                    3–6 months of developer engineering sprints
                  </td>
                  <td className="py-3.5 px-5 text-emerald-300 font-medium bg-violet-950/10 border-l border-neutral-800">
                    Live in under 30 minutes via REST or MCP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── INFRASTRUCTURE PRICING PLANS ── */}
        <section id="infrastructure-pricing" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
          <AnimateIn>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-violet-950/70 text-violet-300 border border-violet-700/60 mb-3 shadow-2xs">
                <KeyRound className="w-3.5 h-3.5" />
                <span>INFRASTRUCTURE PRICING</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                API &amp; Platform Infrastructure Plans
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
                Usage-based infrastructure pricing for developers, event platforms, universities, and agencies. Start free in sandbox, scale as your attendees grow.
              </p>

              {/* Currency Selector */}
              <div className="inline-flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCountry("IN")}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                    country === "IN"
                      ? "bg-violet-600 text-white shadow-xs"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  🇮🇳 India (₹ INR)
                </button>
                <button
                  type="button"
                  onClick={() => setCountry("GB")}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                    country === "GB"
                      ? "bg-violet-600 text-white shadow-xs"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  🇬🇧 UK &amp; Global (£ GBP)
                </button>
              </div>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-14">
            {infraPlans.map((plan, idx) => (
              <AnimateIn key={plan.id} delay={idx * 70} from="up">
                <div
                  className={cn(
                    "relative rounded-3xl p-6 flex flex-col justify-between h-full transition-all duration-300",
                    plan.popular
                      ? "bg-neutral-900 border-2 border-violet-500 shadow-2xl shadow-violet-950/50 -translate-y-1"
                      : "bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Sparkles className="w-3 h-3" />
                      <span>RECOMMENDED FOR PLATFORMS</span>
                    </div>
                  )}

                  <div>
                    <div className="mb-3">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400">
                        {plan.badge}
                      </span>
                      <h3 className="text-xl font-extrabold text-white mt-1">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 mb-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold tracking-tight text-white">
                          {plan.price}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed mb-5 min-h-[44px]">
                      {plan.desc}
                    </p>

                    <div className="space-y-2.5 mb-6">
                      <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300">
                        Included Features:
                      </p>
                      {plan.features.map((feat, fi) => (
                        <div key={fi} className="flex items-start gap-2 text-xs text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 mt-auto">
                    <Link
                      href="/signup"
                      className={cn(
                        "w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs group",
                        plan.popular
                          ? "bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30"
                          : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                      )}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </section>

        {/* ── DEVELOPER FAQS ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto border-t border-neutral-900">
          <AnimateIn>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 block mb-2">
                DEVELOPER FAQ
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">
                Frequently Asked Technical Questions
              </h2>
            </div>
          </AnimateIn>

          <div className="flex flex-col gap-3">
            {devFaqs.map((faq, i) => (
              <div
                key={i}
                className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/60 hover:border-neutral-700 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4 bg-transparent hover:bg-neutral-900/80 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <span className="shrink-0 text-neutral-400 bg-neutral-800 p-1.5 rounded-full">
                    {openFaq === i ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60 bg-neutral-950/40 font-mono">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL DEVELOPER CTA ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto text-center">
          <AnimateIn>
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-violet-950/70 text-violet-300 border border-violet-700/60 mb-4">
                READY TO BUILD?
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                Start Building with UrPass EIaaS Today.
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed mb-8">
                Spin up sandbox keys in seconds, issue your first cryptographic pass in 3 lines of code, and test gate verification with our browser simulator.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
                >
                  <span>Create Developer Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact?type=enterprise"
                  className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all"
                >
                  <span>Talk to Architecture Team</span>
                </Link>
              </div>
            </div>
          </AnimateIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
