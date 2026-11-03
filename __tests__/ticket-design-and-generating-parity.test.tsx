import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import {
  type TicketDesignConfig,
  DEFAULT_TICKET_DESIGN,
  sanitizeTicketDesign,
} from "@/lib/pass-design";
import TicketPreview from "@/components/pass/TicketPreview";
import TicketStudio from "@/components/studio/TicketStudio";

describe("Ticket Designing vs Ticket Generating Parity", () => {
  it("persists and sanitizes ticket format (mobile, badge, print)", () => {
    const mobileSanitized = sanitizeTicketDesign({ ...DEFAULT_TICKET_DESIGN, format: "mobile" });
    expect(mobileSanitized.format).toBe("mobile");

    const badgeSanitized = sanitizeTicketDesign({ ...DEFAULT_TICKET_DESIGN, format: "badge" });
    expect(badgeSanitized.format).toBe("badge");

    const printSanitized = sanitizeTicketDesign({ ...DEFAULT_TICKET_DESIGN, format: "print" });
    expect(printSanitized.format).toBe("print");

    const fallbackSanitized = sanitizeTicketDesign({ ...DEFAULT_TICKET_DESIGN, format: "invalid" as any });
    expect(fallbackSanitized.format).toBe("mobile");
  });

  it("TicketPreview renders attendee phone when showPhone is enabled", () => {
    const configWithPhone: TicketDesignConfig = {
      ...DEFAULT_TICKET_DESIGN,
      showAttendeeName: true,
      showPhone: true,
      showOrganization: true,
    };

    render(
      <TicketPreview
        config={configWithPhone}
        eventName="SUMMIT 2026"
        attendeeName="Jane Doe"
        attendeePhone="+91 99999 88888"
        attendeeOrganization="Acme Corp"
      />
    );

    expect(screen.getByText("+91 99999 88888")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("TicketStudio designer includes the realistic ticket cut divider and stub matching generated pass", () => {
    const { container } = render(
      <TicketStudio
        isPro={true}
        eventId="evt-parity-1"
        eventName="PARITY SUMMIT 2026"
        eventDate="24 OCT 2026 | 10:00 AM"
        venue="Grand Ballroom"
      />
    );

    // Both designer and generated pass now share TicketCutDivider with data-ticket-cut
    const cut = container.querySelector('[data-ticket-cut="true"]');
    expect(cut).toBeInTheDocument();
    expect(screen.getByText("✦ ADMIT ONE · VERIFIED ENTRY ✦")).toBeInTheDocument();

    // Verify presence of credential tag in stub
    expect(screen.getByText("PASS CREDENTIAL")).toBeInTheDocument();
    expect(screen.getByText("AUTHENTICATED PASS · READY FOR SCAN")).toBeInTheDocument();
  });
});
