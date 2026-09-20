import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import NotificationBell from "@/components/notifications/NotificationBell";

export interface OrgContext {
  slug: string;
  name: string;
  brand_color: string;
  role: string;
}

interface Props {
  fullName: string;
  email: string;
  planSlug?: string;
  orgs?: OrgContext[];
  activeOrgSlug?: string;
  children: React.ReactNode;
}

export default function AppShell({ fullName, email, planSlug, children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0e0c16" }}>
      <Sidebar fullName={fullName} email={email} planSlug={planSlug} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f5f4fa" }}>
        {/* ── Notification Icon on top (no navbar) ─────────────────────────── */}
        <div className="flex justify-end items-center px-4 lg:px-8 pt-3 pb-0 shrink-0 z-40">
          <NotificationBell />
        </div>

        {/* ── Scrollable content ──────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-[88px] lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
