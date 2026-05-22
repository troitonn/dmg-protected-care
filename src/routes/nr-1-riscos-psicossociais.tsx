import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/nr-1-riscos-psicossociais")({
  head: () => ({ meta: [
    { title: "NR-1 e Riscos Psicossociais | DMG Ocupacional" },
    { name: "description", content: "Adequação à NR-1: identificação, avaliação e integração dos riscos psicossociais ao PGR." },
  ]}),
  component: () => (
    <InnerPage
      eyebrow="NR-1 · Psicossociais"
      title="NR-1: integre riscos psicossociais ao seu PGR com critério técnico."
      summary="Estresse, sobrecarga, assédio e metas abusivas agora fazem parte da gestão de SST. A DMG conduz o diagnóstico, integra ao PGR e gera documentação prática para sua empresa."
      highlights={[
        "Diagnóstico psicossocial estruturado",
        "Integração formal ao PGR",
        "Plano de ação com responsáveis e prazos",
        "Treinamento de lideranças",
        "Comunicação interna e governança",
      ]}
      faqs={[
        { q: "Quem precisa se adequar à NR-1?", a: "Toda empresa obrigada ao PGR, com priorização para setores com maior exposição a riscos psicossociais." },
        { q: "Posso fazer apenas uma pesquisa de clima?", a: "Não. A NR-1 exige avaliação técnica e integração formal ao PGR, com plano de ação documentado." },
      ]}
      related={[
        { to: "/pgr", label: "PGR" },
        { to: "/treinamentos-nr", label: "Treinamentos NR" },
        { to: "/protecao-empresarial-sst", label: "Proteção Empresarial SST" },
      ]}
    />
  ),
});
