import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import SeoHead from "../components/SeoHead";
import { api, assetUrl } from "../api/client";
import { formatPrice } from "../data";

function normalizeProduct(p) {
  return {
    ...p,
    id: p.sku || p.id || String(p._id),
    slug: p.slug || p.sku,
    images: (p.images || []).map((img) => assetUrl(img)).filter(Boolean),
  };
}

const FALLBACK_CATEGORIES = [
  "All",
  "Necklaces",
  "Earrings",
  "Rings",
  "Diamond Rings",
  "Polki Rings",
  "Gold Rings",
  "Bracelets",
  "Bangles",
  "Pendants",
  "Accessories",
  "Sets",
];

const PARENT_NAMES = new Set([
  "Necklaces",
  "Earrings",
  "Rings",
  "Bracelets",
  "Bangles",
  "Pendants",
  "Accessories",
  "Sets",
  "Chokers",
  "Jhumkas",
  "Chandbalis",
]);

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
];

export default function ShopFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const category = searchParams.get("category") || "All";
  const q = searchParams.get("q") || "";
  const sortBy = searchParams.get("sort") || "featured";
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";
  const polki = searchParams.get("polki") === "1";
  const diamond = searchParams.get("diamond") === "1";
  const bridal = searchParams.get("bridal") === "1";
  const inStock = searchParams.get("stock") === "1";

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value == null || value === false || value === "All") next.delete(key);
    else next.set(key, String(value === true ? "1" : value));
    setSearchParams(next);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meta = await api("/catalog/meta");
        if (cancelled || !meta?.categories?.length) return;
        const parents = meta.categories.filter((c) => !c.parentId);
        const kids = meta.categories.filter((c) => c.parentId);
        const ordered = ["All"];
        for (const p of parents) {
          ordered.push(p.name);
          kids
            .filter((k) => k.parentId === p.id)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .forEach((k) => ordered.push(k.name));
        }
        setCategoryOptions(ordered);
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category && category !== "All") params.set("category", category);
        if (polki) params.set("isPolki", "1");
        if (diamond) params.set("isDiamond", "1");
        if (bridal) params.set("isBridal", "1");
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        const rows = await api(`/products?${params.toString()}`);
        if (!cancelled) setProducts((Array.isArray(rows) ? rows : []).map(normalizeProduct));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, q, polki, diamond, bridal, minPrice, maxPrice]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (inStock) list = list.filter((p) => Number(p.stock) > 0 && p.status !== "Out of Stock");
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") {
      list.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    }
    return list;
  }, [products, sortBy, inStock]);

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.map((p) => Number(p.price) || 0);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const clearAll = () => setSearchParams({});

  const Filters = (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-3">Category</p>
        <ul className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
          {categoryOptions.map((cat) => {
            const indent = cat !== "All" && !PARENT_NAMES.has(cat);
            return (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => setParam("category", cat)}
                  className={`text-sm w-full text-left py-1 transition-colors ${
                    indent ? "pl-3 text-[13px]" : ""
                  } ${
                    category === cat
                      ? "text-champagne-dark font-medium"
                      : "text-noir/65 hover:text-noir"
                  }`}
                >
                  {cat}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-3">Type</p>
        <div className="space-y-2">
          {[
            ["polki", polki, "Polki"],
            ["diamond", diamond, "Diamond"],
            ["bridal", bridal, "Bridal"],
            ["stock", inStock, "In stock only"],
          ].map(([key, on, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-noir/70 cursor-pointer">
              <input
                type="checkbox"
                checked={on}
                onChange={(e) => setParam(key, e.target.checked)}
                className="accent-champagne"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-3">Price (INR)</p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder={priceBounds.min ? String(priceBounds.min) : "Min"}
            value={minPrice}
            onChange={(e) => setParam("min", e.target.value)}
            className="w-full border border-champagne/25 bg-white px-3 py-2 text-sm outline-none focus:border-champagne"
          />
          <span className="text-noir/30">–</span>
          <input
            type="number"
            placeholder={priceBounds.max ? String(priceBounds.max) : "Max"}
            value={maxPrice}
            onChange={(e) => setParam("max", e.target.value)}
            className="w-full border border-champagne/25 bg-white px-3 py-2 text-sm outline-none focus:border-champagne"
          />
        </div>
        {priceBounds.max > 0 && (
          <p className="text-[11px] text-noir/40 mt-2">
            Catalog range {formatPrice(priceBounds.min)} – {formatPrice(priceBounds.max)}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={clearAll}
        className="text-xs uppercase tracking-widest2 text-champagne-dark hover:underline"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead
        title="Shop"
        description="Filter Madhu Polki, diamond and bridal jewellery by category, price, and type."
        keywords="shop jewellery, filter Polki, bridal jewellery, Madhu collections"
      />

      <div className="border-b border-champagne/15 bg-white">
        <div className="container-luxe py-8 md:py-10">
          <p className="eyebrow mb-2">Shop</p>
          <h1 className="heading-display text-3xl md:text-4xl text-noir mb-2">All jewellery</h1>
          <p className="text-sm text-noir/55 max-w-xl">
            Filter by category, craft, and price.
          </p>
        </div>
      </div>

      <div className="container-luxe py-8 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-noir/50">
            {loading ? "Loading…" : `${filtered.length} piece${filtered.length === 1 ? "" : "s"}`}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden inline-flex items-center gap-2 text-xs uppercase tracking-widest2 border border-champagne/30 px-3 py-2"
              onClick={() => setMobileOpen(true)}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <label className="text-xs text-noir/50 flex items-center gap-2">
              Sort
              <select
                value={sortBy}
                onChange={(e) => setParam("sort", e.target.value)}
                className="border border-champagne/25 bg-white px-3 py-2 text-sm outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          <aside className="hidden lg:block lg:col-span-3">{Filters}</aside>

          <div className="lg:col-span-9">
            {loading ? (
              <p className="text-sm text-noir/45 py-20 text-center">Loading pieces…</p>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="heading-display text-2xl text-noir mb-3">No pieces match</p>
                <button type="button" onClick={clearAll} className="btn-outline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} image={p.images?.[0]} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-noir/50"
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-ivory p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-noir">Filters</h2>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {Filters}
            <button
              type="button"
              className="btn-gold w-full mt-8"
              onClick={() => setMobileOpen(false)}
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
