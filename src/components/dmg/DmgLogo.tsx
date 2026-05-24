type Variant = "default" | "light" | "dark";

export function DmgLogo({
  className = "h-9 w-auto",
  variant = "default",
  title = "DMG Ocupacional",
}: {
  className?: string;
  variant?: Variant;
  title?: string;
}) {
  const isLight = variant === "light";
  const ink = isLight ? "#ffffff" : "oklch(0.30 0.04 220)";
  const accent = isLight ? "#9ACED3" : "oklch(0.52 0.07 210)";
  const dotFill = isLight ? "#ffffff" : "oklch(0.36 0.05 210)";
  const sealFill = isLight ? "rgba(255,255,255,0.08)" : "oklch(0.85 0.05 200 / 0.35)";

  return (
    <svg viewBox="0 0 220 56" className={className} role="img" aria-label={title} preserveAspectRatio="xMinYMid meet">
      <g fill={ink}>
        <text x="0" y="34" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="30" letterSpacing="-1">
          DMG
        </text>
      </g>
      <g transform="translate(96 8)" stroke={accent} strokeWidth="2" fill="none">
        <rect x="0" y="0" width="40" height="40" rx="10" fill={sealFill} stroke={accent} />
        <circle cx="13" cy="13" r="4" fill={dotFill} stroke="none" />
        <circle cx="27" cy="13" r="4" fill={dotFill} stroke="none" />
        <circle cx="13" cy="27" r="4" fill={dotFill} stroke="none" />
        <circle cx="27" cy="27" r="4" fill={dotFill} stroke="none" />
        <line x1="13" y1="13" x2="27" y2="27" />
        <line x1="27" y1="13" x2="13" y2="27" />
      </g>
      <text x="0" y="50" fontFamily="Sora, sans-serif" fontWeight="300" fontSize="9" letterSpacing="6" fill={accent}>
        O C U P A C I O N A L
      </text>
    </svg>
  );
}
