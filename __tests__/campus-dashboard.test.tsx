import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CampusDashboardView from "@/components/campus/CampusDashboardView";
import CampusOnboardingView from "@/components/campus/CampusOnboardingView";
import type { CampusDashboardData } from "@/types/campus";

// ── Mock Next.js navigation ───────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
  usePathname: () => "/dashboard/campus",
  useSearchParams: () => new URLSearchParams(),
}));

// ── Mock Campus Actions ───────────────────────────────────────────────────────
vi.mock("@/app/actions/campus/analytics", () => ({
  exportCampusAnalyticsCSV: vi.fn().mockResolvedValue("Department,Code,Events\nCSE,CS,5"),
}));

vi.mock("@/app/actions/campus/institution", () => ({
  createInstitution: vi.fn().mockResolvedValue({ data: { id: "new-inst-1" } }),
}));

describe("CampusDashboardView", () => {
  const mockData: CampusDashboardData = {
    institution: {
      id: "inst-1",
      name: "St. Xavier Engineering College",
      institution_code: "SXEC",
      logo_url: null,
      website: "https://sxec.edu",
      email_domain: "sxec.edu",
      address: "Chennai, Tamil Nadu",
      current_academic_year: "2026-27",
      primary_admin_id: "user-1",
      subscription_tier: "campus",
      require_event_approval: true,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    kpis: {
      totalEvents: 42,
      upcomingEvents: 8,
      totalRegistrations: 2840,
      totalAttendees: 2150,
      attendanceRate: 76,
      activeDepartments: 6,
      activeClubs: 12,
    },
    topDepartments: [
      {
        id: "dept-cse",
        name: "Computer Science and Engineering",
        code: "CSE",
        color: "#6D28D9",
        eventsCount: 15,
        registrationsCount: 1200,
        checkedInCount: 960,
        attendanceRate: 80,
        clubsCount: 4,
      },
      {
        id: "dept-ece",
        name: "Electronics and Communication",
        code: "ECE",
        color: "#0284C7",
        eventsCount: 10,
        registrationsCount: 800,
        checkedInCount: 560,
        attendanceRate: 70,
        clubsCount: 3,
      },
    ],
    upcomingEvents: [
      {
        id: "evt-symp",
        name: "National Tech Symposium 2026",
        event_date: "2026-10-15",
        venue: "Main Auditorium",
        status: "active",
        department_name: "Computer Science",
        department_code: "CSE",
        club_name: "Coding Club",
        registrations_count: 320,
        attendees_count: 0,
        attendance_rate: 0,
        approval_status: "approved",
      },
    ],
    recentEvents: [
      {
        id: "evt-hack",
        name: "Campus Hackathon 24hr",
        event_date: "2026-08-20",
        venue: "Lab Complex",
        status: "completed",
        department_name: "Computer Science",
        department_code: "CSE",
        registrations_count: 150,
        attendees_count: 135,
        attendance_rate: 90,
      },
    ],
    trends: [
      { date: "Jul 26", registrations: 450, attendees: 340 },
      { date: "Aug 26", registrations: 890, attendees: 720 },
      { date: "Sep 26", registrations: 1500, attendees: 1090 },
    ],
  };

  it("renders institution details and header badges", () => {
    render(<CampusDashboardView data={mockData} />);

    expect(screen.getByText("St. Xavier Engineering College")).toBeInTheDocument();
    expect(screen.getByText("SXEC")).toBeInTheDocument();
    expect(screen.getByText("AY 2026-27")).toBeInTheDocument();
    expect(screen.getByText(/Approval Workflow Active/i)).toBeInTheDocument();
  });

  it("renders all 7 overview KPI cards", () => {
    render(<CampusDashboardView data={mockData} />);

    expect(screen.getByText("Total Events")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();

    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();

    expect(screen.getAllByText("Registrations")[0]).toBeInTheDocument();
    expect(screen.getByText("2,840")).toBeInTheDocument();

    expect(screen.getAllByText("Attendees")[0]).toBeInTheDocument();
    expect(screen.getByText("2,150")).toBeInTheDocument();

    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(screen.getByText("76%")).toBeInTheDocument();

    expect(screen.getByText("Departments")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();

    expect(screen.getByText("Clubs & Cells")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("renders top departments ranking", () => {
    render(<CampusDashboardView data={mockData} />);

    expect(screen.getByText("Top Departments")).toBeInTheDocument();
    expect(screen.getByText("Computer Science and Engineering")).toBeInTheDocument();
    expect(screen.getByText("1,200 regs")).toBeInTheDocument();
    expect(screen.getByText("Electronics and Communication")).toBeInTheDocument();
    expect(screen.getByText("800 regs")).toBeInTheDocument();
  });

  it("renders upcoming and recent campus events", () => {
    render(<CampusDashboardView data={mockData} />);

    expect(screen.getByText("National Tech Symposium 2026")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("320 registered")).toBeInTheDocument();

    expect(screen.getByText("Campus Hackathon 24hr")).toBeInTheDocument();
    expect(screen.getByText("135 / 150")).toBeInTheDocument();
  });
});

describe("CampusOnboardingView", () => {
  it("renders onboarding form with required inputs", () => {
    render(<CampusOnboardingView />);

    expect(screen.getByText("Centralized Event Management for Colleges & Universities")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. ABC College of Engineering/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. ABCEC/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Activate URPASS Campus/i })).toBeInTheDocument();
  });

  it("updates form inputs on change", () => {
    render(<CampusOnboardingView />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. ABC College of Engineering/i) as HTMLInputElement;
    const codeInput = screen.getByPlaceholderText(/e\.g\. ABCEC/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Test Engineering College" } });
    fireEvent.change(codeInput, { target: { value: "TEC" } });

    expect(nameInput.value).toBe("Test Engineering College");
    expect(codeInput.value).toBe("TEC");
  });
});
