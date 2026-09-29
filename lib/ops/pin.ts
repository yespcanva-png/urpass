import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/config";

const DEFAULT_PIN = "260203";

function adminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to access system settings.");
  }
  return createAdminClient(getSupabaseUrl(), serviceKey);
}

/**
 * Retrieves the Operational access PIN directly from the database.
 * If the setting has not yet been initialized in the DB, it seeds the default PIN ('260203') into the database.
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

    // If not found or table exists but row is missing, seed it into the DB
    console.log("[ops/pin] No ops_pin found in DB, seeding default into system_settings...");
    try {
      const { error: insertError } = await admin
        .from("system_settings")
        .upsert(
          {
            key: "ops_pin",
            value: DEFAULT_PIN,
            description: "Operational Command Center access PIN",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );

      if (insertError) {
        console.warn("[ops/pin] Could not insert ops_pin into system_settings:", insertError.message);
      }
    } catch (insertErr) {
      console.warn("[ops/pin] Seed attempt warning:", insertErr);
    }

    return DEFAULT_PIN;
  } catch (err) {
    console.error("[ops/pin] Error querying ops PIN from DB:", err);
    return DEFAULT_PIN;
  }
}

/**
 * Verifies the user-supplied PIN against the database value.
 * The PIN is verified strictly against the DB.
 */
export async function verifyOpsPin(candidatePin: string): Promise<boolean> {
  if (!candidatePin || typeof candidatePin !== "string") {
    return false;
  }
  const trimmed = candidatePin.trim();
  if (!trimmed) return false;

  const dbPin = await getOpsPinFromDb();
  return trimmed === dbPin.trim();
}

/**
 * Updates the Ops access PIN in the database.
 */
export async function updateOpsPinInDb(newPin: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = (newPin || "").trim();
  if (trimmed.length < 4 || trimmed.length > 12) {
    return { success: false, error: "Ops PIN must be between 4 and 12 characters." };
  }

  try {
    const admin = adminClient();
    const { error } = await admin
      .from("system_settings")
      .upsert(
        {
          key: "ops_pin",
          value: trimmed,
          description: "Operational Command Center access PIN",
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
