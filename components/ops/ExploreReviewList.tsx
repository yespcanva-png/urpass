"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  adminApproveExploreListingAction, adminRejectExploreListingAction,
  adminRequestChangesExploreListingAction, adminSuspendExploreListingAction,
} from "@/app/actions/explore";

type Listing = {
  event_id: string; status: string; category: string; city: string | null;
  editorial_summary: string | null; rejection_reason: string | null; updated_at: string;
  event: { name: string; event_date: string; venue: string; apply_slug: string | null } | null;
};

export default function ExploreReviewList({ listings }: { listings: Listing[] }) {
  const [rows, setRows] = useState(listings);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  function act(id: string, action: "approve" | "reject" | "changes" | "suspend") {
    startTransition(async () => {
      const reason = feedback[id] || "";
      const result = action === "approve" ? await adminApproveExploreListingAction(id)
        : action === "reject" ? await adminRejectExploreListingAction(id, reason)
        : action === "changes" ? await adminRequestChangesExploreListingAction(id, reason)
        : await adminSuspendExploreListingAction(id, reason);
      setMessage((previous) => ({ ...previous, [id]: result.success ? "Listing updated." : result.error || "Update failed." }));
      if (result.success) setRows((previous) => previous.map((row) => row.event_id === id
        ? { ...row, status: action === "approve" ? "approved" : action === "changes" ? "changes_requested" : action === "suspend" ? "suspended" : "rejected", rejection_reason: reason }
        : row));
    });
  }
  if (!rows.length) return <p className="mt-8 rounded-2xl border p-6 text-neutral-600">No Explore listings yet.</p>;
  return <div className="mt-7 space-y-4">{rows.map((row) => <article key={row.event_id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{row.event?.name || "Event unavailable"}</h2><p className="mt-1 text-sm text-neutral-600">{row.event?.event_date} · {row.event?.venue} · {row.city} · {row.category}</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold capitalize text-violet-700">{row.status.replaceAll("_", " ")}</span></div>
    {row.editorial_summary && <p className="mt-3 text-sm text-neutral-700">{row.editorial_summary}</p>}
    {row.rejection_reason && <p className="mt-3 text-sm text-red-700">Feedback: {row.rejection_reason}</p>}
    <div className="mt-4 flex flex-wrap items-center gap-2"><Link href={`/event/${row.event_id}/explore-preview`} target="_blank" className="rounded-lg border px-3 py-2 text-xs font-semibold">Private preview</Link>
      {row.status === "pending" && <><button disabled={pending} onClick={() => act(row.event_id, "approve")} className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Approve</button><button disabled={pending} onClick={() => act(row.event_id, "changes")} className="rounded-lg border px-3 py-2 text-xs font-semibold">Request changes</button><button disabled={pending} onClick={() => act(row.event_id, "reject")} className="rounded-lg border px-3 py-2 text-xs font-semibold text-red-700">Reject</button></>}
      {row.status === "approved" && <button disabled={pending} onClick={() => act(row.event_id, "suspend")} className="rounded-lg border px-3 py-2 text-xs font-semibold text-red-700">Suspend</button>}
    </div>
    {(row.status === "pending" || row.status === "approved") && <textarea aria-label={`Feedback for ${row.event?.name || row.event_id}`} value={feedback[row.event_id] || ""} onChange={(event) => setFeedback((previous) => ({ ...previous, [row.event_id]: event.target.value }))} placeholder="Reason for rejection, changes or suspension" className="mt-3 w-full rounded-lg border p-2 text-sm" rows={2} />}
    {message[row.event_id] && <p className="mt-2 text-xs text-neutral-700" role="status">{message[row.event_id]}</p>}
  </article>)}</div>;
}
