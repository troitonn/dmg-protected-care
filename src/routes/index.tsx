import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/dmg/SiteLayout";
import {
  Hero, AuthoritySection, ProblemSection, SolutionsSection, NR1Section,
  WhyDmgSection, DiagnosticToolsSection, BlogPreview, SocialProof,
  LocationSection, FAQSection, FinalCTA,
} from "@/components/dmg/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DMG Ocupacional — Medicina do Trabalho em Osasco e Região | PCMSO, PGR, eSocial SST" },
      { name: "description", content: "Medicina e segurança do trabalho para empresas em Osasco, Itapevi, Cajamar, Carapicuíba e região metropolitana de São Paulo. PCMSO, PGR, laudos, eSocial SST e NR-1." },
      { property: "og:title", content: "DMG Ocupacional — Medicina do Trabalho na Grande São Paulo" },
      { property: "og:description", content: "Elo entre segurança jurídica e acolhimento humanizado. Proteção empresarial em SST." },
      { property: "og:url", content: "https://dmgocupacional.com/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://dmgocupacional.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["MedicalClinic", "LocalBusiness"],
          "@id": "https://dmgocupacional.com/#business",
          name: "DMG Ocupacional",
          url: "https://dmgocupacional.com/",
          description: "Clínica de medicina e segurança do trabalho para empresas em Osasco, Itapevi, Cajamar, Carapicuíba e região metropolitana de São Paulo.",
          address: { "@type": "PostalAddress", addressLocality: "Osasco", addressRegion: "SP", addressCountry: "BR" },
          areaServed: [
            { "@type": "City", name: "Osasco" },
            { "@type": "City", name: "Itapevi" },
            { "@type": "City", name: "Cajamar" },
            { "@type": "City", name: "Carapicuíba" },
            { "@type": "City", name: "Barueri" },
            { "@type": "City", name: "Jandira" },
            { "@type": "City", name: "Santana de Parnaíba" },
          ],
          medicalSpecialty: "OccupationalMedicine",
          telephone: "+55-11-97569-1076",
          email: "contato@dmgocupacional.com",
          openingHoursSpecification: [{
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
            opens: "07:00", closes: "18:00",
          }],
          priceRange: "$$",
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
      <FAQSection />
    </SiteLayout>
  );
}
