"use server";

import { revalidatePath } from "next/cache";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { adminClient } from "@/lib/supabase/admin";

const stages = ["new", "qualified", "demo_booked", "demo_completed", "proposal_sent", "negotiation", "won", "lost", "onboarding"] as const;

export async function updateSalesLead(formData: FormData) {
  if (!(await isOpsAuthenticated())) throw new Error("Administrator access required");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !stages.includes(status as typeof stages[number])) throw new Error("Invalid lead update");
  const owner = String(formData.get("leadOwner") || "").trim().slice(0, 100);
  const nextAction = String(formData.get("nextAction") || "").trim().slice(0, 300);
  const followUp = String(formData.get("followUpAt") || "");
  const dealValue = String(formData.get("dealValueInr") || "");
  const amount = dealValue ? Number(dealValue) : null;
  if (amount !== null && (!Number.isInteger(amount) || amount < 0 || amount > 1_000_000_000)) throw new Error("Invalid deal value");
  if (followUp && !/^\d{4}-\d{2}-\d{2}$/.test(followUp)) throw new Error("Invalid follow-up date");
  const followUpDate = followUp ? new Date(`${followUp}T09:00:00+05:30`) : null;
  if (followUpDate && Number.isNaN(followUpDate.getTime())) throw new Error("Invalid follow-up date");
  const { error } = await adminClient().from("sales_leads").update({
    status,
    lead_owner: owner || null,
    next_action: nextAction || null,
    follow_up_at: followUpDate?.toISOString() || null,
    deal_value_inr: amount,
  }).eq("id", id);
  if (error) throw new Error("Could not update lead");
  revalidatePath("/ops/sales");
}
