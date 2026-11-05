import crypto from "crypto";

/**
 * Generates a high-entropy, cryptographically secure pass token.
 * 32 bytes (256 bits) encoded as hex (64 chars).
 */
export function generatePassToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generates a human-friendly unique privacy erasure reference ID (e.g. UK-DEL-9A4B2F8C).
 */
export function generateErasureReference(prefix: string = "UK-DEL"): string {
  const bytes = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${bytes}`;
}

/**
 * Generates a 24-byte cryptographic verification token for email confirmation flows.
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * Validates whether a given string is a valid 64-char hex pass token.
 */
export function isValidPassToken(token: unknown): boolean {
  if (typeof token !== "string") return false;
  return /^[a-f0-9]{64}$/i.test(token.trim());
}
