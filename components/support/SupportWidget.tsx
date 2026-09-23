"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Mail, X, Check, Copy, Paperclip, ArrowRight, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TOPICS = [
  "Account & Login",
  "Event Setup",
  "Registration & Tickets",
  "QR / Check-in",
  "Billing & Payments",
  "Technical Issue",
  "Feature Request",
  "Other",
];

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  data: string; // base64 data url
}

export default function SupportWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ email?: string; topic?: string; message?: string; attachment?: string }>({});

  // Submission & Success states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);

  // Drag-and-drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Prefill logged-in user email
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setEmail(user.email);
        }
      });
    } catch {
      // Ignored if unauthenticated or Supabase not ready
    }
  }, []);

  // Close when clicking outside (unless submitting)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isSubmitting) return;
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        const toggleBtn = document.getElementById("urpass-support-toggle");
        if (toggleBtn && toggleBtn.contains(e.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isSubmitting]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting]);

  // Format file size
  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Handle file processing
  function processFile(file: File) {
    setErrors((prev) => ({ ...prev, attachment: undefined }));

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    const validExts = [".png", ".jpg", ".jpeg", ".pdf"];
    const nameLower = file.name.toLowerCase();
    const hasValidExt = validExts.some((ext) => nameLower.endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setErrors((prev) => ({ ...prev, attachment: "Supported formats: PDF, PNG, JPG only." }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, attachment: "File exceeds 10MB limit." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAttachment({
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          data: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }

  // Form validation
  function validate() {
    const nextErrors: { email?: string; topic?: string; message?: string } = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!topic) {
      nextErrors.topic = "Please select what you need help with.";
    }

    if (!message.trim()) {
      nextErrors.message = "Please enter your message.";
    } else if (message.trim().length < 5) {
      nextErrors.message = "Message must be at least 5 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          topic,
          message: message.trim(),
          attachment: attachment ? { name: attachment.name, size: attachment.size, type: attachment.type, data: attachment.data } : null,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setTicketId(data.ticketId || "SUP-1042");
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrors((prev) => ({ ...prev, message: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Copy ticket ID
  function handleCopy() {
    if (!ticketId) return;
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Reset form
  function handleReset() {
    setIsSuccess(false);
    setTicketId("");
    setTopic("");
    setMessage("");
    setAttachment(null);
    setErrors({});
  }

  // Close and reset if completed
  function handleClose() {
    if (isSubmitting) return;
    setIsOpen(false);
    if (isSuccess) {
      handleReset();
    }
  }

  // Determine if on dashboard / billing mobile route to elevate button above bottom navigation bar
  const isDashboardRoute =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/billing") ||
    pathname?.startsWith("/event/");

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-[2px] z-40 sm:hidden transition-opacity duration-200"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUPPORT POPUP (Desktop Floating Card + Mobile Bottom Sheet)
          ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={popupRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-popup-title"
          className={`
            fixed z-50 bg-white flex flex-col overflow-hidden
            /* Mobile bottom sheet */
            max-sm:inset-x-0 max-sm:bottom-0 max-sm:w-full max-sm:rounded-t-[24px] max-sm:max-h-[88vh] max-sm:border-t max-sm:border-neutral-200 max-sm:shadow-2xl
            /* Desktop right-side floating chat panel */
            sm:left-auto sm:right-6 sm:bottom-24 sm:w-[400px] sm:max-h-[min(680px,calc(100vh-120px))] sm:rounded-2xl sm:border sm:border-neutral-200 sm:shadow-2xl sm:shadow-neutral-900/15
            animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-2 duration-200
          `}
        >
          {/* Mobile Drag Handle */}
          <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
            <div className="w-10 h-1 rounded-full bg-neutral-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center">
                <Mail className="w-3.5 h-3.5 text-neutral-800" />
              </div>
              <span className="text-xs font-bold tracking-tight text-neutral-900 uppercase">Support</span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50"
              aria-label="Close support popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain">
            {isSuccess ? (
              /* ── Success State ────────────────────────────────────────── */
              <div className="py-6 flex flex-col items-center text-center animate-in fade-in duration-200">
                <div className="w-13 h-13 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>

                <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-1">
                  Message sent!
                </h3>
                <p className="text-xs text-neutral-500 max-w-[280px] leading-relaxed mb-6">
                  We&apos;ve received your request and our team will get back to you by email.
                </p>

                {/* Ticket ID Box */}
                <div className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 mb-6 flex items-center justify-between">
                  <div className="text-left">
                    <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Ticket ID
                    </span>
                    <span className="font-mono text-sm font-bold text-neutral-900">
                      {ticketId}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Got It CTA */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Got it
                </button>

                {/* Secondary Action */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors underline underline-offset-4"
                >
                  Need to send another message?
                </button>
              </div>
            ) : (
              /* ── Form State ───────────────────────────────────────────── */
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Titles */}
                <div>
                  <h3 id="support-popup-title" className="text-lg font-bold text-neutral-900 tracking-tight">
                    How can we help?
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Send us a message and our team will get back to you by email.
                  </p>
                </div>

                {/* Your email */}
                <div>
                  <label htmlFor="support-email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Your email
                  </label>
                  <input
                    id="support-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="you@company.com"
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-xs rounded-xl border bg-neutral-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-medium text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* What do you need help with? */}
                <div>
                  <label htmlFor="support-topic" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    What do you need help with?
                  </label>
                  <div className="relative">
                    <select
                      id="support-topic"
                      value={topic}
                      onChange={(e) => {
                        setTopic(e.target.value);
                        if (errors.topic) setErrors((prev) => ({ ...prev, topic: undefined }));
                      }}
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2 text-xs rounded-xl border bg-neutral-50/50 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer ${
                        errors.topic
                          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                      } ${!topic ? "text-neutral-400" : "text-neutral-900"}`}
                    >
                      <option value="" disabled>
                        Select an option...
                      </option>
                      {TOPICS.map((t) => (
                        <option key={t} value={t} className="text-neutral-900">
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {errors.topic && (
                    <p className="text-[11px] font-medium text-red-500 mt-1">
                      {errors.topic}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="support-message" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="support-message"
                    rows={3}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    placeholder="Tell us what's happening..."
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 text-xs rounded-xl border bg-neutral-50/50 focus:bg-white focus:outline-none transition-all resize-none ${
                      errors.message
                        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] font-medium text-red-500 mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Attachment (drag / drop or file upload) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Attachment <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>

                  {attachment ? (
                    <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-neutral-200/70 flex items-center justify-center shrink-0">
                          {attachment.type.startsWith("image/") ? (
                            <ImageIcon className="w-3.5 h-3.5 text-neutral-600" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-neutral-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-neutral-800 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {formatSize(attachment.size)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        disabled={isSubmitting}
                        className="text-neutral-400 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Remove attachment"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer border border-dashed rounded-xl p-3 text-center transition-all ${
                        isDragging
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-1.5 text-neutral-600 mb-0.5">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold text-neutral-800">
                          Add screenshot or file
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        PDF, PNG, JPG — up to 10MB
                      </p>
                    </div>
                  )}

                  {errors.attachment && (
                    <p className="text-[11px] font-medium text-red-500 mt-1">
                      {errors.attachment}
                    </p>
                  )}
                </div>

                {/* Primary CTA Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send to Support</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center mt-2.5 flex items-center justify-center gap-1">
                    <span>◷</span>
                    <span>Usually replies within 1 business day</span>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FLOATING SUPPORT BUTTON (Bottom-Right Corner of Every Page)
          ───────────────────────────────────────────────────────────── */}
      <div
        className={`fixed z-50 transition-all duration-200 ${
          isDashboardRoute
            ? "right-5 bottom-20 lg:bottom-6 lg:right-6"
            : "right-5 bottom-5 sm:right-6 sm:bottom-6"
        }`}
      >
        {/* Tooltip on hover */}
        <div
          className={`
            pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap
            bg-neutral-900 text-white text-xs font-medium px-3 py-1.5 rounded-xl shadow-lg
            transition-all duration-150 origin-right
            ${tooltipVisible && !isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
        >
          Need help? Send us a message
          {/* Tooltip arrow */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-neutral-900" />
        </div>

        {/* Circular Floating Button */}
        <button
          id="urpass-support-toggle"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          aria-label={isOpen ? "Close support" : "Open support"}
          className={`
            w-[54px] h-[54px] rounded-full
            bg-neutral-900 text-white
            shadow-lg shadow-black/25 hover:shadow-xl
            flex items-center justify-center
            hover:scale-105 active:scale-95
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900
          `}
        >
          {isOpen ? (
            <X className="w-5 h-5 transition-transform duration-200" />
          ) : (
            <Mail className="w-5 h-5 transition-transform duration-200" />
          )}
        </button>
      </div>
    </>
  );
}
