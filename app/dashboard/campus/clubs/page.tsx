import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserInstitutions } from "@/app/actions/campus/institution";
import { getCampusClubs } from "@/app/actions/campus/clubs";
import { getCampusDepartments } from "@/app/actions/campus/departments";
import ClubListView from "@/components/campus/ClubListView";

export const metadata: Metadata = {
  title: "Clubs & Cells | URPASS Campus",
  description: "View and manage campus student clubs, societies, placement cells, and chapters.",
  robots: { index: false, follow: false },
};

export default async function CampusClubsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const institutions = await getUserInstitutions();
  if (!institutions || institutions.length === 0) {
    redirect("/dashboard/campus");
  }

  const institution = institutions[0];
  const [clubs, departments] = await Promise.all([
    getCampusClubs(institution.id),
    getCampusDepartments(institution.id),
  ]);

  return (
    <ClubListView
      institution={institution}
      clubs={clubs}
      departments={departments}
    />
  );
}
