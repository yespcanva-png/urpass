"use server";

import { adminClient } from "@/lib/supabase/admin";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { revalidatePath } from "next/cache";

export type InquiryStage =
  | "new"
  | "contacted"
  | "qualified"
  | "quotation_sent"
  | "accepted"
  | "payment_pending"
  | "paid"
  | "setup_in_progress"
  | "client_approved"
  | "completed"
  | "rejected";

export async function updateInquiryStage(
  inquiryId: string,
  newStage: InquiryStage,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Unauthorized" };
  }

  const admin = adminClient();
  const updatePayload: Record<string, any> = {
    status: newStage,
    updated_at: new Date().toISOString(),
  };

  if (notes) {
    updatePayload.support_requirements = notes;
  }

  const { error } = await admin
    .from("managed_service_inquiries")
    .update(updatePayload)
    .eq("id", inquiryId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/ops/campaigns");
  return { success: true };
}

export async function getCampaignDashboardData() {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) {
    return null;
  }

  const admin = adminClient();

  // 1. Fetch inquiries
  const { data: inquiries, error: inqErr } = await admin
    .from("managed_service_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  // 2. Fetch conversions
  const { data: conversions, error: convErr } = await admin
    .from("marketing_campaign_conversions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(250);

  return {
    inquiries: inquiries || [],
    conversions: conversions || [],
  };
}
