import type { Metadata } from "next";
import TicketFeeCalculatorPage from "@/app/ticket-fee-calculator/page";

export const metadata: Metadata = {
  title: "Event Ticket Fee Calculator | URPASS",
  description: "Calculate how much money you save on URPASS with 0% ticketing commissions compared to Eventbrite, Townscript, and Luma.",
  alternates: {
    canonical: "https://urpass.space/ticket-fee-calculator",
  },
};

export default function CalculatorAliasPage() {
  return <TicketFeeCalculatorPage />;
}
