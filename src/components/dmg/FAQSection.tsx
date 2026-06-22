import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    q: "Toda empresa precisa de PCMSO e PGR?",
    a: "Sim. Toda empresa com empregados CLT precisa manter PCMSO e PGR, exceto exceções específicas previstas em norma."
  },
  {
    q: "O que acontece se eu não enviar os eventos do eSocial SST?",
    a: "A empresa fica exposta a multas, inconsistências cadastrais e perda de defesa em ações trabalhistas e previdenciárias."
  },
  {
    q: "Como funciona a adequação à NR-1?",
    a: "Diagnóstico psicossocial, integração ao PGR, plano de ação documentado e treinamento das lideranças."
  },
  {
    q: "A DMG atende fora de Osasco-SP?",
    a: "Sim. A DMG possui matriz em Osasco-SP, na Clínica DIMEG, e atende empresas em Itapevi, Cajamar, Carapicuíba e cidades próximas, inclusive com modelo in company quando adequado."
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-4xl mx-auto px-4">

        <div className="text-center mb-12">
          <span className="text-primary font-semibold">
            FAQ
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Perguntas frequentes
          </h2>

          <p className="text-muted-foreground mt-4">
            Tire suas dúvidas sobre medicina ocupacional,
            eSocial SST, PCMSO, PGR e adequação à NR-1.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={faq.q}
              className="border rounded-xl bg-background"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-semibold">
                  {faq.q}
                </span>

                <ChevronDown
                  className={`transition-transform ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="px-6 pb-6 text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FAQS };
