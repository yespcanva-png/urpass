import { describe, it, expect, vi } from "vitest";
import { isTableMissingError } from "@/lib/org/fallback-store";

describe("Workspaces and Locations Fallback & Schema Resilience", () => {
  it("detects PostgREST schema cache missing errors", () => {
    expect(isTableMissingError({ code: "PGRST205", message: "Could not find the table 'public.workspaces' in the schema cache" })).toBe(true);
    expect(isTableMissingError({ code: "42P01", message: 'relation "public.workspaces" does not exist' })).toBe(true);
    expect(isTableMissingError(null)).toBe(false);
    expect(isTableMissingError({ code: "23505", message: "duplicate key value" })).toBe(false);
  });
});
