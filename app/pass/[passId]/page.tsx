import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Wifi,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";
import PassQR from "@/components/pass/PassQR";
import DownloadPassButton from "@/components/pass/DownloadPassButton";
import AutoDownload from "@/components/pass/AutoDownload";
import WhatsAppLogo from "@/components/icons/WhatsAppLogo";
import WhatsAppShareButton from "@/components/pass/WhatsAppShareButton";
import AddToCalendarButton from "@/components/pass/AddToCalendarButton";
import PersonalizePassModal from "@/components/pass/PersonalizePassModal";
import { Suspense } from "react";
import { formatTimeWithAmPm } from "@/lib/utils";
import { resolveTicketDesign } from "@/lib/pass-design";
import StudioPassRenderer from "@/components/studio/StudioPassRenderer";
import TicketCutDivider from "@/components/pass/TicketCutDivider";
import { isStudioDesign } from "@/lib/studio/resolver";
import { getHardenedPublicPass, cleanPassToken } from "@/lib/passes/public-pass";
import { resolveEventOgImage } from "@/lib/seo/og-images";
import ThermalTicketPrinter from "@/components/pass/ThermalTicketPrinter";
import CancelTicketAction from "@/components/pass/CancelTicketAction";
import { checkTicketCancellationEligibility } from "@/lib/cancellation/service";
import TicketBarcode from "@/components/pass/TicketBarcode";
import TicketSecurityPattern from "@/components/pass/TicketSecurityPattern";
import TicketAdmissionMatrix from "@/components/pass/TicketAdmissionMatrix";
import TicketStamp from "@/components/pass/TicketStamp";
import type { TicketRealStyle } from "@/lib/pass-design";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ passId: string }>;
}): Promise<Metadata> {
  const { passId: rawPassToken } = await params;
  const passToken = cleanPassToken(rawPassToken);
  const supabase = await createClient();
  const { data: pass } = await supabase
    .from("passes")
    .select("event_id")
    .or(`pass_token.eq.${passToken},pass_token.eq.${rawPassToken}`)
    .maybeSingle();
  if (!pass) return { title: "Event Pass" };
  const { data: event } = await supabase
    .from("events")
    .select("name, banner_url, logo_url, custom_pass_design")
    .eq("id", pass.event_id)
    .single();

  const title = event ? `${event.name} — Your Pass` : "Event Pass";
  const description = event
    ? `Your digital entry pass for ${event.name}. Show this QR code at the entrance.`
    : "Your digital event pass.";
  const ogImage = resolveEventOgImage(event);

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "URPASS",
      images: [
        {
          url: ogImage.url,
          secureUrl: ogImage.secureUrl,
          alt: ogImage.alt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
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
  const { passId: rawPassToken } = await params;
  const passToken = cleanPassToken(rawPassToken);

  // If the incoming URL contained literal or encoded template placeholders (%7B%7B1%7D%7D or {{1}}),
  // redirect to the clean pass URL so the browser location has no encoded placeholders.
  if (rawPassToken && rawPassToken !== passToken) {
    redirect(`/pass/${passToken}`);
  }

  const publicPass = await getHardenedPublicPass(passToken);

  if (!publicPass) notFound();

  const { pass, attendee, event, branding, groupInfo } = publicPass;

  const showBranding = branding.showBranding;
  const rawCustomDesign = event.custom_pass_design || branding.customDesign;
  const isStudio = isStudioDesign(rawCustomDesign) && rawCustomDesign.isPublished !== false;

  const design = resolveTicketDesign(event.custom_pass_design, branding.customDesign, null);

  const effectiveTicketStyle: TicketRealStyle =
    design.ticketStyle ||
    (design.template === "dark"
      ? "vip_gold"
      : design.template === "minimal"
      ? "executive"
      : "concert");

  const isDark =
    design.template === "dark" ||
    effectiveTicketStyle === "vip_gold" ||
    effectiveTicketStyle === "cyber" ||
    (effectiveTicketStyle === "concert" && design.template !== "minimal");

  const isMinimal = design.template === "minimal" || effectiveTicketStyle === "executive";
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
  const isCancelled = attendee.application_status === "cancelled" || pass.status === "cancelled";
  const isPendingApproval = attendee.application_status === "cancellation_requested";
  const isOnline = event.event_type === "online";
  const isHybrid = event.event_type === "hybrid";
  const hasJoinLink = (isOnline || isHybrid) && !!event.meeting_url && attendee.application_status === "approved" && !isCancelled;

  // Resolve attendee ticket cancellation eligibility
  const supabase = await createClient();
  const attendeeId = attendee.id || pass.attendee_id || "";
  const [{ data: paidOrder }, { data: featureSetting }] = await Promise.all([
    attendeeId
      ? supabase
          .from("ticket_orders")
          .select("id, status, amount, currency")
          .eq("event_id", event.id)
          .eq("attendee_id", attendeeId)
          .eq("status", "paid")
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("event_feature_settings")
      .select("enabled, config")
      .eq("event_id", event.id)
      .eq("feature_key", "ticket_cancellation")
      .maybeSingle(),
  ]);

  const effectiveEvent = {
    ...event,
    custom_pass_design: {
      ...(event.custom_pass_design && typeof event.custom_pass_design === "object" ? event.custom_pass_design : {}),
      ...(featureSetting?.enabled
        ? {
            _cancellationConfig: {
              enabled: true,
              self_service_enabled: true,
              ...(featureSetting.config && typeof featureSetting.config === "object" ? featureSetting.config : {}),
            },
          }
        : {}),
    },
  };

  const cancellationEligibility = checkTicketCancellationEligibility({
    event: effectiveEvent,
    attendee: {
      id: attendeeId,
      application_status: attendee.application_status,
      pass_status: pass.status,
    },
    pass,
    paidOrder,
  });

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

  const isMultiScan = Boolean(
    design.allow_multiple_scans ||
    design.multi_scan_enabled ||
    (event.custom_pass_design as Record<string, unknown> | null)?.allow_multiple_scans ||
    (event.custom_pass_design as Record<string, unknown> | null)?.multi_scan_enabled
  );

  const entryRuleText = isMultiScan
    ? "Allows multiple entry"
    : design.showSingleEntryRule !== false
    ? "Valid for single entry"
    : null;

  const rulesList = [
    entryRuleText,
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
    if (isCheckedIn && !isMultiScan) return null;
    if (isOnline) return "Approved · Use Join button below";
    if (isHybrid) return "Valid · QR for entry or join online";
    if (isMultiScan) return isCheckedIn ? "Verified · Multi-scan active" : "Valid · Allows multiple entry";
    return "Valid · Show at entrance";
  }

  const statusText = getStatusText();

  function getPassThemeConfig() {
    switch (effectiveTicketStyle) {
      case "cinema":
        return {
          banner: (
            <div className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white px-4 py-2 flex items-center justify-between shadow-xs">
              <span className="text-[8px] font-mono font-bold tracking-widest uppercase">
                🎬 CINEMA PREMIERE PASS · SCREEN 03
              </span>
              <span className="text-[7.5px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                DOLBY ATMOS
              </span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="BOX OFFICE"
              subtext="PREMIERE ADMISSION"
              variant="red"
              angle={-8}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "cinema" as const,
          cardBg: "bg-white dark:bg-[#121218] text-neutral-900 dark:text-neutral-50",
          cardBorder: "border-rose-200 dark:border-rose-950",
          cutoutColor: isDark ? "#0a0a0d" : "#f8fafc",
        };
      case "boarding":
        return {
          banner: (
            <div className="w-full bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 text-white px-4 py-2 flex items-center justify-between shadow-xs">
              <span className="text-[8px] font-mono font-bold tracking-widest uppercase">
                ✈️ BOARDING PASS · SUMMIT EXPRESS
              </span>
              <span className="text-[7.5px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                PRIORITY
              </span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="BOARDING APPROVED"
              subtext="GATE CLEARANCE"
              variant="blue"
              angle={-6}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "boarding" as const,
          cardBg: "bg-white dark:bg-[#0c121e] text-neutral-900 dark:text-neutral-50",
          cardBorder: "border-sky-200 dark:border-sky-950",
          cutoutColor: isDark ? "#0a0a0d" : "#f8fafc",
        };
      case "vip_gold":
        return {
          banner: (
            <div className="w-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 text-neutral-950 px-4 py-1.5 flex items-center justify-between font-bold text-[8px] font-mono tracking-widest uppercase shadow-xs">
              <span>💎 ★ VIP ALL-ACCESS GALA PASS ★</span>
              <span className="text-[7px] font-black bg-black/15 px-1.5 py-0.5 rounded">
                LIMITED EDITION
              </span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="VIP ADMISSION"
              subtext="GOLDEN ALL-ACCESS"
              variant="gold"
              angle={-6}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "vip_gold" as const,
          cardBg: "bg-[#0c0d12] text-amber-100",
          cardBorder: "border-amber-500/40",
          cutoutColor: "#0a0a0d",
        };
      case "stadium":
        return {
          banner: (
            <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-2 flex items-center justify-between shadow-xs">
              <span className="text-[8px] font-mono font-bold tracking-widest uppercase">
                ⚽ MATCHDAY ARENA TICKET · TURNSTILE ENTRY
              </span>
              <span className="text-[7.5px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                STAND EAST
              </span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="MATCHDAY ENTRY"
              subtext="EAST TURNSTILE"
              variant="emerald"
              angle={-7}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "stadium" as const,
          cardBg: "bg-white dark:bg-[#0c1613] text-neutral-900 dark:text-neutral-50",
          cardBorder: "border-emerald-200 dark:border-emerald-950",
          cutoutColor: isDark ? "#0a0a0d" : "#f8fafc",
        };
      case "vintage":
        return {
          banner: (
            <div className="w-full bg-amber-200/90 text-amber-900 border-b border-amber-300 px-4 py-1.5 flex items-center justify-between font-mono font-bold text-[8px] tracking-widest uppercase shadow-2xs">
              <span>🎟️ ★ ADMIT ONE ★ VINTAGE PASS</span>
              <span className="font-extrabold text-red-700">№ 049281</span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="ADMIT ONE"
              subtext="SERIES 2026-A"
              variant="red"
              angle={-9}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "vintage" as const,
          cardBg: "bg-[#FFFDF6] text-amber-950",
          cardBorder: "border-amber-300",
          cutoutColor: isDark ? "#0a0a0d" : "#f8fafc",
        };
      case "cyber":
        return {
          banner: (
            <div className="w-full bg-gradient-to-r from-cyan-950 via-purple-950 to-neutral-950 text-cyan-300 border-b border-cyan-800/60 px-4 py-1.5 flex items-center justify-between font-mono font-bold text-[8px] tracking-widest uppercase shadow-xs">
              <span className="text-cyan-400">⚡ // CRYPTO_PASS_V2</span>
              <span className="text-emerald-400">STATUS: VERIFIED</span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="ROOT ACCESS"
              subtext="0x8F42_VERIFIED"
              variant="emerald"
              angle={-5}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "cyber" as const,
          cardBg: "bg-[#09090e] text-cyan-50",
          cardBorder: "border-cyan-800/70",
          cutoutColor: "#0a0a0d",
        };
      case "executive":
        return {
          banner: (
            <div className="w-full bg-neutral-900 text-white dark:bg-neutral-800 px-4 py-1.5 flex items-center justify-between font-mono font-bold text-[8px] tracking-widest uppercase shadow-xs">
              <span>👔 ★ OFFICIAL EXECUTIVE PASS</span>
              <span className="text-neutral-400">#{shortCode.toUpperCase()}</span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="EXECUTIVE CLEARANCE"
              subtext="DELEGATE 2026"
              variant="blue"
              angle={-6}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "standard" as const,
          cardBg: isDark ? "bg-[#111317] text-white" : "bg-white text-neutral-900",
          cardBorder: isDark ? "border-neutral-800" : "border-neutral-200",
          cutoutColor: isDark ? "#0a0a0d" : "#f8fafc",
        };
      case "concert":
      default:
        return {
          banner: (
            <div
              className="w-full relative z-10 py-1.5 px-3.5 flex items-center justify-between text-[7.5px] font-mono font-bold tracking-widest uppercase overflow-hidden shadow-xs"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, #b45309 0%, #d4af37 30%, #fef08a 50%, #d4af37 70%, #b45309 100%)"
                  : `linear-gradient(90deg, ${activeColor} 0%, #a855f7 35%, ${activeColor} 70%, #ec4899 100%)`,
                color: isDark ? "#451a03" : "#ffffff",
              }}
            >
              <span className="truncate">🎸 ★ OFFICIAL LIVE ADMISSION PASS</span>
              <span className="font-extrabold tracking-[0.2em] shrink-0">SECURE QR • URPASS</span>
            </div>
          ),
          stamp: (
            <TicketStamp
              text="LIVE CONCERT"
              subtext="ADMIT ONE · VALIDATED"
              variant="red"
              angle={-6}
              className="absolute top-12 right-3 z-20"
            />
          ),
          matrixVariant: "standard" as const,
          cardBg: isDark ? "bg-[#111317] text-white" : "bg-white text-neutral-900",
          cardBorder: isDark ? "border-neutral-800" : "border-neutral-200",
          cutoutColor: isDark ? "#0a0a0d" : "#f8fafc",
        };
    }
  }

  const passTheme = getPassThemeConfig();
  const effectiveCardBg = passTheme.cardBg;
  const effectiveCardBorder = passTheme.cardBorder;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-3 py-5 sm:p-5 pb-16 relative overflow-hidden"
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
      <ThermalTicketPrinter
        passToken={pass.pass_token}
        isDark={isDark}
        accentColor={activeColor}
      >
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
        ) : design.format === "badge" ? (
          <div
            id="printable-ticket-card"
            className="w-full max-w-[340px] printable-pass-container bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col transition-all duration-150 z-10 select-none mb-6"
          >
            {/* Lanyard punch-hole simulation */}
            <div className="w-full pt-4 pb-2 flex flex-col items-center">
              <div className="w-12 h-2.5 rounded-full bg-neutral-200 border border-neutral-300 shadow-inner" />
            </div>

            {/* Top Branding */}
            <div className="px-6 py-3 flex flex-col items-center text-center">
              {logoToDisplay ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoToDisplay}
                  alt="Logo"
                  className="h-7 max-w-[120px] object-contain mb-1"
                />
              ) : (
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
                  {orgName || "URPASS EVENT PASS"}
                </span>
              )}
              <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-tight line-clamp-1">
                {event.name}
              </h3>
            </div>

            {/* Large Attendee Name Centerpiece */}
            <div className="py-6 px-6 text-center border-t border-b border-neutral-100 bg-neutral-50/50">
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                {attendee.name.toUpperCase()}
              </h1>
              {design.showOrganization && ((attendee as any).company || (attendee as any).organization) && (
                <p className="text-sm font-medium text-neutral-600 mt-1">
                  {(attendee as any).company || (attendee as any).organization}
                </p>
              )}
              {design.showPhone && attendee.phone && (
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
                  {attendee.phone}
                </p>
              )}
            </div>

            {/* Ticket Category Full-Width Block */}
            <div
              className="py-2.5 px-4 text-center"
              style={{ backgroundColor: activeColor }}
            >
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                {PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type}
              </span>
            </div>

            {/* Bottom Gate QR Section */}
            <div className="p-5 flex flex-col items-center text-center space-y-2 bg-white">
              {!isOnline && !isCancelled && (
                <div className="p-2.5 bg-white border border-neutral-200 rounded-xl shadow-2xs">
                  <PassQR value={pass.pass_token} size={110} />
                </div>
              )}
              <p className="text-[10px] font-mono text-neutral-400">
                {pass.custom_ticket_id || `#${shortCode.toUpperCase()}`}
              </p>
              <p className="text-[10px] text-neutral-500">
                {event.venue || "Venue"} • {formattedDate}
              </p>
            </div>
          </div>
        ) : design.format === "print" ? (
          <div
            id="printable-ticket-card"
            className={`w-full max-w-[520px] min-h-[250px] printable-pass-container ${cardBg} ${shapeRadius} border ${cardBorder} shadow-[0_16px_40px_-6px_rgba(0,0,0,0.12)] flex overflow-hidden transition-all duration-150 relative select-none z-10 mb-6`}
          >
            {/* Banknote Guilloche Security Pattern */}
            <TicketSecurityPattern isDark={isDark} opacity={0.05} />
            <div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: activeColor }} aria-hidden="true" />

            {/* Main Ticket Body (68%) */}
            <div className="w-[68%] min-w-0 pl-7 pr-5 py-4 flex flex-col justify-between gap-2 relative z-10">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  {logoToDisplay ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoToDisplay} alt="Event logo" className="h-6 max-w-[110px] object-contain" />
                  ) : (
                    <span className={`text-[8px] font-mono font-bold tracking-[0.2em] uppercase ${subtextCls}`}>★ OFFICIAL ADMISSION PASS</span>
                  )}
                  {design.showTicketType && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider truncate" style={{ backgroundColor: `${activeColor}20`, color: activeColor }}>
                      {PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-black uppercase tracking-tight leading-tight line-clamp-1">{event.name}</h2>
                {design.showAttendeeName && <p className="text-xs font-bold truncate mt-0.5">{attendee.name}</p>}
                {design.showOrganization && ((attendee as any).company || (attendee as any).organization) && (
                  <p className={`text-[10px] truncate ${subtextCls}`}>{(attendee as any).company || (attendee as any).organization}</p>
                )}
                {design.customMessage && <p className={`text-[9px] italic line-clamp-1 opacity-80 ${subtextCls}`}>&ldquo;{design.customMessage}&rdquo;</p>}
              </div>

              {/* 4-Compartment Authentic Seating & Admission Matrix */}
              <TicketAdmissionMatrix
                gate="01"
                section={pass.pass_type ? (PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type).replace(/pass|ticket/gi, "").trim() || "VIP" : "VIP"}
                row="A"
                seat="14"
                isDark={isDark}
              />

              {/* Footer Info & Linear Barcode */}
              <div className="space-y-1 border-t border-dotted border-neutral-300 dark:border-neutral-700/80 pt-1.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className={`font-semibold ${subtextCls} truncate max-w-[180px]`}>{event.venue || "Main Hall"}</span>
                  <span className={`font-mono ${subtextCls}`}>{formattedDate}</span>
                </div>
                <TicketBarcode code={pass.custom_ticket_id || shortCode.toUpperCase()} isDark={isDark} height={22} showText={true} />
              </div>
            </div>

            {/* Perforated Divider with Semicircular Punch Cutouts */}
            <div className="absolute top-0 bottom-0 left-[68%] border-l-2 border-dashed border-neutral-400/80 dark:border-neutral-600 z-20" aria-label="Tear along dotted line" />
            <div className={`absolute -top-3.5 left-[68%] -translate-x-1/2 w-7 h-7 rounded-full ${isDark ? "bg-[#0a0a0d] border-neutral-800" : "bg-[#f8fafc] border-neutral-300"} border shadow-inner z-30`} aria-hidden="true" />
            <div className={`absolute -bottom-3.5 left-[68%] -translate-x-1/2 w-7 h-7 rounded-full ${isDark ? "bg-[#0a0a0d] border-neutral-800" : "bg-[#f8fafc] border-neutral-300"} border shadow-inner z-30`} aria-hidden="true" />

            {/* Detachable Gate Stub (32%) */}
            <div className={`w-[32%] min-w-0 p-4 flex flex-col items-center justify-between gap-1.5 text-center relative z-10 ${isDark ? "bg-white/5" : "bg-neutral-50"}`}>
              <div className="w-full text-center">
                <span className={`text-[8px] font-mono font-bold tracking-widest uppercase block ${subtextCls}`}>GATE STUB</span>
                <span className="text-[7px] font-mono text-rose-600 dark:text-rose-400 uppercase font-bold tracking-wider">AUDIT COUPON</span>
              </div>

              {!isOnline && !isCancelled && (
                <div className="p-1.5 bg-white border border-neutral-200 rounded-xl shadow-2xs">
                  <PassQR value={pass.pass_token} size={84} />
                </div>
              )}

              <div className="space-y-0.5">
                <p className="text-[8px] font-mono font-bold text-neutral-900 dark:text-neutral-100 uppercase">
                  SEC {pass.pass_type ? (PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type).replace(/pass|ticket/gi, "").trim() || "VIP" : "VIP"} · SEAT 14
                </p>
                <p className={`text-[8px] font-mono ${subtextCls}`}>
                  {pass.custom_ticket_id || `#${shortCode.toUpperCase()}`}
                </p>
                <span className="text-[7px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 block">
                  ● VERIFIED ENTRY
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="printable-ticket-card"
            className={`w-full max-w-[360px] printable-pass-container ${shapeRadius} border ${effectiveCardBorder} ${effectiveCardBg} overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_4px_16px_-2px_rgba(0,0,0,0.06)] relative select-none transition-all duration-150 z-10`}
          >
          {/* Banknote Guilloche Security Pattern */}
          <TicketSecurityPattern isDark={isDark} opacity={0.045} />

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

          {/* Authentic Archetype Header Banner */}
          {passTheme.banner}

          {/* Box Office Rubber Stamp Watermark */}
          {passTheme.stamp}

          {/* Main Ticket Pass Body */}
          <div className="relative z-10 p-4 sm:p-5 flex flex-col items-center text-center">
            {/* Header: Organization & Official Badge */}
            <div className="w-full flex items-center justify-between gap-2 mb-3 pb-2 border-b border-dashed border-neutral-200/80 dark:border-neutral-800">
              <div className="flex items-center gap-2 min-w-0">
                {logoToDisplay ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoToDisplay}
                    alt="Logo"
                    className="h-6 max-w-[110px] object-contain"
                  />
                ) : (
                  <span
                    className="text-[10px] font-black tracking-widest uppercase truncate"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    {orgName || "URPASS EVENT PASS"}
                  </span>
                )}

                {design.sponsorLogoUrl && (
                  <>
                    <span className="text-neutral-300 text-xs">×</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={design.sponsorLogoUrl}
                      alt="Sponsor Logo"
                      className="h-5 max-w-[80px] object-contain opacity-80"
                    />
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700">
                  #{shortCode.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Event Name */}
            <h1 className="text-lg font-black tracking-tight mb-2 uppercase leading-snug max-w-full break-words">
              {event.name}
            </h1>

            {/* Ticket Category Pill */}
            {design.showTicketType && (
              <div className="mb-2">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full border shadow-2xs"
                  style={{
                    borderColor: `${activeColor}40`,
                    color: activeColor,
                    backgroundColor: `${activeColor}15`,
                  }}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  {PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type}
                </span>
              </div>
            )}

            {/* 4-Compartment Authentic Seating & Admission Matrix */}
            <TicketAdmissionMatrix
              gate="01"
              section={pass.pass_type ? (PASS_TYPE_LABEL[pass.pass_type] ?? pass.pass_type).replace(/pass|ticket/gi, "").trim() || "VIP" : "VIP"}
              row="A"
              seat="14"
              isDark={isDark}
              variant={passTheme.matrixVariant}
            />

            {/* Center Scannable QR Code (when qrPosition is not bottom) */}
            {design.qrPosition !== "bottom" && !isOnline && !isCancelled && (
              <div
                className={`my-2 p-3.5 bg-white rounded-2xl flex flex-col items-center justify-center relative shadow-xs ${
                  design.showQrBorder !== false ? "border border-neutral-200/90" : ""
                }`}
                style={{ width: qrSizePx + 56, maxWidth: "100%" }}
              >
                {/* Scanner alignment crosshair brackets */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-brand/70 rounded-tl-xs pointer-events-none" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-brand/70 rounded-tr-xs pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-brand/70 rounded-bl-xs pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-brand/70 rounded-br-xs pointer-events-none" />

                <PassQR value={pass.pass_token} size={qrSizePx} />
                <span className="text-[8px] font-black tracking-widest text-neutral-400 uppercase mt-2">
                  SCAN FOR ADMISSION
                </span>
              </div>
            )}

            {/* Structured Real Ticket Metadata Grid */}
            <div className="w-full grid grid-cols-2 gap-2 text-left my-1 p-3 rounded-2xl bg-neutral-50/90 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs">
              {/* Date & Time */}
              {design.showEventDate !== false && event.event_date && (
                <div className="min-w-0">
                  <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                    <CalendarDays className="w-2.5 h-2.5" />
                    <span>DATE &amp; TIME</span>
                  </p>
                  <p className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                    {formattedDate}
                  </p>
                  {event.start_time && (
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                      {formatTimeWithAmPm(event.start_time)}
                    </p>
                  )}
                </div>
              )}

              {/* Venue */}
              {design.showVenue && event.venue && (
                <div className="min-w-0">
                  <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>VENUE / HALL</span>
                  </p>
                  <p className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5" title={event.venue}>
                    {event.venue}
                  </p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                    Main Gate
                  </p>
                </div>
              )}

              {/* Pass Holder */}
              {design.showAttendeeName && (
                <div className="min-w-0">
                  <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    PASS HOLDER
                  </p>
                  <p className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                    {attendee.name}
                  </p>
                  {(design.showOrganization && ((attendee as any).company || (attendee as any).organization)) && (
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                      {(attendee as any).company || (attendee as any).organization}
                    </p>
                  )}
                  {design.showPhone && attendee.phone && (
                    <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {attendee.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Serial / Ticket ID */}
              <div className="min-w-0">
                <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  TICKET ID
                </p>
                <p className="text-[11px] font-mono font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                  {pass.custom_ticket_id || `#${shortCode.toUpperCase()}`}
                </p>
                {design.showRegistrationNumber && (
                  <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                    REG-{shortCode.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

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

            {/* Custom Message */}
            {design.customMessage && (
              <div className={`mt-2 pt-1.5 border-t border-dashed ${isDark ? "border-neutral-800" : "border-neutral-200"} w-full`}>
                <p className="text-xs italic opacity-85 max-w-xs mx-auto">
                  &ldquo;{design.customMessage}&rdquo;
                </p>
              </div>
            )}

            {/* Admission Rules */}
            {rulesList.length > 0 && (
              <div
                className={`mt-2 pt-2 border-t ${dividerCls} w-full text-[10px] ${subtextCls} leading-relaxed`}
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

            {/* ✂ REAL TICKET CUT: Semicircular Punch Notches + Perforated Rip Line */}
            <TicketCutDivider
              isDark={isDark}
              label="✂ FOLD & TEAR ALONG PERFORATION · VOID IF DETACHED"
              cutoutColor={passTheme.cutoutColor}
              negativeMarginCls="-mx-4 sm:-mx-5"
            />

            {/* ══════════════════════════════════════════════════════════ */}
            {/* SCANNABLE ADMISSION STUB (TEAR-OFF SECTION) */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="w-full flex flex-col items-center pt-0.5">
              <div className="w-full flex items-center justify-between mb-1.5 px-0.5 text-[7.5px] font-mono">
                <span className="font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                  ADMISSION COUNTERFOIL
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase">
                  KEEP THIS COUPON
                </span>
              </div>

              {/* QR Code Container or Linear Barcode depending on qrPosition */}
              {!isOnline && !isCancelled && (
                design.qrPosition === "bottom" ? (
                  <>
                    <div
                      className={`my-1 p-3.5 bg-white rounded-2xl flex flex-col items-center justify-center relative shadow-xs ${
                        design.showQrBorder !== false ? "border border-neutral-200/90" : ""
                      }`}
                      style={{ width: qrSizePx + 56, maxWidth: "100%" }}
                    >
                      {/* Scanner alignment crosshair brackets */}
                      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-brand/70 rounded-tl-xs pointer-events-none" />
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-brand/70 rounded-tr-xs pointer-events-none" />
                      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-brand/70 rounded-bl-xs pointer-events-none" />
                      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-brand/70 rounded-br-xs pointer-events-none" />

                      <PassQR value={pass.pass_token} size={qrSizePx} />
                      <span className="text-[8px] font-black tracking-widest text-neutral-400 uppercase mt-2">
                        SCAN FOR ADMISSION
                      </span>
                    </div>

                    <div className="w-full py-1">
                      <TicketBarcode code={pass.custom_ticket_id || shortCode.toUpperCase()} isDark={isDark} height={24} showText={true} />
                    </div>
                  </>
                ) : (
                  <div className="w-full flex flex-col items-center py-2">
                    <TicketBarcode code={pass.custom_ticket_id || shortCode.toUpperCase()} isDark={isDark} showText={true} />
                  </div>
                )
              )}

              {!isOnline && isCancelled && (
                <div
                  className="my-2 p-5 bg-rose-50/80 dark:bg-rose-950/30 rounded-2xl flex flex-col items-center justify-center border border-rose-200 dark:border-rose-900/60 text-center"
                  style={{ width: qrSizePx + 56, maxWidth: "100%" }}
                >
                  <ShieldCheck className="w-8 h-8 text-rose-500 mb-2 rotate-180" />
                  <span className="text-[10px] font-black tracking-widest text-rose-700 dark:text-rose-300 uppercase">
                    QR ACCESS DEACTIVATED
                  </span>
                  <p className="text-[9px] text-rose-600 dark:text-rose-400 mt-1 leading-snug">
                    Ticket cancelled. Invalid for gate entry.
                  </p>
                </div>
              )}

              {/* Executive Cryptographic Verification Tag */}
              <div className="w-full my-2.5 px-3.5 py-2 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-white/10 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                    PASS CREDENTIAL
                  </span>
                </div>
                <span className="text-[10px] font-mono font-extrabold tracking-wider text-neutral-900 dark:text-neutral-100">
                  {pass.custom_ticket_id || `#${shortCode.toUpperCase()}`}
                </span>
              </div>

              {/* Real-time Status Strip */}
              <div className="w-full mt-1">
                {isCancelled ? (
                  <div className="w-full flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl px-3 py-2.5 justify-center shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                      TICKET CANCELLED · VOID FOR ADMISSION
                    </span>
                  </div>
                ) : isPendingApproval ? (
                  <div className="w-full flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl px-3 py-2.5 justify-center shadow-2xs">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      CANCELLATION REQUESTED · PENDING APPROVAL
                    </span>
                  </div>
                ) : pass.is_group_master ? (
                  <div className="w-full flex flex-col gap-1.5 p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-950 dark:text-indigo-200">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        Single Group QR Pass
                      </span>
                      <span className="text-[11px] font-mono">
                        {pass.checked_in_guests || 0} / {pass.total_guests || 1} Admitted
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-indigo-200/60 dark:bg-indigo-900/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round(((pass.checked_in_guests || 0) / (pass.total_guests || 1)) * 100))}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-indigo-700 dark:text-indigo-300 font-medium text-center">
                      {Math.max(0, (pass.total_guests || 1) - (pass.checked_in_guests || 0)) === 0
                        ? "All members checked in"
                        : `${Math.max(0, (pass.total_guests || 1) - (pass.checked_in_guests || 0))} entries remaining for partial check-in at the gate`}
                    </p>
                  </div>
                ) : isCheckedIn ? (
                  <div className="w-full flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl px-3 py-2.5 justify-center shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      {isMultiScan ? "VERIFIED ENTRY · MULTI-SCAN ACTIVE" : "VERIFIED ENTRY · CHECKED IN"}
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
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{statusText || "AUTHENTICATED PASS · READY FOR SCAN"}</span>
                  </div>
                )}
              </div>

              {/* Security Microprint Disclaimer */}
              <p className="text-[8px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500 text-center mt-2">
                OFFICIAL ADMISSION PASS · NON-TRANSFERABLE · PRESENT AT GATE
              </p>
            </div>
          </div>
        </div>
      )}
      </ThermalTicketPrinter>

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
                  className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border transition-all ${
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
                          className="min-w-11 min-h-11 shrink-0 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 transition-colors flex items-center justify-center"
                          title={`Send pass to ${member.name} via WhatsApp`}
                          aria-label={`Send pass to ${member.name} via WhatsApp`}
                        >
                          <WhatsAppLogo className="w-5 h-5" variant="brand" />
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
        <CancelTicketAction
          passToken={pass.pass_token}
          eventName={event.name}
          applicationStatus={attendee.application_status}
          passStatus={pass.status}
          eligibility={cancellationEligibility}
          cancellationToken={attendee.cancellation_token || undefined}
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
