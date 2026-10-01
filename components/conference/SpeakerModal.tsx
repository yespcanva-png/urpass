"use client";

import { useState } from "react";
import { X, Loader2, User } from "lucide-react";
import type { EventSpeaker, SpeakerVisibility } from "@/types/conference";

interface SpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (speaker: EventSpeaker) => void;
  eventId: string;
  speakerToEdit?: EventSpeaker | null;
}

export default function SpeakerModal({
  isOpen,
  onClose,
  onSuccess,
  eventId,
  speakerToEdit,
}: SpeakerModalProps) {
  const [name, setName] = useState(speakerToEdit?.name || "");
  const [photo, setPhoto] = useState(speakerToEdit?.photo || "");
  const [jobTitle, setJobTitle] = useState(speakerToEdit?.job_title || "");
  const [company, setCompany] = useState(speakerToEdit?.company || "");
  const [bio, setBio] = useState(speakerToEdit?.bio || "");
  const [linkedinUrl, setLinkedinUrl] = useState(speakerToEdit?.linkedin_url || "");
  const [websiteUrl, setWebsiteUrl] = useState(speakerToEdit?.website_url || "");
  const [email, setEmail] = useState(speakerToEdit?.email || "");
  const [phone, setPhone] = useState(speakerToEdit?.phone || "");
  const [country, setCountry] = useState(speakerToEdit?.country || "");
  const [city, setCity] = useState(speakerToEdit?.city || "");
  const [topicsStr, setTopicsStr] = useState(speakerToEdit?.topics?.join(", ") || "");
  const [displayOrder, setDisplayOrder] = useState(speakerToEdit?.display_order ?? 0);
  const [visibility, setVisibility] = useState<SpeakerVisibility>(speakerToEdit?.visibility || "public");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Speaker name is required");
      return;
    }

    setLoading(true);
    setError("");

    const topics = topicsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const url = speakerToEdit
        ? `/api/events/${eventId}/speakers/${speakerToEdit.id}`
        : `/api/events/${eventId}/speakers`;
      const method = speakerToEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          photo: photo.trim() || null,
          job_title: jobTitle.trim() || null,
          company: company.trim() || null,
          bio: bio.trim() || null,
          linkedin_url: linkedinUrl.trim() || null,
          website_url: websiteUrl.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          country: country.trim() || null,
          city: city.trim() || null,
          topics,
          display_order: Number(displayOrder) || 0,
          visibility,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save speaker");
      }

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save speaker");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              {speakerToEdit ? "Edit Speaker Profile" : "Add Conference Speaker"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. VP of Artificial Intelligence"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. DeepMind, Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Photo URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or avatar link"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Speaker Bio
            </label>
            <textarea
              rows={3}
              placeholder="Brief biography, background, notable accomplishments, and key subject areas..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Personal / Company Website
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="speaker@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                City
              </label>
              <input
                type="text"
                placeholder="Bengaluru, London, SF"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Country
              </label>
              <input
                type="text"
                placeholder="India, United States, UK"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Topics / Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Generative AI, Product Design, Cloud Architecture"
              value={topicsStr}
              onChange={(e) => setTopicsStr(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as SpeakerVisibility)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 bg-white"
              >
                <option value="public">Public (Visible on website)</option>
                <option value="hidden">Hidden</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
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
              {speakerToEdit ? "Save Profile" : "Add Speaker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
