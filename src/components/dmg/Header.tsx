import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { DmgLogo } from "./DmgLogo";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/medicina-do-trabalho", label: "Medicina do Trabalho" },
  { to: "/pcmso", label: "PCMSO" },
  { to: "/pgr", label: "PGR" },
  { to: "/laudos", label: "Laudos" },
  { to: "/esocial-sst", label: "eSocial SST" },
  { to: "/nr-1-riscos-psicossociais", label: "NR-1" },
  { to: "/blog", label: "Blog" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center px-4 lg:px-6">
        
        {/* LOGO */}
        <div className="flex shrink-0 items-center">
          <Link
            to="/"
            className="flex items-center"
            aria-label="DMG Ocupacional — Início"
          >
            <DmgLogo className="h-9 w-auto lg:h-10" />
          </Link>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden flex-1 items-center justify-center xl:flex">
          <nav
            className="flex flex-wrap items-center justify-center gap-1"
            aria-label="Principal"
          >
            {NAV.slice(1, -1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-2 text-[13px] font-medium whitespace-nowrap text-foreground/75 transition-colors hover:bg-secondary hover:text-primary"
                activeProps={{
                  className: "bg-secondary text-primary",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA DESKTOP */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <Link
            to="/contato"
            className="whitespace-nowrap rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
          >
            Solicitar orçamento
          </Link>

          <a
            href="https://wa.me/5511975691076?text=Quero%20falar%20com%20um%20consultor%20DMG"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-[1px] hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" />
            Falar com consultor
          </a>
        </div>

        {/* BOTÃO MOBILE */}
        <div className="ml-auto xl:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md border border-border p-2"
            aria-label="Abrir menu"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="border-t border-border bg-background xl:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col px-5 py-4"
            aria-label="Mobile"
          >
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              >
                {n.label}
              </Link>
            ))}

            <a
              href="https://wa.me/5511975691076"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Falar com consultor
              <ArrowRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
