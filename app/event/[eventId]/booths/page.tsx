"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Plus,
  Trash2,
  Edit2,
  Building2,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { EventBooth, EventExhibitor, BoothStatus } from "@/lib/exhibitor-sponsor/types";

export default function BoothsManagementPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [booths, setBooths] = useState<EventBooth[]>([]);
  const [exhibitors, setExhibitors] = useState<EventExhibitor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hallFilter, setHallFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooth, setEditingBooth] = useState<EventBooth | null>(null);
  const [boothNumber, setBoothNumber] = useState("");
  const [hallName, setHallName] = useState("Hall 1 - Main Expo");
  const [sizeSqft, setSizeSqft] = useState(100);
  const [status, setStatus] = useState<BoothStatus>("available");
  const [assignedExhibitorId, setAssignedExhibitorId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    Promise.all([
      fetch(`/api/event/${eventId}/booths`).then((r) => r.json()),
      fetch(`/api/event/${eventId}/exhibitors`).then((r) => r.json()),
    ]).then(([boothData, exhData]) => {
      if (boothData.success && boothData.booths) setBooths(boothData.booths);
      if (exhData.success && exhData.exhibitors) setExhibitors(exhData.exhibitors);
    });
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleOpenAddModal = () => {
    setEditingBooth(null);
    setBoothNumber("");
    setHallName(halls[0] || "Hall 1 - Main Expo");
    setSizeSqft(100);
    setStatus("available");
    setAssignedExhibitorId("");
    setNotes("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (b: EventBooth) => {
    setEditingBooth(b);
    setBoothNumber(b.boothNumber);
    setHallName(b.hallName);
    setSizeSqft(b.sizeSqft);
    setStatus(b.status);
    setAssignedExhibitorId(b.assignedExhibitorId || "");
    setNotes(b.notes || "");
    setModalOpen(true);
  };

  const handleSaveBooth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const selectedExh = exhibitors.find((ex) => ex.id === assignedExhibitorId);

      const res = await fetch(`/api/event/${eventId}/booths`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          booth: {
            id: editingBooth ? editingBooth.id : undefined,
            eventId,
            boothNumber,
            hallName,
            sizeSqft: Number(sizeSqft),
            status: assignedExhibitorId && status === "available" ? "assigned" : status,
            assignedExhibitorId: assignedExhibitorId || undefined,
            assignedExhibitorName: selectedExh ? selectedExh.companyName : undefined,
            notes,
          },
        }),
      });

      const d = await res.json();
      if (d.success) {
        setModalOpen(false);
        loadData();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBooth = async (boothId: string) => {
    if (!confirm("Are you sure you want to delete this booth?")) return;
    const res = await fetch(`/api/event/${eventId}/booths`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        boothId,
      }),
    });
    const d = await res.json();
    if (d.success) loadData();
  };

  const halls = Array.from(new Set(booths.map((b) => b.hallName).filter(Boolean)));
  if (halls.length === 0) halls.push("Hall 1 - Main Expo", "Hall 2 - Tech Pavilion", "Innovation Arena");

  const filteredBooths = booths.filter((b) => {
    const matchesSearch =
      b.boothNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.assignedExhibitorName && b.assignedExhibitorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.hallName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHall = hallFilter === "all" || b.hallName === hallFilter;
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesHall && matchesStatus;
  });

  const totalBooths = booths.length;
  const assignedBooths = booths.filter((b) => b.assignedExhibitorId || b.status === "assigned" || b.status === "occupied").length;
  const occupancyRate = totalBooths > 0 ? Math.round((assignedBooths / totalBooths) * 100) : 0;
  const totalSqft = booths.reduce((acc, b) => acc + (b.sizeSqft || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
              Floor & Space Allocation
            </span>
            <span className="text-xs text-neutral-400">Stage 3 Enterprise</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 flex items-center gap-2">
            <Store className="w-6 h-6 text-purple-600" />
            Trade Show Booth Allocation
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage exhibition spaces, floor inventory, square footage, and assign booths to commercial partners.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/event/${eventId}/exhibitors-admin`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-2xs transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Exhibitor Roster
            <ArrowRight className="w-3 h-3 text-neutral-400" />
          </Link>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Booth Space
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Total Booth Spaces</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">{totalBooths}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Across {halls.length} exhibition halls</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Allocated / Occupied</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{assignedBooths}</div>
          <div className="text-xs text-neutral-400 mt-0.5">{occupancyRate}% Floor occupancy</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Available Vacancies</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{totalBooths - assignedBooths}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Ready for booking</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Total Exhibition Area</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">{totalSqft.toLocaleString()}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Square feet registered</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booth number or exhibitor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={hallFilter}
            onChange={(e) => setHallFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">All Halls</option>
            {halls.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Booths Grid / Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Booth Code</th>
                <th className="py-3 px-4">Hall / Zone</th>
                <th className="py-3 px-4">Dimensions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Exhibitor</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredBooths.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400">
                    <Store className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    No booths found matching your filters. Click &quot;Create Booth Space&quot; to configure your floor plan.
                  </td>
                </tr>
              ) : (
                filteredBooths.map((booth) => {
                  const statusColors: Record<BoothStatus, string> = {
                    available: "bg-emerald-50 text-emerald-800 border-emerald-200",
                    assigned: "bg-blue-50 text-blue-800 border-blue-200",
                    occupied: "bg-purple-50 text-purple-800 border-purple-200",
                    reserved: "bg-amber-50 text-amber-800 border-amber-200",
                    closed: "bg-neutral-100 text-neutral-700 border-neutral-200",
                  };

                  return (
                    <tr key={booth.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-neutral-950 font-mono text-sm">
                        {booth.boothNumber}
                      </td>

                      <td className="py-3 px-4 font-medium text-neutral-800">
                        {booth.hallName}
                      </td>

                      <td className="py-3 px-4 text-neutral-600">
                        <span className="font-semibold text-neutral-900">{booth.sizeSqft}</span> sq.ft
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            statusColors[booth.status] || "bg-neutral-100 text-neutral-800 border-neutral-200"
                          }`}
                        >
                          {booth.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {booth.assignedExhibitorName ? (
                          <div className="flex items-center gap-1.5 font-semibold text-neutral-950">
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            {booth.assignedExhibitorName}
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-neutral-500 text-[11px] max-w-xs truncate">
                        {booth.notes || "—"}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(booth)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="Edit Booth"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooth(booth.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Booth"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-950 mb-1">
              {editingBooth ? "Configure Booth" : "Create New Booth"}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Specify hall location, size, and assign an exhibitor organization.
            </p>

            <form onSubmit={handleSaveBooth} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Booth Number / Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A-101, B-205, PL-01"
                  value={boothNumber}
                  onChange={(e) => setBoothNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Hall / Pavilion *</label>
                  <input
                    type="text"
                    required
                    placeholder="Hall 1 - Main Expo"
                    value={hallName}
                    onChange={(e) => setHallName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Area (Sq.Ft) *</label>
                  <input
                    type="number"
                    required
                    value={sizeSqft}
                    onChange={(e) => setSizeSqft(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BoothStatus)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Assign Exhibitor</label>
                  <select
                    value={assignedExhibitorId}
                    onChange={(e) => setAssignedExhibitorId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="">None (Vacant)</option>
                    {exhibitors.map((exh) => (
                      <option key={exh.id} value={exh.id}>
                        {exh.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Includes 2 power sockets, 1 spotlight, corner space."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingBooth ? "Update Booth" : "Create Booth"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
