/**
 * Field groups + section layouts for Product, Cart, Checkout, Wishlist, Search, Account.
 * Same capabilities as Home: hide/show/reorder/add custom sections.
 */

import {
  makeSectionLayoutHelpers,
  mergeFieldsFromCms,
  createCustomSection,
} from "./pageCmsKit";

function definePage({ fieldGroups, builtinSections, defaultFields }) {
  const helpers = makeSectionLayoutHelpers(builtinSections);
  const toCms = (fields, sectionLayout) => ({
    ...defaultFields,
    ...fields,
    sectionLayout: helpers.normalize(sectionLayout),
  });
  const toFields = (cms = {}) => mergeFieldsFromCms(defaultFields, cms);
  return {
    fieldGroups,
    builtinSections,
    defaultFields,
    defaultSectionLayout: helpers.defaultLayout,
    normalizeSectionLayout: helpers.normalize,
    extractSectionLayout: helpers.extract,
    adminGroupToSectionId: helpers.adminGroupToSectionId,
    isSectionHidden: helpers.isHidden,
    createCustomSection,
    fieldsToCms: toCms,
    cmsToFields: toFields,
  };
}

export const productCms = definePage({
  fieldGroups: [
    {
      id: "actions",
      label: "1 · Buy actions",
      keys: ["addToBag", "buyNow", "shareLabel", "wishlistLabel"],
    },
    {
      id: "info",
      label: "2 · Specs & info labels",
      keys: ["specifications", "description"],
    },
    {
      id: "shipping",
      label: "3 · Shipping & returns",
      keys: ["shippingTitle", "shippingBody", "returnsTitle", "returnsBody"],
    },
    {
      id: "completeLook",
      label: "4 · Complete the look",
      keys: ["completeLook"],
    },
  ],
  builtinSections: [
    { id: "actions", label: "Buy actions", adminGroups: ["actions"] },
    { id: "info", label: "Specs & info", adminGroups: ["info"] },
    { id: "shipping", label: "Shipping & returns", adminGroups: ["shipping"] },
    { id: "completeLook", label: "Complete the look", adminGroups: ["completeLook"] },
  ],
  defaultFields: {
    addToBag: "Add to Cart",
    buyNow: "Buy Now",
    completeLook: "Complete the Look",
    specifications: "Specifications",
    description: "Description",
    shareLabel: "Share",
    wishlistLabel: "Save to Wishlist",
    shippingTitle: "Shipping & Delivery",
    shippingBody:
      "Free insured shipping on eligible orders. Made-to-order pieces ship within the stated timeline.",
    returnsTitle: "Returns & Buyback",
    returnsBody:
      "Lifetime buyback available on hallmarked gold jewellery as per store policy.",
  },
});

export const cartCms = definePage({
  fieldGroups: [
    {
      id: "empty",
      label: "1 · Empty bag",
      keys: ["emptyTitle", "emptySubtitle", "emptyCta"],
    },
    {
      id: "header",
      label: "2 · Bag header",
      keys: ["title"],
    },
    {
      id: "summary",
      label: "3 · Bag summary",
      keys: ["summaryTitle", "checkoutCta", "subtotalLabel", "trustNote"],
    },
  ],
  builtinSections: [
    { id: "empty", label: "Empty bag state", adminGroups: ["empty"] },
    { id: "header", label: "Bag header", adminGroups: ["header"] },
    { id: "summary", label: "Bag summary", adminGroups: ["summary"] },
  ],
  defaultFields: {
    emptyTitle: "Your Cart is Empty",
    emptySubtitle: "Discover our handcrafted collections and add pieces you love.",
    emptyCta: "Continue Shopping",
    title: "Your Cart",
    summaryTitle: "Order Summary",
    checkoutCta: "Proceed to Checkout",
    subtotalLabel: "Subtotal",
    trustNote: "Secure checkout · Certified jewellery",
  },
});

export const checkoutCms = definePage({
  fieldGroups: [
    {
      id: "empty",
      label: "1 · Empty checkout",
      keys: ["emptyTitle", "emptySubtitle", "emptyCta"],
    },
    {
      id: "form",
      label: "2 · Form sections",
      keys: ["contactTitle", "deliveryTitle", "paymentTitle"],
    },
    {
      id: "summary",
      label: "3 · Order summary",
      keys: ["orderSummary", "placeOrder"],
    },
  ],
  builtinSections: [
    { id: "empty", label: "Empty state", adminGroups: ["empty"] },
    { id: "form", label: "Checkout form", adminGroups: ["form"] },
    { id: "summary", label: "Order summary", adminGroups: ["summary"] },
  ],
  defaultFields: {
    emptyTitle: "Your Cart is Empty",
    emptySubtitle: "Add pieces to your cart before checking out.",
    emptyCta: "Continue Shopping",
    contactTitle: "Contact",
    deliveryTitle: "Delivery",
    paymentTitle: "Payment",
    placeOrder: "Place Order",
    orderSummary: "Order Summary",
  },
});

export const wishlistCms = definePage({
  fieldGroups: [
    {
      id: "header",
      label: "1 · Header",
      keys: ["eyebrow", "title"],
    },
    {
      id: "empty",
      label: "2 · Empty state",
      keys: ["emptyTitle", "emptySubtitle", "emptyCta"],
    },
  ],
  builtinSections: [
    { id: "header", label: "Header", adminGroups: ["header"] },
    { id: "empty", label: "Empty state", adminGroups: ["empty"] },
  ],
  defaultFields: {
    eyebrow: "Saved",
    title: "Your Wishlist",
    emptyTitle: "No saved pieces yet",
    emptySubtitle: "Tap the heart on any product to save it here.",
    emptyCta: "Start Shopping",
  },
});

export const searchCms = definePage({
  fieldGroups: [
    {
      id: "header",
      label: "1 · Results header",
      keys: ["eyebrow", "titlePrefix"],
    },
    {
      id: "empty",
      label: "2 · Empty results",
      keys: ["emptyTitle", "emptySubtitle", "browseCta"],
    },
  ],
  builtinSections: [
    { id: "header", label: "Results header", adminGroups: ["header"] },
    { id: "empty", label: "Empty results", adminGroups: ["empty"] },
  ],
  defaultFields: {
    eyebrow: "Search Results",
    titlePrefix: "Results for",
    emptyTitle: "No matches found",
    emptySubtitle: "Try a different keyword or browse collections.",
    browseCta: "Browse Collections",
  },
});

export const accountCms = definePage({
  fieldGroups: [
    {
      id: "header",
      label: "1 · Account header",
      keys: ["title"],
    },
    {
      id: "auth",
      label: "2 · Login / Register",
      keys: ["loginTitle", "registerTitle", "loginCta", "registerCta"],
    },
    {
      id: "tabs",
      label: "3 · Account tabs",
      keys: ["ordersTab", "profileTab", "addressesTab"],
    },
  ],
  builtinSections: [
    { id: "header", label: "Header", adminGroups: ["header"] },
    { id: "auth", label: "Login / Register", adminGroups: ["auth"] },
    { id: "tabs", label: "Account tabs", adminGroups: ["tabs"] },
  ],
  defaultFields: {
    title: "My Account",
    loginTitle: "Welcome Back",
    registerTitle: "Create Account",
    ordersTab: "Orders",
    profileTab: "Profile",
    addressesTab: "Addresses",
    loginCta: "Sign In",
    registerCta: "Create Account",
  },
});

export const SECONDARY_PAGE_CMS = {
  product: productCms,
  cart: cartCms,
  checkout: checkoutCms,
  wishlist: wishlistCms,
  search: searchCms,
  account: accountCms,
};
