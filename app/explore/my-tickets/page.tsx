import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getExploreTickets } from "@/lib/explore/my-tickets";
import MyTicketsClient from "./MyTicketsClient";

export const metadata: Metadata = {
  title: "My Tickets — UrPass Explore",
  description: "Your event tickets and QR passes, all in one place.",
  robots: { index: false, follow: false },
};

export default async function MyTicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/explore/login?next=%2Fexplore%2Fmy-tickets");

  const verifiedEmail = user.email && user.email_confirmed_at ? user.email : null;
  const tickets = verifiedEmail ? await getExploreTickets(verifiedEmail) : [];
  return <MyTicketsClient tickets={tickets} email={user.email || ""} needsVerification={!verifiedEmail} />;
}
