import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

type PostOption = { id: string; title: string; slug: string; status: string };

export function RelatedPostsPicker({
  currentPostId,
  value,
  onChange,
}: {
  currentPostId?: string;
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [all, setAll] = useState<PostOption[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("blog_posts").select("id,title,slug,status").eq("status", "published").order("title").then(({ data }) => {
      setAll((data ?? []) as PostOption[]);
    });
  }, []);

  const available = useMemo(
    () => all.filter((p) => p.id !== currentPostId && !value.includes(p.id) && p.title.toLowerCase().includes(q.toLowerCase())),
    [all, value, q, currentPostId],
  );

  const selected = useMemo(() => all.filter((p) => value.includes(p.id)), [all, value]);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground/80">Buscar artigos publicados</label>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Digite para filtrar…" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-petrol" />
      </div>

      <div className="max-h-56 overflow-y-auto rounded-lg border border-border bg-paper/40">
        {available.length === 0 && <p className="p-4 text-sm text-muted-foreground">Nenhum artigo disponível.</p>}
        <ul className="divide-y divide-border">
          {available.slice(0, 30).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="truncate text-xs text-muted-foreground">/blog/{p.slug}</p>
              </div>
              <button type="button" onClick={() => onChange([...value, p.id])} className="rounded-full bg-petrol px-3 py-1 text-xs font-semibold text-white">Adicionar</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Selecionados ({selected.length})</p>
        {selected.length === 0 && <p className="text-sm text-muted-foreground">Nenhum artigo relacionado ainda.</p>}
        <ul className="space-y-2">
          {selected.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2">
              <span className="truncate text-sm">{p.title}</span>
              <button type="button" onClick={() => onChange(value.filter((id) => id !== p.id))} className="rounded-full p-1 text-red-600 hover:bg-red-50" aria-label="Remover">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
