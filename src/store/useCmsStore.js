import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultHomeFields,
  defaultHandcraftedTabs,
  defaultSectionLayout,
} from "../admin/data/homeCmsFields";
import { getPageCms, PAGE_CMS_REGISTRY } from "../admin/data/pageCmsRegistry";

function buildDefaultPages() {
  const pages = {
    home: {
      label: "Home",
      path: "/",
      fields: { ...defaultHomeFields },
      handcraftedTabs: structuredClone(defaultHandcraftedTabs),
      sectionLayout: structuredClone(defaultSectionLayout),
    },
  };

  const meta = {
    about: { label: "About", path: "/about" },
    stores: { label: "Stores", path: "/stores" },
    contact: { label: "Contact Us", path: "/contact" },
    collection: { label: "Collection", path: "/shop" },
    product: { label: "Product Detail", path: "/products/:slug" },
    cart: { label: "Cart / Bag", path: "/cart" },
    checkout: { label: "Checkout", path: "/checkout" },
    wishlist: { label: "Wishlist", path: "/wishlist" },
    search: { label: "Search", path: "/search" },
    account: { label: "Account", path: "/account" },
    footer: { label: "Navbar & Footer", path: "global" },
  };

  Object.entries(meta).forEach(([key, m]) => {
    const cfg = PAGE_CMS_REGISTRY[key];
    pages[key] = {
      label: m.label,
      path: m.path,
      fields: { ...(cfg?.defaultFields || {}) },
      sectionLayout: structuredClone(cfg?.defaultSectionLayout || {
        hidden: [],
        order: [],
        customSections: [],
      }),
    };
  });

  return pages;
}

/** Default copy for every storefront page — editable from Admin → CMS */
export const defaultPageContent = buildDefaultPages();

const useCmsStore = create(
  persist(
    (set, get) => ({
      pages: structuredClone(defaultPageContent),

      updateField: (pageKey, fieldKey, value) =>
        set((state) => ({
          pages: {
            ...state.pages,
            [pageKey]: {
              ...state.pages[pageKey],
              fields: {
                ...state.pages[pageKey].fields,
                [fieldKey]: value,
              },
            },
          },
        })),

      updatePageFields: (pageKey, fields) =>
        set((state) => ({
          pages: {
            ...state.pages,
            [pageKey]: {
              ...state.pages[pageKey],
              fields: { ...state.pages[pageKey].fields, ...fields },
            },
          },
        })),

      setHandcraftedTabs: (tabs) =>
        set((state) => ({
          pages: {
            ...state.pages,
            home: {
              ...state.pages.home,
              handcraftedTabs: tabs,
            },
          },
        })),

      /** Home (legacy name) */
      setSectionLayout: (sectionLayout) =>
        set((state) => ({
          pages: {
            ...state.pages,
            home: {
              ...state.pages.home,
              sectionLayout,
            },
          },
        })),

      /** Generic: set section layout for any page key */
      setPageSectionLayout: (pageKey, sectionLayout) =>
        set((state) => ({
          pages: {
            ...state.pages,
            [pageKey]: {
              ...state.pages[pageKey],
              sectionLayout,
            },
          },
        })),

      setAboutSectionLayout: (sectionLayout) =>
        get().setPageSectionLayout("about", sectionLayout),

      setStoresSectionLayout: (sectionLayout) =>
        get().setPageSectionLayout("stores", sectionLayout),

      resetPage: (pageKey) =>
        set((state) => ({
          pages: {
            ...state.pages,
            [pageKey]: structuredClone(defaultPageContent[pageKey]),
          },
        })),

      resetAll: () => set({ pages: structuredClone(defaultPageContent) }),

      getField: (pageKey, fieldKey) => get().pages[pageKey]?.fields?.[fieldKey] ?? "",

      getPageCmsConfig: (pageKey) => getPageCms(pageKey),
    }),
    { name: "madhu-cms-content-v10" }
  )
);

export default useCmsStore;
