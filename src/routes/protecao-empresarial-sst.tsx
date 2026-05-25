import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/protecao-empresarial-sst")({
  head: () => ({
    meta: [
    { title: "Proteção Empresarial em SST | DMG Ocupacional" },
    { name: "description", content: "Consultoria estratégica em SST para reduzir passivos e proteger a operação." },
    { property: "og:url", content: "https://dmg-protected-care.lovable.app/protecao-empresarial-sst" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/protecao-empresarial-sst" }],
    scripts: [{ type: "application/ld+json", children: "{\"@context\": \"https://schema.org\", \"@type\": \"Service\", \"name\": \"Prote\u00e7\u00e3o Empresarial em SST\", \"description\": \"Assessoria cont\u00ednua para redu\u00e7\u00e3o de FAP, passivos trabalhistas e exposi\u00e7\u00e3o a multas em fiscaliza\u00e7\u00f5es.\", \"serviceType\": \"Prote\u00e7\u00e3o Empresarial em SST\", \"provider\": {\"@id\": \"https://dmg-protected-care.lovable.app/#business\"}, \"areaServed\": [{\"@type\": \"City\", \"name\": \"Osasco\"}, {\"@type\": \"City\", \"name\": \"Itapevi\"}, {\"@type\": \"City\", \"name\": \"Cajamar\"}, {\"@type\": \"City\", \"name\": \"Carapicu\u00edba\"}], \"url\": \"https://dmg-protected-care.lovable.app/protecao-empresarial-sst\"}" }],
  }),
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
