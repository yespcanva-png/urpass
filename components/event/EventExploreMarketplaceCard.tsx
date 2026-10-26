"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Sparkles,
  MapPin,
  Tag,
  Loader2,
  AlertCircle,
  Trash2,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Eye,
  X,
  IndianRupee,
  Layers,
  Calendar,
} from "lucide-react";
import {
  getEventExploreListingStatusAction,
  submitExploreListingApplicationAction,
  organizerResubmitExploreListingAction,
  unlistExploreListingAction,
  checkEventExploreReadinessAction,
  getExploreListingAttributionAction,
} from "@/app/actions/explore";
import { EXPLORE_CATEGORIES, EXPLORE_CITIES, type ExploreCategory, type ExploreEventItem } from "@/lib/explore/types";
import EventCard from "@/components/explore/EventCard";

interface Props {
  eventId: string;
  eventName: string;
  applySlug?: string | null;
  venueName?: string | null;
}

export default function EventExploreMarketplaceCard({
  eventId,
  eventName,
  applySlug,
  venueName,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<any>(null);
  const [readiness, setReadiness] = useState<{
    ready: boolean;
    issues: string[];
    minPricePaise: number;
    isFree: boolean;
  }>({
    ready: true,
    issues: [],
    minPricePaise: 0,
    isFree: true,
  });
  const [attribution, setAttribution] = useState<{
    exploreBookings: number;
    totalBookings: number;
    exploreRevenuePaise: number;
    totalRevenuePaise: number;
    views: number | null;
    clicks: number | null;
  }>({
    exploreBookings: 0,
    totalBookings: 0,
    exploreRevenuePaise: 0,
    totalRevenuePaise: 0,
    views: null,
    clicks: null,
  });
  const [metricsAvailable, setMetricsAvailable] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showUnlistConfirm, setShowUnlistConfirm] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Form state for application
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedCategory, setSelectedCategory] = useState<ExploreCategory>("community");
  const [summary, setSummary] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [res, readyRes, attrRes] = await Promise.all([
      getEventExploreListingStatusAction(eventId),
      checkEventExploreReadinessAction(eventId),
      getExploreListingAttributionAction(eventId),
    ]);
    if (res.error) setErrorMsg(res.error);

    if (res.hasListing) {
      setListing(res);
      if (res.city) setSelectedCity(res.city);
      if (res.category) setSelectedCategory(res.category as ExploreCategory);
      if (res.editorialSummary) setSummary(res.editorialSummary);
    } else {
      setListing(res);
    }

    setReadiness(readyRes);
    setMetricsAvailable(attrRes.success);
    if (attrRes.success) {
      setAttribution(attrRes);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const isResubmit = ["rejected", "changes_requested", "unlisted"].includes(listing?.status);
      const action = isResubmit
        ? organizerResubmitExploreListingAction
        : submitExploreListingApplicationAction;

      const res = await action(eventId, {
        city: selectedCity,
        category: selectedCategory,
        editorialSummary: summary.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Failed to submit application");
      } else {
        setSuccessMsg(
          isResubmit
            ? "Listing details updated and resubmitted for curation review."
            : "Application submitted successfully for UrPass Explore review."
        );
        await loadData();
      }
    });
  };

  const handleUnlist = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await unlistExploreListingAction(eventId);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to unlist event");
      } else {
        setSuccessMsg("Event unlisted from UrPass Explore. Direct registration links remain active.");
        setShowUnlistConfirm(false);
        await loadData();
      }
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-3 border border-neutral-100 flex items-center justify-center min-h-[140px]">
        <div className="flex items-center gap-2.5 text-xs text-neutral-400">
          <Loader2 className="w-4 h-4 animate-spin text-brand" />
          <span>Verifying Explore marketplace status & eligibility...</span>
        </div>
      </div>
    );
  }

  const status = listing?.hasListing ? listing.status : "not_applied";
  const isChangesRequested = Boolean(
    status === "changes_requested" || (status === "rejected" && listing?.rejectionReason?.toLowerCase().includes("changes requested"))
  );

  const publicExploreUrl = applySlug
    ? `/events/${applySlug}?ref=explore`
    : `/explore?q=${encodeURIComponent(eventName)}`;

  // Construct item for Explore card preview
  const previewItem: ExploreEventItem = {
    id: listing?.id || "preview-id",
    eventId,
    slug: applySlug || eventId,
    name: eventName,
    description: summary.trim() || listing?.editorialSummary || "Verified event published on UrPass.",
    eventDate: listing?.eventDate || new Date().toISOString().split("T")[0],
    startTime: listing?.startTime || "18:00",
    endTime: "21:00",
    venue: venueName || listing?.venue || "Main Auditorium",
    city: selectedCity,
    category: selectedCategory,
    categoryLabel: EXPLORE_CATEGORIES.find((c) => c.key === selectedCategory)?.label || "Community",
    bannerUrl: listing?.bannerUrl || listing?.logoUrl || null,
    logoUrl: listing?.logoUrl || null,
    minPricePaise: readiness.minPricePaise,
    currency: "INR",
    isFree: readiness.isFree,
    featured: Boolean(listing?.featured),
    organizerName: "Verified Host",
    applicationEnabled: true,
    approvalRequired: false,
    status: "active",
  };

  return (
    <div
      id="explore-marketplace"
      className="bg-white rounded-2xl shadow-sm p-6 mb-3 border border-violet-100/80 relative overflow-hidden ring-1 ring-violet-500/10 scroll-mt-24 transition-all duration-300"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-80 h-36 bg-gradient-to-bl from-violet-500/10 via-purple-500/5 to-transparent pointer-events-none rounded-tr-2xl" />

      {/* Notification Highlight Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600/[0.08] via-indigo-600/[0.04] to-transparent border border-violet-200/70 p-4 sm:p-5 mb-5 relative overflow-hidden shadow-2xs">
        {/* Glow behind icon */}
        <div className="absolute -top-6 -left-6 w-28 h-28 bg-violet-500/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Notification Icon with live pulse ring */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/25 ring-4 ring-violet-100/90">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-600 ring-2 ring-white" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
                  Post on UrPass Explore
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-violet-600 text-white shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                  Marketplace
                </span>
                <span className="text-[10px] font-medium text-violet-700 bg-violet-100/80 px-2 py-0.5 rounded-full">
                  Public Discovery
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Get discovered on the public <strong className="text-violet-700 font-semibold">/explore</strong> marketplace by thousands of verified event goers.
              </p>
            </div>
          </div>

          {/* Status Pill in Notification Highlight */}
          <div className="shrink-0 pl-14 sm:pl-0">
            {status === "approved" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved & Live
              </span>
            )}
            {status === "pending" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                <Clock className="w-3.5 h-3.5" />
                Pending Review
              </span>
            )}
            {(status === "rejected" || status === "changes_requested") && (
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shadow-2xs ${
                isChangesRequested
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>
                {isChangesRequested ? <AlertCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {isChangesRequested ? "Changes Requested" : "Declined"}
              </span>
            )}
            {status === "suspended" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                <RotateCcw className="w-3.5 h-3.5" />
                Suspended
              </span>
            )}
            {status === "unlisted" && <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">Unlisted</span>}
            {status === "not_applied" && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-violet-100/90 text-violet-800 border border-violet-200/80">
                <Sparkles className="w-3 h-3 text-violet-600" />
                Open for Submission
              </span>
            )}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── State 1: Approved / Published ── */}
      {status === "approved" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-violet-50/50 border border-violet-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-neutral-900">
                  Your event is live on UrPass Explore
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Published under <strong className="text-neutral-700 capitalize">{listing.category || "Community"}</strong> in <strong className="text-neutral-700">{listing.city || "Bengaluru"}</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Preview Card</span>
                </button>
                <Link
                  href={publicExploreUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-sm"
                >
                  <span>View on Explore</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                {!showUnlistConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowUnlistConfirm(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-neutral-200"
                    title="Remove from public marketplace"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Unlist</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-lg border border-red-200">
                    <span className="text-[11px] font-medium text-red-700 px-1">Confirm unlist?</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleUnlist}
                      className="px-2 py-1 text-[11px] font-semibold bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {isPending ? "..." : "Yes, Unlist"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUnlistConfirm(false)}
                      className="px-1.5 py-1 text-[11px] text-neutral-600 hover:text-neutral-900"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real Attribution & Performance Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
                Marketplace Performance
              </span>
              <span className="text-[11px] text-neutral-400">Direct booking source attribution</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-[11px] font-medium text-neutral-500">Explore Views</span>
                <p className="text-lg font-bold text-neutral-900 mt-0.5">
                  {attribution.views !== null ? attribution.views.toLocaleString() : "—"}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  {attribution.views !== null ? "Unique impressions" : "Telemetry unconfigured"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-[11px] font-medium text-neutral-500">Explore Bookings</span>
                <p className="text-lg font-bold text-neutral-900 mt-0.5">
                  {metricsAvailable ? attribution.exploreBookings.toLocaleString() : "—"}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  {attribution.totalBookings > 0
                    ? `${Math.round((attribution.exploreBookings / attribution.totalBookings) * 100)}% of total (${attribution.totalBookings})`
                    : "0 total registrations"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-[11px] font-medium text-neutral-500">Attributed Revenue</span>
                <p className="text-lg font-bold text-neutral-900 mt-0.5">
                  {!metricsAvailable ? "—" : attribution.exploreRevenuePaise > 0
                    ? `₹${(attribution.exploreRevenuePaise / 100).toLocaleString("en-IN")}`
                    : readiness.isFree
                    ? "Free"
                    : "₹0"}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Verified ticket orders</p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-[11px] font-medium text-neutral-500">Event Detail Clicks</span>
                <p className="text-lg font-bold text-neutral-900 mt-0.5">
                  {metricsAvailable && attribution.clicks !== null ? attribution.clicks.toLocaleString() : "—"}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Unique visits</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── State 2: Pending Review ── */}
      {status === "pending" && (
        <div className="rounded-xl bg-amber-50/60 border border-amber-200/70 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-neutral-900">
                  Application under editorial curation review
                </p>
                <p className="text-neutral-600 mt-1 leading-relaxed">
                  Our team checks event details, ticket configuration, and venue information before listing on the public marketplace. Decisions are typically made within 24 hours.
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-neutral-600 bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                  <span>Category: <strong className="text-neutral-900 capitalize">{listing.category}</strong></span>
                  <span>•</span>
                  <span>City: <strong className="text-neutral-900">{listing.city}</strong></span>
                  {listing.editorialSummary && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-xs italic text-neutral-500">"{listing.editorialSummary}"</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-neutral-500" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleUnlist}
                className="text-xs text-neutral-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-neutral-200 transition-colors"
                title="Cancel pending submission"
              >
                {isPending ? "Cancelling..." : "Cancel Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── State 3: Suspended / Unlisted ── */}
      {(status === "suspended" || status === "unlisted") && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <RotateCcw className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-neutral-900">
                  {status === "suspended" ? "Listing suspended by UrPass" : "Event currently unlisted from UrPass Explore"}
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  This event is hidden from public Explore search and category feeds. Your direct registration URL and existing attendee tickets remain fully active and functional.
                </p>
                {listing?.rejectionReason && status === "suspended" && <p className="mt-2 text-slate-700">Admin feedback: {listing.rejectionReason}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors border border-neutral-200 shrink-0 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* ── State 4: Rejected / Changes Requested or Not Applied ── */}
      {(status === "not_applied" || status === "rejected" || status === "changes_requested" || status === "unlisted") && (
        <div className="space-y-4 pt-1">
          {/* Eligibility Checklist / Issues Banner */}
          {!readiness.ready ? (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Eligibility Requirements (Resolve before listing on Explore):</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-800/90">
                {readiness.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your event meets all UrPass Explore eligibility criteria.</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">
                {readiness.isFree ? "Free admission" : `From ₹${(readiness.minPricePaise / 100).toLocaleString("en-IN")}`}
              </span>
            </div>
          )}

          {/* Admin Feedback Box */}
          {(status === "rejected" || status === "changes_requested") && listing?.rejectionReason && (
            <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              isChangesRequested
                ? "bg-amber-50/80 border-amber-200 text-amber-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className={`w-4 h-4 shrink-0 ${isChangesRequested ? "text-amber-600" : "text-red-600"}`} />
                <span>{isChangesRequested ? "Curator Feedback (Changes Requested):" : "Curator Feedback (Declined):"}</span>
              </div>
              <p className="text-[11px] leading-relaxed pl-6">
                {listing.rejectionReason.replace(/^\[Changes Requested\]\s*/i, "")}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Marketplace City
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  >
                    {EXPLORE_CITIES.filter((c) => c !== "All Cities").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Event Category
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ExploreCategory)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 capitalize"
                  >
                    {EXPLORE_CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Highlights for Curators (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Featured speakers, keynote topic, workshop materials, or VIP perks"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                maxLength={140}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Short editorial snippet to assist marketplace curators in featuring your event.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-neutral-700 bg-white hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-neutral-500" />
                <span>Preview Card</span>
              </button>

              <button
                type="submit"
                disabled={isPending || !readiness.ready}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {status === "rejected" || status === "changes_requested"
                        ? "Resubmit for Review"
                        : status === "unlisted"
                        ? "Reactivate on Explore"
                        : "Apply for Explore"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Private Listing Preview Modal (Phase 6) ── */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
        >
          <div className="absolute inset-0" onClick={() => setPreviewOpen(false)} aria-hidden="true" />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-100 z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <div>
                <h3 id="preview-modal-title" className="text-base font-bold text-neutral-900">
                  Explore Marketplace Preview
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Private preview of how this event card appears on the public /explore marketplace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rendered Live Event Card */}
            <div className="max-w-sm mx-auto mb-5 pointer-events-none" aria-label="Non-interactive listing preview">
              <EventCard event={previewItem} />
            </div>

            {/* Metadata Summary Specs */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 text-xs space-y-2 text-neutral-600 mb-5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Target Marketplace:</span>
                <span className="font-semibold text-neutral-900">UrPass Explore ({selectedCity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Category Tag:</span>
                <span className="font-semibold text-neutral-900 capitalize">{selectedCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Admission Price:</span>
                <span className="font-semibold text-neutral-900">
                  {readiness.isFree ? "Free Registration" : `From ₹${(readiness.minPricePaise / 100).toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Curation Status:</span>
                <span className="font-semibold text-neutral-900 capitalize">{status.replace("_", " ")}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                Done Previewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
