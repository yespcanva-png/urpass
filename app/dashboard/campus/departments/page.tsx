import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserInstitutions } from "@/app/actions/campus/institution";
import { getCampusDepartments } from "@/app/actions/campus/departments";
import DepartmentListView from "@/components/campus/DepartmentListView";

export const metadata: Metadata = {
  title: "Academic Departments | URPASS Campus",
  description: "View and manage campus departments, clubs, faculty coordinators and attendance stats.",
  robots: { index: false, follow: false },
};

export default async function CampusDepartmentsPage() {
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
  const departments = await getCampusDepartments(institution.id);

  return (
    <DepartmentListView
      institution={institution}
      departments={departments}
    />
  );
}
