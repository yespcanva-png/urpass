"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Check,
  Copy,
  Plus,
  Lock,
  Sparkles,
  Layers,
  Users,
  KeyRound,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  ALL_PERMISSIONS,
  PERMISSION_CATEGORIES,
  type PermissionCategory,
  type UrPassPermission,
} from "@/lib/rbac/permissions";
import {
  BUILT_IN_ROLES,
  getRolePermissions,
} from "@/lib/rbac/roles";
import InviteMemberModal from "@/components/org/InviteMemberModal";

export default function RbacPermissionEditor({
  orgId,
  orgSlug,
  orgName,
  userRole,
}: {
  orgId?: string;
  orgSlug?: string;
  orgName?: string;
  userRole?: string;
}) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("gate_staff");
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState("");

  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";
  const activeRole = BUILT_IN_ROLES[selectedRoleId] || BUILT_IN_ROLES.gate_staff;
  const effectivePermissions: UrPassPermission[] = [...activeRole.permissions];

  const handleCopyConfig = () => {
    const payload = {
      roleId: selectedRoleId,
      roleName: activeRole.name,
      description: activeRole.description,
      permissionsCount: effectivePermissions.length,
      permissions: effectivePermissions,
      exportedAt: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const categories = Object.keys(PERMISSION_CATEGORIES) as PermissionCategory[];

  return (
    <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              Role Permissions Matrix
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Enterprise RBAC system policy · Built-in permissions for organization team members
          </p>
        </div>

        <div className="flex items-center gap-2">
          {orgId && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs"
              style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Invite with Role</span>
            </button>
          )}
          <button
            onClick={handleCopyConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied JSON" : "Copy role config"}</span>
          </button>
        </div>
      </div>

      {inviteSuccessMsg && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{inviteSuccessMsg}</span>
          </div>
          <button onClick={() => setInviteSuccessMsg("")} className="text-emerald-600 hover:text-emerald-900 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Role Selection Dropdown & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
        <div className="flex items-center gap-3">
          <label htmlFor="role-select" className="text-xs font-bold text-neutral-700 whitespace-nowrap">
            Select role:
          </label>
          <div className="relative">
            <select
              id="role-select"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="appearance-none bg-white border border-neutral-300 rounded-xl px-3.5 py-2 pr-9 text-xs font-bold text-neutral-900 shadow-2xs outline-none focus:border-violet-500 cursor-pointer"
            >
              {Object.values(BUILT_IN_ROLES).filter((r) => r.id !== "super_admin").map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-800">
            {effectivePermissions.length} permissions assigned
          </span>
          {orgId && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="text-xs font-bold px-3 py-1 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100 transition-colors shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Assign {activeRole.name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Description Note */}
      <p className="text-xs text-neutral-600 bg-violet-50/60 border border-violet-100 rounded-xl p-3">
        <strong className="text-violet-950 font-semibold">{activeRole.name}:</strong>{" "}
        {activeRole.description}
      </p>

      {/* Permission Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((catKey) => {
          const categoryMeta = PERMISSION_CATEGORIES[catKey];
          const catPermissions = ALL_PERMISSIONS.filter(
            (p) => p.category === catKey && p.id !== "platform.manage_system"
          );

          return (
            <div
              key={catKey}
              className="rounded-2xl border border-neutral-200/90 p-4 space-y-3 bg-white hover:border-neutral-300 transition-colors"
            >
              <div className="pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  {categoryMeta.label}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {categoryMeta.description}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {catPermissions.map((p) => {
                  const isChecked =
                    selectedRoleId === "owner" || effectivePermissions.includes(p.id);

                  return (
                    <div
                      key={p.id}
                      className="flex items-start gap-2.5 p-2 rounded-xl transition-colors hover:bg-neutral-50/80"
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center text-[10px]">
                            -
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${isChecked ? "text-neutral-900" : "text-neutral-400"}`}>
                            {p.label}
                          </span>
                          {p.requiredFeature && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-100 text-neutral-500">
                              optional module
                            </span>
                          )}
                          <span
                            className={`ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              isChecked
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-neutral-50 text-neutral-400 border border-neutral-200/40"
                            }`}
                          >
                            {isChecked ? "Granted" : "Restricted"}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-100 gap-2">
        <span>Security policy: Built-in role permissions are managed according to platform security standards.</span>
        <span className="font-mono text-[10px]">UrPass RBAC System</span>
      </div>

      {showInviteModal && orgId && (
        <InviteMemberModal
          orgId={orgId}
          orgSlug={orgSlug || "org"}
          orgName={orgName || "Organization"}
          initialRole={selectedRoleId}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            setInviteSuccessMsg(`Invitation sent successfully with ${activeRole.name} permissions.`);
          }}
        />
      )}
    </div>
  );
}
