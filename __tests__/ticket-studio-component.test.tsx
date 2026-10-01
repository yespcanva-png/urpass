import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TicketStudio from "@/components/studio/TicketStudio";

// ── Mock navigation ──────────────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), back: vi.fn(), push: vi.fn() }),
  usePathname: () => "/studio/evt-1",
  useParams: () => ({ eventId: "evt-1" }),
}));

// ── Mock server actions & API routes ──────────────────────────────────────────
vi.mock("@/app/actions/ticket-design", () => ({
  saveTicketDesign: vi.fn().mockResolvedValue({ success: true }),
  sendTestTicketEmail: vi.fn().mockResolvedValue({ success: true }),
}));

describe("URPASS Ticket Studio (Professional 2-Panel Ticket Customization Interface)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url === "/api/studio/save") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        });
      }
      if (url === "/api/studio/test-email") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });
    });
  });

  it("renders the 2-panel editor structure and core workflow indicator", () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
        eventDate="03 OCT 2026 | 10:00 AM"
        venue="The Residency, Coimbatore"
      />
    );

    expect(screen.getByText("Ticket Studio")).toBeInTheDocument();
    expect(screen.getByText("Workflow:")).toBeInTheDocument();
    expect(screen.getAllByText(/template/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/branding/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/content/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders the left control panel sections", () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    expect(screen.getAllByText(/1\. Template/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/2\. Branding/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/3\. Ticket Content/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("4. QR / Pass Settings")).toBeInTheDocument();
    expect(screen.getByText("5. Background")).toBeInTheDocument();
    expect(screen.getByText("6. Advanced Options")).toBeInTheDocument();
  });

  it("renders Change Template action and quick template switches in Template section", () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    expect(screen.getByRole("button", { name: /change template/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^minimal$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^event$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^dark$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^modern$/i })).toBeInTheDocument();
  });

  it("renders compact logo upload, brand color picker, and hex value in Branding section", () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    expect(screen.getByText("Event Logo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload logo/i })).toBeInTheDocument();
    expect(screen.getByText("Brand Color")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("#635BFF")).toBeInTheDocument();
  });

  it("renders dynamic ticket fields with checkboxes and reorder handles in Content section", () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    expect(screen.getByRole("checkbox", { name: /attendee name/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /ticket type/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /event date/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /venue/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /ticket id/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /company/i })).toBeInTheDocument();
  });

  it("renders QR settings and scan contrast safety notice", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    // Expand QR section
    await userEvent.click(screen.getByText("4. QR / Pass Settings"));

    expect(screen.getByText("QR Target Size")).toBeInTheDocument();
    expect(screen.getByText("QR Position")).toBeInTheDocument();
    expect(screen.getByText("Show QR safety border")).toBeInTheDocument();
    expect(screen.getByText(/Keep sufficient contrast for reliable scanning/i)).toBeInTheDocument();
  });

  it("renders realistic sample attendee data on the live ticket preview", () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="URPASS Summit 2026"
        eventDate="12 Oct 2026 | 10:00 AM"
        venue="Bengaluru"
      />
    );

    // Event Name
    const headings = screen.getAllByRole("heading", { name: /urpass summit 2026/i });
    expect(headings.length).toBeGreaterThanOrEqual(1);

    // Attendee Name
    expect(screen.getAllByText("Aarav Mehta").length).toBeGreaterThanOrEqual(1);

    // Ticket Type
    expect(screen.getAllByText(/vip delegate/i).length).toBeGreaterThanOrEqual(1);

    // Ticket ID
    expect(screen.getAllByText("#URP-02891").length).toBeGreaterThanOrEqual(1);

    // Date & Venue
    expect(screen.getAllByText("12 Oct 2026 | 10:00 AM").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Bengaluru").length).toBeGreaterThanOrEqual(1);

    // QR scan notice
    expect(screen.getByText("SCAN FOR ENTRY")).toBeInTheDocument();
  });

  it("allows switching sample attendees to preview different guest data", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="URPASS Summit 2026"
      />
    );

    expect(screen.getAllByText("Aarav Mehta").length).toBeGreaterThanOrEqual(1);

    // Click on Priya sample attendee button
    const priyaBtn = screen.getByRole("button", { name: /Priya/i });
    await userEvent.click(priyaBtn);

    expect(screen.getAllByText("Priya Sharma").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("#URP-07340").length).toBeGreaterThanOrEqual(1);
  });

  it("allows format switching between Mobile, Badge, and Print", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="URPASS Summit 2026"
      />
    );

    const badgeBtn = screen.getByRole("button", { name: /^badge$/i });
    await userEvent.click(badgeBtn);
    expect(screen.getByText("AARAV MEHTA")).toBeInTheDocument();

    const printBtn = screen.getByRole("button", { name: /^print$/i });
    await userEvent.click(printBtn);
    expect(screen.getByText("OFFICIAL ADMISSION")).toBeInTheDocument();
    expect(screen.getByText("GATE STUB")).toBeInTheDocument();
  });

  it("opens Send Test modal and submits test pass to email", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="URPASS Summit 2026"
      />
    );

    // Click Send test button
    const testBtns = screen.getAllByRole("button", { name: /send test/i });
    await userEvent.click(testBtns[0]);

    expect(screen.getByRole("heading", { name: /send test ticket/i })).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/organizer@example\.com/i);
    await userEvent.type(emailInput, "organizer@test.com");

    await userEvent.click(screen.getByRole("button", { name: /send pass/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/studio/test-email",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("organizer@test.com"),
        })
      );
    });
  });

  it("calls manual save when Save & Apply button is clicked", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    const saveBtns = screen.getAllByRole("button", { name: /save & apply/i });
    await userEvent.click(saveBtns[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/studio/save",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"eventId":"evt-1"'),
        })
      );
    });
  });
});
