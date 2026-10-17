import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { detectCountryFromHeaders } from "@/lib/country-config";
import { resolveUserSubscriptionAccess } from "@/lib/billing/entitlement-resolver";
import SubscriptionOnboardingClient from "./SubscriptionOnboardingClient";

export const metadata: Metadata = {
  title: "Activate Subscription — URPASS",
  robots: { index: false, follow: false },
};

export default async function SubscriptionOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/onboarding/subscription");

  const access = await resolveUserSubscriptionAccess({ supabase, user });
  if (access.hasOrganizerAccess) {
    redirect("/dashboard");
  }

  const [{ data: profile }, { data: trialEvent }, reqHeaders, cookieStore] = await Promise.all([
    supabase.from("profiles").select("full_name, email, phone").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_trial_events").select("id").eq("user_id", user.id).maybeSingle(),
    headers(),
    cookies(),
  ]);

  const freeTrialEligible =
    !access.freeEventTrialConsumed &&
    !trialEvent &&
    access.state !== "autopay_trial_completed";

  const cookieCountry = cookieStore.get("urpass_country")?.value?.toUpperCase();
  const headerCountry = detectCountryFromHeaders(reqHeaders);
  const country: "IN" | "GB" = cookieCountry === "GB" || cookieCountry === "UK" ? "GB" : headerCountry === "GB" && cookieCountry !== "IN" ? "GB" : "IN";

  return (
    <SubscriptionOnboardingClient
      country={country}
      userEmail={profile?.email ?? user.email ?? ""}
      userName={profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Organizer"}
      userPhone={profile?.phone ?? user.phone ?? (user.user_metadata?.phone as string) ?? ""}
      accessState={access.state}
      introOfferEligible={access.introOfferEligible}
      freeTrialEligible={freeTrialEligible}
    />
  );
}

