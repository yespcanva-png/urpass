"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Globe,
  Key,
  Laptop,
  FileText,
  Code2,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  Globe2,
  Network,
  HardDriveDownload,
} from "lucide-react";
import {
  saveSSOConnection,
  testSSOConnection,
  toggleSSOStatus,
} from "@/app/actions/sso";
import {
  addDomain,
  verifyDomain,
  deleteDomain,
} from "@/app/actions/domains";
import {
  revokeEnterpriseSession,
  updateSecurityPolicies,
  exportAuditLogs,
} from "@/app/actions/security";
import {
  createOrRegenerateScimToken,
  deleteScimToken,
  type ScimTokenInfo,
} from "@/app/actions/scim";
import {
  addCustomDomain,
  verifyCustomDomain,
  deleteCustomDomain,
} from "@/app/actions/custom-domains";
import { discoverOidcEndpoints } from "@/lib/sso/oidc";
import type {
  Organization,
  OrgRole,
  EnterpriseSSOConnection,
  VerifiedDomain,
  SecurityPolicies,
  EnterpriseSession,
  EnterpriseAuditLog,
  SSOProtocol,
  CustomDomain,
} from "@/types";

type SecurityTab =
  | "sso"
  | "scim"
  | "domains"
  | "custom-domains"
  | "policies"
  | "sessions"
  | "audit-logs"
  | "api";

const inputCls =
  "border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-brand transition-colors bg-white placeholder:text-neutral-300 w-full";

export default function EnterpriseSecurityClient({
  org,
  orgSlug,
  userRole,
  initialSso,
  initialDomains,
  initialPolicies,
  initialSessions,
  initialAuditLogs,
  initialScimToken = null,
  initialCustomDomains = [],
}: {
  org: Organization;
  orgSlug: string;
  userRole: OrgRole;
  initialSso: EnterpriseSSOConnection | null;
  initialDomains: VerifiedDomain[];
  initialPolicies: SecurityPolicies | null;
  initialSessions: EnterpriseSession[];
  initialAuditLogs: EnterpriseAuditLog[];
  initialScimToken?: ScimTokenInfo | null;
  initialCustomDomains?: CustomDomain[];
}) {
  const [activeTab, setActiveTab] = useState<SecurityTab>("sso");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── 1. SSO State ─────────────────────────────────────────────────────────────
  const [sso, setSso] = useState<EnterpriseSSOConnection | null>(initialSso);
  const [protocol, setProtocol] = useState<SSOProtocol>(initialSso?.protocol || "SAML");
  const [name, setName] = useState(initialSso?.name || "Corporate Identity Provider");
  const [domainsInput, setDomainsInput] = useState((initialSso?.domains || []).join(", "));
  const [enforceSso, setEnforceSso] = useState(initialSso?.enforce_sso || false);
  const [jitProvisioning, setJitProvisioning] = useState(initialSso?.jit_provisioning ?? true);
  const [defaultRole, setDefaultRole] = useState<OrgRole>(initialSso?.default_role || "member");

  // SAML fields
  const [idpEntityId, setIdpEntityId] = useState(initialSso?.idp_entity_id || "");
  const [idpSsoUrl, setIdpSsoUrl] = useState(initialSso?.idp_sso_url || "");
  const [idpCertificate, setIdpCertificate] = useState(initialSso?.idp_certificate || "");

  // OIDC fields
  const [oidcIssuer, setOidcIssuer] = useState(initialSso?.oidc_issuer || "");
  const [oidcClientId, setOidcClientId] = useState(initialSso?.oidc_client_id || "");
  const [oidcClientSecret, setOidcClientSecret] = useState(initialSso?.oidc_client_secret || "");
  const [oidcAuthEndpoint, setOidcAuthEndpoint] = useState(initialSso?.oidc_authorization_endpoint || "");
  const [oidcTokenEndpoint, setOidcTokenEndpoint] = useState(initialSso?.oidc_token_endpoint || "");
  const [oidcUserInfoEndpoint, setOidcUserInfoEndpoint] = useState(initialSso?.oidc_userinfo_endpoint || "");

  // SSO Operations
  const [ssoSaving, setSsoSaving] = useState(false);
  const [ssoSuccess, setSsoSuccess] = useState("");
  const [ssoError, setSsoError] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);
  const [autoDiscovering, setAutoDiscovering] = useState(false);

  // ── 2. Verified Domains State ────────────────────────────────────────────────
  const [domains, setDomains] = useState<VerifiedDomain[]>(initialDomains);
  const [newDomain, setNewDomain] = useState("");
  const [addingDomain, setAddingDomain] = useState(false);
  const [domainError, setDomainError] = useState("");
  const [domainSuccess, setDomainSuccess] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // ── 3. Policies State ────────────────────────────────────────────────────────
  const [policies, setPolicies] = useState<SecurityPolicies>(
    initialPolicies || {
      enforce_sso: false,
      allow_emergency_owner_login: true,
      session_idle_timeout_minutes: 1440,
      enforce_2fa: false,
      allowed_domains: [],
      allowed_cidrs: [],
      enforce_ip_allowlist: false,
      anonymize_pii_days: null,
    }
  );
  const [cidrsInput, setCidrsInput] = useState((initialPolicies?.allowed_cidrs || []).join("\n"));
  const [policiesSaving, setPoliciesSaving] = useState(false);
  const [policiesSuccess, setPoliciesSuccess] = useState("");
  const [policiesError, setPoliciesError] = useState("");

  // ── 4. Sessions State ────────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<EnterpriseSession[]>(initialSessions);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // ── 5. Audit Logs State ──────────────────────────────────────────────────────
  const [auditLogs] = useState<EnterpriseAuditLog[]>(initialAuditLogs);
  const [auditFilter, setAuditFilter] = useState("");
  const [exportingAuditLogs, setExportingAuditLogs] = useState(false);

  // ── 6. SCIM 2.0 Directory Sync State ─────────────────────────────────────────
  const [scimToken, setScimToken] = useState<ScimTokenInfo | null>(initialScimToken);
  const [rawGeneratedScimToken, setRawGeneratedScimToken] = useState<string | null>(null);
  const [generatingScim, setGeneratingScim] = useState(false);
  const [scimError, setScimError] = useState("");
  const [scimSuccess, setScimSuccess] = useState("");

  // ── 7. Custom CNAME Domains State ────────────────────────────────────────────
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>(initialCustomDomains);
  const [newCustomDomain, setNewCustomDomain] = useState("");
  const [addingCustomDomain, setAddingCustomDomain] = useState(false);
  const [verifyingCustomDomainId, setVerifyingCustomDomainId] = useState<string | null>(null);
  const [customDomainError, setCustomDomainError] = useState("");
  const [customDomainSuccess, setCustomDomainSuccess] = useState("");

  function copyToClipboard(text: string, key: string) {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  }

  // ── SSO Actions ──────────────────────────────────────────────────────────────
  async function handleSaveSSO(e: React.FormEvent) {
    e.preventDefault();
    setSsoSaving(true);
    setSsoError("");
    setSsoSuccess("");

    const domainsList = domainsInput
      .split(",")
      .map((d) => d.trim().toLowerCase().replace(/^@/, ""))
      .filter(Boolean);

    const res = await saveSSOConnection(org.id, {
      name,
      protocol,
      status: sso?.status === "active" ? "active" : "draft",
      domains: domainsList,
      enforce_sso: enforceSso,
      jit_provisioning: jitProvisioning,
      default_role: defaultRole,
      idp_entity_id: idpEntityId || null,
      idp_sso_url: idpSsoUrl || null,
      idp_certificate: idpCertificate || null,
      oidc_issuer: oidcIssuer || null,
      oidc_client_id: oidcClientId || null,
      oidc_client_secret: oidcClientSecret || null,
      oidc_authorization_endpoint: oidcAuthEndpoint || null,
      oidc_token_endpoint: oidcTokenEndpoint || null,
      oidc_userinfo_endpoint: oidcUserInfoEndpoint || null,
    });

    setSsoSaving(false);
    if (!res.success || !res.connection) {
      setSsoError(res.error || "Failed to save SSO configuration.");
      return;
    }

    setSso(res.connection);
    setSsoSuccess("SSO configuration saved successfully.");
    setTimeout(() => setSsoSuccess(""), 4000);
  }

  async function handleTestConnection() {
    setTestingConnection(true);
    setTestResult(null);
    setSsoError("");

    const res = await testSSOConnection(org.id, {
      protocol,
      idp_sso_url: idpSsoUrl,
      idp_certificate: idpCertificate,
      idp_entity_id: idpEntityId,
      oidc_issuer: oidcIssuer,
      oidc_client_id: oidcClientId,
    });

    setTestingConnection(false);
    setTestResult(res);
  }

  async function handleToggleStatus() {
    const nextStatus = sso?.status === "active" ? "inactive" : "active";
    const res = await toggleSSOStatus(org.id, nextStatus);
    if (!res.success) {
      setSsoError(res.error || "Failed to toggle SSO status.");
      return;
    }
    setSso((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    setSsoSuccess(`SSO connection is now ${nextStatus}.`);
    setTimeout(() => setSsoSuccess(""), 3500);
  }

  async function handleOidcAutoDiscover() {
    if (!oidcIssuer || !oidcIssuer.startsWith("http")) {
      setSsoError("Please enter a valid OIDC Issuer URL before running auto-discovery.");
      return;
    }
    setAutoDiscovering(true);
    setSsoError("");

    const res = await discoverOidcEndpoints(oidcIssuer);
    setAutoDiscovering(false);
    if (!res.success || !res.doc) {
      setSsoError(res.error || "Failed to discover endpoints from issuer.");
      return;
    }

    if (res.doc.authorization_endpoint) setOidcAuthEndpoint(res.doc.authorization_endpoint);
    if (res.doc.token_endpoint) setOidcTokenEndpoint(res.doc.token_endpoint);
    if (res.doc.userinfo_endpoint) setOidcUserInfoEndpoint(res.doc.userinfo_endpoint);

    setSsoSuccess("Endpoints automatically populated from OpenID Discovery document!");
    setTimeout(() => setSsoSuccess(""), 4000);
  }

  // ── Domain Actions ───────────────────────────────────────────────────────────
  async function handleAddDomain(e: React.FormEvent) {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setAddingDomain(true);
    setDomainError("");
    setDomainSuccess("");

    const res = await addDomain(org.id, newDomain);
    setAddingDomain(false);
    if (!res.success || !res.domain) {
      setDomainError(res.error || "Failed to add domain.");
      return;
    }

    setDomains([res.domain, ...domains]);
    setNewDomain("");
    setDomainSuccess(`Domain ${res.domain.domain} added. Configure the DNS TXT record below to verify.`);
  }

  async function handleVerifyDomain(domainId: string) {
    setVerifyingId(domainId);
    setDomainError("");
    setDomainSuccess("");

    const res = await verifyDomain(org.id, domainId);
    setVerifyingId(null);
    if (!res.success) {
      setDomainError(res.error || "Verification failed. Check TXT record propagation.");
      return;
    }

    setDomains(
      domains.map((d) =>
        d.id === domainId ? { ...d, status: "verified", verified_at: new Date().toISOString() } : d
      )
    );
    setDomainSuccess(res.message || "Domain verified successfully!");
  }

  async function handleDeleteDomain(domainId: string) {
    const res = await deleteDomain(org.id, domainId);
    if (res.success) {
      setDomains(domains.filter((d) => d.id !== domainId));
    }
  }

  // ── Policy Actions ───────────────────────────────────────────────────────────
  async function handleSavePolicies(e: React.FormEvent) {
    e.preventDefault();
    setPoliciesSaving(true);
    setPoliciesError("");
    setPoliciesSuccess("");

    const cidrs = cidrsInput
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const payload = {
      ...policies,
      allowed_cidrs: cidrs,
      enforce_ip_allowlist: Boolean(policies.enforce_ip_allowlist),
    };

    const res = await updateSecurityPolicies(org.id, payload);
    setPoliciesSaving(false);
    if (!res.success) {
      setPoliciesError(res.error || "Failed to update policies.");
      return;
    }
    setPolicies(payload);
    setPoliciesSuccess("Authentication and network policies updated successfully.");
    setTimeout(() => setPoliciesSuccess(""), 3500);
  }

  // ── Session Revocation ───────────────────────────────────────────────────────
  async function handleRevokeSession(sessionId: string) {
    setRevokingId(sessionId);
    const res = await revokeEnterpriseSession(org.id, sessionId);
    setRevokingId(null);
    if (res.success) {
      setSessions(
        sessions.map((s) => (s.id === sessionId ? { ...s, status: "revoked" } : s))
      );
    }
  }

  // ── Audit Log SIEM Export ───────────────────────────────────────────────────
  async function handleExportAuditLogs(format: "json" | "csv") {
    setExportingAuditLogs(true);
    const res = await exportAuditLogs(org.id, format);
    setExportingAuditLogs(false);
    if (!res.success || !res.data || !res.filename) {
      return;
    }

    const blob = new Blob([res.data], {
      type: format === "json" ? "application/json" : "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = res.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── SCIM Directory Actions ───────────────────────────────────────────────────
  async function handleGenerateScimToken() {
    setGeneratingScim(true);
    setScimError("");
    setScimSuccess("");

    const res = await createOrRegenerateScimToken(org.id);
    setGeneratingScim(false);

    if (!res.success || !res.rawToken) {
      setScimError(res.error || "Failed to generate SCIM directory token.");
      return;
    }

    setRawGeneratedScimToken(res.rawToken);
    setScimToken({
      id: "scim-token-new",
      tokenHint: res.tokenHint || "scim_...live",
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
    });
    setScimSuccess("New SCIM token generated. Copy it now, it will not be displayed again!");
  }

  async function handleDeleteScimToken() {
    if (
      !confirm(
        "Are you sure you want to revoke this SCIM directory token? Automated provisioning from Okta / Entra ID will cease immediately."
      )
    ) {
      return;
    }
    const res = await deleteScimToken(org.id);
    if (res.success) {
      setScimToken(null);
      setRawGeneratedScimToken(null);
      setScimSuccess("SCIM directory token revoked.");
      setTimeout(() => setScimSuccess(""), 3500);
    }
  }

  // ── Custom CNAME Domain Actions ─────────────────────────────────────────────
  async function handleAddCustomDomain(e: React.FormEvent) {
    e.preventDefault();
    if (!newCustomDomain.trim()) return;
    setAddingCustomDomain(true);
    setCustomDomainError("");
    setCustomDomainSuccess("");

    const res = await addCustomDomain(org.id, newCustomDomain);
    setAddingCustomDomain(false);

    if (!res.success || !res.domain) {
      setCustomDomainError(res.error || "Failed to add custom domain.");
      return;
    }

    setCustomDomains([res.domain, ...customDomains]);
    setNewCustomDomain("");
    setCustomDomainSuccess(
      `Custom domain ${res.domain.domain} registered! Point your DNS CNAME to ${res.domain.cname_target} to verify.`
    );
  }

  async function handleVerifyCustomDomain(domainId: string) {
    setVerifyingCustomDomainId(domainId);
    setCustomDomainError("");
    setCustomDomainSuccess("");

    const res = await verifyCustomDomain(org.id, domainId);
    setVerifyingCustomDomainId(null);

    if (!res.success) {
      setCustomDomainError(res.error || "DNS verification failed.");
      return;
    }

    if (res.verified) {
      setCustomDomains(
        customDomains.map((d) =>
          d.id === domainId
            ? {
                ...d,
                status: "active",
                ssl_status: "issued",
                verified_at: new Date().toISOString(),
              }
            : d
        )
      );
      setCustomDomainSuccess(
        res.message || "Custom domain verified! SSL certificate is active."
      );
    } else {
      setCustomDomainError(res.message || "DNS CNAME record not detected yet.");
    }
  }

  async function handleDeleteCustomDomain(domainId: string) {
    const res = await deleteCustomDomain(org.id, domainId);
    if (res.success) {
      setCustomDomains(customDomains.filter((d) => d.id !== domainId));
    }
  }

  const verifiedCount = domains.filter((d) => d.status === "verified").length;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs relative overflow-hidden">
        <div
          className="absolute -right-12 -top-12 w-64 h-64 rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, #ddd6fe 0%, transparent 70%)" }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-50 text-brand border border-brand/20">
                Enterprise Security Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                Tenant: {org.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Enterprise Access Control &amp; Single Sign-On
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Connect systems like Okta, Microsoft Entra ID, Google Workspace, OneLogin, or JumpCloud using standard SAML 2.0 &amp; OpenID Connect.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/org/${orgSlug}/settings`}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              General Settings
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 border-t border-neutral-100 mt-6 no-scrollbar">
          {[
            { id: "sso", label: "Single Sign-On", icon: ShieldCheck, badge: sso?.status === "active" ? "Active" : null },
            { id: "scim", label: "Directory Sync (SCIM)", icon: Users, badge: scimToken ? "Configured" : null },
            { id: "domains", label: "SSO Domains", icon: Globe, count: verifiedCount },
            { id: "custom-domains", label: "Custom Domains", icon: Globe2, count: customDomains.length },
            { id: "policies", label: "Policies & Network", icon: Network },
            { id: "sessions", label: "Sessions", icon: Laptop, count: sessions.filter((s) => s.status === "active").length },
            { id: "audit-logs", label: "Audit Logs", icon: FileText },
            { id: "api", label: "API Access", icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SecurityTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {typeof tab.count === "number" && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: SINGLE SIGN-ON (SSO) ─────────────────────────────────────── */}
      {activeTab === "sso" && (
        <div className="space-y-6">
          {/* Status Bar */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-3.5 h-3.5 rounded-full animate-pulse ${
                  sso?.status === "active"
                    ? "bg-green-500 shadow-xs shadow-green-500/50"
                    : sso?.status === "draft"
                    ? "bg-amber-400"
                    : "bg-neutral-300"
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Status:</span>
                  <span className="text-sm font-bold capitalize text-neutral-900">
                    {sso?.status === "active" ? "Active" : sso?.status === "draft" ? "Draft / In Progress" : "Not configured"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {sso?.status === "active"
                    ? "Team members are authenticating through your enterprise identity provider."
                    : "Configure SAML 2.0 or OpenID Connect parameters below."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {sso?.status === "active" ? (
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 border border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  Disable SSO
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
                >
                  Enable SSO
                </button>
              )}
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveSSO} className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Identity Provider Protocol</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select standards-compliant SAML 2.0 or OpenID Connect (OIDC)
                </p>
              </div>

              {/* Protocol Switcher */}
              <div className="inline-flex p-1 bg-neutral-100 rounded-xl border border-neutral-200/80">
                <button
                  type="button"
                  onClick={() => setProtocol("SAML")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    protocol === "SAML"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  SAML 2.0
                </button>
                <button
                  type="button"
                  onClick={() => setProtocol("OIDC")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    protocol === "OIDC"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  OpenID Connect
                </button>
              </div>
            </div>

            {/* General SSO metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Connection Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Okta Corporate IdP, Entra ID SSO"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Organization Domains
                </label>
                <input
                  value={domainsInput}
                  onChange={(e) => setDomainsInput(e.target.value)}
                  placeholder="events.company.com, company.com"
                  className={inputCls}
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Comma-separated domains. Must be verified in Verified Domains tab before enforcing.
                </p>
              </div>
            </div>

            {/* ── SAML SPECIFIC SECTION ─────────────────────────────────── */}
            {protocol === "SAML" && (
              <div className="space-y-6 pt-4 border-t border-neutral-100">
                {/* SP details generated by URPASS */}
                <div className="bg-neutral-50/80 rounded-2xl p-5 border border-neutral-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand" />
                      <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                        URPASS Service Provider (SP) Credentials
                      </h3>
                    </div>
                    <a
                      href={`/api/auth/sso/saml/metadata/${org.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand font-semibold hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download SP Metadata XML
                    </a>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Copy these values into your Identity Provider (Okta, Microsoft Entra ID, Google Workspace, OneLogin):
                  </p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">
                          Assertion Consumer Service (ACS) URL
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(sso?.acs_url || "", "acs")}
                          className="text-xs text-brand flex items-center gap-1 hover:underline font-medium"
                        >
                          {copiedKey === "acs" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedKey === "acs" ? "Copied" : "Copy ACS URL"}
                        </button>
                      </div>
                      <code className="block p-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 break-all select-all font-mono">
                        {sso?.acs_url}
                      </code>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">
                          SP Entity ID / Audience URI
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(sso?.sp_entity_id || "", "sp_entity")}
                          className="text-xs text-brand flex items-center gap-1 hover:underline font-medium"
                        >
                          {copiedKey === "sp_entity" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedKey === "sp_entity" ? "Copied" : "Copy SP Entity ID"}
                        </button>
                      </div>
                      <code className="block p-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 break-all select-all font-mono">
                        {sso?.sp_entity_id}
                      </code>
                    </div>
                  </div>
                </div>

                {/* IdP configuration fields */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Identity Provider (IdP) Setup
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      SSO Login URL *
                    </label>
                    <input
                      value={idpSsoUrl}
                      onChange={(e) => setIdpSsoUrl(e.target.value)}
                      placeholder="https://company.okta.com/app/urpass/sso/saml"
                      className={inputCls}
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      The Single Sign-On endpoint on your IdP where URPASS sends AuthnRequests.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      Entity ID / Issuer *
                    </label>
                    <input
                      value={idpEntityId}
                      onChange={(e) => setIdpEntityId(e.target.value)}
                      placeholder="http://www.okta.com/exk123456789 or https://sts.windows.net/..."
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      X.509 Certificate *
                    </label>
                    <textarea
                      value={idpCertificate}
                      onChange={(e) => setIdpCertificate(e.target.value)}
                      rows={5}
                      placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDpDCCAoygAwIBAgIG...&#10;-----END CERTIFICATE-----"
                      className={`${inputCls} font-mono text-xs`}
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Public signing certificate in PEM format provided by your Identity Provider.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── OIDC SPECIFIC SECTION ─────────────────────────────────── */}
            {protocol === "OIDC" && (
              <div className="space-y-6 pt-4 border-t border-neutral-100">
                <div className="bg-neutral-50/80 rounded-2xl p-5 border border-neutral-200/80 space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">
                      URPASS OIDC Redirect URI (Callback)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${window.location.origin}/api/auth/sso/oidc/callback`, "oidc_cb")}
                      className="text-xs text-brand flex items-center gap-1 hover:underline font-medium"
                    >
                      {copiedKey === "oidc_cb" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === "oidc_cb" ? "Copied" : "Copy Redirect URI"}
                    </button>
                  </div>
                  <code className="block p-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 break-all select-all font-mono">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/api/auth/sso/oidc/callback`
                      : "https://urpass.space/api/auth/sso/oidc/callback"}
                  </code>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-neutral-800 block mb-1">
                        Issuer URL *
                      </label>
                      <input
                        value={oidcIssuer}
                        onChange={(e) => setOidcIssuer(e.target.value)}
                        placeholder="https://login.microsoftonline.com/tenant-id/v2.0 or https://accounts.google.com"
                        className={inputCls}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleOidcAutoDiscover}
                      disabled={autoDiscovering}
                      className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      {autoDiscovering ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      Auto-discover
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-800 block mb-1">
                        Client ID *
                      </label>
                      <input
                        value={oidcClientId}
                        onChange={(e) => setOidcClientId(e.target.value)}
                        placeholder="00000000-0000-0000-0000-000000000000"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-800 block mb-1">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        value={oidcClientSecret}
                        onChange={(e) => setOidcClientSecret(e.target.value)}
                        placeholder="••••••••••••••••••••"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-800 block mb-1">
                        Authorization Endpoint
                      </label>
                      <input
                        value={oidcAuthEndpoint}
                        onChange={(e) => setOidcAuthEndpoint(e.target.value)}
                        placeholder="https://.../authorize"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-800 block mb-1">
                        Token Endpoint
                      </label>
                      <input
                        value={oidcTokenEndpoint}
                        onChange={(e) => setOidcTokenEndpoint(e.target.value)}
                        placeholder="https://.../token"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1">
                      UserInfo Endpoint (Optional)
                    </label>
                    <input
                      value={oidcUserInfoEndpoint}
                      onChange={(e) => setOidcUserInfoEndpoint(e.target.value)}
                      placeholder="https://.../userinfo"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Provisioning & Enforcement Policies ─────────────────────── */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Access &amp; Provisioning Rules
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enforceSso}
                    onChange={(e) => setEnforceSso(e.target.checked)}
                    className="w-4 h-4 rounded text-brand focus:ring-brand mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Enforce SSO for organization</p>
                    <p className="text-[11px] text-neutral-400">
                      Disables password and social logins for team members with matching verified domains. (Organization owner emergency login remains active).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jitProvisioning}
                    onChange={(e) => setJitProvisioning(e.target.checked)}
                    className="w-4 h-4 rounded text-brand focus:ring-brand mt-0.5"
                  />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Automatically provision new users (JIT)</p>
                    <p className="text-[11px] text-neutral-400">
                      When enabled, authenticated corporate employees who do not yet have an account are automatically provisioned with organization membership.
                    </p>
                  </div>
                </label>
              </div>

              <div className="max-w-xs pt-1">
                <label className="text-xs font-semibold text-neutral-800 block mb-1">
                  Default Role for Auto-Provisioned Users
                </label>
                <select
                  value={defaultRole}
                  onChange={(e) => setDefaultRole(e.target.value as OrgRole)}
                  className={inputCls}
                >
                  <option value="checkin_staff">Staff (checkin_staff) — Gate check-in</option>
                  <option value="member">Member — Standard tenant member</option>
                  <option value="viewer">Viewer — Read-only access</option>
                  <option value="event_manager">Event Manager — Can create &amp; manage events</option>
                  <option value="admin">Admin — Full organization management</option>
                </select>
              </div>
            </div>

            {/* Test Connection Results Banner */}
            {testResult && (
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  testResult.success
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  {testResult.success ? "Connection Test Passed" : "Connection Test Failed"}
                </div>
                <p>{testResult.message}</p>
                {testResult.details && (
                  <div className="mt-2 pt-2 border-t border-black/10 font-mono text-[11px] space-y-0.5">
                    {Object.entries(testResult.details).map(([k, v]) => (
                      <div key={k}>
                        <span className="opacity-70">{k}:</span> {String(v)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {ssoError && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                {ssoError}
              </div>
            )}

            {ssoSuccess && (
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                {ssoSuccess}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
              >
                {testingConnection ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-brand" />}
                Test Connection
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={ssoSaving}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  style={{ background: "#6D28D9" }}
                >
                  {ssoSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Configuration
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── TAB: SCIM DIRECTORY SYNC ───────────────────────────────────────── */}
      {activeTab === "scim" && (
        <div className="space-y-6">
          {/* Status & Overview */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">SCIM 2.0 Directory Sync &amp; Automated Deprovisioning</h2>
                  <p className="text-xs text-neutral-400">
                    RFC 7643 &amp; RFC 7644 compliant directory engine for Okta, Microsoft Entra ID, and OneLogin.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    scimToken
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }`}
                >
                  {scimToken ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />}
                  {scimToken ? "Directory Sync Active" : "Not Configured"}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
              SCIM (System for Cross-domain Identity Management) enables automated onboarding and instant offboarding.
              When an employee leaves your organization or is unassigned in your IdP, their URPASS account is immediately
              deactivated, revoking active sessions across web and scanner apps.
            </p>

            {/* Base URL and Endpoint Information */}
            <div className="bg-neutral-50/90 rounded-2xl p-5 border border-neutral-200/80 space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand" />
                SCIM 2.0 Connector Credentials
              </h3>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">
                    SCIM 2.0 Base URL
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${typeof window !== "undefined" ? window.location.origin : "https://app.urpass.in"}/api/scim/v2/${org.id}`, "scim-base")}
                    className="text-xs text-brand flex items-center gap-1 hover:underline font-medium"
                  >
                    {copiedKey === "scim-base" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === "scim-base" ? "Copied" : "Copy Base URL"}
                  </button>
                </div>
                <code className="block p-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 break-all select-all font-mono">
                  {typeof window !== "undefined" ? window.location.origin : "https://app.urpass.in"}/api/scim/v2/{org.id}
                </code>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                  Authentication Mode
                </span>
                <p className="text-xs text-neutral-700 bg-white border border-neutral-200 rounded-xl p-2.5 font-medium">
                  HTTP Header: <code className="font-mono text-neutral-900 font-semibold">Authorization: Bearer &lt;SCIM_TOKEN&gt;</code>
                </p>
              </div>
            </div>

            {/* Newly Generated Raw Token Banner */}
            {rawGeneratedScimToken && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  New SCIM Bearer Provisioning Token Generated
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Make sure to copy this token right now. For security purposes, it will never be displayed again.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={rawGeneratedScimToken}
                    className="w-full font-mono text-xs p-3 bg-white rounded-xl border border-emerald-300 text-neutral-900 select-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(rawGeneratedScimToken, "scim-raw-token")}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    {copiedKey === "scim-raw-token" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedKey === "scim-raw-token" ? "Copied" : "Copy Token"}
                  </button>
                </div>
              </div>
            )}

            {/* Token Status / Actions */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {scimToken ? (
                <div className="space-y-1">
                  <p className="text-xs text-neutral-700">
                    <span className="font-semibold">Active Token Hint:</span>{" "}
                    <code className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-[11px] text-neutral-800">
                      {scimToken.tokenHint}
                    </code>
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Created: {new Date(scimToken.createdAt).toLocaleString()}
                    {scimToken.lastUsedAt && ` · Last used: ${new Date(scimToken.lastUsedAt).toLocaleString()}`}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-500">
                  No active SCIM token. Generate a Bearer token to connect Okta or Microsoft Entra ID.
                </p>
              )}

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleGenerateScimToken}
                  disabled={generatingScim}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  {generatingScim ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  {scimToken ? "Regenerate Token" : "Generate SCIM Token"}
                </button>
                {scimToken && (
                  <button
                    type="button"
                    onClick={handleDeleteScimToken}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                  >
                    Revoke Token
                  </button>
                )}
              </div>
            </div>

            {scimError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {scimError}
              </div>
            )}
            {scimSuccess && !rawGeneratedScimToken && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                {scimSuccess}
              </div>
            )}
          </div>

          {/* Setup Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-neutral-900">Okta SCIM Integration</h4>
              </div>
              <ol className="text-xs text-neutral-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>In Okta Admin Console, navigate to <strong>Applications &gt; Applications</strong>.</li>
                <li>Under the <strong>Provisioning</strong> tab, set Integration to <strong>SCIM 2.0</strong>.</li>
                <li>Paste the <strong>SCIM 2.0 Base URL</strong> and generated Bearer token.</li>
                <li>Check <strong>Enable Create Users</strong>, <strong>Enable Update User Attributes</strong>, and <strong>Enable Deactivate Users</strong>.</li>
              </ol>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-neutral-900">Microsoft Entra ID (Azure AD) Sync</h4>
              </div>
              <ol className="text-xs text-neutral-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Open <strong>Entra ID &gt; Enterprise Applications &gt; Provisioning</strong>.</li>
                <li>Set Provisioning Mode to <strong>Automatic</strong>.</li>
                <li>Input Tenant URL: <code className="font-mono text-[11px] bg-neutral-100 px-1 py-0.5 rounded">&lt;SCIM_BASE_URL&gt;</code></li>
                <li>Input Secret Token: your generated Bearer token, then click <strong>Test Connection</strong>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: VERIFIED DOMAINS ─────────────────────────────────────────── */}
      {activeTab === "domains" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Verified Organization Domains</h2>
                <p className="text-xs text-neutral-400">
                  Prove ownership of corporate domains before enforcing SSO or routing logins.
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              URPASS requires DNS TXT verification before allowing <strong>Enforce SSO</strong> or automated organization membership. This ensures that unauthorized actors cannot claim your domain.
            </p>

            {/* Add Domain Form */}
            <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="events.company.com or company.com"
                className={`${inputCls} flex-1`}
              />
              <button
                type="submit"
                disabled={addingDomain || !newDomain.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0 flex items-center gap-1.5"
              >
                {addingDomain && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Add Domain
              </button>
            </form>

            {domainError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {domainError}
              </div>
            )}
            {domainSuccess && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                {domainSuccess}
              </div>
            )}
          </div>

          {/* Domains Listing */}
          <div className="space-y-4">
            {domains.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 text-center space-y-2">
                <Globe className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="text-sm font-bold text-neutral-800">No domains added yet</p>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Add your primary organizational domain above to generate verification tokens.
                </p>
              </div>
            ) : (
              domains.map((dom) => (
                <div
                  key={dom.id}
                  className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-neutral-900 font-mono">{dom.domain}</span>
                      {dom.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : dom.status === "failed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3" />
                          TXT Record Mismatch
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending DNS Check
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {dom.status !== "verified" && (
                        <button
                          type="button"
                          onClick={() => handleVerifyDomain(dom.id)}
                          disabled={verifyingId === dom.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand bg-brand-50 hover:bg-brand-100 transition-colors flex items-center gap-1"
                        >
                          {verifyingId === dom.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3 h-3" />
                          )}
                          Verify Now
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteDomain(dom.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {dom.status !== "verified" ? (
                    <div className="bg-neutral-50 rounded-xl p-4 text-xs space-y-2.5 border border-neutral-200/80">
                      <p className="font-semibold text-neutral-800">DNS Configuration Instructions:</p>
                      <p className="text-neutral-500">
                        Add a <strong>TXT</strong> record in your DNS provider (Cloudflare, Route 53, GoDaddy, Google Domains) for <strong>{dom.domain}</strong>:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                            Record Type / Host
                          </span>
                          <code className="p-2 bg-white rounded-lg border border-neutral-200 block font-mono text-neutral-800">
                            TXT / @
                          </code>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              Required TXT Value
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(dom.verification_token, dom.id)}
                              className="text-[11px] text-brand hover:underline font-semibold flex items-center gap-0.5"
                            >
                              {copiedKey === dom.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              Copy
                            </button>
                          </div>
                          <code className="p-2 bg-white rounded-lg border border-neutral-200 block font-mono text-neutral-800 break-all select-all">
                            {dom.verification_token}
                          </code>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">
                      Verified on {dom.verified_at ? new Date(dom.verified_at).toLocaleDateString() : "Active"}. Eligible for Enforced SSO.
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB: CUSTOM CNAME DOMAINS ───────────────────────────────────────── */}
      {activeTab === "custom-domains" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                <Globe2 className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Custom CNAME Domains &amp; Branded Portals</h2>
                <p className="text-xs text-neutral-400">
                  Host your organization event catalog, ticket check-in gates, and certificates under your own domain name.
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Connect a custom subdomain (e.g. <code className="font-mono text-neutral-800">events.acmecorp.com</code>) to URPASS with automated SSL certificate provisioning and white-label branding.
            </p>

            {/* Add Custom Domain Form */}
            <form onSubmit={handleAddCustomDomain} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                value={newCustomDomain}
                onChange={(e) => setNewCustomDomain(e.target.value)}
                placeholder="events.company.com or tickets.university.edu"
                className={`${inputCls} flex-1`}
              />
              <button
                type="submit"
                disabled={addingCustomDomain || !newCustomDomain.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-opacity disabled:opacity-50 shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                {addingCustomDomain && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Connect Domain
              </button>
            </form>

            {customDomainError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {customDomainError}
              </div>
            )}
            {customDomainSuccess && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                {customDomainSuccess}
              </div>
            )}
          </div>

          {/* Domains Listing */}
          <div className="space-y-4">
            {customDomains.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 text-center space-y-2">
                <Globe2 className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="text-sm font-bold text-neutral-800">No custom domains configured yet</p>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Add your branded subdomain above to generate DNS CNAME routing instructions.
                </p>
              </div>
            ) : (
              customDomains.map((dom) => (
                <div
                  key={dom.id}
                  className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-neutral-900 font-mono">{dom.domain}</span>
                      {dom.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Active &amp; Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending DNS Propagation
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                        SSL: {dom.ssl_status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {dom.status !== "active" && (
                        <button
                          type="button"
                          onClick={() => handleVerifyCustomDomain(dom.id)}
                          disabled={verifyingCustomDomainId === dom.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand bg-brand-50 hover:bg-brand-100 transition-colors flex items-center gap-1"
                        >
                          {verifyingCustomDomainId === dom.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3 h-3" />
                          )}
                          Verify CNAME
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomDomain(dom.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4 text-xs space-y-2.5 border border-neutral-200/80">
                    <p className="font-semibold text-neutral-800">DNS Configuration Instructions:</p>
                    <p className="text-neutral-500">
                      Add a <strong>CNAME</strong> record in your DNS provider pointing your subdomain to URPASS edge routers:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                          Record Type / Subdomain Host
                        </span>
                        <code className="p-2 bg-white rounded-lg border border-neutral-200 block font-mono text-neutral-800">
                          CNAME / {dom.domain.split(".")[0] || "@"}
                        </code>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                            Target / Value
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(dom.cname_target, dom.id)}
                            className="text-[11px] text-brand hover:underline font-semibold flex items-center gap-0.5"
                          >
                            {copiedKey === dom.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            Copy Target
                          </button>
                        </div>
                        <code className="p-2 bg-white rounded-lg border border-neutral-200 block font-mono text-neutral-800 break-all select-all font-semibold">
                          {dom.cname_target}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: AUTHENTICATION POLICIES ──────────────────────────────────── */}
      {activeTab === "policies" && (
        <form onSubmit={handleSavePolicies} className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
              <Key className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Enterprise Authentication Policies</h2>
              <p className="text-xs text-neutral-400">
                Security rules, session lifespans, and emergency access provisions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50/50 transition-colors">
              <input
                type="checkbox"
                checked={policies.enforce_sso}
                onChange={(e) => setPolicies({ ...policies, enforce_sso: e.target.checked })}
                className="w-4 h-4 rounded text-brand focus:ring-brand mt-0.5"
              />
              <div>
                <p className="text-xs font-bold text-neutral-900">Enforce SSO for all organization members</p>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                  Requires all employees and students to authenticate through your corporate SAML or OIDC IdP. Direct email and password login will be disabled.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-neutral-200 bg-amber-50/40 border-amber-200/80 transition-colors">
              <input
                type="checkbox"
                checked={policies.allow_emergency_owner_login}
                onChange={(e) => setPolicies({ ...policies, allow_emergency_owner_login: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 mt-0.5"
              />
              <div>
                <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Allow Emergency Owner Login Bypass (Recommended)
                </p>
                <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
                  Permits the primary organization owner to sign in via password or magic link even when SSO is enforced. Protects against permanent lockout in the event of expired IdP X.509 certificates or network outages.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50/50 transition-colors">
              <input
                type="checkbox"
                checked={policies.enforce_2fa}
                onChange={(e) => setPolicies({ ...policies, enforce_2fa: e.target.checked })}
                className="w-4 h-4 rounded text-brand focus:ring-brand mt-0.5"
              />
              <div>
                <p className="text-xs font-bold text-neutral-900">Enforce Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                  Gate scanner staff and event coordinators must have 2FA enabled before accessing check-in scanners.
                </p>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Session Inactivity Timeout
              </label>
              <select
                value={policies.session_idle_timeout_minutes}
                onChange={(e) => setPolicies({ ...policies, session_idle_timeout_minutes: Number(e.target.value) })}
                className={inputCls}
              >
                <option value={60}>1 hour</option>
                <option value={240}>4 hours</option>
                <option value={1440}>24 hours (1 day)</option>
                <option value={10080}>7 days</option>
              </select>
              <p className="text-[11px] text-neutral-400 mt-1">
                Inactive browser sessions will be terminated automatically.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                GDPR &amp; SOC 2 Attendee PII Retention
              </label>
              <select
                value={policies.anonymize_pii_days ?? ""}
                onChange={(e) =>
                  setPolicies({
                    ...policies,
                    anonymize_pii_days: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className={inputCls}
              >
                <option value="">Disabled (Indefinite retention)</option>
                <option value={30}>30 days post-event</option>
                <option value={90}>90 days post-event (Recommended)</option>
                <option value={180}>180 days post-event</option>
                <option value={365}>365 days (1 year)</option>
              </select>
              <p className="text-[11px] text-neutral-400 mt-1">
                Automated scrubbing of phone numbers and identity data per GDPR Art. 17.
              </p>
            </div>
          </div>

          {/* Network IP & CIDR Allowlisting */}
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Corporate Network &amp; IP Allowlisting
              </h3>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Restrict organizer dashboard access, event management, and check-in scanner gateways strictly to your corporate VPN or campus IP ranges.
            </p>

            <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50/50 transition-colors">
              <input
                type="checkbox"
                checked={policies.enforce_ip_allowlist}
                onChange={(e) => setPolicies({ ...policies, enforce_ip_allowlist: e.target.checked })}
                className="w-4 h-4 rounded text-brand focus:ring-brand mt-0.5"
              />
              <div>
                <p className="text-xs font-bold text-neutral-900">Enforce IP Network Allowlist</p>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                  When enabled, any admin or organizer attempting to access this tenant from an IP outside the allowed list will be blocked with HTTP 403.
                </p>
              </div>
            </label>

            <div>
              <label className="text-xs font-semibold text-neutral-800 block mb-1">
                Allowed CIDR Blocks &amp; IP Addresses (One per line)
              </label>
              <textarea
                rows={4}
                value={cidrsInput}
                onChange={(e) => setCidrsInput(e.target.value)}
                placeholder={"198.51.100.0/24\n203.0.113.50/32\n2001:db8::/32"}
                className={`${inputCls} font-mono text-xs`}
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Supports IPv4 CIDRs (e.g. <code className="font-mono">10.0.0.0/8</code>, <code className="font-mono">192.168.1.1/32</code>) and IPv6 subnets.
              </p>
            </div>
          </div>

          {policiesError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {policiesError}
            </div>
          )}
          {policiesSuccess && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              {policiesSuccess}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={policiesSaving}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              {policiesSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Policies
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 4: SESSIONS ─────────────────────────────────────────────────── */}
      {activeTab === "sessions" && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Laptop className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Active Tenant Sessions</h2>
                <p className="text-xs text-neutral-400">
                  Monitor and revoke real-time corporate authenticated sessions.
                </p>
              </div>
            </div>

            <span className="text-xs text-neutral-500">
              {sessions.filter((s) => s.status === "active").length} active
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              No recorded SSO sessions found yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-1">User</th>
                    <th className="pb-3">Device / Browser</th>
                    <th className="pb-3">IP Address</th>
                    <th className="pb-3">Last Active</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-1">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {sessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 pl-1">
                        <p className="font-semibold text-neutral-900">{sess.user_name || "Team Member"}</p>
                        <p className="text-neutral-400 text-[11px]">{sess.user_email}</p>
                      </td>
                      <td className="py-3 text-neutral-600">{sess.device || "Browser"}</td>
                      <td className="py-3 font-mono text-[11px] text-neutral-500">
                        {sess.ip_address || "—"}
                      </td>
                      <td className="py-3 text-neutral-500">
                        {new Date(sess.last_active_at).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sess.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {sess.status}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-1">
                        {sess.status === "active" && (
                          <button
                            type="button"
                            onClick={() => handleRevokeSession(sess.id)}
                            disabled={revokingId === sess.id}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
                          >
                            {revokingId === sess.id ? "Revoking…" : "Revoke"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: AUDIT LOGS ───────────────────────────────────────────────── */}
      {activeTab === "audit-logs" && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Enterprise Security Audit Logs</h2>
                <p className="text-xs text-neutral-400">
                  Immutable record of logins, administrative changes, and verification checks.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                placeholder="Filter by action or email…"
                className="text-xs border border-neutral-200 rounded-xl px-3 py-1.5 outline-none focus:border-brand w-40 sm:w-48"
              />
              <button
                type="button"
                onClick={() => handleExportAuditLogs("json")}
                disabled={exportingAuditLogs}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Export Splunk / Datadog CIM JSON"
              >
                {exportingAuditLogs ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <HardDriveDownload className="w-3.5 h-3.5 text-neutral-500" />}
                Export SIEM (JSON)
              </button>
              <button
                type="button"
                onClick={() => handleExportAuditLogs("csv")}
                disabled={exportingAuditLogs}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                CSV
              </button>
            </div>
          </div>

          {auditLogs.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              No audit log entries recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-1">Timestamp</th>
                    <th className="pb-3">Actor</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Resource</th>
                    <th className="pb-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono">
                  {auditLogs
                    .filter((log) => {
                      if (!auditFilter) return true;
                      const q = auditFilter.toLowerCase();
                      return (
                        log.action.toLowerCase().includes(q) ||
                        (log.actor_email && log.actor_email.toLowerCase().includes(q))
                      );
                    })
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-50/50">
                        <td className="py-2.5 pl-1 text-[11px] text-neutral-500 whitespace-nowrap font-sans">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-2.5 text-[11px] text-neutral-700 font-sans">
                          {log.actor_email || "System / Anonymous"}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.action.includes("success") || log.action.includes("verified")
                                ? "bg-green-100 text-green-700"
                                : log.action.includes("failed") || log.action.includes("revoked")
                                ? "bg-red-100 text-red-700"
                                : "bg-neutral-100 text-neutral-700"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 text-[11px] text-neutral-600 font-sans">
                          {log.resource_type}
                        </td>
                        <td className="py-2.5 text-[11px] text-neutral-400">
                          {log.ip_address || "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 6: API ACCESS ───────────────────────────────────────────────── */}
      {activeTab === "api" && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Developer API &amp; Webhooks</h2>
              <p className="text-xs text-neutral-400">
                Programmatic tenant management and event access.
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
            Enterprise tier allows issuing scoped API keys and subscribing to webhook events (ticket registrations, attendee check-ins, capacity alerts) for integration into your internal HR or university student information systems (SIS).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
              <h3 className="text-xs font-bold text-neutral-900">Organization API Keys</h3>
              <p className="text-xs text-neutral-500">
                Generate high-throughput API tokens scoped to this organization tenant.
              </p>
              <Link
                href="/dashboard/developer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline pt-1"
              >
                Manage Developer Keys <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
              <h3 className="text-xs font-bold text-neutral-900">Webhook Endpoints</h3>
              <p className="text-xs text-neutral-500">
                Receive real-time signed HTTP POST payloads for gate check-ins and orders.
              </p>
              <Link
                href="/dashboard/developer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline pt-1"
              >
                Manage Webhook Endpoints <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
