import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/dmg/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/categorias")({
  head: () => ({ meta: [{ title: "Categorias | Painel DMG" }, { name: "robots", content: "noindex,nofollow" }]}),
  component: CategoriesPage,
});

type Cat = { id?: string; name: string; slug: string; description: string; meta_title: string; meta_description: string };

const EMPTY: Cat = { name: "", slug: "", description: "", meta_title: "", meta_description: "" };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function CategoriesPage() {
  const [rows, setRows] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<Cat>(EMPTY);

  async function reload() {
    const { data } = await supabase.from("blog_categories").select("*").order("name");
    setRows((data ?? []) as Cat[]);
  }
  useEffect(() => { reload(); }, []);

  async function save() {
    const payload = { ...editing, slug: editing.slug || slugify(editing.name) };
    if (!payload.name) return;
    if (editing.id) await supabase.from("blog_categories").update(payload).eq("id", editing.id);
    else await supabase.from("blog_categories").insert(payload);
    setEditing(EMPTY);
    reload();
  }
  async function remove(id?: string) {
    if (!id || !confirm("Excluir categoria?")) return;
    await supabase.from("blog_categories").delete().eq("id", id);
    reload();
  }

  return (
    <AdminLayout title="Categorias">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-paper text-left text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3 text-right">Ações</th></tr></thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(r)} className="text-xs text-primary hover:underline">Editar</button>
                    <button onClick={() => remove(r.id)} className="ml-3 text-xs text-red-600 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="text-sm font-semibold">{editing.id ? "Editar categoria" : "Nova categoria"}</h2>
          <div className="mt-4 space-y-3">
            <input placeholder="Nome" value={editing.name} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value, slug: p.slug || slugify(e.target.value) }))} className={inputCls} />
            <input placeholder="Slug" value={editing.slug} onChange={(e) => setEditing((p) => ({ ...p, slug: slugify(e.target.value) }))} className={inputCls} />
            <textarea placeholder="Descrição" value={editing.description} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} rows={2} className={inputCls} />
            <input placeholder="Meta title" value={editing.meta_title} onChange={(e) => setEditing((p) => ({ ...p, meta_title: e.target.value }))} className={inputCls} />
            <textarea placeholder="Meta description" value={editing.meta_description} onChange={(e) => setEditing((p) => ({ ...p, meta_description: e.target.value }))} rows={2} className={inputCls} />
            <div className="flex gap-2">
              <button onClick={save} className="rounded-full bg-petrol px-4 py-2 text-xs font-semibold text-white">Salvar</button>
              {editing.id && <button onClick={() => setEditing(EMPTY)} className="rounded-full border border-border px-4 py-2 text-xs">Cancelar</button>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-petrol";
