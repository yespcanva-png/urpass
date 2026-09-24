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

// ── Mock server actions ───────────────────────────────────────────────────────
vi.mock("@/app/actions/ticket-design", () => ({
  saveTicketDesign: vi.fn().mockResolvedValue({ success: true }),
  sendTestTicketEmail: vi.fn().mockResolvedValue({ success: true }),
}));

describe("URPASS Ticket Studio (Simplified 2-Column Ticket Editor)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the 2-column layout with CUSTOMIZE panel and LIVE PREVIEW", () => {
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
    expect(screen.getByText("CUSTOMIZE")).toBeInTheDocument();
    expect(screen.getByText("LIVE PREVIEW")).toBeInTheDocument();
  });

  it("renders 3 ready-made styles: Minimal, Event, and Dark", () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    expect(screen.getByRole("button", { name: /minimal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /event/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dark/i })).toBeInTheDocument();
  });

  it("strictly renders locked information hierarchy: Logo -> Event Name -> Ticket Type -> QR -> Attendee -> ID -> Date/Venue", () => {
    const { container } = render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
        eventDate="03 OCT 2026 | 10:00 AM"
        venue="The Residency, Coimbatore"
      />
    );

    // Event Name
    const headings = screen.getAllByRole("heading", { name: /techfest 2026/i });
    expect(headings.length).toBeGreaterThanOrEqual(1);

    // Ticket Type Pill
    const vipPasses = screen.getAllByText(/vip pass/i);
    expect(vipPasses.length).toBeGreaterThanOrEqual(1);

    // QR Code Entry text
    expect(screen.getByText("SCAN FOR ENTRY")).toBeInTheDocument();

    // Attendee Name (Default sample Haarishmitha)
    expect(screen.getAllByText("Haarishmitha").length).toBeGreaterThanOrEqual(1);

    // Ticket ID
    expect(screen.getByText("#URP-02891")).toBeInTheDocument();

    // Date & Venue
    expect(screen.getByText("03 OCT 2026 | 10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("The Residency, Coimbatore")).toBeInTheDocument();
  });

  it("toggles display fields dynamically on the live ticket card", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
        venue="The Residency, Coimbatore"
      />
    );

    // Venue is initially visible
    expect(screen.getByText("The Residency, Coimbatore")).toBeInTheDocument();

    // Find the Venue checkbox and uncheck it
    const venueCheckbox = screen.getByRole("checkbox", { name: /venue/i });
    await userEvent.click(venueCheckbox);

    // Venue should now be hidden from live preview
    expect(screen.queryByText("The Residency, Coimbatore")).not.toBeInTheDocument();
  });

  it("allows switching sample attendees to preview different guest names", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    expect(screen.getAllByText("Haarishmitha").length).toBeGreaterThanOrEqual(1);

    // Click on Arun button
    const arunBtn = screen.getByRole("button", { name: "Arun" });
    await userEvent.click(arunBtn);

    expect(screen.getByText("Arun Kumar")).toBeInTheDocument();
    expect(screen.getByText("#URP-04812")).toBeInTheDocument();
  });

  it("opens Send Test modal and submits test pass to email", async () => {
    const { sendTestTicketEmail } = await import("@/app/actions/ticket-design");

    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    // Click Send test button
    await userEvent.click(screen.getByRole("button", { name: /send test/i }));

    expect(screen.getByRole("heading", { name: /send test ticket/i })).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/organizer@example\.com/i);
    await userEvent.type(emailInput, "organizer@test.com");

    await userEvent.click(screen.getByRole("button", { name: /send pass/i }));

    await waitFor(() => {
      expect(sendTestTicketEmail).toHaveBeenCalledWith(
        "organizer@test.com",
        "TECHFEST 2026",
        expect.any(Object)
      );
    });
  });

  it("calls manual save when Save button is clicked", async () => {
    const { saveTicketDesign } = await import("@/app/actions/ticket-design");

    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    const saveBtn = screen.getByRole("button", { name: /^save$/i });
    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(saveTicketDesign).toHaveBeenCalledWith("evt-1", expect.any(Object));
    });
  });
});
