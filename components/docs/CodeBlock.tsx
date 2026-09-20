"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

export interface CodeTab {
  label: string;
  language: string;
  code: string;
}

interface CodeBlockProps {
  title?: string;
  tabs?: CodeTab[];
  singleCode?: string;
  singleLanguage?: string;
}

export function CodeBlock({ title, tabs, singleCode, singleLanguage }: CodeBlockProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeCode = tabs && tabs.length > 0 ? tabs[activeTabIndex].code : singleCode || "";
  const activeLang = tabs && tabs.length > 0 ? tabs[activeTabIndex].language : singleLanguage || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 my-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800/80 text-xs">
        <div className="flex items-center gap-2">
          {title ? (
            <span className="font-medium text-neutral-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-neutral-500" />
              {title}
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700/60 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700/60 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700/60 inline-block" />
              {activeLang && (
                <span className="text-[11px] font-mono text-neutral-500 ml-2 uppercase">
                  {activeLang}
                </span>
              )}
            </div>
          )}

          {/* Tabs if provided */}
          {tabs && tabs.length > 1 && (
            <div className="flex items-center gap-1 ml-3 bg-neutral-950/60 p-0.5 rounded-lg border border-neutral-800">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTabIndex(idx)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    activeTabIndex === idx
                      ? "bg-neutral-800 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white px-2 py-1 rounded hover:bg-neutral-800/60 transition-colors text-[11px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display */}
      <div className="p-4 overflow-x-auto text-xs font-mono text-neutral-200 leading-relaxed max-h-[420px] scrollbar-thin">
        <pre className="m-0 whitespace-pre">{activeCode}</pre>
      </div>
    </div>
  );
}
