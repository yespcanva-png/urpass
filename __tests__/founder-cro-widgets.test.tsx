import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FounderSpotCounter from "@/components/billing/FounderSpotCounter";
import QuickConsultationWidget from "@/components/consultation/QuickConsultationWidget";

describe("FounderSpotCounter Component", () => {
  it("renders default 14 of 20 spots claimed and remaining count correctly", () => {
    render(<FounderSpotCounter claimedCount={14} totalCount={20} />);
    expect(screen.getByText(/14 of 20 Claimed/i)).toBeDefined();
    expect(screen.getByText(/Only 6 spots remaining/i)).toBeDefined();
    expect(screen.getByText(/Create landing pages on/i)).toBeDefined();
    expect(screen.getByText(/Features locked in for lifetime/i)).toBeDefined();
  });

  it("renders custom spot numbers and calculations", () => {
    render(<FounderSpotCounter claimedCount={18} totalCount={20} />);
    expect(screen.getByText(/18 of 20 Claimed/i)).toBeDefined();
    expect(screen.getByText(/Only 2 spots remaining/i)).toBeDefined();
  });

  it("renders compact mode correctly with features lock tags", () => {
    render(<FounderSpotCounter claimedCount={14} totalCount={20} variant="compact" showFeaturesLock={true} />);
    expect(screen.getByText(/14 of 20 Founder Spots Claimed/i)).toBeDefined();
    expect(screen.getByText(/Only 6 left/i)).toBeDefined();
    expect(screen.getByText(/Landing page on urpass.space/i)).toBeDefined();
    expect(screen.getByText(/Lifetime locked/i)).toBeDefined();
  });
});

describe("QuickConsultationWidget Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders floating consultation button initially", () => {
    render(<QuickConsultationWidget claimedCount={14} totalCount={20} />);
    const button = screen.getByRole("button", { name: /Quick WhatsApp Consultation with URPASS Founder/i });
    expect(button).toBeDefined();
    expect(screen.getByText(/Chat with Founder/i)).toBeDefined();
    expect(screen.getByText(/6 Left/i)).toBeDefined();
  });

  it("opens consultation card when floating button is clicked", () => {
    render(<QuickConsultationWidget claimedCount={14} totalCount={20} />);
    const trigger = screen.getByRole("button", { name: /Quick WhatsApp Consultation with URPASS Founder/i });
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: /URPASS Founder Quick Consultation/i })).toBeDefined();
    expect(screen.getByText(/Srinithin Somasundaram/i)).toBeDefined();
    expect(screen.getByText(/Direct Hotline \(\+91 90012 70298\)/i)).toBeDefined();
    expect(screen.getByText(/14 of 20 Founder Accounts Claimed/i)).toBeDefined();
    expect(screen.getByText(/Host your event page on urpass.space/i)).toBeDefined();
  });

  it("contains direct WhatsApp and Email contact links", () => {
    render(<QuickConsultationWidget claimedCount={14} totalCount={20} defaultOpen={true} />);

    const whatsappLinks = screen.getAllByRole("link").filter((l) =>
      l.getAttribute("href")?.includes("wa.me/919001270298")
    );
    expect(whatsappLinks.length).toBeGreaterThanOrEqual(1);

    const emailLink = screen.getByRole("link", { name: /Email Founder/i });
    expect(emailLink.getAttribute("href")).toContain("mailto:srinithin@yespstudio.com");
  });

  it("closes modal on close button click and sets sessionStorage", () => {
    render(<QuickConsultationWidget claimedCount={14} totalCount={20} defaultOpen={true} />);
    const closeBtn = screen.getByRole("button", { name: /Close consultation modal/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(sessionStorage.getItem("founder_consultation_dismissed")).toBe("true");
  });

  it("triggers exit-intent modal when mouse moves to viewport top", () => {
    render(<QuickConsultationWidget claimedCount={14} totalCount={20} />);
    expect(screen.queryByRole("dialog")).toBeNull();

    // Trigger mouseleave near top of document
    fireEvent(document, new MouseEvent("mouseleave", { clientY: 5 }));

    expect(screen.getByRole("dialog", { name: /URPASS Founder Quick Consultation/i })).toBeDefined();
  });
});
