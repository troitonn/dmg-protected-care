import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [
    { title: "Blog DMG | Medicina do trabalho, PCMSO, PGR, NR-1 e eSocial SST" },
    { name: "description", content: "Conteúdo técnico para RH, DP, jurídico e diretoria sobre SST e medicina do trabalho." },
  ]}),
  component: () => (
    <InnerPage
      eyebrow="Blog"
      title="Conteúdo técnico para decisões empresariais em SST."
      summary="Artigos sobre PCMSO, PGR, eSocial SST, NR-1, laudos e medicina do trabalho — escritos com profundidade técnica e foco em consequência empresarial."
      related={[
        { to: "/pcmso", label: "PCMSO" },
        { to: "/pgr", label: "PGR" },
        { to: "/nr-1-riscos-psicossociais", label: "NR-1" },
      ]}
    />
  ),
});
