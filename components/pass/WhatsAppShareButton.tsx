"use client";

import { MessageCircle } from "lucide-react";

interface Props {
  eventName: string;
  eventDate: string;
  venue: string;
  passToken: string;
  attendeeName?: string;
  phone?: string | null;
  buttonText?: string;
  variant?: "full" | "icon";
}

export function buildWhatsAppPassUrl({
  eventName,
  eventDate,
  venue,
  passToken,
  attendeeName,
  phone,
}: {
  eventName: string;
  eventDate: string;
  venue: string;
  passToken: string;
  attendeeName?: string;
  phone?: string | null;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";
  const passUrl = `${appUrl}/pass/${passToken}`;

  const greeting = attendeeName ? `Hi ${attendeeName}! ` : "Hey! ";
  const text = `${greeting}Here is your digital entry pass for *${eventName}*.\n\n📅 Date: ${eventDate}\n📍 Venue: ${venue}\n\n🎟️ View & present your QR pass here:\n${passUrl}\n\nShow this pass at the entrance for instant check-in!`;

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
}: Props) {
  const href = buildWhatsAppPassUrl({
    eventName,
    eventDate,
    venue,
    passToken,
    attendeeName,
    phone,
  });

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="Send Pass via WhatsApp"
        className="inline-flex items-center justify-center w-7 h-7 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full max-w-sm py-3 px-5 rounded-2xl text-sm font-bold text-white shadow-sm transition-all duration-150 hover:opacity-95 active:scale-[0.99]"
      style={{ background: "#25D366" }}
    >
      <MessageCircle className="w-4 h-4" />
      {buttonText}
    </a>
  );
}
