"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Mail, ShieldCheck, KeyRound } from "lucide-react";
import { inviteMember } from "@/app/actions/org-members";
import { BUILT_IN_ROLES } from "@/lib/rbac/roles";

const ROLES = [
  { value: "admin",                label: "Admin",                 badge: "All Features", desc: "Full organization operations, team roster & event control" },
  { value: "event_manager",        label: "Event Manager",         badge: "Core Ops",      desc: "Manage assigned events, schedule, venues, branding & tickets" },
  { value: "gate_manager",         label: "Gate Manager",          badge: "Gate Control",  desc: "Manage physical checkpoints, monitor scanner teams & supervisor overrides" },
  { value: "checkin_staff",        label: "Check-in Staff",        badge: "Scanner",       desc: "Scan QR passes, verify badge entry and record room attendance" },
  { value: "finance",              label: "Finance",               badge: "Billing",       desc: "Direct Razorpay/PayU configurations, invoices, payouts & fee audits" },
  { value: "viewer",               label: "Viewer",                badge: "Read-Only",     desc: "Read-only access to high-level organization status" },
  { value: "member",               label: "General Member",        badge: "Basic",         desc: "Basic member collaborator workspace access" },
] as const;

const inputCls =
  "border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all w-full bg-white placeholder:text-neutral-400";

interface Props {
  orgId: string;
  orgSlug: string;
  orgName: string;
  initialRole?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteMemberModal({ orgId, orgSlug, orgName, initialRole = "event_manager", onClose, onSuccess }: Props) {
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await inviteMember(orgId, orgSlug, orgName, fd);
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    onSuccess();
    onClose();
  }

  const roleMeta = BUILT_IN_ROLES[selectedRole];
  const permissionCount = roleMeta?.permissions?.length || 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-neutral-100 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/10 text-violet-600 border border-violet-200/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Invite Team Member</h2>
              <p className="text-[11px] text-neutral-500 font-medium">Assign access control and role-based permissions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5 flex items-center justify-between">
              <span>Recipient Email</span>
              <span className="text-[10px] text-neutral-400 font-normal">Will receive secure one-click join link</span>
            </label>
            <div className="relative">
              <input
                ref={emailRef}
                name="email"
                type="email"
                placeholder="colleague@yourcompany.com"
                className={inputCls}
                required
              />
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-700">Access Control Role</label>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                {permissionCount} granular permissions included
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-neutral-200/80 rounded-2xl p-2 bg-neutral-50/50">
              {ROLES.map(({ value, label, badge, desc }) => {
                const isSelected = selectedRole === value;
                return (
                  <label
                    key={value}
                    onClick={() => setSelectedRole(value)}
                    className={`flex items-start justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-white border-violet-500 shadow-2xs ring-1 ring-violet-500/20"
                        : "bg-white/60 border-neutral-200/60 hover:bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        checked={isSelected}
                        onChange={() => setSelectedRole(value)}
                        className="mt-0.5 accent-violet-600 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-bold text-neutral-900">{label}</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-neutral-100 text-neutral-600 uppercase tracking-wider">
                            {badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">{desc}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Selected Role Live Permissions Summary */}
          {roleMeta && (
            <div className="bg-violet-50/60 border border-violet-200/60 rounded-2xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-violet-950 font-bold text-xs">
                <KeyRound className="w-3.5 h-3.5 text-violet-600" />
                <span>Selected Role: {roleMeta.name}</span>
              </div>
              <p className="text-[11px] text-violet-800/80 leading-relaxed">
                {roleMeta.description}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {roleMeta.permissions.slice(0, 6).map((perm) => (
                  <span key={perm} className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-md bg-white border border-violet-200 text-violet-700">
                    {perm}
                  </span>
                ))}
                {roleMeta.permissions.length > 6 && (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-violet-100 text-violet-700">
                    +{roleMeta.permissions.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {error && (() => {
            const linkMatch = error.match(/(https?:\/\/[^\s]+)/);
            const fallbackLink = linkMatch ? linkMatch[1] : null;
            const cleanError = fallbackLink ? error.replace(fallbackLink, "").replace(/Direct invite link:\s*/i, "").trim() : error;

            return (
              <div className="space-y-2">
                <p className={`text-xs rounded-xl px-4 py-3 font-medium border ${
                  fallbackLink ? "text-amber-800 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200"
                }`}>
                  {cleanError}
                </p>
                {fallbackLink && (
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1.5">
                    <p className="text-[11px] font-bold text-neutral-700">One-Click Join Link:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={fallbackLink}
                        className="flex-1 px-3 py-1.5 text-xs font-mono bg-white border border-neutral-200 rounded-xl text-neutral-700 select-all"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(fallbackLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-3.5 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-colors shadow-xs"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-95 transition-all shadow-md active:scale-95"
              style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" }}
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Send Invite with Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
