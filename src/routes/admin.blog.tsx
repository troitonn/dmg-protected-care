import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/dmg/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({
    meta: [
      { title: "Artigos | Painel DMG" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: BlogAdminPage,
});

/* ================= LAYOUT PAI ================= */

function BlogAdminPage() {
  return (
    <AdminLayout title="Artigos do blog">
      <Outlet />
    </AdminLayout>
  );
}

/* ================= LISTA (INDEX ROUTE) ================= */

export function BlogAdminListPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [cat, setCat] = useState<string>("");

  async function reload() {
    let query = supabase
      .from("blog_posts")
      .select(
        "id,title,slug,status,published_at,updated_at,blog_categories(name),blog_authors(name)"
      )
      .order("updated_at", { ascending: false });

    if (status) query = query.eq("status", status as Row["status"]);
    if (cat) query = query.eq("category_id", cat);

    const { data } = await query;
    setRows((data as unknown as Row[]) ?? []);
  }

  useEffect(() => {
    supabase
      .from("blog_categories")
      .select("id,name")
      .order("name")
      .then(({ data }) => setCats(data ?? []));
  }, []);

  useEffect(() => {
    reload();
  }, [status, cat]);

  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        r.title.toLowerCase().includes(q.toLowerCase())
      ),
    [rows, q]
  );

  async function remove(id: string) {
    if (!confirm("Excluir este artigo?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    reload();
  }

  return (
    <>
      {/* FILTROS */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título…"
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-petrol"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>

          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="">Todas as categorias</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <Link
            to="/admin/blog/novo"
            className="flex items-center justify-center rounded-lg bg-petrol px-4 py-2 text-sm font-semibold text-white hover:bg-petrol-ink"
          >
            + Novo artigo
          </Link>
        </div>
      </div>

      {/* TABELA */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Autor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Atualizado</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum artigo encontrado.
                </td>
              </tr>
            )}

            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-paper/60">
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {r.blog_categories?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {r.blog_authors?.name ?? "—"}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      r.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : r.status === "draft"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {r.status === "published"
                      ? "Publicado"
                      : r.status === "draft"
                      ? "Rascunho"
                      : "Arquivado"}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleDateString("pt-BR")}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {r.status === "published" && (
                      <a
                        href={`/blog/${r.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-border p-1.5 hover:bg-paper"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </a>
                    )}

                    <Link
                      to="/admin/blog/editar/$id"
                      params={{ id: r.id }}
                      className="rounded-lg border border-border p-1.5 hover:bg-paper"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      onClick={() => remove(r.id)}
                      className="rounded-lg border border-red-300 p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ================= TYPES ================= */

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  updated_at: string;
  blog_categories: { name: string } | null;
  blog_authors: { name: string } | null;
};
