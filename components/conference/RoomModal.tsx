"use client";

import { useState } from "react";
import { X, Loader2, DoorOpen } from "lucide-react";
import type { EventRoom } from "@/types/conference";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (room: EventRoom) => void;
  eventId: string;
  roomToEdit?: EventRoom | null;
}

export default function RoomModal({
  isOpen,
  onClose,
  onSuccess,
  eventId,
  roomToEdit,
}: RoomModalProps) {
  const [name, setName] = useState(roomToEdit?.name || "");
  const [description, setDescription] = useState(roomToEdit?.description || "");
  const [floor, setFloor] = useState(roomToEdit?.floor || "");
  const [location, setLocation] = useState(roomToEdit?.location || "");
  const [capacity, setCapacity] = useState(roomToEdit?.capacity ? String(roomToEdit.capacity) : "100");
  const [checkinEnabled, setCheckinEnabled] = useState(roomToEdit ? roomToEdit.checkin_enabled : true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Room name is required");
      return;
    }

    const capNum = Number(capacity);
    if (isNaN(capNum) || capNum <= 0) {
      setError("Room capacity must be a positive number greater than 0");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = roomToEdit
        ? `/api/events/${eventId}/rooms/${roomToEdit.id}`
        : `/api/events/${eventId}/rooms`;
      const method = roomToEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          floor: floor.trim() || null,
          location: location.trim() || null,
          capacity: Number(capacity) || 100,
          checkin_enabled: checkinEnabled,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save room");
      }

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <DoorOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              {roomToEdit ? "Edit Room / Hall" : "Add Room / Hall"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Room / Hall Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Main Auditorium, Conference Hall A, Workshop Room 2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Floor
              </label>
              <input
                type="text"
                placeholder="e.g. Ground Floor, 2nd Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Maximum Capacity *
              </label>
              <input
                type="number"
                min={1}
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Location / Wing Details
            </label>
            <input
              type="text"
              placeholder="e.g. West Wing, Building B, Near Cafeteria"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Audio visual equipped, projector, 4 microphones, executive seating."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checkinEnabled}
                onChange={(e) => setCheckinEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
              />
              <span className="text-xs font-medium text-neutral-700">
                Session Check-In Enabled for this room
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {roomToEdit ? "Save Changes" : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
