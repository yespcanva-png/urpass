import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DepartmentListView from "@/components/campus/DepartmentListView";
import DepartmentDetailView from "@/components/campus/DepartmentDetailView";
import type { CampusDepartment, CampusDepartmentDetailData, Institution } from "@/types/campus";

// ── Mock Next.js navigation ───────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
  usePathname: () => "/dashboard/campus/departments",
  useSearchParams: () => new URLSearchParams(),
}));

// ── Mock Actions ─────────────────────────────────────────────────────────────
vi.mock("@/app/actions/campus/departments", () => ({
  createCampusDepartment: vi.fn().mockResolvedValue({ data: { id: "dept-new" } }),
}));

vi.mock("@/app/actions/campus/clubs", () => ({
  createCampusClub: vi.fn().mockResolvedValue({ data: { id: "club-new" } }),
}));

vi.mock("@/app/actions/campus/members", () => ({
  inviteCampusMember: vi.fn().mockResolvedValue({ data: { id: "member-new" } }),
}));

describe("DepartmentListView", () => {
  const mockInstitution: Institution = {
    id: "inst-1",
    name: "ABC Institute of Technology",
    institution_code: "ABCIT",
    logo_url: null,
    website: null,
    email_domain: null,
    address: null,
    current_academic_year: "2026-27",
    primary_admin_id: "user-1",
    subscription_tier: "campus",
    require_event_approval: true,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockDepartments: CampusDepartment[] = [
    {
      id: "dept-cse",
      institution_id: "inst-1",
      name: "Computer Science and Engineering",
      code: "CSE",
      slug: "computer-science-and-engineering",
      description: "Center of computing excellence and software development.",
      color: "#6D28D9",
      head_of_department_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      events_count: 12,
      clubs_count: 4,
      students_count: 450,
      organizers_count: 6,
    },
    {
      id: "dept-ece",
      institution_id: "inst-1",
      name: "Electronics and Communication",
      code: "ECE",
      slug: "electronics-and-communication",
      description: "Robotics, VLSI, and signal processing.",
      color: "#0284C7",
      head_of_department_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      events_count: 8,
      clubs_count: 2,
      students_count: 320,
      organizers_count: 3,
    },
  ];

  it("renders page header and list of departments", () => {
    render(<DepartmentListView institution={mockInstitution} departments={mockDepartments} />);

    expect(screen.getByText("Academic Departments")).toBeInTheDocument();
    expect(screen.getByText("ABCIT")).toBeInTheDocument();
    expect(screen.getByText("Computer Science and Engineering")).toBeInTheDocument();
    expect(screen.getByText("Electronics and Communication")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument(); // CSE events count
  });

  it("filters departments when typing into search input", () => {
    render(<DepartmentListView institution={mockInstitution} departments={mockDepartments} />);

    const searchInput = screen.getByPlaceholderText(/Search by department name or code/i);
    fireEvent.change(searchInput, { target: { value: "ECE" } });

    expect(screen.queryByText("Computer Science and Engineering")).toBeNull();
    expect(screen.getByText("Electronics and Communication")).toBeInTheDocument();
  });

  it("opens create department modal", () => {
    render(<DepartmentListView institution={mockInstitution} departments={mockDepartments} />);

    const addBtn = screen.getByRole("button", { name: /Add Department/i });
    fireEvent.click(addBtn);

    expect(screen.getByPlaceholderText(/e\.g\. Computer Science and Engineering/i)).toBeInTheDocument();
  });
});

describe("DepartmentDetailView", () => {
  const mockDetailData: CampusDepartmentDetailData = {
    department: {
      id: "dept-cse",
      institution_id: "inst-1",
      name: "Computer Science and Engineering",
      code: "CSE",
      slug: "cse",
      description: "Computing department",
      color: "#6D28D9",
      head_of_department_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    stats: {
      eventsThisYear: 14,
      totalRegistrations: 1420,
      totalCheckIns: 1150,
      averageAttendance: 81,
    },
    events: [
      {
        id: "evt-symp-1",
        name: "National CS Symposium 2026",
        event_date: "2026-11-20",
        venue: "Tech Auditorium",
        status: "active",
        approval_status: "approved",
        department_name: "Computer Science and Engineering",
        department_code: "CSE",
        registrations_count: 500,
        attendees_count: 420,
        attendance_rate: 84,
      },
    ],
    clubs: [
      {
        id: "club-coding",
        institution_id: "inst-1",
        department_id: "dept-cse",
        name: "Coding & Algorithmic Club",
        slug: "coding-club",
        category: "department_club",
        description: "Competitive programming and open source.",
        color: "#6D28D9",
        faculty_advisor_id: null,
        lead_student_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        events_count: 5,
      },
    ],
    organizers: [
      {
        id: "mem-1",
        institution_id: "inst-1",
        user_id: "usr-1",
        department_id: "dept-cse",
        club_id: null,
        role: "DEPARTMENT_ADMIN",
        invited_email: "hod.cse@college.edu",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  };

  it("renders department information and 4 key statistics", () => {
    render(<DepartmentDetailView data={mockDetailData} />);

    expect(screen.getByText("Computer Science and Engineering")).toBeInTheDocument();
    expect(screen.getAllByText("CSE")[0]).toBeInTheDocument();

    // 4 Key Statistics Cards
    expect(screen.getByText("Events This Year")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();

    expect(screen.getByText("Total Registrations")).toBeInTheDocument();
    expect(screen.getByText("1,420")).toBeInTheDocument();

    expect(screen.getByText("Total Check-Ins")).toBeInTheDocument();
    expect(screen.getByText("1,150")).toBeInTheDocument();

    expect(screen.getByText("Average Attendance")).toBeInTheDocument();
    expect(screen.getByText("81%")).toBeInTheDocument();
  });

  it("renders events tab and event row", () => {
    render(<DepartmentDetailView data={mockDetailData} />);

    expect(screen.getByText(/Department Events \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText("National CS Symposium 2026")).toBeInTheDocument();
    expect(screen.getByText("Tech Auditorium")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("420")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("switches to clubs tab and renders club card", () => {
    render(<DepartmentDetailView data={mockDetailData} />);

    const clubsTab = screen.getByRole("button", { name: /Clubs & Cells \(1\)/i });
    fireEvent.click(clubsTab);

    expect(screen.getByText("Coding & Algorithmic Club")).toBeInTheDocument();
    expect(screen.getByText(/Competitive programming and open source/i)).toBeInTheDocument();
    expect(screen.getByText("5 events")).toBeInTheDocument();
  });

  it("switches to organizers tab and renders member details", () => {
    render(<DepartmentDetailView data={mockDetailData} />);

    const organizersTab = screen.getByRole("button", { name: /Organizers \(1\)/i });
    fireEvent.click(organizersTab);

    expect(screen.getByText("hod.cse@college.edu")).toBeInTheDocument();
    expect(screen.getByText("DEPARTMENT ADMIN")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });
});
