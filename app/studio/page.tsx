import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import TicketStudio from "@/components/studio/TicketStudio";

export const metadata: Metadata = {
  title: "Ticket Studio — Full Screen Pass Designer | Urpass",
  description: "Visual drag-and-drop ticket and pass builder for your default brand passes.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function StudioDefaultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await getUserPlan(supabase, user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_name, brand_color, org_logo_url, custom_pass_design")
    .eq("user_id", user.id)
    .single();

  const isPro = plan.canUse("custom_pass_design");

  return (
    <TicketStudio
      initialConfig={profile?.custom_pass_design}
      isPro={isPro}
      eventName={profile?.org_name ? `${profile.org_name} SUMMIT` : "URPASS SUMMIT"}
      eventDate="24 OCT 2026 | 10:00 AM"
      venue="The Residency, Coimbatore"
      backHref="/dashboard"
    />
  );
}
