import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DmgLogo } from "@/components/dmg/DmgLogo";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [
    { title: "Acesso administrativo | DMG Ocupacional" },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/dashboard" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-petrol-ink px-4 py-12 text-white">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center">
          <DmgLogo className="h-10 w-auto" variant="light" />
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">Painel administrativo</span>
          <h1 className="mt-2 text-2xl font-semibold">{mode === "signup" ? "Criar acesso" : "Entrar no painel"}</h1>
          <p className="mt-2 text-sm text-white/70">{mode === "signup" ? "O primeiro cadastro recebe acesso de administrador automaticamente." : "Acesso restrito à equipe DMG."}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/80">E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-teal-soft" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/80">Senha</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-teal-soft" />
            </div>
            {error && <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-teal-soft px-5 py-3 text-sm font-semibold text-petrol-ink transition hover:bg-white disabled:opacity-60">
              {loading ? "Aguarde…" : mode === "signup" ? "Criar acesso" : "Entrar no painel"}
            </button>
          </form>

          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-xs text-white/65 hover:text-white">
            {mode === "signin" ? "Primeiro acesso? Criar conta" : "Já tem conta? Entrar"}
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-white/50">© DMG Ocupacional — Franca-SP</p>
      </div>
    </div>
  );
}
