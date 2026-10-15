import type { Metadata } from "next";
import ManagedEventSetupContent from "@/components/landing/ManagedEventSetupContent";
import { TICKET_OG_IMAGE, TICKET_OG_IMAGE_META } from "@/lib/seo/og-images";

export const metadata: Metadata = {
  title: "Managed Event Setup & QR Ticketing Service | UrPass",
  description:
    "Let UrPass set up your event registration, ticketing, branded QR passes and check-in workflow. Professional done-for-you event setup for conferences, colleges and expos.",
  keywords: [
    "managed event setup",
    "managed setup",
    "done-for-you event registration setup",
    "managed event ticketing service",
    "QR code event check-in setup",
    "conference registration setup service",
    "college fest ticketing setup",
    "event ticketing configuration India",
    "managed attendee registration software",
  ],
  alternates: { canonical: "https://urpass.space/managed-setup" },
  openGraph: {
    title: "Managed Event Setup & QR Ticketing Service | UrPass",
    description:
      "Let UrPass set up your event registration, ticketing, branded QR passes and check-in workflow. Professional done-for-you event setup for conferences, colleges and expos.",
    url: "https://urpass.space/managed-setup",
    type: "website",
    images: [TICKET_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: "Managed Event Setup & QR Ticketing Service | UrPass",
    description:
      "Let UrPass set up your event registration, ticketing, branded QR passes and check-in workflow. Professional done-for-you event setup for conferences, colleges and expos.",
    images: [TICKET_OG_IMAGE],
  },
};

export default function ManagedSetupPage() {
  return <ManagedEventSetupContent canonicalUrl="https://urpass.space/managed-setup" />;
}
