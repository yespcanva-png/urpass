import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserReferralDashboard } from "@/lib/referrals/service";
import ReferralDashboardClient from "@/components/dashboard/ReferralDashboardClient";

export const metadata: Metadata = {
  title: "Refer & Earn | UrPass",
  description: "Give ₹100, Get ₹150. Invite organisers to UrPass and earn subscription credits.",
  robots: { index: false, follow: false },
};

export default async function ReferralsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/referrals");
  }

  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
  const dashboardData = await getUserReferralDashboard(user.id, appOrigin);

  return <ReferralDashboardClient initialData={dashboardData} />;
}
