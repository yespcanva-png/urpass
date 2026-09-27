import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "@/components/dashboard/Sidebar";
import AppShell from "@/components/layouts/AppShell";
import type { CampusContext } from "@/types";

// ── Mock Next.js navigation ───────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), back: vi.fn(), push: vi.fn() }),
  usePathname: () => "/dashboard",
  useParams: () => ({}),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: vi.fn().mockResolvedValue({}),
    },
  }),
}));

describe("Campus Sidebar Navigation", () => {
  const baseProps = {
    email: "test@example.edu",
    fullName: "Dr. Admin",
    planSlug: "pro",
  };

  it("does not render any campus navigation items when campusContext is null", () => {
    render(<Sidebar {...baseProps} campusContext={null} />);

    expect(screen.queryByText("Campus")).toBeNull();
    expect(screen.queryByRole("link", { name: /overview/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /departments/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /clubs/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /students/i })).toBeNull();
  });

  it("renders all 8 campus links and code badge for INSTITUTION_ADMIN", () => {
    const campusContext: CampusContext = {
      institutionId: "inst-1",
      institutionName: "ABC Engineering College",
      institutionCode: "ABCEC",
      role: "INSTITUTION_ADMIN",
    };

    render(<Sidebar {...baseProps} campusContext={campusContext} />);

    // Campus section and code badge
    expect(screen.getByText("Campus")).toBeInTheDocument();
    expect(screen.getByText("ABCEC")).toBeInTheDocument();

    // Verify all 8 links
    const expectedHrefs = [
      "/dashboard/campus",
      "/dashboard/campus/events",
      "/dashboard/campus/departments",
      "/dashboard/campus/clubs",
      "/dashboard/campus/students",
      "/dashboard/campus/analytics",
      "/dashboard/campus/team",
      "/dashboard/campus/settings",
    ];

    expectedHrefs.forEach((href) => {
      const link = document.querySelector(`a[href="${href}"]`);
      expect(link).not.toBeNull();
    });
  });

  it("hides Settings link for DEPARTMENT_ADMIN", () => {
    const campusContext: CampusContext = {
      institutionId: "inst-1",
      institutionName: "ABC Engineering College",
      institutionCode: "ABCEC",
      role: "DEPARTMENT_ADMIN",
      departmentId: "dept-cse",
    };

    render(<Sidebar {...baseProps} campusContext={campusContext} />);

    expect(document.querySelector('a[href="/dashboard/campus"]')).not.toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/departments"]')).not.toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/clubs"]')).not.toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/students"]')).not.toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/analytics"]')).not.toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/team"]')).not.toBeNull();
    // Settings must not be visible
    expect(document.querySelector('a[href="/dashboard/campus/settings"]')).toBeNull();
  });

  it("shows only Overview and Events for ORGANIZER", () => {
    const campusContext: CampusContext = {
      institutionId: "inst-1",
      institutionName: "ABC Engineering College",
      institutionCode: "ABCEC",
      role: "ORGANIZER",
      departmentId: "dept-cse",
      clubId: "club-coding",
    };

    render(<Sidebar {...baseProps} campusContext={campusContext} />);

    expect(document.querySelector('a[href="/dashboard/campus"]')).not.toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/events"]')).not.toBeNull();

    // Department, Clubs, Students, Analytics, Team, Settings must be hidden
    expect(document.querySelector('a[href="/dashboard/campus/departments"]')).toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/clubs"]')).toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/students"]')).toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/analytics"]')).toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/team"]')).toBeNull();
    expect(document.querySelector('a[href="/dashboard/campus/settings"]')).toBeNull();
  });

  it("passes campusContext through AppShell to Sidebar", () => {
    const campusContext: CampusContext = {
      institutionId: "inst-2",
      institutionName: "National Tech Institute",
      institutionCode: "NTI",
      role: "INSTITUTION_ADMIN",
    };

    render(
      <AppShell {...baseProps} campusContext={campusContext}>
        <div>Main Dashboard Content</div>
      </AppShell>
    );

    expect(screen.getByText("NTI")).toBeInTheDocument();
    expect(screen.getByText("Main Dashboard Content")).toBeInTheDocument();
    expect(document.querySelector('a[href="/dashboard/campus"]')).not.toBeNull();
  });
});
