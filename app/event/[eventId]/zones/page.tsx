"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Shield,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Layers,
  DoorOpen,
  Store,
  Building2,
  Coffee,
  AlertOctagon,
  ClipboardCheck,
  Check,
  Compass,
} from "lucide-react";
import { EventZone, VenueFloorPlan, FloorPlanMarker, MarkerType } from "@/lib/physical-ops/types";
import { MARKER_TYPE_CONFIG } from "@/lib/physical-ops/floor-plan-service";

export default function ZonesAndFloorPlanPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [activeTab, setActiveTab] = useState<"zones" | "floorplan">("zones");
  const [zones, setZones] = useState<EventZone[]>([]);
  const [floorPlans, setFloorPlans] = useState<VenueFloorPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<VenueFloorPlan | null>(null);

  // Zone Modal
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<EventZone | null>(null);
  const [zoneName, setZoneName] = useState("");
  const [zoneType, setZoneType] = useState<any>("main_hall");
  const [zoneCapacity, setZoneCapacity] = useState(500);
  const [zoneColor, setZoneColor] = useState("#6D28D9");
  const [zoneDesc, setZoneDesc] = useState("");

  // Marker placement
  const [selectedMarker, setSelectedMarker] = useState<FloorPlanMarker | null>(null);

  const fetchZones = () => {
    fetch(`/api/event/${eventId}/ops/zones`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.zones) setZones(d.zones);
      });
  };

  useEffect(() => {
    fetchZones();
    // Default floor plan loading
    fetch(`/api/event/${eventId}/ops`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.zones) setZones(d.zones);
      });
  }, [eventId]);

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/event/${eventId}/ops/zones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "save_zone",
        zone: {
          id: editingZone ? editingZone.id : undefined,
          name: zoneName,
          zoneType,
          capacity: Number(zoneCapacity),
          color: zoneColor,
          description: zoneDesc,
        },
      }),
    });
    const data = await res.json();
    if (data.success && data.zone) {
      setZones((prev) => {
        const idx = prev.findIndex((z) => z.id === data.zone.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data.zone;
          return updated;
        }
        return [...prev, data.zone];
      });
      setZoneModalOpen(false);
      setEditingZone(null);
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (!confirm("Are you sure you want to delete this zone?")) return;
    await fetch(`/api/event/${eventId}/ops/zones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "delete_zone", zoneId: id }),
    });
    setZones((prev) => prev.filter((z) => z.id !== id));
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
            <span className="text-xs text-neutral-500 font-medium">Sprint 4 &amp; 7</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Zones &amp; Venue Floor Plan
          </h1>
          <p className="text-sm text-neutral-500">
            Define venue capacity zones, enforce crowd safety limits, and configure interactive attendee floor plans.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
            <button
              onClick={() => setActiveTab("zones")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "zones"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Capacity Zones ({zones.length})
            </button>
            <button
              onClick={() => setActiveTab("floorplan")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "floorplan"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive Floor Plan</span>
            </button>
          </div>

          {activeTab === "zones" && (
            <button
              onClick={() => {
                setEditingZone(null);
                setZoneName("");
                setZoneCapacity(300);
                setZoneDesc("");
                setZoneModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Zone</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "zones" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const occupancyPct =
              zone.capacity > 0 ? Math.round((zone.currentOccupancy / zone.capacity) * 100) : 0;
            const isFull = zone.capacity > 0 && zone.currentOccupancy >= zone.capacity;
            const isNearlyFull = occupancyPct >= 85 && !isFull;

            return (
              <div
                key={zone.id}
                className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: zone.color }}
                />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {zone.zoneType.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingZone(zone);
                          setZoneName(zone.name);
                          setZoneType(zone.zoneType);
                          setZoneCapacity(zone.capacity);
                          setZoneColor(zone.color);
                          setZoneDesc(zone.description || "");
                          setZoneModalOpen(true);
                        }}
                        className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteZone(zone.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">{zone.name}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{zone.description || "No description provided."}</p>

                  {/* Occupancy Bar */}
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-neutral-500">Live Occupancy</span>
                      <span className={isFull ? "text-red-600" : isNearlyFull ? "text-amber-600" : "text-neutral-900"}>
                        {zone.currentOccupancy} / {zone.capacity} ({occupancyPct}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull
                            ? "bg-red-500"
                            : isNearlyFull
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      />
                    </div>

                    {isFull && (
                      <p className="text-[11px] font-bold text-red-600 mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        CAPACITY REACHED · Door entry auto-blocked
                      </p>
                    )}
                    {isNearlyFull && (
                      <p className="text-[11px] font-bold text-amber-600 mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Approaching Capacity Limit (&gt;85%)
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                  <span>Peak: {zone.peakOccupancy} inside</span>
                  <span>Safety Auto-Lock</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "floorplan" && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Convention Floor Plan &amp; Spatial Locator</h2>
              <p className="text-xs text-neutral-500">
                Place halls, sponsor booths, registration desks, and emergency exits. Publicly searchable by attendees.
              </p>
            </div>
            <a
              href={`/e/${eventId}/floor-plan`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl border border-neutral-200 text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Preview Attendee View</span>
              <span className="text-neutral-400">↗</span>
            </a>
          </div>

          {/* Interactive Schematic Board */}
          <div className="relative w-full h-[520px] bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-inner flex items-center justify-center p-6">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Simulated Convention Layout Boxes */}
            <div className="absolute inset-10 border border-neutral-700/80 rounded-2xl pointer-events-none">
              <span className="absolute top-3 left-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                ZONE PERIMETER · CONVENTION MAIN FLOOR
              </span>
            </div>

            {/* Interactive Pins */}
            {[
              { id: "p1", type: "hall" as MarkerType, label: "Auditorium 1", x: 45, y: 35 },
              { id: "p2", type: "registration_desk" as MarkerType, label: "Badge Desk", x: 15, y: 80 },
              { id: "p3", type: "gate" as MarkerType, label: "Main Gate A", x: 10, y: 50 },
              { id: "p4", type: "zone" as MarkerType, label: "VIP Lounge", x: 80, y: 25 },
              { id: "p5", type: "food_area" as MarkerType, label: "Dining Hall", x: 80, y: 75 },
              { id: "p6", type: "emergency_exit" as MarkerType, label: "Fire Exit North", x: 90, y: 12 },
            ].map((marker) => {
              const cfg = MARKER_TYPE_CONFIG[marker.type];
              return (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => setSelectedMarker(marker as any)}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer flex flex-col items-center z-20 focus:outline-none"
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ring-4 ring-neutral-900"
                    style={{ backgroundColor: cfg.color }}
                  >
                    <MapPin className="w-5 h-5 drop-shadow" />
                  </div>
                  <span className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white bg-neutral-950/90 border border-neutral-700 backdrop-blur-xs whitespace-nowrap shadow-md">
                    {marker.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Marker Details Drawer */}
          {selectedMarker && (
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  SELECTED FLOOR MARKER
                </span>
                <h4 className="text-sm font-bold text-neutral-900">{selectedMarker.label}</h4>
                <p className="text-xs text-neutral-500">
                  {MARKER_TYPE_CONFIG[selectedMarker.type]?.defaultDetails}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMarker(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
              >
                Close Inspector
              </button>
            </div>
          )}
        </div>
      )}

      {/* Zone Edit/Create Modal */}
      {zoneModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-900">
              {editingZone ? "Edit Access Zone" : "Create New Access Zone"}
            </h3>

            <form onSubmit={handleSaveZone} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Zone Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Lounge & Executive Room"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Zone Type</label>
                  <select
                    value={zoneType}
                    onChange={(e) => setZoneType(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 bg-white"
                  >
                    <option value="main_hall">Main Hall</option>
                    <option value="vip">VIP Area</option>
                    <option value="expo">Expo Floor</option>
                    <option value="backstage">Backstage</option>
                    <option value="staff_only">Staff Only</option>
                    <option value="dining">Dining / Lunch</option>
                    <option value="custom">Custom Zone</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Max Capacity (Seats)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={zoneCapacity}
                    onChange={(e) => setZoneCapacity(Number(e.target.value))}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Zone Theme Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={zoneColor}
                    onChange={(e) => setZoneColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={zoneColor}
                    onChange={(e) => setZoneColor(e.target.value)}
                    className="w-full text-xs uppercase font-mono border border-neutral-200 rounded-lg px-2 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Description / Access Notes</label>
                <textarea
                  rows={2}
                  value={zoneDesc}
                  onChange={(e) => setZoneDesc(e.target.value)}
                  placeholder="e.g. VIP Badge holders only. Refreshments served."
                  className="w-full text-xs border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setZoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand/90 shadow-xs"
                >
                  Save Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
