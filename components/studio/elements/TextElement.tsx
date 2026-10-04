import React from "react";
import type { StudioTextElement } from "@/lib/studio/types";

interface Props {
  element: StudioTextElement;
  isSelected?: boolean;
}

export default function TextElement({ element }: Props) {
  const fontSizeVal = element.fontSize || 14;
  const lineHeightVal = element.lineHeight || 1.25;
  const maxLines = Math.max(1, Math.floor(element.height / (fontSizeVal * lineHeightVal)));

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
        fontSize: `${fontSizeVal}px`,
        fontWeight: element.fontWeight,
        color: element.color,
        textAlign: element.textAlign,
        letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
        lineHeight: lineHeightVal,
        textTransform: element.textTransform || "none",
        opacity: element.opacity !== undefined ? element.opacity : 1,
        wordBreak: "break-word",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
      }}
      title={element.content}
    >
      {element.content}
    </div>
  );
}
