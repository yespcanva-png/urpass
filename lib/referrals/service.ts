import { createClient as createAdminClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  REFERRAL_COMMERCIAL_RULES,
  ReferralCode,
  ReferralAttribution,
  ReferralReward,
  ReferralDashboardData,
  ReferralActivityItem,
} from "./types";

function getAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createAdminClient(url, key);
}

/**
 * Generate permanent alphanumeric referral code: UP-XXXXX
 * Excludes confusing characters (0, O, 1, I).
 */
export function generateReferralCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    randomPart += chars[idx];
  }
  return `UP-${randomPart}`;
}

/**
 * Privacy masking utility for GDPR & PECR compliance.
 * "John Doe" -> "J*** D***"
 * "alice@example.com" -> "a***@example.com"
 * null / empty -> "Organiser"
 */
export function maskName(nameOrEmail?: string | null): string {
  if (!nameOrEmail || typeof nameOrEmail !== "string") return "Organiser";
  const trimmed = nameOrEmail.trim();
  if (!trimmed) return "Organiser";

  if (trimmed.includes("@")) {
    const [local, domain] = trimmed.split("@");
    if (!local || local.length <= 1) return `*@${domain}`;
    return `${local[0]}***@${domain}`;
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const word = parts[0];
    if (word.length <= 1) return `${word}***`;
    return `${word[0]}***`;
  }

  return parts
    .map((part) => (part.length > 0 ? `${part[0]}***` : ""))
    .join(" ");
}

/**
 * Retrieve or create permanent referral code for a user.
 */
export async function getOrCreateReferralCode(
  userId: string,
  organizationId?: string | null,
  clientOverride?: SupabaseClient
): Promise<ReferralCode | null> {
  const admin = clientOverride || getAdminClient();
  if (!admin) return null;

  try {
    // 1. Check existing code
    const { data: existing, error: fetchErr } = await admin
      .from("referral_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      return existing as ReferralCode;
    }

    // 2. Fetch default program
    const { data: program } = await admin
      .from("referral_programs")
      .select("id")
      .eq("slug", "default_in")
      .maybeSingle();

    const programId = program?.id;
    if (!programId) {
      console.warn("[referrals] default_in referral program not found.");
      return null;
    }

    // 3. Generate unique code
    let uniqueCode = "";
    let attempts = 0;
    while (attempts < 5) {
      attempts++;
      const candidate = generateReferralCode();
      const { data: dup } = await admin
        .from("referral_codes")
        .select("id")
        .eq("code", candidate)
        .maybeSingle();

      if (!dup) {
        uniqueCode = candidate;
        break;
      }
    }

    if (!uniqueCode) uniqueCode = generateReferralCode();

    const { data: inserted, error: insertErr } = await admin
      .from("referral_codes")
      .insert({
        code: uniqueCode,
        user_id: userId,
        organization_id: organizationId || null,
        program_id: programId,
        clicks_count: 0,
        signups_count: 0,
        conversions_count: 0,
        is_active: true,
      })
      .select("*")
      .single();

    if (insertErr) {
      console.error("[referrals] Error creating referral code:", insertErr);
      return null;
    }

    return inserted as ReferralCode;
  } catch (err) {
    console.error("[referrals] getOrCreateReferralCode exception:", err);
    return null;
  }
}

/**
 * Record a referral link click.
 */
export async function recordReferralClick(
  code: string,
  meta?: {
    visitorId?: string;
    ip?: string;
    userAgent?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  },
  clientOverride?: SupabaseClient
): Promise<{ success: boolean; codeRecord?: ReferralCode | null }> {
  const admin = clientOverride || getAdminClient();
  if (!admin) return { success: false };

  const normalized = code.trim().toUpperCase();

  try {
    const { data: codeRecord } = await admin
      .from("referral_codes")
      .select("*")
      .eq("code", normalized)
      .eq("is_active", true)
      .maybeSingle();

    if (!codeRecord) {
      return { success: false };
    }

    // Increment click counter
    await admin
      .from("referral_codes")
      .update({
        clicks_count: (codeRecord.clicks_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", codeRecord.id);

    return { success: true, codeRecord: codeRecord as ReferralCode };
  } catch (err) {
    console.error("[referrals] recordReferralClick error:", err);
    return { success: false };
  }
}

/**
 * Attach a referral code to a new referee during signup.
 * Enforces:
 * 1. Self-referral fraud prevention.
 * 2. First-touch attribution policy (locks referee to first referrer).
 */
export async function attachReferralOnSignup(
  refereeUserId: string,
  referralCode: string,
  meta?: {
    refereeOrgId?: string;
    ip?: string;
    userAgent?: string;
  },
  clientOverride?: SupabaseClient
): Promise<{ success: boolean; reason?: string; attributionId?: string }> {
  const admin = clientOverride || getAdminClient();
  if (!admin) return { success: false, reason: "admin_client_unavailable" };

  const normalized = referralCode.trim().toUpperCase();

  try {
    // 1. Lookup code
    const { data: codeRecord } = await admin
      .from("referral_codes")
      .select("*")
      .eq("code", normalized)
      .eq("is_active", true)
      .maybeSingle();

    if (!codeRecord) {
      return { success: false, reason: "invalid_or_inactive_code" };
    }

    // 2. Anti-fraud: prevent self-referral
    if (codeRecord.user_id === refereeUserId) {
      await admin.from("referral_fraud_flags").insert({
        referrer_user_id: codeRecord.user_id,
        referee_user_id: refereeUserId,
        flag_type: "self_referral",
        severity: "high",
        details: { code: normalized, refereeUserId, reason: "User tried to refer their own account" },
      });
      return { success: false, reason: "self_referral_blocked" };
    }

    // 3. First-touch attribution check: has referee already been attributed?
    const { data: existingAttr } = await admin
      .from("referral_attributions")
      .select("id")
      .eq("referee_user_id", refereeUserId)
      .maybeSingle();

    if (existingAttr) {
      return { success: false, reason: "already_attributed", attributionId: existingAttr.id };
    }

    // 4. Create attribution
    const expiresAt = new Date(Date.now() + REFERRAL_COMMERCIAL_RULES.COOKIE_MAX_AGE_SECONDS * 1000).toISOString();
    const { data: attribution, error: attrErr } = await admin
      .from("referral_attributions")
      .insert({
        code_id: codeRecord.id,
        referral_code: codeRecord.code,
        referrer_user_id: codeRecord.user_id,
        referrer_organization_id: codeRecord.organization_id || null,
        referee_user_id: refereeUserId,
        referee_organization_id: meta?.refereeOrgId || null,
        status: "signed_up",
        signup_at: new Date().toISOString(),
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (attrErr || !attribution) {
      console.error("[referrals] Error creating attribution:", attrErr);
      return { success: false, reason: attrErr?.message };
    }

    // 5. Update code signup count
    await admin
      .from("referral_codes")
      .update({
        signups_count: (codeRecord.signups_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", codeRecord.id);

    // 6. Log audit event
    await admin.from("referral_events").insert({
      attribution_id: attribution.id,
      event_name: "signup_completed",
      user_id: refereeUserId,
      metadata: { referralCode: codeRecord.code },
    });

    // 7. Fire notification email to referrer
    try {
      const { data: referrerProfile } = await admin
        .from("profiles")
        .select("full_name, user_id")
        .eq("user_id", codeRecord.user_id)
        .maybeSingle();

      const { data: referrerAuth } = (await admin.auth?.admin?.getUserById?.(codeRecord.user_id)) || {};
      const referrerEmail = referrerAuth?.user?.email;

      const { data: refereeProfile } = await admin
        .from("profiles")
        .select("full_name")
        .eq("user_id", refereeUserId)
        .maybeSingle();

      if (referrerEmail) {
        const { sendReferralSignupNotification } = await import("@/lib/email");
        await sendReferralSignupNotification({
          referrerEmail,
          referrerName: referrerProfile?.full_name || "Organiser",
          refereeMaskedName: maskName(refereeProfile?.full_name),
        });
      }
    } catch (notifErr) {
      console.warn("[referrals] Referrer signup notification non-critical error:", notifErr);
    }

    return { success: true, attributionId: attribution.id };
  } catch (err) {
    console.error("[referrals] attachReferralOnSignup exception:", err);
    return { success: false, reason: "unknown_error" };
  }
}

/**
 * Record a referee lifecycle milestone (e.g., first_event_created).
 */
export async function recordReferralMilestone(
  refereeUserId: string,
  milestone: "first_event_created",
  meta?: {
    eventId?: string;
    eventName?: string;
  },
  clientOverride?: SupabaseClient
): Promise<{ updated: boolean }> {
  const admin = clientOverride || getAdminClient();
  if (!admin) return { updated: false };

  try {
    const { data: attribution } = await admin
      .from("referral_attributions")
      .select("id, status, referral_code, referrer_user_id")
      .eq("referee_user_id", refereeUserId)
      .in("status", ["signed_up", "activated"])
      .maybeSingle();

    if (!attribution) return { updated: false };

    if (milestone === "first_event_created" && attribution.status === "signed_up") {
      await admin
        .from("referral_attributions")
        .update({
          status: "activated",
          activated_at: new Date().toISOString(),
          first_event_id: meta?.eventId || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", attribution.id);

      await admin.from("referral_events").insert({
        attribution_id: attribution.id,
        event_name: "first_event_created",
        user_id: refereeUserId,
        metadata: { eventId: meta?.eventId, eventName: meta?.eventName },
      });

      // Send milestone notification to referrer
      try {
        const { data: referrerAuth } = (await admin.auth?.admin?.getUserById?.(attribution.referrer_user_id)) || {};
        const referrerEmail = referrerAuth?.user?.email;
        const { data: referrerProfile } = await admin
          .from("profiles")
          .select("full_name")
          .eq("user_id", attribution.referrer_user_id)
          .maybeSingle();
        const { data: refereeProfile } = await admin
          .from("profiles")
          .select("full_name")
          .eq("user_id", refereeUserId)
          .maybeSingle();

        if (referrerEmail) {
          const { sendReferralFirstEventNotification } = await import("@/lib/email");
          await sendReferralFirstEventNotification({
            referrerEmail,
            referrerName: referrerProfile?.full_name || "Organiser",
            refereeMaskedName: maskName(refereeProfile?.full_name),
            eventName: meta?.eventName || "Event",
          });
        }
      } catch (err) {
        console.warn("[referrals] Milestone notification non-critical error:", err);
      }

      return { updated: true };
    }

    return { updated: false };
  } catch (err) {
    console.error("[referrals] recordReferralMilestone error:", err);
    return { updated: false };
  }
}

export interface ReferralDiscountResult {
  eligible: boolean;
  discountRupees: number;
  discountPaise: number;
  referralCode?: string;
  attributionId?: string;
  reason?: string;
}

/**
 * Calculate first-purchase referral discount for a checkout.
 * Enforces:
 * - Minimum purchase ₹499 (49900 paise) before discount.
 * - One-time only per referee organisation/account.
 * - Non-stacking rule (caller must ensure no coupon is stacked).
 */
export async function calculateReferralDiscount(
  refereeUserId: string,
  planSlug: string,
  baseRupees: number,
  clientOverride?: SupabaseClient
): Promise<ReferralDiscountResult> {
  const admin = clientOverride || getAdminClient();
  if (!admin) {
    return { eligible: false, discountRupees: 0, discountPaise: 0, reason: "service_unavailable" };
  }

  // Exclude free or promo plans
  const normalizedSlug = planSlug.toLowerCase();
  const excludedPlans = ["free", "trial", "single_event_pass_promo", "promo_29"];
  if (excludedPlans.includes(normalizedSlug)) {
    return { eligible: false, discountRupees: 0, discountPaise: 0, reason: "excluded_plan" };
  }

  // Minimum qualifying purchase threshold: ₹499
  if (baseRupees < REFERRAL_COMMERCIAL_RULES.MIN_QUALIFYING_PURCHASE_RUPEES) {
    return {
      eligible: false,
      discountRupees: 0,
      discountPaise: 0,
      reason: `Plan price must be at least ₹${REFERRAL_COMMERCIAL_RULES.MIN_QUALIFYING_PURCHASE_RUPEES} to qualify for referral discount`,
    };
  }

  try {
    // Check if referee has active attribution
    const { data: attribution } = await admin
      .from("referral_attributions")
      .select("id, referral_code, status, expires_at")
      .eq("referee_user_id", refereeUserId)
      .in("status", ["signed_up", "activated"])
      .maybeSingle();

    if (!attribution) {
      return { eligible: false, discountRupees: 0, discountPaise: 0, reason: "no_active_referral" };
    }

    // Check expiry
    if (new Date(attribution.expires_at) < new Date()) {
      return { eligible: false, discountRupees: 0, discountPaise: 0, reason: "referral_offer_expired" };
    }

    // Check if user has already made a conversion
    const { count: priorConversions } = await admin
      .from("referral_conversions")
      .select("id", { count: "exact", head: true })
      .eq("referee_user_id", refereeUserId);

    if ((priorConversions ?? 0) > 0) {
      return { eligible: false, discountRupees: 0, discountPaise: 0, reason: "referral_already_converted" };
    }

    return {
      eligible: true,
      discountRupees: REFERRAL_COMMERCIAL_RULES.REFEREE_DISCOUNT_RUPEES,
      discountPaise: REFERRAL_COMMERCIAL_RULES.REFEREE_DISCOUNT_PAISE,
      referralCode: attribution.referral_code,
      attributionId: attribution.id,
    };
  } catch (err) {
    console.error("[referrals] calculateReferralDiscount error:", err);
    return { eligible: false, discountRupees: 0, discountPaise: 0, reason: "evaluation_error" };
  }
}

/**
 * Record a qualifying referral conversion and issue a pending reward (14-day hold).
 */
export async function recordReferralConversion(
  refereeUserId: string,
  paymentId: string,
  grossRupees: number,
  planSlug: string,
  clientOverride?: SupabaseClient
): Promise<{ recorded: boolean; conversionId?: string; rewardCreated?: boolean; reason?: string }> {
  const admin = clientOverride || getAdminClient();
  if (!admin) return { recorded: false, reason: "admin_client_unavailable" };

  try {
    // 1. Idempotency check: has this payment already been recorded as a referral conversion?
    const { data: existingConv } = await admin
      .from("referral_conversions")
      .select("id")
      .eq("payment_id", paymentId)
      .maybeSingle();

    if (existingConv) {
      return { recorded: true, conversionId: existingConv.id, rewardCreated: false };
    }

    // 2. Find referee attribution
    const { data: attribution } = await admin
      .from("referral_attributions")
      .select("*")
      .eq("referee_user_id", refereeUserId)
      .in("status", ["signed_up", "activated"])
      .maybeSingle();

    if (!attribution) {
      return { recorded: false, reason: "no_active_attribution" };
    }

    // 3. Minimum threshold check: ₹499
    if (grossRupees < REFERRAL_COMMERCIAL_RULES.MIN_QUALIFYING_PURCHASE_RUPEES) {
      return { recorded: false, reason: "below_minimum_purchase_threshold" };
    }

    // 4. Monthly reward cap check for referrer: 10 per calendar month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { count: monthlyCount } = await admin
      .from("referral_rewards")
      .select("id", { count: "exact", head: true })
      .eq("referrer_user_id", attribution.referrer_user_id)
      .gte("created_at", startOfMonth)
      .in("status", ["pending", "available", "partially_redeemed", "fully_redeemed"]);

    const isCapped = (monthlyCount ?? 0) >= REFERRAL_COMMERCIAL_RULES.MONTHLY_REWARD_CAP;

    // 5. Insert conversion record
    const discountPaise = REFERRAL_COMMERCIAL_RULES.REFEREE_DISCOUNT_PAISE;
    const grossPaise = Math.round(grossRupees * 100);
    const netPaise = Math.max(0, grossPaise - discountPaise);

    const { data: conversion, error: convErr } = await admin
      .from("referral_conversions")
      .insert({
        attribution_id: attribution.id,
        referrer_user_id: attribution.referrer_user_id,
        referee_user_id: refereeUserId,
        referee_organization_id: attribution.referee_organization_id || null,
        payment_id: paymentId,
        gross_amount_paise: grossPaise,
        discount_applied_paise: discountPaise,
        net_amount_paise: netPaise,
        currency: "INR",
        plan_slug: planSlug,
        is_qualifying: true,
      })
      .select("id")
      .single();

    if (convErr || !conversion) {
      console.error("[referrals] Error inserting conversion:", convErr);
      return { recorded: false, reason: convErr?.message };
    }

    // 6. Update attribution status to converted
    await admin
      .from("referral_attributions")
      .update({
        status: "converted",
        converted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", attribution.id);

    // 7. Increment code conversions_count
    const { data: codeRecord } = await admin
      .from("referral_codes")
      .select("id, conversions_count")
      .eq("id", attribution.code_id)
      .maybeSingle();

    if (codeRecord) {
      await admin
        .from("referral_codes")
        .update({
          conversions_count: (codeRecord.conversions_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", codeRecord.id);
    }

    // 8. If monthly cap not reached, create 14-day hold pending reward
    let rewardCreated = false;
    if (!isCapped) {
      const holdUntil = new Date(Date.now() + REFERRAL_COMMERCIAL_RULES.HOLD_PERIOD_DAYS * 24 * 60 * 60 * 1000).toISOString();
      const rewardExpiresAt = new Date(Date.now() + REFERRAL_COMMERCIAL_RULES.CREDIT_VALIDITY_DAYS * 24 * 60 * 60 * 1000).toISOString();

      const { data: reward, error: rewErr } = await admin
        .from("referral_rewards")
        .insert({
          attribution_id: attribution.id,
          conversion_id: conversion.id,
          referrer_user_id: attribution.referrer_user_id,
          referrer_organization_id: attribution.referrer_organization_id || null,
          reward_amount_paise: REFERRAL_COMMERCIAL_RULES.REFERRER_REWARD_PAISE,
          currency: "INR",
          status: "pending",
          hold_until: holdUntil,
          expires_at: rewardExpiresAt,
        })
        .select("id")
        .single();

      if (!rewErr && reward) {
        rewardCreated = true;

        await admin.from("referral_events").insert({
          attribution_id: attribution.id,
          event_name: "payment_settled",
          user_id: refereeUserId,
          metadata: { paymentId, grossRupees, planSlug },
        });

        await admin.from("referral_events").insert({
          attribution_id: attribution.id,
          event_name: "reward_pending",
          user_id: attribution.referrer_user_id,
          metadata: { rewardId: reward.id, holdUntil },
        });

        // Notify referrer of pending ₹150 reward
        try {
          const { data: referrerAuth } = (await admin.auth?.admin?.getUserById?.(attribution.referrer_user_id)) || {};
          const referrerEmail = referrerAuth?.user?.email;
          const { data: referrerProfile } = await admin
            .from("profiles")
            .select("full_name")
            .eq("user_id", attribution.referrer_user_id)
            .maybeSingle();
          const { data: refereeProfile } = await admin
            .from("profiles")
            .select("full_name")
            .eq("user_id", refereeUserId)
            .maybeSingle();

          if (referrerEmail) {
            const { sendReferralPendingRewardNotification } = await import("@/lib/email");
            await sendReferralPendingRewardNotification({
              referrerEmail,
              referrerName: referrerProfile?.full_name || "Organiser",
              refereeMaskedName: maskName(refereeProfile?.full_name),
              rewardRupees: REFERRAL_COMMERCIAL_RULES.REFERRER_REWARD_RUPEES,
              holdDays: REFERRAL_COMMERCIAL_RULES.HOLD_PERIOD_DAYS,
            });
          }
        } catch (notifErr) {
          console.warn("[referrals] Pending reward notification error:", notifErr);
        }
      }
    } else {
      console.info(`[referrals] Referrer ${attribution.referrer_user_id} reached monthly reward cap (10)`);
    }

    return { recorded: true, conversionId: conversion.id, rewardCreated };
  } catch (err) {
    console.error("[referrals] recordReferralConversion error:", err);
    return { recorded: false, reason: "internal_error" };
  }
}

/**
 * Scan and mature pending referral rewards whose 14-day hold has completed.
 * Credits become available for subscription invoice discounts.
 */
export async function maturePendingReferralRewards(
  clientOverride?: SupabaseClient
): Promise<{ maturedCount: number }> {
  const admin = clientOverride || getAdminClient();
  if (!admin) return { maturedCount: 0 };

  try {
    const nowIso = new Date().toISOString();
    const { data: pendingRewards, error: fetchErr } = await admin
      .from("referral_rewards")
      .select("*")
      .eq("status", "pending")
      .lte("hold_until", nowIso);

    if (fetchErr || !pendingRewards || pendingRewards.length === 0) {
      return { maturedCount: 0 };
    }

    let maturedCount = 0;

    for (const reward of pendingRewards as ReferralReward[]) {
      // 1. Update status to available
      const { error: updateErr } = await admin
        .from("referral_rewards")
        .update({
          status: "available",
          matured_at: nowIso,
          updated_at: nowIso,
        })
        .eq("id", reward.id);

      if (updateErr) continue;

      // 2. Fetch user's current credit balance
      const { data: lastTx } = await admin
        .from("referral_credit_transactions")
        .select("balance_after_paise")
        .eq("user_id", reward.referrer_user_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const previousBalance = lastTx?.balance_after_paise || 0;
      const newBalance = previousBalance + reward.reward_amount_paise;

      // 3. Write immutable ledger entry
      await admin.from("referral_credit_transactions").insert({
        reward_id: reward.id,
        user_id: reward.referrer_user_id,
        organization_id: reward.referrer_organization_id || null,
        entry_type: "credit_matured",
        amount_paise: reward.reward_amount_paise,
        balance_after_paise: newBalance,
        currency: reward.currency || "INR",
        notes: `Reward matured after 14-day hold. Available for subscription discount.`,
      });

      // 4. Log event
      await admin.from("referral_events").insert({
        attribution_id: reward.attribution_id,
        event_name: "reward_approved",
        user_id: reward.referrer_user_id,
        metadata: { rewardId: reward.id, amountPaise: reward.reward_amount_paise },
      });

      // 5. Send maturation email notification to referrer
      try {
        const { data: userAuth } = (await admin.auth?.admin?.getUserById?.(reward.referrer_user_id)) || {};
        const email = userAuth?.user?.email;
        const { data: profile } = await admin
          .from("profiles")
          .select("full_name")
          .eq("user_id", reward.referrer_user_id)
          .maybeSingle();

        if (email) {
          const { sendReferralRewardMaturedNotification } = await import("@/lib/email");
          await sendReferralRewardMaturedNotification({
            referrerEmail: email,
            referrerName: profile?.full_name || "Organiser",
            rewardRupees: Math.round(reward.reward_amount_paise / 100),
            totalAvailableRupees: Math.round(newBalance / 100),
          });
        }
      } catch (err) {
        console.warn("[referrals] Maturation notification error:", err);
      }

      maturedCount++;
    }

    return { maturedCount };
  } catch (err) {
    console.error("[referrals] maturePendingReferralRewards error:", err);
    return { maturedCount: 0 };
  }
}

/**
 * Fetch complete dashboard data for an organiser:
 * - Code & URL
 * - KPI stats (Signups, Paid conversions, Pending credits, Available credits)
 * - Monthly cap status
 * - Privacy-masked recent activity with hold countdowns
 */
export async function getUserReferralDashboard(
  userId: string,
  appOrigin = "https://urpass.space",
  clientOverride?: SupabaseClient
): Promise<ReferralDashboardData> {
  const admin = clientOverride || getAdminClient();
  const fallbackData: ReferralDashboardData = {
    referralCode: "UP-EARN",
    referralUrl: `${appOrigin}/r/UP-EARN`,
    stats: {
      totalSignups: 0,
      paidReferrals: 0,
      pendingCreditsRupees: 0,
      availableCreditsRupees: 0,
      monthlyRewardCount: 0,
      monthlyRewardCap: REFERRAL_COMMERCIAL_RULES.MONTHLY_REWARD_CAP,
    },
    recentActivity: [],
  };

  if (!admin) return fallbackData;

  try {
    // 1. Get or create referral code
    const codeObj = await getOrCreateReferralCode(userId, null, admin);
    const code = codeObj?.code || "UP-EARN";
    const referralUrl = `${appOrigin}/r/${code}`;

    // 2. Fetch pending rewards
    const { data: pendingRewards } = await admin
      .from("referral_rewards")
      .select("reward_amount_paise")
      .eq("referrer_user_id", userId)
      .eq("status", "pending");

    const pendingPaise = (pendingRewards || []).reduce((acc, r) => acc + (r.reward_amount_paise || 0), 0);
    const pendingCreditsRupees = Math.round(pendingPaise / 100);

    // 3. Fetch latest credit transaction for available spendable balance
    const { data: lastTx } = await admin
      .from("referral_credit_transactions")
      .select("balance_after_paise")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const availableCreditsRupees = Math.round((lastTx?.balance_after_paise || 0) / 100);

    // 4. Monthly reward count
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { count: monthlyCount } = await admin
      .from("referral_rewards")
      .select("id", { count: "exact", head: true })
      .eq("referrer_user_id", userId)
      .gte("created_at", startOfMonth)
      .in("status", ["pending", "available", "partially_redeemed", "fully_redeemed"]);

    // 5. Attributions & activity
    const { data: attributions } = await admin
      .from("referral_attributions")
      .select(`
        id,
        status,
        created_at,
        referee_user_id,
        signup_at,
        activated_at,
        converted_at
      `)
      .eq("referrer_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(15);

    const refereeIds = (attributions || [])
      .map((a) => a.referee_user_id)
      .filter(Boolean) as string[];

    let profilesMap: Record<string, string> = {};
    if (refereeIds.length > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", refereeIds);

      (profiles || []).forEach((p) => {
        if (p.user_id && p.full_name) {
          profilesMap[p.user_id] = p.full_name;
        }
      });
    }

    // Fetch associated rewards for hold countdown
    const attrIds = (attributions || []).map((a) => a.id);
    let rewardsMap: Record<string, ReferralReward> = {};
    if (attrIds.length > 0) {
      const { data: rewards } = await admin
        .from("referral_rewards")
        .select("*")
        .in("attribution_id", attrIds);

      (rewards || []).forEach((r) => {
        rewardsMap[r.attribution_id] = r as ReferralReward;
      });
    }

    const recentActivity: ReferralActivityItem[] = (attributions || []).map((attr) => {
      const rawName = attr.referee_user_id ? profilesMap[attr.referee_user_id] : null;
      const maskedName = maskName(rawName);
      const reward = rewardsMap[attr.id];

      let status: ReferralActivityItem["status"] = "signed_up";
      let statusLabel = "Signed Up";
      let daysRemainingInHold: number | undefined;

      if (attr.status === "signed_up") {
        status = "signed_up";
        statusLabel = "Signed Up";
      } else if (attr.status === "activated") {
        status = "activated";
        statusLabel = "Event Created";
      } else if (attr.status === "converted" && reward) {
        if (reward.status === "pending") {
          status = "pending_hold";
          const msLeft = new Date(reward.hold_until).getTime() - Date.now();
          daysRemainingInHold = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
          statusLabel = `14-day hold (${daysRemainingInHold}d left)`;
        } else if (reward.status === "available" || reward.status === "partially_redeemed" || reward.status === "fully_redeemed") {
          status = "available";
          statusLabel = "Credits Available";
        } else if (reward.status === "reversed") {
          status = "reversed";
          statusLabel = "Reversed";
        }
      }

      return {
        id: attr.id,
        refereeMaskedName: maskedName,
        status,
        statusLabel,
        createdAt: attr.signup_at || attr.created_at,
        rewardAmountRupees: reward ? Math.round(reward.reward_amount_paise / 100) : undefined,
        daysRemainingInHold,
      };
    });

    const totalSignups = codeObj?.signups_count || (attributions || []).length;
    const paidReferrals = codeObj?.conversions_count || (attributions || []).filter((a) => a.status === "converted").length;

    return {
      referralCode: code,
      referralUrl,
      stats: {
        totalSignups,
        paidReferrals,
        pendingCreditsRupees,
        availableCreditsRupees,
        monthlyRewardCount: monthlyCount ?? 0,
        monthlyRewardCap: REFERRAL_COMMERCIAL_RULES.MONTHLY_REWARD_CAP,
      },
      recentActivity,
    };
  } catch (err) {
    console.error("[referrals] getUserReferralDashboard exception:", err);
    return fallbackData;
  }
}

/**
 * Apply spendable referral credits as a discount towards a subscription invoice.
 * Strictly non-cashout: credits only deduct subscription charges.
 */
export async function applyReferralCreditToInvoice(
  userId: string,
  invoiceAmountRupees: number,
  invoiceId?: string,
  clientOverride?: SupabaseClient
): Promise<{ discountAppliedRupees: number; remainingBalanceRupees: number }> {
  const admin = clientOverride || getAdminClient();
  if (!admin) return { discountAppliedRupees: 0, remainingBalanceRupees: 0 };

  try {
    // 1. Fetch current spendable balance
    const { data: lastTx } = await admin
      .from("referral_credit_transactions")
      .select("balance_after_paise")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentBalancePaise = lastTx?.balance_after_paise || 0;
    if (currentBalancePaise <= 0) {
      return { discountAppliedRupees: 0, remainingBalanceRupees: 0 };
    }

    const invoiceAmountPaise = Math.round(invoiceAmountRupees * 100);
    const deductionPaise = Math.min(currentBalancePaise, invoiceAmountPaise);
    const balanceAfterPaise = currentBalancePaise - deductionPaise;

    // 2. Insert redemption transaction
    await admin.from("referral_credit_transactions").insert({
      user_id: userId,
      entry_type: "credit_redeemed",
      amount_paise: deductionPaise,
      balance_after_paise: balanceAfterPaise,
      currency: "INR",
      invoice_id: invoiceId || null,
      notes: `Applied as billing discount on subscription invoice.`,
    });

    return {
      discountAppliedRupees: Math.round(deductionPaise / 100),
      remainingBalanceRupees: Math.round(balanceAfterPaise / 100),
    };
  } catch (err) {
    console.error("[referrals] applyReferralCreditToInvoice error:", err);
    return { discountAppliedRupees: 0, remainingBalanceRupees: 0 };
  }
}
