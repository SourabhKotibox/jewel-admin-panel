/**
 * Recommended image resolutions for admin upload fields.
 * Used under every image section so editors know what to upload.
 */

export const IMAGE_RESOLUTIONS = {
  // Products
  product: "1200 × 1600 px (3:4 portrait) · JPG/WebP · under 2 MB",
  images: "1200 × 1600 px (3:4 portrait) · JPG/WebP · under 2 MB",
  cover: "1600 × 900 px (16:9) or 1200 × 1600 px (3:4) · under 2 MB",

  // Full-bleed heroes / banners
  heroImage: "1920 × 1080 px (16:9) · full-bleed · under 2.5 MB",
  defaultBgImage: "1920 × 1080 px (16:9) · under 2.5 MB",
  banner1Img: "1200 × 1500 px (4:5) · under 2 MB",
  banner2Img: "1200 × 1500 px (4:5) · under 2 MB",
  banner3Img: "1200 × 1500 px (4:5) · under 2 MB",

  // Editorial / story
  brandStoryImage: "1400 × 1600 px (near 7:8) · under 2 MB",
  editorialImage: "1800 × 1200 px (3:2 landscape) · under 2.5 MB",
  coutureImage: "1400 × 1600 px · under 2 MB",
  visitImage: "1400 × 1000 px (7:5) · under 2 MB",
  ctaImage: "1400 × 1000 px (7:5) · under 2 MB",

  // Grids / cards
  instagramImagesText: "800 × 800 px (1:1 square) · under 1 MB each",
  featuredImage: "800 × 1000 px (4:5) · mega-menu · under 1 MB",
  image: "1200 × 1500 px (4:5) · under 2 MB",
  img: "1200 × 900 px (4:3) · under 2 MB",
  photo: "1200 × 1200 px (1:1) · under 1.5 MB",
  avatar: "400 × 400 px (1:1) · under 500 KB",

  // Brand
  storefrontLogo: "Transparent PNG · min 600 px wide · under 500 KB",
  adminLogo: "Transparent PNG · min 400 px wide · under 300 KB",
  favicon: "32 × 32 or 64 × 64 px · PNG/ICO · under 100 KB",

  // Campaign / media
  campaign: "1600 × 900 px (16:9) · under 2 MB",
  url: "Match intended use (hero 1920×1080, product 1200×1600, square 800×800)",
};

export const IMAGE_ASPECTS = {
  product: "aspect-[3/4]",
  images: "aspect-[3/4]",
  cover: "aspect-video",
  heroImage: "aspect-video",
  defaultBgImage: "aspect-video",
  banner1Img: "aspect-[4/5]",
  banner2Img: "aspect-[4/5]",
  banner3Img: "aspect-[4/5]",
  brandStoryImage: "aspect-[7/8]",
  editorialImage: "aspect-[3/2]",
  coutureImage: "aspect-[7/8]",
  visitImage: "aspect-[7/5]",
  ctaImage: "aspect-[7/5]",
  instagramImagesText: "aspect-square",
  featuredImage: "aspect-[4/5]",
  image: "aspect-[4/5]",
  img: "aspect-[4/3]",
  photo: "aspect-square",
  avatar: "aspect-square",
  favicon: "aspect-square",
  campaign: "aspect-video",
};

const FALLBACK_SINGLE = "1600 × 900 px (16:9) or 1200 × 1600 px (3:4) · under 2 MB";
const FALLBACK_MULTI = "1200 × 1600 px (3:4 portrait) · under 2 MB each";

/** Resolve hint from field key / entity context */
export function resolutionFor(fieldKey = "", entityKey = "") {
  const k = String(fieldKey || "").trim();
  if (IMAGE_RESOLUTIONS[k]) return IMAGE_RESOLUTIONS[k];

  const lower = k.toLowerCase();
  if (lower.includes("hero")) return IMAGE_RESOLUTIONS.heroImage;
  if (lower.includes("banner")) return IMAGE_RESOLUTIONS.banner1Img;
  if (lower.includes("instagram")) return IMAGE_RESOLUTIONS.instagramImagesText;
  if (lower.includes("logo")) return IMAGE_RESOLUTIONS.storefrontLogo;
  if (lower.includes("favicon")) return IMAGE_RESOLUTIONS.favicon;
  if (lower.includes("avatar")) return IMAGE_RESOLUTIONS.avatar;
  if (lower.includes("cover")) return IMAGE_RESOLUTIONS.cover;
  if (lower.includes("bg") || lower.includes("background")) return IMAGE_RESOLUTIONS.defaultBgImage;
  if (lower.includes("editorial") || lower.includes("story")) return IMAGE_RESOLUTIONS.brandStoryImage;
  if (lower.endsWith("img") || lower.includes("photo")) return IMAGE_RESOLUTIONS.img;
  if (entityKey === "products" || lower === "images" || lower.includes("product")) {
    return IMAGE_RESOLUTIONS.product;
  }
  if (entityKey === "campaigns") return IMAGE_RESOLUTIONS.campaign;
  if (entityKey === "customers" || entityKey === "testimonials") return IMAGE_RESOLUTIONS.avatar;
  if (entityKey === "categories" || entityKey === "stores") return IMAGE_RESOLUTIONS.img;
  if (entityKey === "blog") return IMAGE_RESOLUTIONS.cover;

  if (lower.includes("images") || lower.endsWith("imagestext")) return FALLBACK_MULTI;
  return FALLBACK_SINGLE;
}

export function aspectFor(fieldKey = "") {
  const k = String(fieldKey || "").trim();
  if (IMAGE_ASPECTS[k]) return IMAGE_ASPECTS[k];
  const lower = k.toLowerCase();
  if (lower.includes("hero") || lower.includes("bg") || lower.includes("cover")) return "aspect-video";
  if (lower.includes("instagram") || lower.includes("avatar") || lower.includes("favicon")) {
    return "aspect-square";
  }
  if (lower.includes("product") || lower === "images") return "aspect-[3/4]";
  return "aspect-[4/3]";
}
