import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/pgr")({
  head: () => ({ meta: [
    { title: "PGR e Gestão de Riscos Ocupacionais | DMG Ocupacional" },
    { name: "description", content: "Identificação, avaliação e controle de riscos com plano de ação documentado para sua empresa." },
  ]}),
  component: () => (
    <InnerPage
      eyebrow="PGR · GRO"
      title="PGR estratégico para reduzir riscos e proteger a operação."
      summary="O Programa de Gerenciamento de Riscos é a base do GRO. A DMG faz inventário, avaliação e plano de ação com rastreabilidade, conectando saúde, segurança e gestão."
      highlights={[
        "Inventário e avaliação de riscos",
        "Plano de ação com prazos e responsáveis",
        "Integração com PCMSO e laudos técnicos",
        "Revisão periódica e gestão de evidências",
        "Adequação à NR-1 e riscos psicossociais",
      ]}
      faqs={[
        { q: "Qual a diferença entre PGR e GRO?", o: "" , a: "O GRO é o processo de gerenciamento de riscos e o PGR é o documento que materializa esse processo." },
        { q: "Microempresas precisam de PGR?", a: "Sim, com possibilidade de modelo simplificado dependendo do grau de risco e do quantitativo de colaboradores." },
      ]}
      related={[
        { to: "/pcmso", label: "PCMSO" },
        { to: "/nr-1-riscos-psicossociais", label: "NR-1 e Riscos Psicossociais" },
        { to: "/laudos", label: "Laudos Técnicos" },
      ]}
    />
  ),
});
