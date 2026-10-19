import React from "react";

interface WhatsAppLogoProps {
  className?: string;
  size?: number;
  variant?: "brand" | "monochrome" | "white" | "bubble";
}

/**
 * Official Meta WhatsApp brand logo component
 * Authentic green speech-bubble (#25D366) with telephone handset
 */
export default function WhatsAppLogo({
  className = "w-5 h-5",
  size,
  variant = "brand",
}: WhatsAppLogoProps) {
  const pixelSize = size || 24;

  if (variant === "monochrome") {
    return (
      <svg
        viewBox="0 0 48 48"
        width={pixelSize}
        height={pixelSize}
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 4C13 4 4 13 4 24c0 3.5.9 6.9 2.6 9.8L4 44l10.5-2.7c2.8 1.5 6 2.4 9.5 2.4 11 0 20-9 20-20C44 13 35 4 24 4zm10.9 24.5c-.5-.2-2.9-1.4-3.4-1.6-.5-.2-.8-.2-1.1.2-.3.5-1.3 1.6-1.6 1.9-.3.3-.6.4-1.1.1-.5-.2-2.1-.8-4-2.5-1.5-1.3-2.5-3-2.8-3.5-.3-.5 0-.8.3-1 .2-.2.5-.6.8-.9.2-.3.3-.5.5-.8.2-.3.1-.6 0-.9-.1-.2-1.1-2.7-1.5-3.7-.4-1-.8-.8-1.1-.9h-1c-.3 0-.9.1-1.3.6-.5.5-1.7 1.7-1.7 4.1 0 2.4 1.8 4.8 2 5.1.3.3 3.5 5.3 8.5 7.5 1.2.5 2.1.8 2.8 1 1.2.4 2.3.3 3.2.2 1-.1 2.9-1.2 3.3-2.4.4-1.2.4-2.1.3-2.4-.1-.3-.3-.4-.7-.6z"
        />
      </svg>
    );
  }

  if (variant === "white") {
    return (
      <svg
        viewBox="0 0 48 48"
        width={pixelSize}
        height={pixelSize}
        fill="#FFFFFF"
        className={className}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 4C13 4 4 13 4 24c0 3.5.9 6.9 2.6 9.8L4 44l10.5-2.7c2.8 1.5 6 2.4 9.5 2.4 11 0 20-9 20-20C44 13 35 4 24 4zm10.9 24.5c-.5-.2-2.9-1.4-3.4-1.6-.5-.2-.8-.2-1.1.2-.3.5-1.3 1.6-1.6 1.9-.3.3-.6.4-1.1.1-.5-.2-2.1-.8-4-2.5-1.5-1.3-2.5-3-2.8-3.5-.3-.5 0-.8.3-1 .2-.2.5-.6.8-.9.2-.3.3-.5.5-.8.2-.3.1-.6 0-.9-.1-.2-1.1-2.7-1.5-3.7-.4-1-.8-.8-1.1-.9h-1c-.3 0-.9.1-1.3.6-.5.5-1.7 1.7-1.7 4.1 0 2.4 1.8 4.8 2 5.1.3.3 3.5 5.3 8.5 7.5 1.2.5 2.1.8 2.8 1 1.2.4 2.3.3 3.2.2 1-.1 2.9-1.2 3.3-2.4.4-1.2.4-2.1.3-2.4-.1-.3-.3-.4-.7-.6z"
        />
      </svg>
    );
  }

  // Official Brand: Authentic Meta WhatsApp Green speech bubble with pure white handset
  return (
    <svg
      viewBox="0 0 48 48"
      width={pixelSize}
      height={pixelSize}
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#25D366"
        d="M24 4C13 4 4 13 4 24c0 3.5.9 6.9 2.6 9.8L4 44l10.5-2.7c2.8 1.5 6 2.4 9.5 2.4 11 0 20-9 20-20C44 13 35 4 24 4z"
      />
      <path
        fill="#FFFFFF"
        d="M34.9 28.5c-.5-.2-2.9-1.4-3.4-1.6-.5-.2-.8-.2-1.1.2-.3.5-1.3 1.6-1.6 1.9-.3.3-.6.4-1.1.1-.5-.2-2.1-.8-4-2.5-1.5-1.3-2.5-3-2.8-3.5-.3-.5 0-.8.3-1 .2-.2.5-.6.8-.9.2-.3.3-.5.5-.8.2-.3.1-.6 0-.9-.1-.2-1.1-2.7-1.5-3.7-.4-1-.8-.8-1.1-.9h-1c-.3 0-.9.1-1.3.6-.5.5-1.7 1.7-1.7 4.1 0 2.4 1.8 4.8 2 5.1.3.3 3.5 5.3 8.5 7.5 1.2.5 2.1.8 2.8 1 1.2.4 2.3.3 3.2.2 1-.1 2.9-1.2 3.3-2.4.4-1.2.4-2.1.3-2.4-.1-.3-.3-.4-.7-.6z"
      />
    </svg>
  );
}
