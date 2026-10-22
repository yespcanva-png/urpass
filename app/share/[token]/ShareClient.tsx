"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Laptop,
} from "lucide-react";
import type { ShareInvitationData } from "@/lib/communications/invitation-share";
import { formatTimeWithAmPm } from "@/lib/utils";

interface ShareClientProps {
  data: ShareInvitationData;
}

export default function ShareClient({ data }: ShareClientProps) {
  const [copied, setCopied] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    if (data.status === "active" && data.whatsappUrl && !redirectAttempted) {
      setRedirectAttempted(true);
      // Attempt seamless automatic redirection to WhatsApp sharing flow
      const timer = setTimeout(() => {
        try {
          window.location.href = data.whatsappUrl;
        } catch {
          // Automatic navigation suppressed by client environment
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [data.status, data.whatsappUrl, redirectAttempted]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(data.invitationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is not permitted
      const textarea = document.createElement("textarea");
      textarea.value = data.invitationText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Dedicated UI states for inactive, expired, revoked, cancelled, or disabled invitations
  if (data.status !== "active") {
    const errorConfigs: Record<
      string,
      { title: string; desc: string; badge: string; color: string }
    > = {
      revoked: {
        title: "Invitation Pass Revoked",
        desc: "This entry pass has been revoked by the event organizer. Please reach out to the host for assistance.",
        badge: "Pass Revoked",
        color: "text-red-500 bg-red-50 border-red-200",
      },
      cancelled: {
        title: "Event Cancelled",
        desc: "This event or pass has been cancelled by the host. Invitation sharing is no longer active.",
        badge: "Cancelled",
        color: "text-amber-600 bg-amber-50 border-amber-200",
      },
      expired: {
        title: "Invitation Expired",
        desc: "This invitation link has expired as the event has already concluded.",
        badge: "Expired",
        color: "text-zinc-600 bg-zinc-100 border-zinc-200",
      },
      sharing_disabled: {
        title: "Sharing Disabled by Organizer",
        desc: "The event host has restricted WhatsApp invitation sharing for this pass.",
        badge: "Sharing Disabled",
        color: "text-sky-600 bg-sky-50 border-sky-200",
      },
      not_found: {
        title: "Invitation Pass Not Found",
        desc: "We couldn't locate an active entry pass with this token. Please check the URL or contact the organizer.",
        badge: "Not Found",
        color: "text-zinc-600 bg-zinc-100 border-zinc-200",
      },
    };

    const currentError = errorConfigs[data.status] || errorConfigs.not_found;

    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-3xl shadow-xl p-6 sm:p-8 text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${currentError.color}`}
            >
              {currentError.badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {currentError.title}
            </h1>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {data.reason || currentError.desc}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {data.sanitizedToken && data.status !== "revoked" && (
              <Link
                href={`/pass/${data.sanitizedToken}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 transition-colors shadow-sm"
              >
                <span>Check Pass Status</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-700 font-medium text-sm hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to UrPass</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const dateFormatted = data.eventDate
    ? new Date(data.eventDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const timeFormatted = formatTimeWithAmPm(data.eventTime);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100/60 to-zinc-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white border border-zinc-200/90 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-600">
                Invitation Sharing
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                {data.organizerName || "UrPass Events"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Pass</span>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-gradient-to-br from-emerald-500/[0.04] to-zinc-50 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 space-y-3">
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 leading-snug">
            {data.eventName}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600 pt-1">
            {dateFormatted && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{dateFormatted}</span>
              </div>
            )}
            {timeFormatted && (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{timeFormatted}</span>
              </div>
            )}
            {data.venue && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{data.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Redirecting or Fallback Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            WhatsApp sharing initiated
          </div>
          <p className="text-xs text-zinc-500">
            If WhatsApp did not open automatically, tap the button below.
          </p>
        </div>

        {/* Actions: Primary & Secondary */}
        <div className="space-y-3">
          {/* Main Primary Share on WhatsApp Button */}
          <a
            href={data.whatsappUrl}
            id="share-whatsapp-button"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-150 hover:opacity-95 hover:shadow-xl active:scale-[0.99]"
            style={{ background: "#25D366" }}
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Share on WhatsApp</span>
          </a>

          {/* Desktop WhatsApp Web Alternative */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={data.whatsappWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="share-whatsapp-web-button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-sm"
            >
              <Laptop className="w-4 h-4 text-zinc-500" />
              <span>Open in WhatsApp Web</span>
            </a>

            <button
              onClick={handleCopyText}
              type="button"
              id="copy-invitation-button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-500" />
                  <span>Copy Invitation Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reconstructed Invitation Message Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>PREVIEW OF INVITATION MESSAGE</span>
            <span className="text-[11px] font-normal text-zinc-400">Exact WhatsApp format</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-200 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed border border-zinc-800 shadow-inner max-h-56 overflow-y-auto">
            {data.invitationText}
          </div>
        </div>

        {/* Security & Token Guarantee Notice */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-500 leading-normal flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Admission Integrity:</strong> This invitation is tied to original pass token{" "}
            <code className="text-zinc-700 font-mono font-medium">{data.sanitizedToken.slice(0, 8)}...</code>.
            Sharing does not duplicate check-in allowances or reissue tickets.
          </span>
        </div>

        {/* Footer Navigation */}
        <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100">
          <Link
            href={`/pass/${data.sanitizedToken}`}
            className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-950 font-medium transition-colors"
          >
            <span>View Digital Pass</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link href="/" className="hover:text-zinc-800 transition-colors">
            Powered by UrPass
          </Link>
        </div>
      </div>
    </main>
  );
}
