"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  applySlug: string;
}

export default function CopyLinkButton({ applySlug }: Props) {
  const [copied, setCopied] = useState(false);

  const url = `${typeof window !== "undefined" ? window.location.origin : "https://urpass.space"}/events/${applySlug}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard without HTTPS
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex items-center gap-1 border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-2xs">
      {/* Slug display */}
      <div className="flex items-center gap-1.5 px-3 py-2 max-w-[260px] truncate">
        <span className="text-xs text-neutral-400 font-mono">/events/</span>
        <span className="text-xs font-mono font-semibold tracking-wide text-neutral-900 truncate">{applySlug}</span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-neutral-200 shrink-0" />

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium hover:bg-neutral-50 transition-colors shrink-0"
        title="Copy application link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-600" />
            <span className="text-green-600">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-600">Copy</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-neutral-200 shrink-0" />

      {/* Open in new tab */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-3 py-2 hover:bg-neutral-50 transition-colors shrink-0"
        title="Open application page"
      >
        <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
      </a>
    </div>
  );
}
