"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Send,
  Radio,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
  Bell,
  Sparkles,
  Phone,
  Loader2,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import {
  broadcastEventReminders,
  broadcastPostEventThankYou,
  type CommunicationLog,
} from "@/app/actions/event-engagement";
import {
  updateEventCommunicationSettings,
} from "@/app/actions/communications";
import type { EventCommunicationSettings } from "@/lib/communications";

interface Props {
  eventId: string;
  eventName: string;
  approvedCount: number;
  initialLogs: CommunicationLog[];
  settings: EventCommunicationSettings;
}

export default function CommunicationsClient({
  eventId,
  eventName,
  approvedCount,
  initialLogs,
  settings: initialSettings,
}: Props) {
  const [logs, setLogs] = useState<CommunicationLog[]>(initialLogs);
  const [settings, setSettings] = useState<EventCommunicationSettings>(initialSettings);
  const [loadingReminder, setLoadingReminder] = useState(false);
  const [loadingThankYou, setLoadingThankYou] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSendReminders() {
    if (approvedCount === 0) {
      setFeedbackMessage({
        type: "error",
        text: "No approved attendees found to send reminders to.",
      });
      return;
    }

    if (!confirm(`Broadcast 24-hour reminder email to all ${approvedCount} approved attendees?`)) {
      return;
    }

    setLoadingReminder(true);
    setFeedbackMessage(null);

    try {
      const res = await broadcastEventReminders(eventId);
      if (res.error) {
        setFeedbackMessage({ type: "error", text: res.error });
      } else {
        setFeedbackMessage({
          type: "success",
          text: `Successfully dispatched event reminders to ${res.count || approvedCount} attendees!`,
        });
        setLogs((prev) => [
          {
            id: `comm-${Date.now()}`,
            event_id: eventId,
            type: "reminder_24h",
            subject: `Reminder: ${eventName} is coming up soon!`,
            recipient_count: res.count || approvedCount,
            sent_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Failed to dispatch reminders. Please try again.",
      });
    } finally {
      setLoadingReminder(false);
    }
  }

  async function handleSendThankYou() {
    if (approvedCount === 0) {
      setFeedbackMessage({
        type: "error",
        text: "No attendees found to send thank-you emails to.",
      });
      return;
    }

    if (!confirm(`Send post-event thank you & feedback request to attendees?`)) {
      return;
    }

    setLoadingThankYou(true);
    setFeedbackMessage(null);

    try {
      const res = await broadcastPostEventThankYou(eventId);
      if (res.error) {
        setFeedbackMessage({ type: "error", text: res.error });
      } else {
        setFeedbackMessage({
          type: "success",
          text: `Successfully sent post-event thank you emails to ${res.count || approvedCount} attendees!`,
        });
        setLogs((prev) => [
          {
            id: `comm-${Date.now()}`,
            event_id: eventId,
            type: "thank_you_post_event",
            subject: `Thank you for attending ${eventName}!`,
            recipient_count: res.count || approvedCount,
            sent_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Failed to dispatch thank you emails. Please try again.",
      });
    } finally {
      setLoadingThankYou(false);
    }
  }

  async function handleToggleSetting(key: "email_enabled" | "whatsapp_enabled" | "sms_enabled") {
    const updatedValue = !settings[key];
    const newSettings = { ...settings, [key]: updatedValue };
    setSettings(newSettings);

    await updateEventCommunicationSettings(eventId, {
      [key]: updatedValue,
    });
  }

  return (
    <div className="space-y-8">
      {/* Alert Notification Toast */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in duration-200 ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid: 1. Actionable Broadcast Triggers & 2. Delivery Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Broadcast Action Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                1-Click Audience Broadcasts
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Target approved attendees with high-deliverability transactional reminders and follow-ups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Broadcast 1: 24h Reminder */}
              <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-all">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Pre-Event 24-Hour Reminder
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Sends event start time, venue/meeting link, and attached QR pass token directly to attendee inbox.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSendReminders}
                  disabled={loadingReminder || approvedCount === 0}
                  className="w-full h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {loadingReminder ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Broadcast Reminders ({approvedCount})</span>
                </button>
              </div>

              {/* Broadcast 2: Thank You & Feedback */}
              <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-all">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Post-Event Thank You & Review
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Thank attendees for attending and prompt them to submit 5-star ratings and attendee feedback.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSendThankYou}
                  disabled={loadingThankYou || approvedCount === 0}
                  className="w-full h-9 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 text-neutral-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {loadingThankYou ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-neutral-600" />
                  )}
                  <span>Send Thank-You Survey</span>
                </button>
              </div>
            </div>
          </div>

          {/* Communication Logs Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Broadcast Delivery Logs
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Historical record of all communications dispatched for this event.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                {logs.length} Sent
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
                <Mail className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-neutral-700">No broadcasts sent yet</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Use the 1-click broadcast buttons above to send pre-event reminders or thank you notes.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Subject / Type</th>
                      <th className="py-2.5 px-3">Audience</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-neutral-900">{log.subject}</p>
                          <span className="text-[10px] text-neutral-400 font-mono capitalize">
                            {log.type.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-neutral-600 font-medium">
                          {log.recipient_count} recipients
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Dispatched
                          </span>
                        </td>
                        <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                          {new Date(log.sent_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Delivery Channels Setup */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Delivery Channels
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage automated delivery channels for registration passes and notifications.
              </p>
            </div>

            <div className="space-y-3">
              {/* Channel 1: Email */}
              <div className="p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Email (Resend)</p>
                    <p className="text-[10px] text-neutral-500">QR pass token, approvals & invoice</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email_enabled !== false}
                    onChange={() => handleToggleSetting("email_enabled")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900" />
                </label>
              </div>

              {/* Channel 2: WhatsApp */}
              <div className="p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">WhatsApp (AiSensy)</p>
                    <p className="text-[10px] text-neutral-500">Direct mobile QR ticket delivery via AiSensy campaign</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.whatsapp_enabled !== false}
                    onChange={() => handleToggleSetting("whatsapp_enabled")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900" />
                </label>
              </div>

              {/* Channel 3: SMS / DLT */}
              <div className="p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">SMS (DLT Compliant)</p>
                    <p className="text-[10px] text-neutral-500">Fast fallback pass link SMS</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.sms_enabled)}
                    onChange={() => handleToggleSetting("sms_enabled")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900" />
                </label>
              </div>
            </div>

            {/* Compliance Note */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-500 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Anti-Spam & Delivery Safeguards</span>
              </div>
              <p>
                Transactional emails & WhatsApp messages include unsubscribe headers and rate-limits to protect organizer domain reputation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
