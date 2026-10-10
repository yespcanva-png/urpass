"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { inviteMemberSchema, normalizeOrgRoleForStorage } from "@/lib/validations/organization";
import { sendOrgInviteEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrgRole } from "@/types";
import {
  canChangeOrgMemberRole,
  canRemoveOrgMember,
  hasOrgPermission,
  isAssignableOrgRole,
} from "@/lib/authorization";

export type ActionResult = { error?: string; success?: boolean; inviteUrl?: string } | undefined;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getEffectiveAdminClient(fallbackClient: any) {
  try {
    const admin = adminClient();
    return (admin as unknown) ? admin : fallbackClient;
  } catch {
    return fallbackClient;
  }
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeEmail(email: string | null | undefined) {
  return (email ?? "").trim().toLowerCase();
}

async function getCallerOrgRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  orgId: string,
  userId: string
) {
  const { data: member } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  return member?.role as OrgRole | undefined;
}

export async function inviteMember(
  orgId: string,
  orgSlug: string,
  orgName: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    email: formData.get("email") as string,
    role: formData.get("role") as string,
  };

  const parsed = inviteMemberSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { role } = parsed.data;
  const email = normalizeEmail(parsed.data.email);

  const callerRole = await getCallerOrgRole(supabase, orgId, user.id);
  if (!hasOrgPermission(callerRole, "inviteMembers")) {
    return { error: "Only organization owners and admins can invite members." };
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("slug, name")
    .eq("id", orgId)
    .maybeSingle();
  const resolvedOrgSlug = (org?.slug as string | undefined) ?? orgSlug;
  const resolvedOrgName = (org?.name as string | undefined) ?? orgName;

  // Check if already a member or pending invite
  const { data: existingMember } = await supabase
    .from("organization_members")
    .select("id, status, role")
    .eq("organization_id", orgId)
    .eq("invited_email", email)
    .maybeSingle();

  if (existingMember) {
    if (existingMember.status === "active") {
      return { error: "This email belongs to an active member of this organization." };
    }
    if (existingMember.status === "pending") {
      // Re-issue a fresh token and resend invite email instead of blocking
      const token = generateToken();
      const admin = getEffectiveAdminClient(supabase);
      const { error: updateError } = await admin
        .from("organization_members")
        .update({
          role,
          invite_token: token,
          invited_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingMember.id);

      if (updateError) return { error: updateError.message };

      const inviteUrl = `${APP_URL}/org/${resolvedOrgSlug}/join?token=${token}`;

      const { data: inviterProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      let emailError: string | null = null;
      try {
        await sendOrgInviteEmail({
          to: email,
          inviterName: inviterProfile?.full_name ?? "Someone",
          orgName: resolvedOrgName,
          role,
          inviteUrl,
        });
      } catch (err) {
        console.error("[org-members] Failed to send invite email (renew):", err);
        emailError = err instanceof Error ? err.message : String(err);
      }

      revalidatePath(`/org/${resolvedOrgSlug}/members`);

      if (emailError) {
        return {
          error: `Invitation renewed, but email delivery failed (${emailError}). Direct invite link: ${inviteUrl}`,
        };
      }

      return undefined;
    }
  }

  const token = generateToken();

  // Check if the invited email belongs to an existing user
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("email", email)
    .maybeSingle();

  const admin = getEffectiveAdminClient(supabase);
  const { error: insertError } = await admin
    .from("organization_members")
    .insert({
      organization_id: orgId,
      user_id: profile?.user_id ?? null,
      invited_email: email,
      role,
      status: "pending",
      invite_token: token,
      invited_by: user.id,
    });

  if (insertError) return { error: insertError.message };

  const inviteUrl = `${APP_URL}/org/${resolvedOrgSlug}/join?token=${token}`;

  const { data: inviterProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  let emailError: string | null = null;
  try {
    await sendOrgInviteEmail({
      to: email,
      inviterName: inviterProfile?.full_name ?? "Someone",
      orgName: resolvedOrgName,
      role,
      inviteUrl,
    });
  } catch (err) {
    console.error("[org-members] Failed to send invite email:", err);
    emailError = err instanceof Error ? err.message : String(err);
  }

  revalidatePath(`/org/${resolvedOrgSlug}/members`);

  if (emailError) {
    return {
      error: `Member invited, but email delivery failed (${emailError}). Direct invite link: ${inviteUrl}`,
    };
  }

  return undefined;
}

export async function acceptInvite(token: string): Promise<{ orgSlug: string } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };
  if (!token || token.length < 32) return { error: "Invalid or expired invite link." };

  const admin = adminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("id, organization_id, status, user_id, invited_email, organization:organizations(slug)")
    .eq("invite_token", token)
    .maybeSingle();

  if (!member) return { error: "Invalid or expired invite link." };
  const invitedEmail = normalizeEmail(member.invited_email as string | null);
  const userEmail = normalizeEmail(user.email);
  if (!userEmail || invitedEmail !== userEmail) {
    return { error: "This invite was sent to a different email address." };
  }
  if (member.user_id && member.user_id !== user.id) {
    return { error: "This invite is already linked to another account." };
  }
  if (member.status === "active") {
    const org = member.organization as unknown as { slug: string };
    return { orgSlug: org.slug };
  }

  const { error } = await admin
    .from("organization_members")
    .update({
      user_id: user.id,
      status: "active",
      invite_token: null,
      joined_at: new Date().toISOString(),
    })
    .eq("id", member.id);

  if (error) return { error: error.message };

  const org = member.organization as unknown as { slug: string };
  revalidatePath(`/org/${org.slug}`);
  return { orgSlug: org.slug };
}

export async function updateMemberRole(
  memberId: string,
  orgSlug: string,
  newRole: OrgRole
): Promise<ActionResult> {
  if (!isAssignableOrgRole(newRole)) return { error: "Invalid member role." };
  const storageRole = normalizeOrgRoleForStorage(newRole) as OrgRole;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: target } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("id", memberId)
    .maybeSingle();

  if (!target) return { error: "Member not found." };
  // Verify caller is owner or admin in this organization
  const callerRole = await getCallerOrgRole(supabase, target.organization_id, user.id);
  if (!canChangeOrgMemberRole(callerRole, target.role)) {
    if (target.role === "owner") return { error: "Cannot change the owner's role." };
    return { error: "Only organization owners and admins can update member roles." };
  }

  const { error } = await supabase
    .from("organization_members")
    .update({ role: storageRole })
    .eq("id", memberId);

  if (error) return { error: error.message };

  revalidatePath(`/org/${orgSlug}/members`);
}

export async function removeMember(memberId: string, orgSlug: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: target } = await supabase
    .from("organization_members")
    .select("organization_id, role, user_id")
    .eq("id", memberId)
    .maybeSingle();

  if (!target) return { error: "Member not found." };
  // Allow self-removal (leaving org) or removal by owner/admin
  const isSelf = target.user_id === user.id;
  const callerRole = isSelf ? undefined : await getCallerOrgRole(supabase, target.organization_id, user.id);
  if (!canRemoveOrgMember(callerRole, target.role, isSelf)) {
    if (target.role === "owner") return { error: "Cannot remove the organization owner." };
    return { error: "Only organization owners and admins can remove members." };
  }

  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("id", memberId);

  if (error) return { error: error.message };

  revalidatePath(`/org/${orgSlug}/members`);
}

export async function cancelInvite(
  memberId: string,
  orgSlug: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: target } = await supabase
    .from("organization_members")
    .select("organization_id, status")
    .eq("id", memberId)
    .maybeSingle();

  if (!target) return { error: "Invitation not found." };
  if (target.status !== "pending") return { error: "Only pending invitations can be cancelled." };

  const callerRole = await getCallerOrgRole(supabase, target.organization_id, user.id);
  if (!hasOrgPermission(callerRole, "manageMembers") && !hasOrgPermission(callerRole, "inviteMembers")) {
    return { error: "Only organization owners and admins can cancel invitations." };
  }

  const client = getEffectiveAdminClient(supabase);
  const { error } = await client
    .from("organization_members")
    .delete()
    .eq("id", memberId)
    .eq("status", "pending");

  if (error) return { error: error.message };

  revalidatePath(`/org/${orgSlug}/members`);
  return undefined;
}

export async function resendInvite(
  memberId: string,
  orgSlug: string,
  orgName?: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: target } = await supabase
    .from("organization_members")
    .select("id, organization_id, invited_email, role, status")
    .eq("id", memberId)
    .maybeSingle();

  if (!target) return { error: "Invitation not found." };
  if (target.status !== "pending") return { error: "Can only resend pending invitations." };

  const callerRole = await getCallerOrgRole(supabase, target.organization_id, user.id);
  if (!hasOrgPermission(callerRole, "manageMembers") && !hasOrgPermission(callerRole, "inviteMembers")) {
    return { error: "Only organization owners and admins can resend invitations." };
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("name, slug")
    .eq("id", target.organization_id)
    .maybeSingle();
  const resolvedOrgName = (org?.name as string | undefined) ?? orgName ?? "the organization";
  const resolvedOrgSlug = (org?.slug as string | undefined) ?? orgSlug;

  const freshToken = generateToken();
  const admin = getEffectiveAdminClient(supabase);
  const now = new Date().toISOString();
  const { error: updateError } = await admin
    .from("organization_members")
    .update({ 
      invite_token: freshToken,
      invited_by: user.id,
      updated_at: now,
    })
    .eq("id", memberId);

  if (updateError) return { error: updateError.message };

  const inviteUrl = `${APP_URL}/org/${resolvedOrgSlug}/join?token=${freshToken}`;
  const { data: inviterProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  let emailError: string | null = null;
  try {
    await sendOrgInviteEmail({
      to: target.invited_email,
      inviterName: inviterProfile?.full_name ?? "Someone",
      orgName: resolvedOrgName,
      role: target.role,
      inviteUrl,
    });
  } catch (err) {
    console.error("[org-members] Failed to send invite email in resendInvite:", err);
    emailError = err instanceof Error ? err.message : String(err);
  }

  revalidatePath(`/org/${resolvedOrgSlug}/members`);

  if (emailError) {
    return {
      error: `Failed to deliver email (${emailError}). Fresh invite link: ${inviteUrl}`,
      inviteUrl,
    };
  }

  return { success: true, inviteUrl };
}

export async function getOrgMembers(orgId: string) {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("organization_members")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (!members || members.length === 0) return [];

  // Fetch profiles for members who have accepted (user_id is set) AND inviters (invited_by is set)
  const userIds = members.map((m) => m.user_id).filter(Boolean) as string[];
  const inviterIds = members.map((m) => m.invited_by).filter(Boolean) as string[];
  const allUserIds = Array.from(new Set([...userIds, ...inviterIds]));

  const { data: profiles } = allUserIds.length > 0
    ? await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, email")
        .in("user_id", allUserIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));

  return members.map((m) => ({
    ...m,
    profile: m.user_id ? profileMap.get(m.user_id) ?? null : null,
    inviter: m.invited_by ? profileMap.get(m.invited_by) ?? null : null,
  }));
}

export async function assignEventToMember(
  eventId: string,
  memberId: string,
  orgSlug: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("organization_id")
    .eq("id", eventId)
    .maybeSingle();
  if (!event?.organization_id) return { error: "Event not found." };

  const { data: target } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("id", memberId)
    .eq("status", "active")
    .maybeSingle();
  if (!target || target.organization_id !== event.organization_id) {
    return { error: "Member does not belong to this event's organization." };
  }

  const callerRole = await getCallerOrgRole(supabase, event.organization_id, user.id);
  if (!hasOrgPermission(callerRole, "manageMembers")) {
    return { error: "Only organization owners and admins can assign events." };
  }

  const { error } = await supabase
    .from("event_assignments")
    .insert({ event_id: eventId, member_id: memberId });

  if (error && error.code !== "23505") return { error: error.message };

  revalidatePath(`/org/${orgSlug}/members`);
}

export async function unassignEventFromMember(
  eventId: string,
  memberId: string,
  orgSlug: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("organization_id")
    .eq("id", eventId)
    .maybeSingle();
  if (!event?.organization_id) return { error: "Event not found." };

  const { data: target } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("id", memberId)
    .maybeSingle();
  if (!target || target.organization_id !== event.organization_id) {
    return { error: "Member does not belong to this event's organization." };
  }

  const callerRole = await getCallerOrgRole(supabase, event.organization_id, user.id);
  if (!hasOrgPermission(callerRole, "manageMembers")) {
    return { error: "Only organization owners and admins can unassign events." };
  }

  const { error } = await supabase
    .from("event_assignments")
    .delete()
    .eq("event_id", eventId)
    .eq("member_id", memberId);

  if (error) return { error: error.message };

  revalidatePath(`/org/${orgSlug}/members`);
}
