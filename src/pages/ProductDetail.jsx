import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { ShieldCheck, Truck, RotateCcw, Award, ChevronDown, ShoppingBag, Zap, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { products as fallbackProducts, formatPrice } from "../data";
import ProductCard from "../components/product/ProductCard";
import CarouselNav, { carouselAutoplay } from "../components/CarouselNav";
import useCartStore from "../store/useCartStore";
import useWishlistStore from "../store/useWishlistStore";
import useCmsPage from "../hooks/useCmsPage";
import CmsCustomBlock from "../components/CmsCustomBlock";
import { api, assetUrl } from "../api/client";
import { formatAttrLabel, orderedSpecEntries } from "../utils/jewelleryLabels";
import useSettingsStore from "../store/useSettingsStore";
import { useSelector } from "react-redux";
import SeoHead from "../components/SeoHead";

function normalizeProduct(p) {
  return {
    ...p,
    id: p.sku || p.id || String(p._id),
    slug: p.slug || p.sku,
    images: (p.images || []).map((img) => assetUrl(img)).filter(Boolean),
    attributes: p.attributes || p.specifications || {},
    specifications: p.specifications || p.attributes || {},
    variants: p.variants || [],
  };
}

function Stars({ rating }) {
  const n = Math.round(Number(rating) || 0);
  return (
    <span className="text-champagne-dark tracking-tight" aria-label={`${n} of 5`}>
      {"★".repeat(n)}
      <span className="text-noir/20">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const lookSwiperRef = useRef(null);
  const customerToken = useSelector((s) => s.auth.customerToken);
  const [activeImage, setActiveImage] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState("specs");
  const [paymentType, setPaymentType] = useState("full");
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewErr, setReviewErr] = useState("");
  const [selectedVariantSku, setSelectedVariantSku] = useState("");
  const [catalog, setCatalog] = useState(fallbackProducts);
  const { fields: c, isHidden, customSections } = useCmsPage("product");

  const { items, addItem, removeItem, openCart } = useCartStore();
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await api("/products").catch(() => []);
        if (cancelled) return;
        if (Array.isArray(rows) && rows.length) {
          setCatalog(
            rows.map((p) => ({
              ...p,
              id: p.sku || p.id || String(p._id),
              slug: p.slug || p.sku,
               images: (p.images || []).map((img) => assetUrl(img)).filter(Boolean),
              attributes: p.attributes || p.specifications || {},
              specifications: p.specifications || p.attributes || {},
              variants: p.variants || [],
            }))
          );
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Find current product or default to first
  const product = useMemo(() => {
    return catalog.find((p) => p.slug === slug || p.sku === slug) || null;
  }, [slug, catalog]);

  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;
  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return variants.find((v) => v.sku === selectedVariantSku) || variants.find((v) => Number(v.stock) > 0) || variants[0];
  }, [variants, hasVariants, selectedVariantSku]);

  const cartLineId = selectedVariant
    ? `${product?.id || product?.sku}::${selectedVariant.sku}`
    : product?.id || product?.sku;

  const tracksStock = product?.manageStock !== false;
  const simpleOutOfStock =
    tracksStock && !hasVariants && Number(product?.stock) <= 0;
  const variantOutOfStock =
    tracksStock && hasVariants && selectedVariant && Number(selectedVariant.stock) <= 0;
  const cannotBuy =
    (hasVariants && !selectedVariant) || simpleOutOfStock || variantOutOfStock;

  const displayPrice = selectedVariant?.price != null && selectedVariant.price !== ""
    ? Number(selectedVariant.price)
    : Number(product?.price) || 0;

  // Check if item is already in cart
  const isInCart = useMemo(() => {
    if (!product) return false;
    return items.some((item) => String(item.id) === String(cartLineId));
  }, [items, product, cartLineId]);

  const wishlisted = useMemo(() => {
    if (!product) return false;
    const pid = String(product.id || product.sku || "");
    return wishlistItems.some((i) => String(i.id || i.sku) === pid);
  }, [wishlistItems, product]);

  // Reset active image / default variant on product change
  useEffect(() => {
    setActiveImage(product?.images?.[0] || "");
    const firstInStock =
      (product?.variants || []).find((v) => Number(v.stock) > 0) ||
      (product?.variants || [])[0];
    setSelectedVariantSku(firstInStock?.sku || "");
  }, [product]);

  useEffect(() => {
    if (!product) {
      setReviews([]);
      return;
    }
    let cancelled = false;
    const keys = [product.id, product.sku, product.name, product.slug].filter(Boolean);
    (async () => {
      for (const key of keys) {
        try {
          const rows = await api(`/reviews/product/${encodeURIComponent(key)}`);
          if (!cancelled && Array.isArray(rows) && rows.length) {
            setReviews(rows);
            return;
          }
          if (!cancelled) setReviews(Array.isArray(rows) ? rows : []);
        } catch {
          /* try next key */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  const recommendations = useMemo(() => {
    return catalog.filter((p) => p.id !== product?.id).slice(0, 6);
  }, [product, catalog]);

  const toggleAccordion = (tab) => {
    setActiveAccordion(activeAccordion === tab ? null : tab);
  };

  // Split: Settings gateway toggle + per-product allowSplit / splitValue
  const partialGw = useSettingsStore((s) => s.payments?.partialPayment);
  const splitGloballyOn = partialGw?.enabled !== false;
  const defaultAdvancePct = Number(partialGw?.advancePercent) > 0 ? Number(partialGw.advancePercent) : 50;
  const allowSplit = splitGloballyOn && !!product?.allowSplit;
  const advanceAmount = useMemo(() => {
    if (!allowSplit || !product) return 0;
    const price = Number(displayPrice) || Number(product.price) || 0;
    if (product.splitType === "amount") {
      return Math.min(price, Math.max(0, Math.round(Number(product.splitValue) || 0)));
    }
    const pct = Number(product.splitValue);
    const percent = Number.isFinite(pct) && pct > 0 ? pct : defaultAdvancePct;
    return Math.min(price, Math.round(price * (percent / 100)));
  }, [product, allowSplit, defaultAdvancePct, displayPrice]);

  const cartOptions = () => {
    const opts = {};
    if (allowSplit) {
      const pct =
        Number.isFinite(Number(product.splitValue)) && Number(product.splitValue) > 0
          ? Number(product.splitValue)
          : defaultAdvancePct;
      Object.assign(opts, {
        paymentType,
        advanceAmount:
          paymentType === "partial"
            ? product.splitType === "amount"
              ? Math.min(displayPrice, advanceAmount)
              : Math.round(displayPrice * (pct / 100))
            : undefined,
        allowSplit: true,
        splitType: product.splitType || "percent",
        splitValue: product.splitType === "amount" ? product.splitValue : pct,
      });
    }
    if (selectedVariant) {
      Object.assign(opts, {
        id: cartLineId,
        variantSku: selectedVariant.sku,
        variantLabel: selectedVariant.label,
        price: displayPrice,
        stock: selectedVariant.stock,
        manageStock: product.manageStock !== false,
      });
    } else {
      Object.assign(opts, {
        stock: product.stock,
        manageStock: product.manageStock !== false,
      });
    }
    return opts;
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (cannotBuy) return;
    if (isInCart) {
      openCart();
      return;
    }
    addItem({ ...product, price: displayPrice, id: cartLineId }, cartOptions());
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (cannotBuy) return;
    if (!isInCart) addItem({ ...product, price: displayPrice, id: cartLineId }, cartOptions());
    navigate("/checkout");
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist({
      ...product,
      id: product.id || product.sku,
      slug: product.slug || product.sku,
    });
  };

  if (!product) {
    return (
      <div className="container-luxe py-24 text-center">
        <SeoHead title="Product not found" noIndex />
        <p className="heading-display text-2xl text-noir">Product not found</p>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead
        title={product.name}
        description={product.description || `Shop ${product.name} at Madhu Jewellery.`}
        image={assetUrl(activeImage || product.images?.[0])}
        keywords={[product.name, product.category, product.tag, "Madhu jewellery"].filter(Boolean).join(", ")}
      />
      <div className="container-luxe py-12 md:py-20">
        {/* Main Product Layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Gallery Carousel Container */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Thumbnails list (Desktop left vertical list) */}
            <div className="order-2 md:order-1 md:col-span-2 flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-16 h-20 md:w-full md:h-24 bg-stone-100 border transition-all duration-300 rounded-sm overflow-hidden ${
                    activeImage === img ? "border-champagne" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image View */}
            <div className="order-1 md:order-2 md:col-span-10 aspect-[3/4] bg-stone-100 rounded-sm overflow-hidden relative group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 bg-noir text-champagne text-[10px] uppercase tracking-widest2 px-3 py-1.5 font-semibold">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {product.celeb && (
              <p className="text-xs uppercase tracking-widest2 text-champagne font-semibold mb-3">
                As Seen On {product.celeb}
              </p>
            )}
            <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl text-noir leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-xl md:text-2xl text-noir/80 font-medium mb-3">
              {formatPrice(displayPrice)}
            </p>
            {product.priceFromMarket && product.priceBreakdown && (
              <p className="text-[11px] text-noir/45 mb-3">
                Market-linked · {product.priceBreakdown.netWeight}g × ₹
                {product.priceBreakdown.ratePerGram}/g ({product.priceBreakdown.metalPurity})
                {product.priceBreakdown.making
                  ? ` + making ₹${product.priceBreakdown.making}`
                  : ""}
                {product.priceBreakdown.stoneCharge
                  ? ` + stone ₹${product.priceBreakdown.stoneCharge}`
                  : ""}
              </p>
            )}

            {/* Quick facts from attributes */}
            {(() => {
              const attrs = product.attributes || product.specifications || {};
              const quick = [
                attrs.metal_type && attrs.metal_purity
                  ? `${attrs.metal_purity} ${attrs.metal_type}`
                  : attrs.metal_type || attrs.metal_purity,
                attrs.gemstone_type,
                attrs.diamond_clarity && attrs.diamond_color
                  ? `${attrs.diamond_color} / ${attrs.diamond_clarity}`
                  : attrs.diamond_clarity || attrs.diamond_color,
                selectedVariant?.label
                  ? `${formatAttrLabel(product.variantAttribute || "ring_size")}: ${selectedVariant.label}`
                  : null,
              ].filter(Boolean);
              if (!quick.length) return null;
              return (
                <p className="text-xs text-noir/55 mb-6 leading-relaxed">
                  {quick.join(" · ")}
                </p>
              );
            })()}

            {hasVariants && (
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest2 text-noir/45 mb-2">
                  {product.variantAttribute === "necklace_length"
                    ? "Length"
                    : product.variantAttribute === "bracelet_size"
                    ? "Bracelet size"
                    : product.variantAttribute === "earring_size"
                    ? "Size"
                    : "Ring size"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const out = Number(v.stock) <= 0;
                    const active = selectedVariant?.sku === v.sku;
                    return (
                      <button
                        key={v.sku}
                        type="button"
                        disabled={out}
                        onClick={() => setSelectedVariantSku(v.sku)}
                        className={`min-w-[2.75rem] px-3 py-2 text-sm border transition-colors ${
                          active
                            ? "border-noir bg-noir text-champagne"
                            : out
                            ? "border-stone-200 text-noir/25 line-through cursor-not-allowed"
                            : "border-champagne/30 text-noir hover:border-champagne"
                        }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
                {selectedVariant && (
                  <p className="text-[11px] text-noir/45 mt-2">
                    {Number(selectedVariant.stock) > 0
                      ? `${selectedVariant.stock} in stock`
                      : "Out of stock"}
                    {selectedVariant.label ? ` · ${selectedVariant.label}` : ""}
                  </p>
                )}
              </div>
            )}

            {allowSplit && (
              <div className="bg-stone-50 border border-champagne/20 rounded-sm p-5 mb-6">
                <h3 className="text-sm font-semibold text-noir mb-3">Payment Option</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === "full"}
                      onChange={() => setPaymentType("full")}
                      className="accent-champagne-dark"
                    />
                    <span className="text-sm text-noir">Full Payment</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === "partial"}
                      onChange={() => setPaymentType("partial")}
                      className="accent-champagne-dark"
                    />
                    <span className="text-sm text-noir">
                      Partial / advance{" "}
                      <span className="text-champagne-dark font-semibold">{formatPrice(advanceAmount)}</span>
                      <span className="block text-[11px] text-noir/45 mt-0.5">
                        {product.splitType === "amount"
                          ? `Fixed advance set by boutique`
                          : `${
                              Number(product.splitValue) > 0
                                ? product.splitValue
                                : defaultAdvancePct
                            }% advance · balance before shipping`}
                      </span>
                    </span>
                  </label>
                </div>
                {paymentType === "partial" && (
                  <p className="text-xs text-maroon bg-maroon/5 border border-maroon/15 rounded-sm px-3 py-2 mt-3">
                    Advance payment required. Balance due to be paid before shipping.
                  </p>
                )}
              </div>
            )}

            <p className="text-xs md:text-sm text-noir/65 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Action Buttons — full e-commerce */}
            {!isHidden("actions") && (
            <div className="mb-10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isInCart && cannotBuy}
                  className="btn-outline w-full !min-h-[52px] !px-4 !py-4 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} className="shrink-0" strokeWidth={1.75} />
                  <span>
                    {!isInCart && (simpleOutOfStock || variantOutOfStock)
                      ? "Out of stock"
                      : isInCart
                      ? "View Cart"
                      : allowSplit && paymentType === "partial"
                      ? "Add Pre-Order"
                      : c.addToBag && !/inquiry/i.test(c.addToBag)
                      ? c.addToBag
                      : "Add to Cart"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={cannotBuy}
                  className="btn-gold w-full !min-h-[52px] !px-4 !py-4 inline-flex items-center justify-center gap-2 shadow-gold hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} className="shrink-0" strokeWidth={1.75} />
                  <span>
                    {simpleOutOfStock || variantOutOfStock
                      ? "Out of stock"
                      : c.buyNow && !/inquiry/i.test(c.buyNow)
                      ? c.buyNow
                      : "Buy Now"}
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleWishlist}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 text-xs uppercase tracking-widest2 border transition-colors ${
                  wishlisted
                    ? "border-maroon bg-maroon/5 text-maroon"
                    : "border-noir/20 text-noir hover:border-champagne hover:text-champagne-dark"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
              >
                <Heart size={16} className={wishlisted ? "fill-current" : ""} />
                {wishlisted
                  ? "Saved to Wishlist"
                  : c.wishlistLabel && !/inquiry/i.test(c.wishlistLabel)
                  ? c.wishlistLabel
                  : "Save to Wishlist"}
              </button>
              {isInCart && (
                <p className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => removeItem(cartLineId)}
                    className="text-[11px] uppercase tracking-widest2 text-noir/40 hover:text-rose-600"
                  >
                    Remove from cart
                  </button>
                  {" · "}
                  <Link to="/cart" className="text-[11px] uppercase tracking-widest2 text-champagne-dark">
                    Go to cart
                  </Link>
                </p>
              )}
              <p className="text-[10px] text-center text-noir/40 uppercase tracking-widest2 mt-3 font-semibold">
                Secure checkout · Worldwide delivery
              </p>
            </div>
            )}

            {/* Accordion Tabs */}
            {(!isHidden("info") || !isHidden("shipping")) && (
            <div className="border-t border-champagne/20">
              
              {/* Specs Tab */}
              {!isHidden("info") && (
              <div className="border-b border-champagne/20">
                <button
                  onClick={() => toggleAccordion("specs")}
                  className="w-full py-4 flex items-center justify-between text-left"
                >
                  <span className="text-xs uppercase tracking-widest2 font-semibold text-noir">
                    {c.specifications || "Specifications"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-champagne transition-transform duration-300 ${
                      activeAccordion === "specs" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "specs" && (
                  <div className="pb-5 space-y-2.5">
                    {orderedSpecEntries(product.specifications || product.attributes || {}).map(
                      ([key, val]) => (
                        <div key={key} className="flex justify-between gap-4 text-xs tracking-wide">
                          <span className="text-noir/50 shrink-0">{formatAttrLabel(key)}</span>
                          <span className="text-noir font-medium text-right">{val}</span>
                        </div>
                      )
                    )}
                    {product.category && (
                      <div className="flex justify-between gap-4 text-xs tracking-wide">
                        <span className="text-noir/50">Category</span>
                        <span className="text-noir font-medium">{product.category}</span>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex justify-between gap-4 text-xs tracking-wide">
                        <span className="text-noir/50">SKU</span>
                        <span className="text-noir font-medium font-mono">{product.sku}</span>
                      </div>
                    )}
                    {!Object.keys(product.specifications || product.attributes || {}).length &&
                      product.description && (
                        <p className="text-xs text-noir/65 leading-relaxed">{product.description}</p>
                      )}
                  </div>
                )}
              </div>
              )}

              {/* Brand Assurance + Shipping Tabs */}
              {!isHidden("shipping") && (
                <>
                  <div className="border-b border-champagne/20">
                    <button
                      onClick={() => toggleAccordion("trust")}
                      className="w-full py-4 flex items-center justify-between text-left"
                    >
                      <span className="text-xs uppercase tracking-widest2 font-semibold text-noir">
                        {c.returnsTitle || "Brand Trust & Assurance"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-champagne transition-transform duration-300 ${
                          activeAccordion === "trust" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeAccordion === "trust" && (
                      <div className="pb-5 space-y-4 text-xs text-noir/65 leading-relaxed">
                        {c.returnsBody && <p>{c.returnsBody}</p>}
                        <div className="flex gap-3">
                          <Award size={18} className="text-champagne-dark flex-shrink-0" />
                          <p>
                            <strong>100% Certified Diamonds:</strong> Sourced ethically and
                            individually evaluated by leading SGL/IGI gemstone laboratories.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <ShieldCheck size={18} className="text-champagne-dark flex-shrink-0" />
                          <p>
                            <strong>22KT BIS Hallmark:</strong> Crafted exclusively in gold
                            certified by Govt. approved hallmarking centers.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <RotateCcw size={18} className="text-champagne-dark flex-shrink-0" />
                          <p>
                            <strong>Lifetime Buyback:</strong> Insured exchange values at current
                            gold & diamond rates across all our showrooms.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-b border-champagne/20">
                    <button
                      onClick={() => toggleAccordion("shipping")}
                      className="w-full py-4 flex items-center justify-between text-left"
                    >
                      <span className="text-xs uppercase tracking-widest2 font-semibold text-noir">
                        {c.shippingTitle || "Insured Shipping & Delivery"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-champagne transition-transform duration-300 ${
                          activeAccordion === "shipping" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeAccordion === "shipping" && (
                      <div className="pb-5 text-xs text-noir/65 leading-relaxed space-y-3">
                        {c.shippingBody && <p className="pl-0">{c.shippingBody}</p>}
                        <div className="flex gap-3">
                          <Truck size={18} className="text-champagne-dark flex-shrink-0" />
                          <p>
                            <strong>Complimentary Insured Delivery:</strong> Sent via secure,
                            fully-insured logistics partners in tamper-proof security cases
                            directly to your hand.
                          </p>
                        </div>
                        <p className="pl-7">
                          <strong>India Shipping:</strong> 3-5 working days for Ready-to-Ship
                          items. 14-20 working days for Custom Orders.
                        </p>
                        <p className="pl-7">
                          <strong>Worldwide Shipping:</strong> Free shipping outside India on
                          orders above ₹200,000.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 pt-10 border-t border-champagne/15 max-w-3xl">
          <h2 className="heading-display text-2xl text-noir mb-6">Customer reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-noir/45 mb-8">No reviews yet. Be the first to share your experience.</p>
          ) : (
            <ul className="space-y-5 mb-10">
              {reviews.map((r) => (
                <li key={r.id} className="border-b border-champagne/10 pb-5">
                  <div className="flex items-center gap-3 mb-1">
                    <Stars rating={r.rating} />
                    <span className="text-sm font-medium text-noir">{r.title}</span>
                  </div>
                  <p className="text-xs text-noir/40 mb-2">
                    {r.customer}
                    {r.date ? ` · ${r.date}` : ""}
                  </p>
                  <p className="text-sm text-noir/70 leading-relaxed">{r.body}</p>
                </li>
              ))}
            </ul>
          )}
          {customerToken ? (
            <form
              className="space-y-3 border border-champagne/15 bg-stone-50/50 p-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setReviewMsg("");
                setReviewErr("");
                try {
                  const res = await api("/reviews/submit", {
                    method: "POST",
                    body: {
                      product: product.id || product.sku || product.name,
                      rating: Number(reviewForm.rating),
                      title: reviewForm.title,
                      body: reviewForm.body,
                    },
                    portal: "user",
                  });
                  setReviewMsg(res.message || "Thanks — pending approval.");
                  setReviewForm({ rating: 5, title: "", body: "" });
                } catch (err) {
                  setReviewErr(err.message || "Could not submit review");
                }
              }}
            >
              <h3 className="text-sm font-semibold text-noir">Write a review</h3>
              <div>
                <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1">Rating</label>
                <select
                  className="border border-champagne/25 bg-white px-3 py-2 text-sm"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </div>
              <input
                required
                placeholder="Title"
                className="w-full border border-champagne/25 bg-white px-3 py-2 text-sm"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              />
              <textarea
                required
                rows={3}
                placeholder="Your review"
                className="w-full border border-champagne/25 bg-white px-3 py-2 text-sm resize-y"
                value={reviewForm.body}
                onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
              />
              {reviewMsg && <p className="text-xs text-champagne-dark">{reviewMsg}</p>}
              {reviewErr && <p className="text-xs text-rose-600">{reviewErr}</p>}
              <button type="submit" className="btn-outline !py-2.5 !px-5 text-[11px]">
                Submit review
              </button>
            </form>
          ) : (
            <p className="text-sm text-noir/50">
              <Link to="/account" className="link-underline text-champagne-dark">
                Sign in
              </Link>{" "}
              to leave a review.
            </p>
          )}
        </div>

        {/* Complete the Look section */}
        {!isHidden("completeLook") && recommendations.length > 0 && (
        <div className="mt-24 pt-12 border-t border-champagne/15">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="heading-display text-2xl md:text-3xl text-noir">
              {c.completeLook || "Complete the Look"}
            </h2>
            <CarouselNav
              tone="light"
              onPrev={() => lookSwiperRef.current?.slidePrev()}
              onNext={() => lookSwiperRef.current?.slideNext()}
            />
          </div>
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => {
              lookSwiperRef.current = swiper;
            }}
            autoplay={carouselAutoplay}
            loop={recommendations.length > 4}
            spaceBetween={16}
            slidesPerView={1.35}
            watchOverflow
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="complete-look-swiper"
          >
            {recommendations.map((p) => (
              <SwiperSlide key={p.id} className="!h-auto">
                <ProductCard product={p} image={p.images?.[0]} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        )}

      </div>
      {customSections.map((s) => (
        <CmsCustomBlock key={s.id} data={s} />
      ))}
    </div>
  );
}