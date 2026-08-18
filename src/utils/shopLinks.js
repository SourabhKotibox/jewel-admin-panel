/**
 * Map nav labels / collection slugs → /shop filter URLs.
 * Supports subtypes like "Diamond Rings", "Polki Earrings".
 */

const EXACT_CATEGORY = {
  "diamond rings": "Diamond Rings",
  "polki rings": "Polki Rings",
  "gold rings": "Gold Rings",
  "solitaire rings": "Solitaire Rings",
  "engagement rings": "Engagement Rings",
  "cocktail rings": "Cocktail Rings",
  "nose rings": "Nose Rings",
  "diamond necklaces": "Diamond Necklaces",
  "polki necklaces": "Polki Necklaces",
  "gold necklaces": "Gold Necklaces",
  "diamond earrings": "Diamond Earrings",
  "polki earrings": "Polki Earrings",
  "diamond bracelets": "Diamond Bracelets",
  "gold bracelets": "Gold Bracelets",
  "diamond pendants": "Diamond Pendants",
  "polki pendants": "Polki Pendants",
  "polki bangles": "Bangles",
  "diamond bangles": "Bangles",
  "bridal sets": "Bridal Sets",
  "polki sets": "Polki Sets",
  "diamond sets": "Diamond Sets",
  "maang tikkas": "Maang Tikkas",
  "maangtikas": "Maang Tikkas",
  "jhumka earrings": "Jhumkas",
  "jhumkas": "Jhumkas",
  "chandbalis": "Chandbalis",
  "polki chandbalis": "Chandbalis",
  "chokers": "Chokers",
  "beaded chokers": "Chokers",
  "polki chokers": "Chokers",
};

export function shopPath(slugOrLabel = "", extra = {}) {
  const raw = String(slugOrLabel || "").trim();
  if (!raw) {
    const q = new URLSearchParams(extraToParams(extra)).toString();
    return q ? `/shop?${q}` : "/shop";
  }

  if (raw.startsWith("/shop")) return appendExtra(raw, extra);
  if (raw.startsWith("/") && !raw.startsWith("/collections")) return raw;

  const s = raw
    .toLowerCase()
    .replace(/^\/collections\//, "")
    .replace(/\s+/g, "-");
  const phrase = s.replace(/-/g, " ");
  const params = new URLSearchParams(extraToParams(extra));

  if (
    !s ||
    s === "all" ||
    s === "all-jewellery" ||
    s === "shop" ||
    s === "jewellery" ||
    s === "jewelry"
  ) {
    const q = params.toString();
    return q ? `/shop?${q}` : "/shop";
  }

  if (s.includes("bridal") && !phrase.includes("set")) params.set("bridal", "1");
  if (s.includes("diamond")) params.set("diamond", "1");
  if (s.includes("polki") && !s.includes("access")) params.set("polki", "1");
  if (s.includes("ready") || s.includes("ships") || s.includes("3-day")) {
    params.set("stock", "1");
  }

  const isItemSpecific = /ring|bracelet|bangle|earring|top|choker|chain|neckless|necklace|pendent|pendant|set/i.test(raw);

  if (EXACT_CATEGORY[phrase]) {
    params.set("category", EXACT_CATEGORY[phrase]);
  } else if ((phrase.startsWith("silver") || phrase.startsWith("silvergold")) && isItemSpecific) {
    params.set("category", raw);
  } else if (phrase.includes("ring") && !phrase.includes("earring")) {
    params.set("category", "Rings");
  } else if (phrase.includes("necklace") || phrase.includes("choker") || phrase.includes("u necklace")) {
    params.set("category", phrase.includes("choker") ? "Chokers" : "Necklaces");
  } else if (phrase.includes("pendant")) {
    params.set("category", "Pendants");
  } else if (
    phrase.includes("earring") ||
    phrase.includes("chandbali") ||
    phrase.includes("jhumka") ||
    phrase.includes("tops")
  ) {
    params.set("category", "Earrings");
  } else if (phrase.includes("bracelet") || phrase.includes("kara")) {
    params.set("category", "Bracelets");
  } else if (phrase.includes("bangle")) {
    params.set("category", "Bangles");
  } else if (phrase.includes("tikka") || phrase.includes("accessor")) {
    params.set("category", "Accessories");
  } else if (phrase.includes("set")) {
    params.set("category", "Sets");
  }

  const q = params.toString();
  return q ? `/shop?${q}` : "/shop";
}

function extraToParams(extra = {}) {
  const o = {};
  Object.entries(extra).forEach(([k, v]) => {
    if (v === true || v === 1 || v === "1") o[k] = "1";
    else if (v != null && v !== "" && v !== false) o[k] = String(v);
  });
  return o;
}

function appendExtra(path, extra) {
  const [base, qs] = path.split("?");
  const params = new URLSearchParams(qs || "");
  Object.entries(extraToParams(extra)).forEach(([k, v]) => params.set(k, v));
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

/** Convert a stored CMS path like /collections/bridal-jewellery → /shop?... */
export function toShopHref(path = "") {
  const p = String(path || "").trim();
  if (!p || p === "#" || p === "/") return "/shop";
  if (p.startsWith("/shop")) return p;
  if (p.startsWith("/collections/") || !p.startsWith("/")) {
    return shopPath(p.replace(/^\/collections\//, ""));
  }
  return p;
}
