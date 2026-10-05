/**
 * Cashfree Base Client & API Configuration
 * Supports x-idempotency-key and strict backend credential isolation
 */

import type { CashfreeConfig, CashfreeEnv } from "./cashfree.types";

export function getCashfreeConfig(): CashfreeConfig {
  const env: CashfreeEnv = (process.env.CASHFREE_ENV as CashfreeEnv) || "sandbox";
  const isProduction = env === "production";

  const defaultBaseUrl = isProduction
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

  const baseUrl = process.env.CASHFREE_BASE_URL || defaultBaseUrl;
  const apiVersion = process.env.CASHFREE_API_VERSION || "2026-01-01";
  const appId = process.env.CASHFREE_APP_ID || "";
  const secretKey = process.env.CASHFREE_SECRET_KEY || "";

  const appUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://urpass.space";

  const apiUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://urpass.space";

  return {
    env,
    appId,
    secretKey,
    apiVersion,
    baseUrl,
    appUrl,
    apiUrl,
  };
}

export class CashfreeAPIError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly type?: string;
  readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(`Cashfree ${status}: ${message}`);
    this.name = "CashfreeAPIError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Executes an authenticated request to Cashfree PG API with optional Idempotency Key
 */
export async function cashfreeRequest<T = any>(
  path: string,
  options: RequestInit = {},
  idempotencyKey?: string
): Promise<T> {
  const config = getCashfreeConfig();

  if (!config.appId || !config.secretKey) {
    // In mock/test environments without credentials, provide meaningful diagnostic
    if (process.env.NODE_ENV === "test") {
      console.warn("[Cashfree Client] CASHFREE_APP_ID / CASHFREE_SECRET_KEY not set in test environment.");
    }
  }

  const endpoint = `${config.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-client-id": config.appId,
    "x-client-secret": config.secretKey,
    "x-api-version": config.apiVersion,
    ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  let body: any;

  if (contentType.includes("application/json")) {
    body = await response.json().catch(() => ({}));
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    const errorMsg =
      typeof body === "object" && body !== null
        ? body.message || body.error || JSON.stringify(body)
        : String(body);
    throw new CashfreeAPIError(response.status, errorMsg, body);
  }

  return body as T;
}
