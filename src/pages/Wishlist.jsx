import { Link } from "react-router-dom";
import useWishlistStore from "../store/useWishlistStore";
import ProductCard from "../components/product/ProductCard";
import CmsCustomBlock from "../components/CmsCustomBlock";
import useCmsPage from "../hooks/useCmsPage";
import SeoHead from "../components/SeoHead";

export default function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const { fields: c, isHidden, customSections } = useCmsPage("wishlist");

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead title="Wishlist" />
      <div className="container-luxe py-16 md:py-24">
        {!isHidden("header") && (
          <>
            <p className="eyebrow mb-2">{c.eyebrow}</p>
            <h1 className="heading-display text-3xl md:text-4xl text-noir mb-10">{c.title}</h1>
          </>
        )}

        {items.length === 0 ? (
          !isHidden("empty") && (
            <div className="text-center py-16">
              <p className="heading-display text-2xl text-noir mb-2">{c.emptyTitle}</p>
              <p className="text-noir/60 mb-6">{c.emptySubtitle}</p>
              <Link to="/shop" className="link-underline text-sm">
                {c.emptyCta || "Start Shopping"}
              </Link>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} image={product.images?.[0]} />
            ))}
          </div>
        )}
      </div>
      {customSections.map((s) => (
        <CmsCustomBlock key={s.id} data={s} />
      ))}
    </div>
  );
}
