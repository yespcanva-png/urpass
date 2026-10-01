"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Info,
  HelpCircle,
  Building2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { saveEventPaymentConfigAction } from "@/app/actions/managed-payments";
import { calculateTicketFees, formatINR } from "@/lib/payments/fees";
import type { EventPaymentConfig, FeeBearer, PaymentMode, RefundPolicy } from "@/lib/payments/types";

interface EventPaymentConfigFormProps {
  eventId: string;
  initialConfig?: EventPaymentConfig | null;
  sampleTicketPrice?: number;
  linkedAccountDisplay?: string;
}

export default function EventPaymentConfigForm({
  eventId,
  initialConfig,
  sampleTicketPrice = 1000,
  linkedAccountDisplay = "YESP Events Pvt Ltd ••••4321",
}: EventPaymentConfigFormProps) {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(
    initialConfig?.paymentMode || "URPASS_MANAGED"
  );
  const [feeBearer, setFeeBearer] = useState<FeeBearer>(
    initialConfig?.feeBearer || "ATTENDEE"
  );
  const [refundPolicy, setRefundPolicy] = useState<RefundPolicy>(
    initialConfig?.refundPolicy || "ORGANIZER_DISCRETION"
  );
  const [ticketPrice, setTicketPrice] = useState<number>(sampleTicketPrice);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Calculate live sample fees
  const sampleFees = calculateTicketFees({
    basePrice: ticketPrice,
    feeBearer,
    platformFeePercent: 2.0,
    gatewayFeePercent: 2.0,
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage("");

    try {
      const res = await saveEventPaymentConfigAction({
        eventId,
        paymentMode,
        feeBearer,
        refundPolicy,
        platformFeePercent: 2.0,
        gatewayFeePercent: 2.0,
      });

      if (res.error) {
        setStatusMessage(res.error);
      } else {
        setStatusMessage("Event payment architecture saved successfully.");
      }
    } catch {
      setStatusMessage("Failed to save event payment settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs max-w-2xl text-neutral-900">
      <div>
        <h4 className="text-base font-bold text-neutral-950">Paid Ticketing & Settlement</h4>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure how ticket payments are collected, who pays platform fees, and refund policy rules.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-neutral-100 text-xs text-neutral-800 font-medium">
          {statusMessage}
        </div>
      )}

      {/* ── 1. Payment Collection Mode ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-800 block">
          Payment Collection Method
        </label>
        <div className="space-y-2">
          <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 cursor-pointer">
            <input
              type="radio"
              name="paymentMode"
              checked={paymentMode === "URPASS_MANAGED"}
              onChange={() => setPaymentMode("URPASS_MANAGED")}
              className="mt-0.5"
            />
            <div>
              <span className="text-xs font-semibold text-neutral-900 block">
                URPASS Managed Payments (Recommended)
              </span>
              <span className="text-[11px] text-neutral-500 block leading-relaxed">
                Automated Route split settlements straight into your verified bank account. Zero manual wire transfers.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 cursor-pointer">
            <input
              type="radio"
              name="paymentMode"
              checked={paymentMode === "ORGANIZER_GATEWAY"}
              onChange={() => setPaymentMode("ORGANIZER_GATEWAY")}
              className="mt-0.5"
            />
            <div>
              <span className="text-xs font-semibold text-neutral-900 block">
                My Payment Gateway (Direct Merchant)
              </span>
              <span className="text-[11px] text-neutral-500 block leading-relaxed">
                Collect directly through your connected Razorpay/Cashfree merchant credentials.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* ── 2. Fee Bearer Configuration ── */}
      <div className="space-y-2 pt-2 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-800 block">
            Who pays URPASS service & gateway fee?
          </label>
          <span className="text-[11px] font-mono text-neutral-400">2% + 2%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFeeBearer("ATTENDEE")}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              feeBearer === "ATTENDEE"
                ? "border-neutral-900 bg-neutral-50 font-semibold"
                : "border-neutral-200 bg-white hover:bg-neutral-50/60"
            }`}
          >
            <span className="block text-neutral-900">Attendee Pays</span>
            <span className="text-[10px] text-neutral-500 font-normal">
              Ticket + ₹40 fee added to checkout
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFeeBearer("ORGANIZER")}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              feeBearer === "ORGANIZER"
                ? "border-neutral-900 bg-neutral-50 font-semibold"
                : "border-neutral-200 bg-white hover:bg-neutral-50/60"
            }`}
          >
            <span className="block text-neutral-900">Organizer Absorbs</span>
            <span className="text-[10px] text-neutral-500 font-normal">
              Fees deducted from gross sale
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFeeBearer("SPLIT")}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              feeBearer === "SPLIT"
                ? "border-neutral-900 bg-neutral-50 font-semibold"
                : "border-neutral-200 bg-white hover:bg-neutral-50/60"
            }`}
          >
            <span className="block text-neutral-900">Split (50 / 50)</span>
            <span className="text-[10px] text-neutral-500 font-normal">
              Platform fee to user, gateway to org
            </span>
          </button>
        </div>

        {/* Live Calculation Preview Box */}
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5 font-mono">
          <div className="flex justify-between text-neutral-600">
            <span>Sample Base Ticket:</span>
            <span>{formatINR(sampleFees.basePrice)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Customer Pays at Checkout:</span>
            <span className="font-bold text-neutral-900">{formatINR(sampleFees.attendeeTotalPayable)}</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-neutral-200">
            <span>Organizer Net Settlement Share:</span>
            <span>{formatINR(sampleFees.organizerNetShare)}</span>
          </div>
        </div>
      </div>

      {/* ── 3. Refund Policy ── */}
      <div className="space-y-2 pt-2 border-t border-neutral-100">
        <label className="text-xs font-semibold text-neutral-800 block">
          Refund Policy
        </label>
        <select
          value={refundPolicy}
          onChange={(e) => setRefundPolicy(e.target.value as RefundPolicy)}
          className="w-full h-10 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
        >
          <option value="ORGANIZER_DISCRETION">Organizer Discretion (Case-by-case)</option>
          <option value="FLEXIBLE_24H">Flexible — 100% refund up to 24h before event</option>
          <option value="NON_REFUNDABLE">Non-Refundable — All ticket sales final</option>
        </select>
      </div>

      {/* ── 4. Settlement Account Status Preview ── */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
            SETTLEMENT DESTINATION
          </span>
          <span className="font-semibold text-neutral-900 block mt-0.5">
            {linkedAccountDisplay}
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">
          Daily T+2 Automatic Payout
        </span>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="h-10 px-5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-80"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save Payment Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
