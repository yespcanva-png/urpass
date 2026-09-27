import { describe, it, expect } from "vitest";
import {
  institutionSchema,
  departmentSchema,
  clubSchema,
  campusMemberSchema,
  campusStudentSchema,
  eventApprovalSchema,
} from "@/lib/validations/campus";
import {
  getCurrentAcademicYear,
  getAcademicYearOptions,
  isValidAcademicYear,
} from "@/lib/campus/academic-year";

describe("Campus Validation Schemas & Models", () => {
  describe("Institution Schema", () => {
    it("validates a valid institution payload", () => {
      const valid = {
        name: "ABC Engineering College",
        institution_code: "ABCENG",
        website: "https://abc.edu.in",
        email_domain: "abc.edu.in",
        address: "Avinashi Road, Coimbatore",
        current_academic_year: "2026-27",
        require_event_approval: true,
      };

      const result = institutionSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.institution_code).toBe("ABCENG");
      }
    });

    it("rejects invalid institution codes with lowercase or special chars", () => {
      const invalid = {
        name: "Test College",
        institution_code: "invalid code!",
      };
      const result = institutionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("Department Schema", () => {
    it("validates department creation payload", () => {
      const valid = {
        name: "Computer Science and Engineering",
        code: "CSE",
        description: "Department of CSE",
        color: "#6D28D9",
      };
      const result = departmentSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("CSE");
      }
    });

    it("rejects short department codes", () => {
      const result = departmentSchema.safeParse({
        name: "Computer Science",
        code: "C",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Club Schema", () => {
    it("validates a department club", () => {
      const valid = {
        name: "Coding Club",
        department_id: "c8e22c0c-8e3b-4c28-98e3-5eb712ffca78",
        category: "department_club",
        description: "Competitive programming and hackathons",
      };
      const result = clubSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.category).toBe("department_club");
      }
    });

    it("allows institution-level units with department_id null", () => {
      const valid = {
        name: "Placement & Training Cell",
        department_id: null,
        category: "cell",
        description: "Campus placement drives and corporate relations",
      };
      const result = clubSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.department_id).toBeNull();
        expect(result.data.category).toBe("cell");
      }
    });
  });

  describe("Campus Member Schema", () => {
    it("validates all 5 campus roles", () => {
      const roles = [
        "INSTITUTION_ADMIN",
        "DEPARTMENT_ADMIN",
        "CLUB_ADMIN",
        "ORGANIZER",
        "SCANNER",
      ] as const;

      for (const role of roles) {
        const result = campusMemberSchema.safeParse({
          invited_email: "faculty@college.edu",
          role,
        });
        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid role strings", () => {
      const result = campusMemberSchema.safeParse({
        invited_email: "test@college.edu",
        role: "SUPER_ADMIN",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Campus Student Directory Schema", () => {
    it("validates a student record", () => {
      const valid = {
        roll_number: "22CSE042",
        student_id: "STU-9821",
        name: "Aravind Kumar",
        email: "aravind.22cse@college.edu",
        phone: "+91 9876543210",
        year: 3,
        section: "B",
      };
      const result = campusStudentSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.roll_number).toBe("22CSE042");
        expect(result.data.year).toBe(3);
      }
    });

    it("rejects invalid years outside 1-5 range", () => {
      const invalid = {
        roll_number: "22CSE042",
        name: "Aravind",
        email: "aravind@college.edu",
        year: 8,
      };
      const result = campusStudentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("Event Approval Schema", () => {
    it("validates approve, reject, and request_changes actions", () => {
      expect(eventApprovalSchema.safeParse({ action: "approve" }).success).toBe(true);
      expect(
        eventApprovalSchema.safeParse({
          action: "reject",
          reason: "Venue double-booked",
        }).success
      ).toBe(true);
      expect(
        eventApprovalSchema.safeParse({
          action: "request_changes",
          reason: "Please attach budget approval",
        }).success
      ).toBe(true);
    });
  });

  describe("Academic Year Utilities", () => {
    it("computes academic year string accurately for different months", () => {
      // September 2026 -> 2026-27
      const sept2026 = new Date(2026, 8, 27);
      expect(getCurrentAcademicYear(sept2026)).toBe("2026-27");

      // February 2027 -> 2026-27
      const feb2027 = new Date(2027, 1, 15);
      expect(getCurrentAcademicYear(feb2027)).toBe("2026-27");

      // July 2027 -> 2027-28
      const july2027 = new Date(2027, 6, 1);
      expect(getCurrentAcademicYear(july2027)).toBe("2027-28");
    });

    it("returns standard academic year options", () => {
      const options = getAcademicYearOptions(2026);
      expect(options).toContain("2026-27");
      expect(options).toContain("2025-26");
      expect(options).toContain("2027-28");
    });

    it("validates academic year regex string", () => {
      expect(isValidAcademicYear("2026-27")).toBe(true);
      expect(isValidAcademicYear("2026-2027")).toBe(true);
      expect(isValidAcademicYear("invalid-year")).toBe(false);
    });
  });
});
