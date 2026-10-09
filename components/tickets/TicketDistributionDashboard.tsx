"use client";

import { useState, useEffect } from "react";
import {
  Send,
  UserCheck,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  AlertCircle,
  Loader2,
  Ticket,
  Mail,
  Phone,
  User,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  getDistributionSummaryAction,
  assignTicketAction,
  revokeAssignmentAction,
} from "@/app/actions/ticket-distribution";
import type {
  OrderDistributionSummary,
  TicketDistributionItem,
  TicketAssignmentState,
} from "@/lib/bulk-distribution/types";

interface TicketDistributionDashboardProps {
  orderId: string;
  isOrganizer?: boolean;
}

const STATE_CONFIG: Record<
  TicketAssignmentState,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  UNASSIGNED: {
    label: "Available",
    bg: "bg-neutral-100",
    text: "text-neutral-700",
    border: "border-neutral-200",
    dot: "bg-neutral-400",
  },
  INVITED: {
    label: "Invited",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  CLAIMED: {
    label: "Claimed",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  RETAINED: {
    label: "Retained (You)",
    bg: "bg-violet-50",
    text: "text-violet-800",
    border: "border-violet-200",
    dot: "bg-violet-600",
  },
  EXPIRED: {
    label: "Expired Invite",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  REVOKED: {
    label: "Revoked",
    bg: "bg-neutral-100",
    text: "text-neutral-500",
    border: "border-neutral-200",
    dot: "bg-neutral-400",
  },
};

export default function TicketDistributionDashboard({
  orderId,
  isOrganizer = false,
}: TicketDistributionDashboardProps) {
  const [summary, setSummary] = useState<OrderDistributionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [filterState, setFilterState] = useState<string>("ALL");

  // Modal State for Assigning Ticket
  const [activeAssignTicket, setActiveAssignTicket] = useState<TicketDistributionItem | null>(null);
  const [assignName, setAssignName] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [assignPhone, setAssignPhone] = useState("");
  const [assignMode, setAssignMode] = useState<"claim_link" | "manual" | "retained">("claim_link");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Modal State for Revoking Ticket
  const [activeRevokeTicket, setActiveRevokeTicket] = useState<TicketDistributionItem | null>(null);
  const [submittingRevoke, setSubmittingRevoke] = useState(false);

  // Copy token feedback
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  async function loadSummary() {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await getDistributionSummaryAction(orderId);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.summary) {
        setSummary(res.summary);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load distribution summary.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, [orderId]);

  const handleCopyClaimLink = (claimUrl?: string | null, claimToken?: string | null) => {
    if (!claimUrl && !claimToken) return;
    const urlToCopy = claimUrl || `${window.location.origin}/claim-ticket/${claimToken}`;
    navigator.clipboard.writeText(urlToCopy);
    setCopiedToken(claimToken || "copied");
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const handleOpenAssignModal = (ticket: TicketDistributionItem, retainForSelf = false) => {
    setActiveAssignTicket(ticket);
    if (retainForSelf && summary) {
      setAssignMode("retained");
      setAssignName(summary.purchaserName);
      setAssignEmail(summary.purchaserEmail);
    } else {
      setAssignMode("claim_link");
      setAssignName(ticket.recipientName || "");
      setAssignEmail(ticket.recipientEmail || "");
      setAssignPhone(ticket.recipientPhone || "");
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignTicket) return;

    try {
      setSubmittingAssign(true);
      setErrorMsg("");
      setSuccessMsg("");

      const isRetaining = assignMode === "retained";

      const res = await assignTicketAction({
        orderId,
        attendeeId: activeAssignTicket.attendeeId,
        ticketIndex: activeAssignTicket.ticketIndex,
        mode: isRetaining ? "manual" : assignMode,
        recipientName: assignName.trim(),
        recipientEmail: assignEmail.trim(),
        recipientPhone: assignPhone.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.message || res.error || "Failed to assign ticket.");
      } else {
        setSuccessMsg(
          isRetaining
            ? "Ticket successfully retained for yourself."
            : `Ticket successfully assigned to ${assignName || assignEmail}.`
        );
        setActiveAssignTicket(null);
        await loadSummary();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while assigning ticket.");
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleRevokeSubmit = async () => {
    if (!activeRevokeTicket) return;

    try {
      setSubmittingRevoke(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await revokeAssignmentAction({
        orderId,
        attendeeId: activeRevokeTicket.attendeeId,
      });

      if (!res.success) {
        setErrorMsg(res.message || res.error || "Failed to revoke ticket assignment.");
      } else {
        setSuccessMsg("Ticket assignment revoked and returned to available tickets.");
        setActiveRevokeTicket(null);
        await loadSummary();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to revoke ticket.");
    } finally {
      setSubmittingRevoke(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
        <p className="text-sm font-medium text-neutral-500">Loading your tickets…</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-900">Order Not Found</h3>
        <p className="text-sm text-neutral-500 mt-1">{errorMsg || "Unable to load distribution data for this order."}</p>
      </div>
    );
  }

  const tickets = summary.tickets || [];
  const filteredTickets = filterState === "ALL" ? tickets : tickets.filter((t) => t.state === filterState);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Header & Summary ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                <Ticket className="w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-neutral-900">Manage & Distribute Tickets</h1>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Order <span className="font-mono font-medium text-neutral-800">{orderId}</span> · Booked by{" "}
              <span className="font-semibold text-neutral-800">{summary.purchaserName}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={loadSummary}
            className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* ── Metrics Cards Banner ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-5">
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total</span>
            <div className="text-xl font-extrabold text-neutral-900 mt-0.5">{summary.totalTickets}</div>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Claimed</span>
            <div className="text-xl font-extrabold text-emerald-900 mt-0.5">{summary.claimedCount}</div>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Invited / Pending</span>
            <div className="text-xl font-extrabold text-amber-900 mt-0.5">{summary.invitedCount}</div>
          </div>

          <div className="bg-violet-50/60 rounded-xl p-3.5 border border-violet-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">Retained (You)</span>
            <div className="text-xl font-extrabold text-violet-900 mt-0.5">{summary.retainedCount}</div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-100 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Available</span>
            <div className="text-xl font-extrabold text-neutral-700 mt-0.5">{summary.availableCount}</div>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="mt-5">
          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all duration-300"
              style={{ width: `${(summary.claimedCount / summary.totalTickets) * 100}%` }}
              title={`Claimed: ${summary.claimedCount}`}
            />
            <div
              className="bg-amber-400 transition-all duration-300"
              style={{ width: `${(summary.invitedCount / summary.totalTickets) * 100}%` }}
              title={`Invited: ${summary.invitedCount}`}
            />
            <div
              className="bg-violet-600 transition-all duration-300"
              style={{ width: `${(summary.retainedCount / summary.totalTickets) * 100}%` }}
              title={`Retained: ${summary.retainedCount}`}
            />
          </div>
        </div>
      </div>

      {/* ── Alerts ── */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "UNASSIGNED", "INVITED", "CLAIMED", "RETAINED"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterState(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterState === st
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {st === "ALL" ? "All Tickets" : st === "UNASSIGNED" ? "Available" : st}
          </button>
        ))}
      </div>

      {/* ── Tickets List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTickets.map((t) => {
          const cfg = STATE_CONFIG[t.state] || STATE_CONFIG.UNASSIGNED;
          const isUnassigned = t.state === "UNASSIGNED" || t.state === "REVOKED";
          const isInvited = t.state === "INVITED" || t.state === "EXPIRED";
          const isClaimed = t.state === "CLAIMED";
          const isRetained = t.state === "RETAINED";

          return (
            <div
              key={t.attendeeId || t.ticketIndex}
              className="bg-white rounded-2xl border border-neutral-100 p-5 flex flex-col justify-between transition-all hover:border-neutral-200"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Ticket #{t.ticketIndex}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-0.5">{t.ticketTypeName}</h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>

                {/* Recipient Details */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col gap-1.5 text-xs text-neutral-600">
                  {isUnassigned ? (
                    <p className="text-neutral-400 italic">Not yet distributed to an attendee.</p>
                  ) : (
                    <>
                      {t.recipientName && (
                        <div className="flex items-center gap-2 text-neutral-900 font-medium">
                          <User className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{t.recipientName}</span>
                        </div>
                      )}
                      {t.recipientEmail && (
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{t.recipientEmail}</span>
                        </div>
                      )}
                      {t.recipientPhone && (
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Phone className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{t.recipientPhone}</span>
                        </div>
                      )}
                      {t.claimExpiresAt && isInvited && (
                        <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded-md text-[11px] mt-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>Expires: {new Date(t.claimExpiresAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                {isUnassigned && (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(t, false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Claim Link
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(t, true)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
                      title="Keep this ticket for yourself"
                    >
                      Keep for Me
                    </button>
                  </div>
                )}

                {isInvited && (
                  <div className="flex items-center justify-between gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => handleCopyClaimLink(t.claimUrl, t.claimToken)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors text-neutral-800"
                    >
                      {copiedToken === t.claimToken ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Copy Claim Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveRevokeTicket(t)}
                      className="p-2 rounded-xl text-xs text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Revoke and reassign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {isClaimed && (
                  <div className="flex items-center justify-between gap-2 w-full text-xs text-emerald-700 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Pass Issued & Ready
                    </span>
                    {t.passId && (
                      <a
                        href={`/pass/${t.passId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-violet-700 hover:underline"
                      >
                        View Pass
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {isRetained && (
                  <div className="flex items-center justify-between gap-2 w-full text-xs text-violet-800 font-medium">
                    <span>Assigned to purchaser (You)</span>
                    <button
                      type="button"
                      onClick={() => setActiveRevokeTicket(t)}
                      className="text-xs text-neutral-400 hover:text-red-600 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Assign Ticket Modal ── */}
      {activeAssignTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-100">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {assignMode === "retained" ? "Retain Ticket for Myself" : `Assign Ticket #${activeAssignTicket.ticketIndex}`}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{activeAssignTicket.ticketTypeName}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAssignTicket(null)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={assignName}
                  onChange={(e) => setAssignName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Recipient Email Address</label>
                <input
                  type="email"
                  required
                  value={assignEmail}
                  onChange={(e) => setAssignEmail(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Mobile Number <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={assignPhone}
                  onChange={(e) => setAssignPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setActiveAssignTicket(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssign}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  {submittingAssign && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {assignMode === "retained" ? "Confirm Retain" : "Generate & Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Revoke Ticket Modal ── */}
      {activeRevokeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-100">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4 text-red-600">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-neutral-900">
              Revoke Ticket #{activeRevokeTicket.ticketIndex}?
            </h3>

            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              This will invalidate any active claim invitation for{" "}
              <strong>{activeRevokeTicket.recipientName || activeRevokeTicket.recipientEmail || "the attendee"}</strong> and
              return the ticket to your pool of available tickets.
            </p>

            <div className="mt-5 flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setActiveRevokeTicket(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Keep Assigned
              </button>
              <button
                type="button"
                onClick={handleRevokeSubmit}
                disabled={submittingRevoke}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {submittingRevoke && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Yes, Revoke Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
