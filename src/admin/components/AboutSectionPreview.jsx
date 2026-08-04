import { useState } from "react";
import { Monitor, Smartphone, ShieldCheck, Award, Heart, Sparkles } from "lucide-react";
import { assetUrl } from "../../api/client";
import {
  fieldsToCmsAbout,
  defaultAboutSectionLayout,
  parseTrustPillars,
} from "../data/aboutCmsFields";

const ICONS = { ShieldCheck, Award, Heart, Sparkles };

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

export default function AboutSectionPreview({ groupId, fields = {} }) {
  const [viewport, setViewport] = useState("desktop");
  const cms = fieldsToCmsAbout(fields, defaultAboutSectionLayout);
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest2 ${
              isMobile ? "bg-noir text-champagne" : "text-noir/50"
            }`}
          >
            <Smartphone size={12} /> Mobile
          </button>
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest2 ${
              !isMobile ? "bg-noir text-champagne" : "text-noir/50"
            }`}
          >
            <Monitor size={12} /> Desktop
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-5 overflow-x-auto">
        <div
          className={`mx-auto bg-ivory shadow-sm border border-champagne/10 overflow-hidden ${
            isMobile ? "w-full max-w-[390px]" : "w-full max-w-5xl"
          }`}
        >
          <PreviewBody groupId={groupId} cms={cms} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

function PreviewBody({ groupId, cms, isMobile }) {
  switch (groupId) {
    case "hero":
      return (
        <div className={`relative w-full flex items-center justify-center overflow-hidden bg-noir ${isMobile ? "h-[220px]" : "h-[280px]"}`}>
          {cms.heroImage ? (
            <img
              src={resolveImg(cms.heroImage)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-50 object-center"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
          <div className="relative z-10 text-center px-4 max-w-2xl">
            <p className="text-[10px] uppercase tracking-widest2 text-champagne mb-2 font-semibold">
              {cms.heroEyebrow}
            </p>
            <h3 className={`font-display text-ivory leading-tight ${isMobile ? "text-2xl" : "text-4xl"}`}>
              {cms.heroTitle}
            </h3>
            <p className="text-ivory/70 text-[10px] sm:text-xs mt-3 uppercase tracking-widest2">
              {cms.heroSubtitle}
            </p>
          </div>
        </div>
      );
    case "quote":
      return (
        <div className="px-6 py-10 text-center max-w-2xl mx-auto">
          <span className="text-champagne font-display text-4xl">“</span>
          <p className="font-display text-xl sm:text-2xl text-noir italic -mt-2 mb-4 leading-relaxed">
            {cms.quote}
          </p>
          <p className="text-[10px] uppercase tracking-widest2 text-champagne font-semibold">
            {cms.quoteAttribution}
          </p>
        </div>
      );
    case "craft":
      return (
        <div className={`grid gap-6 p-6 items-center bg-stone-50 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-stone-200">
            {cms.craftImage ? (
              <img src={resolveImg(cms.craftImage)} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">{cms.craftEyebrow}</p>
            <h3 className="font-display text-2xl text-noir mb-3">{cms.craftTitle}</h3>
            <p className="text-sm text-noir/60 leading-relaxed">{cms.craftBody}</p>
          </div>
        </div>
      );
    case "polki":
      return (
        <div className={`grid gap-6 p-6 items-center ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
          <div className={isMobile ? "order-2" : "order-2 md:order-1"}>
            <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">{cms.polkiEyebrow}</p>
            <h3 className="font-display text-2xl text-noir mb-3">{cms.polkiTitle}</h3>
            <p className="text-sm text-noir/60 leading-relaxed">{cms.polkiBody}</p>
          </div>
          <div className={`aspect-[4/5] overflow-hidden rounded-sm bg-stone-100 ${isMobile ? "order-1" : "order-1 md:order-2"}`}>
            {cms.polkiImage ? (
              <img src={resolveImg(cms.polkiImage)} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
        </div>
      );
    case "trust": {
      const pillars = cms.trustPillars?.length
        ? cms.trustPillars
        : parseTrustPillars(cms.trustPillarsText);
      return (
        <div className="bg-noir text-ivory px-4 py-8">
          <div className="text-center mb-6">
            <p className="text-[10px] uppercase tracking-widest2 text-champagne-light mb-2">{cms.trustEyebrow}</p>
            <h3 className="font-display text-2xl">{cms.trustTitle}</h3>
          </div>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"}`}>
            {pillars.map((p) => {
              const Icon = ICONS[p.icon] || ShieldCheck;
              return (
                <div key={p.title} className="border border-champagne/15 p-4 text-center">
                  <Icon size={24} className="text-champagne mx-auto mb-3" strokeWidth={1.5} />
                  <p className="font-display text-base mb-1">{p.title}</p>
                  <p className="text-[11px] text-ivory/50">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    default:
      return <p className="p-6 text-sm text-noir/45">No preview for this section.</p>;
  }
}
