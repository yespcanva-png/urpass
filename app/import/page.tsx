import type { Metadata } from "next";
import SwitchToUrpassPage from "@/app/switch-to-urpass/page";

export const metadata: Metadata = {
  title: "Import Event | 1-Click Event Migration to URPASS",
  description:
    "Migrate your event from Eventbrite, Luma, Townscript, or Google Forms to URPASS in seconds. Eliminate platform commissions and unlock sub-0.3s QR check-in.",
  alternates: {
    canonical: "https://urpass.space/switch-to-urpass",
  },
};

export default function ImportPage() {
  return <SwitchToUrpassPage />;
}
