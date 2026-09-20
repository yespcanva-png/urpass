import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { getEventTicketTypes } from "@/app/actions/ticket-types";
import {
  Plus,
  Pencil,
  Ticket,
  Crown,
  GraduationCap,
  Clock,
  Layers,
  Shield,
  Mic,
  Tag,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

type TicketCategory =
  | "general"
  | "vip"
  | "student"
  | "early_bird"
  | "workshop"
  | "staff"
  | "speaker"
  | "custom";

const CATEGORY_CONFIG: Record<
  TicketCategory,
  { label: string; cls: string; Icon: React.ElementType }
> = {
  general:    { label: "General",     cls: "bg-neutral-100 text-neutral-600",   Icon: Ticket },
  vip:        { label: "VIP",         cls: "bg-amber-100 text-amber-700",       Icon: Crown },
  student:    { label: "Student",     cls: "bg-blue-100 text-blue-700",         Icon: GraduationCap },
  early_bird: { label: "Early Bird",  cls: "bg-green-100 text-green-700",       Icon: Clock },
  workshop:   { label: "Workshop",    cls: "bg-purple-100 text-purple-700",     Icon: Layers },
  staff:      { label: "Staff",       cls: "bg-slate-100 text-slate-700",       Icon: Shield },
  speaker:    { label: "Speaker",     cls: "bg-rose-100 text-rose-700",         Icon: Mic },
  custom:     { label: "Custom",      cls: "bg-neutral-100 text-neutral-600",   Icon: Tag },
};

const STATUS_CONFIG = {
  draft:    { label: "Draft",    cls: "bg-neutral-100 text-neutral-500" },
  on_sale:  { label: "On Sale",  cls: "bg-green-50 text-green-700" },
  closed:   { label: "Closed",   cls: "bg-red-50 text-red-600" },
  sold_out: { label: "Sold Out", cls: "bg-amber-50 text-amber-700" },
};

function formatPrice(paise: number) {
  if (paise === 0) return "Free";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: event }, plan, ticketTypes] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, organizer_id, organization_id")
      .eq("id", eventId)
      .single(),
    getUserPlan(supabase, user.id),
    getEventTicketTypes(eventId),
  ]);

  if (!event) notFound();
  if (event.organizer_id !== user.id) {
    if (!event.organization_id) notFound();
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", event.organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin"])
      .maybeSingle();
    if (!member) notFound();
  }

  const isFree = plan.slug === "free";
  const maxTicketTypes = isFree ? 1 : Infinity;
  const canAddMore = ticketTypes.length < maxTicketTypes;

  // Summary stats
  const totalSold = ticketTypes.reduce((sum, t) => sum + t.sold_count, 0);
  const totalRevenue = ticketTypes.reduce(
    (sum, t) => sum + (t.price > 0 ? t.price * t.sold_count : 0),
    0
  );
  const totalRemaining = ticketTypes.some((t) => t.capacity == null)
    ? null
    : ticketTypes.reduce((sum, t) => sum + ((t.capacity ?? 0) - t.sold_count), 0);

  return (
    <div className="max-w-4xl mx-auto page-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Ticket Types</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage registration tiers and access levels for this event
          </p>
        </div>
        {canAddMore ? (
          <Link
            href={`/event/${eventId}/tickets/new`}
            className="flex items-center gap-2 bg-brand text-white rounded-xl px-4 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-4 h-4" />
            New ticket type
          </Link>
        ) : (
          <div className="flex items-center gap-2 bg-neutral-100 text-neutral-400 rounded-xl px-4 py-2.5 text-sm font-bold cursor-not-allowed shrink-0">
            <Lock className="w-4 h-4" />
            Upgrade to add more
          </div>
        )}
      </div>

      {/* Summary bar */}
      {ticketTypes.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">
              Total Sold
            </p>
            <p className="text-3xl font-bold tabular-nums text-neutral-900">{totalSold}</p>
            <p className="text-xs text-neutral-400 mt-1">Approved registrations</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">
              Revenue
            </p>
            <p className="text-3xl font-bold tabular-nums text-neutral-900">
              {totalRevenue === 0 ? "₹0" : `₹${(totalRevenue / 100).toLocaleString("en-IN")}`}
            </p>
            <p className="text-xs text-neutral-400 mt-1">From paid tickets</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">
              Remaining
            </p>
            <p className="text-3xl font-bold tabular-nums text-neutral-900">
              {totalRemaining == null ? "—" : totalRemaining}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {totalRemaining == null ? "Unlimited capacity" : "Spots left"}
            </p>
          </div>
        </div>
      )}

      {/* Ticket type cards */}
      {ticketTypes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mb-1">
            No ticket types yet
          </h3>
          <p className="text-sm text-neutral-500 mb-5 max-w-xs mx-auto">
            Create your first ticket type to manage registrations and access for this event.
          </p>
          <Link
            href={`/event/${eventId}/tickets/new`}
            className="inline-flex items-center gap-2 bg-brand text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create ticket type
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ticketTypes.map((tt, idx) => {
            const catCfg = CATEGORY_CONFIG[tt.category as TicketCategory] ?? CATEGORY_CONFIG.general;
            const statusCfg =
              STATUS_CONFIG[tt.effective_status as keyof typeof STATUS_CONFIG] ??
              STATUS_CONFIG.draft;
            const fillPct =
              tt.capacity != null && tt.capacity > 0
                ? Math.min(100, Math.round((tt.sold_count / tt.capacity) * 100))
                : 0;
            const isLocked = isFree && idx >= 1;
            const revenue = tt.price > 0 ? tt.price * tt.sold_count : 0;

            return (
              <div
                key={tt.id}
                className={`bg-white rounded-2xl shadow-sm p-5 ${isLocked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: name + badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-neutral-900 truncate">
                        {tt.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${catCfg.cls}`}
                      >
                        <catCfg.Icon className="w-3 h-3" />
                        {catCfg.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {/* Price */}
                      <span className="text-sm font-bold text-neutral-900">
                        {formatPrice(tt.price)}
                      </span>

                      {/* Status */}
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.cls}`}
                      >
                        {statusCfg.label}
                      </span>

                      {/* Revenue */}
                      {tt.price > 0 && (
                        <span className="text-xs text-neutral-400">
                          Revenue: ₹{(revenue / 100).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Capacity progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-400">Sold</span>
                        <span className="text-xs font-semibold text-neutral-700 tabular-nums">
                          {tt.sold_count}
                          {tt.capacity != null ? ` / ${tt.capacity}` : ""}
                        </span>
                      </div>
                      {tt.capacity != null && (
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${fillPct}%`,
                              background:
                                fillPct >= 100
                                  ? "linear-gradient(90deg, #dc2626, #ef4444)"
                                  : "linear-gradient(90deg, #6D28D9, #8B5CF6)",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: edit button or lock */}
                  <div className="shrink-0">
                    {isLocked ? (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-100 rounded-xl px-3 py-2">
                        <Lock className="w-3.5 h-3.5" />
                        Pro
                      </div>
                    ) : (
                      <Link
                        href={`/event/${eventId}/tickets/${tt.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 border border-neutral-200 rounded-xl px-3 py-2 hover:bg-neutral-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Locked upsell card for free plan */}
          {isFree && (
            <div className="bg-white rounded-2xl shadow-sm p-5 border-2 border-dashed border-brand-100 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-brand" />
                <p className="text-sm font-semibold text-neutral-700">
                  Multiple ticket types require a paid plan
                </p>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Upgrade to Starter or Pro to create VIP, student, early bird, and other ticket types.
              </p>
              <Link
                href="/billing"
                className="inline-flex items-center gap-1.5 bg-brand text-white rounded-xl px-4 py-2 text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Upgrade plan
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
