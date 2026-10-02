"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  Users,
  QrCode,
  Radio,
  Printer,
  Shield,
  Compass,
  Store,
  Briefcase,
  Target,
  Download,
  Calendar,
  Layers,
  ArrowLeft,
  Building2,
  Sliders,
  Check,
} from "lucide-react";

export default function WhatsNewPage() {
  const releases = [
    {
      version: "v3.0.0",
      date: "October 2026",
      tag: "Stage 3",
      tagColor: "bg-purple-100 text-purple-800 border-purple-200",
      title: "Exhibitor, Sponsor & QR Lead Retrieval Suite",
      description:
        "Transform commercial trade shows, expos, and corporate conferences with self-service exhibitor portals, sponsor tier deliverables, and instant attendee lead qualification.",
      highlights: [
        {
          icon: Store,
          title: "Exhibitor Self-Service Portal & Booth Check-In",
          desc: "Dedicated token-based portal for exhibitors to manage company profiles, booth staff passes, and real-time booth operational status.",
        },
        {
          icon: Target,
          title: "Instant QR Lead Capture & Qualification",
          desc: "Exhibitor booth staff scan attendee passes to instantly retrieve verified delegate contacts, assign Hot/Warm/Cold ratings, add custom notes, and record product interest.",
        },
        {
          icon: Briefcase,
          title: "Sponsorship Tiers & Deliverables Matrix",
          desc: "Configure Platinum, Gold, Silver, Bronze, and custom sponsor packages with granular visibility placements (website, badges, emails, agenda) and deliverables tracking.",
        },
        {
          icon: Calendar,
          title: "B2B Matchmaking & Meeting Scheduling",
          desc: "Allow trade delegates and buyers to request dedicated 1-on-1 meetings with exhibitors with integrated timeslots and booth locator mapping.",
        },
        {
          icon: Download,
          title: "1-Click Lead CSV & CRM Export",
          desc: "Exhibitors and organizers can export clean, enriched CSV delegate lead sheets filtered by booth, staff member, and qualification rating.",
        },
      ],
    },
    {
      version: "v2.0.0",
      date: "September 2026",
      tag: "Stage 2",
      tagColor: "bg-blue-100 text-blue-800 border-blue-200",
      title: "Physical Event Operations & Crowd Control Engine",
      description:
        "Full onsite command center designed for high-throughput venues, multi-gate check-ins, lanyard badge printing, and crowd safety limits.",
      highlights: [
        {
          icon: Printer,
          title: "Lanyard Badge Studio & Print Queue",
          desc: "Physical badge presets for Attendee, VIP, Speaker, Staff, Sponsor, and Exhibitor with thermal printer integrations and mandatory reprint reason auditing.",
        },
        {
          icon: Users,
          title: "Onsite Registration Desk & Walk-In Intake",
          desc: "Sub-second attendee search, on-the-spot UPI/Cash payments, instant QR pass generation, and automatic print queueing.",
        },
        {
          icon: Shield,
          title: "Multi-Zone Crowd Control & Safety Auto-Lock",
          desc: "Track live occupancy across Main Hall, VIP Lounges, and Expo Floors with automated door lockouts when capacity reaches 100%.",
        },
        {
          icon: Radio,
          title: "Directional Gate Scanning & Device Management",
          desc: "Switch camera scanner between IN and OUT directions, enforce role-based access rules, and monitor scanner battery and heartbeat statuses in real time.",
        },
        {
          icon: Compass,
          title: "Interactive Venue Floor Plan & Spatial Locator",
          desc: "Attendee-facing schematic locator to pinpoint halls, booths, registration desks, dining areas, and emergency exits.",
        },
      ],
    },
    {
      version: "v1.0.0",
      date: "August 2026",
      tag: "Stage 1",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      title: "Enterprise Conference & Agenda Management",
      description:
        "Professional conference infrastructure for multi-track agendas, speaker directories, session room capacities, and collision detection.",
      highlights: [
        {
          icon: CalendarDays,
          title: "Multi-Track Agenda Builder",
          desc: "Coordinate parallel tracks, keynote slots, and breakout rooms with automated schedule conflict detection.",
        },
        {
          icon: Users,
          title: "Keynote & Speaker Directory",
          desc: "Publish verified speaker cards, LinkedIn links, topic bios, and track tags with automated double-booking warnings.",
        },
        {
          icon: QrCode,
          title: "Sub-0.3s QR Check-In Scanner",
          desc: "Browser-based camera scanner with offline sync, duplicate pass detection, and instant visual validation confirmations.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              UrPass Product Changelog
            </span>
          </div>

          <Link
            href="/create-event"
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs"
          >
            Create Event
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-white border-b border-neutral-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Continuous Innovation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900">
            What&apos;s New in UrPass
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            From single-day college hackathons to 10,000-delegate trade shows: explore all the latest capabilities shipped across Conference, Physical Operations, and Commercial Exhibitions.
          </p>
        </div>
      </div>

      {/* Release Timeline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
        {releases.map((release, rIdx) => (
          <div
            key={release.version}
            className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden"
          >
            {/* Version Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${release.tagColor}`}
                >
                  {release.tag}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  {release.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                <span className="font-bold text-neutral-900">{release.version}</span>
                <span>·</span>
                <span>{release.date}</span>
              </div>
            </div>

            <p className="text-sm text-neutral-600 mt-4 leading-relaxed max-w-3xl">
              {release.description}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {release.highlights.map((h, hIdx) => {
                const Icon = h.icon;
                return (
                  <div
                    key={hIdx}
                    className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0 text-brand shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-bold text-neutral-900">{h.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
