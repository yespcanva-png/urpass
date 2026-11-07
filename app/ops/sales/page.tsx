import type { Metadata } from "next";
import Link from "next/link";
import { isOpsAuthenticated } from "@/lib/ops/auth";
import { adminClient } from "@/lib/supabase/admin";
import { updateSalesLead } from "@/app/actions/sales-leads";
import ScenarioCalculator from "./ScenarioCalculator";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sales Pipeline | UrPass Ops", robots: { index: false, follow: false } };

const stages = ["new", "qualified", "demo_booked", "demo_completed", "proposal_sent", "negotiation", "won", "lost", "onboarding"] as const;
type Lead = {
  id: string; organisation_name: string; contact_name: string; email: string; phone: string | null;
  market: string; event_type: string | null; event_date: string | null; estimated_registrations: number | null;
  requirements: string | null; expected_budget_inr: number | null; status: string; lead_owner: string | null;
  next_action: string | null; follow_up_at: string | null; deal_value_inr: number | null; source_page: string | null;
  utm_source: string | null; utm_campaign: string | null; created_at: string;
};

function indiaDate(value: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

export default async function OpsSalesPage() {
  if (!(await isOpsAuthenticated())) return <main className="p-8"><h1 className="text-xl font-bold">Administrator access required</h1><Link href="/ops" className="text-violet-700 underline">Open Ops sign in</Link></main>;
  const { data, error } = await adminClient().from("sales_leads").select("*").order("created_at", { ascending: false }).limit(200);
  const leads = (data || []) as Lead[];
  return <main className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-900"><div className="mx-auto max-w-7xl"><Link href="/ops" className="text-sm text-violet-700">← Operations</Link><h1 className="mt-4 text-3xl font-bold">Enterprise sales</h1><p className="mt-2 text-sm text-neutral-600">Demo requests, next actions and deal progress. {leads.length} recent leads.</p><ScenarioCalculator />
    {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">Sales leads are unavailable. Apply the sales pipeline migration and retry.</p>}
    <div className="mt-8 grid gap-5 lg:grid-cols-2">{leads.map((lead) => <article key={lead.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="text-lg font-bold">{lead.organisation_name}</h2><p className="text-sm text-neutral-600">{lead.contact_name} · {lead.market} · {lead.event_type || "Event"}</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">{lead.status.replaceAll("_", " ")}</span></div>
      <div className="mt-4 grid gap-1 text-sm"><a href={`mailto:${lead.email}`} className="text-violet-700 underline">{lead.email}</a>{lead.phone && <a href={`tel:${lead.phone}`} className="text-violet-700 underline">{lead.phone}</a>}<p>{lead.estimated_registrations?.toLocaleString("en-IN") || "Unknown"} registrations · Event {lead.event_date || "date TBD"}</p>{lead.requirements && <p className="mt-2 whitespace-pre-wrap text-neutral-700">{lead.requirements}</p>}<p className="mt-2 text-xs text-neutral-500">Source: {lead.source_page || "direct"}{lead.utm_source ? ` · ${lead.utm_source}` : ""}{lead.utm_campaign ? ` / ${lead.utm_campaign}` : ""} · Received {new Date(lead.created_at).toLocaleDateString("en-IN")}</p></div>
      <form action={updateSalesLead} className="mt-5 grid gap-3 border-t border-neutral-100 pt-5 sm:grid-cols-2"><input name="id" type="hidden" value={lead.id} /><label className="text-xs font-semibold">Stage<select name="status" defaultValue={lead.status} className="mt-1 w-full rounded-lg border p-2 text-sm">{stages.map((stage) => <option key={stage} value={stage}>{stage.replaceAll("_", " ")}</option>)}</select></label><label className="text-xs font-semibold">Owner<input name="leadOwner" defaultValue={lead.lead_owner || ""} maxLength={100} className="mt-1 w-full rounded-lg border p-2 text-sm" /></label><label className="text-xs font-semibold sm:col-span-2">Next action<input name="nextAction" defaultValue={lead.next_action || ""} maxLength={300} className="mt-1 w-full rounded-lg border p-2 text-sm" /></label><label className="text-xs font-semibold">Follow-up date (India)<input name="followUpAt" type="date" defaultValue={lead.follow_up_at ? indiaDate(lead.follow_up_at) : ""} className="mt-1 w-full rounded-lg border p-2 text-sm" /></label><label className="text-xs font-semibold">Deal value (₹)<input name="dealValueInr" type="number" min="0" defaultValue={lead.deal_value_inr ?? ""} className="mt-1 w-full rounded-lg border p-2 text-sm" /></label><button className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">Save lead</button></form>
    </article>)}</div>
  </div></main>;
}
