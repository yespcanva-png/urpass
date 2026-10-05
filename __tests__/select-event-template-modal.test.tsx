import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectEventTemplateModal from "@/components/templates/SelectEventTemplateModal";
import TicketTemplateList from "@/components/templates/TicketTemplateList";
import { STUDIO_TEMPLATES } from "@/lib/studio/templates";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: vi.fn(), back: vi.fn() }),
  usePathname: () => "/ticket-templates",
  useSearchParams: () => new URLSearchParams(),
}));

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  }),
}));

describe("SelectEventTemplateModal & Use Template Workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders event list and allows selecting an event to open in Ticket Studio", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "usr-1", email: "organizer@college.edu" } },
    });

    const mockEvents = [
      {
        id: "evt-101",
        name: "HackCon National Summit",
        event_date: "2026-10-25",
        start_time: "09:00:00",
        venue: "Grand Convention Center",
        status: "active",
        custom_pass_design: null,
      },
      {
        id: "evt-102",
        name: "AI & ML Student Workshop",
        event_date: "2026-11-05",
        start_time: "14:00:00",
        venue: "Auditorium Hall 2",
        status: "draft",
        custom_pass_design: null,
      },
    ];

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockEvents, error: null }),
        }),
      }),
    });

    const template = STUDIO_TEMPLATES[0]; // e.g. Minimal Dark

    render(
      <SelectEventTemplateModal
        isOpen={true}
        onClose={vi.fn()}
        template={template}
      />
    );

    expect(screen.getByText("Choose Event for Template")).toBeInTheDocument();
    expect(screen.getByText(template.name)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("HackCon National Summit")).toBeInTheDocument();
      expect(screen.getByText("AI & ML Student Workshop")).toBeInTheDocument();
    });

    // Click on the first event card
    const firstEventBtn = screen.getByText("HackCon National Summit").closest("button");
    expect(firstEventBtn).toBeInTheDocument();
    fireEvent.click(firstEventBtn!);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/studio/evt-101?template=${encodeURIComponent(template.id)}`);
    });
  });

  it("filters events dynamically when typing in search query", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "usr-1", email: "organizer@college.edu" } },
    });

    const mockEvents = [
      {
        id: "evt-101",
        name: "HackCon National Summit",
        event_date: "2026-10-25",
        venue: "Grand Convention Center",
        status: "active",
      },
      {
        id: "evt-102",
        name: "Cultural Music Fest",
        event_date: "2026-11-05",
        venue: "Open Air Stadium",
        status: "published",
      },
    ];

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockEvents, error: null }),
        }),
      }),
    });

    const template = STUDIO_TEMPLATES[0];

    render(
      <SelectEventTemplateModal
        isOpen={true}
        onClose={vi.fn()}
        template={template}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("HackCon National Summit")).toBeInTheDocument();
      expect(screen.getByText("Cultural Music Fest")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search your events/i);
    fireEvent.change(searchInput, { target: { value: "Music" } });

    expect(screen.queryByText("HackCon National Summit")).not.toBeInTheDocument();
    expect(screen.getByText("Cultural Music Fest")).toBeInTheDocument();
  });

  it("clicking 'Use Template' on template gallery card opens event selection modal", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "usr-1", email: "organizer@college.edu" } },
    });

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    });

    render(<TicketTemplateList isPro={true} isInApp={true} />);

    // Click "Use Template" on the first template card
    const useTemplateButtons = screen.getAllByRole("button", { name: /Use Template/i });
    expect(useTemplateButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(useTemplateButtons[0]);

    // Modal popup should now be visible
    await waitFor(() => {
      expect(screen.getByText("Choose Event for Template")).toBeInTheDocument();
    });
  });
});
