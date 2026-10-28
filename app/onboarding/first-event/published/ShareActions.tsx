"use client";

import { useState } from "react";

export default function ShareActions({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  function url() { return `${window.location.origin}${path}`; }
  async function copy() {
    await navigator.clipboard.writeText(url());
    setCopied(true);
  }
  async function share() {
    if (navigator.share) await navigator.share({ title, url: url() });
    else await copy();
  }
  return <div className="mt-3 flex gap-3">
    <button type="button" onClick={copy} className="rounded-lg border px-4 py-2 text-sm font-semibold">{copied ? "Copied" : "Copy link"}</button>
    <button type="button" onClick={share} className="rounded-lg border px-4 py-2 text-sm font-semibold">Share</button>
  </div>;
}
