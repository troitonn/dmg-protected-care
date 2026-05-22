import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/pcmso")({
  head: () => ({ meta: [
    { title: "PCMSO — Programa de Controle Médico de Saúde Ocupacional | DMG" },
    { name: "description", content: "PCMSO técnico, auditável e alinhado ao PGR para empresas em Franca-SP." },
  ]}),
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
