"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Phone,
  User,
  Sparkles,
  CheckCircle2,
  Loader2,
  Ticket,
  Tag,
  ArrowRight,
} from "lucide-react";

export function openRequestEventSetupModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-request-event-setup"));
  }
}

interface RequestEventSetupButtonProps {
  className?: string;
  variant?: "hero" | "nav" | "compact" | "outline";
  children?: React.ReactNode;
}

export function RequestEventSetupButton({
  className = "",
  variant = "hero",
  children,
}: RequestEventSetupButtonProps) {
  const baseClasses = (() => {
    switch (variant) {
      case "nav":
        return "text-sm font-semibold text-violet-700 hover:text-violet-900 bg-violet-50 hover:bg-violet-100/80 border border-violet-200/90 px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs";
      case "compact":
        return "text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs";
      case "outline":
        return "text-sm font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 px-5 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-2xs";
      case "hero":
      default:
        return "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all text-center shadow-xs group";
    }
  })();

  return (
    <button
      type="button"
      onClick={openRequestEventSetupModal}
      className={`${baseClasses} ${className}`}
    >
      {children || (
        <>
          <Sparkles className="w-4 h-4 text-violet-200" />
          <span>Request Event Setup</span>
        </>
      )}
    </button>
  );
}

export default function RequestEventSetupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setErrorMsg("");
    };

    window.addEventListener("open-request-event-setup", handleOpen);
    return () => window.removeEventListener("open-request-event-setup", handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Reset after transition finishes
    setTimeout(() => {
      setIsSuccess(false);
      setErrorMsg("");
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }
    if (!eventName.trim()) {
      setErrorMsg("Please enter the name of your event.");
      return;
    }
    if (!eventDate.trim()) {
      setErrorMsg("Please provide the tentative event date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/request-event-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          eventName: eventName.trim(),
          eventDate: eventDate.trim(),
          eventType: eventType.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit setup request.");
      }

      setIsSuccess(true);
      // Clear fields
      setName("");
      setPhoneNumber("");
      setEventName("");
      setEventDate("");
      setEventType("");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden z-10 transition-all my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-neutral-950 px-6 sm:px-8 py-5 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300">
                Managed Services
              </p>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                UrPass — Request Event Setup
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors border border-neutral-800"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-in zoom-in duration-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-neutral-950 tracking-tight">
                  Request Received!
                </h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you for your request! Our team will contact you shortly to discuss your event setup.
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Provide your event details below. The UrPass technical team will reach out directly to configure your registration forms, ticketing, passes, and gate scanners.
              </p>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 leading-relaxed font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Sharma / Dr. Kavitha"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-neutral-200/90 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all text-neutral-900"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-neutral-200/90 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all text-neutral-900"
                  />
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Event Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Ticket className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. National AI Hackathon 2026"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-neutral-200/90 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all text-neutral-900"
                  />
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Event Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-neutral-200/90 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all text-neutral-900"
                  />
                </div>
              </div>

              {/* Event Type (optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between">
                  <span>Event Type</span>
                  <span className="text-[11px] text-neutral-400 lowercase font-normal">optional</span>
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-neutral-200/90 bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all text-neutral-900 cursor-pointer"
                  >
                    <option value="">Select event category (optional)</option>
                    <option value="College Fest / Campus Event">College Fest / Campus Event</option>
                    <option value="Tech Conference / Summit">Tech Conference / Summit</option>
                    <option value="Hackathon">Hackathon (24h - 36h)</option>
                    <option value="Workshop / Hands-on Lab">Workshop / Hands-on Lab</option>
                    <option value="Corporate Seminar / Executive Forum">Corporate Seminar / Executive Forum</option>
                    <option value="Community Meetup / Networking">Community Meetup / Networking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Event Setup</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-neutral-400 mt-2.5">
                  Direct dispatch to UrPass Operations · Confidential &amp; SLA protected
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
