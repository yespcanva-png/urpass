import { getBaseAppUrl } from "./saml";

export interface OidcDiscoveryDoc {
  issuer?: string;
  authorization_endpoint?: string;
  token_endpoint?: string;
  userinfo_endpoint?: string;
  jwks_uri?: string;
  scopes_supported?: string[];
  response_types_supported?: string[];
}

export function getOidcCallbackUrl(): string {
  return `${getBaseAppUrl()}/api/auth/sso/oidc/callback`;
}

/**
 * Discover OIDC endpoints from an Issuer URL using standard RFC 8414 / OpenID Discovery
 */
export async function discoverOidcEndpoints(issuerUrl: string): Promise<{
  success: boolean;
  doc?: OidcDiscoveryDoc;
  error?: string;
}> {
  try {
    let clean = issuerUrl.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    clean = clean.replace(/\/+$/, "");

    const wellKnownUrl = `${clean}/.well-known/openid-configuration`;
    const res = await fetch(wellKnownUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Could not fetch OpenID configuration from ${wellKnownUrl} (HTTP ${res.status})`,
      };
    }

    const doc: OidcDiscoveryDoc = await res.json();
    if (!doc.authorization_endpoint || !doc.token_endpoint) {
      return {
        success: false,
        error: "OpenID configuration is missing required authorization or token endpoints.",
      };
    }

    return { success: true, doc };
  } catch (err: unknown) {
    return {
      success: false,
      error: `Failed to discover OpenID configuration: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Builds the Authorization URL to redirect user to IdP for OIDC authentication
 */
export function buildOidcAuthorizationUrl(opts: {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  state: string;
  nonce: string;
  scopes?: string[];
}): string {
  const url = new URL(opts.authorizationEndpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", opts.clientId);
  url.searchParams.set("redirect_uri", opts.redirectUri);
  url.searchParams.set(
    "scope",
    (opts.scopes && opts.scopes.length > 0 ? opts.scopes : ["openid", "email", "profile"]).join(" ")
  );
  url.searchParams.set("state", opts.state);
  url.searchParams.set("nonce", opts.nonce);
  url.searchParams.set("prompt", "select_account");

  return url.toString();
}

/**
 * Exchanges authorization code for tokens
 */
export async function exchangeOidcCode(opts: {
  tokenEndpoint: string;
  clientId: string;
  clientSecret?: string | null;
  code: string;
  redirectUri: string;
}): Promise<{
  access_token?: string;
  id_token?: string;
  error?: string;
}> {
  try {
    const bodyParams = new URLSearchParams({
      grant_type: "authorization_code",
      code: opts.code,
      redirect_uri: opts.redirectUri,
      client_id: opts.clientId,
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };

    if (opts.clientSecret) {
      bodyParams.set("client_secret", opts.clientSecret);
      // Also provide Basic Auth header standard for some providers (e.g. Okta)
      const basic = Buffer.from(`${opts.clientId}:${opts.clientSecret}`).toString("base64");
      headers["Authorization"] = `Basic ${basic}`;
    }

    const res = await fetch(opts.tokenEndpoint, {
      method: "POST",
      headers,
      body: bodyParams.toString(),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        error: data.error_description || data.error || `Token exchange failed with HTTP ${res.status}`,
      };
    }

    return {
      access_token: data.access_token,
      id_token: data.id_token,
    };
  } catch (err: unknown) {
    return {
      error: `Token exchange request failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Decodes standard JWT payload without verifying crypto signature
 */
export function parseJwtPayload(jwt: string): Record<string, unknown> | null {
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonStr = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Fetches user profile from userinfo endpoint
 */
export async function fetchOidcUserInfo(opts: {
  userinfoEndpoint: string;
  accessToken: string;
}): Promise<{
  email?: string;
  name?: string;
  sub?: string;
  error?: string;
}> {
  try {
    const res = await fetch(opts.userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      return { error: `UserInfo endpoint returned HTTP ${res.status}` };
    }

    const data = await res.json();
    const email = data.email || data.upn || data.preferred_username;
    const name = data.name || (data.given_name && data.family_name ? `${data.given_name} ${data.family_name}` : email?.split("@")[0]);

    return {
      email,
      name,
      sub: data.sub,
    };
  } catch (err: unknown) {
    return {
      error: `UserInfo request failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
