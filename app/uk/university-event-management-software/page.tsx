import type { Metadata } from "next";
import UkUniversityEventSoftwarePage from "../university-event-software/page";

export const metadata: Metadata = {
  title: "University Event Management Software UK | URPASS",
  description:
    "UK university event management and ticketing software. Built for student unions, academic faculties, and student societies. Collect Student IDs and scan QR passes in <0.3s.",
  alternates: {
    canonical: "https://urpass.space/uk/university-event-management-software",
  },
  openGraph: {
    title: "University Event Management Software UK | URPASS",
    description:
      "Empower UK university faculties, student unions, and campus societies with high-speed QR check-in, student ID capture, and 0% ticket commission.",
    url: "https://urpass.space/uk/university-event-management-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function Page() {
  return <UkUniversityEventSoftwarePage />;
}
