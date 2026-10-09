import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { getUserPlan } from "@/lib/plan";

function adminClient() {
  if ((globalThis as any).__urpass_admin_client) {
    return (globalThis as any).__urpass_admin_client;
  }
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export function maskPhone(phone?: string | null): string {
  if (!phone) return "";
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return "****";
  const last4 = cleaned.slice(-4);
  const prefix = cleaned.length > 8 ? cleaned.slice(0, 3) : "";
  return `${prefix}******${last4}`;
}

export function maskEmail(email?: string | null): string {
  if (!email) return "";
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) return "***@***.com";

  const user = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  const maskedUser = user.length <= 2
    ? `${user[0]}*`
    : `${user[0]}***${user[user.length - 1]}`;

  const dotIndex = domain.lastIndexOf(".");
  let maskedDomain = domain;
  if (dotIndex > 0) {
    const domainName = domain.slice(0, dotIndex);
    const ext = domain.slice(dotIndex);
    const maskedDomainName = domainName.length <= 2
      ? `${domainName[0]}*`
      : `${domainName[0]}***${domainName[domainName.length - 1]}`;
    maskedDomain = `${maskedDomainName}${ext}`;
  }

  return `${maskedUser}@${maskedDomain}`;
}

export interface HardenedPublicPass {
  pass: {
    pass_token: string;
    pass_type: string;
    status: string;
    generated_at?: string;
    custom_ticket_id?: string | null;
  };
  attendee: {
    name: string;
    email: string;
    phone: string;
    application_status: string;
    custom_ticket_id?: string | null;
  };
  event: {
    id: string;
    name: string;
    description?: string | null;
    event_date: string;
    start_time: string;
    end_time: string;
    venue?: string | null;
    event_type: string;
    meeting_url?: string | null;
    meeting_platform?: string | null;
    organizer_id?: string | null;
    custom_pass_design?: any;
  };
  branding: {
    showBranding: boolean;
    isPro: boolean;
    orgName: string | null;
    orgLogoUrl: string | null;
    customDesign: any;
  };
  groupInfo?: {
    totalCount: number;
    isPrimary: boolean;
    primaryName: string;
    members: Array<{
      name: string;
      role: string;
      passToken?: string;
      status?: string;
    }>;
  } | null;
}

export async function getHardenedPublicPass(
  passToken: string
): Promise<HardenedPublicPass | null> {
  const admin = adminClient();

  // 1. Fetch pass by pass_token with strictly bounded columns
  const { data: pass, error: passErr } = await admin
    .from("passes")
    .select("pass_token, pass_type, status, attendee_id, event_id")
    .eq("pass_token", passToken)
    .single();

  if (passErr || !pass) return null;

  // Reject revoked or expired passes
  if (["revoked", "cancelled", "expired"].includes(pass.status?.toLowerCase())) {
    return null;
  }

  // 2. Fetch attendee & event with strictly projected columns
  const [{ data: attendee }, { data: event }] = await Promise.all([
    admin
      .from("attendees")
      .select("name, email, phone, application_status, custom_responses")
      .eq("id", pass.attendee_id)
      .single(),
    admin
      .from("events")
      .select("id, name, description, event_date, start_time, end_time, venue, event_type, meeting_url, meeting_platform, organizer_id, custom_pass_design, status")
      .eq("id", pass.event_id)
      .single(),
  ]);

  if (!attendee || !event) return null;

  // Block cancelled events from rendering active public passes
  if (event.status === "cancelled") {
    return null;
  }

  const organizerId = event.organizer_id as string | null ?? null;
  const [plan, { data: orgProfile }] = await Promise.all([
    organizerId ? getUserPlan(admin, organizerId) : Promise.resolve(null),
    organizerId
      ? admin
          .from("profiles")
          .select("org_name, brand_color, org_logo_url, hide_urpass_branding, custom_pass_design")
          .eq("user_id", organizerId)
          .single()
      : Promise.resolve({ data: null }),
  ]);

  const showBranding = !(plan?.canRemoveBranding && orgProfile?.hide_urpass_branding);
  const isPro = plan ? plan.canUse("custom_pass_design") : false;
  const rawCustomDesign = event.custom_pass_design || orgProfile?.custom_pass_design;

  // Protect online meeting URL: only disclose if approved and pass is generated/active
  const isApproved = attendee.application_status === "approved";
  const safeMeetingUrl = isApproved ? event.meeting_url : null;
  const customTicketId = (attendee.custom_responses as Record<string, any>)?.custom_ticket_id || null;

  let groupInfo: HardenedPublicPass["groupInfo"] = null;
  const customResp = (attendee.custom_responses as Record<string, any>) || {};

  if (Array.isArray(customResp.group_members) && customResp.group_members.length > 1) {
    groupInfo = {
      totalCount: customResp.group_members.length,
      isPrimary: true,
      primaryName: attendee.name,
      members: customResp.group_members.map((m: any, idx: number) => ({
        name: m.name || `Guest #${idx + 1}`,
        role: m.role || (idx === 0 ? "primary" : "member"),
        passToken: m.passToken,
        status: m.status || "active",
      })),
    };
  } else if (customResp.parent_attendee_id) {
    const { data: parentAttendee } = await admin
      .from("attendees")
      .select("name, custom_responses")
      .eq("id", customResp.parent_attendee_id)
      .single();

    if (
      parentAttendee &&
      Array.isArray((parentAttendee.custom_responses as Record<string, any>)?.group_members) &&
      (parentAttendee.custom_responses as Record<string, any>).group_members.length > 1
    ) {
      const gMembers = (parentAttendee.custom_responses as Record<string, any>).group_members;
      groupInfo = {
        totalCount: gMembers.length,
        isPrimary: false,
        primaryName: parentAttendee.name,
        members: gMembers.map((m: any, idx: number) => ({
          name: m.name || `Guest #${idx + 1}`,
          role: m.role || (idx === 0 ? "primary" : "member"),
          passToken: m.passToken,
          status: m.status || "active",
        })),
      };
    }
  }

  return {
    pass: {
      pass_token: pass.pass_token,
      pass_type: pass.pass_type || "participant",
      status: pass.status || "generated",
      custom_ticket_id: customTicketId,
    },
    attendee: {
      name: attendee.name,
      email: maskEmail(attendee.email),
      phone: maskPhone(attendee.phone),
      application_status: attendee.application_status,
      custom_ticket_id: customTicketId,
    },
    event: {
      id: event.id,
      name: event.name,
      description: event.description,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      venue: event.venue,
      event_type: event.event_type || "offline",
      meeting_url: safeMeetingUrl,
      meeting_platform: event.meeting_platform,
      organizer_id: event.organizer_id,
      custom_pass_design: rawCustomDesign,
    },
    branding: {
      showBranding,
      isPro,
      orgName: orgProfile?.org_name || null,
      orgLogoUrl: orgProfile?.org_logo_url || null,
      customDesign: rawCustomDesign,
    },
    groupInfo,
  };
}
