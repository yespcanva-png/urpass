import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ClubListView from "@/components/campus/ClubListView";
import ClubDetailView from "@/components/campus/ClubDetailView";
import type { CampusClub, CampusClubDetailData, CampusDepartment, Institution } from "@/types/campus";

// ── Mock Next.js navigation ───────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
  usePathname: () => "/dashboard/campus/clubs",
  useSearchParams: () => new URLSearchParams(),
}));

// ── Mock Actions ─────────────────────────────────────────────────────────────
vi.mock("@/app/actions/campus/clubs", () => ({
  createCampusClub: vi.fn().mockResolvedValue({ data: { id: "club-new" } }),
}));

vi.mock("@/app/actions/campus/members", () => ({
  inviteCampusMember: vi.fn().mockResolvedValue({ data: { id: "member-new" } }),
}));

describe("ClubListView", () => {
  const mockInstitution: Institution = {
    id: "inst-1",
    name: "St. Xavier College of Engineering",
    institution_code: "SXCE",
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
      name: "Computer Science",
      code: "CSE",
      slug: "cse",
      description: null,
      color: "#6D28D9",
      head_of_department_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "dept-ece",
      institution_id: "inst-1",
      name: "Electronics & Communication",
      code: "ECE",
      slug: "ece",
      description: null,
      color: "#0284C7",
      head_of_department_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const mockClubs: CampusClub[] = [
    {
      id: "club-ai",
      institution_id: "inst-1",
      department_id: "dept-cse",
      name: "AI & Machine Learning Club",
      slug: "ai-club",
      category: "department_club",
      description: "Deep learning workshops and research seminars.",
      color: "#6D28D9",
      faculty_advisor_id: null,
      lead_student_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      events_count: 6,
      department: mockDepartments[0],
    },
    {
      id: "cell-placement",
      institution_id: "inst-1",
      department_id: null, // Institution-level unit
      name: "Campus Placement Cell",
      slug: "placement-cell",
      category: "cell",
      description: "Drive recruitment, resume clinics, and campus interviews.",
      color: "#059669",
      faculty_advisor_id: null,
      lead_student_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      events_count: 14,
      department: null,
    },
    {
      id: "chapter-ieee",
      institution_id: "inst-1",
      department_id: "dept-ece",
      name: "IEEE Student Chapter",
      slug: "ieee-chapter",
      category: "student_chapter",
      description: "Global IEEE technological symposiums and papers.",
      color: "#0284C7",
      faculty_advisor_id: null,
      lead_student_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      events_count: 4,
      department: mockDepartments[1],
    },
  ];

  it("renders page header and list of clubs", () => {
    render(
      <ClubListView
        institution={mockInstitution}
        clubs={mockClubs}
        departments={mockDepartments}
      />
    );

    expect(screen.getByText("Clubs, Cells & Committees")).toBeInTheDocument();
    expect(screen.getByText("SXCE")).toBeInTheDocument();
    expect(screen.getByText("AI & Machine Learning Club")).toBeInTheDocument();
    expect(screen.getByText("Campus Placement Cell")).toBeInTheDocument();
    expect(screen.getByText("IEEE Student Chapter")).toBeInTheDocument();
    expect(screen.getByText("Institution-Level Unit")).toBeInTheDocument();
  });

  it("filters clubs by category dropdown", () => {
    render(
      <ClubListView
        institution={mockInstitution}
        clubs={mockClubs}
        departments={mockDepartments}
      />
    );

    const categorySelect = screen.getByDisplayValue("All Categories");
    fireEvent.change(categorySelect, { target: { value: "cell" } });

    expect(screen.queryByText("AI & Machine Learning Club")).toBeNull();
    expect(screen.getByText("Campus Placement Cell")).toBeInTheDocument();
  });

  it("filters clubs by search keyword", () => {
    render(
      <ClubListView
        institution={mockInstitution}
        clubs={mockClubs}
        departments={mockDepartments}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search clubs, cells, IEEE chapters/i);
    fireEvent.change(searchInput, { target: { value: "IEEE" } });

    expect(screen.queryByText("AI & Machine Learning Club")).toBeNull();
    expect(screen.getByText("IEEE Student Chapter")).toBeInTheDocument();
  });

  it("opens create club modal", () => {
    render(
      <ClubListView
        institution={mockInstitution}
        clubs={mockClubs}
        departments={mockDepartments}
      />
    );

    const addBtn = screen.getByRole("button", { name: /Add Club \/ Cell/i });
    fireEvent.click(addBtn);

    expect(screen.getByPlaceholderText(/e\.g\. AI & Robotics Club, Placement Cell/i)).toBeInTheDocument();
  });
});

describe("ClubDetailView", () => {
  const mockClubDetailData: CampusClubDetailData = {
    club: {
      id: "club-ai",
      institution_id: "inst-1",
      department_id: "dept-cse",
      name: "AI & Machine Learning Club",
      slug: "ai-club",
      category: "department_club",
      description: "Advanced AI workshops and student hackathons.",
      color: "#6D28D9",
      faculty_advisor_id: null,
      lead_student_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      department: {
        id: "dept-cse",
        institution_id: "inst-1",
        name: "Computer Science",
        code: "CSE",
        slug: "cse",
        description: null,
        color: "#6D28D9",
        head_of_department_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
    stats: {
      eventsCount: 5,
      totalRegistrations: 680,
      totalCheckIns: 560,
      averageAttendance: 82,
    },
    events: [
      {
        id: "evt-ai-bootcamp",
        name: "Generative AI Bootcamp",
        event_date: "2026-10-10",
        venue: "Hall 3",
        status: "active",
        approval_status: "approved",
        club_name: "AI & Machine Learning Club",
        registrations_count: 220,
        attendees_count: 185,
        attendance_rate: 84,
      },
    ],
    organizers: [
      {
        id: "mem-lead",
        institution_id: "inst-1",
        user_id: "usr-2",
        department_id: "dept-cse",
        club_id: "club-ai",
        role: "CLUB_ADMIN",
        invited_email: "lead.ai@college.edu",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  };

  it("renders club information and 4 key statistics", () => {
    render(<ClubDetailView data={mockClubDetailData} />);

    expect(screen.getByText("AI & Machine Learning Club")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("department club")).toBeInTheDocument();

    // 4 Key Statistics Cards
    expect(screen.getByText("Total Events")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getAllByText("Registrations")[0]).toBeInTheDocument();
    expect(screen.getByText("680")).toBeInTheDocument();

    expect(screen.getAllByText("Check-Ins")[0]).toBeInTheDocument();
    expect(screen.getByText("560")).toBeInTheDocument();

    expect(screen.getByText("Turnout Rate")).toBeInTheDocument();
    expect(screen.getByText("82%")).toBeInTheDocument();
  });

  it("renders club events tab with details", () => {
    render(<ClubDetailView data={mockClubDetailData} />);

    expect(screen.getByText(/Club Events \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText("Generative AI Bootcamp")).toBeInTheDocument();
    expect(screen.getByText("Hall 3")).toBeInTheDocument();
    expect(screen.getByText("220")).toBeInTheDocument();
    expect(screen.getByText("185")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("switches to organizers tab and renders member details", () => {
    render(<ClubDetailView data={mockClubDetailData} />);

    const orgTab = screen.getByRole("button", { name: /Club Organizers \(1\)/i });
    fireEvent.click(orgTab);

    expect(screen.getByText("lead.ai@college.edu")).toBeInTheDocument();
    expect(screen.getByText("CLUB ADMIN")).toBeInTheDocument();
  });
});
