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

describe("URPASS Ticket Studio (4-Section Clean Ticket Editor)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the 4 core sections: Design, Content, Branding, Delivery", () => {
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
    expect(screen.getByRole("button", { name: /design/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /content/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /branding/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delivery/i })).toBeInTheDocument();
    expect(screen.getByText("LIVE PREVIEW")).toBeInTheDocument();
  });

  it("renders 3 ready-made templates, ticket shapes, and category colors in Design section", () => {
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
    expect(screen.getByText("Ticket Shape")).toBeInTheDocument();
    expect(screen.getByText("Ticket Type Colors")).toBeInTheDocument();
    expect(screen.getByText("QR Safety Zone Active")).toBeInTheDocument();
  });

  it("renders dynamic ticket fields and ticket rules in Content section", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
        venue="The Residency, Coimbatore"
      />
    );

    // Switch to Content tab
    await userEvent.click(screen.getByRole("button", { name: /content/i }));

    expect(screen.getByText("Dynamic Ticket Fields")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /attendee name/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /venue/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /company \/ college/i })).toBeInTheDocument();
    expect(screen.getByText("Ticket Rules")).toBeInTheDocument();
    expect(screen.getAllByText(/valid for one entry/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders event logo and sponsor logo in Branding section", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    // Switch to Branding tab
    await userEvent.click(screen.getByRole("button", { name: /branding/i }));

    expect(screen.getByText("Event / Company Logo")).toBeInTheDocument();
    expect(screen.getByText(/sponsor logo/i)).toBeInTheDocument();
  });

  it("renders mobile/email view modes and design status in Delivery section", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    // Switch to Delivery tab
    await userEvent.click(screen.getByRole("button", { name: /delivery/i }));

    expect(screen.getByText("Mobile / Email Preview Mode")).toBeInTheDocument();
    expect(screen.getByText("Design Status")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send test to organizer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download sample pass/i })).toBeInTheDocument();
  });

  it("strictly renders locked information hierarchy on live preview: Logo -> Event Name -> Ticket Type -> QR -> Attendee -> ID -> Date/Venue", () => {
    render(
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
    const vipPasses = screen.getAllByText(/vip/i);
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

  it("switches section and maintains persistent selection when clicking elements on live preview", async () => {
    render(
      <TicketStudio
        isPro={true}
        eventId="evt-1"
        eventName="TECHFEST 2026"
      />
    );

    // Initial section is Design
    expect(screen.getByText("3 Design Templates")).toBeInTheDocument();

    // Click on Logo element on preview
    const logoEl = screen.getByTitle(/click to customize logo & branding/i);
    await userEvent.click(logoEl);

    // Should switch to Branding section and keep logo selected
    expect(screen.getByText("Event / Company Logo")).toBeInTheDocument();

    // Click on Attendee name on preview
    const attendeeEl = screen.getByTitle(/click to customize attendee name & fields/i);
    await userEvent.click(attendeeEl);

    // Should switch to Content section
    expect(screen.getByText("Dynamic Ticket Fields")).toBeInTheDocument();

    // Verify printable-ticket-card exists for clean printing
    expect(document.getElementById("printable-ticket-card")).toBeInTheDocument();
  });
});
