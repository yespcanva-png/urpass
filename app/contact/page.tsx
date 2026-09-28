"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  Mail,
  User,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  Tag,
} from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import { InstagramIcon, YoutubeIcon, SOCIAL_LINKS } from "@/components/landing/SocialIcons";

const inputCls =
  "border border-neutral-200/90 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-white placeholder:text-neutral-400 w-full";

const TOPIC_TEMPLATES: Record<string, string> = {
  "Book a Demo":
    "Hello, I'd like to schedule a walk-through demo of URPASS to explore digital pass generation and live QR check-in for our upcoming events.",
  "Campus Starter Plan":
    "Hello, our college/institution is interested in the Campus Starter Plan for our student societies and departments. We would like to inquire about onboarding and licensing.",
  "University Enterprise Plan":
    "Hello, we are interested in volume pricing, dedicated scanner lanes, and enterprise integrations (SSO/custom domain) for our multi-campus institution.",
  "Pricing & Plans":
    "Hello, I have a question regarding URPASS subscription tiers and single event passes.",
  "General Support":
    "Hello, I need assistance with my URPASS account.",
};

function ContactFormInner() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill message if subject matches a template and message is empty
  useEffect(() => {
    if (initialSubject && !message && TOPIC_TEMPLATES[initialSubject]) {
      setSubject(initialSubject);
      setMessage(TOPIC_TEMPLATES[initialSubject]);
    } else if (initialSubject && !subject) {
      setSubject(initialSubject);
    }
  }, [initialSubject, message, subject]);

  function handleSelectTopic(selectedTopic: string) {
    setSubject(selectedTopic);
    if (!message || Object.values(TOPIC_TEMPLATES).includes(message)) {
      setMessage(TOPIC_TEMPLATES[selectedTopic] ?? "");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send message");
      setDone(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <AnimateIn from="scale" className="max-w-md w-full bg-white border border-neutral-200/80 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">
            Inquiry Dispatched
          </p>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 mb-2">
            Message received!
          </h1>
          <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
            Thank you, <span className="font-semibold text-neutral-800">{name}</span>. Our team will review your inquiry{" "}
            {subject ? <span className="font-semibold text-neutral-800">({subject})</span> : null}{" "}
            and respond directly to <span className="font-semibold text-neutral-800">{email}</span> within 24 business hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Back to Home
            </Link>
            <Link
              href="/billing"
              className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              View Billing &amp; Plans
            </Link>
          </div>
        </AnimateIn>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left info panel */}
      <AnimateIn from="left" delay={80} className="lg:col-span-2 flex flex-col gap-4">
        {/* Topic suggestion pills */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
            Quick Inquiry Topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(TOPIC_TEMPLATES).map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleSelectTopic(topic)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all text-left ${
                  subject === topic
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs font-semibold"
                    : "bg-neutral-50 text-neutral-700 border-neutral-200/80 hover:bg-neutral-100"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Operating info */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200/60 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 mb-0.5">Response Time</p>
              <p className="text-xs text-neutral-500">Within 24 business hours</p>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200/60 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 mb-0.5">Direct Email</p>
              <a
                href="mailto:srinithin@yespstudio.com"
                className="text-xs text-neutral-700 hover:text-neutral-900 underline"
              >
                srinithin@yespstudio.com
              </a>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200/60 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 mb-0.5">Headquarters</p>
              <p className="text-xs text-neutral-500">YESP Corporation · Tamil Nadu, India 🇮🇳</p>
            </div>
          </div>
        </div>

        {/* Social channels */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Official Channels
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-xl border border-neutral-200/60 hover:border-pink-200 hover:bg-pink-50/40 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-800">Instagram</p>
                  <p className="text-[10px] text-neutral-400">@urpass.space</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 group-hover:text-pink-600 transition-colors">→</span>
            </a>

            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-xl border border-neutral-200/60 hover:border-red-200 hover:bg-red-50/40 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-800">YouTube</p>
                  <p className="text-[10px] text-neutral-400">@URPASS Official</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 group-hover:text-red-600 transition-colors">→</span>
            </a>
          </div>
        </div>

        {/* Documentation link */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white shadow-xs">
          <p className="text-xs font-bold tracking-tight text-white mb-1">Looking for technical guides?</p>
          <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
            API endpoints, hardware scanner pair guide, webhooks, and FAQ are published in documentation.
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white transition-colors px-3 py-1.5 rounded-lg shadow-2xs"
          >
            <span>View docs</span>
            <span>→</span>
          </Link>
        </div>
      </AnimateIn>

      {/* Right form */}
      <AnimateIn from="right" delay={160} className="lg:col-span-3">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-7 flex flex-col gap-4 shadow-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                Direct Contact
              </p>
              <h2 className="text-base font-semibold text-neutral-900 mt-0.5">
                Send a message
              </h2>
            </div>
            {subject && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-neutral-100 text-neutral-700 border border-neutral-200/80">
                <Tag className="w-3 h-3 text-neutral-500" />
                <span>{subject}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Organizer or Lead Name"
                  className={`${inputCls} pl-9`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700">Work Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@organization.com"
                  className={`${inputCls} pl-9`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">Topic / Subject</label>
            <input
              type="text"
              placeholder="e.g. Book a Demo, Campus Starter Plan, Technical Inquiry"
              className={inputCls}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">Message *</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
              <textarea
                rows={5}
                placeholder="Describe your event requirements, expected attendees, or inquiry…"
                className={`${inputCls} pl-9 resize-none`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Sending inquiry..." : "Submit message"}
            </button>
            <p className="text-[10px] text-center text-neutral-400 mt-2 font-medium">
              Encrypted transmission · Response within 24 business hours
            </p>
          </div>
        </form>
      </AnimateIn>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50/70 page-in">
      <div className="max-w-5xl mx-auto px-5 py-12">
        <AnimateIn from="up" delay={0}>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>

          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1.5">
            Support &amp; Inquiries
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
            Contact &amp; Demos
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mb-10 max-w-xl">
            Book a personalized product demo, inquire about campus licensing, or speak directly with our team.
          </p>
        </AnimateIn>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20 text-neutral-400 text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading contact form...</span>
            </div>
          }
        >
          <ContactFormInner />
        </Suspense>
      </div>
    </div>
  );
}
