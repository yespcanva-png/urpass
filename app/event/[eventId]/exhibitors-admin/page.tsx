"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Target,
  ArrowRight,
} from "lucide-react";
import { EventExhibitor, EventBooth } from "@/lib/exhibitor-sponsor/types";

export default function ExhibitorsAdminPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [exhibitors, setExhibitors] = useState<EventExhibitor[]>([]);
  const [booths, setBooths] = useState<EventBooth[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [editingExhibitor, setEditingExhibitor] = useState<EventExhibitor | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState("Technology");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState("");
  const [selectedBoothId, setSelectedBoothId] = useState("");

  const loadData = () => {
    Promise.all([
      fetch(`/api/event/${eventId}/exhibitors`).then((r) => r.json()),
      fetch(`/api/event/${eventId}/booths`).then((r) => r.json()),
    ]).then(([exhData, boothData]) => {
      if (exhData.success && exhData.exhibitors) setExhibitors(exhData.exhibitors);
      if (boothData.success && boothData.booths) setBooths(boothData.booths);
    });
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleOpenAddModal = () => {
    setEditingExhibitor(null);
    setCompanyName("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setWebsiteUrl("");
    setCategory("Technology");
    setDescription("");
    setProducts("");
    setSelectedBoothId("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (exh: EventExhibitor) => {
    setEditingExhibitor(exh);
    setCompanyName(exh.companyName);
    setContactName(exh.name);
    setContactEmail(exh.contactEmail);
    setContactPhone(exh.contactPhone || "");
    setWebsiteUrl(exh.websiteUrl || "");
    setCategory(exh.category);
    setDescription(exh.description || "");
    setProducts((exh.productsServices || []).join(", "));
    setSelectedBoothId(exh.boothId || "");
    setModalOpen(true);
  };

  const handleSaveExhibitor = async (e: React.FormEvent) => {
    e.preventDefault();
    const prodList = products
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const res = await fetch(`/api/event/${eventId}/exhibitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        exhibitor: {
          id: editingExhibitor ? editingExhibitor.id : undefined,
          companyName,
          name: contactName || companyName,
          contactEmail,
          contactPhone,
          websiteUrl,
          category,
          description,
          productsServices: prodList,
          boothId: selectedBoothId || undefined,
        },
      }),
    });

    const data = await res.json();
    if (data.success && data.exhibitor) {
      setExhibitors((prev) => {
        const idx = prev.findIndex((e) => e.id === data.exhibitor.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data.exhibitor;
          return updated;
        }
        return [...prev, data.exhibitor];
      });
      setModalOpen(false);
    }
  };

  const handleDeleteExhibitor = async (id: string) => {
    if (!confirm("Are you sure you want to remove this exhibitor company?")) return;
    await fetch(`/api/event/${eventId}/exhibitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", exhibitorId: id }),
    });
    setExhibitors((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCopyPortalLink = (token: string, id: string) => {
    const url = `${window.location.origin}/portal/exhibitor/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = exhibitors.filter(
    (e) =>
      e.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.boothNumber && e.boothNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
              STAGE 3 COMMERCIAL
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-medium">Sprint 1 &amp; 4</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Exhibitor Company Management
          </h1>
          <p className="text-sm text-neutral-500">
            Provision commercial exhibitors, allocate hall booths, and issue secure self-service portal links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Exhibitor</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white border border-neutral-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exhibitors by company, booth, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <span>Showing <strong>{filtered.length}</strong> exhibitors</span>
        </div>
      </div>

      {/* Exhibitors Table */}
      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/70 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Company Profile</th>
                <th className="py-3 px-4">Assigned Booth</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Staff &amp; Leads</th>
                <th className="py-3 px-4">Booth Status</th>
                <th className="py-3 px-4">Portal Magic Link</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No exhibitors matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((exh) => (
                  <tr key={exh.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 text-sm">{exh.companyName}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{exh.contactEmail}</div>
                      {exh.websiteUrl && (
                        <a
                          href={exh.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-brand hover:underline inline-flex items-center gap-0.5 mt-0.5"
                        >
                          <span>{exh.websiteUrl.replace(/^https?:\/\//, "")}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {exh.boothNumber ? (
                        <span className="font-mono font-bold px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800">
                          {exh.boothNumber}
                        </span>
                      ) : (
                        <span className="text-neutral-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium text-[11px]">
                        {exh.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="text-neutral-800 font-semibold">{exh.staffCount || 0} Staff Passes</div>
                      <div className="text-emerald-700 font-bold">{exh.leadsCount || 0} Leads Captured</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          exh.boothCheckedIn
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            exh.boothCheckedIn ? "bg-emerald-500" : "bg-neutral-400"
                          }`}
                        />
                        <span>{exh.boothCheckedIn ? "Booth Open" : "Closed / Pending"}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/portal/exhibitor/${exh.portalToken}`}
                          target="_blank"
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleCopyPortalLink(exh.portalToken, exh.id)}
                          className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
                          title="Copy Portal Link"
                        >
                          {copiedId === exh.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(exh)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExhibitor(exh.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exhibitor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-neutral-900">
              {editingExhibitor ? "Edit Exhibitor Profile" : "Register Exhibitor Company"}
            </h3>

            <form onSubmit={handleSaveExhibitor} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Cloud Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Primary Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Johnathan Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 bg-white"
                  >
                    <option value="Technology">Technology / SaaS</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Fintech & Payments">Fintech &amp; Payments</option>
                    <option value="Healthcare">Healthcare &amp; Bio</option>
                    <option value="Hardware & Robotics">Hardware &amp; Robotics</option>
                    <option value="Education & Campus">Education &amp; Campus</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Assign Booth Number</label>
                  <select
                    value={selectedBoothId}
                    onChange={(e) => setSelectedBoothId(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 bg-white font-mono"
                  >
                    <option value="">No Booth Assigned</option>
                    {booths.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.boothNumber} ({b.hallName} - {b.sizeSqft} sq.ft)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Featured Products / Services (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Payments Gateway, Billing Engine, QR Terminals"
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Company Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of company demo and showcase..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs border border-neutral-200 rounded-xl p-3 focus:outline-none"
                />
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
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shadow-xs"
                >
                  Save Exhibitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
