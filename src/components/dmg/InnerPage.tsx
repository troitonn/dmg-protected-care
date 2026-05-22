import { Link } from "@tanstack/react-router";
import { SiteLayout } from "./SiteLayout";
import { FinalCTA } from "./sections";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

export interface InnerPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  highlights?: string[];
  faqs?: { q: string; a: string }[];
  related?: { to: string; label: string }[];
}

export function InnerPage({ eyebrow, title, summary, highlights = [], faqs = [], related = [] }: InnerPageProps) {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-radial-petrol py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-20" />
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/60">
            <Link to="/" className="hover:text-white">Início</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/85">{eyebrow}</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-soft" /> {eyebrow}
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">{summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contato" className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-6 py-3.5 text-sm font-semibold text-petrol-ink hover:bg-white">
              Solicitar orçamento <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="https://wa.me/5516000000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium hover:border-teal-soft hover:text-teal-soft">
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">O que está incluso</h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map(h => (
                <li key={h} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed text-foreground">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="bg-background py-20">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-petrol/15 bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              FAQ
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">Perguntas frequentes</h2>
            <div className="mt-8 divide-y divide-border rounded-3xl border border-border bg-card">
              {faqs.map(f => (
                <details key={f.q} className="group p-6">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-foreground">
                    {f.q}
                    <ChevronRight className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-sand/40 py-20">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">Conteúdos relacionados</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(r => (
                <Link key={r.to} to={r.to} className="group flex items-center justify-between rounded-2xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-petrol/40">
                  <span className="text-sm font-medium text-foreground">{r.label}</span>
                  <ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA />
    </SiteLayout>
  );
}
