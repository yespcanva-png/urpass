import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateEventPreflightReadiness } from "@/lib/events/preflight";

export default async function FirstEventPreview({ params }: {
  params: Promise<{ eventId: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { eventId } = await params;
  const { data: event } = await supabase.from("events")
    .select("id, name, description, event_date, start_time, end_time, venue, attendee_limit, custom_fields, email_enabled, application_enabled, auto_approve, status, is_onboarding_draft")
    .eq("id", eventId).eq("organizer_id", user.id).maybeSingle();
  if (!event || !event.is_onboarding_draft) notFound();
  const [{ data: tickets }, preflight] = await Promise.all([
    supabase.from("ticket_types").select("name, capacity, status").eq("event_id", eventId),
    validateEventPreflightReadiness(eventId, supabase),
  ]);
  const fields = Array.isArray(event.custom_fields) ? event.custom_fields as Array<{ label?: string; required?: boolean }> : [];

  return <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
    <div className="mx-auto max-w-2xl space-y-5">
      <p className="text-sm font-semibold text-violet-700">Event preview · Only you can see this draft</p>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        {event.description && <p className="mt-3 text-neutral-600">{event.description}</p>}
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold">Date</dt><dd>{event.event_date || "To be set"}</dd></div>
          <div><dt className="font-semibold">Time</dt><dd>{event.start_time && event.end_time ? `${event.start_time}–${event.end_time}` : "To be set"}</dd></div>
          <div><dt className="font-semibold">Venue</dt><dd>{event.venue || "To be set"}</dd></div>
          <div><dt className="font-semibold">Capacity</dt><dd>{event.attendee_limit} registrations</dd></div>
        </dl>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Registration form preview</h2>
        <p className="mt-2 text-sm text-neutral-600">Required fields: Name and email{fields.filter((field) => field.required).length ? ", plus the fields below" : ""}.</p>
        <div className="mt-4 space-y-3">{["Name", "Email", ...fields.map((field) => field.label || "Additional field")].map((field) =>
          <div key={field} className="rounded-lg border px-3 py-2 text-sm text-neutral-500">{field}</div>)}</div>
        <p className="mt-4 text-sm">Registration: {event.application_enabled ? "Enabled on publication" : "Disabled"} · Approval: {event.auto_approve ? "Automatic" : "Manual"}</p>
        <p className="mt-1 text-sm">Confirmation email: {event.email_enabled ? "Enabled" : "Disabled"}</p>
        <p className="mt-1 text-sm">QR pass: generated from the registration settings after approval.</p>
        <p className="mt-1 text-sm">Ticket types: {tickets?.length ? tickets.map((ticket) => ticket.name).join(", ") : "None configured"}</p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Publish readiness</h2>
        {preflight.errors.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-700">
          {preflight.errors.map((item) => <li key={item.id}>{item.message}</li>)}
        </ul> : <p className="mt-3 text-sm text-green-700">Event details are ready for publication.</p>}
      </div>
      <Link href={`/event/${eventId}/settings`} className="inline-block rounded-lg bg-violet-700 px-4 py-3 text-sm font-semibold text-white">Back to settings and publish</Link>
    </div>
  </main>;
}
