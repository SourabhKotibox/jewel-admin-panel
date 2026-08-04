import { useState } from "react";
import { Monitor, Smartphone, MapPin, Phone, ArrowRight, Store } from "lucide-react";
import { assetUrl } from "../../api/client";
import { fieldsToCmsStores, defaultStoresSectionLayout } from "../data/storesCmsFields";

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

const SAMPLE_STORES = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    address: "Sample boutique address",
    hours: "Mon–Sat 11:00 AM – 08:00 PM",
    phone: "+91 90000 00000",
    img: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "New Delhi",
    state: "Delhi",
    address: "Sample boutique address",
    hours: "Mon–Sun 11:00 AM – 08:00 PM",
    phone: "+91 90000 00001",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
  },
];

export default function StoresSectionPreview({ groupId, fields = {}, stores = [] }) {
  const [viewport, setViewport] = useState("desktop");
  const cms = fieldsToCmsStores(fields, defaultStoresSectionLayout);
  const isMobile = viewport === "mobile";
  const previewStores =
    stores.length > 0
      ? stores.slice(0, 3).map((s) => ({ ...s, img: resolveImg(s.img) }))
      : SAMPLE_STORES;

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
          <PreviewBody
            groupId={groupId}
            cms={cms}
            isMobile={isMobile}
            stores={previewStores}
          />
        </div>
      </div>
    </div>
  );
}

function PreviewBody({ groupId, cms, isMobile, stores }) {
  switch (groupId) {
    case "hero":
      if (cms.heroImage) {
        return (
          <div className={`relative w-full flex items-end overflow-hidden bg-noir ${isMobile ? "h-[200px]" : "h-[260px]"}`}>
            <img
              src={resolveImg(cms.heroImage)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-transparent" />
            <div className="relative z-10 p-5 sm:p-8 max-w-xl">
              <p className="text-[10px] uppercase tracking-widest2 text-champagne-light mb-2">
                {cms.heroEyebrow}
              </p>
              <h3 className={`font-display text-ivory ${isMobile ? "text-2xl" : "text-4xl"}`}>
                {cms.heroTitle}
              </h3>
              <p className="text-ivory/65 text-xs mt-2">{cms.heroSubtitle}</p>
            </div>
          </div>
        );
      }
      return (
        <div className="p-6 sm:p-8 max-w-xl">
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">
            {cms.heroEyebrow}
          </p>
          <h3 className={`font-display text-noir ${isMobile ? "text-2xl" : "text-4xl"}`}>
            {cms.heroTitle}
          </h3>
          <p className="text-noir/60 text-sm mt-3">{cms.heroSubtitle}</p>
        </div>
      );
    case "grid":
      return (
        <div className="p-4 sm:p-6">
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"}`}>
            {stores.map((store, i) => (
              <div
                key={store.city || i}
                className="bg-stone-50 border border-champagne/15 rounded-sm p-4"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-sm mb-3 bg-stone-200">
                  {store.img ? (
                    <img src={store.img} alt="" className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <p className="font-display text-lg text-noir mb-2">
                  {store.city}
                  {store.state ? `, ${store.state}` : ""}
                </p>
                <p className="text-xs text-noir/60 flex gap-1.5 mb-2">
                  <MapPin size={14} className="text-champagne-dark shrink-0 mt-0.5" />
                  {store.address}
                </p>
                {store.hours && (
                  <p className="text-[10px] text-noir/40 flex items-center gap-1 mb-3">
                    <Store size={11} /> {store.hours}
                  </p>
                )}
                <div className="flex justify-between border-t border-champagne/10 pt-3 text-[10px] uppercase tracking-wider">
                  <span className="text-champagne-dark flex items-center gap-1">
                    <Phone size={11} /> {cms.callLabel}
                  </span>
                  <span className="text-noir/50 flex items-center gap-1">
                    {cms.directionsLabel} <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "cta":
      return (
        <div className={`grid gap-6 p-6 bg-stone-50 items-center ${isMobile || !cms.ctaImage ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
          {cms.ctaImage ? (
            <div className="aspect-[4/3] overflow-hidden rounded-sm bg-stone-200">
              <img src={resolveImg(cms.ctaImage)} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark mb-2">
              {cms.ctaEyebrow}
            </p>
            <h3 className="font-display text-2xl text-noir mb-3">{cms.ctaTitle}</h3>
            <p className="text-sm text-noir/60 mb-4">{cms.ctaBody}</p>
            <span className="inline-block border border-noir/20 px-4 py-2 text-[10px] uppercase tracking-widest2">
              {cms.ctaPrimary}
            </span>
          </div>
        </div>
      );
    default:
      return <p className="p-6 text-sm text-noir/45">No preview for this section.</p>;
  }
}
