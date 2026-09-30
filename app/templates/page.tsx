import type { Metadata } from "next";
import TicketTemplatesPage from "@/app/ticket-templates/page";

export const metadata: Metadata = {
  title: "Templates — Launch Your Event Faster | URPASS",
  description:
    "Start with proven event setups preconfiguring registration forms, attendee QR passes, approval flows, and camera check-in gates for conferences, college fests, VIP galas, and workshops.",
  alternates: {
    canonical: "https://urpass.space/templates",
  },
};

export default function TemplatesAliasPage() {
  return <TicketTemplatesPage />;
}
