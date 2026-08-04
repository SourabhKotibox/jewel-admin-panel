/**
 * Stores page CMS — page copy + section visibility; store cards come from /api/stores.
 */

export const STORES_FIELD_GROUPS = [
  {
    id: "hero",
    label: "1 · Page header",
    keys: ["heroEyebrow", "heroTitle", "heroSubtitle", "heroImage"],
  },
  {
    id: "grid",
    label: "2 · Store grid labels",
    keys: [
      "callLabel",
      "directionsLabel",
      "hoursIconLabel",
      "emptyTitle",
      "emptySubtitle",
    ],
  },
  {
    id: "cta",
    label: "3 · Bottom CTA (optional)",
    keys: ["ctaEyebrow", "ctaTitle", "ctaBody", "ctaPrimary", "ctaPrimaryLink", "ctaImage"],
  },
];

export const defaultStoresFields = {
  heroEyebrow: "Retail Showrooms",
  heroTitle: "Our Boutiques",
  heroSubtitle:
    "Experience Madhu in person across India — book a private viewing at a boutique near you.",
  heroImage: "",

  callLabel: "Call Store",
  directionsLabel: "Get Directions",
  hoursIconLabel: "",
  emptyTitle: "No boutiques listed yet",
  emptySubtitle: "Add store locations from Admin → Stores.",

  ctaEyebrow: "Private Appointments",
  ctaTitle: "Book a Boutique Visit",
  ctaBody:
    "Prefer a private viewing? Reach out and our team will arrange a dedicated appointment at a showroom near you.",
  ctaPrimary: "Contact Us",
  ctaPrimaryLink: "/contact",
  ctaImage: "",
};

export const BUILTIN_STORES_SECTIONS = [
  { id: "hero", label: "Page header", adminGroups: ["hero"] },
  { id: "grid", label: "Store grid", adminGroups: ["grid"] },
  { id: "cta", label: "Bottom CTA", adminGroups: ["cta"] },
];

export const BUILTIN_STORES_SECTION_IDS = BUILTIN_STORES_SECTIONS.map((s) => s.id);

export const defaultStoresSectionLayout = {
  hidden: [],
  order: [...BUILTIN_STORES_SECTION_IDS],
  customSections: [],
};

export function createStoresCustomSection(partial = {}) {
  return {
    id: partial.id || `custom-${Date.now()}`,
    enabled: partial.enabled !== false,
    eyebrow: partial.eyebrow || "New Section",
    title: partial.title || "Custom Section",
    body: partial.body || "Add your content here from the admin panel.",
    image: partial.image || "",
    cta: partial.cta || "",
    ctaLink: partial.ctaLink || "/",
  };
}

export function normalizeStoresSectionLayout(layout) {
  const base = structuredClone(defaultStoresSectionLayout);
  if (!layout || typeof layout !== "object") return base;

  const hidden = Array.isArray(layout.hidden)
    ? layout.hidden.filter((id) => BUILTIN_STORES_SECTION_IDS.includes(id))
    : [];

  const customSections = Array.isArray(layout.customSections)
    ? layout.customSections.map((c) => createStoresCustomSection(c))
    : [];

  const customIds = new Set(customSections.map((c) => c.id));
  let order = Array.isArray(layout.order) ? [...layout.order] : [...BUILTIN_STORES_SECTION_IDS];
  order = order.filter((id) => BUILTIN_STORES_SECTION_IDS.includes(id) || customIds.has(id));
  BUILTIN_STORES_SECTION_IDS.forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });
  customSections.forEach((c) => {
    if (!order.includes(c.id)) order.push(c.id);
  });

  return { hidden, order, customSections };
}

export function fieldsToCmsStores(fields, sectionLayout = defaultStoresSectionLayout) {
  const f = { ...defaultStoresFields, ...fields };
  return {
    ...f,
    sectionLayout: normalizeStoresSectionLayout(sectionLayout),
  };
}

export function cmsStoresToFields(cms = {}) {
  const base = { ...defaultStoresFields };
  Object.keys(base).forEach((k) => {
    if (cms[k] !== undefined && typeof cms[k] === "string") base[k] = cms[k];
  });
  return base;
}

export function extractStoresSectionLayout(cms = {}) {
  return normalizeStoresSectionLayout(cms.sectionLayout);
}

export function storesAdminGroupToSectionId(groupId) {
  const hit = BUILTIN_STORES_SECTIONS.find((s) => s.adminGroups.includes(groupId));
  return hit?.id || groupId;
}

export function isStoresSectionHidden(sectionLayout, sectionId) {
  const layout = normalizeStoresSectionLayout(sectionLayout);
  if (String(sectionId).startsWith("custom-")) {
    const c = layout.customSections.find((x) => x.id === sectionId);
    return !c || c.enabled === false;
  }
  return layout.hidden.includes(sectionId);
}
