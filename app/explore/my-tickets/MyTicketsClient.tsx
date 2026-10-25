"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, Download, MapPin, Share2, Ticket, TicketCheck, UserRound } from "lucide-react";
import type { ExploreTicket } from "@/lib/explore/my-tickets";
import { createClient } from "@/lib/supabase/client";

type Tab = ExploreTicket["status"];
const tabs: { key: Tab; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

function formatEventDate(date: string, time: string) {
  const day = new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const [hours, minutes] = time.split(":").map(Number);
  const timeLabel = new Date(2020, 0, 1, hours || 0, minutes || 0).toLocaleTimeString("en-IN", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
  return `${day} · ${timeLabel}`;
}

export default function MyTicketsClient({ tickets, email, needsVerification }: {
  tickets: ExploreTicket[];
  email: string;
  needsVerification: boolean;
}) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const visible = tickets.filter((ticket) => ticket.status === tab);

  async function resendVerification() {
    if (!email || sending) return;
    setSending(true);
    const { error } = await createClient().auth.resend({ type: "signup", email });
    setMessage(error ? error.message : "Verification email sent. Open the link, then refresh this page.");
    setSending(false);
  }

  async function sharePass(token: string) {
    const url = `${window.location.origin}/pass/${encodeURIComponent(token)}`;
    if (navigator.share) {
      try { await navigator.share({ title: "UrPass ticket", url }); } catch { /* Share dismissed. */ }
    } else {
      await navigator.clipboard.writeText(url);
      setMessage("Ticket link copied.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-7 sm:px-8 sm:pt-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-violet-700">
            <ArrowLeft className="h-4 w-4" /> Explore events
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-extrabold text-violet-700">
              <Ticket className="h-5 w-5 -rotate-12" /> <span className="hidden sm:inline">UrPass Explore</span>
            </Link>
            <Link href="/explore/profile" aria-label="View my profile" title="My Profile" className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
              <UserRound className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Your event collection</span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">My Tickets</h1>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg">Your events, all in one place.</p>
        </div>

        {needsVerification && (
          <div className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-5 text-sm text-violet-950">
            <p className="font-bold">Verify your email to see your tickets</p>
            <p className="mt-1 text-violet-800">We can securely link tickets and guest bookings for {email} after verification.</p>
            <button type="button" disabled={sending} onClick={resendVerification} className="mt-3 font-bold text-violet-700 underline underline-offset-2 disabled:opacity-50">
              {sending ? "Sending…" : "Resend verification email"}
            </button>
          </div>
        )}

        {message && <p role="status" className="mt-4 text-sm font-medium text-violet-700">{message}</p>}

        <div className="mt-9 flex gap-1 border-b border-neutral-200" role="tablist" aria-label="Ticket status">
          {tabs.map(({ key, label }) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
              className={`min-h-12 px-4 text-sm font-bold transition-colors sm:px-6 ${tab === key ? "border-b-2 border-violet-600 text-violet-700" : "text-neutral-500 hover:text-neutral-800"}`}>
              {label}<span className="ml-2 text-xs opacity-60">{tickets.filter((ticket) => ticket.status === key).length}</span>
            </button>
          ))}
        </div>

        {visible.length ? (
          <div className="mt-8 grid gap-6">
            {visible.map((ticket) => (
              <article key={ticket.id} className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-[0_14px_45px_-30px_rgba(53,30,94,0.38)] sm:grid sm:grid-cols-[minmax(240px,38%)_1fr]">
                <div className="relative min-h-52 bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-400 sm:min-h-80">
                  {ticket.image ? <Image src={ticket.image} alt="" fill unoptimized sizes="(max-width: 640px) 100vw, 38vw" className="object-cover" /> : <Ticket className="absolute bottom-7 left-7 h-12 w-12 text-white/70" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-violet-800 shadow-sm">UrPass ticket</span>
                </div>
                <div className="flex flex-col p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-violet-700">{formatEventDate(ticket.date, ticket.startTime)}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${ticket.status === "cancelled" ? "bg-rose-50 text-rose-700" : ticket.status === "past" ? "bg-neutral-100 text-neutral-600" : "bg-emerald-50 text-emerald-700"}`}>{ticket.statusLabel}</span>
                  </div>
                  <h2 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">{ticket.name}</h2>
                  <p className="mt-3 flex items-start gap-2 text-sm text-neutral-500"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{ticket.venue}</p>
                  <div className="mt-6 border-t border-neutral-100 pt-5 sm:mt-auto">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Tickets</p>
                    <p className="mt-1 text-sm font-semibold text-neutral-800">{ticket.ticketLabel}</p>
                    {ticket.refundStatus && ticket.refundStatus !== "none" && <p className="mt-2 text-xs font-medium text-rose-700">Refund: {ticket.refundStatus.replaceAll("_", " ")}</p>}
                    {ticket.passes.length > 0 && ticket.status !== "cancelled" && (
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link href={`/pass/${encodeURIComponent(ticket.passes[0].token)}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet-700 px-6 text-sm font-bold text-white hover:bg-violet-800">
                          View Tickets <ArrowRight className="h-4 w-4" />
                        </Link>
                        {ticket.canShare && <button type="button" onClick={() => sharePass(ticket.passes[0].token)} className="inline-flex min-h-12 items-center gap-2 rounded-full px-3 text-sm font-semibold text-neutral-600 hover:text-violet-700"><Share2 className="h-4 w-4" /> Share</button>}
                        <a href={`/api/pass/image/${encodeURIComponent(ticket.passes[0].token)}`} download className="inline-flex min-h-12 items-center gap-2 rounded-full px-3 text-sm font-semibold text-neutral-600 hover:text-violet-700"><Download className="h-4 w-4" /> Download</a>
                      </div>
                    )}
                    {ticket.passes.length > 1 && ticket.status !== "cancelled" && (
                      <details className="mt-5 rounded-xl bg-neutral-50 p-4 text-sm">
                        <summary className="cursor-pointer font-bold text-violet-700">All {ticket.passes.length} passes</summary>
                        <ul className="mt-3 space-y-3">
                          {ticket.passes.map((pass, index) => <li key={pass.token} className="flex items-center justify-between gap-3"><span className="truncate">{index + 1}. {pass.name}</span><Link className="shrink-0 font-bold text-violet-700" href={`/pass/${encodeURIComponent(pass.token)}`}>View QR</Link></li>)}
                        </ul>
                      </details>
                    )}
                    {ticket.passes.length === 0 && ticket.status !== "cancelled" && <p className="mt-4 text-sm text-neutral-500">Your QR pass is being prepared. Check back shortly.</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex min-h-72 flex-col items-center justify-center rounded-[26px] border border-dashed border-neutral-200 bg-neutral-50/60 px-5 text-center">
            <div className="rounded-2xl bg-violet-100 p-4 text-violet-700">{tab === "upcoming" ? <TicketCheck className="h-7 w-7" /> : <CalendarDays className="h-7 w-7" />}</div>
            <h2 className="mt-5 text-lg font-bold">{tab === "upcoming" ? "No upcoming tickets yet" : tab === "past" ? "No past events yet" : "No cancelled bookings"}</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">{tab === "upcoming" ? "Your confirmed bookings will appear here automatically." : tab === "past" ? "Your completed events will appear here." : "Cancelled bookings and refund status will appear here."}</p>
            {tab === "upcoming" && <Link href="/explore" className="mt-6 text-sm font-bold text-violet-700 hover:underline">Explore events →</Link>}
          </div>
        )}
      </div>
    </main>
  );
}
