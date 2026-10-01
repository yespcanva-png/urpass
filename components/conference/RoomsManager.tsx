"use client";

import { useState } from "react";
import { DoorOpen, Plus, Edit3, Trash2, Users, MapPin, CheckCircle, XCircle } from "lucide-react";
import type { EventRoom } from "@/types/conference";
import RoomModal from "./RoomModal";

interface RoomsManagerProps {
  eventId: string;
  eventName: string;
  initialRooms: EventRoom[];
}

export default function RoomsManager({
  eventId,
  eventName,
  initialRooms,
}: RoomsManagerProps) {
  const [rooms, setRooms] = useState<EventRoom[]>(initialRooms);
  const [modalOpen, setModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<EventRoom | null>(null);

  function handleCreate() {
    setRoomToEdit(null);
    setModalOpen(true);
  }

  function handleEdit(room: EventRoom) {
    setRoomToEdit(room);
    setModalOpen(true);
  }

  async function handleDelete(roomId: string) {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      const res = await fetch(`/api/events/${eventId}/rooms/${roomId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r.id !== roomId));
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleSuccess(saved: EventRoom) {
    setRooms((prev) => {
      const exists = prev.some((r) => r.id === saved.id);
      if (exists) {
        return prev.map((r) => (r.id === saved.id ? saved : r));
      }
      return [...prev, saved];
    });
  }

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Rooms & Halls
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure physical stages, conference halls, workshop spaces, and VIP lounges.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Room / Hall
        </button>
      </div>

      {/* ── Rooms Grid ────────────────────────────────────────── */}
      {rooms.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-100">
          <DoorOpen className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-700">No rooms configured</p>
          <p className="text-xs text-neutral-400 mt-1">
            Create halls or rooms to assign venues to sessions and enable QR entrance check-in.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 px-4 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl p-5 border border-neutral-100 hover:border-neutral-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                      <DoorOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 leading-tight">
                        {room.name}
                      </h3>
                      {room.floor && (
                        <p className="text-[11px] font-medium text-neutral-400">{room.floor}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(room)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                      title="Edit room"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors"
                      title="Delete room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {room.location && (
                  <p className="text-xs text-neutral-500 flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span className="truncate">{room.location}</span>
                  </p>
                )}

                {room.description && (
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    {room.description}
                  </p>
                )}
              </div>

              {/* Footer info */}
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  {room.capacity} Maximum Capacity
                </span>

                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    room.checkin_enabled
                      ? "bg-green-50 text-green-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {room.checkin_enabled ? "Check-in on" : "Check-in off"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────── */}
      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
        eventId={eventId}
        roomToEdit={roomToEdit}
      />
    </div>
  );
}
