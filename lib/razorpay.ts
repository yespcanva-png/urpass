import crypto from "crypto";
import Razorpay from "razorpay";

export interface PaymentVerificationInput {
  orderId: string;
  paymentId: string;
  signature: string;
}

export function getRazorpayCredentials(): { keyId: string; keySecret: string } {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

  if (!keyId || !keySecret || keyId === "dummy_key_id" || keySecret === "dummy_key_secret") {
    throw new Error(
      "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables."
    );
  }

  return { keyId, keySecret };
}

export function isRazorpayConfigured(): boolean {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
  return Boolean(
    keyId &&
    keySecret &&
    keyId !== "dummy_key_id" &&
    keySecret !== "dummy_key_secret"
  );
}

export function getRazorpayClient(): Razorpay {
  const { keyId, keySecret } = getRazorpayCredentials();
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export function formatRazorpayErrorMessage(
  err: unknown,
  defaultMessage = "Failed to create payment order"
): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rzpErr = err as any;
  const rawMsg =
    rzpErr?.error?.description ||
    rzpErr?.message ||
    (typeof err === "string" ? err : null) ||
    (rzpErr?.error ? JSON.stringify(rzpErr.error) : null) ||
    defaultMessage;

  if (typeof rawMsg === "string" && rawMsg.toLowerCase().includes("authentication failed")) {
    return "Razorpay authentication failed: The RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in your hosting environment (e.g. Vercel) is invalid or mismatched. In your Vercel Project Settings > Environment Variables, verify that RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET match the active Live Key pair from your Razorpay Dashboard.";
  }

  return String(rawMsg);
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret = process.env.RAZORPAY_KEY_SECRET
): boolean {
  if (!orderId || !paymentId || !signature || !secret) {
    return false;
  }

  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expected, "hex");
    const sigBuf = Buffer.from(signature, "hex");

    return (
      expectedBuf.length === sigBuf.length &&
      crypto.timingSafeEqual(expectedBuf, sigBuf)
    );
  } catch {
    return false;
  }
}

export function verifyRazorpaySubscriptionSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string,
  secret = process.env.RAZORPAY_KEY_SECRET
): boolean {
  if (!subscriptionId || !paymentId || !signature || !secret) {
    return false;
  }

  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${paymentId}|${subscriptionId}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expected, "hex");
    const sigBuf = Buffer.from(signature, "hex");

    return (
      expectedBuf.length === sigBuf.length &&
      crypto.timingSafeEqual(expectedBuf, sigBuf)
    );
  } catch {
    return false;
  }
}

export interface EventRazorpayCredentials {
  keyId: string;
  keySecret: string;
  source: "ORGANIZATION" | "ORGANIZER" | "PLATFORM";
}

/**
 * Authoritatively resolves Razorpay credentials for an event.
 * Prioritizes organizer or organization direct connected gateway in payment_settings / org_payment_settings.
 * Falls back to URPASS platform credentials.
 */
export async function resolveEventRazorpayCredentials(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any,
  event: { id?: string; organizer_id?: string; organization_id?: string | null }
): Promise<EventRazorpayCredentials> {
  // 1. Organization Gateway Key
  if (event.organization_id) {
    const { data: orgSettings } = await adminClient
      .from("org_payment_settings")
      .select("razorpay_key_id, razorpay_key_secret")
      .eq("organization_id", event.organization_id)
      .maybeSingle();

    if (
      orgSettings?.razorpay_key_id &&
      orgSettings?.razorpay_key_secret &&
      orgSettings.razorpay_key_id.trim().startsWith("rzp_")
    ) {
      return {
        keyId: orgSettings.razorpay_key_id.trim(),
        keySecret: orgSettings.razorpay_key_secret.trim(),
        source: "ORGANIZATION",
      };
    }
  }

  // 2. Organizer User Direct Gateway Key
  if (event.organizer_id) {
    const { data: userSettings } = await adminClient
      .from("payment_settings")
      .select("razorpay_key_id, razorpay_key_secret")
      .eq("user_id", event.organizer_id)
      .maybeSingle();

    if (
      userSettings?.razorpay_key_id &&
      userSettings?.razorpay_key_secret &&
      userSettings.razorpay_key_id.trim().startsWith("rzp_")
    ) {
      return {
        keyId: userSettings.razorpay_key_id.trim(),
        keySecret: userSettings.razorpay_key_secret.trim(),
        source: "ORGANIZER",
      };
    }
  }

  // 3. Fallback to Platform credentials
  const { keyId, keySecret } = getRazorpayCredentials();
  return {
    keyId,
    keySecret,
    source: "PLATFORM",
  };
}


