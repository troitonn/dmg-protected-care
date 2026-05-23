import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/dmg/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/autores")({
  head: () => ({ meta: [{ title: "Autores | Painel DMG" }, { name: "robots", content: "noindex,nofollow" }]}),
  component: AuthorsPage,
});

type Author = { id?: string; name: string; slug: string; role: string; bio: string; avatar_url: string; credentials: string; linkedin_url: string };
const EMPTY: Author = { name: "", slug: "", role: "", bio: "", avatar_url: "", credentials: "", linkedin_url: "" };
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

function AuthorsPage() {
  const [rows, setRows] = useState<Author[]>([]);
  const [editing, setEditing] = useState<Author>(EMPTY);

  async function reload() {
    const { data } = await supabase.from("blog_authors").select("*").order("name");
    setRows((data ?? []) as Author[]);
  }
  useEffect(() => { reload(); }, []);

  async function save() {
    const payload = { ...editing, slug: editing.slug || slugify(editing.name) };
    if (!payload.name) return;
    if (editing.id) await supabase.from("blog_authors").update(payload).eq("id", editing.id);
    else await supabase.from("blog_authors").insert(payload);
    setEditing(EMPTY); reload();
  }
  async function remove(id?: string) {
    if (!id || !confirm("Excluir autor?")) return;
    await supabase.from("blog_authors").delete().eq("id", id); reload();
  }

  return (
    <AdminLayout title="Autores">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-paper text-left text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Cargo</th><th className="px-4 py-3 text-right">Ações</th></tr></thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.role}</td>
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
          <h2 className="text-sm font-semibold">{editing.id ? "Editar autor" : "Novo autor"}</h2>
          <div className="mt-4 space-y-3">
            <input placeholder="Nome" value={editing.name} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value, slug: p.slug || slugify(e.target.value) }))} className={inputCls} />
            <input placeholder="Slug" value={editing.slug} onChange={(e) => setEditing((p) => ({ ...p, slug: slugify(e.target.value) }))} className={inputCls} />
            <input placeholder="Cargo" value={editing.role} onChange={(e) => setEditing((p) => ({ ...p, role: e.target.value }))} className={inputCls} />
            <input placeholder="Credenciais (CRM, CREA…)" value={editing.credentials} onChange={(e) => setEditing((p) => ({ ...p, credentials: e.target.value }))} className={inputCls} />
            <input placeholder="URL da foto" value={editing.avatar_url} onChange={(e) => setEditing((p) => ({ ...p, avatar_url: e.target.value }))} className={inputCls} />
            <input placeholder="LinkedIn" value={editing.linkedin_url} onChange={(e) => setEditing((p) => ({ ...p, linkedin_url: e.target.value }))} className={inputCls} />
            <textarea placeholder="Bio" value={editing.bio} onChange={(e) => setEditing((p) => ({ ...p, bio: e.target.value }))} rows={3} className={inputCls} />
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
