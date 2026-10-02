"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Clock,
  Ticket,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { AccessRule, EventZone, AccessRuleType, BadgeRoleType } from "@/lib/physical-ops/types";

export default function AccessRulesPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [rules, setRules] = useState<AccessRule[]>([]);
  const [zones, setZones] = useState<EventZone[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // New Rule Form State
  const [ruleName, setRuleName] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [ruleType, setRuleType] = useState<AccessRuleType>("badge_type");
  const [allowedBadges, setAllowedBadges] = useState<BadgeRoleType[]>(["vip"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const loadData = () => {
    fetch(`/api/event/${eventId}/ops/zones`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.rules) setRules(d.rules);
          if (d.zones) {
            setZones(d.zones);
            if (d.zones.length > 0) setSelectedZoneId(d.zones[0].id);
          }
        }
      });
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleToggleBadge = (badge: BadgeRoleType) => {
    if (allowedBadges.includes(badge)) {
      setAllowedBadges(allowedBadges.filter((b) => b !== badge));
    } else {
      setAllowedBadges([...allowedBadges, badge]);
    }
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/event/${eventId}/ops/zones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "save_rule",
        rule: {
          name: ruleName,
          zoneId: selectedZoneId,
          ruleType,
          allowedBadgeTypes: allowedBadges,
          startTime,
          endTime,
          isActive: true,
        },
      }),
    });
    const data = await res.json();
    if (data.success && data.rule) {
      setRules((prev) => [...prev, data.rule]);
      setModalOpen(false);
      setRuleName("");
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    await fetch(`/api/event/${eventId}/ops/zones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "delete_rule", ruleId }),
    });
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleToggleActive = async (rule: AccessRule) => {
    const updated = { ...rule, isActive: !rule.isActive };
    await fetch(`/api/event/${eventId}/ops/zones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "save_rule", rule: updated }),
    });
    setRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-brand/10 text-brand rounded-full">
              STAGE 2 PHYSICAL OPS
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-medium">Sprint 5: Access Rules</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Zone Access &amp; Credential Rules
          </h1>
          <p className="text-sm text-neutral-500">
            Enforce granular entry criteria by badge type, ticket tier, session schedule, or operating hours.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Access Rule</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-4">Rule Name</th>
                <th className="py-3 px-4">Target Zone</th>
                <th className="py-3 px-4">Access Criteria</th>
                <th className="py-3 px-4">Schedule / Hours</th>
                <th className="py-3 px-4">Enforcement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No access rules defined. All zones currently operate on open entry mode.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => {
                  const targetZone = zones.find((z) => z.id === rule.zoneId);
                  return (
                    <tr key={rule.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        {rule.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-800">
                          {targetZone ? targetZone.name : "Assigned Zone"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {rule.allowedBadgeTypes && rule.allowedBadgeTypes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rule.allowedBadgeTypes.map((b) => (
                              <span
                                key={b}
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand/10 text-brand"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-neutral-500">Ticket Tier Match</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 font-mono text-[11px]">
                        {rule.startTime && rule.endTime
                          ? `${rule.startTime} - ${rule.endTime}`
                          : "All Event Hours"}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(rule)}
                          className="flex items-center gap-1.5 focus:outline-none"
                        >
                          {rule.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                              Disabled
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Rule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-900">Define Access Control Rule</h3>
            <p className="text-xs text-neutral-500">
              Scanners will immediately enforce this rule when checking attendees into the selected zone.
            </p>

            <form onSubmit={handleSaveRule} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Keynote VIP & Speaker Gate Clearance"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Target Zone *</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-brand/20"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} (Cap: {z.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Allowed Badge Types (Select all that apply)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["attendee", "vip", "speaker", "staff", "sponsor", "exhibitor"] as BadgeRoleType[]).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleToggleBadge(b)}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-semibold capitalize transition-all ${
                        allowedBadges.includes(b)
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-neutral-200 bg-white text-neutral-600"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Opens At</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Closes At</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand/90 shadow-xs"
                >
                  Save Access Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
