import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UrPass Organization",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
