/** Map Page Content sidebar keys → Mongo settings keys + converters */

import { fieldsToCmsHome, cmsHomeToFields } from "./homeCmsFields";
import { getPageCms } from "./pageCmsRegistry";

export const CMS_SETTINGS_KEY = {
  home: "cmsHome",
  about: "cmsAbout",
  stores: "cmsStores",
  contact: "cmsContact",
  footer: "cmsLayout",
  collection: "cmsCollection",
  product: "cmsProduct",
  cart: "cmsCart",
  checkout: "cmsCheckout",
  wishlist: "cmsWishlist",
  search: "cmsSearch",
  account: "cmsAccount",
};

export function toSettingsValue(pageKey, pages) {
  const page = pages[pageKey];
  if (!page) return {};

  if (pageKey === "home") {
    return fieldsToCmsHome(
      page.fields,
      page.handcraftedTabs,
      page.sectionLayout
    );
  }

  const cfg = getPageCms(pageKey);
  if (cfg?.fieldsToCms) {
    return cfg.fieldsToCms(page.fields, page.sectionLayout);
  }
  return { ...page.fields, sectionLayout: page.sectionLayout };
}

export function fromSettingsValue(pageKey, value) {
  if (!value || typeof value !== "object") return null;

  if (pageKey === "home") {
    return { fields: cmsHomeToFields(value), raw: value };
  }

  const cfg = getPageCms(pageKey);
  if (cfg?.cmsToFields) {
    return {
      fields: cfg.cmsToFields(value),
      raw: value,
      sectionLayout: cfg.extract(value),
    };
  }
  return { fields: value, raw: value };
}
