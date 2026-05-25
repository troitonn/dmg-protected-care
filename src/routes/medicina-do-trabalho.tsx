import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/medicina-do-trabalho")({
  head: () => ({
    meta: [
    { title: "Medicina do Trabalho em Franca-SP | DMG Ocupacional" },
    { name: "description", content: "Coordenação médica, ASO, PCMSO e gestão integrada de saúde ocupacional para empresas em Franca-SP." },
    { property: "og:url", content: "https://dmg-protected-care.lovable.app/medicina-do-trabalho" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/medicina-do-trabalho" }],
  }),
  component: () => (
    <InnerPage
      eyebrow="Medicina do Trabalho"
      title="Medicina do trabalho completa para empresas em Franca-SP."
      summary="Coordenação médica, exames ocupacionais e gestão integrada de saúde ocupacional, com documentação técnica e foco em redução de riscos, custos e passivos trabalhistas."
      highlights={[
        "Coordenação médica responsável (PCMSO)",
        "ASO admissional, periódico, mudança de risco, retorno e demissional",
        "Integração com PGR e eSocial SST",
        "Prontuários organizados e auditáveis",
        "Atendimento na clínica ou in company",
        "Indicadores de saúde para o RH e diretoria",
      ]}
      faqs={[
        { q: "Quem precisa de medicina do trabalho?", a: "Toda empresa com empregados registrados em regime CLT precisa manter PCMSO, ASOs e gestão de SST atualizados." },
        { q: "A DMG atende in company?", a: "Sim. Atendemos na clínica em Franca-SP e em modelo in company para empresas com volume e logística adequados." },
      ]}
      related={[
        { to: "/pcmso", label: "PCMSO" },
        { to: "/pgr", label: "PGR e Gestão de Riscos" },
        { to: "/esocial-sst", label: "eSocial SST" },
      ]}
    />
  ),
});
