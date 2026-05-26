import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/dmg/SiteLayout";
import { FinalCTA } from "@/components/dmg/sections";
import { supabase } from "@/integrations/supabase/client";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import { ArrowRight, ChevronRight, CalendarDays, Clock, User, BookOpen, Plus } from "lucide-react";

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; direct_answer: string | null;
  content: string; featured_image_url: string | null; reading_time: number | null;
  published_at: string | null; updated_at: string | null;
  meta_title: string | null; meta_description: string | null; canonical_url: string | null;
  cta_label: string | null; cta_url: string | null;
  reviewer_name: string | null; reviewer_credentials: string | null;
  blog_categories: { name: string; slug: string } | null;
  blog_authors: { name: string; role: string | null; avatar_url: string | null } | null;
};
type Faq = { question: string; answer: string };

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*,blog_categories(name,slug),blog_authors(name,role,avatar_url)")
      .eq("slug", params.slug)
      .eq("status", "published")
      .maybeSingle();
    if (!data) throw notFound();
    const { data: faqs } = await supabase.from("blog_faqs").select("question,answer").eq("post_id", data.id).order("sort_order");
    return { post: data as unknown as Post, faqs: (faqs ?? []) as Faq[] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Artigo | DMG" }] };
    const { post } = loaderData;
    const title = post.meta_title || `${post.title} | DMG Ocupacional`;
    const desc = post.meta_description || post.excerpt || "";
    const img = post.featured_image_url || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: post.canonical_url || `/blog/${post.slug}` }],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-3xl font-semibold">Artigo não encontrado</h1>
        <Link to="/blog" className="mt-6 inline-flex rounded-full bg-petrol px-5 py-2.5 text-sm font-semibold text-white">Voltar ao blog</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-2xl font-semibold">Não foi possível carregar este artigo</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: PostPage,
});

type RelatedPost = { id: string; title: string; slug: string; excerpt: string | null; featured_image_url: string | null; blog_categories: { name: string } | null };

function PostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const [data, setData] = useState<{ post: Post; faqs: Faq[]; related: RelatedPost[] } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data: post } = await supabase.from("blog_posts").select("*,blog_categories(name,slug),blog_authors(name,role,avatar_url)").eq("slug", slug).eq("status", "published").maybeSingle();
      if (!post) return;
      const [{ data: faqs }, { data: rel }] = await Promise.all([
        supabase.from("blog_faqs").select("question,answer").eq("post_id", post.id).order("sort_order"),
        supabase.from("blog_related_posts").select("related_post_id").eq("post_id", post.id),
      ]);
      let related: RelatedPost[] = [];
      const ids = (rel ?? []).map((r) => r.related_post_id);
      if (ids.length) {
        const { data: rp } = await supabase.from("blog_posts").select("id,title,slug,excerpt,featured_image_url,blog_categories(name)").in("id", ids).eq("status", "published");
        related = (rp as unknown as RelatedPost[]) ?? [];
      }
      setData({ post: post as unknown as Post, faqs: (faqs ?? []) as Faq[], related });
    })();
  }, [slug]);

  if (!data) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-petrol border-t-transparent" />
            <p className="text-sm text-muted-foreground">Carregando artigo…</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const { post, faqs, related } = data;
  const html = renderMarkdown(post.content);
  const toc = extractHeadings(post.content);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const articleSchema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt || "",
    image: post.featured_image_url ? [post.featured_image_url] : undefined,
    author: post.blog_authors ? { "@type": "Person", name: post.blog_authors.name } : { "@type": "Organization", name: "DMG Ocupacional" },
    publisher: { "@type": "Organization", name: "DMG Ocupacional", logo: { "@type": "ImageObject", url: `${baseUrl}/favicon.ico` } },
    datePublished: post.published_at, dateModified: post.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` },
  };
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  } : null;
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      ...(post.blog_categories ? [{ "@type": "ListItem", position: 3, name: post.blog_categories.name, item: `${baseUrl}/blog?cat=${post.blog_categories.slug}` }] : []),
      { "@type": "ListItem", position: post.blog_categories ? 4 : 3, name: post.title, item: `${baseUrl}/blog/${post.slug}` },
    ],
  };

  const tocItems = toc.filter(h => h.level === 2);

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* ── HERO HEADER ── */}
      <header className="relative overflow-hidden bg-petrol pb-0 pt-12 text-white">
        {/* subtle grid texture */}
        <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-10" />
        {/* bottom fade into white */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
            <Link to="/" className="transition hover:text-white/80">Início</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="transition hover:text-white/80">Blog</Link>
            {post.blog_categories && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white/70">{post.blog_categories.name}</span>
              </>
            )}
          </nav>

          {/* Category pill */}
          {post.blog_categories && (
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-teal-soft/30 bg-teal-soft/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-soft">
              {post.blog_categories.name}
            </span>
          )}

          {/* Title */}
          <h1 className="mt-2 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 pb-16 text-xs text-white/50">
            {post.blog_authors && (
              <span className="flex items-center gap-2">
                {post.blog_authors.avatar_url ? (
                  <img src={post.blog_authors.avatar_url} alt={post.blog_authors.name} className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <User className="h-3 w-3" />
                  </span>
                )}
                <span className="font-medium text-white/70">{post.blog_authors.name}</span>
                {post.blog_authors.role && <span className="text-white/40">· {post.blog_authors.role}</span>}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(post.published_at).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.reading_time} min de leitura
              </span>
            )}
            {post.reviewer_name && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">
                Revisado por {post.reviewer_name}{post.reviewer_credentials ? ` · ${post.reviewer_credentials}` : ""}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── FEATURED IMAGE ── */}
      {post.featured_image_url && (
        <div className="mx-auto max-w-5xl px-5 lg:px-8 -mt-8">
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="aspect-[21/9] w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ── BODY: sidebar layout on desktop ── */}
      <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
        <div className={`gap-12 lg:grid ${tocItems.length > 2 ? "lg:grid-cols-[1fr_260px]" : ""}`}>

          {/* ── MAIN CONTENT ── */}
          <div className="min-w-0">

            {/* Direct answer callout */}
            {post.direct_answer && (
              <aside className="mb-10 overflow-hidden rounded-2xl border border-petrol/15 bg-gradient-to-br from-petrol/5 to-teal-soft/5">
                <div className="border-b border-petrol/10 bg-petrol/5 px-5 py-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-petrol">Resposta direta</span>
                </div>
                <p className="px-5 py-4 text-base leading-relaxed text-foreground">{post.direct_answer}</p>
              </aside>
            )}

            {/* TOC — mobile only */}
            {tocItems.length > 2 && (
              <nav className="mb-10 rounded-2xl border border-border bg-paper p-5 lg:hidden">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" /> Neste artigo
                </div>
                <ol className="space-y-2">
                  {tocItems.map((h, i) => (
                    <li key={h.id} className="flex items-baseline gap-2.5 text-sm">
                      <span className="shrink-0 tabular-nums text-[11px] font-semibold text-petrol/40">{String(i + 1).padStart(2, "0")}</span>
                      <a href={`#${h.id}`} className="text-foreground/70 transition hover:text-petrol">{h.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Article prose */}
            <div
              className="prose prose-slate max-w-none
                prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight
                prose-h2:mt-12 prose-h2:text-2xl prose-h2:text-foreground
                prose-h3:mt-8 prose-h3:text-xl prose-h3:text-foreground
                prose-p:leading-relaxed prose-p:text-foreground/80
                prose-a:text-petrol prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-blockquote:border-l-petrol prose-blockquote:bg-petrol/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic
                prose-code:text-petrol prose-code:bg-petrol/5 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em]
                prose-pre:rounded-2xl prose-pre:border prose-pre:border-border
                prose-img:rounded-2xl prose-img:shadow-md
                prose-hr:border-border"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* CTA block */}
            {(post.cta_label || post.cta_url) && (
              <div className="my-14 overflow-hidden rounded-2xl bg-petrol">
                <div className="relative px-8 py-10">
                  <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-10" />
                  <p className="relative text-xs font-semibold uppercase tracking-wider text-teal-soft/70">Próximo passo</p>
                  <p className="relative mt-2 text-xl font-semibold text-white">Quer aplicar isso na sua empresa?</p>
                  <p className="relative mt-1.5 text-sm text-white/60">Nossa equipe pode te ajudar a implementar de forma prática.</p>
                  <Link
                    to={post.cta_url || "/contato"}
                    className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-teal-soft px-6 py-3 text-sm font-semibold text-petrol transition hover:bg-white"
                  >
                    {post.cta_label || "Falar com consultor DMG"} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
              <section className="mt-14">
                <h2 className="text-xl font-semibold tracking-tight">Perguntas frequentes</h2>
                <div className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
                  {faqs.map((f, i) => (
                    <div key={i}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground transition hover:bg-paper/60"
                      >
                        <span>{f.question}</span>
                        <Plus className={`mt-0.5 h-4 w-4 shrink-0 text-petrol transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`} />
                      </button>
                      {openFaq === i && (
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related posts */}
            {related.length > 0 && (
              <section className="mt-16 border-t border-border pt-12">
                <h2 className="text-xl font-semibold tracking-tight">Conteúdos relacionados</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to="/blog/$slug"
                      params={{ slug: r.slug }}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-white transition hover:border-petrol/30 hover:shadow-md"
                    >
                      {r.featured_image_url && (
                        <div className="aspect-[16/7] overflow-hidden bg-sand">
                          <img src={r.featured_image_url} alt={r.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                        </div>
                      )}
                      <div className="p-4">
                        {r.blog_categories && <span className="text-[10px] font-semibold uppercase tracking-wider text-petrol">{r.blog_categories.name}</span>}
                        <h3 className="mt-1 text-sm font-semibold leading-snug text-foreground group-hover:text-petrol">{r.title}</h3>
                        {r.excerpt && <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{r.excerpt}</p>}
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-petrol">
                          Ler artigo <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── SIDEBAR TOC — desktop only ── */}
          {tocItems.length > 2 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="rounded-2xl border border-border bg-paper p-5">
                  <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" /> Neste artigo
                  </div>
                  <ol className="space-y-2.5">
                    {tocItems.map((h, i) => (
                      <li key={h.id} className="flex items-baseline gap-2.5">
                        <span className="shrink-0 tabular-nums text-[11px] font-semibold text-petrol/30">{String(i + 1).padStart(2, "0")}</span>
                        <a href={`#${h.id}`} className="text-sm text-foreground/60 transition hover:text-petrol leading-snug">{h.text}</a>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Sticky author card */}
                {post.blog_authors && (
                  <div className="mt-4 rounded-2xl border border-border bg-white p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Autor</p>
                    <div className="mt-3 flex items-center gap-3">
                      {post.blog_authors.avatar_url ? (
                        <img src={post.blog_authors.avatar_url} alt={post.blog_authors.name} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-petrol/10">
                          <User className="h-4 w-4 text-petrol" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground">{post.blog_authors.name}</p>
                        {post.blog_authors.role && <p className="text-xs text-muted-foreground">{post.blog_authors.role}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}

        </div>
      </div>

      <FinalCTA />
    </SiteLayout>
  );
}
