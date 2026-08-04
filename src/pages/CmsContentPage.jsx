import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import SeoHead from "../components/SeoHead";

function looksHtml(s) {
  return /<\/?[a-z][\s\S]*>/i.test(String(s || ""));
}

export default function CmsContentPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let row = null;
        try {
          row = await api(`/cms-pages/${encodeURIComponent(slug)}`);
        } catch {
          const list = await api("/cms-pages");
          row = (Array.isArray(list) ? list : []).find((p) => p.slug === slug);
        }
        if (!cancelled) {
          if (!row || (row.status && row.status !== "Published")) {
            setError("Page not found");
            setPage(null);
          } else {
            setPage(row);
            setError("");
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load page");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <div className="container-luxe py-20 text-sm text-noir/45">Loading…</div>;
  }

  if (error || !page) {
    return (
      <div className="container-luxe py-20 text-center">
        <p className="font-display text-2xl text-noir mb-4">{error || "Not found"}</p>
        <Link to="/" className="text-champagne-dark underline text-sm">
          Back home
        </Link>
      </div>
    );
  }

  const body = String(page.body || "");

  return (
    <div className="bg-ivory min-h-screen py-12 md:py-16">
      <SeoHead
        title={page.metaTitle || page.title}
        description={page.metaDescription || ""}
        keywords={page.metaKeywords || ""}
      />
      <article className="container-luxe max-w-3xl">
        <p className="eyebrow mb-2">Info</p>
        <h1 className="heading-display text-4xl text-noir mb-8">{page.title}</h1>
        {looksHtml(body) ? (
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          <div className="blog-prose whitespace-pre-wrap">
            {body.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
