"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUrl } from "@/lib/supabase/config";
import type { CampusApprovalStatus } from "@/types/campus";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

type ActionResult<T = undefined> = { error?: string; data?: T };

export async function submitEventForApproval(eventId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { error } = await client
      .from("events")
      .update({
        approval_status: "pending_approval",
        submitted_for_approval_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (error) return { error: error.message };

    revalidatePath(`/event/${eventId}`);
    revalidatePath("/dashboard/campus");
    revalidatePath("/dashboard/campus/events");
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to submit event for approval" };
  }
}

export async function approveCampusEvent(eventId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    // Approve and automatically activate the event for public registration
    const { error } = await client
      .from("events")
      .update({
        approval_status: "approved",
        status: "active",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (error) return { error: error.message };

    revalidatePath(`/event/${eventId}`);
    revalidatePath("/dashboard/campus");
    revalidatePath("/dashboard/campus/events");
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to approve event" };
  }
}

export async function rejectCampusEvent(eventId: string, reason?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { error } = await client
      .from("events")
      .update({
        approval_status: "rejected",
        status: "draft",
        rejection_reason: reason || "Event proposal did not meet institutional guidelines.",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (error) return { error: error.message };

    revalidatePath(`/event/${eventId}`);
    revalidatePath("/dashboard/campus");
    revalidatePath("/dashboard/campus/events");
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to reject event" };
  }
}

export async function requestChangesCampusEvent(eventId: string, reason?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  try {
    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? adminClient() : supabase;

    const { error } = await client
      .from("events")
      .update({
        approval_status: "changes_requested",
        status: "draft",
        rejection_reason: reason || "Please review and revise the event details.",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (error) return { error: error.message };

    revalidatePath(`/event/${eventId}`);
    revalidatePath("/dashboard/campus");
    revalidatePath("/dashboard/campus/events");
    return {};
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to request changes" };
  }
}

export async function getPendingApprovalEvents(institutionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data: events, error } = await supabase
      .from("events")
      .select(`
        id, name, event_date, venue, status, approval_status,
        submitted_for_approval_at, organizer_id,
        department:campus_departments(id, name, code),
        club:campus_clubs(id, name)
      `)
      .eq("institution_id", institutionId)
      .eq("approval_status", "pending_approval")
      .order("submitted_for_approval_at", { ascending: true });

    if (error || !events) return [];
    return events;
  } catch {
    return [];
  }
}
