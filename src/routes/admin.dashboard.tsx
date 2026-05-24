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

type Stats = { published: number; drafts: number; archived: number; categories: number; authors: number; noMeta: number; noDirect: number; noFaq: number; noImage: number };
type RecentPost = { id: string; title: string; status: string; updated_at: string };

function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ published: 0, drafts: 0, archived: 0, categories: 0, authors: 0, noMeta: 0, noDirect: 0, noFaq: 0, noImage: 0 });
  const [recent, setRecent] = useState<RecentPost[]>([]);

  useEffect(() => {
    (async () => {
      const [pub, dft, arc, cat, aut, noMeta, noDirect, noImage, rec, allPosts, faqs] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "archived"),
        supabase.from("blog_categories").select("id", { count: "exact", head: true }),
        supabase.from("blog_authors").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).is("meta_description", null),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).is("direct_answer", null),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).is("featured_image_url", null),
        supabase.from("blog_posts").select("id,title,status,updated_at").order("updated_at", { ascending: false }).limit(6),
        supabase.from("blog_posts").select("id"),
        supabase.from("blog_faqs").select("post_id"),
      ]);
      const postIds = new Set((allPosts.data ?? []).map((p) => p.id));
      const withFaq = new Set((faqs.data ?? []).map((f) => f.post_id));
      const noFaq = [...postIds].filter((id) => !withFaq.has(id)).length;
      setStats({
        published: pub.count ?? 0, drafts: dft.count ?? 0, archived: arc.count ?? 0,
        categories: cat.count ?? 0, authors: aut.count ?? 0,
        noMeta: noMeta.count ?? 0, noDirect: noDirect.count ?? 0, noFaq, noImage: noImage.count ?? 0,
      });
      setRecent((rec.data as RecentPost[]) ?? []);
    })();
  }, []);

  const cards = [
    { label: "Publicados", value: stats.published, icon: FileText, to: "/admin/blog" },
    { label: "Rascunhos", value: stats.drafts, icon: FileText, to: "/admin/blog" },
    { label: "Arquivados", value: stats.archived, icon: FileText, to: "/admin/blog" },
    { label: "Categorias", value: stats.categories, icon: FolderTree, to: "/admin/categorias" },
    { label: "Autores", value: stats.authors, icon: Users, to: "/admin/autores" },
  ];
  const quality = [
    { label: "Sem meta description", value: stats.noMeta },
    { label: "Sem resposta direta GEO", value: stats.noDirect },
    { label: "Sem FAQ", value: stats.noFaq },
    { label: "Sem imagem destacada", value: stats.noImage },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

      <div className="mt-6 rounded-2xl border border-border bg-white p-5">
        <h2 className="text-sm font-semibold">Qualidade SEO/GEO dos artigos</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quality.map((q) => (
            <Link key={q.label} to="/admin/blog" className={`rounded-xl border p-4 ${q.value > 0 ? "border-amber-300 bg-amber-50" : "border-emerald-300 bg-emerald-50"}`}>
              <p className="text-xs font-medium text-foreground/70">{q.label}</p>
              <p className={`mt-1 text-2xl font-semibold ${q.value > 0 ? "text-amber-700" : "text-emerald-700"}`}>{q.value}</p>
            </Link>
          ))}
        </div>
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
