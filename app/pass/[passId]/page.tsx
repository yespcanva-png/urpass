import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, CheckCircle, Ticket, Wifi, ExternalLink } from "lucide-react";
import PassQR from "@/components/pass/PassQR";
import { getUserPlan } from "@/lib/plan";
import DownloadPassButton from "@/components/pass/DownloadPassButton";
import AutoDownload from "@/components/pass/AutoDownload";
import WhatsAppShareButton from "@/components/pass/WhatsAppShareButton";
import { Suspense } from "react";
import { getSupabaseUrl } from "@/lib/supabase/config";
import {
  resolveTicketDesign,
} from "@/lib/pass-design";
import StudioPassRenderer from "@/components/studio/StudioPassRenderer";
import { isStudioDesign } from "@/lib/studio/resolver";

function adminClient() {
  return createAdminClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ passId: string }>;
}): Promise<Metadata> {
  const { passId: passToken } = await params;
  const supabase = await createClient();
  const { data: pass } = await supabase
    .from("passes")
    .select("event_id")
    .eq("pass_token", passToken)
    .single();
  if (!pass) return { title: "Event Pass" };
  const { data: event } = await supabase
    .from("events")
    .select("name")
    .eq("id", pass.event_id)
    .single();
  return {
    title: event ? `${event.name} — Your Pass` : "Event Pass",
    description: event ? `Your digital entry pass for ${event.name}. Show this QR code at the entrance.` : "Your digital event pass.",
    robots: { index: false, follow: false },
  };
}

const PASS_TYPE_LABEL: Record<string, string> = {
  participant: "Participant",
  vip: "VIP",
  speaker: "Speaker",
  organizer: "Organizer",
};

const PLATFORM_LABEL: Record<string, string> = {
  zoom: "Zoom Meeting",
  google_meet: "Google Meet",
  teams: "Microsoft Teams",
  custom: "Online Meeting",
};

export default async function PassPage({
  params,
}: {
  params: Promise<{ passId: string }>;
}) {
  const { passId: passToken } = await params;
  const admin = adminClient();

  const { data: pass } = await admin
    .from("passes")
    .select("pass_token, pass_type, status, attendee_id, event_id")
    .eq("pass_token", passToken)
    .single();

  if (!pass) notFound();

  const [{ data: attendee }, { data: event }] = await Promise.all([
    admin
      .from("attendees")
      .select("name, email, phone, application_status")
      .eq("id", pass.attendee_id)
      .single(),
    admin
      .from("events")
      .select("name, event_date, start_time, end_time, venue, event_type, meeting_url, meeting_platform, organizer_id, custom_pass_design")
      .eq("id", pass.event_id)
      .single(),
  ]);

  if (!attendee || !event) notFound();
  const organizerId = event.organizer_id as string | null ?? null;
  const [plan, { data: orgProfile }] = await Promise.all([
    organizerId ? getUserPlan(admin, organizerId) : Promise.resolve(null),
    organizerId
      ? admin
          .from("profiles")
          .select("org_name, brand_color, org_logo_url, hide_urpass_branding, custom_pass_design")
          .eq("user_id", organizerId)
          .single()
      : Promise.resolve({ data: null }),
  ]);

  const showBranding = !(plan?.canRemoveBranding && orgProfile?.hide_urpass_branding);
  const isPro = plan ? plan.canUse("custom_pass_design") : false;
  const rawCustomDesign = event.custom_pass_design || orgProfile?.custom_pass_design;
  const isStudio = isPro && isStudioDesign(rawCustomDesign) && rawCustomDesign.isPublished !== false;

  const design = isPro
    ? resolveTicketDesign(event.custom_pass_design, orgProfile?.custom_pass_design, orgProfile?.brand_color)
    : resolveTicketDesign(null, null, null);

  const brandColor = design.primaryColor;
  const isDark = design.template === "dark";
  const isMinimal = design.template === "minimal";
  const orgName = (isPro && orgProfile?.org_name) ? orgProfile.org_name : null;
  const orgLogoUrl = (isPro && orgProfile?.org_logo_url) ? orgProfile.org_logo_url : null;
  const logoToDisplay = design.logoUrl || orgLogoUrl;

  const isCheckedIn = pass.status === "checked_in";
  const isOnline = event.event_type === "online";
  const isHybrid = event.event_type === "hybrid";
  const hasJoinLink = (isOnline || isHybrid) && !!event.meeting_url && attendee.application_status === "approved";

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  const shortCode =
    pass.pass_token
      .slice(0, 8)
      .match(/.{1,4}/g)
      ?.join("-") ?? pass.pass_token.slice(0, 8);

  const platformLabel = event.meeting_platform
    ? PLATFORM_LABEL[event.meeting_platform] ?? "Online Meeting"
    : "Online Meeting";

  function getStatusText() {
    if (isCheckedIn) return null;
    if (isOnline) return "Approved · Use Join button below";
    if (isHybrid) return "Valid · QR for entry or join online";
    return "Valid · Show at entrance";
  }

  const statusText = getStatusText();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5 pb-16"
      style={{
        backgroundColor: isDark ? "#0a0a0d" : "#f8fafc",
      }}
    >
      {/* Wordmark — shown only on Free plan */}
      {showBranding && (
        <div className="flex items-center gap-1.5 mb-8 apply-in-1">
          <Ticket className="w-4 h-4 text-brand" />
          <span className="text-xs font-bold tracking-widest uppercase text-neutral-900">
            URPASS
          </span>
        </div>
      )}

      {/* Visual Ticket Pass Card: Studio Design or Standard Template */}
      {isStudio ? (
        <div className="w-full max-w-sm flex justify-center mb-6">
          <StudioPassRenderer
            design={rawCustomDesign}
            attendee={attendee}
            event={event}
            passToken={pass.pass_token}
            ticketId={`#${shortCode.toUpperCase()}`}
          />
        </div>
      ) : (
        <div
          className={`relative w-full max-w-sm rounded-2xl border shadow-sm select-none overflow-hidden transition-all ${
            isDark
              ? "bg-[#121216] border-neutral-800 text-white"
              : isMinimal
              ? "bg-white border-neutral-200 text-neutral-900"
            : "bg-white border-neutral-200/90 text-neutral-900"
        }`}
        style={{
          boxShadow: isDark
            ? "0 4px 24px -2px rgba(0, 0, 0, 0.5)"
            : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Optional background image with contrast-preserving overlay */}
        {design.backgroundImageUrl && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={design.backgroundImageUrl}
              alt="Ticket Background"
              className="w-full h-full object-cover opacity-15"
            />
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-b from-[#121216]/90 via-[#121216]/85 to-[#121216]/95"
                  : "bg-gradient-to-b from-white/90 via-white/85 to-white/95"
              }`}
            />
          </div>
        )}

        {/* Top Accent Strip (Modern template only) */}
        {design.template === "modern" && (
          <div
            className="h-1.5 w-full relative z-10"
            style={{ backgroundColor: brandColor }}
          />
        )}

        {/* Ticket Body */}
        <div className="relative z-10 p-6 flex flex-col items-center text-center">
          {/* Logo / Brand Header */}
          <div className="mb-4 flex items-center justify-center">
            {logoToDisplay ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoToDisplay}
                alt="Logo"
                className="h-7 max-w-[120px] object-contain"
              />
            ) : (
              <span
                className="text-[11px] font-black tracking-widest uppercase"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                {orgName || "URPASS"}
              </span>
            )}
          </div>

          {/* Large Event Name */}
          <h1 className="text-xl font-bold tracking-tight mb-2 uppercase leading-snug max-w-xs">
            {event.name}
          </h1>

          {/* Event Date & Time */}
          <p
            className={`text-xs font-semibold tracking-wide mb-1 flex items-center gap-1.5 ${
              isDark ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span>
              {formattedDate} | {event.start_time}–{event.end_time}
            </span>
          </p>

          {/* Venue (if toggled) */}
          {design.showVenue && event.venue && (
            <p
              className={`text-xs flex items-center gap-1.5 mb-4 ${
                isDark ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <span className="truncate max-w-[240px]">{event.venue}</span>
            </p>
          )}

          {/* Divider */}
          <div
            className={`w-full border-t my-2 ${
              isDark ? "border-neutral-800" : "border-neutral-100"
            }`}
          />

          {/* Large Centered QR Code with clean white space */}
          {!isOnline && (
            <div className="my-4 flex flex-col items-center">
              <div className="p-4 bg-white rounded-xl shadow-xs border border-neutral-100 flex items-center justify-center">
                <PassQR value={pass.pass_token} size={160} />
              </div>
            </div>
          )}

          {/* Online-only icon area */}
          {isOnline && (
            <div className="w-full flex flex-col items-center gap-3 py-4 my-2">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                style={{
                  backgroundColor: `${brandColor}15`,
                  borderColor: `${brandColor}30`,
                }}
              >
                <Wifi className="w-8 h-8" style={{ color: brandColor }} />
              </div>
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                Online Event
              </p>
              <p className="text-xs text-neutral-400">{platformLabel}</p>
            </div>
          )}

          {/* Attendee Name (if toggled) */}
          {design.showAttendeeName && (
            <div className="mt-1 mb-2">
              <p className="text-base font-bold tracking-tight">
                {attendee.name}
              </p>
            </div>
          )}

          {/* Ticket Type Pill (if toggled) */}
          {design.showTicketType && (
            <div className="mb-4">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border"
                style={{
                  borderColor: `${brandColor}30`,
                  color: brandColor,
                  backgroundColor: `${brandColor}12`,
                }}
              >
                <Ticket className="w-3 h-3" />
                {PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type}
              </span>
            </div>
          )}

          {/* Ticket ID (if toggled) */}
          {design.showTicketId && (
            <div
              className={`w-full border-t pt-3 mt-1 flex flex-col items-center gap-0.5 ${
                isDark ? "border-neutral-800" : "border-neutral-100"
              }`}
            >
              <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                TICKET ID
              </span>
              <span className="text-xs font-mono font-semibold tracking-wider">
                #{shortCode.toUpperCase()}
              </span>
            </div>
          )}

          {/* Status strip */}
          <div className="w-full mt-4">
            {isCheckedIn ? (
              <div className="w-full flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2 justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-xs font-semibold text-green-700">Checked in</span>
              </div>
            ) : (
              <div
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 justify-center text-xs font-semibold"
                style={{
                  backgroundColor: `${brandColor}12`,
                  color: brandColor,
                  border: `1px solid ${brandColor}25`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: brandColor }}
                />
                <span>{statusText}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {showBranding && (
        <p className="text-xs text-neutral-300 mt-12 pass-in-2">Powered by URPASS</p>
      )}

      {/* Join Event button — for online and hybrid events */}
      {hasJoinLink && (
        <a
          href={`/api/join/${pass.pass_token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full max-w-sm py-4 rounded-2xl text-base font-bold text-white hover:opacity-90 transition-opacity mt-6"
          style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" }}
        >
          <ExternalLink className="w-5 h-5" />
          Join Event
        </a>
      )}

      <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-sm pass-in-3">
        <WhatsAppShareButton
          eventName={event.name}
          eventDate={formattedDate}
          venue={event.venue ?? "Online"}
          passToken={pass.pass_token}
          attendeeName={attendee.name}
          phone={attendee.phone}
        />
        <DownloadPassButton
          passToken={pass.pass_token}
          fileName={`${event.name.replace(/\s+/g, "-").toLowerCase()}-pass.png`}
        />
      </div>

      <Suspense>
        <AutoDownload
          passToken={pass.pass_token}
          fileName={`${event.name.replace(/\s+/g, "-").toLowerCase()}-pass.png`}
        />
      </Suspense>
    </div>
  );
}
