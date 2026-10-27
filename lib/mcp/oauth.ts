import { createHash, randomBytes } from "crypto";

export type McpScope =
  | "events:read"
  | "events:write"
  | "tickets:read"
  | "tickets:write"
  | "attendees:read"
  | "analytics:read";

export const ALL_MCP_SCOPES: McpScope[] = [
  "events:read",
  "events:write",
  "tickets:read",
  "tickets:write",
  "attendees:read",
  "analytics:read",
];

export interface OAuthClient {
  clientId: string;
  clientSecret?: string;
  name: string;
  redirectUris: string[];
}

export interface AuthorizationCode {
  code: string;
  clientId: string;
  userId: string;
  organizationId?: string | null;
  scopes: McpScope[];
  redirectUri: string;
  codeChallenge?: string;
  codeChallengeMethod?: "S256" | "plain";
  expiresAt: number;
}

export interface OAuthTokenRecord {
  accessToken: string;
  refreshToken: string;
  clientId: string;
  userId: string;
  organizationId?: string | null;
  scopes: McpScope[];
  expiresAt: number;
  createdAt: number;
  lastUsedAt?: number;
  revokedAt?: number;
}

// Global in-memory stores with persistence-readiness
declare global {
  // eslint-disable-next-line no-var
  var __urpass_oauth_codes: Map<string, AuthorizationCode> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_oauth_tokens: Map<string, OAuthTokenRecord> | undefined;
  // eslint-disable-next-line no-var
  var __urpass_oauth_refresh_map: Map<string, string> | undefined;
}

if (!globalThis.__urpass_oauth_codes) {
  globalThis.__urpass_oauth_codes = new Map();
}
if (!globalThis.__urpass_oauth_tokens) {
  globalThis.__urpass_oauth_tokens = new Map();
}
if (!globalThis.__urpass_oauth_refresh_map) {
  globalThis.__urpass_oauth_refresh_map = new Map();
}

const codesStore = globalThis.__urpass_oauth_codes;
const tokensStore = globalThis.__urpass_oauth_tokens;
const refreshMap = globalThis.__urpass_oauth_refresh_map;

// Pre-registered client for Claude / AI Assistants
export const KNOWN_OAUTH_CLIENTS: Record<string, OAuthClient> = {
  claude: {
    clientId: "claude",
    name: "Anthropic Claude",
    redirectUris: [
      "https://claude.ai/api/auth/callback",
      "https://claude.ai/oauth/callback",
      "https://desktop.claude.ai/oauth/callback",
      "http://localhost:3000/oauth/callback",
      "http://localhost:8000/callback",
      "https://urpass.space/oauth/callback",
    ],
  },
  "claude-custom": {
    clientId: "claude-custom",
    name: "Claude AI Assistant Custom Connector",
    redirectUris: ["*"], // Allows user-configured Claude callback URLs
  },
};

/**
 * Validate redirect URI against registered client
 */
export function isValidRedirectUri(client: OAuthClient, redirectUri: string): boolean {
  if (client.redirectUris.includes("*")) return true;
  return client.redirectUris.some((uri) => {
    if (uri === redirectUri) return true;
    try {
      const u1 = new URL(uri);
      const u2 = new URL(redirectUri);
      return u1.origin === u2.origin && u1.pathname === u2.pathname;
    } catch {
      return false;
    }
  });
}

/**
 * Parses and validates requested scopes against supported MCP scopes
 */
export function parseScopes(scopeString?: string | null): McpScope[] {
  if (!scopeString) return [...ALL_MCP_SCOPES];
  const parts = scopeString.split(/[\s,]+/).filter(Boolean);
  const valid = parts.filter((p): p is McpScope => ALL_MCP_SCOPES.includes(p as McpScope));
  return valid.length > 0 ? valid : [...ALL_MCP_SCOPES];
}

/**
 * Generate a cryptographically secure authorization code (10 min expiry)
 */
export function createAuthorizationCode(params: {
  clientId: string;
  userId: string;
  organizationId?: string | null;
  scopes: McpScope[];
  redirectUri: string;
  codeChallenge?: string;
  codeChallengeMethod?: "S256" | "plain";
}): string {
  const code = `urp_mcp_ac_${randomBytes(24).toString("hex")}`;
  const record: AuthorizationCode = {
    code,
    clientId: params.clientId,
    userId: params.userId,
    organizationId: params.organizationId || null,
    scopes: params.scopes,
    redirectUri: params.redirectUri,
    codeChallenge: params.codeChallenge,
    codeChallengeMethod: params.codeChallengeMethod || "S256",
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };

  codesStore.set(code, record);
  return code;
}

/**
 * Verify PKCE S256 code challenge
 */
export function verifyPkce(verifier: string, challenge: string, method?: "S256" | "plain"): boolean {
  if (method === "plain") {
    return verifier === challenge;
  }
  // S256: BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))
  const hash = createHash("sha256").update(verifier).digest("base64url");
  return hash === challenge;
}

/**
 * Exchange an authorization code for access and refresh tokens
 */
export function exchangeCodeForTokens(params: {
  code: string;
  clientId: string;
  redirectUri?: string;
  codeVerifier?: string;
}): {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
  scopes: McpScope[];
  userId: string;
  organizationId?: string | null;
} {
  const record = codesStore.get(params.code);
  if (!record) {
    throw new Error("Invalid or expired authorization code");
  }

  // Consume code immediately (one-time use)
  codesStore.delete(params.code);

  if (Date.now() > record.expiresAt) {
    throw new Error("Authorization code has expired");
  }

  // Verify client match
  if (record.clientId !== params.clientId && params.clientId !== "claude-custom") {
    throw new Error("Client ID mismatch");
  }

  // Verify PKCE if challenge was set
  if (record.codeChallenge) {
    if (!params.codeVerifier) {
      throw new Error("code_verifier required for PKCE verification");
    }
    const pkceValid = verifyPkce(params.codeVerifier, record.codeChallenge, record.codeChallengeMethod);
    if (!pkceValid) {
      throw new Error("Invalid PKCE code_verifier");
    }
  }

  const accessToken = `urp_mcp_at_${randomBytes(32).toString("hex")}`;
  const refreshToken = `urp_mcp_rt_${randomBytes(32).toString("hex")}`;
  const expiresIn = 30 * 24 * 60 * 60; // 30 days in seconds

  const tokenRecord: OAuthTokenRecord = {
    accessToken,
    refreshToken,
    clientId: record.clientId,
    userId: record.userId,
    organizationId: record.organizationId,
    scopes: record.scopes,
    expiresAt: Date.now() + expiresIn * 1000,
    createdAt: Date.now(),
  };

  tokensStore.set(accessToken, tokenRecord);
  refreshMap.set(refreshToken, accessToken);

  return {
    accessToken,
    refreshToken,
    expiresIn,
    tokenType: "Bearer",
    scopes: record.scopes,
    userId: record.userId,
    organizationId: record.organizationId,
  };
}

/**
 * Refresh an existing token pair
 */
export function refreshAccessToken(refreshToken: string): {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
  scopes: McpScope[];
} {
  const oldAccessToken = refreshMap.get(refreshToken);
  if (!oldAccessToken) {
    throw new Error("Invalid refresh token");
  }

  const oldRecord = tokensStore.get(oldAccessToken);
  if (!oldRecord || oldRecord.revokedAt) {
    throw new Error("Token revoked or expired");
  }

  // Invalidate old token pair
  tokensStore.delete(oldAccessToken);
  refreshMap.delete(refreshToken);

  const newAccessToken = `urp_mcp_at_${randomBytes(32).toString("hex")}`;
  const newRefreshToken = `urp_mcp_rt_${randomBytes(32).toString("hex")}`;
  const expiresIn = 30 * 24 * 60 * 60;

  const newRecord: OAuthTokenRecord = {
    ...oldRecord,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    createdAt: Date.now(),
  };

  tokensStore.set(newAccessToken, newRecord);
  refreshMap.set(newRefreshToken, newAccessToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn,
    tokenType: "Bearer",
    scopes: newRecord.scopes,
  };
}

/**
 * Verify and look up an active OAuth token
 */
export function verifyOAuthToken(accessToken: string): OAuthTokenRecord | null {
  const record = tokensStore.get(accessToken);
  if (!record) return null;
  if (record.revokedAt) return null;
  if (Date.now() > record.expiresAt) return null;

  record.lastUsedAt = Date.now();
  return record;
}

/**
 * Revoke an access token or refresh token immediately
 */
export function revokeOAuthToken(token: string): boolean {
  if (tokensStore.has(token)) {
    const record = tokensStore.get(token)!;
    record.revokedAt = Date.now();
    tokensStore.delete(token);
    refreshMap.delete(record.refreshToken);
    return true;
  }

  if (refreshMap.has(token)) {
    const accessToken = refreshMap.get(token)!;
    const record = tokensStore.get(accessToken);
    if (record) {
      record.revokedAt = Date.now();
      tokensStore.delete(accessToken);
    }
    refreshMap.delete(token);
    return true;
  }

  return false;
}

/**
 * Get all active connections for a given user
 */
export function getUserConnectedApps(userId: string): OAuthTokenRecord[] {
  const userTokens: OAuthTokenRecord[] = [];
  for (const record of tokensStore.values()) {
    if (record.userId === userId && !record.revokedAt && Date.now() < record.expiresAt) {
      userTokens.push(record);
    }
  }
  return userTokens;
}

/**
 * Revoke all active OAuth connections for a given user (e.g. from Dashboard UI)
 */
export function revokeUserConnections(userId: string): number {
  let count = 0;
  for (const [token, record] of tokensStore.entries()) {
    if (record.userId === userId) {
      record.revokedAt = Date.now();
      tokensStore.delete(token);
      refreshMap.delete(record.refreshToken);
      count++;
    }
  }
  return count;
}
