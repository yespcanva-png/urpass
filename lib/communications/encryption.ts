import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

function getEncryptionKey(): Buffer {
  const secret =
    process.env.COMMUNICATION_ENCRYPTION_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "fallback-secret-for-urpass-encryption-key-development";
  // Derive a 32-byte (256-bit) key deterministically
  return crypto.scryptSync(secret, "urpass-comm-salt-v1", 32);
}

/**
 * Encrypts sensitive string (e.g. Meta access token, app secret)
 * Returns a hex string containing: iv + authTag + ciphertext
 */
export function encryptCredential(plainText: string): string {
  if (!plainText) return "";
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Format: iv(24 hex chars) + tag(32 hex chars) + encrypted
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  } catch (err) {
    console.error("[encryptCredential] Failed to encrypt credential safely");
    throw new Error("Credential encryption failed");
  }
}

/**
 * Decrypts encrypted credential string
 */
export function decryptCredential(cipherPackage: string): string {
  if (!cipherPackage) return "";
  try {
    const parts = cipherPackage.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted format");
    }

    const [ivHex, tagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    console.error("[decryptCredential] Failed to decrypt credential");
    return "";
  }
}

/**
 * Masks a token or ID for public presentation (e.g., •••••••• or •••• 1234)
 */
export function maskCredential(val?: string | null): string {
  if (!val) return "";
  if (val.length <= 4) return "••••";
  return `•••• •••• ${val.slice(-4)}`;
}
