import React from "react";
import type { StudioDividerElement } from "@/lib/studio/types";

interface Props {
  element: StudioDividerElement;
  isSelected?: boolean;
}

export default function DividerElement({ element }: Props) {
  const isVertical = element.height > element.width;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: element.opacity !== undefined ? element.opacity : 1,
      }}
    >
      <div
        style={{
          width: isVertical ? `${element.thickness}px` : "100%",
          height: isVertical ? "100%" : `${element.thickness}px`,
          borderTop: !isVertical
            ? `${element.thickness}px ${element.style} ${element.color}`
            : undefined,
          borderLeft: isVertical
            ? `${element.thickness}px ${element.style} ${element.color}`
            : undefined,
        }}
      />
    </div>
  );
}
