"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
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
  X,
  Layers,
  Sparkles,
  ChevronUp,
  Radio,
  Check,
  Zap,
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
import GroupEntryModal from "@/components/scan/GroupEntryModal";
import { parseScannedGroupQR } from "@/lib/group-entry";

const QRScanner = dynamic(() => import("@/components/scan/QRScanner"), { ssr: false });

type ScanState = "idle" | "scanning" | "verifying" | "success" | "duplicate" | "error" | "access_denied";

interface ScanResult {
  attendee: { id?: string; name: string; email: string; pass_type: string };
  passType: string;
  checkedInAt?: string | null;
  gateName?: string | null;
  offline?: boolean;
  passToken?: string;
  attendeeId?: string;
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

const AUTO_RESET_SUCCESS_MS = 600;
const AUTO_RESET_ALERT_MS = 1800;
const AUTO_RESET_DUPLICATE_MS = 6000;
const SAME_TOKEN_DEBOUNCE_MS = 2000; // Debounce same QR code to prevent duplicate triggers
const RAPID_SCAN_COOLDOWN_MS = 150; // Minimal 150ms cooldown between different tickets
const SOUND_STORAGE_KEY = "urpass_scanner_sound_enabled";

export default function ScanEventPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.eventId as string;

  const [eventName, setEventName] = useState<string>("");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [accessDeniedMsg, setAccessDeniedMsg] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const [resetProgress, setResetProgress] = useState(0);
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
    loading: boolean;
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
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [cachedPassCount, setCachedPassCount] = useState<number>(0);
  const [queuePending, setQueuePending] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isRefreshingCache, setIsRefreshingCache] = useState<boolean>(false);
  const [syncBanner, setSyncBanner] = useState<{ message: string; type: "success" | "warning" } | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const wakeLockRef = useRef<WakeLockController | null>(null);

  // Torch control
  const [torchOn, setTorchOn] = useState<boolean>(false);

  const selectedGate = gates.find((g) => g.id === selectedGateId) ?? null;
  const selectedSession = sessions.find((s) => s.id === selectedSessionId) ?? null;
  const selectedZone = zones.find((z) => z.id === selectedZoneId) ?? null;

  const lastTokenRef = useRef<string | null>(null);
  const lastTokenTimeRef = useRef<number>(0);
  const cooldownRef = useRef(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Force gate selection before scanning begins if gates are configured
  const isGateRequired = gates.length > 0 && !selectedGateId && !selectedSessionId;
  const isScannerActive = !manualMode && !isGateRequired && (scanState === "idle" || scanState === "scanning" || scanState === "success");

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

  // Fetch event name + gates on mount
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [{ data: eventData }, { data: gateData }, { data: sessionData }] = await Promise.all([
        supabase.from("events").select("name").eq("id", eventId).single(),
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

      if (eventData) setEventName(eventData.name);

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
        const foundSession = urlSession ? sessionData.find((s) => s.id === urlSession) : null;
        if (foundSession) {
          setSelectedSessionId(foundSession.id);
          setSelectedGateId(null);

          // Fetch initial session headcount & capacity
          supabase
            .from("session_checkins")
            .select("id", { count: "exact", head: true })
            .eq("session_id", foundSession.id)
            .then(({ count }) => {
              const roomObj = Array.isArray(foundSession.room) ? foundSession.room[0] : (foundSession.room as any);
              const cap = foundSession.capacity || roomObj?.capacity || null;
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
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [eventId]);

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
        setScanState("success");
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
        setScanState("duplicate");
        return;
      }

      if (offRes.status === "ACCESS_DENIED") {
        playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
        setAccessDeniedMsg(offRes.error || "Pass is not authorized for this gate / zone");
        setScanState("access_denied");
        return;
      }

      playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
      setErrorMsg(offRes.error || "Pass not found in offline database");
      setScanState("error");
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
        const { data } = await supabase
          .from("attendees")
          .select("id, name, email, pass_type, pass_status")
          .eq("event_id", eventId)
          .eq("application_status", "approved")
          .ilike("name", `%${searchQuery}%`)
          .limit(15);
        setSearchResults((data as SearchAttendee[]) ?? []);
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
    async (rawToken: string) => {
      if (cooldownRef.current) return;
      const now = Date.now();
      if (rawToken === lastTokenRef.current && (now - lastTokenTimeRef.current < SAME_TOKEN_DEBOUNCE_MS)) {
        return;
      }

      // Interrupt existing reset countdown if a new ticket is scanned immediately
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }

      cooldownRef.current = true;
      lastTokenRef.current = rawToken;
      lastTokenTimeRef.current = now;
      setTimeout(() => { cooldownRef.current = false; }, RAPID_SCAN_COOLDOWN_MS);

      // Enforce gate selection before scanning
      if (isGateRequired) {
        playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
        setErrorMsg("Please select an entry gate before scanning passes.");
        setScanState("error");
        return;
      }

      setScanState("verifying");

      // ── Conference Session Check-in Flow ──
      if (selectedSessionId) {
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
            setScanState("success");
            return;
          }
          if (data.status === "ALREADY_CHECKED_IN") {
            playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
            setResult({
              attendee: data.attendee,
              passType: data.attendee?.pass_type || "participant",
              checkedInAt: data.checkedInAt,
              gateName: `${data.session.title} (${data.session.room})`,
            });
            setScanState("duplicate");
            return;
          }
          if (data.status === "ACCESS_NOT_ALLOWED" || data.status === "SESSION_FULL") {
            playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
            setAccessDeniedMsg(data.error || "Access not allowed for this session");
            setScanState("access_denied");
            return;
          }
          if (data.status === "WRONG_EVENT") {
            playScannerFeedback("WRONG_EVENT", { sound: soundEnabled });
            setErrorMsg(data.error || "Pass is registered for a different event");
            setScanState("error");
            return;
          }
          playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
          setErrorMsg(data.error || "Verification failed");
          setScanState("error");
          return;
        } catch {
          playScannerFeedback("NETWORK_ERROR", { sound: soundEnabled });
          setErrorMsg("Failed to scan session pass");
          setScanState("error");
          return;
        }
      }

      // ── M14: Bulk Group QR Entry Flow ──
      const parsedGroup = parseScannedGroupQR(rawToken);
      if (parsedGroup.isGroupQR && !selectedSessionId) {
        try {
          const res = await fetch(`/api/events/${eventId}/group-entry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "lookup",
              bookingReference: rawToken,
              gateId: selectedGateId,
              gateName: selectedGate?.name,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setGroupModalState({
              isOpen: true,
              bookingReference: data.bookingReference || rawToken,
              buyerName: data.buyerName || "Group Pass Holder",
              ticketCategory: data.ticketCategory || "General Admission · Group Booking",
              totalEntitlements: data.totalEntitlements || 1,
              previouslyAdmitted: data.previouslyAdmitted || 0,
              remainingEntries: data.remainingEntries || 0,
              history: data.history || [],
              loading: false,
            });
            setScanState("idle");
            return;
          } else if (data.status === "EXHAUSTED") {
            playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
            setErrorMsg("All group pass entry entitlements have been used.");
            setScanState("duplicate");
            return;
          } else if (data.status === "FEATURE_DISABLED") {
            playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
            setErrorMsg("Group QR Partial Entry is disabled for this event.");
            setScanState("access_denied");
            return;
          } else if (data.status === "BOOKING_INVALID") {
            playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
            setErrorMsg(data.error || "Group pass is invalid, revoked or refunded.");
            setScanState("error");
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
              if (zoneData.success && !zoneData.allowed) {
                playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
                setAccessDeniedMsg(zoneData.reason || "Access denied for this zone");
                setLastScannedAttendee({
                  id: data.attendee?.id || rawToken,
                  name: data.attendee?.name || "Attendee",
                  badgeType: data.attendee?.pass_type || "attendee",
                  ticketTypeId: data.attendee?.ticket_type_id,
                });
                setScanState("access_denied");
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
          setScanState("success");
          return;
        }

        // 2. Duplicate check-in (Amber ⚠, double low tone)
        if (data.status === "ALREADY_CHECKED_IN" || data.alreadyCheckedIn) {
          playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
          setResult({ ...data, passToken: rawToken });
          setScanState("duplicate");
          return;
        }

        // 3. Wrong event (Red ✕, low buzz)
        if (data.status === "WRONG_EVENT") {
          playScannerFeedback("WRONG_EVENT", { sound: soundEnabled });
          setErrorMsg(data.error || "Pass is registered for a different event");
          setScanState("error");
          return;
        }

        // 4. Not approved (Red ✕, low buzz)
        if (data.status === "NOT_APPROVED") {
          playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
          setErrorMsg(data.error || "Attendee is not approved for this event");
          setScanState("error");
          return;
        }

        // 5. Invalid pass (Red ✕, low buzz)
        if (data.status === "INVALID_PASS" || res.status === 404) {
          playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
          setErrorMsg(data.error || "Invalid pass — pass not found");
          setScanState("error");
          return;
        }

        // 6. Access denied / Zone restricted
        if (res.status === 403 && (data.accessDenied || data.status === "ACCESS_DENIED")) {
          playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
          setAccessDeniedMsg(data.error || "This pass is not authorized for this gate / zone");
          setScanState("access_denied");
          return;
        }

        // 7. General server error
        if (!res.ok) {
          playScannerFeedback("NETWORK_ERROR", { sound: soundEnabled });
          setErrorMsg(data.error || "Verification failed");
          setScanState("error");
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
        handleOfflineResult(offRes);
      }
    },
    [eventId, isOnline, selectedGateId, selectedGate?.name, soundEnabled, handleOfflineResult, selectedZoneId, scanDirection, isGateRequired, selectedSessionId]
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
        setScanState("success");
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

        const scanOperationId = typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `scan_${Date.now()}_${Math.random().toString(36).slice(2)}`;

        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            passToken: passData.pass_token,
            eventId,
            gateId: selectedGateId,
            scanOperationId,
          }),
        });
        const data = await res.json();

        // Update local search results to reflect new status
        setSearchResults((prev) =>
          prev.map((a) =>
            a.id === attendee.id ? { ...a, pass_status: "checked_in" } : a
          )
        );

        if (data.status === "CHECKED_IN" || data.success) {
          playScannerFeedback("CHECKED_IN", { sound: soundEnabled });
        } else if (data.status === "ALREADY_CHECKED_IN" || data.alreadyCheckedIn) {
          playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
        } else if (data.status === "WRONG_EVENT") {
          playScannerFeedback("WRONG_EVENT", { sound: soundEnabled });
        } else if (data.status === "NOT_APPROVED") {
          playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
        } else if (data.status === "INVALID_PASS" || res.status === 404) {
          playScannerFeedback("INVALID_PASS", { sound: soundEnabled });
        } else if (res.status === 403 && (data.accessDenied || data.status === "ACCESS_DENIED")) {
          playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
          setAccessDeniedMsg(data.error || "Access denied for this gate");
          setScanState("access_denied");
          setManualMode(false);
          lastTokenRef.current = passData.pass_token;
        } else {
          playScannerFeedback("NETWORK_ERROR", { sound: soundEnabled });
        }
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
    lastTokenRef.current = null;
    cooldownRef.current = false;
    setResult(null);
    setErrorMsg("");
    setAccessDeniedMsg("");
    setResetProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    setScanState("idle");
  }, []);

  const handleUndoCheckIn = useCallback(
    async (attendeeId: string) => {
      setUndoingCheckIn(true);
      try {
        const res = await undoCheckIn(attendeeId, eventId);
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
    [eventId]
  );

  const handleDuplicateOverride = useCallback(
    async () => {
      const token = result?.passToken;
      const attendeeId = result?.attendee?.id || result?.attendeeId;
      if (!token && !attendeeId) return;
      setUndoingCheckIn(true);
      try {
        let res;
        if (token) {
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
    [result, eventId, reset]
  );

  useEffect(() => {
    if (
      scanState === "success" ||
      scanState === "duplicate" ||
      scanState === "error" ||
      scanState === "access_denied"
    ) {
      const durationMs =
        scanState === "success"
          ? AUTO_RESET_SUCCESS_MS
          : scanState === "duplicate"
          ? AUTO_RESET_DUPLICATE_MS
          : AUTO_RESET_ALERT_MS;
      const initTimer = setTimeout(() => setResetProgress(0), 0);
      const step = 100 / (durationMs / 50);
      progressRef.current = setInterval(() => {
        setResetProgress((p) => {
          if (p >= 100) { clearInterval(progressRef.current!); return 100; }
          return p + step;
        });
      }, 50);
      const t = setTimeout(reset, durationMs);
      return () => {
        clearTimeout(initTimer);
        clearTimeout(t);
        if (progressRef.current) clearInterval(progressRef.current);
      };
    }
  }, [scanState, reset]);

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
        const res = await fetch(`/api/events/${eventId}/group-entry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "admit",
            bookingReference: groupModalState.bookingReference,
            quantity,
            gateId: selectedGateId,
            gateName: selectedGate?.name,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          playScannerFeedback("CHECKED_IN", { sound: soundEnabled });
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
          setScanState("success");
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
    <div className="min-h-screen bg-[#090A0F] text-white flex flex-col page-in select-none touch-manipulation">

      {/* ── Mobile-Optimized Top HUD Bar ────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-3 sm:px-5 h-14 bg-neutral-950/90 backdrop-blur-md border-b border-white/[0.08] z-30 sticky top-0">
        
        {/* Left: Back & Network Health Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/scan")}
            className="p-1.5 -ml-1 rounded-xl text-white/50 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Back to events"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold border transition-all active:scale-95 ${
              isOnline
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/15 border-amber-500/30 text-amber-300 animate-pulse"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400 animate-ping"}`} />
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {isOnline ? "Live" : "Offline"}
            </span>
            {queuePending > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-brand text-[9px] text-white font-bold">
                {queuePending}
              </span>
            )}
          </button>
        </div>

        {/* Center: Title & Gate Context */}
        <div className="flex flex-col items-center justify-center min-w-0 px-2 flex-1 text-center">
          <span className="text-xs font-bold text-white max-w-[130px] sm:max-w-[200px] truncate leading-tight">
            {eventName || "QR Scanner"}
          </span>
          <span className="text-[10px] text-violet-400 font-medium truncate max-w-[140px] flex items-center gap-1">
            {selectedSession ? (
              <>📚 {selectedSession.title}</>
            ) : selectedGate ? (
              <>🚪 {selectedGate.name}</>
            ) : gates.length > 0 ? (
              <span className="text-amber-400 font-bold animate-pulse">Select Gate ⚠️</span>
            ) : (
              <>⚡ Main Gate</>
            )}
          </span>
        </div>

        {/* Right: Live Counter & Settings Trigger */}
        <div className="flex items-center gap-1.5">
          <div
            onClick={() => setFeedDrawerOpen(true)}
            className="cursor-pointer flex items-center gap-1 bg-white/[0.07] border border-white/10 hover:bg-white/10 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-400 active:scale-95 transition-all shadow-2xs"
            title="View recent scans"
          >
            <Zap className="w-3 h-3 fill-current text-emerald-400" />
            <span className="tabular-nums">{scanCount}</span>
          </div>

          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className="p-2 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.12] text-white/80 active:scale-95 transition-all"
            aria-label="Scanner controls & settings"
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
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
              : "bg-amber-500/15 border-amber-500/30 text-amber-200"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">{syncBanner.message}</span>
          </div>
          <button
            onClick={() => setSyncBanner(null)}
            className="text-white/60 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Mode & Direction Switcher Bar (Mobile Segmented Control) ─── */}
      <div className="shrink-0 px-4 pt-3 pb-1 flex items-center justify-between gap-2 max-w-sm mx-auto w-full">
        {/* Segmented Mode Controller */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex-1">
          <button
            onClick={() => {
              setManualMode(false);
              if (scanState !== "idle") reset();
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              !manualMode
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => {
              setManualMode(true);
              setSearchQuery("");
              setSearchResults([]);
              if (scanState !== "idle") reset();
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              manualMode
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        {/* Direction Indicator / Toggle */}
        <button
          onClick={() => setScanDirection((d) => (d === "in" ? "out" : "in"))}
          className={`px-3 py-2 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider border transition-all active:scale-95 flex items-center gap-1 ${
            scanDirection === "in"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              : "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
          }`}
          title="Toggle Entry / Exit"
        >
          <span className={`w-2 h-2 rounded-full ${scanDirection === "in" ? "bg-emerald-400" : "bg-blue-400"}`} />
          <span>{scanDirection === "in" ? "Entry" : "Exit"}</span>
        </button>
      </div>

      {/* ── Dedicated Session Doorway HUD ───────────────────────────── */}
      {selectedSession && (() => {
        const roomObj = Array.isArray(selectedSession.room) ? selectedSession.room[0] : (selectedSession.room as any);
        const roomName = roomObj?.name || "Main Venue";
        const effectiveCapacity = sessionStats?.capacity ?? selectedSession.capacity ?? roomObj?.capacity ?? null;
        const currentChecked = sessionStats?.checkedIn ?? 0;
        const occupancyPct = effectiveCapacity
          ? Math.min(100, Math.round((currentChecked / effectiveCapacity) * 100))
          : null;

        return (
          <div className="shrink-0 px-4 py-2.5 mx-4 mb-2 bg-gradient-to-r from-purple-950/70 via-neutral-900/90 to-purple-950/70 border border-purple-500/30 rounded-2xl backdrop-blur-md shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <p className="text-xs font-bold text-white truncate">{selectedSession.title}</p>
              </div>
              <p className="text-[10px] text-purple-300/80 truncate mt-0.5">
                {roomName} • {selectedSession.start_time?.slice(0, 5)} - {selectedSession.end_time?.slice(0, 5)}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Seats</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-emerald-400 tabular-nums">
                    {currentChecked}
                  </span>
                  <span className="text-xs font-medium text-white/40">
                    / {effectiveCapacity ?? "∞"}
                  </span>
                </div>
              </div>

              {effectiveCapacity !== null && (
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Occupancy</p>
                  <span
                    className={`text-xs font-black tabular-nums ${
                      (occupancyPct ?? 0) >= 100
                        ? "text-red-400"
                        : (occupancyPct ?? 0) >= 80
                        ? "text-amber-400"
                        : "text-purple-300"
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

      {/* ── Main Viewport Area ──────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-3 relative">

        {/* ── Manual Search Mode View ── */}
        {manualMode ? (
          <div className="w-full max-w-md flex-1 flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendee by name or email…"
                autoFocus
                className="w-full pl-10 pr-9 py-3.5 bg-white/[0.06] border border-white/[0.12] rounded-2xl text-sm text-white placeholder-white/30 outline-none focus:border-violet-500 focus:bg-white/[0.09] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 animate-spin" />
              )}
            </div>

            {/* Quick Filter Chips */}
            {searchResults.length > 0 && (
              <div className="flex items-center gap-1.5 px-0.5">
                <button
                  onClick={() => setSearchFilter("all")}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    searchFilter === "all"
                      ? "bg-white text-neutral-900"
                      : "bg-white/[0.06] text-white/60 hover:bg-white/10"
                  }`}
                >
                  All ({searchResults.length})
                </button>
                <button
                  onClick={() => setSearchFilter("pending")}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    searchFilter === "pending"
                      ? "bg-amber-400 text-neutral-950"
                      : "bg-white/[0.06] text-white/60 hover:bg-white/10"
                  }`}
                >
                  Not In ({searchResults.filter((a) => a.pass_status !== "checked_in").length})
                </button>
                <button
                  onClick={() => setSearchFilter("checked_in")}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    searchFilter === "checked_in"
                      ? "bg-emerald-400 text-neutral-950"
                      : "bg-white/[0.06] text-white/60 hover:bg-white/10"
                  }`}
                >
                  Checked In ({searchResults.filter((a) => a.pass_status === "checked_in").length})
                </button>
              </div>
            )}

            {/* Search Results List */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-0.5">
              {searchQuery.length >= 2 && !searchLoading && filteredSearchResults.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="w-10 h-10 text-white/15 mb-3" />
                  <p className="text-sm font-medium text-white/50">No matching attendees found</p>
                  <p className="text-xs text-white/30 mt-1">Try another search or verify spelling</p>
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-10 h-10 text-white/15 mb-3" />
                  <p className="text-sm font-medium text-white/50">Type at least 2 characters</p>
                  <p className="text-xs text-white/30 mt-1">Find attendees for fast manual check-in</p>
                </div>
              )}

              {filteredSearchResults.map((a) => {
                const isIn = a.pass_status === "checked_in";
                const isChecking = checkingInId === a.id;
                return (
                  <div
                    key={a.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isIn
                        ? "bg-emerald-950/20 border-emerald-800/40"
                        : "bg-white/[0.05] border-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate">{a.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase">
                          {PASS_TYPE_LABEL[a.pass_type] ?? a.pass_type}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate mt-0.5">{a.email}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isIn ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Admitted
                          </span>
                          <button
                            onClick={() => handleUndoCheckIn(a.id)}
                            disabled={undoingCheckIn}
                            title="Reset check-in"
                            className="p-2 rounded-xl bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/15 border border-white/10 active:scale-95 transition-all disabled:opacity-50"
                          >
                            {undoingCheckIn ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => manualCheckIn(a)}
                          disabled={isChecking}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50"
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
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Camera QR Mode View ── */
          <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center">

            {/* Gate Required Shield (If gates configured but none chosen) */}
            {isGateRequired ? (
              <div className="w-full bg-neutral-900/95 border border-purple-500/30 rounded-3xl p-6 text-center shadow-2xl space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 mx-auto">
                  <DoorOpen className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Select Scanner Entry Gate</h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    Select your assigned gate to start scanning tickets and enforce zone access.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  {gates.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSelectedGateId(g.id);
                        try {
                          localStorage.setItem(`urpass_gate_${eventId}`, g.id);
                        } catch {}
                      }}
                      className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-purple-600 hover:text-white text-neutral-100 border border-white/10 active:scale-95 transition-all flex items-center justify-between"
                    >
                      <span>{g.name}</span>
                      {g.zone && (
                        <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800">
                          {g.zone.name}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Scanner Camera Viewfinder */
              <div className={`w-full relative ${scanState === "idle" || scanState === "scanning" ? "block" : "hidden"}`}>
                <QRScanner onScan={verify} active={isScannerActive} statusVariant={scanState} />

                {/* Floating Quick Action Overlay on Camera */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                  <button
                    onClick={toggleWakeLock}
                    className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                      wakeLockActive
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                        : "bg-black/50 text-white/60 border-white/20 hover:text-white"
                    }`}
                    title={wakeLockActive ? "Screen lock active" : "Enable screen stay-awake"}
                  >
                    <Sun className={`w-4 h-4 ${wakeLockActive ? "text-amber-400 animate-pulse" : ""}`} />
                  </button>
                  <button
                    onClick={toggleSound}
                    className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                      soundEnabled
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-black/50 text-white/40 border-white/20"
                    }`}
                    title={soundEnabled ? "Audio chime on" : "Audio muted"}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Verifying Spinner */}
            {scanState === "verifying" && (
              <div className="flex flex-col items-center gap-5 py-8 animate-in fade-in">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping" />
                  <div className="relative w-full h-full rounded-full bg-violet-600/15 border border-violet-500/40 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-white">Verifying pass…</p>
                  <p className="text-xs text-white/40 font-mono">Checking against guest manifest</p>
                </div>
              </div>
            )}

            {/* Result: SUCCESS (Entry Granted) */}
            {scanState === "success" && result && (
              <div
                className="w-full cursor-pointer select-none animate-in zoom-in-95 duration-150"
                onClick={reset}
                title="Tap anywhere to scan next"
              >
                <ResultCard
                  variant="success"
                  attendee={result.attendee}
                  passType={result.passType}
                  checkedInAt={result.checkedInAt}
                  gateName={result.gateName}
                  offline={result.offline}
                  onReset={reset}
                  progress={resetProgress}
                />
              </div>
            )}

            {/* Result: DUPLICATE (Already Checked In) */}
            {scanState === "duplicate" && result && (
              <div className="w-full select-none animate-in zoom-in-95 duration-150">
                <ResultCard
                  variant="duplicate"
                  attendee={result.attendee}
                  passType={result.passType}
                  checkedInAt={result.checkedInAt}
                  gateName={result.gateName}
                  offline={result.offline}
                  onReset={reset}
                  progress={resetProgress}
                  onAllowReentry={handleDuplicateOverride}
                  isUndoing={undoingCheckIn}
                />
              </div>
            )}

            {/* Result: ACCESS DENIED */}
            {scanState === "access_denied" && (
              <div className="w-full select-none animate-in zoom-in-95 duration-150">
                <AccessDeniedCard
                  message={accessDeniedMsg}
                  onReset={reset}
                  progress={resetProgress}
                  onOverride={lastScannedAttendee ? handleSupervisorOverride : undefined}
                />
              </div>
            )}

            {/* Result: ERROR / INVALID */}
            {scanState === "error" && (
              <div
                className="w-full cursor-pointer select-none animate-in zoom-in-95 duration-150"
                onClick={reset}
              >
                <ErrorCard message={errorMsg} onReset={reset} progress={resetProgress} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Floating Bottom Bar (Recent Check-ins Drawer Trigger) ────── */}
      <footer className="shrink-0 px-4 py-3 bg-neutral-950/90 backdrop-blur-md border-t border-white/[0.08] z-20">
        <div className="max-w-sm mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setFeedDrawerOpen(true)}
            className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] active:scale-98 transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-white">
                {scanCount} Admitted
              </span>
            </div>
            <span className="text-[11px] font-semibold text-violet-400 flex items-center gap-1">
              Live Feed <ChevronUp className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={toggleTorch}
            className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${
              torchOn
                ? "bg-amber-400 text-neutral-950 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                : "bg-white/[0.06] border-white/[0.08] text-white/70 hover:text-white"
            }`}
            title={torchOn ? "Turn torch off" : "Turn flashlight torch on"}
            aria-label="Flashlight"
          >
            {torchOn ? <Flashlight className="w-4 h-4 fill-current" /> : <FlashlightOff className="w-4 h-4" />}
          </button>
        </div>
      </footer>

      {/* ── Slide-up Recent Activity Feed Drawer ─────────────────────── */}
      {feedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setFeedDrawerOpen(false)}
          />
          <div className="relative bg-neutral-900 border-t border-white/10 rounded-t-3xl max-h-[75vh] flex flex-col p-5 animate-in slide-in-from-bottom duration-200 shadow-2xl">
            {/* Grab Handle */}
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Recent Check-ins Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {scanCount} Total
                </span>
                <button
                  onClick={() => setFeedDrawerOpen(false)}
                  className="p-1 rounded-full text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-3 space-y-2 max-h-[50vh] pr-1">
              {feed.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-xs">
                  No check-ins recorded yet during this session.
                </div>
              ) : (
                feed.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{entry.name}</p>
                        <p className="text-[10px] text-white/40 font-mono mt-0.5">
                          {new Date(entry.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase shrink-0">
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
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setSettingsDrawerOpen(false)}
          />
          <div className="relative bg-neutral-900 border-t border-white/10 rounded-t-3xl max-h-[85vh] flex flex-col p-5 animate-in slide-in-from-bottom duration-200 shadow-2xl">
            {/* Grab Handle */}
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Scanner Configuration</h3>
              </div>
              <button
                onClick={() => setSettingsDrawerOpen(false)}
                className="p-1 rounded-full text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-4 max-h-[65vh] pr-1">

              {/* 1. Gate Switcher */}
              {gates.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
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
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          selectedGateId === g.id
                            ? "bg-violet-600/20 border-violet-500/60 text-white font-bold"
                            : "bg-white/[0.04] border-white/[0.06] text-white/70 hover:bg-white/[0.08]"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{g.name}</p>
                          {g.zone && (
                            <p className="text-[10px] text-violet-300 mt-0.5">{g.zone.name}</p>
                          )}
                        </div>
                        {selectedGateId === g.id && (
                          <Check className="w-4 h-4 text-violet-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Session Switcher */}
              {sessions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Tracked Conference Session
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedSessionId(null)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        !selectedSessionId
                          ? "bg-violet-600/20 border-violet-500/60 text-white font-bold"
                          : "bg-white/[0.04] border-white/[0.06] text-white/70"
                      }`}
                    >
                      <span className="text-xs font-bold">General Event Entry (No Session)</span>
                      {!selectedSessionId && <Check className="w-4 h-4 text-violet-400 shrink-0" />}
                    </button>
                    {sessions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedSessionId(s.id);
                          setSelectedGateId(null);
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          selectedSessionId === s.id
                            ? "bg-violet-600/20 border-violet-500/60 text-white font-bold"
                            : "bg-white/[0.04] border-white/[0.06] text-white/70 hover:bg-white/[0.08]"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold truncate">{s.title}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">
                            {s.room?.name || "Main Venue"} · {s.start_time?.slice(0, 5)}
                          </p>
                        </div>
                        {selectedSessionId === s.id && (
                          <Check className="w-4 h-4 text-violet-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Hardware & Environmental Controls */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                  Device Hardware &amp; Feedback
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={toggleSound}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      soundEnabled
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        : "bg-white/[0.04] border-white/[0.06] text-white/40"
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    <span className="text-xs font-bold">{soundEnabled ? "Audio On" : "Audio Muted"}</span>
                  </button>

                  <button
                    onClick={toggleWakeLock}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      wakeLockActive
                        ? "bg-amber-400/15 border-amber-400/30 text-amber-300"
                        : "bg-white/[0.04] border-white/[0.06] text-white/40"
                    }`}
                  >
                    <Sun className={`w-5 h-5 ${wakeLockActive ? "animate-pulse" : ""}`} />
                    <span className="text-xs font-bold">{wakeLockActive ? "Screen Awake" : "Sleep Normal"}</span>
                  </button>
                </div>
              </div>

              {/* 4. Offline Cache & Sync */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Local Offline Cache</p>
                      <p className="text-[10px] text-white/40">
                        {cachedPassCount} passes cached on device
                      </p>
                    </div>
                  </div>
                  {isOnline && (
                    <button
                      onClick={refreshManifest}
                      disabled={isRefreshingCache}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 disabled:opacity-50"
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
                    className="w-full py-2.5 px-3 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-500 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
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
          gateName={selectedGate?.name || "Gate A"}
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
  checkedInAt,
  gateName,
  offline,
  onReset,
  progress,
  onAllowReentry,
  isUndoing,
}: {
  variant: "success" | "duplicate";
  attendee: { id?: string; name: string; email: string; pass_type: string };
  passType: string;
  checkedInAt?: string | null;
  gateName?: string | null;
  offline?: boolean;
  onReset: () => void;
  progress: number;
  onAllowReentry?: () => void;
  isUndoing?: boolean;
}) {
  const ok = variant === "success";
  const color = ok ? "#10b981" : "#f59e0b";
  const borderCls = ok
    ? "bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
    : "bg-amber-950/40 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.25)]";

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Main Status Header Box */}
      <div className={`rounded-3xl border overflow-hidden ${borderCls} relative p-5 flex flex-col items-center text-center gap-3`}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: `${color}25` }}
        >
          {ok ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-in zoom-in-50" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-amber-400 animate-in zoom-in-50" />
          )}
        </div>

        <div>
          <span
            className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {ok ? "ENTRY GRANTED" : "ALREADY CHECKED IN"}
          </span>
          <h2 className="text-xl font-extrabold text-white mt-2 leading-tight">
            {attendee.name}
          </h2>
          <p className="text-xs text-white/50 truncate max-w-[240px] mx-auto mt-0.5">
            {attendee.email}
          </p>
        </div>

        {/* Pass Tier & Info Pill */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center mt-1">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/15 uppercase">
            {PASS_TYPE_LABEL[passType] ?? passType}
          </span>
          {gateName && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.06] text-white/70">
              🚪 {gateName}
            </span>
          )}
        </div>

        {checkedInAt && (
          <p className="text-[11px] font-mono text-white/40 mt-0.5">
            {ok ? "Admitted at " : "First scanned at "}
            {new Date(checkedInAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
          </p>
        )}

        {offline && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <WifiOff className="w-2.5 h-2.5" /> Offline Queued
          </span>
        )}
      </div>

      {/* Re-entry Override Action for Duplicates */}
      {variant === "duplicate" && onAllowReentry && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAllowReentry();
          }}
          disabled={isUndoing}
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 text-neutral-950 font-extrabold text-xs hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isUndoing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4" />
          )}
          <span>Allow Re-entry (Reset Check-in)</span>
        </button>
      )}

      {/* Auto-reset Progress Bar */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{ width: `${progress}%`, background: color }}
          />
        </div>
        <button
          onClick={onReset}
          className="text-center text-xs text-white/50 hover:text-white font-medium py-1"
        >
          Tap anywhere to scan next
        </button>
      </div>
    </div>
  );
}

// ── Access Denied Card Component ─────────────────────────────────────────────

function AccessDeniedCard({
  message,
  onReset,
  progress,
  onOverride,
}: {
  message: string;
  onReset: () => void;
  progress: number;
  onOverride?: () => void;
}) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="bg-red-950/40 border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.25)] rounded-3xl p-5 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shadow-lg">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
            ACCESS DENIED
          </span>
          <h2 className="text-xl font-extrabold text-white mt-2 leading-tight">
            Not Admitted
          </h2>
          <p className="text-xs text-red-300/80 mt-1 max-w-[240px] mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {onOverride && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOverride();
            }}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-amber-500 text-neutral-950 font-extrabold text-xs hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <ShieldAlert className="w-4 h-4 text-neutral-950" />
            <span>Authorize Supervisor Override</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-red-500 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={onReset}
          className="text-center text-xs text-white/50 hover:text-white font-medium py-1"
        >
          Tap to try again
        </button>
      </div>
    </div>
  );
}

// ── Error Card Component ─────────────────────────────────────────────────────

function ErrorCard({
  message,
  onReset,
  progress,
}: {
  message: string;
  onReset: () => void;
  progress: number;
}) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="bg-red-950/40 border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.25)] rounded-3xl p-5 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shadow-lg">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
            INVALID PASS
          </span>
          <h2 className="text-xl font-extrabold text-white mt-2 leading-tight">
            Verification Failed
          </h2>
          <p className="text-xs text-red-300/80 mt-1 max-w-[240px] mx-auto leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-red-500 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={onReset}
          className="text-center text-xs text-white/50 hover:text-white font-medium py-1"
        >
          Tap anywhere to retry
        </button>
      </div>
    </div>
  );
}
