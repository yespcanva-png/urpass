"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowRight, Sparkles, X, CheckCircle2, PhoneCall } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PersonalConciergeBannerProps {
  userEmail?: string | null;
  userId?: string | null;
}

const TARGET_EMAILS = new Set([
  "isha28368@gmail.com",
  "srinithinsomasundaram@gmail.com",
  "srinithinsomasiundaram@gmail.com",
  "srinithinoffl@gmail.com",
  "srinithin.260011193@jainuniversity.ac.in",
]);
const TARGET_USER_IDS = new Set(["5c518adc-8e2a-4045-b22a-822b69dc8a43"]);
const WHATSAPP_NUMBER = "9001270298";
const WHATSAPP_LINK = "https://wa.me/919001270298?text=" + encodeURIComponent("Hi, I need help setting up UrPass for Pilani Garba Night Season 2");

export default function PersonalConciergeBanner({
  userEmail: propEmail,
  userId: propUserId,
}: PersonalConciergeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkTargetUser() {
      // 1. Check passed props
      if (
        (propEmail && TARGET_EMAILS.has(propEmail.trim().toLowerCase())) ||
        (propUserId && TARGET_USER_IDS.has(propUserId.trim()))
      ) {
        setIsVisible(true);
        return;
      }

      // 2. Check active client session
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (
          user &&
          (TARGET_EMAILS.has((user.email || "").trim().toLowerCase()) ||
            TARGET_USER_IDS.has(user.id))
        ) {
          setIsVisible(true);
        }
      } catch {
        // fail-safe: never show to unauthorized
      }
    }

    checkTargetUser();
  }, [propEmail, propUserId]);

  if (!isVisible || dismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-5 sm:p-6 border border-emerald-500/40 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Background Decorative Glow */}
      <div
        className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none opacity-25"
        style={{
          background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-bold text-emerald-300 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              1-on-1 Setup Assistance
            </span>
            <span className="text-[11px] text-emerald-200/80 font-medium">
              Pilani Garba Night Season 2
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Hi Isha! We can help you set up UrPass for your event.</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
              Our team is ready to assist you directly with ticketing, custom branded QR passes, WhatsApp delivery, and gate check-in scanners. Connect with us on WhatsApp for free instant setup!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free full event onboarding</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct line: +91 {WHATSAPP_NUMBER}</span>
            </div>
          </div>
        </div>

        {/* Action Button & Dismiss */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-neutral-950 text-emerald-500" />
            <span>Chat on WhatsApp (+91 {WHATSAPP_NUMBER})</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss banner"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
