import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCampusDepartmentDetails } from "@/app/actions/campus/departments";
import DepartmentDetailView from "@/components/campus/DepartmentDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ departmentId: string }>;
}): Promise<Metadata> {
  const { departmentId } = await params;
  const data = await getCampusDepartmentDetails(departmentId);
  return {
    title: data ? `${data.department.name} | URPASS Campus` : "Department | URPASS Campus",
    description: data?.department.description || "Departmental dashboard on URPASS Campus",
    robots: { index: false, follow: false },
  };
}

export default async function CampusDepartmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ departmentId: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { departmentId } = await params;
  const { year } = (await searchParams) ?? {};

  const departmentData = await getCampusDepartmentDetails(departmentId, year);

  if (!departmentData) {
    notFound();
  }

  return (
    <DepartmentDetailView
      data={departmentData}
      selectedYear={year}
    />
  );
}
