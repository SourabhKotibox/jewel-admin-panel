import useCartStore from "../store/useCartStore";
import { maxQtyFor } from "../store/useCartStore";
import { formatPrice, whatsappNumber } from "../data";
import { Link } from "react-router-dom";
import { Trash2, MessageCircle, ArrowRight, ShieldCheck, HelpCircle, Minus, Plus } from "lucide-react";
import useCmsPage from "../hooks/useCmsPage";
import CmsCustomBlock from "../components/CmsCustomBlock";
import SeoHead from "../components/SeoHead";
import { assetUrl } from "../api/client";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { fields: c, isHidden, customSections } = useCmsPage("cart");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const advancePayable = items.reduce((sum, item) => {
    if (item.paymentType === "partial") {
      const adv =
        item.advanceAmount != null && item.advanceAmount !== ""
          ? Number(item.advanceAmount)
          : Math.round(Number(item.price) * 0.5);
      return sum + Math.max(0, adv) * item.quantity;
    }
    return sum + item.price * item.quantity;
  }, 0);
  const balanceDue = subtotal - advancePayable;

  const compileWhatsAppMessage = () => {
    let msg = "Hello Madhu Jewellery! I am interested in inquiring about the following creations from my bag:\n\n";
    items.forEach((item, idx) => {
      const label = item.paymentType === "partial" ? " (Partial Payment)" : "";
      msg += `${idx + 1}. ${item.name} x${item.quantity}${label} (SKU: ${item.id}) - ${formatPrice(item.price * item.quantity)}\n`;
    });
    msg += `\nSubtotal: ${formatPrice(subtotal)}`;
    if (balanceDue > 0) {
      msg += `\nPayable Now (Advance): ${formatPrice(advancePayable)}\nBalance Due Before Shipping: ${formatPrice(balanceDue)}`;
    }
    msg += `\n\nPlease assist me with customization and order booking.`;
    return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(msg)}`;
  };

  if (items.length === 0) {
    return (
      <div className="bg-ivory min-h-screen">
        <SeoHead title="Cart" />
        {!isHidden("empty") && (
          <div className="container-luxe py-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
            <div className="w-16 h-16 border border-champagne/20 rounded-full flex items-center justify-center mb-6 bg-stone-50">
              <Trash2 size={24} className="text-champagne-dark/50" />
            </div>
            <h1 className="heading-display text-3xl md:text-4xl mb-4 text-noir">{c.emptyTitle}</h1>
            <p className="text-xs md:text-sm text-noir/50 max-w-sm mx-auto mb-8 leading-relaxed">
              {c.emptySubtitle}
            </p>
            <Link to="/shop" className="btn-gold">
              {c.emptyCta}
            </Link>
          </div>
        )}
        {customSections.map((s) => (
          <CmsCustomBlock key={s.id} data={s} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-12 md:py-20">
      <SeoHead title="Cart" />
      <div className="container-luxe">
        {!isHidden("header") && (
          <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl mb-12 text-noir">{c.title}</h1>
        )}

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items list */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 md:gap-6 bg-stone-50 border border-champagne/10 p-4 md:p-5 rounded-sm relative group"
              >
                {/* Item Thumbnail */}
                <div className="w-20 h-24 sm:w-24 sm:h-32 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={assetUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Item Info */}
                <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[9px] uppercase tracking-widest2 text-champagne font-semibold">{item.category}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-noir/40 hover:text-maroon transition-colors absolute top-4 right-4 md:static"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <Link to={`/products/${item.slug}`}>
                      <h3 className="heading-display text-base md:text-lg text-noir font-medium hover:text-champagne-dark transition-colors line-clamp-1 mt-1">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-[10px] text-noir/45 mt-1">SKU: {item.id}</p>
                    {item.paymentType === "partial" && (
                      <span className="inline-block mt-1.5 text-[9px] uppercase tracking-wide bg-champagne/15 text-champagne-dark px-2 py-1 rounded-sm font-semibold">
                        Partial Payment · Pre-Order
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-champagne/30 rounded-full hover:border-champagne transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-medium text-noir w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={
                          maxQtyFor(item) !== Infinity && item.quantity >= maxQtyFor(item)
                        }
                        className="w-8 h-8 flex items-center justify-center border border-champagne/30 rounded-full hover:border-champagne transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm md:text-base text-noir font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {maxQtyFor(item) !== Infinity && maxQtyFor(item) < 20 ? (
                        <p className="text-[10px] text-noir/40 mt-0.5">Only {maxQtyFor(item)} left</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-xs uppercase tracking-wider text-noir/40 hover:text-noir transition-colors font-semibold"
            >
              Clear Entire Bag
            </button>
          </div>

          {/* Checkout Summary Box */}
          {!isHidden("summary") && (
          <div className="lg:col-span-4 bg-stone-50 border border-champagne/15 p-6 md:p-8 rounded-sm sticky top-28">
            <h2 className="heading-display text-xl text-noir font-semibold border-b border-champagne/15 pb-4 mb-6">{c.summaryTitle}</h2>

            <div className="space-y-4 text-xs md:text-sm tracking-wide mb-6">
              <div className="flex justify-between text-noir/60">
                <span>Selected Items</span>
                <span className="font-semibold text-noir">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-noir/60">
                <span>Insured Shipping</span>
                <span className="text-champagne-dark font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-noir/60">
                <span>Tax / Duty Certification</span>
                <span className="text-champagne-dark font-semibold">Included</span>
              </div>

              {balanceDue > 0 && (
                <>
                  <div className="flex justify-between text-noir/60 border-t border-champagne/10 pt-4">
                    <span>Payable Now (Advance)</span>
                    <span className="text-champagne-dark font-semibold">{formatPrice(advancePayable)}</span>
                  </div>
                  <div className="flex justify-between text-noir/60">
                    <span>Balance Due Before Shipping</span>
                    <span className="text-noir/70">{formatPrice(balanceDue)}</span>
                  </div>
                </>
              )}

              <div className="border-t border-champagne/10 pt-4 flex justify-between text-noir font-semibold text-base">
                <span>{balanceDue > 0 ? "Total Payable Now" : "Total Value"}</span>
                <span>{formatPrice(balanceDue > 0 ? advancePayable : subtotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Link
                to="/checkout"
                className="btn-gold w-full py-4 flex items-center justify-center gap-2"
              >
                {c.checkoutCta || "Proceed to Checkout"} <ArrowRight size={16} />
              </Link>

              <a
                href={compileWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-noir/20 text-noir hover:border-champagne hover:text-champagne-dark py-4 text-xs uppercase tracking-widest2 font-semibold transition-all duration-300"
              >
                <MessageCircle size={16} /> Inquire on WhatsApp Instead
              </a>

              <Link
                to="/shop"
                className="w-full flex items-center justify-center gap-2 text-noir/50 hover:text-noir py-2 text-xs uppercase tracking-widest2 transition-colors"
              >
                Continue Browsing
              </Link>
            </div>

            {/* Summary Trust Badges */}
            <div className="mt-8 pt-6 border-t border-champagne/10 space-y-4">
              <div className="flex gap-3 text-xs text-noir/50 leading-relaxed">
                <ShieldCheck size={18} className="text-champagne-dark flex-shrink-0 mt-0.5" />
                <p>Prices are estimates based on active gold rates. Final quote verified on chat.</p>
              </div>
              <div className="flex gap-3 text-xs text-noir/50 leading-relaxed">
                <HelpCircle size={18} className="text-champagne-dark flex-shrink-0 mt-0.5" />
                <p>Have questions? Chat directly with our jewellery curation experts.</p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      {customSections.map((s) => (
        <CmsCustomBlock key={s.id} data={s} />
      ))}
    </div>
  );
}