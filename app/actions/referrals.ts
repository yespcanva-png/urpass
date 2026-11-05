"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  attachReferralOnSignup,
  getUserReferralDashboard,
  maturePendingReferralRewards,
  applyReferralCreditToInvoice,
} from "@/lib/referrals/service";
import { REFERRAL_COMMERCIAL_RULES } from "@/lib/referrals/types";

export async function attachSignupReferralAction(userId: string, code?: string) {
  if (!userId) return { success: false, reason: "missing_user" };

  let refCode = code?.trim().toUpperCase();
  if (!refCode) {
    const cookieStore = await cookies();
    refCode = cookieStore.get(REFERRAL_COMMERCIAL_RULES.COOKIE_NAME)?.value?.trim().toUpperCase();
  }

  if (!refCode) return { success: false, reason: "no_referral_code" };

  return await attachReferralOnSignup(userId, refCode);
}

export async function getReferralDashboardAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
  const data = await getUserReferralDashboard(user.id, appOrigin);
  return { success: true, data };
}

export async function matureRewardsCronAction() {
  // Can be called by scheduled tasks / cron
  return await maturePendingReferralRewards();
}

