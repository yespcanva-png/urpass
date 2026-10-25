"use client";

import { useState } from "react";
import { getImageProps } from "next/image";
import type { AdCampaign } from "@/lib/explore/ads-types";

export default function AdCreativeImage({ campaign, sizes, priority = false }: { campaign: AdCampaign; sizes: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="absolute inset-0 flex items-center justify-center bg-violet-950 p-6 text-center text-white/90 text-sm">{campaign.title}</div>;
  const common = { alt: campaign.title, fill: true, sizes, className: "object-cover object-center" } as const;
  const desktop = getImageProps({ ...common, src: campaign.desktopImageUrl, fetchPriority: priority ? "high" : "auto" });
  const mobile = campaign.mobileImageUrl ? getImageProps({ ...common, src: campaign.mobileImageUrl }) : null;
  return (
    <picture>
      {mobile && <source media="(max-width: 639px)" srcSet={mobile.props.srcSet} />}
      <img {...desktop.props} alt={campaign.title} onError={() => setFailed(true)} />
    </picture>
  );
}
