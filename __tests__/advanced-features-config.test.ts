import { describe, it, expect } from "vitest";
import { extractModuleConfigsFromEvent } from "@/app/actions/event-features";

describe("Advanced Features Configuration System", () => {
  it("extracts and merges module configurations from custom_pass_design", () => {
    const mockEvent = {
      id: "event-anniversary-300",
      organizer_id: "org-1",
      custom_pass_design: {
        _bulkBookingSettings: { maxQuantityPerOrder: 25, allowSplitClaim: true },
        _gateTrackingConfig: { allowReEntry: true, duplicateEntryPolicy: "reject", duplicateWindowSeconds: 60 },
        _groupEntryConfig: { partial_entry: true, max_group_size: "50", entry_quantity_selection: "gate_staff" },
        _moduleConfigs: {
          session_attendance: { checkin_window_minutes: "30", require_checkout: false },
          offline_scanning: { auto_sync_on_reconnect: true, conflict_rule: "earliest_server" },
        },
      },
    };

    const configs = extractModuleConfigsFromEvent(mockEvent as any);

    expect(configs.bulk_ticket_booking.maxQuantityPerOrder).toBe(25);
    expect(configs.advanced_entry_tracking.allowReEntry).toBe(true);
    expect(configs.group_entry.partial_entry).toBe(true);
    expect(configs.session_attendance.checkin_window_minutes).toBe("30");
    expect(configs.offline_scanning.auto_sync_on_reconnect).toBe(true);
  });

  it("handles null or empty custom_pass_design gracefully", () => {
    const emptyEvent = {
      id: "event-empty",
      organizer_id: "org-1",
      custom_pass_design: null,
    };

    const configs = extractModuleConfigsFromEvent(emptyEvent as any);

    expect(configs).toBeDefined();
    expect(configs.bulk_ticket_booking).toEqual({});
    expect(configs.group_entry).toEqual({});
    expect(configs.advanced_entry_tracking).toEqual({});
  });

  it("prioritizes unified _moduleConfigs updates over legacy defaults", () => {
    const eventWithBoth = {
      id: "event-both",
      organizer_id: "org-1",
      custom_pass_design: {
        _groupEntryConfig: { partial_entry: false, max_group_size: "10" },
        _moduleConfigs: {
          group_entry: { partial_entry: true, max_group_size: "100" },
        },
      },
    };

    const configs = extractModuleConfigsFromEvent(eventWithBoth as any);

    expect(configs.group_entry.partial_entry).toBe(true);
    expect(configs.group_entry.max_group_size).toBe("100");
  });
});
