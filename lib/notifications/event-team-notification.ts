import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { notifyEventTeamNewApplication, getOwnerEmail } from "@/lib/email";

function getAdminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isUUID(val?: string | null): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

async function withTimeout<T>(promise: Promise<T>, ms = 2000): Promise<T | null> {
  try {
    let timerId: NodeJS.Timeout;
    const timeoutPromise = new Promise<null>((resolve) => {
      timerId = setTimeout(() => resolve(null), ms);
    });
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timerId!);
    return result;
  } catch {
    return null;
  }
}

export interface EventTeamNotificationPayload {
  eventId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  organizerId: string;
  organizationId?: string | null;
  attendeeId?: string | null;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string | null;
  passType?: string | null;
  ticketTierName?: string | null;
  ticketPricePaise?: number | null;
  status: "approved" | "pending" | "waitlisted";
  customResponses?: Record<string, unknown> | null;
  customFields?: Array<{ id: string; label: string; type?: string }> | null;
}

/**
 * Resolves the event organizer and team members, inserts in-app notifications,
 * and sends email notifications to the entire event team.
 */
export async function notifyEventTeamOnApplication(
  payload: EventTeamNotificationPayload
): Promise<{ success: boolean; recipientCount: number }> {
  const admin = getAdminClient();
  const teamEmails = new Set<string>();
  const teamUserIds = new Set<string>();

  // 1. Add primary organizer ID
  if (payload.organizerId) {
    teamUserIds.add(payload.organizerId);
  }

  // 2. Resolve primary organizer's email
  if (payload.organizerId && isUUID(payload.organizerId) && typeof admin.auth?.admin?.getUserById === "function") {
    try {
      const userRes = await withTimeout(admin.auth.admin.getUserById(payload.organizerId), 1500);
      if (userRes && userRes.data?.user?.email) {
        teamEmails.add(userRes.data.user.email);
      }
    } catch (err) {
      console.warn("[event-team-notification] Could not fetch organizer user email via auth.admin:", err);
    }
  }

  // 3. Resolve Organization members if event belongs to an organization
  if (payload.organizationId && isUUID(payload.organizationId)) {
    try {
      const membersQuery = admin
        .from("organization_members")
        .select("user_id, invited_email, role, status")
        .eq("organization_id", payload.organizationId)
        .eq("status", "active")
        .in("role", ["owner", "admin", "event_manager"]);

      const membersRes = await withTimeout(Promise.resolve(membersQuery), 1500);
      if (membersRes && membersRes.data && Array.isArray(membersRes.data)) {
        for (const m of membersRes.data) {
          if (m.invited_email) teamEmails.add(m.invited_email);
          if (m.user_id) teamUserIds.add(m.user_id);
        }
      }
    } catch (err) {
      console.warn("[event-team-notification] Could not fetch organization members:", err);
    }
  }

  // 4. Resolve direct event assignments for specific event managers
  if (payload.eventId && isUUID(payload.eventId)) {
    try {
      const assignmentsQuery = admin
        .from("event_assignments")
        .select("member:organization_members(user_id, invited_email, status)")
        .eq("event_id", payload.eventId);

      const assignmentsRes = await withTimeout(Promise.resolve(assignmentsQuery), 1500);
      if (assignmentsRes && assignmentsRes.data && Array.isArray(assignmentsRes.data)) {
        for (const a of assignmentsRes.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const member = (a as any).member;
          if (member && member.status === "active") {
            if (member.invited_email) teamEmails.add(member.invited_email);
            if (member.user_id) teamUserIds.add(member.user_id);
          }
        }
      }
    } catch {
      // event_assignments table optional query fallback
    }
  }

  // Fallback if no email could be resolved
  if (teamEmails.size === 0) {
    let fallbackOwner = "srinithin@yespstudio.com";
    try {
      if (typeof getOwnerEmail === "function") {
        fallbackOwner = getOwnerEmail() || fallbackOwner;
      } else if (process.env.OWNER_EMAIL) {
        fallbackOwner = process.env.OWNER_EMAIL;
      }
    } catch {
      // safe fallback
    }
    if (fallbackOwner) {
      teamEmails.add(fallbackOwner);
    }
  }

  const recipientList = Array.from(teamEmails);

  // 5. Insert In-App Notifications for all resolved team user IDs
  const notifTitle =
    payload.status === "approved"
      ? `New Registration: ${payload.attendeeName}`
      : payload.status === "waitlisted"
      ? `New Waitlist Entry: ${payload.attendeeName}`
      : `New Application to Review: ${payload.attendeeName}`;

  const tierLabel = payload.ticketTierName || payload.passType || "Participant";
  const notifMessage = `${payload.attendeeName} (${payload.attendeeEmail}) registered for "${payload.eventName}" [${tierLabel} · ${payload.status.toUpperCase()}].`;

  for (const userId of Array.from(teamUserIds)) {
    if (isUUID(userId)) {
      try {
        const insertPromise = admin.from("organizer_notifications").insert({
          user_id: userId,
          event_id: payload.eventId,
          title: notifTitle,
          message: notifMessage,
          type: "registration",
          link: `/event/${payload.eventId}/attendees`,
          is_read: false,
        });
        await withTimeout(Promise.resolve(insertPromise), 1000);
      } catch (err) {
        console.warn(`[event-team-notification] Could not insert in-app notification for user ${userId}:`, err);
      }
    }
  }

  // 6. Dispatch email notification to all team emails
  try {
    if (typeof notifyEventTeamNewApplication === "function") {
      await notifyEventTeamNewApplication({
        teamEmails: recipientList,
        eventName: payload.eventName,
        eventDate: payload.eventDate,
        venue: payload.venue,
        attendeeName: payload.attendeeName,
        attendeeEmail: payload.attendeeEmail,
        attendeePhone: payload.attendeePhone,
        passType: payload.passType,
        ticketTierName: payload.ticketTierName,
        ticketPricePaise: payload.ticketPricePaise,
        status: payload.status,
        customResponses: payload.customResponses,
        customFields: payload.customFields,
        eventId: payload.eventId,
      });
    }
  } catch (err) {
    console.error("[event-team-notification] Email dispatch error:", err);
  }

  return { success: true, recipientCount: recipientList.length };
}
