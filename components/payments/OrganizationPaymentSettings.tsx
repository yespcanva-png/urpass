"use client";

import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Landmark,
  CreditCard,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { onboardOrganizationPaymentAccountAction } from "@/app/actions/managed-payments";
import type { OrganizationPaymentAccount, BusinessDetails, SettlementDetails } from "@/lib/payments/types";

interface OrganizationPaymentSettingsProps {
  orgId: string;
  initialAccount?: OrganizationPaymentAccount | null;
}

export default function OrganizationPaymentSettings({
  orgId,
  initialAccount,
}: OrganizationPaymentSettingsProps) {
  const [selectedMode, setSelectedMode] = useState<"managed" | "gateway">(
    initialAccount?.paymentsEnabled ? "managed" : "managed"
  );
  const [account, setAccount] = useState<OrganizationPaymentAccount | null>(initialAccount || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [country, setCountry] = useState<"IN" | "GB">(
    account?.businessDetails?.countryCode === "GB" || account?.settlementDetails?.countryCode === "GB" ? "GB" : "IN"
  );

  // Form State
  const [businessName, setBusinessName] = useState(account?.businessDetails?.legalBusinessName || "");
  const [businessType, setBusinessType] = useState<BusinessDetails["businessType"]>(
    account?.businessDetails?.businessType || "private_limited"
  );
  const [pan, setPan] = useState(account?.businessDetails?.pan || "");
  const [gstin, setGstin] = useState(account?.businessDetails?.gstin || "");
  const [companyNumber, setCompanyNumber] = useState(account?.businessDetails?.companyNumber || "");
  const [vatNumber, setVatNumber] = useState(account?.businessDetails?.vatNumber || "");
  const [contactEmail, setContactEmail] = useState(account?.businessDetails?.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(account?.businessDetails?.contactPhone || "");

  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [ifscCode, setIfscCode] = useState(account?.settlementDetails?.ifscCode || "");
  const [sortCode, setSortCode] = useState(account?.settlementDetails?.sortCode || "");
  const [beneficiaryName, setBeneficiaryName] = useState(account?.settlementDetails?.beneficiaryName || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (accountNumber && accountNumber !== confirmAccount) {
      setErrorMessage("Bank account numbers do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const masked = accountNumber
        ? `••••${accountNumber.slice(-4)}`
        : account?.settlementDetails?.accountNumberMasked || "••••4321";

      const res = await onboardOrganizationPaymentAccountAction(
        orgId,
        {
          legalBusinessName: businessName,
          businessType,
          pan: country === "IN" ? pan.toUpperCase() : undefined,
          gstin: country === "IN" ? (gstin.toUpperCase() || undefined) : undefined,
          companyNumber: country === "GB" ? companyNumber : undefined,
          vatNumber: country === "GB" ? (vatNumber.toUpperCase() || undefined) : undefined,
          contactEmail,
          contactPhone,
          countryCode: country,
        },
        {
          accountNumberMasked: masked,
          ifscCode: country === "IN" ? ifscCode.toUpperCase() : undefined,
          sortCode: country === "GB" ? sortCode.trim() : undefined,
          beneficiaryName,
          countryCode: country,
        },
        "RAZORPAY"
      );

      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.account) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAccount(res.account as any);
        setSuccessMessage("Settlement account configured and ready for marketplace collections.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred while saving payment settings.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-8 text-neutral-900">
      {/* ── 1. The Two Payment Modes Selector ── */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-neutral-950 tracking-tight">
            How would you like to collect payments?
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Choose your organization default payment architecture. You can also customize fee sharing per event.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Option 1: URPASS Managed Payments (Marketplace / Split) */}
          <div
            onClick={() => setSelectedMode("managed")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              selectedMode === "managed"
                ? "border-neutral-900 bg-neutral-50/60 shadow-xs"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Recommended
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Razorpay Route</span>
              </div>
              <h4 className="text-base font-bold text-neutral-950">URPASS Managed Payments</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We handle checkout, automated split-transfers directly to your bank account, attendee refunds, and compliance reconciliation.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-neutral-200/80 flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span>{account?.paymentsEnabled ? "Settlement Ready ✓" : "Set up Managed Payments"}</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {/* Option 2: Connect Your Payment Gateway */}
          <div
            onClick={() => setSelectedMode("gateway")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              selectedMode === "gateway"
                ? "border-neutral-900 bg-neutral-50/60 shadow-xs"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                  Direct Merchant
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Custom Keys</span>
              </div>
              <h4 className="text-base font-bold text-neutral-950">Connect Your Payment Gateway</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Connect your existing Razorpay or Cashfree merchant credentials. Ticket collections settle directly into your own merchant account.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-neutral-200/80 flex items-center justify-between text-xs font-semibold text-neutral-900">
              <span>Connect Gateway</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Active Settlement Readiness Status Banner ── */}
      {account?.paymentsEnabled && (
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-neutral-900">
                  Settlement Account Active & Verified
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                  {account.providerVendorId || "acc_route_ready"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Bank: {account.settlementDetails?.beneficiaryName} · {account.settlementDetails?.accountNumberMasked} (IFSC: {account.settlementDetails?.ifscCode})
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Automated Route Splits Enabled
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">T+2 Settlement Cycle</span>
          </div>
        </div>
      )}

      {/* ── 3. Onboarding & KYC Form ── */}
      {selectedMode === "managed" ? (
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="pb-4 border-b border-neutral-100">
            <h4 className="text-base font-bold text-neutral-950">
              Business & Settlement Onboarding
            </h4>
            <p className="text-xs text-neutral-500 mt-1">
              Marketplace regulations require verified settlement details before payouts. URPASS does not store raw banking credentials.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Country / Region Selector */}
          <div className="flex items-center gap-2 p-1.5 bg-neutral-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setCountry("IN")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                country === "IN"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              🇮🇳 India (INR / UPI / GST)
            </button>
            <button
              type="button"
              onClick={() => setCountry("GB")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                country === "GB"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              🇬🇧 United Kingdom (GBP / Sort Code / VAT)
            </button>
          </div>

          {/* Section A: Business Details */}
          <div className="space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>1. Business Entity Details ({country === "GB" ? "United Kingdom" : "India"})</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Legal Business / Organizer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={country === "GB" ? "e.g. London Tech Events Ltd" : "e.g. YESP Events Pvt Ltd"}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Entity Structure
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessDetails["businessType"])}
                  className="w-full h-10 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                >
                  {country === "GB" ? (
                    <>
                      <option value="private_limited">Private Limited Company (Ltd)</option>
                      <option value="llp">Limited Liability Partnership (LLP)</option>
                      <option value="individual">Sole Trader / Individual</option>
                      <option value="society">University Society / Student Union (SU)</option>
                      <option value="charity">Registered Charity / CIC</option>
                    </>
                  ) : (
                    <>
                      <option value="private_limited">Private Limited Company</option>
                      <option value="llp">Limited Liability Partnership (LLP)</option>
                      <option value="partnership">Partnership Firm</option>
                      <option value="individual">Sole Proprietorship / Individual</option>
                      <option value="society">College / Student Union / Society</option>
                    </>
                  )}
                </select>
              </div>

              {country === "GB" ? (
                <>
                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      Company Number <span className="text-neutral-400 font-normal">(Companies House - Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12345678"
                      value={companyNumber}
                      onChange={(e) => setCompanyNumber(e.target.value)}
                      className="w-full h-10 px-3 text-xs uppercase font-mono bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      VAT Number <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GB 123 4567 89"
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      className="w-full h-10 px-3 text-xs uppercase font-mono bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      Company PAN
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ABCDE1234F"
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                      className="w-full h-10 px-3 text-xs uppercase font-mono bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      GSTIN <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 29ABCDE1234F1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full h-10 px-3 text-xs uppercase font-mono bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Finance Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="finance@organization.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Authorized Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder={country === "GB" ? "+44 7123 456789" : "+91 98765 43210"}
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section B: Settlement Bank Account */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-neutral-400" />
              <span>2. Settlement Bank Account Details ({country === "GB" ? "UK Bank" : "Indian Bank"})</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Beneficiary Account Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Must match company bank records"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
              </div>

              {country === "GB" ? (
                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    UK Bank Sort Code (6 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20-00-00"
                    value={sortCode}
                    onChange={(e) => setSortCode(e.target.value)}
                    className="w-full h-10 px-3 text-xs uppercase font-mono bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC0000240"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full h-10 px-3 text-xs uppercase font-mono bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  {country === "GB" ? "UK Account Number (8 Digits)" : "Account Number"}
                </label>
                <input
                  type="password"
                  placeholder={account?.settlementDetails?.accountNumberMasked ? "Leave blank to keep existing account" : (country === "GB" ? "8-digit account number" : "Enter bank account number")}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Confirm Account Number
                </label>
                <input
                  type="text"
                  placeholder={country === "GB" ? "Re-enter 8-digit account number" : "Re-enter bank account number"}
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-neutral-400" />
              <span>Direct Route settlement · Encrypted transmission</span>
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-lg bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-medium text-xs flex items-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-80"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying with Razorpay Route...</span>
                </>
              ) : (
                <>
                  <span>Save & Enable Managed Payments</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Gateway Mode Notice */
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-600 space-y-3">
          <h4 className="text-sm font-bold text-neutral-900">Custom Gateway Configuration</h4>
          <p>
            When using your own payment gateway, ticket payments are collected into your own merchant account. You will receive direct settlements from your provider.
          </p>
          <p className="text-[11px] text-neutral-500">
            Configure your custom Key ID and Secret in Organization Settings → Direct Gateway.
          </p>
        </div>
      )}
    </div>
  );
}
