import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/franca-sp")({
  head: () => ({
    meta: [
    { title: "Medicina do Trabalho em Osasco-SP e região | DMG Ocupacional" },
    { name: "description", content: "Clínica de medicina do trabalho em Osasco-SP para indústria, comércio, serviços, logística, construção civil e empresas da região oeste da Grande São Paulo." },
    { property: "og:url", content: "https://dmg-protected-care.lovable.app/franca-sp" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/osasco-sp" }],
  }),
  component: () => (
    <InnerPage
      eyebrow="Osasco-SP"
      title="Medicina do trabalho em Osasco-SP para empresas que produzem todos os dias."
      summary="A DMG Ocupacional atende empresas de Osasco, Itapevi, Cajamar, Carapicuíba e região com PCMSO, PGR, laudos, ASO, eSocial SST e adequações de NR — com equipe local e profundidade técnica."
      highlights={[
        "Indústria, comércio, serviços e agronegócio",
        "Polo calçadista e cadeias relacionadas",
        "Atendimento na clínica e in company",
        "Equipe local com conhecimento da realidade produtiva",
      ]}
      related={[
        { to: "/medicina-do-trabalho", label: "Medicina do Trabalho" },
        { to: "/pgr", label: "PGR" },
        { to: "/contato", label: "Contato" },
      ]}
    />
  ),
});
