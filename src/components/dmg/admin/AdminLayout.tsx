import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { DmgLogo } from "@/components/dmg/DmgLogo";
import { LayoutDashboard, FileText, FolderTree, Users, LogOut, ExternalLink } from "lucide-react";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/blog", label: "Artigos", icon: FileText },
  { to: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { to: "/admin/autores", label: "Autores", icon: Users },
] as const;

export function AdminGuard({ children }: { children: ReactNode }) {
  const { loading, session, isStaff } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Verificando acesso…</div>
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") navigate({ to: "/admin/login" });
    return null;
  }

  if (!isStaff) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="text-2xl font-semibold">Acesso restrito</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Sua conta não possui permissão de administrador ou editor. Solicite ao administrador da DMG que conceda acesso.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="mt-6 rounded-full border border-border px-4 py-2 text-sm">Sair</button>
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminLayout({ children, title }: { children: ReactNode; title?: string }) {
  const router = useRouter();
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/admin/login" });
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-paper">
        <aside className="hidden w-64 flex-col border-r border-border bg-petrol-ink text-white lg:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <DmgLogo className="h-8 w-auto" variant="light" />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">Painel administrativo</p>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-5">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <Link key={n.to} to={n.to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/5 hover:text-white"
                  activeProps={{ className: "bg-white/10 text-white" }}>
                  <Icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-1 border-t border-white/10 p-3">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/5 hover:text-white">
              <ExternalLink className="h-4 w-4" /> Ver site público
            </a>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/5 hover:text-white">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border bg-white px-5 py-4 lg:px-8">
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
            <Link to="/admin/blog/novo" className="rounded-full bg-petrol px-4 py-2 text-xs font-semibold text-white hover:bg-petrol-ink">
              + Novo artigo
            </Link>
          </header>
          <main className="flex-1 overflow-x-hidden p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
