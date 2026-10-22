"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ExternalLink, ArrowLeft, AlertCircle } from "lucide-react";
import type { ShareInvitationData } from "@/lib/communications/invitation-share";

interface ShareClientProps {
  data: ShareInvitationData;
}

export default function ShareClient({ data }: ShareClientProps) {
  useEffect(() => {
    if (data.status === "active" && data.whatsappUrl) {
      // Instantly open WhatsApp sharing flow with zero delay
      try {
        window.location.replace(data.whatsappUrl);
      } catch {
        window.location.href = data.whatsappUrl;
      }
    }
  }, [data.status, data.whatsappUrl]);

  // Dedicated UI state for inactive, revoked, cancelled, or expired invitations
  if (data.status !== "active") {
    const errorConfigs: Record<
      string,
      { title: string; desc: string; badge: string; color: string }
    > = {
      revoked: {
        title: "Invitation Pass Revoked",
        desc: "This entry pass has been revoked by the event organizer.",
        badge: "Pass Revoked",
        color: "text-red-500 bg-red-50 border-red-200",
      },
      cancelled: {
        title: "Event Cancelled",
        desc: "This event or pass has been cancelled by the host.",
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
        desc: "We couldn't locate an active entry pass with this token.",
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

  // Active state: Direct WhatsApp opening with inline immediate execution
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center p-4">
      {/* Inline script to trigger instant redirection before paint */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(data.whatsappUrl)});`,
        }}
      />

      <div className="w-full max-w-sm text-center space-y-6">
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30"
            style={{ background: "#25D366" }}
          >
            <MessageCircle className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-zinc-900">Opening WhatsApp...</h1>
          <p className="text-xs text-zinc-500">
            Redirecting directly to share the invitation for{" "}
            <span className="font-semibold text-zinc-700">{data.eventName}</span>.
          </p>
        </div>

        <div>
          <a
            href={data.whatsappUrl}
            id="open-whatsapp-button"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:opacity-95 active:scale-[0.99]"
            style={{ background: "#25D366" }}
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open WhatsApp Now</span>
          </a>
        </div>

        <div className="pt-2">
          <Link
            href={`/pass/${data.sanitizedToken}`}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors inline-flex items-center gap-1"
          >
            <span>Or view your digital pass</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </main>
  );
}
