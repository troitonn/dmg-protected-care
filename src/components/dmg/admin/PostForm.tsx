import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { estimateReadingTime } from "@/lib/markdown";
import { MarkdownEditor } from "./MarkdownEditor";
import { RelatedPostsPicker } from "./RelatedPostsPicker";
import { QualityChecklist } from "./QualityChecklist";

type PostStatus = "draft" | "published" | "archived";

export type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  direct_answer: string;
  content: string;
  featured_image_url: string;
  category_id: string;
  author_id: string;
  reviewer_name: string;
  reviewer_credentials: string;
  meta_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string;
  status: PostStatus;
  reading_time: number | "";
  canonical_url: string;
  cta_label: string;
  cta_url: string;
  geo_entities: string;
  geo_questions: string;
  geo_services: string;
  geo_locality: string;
  published_at: string;
};

export type FaqItem = { question: string; answer: string };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}

const EMPTY: PostFormValues = {
  title: "", slug: "", excerpt: "", direct_answer: "", content: "", featured_image_url: "",
  category_id: "", author_id: "", reviewer_name: "", reviewer_credentials: "",
  meta_title: "", meta_description: "", primary_keyword: "", secondary_keywords: "",
  status: "draft", reading_time: "", canonical_url: "", cta_label: "", cta_url: "",
  geo_entities: "", geo_questions: "", geo_services: "", geo_locality: "Franca-SP",
  published_at: "",
};

const CTA_PRESETS = [
  { label: "Solicitar diagnóstico SST", url: "/contato" },
  { label: "Falar com consultor DMG", url: "/contato" },
  { label: "Quero regularizar meu PCMSO", url: "/pcmso" },
  { label: "Adequar minha empresa ao PGR", url: "/pgr" },
  { label: "Adequar minha empresa à NR-1", url: "/nr-1-riscos-psicossociais" },
  { label: "Enviar eSocial SST com segurança", url: "/esocial-sst" },
  { label: "Regularizar laudos técnicos", url: "/laudos" },
];

type Tab = "content" | "seo" | "geo" | "faq" | "related" | "quality";

export function PostForm({ postId }: { postId?: string }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("content");
  const [values, setValues] = useState<PostFormValues>(EMPTY);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [related, setRelated] = useState<string[]>([]);
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("blog_categories").select("id,name").order("name").then(({ data }) => setCats(data ?? []));
    supabase.from("blog_authors").select("id,name").order("name").then(({ data }) => setAuthors(data ?? []));
  }, []);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("id", postId).maybeSingle();
      if (!data) return;
      setValues({
        title: data.title ?? "",
        slug: data.slug ?? "",
        excerpt: data.excerpt ?? "",
        direct_answer: data.direct_answer ?? "",
        content: data.content ?? "",
        featured_image_url: data.featured_image_url ?? "",
        category_id: data.category_id ?? "",
        author_id: data.author_id ?? "",
        reviewer_name: data.reviewer_name ?? "",
        reviewer_credentials: data.reviewer_credentials ?? "",
        meta_title: data.meta_title ?? "",
        meta_description: data.meta_description ?? "",
        primary_keyword: data.primary_keyword ?? "",
        secondary_keywords: (data.secondary_keywords ?? []).join(", "),
        status: (data.status ?? "draft") as PostStatus,
        reading_time: data.reading_time ?? "",
        canonical_url: data.canonical_url ?? "",
        cta_label: data.cta_label ?? "",
        cta_url: data.cta_url ?? "",
        geo_entities: (data.geo_entities ?? []).join(", "),
        geo_questions: (data.geo_questions ?? []).join("\n"),
        geo_services: (data.geo_services ?? []).join(", "),
        geo_locality: data.geo_locality ?? "Franca-SP",
        published_at: data.published_at ? data.published_at.slice(0, 16) : "",
      });
      const { data: f } = await supabase.from("blog_faqs").select("question,answer,sort_order").eq("post_id", postId).order("sort_order");
      setFaqs((f ?? []).map((x) => ({ question: x.question, answer: x.answer })));
      const { data: r } = await supabase.from("blog_related_posts").select("related_post_id").eq("post_id", postId);
      setRelated((r ?? []).map((x) => x.related_post_id));
    })();
  }, [postId]);

  function set<K extends keyof PostFormValues>(k: K, v: PostFormValues[K]) {
    setValues((p) => ({ ...p, [k]: v }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("blog-images").upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      set("featured_image_url", data.publicUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const slug = values.slug || slugify(values.title);
      const payload = {
        title: values.title,
        slug,
        excerpt: values.excerpt || null,
        direct_answer: values.direct_answer || null,
        content: values.content,
        featured_image_url: values.featured_image_url || null,
        category_id: values.category_id || null,
        author_id: values.author_id || null,
        reviewer_name: values.reviewer_name || null,
        reviewer_credentials: values.reviewer_credentials || null,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
        primary_keyword: values.primary_keyword || null,
        secondary_keywords: values.secondary_keywords ? values.secondary_keywords.split(",").map((s) => s.trim()).filter(Boolean) : null,
        status: values.status,
        reading_time: values.reading_time === "" ? estimateReadingTime(values.content) : Number(values.reading_time),
        canonical_url: values.canonical_url || null,
        cta_label: values.cta_label || null,
        cta_url: values.cta_url || null,
        geo_entities: values.geo_entities ? values.geo_entities.split(",").map((s) => s.trim()).filter(Boolean) : null,
        geo_questions: values.geo_questions ? values.geo_questions.split("\n").map((s) => s.trim()).filter(Boolean) : null,
        geo_services: values.geo_services ? values.geo_services.split(",").map((s) => s.trim()).filter(Boolean) : null,
        geo_locality: values.geo_locality || null,
        published_at: values.status === "published"
          ? (values.published_at ? new Date(values.published_at).toISOString() : new Date().toISOString())
          : (values.published_at ? new Date(values.published_at).toISOString() : null),
      };
      let id = postId;
      if (postId) {
        const { error: e } = await supabase.from("blog_posts").update(payload).eq("id", postId);
        if (e) throw e;
      } else {
        const { data, error: e } = await supabase.from("blog_posts").insert(payload).select("id").single();
        if (e) throw e;
        id = data.id;
      }
      if (id) {
        await supabase.from("blog_faqs").delete().eq("post_id", id);
        if (faqs.length) {
          await supabase.from("blog_faqs").insert(faqs.map((f, i) => ({ post_id: id, question: f.question, answer: f.answer, sort_order: i })));
        }
        await supabase.from("blog_related_posts").delete().eq("post_id", id);
        if (related.length) {
          await supabase.from("blog_related_posts").insert(related.map((rid) => ({ post_id: id, related_post_id: rid })));
        }
      }
      navigate({ to: "/admin/blog" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "content", label: "Conteúdo" },
    { id: "seo", label: "SEO" },
    { id: "geo", label: "GEO" },
    { id: "faq", label: `FAQ (${faqs.length})` },
    { id: "related", label: `Relacionados (${related.length})` },
    { id: "quality", label: "Qualidade" },
  ];

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="sticky top-0 z-10 -mx-5 flex overflow-x-auto border-b border-border bg-paper px-5 lg:-mx-8 lg:px-8">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${tab === t.id ? "border-petrol text-petrol" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <Section>
          <Field label="Título" required>
            <input value={values.title} onChange={(e) => { set("title", e.target.value); if (!postId) set("slug", slugify(e.target.value)); }} className={inputCls} />
          </Field>
          <Field label="Slug">
            <input value={values.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={inputCls} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Categoria">
              <select value={values.category_id} onChange={(e) => set("category_id", e.target.value)} className={inputCls}>
                <option value="">—</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Autor">
              <select value={values.author_id} onChange={(e) => set("author_id", e.target.value)} className={inputCls}>
                <option value="">—</option>
                {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label="Revisor técnico"><input value={values.reviewer_name} onChange={(e) => set("reviewer_name", e.target.value)} className={inputCls} /></Field>
            <Field label="Credenciais do revisor"><input value={values.reviewer_credentials} onChange={(e) => set("reviewer_credentials", e.target.value)} className={inputCls} /></Field>
          </div>
          <Field label="Imagem destacada">
            {values.featured_image_url && <img src={values.featured_image_url} alt="" className="mb-3 h-40 w-full max-w-md rounded-lg object-cover" />}
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} className="text-sm" />
            {uploading && <p className="mt-2 text-xs text-muted-foreground">Enviando…</p>}
            <input value={values.featured_image_url} onChange={(e) => set("featured_image_url", e.target.value)} placeholder="ou URL da imagem" className={`${inputCls} mt-2`} />
          </Field>
          <Field label="Resumo curto (exibido em cards)">
            <textarea value={values.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} className={inputCls} />
          </Field>
          <Field label="Conteúdo (Markdown)">
            <MarkdownEditor value={values.content} onChange={(v) => set("content", v)} showPreview={showPreview} onTogglePreview={setShowPreview} />
          </Field>
          <Field label="CTA do artigo">
            <div className="mb-2 flex flex-wrap gap-2">
              {CTA_PRESETS.map((c) => (
                <button key={c.label} type="button" onClick={() => { set("cta_label", c.label); set("cta_url", c.url); }} className="rounded-full border border-border bg-white px-3 py-1 text-xs text-foreground/80 hover:border-petrol hover:text-petrol">
                  {c.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input value={values.cta_label} onChange={(e) => set("cta_label", e.target.value)} placeholder="Texto do botão" className={inputCls} />
              <input value={values.cta_url} onChange={(e) => set("cta_url", e.target.value)} placeholder="URL (/contato)" className={inputCls} />
            </div>
          </Field>
        </Section>
      )}

      {tab === "seo" && (
        <Section>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={`Meta title (${values.meta_title.length}/60)`}><input value={values.meta_title} onChange={(e) => set("meta_title", e.target.value)} className={inputCls} /></Field>
            <Field label="Canonical URL"><input value={values.canonical_url} onChange={(e) => set("canonical_url", e.target.value)} className={inputCls} /></Field>
          </div>
          <Field label={`Meta description (${values.meta_description.length}/160)`}>
            <textarea value={values.meta_description} onChange={(e) => set("meta_description", e.target.value)} rows={2} className={inputCls} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Palavra-chave principal"><input value={values.primary_keyword} onChange={(e) => set("primary_keyword", e.target.value)} className={inputCls} /></Field>
            <Field label="Palavras-chave secundárias (vírgula)"><input value={values.secondary_keywords} onChange={(e) => set("secondary_keywords", e.target.value)} className={inputCls} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Data de publicação"><input type="datetime-local" value={values.published_at} onChange={(e) => set("published_at", e.target.value)} className={inputCls} /></Field>
            <Field label="Tempo de leitura (min)"><input type="number" min={1} value={values.reading_time} onChange={(e) => set("reading_time", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Status">
              <select value={values.status} onChange={(e) => set("status", e.target.value as PostStatus)} className={inputCls}>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </Field>
          </div>
        </Section>
      )}

      {tab === "geo" && (
        <Section>
          <Field label={`Resposta direta GEO (${values.direct_answer.trim().split(/\s+/).filter(Boolean).length} palavras — ideal 40–60)`}>
            <textarea value={values.direct_answer} onChange={(e) => set("direct_answer", e.target.value)} rows={4} className={inputCls} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Entidades citadas (vírgula)"><input value={values.geo_entities} onChange={(e) => set("geo_entities", e.target.value)} className={inputCls} /></Field>
            <Field label="Serviços relacionados (vírgula)"><input value={values.geo_services} onChange={(e) => set("geo_services", e.target.value)} className={inputCls} /></Field>
            <Field label="Localidade"><input value={values.geo_locality} onChange={(e) => set("geo_locality", e.target.value)} className={inputCls} /></Field>
          </div>
          <Field label="Perguntas que este artigo responde (uma por linha)">
            <textarea value={values.geo_questions} onChange={(e) => set("geo_questions", e.target.value)} rows={5} className={inputCls} />
          </Field>
        </Section>
      )}

      {tab === "faq" && (
        <Section>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-border bg-paper/50 p-3">
                <input value={f.question} onChange={(e) => setFaqs((p) => p.map((x, j) => j === i ? { ...x, question: e.target.value } : x))} placeholder="Pergunta" className={`${inputCls} mb-2`} />
                <textarea value={f.answer} onChange={(e) => setFaqs((p) => p.map((x, j) => j === i ? { ...x, answer: e.target.value } : x))} placeholder="Resposta" rows={3} className={inputCls} />
                <button onClick={() => setFaqs((p) => p.filter((_, j) => j !== i))} className="mt-2 text-xs text-red-600 hover:underline">Remover</button>
              </div>
            ))}
            <button onClick={() => setFaqs((p) => [...p, { question: "", answer: "" }])} className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold">+ Adicionar FAQ</button>
          </div>
        </Section>
      )}

      {tab === "related" && (
        <Section>
          <RelatedPostsPicker currentPostId={postId} value={related} onChange={setRelated} />
        </Section>
      )}

      {tab === "quality" && <QualityChecklist values={values} faqs={faqs} />}

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-white/95 px-1 py-4 backdrop-blur">
        <button onClick={() => history.back()} className="rounded-full border border-border bg-white px-5 py-2.5 text-sm">Cancelar</button>
        <button onClick={save} disabled={saving || !values.title} className="rounded-full bg-petrol px-6 py-2.5 text-sm font-semibold text-white hover:bg-petrol-ink disabled:opacity-60">
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-petrol";

function Section({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border border-border bg-white p-6 space-y-4">{children}</section>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-foreground/80">{label}{required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}
