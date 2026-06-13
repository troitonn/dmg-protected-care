import { createFileRoute } from "@tanstack/react-router";
import { InnerPage } from "@/components/dmg/InnerPage";

const FAQS = [
  { q: "Toda empresa precisa de PCMSO e PGR?", a: "Sim. Toda empresa com empregados CLT precisa manter PCMSO e PGR, exceto exceções específicas previstas em norma." },
  { q: "O que acontece se eu não enviar os eventos do eSocial SST?", a: "A empresa fica exposta a multas, inconsistências cadastrais e perda de defesa em ações trabalhistas e previdenciárias." },
  { q: "Como funciona a adequação à NR-1?", a: "Diagnóstico psicossocial, integração ao PGR, plano de ação documentado e treinamento das lideranças." },
  { q: "A DMG atende fora de Osasco-SP?", a: "Sim. A DMG possui matriz em Osasco-SP, na Clínica DIMEG, e atende empresas em Itapevi, Cajamar, Carapicuíba e cidades próximas, inclusive com modelo in company quando adequado." },
];

export const Route = createFileRoute("/perguntas-frequentes")({
  head: () => ({
    meta: [
    { title: "Perguntas frequentes | DMG Ocupacional" },
    { name: "description", content: "Dúvidas comuns sobre medicina do trabalho, PCMSO, PGR, eSocial SST e NR-1." },
    { property: "og:url", content: "https://dmgocupacional.com/perguntas-frequentes" },
    { property: "og:type", content: "website" },
  ],
    links: [
      { rel: "canonical", href: "https://dmgocupacional.com/perguntas-frequentes" },
      { rel: "alternate", hrefLang: "pt-BR", href: "https://dmgocupacional.com/perguntas-frequentes" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),

  component: () => (
    <InnerPage
      eyebrow="FAQ"
      title="Perguntas frequentes sobre medicina do trabalho e SST."
      summary="Respostas práticas para as principais dúvidas de RH, DP, jurídico e diretoria sobre saúde ocupacional, eSocial SST e adequações de NR."
      faqs={FAQS.map((f) => ({ q: f.q, a: f.a }))}

    />
  ),
});
