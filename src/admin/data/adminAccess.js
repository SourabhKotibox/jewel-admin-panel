/**
 * Frontend RBAC — mirrors backend intent.
 * sales: sales ops (orders, customers, support) — write allowed there
 * editor: CMS/content write — sales modules read-only / hidden write
 * manager/admin/superadmin: full write
 */

export const ROLE_LABELS = {
  superadmin: "Super Admin",
  admin: "Admin",
  manager: "Store Manager",
  sales: "Sales",
  editor: "Content Editor",
};

/** Nav path prefixes each role can see */
const NAV_ALLOW = {
  superadmin: "*",
  admin: "*",
  manager: "*",
  sales: [
    "/admin",
    "/admin/orders",
    "/admin/order-support",
    "/admin/invoices",
    "/admin/shipments",
    "/admin/refunds",
    "/admin/transactions",
    "/admin/reports",
    "/admin/customers",
    "/admin/coupons",
    "/admin/credentials",
  ],
  editor: [
    "/admin",
    "/admin/products",
    "/admin/market-rates",
    "/admin/categories",
    "/admin/attributes",
    "/admin/jewelry-types",
    "/admin/page-content",
    "/admin/dynamic-pages",
    "/admin/blog",
    "/admin/faqs",
    "/admin/media",
    "/admin/testimonials",
    "/admin/themes",
    "/admin/campaigns",
    "/admin/newsletter",
    "/admin/reviews",
    "/admin/credentials",
  ],
};

/** Paths where role may mutate (POST/PUT/DELETE) */
const WRITE_ALLOW = {
  superadmin: "*",
  admin: "*",
  manager: "*",
  sales: [
    "/admin/orders",
    "/admin/order-support",
    "/admin/shipments",
    "/admin/refunds",
    "/admin/customers",
    "/admin/invoices",
    "/admin/transactions",
  ],
  editor: [
    "/admin/products",
    "/admin/market-rates",
    "/admin/categories",
    "/admin/attributes",
    "/admin/jewelry-types",
    "/admin/page-content",
    "/admin/dynamic-pages",
    "/admin/blog",
    "/admin/faqs",
    "/admin/media",
    "/admin/testimonials",
    "/admin/campaigns",
    "/admin/newsletter",
    "/admin/reviews",
  ],
};

function matches(list, path) {
  if (list === "*") return true;
  if (!Array.isArray(list)) return false;
  const p = path.replace(/\/$/, "") || "/admin";
  return list.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
}

export function canSeePath(role, path) {
  return matches(NAV_ALLOW[role] || [], path);
}

export function canWritePath(role, path) {
  return matches(WRITE_ALLOW[role] || [], path);
}

export function canWriteEntity(role, entityKey) {
  const map = {
    orders: "/admin/orders",
    invoices: "/admin/invoices",
    shipments: "/admin/shipments",
    refunds: "/admin/refunds",
    transactions: "/admin/transactions",
    customers: "/admin/customers",
    products: "/admin/products",
    categories: "/admin/categories",
    attributes: "/admin/attributes",
    inventory: "/admin/inventory",
    "jewelry-types": "/admin/jewelry-types",
    coupons: "/admin/coupons",
    campaigns: "/admin/campaigns",
    reviews: "/admin/reviews",
    newsletter: "/admin/newsletter",
    blog: "/admin/blog",
    faqs: "/admin/faqs",
    media: "/admin/media",
    testimonials: "/admin/testimonials",
    stores: "/admin/stores",
    taxes: "/admin/taxes",
    roles: "/admin/roles",
    users: "/admin/users",
    "cms-pages": "/admin/cms-pages",
    "dynamic-pages": "/admin/dynamic-pages",
  };
  return canWritePath(role, map[entityKey] || "/admin");
}

export function isFullAdmin(role) {
  return ["superadmin", "admin", "manager"].includes(role);
}
