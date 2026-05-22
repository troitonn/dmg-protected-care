export function DmgLogo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 56" className={className} role="img" aria-label="DMG Ocupacional">
      <defs>
        <linearGradient id="dmgInk" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.36 0.05 210)" />
          <stop offset="1" stopColor="oklch(0.25 0.03 230)" />
        </linearGradient>
      </defs>
      <g fill="url(#dmgInk)">
        <text x="0" y="34" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="30" letterSpacing="-1">
          DMG
        </text>
      </g>
      {/* selo articulado */}
      <g transform="translate(96 8)" stroke="oklch(0.52 0.07 210)" strokeWidth="2" fill="none">
        <rect x="0" y="0" width="40" height="40" rx="10" fill="oklch(0.85 0.05 200 / 0.35)" stroke="oklch(0.52 0.07 210)" />
        <circle cx="13" cy="13" r="4" fill="oklch(0.36 0.05 210)" stroke="none" />
        <circle cx="27" cy="13" r="4" fill="oklch(0.36 0.05 210)" stroke="none" />
        <circle cx="13" cy="27" r="4" fill="oklch(0.36 0.05 210)" stroke="none" />
        <circle cx="27" cy="27" r="4" fill="oklch(0.36 0.05 210)" stroke="none" />
        <line x1="13" y1="13" x2="27" y2="27" />
        <line x1="27" y1="13" x2="13" y2="27" />
      </g>
      <text x="0" y="50" fontFamily="Sora, sans-serif" fontWeight="300" fontSize="9" letterSpacing="6" fill="oklch(0.52 0.07 210)">
        O C U P A C I O N A L
      </text>
    </svg>
  );
}
