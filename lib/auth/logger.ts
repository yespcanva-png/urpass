/**
 * Structured terminal logger for authentication events
 * Provides clear, real-time terminal visibility for Google OAuth, email auth, session verification, and token exchange.
 */

function formatAuthTimestamp(): string {
  const now = new Date();
  // Formats as YYYY-MM-DD HH:mm:ss in local/IST or UTC
  return now.toISOString().replace("T", " ").replace(/\..+/, " UTC");
}

type AuthLogMeta = Record<string, unknown>;

function serializeMeta(meta?: AuthLogMeta): string {
  if (!meta) return "";
  const pairs = Object.entries(meta)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => {
      const valStr = typeof v === "object" ? JSON.stringify(v) : String(v);
      return `${k}=${valStr}`;
    });
  return pairs.length > 0 ? " | " + pairs.join(" ") : "";
}

/**
 * Log an informational auth event to the terminal
 */
export function logAuth(tag: string, message: string, meta?: AuthLogMeta) {
  const ts = formatAuthTimestamp();
  const metaStr = serializeMeta(meta);
  console.log(`\x1b[36m[AUTH:${tag.toUpperCase()}]\x1b[0m ${ts} | ${message}${metaStr}`);
}

/**
 * Log a warning auth event to the terminal
 */
export function logAuthWarn(tag: string, message: string, meta?: AuthLogMeta) {
  const ts = formatAuthTimestamp();
  const metaStr = serializeMeta(meta);
  console.warn(`\x1b[33m[AUTH:${tag.toUpperCase()}:WARN]\x1b[0m ${ts} | ${message}${metaStr}`);
}

/**
 * Log an error auth event to the terminal
 */
export function logAuthError(tag: string, message: string, error?: unknown, meta?: AuthLogMeta) {
  const ts = formatAuthTimestamp();
  const errStr = error instanceof Error ? ` error="${error.message}"` : error ? ` error="${String(error)}"` : "";
  const metaStr = serializeMeta(meta);
  console.error(`\x1b[31m[AUTH:${tag.toUpperCase()}:ERROR]\x1b[0m ${ts} | ${message}${errStr}${metaStr}`);
}
