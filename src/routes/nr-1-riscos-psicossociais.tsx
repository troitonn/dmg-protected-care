import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/nr-1-riscos-psicossociais")({
  head: () => ({
    meta: [
    { title: "NR-1 e Riscos Psicossociais | DMG Ocupacional" },
    { name: "description", content: "Adequação à NR-1: identificação, avaliação e integração dos riscos psicossociais ao PGR." },
    { property: "og:url", content: "https://dmgocupacional.com/nr-1-riscos-psicossociais" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmgocupacional.com/nr-1-riscos-psicossociais" }],
    scripts: [{ type: "application/ld+json", children: "{\"@context\": \"https://schema.org\", \"@type\": \"Service\", \"name\": \"NR-1 \u2014 Riscos Psicossociais\", \"description\": \"Avalia\u00e7\u00e3o e gest\u00e3o de riscos psicossociais conforme a atualiza\u00e7\u00e3o da NR-1, com instrumentos validados e plano de a\u00e7\u00e3o.\", \"serviceType\": \"NR-1 \u2014 Riscos Psicossociais\", \"provider\": {\"@id\": \"https://dmgocupacional.com/#business\"}, \"areaServed\": [{\"@type\": \"City\", \"name\": \"Osasco\"}, {\"@type\": \"City\", \"name\": \"Itapevi\"}, {\"@type\": \"City\", \"name\": \"Cajamar\"}, {\"@type\": \"City\", \"name\": \"Carapicu\u00edba\"}], \"url\": \"https://dmgocupacional.com/nr-1-riscos-psicossociais\"}" }],
  }),
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
