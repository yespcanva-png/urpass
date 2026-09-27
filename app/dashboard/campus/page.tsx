import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserInstitutions } from "@/app/actions/campus/institution";
import { getCampusDashboardData } from "@/app/actions/campus/analytics";
import CampusDashboardView from "@/components/campus/CampusDashboardView";
import CampusOnboardingView from "@/components/campus/CampusOnboardingView";

export const metadata: Metadata = {
  title: "Campus Overview | URPASS",
  description: "Centralized higher education campus event management, department analytics and student engagement.",
  robots: { index: false, follow: false },
};

export default async function CampusPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; academic_year?: string; institutionId?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const institutions = await getUserInstitutions();

  if (!institutions || institutions.length === 0) {
    return <CampusOnboardingView />;
  }

  const resolvedParams = await searchParams;
  const targetInstId = resolvedParams?.institutionId || institutions[0].id;
  const selectedYear = resolvedParams?.year || resolvedParams?.academic_year;

  const dashboardData = await getCampusDashboardData(targetInstId, selectedYear);

  if (!dashboardData) {
    return <CampusOnboardingView />;
  }

  return (
    <CampusDashboardView
      data={dashboardData}
      selectedYear={selectedYear}
    />
  );
}
