"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gift,
  Copy,
  Check,
  Share2,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import type { ReferralDashboardData } from "@/lib/referrals/types";

interface Props {
  initialData: ReferralDashboardData;
}

export default function ReferralDashboardClient({ initialData }: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const { referralCode, referralUrl, stats, recentActivity } = initialData;

  const inviteMessage = `Hey! I'm using UrPass for event registrations and lightning-fast QR ticketing. Use my invite link to get ₹100 off your first paid event plan: ${referralUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(inviteMessage);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(inviteMessage);
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  const faqs = [
    {
      q: "How does the 'Give ₹100, Get ₹150' reward work?",
      a: "When a new organiser signs up using your invite link, they receive ₹100 off their first eligible paid plan purchase (minimum ₹499 plan value). Once their payment settles, you receive ₹150 in UrPass billing credits following a standard 14-day hold.",
    },
    {
      q: "Which purchases qualify for rewards?",
      a: "First-time purchases of any UrPass paid plan (Starter, Pro, Business, or Enterprise passes with a value of ₹499 or higher) qualify. Free plans, ₹29 trial promos, and refunded payments are excluded.",
    },
    {
      q: "Why is there a 14-day hold on earned credits?",
      a: "The 14-day verification hold protects the community against chargebacks and payment disputes. Once the hold concludes, your credits automatically mature and appear in your Available balance.",
    },
    {
      q: "How can I spend my UrPass credits?",
      a: "Your available credits automatically discount your future UrPass subscription invoices. Referral credits cannot be withdrawn as cash or transferred to bank accounts.",
    },
    {
      q: "Is there a limit on how many organisers I can refer?",
      a: "You can refer as many organisers as you like! To maintain platform safety, an organisation can earn up to 10 approved referral rewards per calendar month (up to ₹1,500/month). Unmatured referrals beyond this cap continue counting toward your referral community.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-purple-900 to-neutral-900 text-white p-8 md:p-10 shadow-xl border border-violet-800/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Gift className="w-3.5 h-3.5" />
            UrPass Refer &amp; Earn
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Give ₹100. Get ₹150.
          </h1>
          <p className="text-base md:text-lg text-violet-100/90 leading-relaxed">
            Invite fellow event organizers. Your friend gets{" "}
            <span className="text-amber-300 font-semibold">₹100 off</span> their first paid plan,
            and you earn{" "}
            <span className="text-emerald-300 font-semibold">₹150 in credits</span> for every
            qualifying event launched.
          </p>
        </div>

        {/* Share Bar */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1 flex items-center bg-black/40 border border-white/15 rounded-2xl px-4 py-2.5 backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider text-violet-300 font-mono font-semibold mr-3 shrink-0">
              YOUR LINK:
            </span>
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="w-full bg-transparent text-sm text-white font-mono outline-none truncate"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-neutral-950 font-semibold text-sm hover:bg-neutral-100 transition-colors shadow-sm"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? "Copied!" : "Copy Link"}
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </button>

            <button
              onClick={handleCopyMessage}
              title="Copy pre-composed invite text"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/10 shrink-0"
            >
              {copiedMsg ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Signups */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Signups</span>
            <Users className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-neutral-900">
            {stats.totalSignups}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Organisers joined via link</p>
        </div>

        {/* Paid Referrals */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Paid Referrals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-neutral-900">
            {stats.paidReferrals}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Subscribed to eligible plans</p>
        </div>

        {/* Pending Credits */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Credits</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-neutral-900">
            ₹{stats.pendingCreditsRupees}
          </div>
          <p className="text-xs text-amber-600 font-medium mt-1">In 14-day hold period</p>
        </div>

        {/* Available Credits */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Credits</span>
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-600">
            ₹{stats.availableCreditsRupees}
          </div>
          <p className="text-xs text-neutral-500 mt-1">Applied to your next bill</p>
        </div>
      </div>

      {/* Monthly Cap Callout */}
      <div className="flex items-center justify-between bg-violet-50/70 border border-violet-100 rounded-2xl px-5 py-3 text-xs text-violet-950">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-600 shrink-0" />
          <span>
            <strong>Monthly Reward Cap:</strong> You have earned{" "}
            <strong>{stats.monthlyRewardCount}</strong> of <strong>{stats.monthlyRewardCap}</strong>{" "}
            approved rewards this calendar month.
          </span>
        </div>
        <Link
          href="/billing"
          className="font-semibold text-violet-700 hover:text-violet-900 shrink-0 inline-flex items-center gap-1"
        >
          View Billing <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 3. How It Works (3 Steps) */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8">
        <h2 className="text-lg font-bold text-neutral-900 mb-6">How UrPass Refer &amp; Earn Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="flex-none w-9 h-9 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 mb-1">Share your invite</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Send your unique referral link to colleges, conferences, or independent organizers.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-none w-9 h-9 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 mb-1">They host &amp; save ₹100</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                They register, build their event, and save ₹100 off their first eligible plan purchase
                (≥ ₹499).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-none w-9 h-9 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 mb-1">You earn ₹150 credit</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                After a 14-day hold, ₹150 credit is deposited directly into your UrPass billing balance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Referrals Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Recent Referrals</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Activity is privacy-masked in compliance with data privacy standards.
            </p>
          </div>
          <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg">
            {recentActivity.length} Total
          </span>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">No referrals yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              Share your permanent link with fellow organisers to start earning ₹150 in UrPass credits!
            </p>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold text-xs hover:bg-violet-700 transition-colors shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Your Link
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 text-neutral-500 font-medium border-b border-neutral-100">
                <tr>
                  <th className="py-3 px-6">Organiser</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Milestone</th>
                  <th className="py-3 px-6 text-right">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-neutral-900">
                      {item.refereeMaskedName}
                    </td>
                    <td className="py-3.5 px-6 text-neutral-500">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.status === "available"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "pending_hold"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : item.status === "activated"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : item.status === "reversed"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                        }`}
                      >
                        {item.status === "pending_hold" && <Clock className="w-3 h-3" />}
                        {item.status === "available" && <Check className="w-3 h-3" />}
                        {item.statusLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-semibold text-neutral-900">
                      {item.rewardAmountRupees ? (
                        <span className="text-emerald-600">+₹{item.rewardAmountRupees}</span>
                      ) : (
                        <span className="text-neutral-400">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. FAQs & Terms */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8">
        <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-600" />
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-neutral-100">
          {faqs.map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-semibold text-sm text-neutral-900 hover:text-violet-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-neutral-600 leading-relaxed pr-8">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-neutral-100 text-xs text-neutral-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <span>
            Referral terms: Minimum purchase ₹499. Maximum 10 rewards/month. Credits valid for 12 months.
          </span>
          <Link
            href="/terms"
            className="text-violet-600 hover:text-violet-700 font-medium inline-flex items-center gap-1"
          >
            Terms of Service <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
