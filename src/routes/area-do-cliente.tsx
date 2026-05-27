import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/area-do-cliente")({
  head: () => ({
    meta: [
    { title: "Área do Cliente | DMG Ocupacional" },
    { name: "description", content: "Acesso a documentos, laudos e indicadores de SST." },
    { property: "og:url", content: "https://dmgocupacional.com/area-do-cliente" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmgocupacional.com/area-do-cliente" }],
  }),
  component: () => (
    <InnerPage
      eyebrow="Área do Cliente"
      title="Documentos, laudos e indicadores de SST em um só lugar."
      summary="Acesso restrito para clientes DMG: PCMSO, PGR, laudos, ASO e indicadores executivos. Em breve disponível também por aplicativo."
    />
  ),
});
