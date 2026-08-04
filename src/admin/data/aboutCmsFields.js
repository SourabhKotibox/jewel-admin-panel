/**
 * About page CMS — every word/image editable; sections can be hidden or custom-added.
 */

export const ABOUT_FIELD_GROUPS = [
  {
    id: "hero",
    label: "1 · Hero",
    keys: ["heroEyebrow", "heroTitle", "heroSubtitle", "heroImage"],
  },
  {
    id: "quote",
    label: "2 · Founder quote",
    keys: ["quote", "quoteAttribution"],
  },
  {
    id: "craft",
    label: "3 · Jadau craft",
    keys: ["craftEyebrow", "craftTitle", "craftBody", "craftImage"],
  },
  {
    id: "polki",
    label: "4 · Polki diamonds",
    keys: ["polkiEyebrow", "polkiTitle", "polkiBody", "polkiImage"],
  },
  {
    id: "trust",
    label: "5 · Trust pillars (Title|Body|Icon per line)",
    keys: ["trustEyebrow", "trustTitle", "trustPillarsText"],
  },
];

export const defaultAboutFields = {
  heroEyebrow: "Our Story",
  heroTitle: "The House of Madhu",
  heroSubtitle: "A legacy of handcrafted jewellery spanning generations of artistry.",
  heroImage:
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1600&auto=format&fit=crop",

  quote:
    "Jewellery is not just an ornament — it is memory, emotion, and heritage forged in gold.",
  quoteAttribution: "— Madhu Kadel, Founder",

  craftEyebrow: "The Heritage Craft",
  craftTitle: "The Imperial Art of Jadau",
  craftBody:
    "Our ateliers preserve the centuries-old Jadau technique, setting uncut diamonds into gold with meticulous precision.",
  craftImage:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",

  polkiEyebrow: "Natural Raw Gems",
  polkiTitle: "Uncut Polki Diamonds",
  polkiBody:
    "Each Polki stone is carefully selected for clarity and character, celebrating the raw beauty of nature.",
  polkiImage:
    "https://i.pinimg.com/736x/8f/36/30/8f36301407942819d6e354b7f8e5213d.jpg",

  trustEyebrow: "Our Assurances",
  trustTitle: "The Pillars of Madhu Trust",
  trustPillarsText: [
    "Certified Authenticity|SGL certified diamonds & BIS hallmarked gold.|ShieldCheck",
    "Lifetime Buyback|Assured value on your heirloom pieces.|Award",
    "Handcrafted Care|Every piece made by master karigars.|Heart",
    "Bespoke Service|Custom bridal trunks and private fittings.|Sparkles",
  ].join("\n"),
};

export const BUILTIN_ABOUT_SECTIONS = [
  { id: "hero", label: "Hero", adminGroups: ["hero"] },
  { id: "quote", label: "Founder quote", adminGroups: ["quote"] },
  { id: "craft", label: "Jadau craft", adminGroups: ["craft"] },
  { id: "polki", label: "Polki diamonds", adminGroups: ["polki"] },
  { id: "trust", label: "Trust pillars", adminGroups: ["trust"] },
];

export const BUILTIN_ABOUT_SECTION_IDS = BUILTIN_ABOUT_SECTIONS.map((s) => s.id);

export const defaultAboutSectionLayout = {
  hidden: [],
  order: [...BUILTIN_ABOUT_SECTION_IDS],
  customSections: [],
};

export function createAboutCustomSection(partial = {}) {
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

export function normalizeAboutSectionLayout(layout) {
  const base = structuredClone(defaultAboutSectionLayout);
  if (!layout || typeof layout !== "object") return base;

  const hidden = Array.isArray(layout.hidden)
    ? layout.hidden.filter((id) => BUILTIN_ABOUT_SECTION_IDS.includes(id))
    : [];

  const customSections = Array.isArray(layout.customSections)
    ? layout.customSections.map((c) => createAboutCustomSection(c))
    : [];

  const customIds = new Set(customSections.map((c) => c.id));
  let order = Array.isArray(layout.order) ? [...layout.order] : [...BUILTIN_ABOUT_SECTION_IDS];
  order = order.filter((id) => BUILTIN_ABOUT_SECTION_IDS.includes(id) || customIds.has(id));
  BUILTIN_ABOUT_SECTION_IDS.forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });
  customSections.forEach((c) => {
    if (!order.includes(c.id)) order.push(c.id);
  });

  return { hidden, order, customSections };
}

export function parseTrustPillars(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((row) => {
      const [title = "", body = "", icon = "ShieldCheck"] = row.split("|").map((x) => x.trim());
      return { title, body, icon: icon || "ShieldCheck" };
    });
}

export function fieldsToCmsAbout(fields, sectionLayout = defaultAboutSectionLayout) {
  const f = { ...defaultAboutFields, ...fields };
  return {
    ...f,
    trustPillars: parseTrustPillars(f.trustPillarsText),
    sectionLayout: normalizeAboutSectionLayout(sectionLayout),
  };
}

export function cmsAboutToFields(cms = {}) {
  const base = { ...defaultAboutFields };
  Object.keys(base).forEach((k) => {
    if (cms[k] !== undefined && typeof cms[k] === "string") base[k] = cms[k];
  });
  if (Array.isArray(cms.trustPillars) && cms.trustPillars.length) {
    base.trustPillarsText = cms.trustPillars
      .map((p) => `${p.title || ""}|${p.body || ""}|${p.icon || "ShieldCheck"}`)
      .join("\n");
  }
  return base;
}

export function extractAboutSectionLayout(cms = {}) {
  return normalizeAboutSectionLayout(cms.sectionLayout);
}

export function aboutAdminGroupToSectionId(groupId) {
  const hit = BUILTIN_ABOUT_SECTIONS.find((s) => s.adminGroups.includes(groupId));
  return hit?.id || groupId;
}

export function isAboutSectionHidden(sectionLayout, sectionId) {
  const layout = normalizeAboutSectionLayout(sectionLayout);
  if (String(sectionId).startsWith("custom-")) {
    const c = layout.customSections.find((x) => x.id === sectionId);
    return !c || c.enabled === false;
  }
  return layout.hidden.includes(sectionId);
}
