"use client";

import { useState } from "react";
import Link from "next/link";
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
  Lock,
  ArrowRight,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Settings2,
  Zap,
} from "lucide-react";
import {
  broadcastEventReminders,
  broadcastPostEventThankYou,
  type CommunicationLog,
} from "@/app/actions/event-engagement";
import {
  updateEventCommunicationSettings,
  toggleMasterCommunicationAction,
  toggleChannelAction,
  saveSelfServiceWhatsAppAction,
  requestManagedWhatsAppAction,
  updateAutomationRuleAction,
  sendTestEmailAction,
} from "@/app/actions/communications";
import type {
  EventCommunicationSettings,
  OrganizationCommunicationSettings,
  NotificationAutomationRules,
  WhatsAppSelfServiceConfig,
  WhatsAppManagedServiceRequest,
  WhatsAppTemplateRecord,
} from "@/lib/communications";
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
  controlPanelData: any;
}

export default function CommunicationsClient({
  eventId,
  eventName,
  eventDate,
  venue,
  approvedCount,
  initialLogs,
  settings: initialSettings,
  controlPanelData,
}: Props) {
  // Master & Channel States
  const orgSettings: OrganizationCommunicationSettings =
    controlPanelData?.orgSettings || {
      organization_id: "default",
      enable_communication: true,
      default_channel: "email",
      email_communication: true,
      whatsapp_communication: false,
      whatsapp_integration_model: "none",
      whatsapp_setup_status: "not_configured",
      automation_rules: {
        registration_confirmed: { email: true, whatsapp: false },
        registration_approved: { email: true, whatsapp: false },
        registration_rejected: { email: true, whatsapp: false },
        ticket_issued: { email: true, whatsapp: false },
        qr_pass_generated: { email: true, whatsapp: false },
        event_reminder: { email: true, whatsapp: false },
        event_updated: { email: true, whatsapp: false },
        event_cancelled: { email: true, whatsapp: false },
      },
    };

  const managedRequests: WhatsAppManagedServiceRequest[] = controlPanelData?.managedRequests || [];
  const isManagedActive =
    (orgSettings.whatsapp_integration_model === "managed" && orgSettings.whatsapp_setup_status === "active") ||
    managedRequests.some((r) => r.status === "active");

  const [masterEnabled, setMasterEnabled] = useState(orgSettings.enable_communication !== false);
  const [emailEnabled, setEmailEnabled] = useState(orgSettings.email_communication !== false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(
    Boolean(orgSettings.whatsapp_communication) || isManagedActive
  );
  const [automationRules, setAutomationRules] = useState<NotificationAutomationRules>(
    orgSettings.automation_rules
  );

  const userPlan = controlPanelData?.userPlan || { slug: "free", canWhatsAppSelfService: false };
  const selfServiceConfig: WhatsAppSelfServiceConfig = controlPanelData?.selfServiceConfig || {
    organization_id: "default",
    is_configured: false,
    connection_status: "disconnected",
  };
  const templates: WhatsAppTemplateRecord[] = controlPanelData?.templates || [];
  const stats = controlPanelData?.stats || {
    totalSent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    pending: 0,
    emailCount: 0,
    whatsappCount: 0,
  };

  const [activeTab, setActiveTab] = useState<"gateways" | "automation" | "templates" | "campaigns" | "logs">(
    "gateways"
  );

  // Broadcast & Action Loading States
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals
  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [testEmailSending, setTestEmailSending] = useState(false);

  const [testWAModalOpen, setTestWAModalOpen] = useState(false);
  const [testWAPhone, setTestWAPhone] = useState("+91");
  const [testWASending, setTestWASending] = useState(false);
  const [testWATemplate, setTestWATemplate] = useState<"urpass_space" | "urpass_ticket">("urpass_space");

  const [selfServiceModalOpen, setSelfServiceModalOpen] = useState(false);
  const [ssWabaId, setSsWabaId] = useState("");
  const [ssPhoneId, setSsPhoneId] = useState("");
  const [ssAppId, setSsAppId] = useState("");
  const [ssToken, setSsToken] = useState("");
  const [ssSecret, setSsSecret] = useState("");
  const [ssSaving, setSsSaving] = useState(false);

  const [managedModalOpen, setManagedModalOpen] = useState(false);
  const [managedVolume, setManagedVolume] = useState("1,000 - 5,000 passes/month");
  const [managedUseCase, setManagedUseCase] = useState("Event pass delivery & registration confirmations");
  const [managedEmail, setManagedEmail] = useState("");
  const [managedPhone, setManagedPhone] = useState("+91");
  const [managedSubmitting, setManagedSubmitting] = useState(false);

  const [simulatorTemplate, setSimulatorTemplate] = useState<WhatsAppTemplateRecord | null>(null);

  // Logs & Filters
  const [logSearch, setLogSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<"ALL" | "EMAIL" | "WHATSAPP" | "SMS">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DELIVERED" | "READ" | "SENT" | "FAILED">("ALL");

  const recentLogs: any[] = controlPanelData?.recentLogs || [];

  const isWhatsAppConfigured =
    (orgSettings.whatsapp_integration_model === "self_service" && selfServiceConfig.is_configured) ||
    isManagedActive;

  const isWhatsAppActive = Boolean(masterEnabled && whatsappEnabled && isWhatsAppConfigured);

  // Handlers
  async function handleToggleMaster(newVal: boolean) {
    setLoadingToggle("master");
    setFeedback(null);
    try {
      const res = await toggleMasterCommunicationAction(eventId, newVal);
      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      } else {
        setMasterEnabled(newVal);
        setFeedback({
          type: "success",
          text: newVal
            ? "Communication master switch enabled. Outbound notifications are active."
            : "Communication paused. Optional event notifications are suspended (essential passes remain delivered).",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to update master switch." });
    } finally {
      setLoadingToggle(null);
    }
  }

  async function handleToggleChannel(channel: "email" | "whatsapp", newVal: boolean) {
    if (channel === "whatsapp" && newVal && !isWhatsAppConfigured) {
      setFeedback({
        type: "error",
        text: "WhatsApp cannot be enabled until configured and activated via Self-Service or UrPass Managed WhatsApp.",
      });
      return;
    }

    setLoadingToggle(channel);
    setFeedback(null);
    try {
      const res = await toggleChannelAction(eventId, channel, newVal);
      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      } else {
        if (channel === "email") setEmailEnabled(newVal);
        if (channel === "whatsapp") setWhatsappEnabled(newVal);
        setFeedback({
          type: "success",
          text: `${channel === "email" ? "Email" : "WhatsApp"} channel ${newVal ? "enabled" : "disabled"}.`,
        });
      }
    } catch {
      setFeedback({ type: "error", text: `Failed to update ${channel} setting.` });
    } finally {
      setLoadingToggle(null);
    }
  }

  async function handleToggleAutomationRule(
    triggerKey: keyof NotificationAutomationRules,
    channel: "email" | "whatsapp"
  ) {
    const current = automationRules[triggerKey]?.[channel] ?? false;
    const newVal = !current;

    if (channel === "whatsapp" && newVal && !isWhatsAppConfigured) {
      setFeedback({
        type: "error",
        text: "WhatsApp must be active before enabling automated WhatsApp triggers.",
      });
      return;
    }

    const updated = {
      ...automationRules,
      [triggerKey]: {
        ...automationRules[triggerKey],
        [channel]: newVal,
      },
    };
    setAutomationRules(updated);

    try {
      const res = await updateAutomationRuleAction(eventId, triggerKey, channel, newVal);
      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to update notification rule." });
    }
  }

  async function handleSendTestEmail() {
    if (!testEmailAddress || !testEmailAddress.includes("@")) {
      setFeedback({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setTestEmailSending(true);
    try {
      const res = await sendTestEmailAction(eventId, testEmailAddress);
      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      } else {
        setFeedback({
          type: "success",
          text: `Test email pass successfully dispatched to ${testEmailAddress}!`,
        });
        setTestEmailModalOpen(false);
      }
    } catch {
      setFeedback({ type: "error", text: "Exception sending test email." });
    } finally {
      setTestEmailSending(false);
    }
  }

  async function handleSendTestWhatsApp() {
    if (!testWAPhone || testWAPhone.length < 10) {
      setFeedback({ type: "error", text: "Please enter a valid phone number with country code." });
      return;
    }

    setTestWASending(true);
    try {
      const res = await fetch("/api/communications/test-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: testWAPhone,
          templateName: testWATemplate,
          templateLang: testWATemplate === "urpass_space" ? "en" : "en_US",
          eventId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", text: data.error || "WhatsApp test delivery failed." });
      } else {
        setFeedback({
          type: "success",
          text: `WhatsApp pass successfully dispatched via Meta Cloud API! Template: ${testWATemplate} · WAMID: ${data.messageId}`,
        });
        setTestWAModalOpen(false);
      }
    } catch {
      setFeedback({ type: "error", text: "Network exception sending test WhatsApp." });
    } finally {
      setTestWASending(false);
    }
  }

  async function handleSaveSelfService() {
    if (!ssWabaId || !ssPhoneId) {
      setFeedback({ type: "error", text: "WABA ID and Phone Number ID are required." });
      return;
    }

    setSsSaving(true);
    try {
      const res = await saveSelfServiceWhatsAppAction(eventId, {
        waba_id: ssWabaId,
        phone_number_id: ssPhoneId,
        app_id: ssAppId || undefined,
        access_token: ssToken || undefined,
        app_secret: ssSecret || undefined,
      });

      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      } else {
        setFeedback({
          type: "success",
          text: `Self-Service WhatsApp connected and verified! Account: ${res.verifiedName || "Meta Verified"}`,
        });
        setWhatsappEnabled(true);
        setSelfServiceModalOpen(false);
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to save Meta credentials." });
    } finally {
      setSsSaving(false);
    }
  }

  async function handleSubmitManagedRequest() {
    if (!managedEmail || !managedPhone || !managedUseCase) {
      setFeedback({ type: "error", text: "Please provide contact details and use case." });
      return;
    }

    setManagedSubmitting(true);
    try {
      const res = await requestManagedWhatsAppAction(eventId, {
        estimated_monthly_volume: managedVolume,
        use_case: managedUseCase,
        contact_email: managedEmail,
        contact_phone: managedPhone,
      });

      if (res.error) {
        setFeedback({ type: "error", text: res.error });
      } else {
        setFeedback({
          type: "success",
          text: "UrPass Managed WhatsApp service request submitted! Our concierge team will review and assign pricing within 24 hours.",
        });
        setManagedModalOpen(false);
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to submit request." });
    } finally {
      setManagedSubmitting(false);
    }
  }

  // Filtered Logs
  const filteredLogs = recentLogs.filter((l) => {
    if (channelFilter !== "ALL" && l.channel !== channelFilter) return false;
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
    if (logSearch) {
      const q = logSearch.toLowerCase();
      const name = l.attendee?.name?.toLowerCase() || "";
      const email = l.attendee?.email?.toLowerCase() || "";
      const dest = l.destination?.toLowerCase() || "";
      const ticket = l.ticket_id?.toLowerCase() || "";
      if (!name.includes(q) && !email.includes(q) && !dest.includes(q) && !ticket.includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="bg-white min-h-screen text-neutral-900 space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm transition-all duration-150 border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <p className="font-medium text-xs sm:text-sm">{feedback.text}</p>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-md hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION A: MASTER SWITCH & EXECUTIVE STATUS BAR (CLEAN WHITE)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-violet-700">
                Communication Governance
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="text-xs text-neutral-500">Master Control</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2.5">
              Enable Communication
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  masterEnabled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {masterEnabled ? "Active" : "Paused"}
              </span>
            </h2>
            <p className="text-xs text-neutral-500 max-w-xl">
              Control all outbound notifications. When paused, optional reminders and marketing broadcasts are suspended,
              while essential entry passes remain safely delivered.
            </p>
          </div>

          {/* Master Switch Toggle Button */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-neutral-500">
              {masterEnabled ? "All Channels Active" : "Paused"}
            </span>
            <button
              onClick={() => handleToggleMaster(!masterEnabled)}
              disabled={loadingToggle === "master"}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                masterEnabled ? "bg-violet-600" : "bg-neutral-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  masterEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Channel Overview Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Channel Pill */}
          <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-neutral-900 leading-tight">Email Communication</p>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center leading-none">
                    Default Channel
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">Pre-configured with verified ZeptoMail infrastructure</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleChannel("email", !emailEnabled)}
              disabled={loadingToggle === "email" || !masterEnabled}
              aria-label="Toggle Email Communication"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                emailEnabled && masterEnabled ? "bg-emerald-500" : "bg-neutral-200"
              } ${!masterEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  emailEnabled && masterEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* WhatsApp Channel Pill with Real WhatsApp Logo */}
          <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <WhatsAppLogo size={24} variant="brand" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-neutral-900 leading-tight">WhatsApp Communication</p>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center leading-none ${
                      isWhatsAppConfigured
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-neutral-100 text-neutral-500 border-neutral-200"
                    }`}
                  >
                    {isWhatsAppConfigured
                      ? orgSettings.whatsapp_integration_model === "self_service"
                        ? "Self-Service Active"
                        : "Managed by UrPass"
                      : "Not Configured"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                  {isWhatsAppConfigured
                    ? "Official Meta Cloud API Gateway connected"
                    : "Configure Self-Service or Managed WhatsApp below"}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggleChannel("whatsapp", !whatsappEnabled)}
              disabled={loadingToggle === "whatsapp" || !masterEnabled || !isWhatsAppConfigured}
              aria-label="Toggle WhatsApp Communication"
              title={!isWhatsAppConfigured ? "WhatsApp must be activated before enabling" : "Toggle WhatsApp"}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                whatsappEnabled && masterEnabled && isWhatsAppConfigured
                  ? "bg-[#25D366]"
                  : "bg-neutral-200 opacity-60"
              } ${!masterEnabled || !isWhatsAppConfigured ? "cursor-not-allowed" : ""}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  whatsappEnabled && masterEnabled && isWhatsAppConfigured ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Corporate KPI Counters (Aligned and uniform height) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between h-full min-h-[96px] text-left">
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Dispatches</p>
            <p className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">{stats.totalSent || 0}</p>
            <p className="text-[11px] text-neutral-400 mt-1">Across email & WhatsApp</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between h-full min-h-[96px] text-left">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Passes Delivered</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 mt-1">{stats.delivered || 0}</p>
            <p className="text-[11px] text-neutral-400 mt-1">
              {stats.totalSent > 0 ? Math.round((stats.delivered / stats.totalSent) * 100) : 100}% verified rate
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between h-full min-h-[96px] text-left">
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Current Model</p>
            <p className="text-base font-bold tracking-tight text-neutral-900 mt-1.5 truncate">
              {orgSettings.whatsapp_integration_model === "self_service"
                ? "Self-Service"
                : orgSettings.whatsapp_integration_model === "managed" || isManagedActive
                ? "UrPass Managed"
                : "Email Default"}
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">Plan: {userPlan.slug.toUpperCase()}</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between h-full min-h-[96px] text-left">
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Production Template</p>
            <div className="flex items-center gap-1.5 mt-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-sm font-bold font-mono tracking-tight text-neutral-800 truncate">urpass_space</p>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Meta Approved · Utility (en &amp; en_US)</p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CORPORATE NAVIGATION TABS (Pixel-perfect alignments & gated Pass Delivery)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-2.5">
        <button
          onClick={() => setActiveTab("gateways")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "gateways"
              ? "bg-neutral-900 text-white shadow-2xs"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Channels & WhatsApp Models</span>
        </button>

        <button
          onClick={() => setActiveTab("automation")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "automation"
              ? "bg-neutral-900 text-white shadow-2xs"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Notification Automation Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "templates"
              ? "bg-neutral-900 text-white shadow-2xs"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Approved WhatsApp Templates</span>
        </button>

        {/* Pass Delivery & Broadcasts: Gated strictly to active WhatsApp Delivery */}
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "campaigns"
              ? "bg-neutral-900 text-white shadow-2xs"
              : isWhatsAppActive
              ? "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
          }`}
        >
          {isWhatsAppActive ? (
            <WhatsAppLogo size={14} variant="brand" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>Pass Delivery & Broadcasts</span>
          {isWhatsAppActive ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          ) : (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-500 border border-neutral-200 shrink-0">
              Requires WhatsApp
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "logs"
              ? "bg-neutral-900 text-white shadow-2xs"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Delivery Audit Logs</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: CHANNELS & WHATSAPP INTEGRATION MODELS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "gateways" && (
        <div className="space-y-6">
          {/* Email Infrastructure Card */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">Email Communication</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Operational · Default
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Email is automatically enabled for all organizations. Tickets, confirmations, and reminders send
                    automatically with verified SPF & DKIM deliverability.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTestEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Send Test Email
              </button>
            </div>

            {/* Email Templates Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <p className="text-xs font-bold text-neutral-900">Registration Confirmed</p>
                <p className="text-[11px] text-neutral-500">Instant registration receipt with event details.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <p className="text-xs font-bold text-neutral-900">Digital Ticket & QR Pass</p>
                <p className="text-[11px] text-neutral-500">Secure pass URL with Apple/Google wallet support.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <p className="text-xs font-bold text-neutral-900">24h Event Reminder</p>
                <p className="text-[11px] text-neutral-500">Entry gate instructions and venue schedule.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <p className="text-xs font-bold text-neutral-900">Approval / Rejection</p>
                <p className="text-[11px] text-neutral-500">Automated status decisions for curated attendee lists.</p>
              </div>
            </div>
          </div>

          {/* WhatsApp Integration Models Header */}
          <div className="space-y-1 pt-1">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <WhatsAppLogo size={18} variant="brand" /> WhatsApp Integration Models
            </h3>
            <p className="text-xs text-neutral-500">
              Select how your organization connects WhatsApp. Choose Self-Service (Business Plan) or UrPass Managed
              Service.
            </p>
          </div>

          {/* Two Model Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ── OPTION 1: SELF-SERVICE WHATSAPP (BUSINESS ONLY) ── */}
            <div
              className={`rounded-2xl p-6 border shadow-2xs flex flex-col justify-between transition-all ${
                userPlan.canWhatsAppSelfService
                  ? "bg-white border-neutral-200/90"
                  : "bg-neutral-50/70 border-neutral-200/60"
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <WhatsAppLogo size={24} variant="brand" />
                    <span className="font-bold text-sm text-neutral-900">Option 1 — Self-Service</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    Business Plan Only
                  </span>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed">
                  Connect your own WhatsApp Business Platform account, configure templates, and send event notifications
                  using your own Meta credentials.
                </p>

                {/* Eligibility Check */}
                {!userPlan.canWhatsAppSelfService ? (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-800 font-bold">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      Requires Business Plan
                    </div>
                    <p className="text-[11px] text-amber-700 leading-normal">
                      Your current plan is <span className="font-bold uppercase">{userPlan.slug}</span>. Connecting your
                      own Meta Cloud API credentials requires the Business subscription.
                    </p>
                    <Link
                      href="/billing?plan=business&tab=plans"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors mt-0.5"
                    >
                      Upgrade to Business <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Connection Status:</span>
                      <span
                        className={`font-bold ${
                          selfServiceConfig.is_configured ? "text-emerald-600" : "text-neutral-400"
                        }`}
                      >
                        {selfServiceConfig.is_configured ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                    {selfServiceConfig.is_configured && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500">Verified Name:</span>
                          <span className="font-medium text-neutral-800">
                            {selfServiceConfig.verified_name || "Verified Meta Account"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500">WABA Account ID:</span>
                          <span className="font-mono text-neutral-800">{selfServiceConfig.waba_id}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-5 mt-auto">
                {userPlan.canWhatsAppSelfService ? (
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://business.facebook.com/messaging/whatsapp/onboard/?app_id=4551986315050244&config_id=1145800595062171&extras=%7B%22version%22%3A%22v4%22%2C%22sessionInfoVersion%22%3A%223%22%2C%22featureType%22%3A%22whatsapp_business_app_onboarding%22%7D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <WhatsAppLogo size={16} variant="white" />
                      1-Click Connect with Meta
                    </a>
                    <button
                      onClick={() => setSelfServiceModalOpen(true)}
                      className="w-full h-8 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium text-[11px] border border-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      {selfServiceConfig.is_configured ? "Update Meta Credentials" : "Enter Credentials Manually"}
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/billing?plan=business&tab=plans"
                    className="w-full h-10 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" /> Upgrade to Business
                  </Link>
                )}
              </div>
            </div>

            {/* ── OPTION 2: URPASS MANAGED WHATSAPP (PAID ADD-ON) ── */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs flex flex-col justify-between h-full">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center text-violet-700 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-neutral-900">Option 2 — UrPass Managed</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border leading-none ${
                      isManagedActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {isManagedActive ? "Active · Managed" : "Paid Add-on"}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed">
                  Let UrPass handle WhatsApp integration, template configuration, and message delivery for your events.
                  No Meta developer account or tech setup required.
                </p>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Service Status:</span>
                    <span
                      className={`font-bold ${
                        isManagedActive ? "text-emerald-600 flex items-center gap-1.5" : "text-violet-700"
                      }`}
                    >
                      {isManagedActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ACTIVE &amp; DELIVERING
                        </>
                      ) : managedRequests.length > 0 ? (
                        managedRequests[0].status.replace(/_/g, " ").toUpperCase()
                      ) : (
                        "Ready to Request"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Provider Setup:</span>
                    <span className="font-medium text-neutral-800">
                      {isManagedActive ? "Verified Meta Cloud API (UrPass WABA)" : "Managed by UrPass"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Eligibility:</span>
                    <span className="font-medium text-neutral-800">Starter, Pro, and Business</span>
                  </div>
                </div>

                {managedRequests.length > 0 && (
                  <div className="p-3 rounded-lg bg-violet-50 border border-violet-100 text-xs space-y-0.5">
                    <p className="font-bold text-violet-900">Request ID: #{managedRequests[0].id.slice(0, 10)}</p>
                    <p className="text-neutral-500 text-[11px]">
                      Volume: {managedRequests[0].estimated_monthly_volume} · Status:{" "}
                      {managedRequests[0].status.toUpperCase()}
                    </p>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-5 mt-auto">
                {isManagedActive ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      UrPass Managed WhatsApp Active
                    </div>
                    <button
                      onClick={() => setManagedModalOpen(true)}
                      className="w-full h-8 rounded-lg bg-white hover:bg-neutral-50 text-neutral-600 font-medium text-[11px] border border-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                      Request Additional Quota
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setManagedModalOpen(true)}
                    className="w-full h-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    {managedRequests.length > 0 ? "Request Additional Quota" : "Request Managed Service"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: NOTIFICATION AUTOMATION RULES MATRIX
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "automation" && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Notification Automation Rules</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Configure automatic multi-channel dispatches for each event trigger. Email is enabled by default. WhatsApp
              toggles activate once your WhatsApp gateway is connected.
            </p>
          </div>

          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase font-bold text-neutral-500">
                  <th className="py-3 px-4">Event Trigger</th>
                  <th className="py-3 px-4">Delivery Rule</th>
                  <th className="py-3 px-4 text-center">Email</th>
                  <th className="py-3 px-4 text-center">WhatsApp</th>
                  <th className="py-3 px-4 text-right">Active Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[
                  {
                    key: "registration_confirmed" as keyof NotificationAutomationRules,
                    label: "Registration Confirmed",
                    desc: "Immediate acknowledgment of received attendee registration",
                  },
                  {
                    key: "registration_approved" as keyof NotificationAutomationRules,
                    label: "Registration Approved",
                    desc: "Sent when attendee application is reviewed and accepted",
                  },
                  {
                    key: "registration_rejected" as keyof NotificationAutomationRules,
                    label: "Registration Rejected",
                    desc: "Notification for waitlisted or rejected applications",
                  },
                  {
                    key: "ticket_issued" as keyof NotificationAutomationRules,
                    label: "Ticket Issued",
                    desc: "Dispatched upon pass allocation or ticket payment",
                  },
                  {
                    key: "qr_pass_generated" as keyof NotificationAutomationRules,
                    label: "QR Pass Generated",
                    desc: "Delivers digital pass token and scannable credential",
                  },
                  {
                    key: "event_reminder" as keyof NotificationAutomationRules,
                    label: "Event Reminder (24h)",
                    desc: "Venue navigation and entry gate check-in instructions",
                  },
                  {
                    key: "event_updated" as keyof NotificationAutomationRules,
                    label: "Event Updated",
                    desc: "Critical gate, venue, or timing schedule adjustments",
                  },
                  {
                    key: "event_cancelled" as keyof NotificationAutomationRules,
                    label: "Event Cancelled",
                    desc: "Emergency notification with cancellation notice",
                  },
                ].map((row) => {
                  const rule = automationRules[row.key] || { email: true, whatsapp: false };
                  return (
                    <tr key={row.key} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-900 align-middle">{row.label}</td>
                      <td className="py-3.5 px-4 text-neutral-500 max-w-xs align-middle leading-relaxed">{row.desc}</td>
                      <td className="py-3.5 px-4 text-center align-middle">
                        <button
                          onClick={() => handleToggleAutomationRule(row.key, "email")}
                          className={`inline-flex items-center justify-center gap-1.5 w-28 px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                            rule.email
                              ? "bg-violet-50 text-violet-700 border border-violet-200"
                              : "bg-neutral-100 text-neutral-400"
                          }`}
                        >
                          {rule.email ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{rule.email ? "Default On" : "Disabled"}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center align-middle">
                        <button
                          onClick={() => handleToggleAutomationRule(row.key, "whatsapp")}
                          disabled={!isWhatsAppConfigured}
                          title={
                            !isWhatsAppConfigured
                              ? "Requires active WhatsApp connection"
                              : "Toggle WhatsApp for this trigger"
                          }
                          className={`inline-flex items-center justify-center gap-1.5 w-28 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            rule.whatsapp && isWhatsAppConfigured
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                              : isWhatsAppConfigured
                              ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                              : "bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50"
                          }`}
                        >
                          {rule.whatsapp && isWhatsAppConfigured ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <X className="w-3 h-3 text-neutral-400" />
                          )}
                          <span>
                            {rule.whatsapp && isWhatsAppConfigured
                              ? "Active"
                              : !isWhatsAppConfigured
                              ? "Locked"
                              : "Optional"}
                          </span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right align-middle">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          {rule.email && rule.whatsapp && isWhatsAppConfigured
                            ? "Dual Channel"
                            : rule.email
                            ? "Email"
                            : "Off"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: APPROVED WHATSAPP TEMPLATES (USERS CANNOT CREATE TEMPLATES)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "templates" && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <WhatsAppLogo size={20} variant="brand" />
                <h3 className="text-base font-bold text-neutral-900">Approved WhatsApp Message Templates</h3>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Meta strictly enforces approved utility templates for business-initiated WhatsApp messaging. UrPass
                provides pre-certified production templates to guarantee immediate 100% deliverability.
              </p>
            </div>

            {/* Test Pass Quick Action */}
            <button
              onClick={() => setTestWAModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              Send Live Test Pass
            </button>
          </div>

          {/* Template Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 rounded-xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between h-full space-y-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-900">{tpl.name}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 leading-none">
                        {tpl.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 leading-none">
                      {tpl.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono whitespace-pre-wrap text-neutral-800 leading-relaxed">
                    {tpl.body_text}
                  </div>

                  {tpl.buttons && tpl.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tpl.buttons.map((b, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 leading-none"
                        >
                          <ExternalLink className="w-3 h-3 text-[#25D366]" />
                          {b.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs mt-auto">
                  <span className="text-neutral-400 font-medium">Language: {tpl.language}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSimulatorTemplate(tpl)}
                      className="h-8.5 px-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-bold transition-colors inline-flex items-center justify-center cursor-pointer"
                    >
                      Preview Simulator
                    </button>
                    <button
                      onClick={() => setTestWAModalOpen(true)}
                      className="h-8.5 px-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-bold transition-colors inline-flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      Test Pass
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: PASS DELIVERY & CAMPAIGNS (GATED TO ACTIVE WHATSAPP DELIVERY)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          {isWhatsAppActive ? (
            <WhatsAppBulkInviteCard
              eventId={eventId}
              eventName={eventName}
              eventDate={eventDate}
              venue={venue}
            />
          ) : (
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-8 sm:p-12 shadow-2xs text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto relative shadow-2xs">
                <div className="opacity-40 grayscale">
                  <WhatsAppLogo size={34} variant="brand" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 leading-none">
                  WhatsApp Delivery Inactive
                </div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  Pass Delivery & Broadcasts are Locked
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
                  Bulk QR pass delivery and attendee messaging broadcasts are exclusively available when WhatsApp communication is active and properly connected.
                </p>
              </div>

              {/* Channel Health Diagnostics Checklist */}
              <div className="bg-neutral-50 border border-neutral-200/90 rounded-xl p-4 text-xs space-y-2.5 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 font-medium flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> Master Communication Switch
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1 leading-none ${
                    masterEnabled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {masterEnabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {masterEnabled ? "Active" : "Paused"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 font-medium flex items-center gap-2">
                    <WhatsAppLogo size={14} variant="brand" /> WhatsApp Channel
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1 leading-none ${
                    whatsappEnabled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                  }`}>
                    {whatsappEnabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {whatsappEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> Meta Integration Model
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1 leading-none ${
                    isWhatsAppConfigured
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {isWhatsAppConfigured ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {isWhatsAppConfigured ? "Connected" : "Not Configured"}
                  </span>
                </div>
              </div>

              {/* 1-Click Action to Enable & Unlock */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {!isWhatsAppConfigured ? (
                  <button
                    onClick={() => setActiveTab("gateways")}
                    className="w-full sm:w-auto h-9.5 px-5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Settings2 className="w-4 h-4" />
                    Configure WhatsApp Gateway
                  </button>
                ) : !masterEnabled ? (
                  <button
                    onClick={() => handleToggleMaster(true)}
                    disabled={loadingToggle === "master"}
                    className="w-full sm:w-auto h-9.5 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    {loadingToggle === "master" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Enable Master Switch
                  </button>
                ) : !whatsappEnabled ? (
                  <button
                    onClick={() => handleToggleChannel("whatsapp", true)}
                    disabled={loadingToggle === "whatsapp"}
                    className="w-full sm:w-auto h-9.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    {loadingToggle === "whatsapp" ? <Loader2 className="w-4 h-4 animate-spin" /> : <WhatsAppLogo size={16} variant="white" />}
                    Enable WhatsApp Delivery
                  </button>
                ) : null}

                <button
                  onClick={() => setActiveTab("gateways")}
                  className="w-full sm:w-auto h-9.5 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
                >
                  View Gateways & Settings
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: DELIVERY AUDIT LOGS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "logs" && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Delivery Activity & Audit Logs</h3>
              <p className="text-xs text-neutral-500">
                Live delivery status transitions with attendee phone masking for privacy compliance.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter by name, ticket..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-48 sm:w-60 h-8.5 pl-8 pr-3 rounded-lg border border-neutral-200 text-xs bg-neutral-50 text-neutral-900 focus:outline-hidden focus:border-neutral-400"
                />
              </div>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value as any)}
                className="h-8.5 px-3 rounded-lg border border-neutral-200 text-xs bg-neutral-50 text-neutral-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Channels</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="SMS">SMS</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-8.5 px-3 rounded-lg border border-neutral-200 text-xs bg-neutral-50 text-neutral-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="DELIVERED">Delivered</option>
                <option value="READ">Read</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase font-bold text-neutral-500">
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Template / Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      No communication records found for this event matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-neutral-900">{log.attendee?.name || "Guest Attendee"}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          {log.destination || log.attendee?.email}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-bold text-[10px] bg-neutral-100 text-neutral-700">
                          {log.channel === "WHATSAPP" ? (
                            <WhatsAppLogo size={12} variant="brand" />
                          ) : (
                            <Mail className="w-3 h-3 text-violet-600" />
                          )}
                          {log.channel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-700">
                        {log.template_name || log.subject || "ticket_confirmation"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === "DELIVERED" || log.status === "READ"
                              ? "bg-emerald-50 text-emerald-700"
                              : log.status === "FAILED"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          <CheckCheck className="w-3 h-3" />
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {new Date(log.created_at || log.sent_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: SEND TEST EMAIL
      ───────────────────────────────────────────────────────────── */}
      {testEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-600" /> Send Live Test Email
              </h3>
              <button
                onClick={() => setTestEmailModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Dispatches an authentic ticket email preview to verify styling and ZeptoMail gateway deliverability.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">Recipient Email Address</label>
              <input
                type="email"
                placeholder="organizer@yespstudio.com"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs bg-neutral-50 text-neutral-900 focus:outline-hidden"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTestEmailModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTestEmail}
                disabled={testEmailSending}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5"
              >
                {testEmailSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: SEND TEST WHATSAPP
      ───────────────────────────────────────────────────────────── */}
      {testWAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <WhatsAppLogo size={18} variant="brand" /> Send Live WhatsApp Test
              </h3>
              <button
                onClick={() => setTestWAModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Dispatches an approved Meta Cloud API template (<span className="font-mono font-bold">urpass_space</span> or <span className="font-mono font-bold">urpass_ticket</span>) with dynamic
              parameters directly to any WhatsApp phone in real-time.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">Message Template</label>
              <select
                value={testWATemplate}
                onChange={(e) => setTestWATemplate(e.target.value as "urpass_space" | "urpass_ticket")}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs bg-neutral-50 text-neutral-900 focus:outline-hidden font-medium"
              >
                <option value="urpass_space">urpass_space (English UK · 4 variables + QR Button)</option>
                <option value="urpass_ticket">urpass_ticket (English US · 5 variables + QR Button)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">Recipient Phone Number (E.164)</label>
              <input
                type="text"
                placeholder="+919876543210"
                value={testWAPhone}
                onChange={(e) => setTestWAPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs bg-neutral-50 text-neutral-900 font-mono focus:outline-hidden"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTestWAModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTestWhatsApp}
                disabled={testWASending}
                className="px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5"
              >
                {testWASending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CONFIGURE SELF-SERVICE META CREDENTIALS
      ───────────────────────────────────────────────────────────── */}
      {selfServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-violet-700" /> Configure Meta WhatsApp Cloud API
              </h3>
              <button
                onClick={() => setSelfServiceModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Enter your WhatsApp Business Platform credentials. Credentials are encrypted at rest with AES-256-GCM and
              never exposed in application logs or frontend responses.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700">WhatsApp Business Account ID (WABA ID)</label>
                <input
                  type="text"
                  placeholder="e.g. 583920194827104"
                  value={ssWabaId}
                  onChange={(e) => setSsWabaId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700">Phone Number ID</label>
                <input
                  type="text"
                  placeholder="e.g. 482910394820194"
                  value={ssPhoneId}
                  onChange={(e) => setSsPhoneId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700">System User Access Token</label>
                <input
                  type="password"
                  placeholder="EAAB..."
                  value={ssToken}
                  onChange={(e) => setSsToken(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-700">App ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="Meta App ID"
                    value={ssAppId}
                    onChange={(e) => setSsAppId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700">App Secret (Webhook HMAC)</label>
                  <input
                    type="password"
                    placeholder="For HMAC validation"
                    value={ssSecret}
                    onChange={(e) => setSsSecret(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelfServiceModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSelfService}
                disabled={ssSaving}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5"
              >
                {ssSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Verify & Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: REQUEST URPASS MANAGED WHATSAPP
      ───────────────────────────────────────────────────────────── */}
      {managedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-700" /> Request UrPass Managed WhatsApp
              </h3>
              <button
                onClick={() => setManagedModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              UrPass handles all Meta API verification, utility template registration, and high-volume delivery for your
              organization. Submit your volume to receive a quote.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700">Estimated Monthly Message Volume</label>
                <select
                  value={managedVolume}
                  onChange={(e) => setManagedVolume(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900"
                >
                  <option value="500 - 1,000 passes/month">500 - 1,000 passes / month</option>
                  <option value="1,000 - 5,000 passes/month">1,000 - 5,000 passes / month</option>
                  <option value="5,000 - 25,000 passes/month">5,000 - 25,000 passes / month</option>
                  <option value="25,000+ Enterprise tier">25,000+ Enterprise tier</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700">Primary Contact Email</label>
                <input
                  type="email"
                  placeholder="organizer@yespstudio.com"
                  value={managedEmail}
                  onChange={(e) => setManagedEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700">Contact Phone (WhatsApp)</label>
                <input
                  type="text"
                  placeholder="+919876543210"
                  value={managedPhone}
                  onChange={(e) => setManagedPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700">Event Use Case</label>
                <textarea
                  rows={2}
                  value={managedUseCase}
                  onChange={(e) => setManagedUseCase(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setManagedModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitManagedRequest}
                disabled={managedSubmitting}
                className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {managedSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: SMARTPHONE SIMULATOR PREVIEW
      ───────────────────────────────────────────────────────────── */}
      {simulatorTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-violet-700" /> WhatsApp Mobile Preview
              </h3>
              <button
                onClick={() => setSimulatorTemplate(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#EFEAE2] p-4 border border-neutral-200 space-y-2">
              <div className="max-w-[88%] rounded-xl rounded-tl-xs bg-white p-3 text-xs shadow-2xs space-y-2 text-neutral-800">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {simulatorTemplate.body_text
                    .replace("{{1}}", "Alex Morgan")
                    .replace("{{2}}", eventName)
                    .replace("{{3}}", eventDate || "Tomorrow 10:00 AM")
                    .replace("{{4}}", venue || "UrPass Main Arena")
                    .replace("{{5}}", "URP-84721")}
                </p>
                <div className="flex justify-end items-center gap-1 text-[9px] text-neutral-400">
                  <span>10:42 AM</span>
                  <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                </div>
              </div>

              {simulatorTemplate.buttons?.map((b, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white p-2.5 text-center text-xs font-bold text-[#00a884] shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {b.text}
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setSimulatorTemplate(null)}
                className="w-full py-2 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-black transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
