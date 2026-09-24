import React from "react";
import type { StudioImageElement } from "@/lib/studio/types";

interface Props {
  element: StudioImageElement;
  isSelected?: boolean;
}

export default function ImageElement({ element }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
        overflow: "hidden",
        border:
          element.borderWidth && element.borderColor
            ? `${element.borderWidth}px solid ${element.borderColor}`
            : undefined,
        opacity: element.opacity !== undefined ? element.opacity : 1,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={element.src}
        alt={element.alt || "Uploaded asset"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: element.objectFit || "contain",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
