"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserPlan } from "@/lib/plan";
import {
  type CustomPassDesign,
  sanitizePassDesign,
} from "@/lib/pass-design";

type ActionResult = { error?: string; success?: boolean; design?: CustomPassDesign | null };

/**
 * Updates the organizer's default pass design stored on their profile.
 * Restricted to Pro, Business, Campus, and Enterprise tier users.
 */
export async function updateProfilePassDesign(
  designInput: CustomPassDesign
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getUserPlan(supabase, user.id);
  if (!plan.canUse("custom_pass_design")) {
    return {
      error: "Custom Pass Design is an exclusive Pro feature. Please upgrade to unlock.",
    };
  }

  const sanitized = sanitizePassDesign(designInput);

  const { error } = await supabase
    .from("profiles")
    .update({
      custom_pass_design: sanitized,
      brand_color: sanitized.primaryColor,
    })
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/branding");
  revalidatePath("/dashboard/settings");
  revalidatePath("/event/[eventId]/pass-design", "page");

  return { success: true, design: sanitized };
}

/**
 * Updates pass design for a specific event.
 * If inheritFromOrg is true, custom_pass_design is set to null, falling back to org default.
 */
export async function updateEventPassDesign(
  eventId: string,
  designInput: CustomPassDesign | null,
  inheritFromOrg: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getUserPlan(supabase, user.id);
  if (!plan.canUse("custom_pass_design")) {
    return {
      error: "Custom Pass Design is an exclusive Pro feature. Please upgrade to unlock.",
    };
  }

  // Ensure user owns or organizes this event
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("id, organizer_id")
    .eq("id", eventId)
    .single();

  if (eventErr || !event) {
    return { error: "Event not found or access denied." };
  }

  if (event.organizer_id !== user.id) {
    // Check if user is owner/admin of the organization owning this event
    const { data: orgMember } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin"])
      .maybeSingle();

    if (!orgMember) {
      return { error: "You do not have permission to modify this event." };
    }
  }

  const valueToSave = inheritFromOrg || !designInput ? null : sanitizePassDesign(designInput);

  const { error: updateErr } = await supabase
    .from("events")
    .update({
      custom_pass_design: valueToSave,
    })
    .eq("id", eventId);

  if (updateErr) {
    return { error: updateErr.message };
  }

  revalidatePath(`/event/${eventId}/pass-design`);
  revalidatePath(`/event/${eventId}/settings`);
  revalidatePath(`/event/${eventId}`);
  revalidatePath("/pass/[passId]", "page");

  return { success: true, design: valueToSave };
}
