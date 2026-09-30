import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up for URPASS — Free Digital Event Passes & QR Check-In",
  description: "Create your free URPASS account in seconds. Issue digital event passes, collect registrations, accept ticket payments, and scan QR passes at entry.",
  alternates: { canonical: "https://urpass.space/signup" },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
