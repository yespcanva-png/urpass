"use client";

import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import MemberTable from "@/components/org/MemberTable";
import InviteMemberModal from "@/components/org/InviteMemberModal";
import type { Organization, OrganizationMember, OrgRole } from "@/types";

import RbacPermissionEditor from "@/components/org/RbacPermissionEditor";

interface Props {
  org: Organization;
  orgSlug: string;
  userRole: OrgRole;
  members: OrganizationMember[];
  currentUserId: string;
}

export default function MembersClient({ org, orgSlug, userRole, members, currentUserId }: Props) {
  const [showInvite, setShowInvite] = useState(false);
  const canInvite = userRole === "owner" || userRole === "admin";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
              Team members · {members.filter((m) => m.status === "active").length} active
              {members.filter((m) => m.status === "pending").length > 0 && (
                <span className="text-amber-600 font-semibold ml-2">
                  · {members.filter((m) => m.status === "pending").length} pending invite{members.filter((m) => m.status === "pending").length > 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          {canInvite && (
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-xs"
              style={{ background: "#6D28D9" }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Invite member
            </button>
          )}
        </div>

        <MemberTable
          members={members as Parameters<typeof MemberTable>[0]["members"]}
          orgSlug={orgSlug}
          orgName={org.name}
          userRole={userRole}
          currentUserId={currentUserId}
        />
      </div>

      {/* Role-Based Access Control (RBAC) Settings & Permission Matrix */}
      <RbacPermissionEditor orgId={org.id} userRole={userRole} />

      {showInvite && (
        <InviteMemberModal
          orgId={org.id}
          orgSlug={orgSlug}
          orgName={org.name}
          onClose={() => setShowInvite(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
