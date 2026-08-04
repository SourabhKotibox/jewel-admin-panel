import { create } from "zustand";
import { api, assetUrl } from "../api/client";
import {
  defaultHomeFields,
  fieldsToCmsHome,
  cmsHomeToFields,
  extractHandcraftedTabs,
  extractSectionLayout,
  normalizeSectionLayout,
} from "../admin/data/homeCmsFields";
import { IMG, whatsappNumber as fallbackWa } from "../data";

function resolveImg(src, fallback = "") {
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  return assetUrl(src) || src;
}

function normalizeProduct(p) {
  return {
    ...p,
    id: p.sku || p.id || String(p._id),
    slug: p.slug || p.sku,
    images: (p.images || []).map((img) => resolveImg(img)).filter(Boolean),
  };
}

function normalizeCategory(c) {
  return {
    ...c,
    id: String(c.id || c._id),
    img: resolveImg(c.img, IMG.catNecklace),
  };
}

function normalizeStore(s) {
  return {
    ...s,
    id: String(s.id || s._id),
    img: resolveImg(s.img, IMG.brandStory),
  };
}

function normalizeTestimonial(t) {
  return {
    ...t,
    id: String(t.id || t._id),
    img: resolveImg(
      t.img,
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
    ),
  };
}

function buildCms(raw = {}) {
  const flat = cmsHomeToFields({ ...defaultHomeFields, ...raw });
  const tabs = extractHandcraftedTabs(raw);
  const sectionLayout = extractSectionLayout(raw);
  const structured = fieldsToCmsHome(flat, tabs, sectionLayout);
  const layout = normalizeSectionLayout(structured.sectionLayout);
  return {
    ...structured,
    heroImage: resolveImg(structured.heroImage, IMG.heroBridal),
    brandStoryImage: resolveImg(structured.brandStoryImage, IMG.brandStory),
    editorialImage: resolveImg(structured.editorialImage),
    coutureImage: resolveImg(structured.coutureImage),
    collectionBanners: (structured.collectionBanners || []).map((b) => ({
      ...b,
      img: resolveImg(b.img),
    })),
    instagramImages: (structured.instagramImages || []).map((src) => resolveImg(src)),
    handcraftedTabs: (structured.handcraftedTabs || []).map((t) => ({
      ...t,
      image: resolveImg(t.image),
    })),
    sectionLayout: {
      ...layout,
      customSections: layout.customSections.map((c) => ({
        ...c,
        image: resolveImg(c.image),
      })),
    },
  };
}

const useStorefrontStore = create((set) => ({
  loading: false,
  error: null,
  loaded: false,
  products: [],
  categories: [],
  stores: [],
  testimonials: [],
  cms: buildCms(),
  business: {},
  whatsapp: fallbackWa,

  fetchHome: async () => {
    set({ loading: true, error: null });
    try {
      const [products, categories, stores, testimonials, settings] = await Promise.all([
        api("/products").catch(() => []),
        api("/categories").catch(() => []),
        api("/stores").catch(() => []),
        api("/testimonials").catch(() => []),
        api("/settings").catch(() => ({})),
      ]);

      const cmsRaw = settings.cmsHome || settings["cms.home"] || {};
      const business = settings.business || {};

      set({
        products: (Array.isArray(products) ? products : []).map(normalizeProduct),
        categories: (Array.isArray(categories) ? categories : []).map(normalizeCategory),
        stores: (Array.isArray(stores) ? stores : []).map(normalizeStore),
        testimonials: (Array.isArray(testimonials) ? testimonials : []).map(normalizeTestimonial),
        cms: buildCms(cmsRaw),
        business,
        whatsapp: business.whatsapp || fallbackWa,
        loading: false,
        loaded: true,
      });
    } catch (err) {
      set({ loading: false, error: err.message || "Failed to load home", loaded: true });
    }
  },
}));

export default useStorefrontStore;
