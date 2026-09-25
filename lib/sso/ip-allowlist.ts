/**
 * Enterprise IP & CIDR Allowlisting Engine
 *
 * Validates incoming client requests against corporate VPN/CIDR allowlists.
 * Supports IPv4 and IPv6 single IPs and CIDR ranges (e.g. 192.168.1.0/24, 10.0.0.0/8).
 */

import { isIP } from "net";

export function extractClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const getHeader = (name: string): string | undefined => {
    if (typeof (headers as Headers).get === "function") {
      return (headers as Headers).get(name) || undefined;
    }
    const val = (headers as Record<string, string | string[] | undefined>)[name];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  const xForwardedFor = getHeader("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0].trim();
    if (first) return first;
  }

  const cfConnectingIp = getHeader("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xRealIp = getHeader("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  return "127.0.0.1";
}

function ipv4ToLong(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let num = 0;
  for (const part of parts) {
    const n = parseInt(part, 10);
    if (isNaN(n) || n < 0 || n > 255) return null;
    num = (num << 8) + n;
  }
  return num >>> 0;
}

export function isIpv4InCidr(ip: string, cidr: string): boolean {
  const cleanIp = ip.trim();
  const cleanCidr = cidr.trim();

  // Handle single IP address
  if (!cleanCidr.includes("/")) {
    return cleanIp === cleanCidr;
  }

  const [rangeIp, prefixStr] = cleanCidr.split("/");
  const prefix = parseInt(prefixStr, 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return false;

  const ipLong = ipv4ToLong(cleanIp);
  const rangeLong = ipv4ToLong(rangeIp);
  if (ipLong === null || rangeLong === null) return false;

  if (prefix === 0) return true;
  const mask = ((0xffffffff << (32 - prefix)) >>> 0);
  return (ipLong & mask) === (rangeLong & mask);
}

export function isIpAllowed(clientIp: string, allowedCidrs: string[]): boolean {
  if (!allowedCidrs || allowedCidrs.length === 0) {
    return true; // No restriction configured
  }

  const cleanClient = clientIp.trim();

  // Always allow local loopback in development / testing if explicitly configured or localhost
  if (cleanClient === "127.0.0.1" || cleanClient === "::1" || cleanClient === "localhost") {
    const hasLoopback = allowedCidrs.some(
      (c) => c.trim() === "127.0.0.1" || c.trim() === "::1" || c.trim() === "127.0.0.0/8"
    );
    if (hasLoopback) return true;
  }

  for (const cidr of allowedCidrs) {
    if (!cidr || !cidr.trim()) continue;
    const cleanCidr = cidr.trim();

    // Exact IP match (IPv4 or IPv6)
    if (cleanClient.toLowerCase() === cleanCidr.toLowerCase()) {
      return true;
    }

    if (isIpv4InCidr(cleanClient, cleanCidr)) {
      return true;
    }
  }

  return false;
}

export function validateCidr(cidr: string): { valid: boolean; error?: string } {
  const trimmed = cidr.trim();
  if (!trimmed) return { valid: false, error: "CIDR / IP address cannot be empty" };

  if (trimmed.includes("/")) {
    const [ip, prefixStr] = trimmed.split("/");
    const prefix = parseInt(prefixStr, 10);
    const ipVersion = isIP(ip);

    if (ipVersion === 4) {
      if (isNaN(prefix) || prefix < 0 || prefix > 32) {
        return { valid: false, error: "IPv4 CIDR prefix must be between 0 and 32" };
      }
      return { valid: true };
    }

    if (ipVersion === 6) {
      if (isNaN(prefix) || prefix < 0 || prefix > 128) {
        return { valid: false, error: "IPv6 CIDR prefix must be between 0 and 128" };
      }
      return { valid: true };
    }

    return { valid: false, error: "Invalid base IP address in CIDR block" };
  }

  if (isIP(trimmed) === 0) {
    return { valid: false, error: "Invalid IP address format" };
  }

  return { valid: true };
}
