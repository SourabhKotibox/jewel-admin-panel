import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, ArrowRight, Store } from "lucide-react";
import { api, assetUrl } from "../api/client";
import SeoHead from "../components/SeoHead";
import useCmsStore from "../store/useCmsStore";
import {
  defaultStoresFields,
  fieldsToCmsStores,
  cmsStoresToFields,
  extractStoresSectionLayout,
  normalizeStoresSectionLayout,
} from "../admin/data/storesCmsFields";

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

function buildStoresCms(raw = {}) {
  const flat = cmsStoresToFields(raw);
  const layout = extractStoresSectionLayout(raw);
  const structured = fieldsToCmsStores(flat, layout);
  return {
    ...structured,
    heroImage: resolveImg(structured.heroImage),
    ctaImage: resolveImg(structured.ctaImage),
    sectionLayout: {
      ...structured.sectionLayout,
      customSections: structured.sectionLayout.customSections.map((s) => ({
        ...s,
        image: resolveImg(s.image),
      })),
    },
  };
}

function normalizeStore(s) {
  return {
    ...s,
    id: String(s.id || s._id || s.city),
    img: resolveImg(s.img),
  };
}

function CustomBlock({ data }) {
  if (!data || data.enabled === false) return null;
  const hasImage = Boolean(data.image);
  return (
    <section className="container-luxe py-16 md:py-20">
      <div
        className={`grid gap-8 lg:gap-16 items-center ${
          hasImage ? "lg:grid-cols-2" : "grid-cols-1 max-w-3xl mx-auto text-center"
        }`}
      >
        {hasImage && (
          <div className="aspect-[4/3] overflow-hidden rounded-sm bg-stone-100">
            <img src={data.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          {data.eyebrow && <p className="eyebrow mb-3">{data.eyebrow}</p>}
          {data.title && (
            <h2 className="heading-display text-3xl md:text-4xl text-noir leading-tight mb-5">
              {data.title}
            </h2>
          )}
          {data.body && (
            <p className="text-noir/70 text-sm md:text-base leading-relaxed mb-8">{data.body}</p>
          )}
          {data.cta && (
            <Link to={data.ctaLink || "/"} className="btn-outline">
              {data.cta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Hero({ c }) {
  if (c.heroImage) {
    return (
      <div className="relative w-full min-h-[36vh] md:min-h-[42vh] flex items-end overflow-hidden bg-noir mb-10 md:mb-14">
        <img
          src={c.heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-transparent" />
        <div className="relative z-10 container-luxe pb-10 md:pb-14 pt-24 max-w-3xl">
          <p className="eyebrow text-champagne-light mb-2">{c.heroEyebrow}</p>
          <h1 className="heading-display text-4xl md:text-5xl text-ivory">{c.heroTitle}</h1>
          <p className="text-ivory/65 text-xs md:text-sm mt-3 leading-relaxed max-w-xl">
            {c.heroSubtitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-luxe pt-16 md:pt-24">
      <div className="max-w-xl mb-12">
        <p className="eyebrow mb-2">{c.heroEyebrow}</p>
        <h1 className="heading-display text-4xl md:text-5xl text-noir">{c.heroTitle}</h1>
        <p className="text-noir/60 text-xs md:text-sm mt-3 leading-relaxed">{c.heroSubtitle}</p>
      </div>
    </div>
  );
}

function StoreGrid({ c, stores, loading }) {
  return (
    <div className={`container-luxe ${c.heroImage ? "pb-16 md:pb-24" : "pb-16 md:pb-24"}`}>
      {!c.heroImage ? null : <div className="mb-2" />}
      {loading ? (
        <p className="text-sm text-noir/45">Loading boutiques…</p>
      ) : stores.length === 0 ? (
        <div className="text-center py-16 border border-champagne/15 rounded-sm bg-stone-50">
          <p className="heading-display text-2xl text-noir mb-2">{c.emptyTitle}</p>
          <p className="text-sm text-noir/50">{c.emptySubtitle}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div
              key={store.id}
              className="group bg-stone-50 border border-champagne/15 rounded-sm p-5 hover:border-champagne/40 transition-colors duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden rounded-sm mb-5 relative bg-stone-200">
                  {store.img ? (
                    <img
                      src={store.img}
                      alt={store.city}
                      className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                    />
                  ) : null}
                  <div className="absolute inset-4 border border-ivory/20 scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                </div>
                <h3 className="font-display text-2xl text-noir font-medium mb-3">
                  {store.city}
                  {store.state ? `, ${store.state}` : ""}
                </h3>
                <p className="text-xs md:text-sm text-noir/65 flex gap-2 mb-3">
                  <MapPin size={16} className="text-champagne-dark mt-0.5 flex-shrink-0" />
                  <span>{store.address}</span>
                </p>
                {store.hours ? (
                  <p className="text-[11px] text-noir/45 pl-6 mb-6 flex items-center gap-1.5">
                    <Store size={12} /> {store.hours}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center justify-between border-t border-champagne/10 pt-4 mt-2">
                {store.phone ? (
                  <a
                    href={`tel:${store.phone}`}
                    className="text-xs text-champagne-dark font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:text-champagne transition-colors"
                  >
                    <Phone size={13} /> {c.callLabel}
                  </a>
                ) : (
                  <span />
                )}
                {store.mapUrl ? (
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-noir/60 hover:text-noir font-semibold uppercase tracking-wider flex items-center gap-1 group/link"
                  >
                    {c.directionsLabel}
                    <ArrowRight
                      size={13}
                      className="group-hover/link:translate-x-1 transition-transform duration-300"
                    />
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BottomCta({ c }) {
  const hasContent = c.ctaTitle || c.ctaBody || c.ctaPrimary;
  if (!hasContent) return null;
  return (
    <section className="bg-stone-50 border-t border-champagne/15 py-16 md:py-24">
      <div className="container-luxe grid md:grid-cols-2 gap-10 items-center">
        {c.ctaImage ? (
          <div className="aspect-[4/3] overflow-hidden rounded-sm bg-stone-200 order-1 md:order-1">
            <img src={c.ctaImage} alt="" className="w-full h-full object-cover" />
          </div>
        ) : null}
        <div className={c.ctaImage ? "" : "max-w-xl"}>
          {c.ctaEyebrow && <p className="eyebrow mb-2">{c.ctaEyebrow}</p>}
          {c.ctaTitle && (
            <h2 className="heading-display text-3xl md:text-4xl text-noir mb-4">{c.ctaTitle}</h2>
          )}
          {c.ctaBody && (
            <p className="text-noir/60 text-sm leading-relaxed mb-6">{c.ctaBody}</p>
          )}
          {c.ctaPrimary && (
            <Link to={c.ctaPrimaryLink || "/contact"} className="btn-outline">
              {c.ctaPrimary}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

const SECTIONS = {
  hero: Hero,
  grid: StoreGrid,
  cta: BottomCta,
};

export default function Stores() {
  const localFields = useCmsStore((s) => s.pages.stores?.fields);
  const localLayout = useCmsStore((s) => s.pages.stores?.sectionLayout);
  const updatePageFields = useCmsStore((s) => s.updatePageFields);
  const setStoresSectionLayout = useCmsStore((s) => s.setStoresSectionLayout);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [settings, rows] = await Promise.all([
          api("/settings").catch(() => ({})),
          api("/stores").catch(() => []),
        ]);
        if (cancelled) return;
        if (settings.cmsStores) {
          updatePageFields("stores", cmsStoresToFields(settings.cmsStores));
          setStoresSectionLayout?.(extractStoresSectionLayout(settings.cmsStores));
        }
        setStores((Array.isArray(rows) ? rows : []).map(normalizeStore));
      } catch {
        if (!cancelled) setStores([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [updatePageFields, setStoresSectionLayout]);

  const c = buildStoresCms({
    ...defaultStoresFields,
    ...localFields,
    sectionLayout: localLayout,
  });

  const layout = normalizeStoresSectionLayout(c.sectionLayout);
  const hidden = new Set(layout.hidden || []);
  const customMap = Object.fromEntries(
    (layout.customSections || []).map((s) => [s.id, s])
  );

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead
        title="Stores"
        description="Visit Madhu jewellery boutiques for Polki, Jadau and bridal try-ons. Find a store near you."
        keywords="Madhu jewellery stores, boutique locations, bridal jewellery store"
      />
      {layout.order.map((id) => {
        if (hidden.has(id)) return null;
        const custom = customMap[id];
        if (custom) {
          if (custom.enabled === false) return null;
          return <CustomBlock key={id} data={custom} />;
        }
        const Comp = SECTIONS[id];
        if (!Comp) return null;
        if (id === "grid") {
          return <Comp key={id} c={c} stores={stores} loading={loading} />;
        }
        return <Comp key={id} c={c} />;
      })}
    </div>
  );
}
