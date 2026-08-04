/**
 * Complete Home page CMS schema — every visible word/image URL editable from Admin.
 * Flat string fields for the form; helpers convert ↔ structured cmsHome for the API.
 */

export const HOME_FIELD_GROUPS = [
  {
    id: "hero",
    label: "1 · Hero",
    keys: [
      "heroEyebrow",
      "heroTitle",
      "heroTitleAccent",
      "heroSubtitle",
      "heroCtaPrimary",
      "heroCtaPrimaryLink",
      "heroCtaSecondary",
      "heroCtaSecondaryLink",
      "heroImage",
      "heroStat1Num",
      "heroStat1Label",
      "heroStat2Num",
      "heroStat2Label",
      "heroStat3Num",
      "heroStat3Label",
    ],
  },
  {
    id: "marquee",
    label: "2 · Marquee banner",
    keys: ["marqueeText"],
  },
  {
    id: "category",
    label: "3 · Shop by category",
    keys: ["categoryEyebrow", "categoryTitle"],
  },
  {
    id: "banners",
    label: "4 · Collection banners (3 cards)",
    keys: [
      "bannerExploreCta",
      "banner1Index", "banner1Tag", "banner1Title", "banner1Desc", "banner1Img", "banner1Link",
      "banner2Index", "banner2Tag", "banner2Title", "banner2Desc", "banner2Img", "banner2Link",
      "banner3Index", "banner3Tag", "banner3Title", "banner3Desc", "banner3Img", "banner3Link",
    ],
  },
  {
    id: "handcrafted",
    label: "5 · Handcrafted tabs (section titles)",
    keys: ["handcraftedEyebrow", "handcraftedTitle"],
  },
  {
    id: "handcraftedTabsEditor",
    label: "5b · Tab definitions & products",
    keys: [], // rendered via HandcraftedTabsEditor
    special: "handcraftedTabs",
  },
  {
    id: "edit",
    label: "6 · Reinventing Tradition",
    keys: ["editEyebrow", "editTitle", "editTitleAccent", "editSubtitle"],
  },
  {
    id: "legacy",
    label: "7 · Jadau & Polki legacy",
    keys: [
      "brandStoryEyebrow",
      "brandStoryTitle",
      "brandStoryTitleAccent",
      "brandStoryBody1",
      "brandStoryBody2",
      "brandStoryCta",
      "brandStoryCtaLink",
      "brandStoryImage",
    ],
  },
  {
    id: "celeb",
    label: "8 · Celeb picks",
    keys: ["celebEyebrow", "celebTitle", "celebViewAll", "celebViewAllLink"],
  },
  {
    id: "editorial",
    label: "9 · Editorial canvas",
    keys: [
      "editorialEyebrow",
      "editorialTitle",
      "editorialBody",
      "editorialCta",
      "editorialCtaLink",
      "editorialImage",
    ],
  },
  {
    id: "trust",
    label: "10 · Trust badges (Title|Subtitle per line)",
    keys: ["trustBadgesText"],
  },
  {
    id: "stores",
    label: "11 · Store locator",
    keys: [
      "storesEyebrow",
      "storesTitle",
      "storesViewAll",
      "storesBookCta",
      "storesMapLabel",
      "storesWaMessage",
    ],
  },
  {
    id: "couture",
    label: "12 · Bridal custom suite",
    keys: [
      "coutureEyebrow",
      "coutureTitle",
      "coutureBody",
      "coutureCtaPrimary",
      "coutureCtaSecondary",
      "coutureCtaSecondaryLink",
      "coutureWaMessage",
      "coutureImage",
    ],
  },
  {
    id: "testimonials",
    label: "13 · Testimonials",
    keys: ["testimonialsEyebrow", "testimonialsTitle"],
  },
  {
    id: "instagram",
    label: "14 · Instagram feed",
    keys: ["instagramEyebrow", "instagramTitle", "instagramFollow", "instagramImagesText"],
  },
];

export const defaultHomeFields = {
  // Hero
  heroEyebrow: "The Madhu Bridal Trunk Show",
  heroTitle: "Heritage,",
  heroTitleAccent: "Reimagined.",
  heroSubtitle:
    "A travelling showcase of our most exclusive handcrafted bridal creations — rare Polki masterpieces available only during the Trunk Show.",
  heroCtaPrimary: "Explore the Show",
  heroCtaPrimaryLink: "/shop?bridal=1",
  heroCtaSecondary: "Shop All",
  heroCtaSecondaryLink: "/shop",
  heroImage: "https://i.pinimg.com/736x/02/7c/63/027c63053b3aeb0110d9cd43007ca350.jpg",
  heroStat1Num: "12+",
  heroStat1Label: "India Showrooms",
  heroStat2Num: "2000+",
  heroStat2Label: "Unique Creations",
  heroStat3Num: "100K+",
  heroStat3Label: "Clients Worldwide",

  // Marquee (one phrase per line)
  marqueeText: [
    "100% certified uncut diamonds",
    "lifetime buyback guarantee",
    "free insured shipping worldwide",
    "22kt bis hallmarked gold",
    "handcrafted heritage jadau",
    "12+ boutique stores in india",
  ].join("\n"),

  // Category
  categoryEyebrow: "Shop by Category",
  categoryTitle: "Handcrafted For You",

  // Collection banners
  bannerExploreCta: "Explore Now",
  banner1Index: "01",
  banner1Tag: "Certified",
  banner1Title: "Natural Uncut Diamonds",
  banner1Desc: "Handcrafted in hallmarked 22KT gold with natural gemstones, cut and uncut Polki diamonds.",
  banner1Img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=900&auto=format&fit=crop",
  banner1Link: "/shop?polki=1",
  banner2Index: "02",
  banner2Tag: "Bestseller",
  banner2Title: "Bridal Jewellery Sets",
  banner2Desc: "Timeless handcrafted statements for celebrations that live forever in 18KT and 22KT gold.",
  banner2Img: "https://i.pinimg.com/736x/02/7c/63/027c63053b3aeb0110d9cd43007ca350.jpg",
  banner2Link: "/shop?bridal=1",
  banner3Index: "03",
  banner3Tag: "Heritage",
  banner3Title: "Temple & Antique Gold",
  banner3Desc: "Rare heirloom-style pieces inspired by South Indian temple architecture and antique motifs.",
  banner3Img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=900&auto=format&fit=crop",
  banner3Link: "/shop",

  // Handcrafted
  handcraftedEyebrow: "Curated Edit",
  handcraftedTitle: "Handcrafted For You",

  // Brand campaign / The Edit
  editEyebrow: "The Edit",
  editTitle: "Reinventing",
  editTitleAccent: "Tradition",
  editSubtitle:
    "Celebrating individuality as the rarest form of luxury, one handcrafted piece at a time.",

  // Legacy
  brandStoryEyebrow: "Our Legacy",
  brandStoryTitle: "The Golden Art of",
  brandStoryTitleAccent: "Jadau & Polki",
  brandStoryBody1:
    "Every creation at Madhu Kadel Jewellery is born from the masterly hands of our ancestral karigars. Using 22KT gold and natural, uncut Polki diamonds, we preserve the age-old art of Jadau — where each gemstone is meticulously set in layers of pure gold foil without any chemicals or adhesives.",
  brandStoryBody2:
    "This traditional technique captures the raw, organic brilliance of uncut diamonds, creating unique heirlooms that breathe life into imperial history for the contemporary woman.",
  brandStoryCta: "Learn Our Craft",
  brandStoryCtaLink: "/about",
  brandStoryImage: "https://i.pinimg.com/1200x/d5/a8/62/d5a862bee632bc8de853cd6277664031.jpg",

  // Celeb
  celebEyebrow: "As Seen On",
  celebTitle: "Celeb Picks",
  celebViewAll: "View all",
  celebViewAllLink: "/shop",

  // Editorial
  editorialEyebrow: "2026 Editorial Campaign",
  editorialTitle: "Individuality is the Rarest Form of Luxury.",
  editorialBody:
    "Discover handcrafted statements that become a canvas for your singular style. No two creations are alike, just like the women who wear them.",
  editorialCta: "Shop the Collection",
  editorialCtaLink: "/shop",
  editorialImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1800&auto=format&fit=crop",

  // Trust
  trustBadgesText: [
    "Certified Jewellery|Authenticity you can trust",
    "Lifetime Buyback|Value assured, always",
    "Free Insured Shipping|Secure delivery, no extra cost",
    "12+ Stores across India|Experience Madhu near you",
    "Worldwide Shipping|Jewels delivered globally",
    "100,000+ Units Sold|Trusted by thousands",
  ].join("\n"),

  // Stores
  storesEyebrow: "Visit Us",
  storesTitle: "Come Visit Our Stores",
  storesViewAll: "View All",
  storesBookCta: "Book Appointment",
  storesMapLabel: "View on Map",
  storesWaMessage: "Hi, I'd like to book an appointment at your {city} store.",

  // Couture
  coutureEyebrow: "Bespoke Couture",
  coutureTitle: "The Bridal Custom Suite",
  coutureBody:
    "Co-create your dream wedding jewellery. Collaborate directly with our design atelier to sketch, select uncut gemstones, and craft a bespoke heritage treasure tailored to your bridal ensemble.",
  coutureCtaPrimary: "Book Virtual Consultation",
  coutureCtaSecondary: "Visit Our Showrooms",
  coutureCtaSecondaryLink: "/stores",
  coutureWaMessage:
    "Hello Madhu Jewellery, I'd like to schedule a bridal consultation for bespoke jewellery.",
  coutureImage: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1400&auto=format&fit=crop",

  // Testimonials
  testimonialsEyebrow: "Voices",
  testimonialsTitle: "Madhu Family",

  // Instagram
  instagramEyebrow: "@madhujewellery",
  instagramTitle: "Follow Our Brand on Social Media",
  instagramFollow: "Follow Instagram",
  instagramImagesText: [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop",
  ].join("\n"),
};

/** Default handcrafted tabs — each tab: label, image, enabled, product SKUs to show */
export const defaultHandcraftedTabs = [
  {
    id: "tab-1",
    enabled: true,
    label: "Necklaces",
    image:
      "https://i.pinimg.com/vwebp/736x/43/5b/ae/435bae845ed8353bfbceeedfc58ea533.webp",
    productSkus: ["dn00366", "on30079", "tn30123"],
  },
  {
    id: "tab-2",
    enabled: true,
    label: "Earrings",
    image: "https://i.pinimg.com/736x/db/15/0f/db150f268e171d7264fa2120dd4b2770.jpg",
    productSkus: ["er00122"],
  },
  {
    id: "tab-3",
    enabled: true,
    label: "Bracelets",
    image: "https://i.pinimg.com/736x/4b/f6/e8/4bf6e8b4c04a52f86a4d46d5fb8f8fe5.jpg",
    productSkus: ["br00501"],
  },
];

/** Flat form fields → structured object used by the home page */
export function fieldsToCmsHome(
  fields,
  handcraftedTabs = defaultHandcraftedTabs,
  sectionLayout = defaultSectionLayout
) {
  const f = { ...defaultHomeFields, ...fields };
  const lines = (text) =>
    String(text || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  return {
    ...f,
    marquee: lines(f.marqueeText),
    heroStats: [
      [f.heroStat1Num, f.heroStat1Label],
      [f.heroStat2Num, f.heroStat2Label],
      [f.heroStat3Num, f.heroStat3Label],
    ],
    trustBadges: lines(f.trustBadgesText).map((row) => {
      const [title, subtitle = ""] = row.split("|").map((s) => s.trim());
      return { title, subtitle };
    }),
    collectionBanners: [1, 2, 3].map((n) => ({
      index: f[`banner${n}Index`],
      tag: f[`banner${n}Tag`],
      title: f[`banner${n}Title`],
      desc: f[`banner${n}Desc`],
      img: f[`banner${n}Img`],
      link: f[`banner${n}Link`],
    })),
    instagramImages: lines(f.instagramImagesText),
    handcraftedTabs: Array.isArray(handcraftedTabs)
      ? handcraftedTabs.map((t, i) => ({
          id: t.id || `tab-${i + 1}`,
          enabled: t.enabled !== false,
          label: t.label || `Tab ${i + 1}`,
          image: t.image || "",
          productSkus: Array.isArray(t.productSkus) ? t.productSkus.filter(Boolean) : [],
        }))
      : defaultHandcraftedTabs,
    sectionLayout: normalizeSectionLayout(sectionLayout),
  };
}

/** Structured cmsHome from API → flat form fields */
export function cmsHomeToFields(cms = {}) {
  const base = { ...defaultHomeFields };
  Object.keys(base).forEach((k) => {
    if (cms[k] !== undefined && typeof cms[k] === "string") base[k] = cms[k];
  });

  if (Array.isArray(cms.marquee) && cms.marquee.length) {
    base.marqueeText = cms.marquee.join("\n");
  }
  if (Array.isArray(cms.heroStats) && cms.heroStats.length) {
    cms.heroStats.forEach((pair, i) => {
      if (i < 3 && Array.isArray(pair)) {
        base[`heroStat${i + 1}Num`] = pair[0] || "";
        base[`heroStat${i + 1}Label`] = pair[1] || "";
      }
    });
  }
  if (Array.isArray(cms.trustBadges) && cms.trustBadges.length) {
    base.trustBadgesText = cms.trustBadges
      .map((b) => `${b.title || ""}|${b.subtitle || ""}`)
      .join("\n");
  }
  if (Array.isArray(cms.collectionBanners)) {
    cms.collectionBanners.forEach((b, i) => {
      const n = i + 1;
      if (n > 3) return;
      if (b.index != null) base[`banner${n}Index`] = b.index;
      if (b.tag != null) base[`banner${n}Tag`] = b.tag;
      if (b.title != null) base[`banner${n}Title`] = b.title;
      if (b.desc != null) base[`banner${n}Desc`] = b.desc;
      if (b.img != null) base[`banner${n}Img`] = b.img;
      if (b.link != null) base[`banner${n}Link`] = b.link;
    });
  }
  if (Array.isArray(cms.instagramImages) && cms.instagramImages.length) {
    base.instagramImagesText = cms.instagramImages.join("\n");
  }

  [
    "heroImage",
    "brandStoryImage",
    "editorialImage",
    "coutureImage",
    "editorialEyebrow",
    "editorialTitle",
    "editorialBody",
    "editorialCta",
    "coutureEyebrow",
    "coutureTitle",
    "coutureBody",
    "brandStoryBody1",
    "brandStoryBody2",
    "editEyebrow",
    "editTitle",
    "editTitleAccent",
    "editSubtitle",
  ].forEach((k) => {
    if (typeof cms[k] === "string") base[k] = cms[k];
  });

  return base;
}

export function extractHandcraftedTabs(cms = {}) {
  if (Array.isArray(cms.handcraftedTabs) && cms.handcraftedTabs.length) {
    return cms.handcraftedTabs.map((t, i) => ({
      id: t.id || `tab-${i + 1}`,
      enabled: t.enabled !== false,
      label: t.label || `Tab ${i + 1}`,
      image: t.image || "",
      productSkus: Array.isArray(t.productSkus) ? [...t.productSkus] : [],
    }));
  }
  return structuredClone(defaultHandcraftedTabs);
}

/**
 * Built-in home sections (storefront). Admin field groups map via adminGroups.
 * Removing a built-in only hides it — content is kept.
 */
export const BUILTIN_HOME_SECTIONS = [
  { id: "hero", label: "Hero", adminGroups: ["hero"] },
  { id: "marquee", label: "Marquee banner", adminGroups: ["marquee"] },
  { id: "category", label: "Shop by category", adminGroups: ["category"] },
  { id: "banners", label: "Collection banners", adminGroups: ["banners"] },
  {
    id: "handcrafted",
    label: "Handcrafted tabs",
    adminGroups: ["handcrafted", "handcraftedTabsEditor"],
  },
  { id: "edit", label: "Reinventing Tradition", adminGroups: ["edit"] },
  { id: "legacy", label: "Jadau & Polki legacy", adminGroups: ["legacy"] },
  { id: "celeb", label: "Celeb picks", adminGroups: ["celeb"] },
  { id: "editorial", label: "Editorial canvas", adminGroups: ["editorial"] },
  { id: "trust", label: "Trust badges", adminGroups: ["trust"] },
  { id: "stores", label: "Store locator", adminGroups: ["stores"] },
  { id: "couture", label: "Bridal custom suite", adminGroups: ["couture"] },
  { id: "testimonials", label: "Testimonials", adminGroups: ["testimonials"] },
  { id: "instagram", label: "Instagram feed", adminGroups: ["instagram"] },
];

export const BUILTIN_SECTION_IDS = BUILTIN_HOME_SECTIONS.map((s) => s.id);

export const defaultSectionLayout = {
  /** Built-in section ids that are hidden on the storefront (data kept) */
  hidden: [],
  /** Display order — built-in ids + custom-* ids */
  order: [...BUILTIN_SECTION_IDS],
  /** Extra content blocks added from admin */
  customSections: [],
};

export function createCustomSection(partial = {}) {
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

export function normalizeSectionLayout(layout) {
  const base = structuredClone(defaultSectionLayout);
  if (!layout || typeof layout !== "object") return base;

  const hidden = Array.isArray(layout.hidden)
    ? layout.hidden.filter((id) => BUILTIN_SECTION_IDS.includes(id))
    : [];

  const customSections = Array.isArray(layout.customSections)
    ? layout.customSections.map((c) => createCustomSection(c))
    : [];

  const customIds = new Set(customSections.map((c) => c.id));
  let order = Array.isArray(layout.order) ? [...layout.order] : [...BUILTIN_SECTION_IDS];

  // Keep known built-ins + customs; drop orphans
  order = order.filter((id) => BUILTIN_SECTION_IDS.includes(id) || customIds.has(id));

  // Ensure every built-in appears once in order
  BUILTIN_SECTION_IDS.forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });

  // Ensure every custom appears once
  customSections.forEach((c) => {
    if (!order.includes(c.id)) order.push(c.id);
  });

  return { hidden, order, customSections };
}

export function extractSectionLayout(cms = {}) {
  return normalizeSectionLayout(cms.sectionLayout);
}

/** Map admin field-group id → storefront section id */
export function adminGroupToSectionId(groupId) {
  const hit = BUILTIN_HOME_SECTIONS.find((s) => s.adminGroups.includes(groupId));
  return hit?.id || groupId;
}

export function isSectionHidden(sectionLayout, sectionId) {
  const layout = normalizeSectionLayout(sectionLayout);
  if (String(sectionId).startsWith("custom-")) {
    const c = layout.customSections.find((x) => x.id === sectionId);
    return !c || c.enabled === false;
  }
  return layout.hidden.includes(sectionId);
}
