import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/esocial-sst")({
  head: () => ({
    meta: [
    { title: "eSocial SST — S-2210, S-2220 e S-2240 | DMG Ocupacional" },
    { name: "description", content: "Envio correto e dentro do prazo dos eventos de SST no eSocial." },
    { property: "og:url", content: "https://dmg-protected-care.lovable.app/esocial-sst" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/esocial-sst" }],
    scripts: [{ type: "application/ld+json", children: "{\"@context\": \"https://schema.org\", \"@type\": \"Service\", \"name\": \"eSocial SST\", \"description\": \"Envio dos eventos S-2210, S-2220 e S-2240 dentro do prazo legal, evitando multas e inconsist\u00eancias cadastrais.\", \"serviceType\": \"eSocial SST\", \"provider\": {\"@id\": \"https://dmg-protected-care.lovable.app/#business\"}, \"areaServed\": [{\"@type\": \"City\", \"name\": \"Osasco\"}, {\"@type\": \"City\", \"name\": \"Itapevi\"}, {\"@type\": \"City\", \"name\": \"Cajamar\"}, {\"@type\": \"City\", \"name\": \"Carapicu\u00edba\"}], \"url\": \"https://dmg-protected-care.lovable.app/esocial-sst\"}" }],
  }),
  component: () => (
    <InnerPage
      eyebrow="eSocial SST"
      title="eSocial SST sem retrabalho e dentro do prazo."
      summary="Geração e envio dos eventos S-2210 (CAT), S-2220 (monitoramento da saúde) e S-2240 (condições ambientais) com consistência entre PGR, PCMSO e folha."
      highlights={[
        "Envio de S-2210, S-2220 e S-2240",
        "Validação cruzada com PCMSO e PGR",
        "Rotinas de fechamento e auditoria",
        "Apoio em pendências e rejeições",
      ]}
      faqs={[
        { q: "Quais empresas precisam enviar eventos de SST?", a: "Todas as empresas obrigadas ao eSocial, conforme grupo e cronograma vigente da Receita Federal." },
      ]}
      related={[
        { to: "/pcmso", label: "PCMSO" },
        { to: "/pgr", label: "PGR" },
      ]}
    />
  ),
});
