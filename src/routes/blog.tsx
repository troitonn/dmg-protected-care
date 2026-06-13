import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/dmg/SiteLayout";
import { FinalCTA } from "@/components/dmg/sections";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog DMG | SST, medicina do trabalho, PCMSO, PGR, NR-1 e eSocial" },
      { name: "description", content: "Central de conhecimento DMG Ocupacional sobre PCMSO, PGR, NR-1, eSocial SST, laudos e proteção empresarial para empresas em Osasco e região." },
      { property: "og:title", content: "Blog DMG | Central de conhecimento em SST" },
      { property: "og:description", content: "Conteúdo técnico para RH, DP, jurídico e diretoria sobre SST e medicina do trabalho." },
      { property: "og:url", content: "https://dmg-protected-care.lovable.app/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://dmg-protected-care.lovable.app/blog" }],
  }),
  component: BlogIndex,
});

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; featured_image_url: string | null;
  reading_time: number | null; published_at: string | null;
  blog_categories: { name: string; slug: string } | null;
  blog_authors: { name: string } | null;
};

function BlogIndex() {
  const matches = useMatches();
  const isSlugActive = matches.some((m) => m.routeId === "/blog/$slug");

  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => {
    supabase.from("blog_categories").select("id,name,slug").order("name").then(({ data }) => setCats(data ?? []));
    (async () => {
      const { data } = await supabase.from("blog_posts")
        .select("id,title,slug,excerpt,featured_image_url,reading_time,published_at,blog_categories(name,slug),blog_authors(name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setPosts((data as unknown as Post[]) ?? []);
    })();
  }, []);

  const filtered = useMemo(() => posts.filter((p) =>
    (!cat || p.blog_categories?.slug === cat) &&
    (!q || p.title.toLowerCase().includes(q.toLowerCase()) || (p.excerpt ?? "").toLowerCase().includes(q.toLowerCase()))
  ), [posts, q, cat]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (isSlugActive) return <Outlet />;

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-radial-petrol py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-20" />
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-soft">Blog DMG</span>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">Central de conhecimento em SST, medicina do trabalho e proteção empresarial.</h1>
          <p className="mt-5 max-w-3xl text-pretty text-base text-white/80 sm:text-lg">Artigos técnicos sobre PCMSO, PGR, NR-1, eSocial SST, laudos e gestão de riscos — escritos para decisores empresariais.</p>
        </div>
      </section>

      <section className="bg-paper py-12">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar artigos…" className="flex-1 min-w-[200px] rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-petrol" />
            <button onClick={() => setCat("")} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${cat === "" ? "border-petrol bg-petrol text-white" : "border-border bg-white"}`}>Todas</button>
            {cats.map((c) => (
              <button key={c.id} onClick={() => setCat(c.slug)} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${cat === c.slug ? "border-petrol bg-petrol text-white" : "border-border bg-white"}`}>{c.name}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          {featured && (
            <Link to="/blog/$slug" params={{ slug: featured.slug }} className="group mb-10 grid gap-6 overflow-hidden rounded-3xl border border-border bg-white p-6 transition hover:border-petrol/40 md:grid-cols-[1.2fr,1fr]">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-sand">
                {featured.featured_image_url && <img src={featured.featured_image_url} alt={featured.title} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />}
              </div>
              <div className="flex flex-col justify-center">
                {featured.blog_categories && <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{featured.blog_categories.name}</span>}
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{featured.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{featured.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Ler artigo <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:border-petrol/40">
                <div className="aspect-[16/10] overflow-hidden bg-sand">
                  {p.featured_image_url && <img src={p.featured_image_url} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-[1.03]" />}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {p.blog_categories && <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{p.blog_categories.name}</span>}
                  <h3 className="mt-2 text-base font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{p.blog_authors?.name ?? "DMG"}</span>
                    <span>{p.reading_time ? `${p.reading_time} min` : ""}{p.published_at ? ` • ${new Date(p.published_at).toLocaleDateString("pt-BR")}` : ""}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && <p className="py-16 text-center text-muted-foreground">Nenhum artigo encontrado.</p>}
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
}
