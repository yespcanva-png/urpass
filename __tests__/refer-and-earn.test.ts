import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateReferralCode,
  maskName,
  calculateReferralDiscount,
  attachReferralOnSignup,
  recordReferralConversion,
  maturePendingReferralRewards,
  applyReferralCreditToInvoice,
} from "@/lib/referrals/service";
import { REFERRAL_COMMERCIAL_RULES } from "@/lib/referrals/types";

describe("UrPass Refer & Earn V1 Commercial Engine", () => {
  describe("1. Commercial Rules & Formatting", () => {
    it("enforces Give ₹100, Get ₹150 commercial parameters", () => {
      expect(REFERRAL_COMMERCIAL_RULES.REFEREE_DISCOUNT_RUPEES).toBe(100);
      expect(REFERRAL_COMMERCIAL_RULES.REFEREE_DISCOUNT_PAISE).toBe(10000);
      expect(REFERRAL_COMMERCIAL_RULES.REFERRER_REWARD_RUPEES).toBe(150);
      expect(REFERRAL_COMMERCIAL_RULES.REFERRER_REWARD_PAISE).toBe(15000);
      expect(REFERRAL_COMMERCIAL_RULES.MIN_QUALIFYING_PURCHASE_RUPEES).toBe(499);
      expect(REFERRAL_COMMERCIAL_RULES.MIN_QUALIFYING_PURCHASE_PAISE).toBe(49900);
      expect(REFERRAL_COMMERCIAL_RULES.HOLD_PERIOD_DAYS).toBe(14);
      expect(REFERRAL_COMMERCIAL_RULES.MONTHLY_REWARD_CAP).toBe(10);
      expect(REFERRAL_COMMERCIAL_RULES.CREDIT_VALIDITY_DAYS).toBe(365);
      expect(REFERRAL_COMMERCIAL_RULES.COOKIE_NAME).toBe("urpass_ref");
      expect(REFERRAL_COMMERCIAL_RULES.COOKIE_MAX_AGE_SECONDS).toBe(30 * 24 * 60 * 60);
    });

    it("generates permanent alphanumeric code in UP-XXXXX format without ambiguous characters", () => {
      for (let i = 0; i < 20; i++) {
        const code = generateReferralCode();
        expect(code).toMatch(/^UP-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/);
        // Ensure no 0, O, 1, I
        expect(code).not.toMatch(/[01OI]/);
      }
    });

    it("privacy masks names and emails for GDPR & PECR compliance", () => {
      expect(maskName("John Doe")).toBe("J*** D***");
      expect(maskName("Priya Sharma")).toBe("P*** S***");
      expect(maskName("Srinithin")).toBe("S***");
      expect(maskName("organiser@domain.com")).toBe("o***@domain.com");
      expect(maskName(null)).toBe("Organiser");
      expect(maskName("")).toBe("Organiser");
    });
  });

  describe("2. Discount Evaluation & Eligibility", () => {
    it("rejects referral discount if plan is below ₹499 threshold", async () => {
      const mockAdmin: any = {};
      const res = await calculateReferralDiscount("user-1", "single_pass_299", 299, mockAdmin);
      expect(res.eligible).toBe(false);
      expect(res.discountRupees).toBe(0);
      expect(res.reason).toContain("at least ₹499");
    });

    it("rejects referral discount on excluded plans (free, trial, promo)", async () => {
      const mockAdmin: any = {};
      const resFree = await calculateReferralDiscount("user-1", "free", 0, mockAdmin);
      expect(resFree.eligible).toBe(false);
      expect(resFree.reason).toBe("excluded_plan");

      const resPromo = await calculateReferralDiscount("user-1", "single_event_pass_promo", 500, mockAdmin);
      expect(resPromo.eligible).toBe(false);
      expect(resPromo.reason).toBe("excluded_plan");
    });

    it("approves ₹100 discount when referee has active attribution and purchases >= ₹499 plan", async () => {
      const mockAdmin: any = {
        from: (table: string) => {
          if (table === "referral_attributions") {
            return {
              select: () => ({
                eq: () => ({
                  in: () => ({
                    maybeSingle: async () => ({
                      data: {
                        id: "attr-123",
                        referral_code: "UP-ABCDE",
                        status: "signed_up",
                        expires_at: new Date(Date.now() + 86400000).toISOString(),
                      },
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "referral_conversions") {
            return {
              select: () => ({
                eq: async () => ({ count: 0 }),
              }),
            };
          }
          return {};
        },
      };

      const res = await calculateReferralDiscount("referee-1", "starter", 499, mockAdmin);
      expect(res.eligible).toBe(true);
      expect(res.discountRupees).toBe(100);
      expect(res.discountPaise).toBe(10000);
      expect(res.referralCode).toBe("UP-ABCDE");
    });

    it("rejects referral discount if referee already converted a prior purchase", async () => {
      const mockAdmin: any = {
        from: (table: string) => {
          if (table === "referral_attributions") {
            return {
              select: () => ({
                eq: () => ({
                  in: () => ({
                    maybeSingle: async () => ({
                      data: {
                        id: "attr-123",
                        referral_code: "UP-ABCDE",
                        status: "signed_up",
                        expires_at: new Date(Date.now() + 86400000).toISOString(),
                      },
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "referral_conversions") {
            return {
              select: () => ({
                eq: async () => ({ count: 1 }), // Already converted
              }),
            };
          }
          return {};
        },
      };

      const res = await calculateReferralDiscount("referee-1", "pro", 999, mockAdmin);
      expect(res.eligible).toBe(false);
      expect(res.discountRupees).toBe(0);
      expect(res.reason).toBe("referral_already_converted");
    });
  });

  describe("3. Signup Attribution & Fraud Protection", () => {
    it("blocks self-referral attempts and logs a fraud flag", async () => {
      let fraudLogged = false;
      const mockAdmin: any = {
        from: (table: string) => {
          if (table === "referral_codes") {
            return {
              select: () => ({
                eq: () => ({
                  eq: () => ({
                    maybeSingle: async () => ({
                      data: {
                        id: "code-1",
                        code: "UP-ABCDE",
                        user_id: "same-user-id", // Same as referee!
                        is_active: true,
                      },
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "referral_fraud_flags") {
            return {
              insert: async (data: any) => {
                if (data.flag_type === "self_referral") {
                  fraudLogged = true;
                }
                return { error: null };
              },
            };
          }
          return {};
        },
      };

      const res = await attachReferralOnSignup("same-user-id", "UP-ABCDE", undefined, mockAdmin);
      expect(res.success).toBe(false);
      expect(res.reason).toBe("self_referral_blocked");
      expect(fraudLogged).toBe(true);
    });

    it("locks attribution to first touch and prevents re-attribution", async () => {
      const mockAdmin: any = {
        from: (table: string) => {
          if (table === "referral_codes") {
            return {
              select: () => ({
                eq: () => ({
                  eq: () => ({
                    maybeSingle: async () => ({
                      data: {
                        id: "code-2",
                        code: "UP-XY789",
                        user_id: "referrer-99",
                        is_active: true,
                      },
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "referral_attributions") {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({
                    data: { id: "existing-attr-id" }, // Already attributed!
                  }),
                }),
              }),
            };
          }
          return {};
        },
      };

      const res = await attachReferralOnSignup("referee-new", "UP-XY789", undefined, mockAdmin);
      expect(res.success).toBe(false);
      expect(res.reason).toBe("already_attributed");
    });
  });

  describe("4. Qualifying Conversion & 14-Day Hold", () => {
    it("creates pending ₹150 reward with 14-day hold on eligible purchase", async () => {
      let rewardInserted: any = null;
      let conversionInserted: any = null;

      const mockAdmin: any = {
        from: (table: string) => {
          if (table === "referral_conversions") {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: null }), // Idempotent check: doesn't exist yet
                }),
              }),
              insert: (data: any) => ({
                select: () => ({
                  single: async () => {
                    conversionInserted = data;
                    return { data: { id: "conv-1" }, error: null };
                  },
                }),
              }),
            };
          }
          if (table === "referral_attributions") {
            return {
              select: () => ({
                eq: () => ({
                  in: () => ({
                    maybeSingle: async () => ({
                      data: {
                        id: "attr-1",
                        code_id: "code-1",
                        referrer_user_id: "referrer-1",
                        referee_user_id: "referee-1",
                      },
                    }),
                  }),
                }),
              }),
              update: () => ({
                eq: async () => ({ error: null }),
              }),
            };
          }
          if (table === "referral_rewards") {
            return {
              select: () => ({
                eq: () => ({
                  gte: () => ({
                    in: async () => ({ count: 2 }), // 2 rewards this month (well under cap of 10)
                  }),
                }),
              }),
              insert: (data: any) => ({
                select: () => ({
                  single: async () => {
                    rewardInserted = data;
                    return { data: { id: "reward-1" }, error: null };
                  },
                }),
              }),
            };
          }
          if (table === "referral_codes") {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: { id: "code-1", conversions_count: 0 } }),
                }),
              }),
              update: () => ({
                eq: async () => ({ error: null }),
              }),
            };
          }
          if (table === "referral_events") {
            return {
              insert: async () => ({ error: null }),
            };
          }
          if (table === "profiles") {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: { full_name: "Test Organiser" } }),
                }),
              }),
            };
          }
          return {};
        },
      };

      const res = await recordReferralConversion("referee-1", "pay_test_123", 499, "starter", mockAdmin);
      expect(res.recorded).toBe(true);
      expect(res.rewardCreated).toBe(true);

      expect(conversionInserted.gross_amount_paise).toBe(49900);
      expect(conversionInserted.discount_applied_paise).toBe(10000); // ₹100 discount applied
      expect(conversionInserted.net_amount_paise).toBe(39900);

      expect(rewardInserted.reward_amount_paise).toBe(15000); // ₹150 credit
      expect(rewardInserted.status).toBe("pending");

      // Verify hold_until is roughly 14 days in future
      const holdDate = new Date(rewardInserted.hold_until).getTime();
      const now = Date.now();
      const diffDays = Math.round((holdDate - now) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(14);
    });

    it("respects monthly cap of 10 rewards per referring organisation", async () => {
      let rewardCreated = false;

      const mockAdmin: any = {
        from: (table: string) => {
          if (table === "referral_conversions") {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: null }),
                }),
              }),
              insert: () => ({
                select: () => ({
                  single: async () => ({ data: { id: "conv-10" }, error: null }),
                }),
              }),
            };
          }
          if (table === "referral_attributions") {
            return {
              select: () => ({
                eq: () => ({
                  in: () => ({
                    maybeSingle: async () => ({
                      data: {
                        id: "attr-10",
                        code_id: "code-1",
                        referrer_user_id: "referrer-1",
                        referee_user_id: "referee-10",
                      },
                    }),
                  }),
                }),
              }),
              update: () => ({
                eq: async () => ({ error: null }),
              }),
            };
          }
          if (table === "referral_rewards") {
            return {
              select: () => ({
                eq: () => ({
                  gte: () => ({
                    in: async () => ({ count: 10 }), // Already reached 10 rewards this month!
                  }),
                }),
              }),
              insert: () => {
                rewardCreated = true;
                return {
                  select: () => ({
                    single: async () => ({ data: { id: "reward-overflow" } }),
                  }),
                };
              },
            };
          }
          if (table === "referral_codes") {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: { id: "code-1", conversions_count: 10 } }),
                }),
              }),
              update: () => ({
                eq: async () => ({ error: null }),
              }),
            };
          }
          return {};
        },
      };

      const res = await recordReferralConversion("referee-10", "pay_test_cap", 999, "pro", mockAdmin);
      expect(res.recorded).toBe(true);
      expect(res.rewardCreated).toBe(false); // Reward creation blocked by monthly cap of 10
      expect(rewardCreated).toBe(false);
    });
  });

  describe("5. Maturation & Ledger Operations", () => {
    it("matures rewards past 14-day hold into spendable credit ledger entries", async () => {
      let ledgerEntry: any = null;
      let statusUpdatedTo: string | null = null;

      const mockAdmin: any = {
        from: (table: string) => {
          if (table === "referral_rewards") {
            return {
              select: () => ({
                eq: () => ({
                  lte: async () => ({
                    data: [
                      {
                        id: "rew-matured",
                        referrer_user_id: "user-abc",
                        reward_amount_paise: 15000,
                        attribution_id: "attr-abc",
                        status: "pending",
                        currency: "INR",
                      },
                    ],
                    error: null,
                  }),
                }),
              }),
              update: (data: any) => {
                statusUpdatedTo = data.status;
                return {
                  eq: async () => ({ error: null }),
                };
              },
            };
          }
          if (table === "referral_credit_transactions") {
            return {
              select: () => ({
                eq: () => ({
                  order: () => ({
                    limit: () => ({
                      maybeSingle: async () => ({ data: { balance_after_paise: 30000 } }), // Currently ₹300
                    }),
                  }),
                }),
              }),
              insert: async (tx: any) => {
                ledgerEntry = tx;
                return { error: null };
              },
            };
          }
          if (table === "referral_events") {
            return {
              insert: async () => ({ error: null }),
            };
          }
          if (table === "profiles") {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: { full_name: "Test Organiser" } }),
                }),
              }),
            };
          }
          return {};
        },
      };

      const res = await maturePendingReferralRewards(mockAdmin);
      expect(res.maturedCount).toBe(1);
      expect(statusUpdatedTo).toBe("available");
      expect(ledgerEntry).not.toBeNull();
      expect(ledgerEntry.entry_type).toBe("credit_matured");
      expect(ledgerEntry.amount_paise).toBe(15000); // ₹150 added
      expect(ledgerEntry.balance_after_paise).toBe(45000); // 30000 + 15000 = ₹450
    });

    it("applies spendable credits to invoices while strictly preventing cash withdrawal", async () => {
      let deductionEntry: any = null;

      const mockAdmin: any = {
        from: (table: string) => {
          if (table === "referral_credit_transactions") {
            return {
              select: () => ({
                eq: () => ({
                  order: () => ({
                    limit: () => ({
                      maybeSingle: async () => ({ data: { balance_after_paise: 45000 } }), // ₹450 available
                    }),
                  }),
                }),
              }),
              insert: async (tx: any) => {
                deductionEntry = tx;
                return { error: null };
              },
            };
          }
          return {};
        },
      };

      // User has ₹450 credits, invoice is ₹499
      const res = await applyReferralCreditToInvoice("user-abc", 499, "inv-001", mockAdmin);
      expect(res.discountAppliedRupees).toBe(450); // Fully consumed
      expect(res.remainingBalanceRupees).toBe(0);
      expect(deductionEntry.entry_type).toBe("credit_redeemed");
      expect(deductionEntry.amount_paise).toBe(45000);
      expect(deductionEntry.balance_after_paise).toBe(0);
    });
  });
});
