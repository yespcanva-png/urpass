"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Loader2,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Layers,
  Sliders,
  CheckCheck,
  Search,
  RefreshCw,
  Bell,
  Check,
  X,
} from "lucide-react";
import {
  broadcastEventReminders,
  broadcastPostEventThankYou,
  type CommunicationLog,
} from "@/app/actions/event-engagement";
import {
  updateEventCommunicationSettings,
} from "@/app/actions/communications";
import type { EventCommunicationSettings, WhatsAppNotificationToggles } from "@/lib/communications";
import WhatsAppBulkInviteCard from "@/components/communications/WhatsAppBulkInviteCard";
import WhatsAppLogo from "@/components/icons/WhatsAppLogo";

interface Props {
  eventId: string;
  eventName: string;
  eventDate?: string | null;
  venue?: string | null;
  approvedCount: number;
  initialLogs: CommunicationLog[];
  settings: EventCommunicationSettings;
}

export default function CommunicationsClient({
  eventId,
  eventName,
  eventDate,
  venue,
  approvedCount,
  initialLogs,
  settings: initialSettings,
}: Props) {
  const [logs, setLogs] = useState<CommunicationLog[]>(initialLogs);
  const [settings, setSettings] = useState<EventCommunicationSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<"whatsapp" | "broadcasts" | "channels" | "logs">("whatsapp");

  // Broadcast loading states
  const [loadingReminder, setLoadingReminder] = useState(false);
  const [loadingThankYou, setLoadingThankYou] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Test WhatsApp Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testPhone, setTestPhone] = useState("+91");
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Search filter for audit logs
  const [logSearch, setLogSearch] = useState("");

  async function handleSendReminders() {
    if (approvedCount === 0) {
      setFeedbackMessage({
        type: "error",
        text: "No approved attendees found to send reminders to.",
      });
      return;
    }

    if (!confirm(`Broadcast 24-hour reminder to all ${approvedCount} approved attendees?`)) {
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

    if (!confirm(`Send post-event thank you & feedback survey to attendees?`)) {
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

  async function handleToggleWhatsAppSubSetting(subKey: keyof WhatsAppNotificationToggles) {
    const currentSub = settings.whatsapp_settings || {
      registration_received: true,
      ticket_delivery: true,
      payment_confirmation: true,
      event_reminders: true,
      event_cancellation: true,
    };
    const updatedSub = {
      ...currentSub,
      [subKey]: !currentSub[subKey],
    };
    const newSettings = {
      ...settings,
      whatsapp_settings: updatedSub,
    };
    setSettings(newSettings);

    await updateEventCommunicationSettings(eventId, {
      whatsapp_settings: updatedSub,
    });
  }

  async function handleSendTestWhatsApp() {
    if (!testPhone || testPhone.length < 10) {
      setTestResult({ success: false, message: "Please enter a valid phone number with country code (e.g. +919876543210)" });
      return;
    }

    setTestSending(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/communications/test-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: testPhone,
          templateName: "urpass_ticket",
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setTestResult({
          success: true,
          message: `Live test message delivered via Meta WhatsApp Cloud API! Receipt WAMID: ${data.messageId}`,
        });
      } else {
        setTestResult({
          success: false,
          message: data?.error || `Meta API rejected delivery (HTTP ${res.status})`,
        });
      }
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Failed to contact diagnostic endpoint",
      });
    } finally {
      setTestSending(false);
    }
  }

  // Filtered logs
  const filteredLogs = logs.filter((l) => {
    if (!logSearch) return true;
    const q = logSearch.toLowerCase();
    return (
      (l.subject || "").toLowerCase().includes(q) ||
      (l.type || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Status Bar / Live Gateway Indicator ── */}
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Meta WhatsApp Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 font-medium">
            <WhatsAppLogo size={16} variant="brand" />
            <span className="font-semibold text-neutral-900">Meta Cloud API</span>
            <span className="text-emerald-700">·</span>
            <span className="text-emerald-800 font-mono text-[11px]">+91 88383 93729</span>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-700 bg-white/80 px-1.5 py-0.2 rounded-md shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified
            </span>
          </div>

          {/* Template Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-100/80 text-neutral-600 font-mono text-[11px]">
            <span className="text-neutral-400 font-sans">Template:</span>
            <strong className="text-neutral-900 font-semibold">urpass_ticket</strong>
            <span className="text-neutral-400 font-sans">(en_US)</span>
          </div>

          {/* Resend Email Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-100/80 text-neutral-600 text-[11px]">
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            <span>Email Gateway: <strong className="text-neutral-900">Resend Active</strong></span>
          </div>
        </div>

        {/* Quick Test Button */}
        <button
          type="button"
          onClick={() => {
            setTestResult(null);
            setTestModalOpen(true);
          }}
          className="h-8.5 px-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs self-stretch sm:self-auto justify-center"
        >
          <WhatsAppLogo size={14} variant="brand" />
          <span>Send Live WhatsApp Test</span>
        </button>
      </div>

      {/* ── Notification Feedback Toast ── */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in duration-200 ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
              : "bg-red-50/90 border-red-200 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-semibold">{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="w-6 h-6 rounded-lg hover:bg-black/5 flex items-center justify-center text-xs opacity-60 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Corporate Segmented Tab Navigation ── */}
      <div className="flex items-center gap-1 border-b border-neutral-200/90 pb-px overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === "whatsapp"
              ? "border-[#25D366] text-neutral-950 bg-white font-bold shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50/60"
          }`}
        >
          <WhatsAppLogo size={16} variant="brand" />
          <span>WhatsApp Campaigns</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            Live
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("broadcasts")}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === "broadcasts"
              ? "border-neutral-900 text-neutral-950 bg-white font-bold shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50/60"
          }`}
        >
          <Send className="w-3.5 h-3.5 text-neutral-700" />
          <span>Lifecycle Broadcasts</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-100 text-neutral-600 font-mono">
            2 Triggers
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("channels")}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === "channels"
              ? "border-neutral-900 text-neutral-950 bg-white font-bold shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50/60"
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-neutral-700" />
          <span>Channels & Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === "logs"
              ? "border-neutral-900 text-neutral-950 bg-white font-bold shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50/60"
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-neutral-700" />
          <span>Delivery Activity Logs</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-100 text-neutral-600 font-mono">
            {logs.length}
          </span>
        </button>
      </div>

      {/* ── TAB 1: WhatsApp Pass Campaigns (Primary) ── */}
      {activeTab === "whatsapp" && (
        <div className="space-y-6">
          <WhatsAppBulkInviteCard
            eventId={eventId}
            eventName={eventName}
            eventDate={eventDate}
            venue={venue}
          />
        </div>
      )}

      {/* ── TAB 2: Lifecycle Broadcasts & Engagement ── */}
      {activeTab === "broadcasts" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Automated Audience Broadcasts
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Dispatch transactional pre-event notifications and post-event engagement to verified attendees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Broadcast Card 1: 24h Reminder */}
              <div className="p-5 rounded-2xl border border-neutral-200/90 bg-neutral-50/40 flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-all">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shadow-2xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Pre-Event 24-Hour Reminder
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Automatically sends event schedule, venue directions, and an interactive QR ticket token directly to attendee inboxes.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-neutral-200/80 text-[11px] text-neutral-600 space-y-1">
                    <p>• <strong>Target Audience:</strong> {approvedCount} approved attendees</p>
                    <p>• <strong>Channels:</strong> Email + WhatsApp (if enabled)</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendReminders}
                  disabled={loadingReminder || approvedCount === 0}
                  className="w-full h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {loadingReminder ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Broadcast 24-Hour Reminders ({approvedCount})</span>
                </button>
              </div>

              {/* Broadcast Card 2: Post-Event Thank You & Feedback */}
              <div className="p-5 rounded-2xl border border-neutral-200/90 bg-neutral-50/40 flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-all">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Post-Event Thank You & Review Survey
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Express appreciation to attendees who checked in and invite them to leave a verified attendee review and feedback rating.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-neutral-200/80 text-[11px] text-neutral-600 space-y-1">
                    <p>• <strong>Target Audience:</strong> Checked-in & confirmed attendees</p>
                    <p>• <strong>Feedback Link:</strong> Automatically generated dynamic URL</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendThankYou}
                  disabled={loadingThankYou || approvedCount === 0}
                  className="w-full h-10 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  {loadingThankYou ? (
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                  ) : (
                    <Mail className="w-4 h-4 text-neutral-600" />
                  )}
                  <span>Dispatch Thank-You Survey</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Channels & Automation Rules ── */}
      {activeTab === "channels" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Meta WhatsApp Cloud API */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <WhatsAppLogo size={22} variant="brand" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Meta WhatsApp Cloud API
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Official business messaging gateway
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.whatsapp_enabled !== false}
                  onChange={() => handleToggleSetting("whatsapp_enabled")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]" />
              </label>
            </div>

            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Automated Event Notification Triggers
              </p>

              <div className="space-y-2">
                {[
                  {
                    key: "registration_received",
                    label: "Registration Received",
                    desc: "Acknowledge application submission to guests",
                  },
                  {
                    key: "ticket_delivery",
                    label: "Digital Pass Delivery",
                    desc: "Send personalized QR token pass upon approval/payment",
                  },
                  {
                    key: "payment_confirmation",
                    label: "Payment Confirmation",
                    desc: "Instant receipt with amount and transaction reference",
                  },
                  {
                    key: "event_reminders",
                    label: "24-Hour Event Reminder",
                    desc: "Venue address, directions, and gate pass token",
                  },
                  {
                    key: "event_cancellation",
                    label: "Cancellation & Advisory",
                    desc: "Broadcast updates with refund guidance",
                  },
                ].map((item) => {
                  const isChecked =
                    settings.whatsapp_settings?.[item.key as keyof WhatsAppNotificationToggles] !== false;
                  return (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-neutral-800 text-xs">{item.label}</p>
                        <p className="text-[10px] text-neutral-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleToggleWhatsAppSubSetting(item.key as keyof WhatsAppNotificationToggles)
                        }
                        className="w-4 h-4 rounded border-neutral-300 text-[#25D366] focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Email & Fallback Rules */}
          <div className="space-y-6">
            {/* Email Channel */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Transactional Email (Resend)
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      DKIM-signed transactional ticket delivery
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email_enabled !== false}
                    onChange={() => handleToggleSetting("email_enabled")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900" />
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs space-y-1.5 text-neutral-600">
                <p>• Automatically dispatches HTML passes with embedded Apple Wallet / QR codes.</p>
                <p>• High-reputation enterprise delivery with 99.8% inbox placement.</p>
              </div>
            </div>

            {/* Compliance & WhatsApp Business Window Policy */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Meta WhatsApp Policy Compliance</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Outbound business-initiated notifications outside the 24-hour customer window strictly require approved Meta utility templates (<code className="text-emerald-700 font-mono font-semibold">urpass_ticket</code>). Free-form messages are suppressed to protect phone number quality.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: Delivery Activity Logs ── */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Historical Delivery Logs
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Audit trail of broadcasts, transactional passes, and automated reminders.
              </p>
            </div>

            {/* Log Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search logs by subject..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full h-8.5 pl-8 pr-3 text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/40">
              <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-neutral-700">No communication logs recorded yet</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Dispatches from WhatsApp campaigns and lifecycle broadcasts will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto divide-y divide-neutral-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] uppercase font-bold tracking-wider bg-neutral-50/50">
                    <th className="py-3 px-3.5">Subject & Broadcast Type</th>
                    <th className="py-3 px-3.5">Audience Reach</th>
                    <th className="py-3 px-3.5">Delivery Status</th>
                    <th className="py-3 px-3.5 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-3.5">
                        <p className="font-semibold text-neutral-900">{log.subject}</p>
                        <span className="text-[10px] text-neutral-400 font-mono capitalize">
                          {log.type.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-neutral-700 font-medium">
                        {log.recipient_count} recipient{log.recipient_count === 1 ? "" : "s"}
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCheck className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Dispatched</span>
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-neutral-500 font-mono text-[11px] text-right">
                        {new Date(log.sent_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
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
      )}

      {/* ── Test WhatsApp Dispatch Modal ── */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <WhatsAppLogo size={22} variant="brand" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Live Meta WhatsApp Test
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Send a test pass using approved template <code className="text-emerald-700 font-mono">urpass_ticket</code>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Recipient WhatsApp Number (E.164 Format)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="+919876543210"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Enter your mobile number with country code (e.g. +91 for India).
                </p>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs ${
                    testResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  <p className="font-semibold flex items-center gap-1.5">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{testResult.success ? "Message Dispatched!" : "Delivery Failed"}</span>
                  </p>
                  <p className="text-[11px] mt-1 break-all font-mono opacity-90">{testResult.message}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="h-9 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendTestWhatsApp}
                disabled={testSending || !testPhone}
                className="h-9 px-4.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-500/25"
              >
                {testSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Sending to Meta...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
