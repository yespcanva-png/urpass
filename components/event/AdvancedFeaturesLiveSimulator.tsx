"use client";

import { useState, useEffect, useRef } from "react";
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
  AlertTriangle,
  RefreshCw,
  QrCode,
  ArrowRight,
  ShieldAlert,
  Play,
  Check,
  Clock,
  Users,
  Activity,
  Zap,
} from "lucide-react";

interface SimulationState {
  order: {
    id: string;
    buyerName: string;
    buyerEmail: string;
    quantity: number;
    status: "paid" | "pending";
    timestamp: string;
  };
  claims: Array<{
    id: string;
    token: string;
    memberName: string;
    memberEmail: string;
    claimed: boolean;
    passToken?: string;
    serialNumber?: string;
  }>;
  registeredMembers: Array<{
    id: string;
    name: string;
    email: string;
    college: string;
    rollNumber: string;
    serialNumber: string;
    passToken: string;
    isRevoked: boolean;
    presence: "OUTSIDE" | "INSIDE";
    sessionsAttended: string[];
  }>;
  scansLog: Array<{
    id: string;
    time: string;
    operation: string;
    gateName: string;
    attendeeName: string;
    result: "GRANTED" | "DENIED" | "WARNING";
    message: string;
  }>;
  isOffline: boolean;
  offlineQueueCount: number;
  analytics: {
    headcountInside: number;
    totalEntries: number;
    totalExits: number;
    duplicateAlerts: number;
    sessionACount: number;
    sessionBCount: number;
  };
}

export default function AdvancedFeaturesLiveSimulator() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState<"normal" | "fast">("normal");

  const [state, setState] = useState<SimulationState>({
    order: {
      id: "ORD-9281",
      buyerName: "Rahul Sharma",
      buyerEmail: "rahul@innovatefest.org",
      quantity: 4,
      status: "paid",
      timestamp: "10:00:00 AM",
    },
    claims: [
      { id: "CLM-01", token: "clm_8f92a", memberName: "Rahul Sharma", memberEmail: "rahul@innovatefest.org", claimed: true, passToken: "pass_tok_991a", serialNumber: "URP-2026-0001" },
      { id: "CLM-02", token: "clm_3b11c", memberName: "Priya Patel", memberEmail: "priya@univ.edu", claimed: false },
      { id: "CLM-03", token: "clm_4a77d", memberName: "Amit Verma", memberEmail: "amit@tech.in", claimed: false },
      { id: "CLM-04", token: "clm_7c29e", memberName: "Sneha Reddy", memberEmail: "sneha@design.co", claimed: false },
    ],
    registeredMembers: [
      {
        id: "att_1",
        name: "Rahul Sharma",
        email: "rahul@innovatefest.org",
        college: "BITS Pilani",
        rollNumber: "2022A7PS0101P",
        serialNumber: "URP-2026-0001",
        passToken: "pass_tok_991a",
        isRevoked: false,
        presence: "OUTSIDE",
        sessionsAttended: [],
      },
    ],
    scansLog: [],
    isOffline: false,
    offlineQueueCount: 0,
    analytics: {
      headcountInside: 0,
      totalEntries: 0,
      totalExits: 0,
      duplicateAlerts: 0,
      sessionACount: 0,
      sessionBCount: 0,
    },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to add log entry
  const addLog = (
    operation: string,
    gateName: string,
    attendeeName: string,
    result: "GRANTED" | "DENIED" | "WARNING",
    message: string
  ) => {
    const timeStr = new Date().toLocaleTimeString();
    setState((prev) => ({
      ...prev,
      scansLog: [
        {
          id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          time: timeStr,
          operation,
          gateName,
          attendeeName,
          result,
          message,
        },
        ...prev.scansLog.slice(0, 19),
      ],
    }));
  };

  // Step 2 Action: Claim a ticket for Priya
  const handleClaimTicket = () => {
    setState((prev) => {
      const updatedClaims = prev.claims.map((c) =>
        c.id === "CLM-02"
          ? {
              ...c,
              claimed: true,
              passToken: "pass_tok_882b",
              serialNumber: "URP-2026-0002",
            }
          : c
      );
      const newAttendee = {
        id: "att_2",
        name: "Priya Patel",
        email: "priya@univ.edu",
        college: "IIT Bombay",
        rollNumber: "210050089",
        serialNumber: "URP-2026-0002",
        passToken: "pass_tok_882b",
        isRevoked: false,
        presence: "OUTSIDE" as const,
        sessionsAttended: [],
      };
      return {
        ...prev,
        claims: updatedClaims,
        registeredMembers: [...prev.registeredMembers, newAttendee],
      };
    });
    addLog("CLAIM_ACCEPTED", "Online Claim Portal", "Priya Patel", "GRANTED", "Custom registration form verified. Issued pass URP-2026-0002");
    setActiveStep(3);
  };

  // Step 3 Action: Reassign Amit's ticket to Vikram
  const handleReassignTicket = () => {
    setState((prev) => {
      const updatedClaims = prev.claims.map((c) =>
        c.id === "CLM-03"
          ? {
              ...c,
              claimed: true,
              memberName: "Vikram Malhotra (Reassigned)",
              memberEmail: "vikram@fintech.io",
              passToken: "pass_tok_rot_331f",
              serialNumber: "URP-2026-0003",
            }
          : c
      );
      const newAttendee = {
        id: "att_3",
        name: "Vikram Malhotra",
        email: "vikram@fintech.io",
        college: "Delhi Technological University",
        rollNumber: "DTU-2023-CS-41",
        serialNumber: "URP-2026-0003",
        passToken: "pass_tok_rot_331f",
        isRevoked: false,
        presence: "OUTSIDE" as const,
        sessionsAttended: [],
      };
      return {
        ...prev,
        claims: updatedClaims,
        registeredMembers: [...prev.registeredMembers, newAttendee],
      };
    });
    addLog("TOKEN_REVOKED & REASSIGNED", "Identity Engine", "Amit Verma → Vikram Malhotra", "GRANTED", "Old token invalidated. Rotated to opaque pass_tok_rot_331f");
    setActiveStep(4);
  };

  // Step 4 Action: Gate Entry Scan
  const handleGateScan = (attendeeId: string, operation: "entry" | "exit" | "duplicate") => {
    const member = state.registeredMembers.find((m) => m.id === attendeeId);
    if (!member) return;

    if (operation === "entry") {
      setState((prev) => ({
        ...prev,
        registeredMembers: prev.registeredMembers.map((m) =>
          m.id === attendeeId ? { ...m, presence: "INSIDE" } : m
        ),
        analytics: {
          ...prev.analytics,
          headcountInside: prev.analytics.headcountInside + 1,
          totalEntries: prev.analytics.totalEntries + 1,
        },
      }));
      addLog("GATE_ENTRY", "Main Gate Alpha", member.name, "GRANTED", "Access permitted. Presence state set to INSIDE.");
    } else if (operation === "duplicate") {
      setState((prev) => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          duplicateAlerts: prev.analytics.duplicateAlerts + 1,
        },
      }));
      addLog("ANTI_PASSBACK_BLOCK", "Main Gate Alpha", member.name, "WARNING", "Duplicate scan rejected: Attendee is already recorded INSIDE the venue!");
    } else if (operation === "exit") {
      setState((prev) => ({
        ...prev,
        registeredMembers: prev.registeredMembers.map((m) =>
          m.id === attendeeId ? { ...m, presence: "OUTSIDE" } : m
        ),
        analytics: {
          ...prev.analytics,
          headcountInside: Math.max(0, prev.analytics.headcountInside - 1),
          totalExits: prev.analytics.totalExits + 1,
        },
      }));
      addLog("GATE_EXIT", "Turnstile Exit 02", member.name, "GRANTED", "Exit recorded. Presence updated to OUTSIDE. Re-entry allowed.");
    }
  };

  // Step 5 Action: Session Scan
  const handleSessionScan = (attendeeId: string, sessionName: string) => {
    const member = state.registeredMembers.find((m) => m.id === attendeeId);
    if (!member) return;

    const sessionKey = sessionName === "AI Keynote Hall" ? "sessionACount" : "sessionBCount";
    setState((prev) => ({
      ...prev,
      registeredMembers: prev.registeredMembers.map((m) =>
        m.id === attendeeId && !m.sessionsAttended.includes(sessionName)
          ? { ...m, sessionsAttended: [...m.sessionsAttended, sessionName] }
          : m
      ),
      analytics: {
        ...prev.analytics,
        [sessionKey]: prev.analytics[sessionKey] + 1,
      },
    }));
    addLog("SESSION_CHECKIN", sessionName, member.name, "GRANTED", `Checked in to session. Seat capacity updated in real time.`);
  };

  // Step 6 Action: Offline Queue and Reconnect
  const handleToggleOffline = () => {
    const nextOffline = !state.isOffline;
    setState((prev) => ({
      ...prev,
      isOffline: nextOffline,
      offlineQueueCount: nextOffline ? prev.offlineQueueCount + 2 : 0,
    }));

    if (nextOffline) {
      addLog("OFFLINE_MODE", "Hardware Scanner #04", "Local Manifest Engine", "WARNING", "Network disconnected. Switched to offline IndexedDB manifest scanning.");
    } else {
      addLog("AUTO_RECONCILE", "Cloud Sync Worker", "Batch Reconciliation", "GRANTED", "Reconnected: 2 queued offline scans synchronized & verified.");
    }
  };

  const resetSimulator = () => {
    setState({
      order: {
        id: "ORD-9281",
        buyerName: "Rahul Sharma",
        buyerEmail: "rahul@innovatefest.org",
        quantity: 4,
        status: "paid",
        timestamp: "10:00:00 AM",
      },
      claims: [
        { id: "CLM-01", token: "clm_8f92a", memberName: "Rahul Sharma", memberEmail: "rahul@innovatefest.org", claimed: true, passToken: "pass_tok_991a", serialNumber: "URP-2026-0001" },
        { id: "CLM-02", token: "clm_3b11c", memberName: "Priya Patel", memberEmail: "priya@univ.edu", claimed: false },
        { id: "CLM-03", token: "clm_4a77d", memberName: "Amit Verma", memberEmail: "amit@tech.in", claimed: false },
        { id: "CLM-04", token: "clm_7c29e", memberName: "Sneha Reddy", memberEmail: "sneha@design.co", claimed: false },
      ],
      registeredMembers: [
        {
          id: "att_1",
          name: "Rahul Sharma",
          email: "rahul@innovatefest.org",
          college: "BITS Pilani",
          rollNumber: "2022A7PS0101P",
          serialNumber: "URP-2026-0001",
          passToken: "pass_tok_991a",
          isRevoked: false,
          presence: "OUTSIDE",
          sessionsAttended: [],
        },
      ],
      scansLog: [],
      isOffline: false,
      offlineQueueCount: 0,
      analytics: {
        headcountInside: 0,
        totalEntries: 0,
        totalExits: 0,
        duplicateAlerts: 0,
        sessionACount: 0,
        sessionBCount: 0,
      },
    });
    setActiveStep(1);
  };

  return (
    <div className="bg-neutral-900 text-white rounded-2xl border border-neutral-800 p-6 shadow-2xl overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Real-Time Modular Pipeline Simulator
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE ENGINE ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Experience the end-to-end flow from bulk purchase to multi-gate anti-passback and session scanning in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetSimulator}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>
        </div>
      </div>

      {/* ── Step-by-Step Interactive Workflow Pipeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Left Side: Interactive Pipeline Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Stage 1: Bulk Purchase & Capacity Allocation */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep === 1
              ? "bg-violet-950/30 border-violet-500/60 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              : "bg-neutral-800/40 border-neutral-800"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/30">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">M01 Bulk Booking Order</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">Order ID: {state.order.id} (4 Tickets Reserved)</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Capacity Locked</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Buyer <strong>Rahul Sharma</strong> purchased 4 tickets in 1 transaction. Atomic lock reserved 4 slots without locking individual attendee names yet.
            </p>
          </div>

          {/* Stage 2: Member Distribution & Custom Forms */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep === 2 || activeStep === 3
              ? "bg-violet-950/30 border-violet-500/60 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              : "bg-neutral-800/40 border-neutral-800"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/30">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">M02/M03/M04 Ticket Distribution & Forms</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {state.registeredMembers.length} / 4 Claimed with Verified Serials
                  </span>
                </div>
              </div>
              {state.claims.find((c) => c.id === "CLM-02")?.claimed ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Priya Claimed</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleClaimTicket}
                  className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simulate Claim (Priya)</span>
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Member clicks claim link, fills institution fields (College, Roll number), and receives auto-generated serial number <strong className="text-violet-300">URP-2026-0002</strong>.
            </p>
          </div>

          {/* Stage 3: Digital QR Identity & Reassignment */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep === 3 || activeStep === 4
              ? "bg-violet-950/30 border-violet-500/60 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              : "bg-neutral-800/40 border-neutral-800"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/30">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">M05 QR Token Rotation & Reassignment</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">Cryptographic Invalidation Engine</span>
                </div>
              </div>
              {state.registeredMembers.some((m) => m.name.includes("Vikram")) ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Token Rotated</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleReassignTicket}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Simulate Reassign (Amit → Vikram)</span>
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              When a pass is reassigned to a new attendee, the old QR is revoked server-side immediately so screenshots of previous passes fail at all gates.
            </p>
          </div>

          {/* Stage 4: Multi-Gate Live Scanner Operations */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">M06 Multi-Gate & Anti-Passback Scanning</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">Live Presence: INSIDE vs OUTSIDE</span>
                </div>
              </div>
            </div>

            {/* Live Scanner Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleGateScan("att_1", "entry")}
                className="px-3 py-2 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-500/40"
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>Gate Entry (Rahul)</span>
              </button>

              <button
                type="button"
                onClick={() => handleGateScan("att_1", "duplicate")}
                className="px-3 py-2 rounded-lg bg-red-800/70 hover:bg-red-700 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-red-600/40"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Test Duplicate Scan</span>
              </button>

              <button
                type="button"
                onClick={() => handleGateScan("att_1", "exit")}
                className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-neutral-600"
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>Gate Exit (Rahul)</span>
              </button>
            </div>
          </div>

          {/* Stage 5: Session Attendance & Offline Synchronization */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                  5
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">M07 Session Scanning & M10 Offline Sync</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">Multi-Hall Verification & Local Queues</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSessionScan("att_1", "AI Keynote Hall")}
                className="px-3 py-2 rounded-lg bg-blue-700/80 hover:bg-blue-600 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-blue-500/40"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Scan Session A</span>
              </button>

              <button
                type="button"
                onClick={() => handleSessionScan("att_2", "Web3 Workshop")}
                className="px-3 py-2 rounded-lg bg-indigo-700/80 hover:bg-indigo-600 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-500/40"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Scan Session B</span>
              </button>

              <button
                type="button"
                onClick={handleToggleOffline}
                className={`px-3 py-2 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 border ${
                  state.isOffline
                    ? "bg-amber-600 hover:bg-amber-500 border-amber-400"
                    : "bg-neutral-700 hover:bg-neutral-600 border-neutral-600"
                }`}
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>{state.isOffline ? "Reconnect & Sync" : "Test Offline Mode"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Real-Time Telemetry & Scans Log Stream (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Telemetry Panel */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  M11 Real-Time Telemetry
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Stream: Active</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Inside Venue</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {state.analytics.headcountInside}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Total Entries</span>
                <span className="text-lg font-bold text-white font-mono">
                  {state.analytics.totalEntries}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Total Exits</span>
                <span className="text-lg font-bold text-neutral-300 font-mono">
                  {state.analytics.totalExits}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Anti-Passback Flags</span>
                <span className="text-lg font-bold text-red-400 font-mono">
                  {state.analytics.duplicateAlerts}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Session A (AI)</span>
                <span className="text-lg font-bold text-blue-400 font-mono">
                  {state.analytics.sessionACount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Session B (Web3)</span>
                <span className="text-lg font-bold text-indigo-400 font-mono">
                  {state.analytics.sessionBCount}
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Scan Logs Console */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Live Scan Stream & Audit Logs
              </h4>
              <span className="text-[10px] font-mono text-neutral-500">
                {state.scansLog.length} events recorded
              </span>
            </div>

            <div className="h-64 overflow-y-auto space-y-2 font-mono text-[11px] pr-1">
              {state.scansLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-600">
                  <QrCode className="w-6 h-6 mb-1 opacity-40" />
                  <span>Awaiting scanner events…</span>
                </div>
              ) : (
                state.scansLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-1 animate-in fade-in slide-in-from-top-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-500">{log.time}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          log.result === "GRANTED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : log.result === "WARNING"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {log.result}
                      </span>
                    </div>
                    <div className="text-neutral-300 font-semibold truncate">
                      {log.operation} &bull; {log.attendeeName}
                    </div>
                    <div className="text-neutral-400 text-[10px] truncate">{log.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
