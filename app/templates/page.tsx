import type { Metadata } from "next";
import TicketTemplatesPage from "@/app/ticket-templates/page";

export const metadata: Metadata = {
  title: "Event Ticket & Pass Templates | Free & Premium | URPASS",
  description:
    "Browse production-ready event ticket templates, mobile pass designs, and conference badges. 6 Free templates and premium designs from ₹49.",
  alternates: {
    canonical: "https://urpass.space/ticket-templates",
  },
};

export default function TemplatesAliasPage() {
  return <TicketTemplatesPage />;
}
