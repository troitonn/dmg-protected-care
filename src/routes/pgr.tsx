import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/pgr")({
  head: () => ({
    meta: [
    { title: "PGR e Gestão de Riscos Ocupacionais | DMG Ocupacional" },
    { name: "description", content: "Identificação, avaliação e controle de riscos com plano de ação documentado para sua empresa." },
    { property: "og:url", content: "https://dmgocupacional.com/pgr" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmgocupacional.com/pgr" }],
    scripts: [{ type: "application/ld+json", children: "{\"@context\": \"https://schema.org\", \"@type\": \"Service\", \"name\": \"PGR \u2014 Programa de Gerenciamento de Riscos\", \"description\": \"Invent\u00e1rio de riscos, plano de a\u00e7\u00e3o e gest\u00e3o do PGR conforme NR-1 para empresas em Osasco e regi\u00e3o.\", \"serviceType\": \"PGR \u2014 Programa de Gerenciamento de Riscos\", \"provider\": {\"@id\": \"https://dmgocupacional.com/#business\"}, \"areaServed\": [{\"@type\": \"City\", \"name\": \"Osasco\"}, {\"@type\": \"City\", \"name\": \"Itapevi\"}, {\"@type\": \"City\", \"name\": \"Cajamar\"}, {\"@type\": \"City\", \"name\": \"Carapicu\u00edba\"}], \"url\": \"https://dmgocupacional.com/pgr\"}" }],
  }),
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
        { q: "Qual a diferença entre PGR e GRO?", a: "O GRO é o processo de gerenciamento de riscos e o PGR é o documento que materializa esse processo." },
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
