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
  Users,
  Share2,
} from "lucide-react";
import PassQR from "@/components/pass/PassQR";
import DownloadPassButton from "@/components/pass/DownloadPassButton";
import AutoDownload from "@/components/pass/AutoDownload";
import WhatsAppShareButton from "@/components/pass/WhatsAppShareButton";
import AddToCalendarButton from "@/components/pass/AddToCalendarButton";
import PersonalizePassModal from "@/components/pass/PersonalizePassModal";
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

  const { pass, attendee, event, branding, groupInfo } = publicPass;

  const showBranding = branding.showBranding;
  const rawCustomDesign = event.custom_pass_design || branding.customDesign;
  const isStudio = isStudioDesign(rawCustomDesign) && rawCustomDesign.isPublished !== false;

  const design = resolveTicketDesign(event.custom_pass_design, branding.customDesign, null);

  const isDark = design.template === "dark";
  const isMinimal = design.template === "minimal";
  const isModern = design.template === "modern";

  const categoryColor = pass.pass_type
    ? design.categoryColors?.[pass.pass_type] ||
      design.categoryColors?.[pass.pass_type.toLowerCase()] ||
      design.categoryColors?.[pass.pass_type.toUpperCase()]
    : null;
  const activeColor = categoryColor || design.primaryColor || "#635BFF";

  const shapeRadius =
    design.shape === "rounded"
      ? "rounded-[28px]"
      : design.shape === "compact"
      ? "rounded-xl"
      : "rounded-2xl";

  const cardBg = isDark
    ? "bg-[#111317] text-white"
    : isMinimal
    ? "bg-white text-neutral-900"
    : isModern
    ? "bg-gradient-to-b from-white to-neutral-50 text-neutral-900"
    : "bg-white text-neutral-900";

  const cardBorder = isDark ? "border-neutral-800" : "border-neutral-200";
  const dividerCls = isDark ? "border-neutral-800" : "border-neutral-100";
  const subtextCls = isDark ? "text-neutral-400" : "text-neutral-500";

  const orgName = branding.orgName;
  const orgLogoUrl = branding.orgLogoUrl;
  const logoToDisplay = design.logoUrl || orgLogoUrl;

  const qrSizePx = design.qrSize === "sm" ? 140 : design.qrSize === "lg" ? 200 : 165;

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

  const rulesList = [
    design.showSingleEntryRule !== false ? "Valid for single entry" : null,
    design.showGateNotice !== false ? "Keep QR ready at gate" : null,
    design.customInstruction || null,
  ].filter(Boolean);

  const orderedFields = Array.isArray(design.fieldOrder) && design.fieldOrder.length > 0
    ? design.fieldOrder
    : [
        "showAttendeeName",
        "showOrganization",
        "showPhone",
        "showRegistrationNumber",
        "showTicketId",
      ];

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

      {/* If this ticket was shared from bulk booking and is still a placeholder, ask for details */}
      {attendee.isPlaceholder && (
        <PersonalizePassModal
          passToken={pass.pass_token}
          eventName={event.name}
        />
      )}

      {/* Visual Ticket Pass Card: Studio Design or Standard Template */}
      {isStudio ? (
        <div className="w-full max-w-sm flex justify-center mb-6 relative z-10 printable-pass-container">
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
          id="printable-ticket-card"
          className={`w-full max-w-[360px] printable-pass-container ${shapeRadius} border ${cardBorder} ${cardBg} overflow-hidden shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] relative select-none transition-all duration-150 z-10`}
        >
          {/* Optional background image with contrast-preserving overlay */}
          {design.backgroundImageUrl && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.backgroundImageUrl}
                alt="Background"
                className="w-full h-full object-cover opacity-15"
              />
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? "bg-gradient-to-b from-[#111317]/90 via-[#111317]/85 to-[#111317]/95"
                    : "bg-gradient-to-b from-white/90 via-white/85 to-white/95"
                }`}
              />
            </div>
          )}

          {/* Top Accent Strip for Event & Modern */}
          {(design.template === "event" || isModern) && (
            <div
              className="h-2 w-full relative z-10"
              style={{ backgroundColor: activeColor }}
            />
          )}

          {/* Card Interior */}
          <div className="relative z-10 p-6 flex flex-col items-center text-center">
            {/* Event Logo & Sponsor */}
            <div className="mb-3 flex items-center justify-center gap-3">
              {logoToDisplay ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoToDisplay}
                  alt="Logo"
                  className="h-8 max-w-[130px] object-contain"
                />
              ) : (
                <span
                  className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
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
                    className="h-6 max-w-[100px] object-contain opacity-80"
                  />
                </>
              )}
            </div>

            {/* Event Name */}
            <h1 className="text-lg font-bold tracking-tight mb-2 uppercase leading-snug max-w-xs">
              {event.name}
            </h1>

            {/* Ticket Type Pill */}
            {design.showTicketType && (
              <div className="mb-2.5">
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-3 py-0.5 rounded-full border"
                  style={{
                    borderColor: `${activeColor}35`,
                    color: activeColor,
                    backgroundColor: `${activeColor}12`,
                  }}
                >
                  <Ticket className="w-3 h-3" />
                  {PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type}
                </span>
              </div>
            )}

            {/* QR Code Matrix (Positioned center if not bottom) */}
            {design.qrPosition !== "bottom" && !isOnline && (
              <div
                className={`my-2 p-3.5 bg-white rounded-xl flex flex-col items-center justify-center ${
                  design.showQrBorder !== false ? "border border-neutral-200/90 shadow-2xs" : ""
                }`}
                style={{ width: qrSizePx + 28, height: qrSizePx + 44 }}
              >
                <PassQR value={pass.pass_token} size={qrSizePx} />
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase mt-2">
                  SCAN FOR ENTRY
                </span>
              </div>
            )}

            {/* Online-only executive access module */}
            {isOnline && (
              <div className="w-full my-2 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs">
                <div
                  className="px-4 py-3 text-left"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, ${activeColor}24 0%, rgba(255,255,255,0.03) 100%)`
                      : `linear-gradient(135deg, ${activeColor}14 0%, #ffffff 70%)`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
                        style={{
                          backgroundColor: `${activeColor}12`,
                          borderColor: `${activeColor}30`,
                        }}
                      >
                        <Wifi className="w-5 h-5" style={{ color: activeColor }} />
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
                        color: activeColor,
                        borderColor: `${activeColor}35`,
                        backgroundColor: `${activeColor}12`,
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

            {/* Dynamic Ordered Fields */}
            <div className="w-full flex flex-col items-center text-center space-y-1 mt-1">
              {orderedFields.map((fieldId) => {
                if (fieldId === "showAttendeeName" && design.showAttendeeName) {
                  return (
                    <p key="showAttendeeName" className="text-base font-semibold tracking-tight text-inherit pt-1">
                      {attendee.name}
                    </p>
                  );
                }

                if (fieldId === "showOrganization" && design.showOrganization) {
                  const orgText = (attendee as any).company || (attendee as any).organization;
                  if (!orgText) return null;
                  return (
                    <p key="showOrganization" className={`text-xs font-normal ${subtextCls}`}>
                      {orgText}
                    </p>
                  );
                }

                if (fieldId === "showPhone" && design.showPhone && attendee.phone) {
                  return (
                    <p key="showPhone" className={`text-[11px] font-mono ${subtextCls}`}>
                      {attendee.phone}
                    </p>
                  );
                }

                if (fieldId === "showRegistrationNumber" && design.showRegistrationNumber) {
                  return (
                    <span key="showRegistrationNumber" className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      REG-{shortCode.toUpperCase()}
                    </span>
                  );
                }

                if (fieldId === "showTicketId" && design.showTicketId) {
                  const displayId = pass.custom_ticket_id || `#${shortCode.toUpperCase()}`;
                  return (
                    <div key="showTicketId" className="flex items-center justify-center gap-1.5 py-0.5">
                      <span className="text-[9px] font-semibold tracking-wider uppercase text-neutral-400">
                        TICKET ID:
                      </span>
                      <span className="text-xs font-mono font-bold tracking-wide">
                        {displayId}
                      </span>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Bottom QR Code (If QR position is set to 'bottom') */}
            {design.qrPosition === "bottom" && !isOnline && (
              <div
                className={`my-3 p-3.5 bg-white rounded-xl flex flex-col items-center justify-center ${
                  design.showQrBorder !== false ? "border border-neutral-200/90 shadow-2xs" : ""
                }`}
                style={{ width: qrSizePx + 28, height: qrSizePx + 44 }}
              >
                <PassQR value={pass.pass_token} size={qrSizePx} />
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase mt-2">
                  SCAN FOR ENTRY
                </span>
              </div>
            )}

            {/* Date & Venue Footer */}
            {(design.showEventDate !== false || (design.showVenue && event.venue)) && (
              <div
                className={`w-full border-t ${dividerCls} pt-2.5 mt-2.5 flex flex-col items-center gap-1`}
              >
                {design.showEventDate !== false && event.event_date && (
                  <p
                    className={`text-xs font-medium tracking-wide ${subtextCls} flex items-center gap-1.5`}
                  >
                    <CalendarDays className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span>{formattedDate}{event.start_time ? ` · ${event.start_time}` : ""}</span>
                  </p>
                )}
                {design.showVenue && event.venue && (
                  <p className={`text-xs ${subtextCls} flex items-center gap-1.5`}>
                    <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span className="truncate max-w-[240px]">{event.venue}</span>
                  </p>
                )}
              </div>
            )}

            {/* Custom Message */}
            {design.customMessage && (
              <div className={`mt-2.5 pt-2 border-t border-dashed ${isDark ? "border-neutral-800" : "border-neutral-200"} w-full`}>
                <p className="text-xs italic opacity-85 max-w-xs mx-auto">
                  &ldquo;{design.customMessage}&rdquo;
                </p>
              </div>
            )}

            {/* Admission Rules */}
            {rulesList.length > 0 && (
              <div
                className={`mt-3 pt-2.5 border-t ${dividerCls} w-full text-[10px] ${subtextCls} leading-relaxed`}
              >
                <p className="font-medium">{rulesList.join(" • ")}</p>
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
                    backgroundColor: `${activeColor}12`,
                    color: activeColor,
                    border: `1px solid ${activeColor}25`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse shrink-0"
                    style={{ backgroundColor: activeColor }}
                  />
                  <span>{statusText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Group & Bulk Passes Member Hub — Only accessible to Primary Purchaser */}
      {groupInfo && groupInfo.isPrimary && groupInfo.members.length > 1 && (
        <div className="mt-6 w-full max-w-sm rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-xs no-print pass-in-2">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Group &amp; Bulk Passes
                </h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  {groupInfo.members.length} passes in this booking
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300">
              {groupInfo.members.length} Passes
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {groupInfo.members.map((member, idx) => {
              const isCurrent = member.passToken === pass.pass_token;
              const memberUrl = member.passToken ? `https://urpass.space/pass/${member.passToken}` : null;
              const shareText = encodeURIComponent(
                `Hey ${member.name}! Here is your entry pass for ${event.name} (${formattedDate}):\n${memberUrl}`
              );
              const waLink = `https://api.whatsapp.com/send?text=${shareText}`;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-violet-50/60 dark:bg-violet-950/25 border-violet-200 dark:border-violet-800/60"
                      : "bg-neutral-50/80 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {member.name}
                      </span>
                      {idx === 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase">
                          Primary
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                      {member.passToken ? `PASS #${member.passToken.slice(0, 8).toUpperCase()}` : "Pass Pending"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {member.passToken && (
                      <>
                        {!isCurrent && (
                          <a
                            href={`/pass/${member.passToken}`}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 shadow-2xs transition-colors flex items-center gap-1"
                          >
                            <Ticket className="w-3 h-3 text-violet-500" />
                            View
                          </a>
                        )}
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 transition-colors flex items-center justify-center"
                          title={`Send pass to ${member.name} via WhatsApp`}
                          aria-label={`Send pass to ${member.name} via WhatsApp`}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showBranding && (
        <div className="mt-8 flex flex-col items-center gap-2 pass-in-2 w-full max-w-sm no-print">
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
          className="flex items-center justify-center gap-2 w-full max-w-sm py-4 rounded-2xl text-base font-bold text-white hover:opacity-90 transition-opacity mt-6 no-print"
          style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4c1d95 100%)" }}
        >
          <ExternalLink className="w-5 h-5" />
          Join Event
        </a>
      )}

      <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-sm pass-in-3 no-print">
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
