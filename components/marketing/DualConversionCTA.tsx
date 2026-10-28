"use client";

import React from "react";
import DynamicConversionCTA from "@/components/conversion/DynamicConversionCTA";
import { VisitorSegment } from "@/lib/conversion/types";

interface DualConversionCTAProps {
  pageSlug: string;
  contentCluster?: string;
  position?: "hero" | "mid" | "footer" | "sticky";
  selfServiceLabel?: string;
  managedServiceLabel?: string;
  selfServiceSubtext?: string;
  managedServiceSubtext?: string;
  className?: string;
  eventTypeName?: string;
  overrideSegment?: VisitorSegment;
}

export default function DualConversionCTA({
  pageSlug,
  contentCluster = "general",
  position = "hero",
  selfServiceLabel,
  managedServiceLabel,
  selfServiceSubtext,
  managedServiceSubtext,
  className = "",
  overrideSegment,
}: DualConversionCTAProps) {
  return (
    <DynamicConversionCTA
      pageSlug={pageSlug}
      contentCluster={contentCluster}
      position={position}
      overrideSegment={overrideSegment}
      customPrimaryLabel={selfServiceLabel}
      customPrimarySubtext={selfServiceSubtext}
      customSecondaryLabel={managedServiceLabel}
      customSecondarySubtext={managedServiceSubtext}
      className={className}
    />
  );
}
