import { create } from "zustand";
import { persist } from "zustand/middleware";

function maxQtyFor(item) {
  if (!item || item.manageStock === false) return Infinity;
  const stock = Number(item.stock);
  if (!Number.isFinite(stock) || stock < 0) return Infinity;
  return Math.max(0, Math.floor(stock));
}

const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, options = {}) =>
        set((state) => {
          const lineId = options.id || product.id;
          const merged = { ...product, ...options, id: lineId };
          const max = maxQtyFor(merged);
          const existing = state.items.find((i) => String(i.id) === String(lineId));
          if (existing) {
            const nextQty = Math.min(existing.quantity + 1, max === Infinity ? existing.quantity + 1 : max);
            return {
              items: state.items.map((i) =>
                String(i.id) === String(lineId)
                  ? { ...i, ...merged, quantity: nextQty, id: lineId }
                  : i
              ),
              isOpen: true,
            };
          }
          if (max === 0) return state;
          return {
            items: [
              ...state.items,
              { ...merged, quantity: 1, id: lineId },
            ],
            isOpen: true,
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => {
                  if (i.id !== id) return i;
                  const max = maxQtyFor(i);
                  const q = max === Infinity ? quantity : Math.min(quantity, max);
                  return { ...i, quantity: q };
                }),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "madhu-cart" }
  )
);

export default useCartStore;
export { maxQtyFor };
