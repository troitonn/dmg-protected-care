import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/laudos")({
  head: () => ({
    meta: [
    { title: "Laudos Técnicos: LTCAT, Insalubridade, Periculosidade e Ergonômico | DMG" },
    { name: "description", content: "Laudos técnicos em SST emitidos com rigor médico e de engenharia de segurança." },
    { property: "og:url", content: "https://dmg-protected-care.lovable.app/laudos" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/laudos" }],
  }),
  component: () => (
    <InnerPage
      eyebrow="Laudos Técnicos"
      title="Laudos técnicos que sustentam decisões e conformidade."
      summary="LTCAT, insalubridade, periculosidade e laudo ergonômico — emitidos com critério técnico, fundamentação legal e linguagem clara para uso da gestão, do jurídico e do RH."
      highlights={[
        "LTCAT para concessão e custeio",
        "Laudo de insalubridade (NR-15)",
        "Laudo de periculosidade (NR-16)",
        "AET — Análise Ergonômica do Trabalho (NR-17)",
        "Recomendações de controle e adequação",
      ]}
      faqs={[
        { q: "Quando o laudo precisa ser atualizado?", a: "Sempre que houver alteração de layout, processo, máquinas, EPIs ou jornada que impacte na exposição a agentes nocivos." },
      ]}
      related={[
        { to: "/pgr", label: "PGR" },
        { to: "/esocial-sst", label: "eSocial SST" },
      ]}
    />
  ),
});
