import { useEffect, useMemo, useState } from "react";
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

export type FaqItem = {
  question: string;
  answer: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const EMPTY: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  direct_answer: "",
  content: "",
  featured_image_url: "",
  category_id: "",
  author_id: "",
  reviewer_name: "",
  reviewer_credentials: "",
  meta_title: "",
  meta_description: "",
  primary_keyword: "",
  secondary_keywords: "",
  status: "draft",
  reading_time: "",
  canonical_url: "",
  cta_label: "",
  cta_url: "",
  geo_entities: "",
  geo_questions: "",
  geo_services: "",
  geo_locality: "Osasco-SP e região",
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

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-petrol";

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

  const geoWordCount = useMemo(() => {
    return values.direct_answer
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [values.direct_answer]);

  useEffect(() => {
    async function loadInitialData() {
      const [categoriesRes, authorsRes] = await Promise.all([
        supabase
          .from("blog_categories")
          .select("id,name")
          .order("name"),

        supabase
          .from("blog_authors")
          .select("id,name")
          .order("name"),
      ]);

      setCats(categoriesRes.data ?? []);
      setAuthors(authorsRes.data ?? []);
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!postId) return;
    const id = postId;

    async function loadPost() {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
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
          geo_locality:
            data.geo_locality ?? "Osasco-SP e região",
          published_at: data.published_at
            ? data.published_at.slice(0, 16)
            : "",
        });

        const [{ data: faqData }, { data: relatedData }] =
          await Promise.all([
            supabase
              .from("blog_faqs")
              .select("question,answer,sort_order")
              .eq("post_id", id)
              .order("sort_order"),

            supabase
              .from("blog_related_posts")
              .select("related_post_id")
              .eq("post_id", id),
          ]);

        setFaqs(
          (faqData ?? []).map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          }))
        );

        setRelated(
          (relatedData ?? []).map(
            (item) => item.related_post_id
          )
        );
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar post"
        );
      }
    }

    loadPost();
  }, [postId]);

  function setField<K extends keyof PostFormValues>(
    key: K,
    value: PostFormValues[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function uploadImage(file: File) {
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const path = `posts/${fileName}`;

      const { error } = await supabase.storage
        .from("blog-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(path);

      setField("featured_image_url", data.publicUrl);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Erro no upload da imagem"
      );
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);

    try {
      const slug =
        values.slug || slugify(values.title);

      const payload = {
        title: values.title,
        slug,

        excerpt: values.excerpt || null,
        direct_answer: values.direct_answer || null,
        content: values.content,

        featured_image_url:
          values.featured_image_url || null,

        category_id: values.category_id || null,
        author_id: values.author_id || null,

        reviewer_name:
          values.reviewer_name || null,

        reviewer_credentials:
          values.reviewer_credentials || null,

        meta_title: values.meta_title || null,
        meta_description:
          values.meta_description || null,

        primary_keyword:
          values.primary_keyword || null,

        secondary_keywords:
          values.secondary_keywords
            ? values.secondary_keywords
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : null,

        status: values.status,

        reading_time:
          values.reading_time === ""
            ? estimateReadingTime(values.content)
            : Number(values.reading_time),

        canonical_url:
          values.canonical_url || null,

        cta_label: values.cta_label || null,
        cta_url: values.cta_url || null,

        geo_entities: values.geo_entities
          ? values.geo_entities
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : null,

        geo_questions: values.geo_questions
          ? values.geo_questions
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : null,

        geo_services: values.geo_services
          ? values.geo_services
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : null,

        geo_locality:
          values.geo_locality || null,

        published_at:
          values.status === "published"
            ? values.published_at
              ? new Date(
                  values.published_at
                ).toISOString()
              : new Date().toISOString()
            : values.published_at
            ? new Date(
                values.published_at
              ).toISOString()
            : null,
      };

      let id = postId;

      if (postId) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", postId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("blog_posts")
          .insert(payload)
          .select("id")
          .single();

        if (error) throw error;

        id = data.id;
      }

      if (id) {
        await supabase
          .from("blog_faqs")
          .delete()
          .eq("post_id", id);

        if (faqs.length > 0) {
          const faqPayload = faqs.map(
            (faq, index) => ({
              post_id: id,
              question: faq.question,
              answer: faq.answer,
              sort_order: index,
            })
          );

          const { error } = await supabase
            .from("blog_faqs")
            .insert(faqPayload);

          if (error) throw error;
        }

        await supabase
          .from("blog_related_posts")
          .delete()
          .eq("post_id", id);

        if (related.length > 0) {
          const relatedPayload = related.map(
            (relatedId) => ({
              post_id: id,
              related_post_id: relatedId,
            })
          );

          const { error } = await supabase
            .from("blog_related_posts")
            .insert(relatedPayload);

          if (error) throw error;
        }
      }

      navigate({
        to: "/admin/blog",
      });
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar artigo"
      );
    } finally {
      setSaving(false);
    }
  }

  const TABS: {
    id: Tab;
    label: string;
  }[] = [
    {
      id: "content",
      label: "Conteúdo",
    },
    {
      id: "seo",
      label: "SEO",
    },
    {
      id: "geo",
      label: "GEO",
    },
    {
      id: "faq",
      label: `FAQ (${faqs.length})`,
    },
    {
      id: "related",
      label: `Relacionados (${related.length})`,
    },
    {
      id: "quality",
      label: "Qualidade",
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="sticky top-0 z-10 -mx-5 flex overflow-x-auto border-b border-border bg-paper px-5 lg:-mx-8 lg:px-8">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition ${
              tab === item.id
                ? "border-petrol text-petrol"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <Section>
          <Field label="Título" required>
            <input
              value={values.title}
              onChange={(e) => {
                setField("title", e.target.value);

                if (!postId) {
                  setField(
                    "slug",
                    slugify(e.target.value)
                  );
                }
              }}
              className={inputCls}
            />
          </Field>

          <Field label="Slug">
            <input
              value={values.slug}
              onChange={(e) =>
                setField(
                  "slug",
                  slugify(e.target.value)
                )
              }
              className={inputCls}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Categoria">
              <select
                value={values.category_id}
                onChange={(e) =>
                  setField(
                    "category_id",
                    e.target.value
                  )
                }
                className={inputCls}
              >
                <option value="">—</option>

                {cats.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Autor">
              <select
                value={values.author_id}
                onChange={(e) =>
                  setField(
                    "author_id",
                    e.target.value
                  )
                }
                className={inputCls}
              >
                <option value="">—</option>

                {authors.map((author) => (
                  <option
                    key={author.id}
                    value={author.id}
                  >
                    {author.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Revisor técnico">
              <input
                value={values.reviewer_name}
                onChange={(e) =>
                  setField(
                    "reviewer_name",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Credenciais do revisor">
              <input
                value={values.reviewer_credentials}
                onChange={(e) =>
                  setField(
                    "reviewer_credentials",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Imagem destacada">
            {values.featured_image_url && (
              <img
                src={values.featured_image_url}
                alt="Imagem destacada"
                className="mb-3 h-40 w-full max-w-md rounded-lg object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (file) {
                  uploadImage(file);
                }
              }}
              className="text-sm"
            />

            {uploading && (
              <p className="mt-2 text-xs text-muted-foreground">
                Enviando imagem...
              </p>
            )}

            <input
              value={values.featured_image_url}
              onChange={(e) =>
                setField(
                  "featured_image_url",
                  e.target.value
                )
              }
              placeholder="Ou URL da imagem"
              className={`${inputCls} mt-2`}
            />
          </Field>

          <Field label="Resumo curto">
            <textarea
              value={values.excerpt}
              onChange={(e) =>
                setField(
                  "excerpt",
                  e.target.value
                )
              }
              rows={3}
              className={inputCls}
            />
          </Field>

          <Field label="Conteúdo (Markdown)">
            <MarkdownEditor
              value={values.content}
              onChange={(value) =>
                setField("content", value)
              }
              showPreview={showPreview}
              onTogglePreview={setShowPreview}
            />
          </Field>

          <Field label="CTA do artigo">
            <div className="mb-2 flex flex-wrap gap-2">
              {CTA_PRESETS.map((cta) => (
                <button
                  key={cta.label}
                  type="button"
                  onClick={() => {
                    setField(
                      "cta_label",
                      cta.label
                    );

                    setField(
                      "cta_url",
                      cta.url
                    );
                  }}
                  className="rounded-full border border-border bg-white px-3 py-1 text-xs text-foreground/80 transition hover:border-petrol hover:text-petrol"
                >
                  {cta.label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={values.cta_label}
                onChange={(e) =>
                  setField(
                    "cta_label",
                    e.target.value
                  )
                }
                placeholder="Texto do botão"
                className={inputCls}
              />

              <input
                value={values.cta_url}
                onChange={(e) =>
                  setField(
                    "cta_url",
                    e.target.value
                  )
                }
                placeholder="/contato"
                className={inputCls}
              />
            </div>
          </Field>
        </Section>
      )}

      {tab === "seo" && (
        <Section>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={`Meta title (${values.meta_title.length}/60)`}
            >
              <input
                value={values.meta_title}
                onChange={(e) =>
                  setField(
                    "meta_title",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Canonical URL">
              <input
                value={values.canonical_url}
                onChange={(e) =>
                  setField(
                    "canonical_url",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>
          </div>

          <Field
            label={`Meta description (${values.meta_description.length}/160)`}
          >
            <textarea
              value={values.meta_description}
              onChange={(e) =>
                setField(
                  "meta_description",
                  e.target.value
                )
              }
              rows={2}
              className={inputCls}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Palavra-chave principal">
              <input
                value={values.primary_keyword}
                onChange={(e) =>
                  setField(
                    "primary_keyword",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Palavras-chave secundárias">
              <input
                value={values.secondary_keywords}
                onChange={(e) =>
                  setField(
                    "secondary_keywords",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Data de publicação">
              <input
                type="datetime-local"
                value={values.published_at}
                onChange={(e) =>
                  setField(
                    "published_at",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Tempo de leitura">
              <input
                type="number"
                min={1}
                value={values.reading_time}
                onChange={(e) =>
                  setField(
                    "reading_time",
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Status">
              <select
                value={values.status}
                onChange={(e) =>
                  setField(
                    "status",
                    e.target.value as PostStatus
                  )
                }
                className={inputCls}
              >
                <option value="draft">
                  Rascunho
                </option>

                <option value="published">
                  Publicado
                </option>

                <option value="archived">
                  Arquivado
                </option>
              </select>
            </Field>
          </div>
        </Section>
      )}

      {tab === "geo" && (
        <Section>
          <Field
            label={`Resposta direta GEO (${geoWordCount} palavras — ideal 40–60)`}
          >
            <textarea
              value={values.direct_answer}
              onChange={(e) =>
                setField(
                  "direct_answer",
                  e.target.value
                )
              }
              rows={4}
              className={inputCls}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Entidades citadas">
              <input
                value={values.geo_entities}
                onChange={(e) =>
                  setField(
                    "geo_entities",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Serviços relacionados">
              <input
                value={values.geo_services}
                onChange={(e) =>
                  setField(
                    "geo_services",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Localidade">
              <input
                value={values.geo_locality}
                onChange={(e) =>
                  setField(
                    "geo_locality",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Perguntas respondidas">
            <textarea
              value={values.geo_questions}
              onChange={(e) =>
                setField(
                  "geo_questions",
                  e.target.value
                )
              }
              rows={5}
              className={inputCls}
            />
          </Field>
        </Section>
      )}

      {tab === "faq" && (
        <Section>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-paper/50 p-3"
              >
                <input
                  value={faq.question}
                  onChange={(e) =>
                    setFaqs((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? {
                              ...item,
                              question:
                                e.target.value,
                            }
                          : item
                      )
                    )
                  }
                  placeholder="Pergunta"
                  className={`${inputCls} mb-2`}
                />

                <textarea
                  value={faq.answer}
                  onChange={(e) =>
                    setFaqs((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? {
                              ...item,
                              answer:
                                e.target.value,
                            }
                          : item
                      )
                    )
                  }
                  placeholder="Resposta"
                  rows={3}
                  className={inputCls}
                />

                <button
                  type="button"
                  onClick={() =>
                    setFaqs((prev) =>
                      prev.filter(
                        (_, i) => i !== index
                      )
                    )
                  }
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Remover
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setFaqs((prev) => [
                  ...prev,
                  {
                    question: "",
                    answer: "",
                  },
                ])
              }
              className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold"
            >
              + Adicionar FAQ
            </button>
          </div>
        </Section>
      )}

      {tab === "related" && (
        <Section>
          <RelatedPostsPicker
            currentPostId={postId}
            value={related}
            onChange={setRelated}
          />
        </Section>
      )}

      {tab === "quality" && (
        <QualityChecklist
          values={values}
          faqs={faqs}
        />
      )}

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-white/95 px-1 py-4 backdrop-blur">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-full border border-border bg-white px-5 py-2.5 text-sm"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={save}
          disabled={saving || !values.title}
          className="rounded-full bg-petrol px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-petrol-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}

function Section({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-white p-6">
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-foreground/80">
        {label}

        {required && (
          <span className="text-red-500">
            {" "}
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}
