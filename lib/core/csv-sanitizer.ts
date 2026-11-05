/**
 * Sanitizes CSV cell values to prevent CSV formula injection attacks (CWE-1236).
 * Prepends a single quote to any cell starting with dangerous characters: =, +, -, @, tab, or carriage return.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = String(value);

  // If text starts with any dangerous formula trigger, prepend single quote
  if (/^[=\+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  // Escape quotes if value contains comma, quote, or newline
  if (text.includes(",") || text.includes('"') || text.includes("\n") || text.includes("\r")) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

/**
 * Builds a sanitized CSV string from an array of headers and row objects.
 */
export function buildSanitizedCsv<T extends Record<string, unknown>>(
  headers: { key: keyof T; label: string }[],
  rows: T[]
): string {
  const headerLine = headers.map((h) => sanitizeCsvCell(h.label)).join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => sanitizeCsvCell(row[h.key])).join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}
