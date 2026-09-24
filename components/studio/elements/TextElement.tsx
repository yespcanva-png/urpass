import React from "react";
import type { StudioTextElement } from "@/lib/studio/types";

interface Props {
  element: StudioTextElement;
  isSelected?: boolean;
}

export default function TextElement({ element }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily:
          element.fontFamily === "mono"
            ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            : element.fontFamily === "serif"
            ? "ui-serif, Georgia, Cambria, Times, serif"
            : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: `${element.fontSize}px`,
        fontWeight: element.fontWeight,
        color: element.color,
        textAlign: element.textAlign,
        letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
        lineHeight: element.lineHeight || 1.25,
        textTransform: element.textTransform || "none",
        opacity: element.opacity !== undefined ? element.opacity : 1,
        wordBreak: "break-word",
        display: "flex",
        alignItems: "center",
        justifyContent:
          element.textAlign === "center"
            ? "center"
            : element.textAlign === "right"
            ? "flex-end"
            : "flex-start",
      }}
    >
      {element.content}
    </div>
  );
}
