"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  Smartphone,
  Tablet,
  Printer,
  Shield,
  Plus,
  Trash2,
  Key,
  CheckCircle2,
  Wifi,
  BatteryCharging,
  Clock,
  Radio,
} from "lucide-react";
import { OpsStaffAssignment, OpsDevice, StaffRole } from "@/lib/physical-ops/types";

export default function StaffAndDevicesPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [activeTab, setActiveTab] = useState<"staff" | "devices">("staff");
  const [staffList, setStaffList] = useState<OpsStaffAssignment[]>([]);
  const [deviceList, setDeviceList] = useState<OpsDevice[]>([]);

  // Add staff modal
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState<StaffRole>("gate_scanner");
  const [stationName, setStationName] = useState("Gate A (Main Entrance)");

  const loadData = () => {
    fetch(`/api/event/${eventId}/ops/staff-devices`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.staff) setStaffList(d.staff);
          if (d.devices) setDeviceList(d.devices);
        }
      });
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/event/${eventId}/ops/staff-devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "save_staff",
        staff: {
          staffName,
          staffEmail,
          role: staffRole,
          gateName: stationName,
          pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
        },
      }),
    });
    const data = await res.json();
    if (data.success && data.staff) {
      setStaffList((prev) => [...prev, data.staff]);
      setStaffModalOpen(false);
      setStaffName("");
      setStaffEmail("");
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    await fetch(`/api/event/${eventId}/ops/staff-devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "delete_staff", staffId }),
    });
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
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
            <span className="text-xs text-neutral-500 font-medium">Sprint 8: Staff &amp; Devices</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Staff Assignments &amp; Scanner Terminals
          </h1>
          <p className="text-sm text-neutral-500">
            Provision volunteer PIN codes, map staff to entry gates, and monitor connected scanner devices in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
            <button
              onClick={() => setActiveTab("staff")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "staff"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Staff Assignments ({staffList.length})
            </button>
            <button
              onClick={() => setActiveTab("devices")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "devices"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Devices ({deviceList.length})</span>
            </button>
          </div>

          {activeTab === "staff" && (
            <button
              onClick={() => setStaffModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "staff" && (
        <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Gate / Station Assignment</th>
                  <th className="py-3 px-4">Scanner PIN</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {staff.staffName}
                      <span className="block text-[11px] text-neutral-400 font-normal">
                        {staff.staffEmail || "No email"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand">
                        {staff.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 font-medium">
                      {staff.gateName || staff.zoneName || "General Roaming"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-mono text-xs font-bold text-neutral-800">
                        {staff.pinCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "devices" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deviceList.map((dev) => (
            <div
              key={dev.id}
              className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                  {dev.deviceType === "tablet" ? (
                    <Tablet className="w-5 h-5 text-brand" />
                  ) : dev.deviceType === "printer_station" ? (
                    <Printer className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-900">{dev.deviceName}</h3>
                <p className="text-[11px] font-mono text-neutral-400 mt-0.5">{dev.deviceId}</p>
              </div>

              <div className="pt-3 border-t border-neutral-100 space-y-1 text-xs text-neutral-600">
                <p className="flex justify-between">
                  <span>Assigned Location:</span>
                  <strong className="text-neutral-900">{dev.assignedGateName || dev.assignedZoneName || "Unassigned"}</strong>
                </p>
                {dev.batteryLevel !== undefined && (
                  <p className="flex justify-between">
                    <span>Battery Level:</span>
                    <strong className="text-neutral-900">{dev.batteryLevel}%</strong>
                  </p>
                )}
                <p className="flex justify-between">
                  <span>App Version:</span>
                  <span className="font-mono text-neutral-500">v{dev.appVersion}</span>
                </p>
              </div>

              <div className="pt-2 text-[10px] text-neutral-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Last heartbeat: Just now</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff Modal */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-900">Assign Operations Staff</h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Email / Phone</label>
                <input
                  type="text"
                  placeholder="rahul@example.com"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Operational Role</label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value as StaffRole)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 bg-white"
                  >
                    <option value="gate_scanner">Gate Scanner</option>
                    <option value="zone_monitor">Zone Monitor</option>
                    <option value="registration_desk">Registration Desk</option>
                    <option value="badge_printer">Badge Printer</option>
                    <option value="session_coordinator">Session Coordinator</option>
                    <option value="help_desk">Help Desk</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Station / Location</label>
                  <input
                    type="text"
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand/90 shadow-xs"
                >
                  Provision &amp; Generate PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
