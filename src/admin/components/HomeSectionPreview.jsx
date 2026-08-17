import { useState } from "react";
import { Monitor, Smartphone, ArrowRight } from "lucide-react";
import { assetUrl } from "../../api/client";
import { fieldsToCmsHome, defaultHandcraftedTabs } from "../data/homeCmsFields";

export default function HomeSectionPreview({
  groupId,
  fields = {},
  handcraftedTabs = defaultHandcraftedTabs,
  products = [],
}) {
  const [viewport, setViewport] = useState("desktop");
  const cms = fieldsToCmsHome(fields, handcraftedTabs);
  const productBySku = (sku) =>
    products.find((p) => p.sku === sku || p.id === sku || String(p._id) === sku);
  const isMobile = viewport === "mobile";

  return (
    <div className="border border-champagne/20 rounded-2xl overflow-hidden bg-stone-100/80 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-champagne/15 bg-stone-50">
        <p className="text-[10px] uppercase tracking-widest2 text-noir/45 font-medium">
          Section preview (same layout as live)
        </p>
        <div className="flex items-center gap-1 rounded-full border border-champagne/20 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest2 transition-colors ${
              isMobile ? "bg-noir text-champagne" : "text-noir/50 hover:text-noir"
            }`}
          >
            <Smartphone size={12} /> Mobile
          </button>
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest2 transition-colors ${
              !isMobile ? "bg-noir text-champagne" : "text-noir/50 hover:text-noir"
            }`}
          >
            <Monitor size={12} /> Desktop
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5 overflow-x-auto">
        <div
          className={`mx-auto bg-ivory shadow-sm border border-champagne/10 overflow-hidden transition-all duration-300 min-w-0 ${
            isMobile ? "w-full max-w-[390px]" : "w-full max-w-5xl"
          }`}
        >
          {/* No max-height crop — let section show fully like live */}
          <div className="overflow-x-hidden">
            <PreviewBody
              groupId={groupId}
              cms={cms}
              tabs={handcraftedTabs}
              productBySku={productBySku}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewBody({ groupId, cms, tabs, productBySku, isMobile }) {
  switch (groupId) {
    case "hero":
      return <HeroPreview cms={cms} isMobile={isMobile} />;
    case "marquee":
      return <MarqueePreview cms={cms} />;
    case "category":
      return (
        <section className="px-5 sm:px-8 py-10 sm:py-14">
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">
            {cms.categoryEyebrow}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-noir">{cms.categoryTitle}</h3>
          <p className="text-xs text-noir/40 mt-4">
            Category tiles come from Admin → Categories (live data).
          </p>
        </section>
      );
    case "banners":
      return <BannersPreview cms={cms} isMobile={isMobile} />;
    case "handcrafted":
    case "handcraftedTabsEditor":
      return (
        <HandcraftedPreview
          eyebrow={cms.handcraftedEyebrow}
          title={cms.handcraftedTitle}
          tabs={tabs}
          productBySku={productBySku}
          isMobile={isMobile}
        />
      );
    case "edit":
      return (
        <section className="bg-ivory px-5 sm:px-8 py-10 sm:py-14 text-center">
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-3">
            {cms.editEyebrow}
          </p>
          <h3 className="font-display text-2xl sm:text-4xl text-noir">
            {cms.editTitle}{" "}
            <span className="italic text-champagne-dark">{cms.editTitleAccent}</span>
          </h3>
          <p className="text-noir/50 text-sm max-w-md mx-auto mt-4 leading-relaxed">
            {cms.editSubtitle}
          </p>
        </section>
      );
    case "legacy":
      return <LegacyPreview cms={cms} isMobile={isMobile} />;
    case "celeb":
      return (
        <section className="px-5 sm:px-8 py-10 text-center">
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">
            {cms.celebEyebrow}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-noir">{cms.celebTitle}</h3>
          <p className="mt-3 text-[10px] uppercase tracking-widest2 text-noir/45">
            {cms.celebViewAll}
          </p>
        </section>
      );
    case "editorial":
      return <EditorialPreview cms={cms} isMobile={isMobile} />;
    case "trust":
      return (
        <section className="px-4 sm:px-6 py-8">
          <div
            className={`grid gap-4 ${
              isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {(cms.trustBadges || []).map((b, i) => (
              <div
                key={i}
                className="text-center p-4 border border-champagne/15 rounded-xl bg-white"
              >
                <p className="font-display text-lg text-noir">{b.title}</p>
                <p className="text-[11px] text-noir/50 mt-1">{b.subtitle}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case "stores":
      return (
        <section className="px-5 sm:px-8 py-10 text-center">
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">
            {cms.storesEyebrow}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-noir">{cms.storesTitle}</h3>
          <p className="mt-3 text-[10px] uppercase tracking-widest2 text-noir/45">
            {cms.storesViewAll}
          </p>
        </section>
      );
    case "couture":
      return <CouturePreview cms={cms} isMobile={isMobile} />;
    case "testimonials":
      return (
        <section className="px-5 sm:px-8 py-10 text-center">
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">
            {cms.testimonialsEyebrow}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-noir">
            {cms.testimonialsTitle}
          </h3>
        </section>
      );
    case "instagram":
      return (
        <section className="px-4 sm:px-6 py-8">
          <div className="text-center mb-6">
            <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">
              {cms.instagramEyebrow}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-noir">
              {cms.instagramTitle}
            </h3>
          </div>
          <div className={`grid gap-2 ${isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
            {(cms.instagramImages || []).slice(0, 4).map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-stone-100">
                {src ? (
                  <img src={assetUrl(src)} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-[10px] uppercase tracking-widest2 text-champagne-dark">
            {cms.instagramFollow}
          </p>
        </section>
      );
    default:
      return <p className="p-6 text-sm text-noir/45">No preview for this section.</p>;
  }
}

/** Live: grid lg:2, image h-[45vh]/[55vh]/full, object-cover object-center */
function HeroPreview({ cms, isMobile }) {
  return (
    <section className="relative w-full bg-noir overflow-hidden">
      <div
        className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} ${
          isMobile ? "" : "min-h-[420px] lg:min-h-[480px]"
        }`}
      >
        {/* Image — same order as live: first on mobile, right on desktop */}
        <div
          className={`relative overflow-hidden order-1 ${
            isMobile ? "h-[280px] sm:h-[320px]" : "h-[280px] lg:h-auto lg:order-2"
          }`}
        >
          {cms.heroImage ? (
            <img
              src={assetUrl(cms.heroImage)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent lg:bg-gradient-to-l lg:from-noir/30 lg:via-transparent lg:to-transparent" />
        </div>

        {/* Copy */}
        <div
          className={`relative flex flex-col justify-center px-5 sm:px-8 py-8 sm:py-10 order-2 ${
            isMobile ? "" : "lg:order-1"
          }`}
        >
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-light mb-3">
            {cms.heroEyebrow}
          </p>
          <h3
            className={`font-display text-ivory leading-[1.1] ${
              isMobile ? "text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"
            }`}
          >
            {cms.heroTitle}
            <br />
            <span className="text-champagne-light italic">{cms.heroTitleAccent}</span>
          </h3>
          <p className="text-ivory/60 mt-4 max-w-md text-sm leading-relaxed">
            {cms.heroSubtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <span className="inline-block bg-champagne text-noir px-4 py-2.5 text-[10px] uppercase tracking-widest2">
              {cms.heroCtaPrimary}
            </span>
            <span className="text-ivory text-[11px] uppercase tracking-widest2 flex items-center gap-2">
              {cms.heroCtaSecondary} <ArrowRight size={14} className="text-champagne" />
            </span>
          </div>
          <div className="flex flex-wrap gap-6 sm:gap-10 mt-8 pt-6 border-t border-champagne/15">
            {(cms.heroStats || []).map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-xl sm:text-2xl text-champagne-light">{num}</p>
                <p className="text-[10px] uppercase tracking-wide text-ivory/40 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueePreview({ cms }) {
  const items = cms.marquee || [];
  return (
    <div className="bg-noir text-champagne border-y border-champagne/20 py-4 overflow-hidden">
      <div className="flex gap-10 whitespace-nowrap px-4 text-[10px] uppercase tracking-widest2 font-semibold">
        {items.length
          ? items.map((t, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" /> {t}
              </span>
            ))
          : "—"}
      </div>
    </div>
  );
}

/** Live: aspect-[3/4] cards with text OVER the image — not stacked below */
function BannersPreview({ cms, isMobile }) {
  const banners = cms.collectionBanners || [];
  return (
    <section className="px-4 sm:px-6 py-8 sm:py-10">
      <div className={`grid gap-4 sm:gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"}`}>
        {banners.map((banner, i) => (
          <div
            key={`${banner.title}-${i}`}
            className="group relative block overflow-hidden rounded-sm aspect-[3/4] bg-stone-200"
          >
            {banner.img ? (
              <img
                src={assetUrl(banner.img)}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-noir/95 via-noir/25 to-noir/10" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="text-champagne-light/70 font-display italic text-base">
                {banner.index}
              </span>
              <span className="bg-ivory/90 text-noir text-[10px] uppercase tracking-widest2 px-2.5 py-1 rounded-full">
                {banner.tag}
              </span>
            </div>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
              <h3 className="font-display text-xl text-ivory leading-tight mb-2">{banner.title}</h3>
              <p className="text-ivory/65 text-xs leading-relaxed mb-3 max-w-[90%]">{banner.desc}</p>
              <span className="flex items-center gap-2 text-champagne-light text-[11px] uppercase tracking-widest2 border-b border-champagne/40 pb-1">
                {cms.bannerExploreCta || "Explore"} <ArrowRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Live: aspect-[3/4] image + text beside on desktop */
function LegacyPreview({ cms, isMobile }) {
  return (
    <section className="bg-stone-50 border-y border-champagne/15 px-4 sm:px-8 py-10 sm:py-14">
      <div
        className={`grid gap-8 sm:gap-12 items-center ${
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
        }`}
      >
        <div className={`${isMobile ? "order-2" : "lg:col-span-5 order-2 lg:order-1"} relative`}>
          <div className="absolute -inset-3 border border-champagne/20 scale-95 pointer-events-none hidden sm:block" />
          <div className="aspect-[3/4] overflow-hidden rounded-sm relative bg-stone-200">
            {cms.brandStoryImage ? (
              <img
                src={assetUrl(cms.brandStoryImage)}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-noir/20" />
          </div>
        </div>
        <div className={`${isMobile ? "order-1" : "lg:col-span-7 order-1 lg:order-2"}`}>
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-3">
            {cms.brandStoryEyebrow}
          </p>
          <h3
            className={`font-display text-noir leading-[1.1] mb-4 ${
              isMobile ? "text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"
            }`}
          >
            {cms.brandStoryTitle}{" "}
            <span className="italic text-champagne-dark">{cms.brandStoryTitleAccent}</span>
          </h3>
          <p className="text-noir/70 text-sm leading-relaxed mb-4">{cms.brandStoryBody1}</p>
          <p className="text-noir/70 text-sm leading-relaxed mb-6">{cms.brandStoryBody2}</p>
          <span className="inline-block border border-noir/25 px-5 py-2.5 text-[10px] uppercase tracking-widest2">
            {cms.brandStoryCta}
          </span>
        </div>
      </div>
    </section>
  );
}

function HandcraftedPreview({ eyebrow, title, tabs, productBySku, isMobile }) {
  const enabled = (tabs || [])
    .filter((t) => t && t.enabled !== false && t.label)
    .map((tab) => ({
      key: tab.id || tab.label,
      label: tab.label,
      img: assetUrl(tab.image),
      links: (tab.productSkus || []).map((sku) => {
        const p = productBySku(sku);
        return { sku, name: p?.name || sku, missing: !p };
      }),
    }));

  const [active, setActive] = useState(enabled[0]?.key);
  const current = enabled.find((t) => t.key === active) || enabled[0];

  if (!enabled.length) {
    return (
      <p className="text-sm text-noir/45 text-center py-10 px-4">
        Enable a tab with a label to preview this section.
      </p>
    );
  }

  return (
    <section className="px-4 sm:px-8 py-10 sm:py-14">
      <div className="text-center mb-8">
        <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">{eyebrow}</p>
        <h3 className={`font-display text-noir ${isMobile ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
          {title}
        </h3>
      </div>
      <div className="flex justify-center flex-wrap gap-5 sm:gap-10 border-b border-champagne/20">
        {enabled.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`relative pb-3 text-[11px] uppercase tracking-widest2 font-semibold ${
              current?.key === tab.key ? "text-noir" : "text-noir/40"
            }`}
          >
            {tab.label}
            {current?.key === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne" />
            )}
          </button>
        ))}
      </div>
      {/* Live: aspect-[4/3] image + product links */}
      <div
        className={`grid gap-6 sm:gap-10 mt-8 items-center ${
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        <div className="aspect-[4/3] overflow-hidden rounded-sm relative bg-stone-100">
          {current?.img ? (
            <img
              src={current.img}
              alt={current.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-noir/35">
              No image
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {(current?.links || []).length === 0 ? (
            <p className="text-sm text-noir/45">No products in this tab.</p>
          ) : (
            current.links.map((link) => (
              <div
                key={link.sku}
                className={`flex items-center justify-between border-b border-champagne/15 pb-4 ${
                  link.missing ? "opacity-50" : ""
                }`}
              >
                <span className="font-display text-lg sm:text-xl text-noir">{link.name}</span>
                <span className="text-champagne-dark text-sm">→</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/** Live: full-bleed h-[75vh]/[90vh] image with centered text overlay */
function EditorialPreview({ cms, isMobile }) {
  return (
    <section
      className={`relative w-full flex items-center justify-center overflow-hidden ${
        isMobile ? "h-[420px]" : "h-[480px] md:h-[520px]"
      }`}
    >
      <div className="absolute inset-0 bg-noir">
        {cms.editorialImage ? (
          <img
            src={assetUrl(cms.editorialImage)}
            alt=""
            className="w-full h-full object-cover object-center opacity-65"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-noir/30 via-noir/50 to-noir/80" />
      </div>
      <div className="relative text-center px-4 max-w-3xl z-10">
        <p className="text-[10px] uppercase tracking-widest2 text-champagne-light mb-3">
          {cms.editorialEyebrow}
        </p>
        <h3
          className={`font-display text-ivory leading-[1.1] mb-4 ${
            isMobile ? "text-2xl" : "text-3xl sm:text-5xl"
          }`}
        >
          {cms.editorialTitle}
        </h3>
        <p className="text-ivory/60 text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
          {cms.editorialBody}
        </p>
        <span className="inline-block bg-champagne text-noir px-5 py-2.5 text-[10px] uppercase tracking-widest2">
          {cms.editorialCta}
        </span>
      </div>
    </section>
  );
}

/** Live: maroon split — image left on desktop, text right */
function CouturePreview({ cms, isMobile }) {
  return (
    <section className="bg-maroon text-ivory overflow-hidden">
      <div
        className={`grid items-stretch min-h-[360px] ${
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        <div
          className={`relative min-h-[240px] lg:min-h-[360px] ${
            isMobile ? "order-2" : "order-2 lg:order-1"
          }`}
        >
          {cms.coutureImage ? (
            <img
              src={assetUrl(cms.coutureImage)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div
          className={`flex flex-col justify-center px-6 sm:px-10 py-10 ${
            isMobile ? "order-1" : "order-1 lg:order-2"
          }`}
        >
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-light mb-3">
            {cms.coutureEyebrow}
          </p>
          <h3 className={`font-display text-ivory leading-tight mb-4 ${isMobile ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
            {cms.coutureTitle}
          </h3>
          <p className="text-ivory/65 text-sm leading-relaxed mb-6 max-w-md">{cms.coutureBody}</p>
          <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-widest2">
            <span className="bg-champagne text-noir px-5 py-2.5">{cms.coutureCtaPrimary}</span>
            <span className="border border-champagne/30 text-champagne-light px-5 py-2.5">
              {cms.coutureCtaSecondary}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
