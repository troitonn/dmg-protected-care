import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/protecao-empresarial-sst")({
  head: () => ({ meta: [
    { title: "Proteção Empresarial em SST | DMG Ocupacional" },
    { name: "description", content: "Consultoria estratégica em SST para reduzir passivos e proteger a operação." },
  ]}),
  component: () => (
    <InnerPage
      eyebrow="Proteção Empresarial"
      title="SST como ativo de proteção da sua empresa."
      summary="Diagnóstico de conformidade, plano de adequação e acompanhamento contínuo — para que medicina do trabalho deixe de ser custo isolado e vire defesa estratégica."
      highlights={[
        "Diagnóstico de conformidade em SST",
        "Plano de adequação por prioridade de risco",
        "Apoio em fiscalizações e auditorias",
        "Indicadores executivos para diretoria",
      ]}
      related={[
        { to: "/pgr", label: "PGR" },
        { to: "/nr-1-riscos-psicossociais", label: "NR-1" },
        { to: "/esocial-sst", label: "eSocial SST" },
      ]}
    />
  ),
});
