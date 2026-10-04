import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in to URPASS — Event Passes & Check-In Portal",
  description: "Log in to your URPASS organizer account to manage events, issue digital QR passes, accept ticket payments, and scan attendees.",
  alternates: { canonical: "https://urpass.space/login" },
  robots: { index: false, follow: false, nocache: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
