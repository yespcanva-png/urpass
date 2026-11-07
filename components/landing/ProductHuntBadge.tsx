import React from "react";

interface Props {
  className?: string;
  theme?: "dark" | "neutral";
  showLabel?: boolean;
  label?: string;
}

export default function ProductHuntBadge({
  className = "",
  showLabel = false,
  label = "Review us on Product Hunt",
}: Props) {
  return (
    <div className={`inline-flex flex-col items-center sm:items-start ${className}`}>
      {showLabel && (
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          {label}
        </span>
      )}
      <a
        href="https://www.producthunt.com/products/urpass?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-urpass"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-90 active:scale-[0.99] transition-all"
        title="UrPass - Create events, manage tickets, and scan QR codes in one place | Product Hunt"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1307316&amp;theme=dark&amp;t=1794029222628"
          alt="UrPass - Create events,manage tickets, and scan QR codes in one place | Product Hunt"
          width={250}
          height={54}
          style={{ width: "250px", height: "54px" }}
          loading="lazy"
        />
      </a>
    </div>
  );
}

