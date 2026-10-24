import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import TicketCutDivider from "@/components/pass/TicketCutDivider";
import TicketBarcode from "@/components/pass/TicketBarcode";
import TicketPreview from "@/components/pass/TicketPreview";
import { GroupPassCard } from "@/components/pass/GroupPassCard";

describe("TicketCutDivider Component", () => {
  it("renders with ticket-cut data attribute and punch notches", () => {
    const { container } = render(<TicketCutDivider isDark={false} label="ADMIT ONE · TEAR OR SCAN" />);
    const root = container.querySelector('[data-ticket-cut="true"]');
    expect(root).toBeInTheDocument();

    // Check for left and right semicircular punch notches
    const notches = container.querySelectorAll(".rounded-full");
    expect(notches.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("ADMIT ONE · TEAR OR SCAN")).toBeInTheDocument();
  });

  it("applies dark mode styling and custom cutout colors", () => {
    const { container } = render(
      <TicketCutDivider
        isDark={true}
        label="VIP PASS · DO NOT DETACH"
        cutoutColor="#0a0a0d"
      />
    );
    expect(screen.getByText("VIP PASS · DO NOT DETACH")).toBeInTheDocument();
    const notches = container.querySelectorAll(".rounded-full");
    expect(notches[0]).toHaveStyle({ backgroundColor: "#0a0a0d" });
  });
});

describe("TicketBarcode Component", () => {
  it("renders SVG linear bars with formatted human-readable code", () => {
    const { container } = render(<TicketBarcode code="URP-8F42-99B1" showText={true} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(10);
    expect(screen.getByText("* URP-8F42-99B1 *")).toBeInTheDocument();
  });

  it("renders with dark mode bar colors", () => {
    const { container } = render(<TicketBarcode code="URP-TEST" isDark={true} />);
    const rect = container.querySelector("rect");
    expect(rect).toHaveAttribute("fill", "#E2E8F0");
  });
});

describe("TicketPreview Real Ticket Layout", () => {
  const sampleConfig = {
    template: "modern" as const,
    shape: "rounded" as const,
    primaryColor: "#6D28D9",
    showTicketType: true,
    showAttendeeName: true,
    showTicketId: true,
    showEventDate: true,
    showVenue: true,
  };

  it("renders complete authentic ticket elements including ticket cut and stub", () => {
    const { container } = render(
      <TicketPreview
        config={sampleConfig}
        eventName="SUMMIT 2026"
        attendeeName="Jane Doe"
        ticketType="VIP PASS"
        ticketId="#URP-9921"
      />
    );

    // Event title & Category
    expect(screen.getByText("SUMMIT 2026")).toBeInTheDocument();
    expect(screen.getByText("VIP PASS")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();

    // Ticket Cut Divider with Die-Cut Notches
    expect(container.querySelector('[data-ticket-cut="true"]')).toBeInTheDocument();
    expect(screen.getByText("ADMIT ONE · TEAR OR SCAN")).toBeInTheDocument();

    // Scannable Stub with QR and Credential Tag
    expect(screen.getByText("SCAN FOR ENTRY")).toBeInTheDocument();
    expect(screen.getAllByText("#URP-9921").length).toBeGreaterThanOrEqual(1);
  });
});

describe("GroupPassCard Ticket Design", () => {
  const sampleGroupRecord = {
    passToken: "grp-tok-1234",
    passName: "VIP Delegation Pass",
    totalGuests: 5,
    checkedInGuests: 2,
    duration: "Full Access",
    primaryContact: {
      name: "Alex Smith",
      email: "alex@example.com",
    },
    qrCodePayload: "https://urpass.space/pass/grp-tok-1234",
    members: [
      { name: "Alex Smith", role: "primary" as const, checkedIn: true },
      { name: "Sam Jones", role: "guest" as const, checkedIn: true },
      { name: "Taylor Swift", role: "guest" as const, checkedIn: false },
    ],
  };

  it("renders group pass with ticket cut and scannable QR stub", () => {
    const { container } = render(
      <GroupPassCard passRecord={sampleGroupRecord as unknown as any} />
    );
    expect(screen.getAllByText("VIP Delegation Pass").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Alex Smith").length).toBeGreaterThanOrEqual(1);

    // Check for Ticket Cut Notches
    expect(container.querySelector('[data-ticket-cut="true"]')).toBeInTheDocument();
    expect(screen.getByText("✦ ADMIT GROUP · MASTER PASS ✦")).toBeInTheDocument();

    // Check for Scannable Group Token
    expect(screen.getByText("GRP-TOK-1234")).toBeInTheDocument();
  });
});
