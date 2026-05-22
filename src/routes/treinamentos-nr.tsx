import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/treinamentos-nr")({
  head: () => ({ meta: [
    { title: "Treinamentos NR | DMG Ocupacional" },
    { name: "description", content: "Capacitações obrigatórias em normas regulamentadoras com registro e validade legal." },
  ]}),
  component: () => (
    <InnerPage
      eyebrow="Treinamentos NR"
      title="Treinamentos NR com validade legal e foco prático."
      summary="Capacitações iniciais, periódicas e eventuais para as principais normas regulamentadoras — com registro, conteúdo aplicável e aproveitamento real pela equipe."
      highlights={[
        "NR-1, NR-6, NR-12, NR-17, NR-35 e outras",
        "Modelo presencial, in company ou híbrido",
        "Registros e certificados auditáveis",
        "Conteúdo adaptado ao risco real da operação",
      ]}
      related={[
        { to: "/pgr", label: "PGR" },
        { to: "/nr-1-riscos-psicossociais", label: "NR-1" },
      ]}
    />
  ),
});
