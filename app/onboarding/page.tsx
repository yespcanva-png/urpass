import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, plan, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("user_id", user.id).single(),
    getUserPlan(supabase, user.id),
    supabase
      .from("organization_members")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1),
  ]);

  // Already has an org → skip onboarding
  if ((memberships ?? []).length > 0) {
    redirect("/dashboard");
  }

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <OnboardingClient
      firstName={firstName}
      canCreateOrg={plan.canCreateOrganizations}
      planSlug={plan.slug}
    />
  );
}
