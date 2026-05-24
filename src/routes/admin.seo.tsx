import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/dmg/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus, X, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({ meta: [
    { title: "SEO global | Painel DMG" },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: SeoPage,
});

type SeoRow = {
  id: string;
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  schema_json: unknown;
  updated_at: string;
};

const SUGGESTED_PATHS = [
  "/", "/blog", "/medicina-do-trabalho-franca-sp", "/pcmso", "/pgr", "/esocial-sst",
  "/nr-1-riscos-psicossociais", "/laudos-tecnicos", "/ltcat", "/aso-exame-ocupacional",
  "/treinamentos-nr", "/protecao-empresarial-sst", "/franca-sp", "/perguntas-frequentes",
];

function isValidUrlOrPath(s: string) {
  if (!s) return true;
  if (s.startsWith("/")) return true;
  try { new URL(s); return true; } catch { return false; }
}

function jsonStatus(s: string): "ok" | "fail" | "empty" {
  if (!s.trim()) return "empty";
  try { JSON.parse(s); return "ok"; } catch { return "fail"; }
}

function SeoPage() {
  const [rows, setRows] = useState<SeoRow[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<SeoRow | "new" | null>(null);

  async function load() {
    const { data } = await supabase.from("seo_settings").select("*").order("page_path");
    setRows((data ?? []) as SeoRow[]);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter((r) => r.page_path.toLowerCase().includes(q.toLowerCase())), [rows, q]);

  async function remove(id: string) {
    if (!confirm("Excluir esta configuração SEO?")) return;
    await supabase.from("seo_settings").delete().eq("id", id);
    load();
  }

  return (
    <AdminLayout title="SEO global">
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por path…" className="min-w-[220px] flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-petrol" />
          <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 rounded-lg bg-petrol px-4 py-2 text-sm font-semibold text-white hover:bg-petrol-ink">
            <Plus className="h-4 w-4" /> Nova configuração
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3">Meta title</th>
              <th className="px-4 py-3">Meta description</th>
              <th className="px-4 py-3">Schema</th>
              <th className="px-4 py-3">Atualizado</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhuma configuração ainda.</td></tr>
            )}
            {filtered.map((r) => {
              const tl = (r.meta_title ?? "").length;
              const dl = (r.meta_description ?? "").length;
              return (
                <tr key={r.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3 font-mono text-xs">{r.page_path}</td>
                  <td className="px-4 py-3"><Quality value={tl} min={50} max={60} /></td>
                  <td className="px-4 py-3"><Quality value={dl} min={140} max={160} /></td>
                  <td className="px-4 py-3 text-xs">{r.schema_json ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.updated_at).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(r)} className="rounded-lg border border-border p-1.5 hover:bg-paper"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => remove(r.id)} className="rounded-lg border border-red-300 p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && <EditDrawer initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </AdminLayout>
  );
}

function Quality({ value, min, max }: { value: number; min: number; max: number }) {
  if (!value) return <span className="inline-flex items-center gap-1 text-xs text-red-600"><XCircle className="h-3.5 w-3.5" /> vazio</span>;
  if (value < min || value > max) return <span className="inline-flex items-center gap-1 text-xs text-amber-600"><AlertTriangle className="h-3.5 w-3.5" /> {value}</span>;
  return <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> {value}</span>;
}

function EditDrawer({ initial, onClose, onSaved }: { initial: SeoRow | null; onClose: () => void; onSaved: () => void }) {
  const [path, setPath] = useState(initial?.page_path ?? "");
  const [title, setTitle] = useState(initial?.meta_title ?? "");
  const [desc, setDesc] = useState(initial?.meta_description ?? "");
  const [canonical, setCanonical] = useState(initial?.canonical_url ?? "");
  const [schema, setSchema] = useState(initial?.schema_json ? JSON.stringify(initial.schema_json, null, 2) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tl = title.length;
  const dl = desc.length;
  const canonOk = isValidUrlOrPath(canonical);
  const schemaState = jsonStatus(schema);

  async function save() {
    setError(null);
    if (!path.startsWith("/")) { setError("Path deve começar com /"); return; }
    if (!canonOk) { setError("Canonical inválida"); return; }
    if (schemaState === "fail") { setError("Schema JSON inválido"); return; }
    setSaving(true);
    try {
      const payload = {
        page_path: path,
        meta_title: title || null,
        meta_description: desc || null,
        canonical_url: canonical || null,
        schema_json: schemaState === "ok" ? JSON.parse(schema) : null,
        updated_at: new Date().toISOString(),
      };
      if (initial) {
        const { error: e } = await supabase.from("seo_settings").update(payload).eq("id", initial.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from("seo_settings").insert(payload);
        if (e) throw e;
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="flex w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold">{initial ? "Editar SEO" : "Nova configuração SEO"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-5 p-6">
          {error && <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div>
            <label className="mb-1.5 block text-xs font-medium">Page path *</label>
            <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/" className="w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SUGGESTED_PATHS.map((p) => (
                <button key={p} onClick={() => setPath(p)} className="rounded-full border border-border bg-paper px-2.5 py-1 text-[11px] hover:border-petrol hover:text-petrol">{p}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">Meta title ({tl} chars — ideal 50–60)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" />
            <Quality value={tl} min={50} max={60} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">Meta description ({dl} chars — ideal 140–160)</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" />
            <Quality value={dl} min={140} max={160} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">Canonical URL</label>
            <input value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="/ ou https://…" className={`w-full rounded-lg border ${canonOk ? "border-border" : "border-red-400"} bg-white px-3 py-2 text-sm`} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">Schema.org JSON-LD</label>
            <textarea value={schema} onChange={(e) => setSchema(e.target.value)} rows={10} className={`w-full rounded-lg border ${schemaState === "fail" ? "border-red-400" : "border-border"} bg-white px-3 py-2 font-mono text-[12px]`} placeholder='{ "@context": "https://schema.org", "@type": "WebPage" }' />
            <p className="mt-1 text-xs text-muted-foreground">
              {schemaState === "fail" && <span className="text-red-600">JSON inválido</span>}
              {schemaState === "ok" && <span className="text-emerald-700">JSON válido</span>}
              {schemaState === "empty" && "Opcional"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-paper px-6 py-4">
          <button onClick={onClose} className="rounded-full border border-border bg-white px-4 py-2 text-sm">Cancelar</button>
          <button onClick={save} disabled={saving || !path} className="rounded-full bg-petrol px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Salvando…" : "Salvar"}</button>
        </div>
      </div>
    </div>
  );
}
