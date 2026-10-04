import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";
import crypto from "crypto";

const DEFAULT_PIN = "260203";

function adminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to access system settings.");
  }
  return createAdminClient(getSupabaseUrl(), serviceKey);
}

/**
 * Memory-hard scrypt hashing for operational PIN
 */
export function hashOpsPin(pin: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(pin, actualSalt, 64).toString("hex");
  return `scrypt$${actualSalt}$${derived}`;
}

/**
 * Constant-time verification of candidate PIN against stored hash or legacy plaintext
 */
export function verifyOpsPinHash(candidatePin: string, storedValue: string): boolean {
  if (!candidatePin || !storedValue) return false;
  const cleanCandidate = candidatePin.trim();
  const cleanStored = storedValue.trim();

  if (cleanStored.startsWith("scrypt$")) {
    const parts = cleanStored.split("$");
    if (parts.length !== 3) return false;
    const [, salt, expectedHex] = parts;
    const derivedHex = crypto.scryptSync(cleanCandidate, salt, 64).toString("hex");
    const expectedBuf = Buffer.from(expectedHex, "hex");
    const derivedBuf = Buffer.from(derivedHex, "hex");
    if (expectedBuf.length !== derivedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, derivedBuf);
  }

  // Legacy plaintext constant-time comparison
  const candidateBuf = Buffer.from(cleanCandidate);
  const storedBuf = Buffer.from(cleanStored);
  if (candidateBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(candidateBuf, storedBuf);
}

/**
 * Retrieves the Operational access PIN / hash directly from the database.
 * If the setting has not yet been initialized in the DB, it seeds the default PIN into the database.
 */
export async function getOpsPinFromDb(): Promise<string> {
  try {
    const admin = adminClient();

    // Query system_settings table for ops_pin
    const { data, error } = await admin
      .from("system_settings")
      .select("value")
      .eq("key", "ops_pin")
      .maybeSingle();

    if (!error && data?.value) {
      const raw = data.value;
      if (typeof raw === "string") return raw.trim();
      if (typeof raw === "number") return String(raw);
      if (typeof raw === "object" && raw !== null && "pin" in raw) {
        return String((raw as { pin: string | number }).pin).trim();
      }
      return String(raw).trim();
    }

    // If not found, seed scrypt hashed default into DB
    const hashedDefault = hashOpsPin(DEFAULT_PIN);
    try {
      await admin
        .from("system_settings")
        .upsert(
          {
            key: "ops_pin",
            value: hashedDefault,
            description: "Operational Command Center access PIN (scrypt hashed)",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );
    } catch (insertErr) {
      console.warn("[ops/pin] Seed attempt warning:", insertErr);
    }

    return hashedDefault;
  } catch (err) {
    console.error("[ops/pin] Error querying ops PIN from DB:", err);
    return DEFAULT_PIN;
  }
}

/**
 * Detailed verification with rate limiting and audit logging
 */
export async function verifyOpsPinWithRateLimit(
  candidatePin: string,
  ipAddress = "127.0.0.1",
  userAgent?: string
): Promise<{ valid: boolean; rateLimited?: boolean; error?: string }> {
  if (!candidatePin || typeof candidatePin !== "string") {
    return { valid: false, error: "PIN is required." };
  }
  const trimmed = candidatePin.trim();
  if (!trimmed) {
    return { valid: false, error: "PIN is required." };
  }

  const admin = adminClient();

  // 1. Check IP rate limit in ops_auth_audit (5 failed attempts per 15 min)
  try {
    const windowStart = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const query = admin.from("ops_auth_audit").select("id", { count: "exact", head: true });
    if (query && typeof query.eq === "function") {
      const q1 = query.eq("ip_address", ipAddress);
      const q2 = q1 && typeof q1.eq === "function" ? q1.eq("success", false) : null;
      const q3 = q2 && typeof q2.gte === "function" ? q2.gte("attempted_at", windowStart) : null;
      if (q3) {
        const { count: failedCount } = await q3;
        if ((failedCount ?? 0) >= 5) {
          return {
            valid: false,
            rateLimited: true,
            error: "Too many failed attempts. Ops PIN verification is temporarily locked for 15 minutes.",
          };
        }
      }
    }
  } catch (auditErr) {
    console.warn("[ops/pin] Audit rate check warning:", auditErr);
  }

  // 2. Query stored PIN / Hash
  const storedValue = await getOpsPinFromDb();
  const isValid = verifyOpsPinHash(trimmed, storedValue);

  // 3. Record attempt in ops_auth_audit
  try {
    await admin.from("ops_auth_audit").insert({
      ip_address: ipAddress,
      user_agent: userAgent || null,
      success: isValid,
      details: {
        timestamp: new Date().toISOString(),
        format: storedValue.startsWith("scrypt$") ? "scrypt" : "legacy_plain",
      },
    });
  } catch {}

  // 4. Transparent migration: if legacy plaintext was verified, upgrade DB to scrypt
  if (isValid && !storedValue.startsWith("scrypt$")) {
    try {
      await admin.from("system_settings").upsert(
        {
          key: "ops_pin",
          value: hashOpsPin(trimmed),
          description: "Operational Command Center access PIN (scrypt hashed)",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    } catch {}
  }

  if (!isValid) {
    return { valid: false, error: "Access Denied: Incorrect operational PIN." };
  }

  return { valid: true };
}

/**
 * Verifies the user-supplied PIN against the database value with constant-time equality.
 */
export async function verifyOpsPin(candidatePin: string, ipAddress = "127.0.0.1"): Promise<boolean> {
  const result = await verifyOpsPinWithRateLimit(candidatePin, ipAddress);
  return result.valid;
}

/**
 * Updates the Ops access PIN in the database, automatically hashing it with memory-hard scrypt.
 */
export async function updateOpsPinInDb(newPin: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = (newPin || "").trim();
  if (trimmed.length < 4 || trimmed.length > 12) {
    return { success: false, error: "Ops PIN must be between 4 and 12 characters." };
  }

  try {
    const admin = adminClient();
    const hashed = hashOpsPin(trimmed);
    const { error } = await admin
      .from("system_settings")
      .upsert(
        {
          key: "ops_pin",
          value: hashed,
          description: "Operational Command Center access PIN (scrypt hashed)",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database error";
    return { success: false, error: msg };
  }
}
