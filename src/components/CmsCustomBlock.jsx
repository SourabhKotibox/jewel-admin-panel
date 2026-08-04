import { Link } from "react-router-dom";
import { assetUrl } from "../api/client";

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

/** Shared custom CMS section used across storefront pages */
export default function CmsCustomBlock({ data }) {
  if (!data || data.enabled === false) return null;
  const image = resolveImg(data.image);
  const hasImage = Boolean(image);

  return (
    <section className="container-luxe py-14 md:py-20">
      <div
        className={`grid gap-8 lg:gap-14 items-center ${
          hasImage ? "lg:grid-cols-2" : "grid-cols-1 max-w-3xl mx-auto text-center"
        }`}
      >
        {hasImage && (
          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-stone-100">
            <img src={image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          {data.eyebrow && <p className="eyebrow mb-3">{data.eyebrow}</p>}
          {data.title && (
            <h2 className="heading-display text-3xl md:text-4xl text-noir leading-tight mb-5">
              {data.title}
            </h2>
          )}
          {data.body && (
            <p className="text-noir/70 text-sm md:text-base leading-relaxed mb-8">{data.body}</p>
          )}
          {data.cta && (
            <Link to={data.ctaLink || "/"} className="btn-outline">
              {data.cta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/** Render custom sections that appear after / between built-ins for a layout */
export function renderCustomInOrder(layout, BuiltinMap, props = {}) {
  const order = layout?.order || [];
  const hidden = new Set(layout?.hidden || []);
  const customMap = Object.fromEntries(
    (layout?.customSections || []).map((s) => [s.id, s])
  );

  return order.map((id) => {
    if (hidden.has(id)) return null;
    const custom = customMap[id];
    if (custom) {
      if (custom.enabled === false) return null;
      return <CmsCustomBlock key={id} data={custom} />;
    }
    const Comp = BuiltinMap[id];
    if (!Comp) return null;
    return <Comp key={id} {...props} />;
  });
}
