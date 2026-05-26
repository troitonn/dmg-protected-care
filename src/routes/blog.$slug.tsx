import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/dmg/SiteLayout";
import { FinalCTA } from "@/components/dmg/sections";
import { supabase } from "@/integrations/supabase/client";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import { ArrowRight, ChevronRight, CalendarDays, Clock, User } from "lucide-react";

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
        <div className="mx-auto max-w-3xl px-5 py-24 text-center text-muted-foreground">Carregando…</div>
      </SiteLayout>
    );
  }

  const { post, faqs, related } = data;
  const html = renderMarkdown(post.content);
  const toc = extractHeadings(post.content);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <article className="bg-background">
        <header className="bg-paper py-12">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Início</Link><ChevronRight className="h-3 w-3" />
              <Link to="/blog" className="hover:text-foreground">Blog</Link>
              {post.blog_categories && (<><ChevronRight className="h-3 w-3" /><span>{post.blog_categories.name}</span></>)}
            </nav>
            {post.blog_categories && <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-wider text-primary">{post.blog_categories.name}</span>}
            <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-pretty text-lg text-muted-foreground">{post.excerpt}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {post.blog_authors && <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.blog_authors.name}</span>}
              {post.published_at && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {new Date(post.published_at).toLocaleDateString("pt-BR")}</span>}
              {post.reading_time && <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.reading_time} min</span>}
              {post.reviewer_name && <span>Revisado por {post.reviewer_name}{post.reviewer_credentials ? ` (${post.reviewer_credentials})` : ""}</span>}
            </div>
          </div>
        </header>

        {post.featured_image_url && (
          <div className="mx-auto max-w-4xl px-5 lg:px-8 -mt-2">
            <img src={post.featured_image_url} alt={post.title} className="aspect-[16/9] w-full rounded-2xl object-cover" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
          {post.direct_answer && (
            <aside className="mb-10 rounded-2xl border border-petrol/20 bg-secondary p-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Resposta direta</span>
              <p className="mt-2 text-base leading-relaxed text-foreground">{post.direct_answer}</p>
            </aside>
          )}

          {toc.length > 2 && (
            <nav className="mb-10 rounded-2xl border border-border bg-paper/60 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sumário</h2>
              <ul className="mt-3 space-y-1.5 text-sm">
                {toc.filter(h => h.level === 2).map((h) => (
                  <li key={h.id}><a href={`#${h.id}`} className="text-foreground hover:text-primary">{h.text}</a></li>
                ))}
              </ul>
            </nav>
          )}

          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-strong:text-foreground" dangerouslySetInnerHTML={{ __html: html }} />

          {(post.cta_label || post.cta_url) && (
            <div className="my-12 rounded-2xl border border-petrol/30 bg-petrol p-8 text-white">
              <p className="text-lg font-medium">Quer aplicar isso na sua empresa?</p>
              <Link to={post.cta_url || "/contato"} className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-soft px-5 py-3 text-sm font-semibold text-petrol-ink hover:bg-white">
                {post.cta_label || "Falar com consultor DMG"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">Perguntas frequentes</h2>
              <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white">
                {faqs.map((f, i) => (
                  <details key={i} className="group p-5">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold">
                      {f.question}<ChevronRight className="h-4 w-4 text-primary transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="text-2xl font-semibold">Conteúdos relacionados</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.id} to="/blog/$slug" params={{ slug: r.slug }} className="group rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-petrol/40">
                    {r.blog_categories && <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{r.blog_categories.name}</span>}
                    <h3 className="mt-1 text-base font-semibold leading-snug group-hover:text-primary">{r.title}</h3>
                    {r.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>}
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">Ler artigo <ArrowRight className="h-3.5 w-3.5" /></span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <FinalCTA />
    </SiteLayout>
  );
}
