"use client";

import { useState } from "react";
import {
  Mail,
  Smartphone,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { resendTicketChannel } from "@/app/actions/communications";

interface Props {
  eventId: string;
  passToken: string;
  email: string;
  phone?: string | null;
}

export default function AttendeeDeliveryActions({
  eventId,
  passToken,
  email,
  phone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [resendingChannel, setResendingChannel] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleResend = async (channel: "EMAIL" | "WHATSAPP" | "SMS") => {
    setResendingChannel(channel);
    setStatusMsg(null);

    const res = await resendTicketChannel(eventId, passToken, channel);
    if (res.error) {
      setStatusMsg({ text: res.error, isError: true });
    } else {
      setStatusMsg({ text: `${channel} sent!` });
      setTimeout(() => {
        setStatusMsg(null);
        setOpen(false);
      }, 3000);
    }
    setResendingChannel(null);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors shadow-2xs"
        title="Delivery Status & Resend"
      >
        <Send className="w-3 h-3 text-neutral-400" />
        <span>Delivery</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-56 rounded-xl bg-white border border-neutral-100 shadow-xl z-50 p-2 text-xs">
            <div className="px-2 py-1.5 border-b border-neutral-100 mb-1">
              <p className="font-semibold text-neutral-900 text-[11px] uppercase tracking-wider">
                Pass Delivery Channels
              </p>
              <p className="text-[10px] text-neutral-400 truncate">
                {email}
              </p>
            </div>

            {statusMsg && (
              <div
                className={`p-2 rounded-lg text-[11px] mb-2 font-medium flex items-center gap-1.5 ${
                  statusMsg.isError
                    ? "bg-rose-50 text-rose-600 border border-rose-100"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}
              >
                {statusMsg.isError ? (
                  <AlertCircle className="w-3 h-3 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {/* Resend Email */}
              <button
                type="button"
                disabled={!!resendingChannel}
                onClick={() => handleResend("EMAIL")}
                className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-violet-600" />
                  <span className="font-medium text-neutral-700">Resend Email</span>
                </div>
                {resendingChannel === "EMAIL" && (
                  <Loader2 className="w-3 h-3 animate-spin text-brand" />
                )}
              </button>

              {/* Resend WhatsApp */}
              <button
                type="button"
                disabled={!!resendingChannel || !phone}
                onClick={() => handleResend("WHATSAPP")}
                className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors text-left disabled:opacity-40"
                title={!phone ? "No phone number recorded" : undefined}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <span className="font-medium text-neutral-700 block">Resend WhatsApp</span>
                    {!phone && (
                      <span className="text-[9px] text-neutral-400 block">No phone number</span>
                    )}
                  </div>
                </div>
                {resendingChannel === "WHATSAPP" && (
                  <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                )}
              </button>

              {/* Resend SMS */}
              <button
                type="button"
                disabled={!!resendingChannel || !phone}
                onClick={() => handleResend("SMS")}
                className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors text-left disabled:opacity-40"
                title={!phone ? "No phone number recorded" : undefined}
              >
                <div className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <div>
                    <span className="font-medium text-neutral-700 block">Resend SMS (DLT)</span>
                    {!phone && (
                      <span className="text-[9px] text-neutral-400 block">No phone number</span>
                    )}
                  </div>
                </div>
                {resendingChannel === "SMS" && (
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
