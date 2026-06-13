import fullColor from "@/assets/dmg-full-color.png";
import fullBranco from "@/assets/dmg-full-branco.png";

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
  const src = variant === "light" ? fullBranco : fullColor;
  return (
    <img
      src={src}
      alt={title}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
