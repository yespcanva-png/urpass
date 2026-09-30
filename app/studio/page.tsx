import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import TicketStudio from "@/components/studio/TicketStudio";
import {
  STUDIO_TEMPLATES,
  convertStudioTemplateToTicketDesign,
} from "@/lib/studio/templates";
import { isTemplateUnlocked, parseUnlockedCookie } from "@/lib/studio/purchases";

export const metadata: Metadata = {
  title: "Ticket Studio — Full Screen Pass Designer | Urpass",
  description: "Visual drag-and-drop ticket and pass builder for your default brand passes.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function StudioDefaultPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; eventName?: string; venue?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { template: templateId, eventName: paramEventName, venue: paramVenue } =
    await searchParams;

  const plan = await getUserPlan(supabase, user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_name, brand_color, org_logo_url, custom_pass_design, unlocked_templates")
    .eq("user_id", user.id)
    .single();

  const cookieStore = await cookies();
  const cookieVal = cookieStore.get("urpass_unlocked_templates")?.value;
  const cookieUnlocked = parseUnlockedCookie(cookieVal);
  const profileUnlocked = Array.isArray(profile?.unlocked_templates)
    ? profile.unlocked_templates
    : [];
  const combinedUnlocked = Array.from(new Set([...profileUnlocked, ...cookieUnlocked]));

  const isPlanPro = plan.canUse("custom_pass_design");

  let initialConfig = profile?.custom_pass_design;
  let selectedTemplateName = "";
  let canCustomize = true;

  if (templateId) {
    const selectedTemplate = STUDIO_TEMPLATES.find((t) => t.id === templateId);
    if (selectedTemplate) {
      initialConfig = convertStudioTemplateToTicketDesign(selectedTemplate);
      selectedTemplateName = selectedTemplate.name;
    }
  }

  const defaultEventName =
    paramEventName ||
    (selectedTemplateName ? `${selectedTemplateName.toUpperCase()}` : null) ||
    (profile?.org_name ? `${profile.org_name} PASS` : "EVENT ENTRY PASS");

  return (
    <TicketStudio
      initialConfig={initialConfig}
      isPro={canCustomize}
      userPlanTier={canCustomize ? "pro" : plan.slug}
      eventName={defaultEventName}
      eventDate="24 OCT 2026 | 10:00 AM"
      venue={paramVenue || "The Residency, Coimbatore"}
      backHref="/dashboard/templates"
    />
  );
}
