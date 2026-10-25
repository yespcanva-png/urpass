import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Mail, ShieldCheck, Ticket, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Profile — UrPass Explore",
  description: "Your UrPass Explore account details.",
  robots: { index: false, follow: false },
};

export default async function ExploreProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/explore/login?next=%2Fexplore%2Fprofile");

  const name = typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
    ? user.user_metadata.full_name.trim()
    : typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : user.email?.split("@")[0] || "Explore attendee";
  const joined = user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : null;
  const initial = name.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-7 sm:px-8 sm:pt-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-violet-700">
            <ArrowLeft className="h-4 w-4" /> Explore events
          </Link>
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-extrabold text-violet-700">
            <Ticket className="h-5 w-5 -rotate-12" /> UrPass Explore
          </Link>
        </div>

        <div className="mt-12 sm:mt-16">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Your account</span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">My Profile</h1>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg">Your details and event passes in one place.</p>
        </div>

        <section className="mt-9 overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-[0_14px_45px_-30px_rgba(53,30,94,0.38)]">
          <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 px-6 py-8 sm:px-9">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-3xl font-extrabold text-white backdrop-blur-sm" aria-hidden="true">{initial}</div>
              <div className="min-w-0 text-white">
                <h2 className="truncate text-2xl font-extrabold sm:text-3xl">{name}</h2>
                <p className="mt-1 truncate text-sm text-white/80">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 divide-y divide-neutral-100 px-6 sm:px-9">
            <div className="flex items-center gap-4 py-5">
              <UserRound className="h-5 w-5 shrink-0 text-violet-600" />
              <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Name</p><p className="mt-1 truncate font-semibold">{name}</p></div>
            </div>
            <div className="flex items-center gap-4 py-5">
              <Mail className="h-5 w-5 shrink-0 text-violet-600" />
              <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Email</p><p className="mt-1 truncate font-semibold">{user.email}</p></div>
            </div>
            <div className="flex items-center gap-4 py-5">
              {user.email_confirmed_at ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600" />}
              <div><p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Email status</p><p className="mt-1 font-semibold">{user.email_confirmed_at ? "Verified" : "Verification pending"}</p></div>
            </div>
            {joined && <div className="flex items-center gap-4 py-5"><CalendarDays className="h-5 w-5 shrink-0 text-violet-600" /><div><p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Member since</p><p className="mt-1 font-semibold">{joined}</p></div></div>}
          </div>
        </section>

        <Link href="/explore/my-tickets" className="mt-6 flex min-h-24 items-center gap-4 rounded-[22px] border border-violet-100 bg-violet-50 px-6 py-5 transition-colors hover:bg-violet-100 sm:px-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700"><Ticket className="h-6 w-6" /></span>
          <span className="min-w-0 flex-1"><span className="block font-extrabold text-neutral-950">My Tickets</span><span className="mt-1 block text-sm text-neutral-600">View your bookings and QR passes</span></span>
          <ArrowRight className="h-5 w-5 shrink-0 text-violet-700" />
        </Link>
      </div>
    </main>
  );
}
