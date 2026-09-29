import type { Metadata } from "next";
import UkDigitalEventPassesPage from "../digital-event-passes/page";

export const metadata: Metadata = {
  title: "Digital Event Passes & Apple Wallet Tickets UK | URPASS",
  description:
    "Deliver dynamic, secure digital event passes to UK attendees. Native Apple Wallet and Google Wallet integration, encrypted QR verification, and sub-second scanning.",
  alternates: {
    canonical: "https://urpass.space/uk/digital-event-pass",
  },
  openGraph: {
    title: "Digital Event Passes UK | URPASS",
    description:
      "Deliver dynamic, secure digital event passes to UK attendees with Apple Wallet support and anti-fraud QR verification.",
    url: "https://urpass.space/uk/digital-event-pass",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function Page() {
  return <UkDigitalEventPassesPage />;
}
