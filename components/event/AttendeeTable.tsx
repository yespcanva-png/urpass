"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  UserPlus, Upload, Check, X, Clock, Loader2, Users,
  Search, Ticket, ExternalLink, Download, Lock, Wifi, ClipboardList, RotateCcw,
  Send, CheckCircle2, CreditCard, DoorOpen, History, Eye, Mail, Phone, RefreshCw,
} from "lucide-react";
import { approveAttendee, rejectAttendee, exportAttendeesCSV, promoteNextWaitlistAttendee, reconcileEventPaymentsAction } from "@/app/actions/attendees";
import { undoCheckIn } from "@/app/actions/manual-checkin";
import { generatePass, bulkGeneratePasses } from "@/app/actions/passes";
import AddAttendeeModal from "./AddAttendeeModal";
import ImportAttendeesModal from "./ImportAttendeesModal";
import BulkBroadcastModal from "./BulkBroadcastModal";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import WhatsAppShareButton from "@/components/pass/WhatsAppShareButton";
import AttendeeDeliveryActions from "./AttendeeDeliveryActions";
import { isVersionSkewError, triggerRecoveryReload } from "@/components/common/VersionSkewHandler";
import type { CustomFieldDefinition } from "@/types";

type Status    = "pending" | "approved" | "rejected" | "waitlisted";
type FilterTab = "all" | Status;

export interface AttendeePaymentInfo {
  orderId: string;
  paymentId: string | null;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  pass_type: string;
  application_status: Status;
  pass_status: "not_generated" | "generated" | "checked_in";
  custom_responses?: Record<string, unknown> | null;
  created_at: string;
  last_scanned_at?: string | null;
  venue_presence_state?: string | null;
}

export interface CheckInInfo {
  gateName: string;
  checkedInAt: string;
  checkInMethod?: string;
}

export interface GroupAdmissionEntry {
  id: string;
  admittedCount: number;
  totalEntitlements: number;
  remainingAfter: number;
  admittedAt: string;
  gateName: string;
}

export interface GroupPassDetails {
  totalGuests: number;
  checkedInGuests: number;
  isGroupMaster: boolean;
  lastAdmittedAt?: string;
  admissions?: GroupAdmissionEntry[];
}

interface Props {
  attendees: Attendee[];
  eventId: string;
  eventName?: string;
  attendeeLimit: number;
  applySlug?: string | null;
  applicationEnabled?: boolean;
  initialPassTokens?: Record<string, string>;
  payments?: Record<string, AttendeePaymentInfo>;
  groupPassMap?: Record<string, GroupPassDetails>;
  checkInInfoMap?: Record<string, CheckInInfo>;
  canCSV?: boolean;
  canExport?: boolean;
  customFields?: CustomFieldDefinition[];
}

const statusConfig: Record<Status, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending:    { label: "Pending",    cls: "bg-amber-50 text-amber-700 border-amber-200/80",    icon: Clock },
  approved:   { label: "Approved",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200/80", icon: Check },
  rejected:   { label: "Rejected",   cls: "bg-rose-50 text-rose-700 border-rose-200/80",          icon: X },
  waitlisted: { label: "Waitlisted", cls: "bg-violet-50 text-violet-700 border-violet-200/80", icon: Clock },
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status] ?? {
    label: (status || "Pending").charAt(0).toUpperCase() + (status || "Pending").slice(1),
    cls: "bg-slate-50 text-slate-600 border-slate-200",
    icon: Clock,
  };
  const { label, cls, icon: Icon } = cfg;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function PassTypeBadge({ type }: { type: string }) {
  const badgeCls =
    type === "vip"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : type === "speaker"
      ? "border-violet-200 bg-violet-50 text-violet-800"
      : type === "organizer"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md border capitalize ${badgeCls}`}>
      {type}
    </span>
  );
}

type BtnVariant = "primary" | "outline" | "danger";
function Btn({ onClick, pending, variant, children }: {
  onClick: () => void; pending: boolean; variant: BtnVariant; children: React.ReactNode;
}) {
  const cls: Record<BtnVariant, string> = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 shadow-sm",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs",
    danger:  "bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 shadow-xs",
  };
  const style: Record<BtnVariant, React.CSSProperties | undefined> = {
    primary: undefined, outline: undefined, danger: undefined,
  };
  return (
    <button onClick={onClick} disabled={pending}
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-40 ${cls[variant]}`}
      style={style[variant]}>
      {pending && <Loader2 className="w-3 h-3 animate-spin" />}
      {children}
    </button>
  );
}

export default function AttendeeTable({
  attendees: initial,
  eventId,
  eventName,
  attendeeLimit,
  applySlug,
  applicationEnabled,
  initialPassTokens,
  payments = {},
  groupPassMap = {},
  checkInInfoMap = {},
  canCSV = false,
  canExport = false,
  customFields = [],
}: Props) {
  const router = useRouter();
  const [attendees, setAttendees]   = useState<Attendee[]>(initial);
  const [passTokens, setPassTokens] = useState<Record<string, string>>(initialPassTokens ?? {});
  const [groupPasses, setGroupPasses] = useState(groupPassMap);
  const [activeTab, setActiveTab]   = useState<FilterTab>("all");
  const [search, setSearch]         = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkMsg, setBulkMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId]   = useState<string | null>(null);
  const [undoingId, setUndoingId]   = useState<string | null>(null);
  const [promotingWaitlist, setPromotingWaitlist] = useState(false);
  const [exporting, setExporting]   = useState(false);
  const [liveConnected, setLiveConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [selectedGroupHistory, setSelectedGroupHistory] = useState<{
    name: string;
    email: string;
    totalGuests: number;
    checkedInGuests: number;
    admissions: GroupAdmissionEntry[];
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [isSyncingPayments, setIsSyncingPayments] = useState(false);
  const initialRef = useRef(initial);

  const syncPayments = async () => {
    setIsSyncingPayments(true);
    try {
      const res = await reconcileEventPaymentsAction(eventId);
      if (res?.reconciled && res.reconciled > 0) {
        setBulkMsg({
          text: `Gateway sync complete! Recovered ${res.reconciled} paid ${res.reconciled === 1 ? "attendee" : "attendees"} and issued passes.`,
          isError: false,
        });
      } else {
        setBulkMsg({
          text: "Gateway sync complete. All attendee records and payments are up to date.",
          isError: false,
        });
      }
      setTimeout(() => setBulkMsg(null), 5000);
      await refreshAttendees(false);
    } catch (err) {
      setBulkMsg({
        text: err instanceof Error ? err.message : "Failed to sync gateway payments.",
        isError: true,
      });
    } finally {
      setIsSyncingPayments(false);
    }
  };

  const refreshAttendees = async (showNotice = true) => {
    setIsRefreshing(true);
    try {
      const supabase = createClient();
      const [attRes, passRes] = await Promise.all([
        supabase
          .from("attendees")
          .select("id, name, email, phone, pass_type, application_status, pass_status, custom_responses, ticket_type_id, created_at, last_gate_scanned_at, venue_presence_state")
          .eq("event_id", eventId)
          .order("created_at", { ascending: false }),
        supabase
          .from("passes")
          .select("attendee_id, pass_token, total_guests, checked_in_guests, is_group_master, is_group_pass, status, updated_at")
          .eq("event_id", eventId),
      ]);

      if (attRes.data) {
        const mappedAttendees = (attRes.data as any[]).map((a) => ({
          ...a,
          last_scanned_at: a.last_gate_scanned_at || null,
        }));
        setAttendees(mappedAttendees as Attendee[]);
      }
      if (passRes.data) {
        setPassTokens((prev) => {
          const next = { ...prev };
          for (const p of passRes.data) {
            if (p.attendee_id && p.pass_token) next[p.attendee_id] = p.pass_token;
          }
          return next;
        });
      }

      if (showNotice) {
        setBulkMsg({ text: "Attendee directory refreshed with latest data.", isError: false });
        window.setTimeout(() => setBulkMsg(null), 3000);
      }
    } catch (err) {
      console.error("Failed to refresh attendees:", err);
    } finally {
      setIsRefreshing(false);
      router.refresh();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync when server re-renders with fresh props
  useEffect(() => {
    if (initial !== initialRef.current) {
      initialRef.current = initial;
      setAttendees(initial);
    }
  }, [initial]);

  useEffect(() => {
    setGroupPasses(groupPassMap);
  }, [groupPassMap]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, pageSize]);

  // Supabase realtime — new applications appear instantly
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`attendees-${eventId}`);

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "attendees",
        filter: `event_id=eq.${eventId}`,
      },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setAttendees((prev) => {
            if (prev.some((a) => a.id === (payload.new as Attendee).id)) return prev;
            return [payload.new as Attendee, ...prev];
          });
        } else if (payload.eventType === "UPDATE") {
          setAttendees((prev) =>
            prev.map((a) => (a.id === payload.new.id ? { ...a, ...(payload.new as Attendee) } : a))
          );
        } else if (payload.eventType === "DELETE") {
          setAttendees((prev) => prev.filter((a) => a.id !== payload.old.id));
        }
      }
    );

    const passesChannel = supabase.channel(`attendees-passes-${eventId}`);
    passesChannel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "passes",
        filter: `event_id=eq.${eventId}`,
      },
      (payload) => {
        if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
          const next = payload.new as {
            attendee_id?: string;
            total_guests?: number;
            checked_in_guests?: number;
            is_group_master?: boolean;
            is_group_pass?: boolean;
            updated_at?: string;
          };
          const attendeeId = next.attendee_id;
          if (!attendeeId) return;
          setGroupPasses((prev) => {
            const isGroup = Boolean(next.is_group_master || next.is_group_pass);
            if (!isGroup) {
              const copy = { ...prev };
              delete copy[attendeeId];
              return copy;
            }
            return {
              ...prev,
              [attendeeId]: {
                totalGuests: Number(next.total_guests || 1),
                checkedInGuests: Number(next.checked_in_guests || 0),
                isGroupMaster: Boolean(next.is_group_master),
                lastAdmittedAt: next.updated_at,
                admissions: prev[attendeeId]?.admissions,
              },
            };
          });
        }
      }
    );

    channel.subscribe?.((status) => setLiveConnected(status === "SUBSCRIBED"));
    passesChannel.subscribe?.();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(passesChannel);
    };
  }, [eventId]);

  // ── Derived stats (all from live attendees state) ───────────
  const approvedCount = attendees.filter((a) => a.application_status === "approved").length;
  const unissuedCount = attendees.filter((a) => a.application_status === "approved" && a.pass_status === "not_generated").length;
  const capacityPct   = attendeeLimit > 0 ? Math.min(100, Math.round((approvedCount / attendeeLimit) * 100)) : 0;
  const atCapacity    = approvedCount >= attendeeLimit;
  const checkedInCount = attendees.filter((a) => a.pass_status === "checked_in").length;
  const generatedPassCount = attendees.filter((a) => a.pass_status === "generated" || a.pass_status === "checked_in").length;
  const paidCount = attendees.filter((a) => {
    const payment = payments[a.id] || payments[`email:${a.email.toLowerCase()}`];
    return payment?.status === "paid";
  }).length;
  const groupPassCount = attendees.filter((a) => {
    const customResponses = (a.custom_responses as any) || {};
    return Boolean(
      groupPasses[a.id] ||
      customResponses.is_single_group_qr === true ||
      customResponses.is_single_group_qr === "true" ||
      customResponses.credential_type === "GROUP_QR" ||
      customResponses.credentialType === "GROUP_QR"
    );
  }).length;

  const counts = {
    all:        attendees.length,
    pending:    attendees.filter((a) => a.application_status === "pending").length,
    approved:   approvedCount,
    rejected:   attendees.filter((a) => a.application_status === "rejected").length,
    waitlisted: attendees.filter((a) => a.application_status === "waitlisted").length,
  };

  const filtered = attendees
    .filter((a) => activeTab === "all" || a.application_status === activeTab)
    .filter((a) => {
      if (!search) return true;
      const q = search.toLowerCase().trim();
      if (!q) return true;

      // 1. Direct fields: name, email, role/pass_type, status
      if (a.name?.toLowerCase().includes(q)) return true;
      if (a.email?.toLowerCase().includes(q)) return true;
      if (a.pass_type?.toLowerCase().includes(q)) return true;
      if (a.application_status?.toLowerCase().includes(q)) return true;
      if (a.pass_status?.toLowerCase().includes(q)) return true;

      // Phone: require at least 3 digits to match phone to prevent single-digit false positives
      if (a.phone) {
        const cleanPhone = a.phone.replace(/[^\d]/g, "");
        const cleanQ = q.replace(/[^\d]/g, "");
        if (cleanQ.length >= 3 && cleanPhone.includes(cleanQ)) return true;
      }

      // 2. Pass Token / QR credential reference (minimum 4 chars to avoid single-digit collision)
      const token = passTokens[a.id];
      if (token && q.length >= 4 && token.toLowerCase().includes(q)) return true;

      // 3. Single Group QR / Entries / Guests count
      const group = groupPasses[a.id];
      const cr = (a.custom_responses || {}) as Record<string, any>;
      const totalGuests = group?.totalGuests || Number(cr.group_attendee_count || cr.guest_count || cr.total_guests || cr.bulk_quantity || 0);
      if (totalGuests > 0) {
        if (q === String(totalGuests) || q === `${totalGuests} entries` || q === `${totalGuests} guests` || q === `${totalGuests} pax`) return true;
        if (`${totalGuests} entries`.includes(q) || `${totalGuests} guests`.includes(q)) return true;
        if (["group", "single qr", "master", "entries", "entry"].includes(q)) return true;
      }

      // 4. Custom responses (e.g. ticket_type, organization, delegation, company, notes)
      if (a.custom_responses && typeof a.custom_responses === "object") {
        for (const [key, val] of Object.entries(a.custom_responses)) {
          if (val !== null && val !== undefined && key !== "is_single_group_qr") {
            const strVal = String(val).toLowerCase();
            if (strVal === q || (q.length >= 2 && strVal.includes(q))) return true;
          }
        }
      }

      // 5. Payment details (Payment/Order ID & status)
      const payment = payments[a.id];
      if (payment) {
        if (payment.paymentId?.toLowerCase().includes(q)) return true;
        if (payment.orderId?.toLowerCase().includes(q)) return true;
        if (payment.status?.toLowerCase().includes(q)) return true;
      }

      // 6. Check-in Gate Info
      const checkin = checkInInfoMap[a.id];
      if (checkin?.gateName?.toLowerCase().includes(q)) return true;

      return false;
    });

  // ── Actions — optimistic, no spinner for approve/reject ─────
  function setErr(id: string, msg: string) {
    setActionErrors((prev) => ({ ...prev, [id]: msg }));
  }

  async function handleBulkGenerate() {
    setBulkGenerating(true);
    setBulkMsg(null);
    try {
      const res = await bulkGeneratePasses(eventId);
      if (res.error) {
        setBulkMsg({ text: res.error, isError: true });
      } else {
        if (res.tokens) {
          setPassTokens((prev) => ({ ...prev, ...res.tokens }));
        }
        setAttendees((prev) =>
          prev.map((a) =>
            a.application_status === "approved" && a.pass_status === "not_generated"
              ? { ...a, pass_status: "generated" }
              : a
          )
        );
        setBulkMsg({
          text: `Successfully generated ${res.generated} ${res.generated === 1 ? "pass" : "passes"}!`,
        });
        setTimeout(() => setBulkMsg(null), 4000);
      }
    } catch (err) {
      if (isVersionSkewError(err)) {
        triggerRecoveryReload(err instanceof Error ? err.message : "Server action deployment skew");
        return;
      }
      setBulkMsg({
        text: err instanceof Error ? err.message : "Failed to bulk generate passes",
        isError: true,
      });
    } finally {
      setBulkGenerating(false);
    }
  }

  function handleApprove(id: string, prev_status: Status) {
    // Instant optimistic flip — no await, no spinner
    setAttendees((prev) => prev.map((a) => a.id === id ? { ...a, application_status: "approved" } : a));
    setErr(id, "");
    approveAttendee(id, eventId)
      .then((result) => {
        if (result?.error) {
          if (isVersionSkewError(result.error)) {
            triggerRecoveryReload(result.error);
            return;
          }
          setAttendees((prev) => prev.map((a) => a.id === id ? { ...a, application_status: prev_status } : a));
          setErr(id, result.error);
        }
      })
      .catch((err) => {
        if (isVersionSkewError(err)) {
          triggerRecoveryReload(err instanceof Error ? err.message : "Server action deployment skew");
          return;
        }
        setAttendees((prev) => prev.map((a) => a.id === id ? { ...a, application_status: prev_status } : a));
        setErr(id, err instanceof Error ? err.message : "Failed to approve attendee");
      });
  }

  function handleReject(id: string, prev_status: Status) {
    setAttendees((prev) => prev.map((a) => a.id === id ? { ...a, application_status: "rejected" } : a));
    setErr(id, "");
    rejectAttendee(id, eventId)
      .then((result) => {
        if (result?.error) {
          if (isVersionSkewError(result.error)) {
            triggerRecoveryReload(result.error);
            return;
          }
          setAttendees((prev) => prev.map((a) => a.id === id ? { ...a, application_status: prev_status } : a));
          setErr(id, result.error);
        }
      })
      .catch((err) => {
        if (isVersionSkewError(err)) {
          triggerRecoveryReload(err instanceof Error ? err.message : "Server action deployment skew");
          return;
        }
        setAttendees((prev) => prev.map((a) => a.id === id ? { ...a, application_status: prev_status } : a));
        setErr(id, err instanceof Error ? err.message : "Failed to reject attendee");
      });
  }

  async function handleGeneratePass(id: string) {
    setLoadingId(id); setErr(id, "");
    try {
      const result = await generatePass(id, eventId);
      setLoadingId(null);
      if (result?.error) {
        if (isVersionSkewError(result.error)) {
          triggerRecoveryReload(result.error);
          return;
        }
        setErr(id, result.error ?? "");
      } else if (result?.passToken) {
        const token = result.passToken as string;
        setPassTokens((prev) => ({ ...prev, [id]: token }));
        setAttendees((prev) => prev.map((a) => a.id === id ? { ...a, pass_status: "generated" } : a));
      }
    } catch (err) {
      setLoadingId(null);
      if (isVersionSkewError(err)) {
        triggerRecoveryReload(err instanceof Error ? err.message : "Server action deployment skew");
        return;
      }
      setErr(id, err instanceof Error ? err.message : "Failed to generate pass");
    }
  }

  async function handleViewPass(id: string) {
    if (passTokens[id]) { window.open(`/pass/${passTokens[id]}`, "_blank"); return; }
    setLoadingId(id); setErr(id, "");
    try {
      const result = await generatePass(id, eventId);
      setLoadingId(null);
      if (result?.error) {
        if (isVersionSkewError(result.error)) {
          triggerRecoveryReload(result.error);
          return;
        }
        setErr(id, result.error ?? "");
      } else if (result?.passToken) {
        const token = result.passToken as string;
        setPassTokens((prev) => ({ ...prev, [id]: token }));
        window.open(`/pass/${token}`, "_blank");
      }
    } catch (err) {
      setLoadingId(null);
      if (isVersionSkewError(err)) {
        triggerRecoveryReload(err instanceof Error ? err.message : "Server action deployment skew");
        return;
      }
      setErr(id, err instanceof Error ? err.message : "Failed to generate pass");
    }
  }

  async function handleUndoCheckIn(id: string) {
    setUndoingId(id);
    setErr(id, "");
    try {
      const result = await undoCheckIn(id, eventId);
      setUndoingId(null);
      if (result?.error) {
        setErr(id, result.error);
      } else {
        setAttendees((prev) =>
          prev.map((a) => (a.id === id ? { ...a, pass_status: "generated" } : a))
        );
      }
    } catch (err) {
      setUndoingId(null);
      if (isVersionSkewError(err)) {
        triggerRecoveryReload(err instanceof Error ? err.message : "Server action deployment skew");
        return;
      }
      setErr(id, err instanceof Error ? err.message : "Failed to undo check-in");
    }
  }

  function handleExport() {
    // Stream directly from server-side chunked export endpoint
    window.location.href = `/api/event/${eventId}/export/csv`;
  }

  async function handlePromoteNextWaitlist() {
    setPromotingWaitlist(true);
    try {
      const res = await promoteNextWaitlistAttendee(eventId);
      if (res?.error) {
        if (isVersionSkewError(res.error)) {
          triggerRecoveryReload(res.error);
          return;
        }
        alert(res.error);
      } else if (res?.attendeeName) {
        setAttendees((prev) => {
          const firstWlIndex = prev.findIndex((a) => a.application_status === "waitlisted");
          if (firstWlIndex === -1) return prev;
          const updated = [...prev];
          updated[firstWlIndex] = {
            ...updated[firstWlIndex],
            application_status: "approved",
            pass_status: res.passToken ? "generated" : updated[firstWlIndex].pass_status,
          };
          return updated;
        });
        if (res.passToken) {
          const promoted = attendees.find((a) => a.name === res.attendeeName);
          if (promoted) {
            setPassTokens((prev) => ({ ...prev, [promoted.id]: res.passToken! }));
          }
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to promote attendee");
    } finally {
      setPromotingWaitlist(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filtered.length);
  const paginatedList = filtered.slice(startIndex, endIndex);

  const tabs: FilterTab[] = ["all", "pending", "approved", "rejected", "waitlisted"];
  const statCards = [
    { label: "Total attendees", value: attendees.length, note: `${filtered.length} visible`, icon: Users, tone: "text-slate-700 bg-slate-50 border-slate-200" },
    { label: "Approved capacity", value: attendeeLimit > 0 ? `${approvedCount}/${attendeeLimit}` : approvedCount, note: `${capacityPct}% filled`, icon: ClipboardList, tone: atCapacity ? "text-red-700 bg-red-50 border-red-200" : "text-blue-700 bg-blue-50 border-blue-200" },
    { label: "Checked in", value: checkedInCount, note: `${generatedPassCount} passes issued`, icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { label: "Payments", value: paidCount, note: `${groupPassCount} group passes`, icon: CreditCard, tone: "text-amber-700 bg-amber-50 border-amber-200" },
  ];

  function getPayment(a: Attendee) {
    return payments[a.id] || payments[`email:${a.email.toLowerCase()}`];
  }

  function getGroupMeta(a: Attendee) {
    const customResponses = (a.custom_responses as any) || {};
    const isExplicitGroupQr =
      customResponses.is_single_group_qr === true ||
      customResponses.is_single_group_qr === "true" ||
      customResponses.credential_type === "GROUP_QR" ||
      customResponses.credentialType === "GROUP_QR";
    return { customResponses, isGroup: Boolean(isExplicitGroupQr || groupPasses[a.id]) };
  }

  function getCustomAnswerRows(a: Attendee) {
    if (customFields && customFields.length > 0) {
      return customFields.map((field) => {
        const rawVal = a.custom_responses?.[field.id];
        const displayVal = rawVal === true ? "Yes" : rawVal === false ? "No" : rawVal ? String(rawVal) : "-";
        return { id: field.id, label: field.label, value: displayVal };
      });
    }

    return Object.entries(a.custom_responses || {}).map(([key, val]) => ({
      id: key,
      label: key,
      value: val === true ? "Yes" : val === false ? "No" : String(val ?? "-"),
    }));
  }

  function openGroupHistory(a: Attendee) {
    const group = groupPasses[a.id];
    if (!group?.admissions || group.admissions.length === 0) return;
    setSelectedGroupHistory({
      name: a.name,
      email: a.email,
      totalGuests: group.totalGuests,
      checkedInGuests: group.checkedInGuests,
      admissions: group.admissions || [],
    });
  }

  function renderActions(a: Attendee, payment?: AttendeePaymentInfo) {
    const isLoading = loadingId === a.id;
    const hasToken = !!passTokens[a.id];
    const passExists = a.pass_status === "generated" || a.pass_status === "checked_in";

    return (
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedAttendee(a)}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 shadow-xs"
        >
          <Eye className="h-3 w-3 text-slate-500" />
          View
        </button>

        {a.application_status === "pending" && (
          <>
            {payment?.status === "paid" && (
              <span className="hidden xl:inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/80">
                Paid
              </span>
            )}
            <Btn onClick={() => handleApprove(a.id, a.application_status)} pending={false} variant="primary">
              <Check className="w-3 h-3" /> Approve
            </Btn>
            <Btn onClick={() => handleReject(a.id, a.application_status)} pending={false} variant="outline">
              Reject
            </Btn>
          </>
        )}

        {a.application_status === "approved" && (
          <>
            {!passExists && !hasToken ? (
              <Btn onClick={() => handleGeneratePass(a.id)} pending={isLoading} variant="primary">
                <Ticket className="w-3 h-3" /> Generate pass
              </Btn>
            ) : hasToken ? (
              <a href={`/pass/${passTokens[a.id]}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-slate-900 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800">
                <ExternalLink className="w-3 h-3" /> View pass
              </a>
            ) : (
              <Btn onClick={() => handleViewPass(a.id)} pending={isLoading} variant="primary">
                <ExternalLink className="w-3 h-3" />
                {isLoading ? "Loading..." : "View pass"}
              </Btn>
            )}
            {passTokens[a.id] && (
              <>
                <WhatsAppShareButton
                  eventName={eventName || "Event"}
                  eventDate="the upcoming event"
                  venue="the venue"
                  passToken={passTokens[a.id]}
                  attendeeName={a.name}
                  phone={a.phone}
                  variant="icon"
                />
                <AttendeeDeliveryActions
                  eventId={eventId}
                  passToken={passTokens[a.id]}
                  email={a.email}
                  phone={a.phone}
                />
                <button title="Download pass as PNG"
                  onClick={async () => {
                    const token = passTokens[a.id];
                    const res = await fetch(`/api/pass/image/${token}`);
                    if (!res.ok) return;
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const dl = document.createElement("a");
                    dl.href = url; dl.download = `pass-${a.name.replace(/\s+/g, "-").toLowerCase()}.png`; dl.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950">
                  <Download className="w-3 h-3" />
                </button>
              </>
            )}
            {a.pass_status === "checked_in" && (
              <Btn onClick={() => handleUndoCheckIn(a.id)} pending={undoingId === a.id} variant="outline">
                <RotateCcw className="w-3 h-3 text-amber-600" />
                <span className="text-amber-700">Undo check-in</span>
              </Btn>
            )}
            <Btn onClick={() => handleReject(a.id, a.application_status)} pending={false} variant="danger">
              Revoke
            </Btn>
          </>
        )}

        {a.application_status === "rejected" && (
          <Btn onClick={() => handleApprove(a.id, a.application_status)} pending={false} variant="primary">
            Re-approve
          </Btn>
        )}

        {a.application_status === "waitlisted" && (
          <>
            <Btn onClick={() => handleApprove(a.id, a.application_status)} pending={false} variant="primary">
              <Check className="w-3 h-3" /> Promote
            </Btn>
            <Btn onClick={() => handleReject(a.id, a.application_status)} pending={false} variant="outline">
              Remove
            </Btn>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-bold text-slate-950 sm:text-xl">{eventName || "Event attendees"}</h1>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                liveConnected ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"
              }`}>
                <Wifi className="h-3 w-3" />
                {liveConnected ? "Live" : "Connecting"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Manage approvals, passes, payments, group admissions, and check-in status from one operations view.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {applicationEnabled && applySlug && (
              <Link href={`/apply/${applySlug}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                <span className="font-mono">{applySlug}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
            <button onClick={() => setShowAddModal(true)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-900 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800">
              <UserPlus className="h-3.5 w-3.5" />
              Add attendee
            </button>
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-md border border-slate-200 bg-slate-50/70 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{card.label}</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-slate-950">{card.value}</p>
                  </div>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${card.tone}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500">{card.note}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-200 px-4 pb-4">
          <div className="mt-3 h-2 overflow-hidden rounded bg-slate-100">
            <div
              className={`h-full rounded transition-all duration-500 ${atCapacity ? "bg-rose-600" : "bg-slate-900"}`}
              style={{ width: `${capacityPct}%` }}
            />
          </div>
          {atCapacity && (
            <p className="mt-2 text-xs font-semibold text-rose-700">Event is at full capacity.</p>
          )}
        </div>
      </div>

      {/* ── Table card ──────────────────────────────────────── */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        {/* Header bar */}
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Attendee directory</h2>
            <p className="mt-0.5 text-xs text-slate-500">Search, filter, issue passes, and inspect entry details.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canCSV ? (
              <button onClick={() => setShowImportModal(true)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                Import attendees
              </button>
            ) : (
              <Link href="/billing"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-50 shadow-xs">
                <Lock className="w-3 h-3" />
                Import attendees
                <span className="rounded bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">Starter+</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => refreshAttendees(true)}
              disabled={isRefreshing || isSyncingPayments}
              title="Refresh attendee data"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-violet-600" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={syncPayments}
              disabled={isSyncingPayments || isRefreshing}
              title="Sync gateway payments and auto-recover any paid orders"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 shadow-xs disabled:opacity-50"
            >
              <CreditCard className={`w-3.5 h-3.5 ${isSyncingPayments ? "animate-spin text-emerald-600" : "text-emerald-600"}`} />
              <span>{isSyncingPayments ? "Syncing..." : "Sync Payments"}</span>
            </button>

            {canExport ? (
              <button onClick={handleExport} disabled={exporting}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 shadow-xs">
                {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Export CSV
              </button>
            ) : (
              <Link href="/billing"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-50 shadow-xs">
                <Lock className="w-3 h-3" />
                Export CSV
                <span className="rounded bg-violet-50 border border-violet-200/80 px-1.5 py-0.5 text-[9px] font-bold uppercase text-violet-700">Pro</span>
              </Link>
            )}

            {counts.waitlisted > 0 && !atCapacity && (
              <button
                onClick={handlePromoteNextWaitlist}
                disabled={promotingWaitlist}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-50 shadow-xs"
              >
                {promotingWaitlist ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                Promote next from waitlist ({counts.waitlisted} waiting)
              </button>
            )}

            {unissuedCount > 0 && (
              <button
                onClick={handleBulkGenerate}
                disabled={bulkGenerating}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50"
                title="Generate passes for all approved attendees without a ticket"
              >
                {bulkGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ticket className="w-3.5 h-3.5" />}
                Generate {unissuedCount} {unissuedCount === 1 ? "pass" : "passes"}
              </button>
            )}

            {approvedCount > 0 && (
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 shadow-xs"
                title="Broadcast digital pass links to attendees"
              >
                <Send className="w-3.5 h-3.5 text-slate-500" />
                Broadcast passes
              </button>
            )}
          </div>
        </div>

        {bulkMsg && (
          <div
            className={`mb-4 flex items-center justify-between rounded-md p-3 text-xs font-semibold ${
              bulkMsg.isError
                ? "bg-rose-50 text-rose-700 border border-rose-200/80"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
            }`}
          >
            <span>{bulkMsg.text}</span>
            <button
              onClick={() => setBulkMsg(null)}
              className="text-slate-400 hover:text-slate-700 text-xs px-1.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tabs + Search */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-1">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  activeTab === tab ? "bg-white text-slate-950 shadow-xs" : "text-slate-500 hover:text-slate-700"
                }`}>
                {tab === "all" ? "All" : tab}
                <span className={`ml-1.5 text-xs ${activeTab === tab ? "text-slate-600" : "text-slate-400"}`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search name, email, phone, entries or token…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-slate-200 py-2 pl-8 pr-3 text-xs outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900" />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
              <Users className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              {attendees.length === 0 ? "No attendees yet" : search ? `No entries matching "${search}"` : "No attendees match this filter"}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-2 text-xs font-semibold text-slate-900 underline hover:text-slate-700 cursor-pointer"
              >
                Clear search filter
              </button>
            )}
            {attendees.length === 0 && (
              <p className="text-xs text-slate-400 mt-1">Add attendees manually or upload a CSV</p>
            )}
          </div>
        ) : (
          <>
              <div className="space-y-3 md:hidden">
                {paginatedList.map((a) => {
                  const payment = getPayment(a);
                  const { customResponses, isGroup } = getGroupMeta(a);
                  return (
                    <div key={a.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-950">{a.name}</p>
                          <p className="truncate text-xs text-slate-500">{a.email}</p>
                          {a.phone && <p className="mt-0.5 text-xs text-slate-400">{a.phone}</p>}
                        </div>
                        <StatusBadge status={a.application_status} />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Ticket</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <PassTypeBadge type={a.pass_type} />
                            <span className="capitalize text-slate-500">{a.pass_status.replace(/_/g, " ")}</span>
                          </div>
                        </div>
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Payment</p>
                          {payment?.status === "paid" ? (
                            <p className="mt-1 font-bold text-emerald-700">
                              {payment.currency === "INR" ? "₹" : `${payment.currency} `}{(payment.amount / 100).toLocaleString("en-IN")} Paid
                            </p>
                          ) : payment?.status === "created" ? (
                            <p className="mt-1 font-semibold text-amber-700">Awaiting payment</p>
                          ) : (
                            <p className="mt-1 text-slate-500">
                              {a.pass_type === "vip" || a.pass_type === "speaker" || a.pass_type === "organizer" ? "Complimentary" : "Free Pass"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 rounded-md border border-slate-200 bg-slate-50/70 p-2 text-xs">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Entry</p>
                        {isGroup ? (
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-2xs">
                              <Users className="h-3 w-3 text-slate-600" />
                              Group Pass ({groupPasses[a.id]?.totalGuests || customResponses.group_attendee_count || customResponses.guest_count || 1})
                            </span>
                            {groupPasses[a.id] && (
                              <span className="rounded-md border border-emerald-200/80 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                                {groupPasses[a.id].checkedInGuests}/{groupPasses[a.id].totalGuests} admitted
                              </span>
                            )}
                            {groupPasses[a.id]?.admissions && groupPasses[a.id].admissions!.length > 0 && (
                              <button
                                type="button"
                                onClick={() => openGroupHistory(a)}
                                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
                              >
                                {groupPasses[a.id].admissions!.length} batches
                              </button>
                            )}
                          </div>
                        ) : checkInInfoMap[a.id] ? (
                          <p className="mt-1 font-medium text-slate-700">
                            {checkInInfoMap[a.id].gateName} · {new Date(checkInInfoMap[a.id].checkedInAt).toLocaleString([], {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        ) : (
                          <p className="mt-1 text-slate-500">Not checked in</p>
                        )}
                      </div>

                      {a.custom_responses && Object.keys(a.custom_responses).length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedAttendee(a)}
                          className="mt-2 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                        >
                          <ClipboardList className="h-3 w-3 text-slate-500" />
                          View details
                        </button>
                      )}
                      {actionErrors[a.id] && <p className="mt-2 text-xs text-rose-600 font-medium">{actionErrors[a.id]}</p>}
                      <div className="mt-3 border-t border-slate-200 pt-3">
                        {renderActions(a, payment)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden overflow-hidden rounded-lg border border-slate-200 md:block">
            <div className="overflow-x-auto touch-pan-x">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Attendee</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Ticket</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Entry</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedList.map((a) => {
		                    const payment = getPayment(a);
		                    const { customResponses, isGroup } = getGroupMeta(a);

                    return (
	                      <tr key={a.id} className="transition-colors hover:bg-slate-50/70">
	                        <td className="px-4 py-3">
	                          <div className="min-w-0">
	                            <div className="flex flex-wrap items-center gap-2">
	                              <p className="font-semibold text-slate-950">{a.name}</p>
	                            {a.custom_responses && Object.keys(a.custom_responses).length > 0 && (
	                              <button
                                type="button"
	                                onClick={() => setSelectedAttendee(a)}
	                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
	                                title="View attendee details"
                              >
                                <ClipboardList className="w-3 h-3 text-slate-500" />
	                                Details
                              </button>
                            )}
	                            </div>
                              <p className="mt-1 truncate text-xs text-slate-500">{a.email}</p>
                              {a.phone && <p className="mt-0.5 text-xs text-slate-400">{a.phone}</p>}
		                            {isGroup && (
	                              <div className="mt-2 flex flex-wrap items-center gap-1.5">
	                                <span
	                                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-2xs"
                                  title="Single Group QR with partial check-in"
                                >
                                  <Users className="w-3 h-3 text-slate-600" />
		                                  Group Pass ({groupPasses[a.id]?.totalGuests || customResponses.group_attendee_count || customResponses.guest_count || 1})
                                </span>
                                {groupPasses[a.id] ? (
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                      groupPasses[a.id].checkedInGuests >= groupPasses[a.id].totalGuests
	                                        ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
	                                        : groupPasses[a.id].checkedInGuests > 0
	                                        ? "text-amber-700 bg-amber-50 border-amber-200/80"
	                                        : "text-slate-600 bg-slate-50 border-slate-200"
                                    }`}
                                  >
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    {groupPasses[a.id].checkedInGuests}/{groupPasses[a.id].totalGuests} Admitted
                                  </span>
                                ) : null}

                                {/* Partial Entry Admissions Breakdown Trigger */}
                                {groupPasses[a.id]?.admissions && groupPasses[a.id].admissions!.length > 0 && (
                                  <button
                                    type="button"
	                                    onClick={() => openGroupHistory(a)}
	                                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
                                    title="View partial entry admissions breakdown"
                                  >
                                    <History className="w-3 h-3 text-slate-500" />
                                    {groupPasses[a.id].admissions!.length} {groupPasses[a.id].admissions!.length === 1 ? "entry" : "entries"}
                                  </button>
                                )}

                                {/* Gate name and time info */}
                                {checkInInfoMap[a.id] ? (
	                                  <span className="flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                    <DoorOpen className="w-2.5 h-2.5 text-slate-500" />
                                    <span>{checkInInfoMap[a.id].gateName}</span>
                                    <span>·</span>
                                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                                    <span>
                                      {new Date(checkInInfoMap[a.id].checkedInAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </span>
                                ) : a.last_scanned_at ? (
                                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    {new Date(a.last_scanned_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                ) : null}
                              </div>
                            )}

		                            {!isGroup && a.pass_status === "checked_in" && (
	                              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-emerald-700">
                                <span className="inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>Checked in</span>
                                </span>
                                {checkInInfoMap[a.id] ? (
	                                  <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                                    <DoorOpen className="w-2.5 h-2.5 text-slate-500" />
                                    <span>{checkInInfoMap[a.id].gateName}</span>
                                    <span>·</span>
                                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                                    <span>
                                      {new Date(checkInInfoMap[a.id].checkedInAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </span>
                                ) : a.last_scanned_at ? (
                                  <span className="text-slate-500">
                                    at {new Date(a.last_scanned_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </div>
	                          {actionErrors[a.id] && (
	                            <p className="text-xs text-rose-600 font-medium mt-0.5">{actionErrors[a.id]}</p>
	                          )}
	                        </td>
	                        <td className="px-4 py-3">
	                          <PassTypeBadge type={a.pass_type} />
                            <p className="mt-1 text-xs text-slate-500 capitalize">{a.pass_status.replace(/_/g, " ")}</p>
	                        </td>
	                        <td className="px-4 py-3">
	                          {payment?.status === "paid" ? (
	                            <div className="flex flex-col gap-0.5">
	                              <span className="inline-flex w-fit items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                {payment.currency === "INR" ? "₹" : `${payment.currency} `}{(payment.amount / 100).toLocaleString("en-IN")} Paid
                              </span>
                              {payment.paymentId ? (
	                                <span className="max-w-[150px] truncate font-mono text-[10px] text-slate-500" title={`Razorpay Transaction ID: ${payment.paymentId}`}>
                                  ID: {payment.paymentId}
                                </span>
                              ) : (
	                                <span className="max-w-[150px] truncate font-mono text-[10px] text-slate-400">
                                  Order: {payment.orderId.slice(0, 14)}...
                                </span>
                              )}
                            </div>
                          ) : payment?.status === "created" ? (
                            <div className="flex flex-col gap-0.5">
	                              <span className="inline-flex w-fit items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Awaiting Payment
                              </span>
	                              <span className="max-w-[150px] truncate font-mono text-[10px] text-slate-400">
                                Order: {payment.orderId.slice(0, 14)}...
                              </span>
                            </div>
                          ) : (
	                            <span className="text-xs text-slate-400">
	                              {a.pass_type === "vip" || a.pass_type === "speaker" || a.pass_type === "organizer" ? "Complimentary" : "Free Pass"}
	                            </span>
	                          )}
	                        </td>
                          <td className="px-4 py-3">
                            {checkInInfoMap[a.id] ? (
                              <div className="space-y-1 text-xs">
                                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-semibold text-slate-700">
                                  <DoorOpen className="h-3 w-3" />
                                  {checkInInfoMap[a.id].gateName}
                                </span>
                                <p className="text-slate-500">
                                  {new Date(checkInInfoMap[a.id].checkedInAt).toLocaleString([], {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            ) : a.last_scanned_at ? (
                              <span className="text-xs text-slate-500">
                                {new Date(a.last_scanned_at).toLocaleString([], {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">Not checked in</span>
                            )}
                          </td>
	                        <td className="px-4 py-3">
	                          <StatusBadge status={a.application_status} />
	                        </td>
	                        <td className="px-4 py-3">
	                          {renderActions(a, payment)}
	                        </td>
	                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
	            <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2.5 sm:flex-row">
	              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>
                  Showing {filtered.length > 0 ? startIndex + 1 : 0}–{endIndex} of {filtered.length} attendee{filtered.length !== 1 ? "s" : ""}
                </span>
                {filtered.length > 25 && (
                  <div className="flex items-center gap-1.5">
	                    <span className="text-slate-400">Rows:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
	                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-700"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={250}>250</option>
                    </select>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
	                    className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
                  >
                    Previous
                  </button>
	                  <span className="px-2 text-xs font-medium text-slate-600">
                    Page {safePage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
	                    className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

              <div className="mt-3 flex flex-col items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 md:hidden">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>
                    Showing {filtered.length > 0 ? startIndex + 1 : 0}-{endIndex} of {filtered.length}
                  </span>
                  {filtered.length > 25 && (
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-700"
                      aria-label="Rows per page"
                    >
                      <option value={25}>25 rows</option>
                      <option value={50}>50 rows</option>
                      <option value={100}>100 rows</option>
                      <option value={250}>250 rows</option>
                    </select>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="px-2 text-xs font-medium text-slate-600">
                      {safePage}/{totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
          </>
        )}
      </div>

      {showAddModal && (
        <AddAttendeeModal
          eventId={eventId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            refreshAttendees(true);
          }}
        />
      )}
      {showImportModal && (
        <ImportAttendeesModal
          eventId={eventId}
          onClose={() => {
            setShowImportModal(false);
            refreshAttendees(false);
          }}
          onSuccess={() => {
            setShowImportModal(false);
            refreshAttendees(true);
          }}
        />
      )}

      {mounted && selectedAttendee && createPortal((() => {
        const payment = getPayment(selectedAttendee);
        const group = groupPasses[selectedAttendee.id];
        const { isGroup } = getGroupMeta(selectedAttendee);
        const checkIn = checkInInfoMap[selectedAttendee.id];
        const answerRows = getCustomAnswerRows(selectedAttendee);
        const passToken = passTokens[selectedAttendee.id];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="fixed inset-0" onClick={() => setSelectedAttendee(null)} aria-hidden="true" />
            <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 sm:max-w-2xl">
              <div className="border-b border-slate-200 bg-white px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-bold text-slate-950">{selectedAttendee.name}</h3>
                      <StatusBadge status={selectedAttendee.application_status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedAttendee.email}
                      </span>
                      {selectedAttendee.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedAttendee.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAttendee(null)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    aria-label="Close attendee details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto px-5 py-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Ticket</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <PassTypeBadge type={selectedAttendee.pass_type} />
                      <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold capitalize text-slate-600">
                        {selectedAttendee.pass_status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Payment</p>
                    {payment?.status === "paid" ? (
                      <p className="mt-2 text-sm font-bold text-emerald-700">
                        {payment.currency === "INR" ? "₹" : `${payment.currency} `}{(payment.amount / 100).toLocaleString("en-IN")} Paid
                      </p>
                    ) : payment?.status === "created" ? (
                      <p className="mt-2 text-sm font-semibold text-amber-700">Awaiting payment</p>
                    ) : (
                      <p className="mt-2 text-sm font-semibold text-slate-600">
                        {selectedAttendee.pass_type === "vip" || selectedAttendee.pass_type === "speaker" || selectedAttendee.pass_type === "organizer" ? "Complimentary" : "Free Pass"}
                      </p>
                    )}
                    {payment && (
                      <p className="mt-1 truncate font-mono text-[10px] text-slate-500">
                        {payment.paymentId || payment.orderId}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Entry</p>
                    {checkIn ? (
                      <div className="mt-2 text-sm text-slate-700">
                        <p className="font-bold">{checkIn.gateName}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {new Date(checkIn.checkedInAt).toLocaleString([], {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ) : selectedAttendee.last_scanned_at ? (
                      <p className="mt-2 text-sm font-semibold text-slate-600">
                        {new Date(selectedAttendee.last_scanned_at).toLocaleString([], {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm font-semibold text-slate-500">Not checked in</p>
                    )}
                  </div>
                </div>

                {isGroup && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Group Pass</p>
                        <p className="mt-1 text-xs text-slate-600">
                          {group ? `${group.checkedInGuests}/${group.totalGuests} admitted` : "Group credential detected"}
                        </p>
                      </div>
                      {group?.admissions && group.admissions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => openGroupHistory(selectedAttendee)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
                        >
                          <History className="h-3.5 w-3.5 text-slate-500" />
                          View admission batches
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600">Registration details</h4>
                    <span className="text-[10px] font-semibold text-slate-400">{answerRows.length} fields</span>
                  </div>
                  {answerRows.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs font-medium text-slate-500">
                      No custom registration answers recorded.
                    </div>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {answerRows.map((row) => (
                        <div key={row.id} className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{row.label}</p>
                          <p className="mt-1 break-words text-sm font-medium text-slate-950">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/80 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {passToken && (
                    <a
                      href={`/pass/${passToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open pass
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedAttendee(null)}
                    className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>
                <p className="text-[10px] font-medium text-slate-400">
                  Added {new Date(selectedAttendee.created_at).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        );
      })(), document.body)}

      {mounted && selectedGroupHistory && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setSelectedGroupHistory(null)} aria-hidden="true" />
          <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 sm:max-w-lg">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-bold text-slate-950">{selectedGroupHistory.name}</h3>
                  <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                    Group Pass
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{selectedGroupHistory.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGroupHistory(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">Total</span>
                  <span className="text-lg font-bold text-slate-950">{selectedGroupHistory.totalGuests}</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-700">Admitted</span>
                  <span className="text-lg font-bold text-slate-900">{selectedGroupHistory.checkedInGuests}</span>
                </div>
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50 p-3 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-emerald-700">Remaining</span>
                  <span className="text-lg font-bold text-emerald-800">
                    {Math.max(0, selectedGroupHistory.totalGuests - selectedGroupHistory.checkedInGuests)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                  <History className="h-3.5 w-3.5 text-slate-500" />
                  Admission batches ({selectedGroupHistory.admissions.length})
                </h4>

                {selectedGroupHistory.admissions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-6 text-center">
                    <p className="text-xs text-slate-500">No partial entry batch logs recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedGroupHistory.admissions.map((entry, idx) => (
                      <div
                        key={entry.id || idx}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-950">
                              +{entry.admittedCount} {entry.admittedCount === 1 ? "person" : "people"} entered
                            </span>
                            <span className="text-[10px] font-medium text-slate-500">
                              {entry.remainingAfter} remaining after
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1 font-medium">
                              <DoorOpen className="h-2.5 w-2.5 text-slate-400" />
                              {entry.gateName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5 text-slate-400" />
                              {new Date(entry.admittedAt).toLocaleString([], {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                          #{selectedGroupHistory.admissions.length - idx}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50/80 px-5 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedGroupHistory(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showBroadcastModal && (
        <BulkBroadcastModal
          eventId={eventId}
          approvedCount={approvedCount}
          unissuedCount={unissuedCount}
          onClose={() => setShowBroadcastModal(false)}
        />
      )}
    </>
  );
}
