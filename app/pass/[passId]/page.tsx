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
  resolvePassDesign,
  getPatternStyle,
  getFontFamilyCls,
} from "@/lib/pass-design";

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

const passTypeCls: Record<string, string> = {
  participant: "bg-purple-500/10 text-purple-100 border-purple-400/25",
  vip: "bg-amber-400/10 text-amber-200 border-amber-300/25",
  speaker: "bg-blue-400/10 text-blue-200 border-blue-300/25",
  organizer: "bg-emerald-400/10 text-emerald-200 border-emerald-300/25",
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

  const design = isPro
    ? resolvePassDesign(event.custom_pass_design, orgProfile?.custom_pass_design, orgProfile?.brand_color)
    : resolvePassDesign(null, null, null);

  const brandColor = design.primaryColor;
  const brandColorDark = design.secondaryColor;
  const orgName = (isPro && orgProfile?.org_name) ? orgProfile.org_name : null;
  const orgLogoUrl = (isPro && orgProfile?.org_logo_url) ? orgProfile.org_logo_url : null;
  const patternStyle = getPatternStyle(design.pattern, design.primaryColor, design.secondaryColor, design.headerStyle);
  const fontCls = getFontFamilyCls(design.fontFamily);

  const isCheckedIn = pass.status === "checked_in";
  const isOnline = event.event_type === "online";
  const isHybrid = event.event_type === "hybrid";
  const hasJoinLink = (isOnline || isHybrid) && !!event.meeting_url && attendee.application_status === "approved";

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const shortCode =
    pass.pass_token
      .slice(0, 8)
      .match(/.{1,4}/g)
      ?.join("-") ?? pass.pass_token.slice(0, 8);

  const typeCls = passTypeCls[pass.pass_type] ?? passTypeCls.participant;

  const platformLabel = event.meeting_platform
    ? PLATFORM_LABEL[event.meeting_platform] ?? "Online Meeting"
    : "Online Meeting";

  // Determine status strip text based on event type
  function getStatusText() {
    if (isCheckedIn) return null; // handled separately
    if (isOnline) return "Approved · Use Join button below";
    if (isHybrid) return "Valid · QR for entry or join online";
    return "Valid · Show at entrance";
  }

  const statusText = getStatusText();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5 pb-16"
      style={{
        background:
          "radial-gradient(ellipse 100% 60% at 50% 0%, #ede9fe 0%, #f5f3ff 40%, #ffffff 70%)",
      }}
    >
      {/* Wordmark — shown only on Free plan */}
      {showBranding && (
        <div className="flex items-center gap-1.5 mb-10 apply-in-1">
          <Ticket className="w-4 h-4 text-brand" />
          <span className="text-sm font-bold tracking-widest uppercase text-neutral-900">
            URPASS
          </span>
        </div>
      )}

      {/* Three-layer card with dynamic theme & typography */}
      <div
        className={`relative w-full max-w-sm pass-scale-in select-none ${fontCls}`}
        style={
          design.accentGlow
            ? { filter: `drop-shadow(0 20px 30px ${brandColor}35)` }
            : undefined
        }
      >
        <div
          className="absolute inset-0 translate-x-5 translate-y-5 rounded-3xl opacity-30"
          style={{ backgroundColor: `${brandColor}25` }}
        />
        <div
          className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-3xl opacity-40"
          style={{ backgroundColor: `${brandColor}40` }}
        />

        <div
          className={`relative rounded-3xl shadow-2xl border overflow-hidden animate-float ${
            design.theme === "cyber"
              ? "bg-neutral-950 border-neutral-800 text-neutral-100"
              : design.theme === "minimal"
              ? "bg-white border-neutral-900 text-neutral-900"
              : "bg-white border-neutral-100 text-neutral-900"
          }`}
        >
          {/* Lanyard cutout for Conference Badge theme */}
          {design.theme === "badge" && (
            <div className="w-full bg-neutral-100 py-2.5 flex items-center justify-center border-b border-neutral-200">
              <div className="w-10 h-3 rounded-full bg-neutral-300 border border-neutral-400/50 shadow-inner" />
            </div>
          )}

          {/* Banner cover if provided */}
          {design.bannerUrl && (
            <div className="w-full h-28 overflow-hidden border-b border-white/15 bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.bannerUrl}
                alt="Event Banner"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Brand header */}
          <div
            className="px-6 pt-6 pb-8 relative overflow-hidden"
            style={patternStyle}
          >
            <div className="relative flex items-start justify-between mb-5">
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  {orgLogoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={orgLogoUrl} alt="logo" className="w-4 h-4 rounded object-cover" />
                  )}
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/70">
                    {orgName ? `${orgName} · ${design.badgeLabel || "Event Pass"}` : design.badgeLabel || "Event Pass"}
                  </p>
                </div>
                <h1 className="text-xl font-bold text-white leading-snug">
                  {event.name}
                </h1>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize border mt-1 ${typeCls}`}
              >
                {PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type}
              </span>
            </div>

            <div className="relative flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {formattedDate} &middot; {event.start_time}–{event.end_time}
                </span>
              </div>
              {/* Show venue only if not purely online */}
              {!isOnline && event.venue && (
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{event.venue}</span>
                </div>
              )}
              {isOnline && (
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Wifi className="w-3.5 h-3.5 shrink-0" />
                  <span>{platformLabel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tear line for Classic theme */}
          {design.theme === "classic" && (
            <div className="relative h-0">
              <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#f5f3ff]" />
              <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#f5f3ff]" />
              <div className="absolute left-3 right-3 border-t border-dashed border-neutral-200" />
            </div>
          )}

          {/* Body */}
          <div className="px-6 pt-8 pb-6 flex flex-col items-center gap-4">
            {/* Attendee */}
            <div className="w-full text-center">
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">
                Attendee
              </p>
              <p className={`text-lg font-bold ${design.theme === "cyber" ? "text-white" : "text-neutral-900"}`}>
                {attendee.name}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">{attendee.email}</p>
            </div>

            {/* QR section — for physical and hybrid events */}
            {!isOnline && (
              <div
                className={`p-2 rounded-2xl flex flex-col items-center gap-2 ${
                  design.showQrBorder ? "border-2" : ""
                } ${design.theme === "cyber" ? "bg-neutral-900" : "bg-neutral-50/80"}`}
                style={{
                  borderColor: design.showQrBorder ? brandColor : undefined,
                }}
              >
                <PassQR value={pass.pass_token} size={164} />
                <p className="text-[10px] text-neutral-400 font-mono tracking-widest">
                  {shortCode.toUpperCase()}
                </p>
              </div>
            )}

            {/* Online-only icon area — replaces QR */}
            {isOnline && (
              <div className="w-full flex flex-col items-center gap-3 py-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${brandColor}15`,
                    borderColor: `${brandColor}30`,
                  }}
                >
                  <Wifi className="w-8 h-8" style={{ color: brandColor }} />
                </div>
                <p className={`text-sm font-semibold ${design.theme === "cyber" ? "text-white" : "text-neutral-900"}`}>
                  Online Event
                </p>
                <p className="text-xs text-neutral-400">{platformLabel}</p>
              </div>
            )}

            {/* Status strip */}
            {isCheckedIn ? (
              <div className="w-full flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-xs font-semibold text-green-700">Checked in</span>
              </div>
            ) : (
              <div
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColorDark} 100%)`,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                <span className="text-xs font-semibold text-white">
                  {statusText}
                </span>
              </div>
            )}

            {/* Custom footer disclaimer or sponsor note */}
            {design.footerNote && (
              <p className="text-[10px] text-neutral-400 text-center mt-1 leading-normal px-2">
                {design.footerNote}
              </p>
            )}
          </div>
        </div>
      </div>

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
