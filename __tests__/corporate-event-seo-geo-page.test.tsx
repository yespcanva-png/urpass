import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PAGE_001_CORPORATE_CONFIG } from "@/lib/seo/templates/page-001-corporate";
import SeoGeoLandingTemplate from "@/components/seo/SeoGeoLandingTemplate";
import CorporateEventRegistrationSoftwarePage, {
  metadata,
} from "@/app/solutions/corporate-event-registration-software/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/solutions/corporate-event-registration-software",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  }),
}));

// Mock fetch for lead submission
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ success: true }),
}) as any;

describe("Page 001 — Corporate Event Registration Software", () => {
  it("has correct page configuration and metadata", () => {
    expect(PAGE_001_CORPORATE_CONFIG.slug).toBe("corporate-event-registration-software");
    expect(PAGE_001_CORPORATE_CONFIG.canonicalUrl).toBe(
      "https://urpass.space/solutions/corporate-event-registration-software"
    );
    expect(PAGE_001_CORPORATE_CONFIG.primaryKeyword).toBe("Corporate event registration software");
    expect(metadata.title).toBe("Corporate Event Registration Software | UrPass");
    expect(metadata.description).toContain("Simplify corporate event registration with UrPass");
  });

  it("renders all sections specified in the prompt", () => {
    render(<CorporateEventRegistrationSoftwarePage />);

    // 1. Hero H1 and Subtitles
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Corporate Event Registration Software That Simplifies Every Check-In/i,
      })
    ).toBeDefined();
    expect(
      screen.getByText(/Plan your corporate event\. Manage registrations\. Welcome every attendee with confidence\./i)
    ).toBeDefined();

    // 2. Problem section
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Organizing a Corporate Event Shouldn't Be Complicated/i,
      })
    ).toBeDefined();

    // 3. GEO-ready answer block
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /What is UrPass corporate event registration software\?/i,
      })
    ).toBeDefined();
    expect(
      screen.getByText(
        /UrPass is an event registration and digital ticketing platform that helps corporate event organizers create registration forms, manage attendees, issue QR passes, scan tickets at entry, and monitor attendance\./i
      )
    ).toBeDefined();

    // 4. Core Capabilities (Everything You Need to Manage Corporate Event Registrations)
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Everything You Need to Manage Corporate Event Registrations/i,
      })
    ).toBeDefined();
    expect(screen.getByText(/Create a Professional Event Registration Page/i)).toBeDefined();
    expect(screen.getByText(/Collect the Information You Actually Need/i)).toBeDefined();
    expect(screen.getByText(/Issue Digital QR Event Passes/i)).toBeDefined();
    expect(screen.getByText(/Make Event Entry Faster With QR Scanning/i)).toBeDefined();
    expect(screen.getAllByText(/Monitor Event Attendance/i).length).toBeGreaterThanOrEqual(1);

    // 5. How It Works (5 Steps)
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /How Corporate Event Registration Works With UrPass/i,
      })
    ).toBeDefined();
    expect(screen.getByText(/Create your event/i)).toBeDefined();
    expect(screen.getByText(/Customize registrations/i)).toBeDefined();
    expect(screen.getByText(/Share your registration link/i)).toBeDefined();
    expect(screen.getByText(/Distribute digital passes/i)).toBeDefined();
    expect(screen.getByText(/Scan and manage attendance/i)).toBeDefined();

    // 6. Built for Different Types of Corporate Events
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Built for Different Types of Corporate Events/i,
      })
    ).toBeDefined();
    expect(screen.getByText(/Employee Engagement Events/i)).toBeDefined();
    expect(screen.getAllByText(/Corporate Conferences/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Seminars and Workshops/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Product Launches/i)).toBeDefined();
    expect(screen.getAllByText(/Business Networking Events/i).length).toBeGreaterThanOrEqual(1);

    // 7. Comparison Table
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Why Use UrPass Instead of Manual Registration\?/i,
      })
    ).toBeDefined();
    expect(screen.getAllByText(/Registration spreadsheets/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Centralized attendee records/i)).toBeDefined();
    expect(screen.getAllByText(/Printed guest lists/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Digital QR passes/i).length).toBeGreaterThanOrEqual(1);

    // 8. Who Can Use UrPass
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Who Can Use UrPass for Corporate Events\?/i,
      })
    ).toBeDefined();
    expect(screen.getByText(/HR and employee engagement teams/i)).toBeDefined();
    expect(screen.getByText(/Event management agencies/i)).toBeDefined();

    // 9. All 7 FAQs
    expect(screen.getByText(/Corporate Event Registration: Frequently Asked Questions/i)).toBeDefined();
    expect(
      screen.getByText(/Can UrPass help prevent duplicate check-ins\?/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Can I create a corporate event registration form online\?/i)
    ).toBeDefined();

    // 10. Sales Form & CTAs
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /Need Help Setting Up Your Corporate Event\?/i,
      })
    ).toBeDefined();
    expect(screen.getByPlaceholderText(/e\.g\. Priya Sharma/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/e\.g\. priya@company\.com/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/e\.g\. Acme Enterprise/i)).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Request a Corporate Event Demo/i })
    ).toBeDefined();
  });

  it("submits the corporate demo request and shows confirmation", async () => {
    render(<CorporateEventRegistrationSoftwarePage />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Priya Sharma/i);
    const emailInput = screen.getByPlaceholderText(/e\.g\. priya@company\.com/i);
    const companyInput = screen.getByPlaceholderText(/e\.g\. Acme Enterprise/i);
    const submitBtn = screen.getByRole("button", { name: /Request a Corporate Event Demo/i });

    fireEvent.change(nameInput, { target: { value: "Aarav Mehta" } });
    fireEvent.change(emailInput, { target: { value: "aarav@techfirm.com" } });
    fireEvent.change(companyInput, { target: { value: "TechFirm Global" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Demo Request Received!/i)).toBeDefined();
      expect(screen.getByText(/aarav@techfirm\.com/i)).toBeDefined();
    });
  });
});
