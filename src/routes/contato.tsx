import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/dmg/SiteLayout";
import { FinalCTA } from "@/components/dmg/sections";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
    { title: "Contato | DMG Ocupacional — Franca-SP" },
    { name: "description", content: "Fale com a DMG Ocupacional: medicina do trabalho, PCMSO, PGR e eSocial SST em Franca-SP." },
    { property: "og:url", content: "https://dmg-protected-care.lovable.app/contato" },
    { property: "og:type", content: "website" },
  ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/contato" }],
  }),
  component: Contato,
});

function Contato() {
  return (
    <SiteLayout>
      <section className="bg-radial-petrol py-20 text-white sm:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-soft" /> Contato
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Vamos estruturar a SST da sua empresa.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 sm:text-lg">
            Fale com um consultor DMG e receba um diagnóstico rápido das suas
            obrigações em medicina do trabalho.
          </p>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-5">
            <InfoRow icon={MapPin} label="Endereço" value="Franca-SP — atendimento à região" />
            <InfoRow icon={Phone} label="Telefone" value="+55 11 97569-1076" />
            <InfoRow icon={Mail} label="E-mail" value="contato@dmgocupacional.com" />
            <InfoRow icon={Clock} label="Horário" value="Seg. a sex., 7h às 18h" />
            <a href="https://wa.me/5511975691076" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <MessageCircle className="h-4 w-4" /> Falar pelo WhatsApp
            </a>
          </div>

          <form className="grid gap-4 rounded-3xl border border-border bg-card p-7 shadow-soft lg:col-span-7" onSubmit={(e) => { e.preventDefault(); window.location.href = "https://wa.me/5511975691076"; }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome" name="nome" required />
              <Field label="Empresa" name="empresa" required />
              <Field label="E-mail" name="email" type="email" required />
              <Field label="Telefone" name="telefone" />
            </div>
            <Field label="Nº de colaboradores" name="colaboradores" />
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mensagem</label>
              <textarea name="mensagem" rows={5} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30" />
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Enviar solicitação <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-muted-foreground">Ao enviar, você concorda em ser contatado pela equipe DMG.</p>
          </form>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input name={name} type={type} required={required} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30" />
    </div>
  );
}
