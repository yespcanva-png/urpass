"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Sparkles,
  Clock,
  CheckCircle2,
  Phone,
  Ticket,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Loader2,
  FileText,
  Gift,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isFirstTime?: boolean;
  defaultEventName?: string;
  userEmail?: string;
  userName?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function ConciergeSetupModal({
  isOpen,
  onClose,
  isFirstTime = false,
  defaultEventName = "",
  userEmail = "",
  userName = "",
}: Props) {
  const [eventName, setEventName] = useState(defaultEventName);
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [attendeeCount, setAttendeeCount] = useState("100-500");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSuccess(false);
      setError("");
      if (defaultEventName) setEventName(defaultEventName);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, defaultEventName]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!eventName.trim()) {
      setError("Please enter your event name.");
      return;
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 8) {
      setError("Please provide a valid WhatsApp phone number so our team can coordinate.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/concierge/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: eventName.trim(),
          eventDate: eventDate.trim(),
          city: city.trim(),
          attendeeCount,
          organizerName: userName,
          organizerEmail: userEmail,
          whatsappNumber: whatsapp.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      // If free first-time setup: completed immediately!
      if (data.isFree) {
        setSuccess(true);
        setLoading(false);
        return;
      }

      // If paid VIP setup: open Razorpay checkout
      const rzpLoaded = await loadRazorpay();
      if (!rzpLoaded) {
        throw new Error("Unable to load payment gateway. Please check your internet connection.");
      }

      const options = {
        key: data.keyId,
        amount: data.amountPaise,
        currency: "INR",
        name: "UrPass",
        description: `24-Hour VIP Event Setup: ${eventName.slice(0, 30)}`,
        order_id: data.orderId,
        prefill: {
          name: userName || "Organizer",
          email: userEmail || "",
          contact: whatsapp.replace(/[^0-9]/g, ""),
        },
        theme: { color: "#6D28D9" },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await fetch("/api/concierge/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccess(true);
            } else {
              setError(verifyData.error || "Payment received, but verification encountered an issue. Our team will contact you shortly.");
            }
          } catch {
            setSuccess(true);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="relative bg-gradient-to-r from-purple-700 via-indigo-600 to-brand p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            {isFirstTime ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-neutral-950 tracking-wide uppercase">
                <Gift className="w-3 h-3" /> Free for 1st-Time Organizers
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-xs tracking-wide uppercase">
                <Clock className="w-3 h-3" /> 24-Hour VIP Concierge
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isFirstTime ? "Done-For-You Event Setup — FREE" : "VIP Done-For-You Event Setup"}
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 leading-relaxed">
            {isFirstTime
              ? "Never run an event on UrPass? We'll configure your entire registration page, branded passes, and QR gates in 24 hours at zero cost."
              : "Skip the configuration. Our event engineers will build your registration form, customize your ticket design, and test gate scanners in under 24 hours."}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Request Confirmed!
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto leading-relaxed">
                Our event technical lead will message your WhatsApp (<strong>{whatsapp}</strong>) within 2–4 hours with your drafted registration page and pass designs.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 leading-relaxed">
                  {error}
                </div>
              )}

              {/* What you get bullets */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom branded tickets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom registration forms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Gate scanner staff logins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>24-Hour WhatsApp support</span>
                </div>
              </div>

              {/* Event Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-brand" /> Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore AI Summit 2026 / College Cultural Fest"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm outline-none focus:border-brand transition-colors text-neutral-900 dark:text-white"
                />
              </div>

              {/* Date & City in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand" /> Date (or tentative)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Nov 2026"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm outline-none focus:border-brand transition-colors text-neutral-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand" /> City / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru / Online"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm outline-none focus:border-brand transition-colors text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Attendee Count */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-brand" /> Expected Attendees
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["<100", "100-500", "500-1500", "1500+"].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setAttendeeCount(tier)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        attendeeCount === tier
                          ? "bg-brand text-white border-brand shadow-xs"
                          : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm outline-none focus:border-brand transition-colors text-neutral-900 dark:text-white"
                />
                <p className="text-[10px] text-neutral-400">
                  Our coordinator will WhatsApp you directly to collect your logo, poster, and schedule.
                </p>
              </div>

              {/* Notes or link */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand" /> Poster Link / Ticket Types / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Paste Google Drive link to your poster/agenda, or list ticket tiers (e.g. VIP ₹499, Student Free)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs outline-none focus:border-brand transition-colors text-neutral-900 dark:text-white"
                />
              </div>

              {/* Pricing breakdown & Submit button */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-neutral-500">Service Fee:</span>
                  {isFirstTime ? (
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-neutral-400">₹999</span>
                      <span className="font-bold text-emerald-600 text-sm">₹0 (Free)</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="font-bold text-neutral-900 dark:text-white text-sm">₹999</span>
                      <span className="text-[10px] text-neutral-400 block">+ 18% GST (₹1,179 total)</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-brand hover:opacity-95 transition-opacity shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isFirstTime ? "Submitting..." : "Opening Payment..."}</span>
                    </>
                  ) : isFirstTime ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Claim Free 24h Event Setup</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Proceed to Payment (₹999)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}

