/**
 * Collection page CMS — labels + per-slug hero overrides.
 * Format for categories: slug|title|description|imageUrl (one per line)
 */

import {
  makeSectionLayoutHelpers,
  createCustomSection,
} from "./pageCmsKit";

export const COLLECTION_FIELD_GROUPS = [
  {
    id: "hero",
    label: "1 · Collection hero",
    keys: ["eyebrow", "defaultDescription", "defaultBgImage"],
  },
  {
    id: "toolbar",
    label: "2 · Results toolbar",
    keys: [
      "showingPrefix",
      "resultsLabel",
      "sortLabel",
      "sortFeatured",
      "sortPriceAsc",
      "sortPriceDesc",
      "sortNameAsc",
    ],
  },
  {
    id: "grid",
    label: "3 · Product grid / empty",
    keys: ["emptyTitle", "emptySubtitle"],
  },
  {
    id: "categories",
    label: "4 · Collection heroes (slug|title|description|image)",
    keys: ["categoriesText"],
  },
];

export const BUILTIN_COLLECTION_SECTIONS = [
  { id: "hero", label: "Collection hero", adminGroups: ["hero", "categories"] },
  { id: "toolbar", label: "Results toolbar", adminGroups: ["toolbar"] },
  { id: "grid", label: "Product grid", adminGroups: ["grid"] },
];

const collectionHelpers = makeSectionLayoutHelpers(BUILTIN_COLLECTION_SECTIONS);
export const defaultCollectionSectionLayout = collectionHelpers.defaultLayout;
export const normalizeCollectionSectionLayout = collectionHelpers.normalize;
export const extractCollectionSectionLayout = collectionHelpers.extract;
export const collectionAdminGroupToSectionId = collectionHelpers.adminGroupToSectionId;
export const isCollectionSectionHidden = collectionHelpers.isHidden;
export const createCollectionCustomSection = createCustomSection;

const defaultCategories = [
  ["all-jewellery", "All Creations", "Explore our entire catalog of certified uncut diamond and fine gold treasures, handcrafted to perfection.", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop"],
  ["all-necklaces", "Necklaces & Chokers", "Make a breathtaking statement with our regal chokers, necklaces, and delicate pendants set in 22KT gold.", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop"],
  ["polki-earrings", "Polki & Gold Earrings", "From royal chandbalis to classic stud tops, find the perfect pair to frame your face with light.", "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1600&auto=format&fit=crop"],
  ["bracelets-for-women", "Karas & Bracelets", "Adorn your wrists with handcrafted solid gold bangles, cuffs, and Karas, detailed with exquisite Jadau work.", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1600&auto=format&fit=crop"],
  ["polki-accessories", "Rings, Maang Tikkas & Accessories", "Finishing details that complete a couture statement. Explore luxury cocktail rings and head ornaments.", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop"],
  ["polki-diamond-jewellery-sets", "Exquisite Sets", "Coordinated masterpieces designed to elevate bridal and festive ensembles with unmatched symmetry and grandeur.", "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1600&auto=format&fit=crop"],
  ["bridal-jewellery", "Bridal Couture Collection", "Timeless handcrafted bridal suites designed for milestone moments and legacy celebrations in 22KT gold.", "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1600&auto=format&fit=crop"],
  ["diamond-jewellery", "Diamond Jewellery", "Sleek, modern interpretations of luxury. Brilliant-cut natural diamonds crafted into contemporary geometries.", "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1600&auto=format&fit=crop"],
  ["all-polki-jewellery", "The Polki Jadau Collection", "Raw uncut diamonds nestled in gold foil settings, channeling the heritage of royal Indian design.", "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1600&auto=format&fit=crop"],
  ["ready-to-ship", "Ready to Ship", "Handcrafted favorites, fully certified and ready for immediate secure shipment to your doorstep.", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1600&auto=format&fit=crop"],
];

export const defaultCollectionFields = {
  eyebrow: "Madhu Jewellery",
  showingPrefix: "Showing",
  resultsLabel: "creations",
  sortLabel: "Sort By:",
  sortFeatured: "Featured",
  sortPriceAsc: "Price: Low to High",
  sortPriceDesc: "Price: High to Low",
  sortNameAsc: "Alphabetical: A-Z",
  emptyTitle: "No Creations Found",
  emptySubtitle:
    "We are currently cataloging more products. Speak to our couture consultants on WhatsApp for customized requests.",
  defaultDescription:
    "Discover our unique handcrafted designs, featuring natural uncut diamonds and brilliant gold settings.",
  defaultBgImage:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
  categoriesText: defaultCategories.map((r) => r.join("|")).join("\n"),
};

export function parseCategories(text) {
  const map = {};
  String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((row) => {
      const [slug, title = "", description = "", bgImage = ""] = row
        .split("|")
        .map((x) => x.trim());
      if (!slug) return;
      map[slug] = { title, description, bgImage };
    });
  return map;
}

export function fieldsToCmsCollection(fields, sectionLayout) {
  const f = { ...defaultCollectionFields, ...fields };
  return {
    ...f,
    categories: parseCategories(f.categoriesText),
    sectionLayout: normalizeCollectionSectionLayout(sectionLayout),
  };
}

export function cmsCollectionToFields(cms = {}) {
  const base = { ...defaultCollectionFields };
  Object.keys(base).forEach((k) => {
    if (cms[k] !== undefined && typeof cms[k] === "string") base[k] = cms[k];
  });
  if (cms.categories && typeof cms.categories === "object" && !Array.isArray(cms.categories)) {
    base.categoriesText = Object.entries(cms.categories)
      .map(([slug, v]) => `${slug}|${v.title || ""}|${v.description || ""}|${v.bgImage || ""}`)
      .join("\n");
  }
  return base;
}
