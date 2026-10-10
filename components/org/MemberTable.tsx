"use client";

import { useState } from "react";
import {
  UserCircle2,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  Clock,
  Copy,
  Check,
  Mail,
  Send,
  Info,
  ShieldCheck,
  X,
  AlertCircle,
  Search,
} from "lucide-react";
import { updateMemberRole, removeMember, resendInvite, cancelInvite } from "@/app/actions/org-members";
import type { OrgRole } from "@/types";

const ROLE_BADGE: Record<OrgRole, { label: string; cls: string }> = {
  owner:                { label: "Owner",                 cls: "bg-brand-50 text-brand border-brand-100" },
  admin:                { label: "Admin",                 cls: "bg-blue-50 text-blue-700 border-blue-100" },
  event_manager:        { label: "Event Manager",         cls: "bg-amber-50 text-amber-700 border-amber-100" },
  registration_manager: { label: "Registration Manager",  cls: "bg-purple-50 text-purple-700 border-purple-100" },
  gate_supervisor:      { label: "Gate Supervisor",       cls: "bg-teal-50 text-teal-700 border-teal-100" },
  gate_manager:         { label: "Gate Manager",          cls: "bg-teal-50 text-teal-700 border-teal-100" },
  gate_staff:           { label: "Check-in Staff",        cls: "bg-green-50 text-green-700 border-green-100" },
  checkin_staff:        { label: "Check-in Staff",        cls: "bg-green-50 text-green-700 border-green-100" },
  session_manager:      { label: "Session Manager",       cls: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  session_scanner:      { label: "Check-in Staff",        cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  finance:              { label: "Finance",               cls: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  analytics_viewer:     { label: "Analytics Viewer",      cls: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  viewer:               { label: "Viewer",                cls: "bg-neutral-100 text-neutral-500 border-neutral-200" },
  member:               { label: "Member",                cls: "bg-neutral-100 text-neutral-600 border-neutral-200" },
};

const ASSIGNABLE_ROLES: { value: OrgRole; label: string }[] = [
  { value: "admin",                label: "Admin" },
  { value: "event_manager",        label: "Event Manager" },
  { value: "gate_manager",         label: "Gate Manager" },
  { value: "checkin_staff",        label: "Check-in Staff" },
  { value: "finance",              label: "Finance" },
  { value: "viewer",               label: "Viewer" },
  { value: "member",               label: "Member" },
];

export interface MemberRow {
  id: string;
  user_id: string | null;
  invited_email: string;
  role: OrgRole;
  status: string;
  invite_token?: string | null;
  invited_by?: string | null;
  joined_at: string | null;
  created_at?: string;
  updated_at?: string;
  profile?: { full_name: string; avatar_url: string | null } | null;
  inviter?: { full_name: string; avatar_url: string | null; email?: string } | null;
}

interface Props {
  members: MemberRow[];
  orgSlug: string;
  orgName?: string;
  userRole: OrgRole;
  currentUserId: string;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

function getRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function MemberTable({ members, orgSlug, orgName = "Organization", userRole, currentUserId }: Props) {
  const [filterTab, setFilterTab] = useState<"all" | "active" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [selectedInviteModal, setSelectedInviteModal] = useState<MemberRow | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const canManage = userRole === "owner" || userRole === "admin";

  const activeMembers = members.filter((m) => m.status === "active");
  const pendingMembers = members.filter((m) => m.status === "pending");

  const filteredMembers = members.filter((m) => {
    // Tab filter
    if (filterTab === "active" && m.status !== "active") return false;
    if (filterTab === "pending" && m.status !== "pending") return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = m.profile?.full_name?.toLowerCase() ?? "";
      const email = m.invited_email.toLowerCase();
      const role = m.role.toLowerCase();
      if (!name.includes(q) && !email.includes(q) && !role.includes(q)) {
        return false;
      }
    }

    return true;
  });

  function getInviteUrl(token?: string | null): string {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://urpass.space";
    return `${origin}/org/${orgSlug}/join?token=${token || ""}`;
  }

  async function handleCopyLink(member: MemberRow) {
    if (!member.invite_token) {
      setStatusMessage({ type: "error", text: "Invite token missing. Please resend the invite to generate a new link." });
      return;
    }
    const url = getInviteUrl(member.invite_token);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(member.id);
      setTimeout(() => setCopiedId(null), 2000);
      setStatusMessage({ type: "success", text: `Join link copied for ${member.invited_email}!` });
    } catch {
      setStatusMessage({ type: "error", text: "Could not copy link to clipboard." });
    }
  }

  async function handleResend(member: MemberRow) {
    setResendingId(member.id);
    setStatusMessage(null);
    try {
      const result = await resendInvite(member.id, orgSlug, orgName);
      if (result?.error) {
        setStatusMessage({ type: "error", text: result.error });
      } else {
        setStatusMessage({
          type: "success",
          text: `Invitation email resent to ${member.invited_email}!`,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to resend invitation.",
      });
    } finally {
      setResendingId(null);
    }
  }

  async function handleCancel(member: MemberRow) {
    if (!confirm(`Are you sure you want to cancel the invitation for ${member.invited_email}?`)) {
      return;
    }
    setRevokingId(member.id);
    setStatusMessage(null);
    try {
      const result = await cancelInvite(member.id, orgSlug);
      if (result?.error) {
        setStatusMessage({ type: "error", text: result.error });
      } else {
        setStatusMessage({
          type: "success",
          text: `Invitation for ${member.invited_email} has been cancelled.`,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to cancel invitation.",
      });
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Notifications */}
      {statusMessage && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-xs font-medium border animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:opacity-75 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100/80 rounded-xl w-fit">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === "all"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            All Members ({members.length})
          </button>
          <button
            onClick={() => setFilterTab("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === "active"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Active ({activeMembers.length})
          </button>
          <button
            onClick={() => setFilterTab("pending")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === "pending"
                ? "bg-white text-amber-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <span>Pending Invites</span>
            {pendingMembers.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {pendingMembers.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all bg-white placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Mail className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-700">No members found</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              {filterTab === "pending"
                ? "There are currently no pending invitations. When you invite team members, their email delivery history will show up here."
                : filterTab === "active"
                ? "No active members match your search criteria."
                : "No members or invitations match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredMembers.map((m) => {
              const badge = ROLE_BADGE[m.role] || ROLE_BADGE.member;
              const isPending = m.status === "pending";
              const name = isPending ? m.invited_email : (m.profile?.full_name ?? m.invited_email);
              const sentDate = formatDate(m.created_at);
              const resentDate = m.updated_at && m.updated_at !== m.created_at ? formatDate(m.updated_at) : null;
              const relativeSent = getRelativeTime(m.created_at);
              const isResending = resendingId === m.id;
              const isRevoking = revokingId === m.id;
              const isCopied = copiedId === m.id;

              return (
                <div
                  key={m.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-neutral-50/60 ${
                    isPending ? "bg-amber-50/20" : ""
                  }`}
                >
                  {/* Left: Avatar & Identity & Sent History */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                        isPending ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {m.profile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.profile.avatar_url} alt={name} className="w-full h-full object-cover" />
                      ) : isPending ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <UserCircle2 className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{name}</p>
                        
                        {/* Status badge */}
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Invite
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}

                        {/* Role badge */}
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* Sub-line: Email & History Info */}
                      <div className="flex items-center gap-3 text-xs text-neutral-500 flex-wrap">
                        {isPending ? (
                          <>
                            <span className="text-neutral-600 font-mono text-[11px]">{m.invited_email}</span>
                            <span className="text-neutral-300">•</span>
                            <span>Sent {sentDate} {relativeSent ? `(${relativeSent})` : ""}</span>
                            {resentDate && (
                              <>
                                <span className="text-neutral-300">•</span>
                                <span className="text-violet-700 font-medium">Resent {resentDate}</span>
                              </>
                            )}
                            {m.inviter?.full_name && (
                              <>
                                <span className="text-neutral-300">•</span>
                                <span className="text-neutral-400">By {m.inviter.full_name}</span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-neutral-400 font-mono text-[11px]">{m.invited_email}</span>
                            {m.joined_at && (
                              <>
                                <span className="text-neutral-300">•</span>
                                <span className="text-neutral-400">Joined {formatDate(m.joined_at)}</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                    {/* Quick Action Buttons for Pending Invites */}
                    {isPending && canManage && (
                      <div className="flex items-center gap-1.5">
                        {/* Resend Button */}
                        <button
                          onClick={() => handleResend(m)}
                          disabled={isResending || isRevoking}
                          title="Resend invitation email"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin text-violet-600" : ""}`} />
                          <span>{isResending ? "Sending..." : "Resend Email"}</span>
                        </button>

                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopyLink(m)}
                          title="Copy direct join link to clipboard"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        {/* View History / Info Button */}
                        <button
                          onClick={() => setSelectedInviteModal(m)}
                          title="View invite email history & details"
                          className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Standard Action Dropdown Menu */}
                    <ActionMenu
                      member={m}
                      orgSlug={orgSlug}
                      orgName={orgName}
                      userRole={userRole}
                      currentUserId={currentUserId}
                      onResend={() => handleResend(m)}
                      onCopyLink={() => handleCopyLink(m)}
                      onCancelInvite={() => handleCancel(m)}
                      onViewDetails={() => setSelectedInviteModal(m)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite History & Details Modal */}
      {selectedInviteModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => e.target === e.currentTarget && setSelectedInviteModal(null)}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-neutral-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Invitation History</h3>
                  <p className="text-[11px] text-neutral-500">Email dispatch records & direct access</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInviteModal(null)}
                className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2.5">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Recipient Email ID</p>
                  <p className="text-sm font-mono font-semibold text-neutral-900 mt-0.5">{selectedInviteModal.invited_email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Assigned Role</p>
                  <p className="text-xs font-semibold text-violet-700 mt-0.5">
                    {ROLE_BADGE[selectedInviteModal.role]?.label || selectedInviteModal.role}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">First Sent</p>
                  <p className="text-xs text-neutral-700 mt-0.5">
                    {formatDate(selectedInviteModal.created_at)}
                  </p>
                </div>
                {selectedInviteModal.updated_at && selectedInviteModal.updated_at !== selectedInviteModal.created_at && (
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Last Resent</p>
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {formatDate(selectedInviteModal.updated_at)}
                    </p>
                  </div>
                )}
                {selectedInviteModal.inviter?.full_name && (
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Invited By</p>
                    <p className="text-xs text-neutral-700 mt-0.5">
                      {selectedInviteModal.inviter.full_name} {selectedInviteModal.inviter.email ? `(${selectedInviteModal.inviter.email})` : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Link Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center justify-between">
                  <span>One-Click Join Link</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Safe to share via chat/email</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getInviteUrl(selectedInviteModal.invite_token)}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-600 select-all"
                  />
                  <button
                    onClick={() => handleCopyLink(selectedInviteModal)}
                    className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-colors shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Tips for deliverability */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Email Delivery Troubleshooting
                </p>
                <p className="text-amber-800 leading-relaxed">
                  If the recipient hasn't received the email within 2 minutes:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                  <li>Ask them to check their <strong>Spam / Junk</strong> folder.</li>
                  <li>Click <strong>Resend Email</strong> to trigger a fresh dispatch.</li>
                  <li>Or copy and send the <strong>One-Click Join Link</strong> directly via WhatsApp or Slack.</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleResend(selectedInviteModal)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend Invite Email
                </button>
                <button
                  onClick={() => setSelectedInviteModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionMenu({
  member,
  orgSlug,
  orgName,
  userRole,
  currentUserId,
  onResend,
  onCopyLink,
  onCancelInvite,
  onViewDetails,
}: {
  member: MemberRow;
  orgSlug: string;
  orgName: string;
  userRole: OrgRole;
  currentUserId: string;
  onResend: () => void;
  onCopyLink: () => void;
  onCancelInvite: () => void;
  onViewDetails: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPending = member.status === "pending";
  const canManage =
    (userRole === "owner" || userRole === "admin") &&
    member.role !== "owner" &&
    member.user_id !== currentUserId;

  if (!canManage) return null;

  async function handleRoleChange(newRole: OrgRole) {
    setLoading(true);
    setOpen(false);
    await updateMemberRole(member.id, orgSlug, newRole);
    setLoading(false);
  }

  async function handleRemove() {
    setLoading(true);
    setOpen(false);
    await removeMember(member.id, orgSlug);
    setLoading(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        title="More actions"
        className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-40"
      >
        <MoreHorizontal className="w-4 h-4 text-neutral-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 bg-white border border-neutral-200 rounded-2xl shadow-xl py-1.5 w-52 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {isPending ? (
              <>
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-3 py-1.5">
                  Invitation Actions
                </p>
                <button
                  onClick={() => {
                    setOpen(false);
                    onResend();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-violet-600" />
                  Resend Invite Email
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    onCopyLink();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  Copy Join Link
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    onViewDetails();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  View Email History
                </button>

                <div className="border-t border-neutral-100 my-1" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-3 py-1.5">
                  Change Role
                </p>
                {ASSIGNABLE_ROLES.filter((r) => r.value !== member.role).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleRoleChange(value)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 text-neutral-400" />
                    {label}
                  </button>
                ))}

                <div className="border-t border-neutral-100 my-1" />
                <button
                  onClick={() => {
                    setOpen(false);
                    onCancelInvite();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Revoke Invitation
                </button>
              </>
            ) : (
              <>
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-3 py-1.5">
                  Change role
                </p>
                {ASSIGNABLE_ROLES.filter((r) => r.value !== member.role).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleRoleChange(value)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                    {label}
                  </button>
                ))}
                <div className="border-t border-neutral-100 my-1" />
                <button
                  onClick={handleRemove}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove member
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
