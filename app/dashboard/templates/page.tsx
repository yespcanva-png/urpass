import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { parseUnlockedCookie } from "@/lib/studio/purchases";
import TicketTemplateList from "@/components/templates/TicketTemplateList";
import {
  Sparkles,
  Ticket,
  Plus,
  Palette,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ticket & Pass Templates | URPASS Organizer Dashboard",
  description:
    "Browse, preview, and customize production-ready event ticket and pass designs. 6 Free templates and premium designs from ₹49.",
};

export default async function DashboardTemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?returnTo=/dashboard/templates");
  }

  // Fetch organizer plan
  const plan = await getUserPlan(supabase, user.id);
  const isPro = ["pro", "business", "campus", "founder", "lifetime", "founder_lifetime"].includes(
    plan.slug
  );

  // Fetch unlocked templates from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("unlocked_templates")
    .eq("user_id", user.id)
    .maybeSingle();

  const cookieStore = await cookies();
  const cookieVal = cookieStore.get("urpass_unlocked_templates")?.value;
  const cookieUnlocked = parseUnlockedCookie(cookieVal);

  const profileUnlocked: string[] = Array.isArray(profile?.unlocked_templates)
    ? profile.unlocked_templates
    : [];

  const combinedUnlocked = Array.from(new Set([...profileUnlocked, ...cookieUnlocked]));

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Palette className="w-3.5 h-3.5 text-violet-600" />
            ORGANIZER TICKET CATALOG
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
            Ticket & Pass Templates
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl">
            Choose from 12 engineered designs across digital mobile passes, conference lanyard badges, and printable perforated stubs. Sub-0.3s camera gate scanning ready.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs"
          >
            <Ticket className="w-4 h-4 text-violet-400" />
            <span>Open Ticket Studio</span>
          </Link>
          <Link
            href="/create-event"
            className="py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </Link>
        </div>
      </div>

      {/* Plan Status Notice for Pro / Free */}
      {isPro ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                PRO ORGANIZER PRIVILEGE ACTIVE ({plan.slug.toUpperCase()})
              </p>
              <p className="text-xs text-emerald-700">
                All 12 premium ticket templates are automatically unlocked with unlimited event issuance.
              </p>
            </div>
          </div>
          <Link
            href="/studio"
            className="shrink-0 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
          >
            Launch Studio &rarr;
          </Link>
        </div>
      ) : null}

      {/* Interactive Catalog Component */}
      <TicketTemplateList
        initialUnlocked={combinedUnlocked}
        isPro={isPro}
        userEmail={user.email}
        isInApp={true}
      />
    </div>
  );
}
