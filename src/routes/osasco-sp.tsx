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
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/franca-sp" }],
  }),
  component: () => (
    <InnerPage
      eyebrow="Osasco-SP"
      title="Medicina do trabalho em Osasco-SP para empresas que produzem todos os dias."
      summary="A DMG Ocupacional possui matriz em Osasco-SP, na Clínica DIMEG, e atende empresas em Itapevi, Cajamar, Carapicuíba e cidades próximas da região metropolitana de São Paulo, com PCMSO, PGR, laudos, ASO, eSocial SST e adequações de NR."
      highlights={[
        "Matriz em Osasco-SP, na Clínica DIMEG",
        "Atendimento em Itapevi, Cajamar, Carapicuíba e região",
        "Indústria, comércio, serviços, logística, construção civil e operações administrativas",
        "Atendimento na clínica e in company",
        "Equipe local com conhecimento da região oeste da Grande São Paulo",
      ]}
      related={[
        { to: "/medicina-do-trabalho", label: "Medicina do Trabalho" },
        { to: "/pgr", label: "PGR" },
        { to: "/contato", label: "Contato" },
      ]}
    />
  ),
});
