export interface ReferralProgram {
  id: string;
  name: string;
  slug: string;
  currency: string;
  referee_discount_paise: number;
  referrer_reward_paise: number;
  min_qualifying_payment_paise: number;
  hold_period_days: number;
  monthly_reward_cap: number;
  credit_validity_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReferralCode {
  id: string;
  code: string;
  user_id: string;
  organization_id?: string | null;
  program_id: string;
  clicks_count: number;
  signups_count: number;
  conversions_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ReferralStatus =
  | "clicked"
  | "signed_up"
  | "activated"
  | "converted"
  | "fraud_blocked"
  | "expired";

export interface ReferralAttribution {
  id: string;
  code_id: string;
  referral_code: string;
  referrer_user_id: string;
  referrer_organization_id?: string | null;
  referee_user_id?: string | null;
  referee_organization_id?: string | null;
  visitor_id?: string | null;
  status: ReferralStatus;
  first_event_id?: string | null;
  attributed_at: string;
  signup_at?: string | null;
  activated_at?: string | null;
  converted_at?: string | null;
  expires_at: string;
}

export type RewardStatus =
  | "pending"
  | "available"
  | "partially_redeemed"
  | "fully_redeemed"
  | "reversed"
  | "expired";

export interface ReferralReward {
  id: string;
  attribution_id: string;
  conversion_id: string;
  referrer_user_id: string;
  referrer_organization_id?: string | null;
  reward_amount_paise: number;
  currency: string;
  status: RewardStatus;
  hold_until: string;
  matured_at?: string | null;
  expires_at: string;
  reversal_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export type CreditEntryType =
  | "credit_matured"
  | "credit_redeemed"
  | "credit_reversed"
  | "credit_expired"
  | "manual_adjustment";

export interface ReferralCreditTransaction {
  id: string;
  reward_id?: string | null;
  user_id: string;
  organization_id?: string | null;
  entry_type: CreditEntryType;
  amount_paise: number;
  balance_after_paise: number;
  currency: string;
  invoice_id?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface ReferralActivityItem {
  id: string;
  refereeMaskedName: string;
  status: "signed_up" | "activated" | "pending_hold" | "available" | "reversed";
  statusLabel: string;
  createdAt: string;
  eventDate?: string | null;
  rewardAmountRupees?: number;
  daysRemainingInHold?: number;
}

export interface ReferralDashboardData {
  referralCode: string;
  referralUrl: string;
  stats: {
    totalSignups: number;
    paidReferrals: number;
    pendingCreditsRupees: number;
    availableCreditsRupees: number;
    monthlyRewardCount: number;
    monthlyRewardCap: number;
  };
  recentActivity: ReferralActivityItem[];
}

export const REFERRAL_COMMERCIAL_RULES = {
  REFEREE_DISCOUNT_RUPEES: 100,
  REFEREE_DISCOUNT_PAISE: 10000,
  REFERRER_REWARD_RUPEES: 150,
  REFERRER_REWARD_PAISE: 15000,
  MIN_QUALIFYING_PURCHASE_RUPEES: 499,
  MIN_QUALIFYING_PURCHASE_PAISE: 49900,
  HOLD_PERIOD_DAYS: 14,
  MONTHLY_REWARD_CAP: 10,
  CREDIT_VALIDITY_DAYS: 365,
  COOKIE_NAME: "urpass_ref",
  COOKIE_MAX_AGE_SECONDS: 30 * 24 * 60 * 60, // 30 days
} as const;

