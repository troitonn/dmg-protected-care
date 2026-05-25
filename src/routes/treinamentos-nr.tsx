import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/treinamentos-nr")({
  head: () => ({
    meta: [
    { title: "Treinamentos NR | DMG Ocupacional" },
    { name: "description", content: "Capacitações obrigatórias em normas regulamentadoras com registro e validade legal." },
    { property: "og:url", content: "https://dmg-protected-care.lovable.app/treinamentos-nr" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/treinamentos-nr" }],
    scripts: [{ type: "application/ld+json", children: "{\"@context\": \"https://schema.org\", \"@type\": \"Service\", \"name\": \"Treinamentos NR\", \"description\": \"Treinamentos das NRs presenciais e in company: NR-5, NR-6, NR-10, NR-12, NR-17, NR-20, NR-33 e NR-35.\", \"serviceType\": \"Treinamentos NR\", \"provider\": {\"@id\": \"https://dmg-protected-care.lovable.app/#business\"}, \"areaServed\": [{\"@type\": \"City\", \"name\": \"Osasco\"}, {\"@type\": \"City\", \"name\": \"Itapevi\"}, {\"@type\": \"City\", \"name\": \"Cajamar\"}, {\"@type\": \"City\", \"name\": \"Carapicu\u00edba\"}], \"url\": \"https://dmg-protected-care.lovable.app/treinamentos-nr\"}" }],
  }),
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
