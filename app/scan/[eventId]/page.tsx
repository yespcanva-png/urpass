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

  // Gate state
  const [gates, setGates] = useState<Gate[]>([]);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [gateDropdownOpen, setGateDropdownOpen] = useState(false);

  // Conference Session Check-in state
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionDropdownOpen, setSessionDropdownOpen] = useState(false);
  const [sessionStats, setSessionStats] = useState<{ checkedIn: number; capacity: number | null; remaining: number | null } | null>(null);

  // Zone & Physical Operations state
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
  const [scanDirection, setScanDirection] = useState<"in" | "out">("in");
  const [lastScannedAttendee, setLastScannedAttendee] = useState<any | null>(null);

  // Manual search mode
  const [manualMode, setManualMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [torchSupported, setTorchSupported] = useState<boolean>(false);

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
        if (urlSession && sessionData.find((s) => s.id === urlSession)) {
          setSelectedSessionId(urlSession);
          setSelectedGateId(null);
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
          setFeed((prev) => [entry, ...prev].slice(0, 20));
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
          message: `Synced ${report.synced} scan(s), but detected ${report.conflicts} offline duplicate conflict across gates!`,
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
        ].slice(0, 20));
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
          .limit(10);
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
            body: JSON.stringify({ passToken: rawToken }),
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

        // 2. Duplicate check-in (Amber ⚠, double low tone, [150, 80, 150])
        if (data.status === "ALREADY_CHECKED_IN" || data.alreadyCheckedIn) {
          playScannerFeedback("ALREADY_CHECKED_IN", { sound: soundEnabled });
          setResult({ ...data, passToken: rawToken });
          setScanState("duplicate");
          return;
        }

        // 3. Wrong event (Red ✕, low buzz, 250ms)
        if (data.status === "WRONG_EVENT") {
          playScannerFeedback("WRONG_EVENT", { sound: soundEnabled });
          setErrorMsg(data.error || "Pass is registered for a different event");
          setScanState("error");
          return;
        }

        // 4. Not approved (Red ✕, low buzz, 250ms)
        if (data.status === "NOT_APPROVED") {
          playScannerFeedback("NOT_APPROVED", { sound: soundEnabled });
          setErrorMsg(data.error || "Attendee is not approved for this event");
          setScanState("error");
          return;
        }

        // 5. Invalid pass (Red ✕, low buzz, 250ms)
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
    [eventId, isOnline, selectedGateId, selectedGate?.name, soundEnabled, handleOfflineResult, selectedZoneId, scanDirection]
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

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col page-in">

      {/* ── Top bar ────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 h-14 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => router.push("/scan")}
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Events</span>
          </button>

          {/* Online / Offline status badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              isOnline
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/15 border-amber-500/30 text-amber-300"
            }`}
            title={
              isOnline
                ? `Online · ${cachedPassCount} passes cached locally`
                : `Offline · Scanning from local cache of ${cachedPassCount} passes`
            }
          >
            {isOnline ? (
              <Wifi className="w-3 h-3 text-emerald-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-amber-400 animate-pulse" />
            )}
            <span className="hidden sm:inline">{isOnline ? "Online" : "Offline"}</span>
            {cachedPassCount > 0 && (
              <span className="opacity-50 text-[10px] hidden md:inline">
                ({cachedPassCount})
              </span>
            )}
          </div>

          {/* Sync Queue button if pending items exist */}
          {queuePending > 0 && (
            <button
              onClick={syncPendingScans}
              disabled={isSyncing || !isOnline}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand/20 text-brand-200 border border-brand/30 hover:bg-brand/30 transition-all disabled:opacity-50 animate-pulse"
              title={isOnline ? "Click to sync offline check-ins" : "Will auto-sync when network returns"}
            >
              <CloudUpload className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{queuePending} queued</span>
            </button>
          )}

          {/* Refresh cache icon */}
          {isOnline && (
            <button
              onClick={refreshManifest}
              disabled={isRefreshingCache}
              className="p-1.5 rounded-full text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
              title="Refresh local offline pass cache"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingCache ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>

        {/* Event name / wordmark */}
        <div className="flex flex-col items-center min-w-0">
          <span className="text-xs font-semibold text-white/70 max-w-[140px] sm:max-w-[200px] truncate text-center">
            {eventName || "URPASS Scanner"}
          </span>
          {eventName && (
            <span className="text-[10px] text-white/25 mt-0.5 tracking-wide hidden sm:block">QR Check-in</span>
          )}
        </div>

        {/* Right side: gate chip + scan counter */}
        <div className="flex items-center gap-2">
          {/* Gate selector chip — only shown if gates exist */}
          {gates.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setGateDropdownOpen((o) => !o)}
                className={`flex items-center gap-1 border rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors max-w-[130px] ${
                  selectedGate
                    ? "bg-white/[0.06] border-white/[0.08] text-white/80 hover:bg-white/[0.09]"
                    : "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse font-bold"
                }`}
              >
                <span className="truncate">
                  {selectedGate ? selectedGate.name : "Select Gate *"}
                </span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>
              {gateDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-neutral-900 border border-white/[0.08] rounded-xl overflow-hidden shadow-xl min-w-[180px]">
                  {gates.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSelectedGateId(g.id);
                        setSelectedSessionId(null);
                        setGateDropdownOpen(false);
                        try {
                          localStorage.setItem(`urpass_gate_${eventId}`, g.id);
                        } catch {}
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs hover:bg-white/[0.06] transition-colors ${
                        selectedGateId === g.id ? "text-purple-400 font-bold bg-white/[0.04]" : "text-white/70"
                      }`}
                    >
                      <span className="block font-medium">{g.name}</span>
                      {g.zone && (
                        <span className="block text-[10px] text-white/30 mt-0.5">{g.zone.name}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Session selector chip */}
          {sessions.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setSessionDropdownOpen((o) => !o)}
                className={`flex items-center gap-1 border rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors max-w-[130px] ${
                  selectedSession
                    ? "bg-purple-600/20 border-purple-500/40 text-purple-200"
                    : "bg-white/[0.06] border-white/[0.08] text-white/60 hover:text-white/80"
                }`}
              >
                <span className="truncate">
                  {selectedSession ? selectedSession.title : "Select Session"}
                </span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>
              {sessionDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-neutral-900 border border-white/[0.08] rounded-xl overflow-hidden shadow-xl min-w-[200px] max-h-64 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedSessionId(null); setSessionDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-xs hover:bg-white/[0.06] transition-colors ${!selectedSessionId ? "text-purple-400 font-medium" : "text-white/50"}`}
                  >
                    Main Gate (No Session)
                  </button>
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSessionId(s.id);
                        setSelectedGateId(null);
                        setSessionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs hover:bg-white/[0.06] transition-colors ${selectedSessionId === s.id ? "text-purple-400 font-medium" : "text-white/70"}`}
                    >
                      <span className="block truncate font-medium">{s.title}</span>
                      <span className="block text-[10px] text-white/40 mt-0.5">
                        {s.room?.name || "Main Venue"} • {s.start_time.slice(0, 5)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Zone selector chip */}
          {zones.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setZoneDropdownOpen((o) => !o)}
                className={`flex items-center gap-1 border rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors max-w-[130px] ${
                  selectedZone
                    ? "bg-purple-600/20 border-purple-500/40 text-purple-200"
                    : "bg-white/[0.06] border-white/[0.08] text-white/60 hover:text-white/80"
                }`}
              >
                <span className="truncate">
                  {selectedZone ? selectedZone.name : "All Zones"}
                </span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>
              {zoneDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-neutral-900 border border-white/[0.08] rounded-xl overflow-hidden shadow-xl min-w-[180px] max-h-64 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedZoneId(null); setZoneDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-white/[0.06] transition-colors ${!selectedZoneId ? "text-purple-400 font-medium" : "text-white/50"}`}
                  >
                    All Zones (Open)
                  </button>
                  {zones.map((z) => (
                    <button
                      key={z.id}
                      onClick={() => { setSelectedZoneId(z.id); setZoneDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-white/[0.06] transition-colors ${selectedZoneId === z.id ? "text-purple-400 font-medium" : "text-white/70"}`}
                    >
                      <span className="block truncate font-medium">{z.name}</span>
                      <span className="block text-[10px] text-white/40 mt-0.5">
                        Cap: {z.capacity} • Occ: {z.currentOccupancy}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Direction Toggle (IN / OUT) */}
          <button
            onClick={() => setScanDirection((d) => (d === "in" ? "out" : "in"))}
            className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-colors ${
              scanDirection === "in"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-blue-500/20 text-blue-300 border-blue-500/40"
            }`}
            title="Toggle Scan Direction (Entry vs Exit)"
          >
            {scanDirection.toUpperCase()}
          </button>

          {/* Screen Wake Lock toggle */}
          <button
            onClick={toggleWakeLock}
            className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              wakeLockActive
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-white/[0.06] border-white/[0.08] text-white/30 hover:text-white/60"
            }`}
            title={wakeLockActive ? "Screen wake lock active (screen will not sleep)" : "Enable screen stay-awake"}
            aria-label={wakeLockActive ? "Screen wake lock active" : "Screen wake lock inactive"}
          >
            <Sun className={`w-3.5 h-3.5 ${wakeLockActive ? "text-amber-400 animate-pulse" : "text-white/30"}`} />
          </button>

          {/* Torch / Flashlight toggle */}
          <button
            onClick={toggleTorch}
            className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              torchOn
                ? "bg-amber-400 text-neutral-950 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] font-bold"
                : "bg-white/[0.06] border-white/[0.08] text-white/60 hover:text-white"
            }`}
            title={torchOn ? "Turn flashlight off" : "Turn flashlight on for low-light venue scanning"}
            aria-label={torchOn ? "Flashlight on" : "Flashlight off"}
          >
            {torchOn ? (
              <Flashlight className="w-3.5 h-3.5 fill-current" />
            ) : (
              <FlashlightOff className="w-3.5 h-3.5 text-white/40" />
            )}
            <span className="hidden lg:inline">{torchOn ? "Torch On" : "Torch"}</span>
          </button>

          {/* Audio Chime / Haptic toggle */}
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full px-2.5 py-1.5 text-[11px] font-medium text-white/60 hover:text-white/80 transition-colors"
            title={soundEnabled ? "Mute scan feedback sound" : "Unmute scan feedback sound"}
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-white/30" />
            )}
          </button>

          {/* Mode toggle: QR vs Search */}
          <button
            onClick={() => {
              setManualMode((m) => !m);
              setSearchQuery("");
              setSearchResults([]);
              if (scanState !== "idle") reset();
            }}
            className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full px-2.5 py-1.5 text-[11px] font-medium text-white/60 hover:text-white/80 transition-colors"
            title={manualMode ? "Switch to QR scan" : "Switch to manual search"}
          >
            {manualMode ? (
              <ScanLine className="w-3.5 h-3.5" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Scan counter */}
          <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-white/60 tabular-nums">
              {scanCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── Zone Occupancy Strip ─────────────────────────────────────── */}
      {selectedZone && (
        <div className="shrink-0 px-4 py-2.5 bg-neutral-900 border-b border-white/[0.08] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: selectedZone.color || "#6D28D9" }}
            />
            <span className="font-bold text-white">{selectedZone.name}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/70 font-mono">
              {selectedZone.currentOccupancy} / {selectedZone.capacity} (
              {selectedZone.capacity > 0
                ? Math.round((selectedZone.currentOccupancy / selectedZone.capacity) * 100)
                : 0}
              %)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedZone.capacity > 0 && selectedZone.currentOccupancy >= selectedZone.capacity && (
              <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/40 animate-pulse">
                ZONE FULL
              </span>
            )}
            <span className="text-[11px] text-white/50">
              Direction: <strong className="text-white">{scanDirection.toUpperCase()}</strong>
            </span>
          </div>
        </div>
      )}

      {/* ── Offline Reconnection / Sync Result Banner ────────────────── */}
      {syncBanner && (
        <div
          className={`shrink-0 px-5 py-2.5 text-xs flex items-center justify-between border-b transition-all ${
            syncBanner.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-amber-500/10 border-amber-500/20 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{syncBanner.message}</span>
          </div>
          <button
            onClick={() => setSyncBanner(null)}
            className="text-white/40 hover:text-white text-xs ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Dropdown backdrop ───────────────────────────────────────── */}
      {(gateDropdownOpen || sessionDropdownOpen || zoneDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setGateDropdownOpen(false);
            setSessionDropdownOpen(false);
            setZoneDropdownOpen(false);
          }}
        />
      )}

      {/* ── Main content — grows to fill screen ────────────────────── */}
      <div className="flex-1 flex flex-col">

        {/* ── Manual Search Mode ──────────────────────────────────── */}
        {manualMode && (
          <div className="flex-1 flex flex-col px-5 py-5 gap-4">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name…"
                autoFocus
                className="w-full pl-9 pr-3 py-3 bg-white/[0.06] border border-white/[0.08] rounded-2xl text-sm text-white placeholder-white/25 outline-none focus:border-white/[0.18] transition-colors"
              />
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 animate-spin" />
              )}
            </div>

            {/* Results */}
            {searchQuery.length >= 2 && !searchLoading && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-8 h-8 text-white/10 mb-3" />
                <p className="text-sm text-white/35">No approved attendees found</p>
              </div>
            )}

            {searchQuery.length < 2 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="w-8 h-8 text-white/10 mb-3" />
                <p className="text-sm text-white/35">Type at least 2 characters to search</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {searchResults.map((a) => {
                const isIn = a.pass_status === "checked_in";
                const isChecking = checkingInId === a.id;
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isIn ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white/20 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{a.name}</p>
                        <p className="text-xs text-white/35 truncate">{a.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand-300 border border-brand/20 capitalize hidden sm:inline-block">
                        {PASS_TYPE_LABEL[a.pass_type] ?? a.pass_type}
                      </span>
                      {isIn ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-emerald-400 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            Already in
                          </span>
                          <button
                            onClick={() => handleUndoCheckIn(a.id)}
                            disabled={undoingCheckIn}
                            title="Reset check-in (allow re-entry)"
                            className="flex items-center gap-1 text-[11px] font-medium px-2 py-1.5 rounded-xl bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15] border border-white/[0.1] transition-colors disabled:opacity-50"
                          >
                            {undoingCheckIn ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3 h-3" />
                            )}
                            <span className="hidden sm:inline">Reset</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => manualCheckIn(a)}
                          disabled={isChecking}
                          className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl bg-brand/20 text-brand-200 border border-brand/30 hover:bg-brand/30 transition-colors disabled:opacity-50"
                        >
                          {isChecking ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          Check in
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── QR Scan Mode ────────────────────────────────────────── */}
        {!manualMode && (
          <>
            {/* Center zone */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
              {/* Session mode indicator banner */}
              {selectedSession && (
                <div className="w-full max-w-xs sm:max-w-sm mb-3.5 bg-purple-950/60 border border-purple-500/40 rounded-2xl p-3 text-xs text-white shadow-lg animate-in fade-in">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-purple-200 text-sm truncate">{selectedSession.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-500/40 shrink-0">
                      Session Scan
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white/60 text-[11px] pt-1 border-t border-purple-500/20">
                    <span>Room: {selectedSession.room?.name || "Main Venue"}</span>
                    <span>
                      Capacity: {selectedSession.capacity || selectedSession.room?.capacity || "Unlimited"}
                    </span>
                  </div>
                  {sessionStats && (
                    <div className="flex items-center justify-between text-[11px] pt-1 text-purple-300 font-semibold">
                      <span>Checked In: {sessionStats.checkedIn}</span>
                      {sessionStats.remaining !== null && (
                        <span>Remaining: {sessionStats.remaining}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Gate selection forced before scanning begins */}
              {isGateRequired ? (
                <div className="w-full max-w-xs sm:max-w-sm bg-neutral-900 border border-purple-500/30 rounded-3xl p-6 text-center shadow-2xl space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 mx-auto">
                    <DoorOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Select Scanner Entry Gate</h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      Select your assigned entrance gate to activate the QR scanner. This ensures check-ins are accurately attributed and zone rules are enforced.
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
                        className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-purple-600 hover:text-white text-neutral-200 border border-white/10 transition-all flex items-center justify-between"
                      >
                        <span className="font-bold">{g.name}</span>
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
                /* Scanner — kept mounted in DOM to prevent hardware teardown and re-initialization */
                <div className={`w-full max-w-xs sm:max-w-sm ${scanState === "idle" || scanState === "scanning" ? "block" : "hidden"}`}>
                  <QRScanner onScan={verify} active={isScannerActive} statusVariant={scanState} />
                </div>
              )}

              {/* Verifying */}
              {scanState === "verifying" && (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-brand/20 animate-ping" />
                    <div className="relative w-full h-full rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-brand animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-white">Verifying pass…</p>
                    <p className="text-xs text-white/35">Checking against attendee list</p>
                  </div>
                </div>
              )}

              {/* Success */}
              {scanState === "success" && result && (
                <div className="w-full max-w-xs sm:max-w-sm cursor-pointer select-none" onClick={reset} title="Tap anywhere to scan next">
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
                  <p className="text-center text-[11px] text-white/40 mt-2 font-medium">Tap anywhere to scan next</p>
                </div>
              )}

              {/* Duplicate */}
              {scanState === "duplicate" && result && (
                <div className="w-full max-w-xs sm:max-w-sm select-none">
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
                  <p className="text-center text-[11px] text-white/40 mt-2 font-medium">Tap button above to allow re-entry, or tap below to scan next</p>
                </div>
              )}

              {/* Access denied */}
              {scanState === "access_denied" && (
                <div className="w-full max-w-xs sm:max-w-sm select-none">
                  <AccessDeniedCard
                    message={accessDeniedMsg}
                    onReset={reset}
                    progress={resetProgress}
                    onOverride={lastScannedAttendee ? handleSupervisorOverride : undefined}
                  />
                  <p className="text-center text-[11px] text-white/40 mt-2 font-medium">Tap anywhere to scan next</p>
                </div>
              )}

              {/* Error */}
              {scanState === "error" && (
                <div className="w-full max-w-xs sm:max-w-sm cursor-pointer select-none" onClick={reset}>
                  <ErrorCard message={errorMsg} onReset={reset} progress={resetProgress} />
                  <p className="text-center text-[11px] text-white/40 mt-2 font-medium">Tap anywhere to scan next</p>
                </div>
              )}
            </div>

            {/* Bottom hint */}
            {isScannerActive && (
              <div className="shrink-0 flex items-center justify-center gap-2 px-5 pt-2">
                <ScanLine className="w-3.5 h-3.5 text-white/20" />
                <p className="text-xs text-white/30">
                  Ready to scan · Approved passes only · Duplicate check-ins blocked
                </p>
              </div>
            )}

            {/* Live check-in feed */}
            {feed.length > 0 && (
              <div className="shrink-0 px-5 pb-8 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-3.5 h-3.5 text-white/25" />
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/25">
                    Recent check-ins
                  </p>
                  <span className="ml-auto text-[10px] text-white/20">{scanCount} total</span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                  {feed.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5"
                      style={{ opacity: Math.max(0.4, 1 - i * 0.08) }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs font-medium text-white/80 truncate">{entry.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand-300 border border-brand/20 shrink-0 ml-2 capitalize">
                        {PASS_TYPE_LABEL[entry.pass_type] ?? entry.pass_type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Result card ──────────────────────────────────────────────────────────────

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
    ? "bg-emerald-500/10 border-emerald-500/20"
    : "bg-amber-500/10 border-amber-500/20";

  return (
    <div className="w-full max-w-xs sm:max-w-sm flex flex-col gap-3">

      {/* Status card */}
      <div className={`rounded-2xl border overflow-hidden ${borderCls} relative`}>
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 0%, ${color}, transparent)` }}
        />

        <div className="relative flex flex-col items-center text-center gap-4 px-6 py-7">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `${color}20` }}
          >
            {ok ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            )}
          </div>

          <div className="space-y-1">
            <p
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color }}
            >
              {ok ? "Entry granted" : "Already used"}
            </p>
            <p className="text-lg font-bold text-white leading-tight">
              {ok ? "Check-in successful" : "Already checked in"}
            </p>
            <p className="text-xs" style={{ color: `${color}99` }}>
              {ok ? "Attendee verified and admitted" : "This pass was already scanned"}
            </p>
            {offline && (
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <WifiOff className="w-2.5 h-2.5" />
                Validated offline · Queued to sync
              </span>
            )}
            {checkedInAt && (
              <p className="text-xs mt-1" style={{ color: `${color}80` }}>
                at {new Date(checkedInAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
              </p>
            )}
            {gateName && (
              <p className="text-[10px] mt-0.5" style={{ color: `${color}60` }}>
                Gate: {gateName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Attendee row */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-1.5">
            Attendee
          </p>
          <p className="text-base font-bold text-white leading-tight">{attendee.name}</p>
          <p className="text-xs text-white/35 mt-0.5">{attendee.email}</p>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/25">
            Pass type
          </p>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand-200 border border-brand/20">
            {PASS_TYPE_LABEL[passType] ?? passType}
          </span>
        </div>
      </div>

      {/* Progress + reset */}
      <div className="flex flex-col gap-2.5 pt-1">
        {variant === "duplicate" && onAllowReentry && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAllowReentry();
            }}
            disabled={isUndoing}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isUndoing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            Allow Re-entry / Reset Check-in
          </button>
        )}
        <div className="h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{ width: `${progress}%`, background: color }}
          />
        </div>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white/70 transition-colors py-1"
        >
          <RotateCcw className="w-3 h-3" />
          Scan next pass now
        </button>
      </div>
    </div>
  );
}

// ── Access Denied card ───────────────────────────────────────────────────────

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
    <div className="w-full max-w-xs sm:max-w-sm flex flex-col gap-3">
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #ef4444, transparent)" }}
        />
        <div className="relative flex flex-col items-center text-center gap-4 px-6 py-7">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <ShieldX className="w-7 h-7 text-red-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase text-red-400">
              Access Denied
            </p>
            <p className="text-lg font-bold text-white leading-tight">Not admitted</p>
            <p className="text-xs text-red-400/80">{message}</p>
          </div>

          {onOverride && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOverride();
              }}
              className="mt-2 w-full py-2.5 px-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <ShieldAlert className="w-4 h-4 text-neutral-950" />
              <span>Authorize Supervisor Override</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        <div className="h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-red-500 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white/70 transition-colors py-1"
        >
          <RotateCcw className="w-3 h-3" />
          Try again
        </button>
      </div>
    </div>
  );
}

// ── Error card ───────────────────────────────────────────────────────────────

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
    <div className="w-full max-w-xs sm:max-w-sm flex flex-col gap-3">
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #ef4444, transparent)" }}
        />
        <div className="relative flex flex-col items-center text-center gap-4 px-6 py-7">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <XCircle className="w-7 h-7 text-red-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest uppercase text-red-400">
              Invalid pass
            </p>
            <p className="text-lg font-bold text-white leading-tight">Not admitted</p>
            <p className="text-xs text-red-400/60">{message}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        <div className="h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-red-500 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white/70 transition-colors py-1"
        >
          <RotateCcw className="w-3 h-3" />
          Try again
        </button>
      </div>
    </div>
  );
}
