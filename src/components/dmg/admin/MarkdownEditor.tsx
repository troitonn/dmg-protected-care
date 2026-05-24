import { useRef } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { Bold, Heading2, Heading3, Link as LinkIcon, List, ListOrdered, Quote, Minus, AlertCircle, CheckSquare, Table as TableIcon, MousePointerClick } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  showPreview: boolean;
  onTogglePreview: (v: boolean) => void;
};

type Tool = {
  label: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  apply: (sel: string) => { insert: string; selectOffset?: number };
};

const TOOLS: Tool[] = [
  { label: "H2", title: "Título H2", icon: Heading2, apply: (s) => ({ insert: `\n## ${s || "Título"}\n` }) },
  { label: "H3", title: "Título H3", icon: Heading3, apply: (s) => ({ insert: `\n### ${s || "Subtítulo"}\n` }) },
  { label: "B", title: "Negrito", icon: Bold, apply: (s) => ({ insert: `**${s || "texto"}**` }) },
  { label: "•", title: "Lista", icon: List, apply: (s) => ({ insert: `\n- ${s || "item"}\n- item\n- item\n` }) },
  { label: "1.", title: "Lista numerada", icon: ListOrdered, apply: (s) => ({ insert: `\n1. ${s || "item"}\n2. item\n3. item\n` }) },
  { label: "Link", title: "Link", icon: LinkIcon, apply: (s) => ({ insert: `[${s || "texto do link"}](https://)` }) },
  { label: '"', title: "Citação", icon: Quote, apply: (s) => ({ insert: `\n> ${s || "Citação importante"}\n` }) },
  { label: "!", title: "Bloco de alerta", icon: AlertCircle, apply: (s) => ({ insert: `\n> **Atenção:** ${s || "informação importante para empresas."}\n` }) },
  { label: "☑", title: "Checklist", icon: CheckSquare, apply: (s) => ({ insert: `\n- [ ] ${s || "ação obrigatória"}\n- [ ] próxima ação\n- [ ] verificação final\n` }) },
  { label: "—", title: "Separador", icon: Minus, apply: () => ({ insert: `\n\n---\n\n` }) },
  { label: "CTA", title: "CTA interno", icon: MousePointerClick, apply: (s) => ({ insert: `\n\n> 💬 **${s || "Fale com um consultor DMG"}** — [Solicitar diagnóstico SST](/contato)\n\n` }) },
  { label: "Tab", title: "Tabela", icon: TableIcon, apply: () => ({ insert: `\n| Item | Descrição |\n| --- | --- |\n| Linha 1 | conteúdo |\n| Linha 2 | conteúdo |\n` }) },
];

export function MarkdownEditor({ value, onChange, showPreview, onTogglePreview }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(tool: Tool) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end);
    const { insert } = tool.apply(sel);
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-paper/60 px-2 py-1.5">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.title}
              type="button"
              onClick={() => apply(t)}
              title={t.title}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-foreground/70 hover:bg-white hover:text-petrol"
            >
              <Icon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={() => onTogglePreview(false)} className={`rounded-md px-2 py-1 text-xs ${!showPreview ? "bg-petrol text-white" : "text-foreground/70 hover:bg-white"}`}>Editar</button>
          <button type="button" onClick={() => onTogglePreview(true)} className={`rounded-md px-2 py-1 text-xs ${showPreview ? "bg-petrol text-white" : "text-foreground/70 hover:bg-white"}`}>Preview</button>
        </div>
      </div>

      {showPreview ? (
        <div className="prose prose-slate max-w-none p-5" dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={20}
          className="w-full resize-y rounded-b-xl border-0 bg-white px-4 py-3 font-mono text-[13px] leading-relaxed outline-none"
          placeholder="Escreva o conteúdo em Markdown. Use a barra acima para inserir blocos."
        />
      )}
    </div>
  );
}
