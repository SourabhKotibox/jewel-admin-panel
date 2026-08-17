import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import CmsCustomBlock from "../components/CmsCustomBlock";
import { api, assetUrl } from "../api/client";
import useCmsPage from "../hooks/useCmsPage";
import SeoHead from "../components/SeoHead";

function normalize(p) {
  return {
    ...p,
    id: p.sku || p.id || String(p._id),
    slug: p.slug || p.sku,
    images: (p.images || []).map((img) => assetUrl(img)).filter(Boolean),
  };
}

function matchesQuery(p, q) {
  if (!q) return true;
  const hay = [p.name, p.celeb, p.category, p.sku, p.id, p.slug, p.description, p.tag]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { fields: c, isHidden, customSections } = useCmsPage("search");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const path = query.trim()
          ? `/products?q=${encodeURIComponent(query.trim())}`
          : "/products";
        const rows = await api(path).catch(() => []);
        if (cancelled) return;
        setProducts((Array.isArray(rows) ? rows : []).map(normalize));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const results = useMemo(
    () => products.filter((p) => matchesQuery(p, query.trim())),
    [products, query]
  );

  const submitSearch = (e) => {
    e.preventDefault();
    const q = draft.trim();
    setSearchParams(q ? { q } : {});
  };

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead title={query ? `Search: ${query}` : "Search"} />
      <div className="container-luxe py-12 md:py-20">
        {!isHidden("header") && (
          <>
            <p className="eyebrow mb-2">{c.eyebrow}</p>
            <h1 className="heading-display text-3xl md:text-4xl text-noir mb-6">
              {query
                ? `${loading ? "…" : results.length} ${c.titlePrefix || "Results for"} “${query}”`
                : "Search creations"}
            </h1>
          </>
        )}

        <form onSubmit={submitSearch} className="mb-10 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <input
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search by name, celeb, category, SKU…"
            className="flex-1 border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
          />
          <button type="submit" className="btn-gold !py-3 !px-8">
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-sm text-noir/45 text-center py-16">Searching…</p>
        ) : results.length === 0 ? (
          !isHidden("empty") && (
            <div className="text-center py-16">
              <p className="heading-display text-2xl text-noir mb-2">{c.emptyTitle}</p>
              <p className="text-noir/60 mb-6">{c.emptySubtitle}</p>
              <Link to="/shop" className="link-underline text-sm">
                {c.browseCta || "Browse Collections"}
              </Link>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} image={product.images?.[0]} />
            ))}
          </div>
        )}
      </div>
      {customSections.map((s) => (
        <CmsCustomBlock key={s.id} data={s} />
      ))}
    </div>
  );
}
