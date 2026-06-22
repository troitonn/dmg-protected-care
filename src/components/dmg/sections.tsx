import { Link } from "@tanstack/react-router";
import {
  ArrowRight, ShieldCheck, Stethoscope, FileCheck2, Activity, FileText, Cog,
  AlertTriangle, Brain, ScrollText, Building2, MapPin, Phone, MessageCircle,
  TrendingDown, Receipt, ClipboardList, Calculator, ClipboardCheck, CalendarRange,
  Scan, CheckCircle2, Star, Quote, ChevronRight
} from "lucide-react";
import heroImg from "@/assets/hero-industrial.jpg";
import nr1Img from "@/assets/nr1-psicossocial.jpg";
import equipeImg from "@/assets/equipe-dmg.jpg";
import mechPattern from "@/assets/pattern-mech.png";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

/* ============================ HERO ============================ */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-radial-petrol text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-20" />
      <img src={mechPattern} alt="" aria-hidden className="pointer-events-none absolute -right-24 top-12 w-[720px] opacity-25 mix-blend-screen" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-28">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-teal-soft backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-soft" /> Medicina do trabalho · Osasco-SP e região
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
            Medicina do trabalho para empresas que precisam{" "}
            <span className="text-teal-soft">reduzir riscos, custos</span> e{" "}
            <span className="text-gold">passivos trabalhistas</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
            A DMG Ocupacional conecta saúde ocupacional, segurança jurídica
            e gestão inteligente de SST para proteger sua empresa, seus
            colaboradores e sua operação.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/contato" className="group inline-flex items-center gap-2 rounded-full bg-teal-soft px-6 py-3.5 text-sm font-semibold text-petrol-ink shadow-elegant transition-all hover:translate-y-[-1px] hover:bg-white">
              Solicitar orçamento <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/protecao-empresarial-sst" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white hover:border-teal-soft hover:text-teal-soft">
              Entender obrigações da minha empresa
            </Link>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-7">
            {[
              ["+25", "anos de SST"],
              ["100%", "conformidade legal"],
              ["Osasco", "e região"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="text-2xl font-semibold text-teal-soft">{k}</dt>
                <dd className="text-xs uppercase tracking-wider text-white/55">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-elegant">
            <img src={heroImg} alt="Equipe industrial com EPIs em ambiente de produção" width={1600} height={1100} className="h-[460px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-petrol-ink/85 via-petrol-ink/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-petrol-deep/70 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-teal-soft">Slogan</p>
              <p className="mt-1 text-base font-medium text-white">
                Elo entre segurança jurídica e acolhimento humanizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================== AUTHORITY CARDS ====================== */
const AUTHORITY = [
  { icon: ShieldCheck, title: "PCMSO, PGR, ASO, laudos e eSocial SST", text: "Cobertura completa das obrigações legais de saúde e segurança." },
  { icon: MapPin, title: "Atendimento em Osasco-SP e região", text: "Equipe local, agilidade e conhecimento da realidade produtiva." },
  { icon: TrendingDown, title: "Redução de riscos, custos e FAP", text: "Foco em conformidade, prevenção e proteção empresarial." },
  { icon: Stethoscope, title: "Técnica + humanização", text: "Especialistas em saúde ocupacional com escuta cuidadosa." },
];

export function AuthoritySection() {
  return (
    <section className="border-b border-border bg-paper py-16">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {AUTHORITY.map(({ icon: Icon, title, text }) => (
          <div key={title} className="group rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-petrol/40">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-[15px] font-semibold leading-snug text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ========================= PROBLEM ========================= */
const PAINS = [
  { icon: Receipt, title: "Multas e autuações" },
  { icon: Activity, title: "Afastamentos e FAP elevado" },
  { icon: FileText, title: "PCMSO e PGR desatualizados" },
  { icon: ScrollText, title: "Eventos do eSocial SST incorretos" },
  { icon: Brain, title: "Riscos psicossociais da NR-1" },
  { icon: ClipboardList, title: "Falta de controle documental" },
];

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-[0.05]" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionTag>O problema empresarial</SectionTag>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.6rem]">
              Medicina do trabalho não é apenas exame admissional.
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-[17px]">
              SST mal gerida gera multas, afastamentos, queda de produtividade,
              passivo trabalhista e insegurança jurídica. A DMG ajuda sua empresa
              a transformar obrigações legais em <strong className="text-foreground">gestão preventiva,
              estratégica e documentada</strong>.
            </p>
          </div>
          <div className="rounded-2xl border border-accent/40 bg-sand/60 p-6 lg:col-span-5">
            <AlertTriangle className="h-6 w-6 text-petrol-deep" />
            <p className="mt-3 text-sm font-medium leading-relaxed text-petrol-ink">
              Empresas sem gestão estruturada de SST acumulam riscos invisíveis
              que aparecem em fiscalizações, ações trabalhistas e na conta do RH.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PAINS.map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-petrol/40 hover:shadow-soft">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-foreground">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= SOLUTIONS ========================= */
const SERVICES = [
  { icon: Stethoscope, title: "Medicina do Trabalho Completa", desc: "Coordenação médica, ASO, exames e gestão integrada de saúde ocupacional.", to: "/medicina-do-trabalho" },
  { icon: FileCheck2, title: "PCMSO", desc: "Programa de Controle Médico atualizado, auditável e alinhado ao PGR.", to: "/pcmso" },
  { icon: ShieldCheck, title: "PGR e Gestão de Riscos", desc: "Identificação, avaliação e controle de riscos com plano de ação.", to: "/pgr" },
  { icon: Activity, title: "ASO e Exames Ocupacionais", desc: "Admissional, periódico, mudança de risco, retorno ao trabalho e demissional.", to: "/medicina-do-trabalho" },
  { icon: FileText, title: "Laudos Técnicos", desc: "LTCAT, Insalubridade, Periculosidade e Laudo Ergonômico.", to: "/laudos" },
  { icon: ScrollText, title: "eSocial SST", desc: "S-2210, S-2220, S-2240 enviados corretamente e no prazo.", to: "/esocial-sst" },
  { icon: Cog, title: "Treinamentos NR", desc: "Capacitações obrigatórias com registro e validade legal.", to: "/treinamentos-nr" },
  { icon: Brain, title: "NR-1 e Riscos Psicossociais", desc: "Adequação ao novo PGR com critério técnico e documentação.", to: "/nr-1-riscos-psicossociais" },
  { icon: Building2, title: "Consultoria em SST", desc: "Diagnóstico, plano de adequação e acompanhamento estratégico.", to: "/protecao-empresarial-sst" },
];

export function SolutionsSection() {
  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <SectionTag>Soluções DMG</SectionTag>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.6rem]">
            Saúde ocupacional integrada, técnica e auditável.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground sm:text-[17px]">
            Soluções desenhadas para o ciclo completo de SST — do diagnóstico
            inicial ao envio dos eventos no eSocial, sem lacunas e sem retrabalho.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, to }) => (
            <Link key={title} to={to} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-petrol/50 hover:shadow-elegant">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-petrol-deep text-white transition-transform group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Saiba mais <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gold/15 blur-2xl transition-opacity group-hover:opacity-80" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= NR-1 SECTION ========================= */
export function NR1Section() {
  return (
    <section className="relative overflow-hidden bg-petrol-ink py-24 text-white">
      <img src={mechPattern} alt="" aria-hidden className="pointer-events-none absolute -left-32 bottom-0 w-[640px] opacity-15 mix-blend-screen" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/15">
            <img src={nr1Img} alt="Profissional em ambiente corporativo lidando com sobrecarga" loading="lazy" width={1400} height={1000} className="h-[460px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-petrol-ink/70 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 rounded-full bg-gold/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-petrol-ink">
              Atualização NR-1
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <SectionTag tone="dark">Destaque estratégico</SectionTag>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.6rem]">
            NR-1: riscos psicossociais agora fazem parte da gestão de SST.
          </h2>
          <p className="mt-5 text-pretty text-white/75 sm:text-[17px]">
            Estresse, sobrecarga, assédio, metas abusivas e sofrimento mental
            precisam ser identificados, avaliados e integrados ao Programa de
            Gerenciamento de Riscos. A DMG ajuda sua empresa a se adequar com
            critério técnico, documentação e orientação prática.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Diagnóstico psicossocial", "Integração ao PGR", "Plano de ação documentado", "Treinamento e comunicação"].map(i => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/85">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-soft" /> {i}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/nr-1-riscos-psicossociais" className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-6 py-3.5 text-sm font-semibold text-petrol-ink hover:bg-white">
              Quero adequar minha empresa à NR-1 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= WHY DMG ========================= */
const PILLARS = [
  { title: "Segurança jurídica", text: "Documentação técnica, rastreável e em conformidade com a legislação vigente." },
  { title: "Acolhimento humanizado", text: "Atendimento que respeita o colaborador e fortalece a cultura de cuidado." },
  { title: "Precisão técnica", text: "Critérios médicos e de engenharia de segurança aplicados com rigor." },
  { title: "Visão empresarial", text: "Saúde ocupacional como ativo de gestão, não como custo isolado." },
  { title: "Atendimento regional", text: "Conhecimento da rotina de empresas em Osasco, Itapevi, Cajamar, Carapicuíba e região." },
  { title: "Tecnologia documental", text: "Eventos do eSocial, laudos e prontuários organizados e acessíveis." },
];

export function WhyDmgSection() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionTag>Por que escolher a DMG</SectionTag>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.6rem]">
            Um elo entre legislação, operação e cuidado com as pessoas.
          </h2>
          <p className="mt-5 text-pretty text-muted-foreground sm:text-[17px]">
            A DMG entende a rotina produtiva das empresas, os riscos biomecânicos,
            operacionais, legais e humanos envolvidos na saúde ocupacional.
            Por isso, atua como parceira estratégica de proteção empresarial.
          </p>
          <div className="mt-8 overflow-hidden rounded-3xl ring-1 ring-border">
            <img src={equipeImg} alt="Equipe DMG em atendimento" loading="lazy" width={1400} height={1000} className="h-[320px] w-full object-cover" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-petrol/40 hover:shadow-soft">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-gold">0{i + 1}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= DIAGNOSTIC CARDS ========================= */
const TOOLS = [
  { icon: Calculator, title: "Calculadora de FAP", text: "Estime o impacto do FAP nos custos da sua folha." },
  { icon: ClipboardCheck, title: "Checklist NR-1", text: "Avalie a adequação aos riscos psicossociais." },
  { icon: CalendarRange, title: "Calendário de obrigações", text: "Prazos do eSocial SST e renovação de laudos." },
  { icon: Scan, title: "Diagnóstico de conformidade", text: "Mapeamento rápido de gaps em SST." },
  { icon: ClipboardList, title: "Checklist de PCMSO", text: "Verifique se seu programa está completo e atualizado." },
];

export function DiagnosticToolsSection() {
  return (
    <section className="bg-sand/40 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <SectionTag>Ferramentas em breve</SectionTag>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              Recursos práticos para decisões de SST mais rápidas.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Diagnósticos, checklists e calculadoras desenvolvidas pela DMG
              para acelerar a conformidade da sua empresa.
            </p>
          </div>
          <Link to="/contato" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Solicitar diagnóstico <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TOOLS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gold">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/30 text-petrol-deep">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
              <span className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-gold">Acessar em breve</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= BLOG PREVIEW ========================= */
const POSTS = [
  { tag: "PCMSO", title: "O que é PCMSO e quando sua empresa precisa atualizar?", excerpt: "Periodicidade, gatilhos de revisão e o que muda na auditoria." },
  { tag: "PGR", title: "PGR e GRO: o que muda para empresas?", excerpt: "Gerenciamento de riscos ocupacionais aplicado à realidade produtiva." },
  { tag: "NR-1", title: "NR-1 e riscos psicossociais: como se adequar?", excerpt: "Passo a passo técnico para integrar saúde mental ao PGR." },
  { tag: "eSocial", title: "eSocial SST: quais eventos sua empresa precisa enviar?", excerpt: "S-2210, S-2220 e S-2240 sem retrabalho e dentro do prazo." },
  { tag: "Laudos", title: "LTCAT, insalubridade e periculosidade: diferenças", excerpt: "Quando cada laudo é exigido e quais riscos enderaça." },
  { tag: "Osasco-SP", title: "Medicina do trabalho em Osasco-SP: guia para empresas", excerpt: "Realidade de empresas da indústria, comércio, serviços, logística e construção civil." },
];

export function BlogPreview() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <SectionTag>Conteúdo educativo</SectionTag>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              Conhecimento técnico que protege decisões empresariais.
            </h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary">
            Ver todos os artigos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.title} className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-petrol/40 hover:shadow-soft">
              <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                {p.tag}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
              <Link to="/blog" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Ler artigo <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= SOCIAL PROOF ========================= */
export function SocialProof() {
  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionTag>Prova social</SectionTag>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              Empresas da indústria, comércio e serviços confiam na DMG.
            </h2>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[["+200", "empresas"], ["+25k", "exames/ano"], ["98%", "satisfação"]].map(([k, v]) => (
                <div key={v} className="rounded-2xl border border-border bg-card p-5">
                  <div className="text-2xl font-semibold text-petrol-deep">{k}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {[
              { name: "Camila R.", role: "RH · Indústria", text: "A DMG estruturou nosso PGR e o eSocial SST em 60 dias. Reduzimos autuações e ganhamos previsibilidade." },
              { name: "Eduardo M.", role: "Diretor · Logística", text: "Atendimento técnico e humano. A adequação à NR-1 foi conduzida com profundidade, sem burocracia desnecessária." },
            ].map(t => (
              <figure key={t.name} className="relative rounded-3xl border border-border bg-card p-7">
                <Quote className="absolute right-5 top-5 h-6 w-6 text-gold/70" />
                <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground">"{t.text}"</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold text-foreground">{t.name}</span>
                  <span className="ml-2 text-muted-foreground">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= LOCATION ========================= */
export function LocationSection() {
  return (
    <section className="relative overflow-hidden bg-petrol-deep py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-[0.08]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-6">
          <SectionTag tone="dark">Localização</SectionTag>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Medicina do trabalho em Osasco-SP, com atendimento em Itapevi, Cajamar, Carapicuíba e região.
          </h2>
          <p className="mt-5 text-pretty text-white/75 sm:text-[17px]">
            Conhecimento da rotina de empresas em Osasco, Itapevi, Cajamar, Carapicuíba e região oeste da Grande São Paulo, com atuação em setores como indústria, comércio, serviços, logística, construção civil e operações administrativas.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-teal-soft" /> Osasco-SP — matriz na Clínica DIMEG</li>
            <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-teal-soft" /> +55 11 97569-1076</li>
            <li className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-4 w-4 text-teal-soft" /> WhatsApp atendimento comercial</li>
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="https://wa.me/5511975691076" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-6 py-3.5 text-sm font-semibold text-petrol-ink hover:bg-white">
              Falar pelo WhatsApp <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/osasco-sp" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium hover:border-teal-soft hover:text-teal-soft">
              Atendimento em Osasco e região
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl ring-1 ring-white/15 lg:col-span-6">
          <iframe
            title="DMG Ocupacional — Osasco-SP"
            src="https://www.google.com/maps?q=Osasco,+SP&output=embed"
            className="h-full min-h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

/* ========================= FAQ ========================= */

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  const FAQS = [
    {
      q: "Toda empresa precisa de PCMSO e PGR?",
      a: "Sim. Toda empresa com empregados CLT precisa manter PCMSO e PGR, exceto exceções específicas previstas em norma.",
    },
    {
      q: "O que acontece se eu não enviar os eventos do eSocial SST?",
      a: "A empresa fica exposta a multas, inconsistências cadastrais e perda de defesa em ações trabalhistas e previdenciárias.",
    },
    {
      q: "Como funciona a adequação à NR-1?",
      a: "Diagnóstico psicossocial, integração ao PGR, plano de ação documentado e treinamento das lideranças.",
    },
    {
      q: "A DMG atende fora de Osasco-SP?",
      a: "Sim. A DMG atende Osasco, Itapevi, Cajamar, Carapicuíba e região com atendimento presencial e in company quando necessário.",
    },
  ];

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">

        <div className="text-center mb-12">
          <SectionTag>FAQ</SectionTag>

          <h2 className="mt-4 text-3xl font-semibold text-primary sm:text-4xl">
            Perguntas frequentes
          </h2>

          <p className="mt-4 text-muted-foreground">
            Dúvidas comuns sobre medicina do trabalho, PCMSO, PGR e eSocial SST.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-border bg-muted/20"
            >
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium">{faq.q}</span>

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="px-5 pb-5 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ========================= CTA ========================= */
export function FinalCTA() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-petrol-ink via-petrol-deep to-petrol p-10 text-white shadow-elegant lg:p-14">
          <img src={mechPattern} alt="" aria-hidden className="pointer-events-none absolute -right-32 -top-16 w-[560px] opacity-20 mix-blend-screen" />
          <div className="relative grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
                Vamos transformar SST em proteção empresarial concreta.
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-white/75">
                Fale com um consultor DMG e receba um diagnóstico rápido das
                obrigações da sua empresa em medicina do trabalho.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link to="/contato" className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-6 py-3.5 text-sm font-semibold text-petrol-ink hover:bg-white">
                Solicitar orçamento <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://wa.me/5511975691076" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium hover:border-teal-soft hover:text-teal-soft">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= HELPERS ========================= */
function SectionTag({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
      tone === "dark"
        ? "border-white/15 bg-white/5 text-teal-soft"
        : "border-petrol/15 bg-secondary text-primary"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone === "dark" ? "bg-teal-soft" : "bg-petrol"}`} />
      {children}
    </span>
  );
}
