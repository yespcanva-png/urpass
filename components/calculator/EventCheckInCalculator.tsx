"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DoorOpen,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export default function EventCheckInCalculator() {
  const [attendees, setAttendees] = useState<number>(5000);
  const [gates, setGates] = useState<number>(5);
  const [scanTimeSeconds, setScanTimeSeconds] = useState<number>(1.0);
  const [targetTimeMinutes, setTargetTimeMinutes] = useState<number>(60);

  // Math:
  // Each scanner does: (60 / scanTimeSeconds) attendees per minute
  // Total current capacity per minute = gates * (60 / scanTimeSeconds)
  // Total capacity per hour = totalCapacityPerMin * 60
  const capacityPerMin = Math.round(gates * (60 / Math.max(0.1, scanTimeSeconds)));
  const capacityPerHour = capacityPerMin * 60;

  // Actual time needed to clear attendees with current setup (minutes)
  const actualMinutesNeeded = Math.ceil(attendees / Math.max(1, capacityPerMin));

  // Required capacity per minute to finish within targetTimeMinutes:
  const requiredCapacityPerMin = attendees / Math.max(1, targetTimeMinutes);
  // Scans per minute per scanner at current scan time:
  const scansPerMinPerScanner = 60 / Math.max(0.1, scanTimeSeconds);
  const totalScannersNeeded = Math.ceil(requiredCapacityPerMin / scansPerMinPerScanner);

  // Recommended gates & scanners per gate:
  const recommendedGates = Math.max(1, Math.min(gates, totalScannersNeeded));
  const recommendedScannersPerGate = Math.max(1, Math.ceil(totalScannersNeeded / recommendedGates));

  // URPASS speed comparison (<0.3s scan time, in-browser):
  const urpassScanTime = 0.3;
  const urpassCapacityPerMin = Math.round(gates * (60 / urpassScanTime));
  const urpassMinutesNeeded = Math.ceil(attendees / Math.max(1, urpassCapacityPerMin));

  // Risk status:
  const isSurgeRisk = actualMinutesNeeded > targetTimeMinutes;
  const isSevereRisk = actualMinutesNeeded > targetTimeMinutes * 1.5;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-neutral-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ScanLine className="w-3.5 h-3.5" />
                Gate Throughput &amp; Queue Science
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Event Check-In Speed &amp; Gate Calculator
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Calculate door entry capacity, bottleneck risks, and recommended gate staffing for large venues.
              </p>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-neutral-300 self-start sm:self-auto">
              Scan Speed: &lt;0.3s on URPASS
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              1. Venue Entry Parameters
            </h3>

            {/* Expected Attendees */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-neutral-800 mb-1.5">
                <label htmlFor="attendeesInput">Expected Attendees</label>
                <span className="font-mono text-brand font-bold">{attendees.toLocaleString()} attendees</span>
              </div>
              <input
                id="attendeesInput"
                type="number"
                min={100}
                max={50000}
                step={100}
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand mb-2"
              />
              <input
                type="range"
                min={500}
                max={20000}
                step={250}
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                className="w-full accent-brand cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 font-mono mt-1">
                <span>500</span>
                <span>5,000</span>
                <span>10,000</span>
                <span>20,000+</span>
              </div>
            </div>

            {/* Number of Gates */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-neutral-800 mb-1.5">
                <label htmlFor="gatesInput">Number of Active Entrance Gates</label>
                <span className="font-mono text-cyan-600 font-bold">{gates} gates</span>
              </div>
              <input
                id="gatesInput"
                type="range"
                min={1}
                max={20}
                step={1}
                value={gates}
                onChange={(e) => setGates(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 font-mono mt-1">
                <span>1 Gate</span>
                <span>5 Gates</span>
                <span>10 Gates</span>
                <span>20 Gates</span>
              </div>
            </div>

            {/* Average Scan Time */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-800">
                <label>Average Scan &amp; Verification Time</label>
                <span className="font-mono font-bold text-neutral-900">{scanTimeSeconds} seconds / person</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "URPASS (0.3s)", val: 0.3 },
                  { label: "Fast (1.0s)", val: 1.0 },
                  { label: "App (2.5s)", val: 2.5 },
                  { label: "Manual (5s)", val: 5.0 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setScanTimeSeconds(preset.val)}
                    className={`px-2 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                      scanTimeSeconds === preset.val
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={0.2}
                max={5.0}
                step={0.1}
                value={scanTimeSeconds}
                onChange={(e) => setScanTimeSeconds(Number(e.target.value))}
                className="w-full accent-neutral-800 cursor-pointer"
              />
            </div>

            {/* Target Entry Window */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 mb-1.5">
                <label htmlFor="targetTime">Target Queue Clearance Window</label>
                <span className="font-mono font-bold text-neutral-900">{targetTimeMinutes} minutes</span>
              </div>
              <input
                id="targetTime"
                type="range"
                min={15}
                max={180}
                step={15}
                value={targetTimeMinutes}
                onChange={(e) => setTargetTimeMinutes(Number(e.target.value))}
                className="w-full accent-neutral-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              2. Capacity &amp; Recommended Setup
            </h3>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-900 text-white rounded-2xl p-4">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">
                  Estimated Entry Capacity
                </span>
                <div className="text-2xl font-extrabold font-mono mt-1 text-white">
                  {capacityPerMin.toLocaleString()} / min
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  ({capacityPerHour.toLocaleString()} attendees/hour)
                </div>
              </div>

              <div className="bg-neutral-900 text-white rounded-2xl p-4">
                <span className="text-[11px] uppercase font-bold text-neutral-400 block">
                  Time to Clear Queue
                </span>
                <div
                  className={`text-2xl font-extrabold font-mono mt-1 ${
                    isSurgeRisk ? "text-amber-400" : "text-emerald-400"
                  }`}
                >
                  {actualMinutesNeeded} mins
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Target: {targetTimeMinutes} mins
                </div>
              </div>
            </div>

            {/* Recommendations Box */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-brand" />
                Staffing &amp; Gate Recommendations
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block">Recommended Gates:</span>
                  <span className="text-lg font-bold text-neutral-900 font-mono">
                    {recommendedGates} gates
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block">Scanners Per Gate:</span>
                  <span className="text-lg font-bold text-neutral-900 font-mono">
                    {recommendedScannersPerGate} scanner(s)
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-neutral-600 leading-relaxed">
                Total staff needed:{" "}
                <strong className="text-neutral-900 font-bold">
                  {recommendedGates * recommendedScannersPerGate} volunteer phone scanners
                </strong>{" "}
                to comfortably clear {attendees.toLocaleString()} attendees within {targetTimeMinutes} minutes.
              </div>
            </div>

            {/* Risk / Comparison Box */}
            {isSurgeRisk ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block mb-0.5">Queue Bottleneck Warning:</strong>
                  Your current scanning speed of {scanTimeSeconds}s will cause a queue delay of{" "}
                  {actualMinutesNeeded - targetTimeMinutes} extra minutes. Switching to URPASS sub-second optical scanning (<span className="font-bold">0.3s</span>) cuts clearance time down to{" "}
                  <span className="font-bold underline">{urpassMinutesNeeded} minutes</span> with zero venue hardware rentals.
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-emerald-900 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block mb-0.5">Safe Entry Flow:</strong>
                  Your gates can clear all attendees in {actualMinutesNeeded} minutes, well within your {targetTimeMinutes}-minute window.
                </div>
              </div>
            )}

            {/* Enterprise Lead Magnet Callout */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-2xl p-5 shadow-lg space-y-3">
              <h4 className="text-sm font-bold text-white">
                Running a {attendees.toLocaleString()}-person event?
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                URPASS multi-gate synchronization prevents duplicate entries across all doors with sub-0.3s browser camera scanning and live gate telemetry.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full bg-white text-neutral-900 py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-neutral-100 transition-colors"
              >
                <span>Talk to URPASS Enterprise →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
