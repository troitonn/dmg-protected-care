import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/franca-sp")({
  head: () => ({ meta: [
    { title: "Medicina do Trabalho em Franca-SP | DMG Ocupacional" },
    { name: "description", content: "Clínica de medicina do trabalho em Franca-SP para indústria, comércio, serviços, agronegócio e polo calçadista." },
  ]}),
  component: () => (
    <InnerPage
      eyebrow="Franca-SP"
      title="Medicina do trabalho em Franca-SP para empresas que produzem todos os dias."
      summary="A DMG Ocupacional atende empresas de Franca-SP e região com PCMSO, PGR, laudos, ASO, eSocial SST e adequações de NR — com equipe local e profundidade técnica."
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
