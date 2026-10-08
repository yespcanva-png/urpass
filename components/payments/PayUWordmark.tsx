export default function PayUWordmark({
  height = 24,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  const width = Math.round(height * (120 / 36));
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`.trim()}
    >
      {/* PayU Rounded Badge */}
      <rect width="120" height="36" rx="8" fill="#1C1E23" />
      {/* "Pay" Text */}
      <text
        x="12"
        y="24"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="19"
        fill="#FFFFFF"
        letterSpacing="-0.5"
      >
        Pay
      </text>
      {/* "U" Symbol */}
      <text
        x="52"
        y="24"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#A6CE39"
      >
        U
      </text>
      {/* "INDIA" Sub-badge */}
      <rect x="74" y="11" width="36" height="14" rx="4" fill="#A6CE39" />
      <text
        x="80"
        y="22"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="8.5"
        fill="#1C1E23"
        letterSpacing="0.5"
      >
        BIZ
      </text>
    </svg>
  );
}
