import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PersonalConciergeBanner from "@/components/dashboard/PersonalConciergeBanner";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
    },
  })),
}));

describe("PersonalConciergeBanner Targeted User Visibility", () => {
  it("renders targeted setup banner for isha28368@gmail.com", () => {
    const { container } = render(<PersonalConciergeBanner userEmail="isha28368@gmail.com" />);
    expect(screen.getByText(/Hi Isha! We can help you set up UrPass for your event/i)).toBeDefined();
    expect(screen.getByText(/Pilani Garba Night Season 2/i)).toBeDefined();
    expect(screen.getAllByText(/9001270298/i).length).toBeGreaterThanOrEqual(1);

    const link = container.querySelector('a[href*="wa.me/919001270298"]');
    expect(link).not.toBeNull();
  });

  it("renders banner case-insensitively for isha28368@gmail.com", () => {
    render(<PersonalConciergeBanner userEmail="ISHA28368@GMAIL.COM" />);
    expect(screen.getByText(/Hi Isha! We can help you set up UrPass for your event/i)).toBeDefined();
  });

  it("does NOT render for any other user email", () => {
    const { container } = render(<PersonalConciergeBanner userEmail="otherorganizer@gmail.com" />);
    expect(container.firstChild).toBeNull();
  });

  it("does NOT render when userEmail is null or empty", () => {
    const { container } = render(<PersonalConciergeBanner userEmail={null} />);
    expect(container.firstChild).toBeNull();
  });
});
