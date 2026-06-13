import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://dmg-protected-care.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/", "/medicina-do-trabalho", "/pcmso", "/pgr", "/laudos", "/esocial-sst",
          "/nr-1-riscos-psicossociais", "/treinamentos-nr", "/protecao-empresarial-sst",
          "/franca-sp", "/sobre", "/contato", "/blog", "/casos", "/perguntas-frequentes",
        ];

        let posts: { slug: string; updated_at: string }[] = [];
        let cats: { slug: string }[] = [];
        try {
          const [p, c] = await Promise.all([
            supabaseAdmin.from("blog_posts").select("slug,updated_at").eq("status", "published"),
            supabaseAdmin.from("blog_categories").select("slug"),
          ]);
          posts = (p.data ?? []) as typeof posts;
          cats = (c.data ?? []) as typeof cats;
        } catch (e) {
          console.error("sitemap fetch failed", e);
        }

        const urls: string[] = [];
        for (const path of staticPaths) {
          urls.push(`  <url><loc>${BASE_URL}${path}</loc><changefreq>weekly</changefreq></url>`);
        }
        for (const c of cats) {
          urls.push(`  <url><loc>${BASE_URL}/blog?cat=${c.slug}</loc><changefreq>weekly</changefreq></url>`);
        }
        for (const p of posts) {
          urls.push(`  <url><loc>${BASE_URL}/blog/${p.slug}</loc><lastmod>${p.updated_at}</lastmod><changefreq>monthly</changefreq></url>`);
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
