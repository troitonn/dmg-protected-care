import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
    { title: "Sobre a DMG Ocupacional | Medicina do Trabalho em Osasco-SP e região" },
    { name: "description", content: "Conheça a DMG: elo entre segurança jurídica e acolhimento humanizado em SST." },
    { property: "og:url", content: "https://dmg-protected-care.lovable.app/sobre" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/sobre" }],
  }),
  component: () => (
    <InnerPage
      eyebrow="Sobre"
      title="A DMG é o elo entre segurança jurídica e acolhimento humanizado."
      summary="Clínica de medicina do trabalho com matriz em Osasco-SP, na Clínica DIMEG, especializada em SST para empresas. Atuamos com critério técnico, visão empresarial e cuidado real com pessoas."
      highlights={[
        "Equipe médica e técnica especializada em SST",
        "Atuação em indústria, comércio, serviços, logística, construção civil e operações administrativas",
        "Foco em conformidade legal e proteção empresarial",
        "Documentação organizada, rastreável e auditável",
      ]}
      related={[
        { to: "/osasco-sp", label: "Atendimento em Osasco-SP e região." },
        { to: "/casos", label: "Casos" },
      ]}
    />
  ),
});
