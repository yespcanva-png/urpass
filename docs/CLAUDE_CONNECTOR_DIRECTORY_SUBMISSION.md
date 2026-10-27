# UrPass MCP — Anthropic Connectors Directory Submission Package

*Status: Candidate for Review (Not yet officially verified)*  
*Target: Anthropic Connectors Directory*  
*Endpoint: `https://mcp.urpass.space/mcp`*  
*Author: UrPass Platform Engineering (YESP Corp)*  
*Contact: `urpass.space@yespstudio.com` | `https://urpass.space`*

---

## 1. Product & Connector Overview

- **Connector Name:** UrPass Event Management
- **Short Description:** Manage your UrPass events, ticket tiers, QR passes, and gate attendance directly through Claude.
- **Detailed Description:**  
  UrPass is a modern event ticketing, registration, and check-in platform for college fests, tech summits, hackathons, and corporate conferences. The UrPass MCP connector enables event organizers to manage their entire event lifecycle conversationally inside Claude: create draft events, configure tiered pricing, inspect real-time registration rosters with privacy-preserving PII masking, review gate arrival velocity, run pre-flight launch checks, and submit events to the UrPass Explore marketplace.
- **Category:** Productivity & Event Operations
- **Supported Transports:** Streamable HTTP / JSON-RPC 2.0
- **Primary Endpoint:** `https://mcp.urpass.space/mcp`
- **Fallback / Direct Endpoint:** `https://urpass.space/api/mcp`

---

## 2. Brand Assets & Visual Identifiers

- **App Icon:** `https://urpass.space/logo.png` (Square 512×512, transparent PNG)
- **High-Contrast Dark Icon:** `https://urpass.space/logo-dark.png`
- **Brand Colors:**
  - Primary Brand Amber: `#D97706`
  - Secondary Neutral Dark: `#171717`
  - Success Emerald: `#059669`
- **Hero Artwork / Banner:** `https://urpass.space/og-image.png` (1200×630)

---

## 3. OAuth 2.0 & RFC 8414 Compliance

UrPass implements standard OAuth 2.0 with PKCE for secure authentication:

- **Issuer Identifier:** `https://urpass.space`
- **Authorization Server Metadata (RFC 8414):** `https://urpass.space/.well-known/oauth-authorization-server`
- **OpenID Configuration:** `https://urpass.space/.well-known/openid-configuration`
- **Authorization Endpoint:** `https://urpass.space/api/oauth/authorize`
- **Token Endpoint:** `https://urpass.space/api/oauth/token`
- **Revocation Endpoint:** `https://urpass.space/api/oauth/revoke`
- **Supported Response Types:** `code`
- **Supported Grant Types:** `authorization_code`, `refresh_token`
- **Code Challenge Methods:** `S256`, `plain`
- **Supported Client Authentication:** `none` (public client with PKCE), `client_secret_post`

### Registered OAuth Scopes
| Scope | Description |
| :--- | :--- |
| `events:read` | Inspect event configurations, schedules, capacities, and readiness checks |
| `events:write` | Create and edit event drafts, update timings, and request publishing |
| `tickets:read` | Retrieve ticket tiers, capacities, and sold inventory counts |
| `tickets:write` | Create and update ticket tiers, pricing, and purchase quotas |
| `attendees:read` | Access registered attendee list with privacy-preserving PII masking |
| `analytics:read` | Retrieve check-in figures, gate arrival velocity, and gross sales |

---

## 4. MCP Tools Manifest & Typed Schemas

UrPass exposes 12 production tools:

### Read Operations
1. `list_events`: Lists organizer events, filterable by `status` (`draft`, `active`, `completed`), with pagination (`limit`, `offset`).
2. `get_event`: Retrieves event details by `eventId`, including active ticket tiers, attendee quota, and capacity utilization.
3. `list_ticket_tiers`: Retrieves ticket tiers for an `eventId`, returning prices in INR, capacities, and sold counts.
4. `get_registrations`: Returns registered attendee roster for an `eventId`. Phone numbers and emails are automatically masked (`j***n@domain.com`, `+91*****1234`) unless `unmaskPII: true` is explicitly granted.
5. `get_event_analytics`: Returns registration totals, approval rates, check-in totals, and ticket revenues.
6. `get_event_readiness`: Executes 7 pre-flight tests (dates, ticket setup, capacity, payment gateway, venue, pass design, communications).
7. `get_scanner_stats`: Returns live entrance telemetry, gate-by-gate check-in counts, and arrival rate per hour.

### Write Operations
8. `create_event`: Creates a new event in `draft` status, enforces plan quotas, generates a URL slug, and provides a direct event editor link.
9. `update_event`: Updates event title, dates, hours, venue, capacity, or ticket pricing.
10. `create_ticket_tier`: Adds a new ticket tier with pricing in INR and seat capacity.

### Consequential Actions (Human Confirmation Required)
11. `publish_event`: Transitions event status from `draft` to `active`. **Requires `confirm: true`** and passes 7 pre-flight readiness checks. If `confirm` is omitted, returns a preview prompt requesting user approval.
12. `submit_to_explore`: Places event in the UrPass Explore moderation queue. **Requires `confirm: true`** and satisfies marketplace eligibility criteria.

---

## 5. Security & Privacy Safeguards

1. **No URL Query API Keys:** Requests passing API keys or secrets via URL query parameters are rejected with HTTP 400.
2. **Tenant & Organization Isolation:** All queries filter strictly by `organizer_id` or verified membership in `organization_members`.
3. **No LocalStorage Credentials:** Browser client state relies on HTTP-only secure cookie sessions or direct OAuth code exchange.
4. **PII Masking by Default:** Attendee emails and mobile numbers are obfuscated in tool outputs.
5. **Rate Limiting:** Sliding window limits of 120 req/min for read tools and 30 req/min for write tools per user ID.
6. **Immutable Audit Logging:** Every write action writes a record to `enterprise_audit_logs` capturing actor, action, and before/after states.

---

## 6. Demo Account & Testing Instructions for Reviewers

- **Demo Account Email:** `claude-reviewer@urpass.space`
- **Sandbox Test URL:** `https://urpass.space/oauth/authorize?client_id=claude&redirect_uri=https://claude.ai/api/auth/callback&response_type=code`
- **Staging Verification Steps:**
  1. In Claude Settings → Connectors, enter custom connector URL: `https://mcp.urpass.space/mcp`.
  2. Complete OAuth authentication.
  3. Prompt Claude: *"List my upcoming events on UrPass."*
  4. Prompt Claude: *"Create a draft workshop for 100 people on Nov 15 called AI Hackathon 2026."*
  5. Prompt Claude: *"Add General Admission tickets at ₹499."*
  6. Prompt Claude: *"Run a readiness preflight check on AI Hackathon 2026."*

---

## 7. Rollback & Incident Response

- **Immediate Kill Switch:** Setting environment variable `MCP_SERVICE_DISABLED=true` returns HTTP 503 on all MCP endpoints without affecting the core web platform.
- **Selective Write Kill Switch:** Individual write tools can be disabled by returning error code `-32000` (`"Write tool temporarily paused for maintenance"`).
- **Token Invalidation:** Admin endpoint `POST /api/oauth/revoke` allows invalidating any token pair in real-time.
