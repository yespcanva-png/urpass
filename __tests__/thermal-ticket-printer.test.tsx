import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import ThermalTicketPrinter from "@/components/pass/ThermalTicketPrinter";

describe("UrPass — Premium Thermal Ticket Printing Reveal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("renders the thermal printer slot and status on initial load", () => {
    render(
      <ThermalTicketPrinter passToken="test-token-123" isDark={false} accentColor="#7C3AED">
        <div data-testid="actual-pass-card">Event Pass Card Content</div>
      </ThermalTicketPrinter>
    );

    // Verify child content is preserved
    expect(screen.getByTestId("actual-pass-card")).toBeDefined();
    expect(screen.getByText("Event Pass Card Content")).toBeDefined();

    // Verify printer slot branding & technical metadata
    expect(screen.getByText("THERMAL FEED")).toBeDefined();
    expect(screen.getByText(/300 DPI/i)).toBeDefined();

    // Verify screen-reader live region
    const statusRegion = screen.getByRole("status");
    expect(statusRegion).toBeDefined();
  });

  it("completes printing animation after timeout and records to sessionStorage", () => {
    vi.useFakeTimers();

    render(
      <ThermalTicketPrinter passToken="test-token-456">
        <div data-testid="pass-content">Pass #456</div>
      </ThermalTicketPrinter>
    );

    expect(sessionStorage.getItem("urpass_pass_printed_test-token-456")).toBeNull();

    // Advance timer past the 1400ms duration
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(sessionStorage.getItem("urpass_pass_printed_test-token-456")).toBe("true");

    vi.useRealTimers();
  });

  it("skips animation immediately if cached in sessionStorage", () => {
    sessionStorage.setItem("urpass_pass_printed_cached-token", "true");

    render(
      <ThermalTicketPrinter passToken="cached-token">
        <div data-testid="cached-pass">Instant Cached Pass</div>
      </ThermalTicketPrinter>
    );

    // Screen reader announces completed state immediately
    const statusRegion = screen.getByRole("status");
    expect(statusRegion.textContent).toContain("ready");
    expect(screen.getByTestId("cached-pass")).toBeDefined();
  });

  it("respects prefers-reduced-motion media query by completing immediately", () => {
    // Mock matchMedia for prefers-reduced-motion
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThermalTicketPrinter passToken="reduced-motion-token">
        <div data-testid="reduced-pass">Reduced Motion Pass</div>
      </ThermalTicketPrinter>
    );

    const statusRegion = screen.getByRole("status");
    expect(statusRegion.textContent).toContain("ready");

    window.matchMedia = originalMatchMedia;
  });
});
