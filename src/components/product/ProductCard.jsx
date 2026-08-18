import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "../../data";
import { assetUrl } from "../../api/client";
import useCartStore from "../../store/useCartStore";
import useWishlistStore from "../../store/useWishlistStore";

export const PRODUCT_CARD_ASPECT = "aspect-[3/4]";
export const PRODUCT_IMAGE_HINT =
  "Recommended: 1200 × 1600 px (3:4 portrait). JPG or WebP, under 2 MB.";

export default function ProductCard({ product, image }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const wishlisted = useWishlistStore((s) =>
    s.items.some(
      (i) => String(i.id || i.sku) === String(product.id || product.sku || "")
    )
  );
  const [justAdded, setJustAdded] = useState(false);

  const id = String(product.id || product.sku || "");
  const inCart = cartItems.some((i) => String(i.id) === id);
  const tracksStock = product.manageStock !== false;
  const outOfStock =
    tracksStock &&
    !(product.variants || []).length &&
    Number(product.stock) <= 0;
  const src = assetUrl(image || product.images?.[0]);
  const href = `/products/${product.slug || product.sku || id}`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || inCart) return;
    addItem({
      ...product,
      id,
      slug: product.slug || product.sku || id,
      images: (product.images || []).map((img) => assetUrl(img)).filter(Boolean),
      stock: product.stock,
      manageStock: product.manageStock !== false,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      ...product,
      id,
      slug: product.slug || product.sku || id,
      images: (product.images || []).map((img) => assetUrl(img)).filter(Boolean),
    });
  };

  return (
    <div className="group relative h-full flex flex-col">
      <div className={`relative overflow-hidden rounded-sm bg-stone-100 ${PRODUCT_CARD_ASPECT} shrink-0`}>
        <Link to={href} className="absolute inset-0 block z-0" aria-label={product.name}>
          {src ? (
            <img
              src={src}
              alt={product.name}
              width={600}
              height={800}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest2 text-noir/30">
              No image
            </div>
          )}
        </Link>

        {product.tag && (
          <span className="absolute top-3 left-3 bg-noir/85 text-champagne-light text-[10px] uppercase tracking-wide px-3 py-1.5 z-[2] pointer-events-none">
            {product.tag}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-[3] p-2.5 rounded-full shadow-sm transition-colors ${
            wishlisted
              ? "bg-maroon text-ivory"
              : "bg-ivory/95 text-noir hover:bg-ivory"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <Heart size={16} className={wishlisted ? "fill-current" : ""} strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`absolute bottom-0 left-0 right-0 z-[3] bg-noir/90 text-champagne-light text-[11px] uppercase tracking-wide py-3 flex items-center justify-center gap-1.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ${
            outOfStock ? "cursor-not-allowed opacity-70 group-hover:opacity-70" : ""
          }`}
        >
          {outOfStock ? (
            "Out of stock"
          ) : justAdded || inCart ? (
            <>
              <Check size={13} /> {justAdded ? "Added" : "In Cart"}
            </>
          ) : (
            <>
              <ShoppingBag size={13} /> Add to Cart
            </>
          )}
        </button>
      </div>

      <div className="mt-3.5 space-y-1 flex-1">
        {product.celeb ? (
          <p className="text-[10px] uppercase tracking-widest2 text-champagne-dark">
            {product.celeb}
          </p>
        ) : null}
        <Link to={href}>
          <h3 className="text-[15px] font-medium text-noir leading-snug line-clamp-2 hover:text-champagne-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-noir/60">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
