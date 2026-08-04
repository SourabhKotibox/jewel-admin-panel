/**
 * API client — separate JWT for admin vs storefront user
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const ORIGIN = API_URL.replace(/\/api\/?$/, "");

export const TOKEN_KEYS = {
  admin: "madhu_admin_token",
  user: "madhu_user_token",
  legacy: "madhu_token",
};

export const USER_KEYS = {
  admin: "madhu_admin_user",
  user: "madhu_user_user",
  legacy: "madhu_user",
};

export function getToken(portal = "admin") {
  if (portal === "admin") {
    return localStorage.getItem(TOKEN_KEYS.admin) || localStorage.getItem(TOKEN_KEYS.legacy);
  }
  // Never fall back to admin/legacy token on the storefront
  return localStorage.getItem(TOKEN_KEYS.user);
}

export function assetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function api(path, { method = "GET", body, token, portal = "admin", formData } = {}) {
  const headers = {};
  const authToken = token || getToken(portal);
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: payload,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function uploadFile(file, { used = "", name, portal = "admin" } = {}) {
  const fd = new FormData();
  fd.append("file", file);
  if (name) fd.append("name", name);
  if (used) fd.append("used", used);
  return api("/upload", { method: "POST", formData: fd, portal });
}

/** Map admin entity keys → API paths */
export const ENTITY_API = {
  inventory: "/inventory",
  invoices: "/invoices",
  shipments: "/shipments",
  refunds: "/refunds",
  transactions: "/transactions",
  attributes: "/attributes",
  customers: "/customers",
  coupons: "/coupons",
  campaigns: "/campaigns",
  reviews: "/reviews",
  newsletter: "/newsletter",
  "cms-pages": "/cms-pages",
  "dynamic-pages": "/dynamic-pages",
  faqs: "/faqs",
  blog: "/blog",
  taxes: "/taxes",
  roles: "/roles",
  users: "/auth/admin/users",
  categories: "/categories",
  stores: "/stores",
  testimonials: "/testimonials",
  media: "/media",
  orders: "/orders",
  products: "/products",
};

export { API_URL, ORIGIN };
