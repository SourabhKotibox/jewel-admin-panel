import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useCartStore, { maxQtyFor } from "../../store/useCartStore";
import { formatPrice, whatsappNumber } from "../../data";
import { assetUrl } from "../../api/client";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const compileWhatsAppMessage = () => {
    let msg = "Hello Madhu Jewellery! I am interested in inquiring about:\n\n";
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    msg += `\nSubtotal: ${formatPrice(subtotal)}\n\nPlease assist with pricing and booking.`;
    return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(msg)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-noir/50 z-[70]"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-ivory z-[80] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-champagne/15">
              <h2 className="heading-display text-xl text-noir">Your Bag ({items.length})</h2>
              <button onClick={closeCart} aria-label="Close cart">
                <X size={22} className="text-noir" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-noir/60 mb-6">Your bag is empty.</p>
                  <Link to="/shop" onClick={closeCart} className="btn-gold">
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-5 border-b border-champagne/10">
                      <div className="w-20 h-24 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={assetUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-medium text-noir line-clamp-2">{item.name}</h3>
                          <button onClick={() => removeItem(item.id)} aria-label="Remove item">
                            <Trash2 size={15} className="text-noir/40 hover:text-maroon transition-colors flex-shrink-0" />
                          </button>
                        </div>
                        <p className="text-sm text-noir/70 mt-1">{formatPrice(item.price)}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-3">
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
                            disabled={maxQtyFor(item) !== Infinity && item.quantity >= maxQtyFor(item)}
                            className="w-8 h-8 flex items-center justify-center border border-champagne/30 rounded-full hover:border-champagne transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer — subtotal + actions */}
            {items.length > 0 && (
              <div className="border-t border-champagne/15 px-6 py-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-noir/60">Subtotal</span>
                  <span className="text-lg font-semibold text-noir">{formatPrice(subtotal)}</span>
                </div>
                <div className="space-y-3">
                  <a
                   href={compileWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold w-full py-3.5 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={17} /> Inquire on WhatsApp
                  </a>
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center border border-noir/20 text-noir py-3.5 text-xs uppercase tracking-widest2 hover:border-champagne hover:text-champagne-dark transition-colors"
                  >
                    View Full Bag
                  </Link>
                
<Link
  to="/checkout"
  onClick={closeCart}
  className="btn-gold w-full py-3.5 flex items-center justify-center gap-2"
>
  Proceed to Checkout
</Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}