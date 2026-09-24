import React from "react";
import type { StudioShapeElement } from "@/lib/studio/types";

interface Props {
  element: StudioShapeElement;
  isSelected?: boolean;
}

export default function ShapeElement({ element }: Props) {
  let borderRadius = element.borderRadius ? `${element.borderRadius}px` : "0px";
  if (element.shapeType === "pill") {
    borderRadius = "9999px";
  } else if (element.shapeType === "circle") {
    borderRadius = "50%";
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: element.fillColor,
        border:
          element.borderWidth && element.borderColor
            ? `${element.borderWidth}px solid ${element.borderColor}`
            : undefined,
        borderRadius,
        opacity: element.opacity !== undefined ? element.opacity : 1,
      }}
    />
  );
}
