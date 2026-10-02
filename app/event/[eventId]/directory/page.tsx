"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Search,
  Filter,
  Bookmark,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  Building2,
  Sparkles,
  MapPin,
  Tag,
  CheckCircle2,
  Layers,
  ArrowRight,
  Award,
} from "lucide-react";
import { EventExhibitor, EventSponsor, EventBooth } from "@/lib/exhibitor-sponsor/types";

export default function DigitalExhibitorDirectoryPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [exhibitors, setExhibitors] = useState<EventExhibitor[]>([]);
  const [sponsors, setSponsors] = useState<EventSponsor[]>([]);
  const [booths, setBooths] = useState<EventBooth[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedHall, setSelectedHall] = useState("all");

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Meeting Request Modal
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [targetExhibitor, setTargetExhibitor] = useState<EventExhibitor | null>(null);
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterCompany, setRequesterCompany] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState(false);
  const [meetingSuccessMessage, setMeetingSuccessMessage] = useState(false);

  // Callback / Business Card Modal
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  const loadData = () => {
    Promise.all([
      fetch(`/api/event/${eventId}/exhibitors`).then((r) => r.json()),
      fetch(`/api/event/${eventId}/sponsors`).then((r) => r.json()),
      fetch(`/api/event/${eventId}/booths`).then((r) => r.json()),
    ]).then(([exhData, sponsorData, boothData]) => {
      if (exhData.success && exhData.exhibitors) setExhibitors(exhData.exhibitors);
      if (sponsorData.success && sponsorData.sponsors) setSponsors(sponsorData.sponsors);
      if (boothData.success && boothData.booths) setBooths(boothData.booths);
    });
  };

  useEffect(() => {
    loadData();
    // Default proposed time: tomorrow at 11:00 AM
    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setHours(11, 0, 0, 0);
    setProposedTime(tomorrow.toISOString().slice(0, 16));
  }, [eventId]);

  const handleBookmark = async (exhibitorId: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(exhibitorId)) {
      next.delete(exhibitorId);
    } else {
      next.add(exhibitorId);
    }
    setBookmarkedIds(next);

    await fetch(`/api/event/${eventId}/meetings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "bookmark",
        exhibitorId,
        attendeeId: "delegate_self",
        callbackRequested: false,
        businessCardShared: false,
      }),
    });
  };

  const handleOpenMeetingModal = (exh: EventExhibitor) => {
    setTargetExhibitor(exh);
    setMeetingSuccessMessage(false);
    setMeetingModalOpen(true);
  };

  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetExhibitor) return;

    setIsSubmittingMeeting(true);
    try {
      const res = await fetch(`/api/event/${eventId}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exhibitorId: targetExhibitor.id,
          requesterName,
          requesterEmail,
          requesterCompany,
          proposedTime,
          durationMinutes: Number(durationMinutes),
          location: `Booth ${targetExhibitor.boothNumber || "General"}`,
          meetingNotes,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setMeetingSuccessMessage(true);
        setTimeout(() => {
          setMeetingModalOpen(false);
          setMeetingSuccessMessage(false);
        }, 1800);
      }
    } finally {
      setIsSubmittingMeeting(false);
    }
  };

  const handleOpenCallback = (exh: EventExhibitor) => {
    setTargetExhibitor(exh);
    setCallbackSuccess(false);
    setCallbackModalOpen(true);
  };

  const handleSubmitCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetExhibitor) return;
    await fetch(`/api/event/${eventId}/meetings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "bookmark",
        exhibitorId: targetExhibitor.id,
        attendeeId: "delegate_self",
        callbackRequested: true,
        businessCardShared: true,
      }),
    });
    setCallbackSuccess(true);
    setTimeout(() => {
      setCallbackModalOpen(false);
      setCallbackSuccess(false);
    }, 1500);
  };

  const categories = Array.from(new Set(exhibitors.map((e) => e.category).filter(Boolean)));
  const halls = Array.from(new Set(booths.map((b) => b.hallName).filter(Boolean)));

  const filteredExhibitors = exhibitors.filter((exh) => {
    const matchesSearch =
      exh.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exh.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exh.description && exh.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exh.productsServices && exh.productsServices.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCat = selectedCategory === "all" || exh.category === selectedCategory;
    const matchesHall =
      selectedHall === "all" ||
      booths.some((b) => b.assignedExhibitorId === exh.id && b.hallName === selectedHall);
    return matchesSearch && matchesCat && matchesHall;
  });

  // Featured Sponsors for Top Banner
  const featuredSponsors = sponsors.filter((s) => s.visibilitySettings?.eventWebsite);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-300">
              Delegate Portal
            </span>
            <span className="text-xs text-neutral-400">Digital Expo Directory</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 flex items-center gap-2">
            <Store className="w-6 h-6 text-purple-600" />
            Digital Exhibitor & Partner Directory
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Discover participating commercial partners, locate trade show booths, and pre-book 1-on-1 B2B meetings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/event/${eventId}/exhibitors-sponsors`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-2xs transition-all"
          >
            Commercial Command Center
            <ArrowRight className="w-3 h-3 text-neutral-400" />
          </Link>
        </div>
      </div>

      {/* Featured Sponsors Ribbon */}
      {featuredSponsors.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl shadow-sm border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Official Event Partners</span>
            </div>
            <span className="text-[11px] text-neutral-400">{featuredSponsors.length} Featured Brands</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {featuredSponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="group p-2.5 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl flex flex-col items-center justify-center text-center transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-300 mb-1.5 overflow-hidden">
                  {sponsor.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    sponsor.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate w-full">
                  {sponsor.name}
                </div>
                <div className="text-[10px] text-amber-400">{sponsor.tierName || "Partner"}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, products, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="all">All Exhibition Halls</option>
              {halls.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-neutral-900 text-white shadow-2xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            All Categories ({exhibitors.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-neutral-900 text-white shadow-2xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exhibitors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExhibitors.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-white border border-neutral-200/80 rounded-2xl text-neutral-400">
            <Store className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
            <h3 className="font-semibold text-neutral-700">No Exhibitors Found</h3>
            <p className="text-xs text-neutral-400 mt-1">Try broadening your search keywords or filter options.</p>
          </div>
        ) : (
          filteredExhibitors.map((exh) => {
            const isBookmarked = bookmarkedIds.has(exh.id);

            return (
              <div
                key={exh.id}
                className="p-5 bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-2xl transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-sm text-neutral-700 shrink-0 overflow-hidden">
                        {exh.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={exh.logoUrl} alt={exh.companyName} className="w-full h-full object-contain p-1" />
                        ) : (
                          exh.companyName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-950 text-base leading-tight flex items-center gap-1.5">
                          {exh.companyName}
                          {exh.websiteUrl && (
                            <a
                              href={exh.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-400 hover:text-neutral-700"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </h3>
                        <span className="inline-block text-[11px] font-medium text-neutral-500 mt-0.5">
                          {exh.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookmark(exh.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? "bg-purple-50 text-purple-600 border-purple-200"
                          : "text-neutral-400 border-neutral-200 hover:text-neutral-700 hover:bg-neutral-50"
                      }`}
                      title={isBookmarked ? "Saved to Bookmarks" : "Bookmark Exhibitor"}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-purple-600" : ""}`} />
                    </button>
                  </div>

                  {/* Location & Booth Indicator */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                    <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                      <MapPin className="w-3 h-3 text-purple-600" />
                      Booth {exh.boothNumber || "Pavilion"}
                    </div>
                    {exh.boothCheckedIn && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Booth Staff Onsite
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {exh.description && (
                    <p className="text-xs text-neutral-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {exh.description}
                    </p>
                  )}

                  {/* Product Tags */}
                  {(exh.productsServices || []).length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-3">
                      {(exh.productsServices || []).slice(0, 3).map((prod, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 bg-neutral-100 rounded-md text-neutral-700"
                        >
                          {prod}
                        </span>
                      ))}
                      {(exh.productsServices || []).length > 3 && (
                        <span className="text-[10px] text-neutral-400 font-medium">
                          +{(exh.productsServices || []).length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenCallback(exh)}
                    className="flex-1 py-1.5 px-2 text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors text-center"
                  >
                    Share Card / Info
                  </button>
                  <button
                    onClick={() => handleOpenMeetingModal(exh)}
                    className="flex-1 py-1.5 px-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all text-center flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Meeting
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Book Meeting Modal */}
      {meetingModalOpen && targetExhibitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-950 mb-1">
              Request B2B Meeting with {targetExhibitor.companyName}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Select a preferred 1-on-1 discussion slot at Booth #{targetExhibitor.boothNumber || "Expo"}.
            </p>

            {meetingSuccessMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="font-bold">Meeting Request Submitted!</div>
                <div>The exhibitor representative will review and confirm your slot.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmitMeeting} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={requesterName}
                      onChange={(e) => setRequesterName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="s.jenkins@firm.com"
                      value={requesterEmail}
                      onChange={(e) => setRequesterEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Global Innovations"
                    value={requesterCompany}
                    onChange={(e) => setRequesterCompany(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Preferred Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={proposedTime}
                      onChange={(e) => setProposedTime(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Duration</label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Topics of Interest</label>
                  <textarea
                    rows={2}
                    placeholder="We'd like to discuss licensing pricing and custom integration feasibility."
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setMeetingModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingMeeting}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all disabled:opacity-50"
                  >
                    {isSubmittingMeeting ? "Submitting..." : "Send Meeting Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Callback / Share Card Modal */}
      {callbackModalOpen && targetExhibitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-base font-bold text-neutral-950 mb-1">Share Card & Request Info</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Send your digital delegate card and request product catalogs from {targetExhibitor.companyName}.
            </p>

            {callbackSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                Information shared with exhibitor!
              </div>
            ) : (
              <form onSubmit={handleSubmitCallback} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setCallbackModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-2xs transition-all"
                  >
                    Share Card
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
