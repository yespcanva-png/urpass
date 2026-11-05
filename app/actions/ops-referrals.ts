"use server";

import { isOpsAuthenticated } from "@/lib/ops/auth";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import { maturePendingReferralRewards } from "@/lib/referrals/service";

function getAdmin() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createAdminClient(url, key);
}

export async function getOpsReferralData() {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return { error: "Unauthorized" };

  const admin = getAdmin();
  if (!admin) return { error: "Database client unavailable" };

  try {
    // 1. Fetch metrics
    const { count: totalCodes } = await admin.from("referral_codes").select("*", { count: "exact", head: true });
    const { count: totalSignups } = await admin.from("referral_attributions").select("*", { count: "exact", head: true });
    const { count: totalConversions } = await admin.from("referral_conversions").select("*", { count: "exact", head: true });

    // Pending vs Available rewards liability
    const { data: rewards } = await admin
      .from("referral_rewards")
      .select("id, status, reward_amount_paise, hold_until, created_at, referrer_user_id, conversion_id");

    let pendingLiabilityPaise = 0;
    let availableLiabilityPaise = 0;

    (rewards || []).forEach((r) => {
      if (r.status === "pending") pendingLiabilityPaise += r.reward_amount_paise || 0;
      if (r.status === "available") availableLiabilityPaise += r.reward_amount_paise || 0;
    });

    // 2. Fetch recent rewards list (limit 25)
    const { data: recentRewards } = await admin
      .from("referral_rewards")
      .select(`
        id,
        status,
        reward_amount_paise,
        hold_until,
        matured_at,
        created_at,
        referrer_user_id,
        reversal_reason
      `)
      .order("created_at", { ascending: false })
      .limit(25);

    // 3. Fetch fraud flags
    const { data: fraudFlags } = await admin
      .from("referral_fraud_flags")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25);

    // 4. Fetch top referral codes
    const { data: topCodes } = await admin
      .from("referral_codes")
      .select("id, code, clicks_count, signups_count, conversions_count, is_active, created_at, user_id")
      .order("conversions_count", { ascending: false })
      .limit(15);

    return {
      success: true,
      metrics: {
        totalCodes: totalCodes ?? 0,
        totalSignups: totalSignups ?? 0,
        totalConversions: totalConversions ?? 0,
        pendingLiabilityRupees: Math.round(pendingLiabilityPaise / 100),
        availableLiabilityRupees: Math.round(availableLiabilityPaise / 100),
      },
      rewards: recentRewards || [],
      fraudFlags: fraudFlags || [],
      topCodes: topCodes || [],
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error loading ops referral data";
    return { error: msg };
  }
}

export async function opsMatureRewardsAction() {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return { error: "Unauthorized" };
  const res = await maturePendingReferralRewards();
  return { success: true, ...res };
}

export async function opsReverseRewardAction(rewardId: string, reason: string) {
  const isAuth = await isOpsAuthenticated();
  if (!isAuth) return { error: "Unauthorized" };

  const admin = getAdmin();
  if (!admin) return { error: "Database client unavailable" };

  try {
    const { data: reward } = await admin
      .from("referral_rewards")
      .select("*")
      .eq("id", rewardId)
      .maybeSingle();

    if (!reward) return { error: "Reward not found" };

    await admin
      .from("referral_rewards")
      .update({
        status: "reversed",
        reversal_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", rewardId);

    // If it was already available, reverse from user's credit ledger
    if (reward.status === "available") {
      const { data: lastTx } = await admin
        .from("referral_credit_transactions")
        .select("balance_after_paise")
        .eq("user_id", reward.referrer_user_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const currentBalance = lastTx?.balance_after_paise || 0;
      const newBalance = Math.max(0, currentBalance - reward.reward_amount_paise);

      await admin.from("referral_credit_transactions").insert({
        reward_id: reward.id,
        user_id: reward.referrer_user_id,
        entry_type: "credit_reversed",
        amount_paise: reward.reward_amount_paise,
        balance_after_paise: newBalance,
        currency: "INR",
        notes: `Ops reversal: ${reason}`,
      });
    }

    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Reversal error" };
  }
}

