/**
 * Global layout CMS — announcement bar, navbar, footer links.
 * Stored in Mongo as settings key `cmsLayout`.
 */

import { navMenu as defaultNavMenuData } from "../../data/index.js";
import {
  makeSectionLayoutHelpers,
  createCustomSection,
} from "./pageCmsKit";

export function serializeNavMenu(menu) {
  return JSON.stringify(menu || [], null, 2);
}

export function parseNavMenu(text, fallback = defaultNavMenuData) {
  try {
    const parsed = JSON.parse(String(text || "[]"));
    if (!Array.isArray(parsed)) return structuredClone(fallback);
    return parsed.map((m) => ({
      label: m.label || "Menu",
      slug: m.slug || "all-jewellery",
      direct: !!m.direct,
      featuredImage: m.featuredImage || "",
      columns: Array.isArray(m.columns)
        ? m.columns.map((c) => ({
            heading: c.heading || "",
            items: Array.isArray(c.items) ? c.items.map(String) : [],
          }))
        : undefined,
    }));
  } catch {
    return structuredClone(fallback);
  }
}

export function parseLinkLines(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((row) => {
      const [label, path = ""] = row.split("|").map((x) => x.trim());
      return {
        label,
        path:
          path ||
          `/shop`,
      };
    });
}

export function serializeLinkLines(links) {
  return (links || []).map((l) => `${l.label}|${l.path}`).join("\n");
}

export const LAYOUT_FIELD_GROUPS = [
  {
    id: "announcement",
    label: "1 · Announcement bar",
    special: "announcementEditor",
    keys: ["announcement1", "announcement2", "announcement3"],
  },
  {
    id: "nav",
    label: "2 · Navbar menu",
    special: "navbarEditor",
    keys: [
      "searchPlaceholder",
      "megaDiscoverLabel",
      "megaCollectionSuffix",
      "navMenuJson",
    ],
  },
  {
    id: "footer",
    label: "3 · Footer links & copy",
    special: "footerEditor",
    keys: [
      "shopHeading",
      "shopLinksText",
      "exploreHeading",
      "exploreLinksText",
      "moreHeading",
      "moreLinksText",
      "benefitsHeading",
      "benefitsText",
      "joinCta",
      "emailPlaceholder",
      "copyright",
      "whatsappText",
    ],
  },
];

export const BUILTIN_LAYOUT_SECTIONS = [
  { id: "announcement", label: "Announcement bar", adminGroups: ["announcement"] },
  { id: "nav", label: "Navbar", adminGroups: ["nav"] },
  { id: "footer", label: "Footer", adminGroups: ["footer"] },
];

const layoutHelpers = makeSectionLayoutHelpers(BUILTIN_LAYOUT_SECTIONS);
export const defaultLayoutSectionLayout = layoutHelpers.defaultLayout;
export const normalizeLayoutSectionLayout = layoutHelpers.normalize;
export const extractLayoutSectionLayout = layoutHelpers.extract;
export const layoutAdminGroupToSectionId = layoutHelpers.adminGroupToSectionId;
export const isLayoutSectionHidden = layoutHelpers.isHidden;
export const createLayoutCustomSection = createCustomSection;

export const defaultLayoutFields = {
  announcement1: "Complimentary shipping outside India on orders above INR 200,000",
  announcement2: "Download the Madhu App & Get ₹5,000 Off",
  announcement3: "Welcome to our store — Talk to us on +91 96195 87978",

  searchPlaceholder: "Search our site...",
  megaDiscoverLabel: "Discover",
  megaCollectionSuffix: "Collection",
  navMenuJson: serializeNavMenu(defaultNavMenuData),

  shopHeading: "Shop",
  shopLinksText: [
    "Necklaces|/shop?category=Necklaces",
    "Earrings|/shop?category=Earrings",
    "Rings|/shop?category=Rings",
    "Diamond Rings|/shop?category=Diamond+Rings",
    "Bracelets|/shop?category=Bracelets",
    "Maang Tikkas|/shop?category=Maang+Tikkas",
  ].join("\n"),
  exploreHeading: "Explore",
  exploreLinksText: [
    "Lumina by Madhu|/shop",
    "Aurora by Madhu|/shop",
    "Noor by Madhu|/shop",
    "Bestsellers|/shop",
    "Gifting|/shop",
  ].join("\n"),
  moreHeading: "More",
  moreLinksText: [
    "About Us|/about",
    "Contact Us|/contact",
    "Track Order|/track-order",
    "Stores|/stores",
    "FAQs|/faq",
    "Blog|/blog",
    "Shop all|/shop",
    "Terms & Conditions|/pages/terms-conditions",
    "Privacy Policy|/pages/privacy-policy",
  ].join("\n"),
  benefitsHeading: "Exclusive Benefits",
  benefitsText: "Apply for free membership to receive exclusive deals, news, and events.",
  joinCta: "Join",
  emailPlaceholder: "Enter email here",
  copyright: "Madhu Jewellery Private Limited. All Rights Reserved.",
  whatsappText: "Chat with us",
};

export function fieldsToCmsLayout(fields, sectionLayout) {
  const f = { ...defaultLayoutFields, ...fields };
  return {
    ...f,
    navMenu: parseNavMenu(f.navMenuJson),
    shopLinks: parseLinkLines(f.shopLinksText),
    exploreLinks: parseLinkLines(f.exploreLinksText),
    moreLinks: parseLinkLines(f.moreLinksText),
    sectionLayout: normalizeLayoutSectionLayout(sectionLayout),
  };
}

export function cmsLayoutToFields(cms = {}) {
  const base = { ...defaultLayoutFields };
  Object.keys(base).forEach((k) => {
    if (cms[k] !== undefined && typeof cms[k] === "string") base[k] = cms[k];
  });
  if (Array.isArray(cms.navMenu) && cms.navMenu.length) {
    base.navMenuJson = serializeNavMenu(cms.navMenu);
  }
  if (Array.isArray(cms.shopLinks) && cms.shopLinks.length) {
    base.shopLinksText = serializeLinkLines(cms.shopLinks);
  }
  if (Array.isArray(cms.exploreLinks) && cms.exploreLinks.length) {
    base.exploreLinksText = serializeLinkLines(cms.exploreLinks);
  }
  if (Array.isArray(cms.moreLinks) && cms.moreLinks.length) {
    base.moreLinksText = serializeLinkLines(cms.moreLinks);
  }
  return base;
}
