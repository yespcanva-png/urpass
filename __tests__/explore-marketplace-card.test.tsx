import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EventExploreMarketplaceCard from "@/components/event/EventExploreMarketplaceCard";
import * as exploreActions from "@/app/actions/explore";

// Mock explore actions
vi.mock("@/app/actions/explore", () => ({
  getEventExploreListingStatusAction: vi.fn(),
  checkEventExploreReadinessAction: vi.fn(),
  getExploreListingAttributionAction: vi.fn(),
  submitExploreListingApplicationAction: vi.fn(),
  organizerResubmitExploreListingAction: vi.fn(),
  unlistExploreListingAction: vi.fn(),
}));

describe("UrPass Explore — EventExploreMarketplaceCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the unapplied state with pre-flight checklist and preview option", async () => {
    vi.mocked(exploreActions.getEventExploreListingStatusAction).mockResolvedValue({
      hasListing: false,
    });
    vi.mocked(exploreActions.checkEventExploreReadinessAction).mockResolvedValue({
      ready: true,
      issues: [],
      minPricePaise: 0,
      isFree: true,
    });
    vi.mocked(exploreActions.getExploreListingAttributionAction).mockResolvedValue({
      success: true,
      exploreBookings: 0,
      totalBookings: 0,
      exploreRevenuePaise: 0,
      totalRevenuePaise: 0,
      views: null,
      clicks: null,
    });

    render(
      <EventExploreMarketplaceCard
        eventId="test-event-123"
        eventName="Bengaluru Tech Summit"
        applySlug="bengaluru-tech-summit"
      />
    );

    // Initial loading state
    expect(screen.getByText(/Verifying Explore marketplace status/i)).toBeDefined();

    // After loading resolves
    await waitFor(() => {
      expect(screen.getByText("Post on UrPass Explore")).toBeDefined();
    });

    expect(screen.getByText("Marketplace City")).toBeDefined();
    expect(screen.getByText("Event Category")).toBeDefined();
    expect(screen.getByText("Preview Card")).toBeDefined();
    expect(screen.getByText("Apply for Explore")).toBeDefined();
  });

  it("displays pre-flight readiness warning when event is incomplete", async () => {
    vi.mocked(exploreActions.getEventExploreListingStatusAction).mockResolvedValue({
      hasListing: false,
    });
    vi.mocked(exploreActions.checkEventExploreReadinessAction).mockResolvedValue({
      ready: false,
      issues: [
        "Event must be published and set to Active status.",
        "A venue name or physical address must be specified.",
      ],
      minPricePaise: 0,
      isFree: true,
    });
    vi.mocked(exploreActions.getExploreListingAttributionAction).mockResolvedValue({
      success: true,
      exploreBookings: 0,
      totalBookings: 0,
      exploreRevenuePaise: 0,
      totalRevenuePaise: 0,
      views: null,
      clicks: null,
    });

    render(
      <EventExploreMarketplaceCard
        eventId="test-event-incomplete"
        eventName="Draft Event"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Eligibility Requirements/i)).toBeDefined();
    });

    expect(screen.getByText("Event must be published and set to Active status.")).toBeDefined();
    expect(screen.getByText("A venue name or physical address must be specified.")).toBeDefined();

    // Submit button should be disabled
    const submitBtn = screen.getByRole("button", { name: /Apply for Explore/i });
    expect((submitBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it("renders the approved state with live badge, unlist button, and attribution metrics", async () => {
    vi.mocked(exploreActions.getEventExploreListingStatusAction).mockResolvedValue({
      hasListing: true,
      status: "approved",
      category: "business",
      city: "Bengaluru",
      featured: false,
      editorialSummary: "Premier summit",
    });
    vi.mocked(exploreActions.checkEventExploreReadinessAction).mockResolvedValue({
      ready: true,
      issues: [],
      minPricePaise: 50000,
      isFree: false,
    });
    vi.mocked(exploreActions.getExploreListingAttributionAction).mockResolvedValue({
      success: true,
      exploreBookings: 25,
      totalBookings: 100,
      exploreRevenuePaise: 1250000,
      totalRevenuePaise: 5000000,
      views: null,
      clicks: null,
    });

    render(
      <EventExploreMarketplaceCard
        eventId="test-event-approved"
        eventName="Founders Mixer"
        applySlug="founders-mixer"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Approved & Live")).toBeDefined();
    });

    expect(screen.getByText(/Your event is live on UrPass Explore/i)).toBeDefined();
    expect(screen.getByText("View on Explore")).toBeDefined();
    expect(screen.getByText("Unlist")).toBeDefined();

    // Attribution stats
    expect(screen.getByText("25")).toBeDefined();
    expect(screen.getByText("₹12,500")).toBeDefined();
    expect(screen.getByText("25%")).toBeDefined();
    // Empty state for unconfigured views
    expect(screen.getByText("—")).toBeDefined();
  });

  it("renders pending state with cancel application action", async () => {
    vi.mocked(exploreActions.getEventExploreListingStatusAction).mockResolvedValue({
      hasListing: true,
      status: "pending",
      category: "music",
      city: "Mumbai",
      editorialSummary: "Acoustic concert series",
    });
    vi.mocked(exploreActions.checkEventExploreReadinessAction).mockResolvedValue({
      ready: true,
      issues: [],
      minPricePaise: 0,
      isFree: true,
    });
    vi.mocked(exploreActions.getExploreListingAttributionAction).mockResolvedValue({
      success: true,
      exploreBookings: 0,
      totalBookings: 0,
      exploreRevenuePaise: 0,
      totalRevenuePaise: 0,
      views: null,
      clicks: null,
    });

    render(
      <EventExploreMarketplaceCard
        eventId="test-event-pending"
        eventName="Acoustic Night"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Pending Review")).toBeDefined();
    });

    expect(screen.getByText(/Application under editorial curation review/i)).toBeDefined();
    expect(screen.getByText("Cancel Application")).toBeDefined();
  });

  it("renders changes requested state with admin feedback and resubmit", async () => {
    vi.mocked(exploreActions.getEventExploreListingStatusAction).mockResolvedValue({
      hasListing: true,
      status: "rejected",
      category: "workshops",
      city: "Delhi NCR",
      rejectionReason: "[Changes Requested] Please add specific venue address and workshop syllabus.",
    });
    vi.mocked(exploreActions.checkEventExploreReadinessAction).mockResolvedValue({
      ready: true,
      issues: [],
      minPricePaise: 0,
      isFree: true,
    });
    vi.mocked(exploreActions.getExploreListingAttributionAction).mockResolvedValue({
      success: true,
      exploreBookings: 0,
      totalBookings: 0,
      exploreRevenuePaise: 0,
      totalRevenuePaise: 0,
      views: null,
      clicks: null,
    });

    render(
      <EventExploreMarketplaceCard
        eventId="test-event-changes"
        eventName="Python Workshop"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Changes Requested")).toBeDefined();
    });

    expect(screen.getByText(/Please add specific venue address and workshop syllabus/i)).toBeDefined();
    expect(screen.getByText("Resubmit for Review")).toBeDefined();
  });

  it("renders suspended / unlisted state and allows reactivation", async () => {
    vi.mocked(exploreActions.getEventExploreListingStatusAction).mockResolvedValue({
      hasListing: true,
      status: "suspended",
      category: "community",
      city: "Bengaluru",
    });
    vi.mocked(exploreActions.checkEventExploreReadinessAction).mockResolvedValue({
      ready: true,
      issues: [],
      minPricePaise: 0,
      isFree: true,
    });
    vi.mocked(exploreActions.getExploreListingAttributionAction).mockResolvedValue({
      success: true,
      exploreBookings: 0,
      totalBookings: 0,
      exploreRevenuePaise: 0,
      totalRevenuePaise: 0,
      views: null,
      clicks: null,
    });

    render(
      <EventExploreMarketplaceCard
        eventId="test-event-suspended"
        eventName="Open Mic"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Unlisted from Explore")).toBeDefined();
    });

    expect(screen.getByText(/Event currently unlisted from UrPass Explore/i)).toBeDefined();
    expect(screen.getByText("Reactivate on Explore")).toBeDefined();
  });

  it("opens and closes private Explore preview modal", async () => {
    vi.mocked(exploreActions.getEventExploreListingStatusAction).mockResolvedValue({
      hasListing: false,
    });
    vi.mocked(exploreActions.checkEventExploreReadinessAction).mockResolvedValue({
      ready: true,
      issues: [],
      minPricePaise: 0,
      isFree: true,
    });
    vi.mocked(exploreActions.getExploreListingAttributionAction).mockResolvedValue({
      success: true,
      exploreBookings: 0,
      totalBookings: 0,
      exploreRevenuePaise: 0,
      totalRevenuePaise: 0,
      views: null,
      clicks: null,
    });

    render(
      <EventExploreMarketplaceCard
        eventId="test-preview-event"
        eventName="Exclusive Tech Gala"
        applySlug="tech-gala"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Preview Card")).toBeDefined();
    });

    // Click Preview Card button
    fireEvent.click(screen.getByText("Preview Card"));

    // Modal should be visible
    expect(screen.getByText("Explore Marketplace Preview")).toBeDefined();
    expect(screen.getByText("Done Previewing")).toBeDefined();

    // Close modal
    fireEvent.click(screen.getByText("Done Previewing"));

    await waitFor(() => {
      expect(screen.queryByText("Explore Marketplace Preview")).toBeNull();
    });
  });
});
