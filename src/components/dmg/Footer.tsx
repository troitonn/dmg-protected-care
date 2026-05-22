import { Link } from "@tanstack/react-router";
import { DmgLogo } from "./DmgLogo";
import { MapPin, Mail, Phone, Clock, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-petrol-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-[0.07]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-white/95 p-4 ring-1 ring-white/10">
            <DmgLogo className="h-10 w-auto" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            Elo entre segurança jurídica e acolhimento humanizado.
            Medicina do trabalho, gestão de riscos e proteção empresarial
            para empresas em Franca-SP e região.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="LinkedIn" className="rounded-full border border-white/15 p-2 hover:border-teal-soft hover:text-teal-soft"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="rounded-full border border-white/15 p-2 hover:border-teal-soft hover:text-teal-soft"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          <FooterCol title="Serviços" links={[
            ["Medicina do Trabalho", "/medicina-do-trabalho"],
            ["PCMSO", "/pcmso"],
            ["PGR", "/pgr"],
            ["Laudos Técnicos", "/laudos"],
            ["eSocial SST", "/esocial-sst"],
            ["NR-1", "/nr-1-riscos-psicossociais"],
            ["Treinamentos NR", "/treinamentos-nr"],
          ]} />
          <FooterCol title="Empresa" links={[
            ["Sobre", "/sobre"],
            ["Casos", "/casos"],
            ["Blog", "/blog"],
            ["Franca-SP", "/franca-sp"],
            ["Proteção Empresarial", "/protecao-empresarial-sst"],
          ]} />
          <FooterCol title="Suporte" links={[
            ["Contato", "/contato"],
            ["Perguntas frequentes", "/perguntas-frequentes"],
            ["Área do cliente", "/area-do-cliente"],
          ]} />
        </div>

        <div className="space-y-4 text-sm text-white/80 lg:col-span-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-soft">Contato</h4>
          <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-soft" />Franca-SP — atendimento à região</p>
          <p className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-soft" />(16) 0000-0000</p>
          <p className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-soft" />contato@dmgocupacional.com.br</p>
          <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-soft" />Seg. a sex., 7h às 18h</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-white/55 lg:flex-row lg:items-center lg:px-8">
          <p>© {new Date().getFullYear()} DMG Ocupacional · Medicina do trabalho em Franca-SP</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Política de privacidade</a>
            <a href="#" className="hover:text-white">Google Business</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-soft">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm text-white/75">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="transition-colors hover:text-white">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
