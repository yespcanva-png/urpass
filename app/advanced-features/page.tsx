import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  Send,
  FileText,
  Hash,
  UserCheck,
  DoorOpen,
  Calendar,
  FileSpreadsheet,
  WifiOff,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  QrCode,
  Lock,
  Cpu,
  RefreshCw,
} from "lucide-react";
import AdvancedFeaturesLiveSimulator from "@/components/event/AdvancedFeaturesLiveSimulator";

export const metadata: Metadata = {
  title: "How to Use Advanced Event Features — Real-Time Modular Guide | URPASS",
  description:
    "Comprehensive real-time implementation guide for URPASS advanced modules: Bulk Ticket Booking, Member Claim Distribution, Custom Registration Forms, Serial Numbers, Anti-Passback Multi-Gate Scanning, Session Attendance, and Offline Sync.",
  keywords: [
    "how to use advanced event features",
    "real-time event attendance guide",
    "bulk ticket distribution how to",
    "anti passback multi gate scanning",
    "session attendance tracking guide",
    "offline event qr scanner",
  ],
  alternates: { canonical: "https://urpass.space/advanced-features" },
  openGraph: {
    title: "How to Use Advanced Event Features | Real-Time Modular Architecture | URPASS",
    description:
      "Interactive real-time guide to configuring and operating advanced ticketing, multi-gate presence, and session-wise attendance tracking.",
    url: "https://urpass.space/advanced-features",
    locale: "en_IN",
    type: "website",
  },
};

const MODULE_GUIDES = [
  {
    num: "M01",
    key: "bulk_ticket_booking",
    name: "Bulk Ticket Booking",
    tag: "TICKETING",
    icon: Layers,
    summary: "Sell multiple tickets in a single checkout while reserving inventory atomically.",
    howToDo: [
      "Navigate to Event Dashboard → Settings → Advanced Features.",
      "Toggle Bulk Ticket Booking ON.",
      "Set your Max Tickets per Order limit (e.g. 10 or 25) in Configure Rules.",
      "Attendees can now pick a quantity at checkout and receive an instant order bundle with individual claim tokens.",
    ],
    underTheHood: "Uses database atomic row-level locks on ticket capacity. Even if 1,000 users buy simultaneously, overselling is mathematically prevented.",
  },
  {
    num: "M02",
    key: "ticket_distribution",
    name: "Bulk Ticket Distribution & Claim Links",
    tag: "DISTRIBUTION",
    icon: Send,
    summary: "Enable purchasers to distribute individual tickets to team members via secure, single-use claim URLs.",
    howToDo: [
      "Enable Bulk Ticket Distribution in Event Settings.",
      "Buyers visit their order confirmation page and enter recipient emails or copy unique claim links.",
      "Recipients click the link to claim their ticket and receive their personal digital QR pass.",
      "The buyer or organizer can track unclaimed links and reassign or revoke them at any time.",
    ],
    underTheHood: "Single-use cryptographic tokens expire after a configurable window (e.g., 48 hours) and prevent multiple claims on the same ticket entitlement.",
  },
  {
    num: "M03",
    key: "member_registration_forms",
    name: "Member Registration Forms",
    tag: "REGISTRATION",
    icon: FileText,
    summary: "Collect detailed attendee fields (college, department, roll number) with tier-specific field rules.",
    howToDo: [
      "Enable Member Registration Forms in Event Settings.",
      "Configure required custom fields such as College, Department, Roll Number, or Meal Preference.",
      "Target fields to specific ticket categories (e.g., require Student ID only on Student Passes).",
      "Forms are validated in real time before QR passes are generated.",
    ],
    underTheHood: "Field values are stored in JSONB custom responses and indexed for fast CSV filtering and demographic reports.",
  },
  {
    num: "M04",
    key: "serial_number_validation",
    name: "Custom Serial Numbers & Whitelists",
    tag: "VALIDATION",
    icon: Hash,
    summary: "Assign sequential roll numbers (e.g., URP-2026-0001) or validate against pre-uploaded student rosters.",
    howToDo: [
      "Enable Serial Number Validation in Advanced Features.",
      "Choose your strategy: Auto-Sequential Sequence, CSV Whitelist Verification, or Attendee Entry.",
      "If Whitelist is chosen, upload a CSV list of approved serial/roll numbers.",
      "During claim/registration, invalid or duplicate roll numbers are immediately blocked.",
    ],
    underTheHood: "Sequences are generated via atomic PostgreSQL increment functions to prevent duplicate numbers under concurrent traffic.",
  },
  {
    num: "M05",
    key: "ticket_reassignment",
    name: "Digital QR Identity & Ticket Reassignment",
    tag: "IDENTITY",
    icon: UserCheck,
    summary: "Allow ticket transfers with immediate server-side revocation of old QR pass screenshots.",
    howToDo: [
      "Enable Ticket Reassignment in Advanced Features.",
      "When a buyer or organizer reassigns a pass to a new person, enter the new attendee's details.",
      "The previous digital QR token is immediately marked REVOKED in the database.",
      "A new opaque QR token is generated and emailed to the new holder.",
    ],
    underTheHood: "Any scan attempt of the old QR code at gates triggers an immediate REVOKED_CREDENTIAL warning, eliminating unauthorized pass sharing.",
  },
  {
    num: "M06",
    key: "advanced_entry_tracking",
    name: "Multi-Gate Tracking & Real-Time Presence",
    tag: "GATES & VENUE",
    icon: DoorOpen,
    summary: "Track real-time venue occupancy (INSIDE vs OUTSIDE) across multiple gates with anti-passback rules.",
    howToDo: [
      "Enable Advanced Entry, Exit & Multi-Gate Tracking.",
      "Create your named Gates (Main Gate, VIP North, Hall B Exit) and assign scanner staff.",
      "Scanner staff select their gate and operation mode: Main Event Entry, Event Exit, or Re-Entry.",
      "Entry scans transition attendee status to INSIDE. Exit scans transition status to OUTSIDE.",
    ],
    underTheHood: "Anti-passback detects if an attendee attempts to scan into the venue twice without an exit record, logging an immediate duplicate warning.",
  },
  {
    num: "M07",
    key: "session_attendance",
    name: "Session-Wise Attendance Tracking",
    tag: "SESSIONS",
    icon: Calendar,
    summary: "Record session-level attendance on multi-track agendas using the attendee's single digital QR pass.",
    howToDo: [
      "Enable Session-Wise Attendance in Event Settings.",
      "Add your conference agenda sessions and specify room capacities and eligible ticket tiers.",
      "Scanner operators switch their scanner mode to the specific session.",
      "When attendees enter the hall, scan their QR pass to log session check-in and measure dwell duration.",
    ],
    underTheHood: "Session attendance records are stored independently from main venue gate entries, preventing state contamination.",
  },
  {
    num: "M08",
    key: "csv_management",
    name: "CSV Import & Export Pipelines",
    tag: "DATA OPS",
    icon: FileSpreadsheet,
    summary: "Bulk import attendee rosters with staged validation, and export sanitized audit reports.",
    howToDo: [
      "Enable CSV Management in Event Settings.",
      "Download standard CSV templates for ticket assignment or member lists.",
      "Upload your CSV file through the 5-stage validation pipeline (Upload → Parse → Validate → Preview → Confirm).",
      "Export entry/exit history and session attendance reports anytime.",
    ],
    underTheHood: "All export fields are sanitized against formula injection (protecting spreadsheet macros from malicious inputs).",
  },
  {
    num: "M10",
    key: "offline_scanning",
    name: "Offline Scanning & Synchronization",
    tag: "SCANNER OPS",
    icon: WifiOff,
    summary: "Zero-latency check-ins with local browser cache manifests and automatic cloud reconciliation.",
    howToDo: [
      "Enable Offline Scanning & Synchronization.",
      "Staff open the scanner page while connected to pre-cache the encrypted event manifest.",
      "If the venue loses Wi-Fi, the scanner continues validating tickets locally at 60 FPS.",
      "When connectivity returns, all offline scans are automatically synced and reconciled in background.",
    ],
    underTheHood: "Server-authoritative timestamp ordering ensures that conflicting scans across disconnected devices are resolved deterministically.",
  },
  {
    num: "M11",
    key: "advanced_analytics",
    name: "Advanced Operational Analytics",
    tag: "ANALYTICS",
    icon: BarChart3,
    summary: "Live venue headcount velocity, gate throughput heatmaps, and demographic breakdown reports.",
    howToDo: [
      "Enable Advanced Operational Analytics.",
      "Open your Event Dashboard → Analytics to monitor real-time net venue presence.",
      "View hourly velocity curves to identify peak gate congestion periods.",
      "Filter session fill rates and demographic distribution across institutions and ticket categories.",
    ],
    underTheHood: "Aggregations are streamed via WebSockets / high-frequency telemetry snapshots without placing locking overhead on active entrance gates.",
  },
];

export default function AdvancedFeaturesHowToPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-violet-600 selection:text-white">
      {/* ── Hero Header ── */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                U
              </span>
              <span>URPASS</span>
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-xs font-semibold text-neutral-300">Advanced Features How-To Guide</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Open Event Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* ── Title Banner ── */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-950/80 text-violet-400 border border-violet-800/60">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>REAL-TIME MODULAR ARCHITECTURE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How to Use URPASS Advanced Features
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
            Every advanced capability in URPASS is modular, independent, and controllable per event.
            Follow this guide to configure each module, and test the full lifecycle in our live real-time simulator below.
          </p>
        </div>

        {/* ── Real-Time Interactive Simulator Section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl font-bold text-white">Live Real-Time Sandbox & Simulator</h2>
            </div>
            <span className="text-xs text-neutral-400">Interactive Demonstration</span>
          </div>

          {/* Embedded Real-Time Simulator */}
          <AdvancedFeaturesLiveSimulator />
        </div>

        {/* ── Modular How-To Documentation Cards ── */}
        <div className="space-y-8">
          <div className="border-t border-neutral-800 pt-10">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Module-by-Module Configuration Guides
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Step-by-step instructions for activating and operating each advanced capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULE_GUIDES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.key}
                  className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-6 flex flex-col justify-between space-y-6 hover:border-violet-500/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-violet-400">
                              {mod.num}
                            </span>
                            <h3 className="text-base font-bold text-white leading-tight">
                              {mod.name}
                            </h3>
                          </div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                            {mod.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                      {mod.summary}
                    </p>

                    {/* Step-by-step list */}
                    <div className="space-y-2 pt-2 border-t border-neutral-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                        How to Configure:
                      </span>
                      <ol className="space-y-1.5 text-xs text-neutral-400 list-decimal list-inside leading-relaxed">
                        {mod.howToDo.map((step, idx) => (
                          <li key={idx} className="text-neutral-300">
                            <span className="text-neutral-400">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Under the hood technical note */}
                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                      <div className="flex items-center gap-1.5 text-violet-400 font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Security & Architecture:</span>
                      </div>
                      <p className="leading-relaxed">{mod.underTheHood}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Quick Action Callout ── */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-950/60 via-neutral-900 to-violet-950/60 border border-violet-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Ready to activate advanced features?</h3>
            <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
              Open your Event Settings → Advanced Features to toggle on the exact modules required for your college fest, conference, or exhibition.
            </p>
          </div>

          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors shrink-0 shadow-lg shadow-violet-600/20 flex items-center gap-2"
          >
            <span>Go to Event Settings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
