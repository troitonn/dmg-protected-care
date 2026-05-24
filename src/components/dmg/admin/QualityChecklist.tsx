import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { PostFormValues, FaqItem } from "./PostForm";

type Check = { label: string; status: "ok" | "warn" | "fail" };

export function QualityChecklist({ values, faqs }: { values: PostFormValues; faqs: FaqItem[] }) {
  const wc = values.direct_answer.trim().split(/\s+/).filter(Boolean).length;
  const mtLen = values.meta_title.length;
  const mdLen = values.meta_description.length;
  const h2Count = (values.content.match(/^##\s+/gm) ?? []).length;

  const seo: Check[] = [
    { label: "Meta title preenchido", status: values.meta_title ? "ok" : "fail" },
    { label: `Meta title 50–60 chars (${mtLen})`, status: mtLen >= 50 && mtLen <= 60 ? "ok" : mtLen ? "warn" : "fail" },
    { label: "Meta description preenchida", status: values.meta_description ? "ok" : "fail" },
    { label: `Meta description 140–160 chars (${mdLen})`, status: mdLen >= 140 && mdLen <= 160 ? "ok" : mdLen ? "warn" : "fail" },
    { label: "Slug definido", status: values.slug ? "ok" : "fail" },
    { label: "Palavra-chave principal", status: values.primary_keyword ? "ok" : "warn" },
    { label: "Imagem destacada", status: values.featured_image_url ? "ok" : "warn" },
    { label: "FAQ cadastrada", status: faqs.length > 0 ? "ok" : "warn" },
    { label: `Conteúdo com ≥ 2 H2 (${h2Count})`, status: h2Count >= 2 ? "ok" : "warn" },
  ];

  const geo: Check[] = [
    { label: "Resposta direta preenchida", status: values.direct_answer ? "ok" : "fail" },
    { label: `Resposta direta 40–60 palavras (${wc})`, status: wc >= 40 && wc <= 60 ? "ok" : wc ? "warn" : "fail" },
    { label: "Perguntas GEO listadas", status: values.geo_questions.trim() ? "ok" : "warn" },
    { label: "Serviços relacionados", status: values.geo_services.trim() ? "ok" : "warn" },
    { label: "Localidade definida", status: values.geo_locality.trim() ? "ok" : "warn" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel title="Qualidade SEO" items={seo} />
      <Panel title="Qualidade GEO" items={geo} />
    </div>
  );
}

function Panel({ title, items }: { title: string; items: Check[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2 text-sm">
            {i.status === "ok" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            {i.status === "warn" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
            {i.status === "fail" && <XCircle className="h-4 w-4 text-red-500" />}
            <span className={i.status === "ok" ? "text-foreground" : "text-foreground/80"}>{i.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
