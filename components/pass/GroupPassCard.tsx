"use client";

import React from "react";
import { GroupPassRecord, GroupMember } from "@/lib/passes/group-passes";
import { Users, CheckCircle2, Circle, QrCode, Shield, Calendar, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface GroupPassCardProps {
  passRecord: GroupPassRecord;
  onCheckInAll?: () => void;
  onCheckInMember?: (index: number) => void;
  isStaffMode?: boolean;
}

export function GroupPassCard({
  passRecord,
  onCheckInAll,
  onCheckInMember,
  isStaffMode = false,
}: GroupPassCardProps) {
  const isFullyCheckedIn = passRecord.checkedInGuests >= passRecord.totalGuests;
  const isPartiallyCheckedIn = passRecord.checkedInGuests > 0 && !isFullyCheckedIn;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-white max-w-md mx-auto space-y-6 relative overflow-hidden">
      {/* Decorative top accent glow */}
      <div className="absolute -top-16 -left-16 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Pass Badge Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Shield className="w-3.5 h-3.5" />
            {passRecord.passName}
          </span>
          <h2 className="text-xl font-black text-white mt-1.5">{passRecord.passName}</h2>
        </div>

        <div className="text-right">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
              isFullyCheckedIn
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : isPartiallyCheckedIn
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            }`}
          >
            {isFullyCheckedIn
              ? "ALL CHECKED IN"
              : isPartiallyCheckedIn
              ? "PARTIAL ENTRY"
              : "VALID PASS"}
          </span>
        </div>
      </div>

      {/* Pass Details Summary */}
      <div className="grid grid-cols-2 gap-3 bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block font-medium">Pass Holder</span>
          <span className="text-white font-bold text-sm truncate block mt-0.5">
            {passRecord.primaryContact.name}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block font-medium">Pass Capacity</span>
          <span className="text-purple-300 font-bold text-sm block mt-0.5">
            {passRecord.totalGuests} {passRecord.totalGuests === 1 ? "Person" : "People"}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block font-medium">Pass Duration</span>
          <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            {passRecord.duration}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block font-medium">Check-In Status</span>
          <span className="text-white font-semibold mt-0.5 block">
            {passRecord.checkedInGuests} / {passRecord.totalGuests} Admitted
          </span>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
        <QRCodeSVG
          value={passRecord.qrCodePayload}
          size={180}
          level="H"
          includeMargin={false}
          className="rounded-lg"
        />
        <div className="mt-2 text-center text-[11px] font-mono text-slate-800 font-bold tracking-wide">
          {passRecord.passToken.toUpperCase()}
        </div>
      </div>

      {/* Member Roster */}
      {passRecord.members && passRecord.members.length > 0 && (
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Group Members ({passRecord.members.length})</span>
            <span>{passRecord.checkedInGuests}/{passRecord.totalGuests} Present</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {passRecord.members.map((member: GroupMember, idx: number) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                  member.checkedIn
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : "bg-slate-900/60 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-slate-500 font-mono text-[11px]">#{idx + 1}</span>
                  <span className="font-medium text-white">{member.name}</span>
                  {member.role === "primary" && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                      Primary
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {member.checkedIn ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                    </span>
                  ) : isStaffMode && onCheckInMember ? (
                    <button
                      type="button"
                      onClick={() => onCheckInMember(idx)}
                      className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-medium text-[11px]"
                    >
                      Admit
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Circle className="w-3 h-3" /> Not Checked In
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Check-In Action Button */}
      {isStaffMode && !isFullyCheckedIn && onCheckInAll && (
        <button
          type="button"
          onClick={onCheckInAll}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Check In All {passRecord.totalGuests - passRecord.checkedInGuests} Remaining
        </button>
      )}
    </div>
  );
}
