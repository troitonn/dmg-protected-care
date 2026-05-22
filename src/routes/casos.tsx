import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/casos")({
  head: () => ({ meta: [
    { title: "Casos DMG | Resultados em SST para empresas" },
    { name: "description", content: "Casos anonimizados de empresas atendidas pela DMG Ocupacional." },
  ]}),
  component: () => (
    <InnerPage
      eyebrow="Casos"
      title="Resultados reais em saúde ocupacional e proteção empresarial."
      summary="Casos anonimizados que mostram como a DMG estrutura SST em empresas da indústria, comércio e serviços — reduzindo riscos, custos e passivos trabalhistas."
      related={[{ to: "/sobre", label: "Sobre a DMG" }, { to: "/contato", label: "Falar com consultor" }]}
    />
  ),
});
