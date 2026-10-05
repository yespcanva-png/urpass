"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  UserPlus,
  Search,
  CheckCircle2,
  Printer,
  CreditCard,
  QrCode,
  DollarSign,
  Smartphone,
  Building,
  Mail,
  User,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { BadgeRoleType } from "@/lib/physical-ops/types";
import { OnsiteAttendee } from "@/lib/physical-ops/desk-service";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_ROLE_COLORS: Record<BadgeRoleType, { label: string; headerColor: string; accentColor: string }> = {
  attendee: { label: "DELEGATE", headerColor: "#18181b", accentColor: "#2563eb" },
  vip: { label: "VIP DELEGATE", headerColor: "#581c87", accentColor: "#7c3aed" },
  speaker: { label: "KEYNOTE SPEAKER", headerColor: "#065f46", accentColor: "#059669" },
  sponsor: { label: "OFFICIAL SPONSOR", headerColor: "#1e3a8a", accentColor: "#2563eb" },
  exhibitor: { label: "EXHIBITOR PARTNER", headerColor: "#854d0e", accentColor: "#d97706" },
  staff: { label: "EVENT CREW / STAFF", headerColor: "#991b1b", accentColor: "#dc2626" },
  custom: { label: "SPECIAL GUEST", headerColor: "#374151", accentColor: "#4b5563" },
};

export default function OnsiteDeskPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [activeTab, setActiveTab] = useState<"search" | "walkin">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendees, setAttendees] = useState<OnsiteAttendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Walk-in form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [ticketName, setTicketName] = useState("General Delegate");
  const [badgeType, setBadgeType] = useState<BadgeRoleType>("attendee");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card" | "complimentary">("upi");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [autoQueuePrint, setAutoQueuePrint] = useState(true);
  const [walkinSuccess, setWalkinSuccess] = useState<OnsiteAttendee | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Isolated Badge for physical print output
  const [printBadge, setPrintBadge] = useState<{
    name: string;
    email: string;
    company?: string;
    designation?: string;
    badgeType: BadgeRoleType;
    ticketName?: string;
    passToken: string;
  } | null>(null);

  const fetchAttendees = (q = "") => {
    setIsLoading(true);
    fetch(`/api/event/${eventId}/ops/desk?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => {
        setIsLoading(false);
        if (d.success) setAttendees(d.attendees);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAttendees(searchQuery);

    const supabase = createClient();
    const channel = supabase
      .channel(`desk-realtime-${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendees", filter: `event_id=eq.${eventId}` },
        () => {
          fetchAttendees(searchQuery);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "check_ins", filter: `event_id=eq.${eventId}` },
        () => {
          fetchAttendees(searchQuery);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAttendees(searchQuery);
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/event/${eventId}/ops/desk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "walkin",
          payload: {
            name,
            email,
            phone,
            company,
            designation,
            ticketName,
            badgeType,
            paymentMethod,
            amountPaid: Number(amountPaid),
            autoCheckIn,
            autoQueuePrint,
          },
          staffName: "Onsite Desk Staff",
        }),
      });
      const data = await res.json();
      setSubmitting(false);
      if (data.success && data.attendee) {
        setWalkinSuccess(data.attendee);
        setAttendees((prev) => [data.attendee, ...prev]);

        setPrintBadge({
          name: data.attendee.name,
          email: data.attendee.email,
          company: data.attendee.company || "",
          designation: data.attendee.designation || "",
          badgeType: data.attendee.badgeType,
          ticketName: data.attendee.ticketName,
          passToken: data.attendee.passToken || data.attendee.id,
        });

        if (autoQueuePrint) {
          setTimeout(() => {
            window.print();
          }, 80);
        }

        // Reset form fields
        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setDesignation("");
        setAmountPaid(0);
      }
    } catch {
      setSubmitting(false);
    }
  };

  const handleCheckIn = async (attendeeId: string) => {
    const res = await fetch(`/api/event/${eventId}/ops/desk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkin",
        attendeeId,
        staffName: "Onsite Desk Staff",
      }),
    });
    const data = await res.json();
    if (data.success && data.attendee) {
      setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? data.attendee : a)));
    }
  };

  const handlePrintBadge = async (attendee: OnsiteAttendee) => {
    setPrintBadge({
      name: attendee.name,
      email: attendee.email,
      company: attendee.company || "",
      designation: attendee.designation || "",
      badgeType: attendee.badgeType,
      ticketName: attendee.ticketName,
      passToken: attendee.passToken || attendee.id,
    });

    setTimeout(() => {
      window.print();
    }, 60);

    await fetch(`/api/event/${eventId}/ops/print`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "queue_single",
        attendee: {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          company: attendee.company,
          ticketName: attendee.ticketName,
          badgeType: attendee.badgeType,
        },
      }),
    });
  };

  const handleMarkPayment = async (attendeeId: string, status: "paid" | "pending" | "waived") => {
    const res = await fetch(`/api/event/${eventId}/ops/desk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        attendeeId,
        updates: { paymentStatus: status },
        staffName: "Onsite Cashier",
      }),
    });
    const data = await res.json();
    if (data.success && data.attendee) {
      setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? data.attendee : a)));
    }
  };

  return (
    <>
      <div className="space-y-6 no-print">
        {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-brand/10 text-brand rounded-full">
              STAGE 2 PHYSICAL OPS
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-medium">Sprint 3: Onsite Desk</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Onsite Registration &amp; Check-In Desk
          </h1>
          <p className="text-sm text-neutral-500">
            High-speed walk-in registrations, rapid attendee lookup, instant badge issuance, and gate validation.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
          <button
            onClick={() => {
              setActiveTab("search");
              setWalkinSuccess(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "search"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search &amp; Check-In</span>
          </button>
          <button
            onClick={() => setActiveTab("walkin")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "walkin"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Walk-In Registration</span>
          </button>
        </div>
      </div>

      {activeTab === "search" && (
        <div className="space-y-4">
          {/* Rapid Search Bar */}
          <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Scan QR or search by Name, Email, Phone, Company, or Pass ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchAttendees(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                Search Desk
              </button>
            </form>
          </div>

          {/* Attendees Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-3 px-4">Attendee Credentials</th>
                    <th className="py-3 px-4">Affiliation &amp; Phone</th>
                    <th className="py-3 px-4">Badge / Ticket</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Gate Status</th>
                    <th className="py-3 px-4 text-right">Desk Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {attendees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-400">
                        {isLoading ? "Searching attendee database..." : "No attendees found matching query."}
                      </td>
                    </tr>
                  ) : (
                    attendees.map((att) => (
                      <tr key={att.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-neutral-900">{att.name}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">{att.email}</p>
                          {att.passToken && (
                            <span className="inline-block mt-0.5 text-[9px] font-mono px-1.5 py-0.2 bg-neutral-100 text-neutral-600 rounded">
                              {att.passToken}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-neutral-600">
                          <p className="font-medium text-neutral-800">{att.company || "—"}</p>
                          <p className="text-[11px] text-neutral-400">{att.phone || "No phone"}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand">
                            {att.badgeType}
                          </span>
                          <p className="text-[11px] text-neutral-500 mt-0.5">{att.ticketName}</p>
                        </td>
                        <td className="py-3 px-4">
                          {att.paymentStatus === "paid" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Paid ({att.paymentMethod?.toUpperCase() || "GATEWAY"})
                            </span>
                          ) : att.paymentStatus === "waived" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                              Waived / VIP
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                Pending
                              </span>
                              <button
                                type="button"
                                onClick={() => handleMarkPayment(att.id, "paid")}
                                className="text-[10px] text-brand hover:underline font-semibold"
                              >
                                Mark Paid
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {att.isCheckedIn ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Checked In
                              </span>
                              {att.checkedInAt && (
                                <p className="text-[10px] text-neutral-400">
                                  {new Date(att.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCheckIn(att.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                            >
                              Check In Now
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handlePrintBadge(att)}
                            className="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 text-[11px] font-semibold hover:bg-neutral-50 transition-colors inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3 text-neutral-500" />
                            <span>Print Badge</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "walkin" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">New Walk-In Delegate Registration</h2>
              <p className="text-xs text-neutral-500">
                Collect attendee information, accept cash/UPI payment, generate verified pass, and dispatch to printer immediately.
              </p>
            </div>

            {walkinSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">
                      Successfully Registered &amp; Checked In: {walkinSuccess.name}
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Pass: {walkinSuccess.passToken} · Badge sent to connected printer queue.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (walkinSuccess) {
                      setPrintBadge({
                        name: walkinSuccess.name,
                        email: walkinSuccess.email,
                        company: walkinSuccess.company || "",
                        designation: walkinSuccess.designation || "",
                        badgeType: walkinSuccess.badgeType,
                        ticketName: walkinSuccess.ticketName,
                        passToken: walkinSuccess.passToken || walkinSuccess.id,
                      });
                      setTimeout(() => window.print(), 60);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
                >
                  Print Badge Now
                </button>
              </div>
            )}

            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Krishnan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Company / College
                  </label>
                  <input
                    type="text"
                    placeholder="Tech Mahindra / IIT"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    placeholder="Senior Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Ticket Tier
                  </label>
                  <select
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-brand/20"
                  >
                    <option value="General Delegate">General Delegate (Standard)</option>
                    <option value="VIP All-Access Pass">VIP All-Access Pass</option>
                    <option value="Student Pass">Student Pass (College ID Required)</option>
                    <option value="Exhibitor Booth Pass">Exhibitor Booth Pass</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Badge Role Type
                  </label>
                  <select
                    value={badgeType}
                    onChange={(e) => setBadgeType(e.target.value as BadgeRoleType)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-brand/20"
                  >
                    <option value="attendee">Attendee</option>
                    <option value="vip">VIP</option>
                    <option value="speaker">Speaker</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="exhibitor">Exhibitor</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              {/* Payment Section */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                  Payment Collection (Onsite Cashier)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "upi", label: "Instant UPI" },
                    { id: "cash", label: "Cash Desk" },
                    { id: "card", label: "POS Card" },
                    { id: "complimentary", label: "Complimentary" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                        paymentMethod === p.id
                          ? "border-brand bg-brand/10 text-brand ring-2 ring-brand/20"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {paymentMethod !== "complimentary" && (
                  <div className="pt-2">
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Collected Fee Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      className="w-36 text-xs font-mono font-bold border border-neutral-200 rounded-xl px-3 py-2 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Automation Toggles */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCheckIn}
                    onChange={(e) => setAutoCheckIn(e.target.checked)}
                    className="rounded text-brand focus:ring-brand/20"
                  />
                  <span>Mark checked-in immediately at desk</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoQueuePrint}
                    onChange={(e) => setAutoQueuePrint(e.target.checked)}
                    className="rounded text-brand focus:ring-brand/20"
                  />
                  <span>Queue badge for printing immediately</span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>
                    {submitting ? "Processing..." : "Complete Registration, Check In & Print Badge"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Desk Stats */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Desk Operations Guidelines
              </h3>
              <ul className="text-xs text-neutral-600 space-y-2 list-disc pl-4 leading-relaxed">
                <li>Walk-in credentials generate atomic anti-duplicate QR codes instantly.</li>
                <li>Cash collections automatically update the event cashier reconciliation ledger.</li>
                <li>VIP badges unlock designated zones (VIP Lounge, Backstage) on gate scanners.</li>
                <li>If an attendee claims pre-registration, use the Search tab before creating a walk-in duplicate.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ── ISOLATED PHYSICAL BADGE PRINT STAGE (Visible ONLY on print output) ── */}
      {printBadge && (
        <div id="badge-print-stage" className="hidden print:block">
          {(() => {
            const roleCfg = DEFAULT_ROLE_COLORS[printBadge.badgeType] || DEFAULT_ROLE_COLORS.attendee;
            return (
              <div
                className="badge-print-item bg-white relative overflow-hidden flex flex-col justify-between"
                style={{
                  width: "100mm",
                  height: "150mm",
                  boxSizing: "border-box",
                }}
              >
                {/* Lanyard punch slot */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-neutral-200 rounded-full border border-neutral-300 z-20" />

                {/* Role Header Banner */}
                <div
                  className="w-full text-center py-3.5 px-4"
                  style={{ backgroundColor: roleCfg.headerColor }}
                >
                  <p className="text-xs font-black tracking-widest text-white uppercase">
                    {roleCfg.label}
                  </p>
                </div>

                {/* Badge Main Body */}
                <div className="p-6 flex flex-col items-center justify-center text-center flex-1">
                  <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase mb-1">
                    DELEGATE CREDENTIAL
                  </span>
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                    {printBadge.name}
                  </h2>
                  {printBadge.company && (
                    <p className="text-sm font-semibold text-neutral-600 mt-1">
                      {printBadge.company}
                    </p>
                  )}
                  {printBadge.designation && (
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {printBadge.designation}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-1.5">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-white"
                      style={{ backgroundColor: roleCfg.accentColor }}
                    >
                      {printBadge.ticketName || roleCfg.label}
                    </span>
                  </div>

                  {/* Scannable QR Code */}
                  <div className="mt-4 p-2 bg-white rounded-xl border border-neutral-300 flex flex-col items-center">
                    <div className="w-24 h-24 bg-neutral-950 rounded-lg p-1.5 flex items-center justify-center">
                      <QrCode className="w-full h-full text-white" />
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 mt-1">
                      {printBadge.passToken}
                    </span>
                  </div>
                </div>

                {/* Event Footer */}
                <div className="py-2.5 px-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500 font-medium">
                  <span className="font-semibold text-neutral-700">Official Pass Credential</span>
                  <span className="font-mono">VALIDATED ENTRY</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
}
