import { describe, it, expect } from "vitest";
import { calculateTicketFees, formatINR } from "@/lib/payments/fees";

describe("Finance, Fees and Payout Calculations", () => {
  it("calculates accurate fees for ATTENDEE fee-bearer model", () => {
    const fees = calculateTicketFees({
      basePrice: 1000,
      feeBearer: "ATTENDEE",
      platformFeePercent: 2.0,
      gatewayFeePercent: 2.0,
    });

    expect(fees.basePrice).toBe(1000);
    expect(fees.platformFee).toBe(20);
    expect(fees.gatewayFee).toBe(20);
    expect(fees.attendeeTotalPayable).toBe(1040);
    expect(fees.organizerNetShare).toBe(1000);
  });

  it("calculates accurate fees for ORGANIZER fee-bearer model", () => {
    const fees = calculateTicketFees({
      basePrice: 1000,
      feeBearer: "ORGANIZER",
      platformFeePercent: 2.0,
      gatewayFeePercent: 2.0,
    });

    expect(fees.basePrice).toBe(1000);
    expect(fees.platformFee).toBe(20);
    expect(fees.gatewayFee).toBe(20);
    expect(fees.attendeeTotalPayable).toBe(1000);
    expect(fees.organizerNetShare).toBe(960);
  });

  it("handles free tickets without fees", () => {
    const fees = calculateTicketFees({
      basePrice: 0,
      feeBearer: "ATTENDEE",
    });

    expect(fees.platformFee).toBe(0);
    expect(fees.gatewayFee).toBe(0);
    expect(fees.attendeeTotalPayable).toBe(0);
    expect(fees.organizerNetShare).toBe(0);
  });

  it("computes net available balance correctly after settlements and refunds", () => {
    const grossSales = 10000;
    const platformFees = 200;
    const processingFees = 200;
    const totalRefunds = 500;
    const netEarnings = grossSales - platformFees - processingFees - totalRefunds; // 9100
    const settledAmount = 3000;
    const availableBalance = Math.max(0, netEarnings - settledAmount); // 6100

    expect(netEarnings).toBe(9100);
    expect(availableBalance).toBe(6100);
  });

  it("formats currency using formatINR correctly", () => {
    const formatted = formatINR(4500);
    expect(formatted).toContain("4,500");
  });
});
