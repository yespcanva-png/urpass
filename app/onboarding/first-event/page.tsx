import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuickFirstEventForm from "./QuickFirstEventForm";
import { firstEventConversionEnabledFor } from "@/lib/feature-flags/first-event";

export const metadata: Metadata = {
  title: "Create Your First Event | UrPass",
  robots: { index: false, follow: false },
};

export default async function FirstEventPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/first-event");
  if (!firstEventConversionEnabledFor(user.id)) redirect("/onboarding/subscription");

  const { data: invitedMembership } = await supabase.from("organization_members")
    .select("role").eq("user_id", user.id).eq("status", "active")
    .neq("role", "owner").limit(1).maybeSingle();
  if (invitedMembership) redirect("/dashboard");

  const { data: event } = await supabase.from("events")
    .select("id, is_onboarding_draft")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (event?.is_onboarding_draft) redirect(`/onboarding/first-event/plans?draft=${event.id}`);
  if (event) redirect(`/event/${event.id}`);

  const resolvedParams = searchParams ? await searchParams : {};
  const template = typeof resolvedParams.template === "string" ? resolvedParams.template : undefined;
  const eventName = typeof resolvedParams.eventName === "string"
    ? resolvedParams.eventName
    : (typeof resolvedParams.name === "string" ? resolvedParams.name : undefined);
  const capacityRaw = typeof resolvedParams.capacity === "string" ? parseInt(resolvedParams.capacity, 10) : undefined;
  const capacity = capacityRaw && !isNaN(capacityRaw) ? capacityRaw : undefined;
  const intent = typeof resolvedParams.intent === "string" ? resolvedParams.intent : undefined;
  const segment = typeof resolvedParams.segment === "string" ? resolvedParams.segment : undefined;

  return (
    <QuickFirstEventForm
      initialName={eventName}
      initialCapacity={capacity}
      initialTemplate={template}
      initialCategory={segment}
      initialIntent={intent}
    />
  );
}
