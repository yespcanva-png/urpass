"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AddToAppleWalletButtonProps {
  passToken: string;
}

export default function AddToAppleWalletButton({ passToken }: AddToAppleWalletButtonProps) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    // Directly navigate or download .pkpass
    window.location.href = `/api/wallet/${passToken}`;
    setTimeout(() => setLoading(false), 2500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label="Add to Apple Wallet"
      className="group relative flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-900 border border-neutral-800 text-white shadow-sm hover:shadow transition-all cursor-pointer active:scale-[0.99] disabled:opacity-75"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
      ) : (
        /* Official Apple Wallet badge silhouette SVG */
        <svg
          viewBox="0 0 32 32"
          className="w-5 h-5 fill-current text-white shrink-0"
          aria-hidden="true"
        >
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .76-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.24 16.98 2.93 12.63 4.7 9.56c.88-1.52 2.44-2.49 4.14-2.51 1.3-.02 2.52.87 3.32.87.79 0 2.27-1.07 3.82-.92 2.28.14 4 1.48 4.75 3.01-1.92 1.15-2.22 3.65-.63 5.48 1.12 1.28 1.89 2.59 1.6 4.01zm-3.44-14c.6-1.05.99-2.26.85-3.5-1.12.06-2.45.75-3.15 1.57-.6.7-1.13 1.95-.98 3.16 1.25.1 2.5-.2 3.28-1.23z" />
        </svg>
      )}

      <div className="flex flex-col text-left leading-tight">
        <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
          Add to
        </span>
        <span className="text-xs font-bold text-white tracking-tight -mt-0.5">
          Apple Wallet
        </span>
      </div>
    </button>
  );
}
