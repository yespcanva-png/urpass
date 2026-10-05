"use client";

import React, { useState, useMemo } from "react";
import {
  GroupPassConfig,
  calculateGroupPassPrice,
  sanitizeGroupMembers,
  GroupMember,
} from "@/lib/passes/group-passes";
import { Users, Plus, Trash2, ShieldCheck, Ticket, Calendar } from "lucide-react";

interface GroupPassSelectorProps {
  passConfig: GroupPassConfig;
  onProceed?: (data: {
    passConfig: GroupPassConfig;
    numberOfPeople: number;
    primaryContact: { name: string; email: string; phone: string };
    members: GroupMember[];
    pricing: ReturnType<typeof calculateGroupPassPrice>;
  }) => void;
  disabled?: boolean;
}

export function GroupPassSelector({
  passConfig,
  onProceed,
  disabled = false,
}: GroupPassSelectorProps) {
  const [peopleCount, setPeopleCount] = useState<number>(passConfig.includedGuests);
  const [primaryName, setPrimaryName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [memberNames, setMemberNames] = useState<string[]>([]);

  // Calculate pricing dynamically based on current peopleCount
  const pricing = useMemo(() => {
    return calculateGroupPassPrice(passConfig, peopleCount);
  }, [passConfig, peopleCount]);

  const minAllowed = passConfig.minGuests;
  const maxAllowed = passConfig.maxGuests;

  const handleIncrement = () => {
    if (peopleCount < maxAllowed) {
      const nextCount = peopleCount + 1;
      setPeopleCount(nextCount);
      // Auto-expand member input array if needed
      if (nextCount > 1 && memberNames.length < nextCount - 1) {
        setMemberNames((prev) => [...prev, ""]);
      }
    }
  };

  const handleDecrement = () => {
    if (peopleCount > minAllowed) {
      const nextCount = peopleCount - 1;
      setPeopleCount(nextCount);
      setMemberNames((prev) => prev.slice(0, Math.max(0, nextCount - 1)));
    }
  };

  const handleMemberNameChange = (index: number, val: string) => {
    setMemberNames((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const handleRemoveExtraMember = (index: number) => {
    if (peopleCount > minAllowed) {
      setPeopleCount((prev) => prev - 1);
      setMemberNames((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddMember = () => {
    handleIncrement();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryName.trim() || !primaryEmail.trim()) {
      return;
    }

    const additionalMembers = memberNames.map((name) => ({ name }));
    const sanitized = sanitizeGroupMembers(
      { name: primaryName, email: primaryEmail, phone: primaryPhone },
      additionalMembers,
      peopleCount
    );

    if (onProceed) {
      onProceed({
        passConfig,
        numberOfPeople: peopleCount,
        primaryContact: {
          name: primaryName.trim(),
          email: primaryEmail.trim(),
          phone: primaryPhone.trim(),
        },
        members: sanitized,
        pricing,
      });
    }
  };

  const neededAdditionalCount = Math.max(0, peopleCount - 1);

  return (
    <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-6 shadow-xl text-white max-w-xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-start justify-between border-b border-purple-500/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>Group & Family Pass</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {passConfig.name} — {passConfig.duration}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Includes up to {passConfig.includedGuests} {passConfig.includedGuests === 1 ? "person" : "people"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-purple-300">
            ₹{passConfig.basePrice.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-400">Base Pass Price</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* People Counter */}
        {passConfig.allowExtraGuests && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-slate-200">Number of people</div>
              <div className="text-xs text-purple-400/90 mt-0.5">
                ₹{passConfig.extraGuestPrice} for each additional person beyond {passConfig.includedGuests}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-lg p-1">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || peopleCount <= minAllowed}
                aria-label="Decrease guest count"
                className="w-8 h-8 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-lg font-bold text-slate-200 transition-colors"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-base text-white">{peopleCount}</span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || peopleCount >= maxAllowed}
                aria-label="Increase guest count"
                className="w-8 h-8 rounded-md bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-lg font-bold text-white transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Primary Contact Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Primary Contact (Pass Holder)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={primaryName}
                onChange={(e) => setPrimaryName(e.target.value)}
                placeholder="e.g. Srinithin"
                disabled={disabled}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={primaryEmail}
                onChange={(e) => setPrimaryEmail(e.target.value)}
                placeholder="srinithin@example.com"
                disabled={disabled}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                placeholder="+91 98765 43210"
                disabled={disabled}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Additional Member Names */}
        {neededAdditionalCount > 0 && (
          <div className="space-y-3 border-t border-slate-800/80 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">
                Additional Group Members ({neededAdditionalCount})
              </h3>
              {passConfig.allowExtraGuests && peopleCount < maxAllowed && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={disabled}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another member (₹{passConfig.extraGuestPrice})
                </button>
              )}
            </div>

            <div className="space-y-2">
              {Array.from({ length: neededAdditionalCount }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-7 text-xs text-slate-500 font-medium text-center">
                    #{idx + 2}
                  </div>
                  <input
                    type="text"
                    value={memberNames[idx] || ""}
                    onChange={(e) => handleMemberNameChange(idx, e.target.value)}
                    placeholder={`Member ${idx + 2} Name`}
                    disabled={disabled}
                    className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  {passConfig.allowExtraGuests && peopleCount > minAllowed && idx >= passConfig.includedGuests - 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExtraMember(idx)}
                      disabled={disabled}
                      aria-label={`Remove Member ${idx + 2}`}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Breakdown Ledger */}
        <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Pass Price ({passConfig.name} — {passConfig.duration})</span>
            <span className="text-slate-200">₹{pricing.basePrice.toLocaleString("en-IN")}</span>
          </div>

          {pricing.extraGuestsCount > 0 && (
            <div className="flex justify-between text-xs text-slate-400">
              <span>
                Extra Guests ({pricing.extraGuestsCount} × ₹{pricing.extraGuestPrice})
              </span>
              <span className="text-purple-300">
                +₹{pricing.extraGuestsTotal.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <div className="border-t border-purple-500/20 pt-2 flex justify-between items-baseline font-bold">
            <span className="text-sm text-white">Total Amount</span>
            <span className="text-xl text-purple-300">
              ₹{pricing.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800/60 mt-1">
            <span>Pass Capacity: <strong className="text-white">{pricing.capacityUnitsConsumed} attendees</strong></span>
            <span>Ticket Quantity: <strong className="text-white">1 Pass</strong></span>
          </div>
        </div>

        {/* Submit / Continue Button */}
        <button
          type="submit"
          disabled={disabled || !primaryName.trim() || !primaryEmail.trim()}
          className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          Continue to Pass Confirmation (₹{pricing.totalAmount})
        </button>
      </form>
    </div>
  );
}
