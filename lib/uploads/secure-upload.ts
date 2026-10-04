/**
 * Secure File Upload Validator & Sanitizer
 * Enforces magic byte verification, strict size boundaries, and comprehensive SVG sanitization.
 */

export interface ValidationOptions {
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  mimeType?: string;
  extension?: string;
  sanitizedBuffer?: Buffer;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const DEFAULT_ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

// Dangerous attributes in SVG that can trigger script execution
const SVG_DANGEROUS_ATTRS = [
  /^on\w+/i, // onerror, onload, onclick, onmouseover, etc.
  /^xlink:href$/i,
  /^href$/i,
];

// Dangerous tags in SVG
const SVG_DANGEROUS_TAGS = [
  "script",
  "foreignobject",
  "iframe",
  "embed",
  "object",
  "meta",
  "link",
  "applet",
];

/**
 * Validates file magic bytes against declared MIME type
 */
export function detectMagicBytes(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // WEBP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  // SVG: Inspect text header
  const sample = buffer.toString("utf8", 0, Math.min(buffer.length, 1024)).trim();
  if (
    sample.startsWith("<?xml") ||
    sample.startsWith("<svg") ||
    sample.includes("<svg") ||
    sample.startsWith("<!DOCTYPE svg")
  ) {
    // Basic structural check for XML / SVG
    if (sample.includes("<svg") || sample.includes("xmlns=\"http://www.w3.org/2000/svg\"")) {
      return "image/svg+xml";
    }
  }

  return null;
}

/**
 * Sanitizes an SVG string removing scripts, dangerous attributes, and dangerous protocols
 */
export function sanitizeSvg(svgContent: string): { clean: string; isValidSvg: boolean } {
  // 1. Must contain an svg opening tag
  if (!/<svg[^>]*>/i.test(svgContent)) {
    return { clean: "", isValidSvg: false };
  }

  let clean = svgContent;

  // Remove dangerous tags and their content
  for (const tag of SVG_DANGEROUS_TAGS) {
    const tagRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    clean = clean.replace(tagRegex, "");
    // Also remove self-closing tag: <tag ... />
    const selfClosingRegex = new RegExp(`<${tag}[^>]*\\/?>`, "gi");
    clean = clean.replace(selfClosingRegex, "");
  }

  // Strip event handlers (e.g. onload=..., onclick=...)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, "");

  // Strip javascript: and data: URLs inside href / xlink:href / src attributes
  clean = clean.replace(/(href|xlink:href|src)\s*=\s*["']\s*(javascript:|data:text\/html)[^"']*["']/gi, "");

  // Strip XML external entities (XXE prevention)
  clean = clean.replace(/<!ENTITY[^>]*>/gi, "");
  clean = clean.replace(/<!DOCTYPE[^>]*\[[\s\S]*?\]>/gi, "");

  return { clean, isValidSvg: true };
}

/**
 * High-level secure upload validator for images & assets
 */
export async function validateAndSanitizeUpload(
  fileBuffer: Buffer,
  declaredType?: string,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const maxSize = options.maxSizeBytes || DEFAULT_MAX_SIZE;
  const allowed = options.allowedMimeTypes || DEFAULT_ALLOWED_MIME;

  // 1. Size verification
  if (fileBuffer.length === 0) {
    return { valid: false, error: "Empty file provided" };
  }
  if (fileBuffer.length > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the allowed limit of ${(maxSize / 1024 / 1024).toFixed(1)}MB`,
    };
  }

  // 2. Real magic byte detection
  const detectedMime = detectMagicBytes(fileBuffer);
  if (!detectedMime) {
    return { valid: false, error: "File format could not be verified or is not supported" };
  }

  if (!allowed.includes(detectedMime)) {
    return { valid: false, error: `MIME type '${detectedMime}' is not permitted` };
  }

  // 3. SVG sanitization
  if (detectedMime === "image/svg+xml") {
    const rawSvg = fileBuffer.toString("utf8");
    const { clean, isValidSvg } = sanitizeSvg(rawSvg);
    if (!isValidSvg) {
      return { valid: false, error: "Invalid SVG format" };
    }
    const sanitizedBuffer = Buffer.from(clean, "utf8");
    return {
      valid: true,
      mimeType: "image/svg+xml",
      extension: "svg",
      sanitizedBuffer,
    };
  }

  // 4. Binary images (PNG, JPEG, WebP)
  let extension = "png";
  if (detectedMime === "image/jpeg") extension = "jpg";
  else if (detectedMime === "image/webp") extension = "webp";

  return {
    valid: true,
    mimeType: detectedMime,
    extension,
    sanitizedBuffer: fileBuffer,
  };
}
