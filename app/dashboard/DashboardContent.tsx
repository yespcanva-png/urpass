"use client";

import { useEffect, useState, useSyncExternalStore, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  QrCode,
  CheckCircle2,
  Ticket,
  ScanLine,
  ChevronRight,
  Clock,
  Building2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Palette,
  CreditCard,
  Search,
  Copy,
  Check,
  GraduationCap,
  Laptop,
  Mic,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { getUserOrganizations } from "@/app/actions/organizations";
import { createClient } from "@/lib/supabase/client";
import { detectCountryClient } from "@/lib/country-config";
import HeroBanner from "@/components/landing/HeroBanner";

const emptySubscribe = () => () => {};

interface EventRow {
  id: string;
  name: string;
  venue: string;
  event_date: string;
  status: string;
}

interface OrgRow {
  slug: string;
  name: string;
  brand_color: string;
  role: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  active:    { label: "Active",    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200/70", dot: "bg-emerald-500" },
  draft:     { label: "Draft",     cls: "bg-neutral-100 text-neutral-600 border border-neutral-200",     dot: "bg-neutral-400" },
  completed: { label: "Completed", cls: "bg-blue-50 text-blue-700 border border-blue-200/70",          dot: "bg-blue-500" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600 border border-red-200/70",             dot: "bg-red-500" },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });
}

const EVENT_TEMPLATES = [
  {
    slug: "college_fest",
    name: "College Fest & Symposium",
    category: "Campus",
    icon: GraduationCap,
    desc: "Multi-track technical fest with roll number check-in and certificate passes.",
  },
  {
    slug: "hackathon",
    name: "24h Hackathon & Meetup",
    category: "Developer",
    icon: Laptop,
    desc: "Team applications, sponsor badges, and multi-entrance scanner verification.",
  },
  {
    slug: "conference",
    name: "Corporate Summit & Expo",
    category: "Executive",
    icon: Mic,
    desc: "Keynote sessions, VIP attendee badges, and automatic business invoicing.",
  },
  {
    slug: "workshop",
    name: "Workshop & Masterclass",
    category: "Training",
    icon: BookOpen,
    desc: "Strict seat caps, attendee pre-approvals, and verified digital entry passes.",
  },
];

export default function DashboardContent() {
  const [firstName, setFirstName] = useState("");
  const dateLabel = useSyncExternalStore(emptySubscribe, formatDate, () => "Today");
  const greeting = useSyncExternalStore(emptySubscribe, getGreeting, () => "Welcome");
  const [planSlug, setPlanSlug] = useState("free");
  const [hasGateway, setHasGateway] = useState(false);
  const [country, setCountry] = useState<"IN" | "GB">("IN");
  const [trialInfo, setTrialInfo] = useState<{
    isEligible: boolean;
    isActiveTrial: boolean;
    planName: string;
    daysRemaining: number;
    renewalDate: string;
  } | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, passes: 0, checkedIn: 0 });
  const [events, setEvents] = useState<EventRow[]>([]);
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Table Filters
  const [filterTab, setFilterTab] = useState<"all" | "upcoming" | "draft" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCountry(detectCountryClient());

    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoaded(true);
          return;
        }

        const [
          { data: profile },
          { data: eventRows },
          { data: sub },
          { data: paySettings },
          memberships,
        ] = await Promise.all([
          supabase.from("profiles").select("full_name").eq("user_id", user.id).single(),
          supabase.from("events").select("id, name, venue, event_date, status")
            .eq("organizer_id", user.id).order("created_at", { ascending: false }),
          supabase
            .from("subscriptions")
            .select("status, is_trial, trial_used, trial_plan, trial_starts_at, trial_ends_at, plan:plans(name, slug)")
            .eq("user_id", user.id)
            .in("status", ["active", "trialing"])
            .maybeSingle(),
          supabase
            .from("payment_settings")
            .select("razorpay_key_id")
            .eq("user_id", user.id)
            .maybeSingle(),
          getUserOrganizations(),
        ]);

        setHasGateway(Boolean(paySettings?.razorpay_key_id));

        const allIds = eventRows?.map((e) => e.id) ?? [];
        const [{ count: totalPasses }, { count: totalCheckedIn }] = await Promise.all([
          allIds.length
            ? supabase.from("passes").select("*", { count: "exact", head: true }).in("event_id", allIds)
            : Promise.resolve({ count: 0 }),
          allIds.length
            ? supabase.from("check_ins").select("*", { count: "exact", head: true }).in("event_id", allIds)
            : Promise.resolve({ count: 0 }),
        ]);

        const isTrial = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) >= new Date());
        const isTrialExpired = Boolean(sub?.is_trial && sub?.trial_ends_at && new Date(sub.trial_ends_at) < new Date());
        const slug = isTrialExpired ? "free" : ((sub?.plan as unknown as { slug: string } | null)?.slug ?? "free");
        const planName = (sub?.plan as unknown as { name: string } | null)?.name ?? (slug ? slug.toUpperCase() : "Pro");
        const trialUsed = sub?.trial_used ?? false;

        let trialState = null;
        if (!trialUsed && slug === "free") {
          trialState = {
            isEligible: true,
            isActiveTrial: false,
            planName: "",
            daysRemaining: 0,
            renewalDate: "",
          };
        } else if (isTrial && sub?.trial_ends_at) {
          const endsAt = new Date(sub.trial_ends_at);
          const msRemaining = endsAt.getTime() - Date.now();
          const daysRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
          trialState = {
            isEligible: false,
            isActiveTrial: true,
            planName,
            daysRemaining,
            renewalDate: endsAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          };
        }
        setTrialInfo(trialState);

        setFirstName(profile?.full_name?.split(" ")[0] ?? "");
        setPlanSlug(slug);
        setStats({
          total: allIds.length,
          active: eventRows?.filter((e) => e.status === "active").length ?? 0,
          passes: totalPasses ?? 0,
          checkedIn: totalCheckedIn ?? 0,
        });
        setEvents((eventRows ?? []) as EventRow[]);
        setOrgs(
          (memberships ?? []).map((m) => {
            return { slug: m.org.slug, name: m.org.name, brand_color: m.org.brand_color, role: m.role };
          })
        );
        setLoaded(true);
      } catch (error) {
        console.error("Failed to load dashboard", error);
        setLoadError("We couldn't load your dashboard data. Refresh the page or sign in again.");
        setLoaded(true);
      }
    }
    load();
  }, []);

  function copyEventLink(eventId: string) {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/apply/${eventId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Filtered Events
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter((ev) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = ev.name.toLowerCase().includes(q) || (ev.venue || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filterTab === "all") return true;
      if (filterTab === "draft") return ev.status === "draft";
      const isPast = new Date(ev.event_date) < now;
      if (filterTab === "upcoming") return !isPast && ev.status === "active";
      if (filterTab === "past") return isPast || ev.status === "completed";
      return true;
    });
  }, [events, filterTab, searchQuery]);

  const checkinRate = stats.passes > 0 ? Math.round((stats.checkedIn / stats.passes) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* ── Top Announcement & Status Banner ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <HeroBanner initialCountry={country} />
        <span className="text-[11px] font-medium text-neutral-400 hidden sm:inline-block">
          {dateLabel}
        </span>
      </div>

      {/* ── Executive Dashboard Operations Banner ─────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-brand-950 p-5 sm:p-6 text-white border border-neutral-800 shadow-md">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-brand/20 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold text-emerald-300 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Event Operations Hub · Real-Time Sync
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {greeting}{firstName ? `, ${firstName}` : ""} — Event Command Center
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Launch registrations, design custom passes, and verify attendees at entrance gates in under 0.3s with 0% platform commission.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <Link
              href="/create-event"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </Link>
            <Link
              href="/scan"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              <ScanLine className="w-3.5 h-3.5 text-neutral-300" />
              <span>Gate Scanner</span>
            </Link>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{loadError}</p>
        </div>
      )}

      {/* ── Subtitle Trial Alert (Clean & Compact) ───────────────────── */}
      {loaded && trialInfo?.isEligible && (
        <div className="rounded-xl px-4 py-3 bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>30-Day Free Trial Available:</strong> Try Starter, Pro, or Business with zero platform fees.
            </span>
          </div>
          <Link
            href="/billing"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-neutral-900 font-semibold text-xs hover:bg-neutral-100 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>Activate Trial</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── 4 Clean Corporate Metrics ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs hover:border-neutral-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Total Events</span>
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
            {stats.total.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            {stats.active} published &amp; active
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs hover:border-neutral-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Registrations</span>
            <QrCode className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
            {stats.passes.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            Passes generated
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs hover:border-neutral-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Check-In Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
            {checkinRate}%
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            {stats.checkedIn} scanned at entrance
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs hover:border-neutral-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Razorpay Gateway</span>
            <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="flex items-center gap-1.5 my-1">
            <span className={`w-2 h-2 rounded-full ${hasGateway ? "bg-emerald-500" : "bg-neutral-300"}`} />
            <p className="text-sm font-bold text-neutral-900">
              {hasGateway ? "Live & Ready" : "Unconnected"}
            </p>
          </div>
          <Link
            href="/dashboard/settings#payment-gateway"
            className="text-[11px] text-neutral-500 hover:text-neutral-900 hover:underline"
          >
            {hasGateway ? "₹ & £ payouts active →" : "Connect Razorpay →"}
          </Link>
        </div>
      </div>

      {/* ── Main Operations Section ──────────────────────────────────── */}
      {loaded && events.length === 0 ? (
        /* ── Simple, Clean First-Time User Experience (Zoho Minimalist) ── */
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 sm:p-10 shadow-2xs text-center space-y-8">
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center mx-auto text-neutral-700 mb-3">
              <Ticket className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
              Welcome to UrPass Operations
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Create your registration page, design branded digital passes, and scan attendees with sub-second QR recognition.
            </p>
            <div className="pt-2">
              <Link
                href="/create-event"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Event</span>
              </Link>
            </div>
          </div>

          {/* 3 Step Workflow Overview */}
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 text-center">
              How UrPass Works
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60">
                <span className="text-xs font-bold text-neutral-900">1. Setup Registration</span>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Publish form with custom fields, ticket tiers, and direct UPI or card checkout.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60">
                <span className="text-xs font-bold text-neutral-900">2. Issue Passes</span>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Personalize ticket badges in Ticket Studio with verified QR security codes.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60">
                <span className="text-xs font-bold text-neutral-900">3. Gate Verification</span>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Fast sub-second scanner on any smartphone or handheld 2D scanner.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Clean Template Pills */}
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3 text-center">
              Or Start With a Template
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
              {EVENT_TEMPLATES.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.slug}
                    href={`/create-event?template=${t.slug}`}
                    className="p-3 rounded-xl border border-neutral-200/70 hover:border-neutral-900 hover:bg-neutral-50/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-900" />
                      <span className="text-[11px] font-semibold text-neutral-900 truncate">
                        {t.name.split(" ")[0]}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate">{t.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── Zoho Corporate Event Table (When Events Exist) ── */
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-2xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-3.5 sm:px-5 sm:py-3 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/40">
            {/* Tabs */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filterTab === "all" ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/80" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                All ({events.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("upcoming")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filterTab === "upcoming" ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/80" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("draft")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filterTab === "draft" ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/80" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Drafts
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("past")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filterTab === "past" ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200/80" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Past
              </button>
            </div>

            {/* Search */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="pl-8 pr-3 py-1 text-xs rounded-lg border border-neutral-200/90 bg-white focus:border-neutral-900 outline-none transition-colors w-full sm:w-56 text-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Table Rows */}
          {!loaded ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border border-neutral-100 rounded-lg">
                  <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3.5 w-40 rounded" />
                    <div className="skeleton h-2.5 w-24 rounded" />
                  </div>
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No events found matching &quot;{searchQuery || filterTab}&quot;.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredEvents.map((event) => {
                const cfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.cancelled;
                const evDate = new Date(event.event_date);
                const monthStr = evDate.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
                const dayStr = evDate.getDate();
                const dateFull = evDate.toLocaleDateString(country === "GB" ? "en-GB" : "en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={event.id}
                    className="p-3.5 sm:px-5 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-neutral-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Date badge */}
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200/80 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[8px] font-bold text-neutral-500 uppercase leading-none">
                          {monthStr}
                        </span>
                        <span className="text-sm font-bold text-neutral-900 leading-none mt-0.5">
                          {dayStr}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <Link
                            href={`/event/${event.id}`}
                            className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-brand transition-colors truncate"
                          >
                            {event.name}
                          </Link>
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                          <span className="truncate text-neutral-500">{event.venue || "Venue TBD"}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dateFull}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => copyEventLink(event.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
                        title="Copy attendee registration link"
                      >
                        {copiedId === event.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-neutral-400" />
                            <span>Link</span>
                          </>
                        )}
                      </button>
                      <Link
                        href={`/studio/${event.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <Palette className="w-3 h-3 text-neutral-400" />
                        <span>Studio</span>
                      </Link>
                      <Link
                        href={`/scan/${event.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <ScanLine className="w-3 h-3 text-neutral-400" />
                        <span>Scan</span>
                      </Link>
                      <Link
                        href={`/event/${event.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Organization Teams (Clean Minimalist Strip) ─────────────── */}
      {loaded && orgs.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Team Workspaces</span>
            <Link href="/dashboard/organizations" className="text-xs text-neutral-500 hover:text-neutral-900 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {orgs.slice(0, 4).map((org) => (
              <Link
                key={org.slug}
                href={`/org/${org.slug}`}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50 transition-all group"
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                  style={{ background: org.brand_color || "#18181b" }}
                >
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">{org.name}</p>
                  <p className="text-[10px] text-neutral-400 capitalize">{org.role}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Zoho Clean Footer Toolbar ─────────────────────────────────── */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 border-t border-neutral-200/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>Enterprise grade</span>
        </div>
        <div className="flex items-center gap-4 font-medium">
          <Link href="/dashboard/settings#payment-gateway" className="hover:text-neutral-900">
            Payment Gateway
          </Link>
          <Link href="/dashboard/developer" className="hover:text-neutral-900">
            API &amp; Webhooks
          </Link>
          <Link href="/billing" className="hover:text-neutral-900">
            Billing
          </Link>
        </div>
      </div>
    </div>
  );
}
