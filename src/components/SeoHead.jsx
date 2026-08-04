import { Helmet } from "react-helmet-async";
import useSettingsStore from "../store/useSettingsStore";
import { assetUrl } from "../api/client";

function resolveFavicon(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

/**
 * Per-page SEO: browser tab title, description, keywords, favicon.
 * Tab shows: "About Us | Madhu Jewellery" (page name + brand).
 */
export default function SeoHead({
  title,
  description,
  keywords,
  image,
  type = "website",
  noIndex = false,
}) {
  const business = useSettingsStore((s) => s.business) || {};
  const site =
    business.businessName ||
    business.legalName ||
    "Madhu Jewellery";
  const faviconHref = resolveFavicon(business.favicon);

  const pageTitle = String(title || "").trim();
  const fullTitle = !pageTitle
    ? site
    : pageTitle === site || pageTitle.includes(site)
    ? pageTitle
    : `${pageTitle} | ${site}`;

  const desc =
    description ||
    business.tagline ||
    "Discover handcrafted Polki, Jadau and diamond jewellery by Madhu — bridal, festive and everyday luxury.";
  const keys =
    keywords ||
    "Madhu jewellery, Polki, Jadau, bridal jewellery, diamond jewellery, India";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keys} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
      {faviconHref ? (
        <>
          <link rel="icon" href={faviconHref} />
          <link rel="shortcut icon" href={faviconHref} />
          <link rel="apple-touch-icon" href={faviconHref} />
        </>
      ) : null}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site} />
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}
