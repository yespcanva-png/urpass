"use client";

import WhatsAppLogo from "@/components/icons/WhatsAppLogo";

import { cleanPassToken } from "@/lib/passes/public-pass";

interface Props {
  eventName: string;
  eventDate: string;
  venue: string;
  passToken: string;
  attendeeName?: string;
  phone?: string | null;
  buttonText?: string;
  variant?: "full" | "icon";
  shareUrl?: string;
}

export function buildWhatsAppPassUrl({
  eventName,
  eventDate,
  venue,
  passToken,
  attendeeName,
  phone,
  shareUrl,
}: {
  eventName: string;
  eventDate: string;
  venue: string;
  passToken: string;
  attendeeName?: string;
  phone?: string | null;
  shareUrl?: string;
}) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space").replace(/\/+$/, "");
  const cleanToken = cleanPassToken(passToken) || passToken;
  const passUrl = `${appUrl}/pass/${cleanToken}`;
  const effectiveShareUrl = shareUrl || `${appUrl}/share/${cleanToken}`;

  const greeting = attendeeName ? `Hi ${attendeeName}! ` : "Hey! ";
  const text = `${greeting}Here is your digital entry pass for *${eventName}*.\n\n📅 Date: ${eventDate}\n📍 Venue: ${venue}\n\n🎟️ View & present your QR pass here:\n${passUrl}\n\n📲 Share this invitation:\n${effectiveShareUrl}\n\nShow this pass at the entrance for instant check-in!`;

  let cleanPhone = "";
  if (phone) {
    cleanPhone = phone.replace(/[^0-9]/g, "");
    // If Indian 10-digit number without country code, prepend 91
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
  }

  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppShareButton({
  eventName,
  eventDate,
  venue,
  passToken,
  attendeeName,
  phone,
  buttonText = "Share Pass via WhatsApp",
  variant = "full",
  shareUrl,
}: Props) {
  const href = buildWhatsAppPassUrl({
    eventName,
    eventDate,
    venue,
    passToken,
    attendeeName,
    phone,
    shareUrl,
  });

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="Send Pass via WhatsApp"
        aria-label="Send Pass via WhatsApp"
        className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
      >
        <WhatsAppLogo className="w-5 h-5 shrink-0" variant="brand" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full min-w-0 min-h-12 max-w-sm py-3 px-4 sm:px-5 rounded-2xl text-sm font-bold text-white shadow-sm transition-all duration-150 hover:opacity-95 active:scale-[0.99]"
      style={{ background: "#25D366" }}
    >
      <WhatsAppLogo className="w-5 h-5 shrink-0" variant="white" />
      <span className="min-w-0 break-words text-center">{buttonText}</span>
    </a>
  );
}
