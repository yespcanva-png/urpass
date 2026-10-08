"use client";

import { useState } from "react";
import {
  Globe2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Server,
  Zap,
} from "lucide-react";
import {
  parseDomainParts,
  getDnsInstructionsForDomain,
  PRIMARY_CNAME_TARGET,
  type DnsDiagnosticResult,
} from "@/lib/dns/realtime-dns";
import { checkDomainDnsLive } from "@/app/actions/custom-domains";

interface EventDomainHelperProps {
  customDomain: string;
}

export default function EventDomainHelper({ customDomain }: EventDomainHelperProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DnsDiagnosticResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  if (!customDomain || !customDomain.trim()) {
    return (
      <div className="mt-2 text-xs text-neutral-500 bg-neutral-50 rounded-xl p-3 border border-neutral-200/80 flex items-start gap-2">
        <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
        <div>
          <span>Want to use your own domain (e.g. <code className="font-mono text-neutral-800">summit.company.com</code>)?</span>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Enter your subdomain above to view real-time DNS configuration instructions.
          </p>
        </div>
      </div>
    );
  }

  const { cleanDomain, isApex, subdomainPart } = parseDomainParts(customDomain);
  const instructions = getDnsInstructionsForDomain(cleanDomain);

  const handleLiveCheck = async () => {
    setIsChecking(true);
    try {
      const res = await checkDomainDnsLive(cleanDomain);
      if (res.diagnostics) {
        setDiagnostics(res.diagnostics);
      }
    } catch {
      // Ignore
    } finally {
      setIsChecking(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mt-3 bg-neutral-50/80 rounded-xl border border-neutral-200/90 overflow-hidden text-xs">
      {/* Header Banner */}
      <div className="p-3.5 bg-white border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Globe2 className="w-4 h-4 text-teal-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 font-mono">{cleanDomain}</span>
              {diagnostics?.verified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  DNS Live &amp; Verified
                </span>
              ) : diagnostics ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Pending Propagation
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-neutral-500">
              Point your DNS CNAME to <code className="font-mono text-teal-700 font-bold">{PRIMARY_CNAME_TARGET}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLiveCheck}
            disabled={isChecking}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors flex items-center gap-1 shadow-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Live DNS Check"}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 font-semibold flex items-center gap-1"
          >
            <span>DNS Setup</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Diagnostics Banner */}
      {diagnostics && (
        <div
          className={`p-3 border-b text-[11px] flex items-start gap-2 ${
            diagnostics.verified
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          {diagnostics.verified ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-0.5">
            <p className="font-semibold">{diagnostics.message}</p>
            {diagnostics.suggestedFix && <p>{diagnostics.suggestedFix}</p>}
          </div>
        </div>
      )}

      {/* Expandable DNS Guide Table */}
      {isOpen && (
        <div className="p-3.5 space-y-3 bg-white">
          <div className="space-y-1.5">
            <h5 className="font-bold text-neutral-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Server className="w-3 h-3 text-neutral-500" />
              Required DNS Settings in your Domain Registrar (GoDaddy, Cloudflare, Namecheap, etc.)
            </h5>

            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-neutral-100 text-neutral-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Host / Name</th>
                    <th className="px-3 py-2">Target Value</th>
                    <th className="px-3 py-2">TTL</th>
                    <th className="px-3 py-2 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-mono">
                  {instructions.map((inst, i) => (
                    <tr key={i} className="hover:bg-neutral-50/60">
                      <td className="px-3 py-2 font-bold text-teal-700">{inst.type}</td>
                      <td className="px-3 py-2 font-bold text-neutral-900">{inst.name}</td>
                      <td className="px-3 py-2 text-neutral-800 font-semibold">{inst.value}</td>
                      <td className="px-3 py-2 text-neutral-500 font-sans">{inst.ttl}</td>
                      <td className="px-3 py-2 text-right font-sans">
                        <button
                          type="button"
                          onClick={() => handleCopy(inst.value, `inst-${i}`)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium"
                        >
                          {copiedKey === `inst-${i}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-neutral-500" />
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

          <div className="text-[11px] text-neutral-500 space-y-1">
            <p>
              💡 <strong>Quick Setup:</strong> In your domain registrar, add a <strong>CNAME</strong> record for host <strong>{subdomainPart}</strong> pointing to <strong>{PRIMARY_CNAME_TARGET}</strong>. If using Cloudflare, set proxy to <strong>DNS Only</strong>.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href={`https://www.whatsmydns.net/#CNAME/${cleanDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-teal-600 hover:underline font-medium"
              >
                Verify worldwide propagation on WhatsMyDNS
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
