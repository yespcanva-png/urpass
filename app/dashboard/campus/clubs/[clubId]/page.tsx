import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCampusClubDetails } from "@/app/actions/campus/clubs";
import ClubDetailView from "@/components/campus/ClubDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clubId: string }>;
}): Promise<Metadata> {
  const { clubId } = await params;
  const data = await getCampusClubDetails(clubId);
  return {
    title: data ? `${data.club.name} | URPASS Campus` : "Club | URPASS Campus",
    description: data?.club.description || "Campus student club details on URPASS Campus",
    robots: { index: false, follow: false },
  };
}

export default async function CampusClubDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ clubId: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { clubId } = await params;
  const { year } = (await searchParams) ?? {};

  const clubData = await getCampusClubDetails(clubId, year);

  if (!clubData) {
    notFound();
  }

  return (
    <ClubDetailView
      data={clubData}
      selectedYear={year}
    />
  );
}
