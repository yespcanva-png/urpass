"use client";

import { useState } from "react";
import { Plus, MapPin, Building, Globe, Trash2, Loader2, X, Users } from "lucide-react";
import { createLocation, deleteLocation } from "@/app/actions/locations";
import type { Location, OrgRole, VenueType } from "@/types";

interface Props {
  orgId: string;
  orgSlug: string;
  locations: Location[];
  userRole: OrgRole;
}

export default function LocationsClient({ orgId, orgSlug, locations: initialLocations, userRole }: Props) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [venueType, setVenueType] = useState<VenueType>("physical");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [virtualUrl, setVirtualUrl] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canManage = ["owner", "admin", "event_manager"].includes(userRole);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await createLocation(orgId, {
      name: name.trim(),
      venue_type: venueType,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      capacity: capacity ? Number(capacity) : undefined,
      virtual_url: virtualUrl.trim() || undefined,
      timezone,
      country: "India",
      is_active: true,
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    if (res.location) {
      setLocations((prev) => [res.location!, ...prev]);
    }
    setSuccess("Location added successfully.");
    setName("");
    setAddress("");
    setCity("");
    setCapacity("");
    setVirtualUrl("");
    setModalOpen(false);
    setLoading(false);
    setTimeout(() => setSuccess(""), 4000);
  }

  async function handleDelete(locId: string) {
    if (!confirm("Are you sure you want to remove this location?")) return;
    setDeletingId(locId);
    setError("");
    const res = await deleteLocation(locId, orgId);
    if (res.error) {
      setError(res.error);
      setDeletingId(null);
      return;
    }
    setLocations((prev) => prev.filter((l) => l.id !== locId));
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Locations &amp; Venues</h2>
          <p className="text-xs text-neutral-500">
            Maintain campus auditoriums, seminar halls, tech park venues, and virtual meeting spaces.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => { setModalOpen(true); setError(""); }}
            className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto shadow-sm"
            style={{ background: "#6D28D9" }}
          >
            <Plus className="w-4 h-4" />
            Add Location
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
          {success}
        </div>
      )}

      {locations.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-xs border border-dashed border-neutral-200">
          <MapPin className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-neutral-700 mb-1">No locations added yet</p>
          <p className="text-xs text-neutral-400 mb-4">
            Add physical auditoriums or virtual hubs to assign to events and scanner gates.
          </p>
          {canManage && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-xl"
              style={{ background: "#6D28D9" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Location
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl p-5 shadow-xs border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                      {loc.venue_type === "virtual" ? (
                        <Globe className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Building className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 leading-tight">{loc.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {loc.venue_type} venue
                      </span>
                    </div>
                  </div>

                  {canManage && (
                    <button
                      onClick={() => handleDelete(loc.id)}
                      disabled={deletingId === loc.id}
                      className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
                      title="Remove Location"
                    >
                      {deletingId === loc.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-1 text-xs text-neutral-500 mt-2">
                  {loc.address && <p className="line-clamp-2">{loc.address}</p>}
                  {loc.city && <p className="font-medium text-neutral-700">{loc.city}</p>}
                  {loc.virtual_url && (
                    <a
                      href={loc.virtual_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline block truncate text-[11px]"
                    >
                      {loc.virtual_url}
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{loc.capacity ? `${loc.capacity.toLocaleString()} seats` : "Flexible cap"}</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Ready
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Add Location / Venue</h3>
                <p className="text-xs text-neutral-500">Configure physical halls, grounds, or live rooms.</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Auditorium, Hall B, Virtual Stage 1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Venue Type
                  </label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value as VenueType)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-brand bg-white"
                  >
                    <option value="physical">Physical Venue</option>
                    <option value="virtual">Virtual Room</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Estimated Capacity
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : "")}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-brand"
                  />
                </div>
              </div>

              {venueType !== "virtual" && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Full Address
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Street address, campus gate, landmark..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-neutral-200 outline-none focus:border-brand resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore, Chennai, Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-brand"
                    />
                  </div>
                </>
              )}

              {venueType !== "physical" && (
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Virtual Meeting / Stream URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/... or https://youtube.com/..."
                    value={virtualUrl}
                    onChange={(e) => setVirtualUrl(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-brand"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-brand bg-white"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  style={{ background: "#6D28D9" }}
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
