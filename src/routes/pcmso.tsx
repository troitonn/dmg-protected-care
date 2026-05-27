import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/pcmso")({
  head: () => ({
    meta: [
    { title: "PCMSO — Programa de Controle Médico de Saúde Ocupacional | DMG" },
    { name: "description", content: "PCMSO técnico, auditável e alinhado ao PGR para empresas em Osasco-SP, Itapevi, Cajamar, Carapicuíba e região." },
    { property: "og:url", content: "https://dmgocupacional.com/pcmso" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmgocupacional.com/pcmso" }],
    scripts: [{ type: "application/ld+json", children: "{\"@context\": \"https://schema.org\", \"@type\": \"Service\", \"name\": \"PCMSO \u2014 Programa de Controle M\u00e9dico de Sa\u00fade Ocupacional\", \"description\": \"Elabora\u00e7\u00e3o, execu\u00e7\u00e3o e revis\u00e3o anual do PCMSO conforme NR-7, integrado ao PGR e ao eSocial SST.\", \"serviceType\": \"PCMSO \u2014 Programa de Controle M\u00e9dico de Sa\u00fade Ocupacional\", \"provider\": {\"@id\": \"https://dmgocupacional.com/#business\"}, \"areaServed\": [{\"@type\": \"City\", \"name\": \"Osasco\"}, {\"@type\": \"City\", \"name\": \"Itapevi\"}, {\"@type\": \"City\", \"name\": \"Cajamar\"}, {\"@type\": \"City\", \"name\": \"Carapicu\u00edba\"}], \"url\": \"https://dmgocupacional.com/pcmso\"}" }],
  }),
  component: () => (
    <InnerPage
      eyebrow="PCMSO"
      title="PCMSO técnico, atualizado e auditável."
      summary="O Programa de Controle Médico de Saúde Ocupacional é obrigatório e precisa estar conectado ao PGR. A DMG estrutura, executa e mantém o PCMSO da sua empresa com critério médico e visão de conformidade."
      highlights={[
        "Elaboração e revisão anual",
        "Alinhamento aos riscos do PGR",
        "Definição técnica de exames complementares",
        "Relatório anual e indicadores",
        "Integração com eventos do eSocial SST",
      ]}
      faqs={[
        { q: "Com que frequência o PCMSO deve ser atualizado?", a: "Pelo menos anualmente, ou sempre que houver mudança significativa de riscos, processos ou estrutura da empresa." },
        { q: "PCMSO sem PGR é válido?", a: "Não. O PCMSO precisa estar tecnicamente alinhado ao PGR para refletir os riscos reais da operação." },
      ]}
      related={[
        { to: "/pgr", label: "PGR" },
        { to: "/medicina-do-trabalho", label: "Medicina do Trabalho" },
        { to: "/esocial-sst", label: "eSocial SST" },
      ]}
    />
  ),
});
