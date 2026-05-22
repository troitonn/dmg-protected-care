import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/dmg/SiteLayout";
import {
  Hero, AuthoritySection, ProblemSection, SolutionsSection, NR1Section,
  WhyDmgSection, DiagnosticToolsSection, BlogPreview, SocialProof,
  LocationSection, FinalCTA,
} from "@/components/dmg/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DMG Ocupacional — Medicina do Trabalho em Franca-SP | PCMSO, PGR, eSocial SST" },
      { name: "description", content: "Medicina do trabalho, PCMSO, PGR, laudos, eSocial SST e NR-1 para empresas em Franca-SP. Reduza riscos, custos e passivos trabalhistas com a DMG Ocupacional." },
      { property: "og:title", content: "DMG Ocupacional — Medicina do Trabalho em Franca-SP" },
      { property: "og:description", content: "Elo entre segurança jurídica e acolhimento humanizado. Proteção empresarial em SST." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["MedicalClinic", "LocalBusiness"],
          name: "DMG Ocupacional",
          description: "Clínica de medicina do trabalho e consultoria em saúde ocupacional para empresas em Franca-SP.",
          address: { "@type": "PostalAddress", addressLocality: "Franca", addressRegion: "SP", addressCountry: "BR" },
          areaServed: "Franca e região, SP",
          medicalSpecialty: "OccupationalMedicine",
          telephone: "+55-16-0000-0000",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <AuthoritySection />
      <ProblemSection />
      <SolutionsSection />
      <NR1Section />
      <WhyDmgSection />
      <DiagnosticToolsSection />
      <BlogPreview />
      <SocialProof />
      <LocationSection />
      <FinalCTA />
    </SiteLayout>
  );
}
