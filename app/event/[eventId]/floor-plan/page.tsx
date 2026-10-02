"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Search,
  Building2,
  Store,
  DoorOpen,
  Coffee,
  AlertOctagon,
  ClipboardCheck,
  Shield,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { FloorPlanMarker, MarkerType } from "@/lib/physical-ops/types";
import { MARKER_TYPE_CONFIG } from "@/lib/physical-ops/floor-plan-service";

export default function AttendeeInteractiveFloorPlanPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMarker, setSelectedMarker] = useState<FloorPlanMarker | null>(null);

  const markers: FloorPlanMarker[] = [
    {
      id: "m-reg",
      type: "registration_desk",
      label: "Main Registration Desk & Badge Pickup",
      details: "Collect lanyard badges, scan QR admission voucher, and report for help.",
      xPercent: 15,
      yPercent: 82,
    },
    {
      id: "m-gate-a",
      type: "gate",
      label: "Main Gate A Entrance",
      details: "Express smartphone scanner lanes for general & VIP delegates.",
      xPercent: 10,
      yPercent: 50,
    },
    {
      id: "m-hall-keynote",
      type: "hall",
      label: "Auditorium 1 (Keynote Arena)",
      details: "Capacity: 800 seats. Morning keynote sessions & award ceremonies.",
      xPercent: 45,
      yPercent: 35,
    },
    {
      id: "m-vip-lounge",
      type: "zone",
      label: "VIP & Speaker Green Room",
      details: "Private networking space, executive desks & refreshments. VIP badge required.",
      xPercent: 80,
      yPercent: 25,
    },
    {
      id: "m-booth-101",
      type: "booth",
      label: "Innovation Booth #101",
      details: "Product demos, AI showcase, and merchandise.",
      boothNumber: "101",
      xPercent: 42,
      yPercent: 75,
    },
    {
      id: "m-booth-102",
      type: "booth",
      label: "Developer Cloud Booth #102",
      details: "Hackathon technical support and API key credits.",
      boothNumber: "102",
      xPercent: 56,
      yPercent: 75,
    },
    {
      id: "m-food",
      type: "food_area",
      label: "Catering & Coffee Pavilion",
      details: "Buffet lunch served 12:30 PM - 2:30 PM. Continuous espresso bar.",
      xPercent: 82,
      yPercent: 78,
    },
    {
      id: "m-exit-north",
      type: "emergency_exit",
      label: "Emergency Exit North",
      details: "Direct assembly point path. Keep clear at all times.",
      xPercent: 92,
      yPercent: 10,
    },
  ];

  const filteredMarkers = markers.filter((m) => {
    if (selectedCategory !== "all" && m.type !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.label.toLowerCase().includes(q) ||
        (m.details && m.details.toLowerCase().includes(q)) ||
        (m.boothNumber && m.boothNumber.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/event/${eventId}/zones`}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-brand" />
              <h1 className="text-sm font-bold text-white">Venue Navigator &amp; Floor Plan</h1>
            </div>
            <p className="text-[11px] text-neutral-400">Interactive spatial guide for delegates</p>
          </div>
        </div>

        <div className="relative w-48 sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Find hall, booth, gate, coffee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </header>

      {/* Category Pills */}
      <div className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: "all", label: "All Locations" },
          { id: "hall", label: "Auditoriums & Halls" },
          { id: "booth", label: "Sponsor Booths" },
          { id: "gate", label: "Gates & Entry" },
          { id: "registration_desk", label: "Badge Desks" },
          { id: "food_area", label: "Dining & Coffee" },
          { id: "emergency_exit", label: "Emergency Exits" },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? "bg-brand text-white"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Floor Plan Canvas */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Outer Hall Boundary */}
        <div className="relative w-full max-w-5xl h-[620px] bg-neutral-900/70 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-6">
          <span className="absolute top-4 left-6 text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
            CONVENTION CENTER · MAIN LEVEL 1
          </span>

          {/* Interactive Pins */}
          {filteredMarkers.map((marker) => {
            const cfg = MARKER_TYPE_CONFIG[marker.type];
            const isSelected = selectedMarker?.id === marker.id;

            return (
              <button
                key={marker.id}
                type="button"
                onClick={() => setSelectedMarker(marker)}
                style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer flex flex-col items-center z-20 focus:outline-none"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all ${
                    isSelected ? "scale-125 ring-4 ring-white" : "group-hover:scale-115"
                  }`}
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

        {/* Selected Marker Detail Card */}
        {selectedMarker && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-lg w-full px-4 z-40">
            <div className="p-5 bg-neutral-900/95 border border-neutral-700 rounded-3xl shadow-2xl backdrop-blur-md flex items-start justify-between gap-4">
              <div>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: MARKER_TYPE_CONFIG[selectedMarker.type]?.color }}
                >
                  {MARKER_TYPE_CONFIG[selectedMarker.type]?.label}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedMarker.label}</h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{selectedMarker.details}</p>
                {selectedMarker.boothNumber && (
                  <p className="text-[11px] font-mono text-brand-300 font-bold mt-2">
                    BOOTH LOCATION #{selectedMarker.boothNumber}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedMarker(null)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
