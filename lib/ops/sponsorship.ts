import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { recordLiveOpsEvent } from "./events";
import { sendSponsorshipApprovalEmail } from "@/lib/email";

export interface SponsorshipApplication {
  id: string;
  eventName: string;
  collegeName: string;
  studentName: string;
  email: string;
  phone?: string;
  expectedAttendees?: string;
  eventDate?: string;
  websiteOrSocial?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  voucherCode?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// In-memory cache fallback to ensure fast retrieval and reliability
declare global {
  // eslint-disable-next-line no-var
  var __urpass_sponsorship_cache: SponsorshipApplication[] | undefined;
}

if (!globalThis.__urpass_sponsorship_cache) {
  globalThis.__urpass_sponsorship_cache = [];
}

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-role-key"
  );
}

export async function getSponsorshipApplications(): Promise<SponsorshipApplication[]> {
  try {
    const admin = adminClient();
    const { data } = await admin
      .from("system_settings")
      .select("value")
      .eq("key", "sponsorship_applications")
      .maybeSingle();

    if (data?.value && Array.isArray(data.value)) {
      const list = data.value as SponsorshipApplication[];
      globalThis.__urpass_sponsorship_cache = list;
      return list;
    }
  } catch (err) {
    console.warn("[ops/sponsorship] Failed to fetch from DB, using cache:", err);
  }

  return globalThis.__urpass_sponsorship_cache || [];
}

export async function saveSponsorshipApplications(
  list: SponsorshipApplication[]
): Promise<boolean> {
  globalThis.__urpass_sponsorship_cache = list;
  try {
    const admin = adminClient();
    const { error } = await admin.from("system_settings").upsert(
      {
        key: "sponsorship_applications",
        value: list,
        description: "Campus fest and hackathon sponsorship applications",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
    if (error) {
      console.warn("[ops/sponsorship] Error saving to system_settings:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[ops/sponsorship] DB save failed:", err);
    return false;
  }
}

export async function addSponsorshipApplication(
  input: Omit<SponsorshipApplication, "id" | "status" | "appliedAt">
): Promise<SponsorshipApplication> {
  const current = await getSponsorshipApplications();
  const id = `spon-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newApp: SponsorshipApplication = {
    ...input,
    id,
    status: "pending",
    appliedAt: new Date().toISOString(),
  };

  const updated = [newApp, ...current];
  await saveSponsorshipApplications(updated);

  recordLiveOpsEvent({
    level: "SUCCESS",
    category: "AUTH",
    message: `🎓 New campus sponsorship applied: "${input.eventName}" (${input.collegeName}) by ${input.studentName}`,
    details: { applicationId: id, eventName: input.eventName, email: input.email },
  });

  return newApp;
}

export async function approveSponsorshipApplication(
  id: string,
  reviewer = "Ops Admin"
): Promise<{ success: boolean; application?: SponsorshipApplication; error?: string }> {
  const list = await getSponsorshipApplications();
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) {
    return { success: false, error: "Application not found" };
  }

  const app = list[index];
  const voucherCode = `CAMPUS-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  // Optionally insert into coupons table for automatic checkout validation
  try {
    const admin = adminClient();
    await admin.from("coupons").insert({
      code: voucherCode,
      name: `Sponsorship: ${app.eventName}`,
      description: `100% Free Pro Tier sponsorship for ${app.collegeName}`,
      discount_type: "percentage",
      discount_value: 100,
      applicable_products: ["subscription"],
      applicable_plans: ["pro", "starter"],
      per_customer_limit: 1,
      total_redemption_limit: 1,
      is_active: true,
      created_by: reviewer,
    });
  } catch {
    // Non-fatal if coupons table isn't migrated or fails
  }

  const updatedApp: SponsorshipApplication = {
    ...app,
    status: "approved",
    voucherCode,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewer,
  };

  list[index] = updatedApp;
  await saveSponsorshipApplications(list);

  recordLiveOpsEvent({
    level: "SUCCESS",
    category: "BILLING",
    message: `🎉 Sponsorship approved for "${app.eventName}" (${app.collegeName})! Voucher: ${voucherCode}`,
    details: { applicationId: id, voucherCode, student: app.studentName, email: app.email },
  });

  // Send approval email with voucher
  try {
    await sendSponsorshipApprovalEmail({
      email: app.email,
      studentName: app.studentName,
      eventName: app.eventName,
      collegeName: app.collegeName,
      voucherCode,
    });
  } catch (err) {
    console.error("[ops/sponsorship] Failed to send approval email:", err);
  }

  return { success: true, application: updatedApp };
}

export async function rejectSponsorshipApplication(
  id: string,
  reason?: string,
  reviewer = "Ops Admin"
): Promise<{ success: boolean; application?: SponsorshipApplication; error?: string }> {
  const list = await getSponsorshipApplications();
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) {
    return { success: false, error: "Application not found" };
  }

  const app = list[index];
  const updatedApp: SponsorshipApplication = {
    ...app,
    status: "rejected",
    rejectionReason: reason || "Does not meet current campus eligibility criteria.",
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewer,
  };

  list[index] = updatedApp;
  await saveSponsorshipApplications(list);

  recordLiveOpsEvent({
    level: "WARN",
    category: "AUTH",
    message: `Sponsorship rejected for "${app.eventName}" (${app.collegeName})`,
    details: { applicationId: id, reason },
  });

  return { success: true, application: updatedApp };
}
