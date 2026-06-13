import fullColor from "@/assets/dmg-full-color.png.asset.json";
import fullBranco from "@/assets/dmg-full-branco.png.asset.json";

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
  const src = variant === "light" ? fullBranco.url : fullColor.url;
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
