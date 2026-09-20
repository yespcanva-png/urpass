"use client";

import { useState, useTransition } from "react";
import {
  Bell,
  Heart,
  Send,
  Loader2,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import {
  broadcastEventReminders,
  broadcastPostEventThankYou,
} from "@/app/actions/event-engagement";

interface Props {
  eventId: string;
  eventName: string;
  applySlug?: string | null;
  approvedCount: number;
}

export default function EventCommunicationsCard({
  eventId,
  eventName,
  applySlug,
  approvedCount,
}: Props) {
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);
  const [thankYouStatus, setThankYouStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [isReminderPending, startReminderTransition] = useTransition();
  const [isThankYouPending, startThankYouTransition] = useTransition();

  const handleSendReminder = () => {
    if (approvedCount === 0) {
      setErrorMessage("No approved attendees to send reminders to.");
      return;
    }
    setErrorMessage(null);
    setReminderStatus(null);
    startReminderTransition(async () => {
      const res = await broadcastEventReminders(eventId);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setReminderStatus(`Dispatched reminders to ${res.count ?? 0} attendees!`);
      }
    });
  };

  const handleSendThankYou = () => {
    if (approvedCount === 0) {
      setErrorMessage("No attendees to send thank you emails to.");
      return;
    }
    setErrorMessage(null);
    setThankYouStatus(null);
    startThankYouTransition(async () => {
      const res = await broadcastPostEventThankYou(eventId);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setThankYouStatus(`Sent thank-you & feedback emails to ${res.count ?? 0} attendees!`);
      }
    });
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://urpass.space";
  const registrationLink = applySlug ? `${appUrl}/apply/${applySlug}` : `${appUrl}/apply/${eventId}`;
  const whatsappBlastText = `🎟️ Registrations are open for *${eventName}*!\n\nGet your verified digital pass here:\n${registrationLink}`;

  const handleCopyWhatsAppBlast = async () => {
    try {
      await navigator.clipboard.writeText(whatsappBlastText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-5 border border-neutral-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Attendee Engagement &amp; Broadcasts</h3>
            <p className="text-xs text-neutral-500">Send reminders, post-event thank you emails, and share via WhatsApp</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5 mb-4">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Pre-Event Reminder */}
        <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-neutral-800">
              <Send className="w-3.5 h-3.5 text-violet-600" />
              <span>24h Event Reminder</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed mb-3">
              Sends an upcoming event reminder with pass QR and venue directions to all approved attendees.
            </p>
          </div>

          <div>
            {reminderStatus && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 mb-2">
                <CheckCircle2 className="w-3 h-3" />
                <span>{reminderStatus}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleSendReminder}
              disabled={isReminderPending}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#6D28D9" }}
            >
              {isReminderPending && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{isReminderPending ? "Sending..." : `Send to ${approvedCount} Attendees`}</span>
            </button>
          </div>
        </div>

        {/* Post-Event Thank You */}
        <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-neutral-800">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Post-Event Thank You</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed mb-3">
              Sends an appreciation note with a direct link to the event feedback survey after the event concludes.
            </p>
          </div>

          <div>
            {thankYouStatus && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 mb-2">
                <CheckCircle2 className="w-3 h-3" />
                <span>{thankYouStatus}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleSendThankYou}
              disabled={isThankYouPending}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 transition-colors disabled:opacity-50"
            >
              {isThankYouPending && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{isThankYouPending ? "Sending..." : "Send Thank-You Email"}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Group Blast */}
        <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-neutral-800">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Group Invite</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed mb-3">
              Copy a pre-formatted invitation message to broadcast into college WhatsApp groups, Discord, or Slack.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyWhatsAppBlast}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappBlastText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#25D366] hover:opacity-90 transition-opacity"
              title="Share directly to WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
