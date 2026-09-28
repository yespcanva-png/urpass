import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = {
        send: mockSend,
      };
    },
  };
});

import {
  getOwnerEmail,
  notifyOwnerNewUser,
  notifyOwnerUserLogin,
  notifyOwnerPaymentAttempt,
  notifyOwnerPaymentSuccess,
  notifyOwnerTrialActivated,
  notifyOwnerPaidSubscription,
  sendUserWelcomeEmail,
  sendOwnerNotification,
} from "@/lib/email";

describe("Owner Email Notifications (srinithin@yespstudio.com)", () => {
  const originalOwnerEmailEnv = process.env.OWNER_EMAIL;
  const originalResendApiKey = process.env.RESEND_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_valid_test_key_12345";
    delete process.env.OWNER_EMAIL;
    mockSend.mockResolvedValue({ data: { id: "resend_msg_123" }, error: null });
  });

  afterEach(() => {
    if (originalOwnerEmailEnv !== undefined) {
      process.env.OWNER_EMAIL = originalOwnerEmailEnv;
    } else {
      delete process.env.OWNER_EMAIL;
    }

    if (originalResendApiKey !== undefined) {
      process.env.RESEND_API_KEY = originalResendApiKey;
    } else {
      delete process.env.RESEND_API_KEY;
    }
  });

  it("defaults owner email to srinithin@yespstudio.com", () => {
    expect(getOwnerEmail()).toBe("srinithin@yespstudio.com");
  });

  it("respects OWNER_EMAIL environment override if provided", () => {
    process.env.OWNER_EMAIL = "custom-owner@yespstudio.com";
    expect(getOwnerEmail()).toBe("custom-owner@yespstudio.com");
  });

  it("sends notifyOwnerNewUser to srinithin@yespstudio.com on new user signup", async () => {
    await notifyOwnerNewUser({
      name: "Alice Designer",
      email: "alice@example.com",
      provider: "email",
      userId: "usr_alice_123",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toBe("srinithin@yespstudio.com");
    expect(callArgs.subject).toContain("[URPASS] New User Signup: alice@example.com");
    expect(callArgs.html).toContain("Alice Designer");
    expect(callArgs.html).toContain("alice@example.com");
    expect(callArgs.html).toContain("EMAIL");
  });

  it("sends notifyOwnerUserLogin to srinithin@yespstudio.com on user login", async () => {
    await notifyOwnerUserLogin({
      name: "Bob Organizer",
      email: "bob@example.com",
      provider: "email",
      userId: "usr_bob_456",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 Mac",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toBe("srinithin@yespstudio.com");
    expect(callArgs.subject).toContain("[URPASS] User Login: bob@example.com");
    expect(callArgs.html).toContain("Bob Organizer");
    expect(callArgs.html).toContain("bob@example.com");
    expect(callArgs.html).toContain("EMAIL");
    expect(callArgs.html).toContain("192.168.1.1");
  });

  it("sends notifyOwnerPaymentAttempt to srinithin@yespstudio.com when checkout starts", async () => {
    await notifyOwnerPaymentAttempt({
      kind: "subscription",
      buyerName: "Bob Organizer",
      buyerEmail: "bob@example.com",
      itemName: "Pro Plan (Monthly)",
      amountPaise: 99900,
      orderId: "order_test_123",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toBe("srinithin@yespstudio.com");
    expect(callArgs.subject).toContain("💳 [URPASS] Payment Started: Pro Plan (Monthly)");
    expect(callArgs.html).toContain("Bob Organizer");
    expect(callArgs.html).toContain("₹999.00");
    expect(callArgs.html).toContain("order_test_123");
  });

  it("sends notifyOwnerPaymentSuccess to srinithin@yespstudio.com when payment is captured", async () => {
    await notifyOwnerPaymentSuccess({
      kind: "ticket",
      buyerName: "Charlie Attendee",
      buyerEmail: "charlie@example.com",
      itemName: "VIP Pass - Tech Expo",
      amountPaise: 49900,
      paymentId: "pay_captured_789",
      orderId: "order_ticket_789",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toBe("srinithin@yespstudio.com");
    expect(callArgs.subject).toContain("💰 [URPASS] Payment Captured: VIP Pass - Tech Expo");
    expect(callArgs.html).toContain("Charlie Attendee");
    expect(callArgs.html).toContain("pay_captured_789");
    expect(callArgs.html).toContain("₹499.00");
  });

  it("sends notifyOwnerTrialActivated to srinithin@yespstudio.com when a 30-day trial is started", async () => {
    await notifyOwnerTrialActivated({
      buyerName: "David Campus",
      buyerEmail: "david@college.edu",
      planName: "Pro Plan",
      billingInterval: "monthly",
      futurePricePaise: 99900,
      subscriptionId: "sub_trial_456",
      paymentId: "pay_mandate_123",
      trialEndsAt: "in 30 days",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toBe("srinithin@yespstudio.com");
    expect(callArgs.subject).toContain("🚀 URPASS 30-Day Free Trial Activated: Pro Plan");
    expect(callArgs.html).toContain("david@college.edu");
    expect(callArgs.html).toContain("sub_trial_456");
  });

  it("sends notifyOwnerPaidSubscription to srinithin@yespstudio.com for recurring subscription activations", async () => {
    await notifyOwnerPaidSubscription({
      buyerName: "Emma Founder",
      buyerEmail: "emma@startup.com",
      planName: "Founder Lifetime Plan",
      billingCycle: "lifetime",
      amountPaise: 999900,
      paymentId: "pay_founder_999",
      orderId: "order_founder_999",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toBe("srinithin@yespstudio.com");
    expect(callArgs.subject).toContain("URPASS Paid Subscription");
    expect(callArgs.html).toContain("emma@startup.com");
    expect(callArgs.html).toContain("pay_founder_999");
  });

  it("sends sendUserWelcomeEmail directly to the user's email address", async () => {
    await sendUserWelcomeEmail({
      to: "newuser@example.com",
      name: "New User",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toBe("newuser@example.com");
    expect(callArgs.subject).toBe("Welcome to URPASS");
    expect(callArgs.html).toContain("New User");
  });

  it("catches errors gracefully in sendOwnerNotification so caller execution never crashes", async () => {
    mockSend.mockRejectedValueOnce(new Error("Resend network timeout"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      sendOwnerNotification({
        subject: "Test Crash Subject",
        title: "Test Crash Title",
        rows: [["Key", "Value"]],
      })
    ).resolves.not.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
