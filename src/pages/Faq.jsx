import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "../api/client";
import SeoHead from "../components/SeoHead";

function AnswerBody({ html }) {
  const raw = String(html || "");
  const looksHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  if (looksHtml) {
    return <div className="faq-answer" dangerouslySetInnerHTML={{ __html: raw }} />;
  }
  return <p>{raw}</p>;
}

export default function FaqPage() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/faqs")
      .then((list) => {
        const published = (Array.isArray(list) ? list : []).filter(
          (f) => f.status === "Published" || !f.status
        );
        setRows(published);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-ivory min-h-screen py-12 md:py-16">
      <SeoHead
        title="FAQs"
        description="Answers about Madhu jewellery shipping, diamond certification, custom bridal sets, care, and store visits."
        keywords="Madhu jewellery FAQ, shipping, SGL certified diamonds, custom bridal jewellery, BIS hallmark"
      />

      <div className="container-luxe max-w-3xl">
        <p className="eyebrow mb-2">Help</p>
        <h1 className="heading-display text-4xl text-noir mb-3">Frequently asked questions</h1>
        <p className="text-sm text-noir/55 mb-10">
          Answers from our boutique team. Still need help?{" "}
          <a href="/contact" className="text-champagne-dark underline">
            Contact us
          </a>
          .
        </p>

        {loading ? (
          <p className="text-sm text-noir/45">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-noir/45">No FAQs published yet.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((f, i) => {
              const id = f.id || f._id || i;
              const isOpen = open === id;
              return (
                <li key={id} className="border border-champagne/20 bg-white">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpen(isOpen ? null : id)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-noir text-sm md:text-base">{f.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-champagne-dark transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="px-5 pb-5 text-sm text-noir/65 leading-relaxed border-t border-champagne/10 pt-3">
                      <AnswerBody html={f.a} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
