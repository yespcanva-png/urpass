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

  const [{ data: profile }, reqHeaders, cookieStore] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("user_id", user.id).maybeSingle(),
    headers(),
    cookies(),
  ]);

  const cookieCountry = cookieStore.get("urpass_country")?.value?.toUpperCase();
  const headerCountry = detectCountryFromHeaders(reqHeaders);
  const country: "IN" | "GB" = headerCountry === "GB" || cookieCountry === "GB" || cookieCountry === "UK" ? "GB" : "IN";

  return (
    <SubscriptionOnboardingClient
      country={country}
      userEmail={profile?.email ?? user.email ?? ""}
      userName={profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Organizer"}
      accessState={access.state}
      introOfferEligible={access.introOfferEligible}
    />
  );
}

