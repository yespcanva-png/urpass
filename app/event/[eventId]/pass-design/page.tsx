import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import PassDesigner from "@/components/pass/PassDesigner";

export const metadata: Metadata = {
  title: "Custom Pass Design",
  description: "Customize the ticket pass design, colors, and layout for this event.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EventPassDesignPage({
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

  const [{ data: event }, plan] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, event_date, start_time, end_time, venue, organizer_id, custom_pass_design")
      .eq("id", eventId)
      .single(),
    getUserPlan(supabase, user.id),
  ]);

  if (!event) notFound();

  // Verify ownership or org admin role
  if (event.organizer_id !== user.id) {
    const { data: orgMember } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", ["owner", "admin"])
      .maybeSingle();

    if (!orgMember) notFound();
  }

  // Fetch organizer profile pass design & branding defaults
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_name, org_logo_url, brand_color, custom_pass_design")
    .eq("user_id", event.organizer_id)
    .single();

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isPro = plan.canUse("custom_pass_design");

  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-0.5">
            Ticket Experience
          </p>
          <h1 className="text-xl font-bold text-neutral-900">Custom Pass Design</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Design how entry passes look for attendees of{" "}
            <span className="font-semibold text-neutral-800">{event.name}</span>.
          </p>
        </div>
      </div>

      <PassDesigner
        initialDesign={event.custom_pass_design}
        orgDefaultDesign={profile?.custom_pass_design}
        orgName={profile?.org_name ?? "URPASS"}
        orgLogoUrl={profile?.org_logo_url ?? ""}
        isPro={isPro}
        mode="event"
        eventId={event.id}
        eventName={event.name}
        eventDate={`${formattedDate} · ${event.start_time ?? ""}`}
        venue={event.venue ?? "Venue TBD"}
      />
    </div>
  );
}
