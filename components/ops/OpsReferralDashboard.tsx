"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gift,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowLeft,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { opsMatureRewardsAction, opsReverseRewardAction } from "@/app/actions/ops-referrals";

interface Props {
  initialData: {
    metrics: {
      totalCodes: number;
      totalSignups: number;
      totalConversions: number;
      pendingLiabilityRupees: number;
      availableLiabilityRupees: number;
    };
    rewards: any[];
    fraudFlags: any[];
    topCodes: any[];
  };
}

export default function OpsReferralDashboard({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const handleRunMaturation = async () => {
    setLoading(true);
    setActionMsg("");
    try {
      const res = await opsMatureRewardsAction();
      if ("success" in res && res.success) {
        setActionMsg(`✅ Successfully matured ${res.maturedCount} pending reward(s).`);
      } else {
        setActionMsg("⚠️ Error running maturation.");
      }
    } catch {
      setActionMsg("❌ Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const handleReverse = async (rewardId: string) => {
    const reason = prompt("Enter reversal reason (e.g., chargeback, duplicate account):");
    if (!reason) return;

    setLoading(true);
    try {
      const res = await opsReverseRewardAction(rewardId, reason);
      if (res.success) {
        setActionMsg("✅ Reward reversed and audit entry logged.");
        setData((prev) => ({
          ...prev,
          rewards: prev.rewards.map((r) =>
            r.id === rewardId ? { ...r, status: "reversed", reversal_reason: reason } : r
          ),
        }));
      } else {
        alert(res.error || "Failed to reverse");
      }
    } catch {
      alert("Error executing reversal");
    } finally {
      setLoading(false);
    }
  };

  const { metrics, rewards, fraudFlags, topCodes } = data;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/ops"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors border border-neutral-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400" />
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Refer &amp; Earn Control Plane
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-950 text-purple-300 border border-purple-800">
                  V1 Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Monitor referral codes, 14-day hold maturation, fraud alerts, and credit liabilities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunMaturation}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Run 14-Day Maturation Job
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono">
            {actionMsg}
          </div>
        )}

        {/* 1. Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="text-[11px] font-mono uppercase text-neutral-400 mb-1">Active Codes</div>
            <div className="text-2xl font-bold text-white">{metrics.totalCodes}</div>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="text-[11px] font-mono uppercase text-neutral-400 mb-1">Attributed Signups</div>
            <div className="text-2xl font-bold text-white">{metrics.totalSignups}</div>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="text-[11px] font-mono uppercase text-neutral-400 mb-1">Paid Conversions</div>
            <div className="text-2xl font-bold text-emerald-400">{metrics.totalConversions}</div>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="text-[11px] font-mono uppercase text-neutral-400 mb-1">Pending Hold Liability</div>
            <div className="text-2xl font-bold text-amber-400">₹{metrics.pendingLiabilityRupees}</div>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="text-[11px] font-mono uppercase text-neutral-400 mb-1">Spendable Credit Liability</div>
            <div className="text-2xl font-bold text-purple-400">₹{metrics.availableLiabilityRupees}</div>
          </div>
        </div>

        {/* 2. Fraud & Security Alerts */}
        {fraudFlags.length > 0 && (
          <div className="bg-neutral-900/90 border border-red-900/40 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 text-red-400 font-semibold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Fraud &amp; Abuse Flags ({fraudFlags.length})</span>
            </div>
            <div className="divide-y divide-neutral-800 text-xs font-mono">
              {fraudFlags.map((flag) => (
                <div key={flag.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-red-400 font-bold uppercase">{flag.flag_type}</span>
                    <span className="text-neutral-500 ml-2">User: {flag.referrer_user_id}</span>
                    {flag.details?.reason && (
                      <span className="text-neutral-400 ml-2">({flag.details.reason})</span>
                    )}
                  </div>
                  <span className="text-neutral-500">
                    {new Date(flag.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Recent Rewards Table */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-neutral-800 font-semibold text-sm flex items-center justify-between">
            <span>Recent Rewards &amp; Hold Status</span>
            <span className="text-xs text-neutral-500 font-mono">14-Day Hold Enforcement</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-3">Reward ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Hold Until</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {rewards.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-800/40">
                    <td className="p-3 text-neutral-400">{r.id.slice(0, 8)}...</td>
                    <td className="p-3 font-bold text-white">₹{Math.round(r.reward_amount_paise / 100)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          r.status === "available"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : r.status === "pending"
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : "bg-red-950 text-red-400 border border-red-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-400">
                      {new Date(r.hold_until).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-neutral-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      {r.status !== "reversed" && (
                        <button
                          onClick={() => handleReverse(r.id)}
                          className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 text-[10px]"
                        >
                          Reverse
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Top Referral Codes */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-neutral-800 font-semibold text-sm">
            Top Referral Codes
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Signups</th>
                  <th className="p-3">Conversions</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {topCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-neutral-800/40">
                    <td className="p-3 font-bold text-purple-400">{code.code}</td>
                    <td className="p-3 text-neutral-300">{code.clicks_count}</td>
                    <td className="p-3 text-neutral-300">{code.signups_count}</td>
                    <td className="p-3 font-bold text-emerald-400">{code.conversions_count}</td>
                    <td className="p-3 text-neutral-500">
                      {new Date(code.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
