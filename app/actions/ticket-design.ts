"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserPlan } from "@/lib/plan";
import {
  type TicketDesignConfig,
  sanitizeTicketDesign,
} from "@/lib/pass-design";

type ActionResult = { error?: string; success?: boolean; config?: TicketDesignConfig };

/**
 * Saves ticket design configuration for an event or profile default.
 */
export async function saveTicketDesign(
  eventId: string | null,
  configInput: TicketDesignConfig
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const userPlan = await getUserPlan(supabase, user.id);
  const userCanDesign = userPlan.canUse("custom_pass_design");
  if (!userCanDesign && !eventId) {
    return {
      error: "Custom Ticket Design is exclusive to Pro and higher tier plans.",
    };
  }

  const sanitized = sanitizeTicketDesign({
    ...configInput,
    isPublished: configInput.isPublished !== false,
    updatedAt: new Date().toISOString(),
  });

  if (eventId) {
    // Verify event ownership or org role
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("id, organizer_id, organization_id")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return { error: "Event not found or access denied." };
    }

    if (!userCanDesign && event.organizer_id) {
      const orgPlan = await getUserPlan(supabase, event.organizer_id);
      if (!orgPlan.canUse("custom_pass_design")) {
        return {
          error: "Custom Ticket Design is exclusive to Pro and higher tier plans.",
        };
      }
    }

    if (event.organizer_id !== user.id) {
      let hasAccess = false;
      if (event.organization_id) {
        const { data: orgMember } = await supabase
          .from("organization_members")
          .select("role")
          .eq("organization_id", event.organization_id)
          .eq("user_id", user.id)
          .eq("status", "active")
          .in("role", ["owner", "admin", "event_manager"])
          .maybeSingle();
        hasAccess = !!orgMember;
      }

      if (!hasAccess) {
        return { error: "You do not have permission to edit this event." };
      }
    }

    const { error: updateErr } = await supabase
      .from("events")
      .update({
        custom_pass_design: sanitized,
      })
      .eq("id", eventId);

    if (updateErr) return { error: updateErr.message };

    revalidatePath(`/event/${eventId}/pass-design`);
    revalidatePath(`/event/${eventId}`);
    revalidatePath("/pass/[passId]", "page");
  } else {
    // Save to organizer profile
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({
        custom_pass_design: sanitized,
        brand_color: sanitized.primaryColor,
      })
      .eq("user_id", user.id);

    if (profileErr) return { error: profileErr.message };

    revalidatePath("/dashboard/ticket-design");
    revalidatePath("/dashboard/branding");
    revalidatePath("/pass/[passId]", "page");
  }

  return { success: true, config: sanitized };
}

/**
 * Sends a test ticket email with live preview attributes to the organizer.
 */
export async function sendTestTicketEmail(
  toEmail: string,
  eventName: string,
  config: TicketDesignConfig
): Promise<{ error?: string; success?: boolean }> {
  if (!toEmail || !toEmail.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const { Resend } = await import("resend");
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.startsWith("re_your")) {
      console.log(`[test-ticket-email] RESEND_API_KEY not configured. Simulated test ticket to: ${toEmail}`);
      return { success: true };
    }

    const resend = new Resend(apiKey);
    const from = process.env.EMAIL_FROM || "URPASS <noreply@urpass.space>";

    const isDark = config.template === "dark";
    const radius = config.shape === "rounded" ? "28px" : config.shape === "compact" ? "12px" : "18px";
    const logoHtml = config.logoUrl
      ? `<img src="${config.logoUrl}" alt="Logo" style="max-height: 36px; max-width: 140px; margin: 0 auto 12px; display: block; object-fit: contain;" />`
      : `<div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: ${config.primaryColor}; text-transform: uppercase; margin-bottom: 12px;">URPASS</div>`;
    const customMsgHtml = config.customMessage
      ? `<div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #e5e7eb; font-size: 11px; font-style: italic; color: #6b7280;">&ldquo;${config.customMessage}&rdquo;</div>`
      : "";

    await resend.emails.send({
      from,
      to: toEmail,
      subject: `[TEST TICKET] Your entry pass for ${eventName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
          <div style="max-width: 360px; margin: 0 auto; background: ${isDark ? '#121216' : '#ffffff'}; color: ${isDark ? '#ffffff' : '#111827'}; border-radius: ${radius}; border: 1px solid ${isDark ? '#262626' : '#e5e7eb'}; overflow: hidden; padding: 32px 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            ${logoHtml}
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; text-transform: uppercase; color: ${isDark ? '#ffffff' : '#111827'};">
              ${eventName}
            </h2>
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 16px;">
              24 OCT 2026 | 10:00 AM
            </p>
            <div style="background: ${isDark ? '#1e1e24' : '#f3f4f6'}; border-radius: 12px; padding: 24px; margin: 16px 0; font-size: 12px; color: #9ca3af; font-family: monospace;">
              [ QR CODE - SAMPLE TICKET ]
            </div>
            <p style="font-size: 16px; font-weight: 700; margin: 12px 0 4px; color: ${isDark ? '#ffffff' : '#111827'};">
              Haarishmitha
            </p>
            <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: ${config.primaryColor}15; color: ${config.primaryColor}; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
              VIP PASS
            </div>
            <div style="border-top: 1px solid ${isDark ? '#262626' : '#e5e7eb'}; margin-top: 16px; padding-top: 12px; font-size: 10px; font-family: monospace; color: #9ca3af;">
              TICKET ID: #URP-02891
            </div>
            ${customMsgHtml}
          </div>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 20px;">
            This is a test ticket email sent from Urpass Ticket Studio.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send test ticket email:", err);
    return { error: "Failed to dispatch test email. Please check email address." };
  }
}
