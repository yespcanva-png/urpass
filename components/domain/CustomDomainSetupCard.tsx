"use client";

import { useState } from "react";
import {
  Globe2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Info,
  Server,
  Zap,
  HelpCircle,
} from "lucide-react";
import type { CustomDomain } from "@/types";
import {
  parseDomainParts,
  getDnsInstructionsForDomain,
  PRIMARY_CNAME_TARGET,
  type DnsDiagnosticResult,
} from "@/lib/dns/realtime-dns";
import { verifyCustomDomain, deleteCustomDomain } from "@/app/actions/custom-domains";

interface CustomDomainSetupCardProps {
  orgId: string;
  domain: CustomDomain;
  onDeleted?: (domainId: string) => void;
  onVerified?: (domain: CustomDomain) => void;
}

type ProviderKey = "cloudflare" | "godaddy" | "namecheap" | "aws" | "google" | "other";

export default function CustomDomainSetupCard({
  orgId,
  domain,
  onDeleted,
  onVerified,
}: CustomDomainSetupCardProps) {
  const [currentDomain, setCurrentDomain] = useState<CustomDomain>(domain);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<ProviderKey>("cloudflare");
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showInstructions, setShowInstructions] = useState(currentDomain.status !== "active");
  const [lastDiagnostics, setLastDiagnostics] = useState<DnsDiagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { cleanDomain, isApex, subdomainPart, apexDomain } = parseDomainParts(currentDomain.domain);
  const dnsInstructions = getDnsInstructionsForDomain(cleanDomain);
  const primaryInstruction = dnsInstructions[0];

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await verifyCustomDomain(orgId, currentDomain.id);
      if (res.diagnostics) {
        setLastDiagnostics(res.diagnostics);
      }

      if (res.verified) {
        const updated: CustomDomain = {
          ...currentDomain,
          status: "active",
          ssl_status: "issued",
          verified_at: new Date().toISOString(),
        };
        setCurrentDomain(updated);
        setSuccessMessage(res.message || "Domain verified and active! TLS certificate is issued.");
        onVerified?.(updated);
      } else {
        setErrorMessage(res.message || "DNS records not detected yet. Propagation in progress.");
        // Open diagnostics if verification failed to show the user what was detected
        setShowDiagnostics(true);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to verify DNS in real time.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${currentDomain.domain}?`)) return;
    setIsDeleting(true);
    try {
      const res = await deleteCustomDomain(orgId, currentDomain.id);
      if (res.success) {
        onDeleted?.(currentDomain.id);
      } else {
        setErrorMessage(res.error || "Failed to remove domain.");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete domain.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden transition-all">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-neutral-50/50 to-white">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
            <Globe2 className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-neutral-900 font-mono">
                {currentDomain.domain}
              </span>
              {currentDomain.status === "active" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active &amp; Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3.5 h-3.5" />
                  Pending DNS Check
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 text-neutral-600">
                <ShieldCheck className="w-3 h-3 text-neutral-500" />
                SSL: {currentDomain.ssl_status === "issued" ? "Active (TLS 1.3)" : currentDomain.ssl_status}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isApex
                ? `Root/Apex domain configured for ${apexDomain}`
                : `Subdomain portal for host "${subdomainPart}" on ${apexDomain}`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
            {isVerifying ? "Querying Real-Time DNS..." : "Check DNS Real-Time"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
            title="Remove Domain"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mx-5 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mx-5 mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold">{errorMessage}</p>
            {lastDiagnostics?.suggestedFix && (
              <p className="text-neutral-700">{lastDiagnostics.suggestedFix}</p>
            )}
          </div>
        </div>
      )}

      {/* DNS Configuration Table */}
      <div className="p-5 sm:p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-neutral-400" />
              Required DNS Record for your Registrar
            </h4>
            <span className="text-[11px] text-teal-600 font-medium">
              Real-time DoH active (Cloudflare 1.1.1.1 + Google 8.8.8.8)
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-200/80 bg-neutral-50/50">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100/70 border-b border-neutral-200/80 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Type</th>
                  <th className="px-3.5 py-2.5">Host / Name</th>
                  <th className="px-3.5 py-2.5">Value / Target</th>
                  <th className="px-3.5 py-2.5">TTL</th>
                  <th className="px-3.5 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 font-mono">
                {dnsInstructions.map((inst, idx) => (
                  <tr key={idx} className="hover:bg-white transition-colors">
                    <td className="px-3.5 py-3 font-bold text-teal-700">
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-100">
                        {inst.type}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 font-bold text-neutral-900">
                      {inst.name}
                    </td>
                    <td className="px-3.5 py-3 text-neutral-800 break-all select-all font-semibold">
                      {inst.value}
                    </td>
                    <td className="px-3.5 py-3 text-neutral-500 font-sans">
                      {inst.ttl}
                    </td>
                    <td className="px-3.5 py-3 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => handleCopy(inst.value, `val-${idx}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 shadow-2xs transition-colors"
                      >
                        {copiedField === `val-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-neutral-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accordion: How to connect across DNS providers */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100/80 transition-colors flex items-center justify-between text-left text-xs font-bold text-neutral-800"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>Step-by-Step Connection Guides by DNS Provider</span>
            </div>
            {showInstructions ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {showInstructions && (
            <div className="p-4 sm:p-5 space-y-4 bg-white">
              {/* Provider Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap border-b border-neutral-200 pb-2.5">
                {[
                  { key: "cloudflare", label: "🟠 Cloudflare" },
                  { key: "godaddy", label: "🟢 GoDaddy" },
                  { key: "namecheap", label: "🔵 Namecheap" },
                  { key: "aws", label: "🟡 AWS Route 53" },
                  { key: "google", label: "🔴 Google Cloud / Domains" },
                  { key: "other", label: "🟣 Hostinger / cPanel / Other" },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setActiveProvider(p.key as ProviderKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeProvider === p.key
                        ? "bg-neutral-900 text-white shadow-2xs"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Provider Instruction Content */}
              <div className="text-xs text-neutral-600 space-y-3 pt-1">
                {activeProvider === "cloudflare" && (
                  <div className="space-y-2.5">
                    <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                      <li>Log in to your <strong>Cloudflare Dashboard</strong> and select your domain (<strong>{apexDomain}</strong>).</li>
                      <li>Navigate to <strong>DNS &gt; Records</strong> and click <strong>Add record</strong>.</li>
                      <li>Set <strong>Type</strong> to <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{primaryInstruction.type}</code>.</li>
                      <li>Set <strong>Name</strong> to <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{subdomainPart}</code>.</li>
                      <li>Set <strong>Target</strong> to <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{primaryInstruction.value}</code>.</li>
                      <li>
                        <strong>Proxy status:</strong> Set to <span className="font-bold text-neutral-800">DNS only (Grey Cloud)</span> during initial setup so our edge resolvers can verify the CNAME directly.
                      </li>
                      <li>Set <strong>TTL</strong> to <strong>Auto</strong>, then click <strong>Save</strong>.</li>
                    </ol>
                    <div className="p-3 rounded-lg bg-teal-50 border border-teal-100 text-[11px] text-teal-800 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>
                        Cloudflare updates DNS in under 5 seconds! Once saved, click <strong>&quot;Check DNS Real-Time&quot;</strong> above.
                      </span>
                    </div>
                  </div>
                )}

                {activeProvider === "godaddy" && (
                  <div className="space-y-2.5">
                    <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                      <li>Log in to your <strong>GoDaddy Domain Portfolio</strong>.</li>
                      <li>Select your domain <strong>{apexDomain}</strong> and click <strong>DNS</strong> or <strong>Manage DNS</strong>.</li>
                      <li>Click <strong>Add New Record</strong>.</li>
                      <li>Select <strong>Type:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">CNAME</code>.</li>
                      <li>Enter <strong>Name:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{subdomainPart}</code> <em>(do not append the full domain name)</em>.</li>
                      <li>Enter <strong>Value:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{PRIMARY_CNAME_TARGET}</code>.</li>
                      <li>Set <strong>TTL:</strong> <strong>1/2 Hour (1800 seconds)</strong> or <strong>Default</strong>, then click <strong>Save</strong>.</li>
                    </ol>
                  </div>
                )}

                {activeProvider === "namecheap" && (
                  <div className="space-y-2.5">
                    <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                      <li>Log in to <strong>Namecheap</strong> and go to <strong>Domain List</strong>.</li>
                      <li>Click <strong>Manage</strong> next to <strong>{apexDomain}</strong>, then select the <strong>Advanced DNS</strong> tab.</li>
                      <li>Click <strong>Add New Record</strong>.</li>
                      <li>Choose <strong>Type:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">CNAME Record</code>.</li>
                      <li>Enter <strong>Host:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{subdomainPart}</code>.</li>
                      <li>Enter <strong>Target:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{PRIMARY_CNAME_TARGET}</code>.</li>
                      <li>Set <strong>TTL:</strong> <strong>Automatic</strong> and click the green checkmark to save.</li>
                    </ol>
                  </div>
                )}

                {activeProvider === "aws" && (
                  <div className="space-y-2.5">
                    <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                      <li>Open the <strong>AWS Route 53 Console</strong> and go to <strong>Hosted zones</strong>.</li>
                      <li>Click on your hosted zone <strong>{apexDomain}</strong> and choose <strong>Create record</strong>.</li>
                      <li>Enter <strong>Record name:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{subdomainPart}</code>.</li>
                      <li>Select <strong>Record type:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">CNAME - Routes traffic to another domain name</code>.</li>
                      <li>Enter <strong>Value:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{PRIMARY_CNAME_TARGET}</code>.</li>
                      <li>Set <strong>TTL:</strong> <strong>300</strong> seconds, then click <strong>Create records</strong>.</li>
                    </ol>
                  </div>
                )}

                {activeProvider === "google" && (
                  <div className="space-y-2.5">
                    <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                      <li>Open <strong>Google Cloud DNS</strong> (or Squarespace Domains / Google Domains manager).</li>
                      <li>Select your zone for <strong>{apexDomain}</strong> and click <strong>Add standard record</strong>.</li>
                      <li>Set <strong>DNS Name:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{subdomainPart}</code>.</li>
                      <li>Set <strong>Resource Record Type:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">CNAME</code>.</li>
                      <li>Set <strong>Canonical name:</strong> <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-900">{PRIMARY_CNAME_TARGET}.</code>.</li>
                      <li>Set <strong>TTL:</strong> <strong>300</strong> seconds, then save changes.</li>
                    </ol>
                  </div>
                )}

                {activeProvider === "other" && (
                  <div className="space-y-2.5">
                    <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                      <li>Open your registrar or hosting control panel (e.g. <strong>Hostinger, Bluehost, cPanel Zone Editor</strong>).</li>
                      <li>Find <strong>DNS Management / Zone Editor</strong>.</li>
                      <li>Add a <strong>CNAME</strong> record:
                        <ul className="list-disc pl-5 mt-1 space-y-0.5 font-mono text-[11px] text-neutral-800">
                          <li>Name/Host: <strong>{subdomainPart}</strong></li>
                          <li>Target/Points to: <strong>{PRIMARY_CNAME_TARGET}</strong></li>
                          <li>TTL: <strong>300s / 14400</strong></li>
                        </ul>
                      </li>
                      <li>Save and wait 30 seconds for DNS updates to propagate.</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Diagnostics Inspector */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
          <button
            type="button"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-100/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>Real-Time DNS Diagnostics &amp; External Verification Tools</span>
            </div>
            {showDiagnostics ? (
              <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            )}
          </button>

          {showDiagnostics && (
            <div className="p-4 border-t border-neutral-200 bg-white space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Real-time Resolvers Queried
                  </span>
                  <p className="font-mono text-neutral-800 text-[11px]">
                    {lastDiagnostics?.resolversQueried?.length
                      ? lastDiagnostics.resolversQueried.join(", ")
                      : "Cloudflare 1.1.1.1 DoH, Google 8.8.8.8 DoH, System DNS"}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Detected CNAME Records
                  </span>
                  <p className="font-mono text-neutral-800 text-[11px]">
                    {lastDiagnostics?.detectedCnames?.length
                      ? lastDiagnostics.detectedCnames.join(", ")
                      : "None detected yet"}
                  </p>
                </div>
              </div>

              {lastDiagnostics?.detectedIps && lastDiagnostics.detectedIps.length > 0 && (
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Detected IP / A Records
                  </span>
                  <p className="font-mono text-neutral-800 text-[11px]">
                    {lastDiagnostics.detectedIps.join(", ")}
                    {lastDiagnostics.isProxiedByCloudflare && " (Cloudflare Proxied)"}
                  </p>
                </div>
              )}

              {lastDiagnostics?.detailedReason && (
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/70 text-amber-900 text-[11px]">
                  <strong>Diagnostic Note:</strong> {lastDiagnostics.detailedReason}
                </div>
              )}

              {/* External Global Propagation Links */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <span className="text-neutral-500 font-medium">Verify worldwide DNS propagation:</span>
                <a
                  href={`https://www.whatsmydns.net/#CNAME/${cleanDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 hover:underline font-semibold"
                >
                  WhatsMyDNS.net
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-neutral-300">·</span>
                <a
                  href={`https://dnschecker.org/#CNAME/${cleanDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 hover:underline font-semibold"
                >
                  DNSChecker.org
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
