"use client";

import { useState } from "react";
import { X, Loader2, Palette } from "lucide-react";
import type { EventTrack } from "@/types/conference";

interface TrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (track: EventTrack) => void;
  eventId: string;
  trackToEdit?: EventTrack | null;
}

const PRESET_COLORS = [
  "#6C63FF", // Indigo/Purple
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#14B8A6", // Teal
  "#64748B", // Slate
];

export default function TrackModal({
  isOpen,
  onClose,
  onSuccess,
  eventId,
  trackToEdit,
}: TrackModalProps) {
  const [name, setName] = useState(trackToEdit?.name || "");
  const [description, setDescription] = useState(trackToEdit?.description || "");
  const [colour, setColour] = useState(trackToEdit?.colour || "#6C63FF");
  const [sortOrder, setSortOrder] = useState(trackToEdit?.sort_order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Track name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = trackToEdit
        ? `/api/events/${eventId}/tracks/${trackToEdit.id}`
        : `/api/events/${eventId}/tracks`;
      const method = trackToEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          colour,
          sort_order: Number(sortOrder) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save track");
      }

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save track");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">
            {trackToEdit ? "Edit Track" : "Add Conference Track"}
          </h2>
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
              Track Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Artificial Intelligence, Marketing, Startup"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Sessions related to AI, automation and emerging tech."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Track Color
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColour(c)}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: c }}
                >
                  {colour.toLowerCase() === c.toLowerCase() && (
                    <span className="absolute inset-0 rounded-full border-2 border-white shadow-xs" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-200 p-0.5"
              />
              <input
                type="text"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-neutral-200 w-28 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="w-24 text-sm px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              {trackToEdit ? "Save Changes" : "Create Track"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
