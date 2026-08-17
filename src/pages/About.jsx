import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Award, Heart, Sparkles } from "lucide-react";
import { api, assetUrl } from "../api/client";
import SeoHead from "../components/SeoHead";
import useCmsStore from "../store/useCmsStore";
import {
  defaultAboutFields,
  fieldsToCmsAbout,
  cmsAboutToFields,
  extractAboutSectionLayout,
  normalizeAboutSectionLayout,
} from "../admin/data/aboutCmsFields";

const ICONS = { ShieldCheck, Award, Heart, Sparkles };

function buildAboutCms(raw = {}) {
  const flat = cmsAboutToFields(raw);
  const layout = extractAboutSectionLayout(raw);
  const structured = fieldsToCmsAbout(flat, layout);
  return {
    ...structured,
    heroImage: assetUrl(structured.heroImage),
    craftImage: assetUrl(structured.craftImage),
    polkiImage: assetUrl(structured.polkiImage),
    sectionLayout: {
      ...structured.sectionLayout,
      customSections: structured.sectionLayout.customSections.map((c) => ({
        ...c,
        image: assetUrl(c.image),
      })),
    },
  };
}

function CustomBlock({ data }) {
  if (!data || data.enabled === false) return null;
  const hasImage = Boolean(data.image);
  return (
    <section className="container-luxe py-16 md:py-24">
      <div
        className={`grid gap-8 lg:gap-16 items-center ${
          hasImage ? "lg:grid-cols-2" : "grid-cols-1 max-w-3xl mx-auto text-center"
        }`}
      >
        {hasImage && (
          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-stone-100">
            <img src={assetUrl(data.image)} alt="" className="w-full h-full object-cover" />
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
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-noir">
      <div className="absolute inset-0 bg-noir">
        {c.heroImage ? (
          <img
            src={c.heroImage}
            alt=""
            className="w-full h-full object-cover opacity-50 object-center"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
        <div className="grain-overlay" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <p className="text-[10px] md:text-xs uppercase tracking-widest2 text-champagne mb-2 font-semibold">
          {c.heroEyebrow}
        </p>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-ivory leading-tight">
          {c.heroTitle}
        </h1>
        <p className="text-ivory/70 text-xs md:text-sm mt-4 leading-relaxed max-w-xl mx-auto uppercase tracking-widest2">
          {c.heroSubtitle}
        </p>
      </div>
    </div>
  );
}

function Quote({ c }) {
  return (
    <section className="container-luxe py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-champagne font-display text-5xl md:text-6xl select-none">“</span>
        <h2 className="heading-display text-2xl md:text-3xl lg:text-4xl text-noir italic -mt-4 mb-6 leading-relaxed">
          {c.quote}
        </h2>
        <p className="text-xs md:text-sm uppercase tracking-widest2 text-champagne font-semibold mb-12">
          {c.quoteAttribution}
        </p>
        <div className="w-12 h-px bg-champagne/40 mx-auto" />
      </div>
    </section>
  );
}

function Craft({ c }) {
  return (
    <section className="bg-stone-50 border-y border-champagne/15 py-16 md:py-24">
      <div className="container-luxe grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 relative">
          <div className="absolute -inset-3 border border-champagne/15 scale-95 pointer-events-none" />
          <div className="aspect-[4/5] overflow-hidden rounded-sm relative group bg-stone-200">
            {c.craftImage ? (
              <img
                src={c.craftImage}
                alt=""
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : null}
          </div>
        </div>
        <div className="md:col-span-6 space-y-4">
          <p className="eyebrow">{c.craftEyebrow}</p>
          <h3 className="heading-display text-3xl md:text-4xl text-noir">{c.craftTitle}</h3>
          <p className="text-noir/60 text-sm leading-relaxed">{c.craftBody}</p>
        </div>
      </div>
    </section>
  );
}

function Polki({ c }) {
  return (
    <section className="container-luxe py-16 md:py-24">
      <div className="grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 md:order-2 relative">
          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-stone-100">
            {c.polkiImage ? (
              <img src={c.polkiImage} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
        </div>
        <div className="md:col-span-6 md:order-1 space-y-4">
          <p className="eyebrow">{c.polkiEyebrow}</p>
          <h3 className="heading-display text-3xl md:text-4xl text-noir">{c.polkiTitle}</h3>
          <p className="text-noir/60 text-sm leading-relaxed">{c.polkiBody}</p>
        </div>
      </div>
    </section>
  );
}

function Trust({ c }) {
  const pillars = c.trustPillars || [];
  return (
    <section className="bg-noir py-16 md:py-24">
      <div className="container-luxe">
        <div className="text-center mb-12">
          <p className="eyebrow text-champagne-light mb-2">{c.trustEyebrow}</p>
          <h3 className="heading-display text-3xl md:text-4xl text-ivory">{c.trustTitle}</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => {
            const Icon = ICONS[p.icon] || ShieldCheck;
            return (
              <div key={p.title} className="border border-champagne/15 p-6 text-center">
                <Icon size={28} className="text-champagne mx-auto mb-4" strokeWidth={1.5} />
                <h4 className="heading-display text-lg text-ivory mb-2">{p.title}</h4>
                <p className="text-xs text-ivory/50 leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const SECTIONS = {
  hero: Hero,
  quote: Quote,
  craft: Craft,
  polki: Polki,
  trust: Trust,
};

export default function About() {
  const localFields = useCmsStore((s) => s.pages.about?.fields);
  const localLayout = useCmsStore((s) => s.pages.about?.sectionLayout);
  const updatePageFields = useCmsStore((s) => s.updatePageFields);
  const setAboutSectionLayout = useCmsStore((s) => s.setAboutSectionLayout);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settings = await api("/settings");
        if (cancelled || !settings.cmsAbout) return;
        updatePageFields("about", cmsAboutToFields(settings.cmsAbout));
        setAboutSectionLayout?.(extractAboutSectionLayout(settings.cmsAbout));
      } catch {
        /* keep local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [updatePageFields, setAboutSectionLayout]);

  const c = buildAboutCms({
    ...defaultAboutFields,
    ...localFields,
    sectionLayout: localLayout,
  });

  const layout = normalizeAboutSectionLayout(c.sectionLayout);
  const hidden = new Set(layout.hidden || []);
  const customMap = Object.fromEntries(
    (layout.customSections || []).map((s) => [s.id, s])
  );

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead
        title="About Us"
        description="The story of Madhu — heritage Polki and Jadau craftsmanship, certified diamonds, and bridal ateliers across India."
        keywords="about Madhu jewellery, Jadau craftsmanship, Polki heritage, bridal atelier"
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
        return <Comp key={id} c={c} />;
      })}
    </div>
  );
}
