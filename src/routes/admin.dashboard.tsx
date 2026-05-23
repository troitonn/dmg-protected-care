import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/dmg/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, FolderTree, Users, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard | Painel DMG" },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: DashboardPage,
});

type Stats = { published: number; drafts: number; categories: number; authors: number };
type RecentPost = { id: string; title: string; status: string; updated_at: string };

function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ published: 0, drafts: 0, categories: 0, authors: 0 });
  const [recent, setRecent] = useState<RecentPost[]>([]);

  useEffect(() => {
    (async () => {
      const [pub, dft, cat, aut, rec] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("blog_categories").select("id", { count: "exact", head: true }),
        supabase.from("blog_authors").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id,title,status,updated_at").order("updated_at", { ascending: false }).limit(6),
      ]);
      setStats({
        published: pub.count ?? 0,
        drafts: dft.count ?? 0,
        categories: cat.count ?? 0,
        authors: aut.count ?? 0,
      });
      setRecent((rec.data as RecentPost[]) ?? []);
    })();
  }, []);

  const cards = [
    { label: "Publicados", value: stats.published, icon: FileText, to: "/admin/blog" },
    { label: "Rascunhos", value: stats.drafts, icon: FileText, to: "/admin/blog" },
    { label: "Categorias", value: stats.categories, icon: FolderTree, to: "/admin/categorias" },
    { label: "Autores", value: stats.authors, icon: Users, to: "/admin/autores" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to} className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-petrol/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">{c.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Últimos artigos editados</h2>
            <Link to="/admin/blog" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {recent.length === 0 && <li className="py-6 text-sm text-muted-foreground">Nenhum artigo ainda.</li>}
            {recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.updated_at).toLocaleString("pt-BR")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${p.status === "published" ? "bg-emerald-100 text-emerald-700" : p.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-700"}`}>
                    {p.status === "published" ? "Publicado" : p.status === "draft" ? "Rascunho" : "Arquivado"}
                  </span>
                  <Link to="/admin/blog/editar/$id" params={{ id: p.id }} className="text-xs text-primary hover:underline">Editar</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-petrol p-6 text-white">
          <h2 className="text-sm font-semibold">Atalhos rápidos</h2>
          <div className="mt-4 space-y-2">
            <Link to="/admin/blog/novo" className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-3 text-sm hover:bg-white/15"><PlusCircle className="h-4 w-4" /> Novo artigo</Link>
            <Link to="/admin/categorias" className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-3 text-sm hover:bg-white/15"><FolderTree className="h-4 w-4" /> Gerenciar categorias</Link>
            <Link to="/admin/autores" className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-3 text-sm hover:bg-white/15"><Users className="h-4 w-4" /> Gerenciar autores</Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
