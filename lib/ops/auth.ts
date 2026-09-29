import { cookies } from "next/headers";
import crypto from "crypto";

export const OPS_COOKIE_NAME = "urpass_ops_session";
const SESSION_DURATION_HOURS = 8;

function getOpsSecret(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RAZORPAY_KEY_SECRET ||
    "urpass_ops_super_secret_system_key_2026"
  );
}

export function signOpsSessionToken(): string {
  const secret = getOpsSecret();
  const expiresAt = Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000;
  const payload = JSON.stringify({ role: "ops_admin", exp: expiresAt });
  const payloadB64 = Buffer.from(payload).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifyOpsSessionToken(token?: string | null): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  const secret = getOpsSecret();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expectedBuf.length) return false;

  const signatureMatches = crypto.timingSafeEqual(sigBuf, expectedBuf);
  if (!signatureMatches) return false;

  try {
    const raw = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.exp !== "number") return false;
    return parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isOpsAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(OPS_COOKIE_NAME)?.value;
    return verifyOpsSessionToken(sessionCookie);
  } catch {
    return false;
  }
}
