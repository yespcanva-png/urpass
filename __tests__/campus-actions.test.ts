import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Next.js server modules ───────────────────────────────────────────────
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

function createMockQuery(defaultData: unknown = null) {
  const query: Record<string, unknown> = {};
  query.select = vi.fn().mockReturnValue(query);
  query.insert = vi.fn().mockReturnValue(query);
  query.update = vi.fn().mockReturnValue(query);
  query.delete = vi.fn().mockReturnValue(query);
  query.eq = vi.fn().mockReturnValue(query);
  query.not = vi.fn().mockReturnValue(query);
  query.is = vi.fn().mockReturnValue(query);
  query.in = vi.fn().mockReturnValue(query);
  query.or = vi.fn().mockReturnValue(query);
  query.order = vi.fn().mockReturnValue(query);
  query.limit = vi.fn().mockReturnValue(query);
  query.single = vi.fn().mockResolvedValue({ data: defaultData, error: null });
  query.maybeSingle = vi.fn().mockResolvedValue({ data: defaultData, error: null });
  query.then = (resolve: (val: unknown) => unknown) =>
    Promise.resolve({ data: defaultData, error: null, count: 0 }).then(resolve);
  return query;
}

function makeSupabase(tableMocks: Record<string, unknown> = {}) {
  const base = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-campus-admin", email: "admin@college.edu" } } }),
    },
    from: vi.fn((table: string) => {
      if (tableMocks[table]) {
        return tableMocks[table];
      }
      return createMockQuery(null);
    }),
  };
  return base;
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
const mockedCreateClient = vi.mocked(createClient);
const mockedCreateAdminClient = vi.mocked(createAdminClient);

describe("Campus Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Institution Actions", () => {
    it("validates and creates an institution", async () => {
      const instQuery = createMockQuery({
        id: "inst-1",
        name: "ABC Engineering College",
        institution_code: "ABCENG",
        current_academic_year: "2026-27",
      });

      const base = makeSupabase({
        institutions: instQuery,
        campus_members: createMockQuery({ id: "mem-1" }),
      });

      mockedCreateClient.mockResolvedValue(base as never);
      mockedCreateAdminClient.mockReturnValue(base as never);

      const { createInstitution } = await import("@/app/actions/campus/institution");
      const res = await createInstitution({
        name: "ABC Engineering College",
        institution_code: "ABCENG",
        current_academic_year: "2026-27",
        require_event_approval: true,
      });

      expect(res.error).toBeUndefined();
      expect(res.data?.institution_code).toBe("ABCENG");
    });
  });

  describe("Department Actions", () => {
    it("creates a department with slug", async () => {
      const deptQuery = createMockQuery({
        id: "dept-1",
        institution_id: "inst-1",
        name: "Computer Science",
        code: "CSE",
        slug: "computer-science",
      });

      const base = makeSupabase({ campus_departments: deptQuery });
      mockedCreateClient.mockResolvedValue(base as never);
      mockedCreateAdminClient.mockReturnValue(base as never);

      const { createCampusDepartment } = await import("@/app/actions/campus/departments");
      const res = await createCampusDepartment("inst-1", {
        name: "Computer Science",
        code: "CSE",
        color: "#6D28D9",
      });

      expect(res.error).toBeUndefined();
      expect(res.data?.code).toBe("CSE");
    });
  });

  describe("Club Actions", () => {
    it("creates a campus club with category", async () => {
      const clubQuery = createMockQuery({
        id: "club-1",
        institution_id: "inst-1",
        name: "Coding Club",
        category: "department_club",
      });

      const base = makeSupabase({ campus_clubs: clubQuery });
      mockedCreateClient.mockResolvedValue(base as never);
      mockedCreateAdminClient.mockReturnValue(base as never);

      const { createCampusClub } = await import("@/app/actions/campus/clubs");
      const res = await createCampusClub("inst-1", {
        name: "Coding Club",
        category: "department_club",
      });

      expect(res.error).toBeUndefined();
      expect(res.data?.name).toBe("Coding Club");
    });
  });

  describe("Event Approval Actions", () => {
    it("submits event for approval", async () => {
      const eventQuery = createMockQuery({ id: "evt-1" });
      const base = makeSupabase({ events: eventQuery });
      mockedCreateClient.mockResolvedValue(base as never);
      mockedCreateAdminClient.mockReturnValue(base as never);

      const { submitEventForApproval } = await import("@/app/actions/campus/event-approval");
      const res = await submitEventForApproval("evt-1");
      expect(res.error).toBeUndefined();
    });

    it("approves campus event and sets status to active", async () => {
      const eventQuery = createMockQuery({ id: "evt-1" });
      const base = makeSupabase({ events: eventQuery });
      mockedCreateClient.mockResolvedValue(base as never);
      mockedCreateAdminClient.mockReturnValue(base as never);

      const { approveCampusEvent } = await import("@/app/actions/campus/event-approval");
      const res = await approveCampusEvent("evt-1");
      expect(res.error).toBeUndefined();
    });
  });

  describe("Student Directory Actions", () => {
    it("imports students from CSV content", async () => {
      const deptQuery = createMockQuery([{ id: "dept-1", code: "CSE", name: "Computer Science" }]);
      const studentQuery = createMockQuery(null);

      const base = makeSupabase({
        campus_departments: deptQuery,
        campus_students: studentQuery,
      });
      mockedCreateClient.mockResolvedValue(base as never);
      mockedCreateAdminClient.mockReturnValue(base as never);

      const csvData = `roll_number,name,email,department,year,section
22CSE01,Rohan Sharma,rohan@college.edu,CSE,3,A
22CSE02,Priya Nair,priya@college.edu,CSE,3,B`;

      const { importCampusStudentsCSV } = await import("@/app/actions/campus/students");
      const result = await importCampusStudentsCSV("inst-1", csvData);

      expect(result.added).toBe(2);
      expect(result.errors.length).toBe(0);
    });
  });

  describe("Analytics Export", () => {
    it("exports department analytics as CSV", async () => {
      const deptQuery = createMockQuery([
        { id: "dept-1", name: "Computer Science", code: "CSE", color: "#6D28D9" },
      ]);
      const eventQuery = createMockQuery([{ id: "evt-1" }]);
      const clubQuery = createMockQuery([{ id: "club-1" }]);
      const attendeeQuery = createMockQuery([]);
      const passQuery = createMockQuery([]);

      const base = makeSupabase({
        campus_departments: deptQuery,
        events: eventQuery,
        campus_clubs: clubQuery,
        attendees: attendeeQuery,
        passes: passQuery,
      });
      mockedCreateClient.mockResolvedValue(base as never);

      const { exportCampusAnalyticsCSV } = await import("@/app/actions/campus/analytics");
      const csv = await exportCampusAnalyticsCSV("inst-1", "2026-27");

      expect(csv).toContain("Department Name");
      expect(csv).toContain("Computer Science");
      expect(csv).toContain("CSE");
    });
  });
});
