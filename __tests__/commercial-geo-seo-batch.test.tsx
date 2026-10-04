import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MultipleGatePage, { metadata as multiGateMetadata } from "@/app/multiple-gate-event-check-in/page";
import CheckIn5000Page, { metadata as checkIn5000Metadata } from "@/app/event-check-in-for-5000-attendees/page";
import ZohoBackstagePage, { metadata as zohoMetadata } from "@/app/zoho-backstage-alternative/page";
import BestSoftwarePage, { metadata as bestSoftwareMetadata } from "@/app/best-event-registration-software-india/page";
import CoimbatorePage, { metadata as coimbatoreMetadata } from "@/app/in/coimbatore/page";

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

describe("Commercial Priority Pages Batch", () => {
  it("renders /multiple-gate-event-check-in with GEO questions and direct answer", () => {
    expect(multiGateMetadata.title).toContain("Multiple Gate Event Check-In");
    expect(multiGateMetadata.alternates?.canonical).toBe("https://urpass.space/multiple-gate-event-check-in");

    render(<MultipleGatePage />);
    expect(screen.getByRole("heading", { level: 1, name: /Multiple Gate Event Check-In/i })).toBeInTheDocument();
    expect(screen.getByText(/How does multiple gate event check-in work\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Can multiple volunteers scan tickets at the same time\?/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/How do I manage 5 entrances at an event\?/i)[0]).toBeInTheDocument();
  });

  it("renders /event-check-in-for-5000-attendees with throughput calculation and specs", () => {
    expect(checkIn5000Metadata.title).toContain("Check In 5,000 Event Attendees Fast");
    expect(checkIn5000Metadata.alternates?.canonical).toBe("https://urpass.space/event-check-in-for-5000-attendees");

    render(<CheckIn5000Page />);
    expect(screen.getByRole("heading", { level: 1, name: /How to Check In 5,000 Attendees Quickly/i })).toBeInTheDocument();
    expect(screen.getByText(/How do you check in 5,000 attendees quickly\?/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Volume Check-In Throughput & Queue Time Matrix/i)).toBeInTheDocument();
  });

  it("renders /zoho-backstage-alternative with comparison matrix and Razorpay UPI details", () => {
    expect(zohoMetadata.title).toContain("Zoho Backstage Alternative");
    expect(zohoMetadata.alternates?.canonical).toBe("https://urpass.space/zoho-backstage-alternative");

    render(<ZohoBackstagePage />);
    expect(screen.getByRole("heading", { level: 1, name: /Zoho Backstage Alternative/i })).toBeInTheDocument();
    expect(screen.getByText(/Why is URPASS the Best Zoho Backstage Alternative\?/i)).toBeInTheDocument();
    expect(screen.getByText(/How URPASS Replaces Zoho Backstage/i)).toBeInTheDocument();
  });

  it("renders /best-event-registration-software-india with comprehensive evaluation", () => {
    expect(bestSoftwareMetadata.title).toContain("Best Event Registration Software India");
    expect(bestSoftwareMetadata.alternates?.canonical).toBe("https://urpass.space/best-event-registration-software-india");

    render(<BestSoftwarePage />);
    expect(screen.getByRole("heading", { level: 1, name: /Best Event Registration Software in India/i })).toBeInTheDocument();
    expect(screen.getByText(/What makes URPASS the best event registration software in India\?/i)).toBeInTheDocument();
    expect(screen.getByText(/India Event Registration Platforms: 2026 Evaluation Matrix/i)).toBeInTheDocument();
  });

  it("ensures Coimbatore page uses substantiated wording without unverified college claims", () => {
    expect(coimbatoreMetadata.description).not.toContain("Used by PSG, Amrita");
    expect(coimbatoreMetadata.description).toContain("built for Coimbatore colleges");

    render(<CoimbatorePage />);
    expect(screen.queryByText(/Used by PSG College of Technology, Amrita, KCT, SKCET/i)).toBeNull();
    expect(screen.getByText(/Built for events at colleges across Coimbatore/i)).toBeInTheDocument();
  });
});
