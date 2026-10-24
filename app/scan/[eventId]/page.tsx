"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Loader2,
  ScanLine,
  Users,
  Search,
  ChevronDown,
  ShieldX,
  ShieldAlert,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  CloudUpload,
  RefreshCw,
  Sun,
  DoorOpen,
  Flashlight,
  FlashlightOff,
  SlidersHorizontal,
  SwitchCamera,
  X,
  Layers,
  ChevronUp,
  Check,
  Monitor,
} from "lucide-react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { playScannerFeedback, unlockAudioContext } from "@/lib/scanner-feedback";
import { createWakeLockController, type WakeLockController } from "@/lib/wake-lock";
import { attachHardwareScannerListener } from "@/lib/hardware-scanner";
import {
  saveEventManifest,
  getManifestMeta,
  searchOfflineAttendees,
  verifyPassOffline,
  getQueueStats,
  syncOfflineQueue,
  type OfflineVerificationResult,
} from "@/lib/offline-scanner";
import { undoCheckIn, undoCheckInByToken } from "@/app/actions/manual-checkin";
import { undoSessionCheckIn } from "@/app/actions/session-attendance";
import GroupEntryModal from "@/components/scan/GroupEntryModal";
import { parseScannedGroupQR, normalizeScannedToken } from "@/lib/group-entry";
import {
  canDecodeQr,
  initialScannerCounters,
  isTerminalScannerState,
  recordScannerOutcome,
  type ScannerState,
} from "@/lib/scanner-state";

const QRScanner = dynamic(() => import("@/components/scan/QRScanner"), { ssr: false });

interface ScanResult {
  attendee: { id?: string; name: string; email: string; pass_type: string };
  passType: string;
  checkedInAt?: string | null;
  gateName?: string | null;
  offline?: boolean;
  passToken?: string;
  attendeeId?: string;
  badgeText?: string;
  message?: string;
  isMultiScan?: boolean;
  scanCount?: number;
  lastScannedAt?: string | null;
  firstScannedAt?: string | null;
  scanHistory?: Array<{
    scan_number: number;
    scanned_at: string;
    gate_name?: string | null;
    scanned_by?: string | null;
  }>;
}

interface FeedEntry {
  id: string;
  name: string;
  pass_type: string;
  ts: string;
}

interface Gate {
  id: string;
  name: string;
  zone_id: string | null;
  zone: { name: string } | null;
}

interface SearchAttendee {
  id: string;
  name: string;
  email: string;
  pass_type: string;
  pass_status: string;
}

const PASS_TYPE_LABEL: Record<string, string> = {
  participant: "Participant",
  vip: "VIP",
  speaker: "Speaker",
  organizer: "Organizer",
};

const SAME_TOKEN_DEBOUNCE_MS = 2000; // Debounce same QR code to prevent duplicate triggers
const RAPID_SCAN_COOLDOWN_MS = 150; // Minimal 150ms cooldown between different tickets
const SOUND_STORAGE_KEY = "urpass_scanner_sound_enabled";

export default function ScanEventPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.eventId as string;

  const [eventName, setEventName] = useState<string>("");
  const [scanState, setScanState] = useState<ScannerState>("READY");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [accessDeniedMsg, setAccessDeniedMsg] = useState("");
  const [lastResultAt, setLastResultAt] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [sessionCounters, setSessionCounters] = useState(initialScannerCounters);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  // Mobile Bottom Sheets & Drawers
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [feedDrawerOpen, setFeedDrawerOpen] = useState(false);

  // Gate state
  const [gates, setGates] = useState<Gate[]>([]);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);

  // Conference Session Check-in state
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState<{ checkedIn: number; capacity: number | null; remaining: number | null } | null>(null);

  // Zone & Physical Operations state
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [scanDirection, setScanDirection] = useState<"in" | "out">("in");
  const [lastScannedAttendee, setLastScannedAttendee] = useState<any | null>(null);

  // Group Entry Modal state
  const [groupModalState, setGroupModalState] = useState<{
    isOpen: boolean;
    bookingReference: string;
    buyerName: string;
    ticketCategory?: string;
    totalEntitlements: number;
    previouslyAdmitted: number;
    remainingEntries: number;
    history?: Array<{
      id: string;
      admittedCount: number;
      remainingAfter: number;
      gateName?: string;
      admittedAt: string;
    }>;
    operationId: string;
    loading: boolean;
    sessionId?: string;
    sessionTitle?: string;
  } | null>(null);

  // Manual search mode
  const [manualMode, setManualMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"all" | "checked_in" | "pending">("all");
  const [searchResults, setSearchResults] = useState<SearchAttendee[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [undoingCheckIn, setUndoingCheckIn] = useState(false);

  // Offline state & synchronization
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [cachedPassCount, setCachedPassCount] = useState<number>(0);
  const [queuePending, setQueuePending] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isRefreshingCache, setIsRefreshingCache] = useState<boolean>(false);
  const [syncBanner, setSyncBanner] = useState<{ message: string; type: "success" | "warning" } | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const wakeLockRef = useRef<WakeLockController | null>(null);

  // Torch control
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);

  // Camera facing mode and lens detection
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  const toggleCameraFacing = useCallback(() => {
    setCameraFacing((f) => (f === "environment" ? "user" : "environment"));
  }, []);

  const selectedGate = gates.find((g) => g.id === selectedGateId) ?? null;
  const selectedSession = sessions.find((s) => s.id === selectedSessionId) ?? null;
  const selectedZone = zones.find((z) => z.id === selectedZoneId) ?? null;

  const lastTokenRef = useRef<string | null>(null);
  const lastTokenTimeRef = useRef<number>(0);
  const cooldownRef = useRef(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const terminalScanCountedRef = useRef(false);
  const pendingSuccessfulCountRef = useRef(1);
  const activeAttemptIdRef = useRef(0);
  const isResettingRef = useRef(false);

  // Force gate selection before scanning begins if gates are configured
  const isGateRequired = gates.length > 0 && !selectedGateId && !selectedSessionId;
  const isScannerActive =
    !manualMode &&
    !isGateRequired &&
    !groupModalState?.isOpen &&
    canDecodeQr(scanState);
  const isProcessingScan = scanState === "PROCESSING";
  const scanContextName = selectedSession?.title || eventName || "Event";

  const toggleTorch = useCallback(async () => {
    try {
      const videoEl = document.getElementById("urpass-qr-scanner")?.querySelector("video") as HTMLVideoElement | null;
      const stream = videoEl?.srcObject as MediaStream | null;
      const videoTrack = stream?.getVideoTracks?.()[0];
      if (!videoTrack) return;

      const nextTorch = !torchOn;
      // @ts-ignore
      await videoTrack.applyConstraints({
        advanced: [{ torch: nextTorch } as any],
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn("Failed to toggle torch:", err);
    }
  }, [torchOn]);

  // Keep screen awake during scanning
  useEffect(() => {
    const controller = createWakeLockController((active) => {
      setWakeLockActive(active);
    });
    wakeLockRef.current = controller;
    void controller.request();

    return () => {
      void controller.release();
      wakeLockRef.current = null;
    };
  }, []);

  const toggleWakeLock = useCallback(() => {
    const controller = wakeLockRef.current;
    if (!controller) return;
    if (controller.isActive()) {
      void controller.release();
    } else {
      void controller.request();
    }
  }, []);

  const handleSelectGate = useCallback((gateId: string | null) => {
    setSelectedGateId(gateId);
    if (gateId) {
      setSelectedSessionId(null);
      try {
        localStorage.setItem(`urpass_gate_${eventId}`, gateId);
        localStorage.removeItem(`urpass_session_${eventId}`);
      } catch {}
    } else {
      try {
        localStorage.removeItem(`urpass_gate_${eventId}`);
      } catch {}
    }
  }, [eventId]);

  const handleSelectSession = useCallback((sessionId: string | null) => {
    setSelectedSessionId(sessionId);
    if (sessionId) {
      setSelectedGateId(null);
      try {
        localStorage.setItem(`urpass_session_${eventId}`, sessionId);
        localStorage.removeItem(`urpass_gate_${eventId}`);
      } catch {}
      const targetSession = sessions.find((s) => s.id === sessionId);
      if (targetSession) {
        const supabase = createClient();
        supabase
          .from("session_checkins")
          .select("id", { count: "exact", head: true })
          .eq("session_id", sessionId)
          .is("checkout_time", null)
          .then(({ count }) => {
            const roomObj = Array.isArray(targetSession.room) ? targetSession.room[0] : (targetSession.room as any);
            const cap = targetSession.capacity || roomObj?.capacity || null;
            const checked = count || 0;
            setSessionStats({
              checkedIn: checked,
              capacity: cap,
              remaining: cap ? Math.max(0, cap - checked) : null,
            });
          });
      }
    } else {
      setSessionStats(null);
      try {
        localStorage.removeItem(`urpass_session_${eventId}`);
      } catch {}
    }
  }, [eventId, sessions]);

  // Unlock audio on initial gesture
  useEffect(() => {
    const unlock = () => {
      unlockAudioContext();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {}
      if (next) unlockAudioContext();
      return next;
    });
  }, []);

  // Event settings
  const [allowReentry, setAllowReentry] = useState<boolean>(false);

  // Fetch event name + gates on mount
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [{ data: eventData }, { data: gateData }, { data: sessionData }] = await Promise.all([
        supabase.from("events").select("name, custom_pass_design").eq("id", eventId).single(),
        supabase
          .from("scanner_gates")
          .select("id, name, zone_id, zone:event_zones(name)")
          .eq("event_id", eventId)
          .order("position"),
        supabase
          .from("event_sessions")
          .select(`
            id,
            title,
            session_date,
            start_time,
            end_time,
            capacity,
            registration_required,
            checkin_enabled,
            require_checkout,
            room:event_rooms (id, name, capacity)
          `)
          .eq("event_id", eventId)
          .eq("checkin_enabled", true)
          .order("start_time"),
      ]);

      if (eventData) {
        setEventName(eventData.name);
        const design = (eventData.custom_pass_design as Record<string, unknown> | null) ?? {};
        const gateCfg = design._gateTrackingConfig as Record<string, unknown> | undefined;
        const groupCfg = design._groupEntryConfig as Record<string, unknown> | undefined;
        const isReentryAllowed = Boolean(
          design.allow_reentry ||
          design.allow_reset ||
          gateCfg?.allowReEntry === true ||
          gateCfg?.re_entry_policy === "allowed" ||
          gateCfg?.re_entry_policy === "staff_override" ||
          groupCfg?.re_entry === "identity_verified" ||
          groupCfg?.allow_reset === true
        );
        setAllowReentry(isReentryAllowed);
      }

      if (gateData && gateData.length > 0) {
        const parsedGates = gateData as unknown as Gate[];
        setGates(parsedGates);

        const urlGate = searchParams.get("gate");
        if (urlGate && parsedGates.find((g) => g.id === urlGate)) {
          setSelectedGateId(urlGate);
        } else {
          try {
            const savedGate = localStorage.getItem(`urpass_gate_${eventId}`);
            if (savedGate && parsedGates.find((g) => g.id === savedGate)) {
              setSelectedGateId(savedGate);
            }
          } catch {}
        }
      }

      if (sessionData && sessionData.length > 0) {
        setSessions(sessionData);
        const urlSession = searchParams.get("session");
        let activeSession = urlSession ? sessionData.find((s) => s.id === urlSession) : null;
        if (!activeSession) {
          try {
            const savedSession = localStorage.getItem(`urpass_session_${eventId}`);
            if (savedSession && sessionData.find((s) => s.id === savedSession)) {
              activeSession = sessionData.find((s) => s.id === savedSession);
            }
          } catch {}
        }
        if (activeSession) {
          setSelectedSessionId(activeSession.id);
          setSelectedGateId(null);

          // Fetch initial session headcount & capacity
          supabase
            .from("session_checkins")
            .select("id", { count: "exact", head: true })
            .eq("session_id", activeSession.id)
            .is("checkout_time", null)
            .then(({ count }) => {
              const roomObj = Array.isArray(activeSession.room) ? activeSession.room[0] : (activeSession.room as any);
              const cap = activeSession.capacity || roomObj?.capacity || null;
              const checked = count || 0;
              setSessionStats({
                checkedIn: checked,
                capacity: cap,
                remaining: cap ? Math.max(0, cap - checked) : null,
              });
            });
        }
      }

      fetch(`/api/event/${eventId}/ops/zones`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.zones) {
            setZones(d.zones);
            const urlZone = searchParams.get("zone");
            if (urlZone && d.zones.some((z: any) => z.id === urlZone)) {
              setSelectedZoneId(urlZone);
            }
          }
        })
        .catch(() => {});
    }
    fetchData();
  }, [eventId, searchParams]);

  // Live check-in feed via Realtime
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`scanner-feed-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "check_ins",
          filter: `event_id=eq.${eventId}`,
        },
        async (payload) => {
          const attendeeId = payload.new.attendee_id as string;
          const { data: att } = await supabase
            .from("attendees")
            .select("name, pass_type")
            .eq("id", attendeeId)
            .single();

          if (!att) return;
          const entry: FeedEntry = {
            id: payload.new.id as string,
            name: att.name,
            pass_type: att.pass_type,
            ts: payload.new.checked_in_at as string,
          };
          setScanCount((c) => c + 1);
          setFeed((prev) => [entry, ...prev].slice(0, 25));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_checkins",
        },
        async (payload) => {
          // If a session check-in is inserted or deleted, refresh selectedSession stats in real time
          const changedSessionId = (payload.new as any)?.session_id || (payload.old as any)?.session_id;
          if (changedSessionId && changedSessionId === selectedSessionId) {
            const { count } = await supabase
              .from("session_checkins")
              .select("id", { count: "exact", head: true })
              .eq("session_id", changedSessionId)
              .is("checkout_time", null);
            const currentHeadcount = count || 0;
            setSessionStats((prev) => {
              if (!prev) return { checkedIn: currentHeadcount, capacity: null, remaining: null };
              return {
                ...prev,
                checkedIn: currentHeadcount,
                remaining: prev.capacity ? Math.max(0, prev.capacity - currentHeadcount) : null,
              };
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [eventId, selectedSessionId]);

  // Refresh local offline manifest cache from server
  const refreshManifest = useCallback(async () => {
    setIsRefreshingCache(true);
    try {
      const res = await fetch(`/api/scan/manifest?eventId=${eventId}`);
      if (res.ok) {
        const data = await res.json();
        await saveEventManifest(eventId, data.eventName, data.passes, data.gates);
        setCachedPassCount(data.totalPasses || 0);
      }
    } catch {
      const meta = await getManifestMeta(eventId);
      if (meta) setCachedPassCount(meta.totalPasses);
    } finally {
      setIsRefreshingCache(false);
    }
  }, [eventId]);

  // Synchronize offline queued scans to the server
  const syncPendingScans = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const report = await syncOfflineQueue(eventId);
      const stats = await getQueueStats(eventId);
      setQueuePending(stats.pending);

      if (report.synced > 0 && report.conflicts === 0) {
        setSyncBanner({
          message: `Synchronized ${report.synced} offline check-in${report.synced > 1 ? "s" : ""} to the server.`,
          type: "success",
        });
        setTimeout(() => setSyncBanner(null), 6000);
      } else if (report.conflicts > 0) {
        setSyncBanner({
          message: `Synced ${report.synced} scan(s), but detected ${report.conflicts} duplicate conflicts across gates!`,
          type: "warning",
        });
        setTimeout(() => setSyncBanner(null), 9000);
      }
    } catch {
      // Ignore network sync errors
    } finally {
      setIsSyncing(false);
    }
  }, [eventId, isSyncing]);

  // Listen for online/offline events & initialize cache/queue counters
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    getManifestMeta(eventId).then((meta) => {
      if (meta) setCachedPassCount(meta.totalPasses);
    });
    getQueueStats(eventId).then((stats) => {
      setQueuePending(stats.pending);
    });

    let manifestTimer: ReturnType<typeof setTimeout> | null = null;
    if (navigator.onLine) {
      manifestTimer = setTimeout(() => {
        refreshManifest();
      }, 0);
    }

    const handleOnline = () => {
      setIsOnline(true);
      refreshManifest();
      syncPendingScans();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (manifestTimer) clearTimeout(manifestTimer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [eventId, refreshManifest, syncPendingScans]);

  const handleOfflineResult = useCallback(
    (offRes: OfflineVerificationResult, passToken?: string) => {
      if (offRes.status === "CHECKED_IN") {
        playScannerFeedback("CHECKED_IN", { sound: soundEnabled });
        setResult({
          attendee: offRes.attendee!,
          passType: offRes.passType || "participant",
          checkedInAt: offRes.checkedInAt,
          gateName: selectedGate?.name,
          offline: true,
          passToken,
        });
        setScanState("SUCCESS");
        setScanCount((c) => c + 1);
        setFeed((prev) => [
          {
            id: offRes.scanOperationId,
            name: `${offRes.attendee!.name} (offline)`,
            pass_type: offRes.passType || "participant",
            ts: offRes.checkedInAt || new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 25));
        getQueueStats(eventId).then((s) => setQueuePending(s.pending));
        return;
      }

      if (offRes.status === "GROUP_PASS_DETECTED") {
        setGroupModalState({
          isOpen: true,
          bookingReference: offRes.bookingReference || passToken || "group-pass",
          buyerName: offRes.attendee?.name || "Group Pass Holder",
          ticketCategory: offRes.passType || "General Admission · Group Booking",
          totalEntitlements: offRes.totalEntitlements || 1,
          previouslyAdmitted: offRes.previouslyAdmitted || 0,
          remainingEntries: offRes.remainingEntries || 0,
          history: [],
          operationId: crypto.randomUUID(),
          loading: false,
        });
        setScanState("READY");
        return;
      }

      if (offRes.status === "EXHAUSTED") {
        playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
        setErrorMsg(offRes.error || "All group pass entry entitlements have been used.");
        setScanState("DUPLICATE");
        return;
      }

      if (offRes.status === "ALREADY_CHECKED_IN") {
        playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
        setResult({
          attendee: offRes.attendee!,
          passType: offRes.passType || "participant",
          checkedInAt: offRes.checkedInAt,
          gateName: selectedGate?.name,
          offline: true,
          passToken,
        });
        setScanState("DUPLICATE");
        return;
      }

      if (offRes.status === "ACCESS_DENIED") {
        playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
        setAccessDeniedMsg(offRes.error || "Pass is not authorized for this gate / zone");
        setScanState("REJECTED");
        return;
      }

      playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
      setErrorMsg(offRes.error || "Pass not found in offline database");
      setScanState("ERROR");
    },
    [eventId, selectedGate?.name, soundEnabled]
  );

  // Debounced attendee search (online + offline fallback)
  useEffect(() => {
    if (!manualMode) return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (searchQuery.length < 2) {
      searchTimerRef.current = setTimeout(() => {
        setSearchResults([]);
      }, 0);
      return;
    }

    searchTimerRef.current = setTimeout(async () => {
      setSearchLoading(true);
      if (!isOnline) {
        const matches = await searchOfflineAttendees(eventId, searchQuery);
        setSearchResults(
          matches.map((m) => ({
            id: m.attendeeId,
            name: m.name,
            email: m.email,
            pass_type: m.passType,
            pass_status: m.checkedIn ? "checked_in" : "approved",
          }))
        );
        setSearchLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const cleanQuery = searchQuery.trim();
        const { data: attData } = await supabase
          .from("attendees")
          .select("id, name, email, pass_type, pass_status")
          .eq("event_id", eventId)
          .eq("application_status", "approved")
          .or(`name.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%,phone.ilike.%${cleanQuery}%,pass_type.ilike.%${cleanQuery}%`)
          .limit(20);

        const combined: SearchAttendee[] = ((attData as SearchAttendee[]) ?? []);

        // Also search by pass token / credential reference
        if (cleanQuery.length >= 3 && combined.length < 10) {
          try {
            const { data: passData } = await supabase
              .from("passes")
              .select("attendee_id, pass_token, attendee:attendees(id, name, email, pass_type, pass_status)")
              .eq("event_id", eventId)
              .ilike("pass_token", `%${cleanQuery}%`)
              .limit(5);

            if (passData) {
              for (const p of passData) {
                const a = Array.isArray(p.attendee) ? p.attendee[0] : p.attendee;
                if (a && !combined.some((item) => item.id === a.id)) {
                  combined.push(a as SearchAttendee);
                }
              }
            }
          } catch {
            // Ignore token lookup failure
          }
        }

        setSearchResults(combined);
      } catch {
        const matches = await searchOfflineAttendees(eventId, searchQuery);
        setSearchResults(
          matches.map((m) => ({
            id: m.attendeeId,
            name: m.name,
            email: m.email,
            pass_type: m.passType,
            pass_status: m.checkedIn ? "checked_in" : "approved",
          }))
        );
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, [searchQuery, manualMode, eventId, isOnline]);

  const verify = useCallback(
    async (rawToken: string, force = false) => {
      if (!force && (!isScannerActive || scanState !== "READY")) return;
      if (cooldownRef.current) return;
      const now = Date.now();
      if (rawToken === lastTokenRef.current && (now - lastTokenTimeRef.current < SAME_TOKEN_DEBOUNCE_MS)) {
        return;
      }

      cooldownRef.current = true;
      terminalScanCountedRef.current = false;
      pendingSuccessfulCountRef.current = 1;
      const attemptId = activeAttemptIdRef.current + 1;
      activeAttemptIdRef.current = attemptId;
      const isCurrentAttempt = () => activeAttemptIdRef.current === attemptId;
      lastTokenRef.current = rawToken;
      lastTokenTimeRef.current = now;
      setTimeout(() => { cooldownRef.current = false; }, RAPID_SCAN_COOLDOWN_MS);

      // Enforce gate selection before scanning
      if (isGateRequired) {
        playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
        setErrorMsg("Please select an entry gate before scanning passes.");
        setScanState("ERROR");
        return;
      }

      setScanState("PROCESSING");

      // ── Conference Session Check-in Flow ──
      if (selectedSessionId) {
        const parsedGroup = parseScannedGroupQR(rawToken);

        // Group QR Session Entry: Trigger modal to choose guest admission count
        if (parsedGroup.isGroupQR && scanDirection !== "out") {
          try {
            const lookupRes = await fetch(`/api/sessions/${selectedSessionId}/checkin`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                passToken: rawToken,
                action: "lookup",
              }),
            });
            const lookupData = await lookupRes.json();
            if (!isCurrentAttempt()) return;
            if (lookupRes.ok && lookupData.isGroupQR) {
              if (lookupData.remainingEntries <= 0) {
                playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
                const total = lookupData.totalEntitlements || 1;
                setResult({
                  attendee: {
                    name: lookupData.buyerName || "Group Pass Holder",
                    email: `All ${total} attendees admitted`,
                    pass_type: "group",
                  },
                  passType: "group",
                  checkedInAt: new Date().toISOString(),
                  gateName: selectedSession?.title || "Session",
                  passToken: rawToken,
                  badgeText: "ALL GROUP ENTRIES ADMITTED",
                  message: `All ${total} group members have already been admitted to "${selectedSession?.title}".`,
                });
                setScanState("DUPLICATE");
                return;
              }

              setGroupModalState({
                isOpen: true,
                bookingReference: lookupData.bookingReference || rawToken,
                buyerName: lookupData.buyerName || "Group Pass Holder",
                ticketCategory: `${selectedSession?.title || "Session"} · Group Pass`,
                totalEntitlements: lookupData.totalEntitlements || 1,
                previouslyAdmitted: lookupData.previouslyAdmitted || 0,
                remainingEntries: lookupData.remainingEntries || 1,
                history: [],
                operationId: crypto.randomUUID(),
                sessionId: selectedSessionId,
                sessionTitle: selectedSession?.title,
                loading: false,
              });
              setScanState("READY");
              return;
            }
          } catch {
            // Fall through to regular session checkin on lookup network error
          }
        }

        try {
          const res = await fetch(`/api/sessions/${selectedSessionId}/checkin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              passToken: rawToken,
              action: scanDirection === "out" ? "checkout" : "checkin",
            }),
          });
          const data = await res.json();
          if (!isCurrentAttempt()) return;
          if (data.status === "CHECKED_IN" || data.status === "CHECKED_OUT") {
            playScannerFeedback("CHECKED_IN", { sound: soundEnabled });
            setResult({
              attendee: data.attendee,
              passType: data.attendee?.pass_type || "participant",
              checkedInAt: data.checkinTime,
              gateName: `${data.session.title} (${data.session.room})`,
            });
            if (data.capacity) {
              setSessionStats({
                checkedIn: data.checkedInCount,
                capacity: data.capacity,
                remaining: data.remainingSeats,
              });
            }
            setScanState("SUCCESS");
            return;
          }
          if (data.status === "ALREADY_CHECKED_IN") {
            playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
            setResult({
              attendee: data.attendee,
              passType: data.attendee?.pass_type || "participant",
              checkedInAt: data.checkedInAt,
              gateName: `${data.session.title} (${data.session.room})`,
              passToken: rawToken,
              attendeeId: data.attendee?.id,
              badgeText: "ALREADY ENTERED SESSION",
              message: data.message || `Attendee has already entered "${data.session.title}". Tap below to allow re-entry.`,
            });
            setScanState("DUPLICATE");
            return;
          }
          if (data.status === "ACCESS_NOT_ALLOWED" || data.status === "SESSION_ACCESS_DENIED" || data.status === "SESSION_FULL" || data.status === "RESERVATION_REQUIRED") {
            playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
            setAccessDeniedMsg(data.error || "Access not allowed for this session");
            setScanState("REJECTED");
            return;
          }
          if (data.status === "PASS_REVOKED" || data.status === "TICKET_CANCELLED" || data.status === "PASS_EXPIRED") {
            playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
            setErrorMsg(data.error || "Pass has been revoked or cancelled");
            setScanState("ERROR");
            return;
          }
          if (data.status === "WRONG_EVENT") {
            playScannerFeedback("WRONG_EVENT", { sound: soundEnabled });
            setErrorMsg(data.error || "Pass is registered for a different event");
            setScanState("ERROR");
            return;
          }
          playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
          setErrorMsg(data.error || "Verification failed");
          setScanState("ERROR");
          return;
        } catch {
          playScannerFeedback("NETWORK_ERROR", { sound: soundEnabled });
          setErrorMsg("Failed to scan session pass");
          setScanState("ERROR");
          return;
        }
      }

      // ── M14: Bulk Group QR Entry Flow ──
      const cleanToken = normalizeScannedToken(rawToken);
      const parsedGroup = parseScannedGroupQR(rawToken);
      if (!selectedSessionId && parsedGroup.isGroupQR) {
        try {
          const res = await fetch(`/api/events/${eventId}/group-entry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "lookup",
              bookingReference: parsedGroup.bookingReference || cleanToken,
              gateId: selectedGateId,
              gateName: selectedGate?.name,
            }),
          });
          const data = await res.json();
          if (!isCurrentAttempt()) return;
          if (res.ok && data.success) {
	            setGroupModalState({
	              isOpen: true,
	              bookingReference: data.bookingReference || parsedGroup.bookingReference || cleanToken,
	              buyerName: data.buyerName || "Group Pass Holder",
	              ticketCategory: data.ticketCategory || "General Admission · Group Booking",
	              totalEntitlements: data.totalEntitlements || 1,
	              previouslyAdmitted: data.previouslyAdmitted || 0,
	              remainingEntries: data.remainingEntries || 0,
	              history: data.history || [],
	              operationId: crypto.randomUUID(),
	              loading: false,
	            });
            setScanState("READY");
            return;
          } else if (data.status === "EXHAUSTED") {
            playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
            const total = data.totalEntitlements || data.previouslyAdmitted || 1;
            setResult({
              attendee: data.attendee || {
                name: data.buyerName || "Group Pass Holder",
                email: `${total} of ${total} attendees admitted`,
                pass_type: "group",
              },
              passType: "group",
              checkedInAt: data.checkedInAt || new Date().toISOString(),
              gateName: selectedGate?.name,
              passToken: rawToken,
              badgeText: "ALL ATTENDEES ADMITTED",
              message: `All ${total} attendees for this pass have already been scanned & admitted into the venue.`,
            });
            setScanState("DUPLICATE");
            return;
          } else if (parsedGroup.isGroupQR && data.status === "FEATURE_DISABLED") {
            playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
            setErrorMsg("Group QR Partial Entry is disabled for this event.");
            setScanState("REJECTED");
            return;
          } else if (parsedGroup.isGroupQR && data.status === "BOOKING_INVALID") {
            playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
            setErrorMsg(data.error || "Group pass is invalid, revoked or refunded.");
            setScanState("ERROR");
            return;
          }
        } catch {
          // If network fails or lookup errors, fallback to standard verify
        }
      }

      // ── Offline Verification Flow ──
      if (!isOnline) {
        const offRes = await verifyPassOffline({
          eventId,
          passToken: rawToken,
          gateId: selectedGateId,
          gateName: selectedGate?.name,
          checkInMethod: "qr",
        });
        handleOfflineResult(offRes, rawToken);
        return;
      }

      const scanOperationId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `scan_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s deadline to avoid hanging in poor connectivity

        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            passToken: rawToken,
            eventId,
            gateId: selectedGateId,
            scanOperationId,
          }),
        });
        clearTimeout(timeoutId);
        const data = await res.json();
        if (!isCurrentAttempt()) return;

        // 0. Single Group QR Entry Flow (Prompt scanner: "How many people are entering now?")
        if (data.status === "GROUP_PASS_DETECTED" || (data.isGroupQR && data.status !== "EXHAUSTED")) {
          let batchHistory = [];
          try {
            const histRes = await fetch(`/api/events/${eventId}/group-entry`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "lookup",
                bookingReference: data.bookingReference || cleanToken,
                gateId: selectedGateId,
                gateName: selectedGate?.name,
              }),
            });
            if (!isCurrentAttempt()) return;
            if (histRes.ok) {
              const histData = await histRes.json();
              if (histData.history) batchHistory = histData.history;
            }
          } catch {
            // Non-blocking
          }

	          setGroupModalState({
	            isOpen: true,
	            bookingReference: data.bookingReference || cleanToken,
	            buyerName: data.buyerName || data.attendee?.name || "Group Pass Holder",
	            ticketCategory: data.ticketCategory || data.passType || "General Admission · Group Booking",
	            totalEntitlements: data.totalEntitlements || 1,
	            previouslyAdmitted: data.previouslyAdmitted || 0,
	            remainingEntries: data.remainingEntries || 0,
	            history: batchHistory,
	            operationId: crypto.randomUUID(),
	            loading: false,
	          });
          setScanState("READY");
          return;
        }

        // Exhausted group pass check
        if (data.status === "EXHAUSTED") {
          playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
          const total = data.totalEntitlements || data.previouslyAdmitted || 1;
          setResult({
            attendee: data.attendee || {
              name: data.buyerName || "Group Pass Holder",
              email: `${total} of ${total} attendees admitted`,
              pass_type: "group",
            },
            passType: data.passType || "group",
            checkedInAt: data.checkedInAt || new Date().toISOString(),
            gateName: selectedGate?.name,
            passToken: rawToken,
            badgeText: "ALL ATTENDEES ADMITTED",
            message: data.message || data.error || `All ${total} attendees for this pass have already been scanned & admitted into the venue.`,
          });
          setScanState("DUPLICATE");
          return;
        }

        // 1. Success check-in (Green ✓, short high chime, 80ms)
        if (data.status === "CHECKED_IN" || data.success) {
          if (selectedZoneId) {
            try {
              const zoneRes = await fetch(`/api/event/${eventId}/ops/scan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  zoneId: selectedZoneId,
                  gateId: selectedGateId,
                  gateName: selectedGate?.name,
                  direction: scanDirection,
                  attendee: {
                    id: data.attendee?.id || rawToken,
                    name: data.attendee?.name || "Attendee",
                    badgeType: data.attendee?.pass_type || "attendee",
                    ticketTypeId: data.attendee?.ticket_type_id,
                  },
                }),
              });
              const zoneData = await zoneRes.json();
              if (!isCurrentAttempt()) return;
              if (zoneData.success && !zoneData.allowed) {
                playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
                setAccessDeniedMsg(zoneData.reason || "Access denied for this zone");
                setLastScannedAttendee({
                  id: data.attendee?.id || rawToken,
                  name: data.attendee?.name || "Attendee",
                  badgeType: data.attendee?.pass_type || "attendee",
                  ticketTypeId: data.attendee?.ticket_type_id,
                });
                setScanState("REJECTED");
                return;
              }
              if (zoneData.success && zoneData.occupancy !== undefined) {
                setZones((prev) =>
                  prev.map((z) =>
                    z.id === selectedZoneId ? { ...z, currentOccupancy: zoneData.occupancy } : z
                  )
                );
              }
            } catch {
              // network fallback
            }
          }

          playScannerFeedback("CHECKED_IN", { sound: soundEnabled });
          setResult({ ...data, passToken: rawToken });
          setScanState("SUCCESS");
          return;
        }

        // 2. Duplicate check-in (Amber ⚠, double low tone)
        if (data.status === "ALREADY_CHECKED_IN" || data.alreadyCheckedIn) {
          playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
          setResult({ ...data, passToken: rawToken });
          setScanState("DUPLICATE");
          return;
        }

        // 3. Wrong event (Red ✕, low buzz)
        if (data.status === "WRONG_EVENT") {
          playScannerFeedback("WRONG_EVENT", { sound: soundEnabled });
          setErrorMsg(data.error || "Pass is registered for a different event");
          setScanState("ERROR");
          return;
        }

        // 4. Not approved (Red ✕, low buzz)
        if (data.status === "NOT_APPROVED") {
          playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
          setErrorMsg(data.error || "Attendee is not approved for this event");
          setScanState("ERROR");
          return;
        }

        // 5. Invalid pass (Red ✕, low buzz)
        if (data.status === "INVALID_PASS" || res.status === 404) {
          playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
          setErrorMsg(data.error || "Invalid pass — pass not found");
          setScanState("ERROR");
          return;
        }

        // 6. Access denied / Zone restricted
        if (res.status === 403 && (data.accessDenied || data.status === "ACCESS_DENIED")) {
          playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
          setAccessDeniedMsg(data.error || "This pass is not authorized for this gate / zone");
          setScanState("REJECTED");
          return;
        }

        // 7. Event capacity exhausted
        if (data.status === "EVENT_CAPACITY_REACHED") {
          playScannerFeedback("EVENT_CAPACITY_REACHED", { sound: soundEnabled });
          setErrorMsg(data.message || data.error || "Event capacity reached");
          setScanState("REJECTED");
          return;
        }

        // 8. General server error
        if (!res.ok) {
          playScannerFeedback("NETWORK_ERROR", { sound: soundEnabled });
          setErrorMsg(data.error || "Verification failed");
          setScanState("ERROR");
          return;
        }
      } catch {
        // Network dropped during scan — fallback to offline verification
        setIsOnline(false);
        const offRes = await verifyPassOffline({
          eventId,
          passToken: rawToken,
          gateId: selectedGateId,
          gateName: selectedGate?.name,
          checkInMethod: "qr",
        });
        if (!isCurrentAttempt()) return;
        handleOfflineResult(offRes);
      }
    },
    [eventId, isOnline, selectedGateId, selectedGate?.name, soundEnabled, handleOfflineResult, selectedZoneId, scanDirection, isGateRequired, selectedSessionId, isScannerActive]
  );

  const handleSupervisorOverride = useCallback(async () => {
    if (!lastScannedAttendee || !selectedZoneId) return;
    try {
      const res = await fetch(`/api/event/${eventId}/ops/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneId: selectedZoneId,
          gateId: selectedGateId,
          gateName: selectedGate?.name,
          direction: scanDirection,
          override: true,
          overrideReason: "Supervisor Authorized at Gate",
          staffName: "Gate Supervisor",
          attendee: lastScannedAttendee,
        }),
      });
      const data = await res.json();
      if (data.success) {
        playScannerFeedback("CHECKED_IN", { sound: soundEnabled });
        setResult({
          attendee: {
            name: `${lastScannedAttendee.name} (Override)`,
            email: "",
            pass_type: lastScannedAttendee.badgeType || "attendee",
          },
          passType: lastScannedAttendee.badgeType || "attendee",
          checkedInAt: new Date().toISOString(),
          gateName: selectedZone?.name || selectedGate?.name,
        });
        if (selectedZone) {
          setZones((prev) =>
            prev.map((z) =>
              z.id === selectedZoneId ? { ...z, currentOccupancy: data.occupancy } : z
            )
          );
        }
        setScanState("SUCCESS");
      }
    } catch {}
  }, [eventId, lastScannedAttendee, selectedZoneId, selectedGateId, selectedGate?.name, scanDirection, selectedZone, soundEnabled]);

  // Listen for hardware barcode scanners (Zebra, Honeywell, USB/Bluetooth guns)
  useEffect(() => {
    const detach = attachHardwareScannerListener({
      onScan: (token) => {
        verify(token);
      },
    });
    return () => {
      detach();
    };
  }, [verify]);

  // Manual check-in for a specific attendee
  const manualCheckIn = useCallback(
    async (attendee: SearchAttendee) => {
      if (checkingInId) return;
      setCheckingInId(attendee.id);

      try {
        if (!isOnline) {
          const offRes = await verifyPassOffline({
            eventId,
            passToken: attendee.name,
            gateId: selectedGateId,
            gateName: selectedGate?.name,
            checkInMethod: "manual",
          });
          setSearchResults((prev) =>
            prev.map((a) => (a.id === attendee.id ? { ...a, pass_status: "checked_in" } : a))
          );
          handleOfflineResult(offRes);
          setManualMode(false);
          return;
        }

        // Fetch the pass token for this attendee
        const supabase = createClient();
        const { data: passData } = await supabase
          .from("passes")
          .select("pass_token")
          .eq("attendee_id", attendee.id)
          .eq("event_id", eventId)
          .single();

        if (!passData?.pass_token) {
          setCheckingInId(null);
          return;
        }

        setManualMode(false);
        await verify(passData.pass_token, true);
        setSearchResults((prev) =>
          prev.map((a) =>
            a.id === attendee.id ? { ...a, pass_status: "checked_in" } : a
          )
        );
        return;
      } catch {
        setIsOnline(false);
        const offRes = await verifyPassOffline({
          eventId,
          passToken: attendee.name,
          gateId: selectedGateId,
          gateName: selectedGate?.name,
          checkInMethod: "manual",
        });
        setSearchResults((prev) =>
          prev.map((a) => (a.id === attendee.id ? { ...a, pass_status: "checked_in" } : a))
        );
        handleOfflineResult(offRes);
        setManualMode(false);
      } finally {
        setCheckingInId(null);
      }
    },
    [eventId, isOnline, selectedGateId, selectedGate, checkingInId, soundEnabled, handleOfflineResult]
  );

  const reset = useCallback(() => {
    if (isResettingRef.current) return;
    isResettingRef.current = true;
    setTimeout(() => {
      isResettingRef.current = false;
    }, 200);

    // Retain lastTokenRef.current and stamp lastTokenTimeRef with now
    // so that keeping the same ticket in camera frame does not cause immediate duplicate alerts
    lastTokenTimeRef.current = Date.now();
    cooldownRef.current = false;
    terminalScanCountedRef.current = false;
    pendingSuccessfulCountRef.current = 1;
    activeAttemptIdRef.current += 1;
    setResult(null);
    setErrorMsg("");
    setAccessDeniedMsg("");
    setLastResultAt(null);
    setScanState("READY");
  }, []);

  const handleUndoCheckIn = useCallback(
    async (attendeeId: string) => {
      setUndoingCheckIn(true);
      try {
        let res;
        if (selectedSessionId) {
          res = await undoSessionCheckIn({
            sessionId: selectedSessionId,
            attendeeId,
            eventId,
          });
          if (res?.success) {
            setSessionStats((prev) =>
              prev ? { ...prev, checkedIn: Math.max(0, prev.checkedIn - 1), remaining: prev.capacity ? Math.min(prev.capacity, (prev.remaining ?? 0) + 1) : null } : null
            );
          }
        } else {
          res = await undoCheckIn(attendeeId, eventId);
        }
        if (res?.success) {
          setSearchResults((prev) =>
            prev.map((a) => (a.id === attendeeId ? { ...a, pass_status: "generated" } : a))
          );
          setScanCount((c) => Math.max(0, c - 1));
          setSyncBanner({
            message: "Check-in reset. Attendee can now be admitted or re-scanned.",
            type: "success",
          });
          setTimeout(() => setSyncBanner(null), 4000);
        } else if (res?.error) {
          alert(res.error);
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to reset check-in");
      } finally {
        setUndoingCheckIn(false);
      }
    },
    [eventId, selectedSessionId]
  );

  const handleDuplicateOverride = useCallback(
    async () => {
      const token = result?.passToken;
      const attendeeId = result?.attendee?.id || result?.attendeeId;
      if (!token && !attendeeId) return;
      setUndoingCheckIn(true);
      try {
        let res;
        if (selectedSessionId) {
          res = await undoSessionCheckIn({
            sessionId: selectedSessionId,
            attendeeId,
            passToken: token,
            eventId,
          });
          if (res?.success) {
            setSessionStats((prev) =>
              prev ? { ...prev, checkedIn: Math.max(0, prev.checkedIn - 1), remaining: prev.capacity ? Math.min(prev.capacity, (prev.remaining ?? 0) + 1) : null } : null
            );
          }
        } else if (token) {
          res = await undoCheckInByToken(token, eventId);
        } else if (attendeeId) {
          res = await undoCheckIn(attendeeId, eventId);
        }
        if (res?.success) {
          setScanCount((c) => Math.max(0, c - 1));
          setSyncBanner({
            message: "Check-in reset successfully. Pass can now be scanned again.",
            type: "success",
          });
          setTimeout(() => setSyncBanner(null), 4000);
          reset();
        } else if (res?.error) {
          alert(res.error);
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to reset check-in");
      } finally {
        setUndoingCheckIn(false);
      }
    },
    [result, eventId, reset, selectedSessionId]
  );

  useEffect(() => {
    if (!isTerminalScannerState(scanState)) {
      return;
    }

    if (terminalScanCountedRef.current) return;
    terminalScanCountedRef.current = true;
    setLastResultAt(new Date().toISOString());

    setSessionCounters((prev) => recordScannerOutcome(prev, scanState, pendingSuccessfulCountRef.current));
  }, [scanState]);

  // Filtered search results
  const filteredSearchResults = searchResults.filter((a) => {
    if (searchFilter === "checked_in") return a.pass_status === "checked_in";
    if (searchFilter === "pending") return a.pass_status !== "checked_in";
    return true;
  });

  const handleConfirmGroupAdmission = useCallback(
    async (quantity: number) => {
      if (!groupModalState) return;
      setGroupModalState((prev) => (prev ? { ...prev, loading: true } : null));

      try {
        // Session-scoped group admission
        if (groupModalState.sessionId) {
          const res = await fetch(`/api/sessions/${groupModalState.sessionId}/checkin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              passToken: groupModalState.bookingReference,
              action: "checkin",
              guestCount: quantity,
              scanOperationId: groupModalState.operationId,
            }),
          });

          const data = await res.json();
          if (res.ok && data.success) {
            playScannerFeedback("CHECKED_IN", { sound: soundEnabled });
            pendingSuccessfulCountRef.current = quantity;
            setScanCount((c) => c + quantity);
            if (data.capacity) {
              setSessionStats({
                checkedIn: data.checkedInCount,
                capacity: data.capacity,
                remaining: data.remainingSeats,
              });
            }
            setFeed((f) => [
              {
                id: `group-sess-${Date.now()}`,
                name: `${groupModalState.buyerName} (+${quantity} to ${groupModalState.sessionTitle || "Session"})`,
                pass_type: "group",
                ts: new Date().toISOString(),
              },
              ...f.slice(0, 49),
            ]);
            setResult({
              attendee: {
                name: `${groupModalState.buyerName} (Group of ${quantity})`,
                email: `${Math.max(0, groupModalState.remainingEntries - quantity)} entries remain in this session`,
                pass_type: "group",
              },
              passType: "group",
              checkedInAt: data.checkinTime || new Date().toISOString(),
              gateName: `${data.session?.title || groupModalState.sessionTitle || "Session"} (${data.session?.room || "Room"})`,
            });
            setGroupModalState(null);
            setScanState("SUCCESS");
            return;
          } else {
            playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
            throw new Error(data.error || "Session admission failed");
          }
        }

        // Event gate group admission
        const res = await fetch(`/api/events/${eventId}/group-entry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "admit",
            bookingReference: groupModalState.bookingReference,
            quantity,
            gateId: selectedGateId,
            gateName: selectedGate?.name,
            scanOperationId: groupModalState.operationId,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          playScannerFeedback("CHECKED_IN", { sound: soundEnabled });
          pendingSuccessfulCountRef.current = quantity;
          setScanCount((c) => c + quantity);
          setFeed((f) => [
            {
              id: `group-${Date.now()}`,
              name: `${groupModalState.buyerName} (+${quantity} entries)`,
              pass_type: "group",
              ts: new Date().toISOString(),
            },
            ...f.slice(0, 49),
          ]);
          setResult({
            attendee: {
              name: `${groupModalState.buyerName} (Group of ${quantity})`,
              email: `${data.remainingEntries ?? (groupModalState.remainingEntries - quantity)} entries remain`,
              pass_type: "group",
            },
            passType: "group",
            checkedInAt: new Date().toISOString(),
            gateName: selectedGate?.name,
          });
          setGroupModalState(null);
          setScanState("SUCCESS");
        } else {
          playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
          throw new Error(data.error || "Admission failed");
        }
      } catch (err: any) {
        setGroupModalState((prev) => (prev ? { ...prev, loading: false } : null));
        throw err;
      }
    },
    [groupModalState, eventId, selectedGateId, selectedGate, soundEnabled]
  );

  return (
    <div className="min-h-dvh bg-[#09090B] text-white flex flex-col page-in select-none touch-manipulation pb-safe">

      {/* ── Corporate Clean Top Navigation Bar ────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#18181B]/90 backdrop-blur-md px-3 sm:px-6 shadow-xs">
        
        {/* Left: Back & Live Network Health Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.push("/scan")}
            className="-ml-1 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            aria-label="Back to events"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <Link href="/scan" className="flex items-center gap-2 pr-1 select-none">
            <Image
              src="/icon.png"
              alt="URPASS"
              width={22}
              height={22}
              className="rounded-md object-contain shrink-0"
            />
            <span className="font-bold tracking-tight text-sm text-white hidden sm:inline">
              URPASS
            </span>
          </Link>

          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              isOnline
                ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-400 hover:bg-emerald-950/60"
                : "bg-amber-950/40 border-amber-800/80 text-amber-400 hover:bg-amber-950/60"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {isOnline ? "Live" : "Offline"}
            </span>
            {queuePending > 0 && (
              <span className="rounded bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 text-[10px] font-bold text-neutral-200 tabular-nums">
                {queuePending}
              </span>
            )}
          </button>
        </div>

        {/* Center: Title & Gate Context */}
        <div className="flex flex-col items-center justify-center min-w-0 px-2 flex-1 text-center">
          <span className="text-xs sm:text-sm font-bold text-neutral-100 max-w-[140px] sm:max-w-md truncate leading-tight">
            {eventName || "QR Scanner"}
          </span>
          <span className="text-[11px] text-neutral-400 font-medium truncate max-w-[180px] sm:max-w-xs flex items-center justify-center gap-1 mt-0.5">
            {selectedSession ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold truncate">
                <Layers className="w-3 h-3 shrink-0" />
                <span className="truncate">{selectedSession.title}</span>
              </span>
            ) : selectedGate ? (
              <span className="inline-flex items-center gap-1 text-neutral-300 truncate">
                <DoorOpen className="w-3 h-3 shrink-0 text-neutral-500" />
                <span className="truncate">{selectedGate.name}</span>
              </span>
            ) : gates.length > 0 ? (
              <span className="text-amber-400 font-semibold">Select Gate</span>
            ) : (
              <span className="text-neutral-500">General Entrance</span>
            )}
          </span>
        </div>

        {/* Right: Scan Counter & Settings Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFeedDrawerOpen(true)}
            className="flex lg:hidden cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/50 px-2.5 py-1.5 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-900/50"
            title="View recent scans"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="tabular-nums font-black">{scanCount}</span>
          </button>

          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            aria-label="Scanner controls & settings"
            title="Gate, Session & Device Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Offline Reconnection Banner ─────────────────────────────── */}
      {syncBanner && (
        <div
          className={`shrink-0 px-4 py-2 text-xs flex items-center justify-between border-b transition-all animate-in slide-in-from-top duration-200 ${
            syncBanner.type === "success"
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-200"
              : "bg-amber-950/60 border-amber-800 text-amber-200"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">{syncBanner.message}</span>
          </div>
          <button
            onClick={() => setSyncBanner(null)}
            className="text-neutral-400 hover:text-neutral-200 text-xs p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="shrink-0 border-b border-violet-500/20 bg-violet-950/20 px-3 py-2">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-white">
            <span className="tabular-nums text-zinc-300">Scanned: <span className="text-white">{sessionCounters.scanned}</span></span>
            <span className="tabular-nums text-emerald-400">Successful: {sessionCounters.successful}</span>
            <span className="tabular-nums text-rose-400">Rejected: {sessionCounters.rejected}</span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/scan")}
            className="shrink-0 rounded-lg border border-violet-500/40 bg-zinc-900 px-3 py-1.5 text-[11px] font-bold text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Close Scanner
          </button>
        </div>
      </div>

      {/* ── Responsive Cockpit Container (Desktop 2-Col / Mobile Stack) ──── */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start">

        {/* ── LEFT COLUMN: Scanner & Primary Interaction (Mobile Full / Desktop 7 cols) ── */}
        <section className="w-full lg:col-span-7 flex flex-col items-center">

          {/* Mode & Direction Switcher Bar */}
          <div className="flex w-full shrink-0 items-center justify-between gap-2.5 pb-3">
            {/* Segmented Mode Controller */}
            <div className="flex flex-1 items-center rounded-lg border border-neutral-800 bg-neutral-900 p-1 shadow-2xs">
              <button
                onClick={() => {
                  if (isProcessingScan) return;
                  setManualMode(false);
                  if (scanState !== "READY") reset();
                }}
                disabled={isProcessingScan}
                className={`flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  !manualMode
                    ? "bg-violet-600 text-white shadow-xs"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Camera</span>
              </button>
              <button
                onClick={() => {
                  if (isProcessingScan) return;
                  setManualMode(true);
                  setSearchQuery("");
                  setSearchResults([]);
                  if (scanState !== "READY") reset();
                }}
                disabled={isProcessingScan}
                className={`flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  manualMode
                    ? "bg-violet-600 text-white shadow-xs"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Manual List</span>
              </button>
            </div>

            {/* Direction Indicator / Toggle */}
            <button
              onClick={() => {
                if (!isProcessingScan) setScanDirection((d) => (d === "in" ? "out" : "in"));
              }}
              disabled={isProcessingScan}
              className={`flex min-h-12 items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all shadow-2xs disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                scanDirection === "in"
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/50"
                  : "bg-blue-950/40 text-blue-300 border-blue-800/80 hover:bg-blue-900/50"
              }`}
              title="Toggle Entry / Exit"
            >
              <span className={`w-2 h-2 rounded-full ${scanDirection === "in" ? "bg-emerald-400" : "bg-blue-400"}`} />
              <span>{scanDirection === "in" ? "Entry" : "Exit"}</span>
            </button>
          </div>

          {/* Dedicated Session Doorway HUD (Mobile View) */}
          {selectedSession && (() => {
            const roomObj = Array.isArray(selectedSession.room) ? selectedSession.room[0] : (selectedSession.room as any);
            const roomName = roomObj?.name || "Main Venue";
            const effectiveCapacity = sessionStats?.capacity ?? selectedSession.capacity ?? roomObj?.capacity ?? null;
            const currentChecked = sessionStats?.checkedIn ?? 0;
            const occupancyPct = effectiveCapacity
              ? Math.min(100, Math.round((currentChecked / effectiveCapacity) * 100))
              : null;

            return (
              <div className="w-full mb-3 lg:hidden flex shrink-0 items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 shadow-2xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-xs font-bold text-neutral-100 truncate">{selectedSession.title}</p>
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {roomName} · {selectedSession.start_time?.slice(0, 5)} - {selectedSession.end_time?.slice(0, 5)}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Seats</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-black text-emerald-400 tabular-nums">
                        {currentChecked}
                      </span>
                      <span className="text-xs font-medium text-neutral-500">
                        / {effectiveCapacity ?? "∞"}
                      </span>
                    </div>
                  </div>

                  {effectiveCapacity !== null && (
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Occ.</p>
                      <span
                        className={`text-xs font-black tabular-nums ${
                          (occupancyPct ?? 0) >= 100
                            ? "text-red-400"
                            : (occupancyPct ?? 0) >= 80
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {occupancyPct}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ── Interactive Viewport (Manual Mode vs Camera Mode) ── */}
          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[360px]">

        {/* ── Manual Search Mode View ── */}
        <div className={`w-full flex-1 flex-col gap-3 ${manualMode ? "flex" : "hidden"}`}>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendee by name or email"
                autoFocus
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 py-3 pl-10 pr-9 text-sm text-neutral-100 outline-none transition-colors placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900/40 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 animate-spin" />
              )}
            </div>

            {/* Quick Filter Chips */}
            {searchResults.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto px-0.5 py-0.5">
                <button
                  onClick={() => setSearchFilter("all")}
                  className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                    searchFilter === "all"
                      ? "border-emerald-600 bg-blue-600 text-white"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  All ({searchResults.length})
                </button>
                <button
                  onClick={() => setSearchFilter("pending")}
                  className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                    searchFilter === "pending"
                      ? "border-amber-800/80 bg-amber-950/40 text-amber-300"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  Not In ({searchResults.filter((a) => a.pass_status !== "checked_in").length})
                </button>
                <button
                  onClick={() => setSearchFilter("checked_in")}
                  className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                    searchFilter === "checked_in"
                      ? "border-emerald-800/80 bg-emerald-950/40 text-emerald-300"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  Admitted ({searchResults.filter((a) => a.pass_status === "checked_in").length})
                </button>
              </div>
            )}

            {/* Search Results List */}
            <div className="flex max-h-[58vh] flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
              {searchQuery.length >= 2 && !searchLoading && filteredSearchResults.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-6 py-12 text-center">
                  <Users className="w-10 h-10 text-neutral-600 mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">No matching attendees found</p>
                  <p className="text-xs text-neutral-500 mt-1">Verify name or email spelling</p>
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-6 py-12 text-center">
                  <Search className="w-10 h-10 text-neutral-600 mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">Type at least 2 characters</p>
                  <p className="text-xs text-neutral-500 mt-1">Search attendees for fast manual verification</p>
                </div>
              )}

              {filteredSearchResults.map((a) => {
                const isIn = a.pass_status === "checked_in";
                const isChecking = checkingInId === a.id;
                return (
                  <div
                    key={a.id}
                    className={`rounded-lg border bg-neutral-900 p-3.5 transition-colors ${
                      isIn ? "border-emerald-800/80 bg-emerald-950/20" : "border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-bold text-neutral-100">{a.name}</span>
                          <span className="rounded border border-neutral-800 bg-neutral-800/80 px-1.5 py-0.5 text-[9px] font-bold uppercase text-neutral-400">
                            {PASS_TYPE_LABEL[a.pass_type] ?? a.pass_type}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-neutral-400">{a.email}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                              isIn
                                ? "border-emerald-800 bg-emerald-950/50 text-emerald-300"
                                : "border-amber-800 bg-amber-950/50 text-amber-300"
                            }`}
                          >
                            {isIn ? "Checked in" : "Not checked in"}
                          </span>
                          <span className="rounded-md border border-neutral-800 bg-neutral-800/80 px-2 py-0.5 text-[10px] font-semibold capitalize text-neutral-400">
                            {a.pass_status.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {isIn ? (
                          <div className="flex items-center gap-1.5">
                            {(allowReentry || Boolean(selectedSessionId)) && (
                              <button
                                onClick={() => handleUndoCheckIn(a.id)}
                                disabled={undoingCheckIn}
                                title="Reset check-in"
                                className="rounded-lg border border-neutral-800 bg-neutral-800/80 p-2 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white disabled:opacity-50"
                              >
                                {undoingCheckIn ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RotateCcw className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => manualCheckIn(a)}
                            disabled={isChecking}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 shadow-2xs"
                          >
                            {isChecking ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Check In
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>

        {/* ── Camera QR Mode View ── */}
        <div className={`w-full flex-col items-center justify-center ${manualMode ? "hidden" : "flex"}`}>
          {/* Gate Required Shield (If gates configured but none chosen) */}
          {isGateRequired ? (
            <div className="w-full space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 text-center animate-in fade-in shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-950/40 text-violet-300 shadow-lg shadow-violet-950/30">
                <DoorOpen className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Select Scanner Entry Gate</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Select your assigned gate to start scanning tickets and enforce zone access.
                </p>
              </div>
              <div className="space-y-2 pt-2 max-w-md mx-auto w-full">
                {gates.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSelectGate(g.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-xs font-bold text-zinc-100 transition-colors hover:bg-zinc-900 hover:border-violet-500/60 active:scale-[0.99]"
                  >
                    <span className="text-sm font-semibold">{g.name}</span>
                    {g.zone && (
                      <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/60">
                        {g.zone.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Fixed-Dimension Camera Viewfinder & Floating Result Overlays */
            <div className="w-full relative max-w-sm sm:max-w-md aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl shadow-violet-950/20">
              <QRScanner
                onScan={verify}
                active={isScannerActive}
                statusVariant={scanState}
                torchOn={torchOn}
                onTorchChange={setTorchOn}
                onTorchSupportedChange={setTorchSupported}
                facingMode={cameraFacing}
                onFacingModeChange={setCameraFacing}
                onMultipleCamerasDetected={setHasMultipleCameras}
                className="w-full h-full"
              />

              {/* Floating Quick Action Overlay on Camera (Top Right) */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                {hasMultipleCameras && (
                  <button
                    onClick={toggleCameraFacing}
                    className="rounded-xl border p-2.5 transition-all shadow-md active:scale-95 border-zinc-700/80 bg-zinc-900/80 backdrop-blur-md text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    title={cameraFacing === "environment" ? "Switch to front camera" : "Switch to rear camera"}
                    aria-label="Switch camera lens"
                  >
                    <SwitchCamera className="w-4 h-4 text-violet-400" />
                  </button>
                )}
                {torchSupported && cameraFacing === "environment" && (
                  <button
                    onClick={toggleTorch}
                    className={`rounded-xl border p-2.5 transition-all shadow-md active:scale-95 ${
                      torchOn
                        ? "border-amber-500/80 bg-amber-950/90 text-amber-300 ring-2 ring-amber-500/30"
                        : "border-zinc-700/80 bg-zinc-900/80 backdrop-blur-md text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                    title={torchOn ? "Turn flashlight off" : "Turn flashlight on"}
                    aria-label="Flashlight"
                  >
                    {torchOn ? <Flashlight className="w-4 h-4 text-amber-400 fill-current" /> : <FlashlightOff className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={toggleWakeLock}
                  className={`rounded-xl border p-2.5 transition-all shadow-md active:scale-95 ${
                    wakeLockActive
                      ? "border-violet-500/80 bg-violet-950/90 text-violet-300 ring-2 ring-violet-500/30"
                      : "border-zinc-700/80 bg-zinc-900/80 backdrop-blur-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                  title={wakeLockActive ? "Screen stay-awake enabled" : "Enable screen stay-awake"}
                  aria-label="Stay awake"
                >
                  <Sun className={`w-4 h-4 ${wakeLockActive ? "text-violet-400" : ""}`} />
                </button>
                <button
                  onClick={toggleSound}
                  className={`rounded-xl border p-2.5 transition-all shadow-md active:scale-95 ${
                    soundEnabled
                      ? "border-emerald-500/80 bg-emerald-950/90 text-emerald-300 ring-2 ring-emerald-500/30"
                      : "border-zinc-700/80 bg-zinc-900/80 backdrop-blur-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                  }`}
                  title={soundEnabled ? "Audio chime on" : "Audio muted"}
                  aria-label="Sound effects"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* 1. Verifying Glass Overlay */}
              {scanState === "PROCESSING" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-150 motion-reduce:animate-none">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-950/40 shadow-xl shadow-violet-900/20">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                  </div>
                  <div className="mt-4 text-center space-y-1">
                    <p className="text-sm font-bold text-white tracking-wide">Verifying pass...</p>
                    <p className="text-xs text-zinc-400 font-mono">Checking against guest manifest</p>
                  </div>
                </div>
              )}

              {/* 2. Result Overlays: SUCCESS */}
              {scanState === "SUCCESS" && result && (
                <div className="absolute inset-0 z-30 flex flex-col animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
                  <ResultCard
                    variant="success"
                    attendee={result.attendee}
                    passType={result.passType}
                    contextName={scanContextName}
                    checkedInAt={result.checkedInAt}
                    resultAt={lastResultAt}
                    gateName={result.gateName}
                    offline={result.offline}
                    onReset={reset}
                    successfulScans={sessionCounters.successful}
                    badgeText={result.badgeText}
                    message={result.message}
                    scanCount={result.scanCount}
                    scanHistory={result.scanHistory}
                  />
                </div>
              )}

              {/* 3. Result Overlays: DUPLICATE */}
              {scanState === "DUPLICATE" && result && (
                <div className="absolute inset-0 z-30 flex flex-col animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
                  <ResultCard
                    variant="duplicate"
                    attendee={result.attendee}
                    passType={result.passType}
                    contextName={scanContextName}
                    checkedInAt={result.checkedInAt}
                    resultAt={lastResultAt}
                    gateName={result.gateName}
                    offline={result.offline}
                    onReset={reset}
                    successfulScans={sessionCounters.successful}
                    onAllowReentry={(allowReentry || Boolean(selectedSessionId)) ? handleDuplicateOverride : undefined}
                    isUndoing={undoingCheckIn}
                    badgeText={result.badgeText}
                    message={result.message}
                    scanCount={result.scanCount}
                    scanHistory={result.scanHistory}
                  />
                </div>
              )}

              {/* 4. Result Overlays: REJECTED (Access Denied) */}
              {scanState === "REJECTED" && (
                <div className="absolute inset-0 z-30 flex flex-col animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
                  <AccessDeniedCard
                    message={accessDeniedMsg}
                    onReset={reset}
                    contextName={scanContextName}
                    gateName={selectedGate?.name || selectedSession?.title}
                    resultAt={lastResultAt}
                    successfulScans={sessionCounters.successful}
                    onOverride={lastScannedAttendee ? handleSupervisorOverride : undefined}
                  />
                </div>
              )}

              {/* 5. Result Overlays: ERROR */}
              {scanState === "ERROR" && (
                <div className="absolute inset-0 z-30 flex flex-col animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
                  <ErrorCard
                    message={errorMsg}
                    onReset={reset}
                    contextName={scanContextName}
                    gateName={selectedGate?.name || selectedSession?.title}
                    resultAt={lastResultAt}
                    successfulScans={sessionCounters.successful}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>

    {/* ── RIGHT COLUMN: Desktop Cockpit & Live Operations HUD (Hidden on Mobile) ── */}
    <aside className="hidden lg:flex lg:col-span-5 flex-col gap-5 w-full sticky top-20">
      
      {/* 1. Tracked Session / Gate Doorway Card */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">Doorway Telemetry</h3>
          </div>
          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Change Gate / Session
          </button>
        </div>

        {selectedSession ? (() => {
          const roomObj = Array.isArray(selectedSession.room) ? selectedSession.room[0] : (selectedSession.room as any);
          const roomName = roomObj?.name || "Main Venue";
          const effectiveCapacity = sessionStats?.capacity ?? selectedSession.capacity ?? roomObj?.capacity ?? null;
          const currentChecked = sessionStats?.checkedIn ?? 0;
          const occupancyPct = effectiveCapacity
            ? Math.min(100, Math.round((currentChecked / effectiveCapacity) * 100))
            : null;

          return (
            <div className="pt-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                  Breakout Session
                </span>
                <h4 className="text-sm font-bold text-neutral-100 mt-1 leading-snug">{selectedSession.title}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {roomName} · {selectedSession.start_time?.slice(0, 5)} - {selectedSession.end_time?.slice(0, 5)}
                </p>
              </div>

              {/* Headcount Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
                  <p className="text-[10px] font-bold uppercase text-neutral-400">Admitted Headcount</p>
                  <p className="text-xl font-black text-emerald-400 tabular-nums mt-0.5">
                    {currentChecked}
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
                  <p className="text-[10px] font-bold uppercase text-neutral-400">Capacity Limit</p>
                  <p className="text-xl font-black text-neutral-200 tabular-nums mt-0.5">
                    {effectiveCapacity ? effectiveCapacity : "Unlimited"}
                  </p>
                </div>
              </div>

              {effectiveCapacity !== null && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-400">Occupancy</span>
                    <span className={`font-black tabular-nums ${(occupancyPct ?? 0) >= 100 ? "text-red-400" : (occupancyPct ?? 0) >= 80 ? "text-amber-400" : "text-emerald-400"}`}>
                      {occupancyPct}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        (occupancyPct ?? 0) >= 100 ? "bg-red-500" : (occupancyPct ?? 0) >= 80 ? "bg-amber-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.min(100, occupancyPct ?? 0)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })() : (
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                  General Event Entry
                </span>
                <h4 className="text-sm font-bold text-neutral-100 mt-1">
                  {selectedGate ? selectedGate.name : "Main Entrance Gate"}
                </h4>
                {selectedGate?.zone && (
                  <p className="text-xs text-neutral-400 mt-0.5">Assigned Zone: {selectedGate.zone.name}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-neutral-400">Total Scanned</p>
                <p className="text-2xl font-black text-emerald-400 tabular-nums">{scanCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Real-time Live Scans Feed Panel */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-xs flex flex-col flex-1 max-h-[460px]">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">Live Activity Feed</h3>
          </div>
          <span className="rounded-full bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 tabular-nums">
            {scanCount} admitted
          </span>
        </div>

        <div className="flex-1 overflow-y-auto mt-3 space-y-2 pr-1">
          {feed.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs font-medium">
              No check-ins recorded yet. Ready to scan passes!
            </div>
          ) : (
            feed.map((entry, idx) => (
              <div
                key={entry.id || idx}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/60 p-2.5 transition-colors hover:bg-neutral-800/50"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-100 truncate">{entry.name}</p>
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      {new Date(entry.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase shrink-0">
                  {PASS_TYPE_LABEL[entry.pass_type] ?? entry.pass_type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </aside>

  </div>

  {/* ── Ergonomic Mobile Bottom Action Bar (Mobile Only) ─────────── */}
  <footer className="lg:hidden shrink-0 px-4 py-3 pb-safe bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 z-20 shadow-xl">
    <div className="max-w-md mx-auto flex items-center justify-between gap-3">
      {isTerminalScannerState(scanState) ? (
        <button
          onClick={reset}
          className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/40 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Scan Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={() => setFeedDrawerOpen(true)}
          className="flex flex-1 items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 text-left transition-colors hover:bg-zinc-800/80 active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-100">
              {scanCount} Admitted
            </span>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
            Live Feed <ChevronUp className="w-3.5 h-3.5" />
          </span>
        </button>
      )}

      {torchSupported && (
        <button
          onClick={toggleTorch}
          className={`rounded-xl border p-2.5 transition-all shadow-md active:scale-95 ${
            torchOn
              ? "border-amber-500/80 bg-amber-950/90 text-amber-300 ring-2 ring-amber-500/30"
              : "border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          }`}
          title={torchOn ? "Turn torch off" : "Turn flashlight torch on"}
          aria-label="Flashlight"
        >
          {torchOn ? <Flashlight className="w-4 h-4 fill-current text-amber-400" /> : <FlashlightOff className="w-4 h-4" />}
        </button>
      )}
    </div>
  </footer>

      {/* ── Slide-up Recent Activity Feed Drawer ─────────────────────── */}
      {feedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setFeedDrawerOpen(false)}
          />
		          <div className="relative flex max-h-[80svh] flex-col rounded-t-lg border-t border-neutral-800 bg-neutral-900 p-5 pb-safe shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle */}
		            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-700" />

            <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-neutral-100">Recent Check-ins Feed</h3>
              </div>
              <div className="flex items-center gap-2">
		                <span className="rounded-md border border-emerald-800 bg-emerald-950/60 px-2.5 py-1 text-xs font-bold text-emerald-300">
	                  {scanCount} Total
                </span>
                <button
                  onClick={() => setFeedDrawerOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-3 space-y-2 max-h-[55svh] pr-1">
              {feed.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 text-xs font-medium">
                  No check-ins recorded yet during this session.
                </div>
              ) : (
                feed.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
		                    className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950/60 p-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
	                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
	                        <p className="text-xs font-bold text-neutral-100 truncate">{entry.name}</p>
	                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {new Date(entry.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase shrink-0">
                      {PASS_TYPE_LABEL[entry.pass_type] ?? entry.pass_type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Slide-up Scanner Controls & Settings Drawer ──────────────── */}
      {settingsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setSettingsDrawerOpen(false)}
          />
		          <div className="relative flex max-h-[85svh] flex-col rounded-t-lg border-t border-neutral-800 bg-neutral-900 p-5 pb-safe shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle */}
		            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-700" />

            <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-neutral-300" />
                <h3 className="text-sm font-bold text-neutral-100">Scanner Configuration</h3>
              </div>
              <button
                onClick={() => setSettingsDrawerOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-4 max-h-[65svh] pr-1">

              {/* 1. Gate Switcher */}
              {gates.length > 0 && (
                <div className="space-y-2">
	                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5" /> Assigned Gate
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {gates.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setSelectedGateId(g.id);
                          setSelectedSessionId(null);
                          try {
                            localStorage.setItem(`urpass_gate_${eventId}`, g.id);
                          } catch {}
                        }}
	                        className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
	                          selectedGateId === g.id
	                            ? "border-violet-500 bg-violet-600 font-bold text-white shadow-md shadow-violet-950/40"
		                            : "bg-zinc-950/60 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{g.name}</p>
                          {g.zone && (
	                            <p className={`text-[10px] mt-0.5 ${selectedGateId === g.id ? "text-violet-100" : "text-zinc-500"}`}>{g.zone.name}</p>
                          )}
                        </div>
                        {selectedGateId === g.id && (
                          <Check className="w-4 h-4 text-white shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Session Switcher */}
              {sessions.length > 0 && (
                <div className="space-y-2">
	                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Tracked Conference Session
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedSessionId(null)}
	                      className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
	                        !selectedSessionId
	                          ? "border-violet-500 bg-violet-600 font-bold text-white shadow-md shadow-violet-950/40"
	                          : "bg-zinc-950/60 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
	                      }`}
                    >
                      <span className="text-xs font-bold">General Event Entry (No Session)</span>
                      {!selectedSessionId && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                    {sessions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedSessionId(s.id);
                          setSelectedGateId(null);
                        }}
	                        className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
	                          selectedSessionId === s.id
	                            ? "border-violet-500 bg-violet-600 font-bold text-white shadow-md shadow-violet-950/40"
	                            : "bg-zinc-950/60 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
	                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold truncate">{s.title}</p>
	                          <p className={`text-[10px] mt-0.5 ${selectedSessionId === s.id ? "text-violet-100" : "text-zinc-500"}`}>
                            {s.room?.name || "Main Venue"} · {s.start_time?.slice(0, 5)}
                          </p>
                        </div>
                        {selectedSessionId === s.id && (
                          <Check className="w-4 h-4 text-white shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Hardware & Environmental Controls */}
              <div className="space-y-2">
	                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Device Hardware &amp; Feedback
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={toggleSound}
	                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 transition-all cursor-pointer ${
                      soundEnabled
	                        ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold"
	                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
	                    {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-zinc-500" />}
                    <span className="text-xs font-bold">{soundEnabled ? "Audio On" : "Audio Muted"}</span>
                  </button>

                  <button
                    onClick={toggleWakeLock}
	                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 transition-all cursor-pointer ${
                      wakeLockActive
	                        ? "bg-violet-950/60 border-violet-500/40 text-violet-300 font-bold"
	                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
	                    <Sun className={`w-5 h-5 ${wakeLockActive ? "text-violet-400 animate-pulse" : "text-zinc-500"}`} />
                    <span className="text-xs font-bold">{wakeLockActive ? "Screen Awake" : "Sleep Normal"}</span>
                  </button>

                  {hasMultipleCameras && (
                    <button
                      onClick={toggleCameraFacing}
                      className="col-span-2 flex items-center justify-center gap-2 rounded-xl border p-3 transition-all cursor-pointer bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                    >
                      <SwitchCamera className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-bold">
                        Lens: {cameraFacing === "environment" ? "Rear (Back) Camera" : "Front (Selfie) Camera"}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Offline Cache & Sync */}
		              <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
	                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <div>
	                      <p className="text-xs font-bold text-zinc-100">Local Offline Cache</p>
	                      <p className="text-[10px] text-zinc-500">
                        {cachedPassCount} passes cached on device
                      </p>
                    </div>
                  </div>
                  {isOnline && (
                    <button
                      onClick={refreshManifest}
                      disabled={isRefreshingCache}
		                      className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                      title="Update local cache"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingCache ? "animate-spin" : ""}`} />
                    </button>
                  )}
                </div>

                {queuePending > 0 && (
                  <button
                    onClick={syncPendingScans}
                    disabled={isSyncing || !isOnline}
	                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/40 transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 cursor-pointer"
                  >
                    <CloudUpload className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Sync {queuePending} Offline Check-in{queuePending > 1 ? "s" : ""}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── M14: Bulk Group QR Entry Modal ────────────────────────────── */}
      {groupModalState?.isOpen && (
        <GroupEntryModal
          isOpen={groupModalState.isOpen}
          onClose={() => setGroupModalState(null)}
          bookingReference={groupModalState.bookingReference}
          buyerName={groupModalState.buyerName}
          ticketCategory={groupModalState.ticketCategory}
          totalEntitlements={groupModalState.totalEntitlements}
          previouslyAdmitted={groupModalState.previouslyAdmitted}
          remainingEntries={groupModalState.remainingEntries}
          gateName={groupModalState.sessionTitle ? groupModalState.sessionTitle : (selectedGate?.name || "Gate A")}
          history={groupModalState.history || []}
          loading={groupModalState.loading}
          onConfirmAdmission={handleConfirmGroupAdmission}
        />
      )}

    </div>
  );
}

// ── Result card Component ───────────────────────────────────────────────────

function ResultCard({
  variant,
  attendee,
  passType,
  contextName,
  checkedInAt,
  resultAt,
  gateName,
  offline,
  onReset,
  successfulScans,
  onAllowReentry,
  isUndoing,
  badgeText,
  message,
  scanCount,
  scanHistory,
}: {
  variant: "success" | "duplicate";
  attendee: { id?: string; name: string; email: string; pass_type: string };
  passType: string;
  contextName: string;
  checkedInAt?: string | null;
  resultAt?: string | null;
  gateName?: string | null;
  offline?: boolean;
  onReset: () => void;
  successfulScans: number;
  onAllowReentry?: () => void;
  isUndoing?: boolean;
  badgeText?: string;
  message?: string;
  scanCount?: number;
  scanHistory?: Array<{
    scan_number: number;
    scanned_at: string;
    gate_name?: string | null;
    scanned_by?: string | null;
  }>;
}) {
  const ok = variant === "success";

  return (
    <div
      className={`relative h-full w-full flex flex-col justify-between p-4 sm:p-5 backdrop-blur-xl bg-zinc-950/95 text-white overflow-y-auto border rounded-2xl ${
        ok ? "border-emerald-500/40 shadow-emerald-950/30" : "border-amber-500/40 shadow-amber-950/30"
      }`}
    >
      {/* Top Header & Status Icon */}
      <div className="flex flex-col items-center text-center gap-2">
        <div
          className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border transition-all ${
            ok
              ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-950/40"
              : "bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-lg shadow-amber-950/40"
          }`}
        >
          {ok ? (
            <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-amber-400" />
          )}
        </div>

        <div className="space-y-1 w-full px-1">
          <span
            className={`inline-block text-[10px] font-extrabold tracking-widest uppercase px-3 py-0.5 rounded-full border ${
              ok
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                : "bg-amber-500/15 text-amber-300 border-amber-500/40"
            }`}
          >
            {badgeText || (ok ? (scanCount && scanCount > 1 ? `SCAN #${scanCount} VERIFIED` : "ENTRY GRANTED") : "ALREADY ADMITTED")}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
            {ok ? (scanCount && scanCount > 1 ? `Scan #${scanCount} Successful` : "Check-in Successful") : "Already Checked In"}
          </h2>
          <p className="text-sm sm:text-base font-bold text-white truncate max-w-[280px] mx-auto">
            {attendee.name}
          </p>
          {message ? (
            <p className="text-xs font-medium text-amber-400 max-w-[280px] mx-auto leading-relaxed">
              {message}
            </p>
          ) : attendee.email ? (
            <p className="text-xs text-zinc-400 truncate max-w-[260px] mx-auto font-mono">
              {attendee.email}
            </p>
          ) : null}
        </div>

        {/* Badges and metadata */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center pt-0.5">
          <span className="rounded-lg border border-white/10 bg-zinc-900/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase text-zinc-200">
            {PASS_TYPE_LABEL[passType] ?? passType}
          </span>
          {gateName && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-900/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-zinc-300">
              <DoorOpen className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>{gateName}</span>
            </span>
          )}
          <span className="rounded-lg border border-white/10 bg-zinc-900/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-zinc-400">
            {contextName}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2.5 text-[11px] text-zinc-400 pt-0.5">
          {(checkedInAt || resultAt) && (
            <span>
              {ok ? "Admitted: " : "First scanned: "}
              <strong className="text-zinc-200 font-mono">
                {new Date(checkedInAt || resultAt || "").toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </strong>
            </span>
          )}
          <span>•</span>
          <span>
            Checked In:{" "}
            <strong className={`${ok ? "text-emerald-400" : "text-amber-400"} tabular-nums font-bold`}>
              {scanCount ?? 1} {Number(scanCount) === 1 ? "time" : "times"}
            </strong>
          </span>
        </div>

        {/* Check-in timestamp tracking timeline & history */}
        {((scanHistory && scanHistory.length > 0) || (scanCount && scanCount > 1)) && (
          <div
            className={`w-full mt-2 p-2.5 rounded-xl border text-left space-y-1.5 ${
              ok
                ? "border-emerald-500/30 bg-emerald-950/30"
                : "border-amber-500/30 bg-amber-950/40"
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  ok ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    ok ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                {ok ? "Check-in Log" : "Previous Check-in Log"}
              </span>
              <span
                className={`font-black px-2 py-0.5 rounded-md border font-mono text-[11px] ${
                  ok
                    ? "text-emerald-200 bg-emerald-500/20 border-emerald-400/30"
                    : "text-amber-200 bg-amber-500/20 border-amber-400/30"
                }`}
              >
                Total: {scanCount ?? scanHistory?.length ?? 1} {Number(scanCount ?? scanHistory?.length ?? 1) === 1 ? "Scan" : "Scans"}
              </span>
            </div>
            {scanHistory && scanHistory.length > 0 ? (
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1 text-[11px] text-zinc-300 divide-y divide-white/5">
                {scanHistory.map((sh, idx) => (
                  <div key={idx} className="flex items-center justify-between pt-1">
                    <span className="text-zinc-300 flex items-center gap-1">
                      <span className="font-semibold text-zinc-200">
                        Scan #{sh.scan_number || idx + 1}
                      </span>
                      {sh.gate_name && (
                        <span className="text-zinc-400">· {sh.gate_name}</span>
                      )}
                    </span>
                    <span className="font-mono text-zinc-300 text-[10px]">
                      {new Date(sh.scanned_at).toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : checkedInAt ? (
              <div className="flex items-center justify-between text-[11px] pt-1 text-zinc-300">
                <span className="text-zinc-400">Scan #1 {gateName ? `· ${gateName}` : ""}</span>
                <span className="font-mono text-zinc-300">
                  {new Date(checkedInAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            ) : null}
          </div>
        )}

        {offline && (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-800/80 bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            <WifiOff className="w-3 h-3" /> Offline Queued
          </span>
        )}
      </div>

      {/* Action Footer with Scan Next */}
      <div className="flex flex-col gap-2 pt-2 w-full">
        {variant === "duplicate" && onAllowReentry && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAllowReentry();
            }}
            disabled={isUndoing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 px-3 py-2.5 text-xs font-bold text-zinc-200 transition-colors disabled:opacity-50"
          >
            {isUndoing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Allow Re-entry (Reset Check-in)</span>
          </button>
        )}

        <button
          onClick={onReset}
          autoFocus
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/50 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Scan Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Access Denied Card Component ─────────────────────────────────────────────

function AccessDeniedCard({
  message,
  onReset,
  contextName,
  gateName,
  resultAt,
  successfulScans,
  onOverride,
}: {
  message: string;
  onReset: () => void;
  contextName: string;
  gateName?: string | null;
  resultAt?: string | null;
  successfulScans: number;
  onOverride?: () => void;
}) {
  return (
    <div className="relative h-full w-full flex flex-col justify-between p-4 sm:p-5 backdrop-blur-xl bg-zinc-950/95 text-white overflow-y-auto border border-red-500/40 rounded-2xl shadow-xl shadow-red-950/30">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-red-500/50 bg-red-500/15 text-red-400 shadow-lg shadow-red-950/40">
          <ShieldX className="h-7 w-7 sm:h-8 sm:w-8 text-red-400" />
        </div>

        <div className="space-y-1 w-full px-1">
          <span className="inline-block text-[10px] font-extrabold tracking-widest uppercase px-3 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/40">
            ACCESS DENIED
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
            Not Admitted
          </h2>
          <p className="text-xs font-semibold text-red-400 max-w-[280px] mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center pt-0.5">
          <span className="rounded-lg border border-white/10 bg-zinc-900/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-zinc-300">
            {contextName}
          </span>
          {gateName && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-900/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-zinc-300">
              <DoorOpen className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>{gateName}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-2.5 text-[11px] text-zinc-400 pt-0.5">
          {resultAt && (
            <span>
              Scanned: <strong className="text-zinc-200 font-mono">
                {new Date(resultAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
              </strong>
            </span>
          )}
          <span>•</span>
          <span>
            Scans: <strong className="text-emerald-400 tabular-nums">{successfulScans}</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 w-full">
        {onOverride && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOverride();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-600 bg-amber-950/80 px-3 py-2.5 text-xs font-bold text-amber-300 transition-colors hover:bg-amber-900/80"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Authorize Supervisor Override</span>
          </button>
        )}

        <button
          onClick={onReset}
          autoFocus
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/50 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Scan Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Error Card Component ─────────────────────────────────────────────────────

function ErrorCard({
  message,
  onReset,
  contextName,
  gateName,
  resultAt,
  successfulScans,
}: {
  message: string;
  onReset: () => void;
  contextName: string;
  gateName?: string | null;
  resultAt?: string | null;
  successfulScans: number;
}) {
  return (
    <div className="relative h-full w-full flex flex-col justify-between p-4 sm:p-5 backdrop-blur-xl bg-zinc-950/95 text-white overflow-y-auto border border-red-500/40 rounded-2xl shadow-xl shadow-red-950/30">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-red-500/50 bg-red-500/15 text-red-400 shadow-lg shadow-red-950/40">
          <XCircle className="h-7 w-7 sm:h-8 sm:w-8 text-red-400" />
        </div>

        <div className="space-y-1 w-full px-1">
          <span className="inline-block text-[10px] font-extrabold tracking-widest uppercase px-3 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/40">
            INVALID PASS
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
            Verification Failed
          </h2>
          <p className="text-xs font-semibold text-red-400 max-w-[280px] mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center pt-0.5">
          <span className="rounded-lg border border-white/10 bg-zinc-900/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-zinc-300">
            {contextName}
          </span>
          {gateName && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-900/90 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-zinc-300">
              <DoorOpen className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>{gateName}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-2.5 text-[11px] text-zinc-400 pt-0.5">
          {resultAt && (
            <span>
              Scanned: <strong className="text-zinc-200 font-mono">
                {new Date(resultAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
              </strong>
            </span>
          )}
          <span>•</span>
          <span>
            Scans: <strong className="text-emerald-400 tabular-nums">{successfulScans}</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 w-full">
        <button
          onClick={onReset}
          autoFocus
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/50 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Scan Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
