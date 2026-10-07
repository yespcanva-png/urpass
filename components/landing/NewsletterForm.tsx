"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      } else {
        setStatus("success");
        setMessage(data.message || "You're subscribed! Check your inbox.");
        setEmail("");
        setName("");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-2.5 text-emerald-300 text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter your email"
            required
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            disabled={status === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer shadow-sm hover:shadow-brand/20"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="text-[11px] text-red-400 font-medium px-1">{message}</p>
      )}
      <p className="text-[10px] text-neutral-500 px-1">
        Stay informed on product updates, ticketing innovations &amp; zero spam.
      </p>
    </form>
  );
}
