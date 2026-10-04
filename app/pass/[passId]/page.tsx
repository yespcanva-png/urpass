import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Wifi,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";
import PassQR from "@/components/pass/PassQR";
import DownloadPassButton from "@/components/pass/DownloadPassButton";
import AutoDownload from "@/components/pass/AutoDownload";
import WhatsAppShareButton from "@/components/pass/WhatsAppShareButton";
import AddToCalendarButton from "@/components/pass/AddToCalendarButton";
import { Suspense } from "react";
import { resolveTicketDesign } from "@/lib/pass-design";
import StudioPassRenderer from "@/components/studio/StudioPassRenderer";
import { isStudioDesign } from "@/lib/studio/resolver";
import { getHardenedPublicPass } from "@/lib/passes/public-pass";

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
  const publicPass = await getHardenedPublicPass(passToken);

  if (!publicPass) notFound();

  const { pass, attendee, event, branding } = publicPass;

  const showBranding = branding.showBranding;
  const isPro = branding.isPro;
  const rawCustomDesign = branding.customDesign;
  const isStudio = isPro && isStudioDesign(rawCustomDesign) && rawCustomDesign.isPublished !== false;

  const design = isPro
    ? resolveTicketDesign(event.custom_pass_design, branding.customDesign, null)
    : resolveTicketDesign(null, null, null);

  const categoryColor = pass.pass_type ? design.categoryColors?.[pass.pass_type] : null;
  const brandColor = categoryColor || design.primaryColor;
  const shapeRadius =
    design.shape === "rounded"
      ? "rounded-[28px]"
      : design.shape === "compact"
      ? "rounded-xl"
      : "rounded-2xl";
  const isDark = design.template === "dark";
  const isMinimal = design.template === "minimal";
  const orgName = branding.orgName;
  const orgLogoUrl = branding.orgLogoUrl;
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
      className="min-h-screen flex flex-col items-center justify-center p-5 pb-16 relative overflow-hidden"
      style={{
        backgroundColor: isDark ? "#0a0a0d" : "#f8fafc",
      }}
    >
      {/* Background ambient light orbs for rich translucent glass refraction */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-brand/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/15 via-pink-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Wordmark — shown only on Free plan */}
      {showBranding && (
        <div className="flex items-center gap-1.5 mb-8 apply-in-1 relative z-10">
          <Ticket className="w-4 h-4 text-brand" />
          <span className="text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white">
            URPASS
          </span>
        </div>
      )}

      {/* Visual Ticket Pass Card: Studio Design or Standard Template */}
      {isStudio ? (
        <div className="w-full max-w-sm flex justify-center mb-6 relative z-10">
          <StudioPassRenderer
            design={rawCustomDesign}
            attendee={attendee}
            event={{ ...event, venue: event.venue ?? undefined }}
            passToken={pass.pass_token}
            ticketId={`#${shortCode.toUpperCase()}`}
          />
        </div>
      ) : (
        <div
          className={`relative z-10 w-full max-w-[370px] ${shapeRadius} border select-none overflow-hidden transition-all shadow-2xl backdrop-blur-2xl ${
            isDark
              ? "bg-[#0B0E14]/85 border-neutral-800/80 text-white"
              : isMinimal
              ? "bg-white/85 border-neutral-900/80 text-neutral-900"
              : "bg-white/85 border-white/60 dark:border-white/10 text-neutral-900"
          }`}
          style={{
            boxShadow: isDark
              ? "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(109, 40, 217, 0.15)"
              : "0 20px 50px -15px rgba(0, 0, 0, 0.08), 0 0 30px -10px rgba(99, 91, 255, 0.1)",
          }}
        >
          {/* Optional background image with contrast-preserving overlay */}
          {design.backgroundImageUrl && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.backgroundImageUrl}
                alt="Ticket Background"
                className="w-full h-full object-cover opacity-10"
              />
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? "bg-gradient-to-b from-[#0B0E14]/90 via-[#0B0E14]/85 to-[#0B0E14]/95"
                    : "bg-gradient-to-b from-white/90 via-white/85 to-white/95"
                }`}
              />
            </div>
          )}

          {/* Top Accent Strip */}
          <div
            className="h-1.5 w-full relative z-10"
            style={{ backgroundColor: brandColor }}
          />

          {/* Executive Header Segment */}
          <div className="relative z-10 px-6 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {logoToDisplay ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoToDisplay}
                    alt="Logo"
                    className="h-7 max-w-[130px] object-contain"
                  />
                ) : (
                  <span
                    className="text-[11px] font-black tracking-widest uppercase"
                    style={{ color: isDark ? "#ffffff" : "#09090b" }}
                  >
                    {orgName || "URPASS"}
                  </span>
                )}

                {design.sponsorLogoUrl && (
                  <>
                    <span className="text-neutral-300 text-xs">×</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={design.sponsorLogoUrl}
                      alt="Sponsor Logo"
                      className="h-5 max-w-[90px] object-contain opacity-80"
                    />
                  </>
                )}
              </div>

              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-neutral-100/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700 shadow-2xs backdrop-blur-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>OFFICIAL PASS</span>
              </span>
            </div>

            {/* Event Name */}
            <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase leading-snug line-clamp-2">
              {event.name}
            </h1>

            {/* Structured Event Metadata Grid */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 text-[10px]">
              {design.showEventDate !== false && (
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-neutral-200/70 dark:border-white/10 flex items-start gap-2 shadow-2xs">
                  <CalendarDays className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">
                      SCHEDULE
                    </p>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                      {formattedDate}
                    </p>
                    <p className="text-neutral-500 text-[9px] truncate">
                      {event.start_time}–{event.end_time}
                    </p>
                  </div>
                </div>
              )}

              {design.showVenue && event.venue && (
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-neutral-200/70 dark:border-white/10 flex items-start gap-2 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">
                      LOCATION
                    </p>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                      {event.venue}
                    </p>
                    <p className="text-neutral-500 text-[9px] truncate">
                      Venue Access
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Micro-perforated coupon notch line */}
          <div className="relative h-4 bg-transparent flex items-center">
            <div className={`absolute -left-2.5 w-5 h-5 rounded-full ${isDark ? "bg-[#0a0a0d]/90 border-neutral-800" : "bg-neutral-100/90 border-neutral-200"} border backdrop-blur-xs`} />
            <div className={`absolute -right-2.5 w-5 h-5 rounded-full ${isDark ? "bg-[#0a0a0d]/90 border-neutral-800" : "bg-neutral-100/90 border-neutral-200"} border backdrop-blur-xs`} />
            <div className={`w-full border-t border-dashed ${isDark ? "border-neutral-800" : "border-neutral-200"} mx-4`} />
          </div>

          {/* Ticket Body */}
          <div className="relative z-10 px-6 pb-6 flex flex-col items-center text-center">
            {/* Attendee Details Card */}
            <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-neutral-200/70 dark:border-white/10 mb-3.5 shadow-2xs">
              <div className="text-left min-w-0 pr-2">
                <p className="text-[8px] font-bold tracking-widest uppercase text-neutral-400 mb-0.5">
                  DELEGATE
                </p>
                {design.showAttendeeName && (
                  <p className="text-base font-bold text-neutral-950 dark:text-white truncate">
                    {attendee.name}
                  </p>
                )}
                {design.showPhone && attendee.phone && (
                  <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                    {attendee.phone}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1">
                {design.showTicketType && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs"
                    style={{
                      borderColor: `${brandColor}40`,
                      color: brandColor,
                      backgroundColor: `${brandColor}15`,
                    }}
                  >
                    <Ticket className="w-3 h-3" />
                    {PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type}
                  </span>
                )}

                {design.showRegistrationNumber && (
                  <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-white/90 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 shadow-2xs">
                    REG-{shortCode.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* QR Code Container with High-Contrast White Card */}
            {!isOnline && (
              <div className="my-1 flex flex-col items-center w-full">
                <div className="p-4 bg-white/95 dark:bg-white backdrop-blur-md rounded-2xl shadow-xs border border-neutral-200/80 flex flex-col items-center justify-center">
                  <PassQR value={pass.pass_token} size={165} />
                  <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 uppercase mt-2.5">
                    SCAN AT ENTRANCE TERMINAL
                  </span>
                </div>
              </div>
            )}

            {/* Online-only executive access module */}
            {isOnline && (
              <div className="w-full my-2 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs">
                <div
                  className="px-4 py-3 text-left"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, ${brandColor}24 0%, rgba(255,255,255,0.03) 100%)`
                      : `linear-gradient(135deg, ${brandColor}14 0%, #ffffff 70%)`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
                        style={{
                          backgroundColor: `${brandColor}12`,
                          borderColor: `${brandColor}30`,
                        }}
                      >
                        <Wifi className="w-5 h-5" style={{ color: brandColor }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black tracking-widest uppercase text-neutral-400">
                          Virtual Credential
                        </p>
                        <p className={`text-sm font-black truncate ${isDark ? "text-white" : "text-neutral-950"}`}>
                          Online Event Access
                        </p>
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wider shrink-0"
                      style={{
                        color: brandColor,
                        borderColor: `${brandColor}35`,
                        backgroundColor: `${brandColor}12`,
                      }}
                    >
                      <Lock className="w-3 h-3" />
                      Secured
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-neutral-100 dark:divide-neutral-800 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="px-4 py-3 text-left">
                    <p className="text-[8px] font-black tracking-widest uppercase text-neutral-400">
                      Platform
                    </p>
                    <p className={`mt-0.5 text-xs font-bold truncate ${isDark ? "text-neutral-200" : "text-neutral-800"}`}>
                      {platformLabel}
                    </p>
                  </div>
                  <div className="px-4 py-3 text-left">
                    <p className="text-[8px] font-black tracking-widest uppercase text-neutral-400">
                      Access
                    </p>
                    <p className={`mt-0.5 text-xs font-bold truncate ${isDark ? "text-neutral-200" : "text-neutral-800"}`}>
                      Approved attendees
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ticket ID Tag */}
            {design.showTicketId && (
              <div className="mt-2.5 flex items-center justify-center gap-1.5">
                <span className="text-[9px] font-bold tracking-wider uppercase text-neutral-400">
                  PASS ID
                </span>
                <span className="text-xs font-mono font-bold tracking-wider">
                  #{shortCode.toUpperCase()}
                </span>
              </div>
            )}

            {/* Custom Message */}
            {design.customMessage && (
              <div className="mt-2.5 pt-2 border-t border-dashed border-neutral-200/80 dark:border-neutral-800 w-full">
                <p className="text-xs italic opacity-85 max-w-xs mx-auto">
                  &ldquo;{design.customMessage}&rdquo;
                </p>
              </div>
            )}

            {/* Ticket Rules */}
            {(design.showSingleEntryRule || design.showGateNotice || design.customInstruction || design.showTermsLink || design.showOrganizerContact) && (
              <div
                className={`mt-2.5 pt-2 border-t w-full text-[10px] leading-relaxed ${
                  isDark ? "border-neutral-800 text-neutral-400" : "border-neutral-100 text-neutral-500"
                }`}
              >
                {[
                  design.showSingleEntryRule ? "Valid for single entry" : null,
                  design.showGateNotice ? "Keep QR visible at entrance" : null,
                  design.customInstruction || null,
                ]
                  .filter(Boolean)
                  .join(" • ")}
                {design.showTermsLink && (
                  <p className="mt-0.5 underline opacity-70">
                    Event Terms &amp; Conditions apply
                  </p>
                )}
                {design.showOrganizerContact && (
                  <p className="mt-0.5 opacity-70">
                    Need help? Contact event organizer
                  </p>
                )}
              </div>
            )}

            {/* Real-time Status Strip */}
            <div className="w-full mt-4">
              {isCheckedIn ? (
                <div className="w-full flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl px-3 py-2.5 justify-center shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    VERIFIED ENTRY · CHECKED IN
                  </span>
                </div>
              ) : (
                <div
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 justify-center text-xs font-bold shadow-2xs"
                  style={{
                    backgroundColor: `${brandColor}12`,
                    color: brandColor,
                    border: `1px solid ${brandColor}25`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse shrink-0"
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
        <div className="mt-8 flex flex-col items-center gap-2 pass-in-2 w-full max-w-sm">
          <a
            href="https://urpass.space/signup?ref=ticket-pass"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/50 shadow-xs hover:shadow-md transition-all text-left"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-neutral-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Hosting an event, fest, or meetup?
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Create digital QR passes & door scan free · ₹0 forever
              </span>
            </div>
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
              Start →
            </span>
          </a>
          <p className="text-[11px] text-neutral-400">
            Ticketing infrastructure by{" "}
            <a
              href="https://urpass.space?ref=pass-footer"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white underline underline-offset-2"
            >
              URPASS
            </a>
          </p>
        </div>
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
        <AddToCalendarButton
          eventName={event.name}
          description={event.description}
          venue={event.venue ?? "Online"}
          eventDate={event.event_date}
          startTime={event.start_time}
          endTime={event.end_time}
          passToken={pass.pass_token}
          meetingUrl={event.meeting_url}
          isOnline={event.event_type === "online" || event.event_type === "hybrid"}
        />
        <WhatsAppShareButton
          eventName={event.name}
          eventDate={formattedDate}
          venue={event.venue ?? "Online"}
          passToken={pass.pass_token}
          attendeeName={attendee.name}
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
