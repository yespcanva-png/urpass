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
  ChevronUp,
  Radio,
  Check,
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
  badgeText?: string;
  message?: string;
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
	    operationId: string;
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
        setScanState("idle");
        return;
      }

      if (offRes.status === "EXHAUSTED") {
        playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
        setErrorMsg(offRes.error || "All group pass entry entitlements have been used.");
        setScanState("duplicate");
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
              passToken: rawToken,
              attendeeId: data.attendee?.id,
              badgeText: "ALREADY ENTERED SESSION",
              message: data.message || `Attendee has already entered "${data.session.title}". Tap below to allow re-entry.`,
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
            setScanState("idle");
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
            setScanState("duplicate");
            return;
          } else if (parsedGroup.isGroupQR && data.status === "FEATURE_DISABLED") {
            playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
            setErrorMsg("Group QR Partial Entry is disabled for this event.");
            setScanState("access_denied");
            return;
          } else if (parsedGroup.isGroupQR && data.status === "BOOKING_INVALID") {
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
          setScanState("idle");
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
          setScanState("duplicate");
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

        setManualMode(false);
        await verify(passData.pass_token);
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
	            scanOperationId: groupModalState.operationId,
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
    <div className="min-h-dvh bg-zinc-50 text-slate-900 flex flex-col page-in select-none touch-manipulation pb-safe">

      {/* ── Mobile-Optimized Top HUD Bar ────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-5">
        
        {/* Left: Back & Network Health Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => router.push("/scan")}
            className="-ml-1 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
            aria-label="Back to events"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
              isOnline
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-amber-50 border-amber-300 text-amber-900"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {isOnline ? "Live" : "Offline"}
            </span>
            {queuePending > 0 && (
              <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                {queuePending}
              </span>
            )}
          </button>
        </div>

        {/* Center: Title & Gate Context */}
        <div className="flex flex-col items-center justify-center min-w-0 px-2 flex-1 text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-900 max-w-[120px] sm:max-w-[220px] truncate leading-tight">
            {eventName || "QR Scanner"}
          </span>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[140px] flex items-center gap-1">
            {selectedSession ? (
              <>{selectedSession.title}</>
            ) : selectedGate ? (
              <>
                <DoorOpen className="w-3 h-3 shrink-0 text-slate-400" />
                <span className="truncate">{selectedGate.name}</span>
              </>
            ) : gates.length > 0 ? (
              <span className="text-amber-700 font-bold">Select Gate</span>
            ) : (
              <>Main Gate</>
            )}
          </span>
        </div>

        {/* Right: Live Counter & Settings Trigger */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFeedDrawerOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
            title="View recent scans"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="tabular-nums font-black">{scanCount}</span>
          </button>

          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className="rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-700 transition-colors hover:bg-slate-100"
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
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-300 text-amber-950"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span className="truncate">{syncBanner.message}</span>
          </div>
          <button
            onClick={() => setSyncBanner(null)}
            className="text-slate-500 hover:text-slate-900 text-xs p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Mode & Direction Switcher Bar (Mobile Segmented Control) ─── */}
      <div className="mx-auto flex w-full max-w-lg shrink-0 items-center justify-between gap-2 px-3.5 pb-1 pt-3">
        {/* Segmented Mode Controller */}
        <div className="flex flex-1 items-center rounded-md border border-slate-200 bg-white p-1">
          <button
            onClick={() => {
              setManualMode(false);
              if (scanState !== "idle") reset();
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-2 text-xs font-bold transition-colors ${
              !manualMode
                ? "bg-blue-700 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>
          <button
            onClick={() => {
              setManualMode(true);
              setSearchQuery("");
              setSearchResults([]);
              if (scanState !== "idle") reset();
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-2 text-xs font-bold transition-colors ${
              manualMode
                ? "bg-blue-700 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Manual List</span>
          </button>
        </div>

        {/* Direction Indicator / Toggle */}
        <button
          onClick={() => setScanDirection((d) => (d === "in" ? "out" : "in"))}
          className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors ${
            scanDirection === "in"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-blue-50 text-blue-800 border-blue-300"
          }`}
          title="Toggle Entry / Exit"
        >
          <span className={`w-2 h-2 rounded-full ${scanDirection === "in" ? "bg-emerald-500" : "bg-blue-500"}`} />
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
          <div className="mx-3.5 mb-2 flex shrink-0 items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-xs font-bold text-slate-900 truncate">{selectedSession.title}</p>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {roomName} / {selectedSession.start_time?.slice(0, 5)} - {selectedSession.end_time?.slice(0, 5)}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Seats</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-emerald-700 tabular-nums">
                    {currentChecked}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    / {effectiveCapacity ?? "Unlimited"}
                  </span>
                </div>
              </div>

              {effectiveCapacity !== null && (
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Occupancy</p>
                  <span
                    className={`text-xs font-black tabular-nums ${
                      (occupancyPct ?? 0) >= 100
                        ? "text-red-500"
                        : (occupancyPct ?? 0) >= 80
                        ? "text-amber-500"
                        : "text-blue-700"
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
      <main className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-3.5 py-3 sm:px-4">

        {/* ── Manual Search Mode View ── */}
        {manualMode ? (
          <div className="w-full flex-1 flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
	                placeholder="Search attendee by name or email"
	                autoFocus
	                className="w-full rounded-md border border-slate-300 bg-white py-3 pl-10 pr-9 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
	                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 animate-spin" />
              )}
            </div>

            {/* Quick Filter Chips */}
            {searchResults.length > 0 && (
	              <div className="flex items-center gap-1.5 overflow-x-auto px-0.5 py-0.5">
                <button
                  onClick={() => setSearchFilter("all")}
	                  className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors ${
	                    searchFilter === "all"
	                      ? "border-blue-700 bg-blue-700 text-white"
	                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All ({searchResults.length})
                </button>
                <button
                  onClick={() => setSearchFilter("pending")}
	                  className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors ${
	                    searchFilter === "pending"
	                      ? "border-amber-300 bg-amber-50 text-amber-800"
	                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Not In ({searchResults.filter((a) => a.pass_status !== "checked_in").length})
                </button>
                <button
                  onClick={() => setSearchFilter("checked_in")}
	                  className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors ${
	                    searchFilter === "checked_in"
	                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
	                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Admitted ({searchResults.filter((a) => a.pass_status === "checked_in").length})
                </button>
              </div>
            )}

            {/* Search Results List */}
	            <div className="flex max-h-[62vh] flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
	              {searchQuery.length >= 2 && !searchLoading && filteredSearchResults.length === 0 && (
	                <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-6 py-12 text-center">
	                  <Users className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-800">No matching attendees found</p>
                  <p className="text-xs text-slate-400 mt-1">Verify name or email spelling</p>
                </div>
              )}

	              {searchQuery.length < 2 && (
	                <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-6 py-12 text-center">
                  <Search className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Type at least 2 characters</p>
                  <p className="text-xs text-slate-400 mt-1">Search attendees for fast manual verification</p>
                </div>
              )}

              {filteredSearchResults.map((a) => {
                const isIn = a.pass_status === "checked_in";
                const isChecking = checkingInId === a.id;
                return (
	                  <div
	                    key={a.id}
	                    className={`rounded-lg border bg-white p-3 transition-colors ${
	                      isIn ? "border-emerald-200" : "border-slate-200 hover:border-slate-300"
	                    }`}
	                  >
	                    <div className="flex items-start justify-between gap-3">
	                      <div className="min-w-0">
	                        <div className="flex items-center gap-2">
	                          <span className="truncate text-sm font-bold text-slate-950">{a.name}</span>
	                          <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-600">
	                            {PASS_TYPE_LABEL[a.pass_type] ?? a.pass_type}
	                          </span>
	                        </div>
	                        <p className="mt-0.5 truncate text-xs text-slate-500">{a.email}</p>
	                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
	                          <span
	                            className={`rounded-md border px-2 py-1 text-[10px] font-bold ${
	                              isIn
	                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
	                                : "border-amber-200 bg-amber-50 text-amber-700"
	                            }`}
	                          >
	                            {isIn ? "Checked in" : "Not checked in"}
	                          </span>
	                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold capitalize text-slate-600">
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
	                              className="rounded-md border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
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
	                          className="flex items-center gap-1 rounded-md bg-blue-700 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
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
        ) : (
          /* ── Camera QR Mode View ── */
          <div className="w-full flex flex-col items-center justify-center">

            {/* Gate Required Shield (If gates configured but none chosen) */}
            {isGateRequired ? (
	              <div className="w-full space-y-4 rounded-lg border border-slate-200 bg-white p-6 text-center animate-in fade-in">
	                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
                  <DoorOpen className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Select Scanner Entry Gate</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
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
	                      className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-50"
                    >
                      <span>{g.name}</span>
                      {g.zone && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
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
	                    className={`rounded-md border p-2.5 transition-colors ${
	                      wakeLockActive
	                        ? "border-amber-300 bg-amber-50 text-amber-900"
	                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                    title={wakeLockActive ? "Screen stay-awake enabled" : "Enable screen stay-awake"}
                  >
                    <Sun className={`w-4 h-4 ${wakeLockActive ? "text-amber-800" : ""}`} />
                  </button>
                  <button
                    onClick={toggleSound}
	                    className={`rounded-md border p-2.5 transition-colors ${
	                      soundEnabled
	                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
	                        : "border-slate-200 bg-white text-slate-400"
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
              <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in">
                <div className="relative w-20 h-20">
	                  <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-slate-200 bg-white">
                    <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
                  </div>
                </div>
                <div className="text-center space-y-1">
	                  <p className="text-sm font-bold text-slate-900">Verifying pass...</p>
                  <p className="text-xs text-slate-500 font-mono">Checking against guest manifest</p>
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

            {/* Result: DUPLICATE (Already Checked In / All Attendees Admitted) */}
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
                  onAllowReentry={(allowReentry || Boolean(selectedSessionId)) ? handleDuplicateOverride : undefined}
                  isUndoing={undoingCheckIn}
                  badgeText={result.badgeText}
                  message={result.message}
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

      {/* ── Floating Mobile Bottom Bar ───────────────────────────────── */}
      <footer className="shrink-0 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-20 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
	          <button
	            onClick={() => setFeedDrawerOpen(true)}
	            className="flex flex-1 items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-900">
                {scanCount} Admitted
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              Live Feed <ChevronUp className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={toggleTorch}
	            className={`rounded-md border p-3 transition-colors ${
              torchOn
	                ? "border-amber-300 bg-amber-50 text-amber-900"
	                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            }`}
            title={torchOn ? "Turn torch off" : "Turn flashlight torch on"}
            aria-label="Flashlight"
          >
            {torchOn ? <Flashlight className="w-4 h-4 fill-current text-amber-600" /> : <FlashlightOff className="w-4 h-4" />}
          </button>
        </div>
      </footer>

      {/* ── Slide-up Recent Activity Feed Drawer ─────────────────────── */}
      {feedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setFeedDrawerOpen(false)}
          />
	          <div className="relative flex max-h-[80svh] flex-col rounded-t-lg border-t border-slate-200 bg-white p-5 pb-safe shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle */}
	            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />

            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Check-ins Feed</h3>
              </div>
              <div className="flex items-center gap-2">
	                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  {scanCount} Total
                </span>
                <button
                  onClick={() => setFeedDrawerOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-900 active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-3 space-y-2 max-h-[55svh] pr-1">
              {feed.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  No check-ins recorded yet during this session.
                </div>
              ) : (
                feed.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
	                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{entry.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(entry.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 uppercase shrink-0">
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
	          <div className="relative flex max-h-[85svh] flex-col rounded-t-lg border-t border-slate-200 bg-white p-5 pb-safe shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle */}
	            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />

            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Scanner Configuration</h3>
              </div>
              <button
                onClick={() => setSettingsDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-4 max-h-[65svh] pr-1">

              {/* 1. Gate Switcher */}
              {gates.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
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
	                        className={`flex items-center justify-between rounded-md border p-3.5 text-left transition-colors ${
	                          selectedGateId === g.id
	                            ? "border-blue-700 bg-blue-700 font-bold text-white"
	                            : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{g.name}</p>
                          {g.zone && (
                            <p className={`text-[10px] mt-0.5 ${selectedGateId === g.id ? "text-slate-300" : "text-slate-500"}`}>{g.zone.name}</p>
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
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Tracked Conference Session
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedSessionId(null)}
	                      className={`flex items-center justify-between rounded-md border p-3.5 text-left transition-colors ${
	                        !selectedSessionId
	                          ? "border-blue-700 bg-blue-700 font-bold text-white"
	                          : "bg-slate-50 border-slate-200 text-slate-800"
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
	                        className={`flex items-center justify-between rounded-md border p-3.5 text-left transition-colors ${
	                          selectedSessionId === s.id
	                            ? "border-blue-700 bg-blue-700 font-bold text-white"
	                            : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold truncate">{s.title}</p>
                          <p className={`text-[10px] mt-0.5 ${selectedSessionId === s.id ? "text-slate-300" : "text-slate-500"}`}>
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
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Device Hardware &amp; Feedback
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={toggleSound}
	                    className={`flex flex-col items-center justify-center gap-1.5 rounded-md border p-3.5 transition-colors ${
                      soundEnabled
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                    <span className="text-xs font-bold">{soundEnabled ? "Audio On" : "Audio Muted"}</span>
                  </button>

                  <button
                    onClick={toggleWakeLock}
	                    className={`flex flex-col items-center justify-center gap-1.5 rounded-md border p-3.5 transition-colors ${
                      wakeLockActive
                        ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  >
                    <Sun className={`w-5 h-5 ${wakeLockActive ? "text-amber-600 animate-pulse" : "text-slate-400"}`} />
                    <span className="text-xs font-bold">{wakeLockActive ? "Screen Awake" : "Sleep Normal"}</span>
                  </button>
                </div>
              </div>

              {/* 4. Offline Cache & Sync */}
	              <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Local Offline Cache</p>
                      <p className="text-[10px] text-slate-500">
                        {cachedPassCount} passes cached on device
                      </p>
                    </div>
                  </div>
                  {isOnline && (
                    <button
                      onClick={refreshManifest}
                      disabled={isRefreshingCache}
	                      className="rounded-md border border-slate-200 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
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
	                    className="flex w-full items-center justify-center gap-1.5 rounded-md bg-blue-700 px-3.5 py-3 text-xs font-bold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
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
  badgeText,
  message,
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
  badgeText?: string;
  message?: string;
}) {
  const ok = variant === "success";

  return (
    <div className="w-full flex flex-col gap-3">
	      <div
	        className={`flex flex-col items-center gap-3.5 overflow-hidden rounded-lg border p-6 text-center transition-colors ${
	          ok
	            ? "bg-white border-emerald-200/90 text-slate-900"
	            : "bg-amber-50/40 border-amber-300/80 text-amber-950"
	        }`}
	      >
	        <div
	          className={`flex h-12 w-12 items-center justify-center rounded-md border ${
	            ok
	              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
	              : "bg-amber-100 border-amber-300 text-amber-800"
          }`}
        >
          {ok ? (
	            <CheckCircle2 className="h-7 w-7 text-emerald-700" />
	          ) : (
	            <AlertTriangle className="h-7 w-7 text-amber-800" />
	          )}
        </div>

        <div className="space-y-1">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${
              ok
	                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
	                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {badgeText || (ok ? "ENTRY GRANTED" : "ALREADY ADMITTED")}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2 leading-snug">
            {attendee.name}
          </h2>
          {message ? (
            <p className="text-xs font-medium text-amber-800 max-w-[280px] mx-auto leading-relaxed pt-0.5">
              {message}
            </p>
          ) : attendee.email ? (
            <p className="text-xs text-slate-500 truncate max-w-[260px] mx-auto">
              {attendee.email}
            </p>
          ) : null}
        </div>

        {/* Pass Tier & Gate Info Pill */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center pt-0.5">
	          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-700">
            {PASS_TYPE_LABEL[passType] ?? passType}
          </span>
          {gateName && (
	            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              <DoorOpen className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{gateName}</span>
            </span>
          )}
        </div>

        {checkedInAt && (
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            {ok ? "Admitted at: " : "First scanned at: "}
            <span className="font-semibold text-slate-700">
              {new Date(checkedInAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          </p>
        )}

        {offline && (
	          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800">
            <WifiOff className="w-3 h-3" /> Offline Queued
          </span>
        )}
      </div>

      {/* Corporate Re-entry Override Action for Duplicates */}
      {variant === "duplicate" && onAllowReentry && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAllowReentry();
          }}
          disabled={isUndoing}
	          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-3.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
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
	        <div className="h-1 overflow-hidden rounded bg-slate-200">
          <div
            className={`h-full rounded-full transition-none ${ok ? "bg-emerald-600" : "bg-amber-600"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={onReset}
	          className="py-1 text-center text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Tap anywhere to scan next pass
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
		      <div className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-white p-5 text-center">
	        <div className="w-14 h-14 rounded-md bg-red-50 flex items-center justify-center">
	          <ShieldX className="w-8 h-8 text-red-700" />
        </div>

        <div>
	          <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            ACCESS DENIED
          </span>
	          <h2 className="text-xl font-extrabold text-slate-950 mt-2 leading-tight">
            Not Admitted
          </h2>
	          <p className="text-xs text-red-700 mt-1 max-w-[240px] mx-auto leading-relaxed">
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
		            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900 transition-colors hover:bg-amber-100"
          >
	            <ShieldAlert className="w-4 h-4 text-amber-900" />
            <span>Authorize Supervisor Override</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-1">
	        <div className="h-1 bg-slate-200 rounded overflow-hidden">
          <div
	            className="h-full rounded bg-red-600 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={onReset}
	          className="text-center text-xs text-slate-500 hover:text-slate-950 font-medium py-1"
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
	      <div className="bg-white border border-red-200 rounded-md p-5 flex flex-col items-center text-center gap-3">
	        <div className="w-14 h-14 rounded-md bg-red-50 flex items-center justify-center">
	          <XCircle className="w-8 h-8 text-red-700" />
        </div>

        <div>
	          <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            INVALID PASS
          </span>
	          <h2 className="text-xl font-extrabold text-slate-950 mt-2 leading-tight">
            Verification Failed
          </h2>
	          <p className="text-xs text-red-700 mt-1 max-w-[240px] mx-auto leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
	        <div className="h-1 bg-slate-200 rounded overflow-hidden">
          <div
	            className="h-full rounded bg-red-600 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={onReset}
	          className="text-center text-xs text-slate-500 hover:text-slate-950 font-medium py-1"
        >
          Tap anywhere to retry
        </button>
      </div>
    </div>
  );
}
